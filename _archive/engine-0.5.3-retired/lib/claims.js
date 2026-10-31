'use strict';
/* claims.js: the one place the claims ledger is compiled and matched.

   Shared by copy_lint.js (email), paid_lint.js (paid) and page_lint.js (web). Three copies of this
   logic used to live in three scripts and drift was the only possible outcome; now a rule fires the
   same way on every surface, which is the point of one ledger.

   WHAT A LEDGER ENTRY MAY CARRY (any one of the first three is enough to compile):
     pattern    a regex string, case-insensitive. Unchanged from the original format.
     triggers   an array of strings. LITERAL substrings by default (the original format: a
                non-engineer maintains them, and "10% off" must mean those characters). When the
                entry, or the ledger root, sets `trigger_format: "regex"`, each trigger is instead a
                case-insensitive regex string, so "money[- ]?back" catches all three spellings.
     lemmas     an array of word stems. Each is matched as a whole word with simple inflection
                handling: plural (-s, -es, -ies), -ing and -ed, including a dropped final e
                ("cleanse" catches cleanses, cleansed, cleansing) and a doubled final consonant
                ("slim" catches slimming, slimmed). Multi-word lemmas inflect each word
                ("lose weight" catches losing weight). Irregular forms ("lost weight") are not
                inferred; write them as a regex trigger.
     paraphrase_risk   true when counsel expects the topic to be reached by wording no pattern
                lists. The lint then reports the entry under `paraphrase_review` in every run,
                matched or not, so a later verifier knows to read the copy against the topic.
                The lint itself never judges meaning and never says it did.

   Everything else on an entry passes through untouched (id, topic, severity or status,
   required_language, requires or ruling, note, posture via the ledger's topics table).

   MATCHING IS DETERMINISTIC AND ONLY EVER LEXICAL. A paraphrase that shares no listed stem still
   buys a lexical pass. That is a known limit, it is why `paraphrase_risk` exists, and no report
   from this module claims otherwise. */

const RX_META = /[.*+?^${}()|[\]\\]/g;
const esc = s => String(s).replace(RX_META, '\\$&');

const STATUS_MAP = { needs_legal: 'prohibited', prohibited: 'prohibited',
                     needs_edit: 'conditional', conditional: 'conditional',
                     info: 'approved', approved: 'approved' };

/* Inflect one word stem into a regex alternation (no anchors). */
function inflectWord(stem) {
  const w = String(stem || '').toLowerCase().trim();
  if (!w) return null;
  const forms = new Set([w, w + 's']);
  if (w.endsWith('e')) { const b = w.slice(0, -1); forms.add(b + 'ing'); forms.add(w + 'd'); }
  else if (/[^aeiou]y$/.test(w)) { const b = w.slice(0, -1); forms.add(b + 'ies'); forms.add(b + 'ied'); forms.add(w + 'ing'); }
  else {
    forms.add(w + 'es'); forms.add(w + 'ed'); forms.add(w + 'ing');
    if (/[^aeiouy][aeiou][^aeiouwxy]$/.test(w)) { const c = w[w.length - 1]; forms.add(w + c + 'ing'); forms.add(w + c + 'ed'); }
  }
  return '(?:' + [...forms].sort((a, b) => b.length - a.length).map(esc).join('|') + ')';
}
/* A lemma may be several words; each inflects and any whitespace or hyphen joins them. */
function inflect(lemma) {
  const words = String(lemma || '').trim().split(/[\s-]+/).filter(Boolean);
  if (!words.length) return null;
  return '\\b' + words.map(inflectWord).join('[\\s-]+') + '\\b';
}

function statusOf(ledger) {
  return ledger._status
    || (/test|seed|draft/i.test(String(ledger.version || '')) ? 'test-seed' : 'unverified');
}

/* Compile one entry into { re, sources } or null when it carries nothing to match. Throws with a
   message naming the entry when something will not compile; callers turn that into die(). */
function compileEntry(e, ledgerFormat) {
  const parts = [], sources = [];
  const format = e.trigger_format || ledgerFormat || 'literal';
  if (e.pattern) {
    try { new RegExp(e.pattern, 'i'); } catch (err) { throw new Error('ledger entry ' + e.id + ' pattern does not compile: ' + err.message); }
    parts.push('(?:' + e.pattern + ')'); sources.push('pattern');
  }
  if (Array.isArray(e.triggers) && e.triggers.length) {
    if (format === 'regex') {
      for (const t of e.triggers) {
        try { new RegExp(t, 'i'); } catch (err) { throw new Error('ledger entry ' + e.id + ' regex trigger "' + t + '" does not compile: ' + err.message); }
        parts.push('(?:' + t + ')');
      }
      sources.push('regex triggers');
    } else if (format === 'literal') {
      parts.push('(?:' + e.triggers.map(esc).join('|') + ')'); sources.push('literal triggers');
    } else {
      throw new Error('ledger entry ' + e.id + ' has trigger_format "' + format + '"; use "literal" or "regex"');
    }
  }
  if (Array.isArray(e.lemmas) && e.lemmas.length) {
    const lem = e.lemmas.map(inflect).filter(Boolean);
    if (lem.length) { parts.push('(?:' + lem.join('|') + ')'); sources.push('lemmas'); }
  }
  if (!parts.length) return null;
  let re;
  try { re = new RegExp('(' + parts.join('|') + ')', 'i'); }
  catch (err) { throw new Error('ledger entry ' + e.id + ' does not compile as one expression: ' + err.message); }
  return { re, sources };
}

/* The whole ledger. Returns { status, rules, formats, paraphraseEntries }. */
function compileLedger(ledger) {
  const status = statusOf(ledger);
  const topics = ledger.topics || {};
  const ledgerFormat = ledger.trigger_format || 'literal';
  const formats = { pattern: 0, 'literal triggers': 0, 'regex triggers': 0, lemmas: 0 };
  const rules = [];
  for (const e of (ledger.entries || [])) {
    const c = compileEntry(e, ledgerFormat);
    if (!c) continue;
    c.sources.forEach(s => { formats[s] = (formats[s] || 0) + 1; });
    const sev = e.severity || e.status;
    rules.push({ ...e, re: c.re, sources: c.sources, severity: sev,
                 status: STATUS_MAP[sev] || 'conditional',
                 requires: e.requires || e.ruling || null,
                 posture: (topics[e.topic] || {}).posture,
                 paraphrase_risk: e.paraphrase_risk === true });
  }
  return { status, rules, formats,
           paraphraseEntries: rules.filter(r => r.paraphrase_risk).map(r => ({ id: r.id, topic: r.topic })) };
}

function matchRule(rule, text) {
  const m = String(text || '').match(rule.re);
  return m ? m[0] : null;
}

/* true: the required language is present; false: named and absent; null: nothing machine-checkable. */
function requiredLanguageSatisfied(rule, text) {
  const needs = rule.required_language ? String(rule.required_language).replace(/\{\{[^}]*\}\}/g, '').trim() : '';
  const tokens = needs.split(/\s+/).filter(w => w.length > 3).slice(0, 3);
  if (!tokens.length) return null;
  return tokens.every(w => new RegExp(esc(w), 'i').test(String(text || '')));
}

/* A hit tracker the lints feed so the paraphrase report can say how often each flagged entry fired. */
function makeHitCounter() {
  const hits = {};
  return { note: id => { hits[id] = (hits[id] || 0) + 1; }, hits };
}

/* The report block. Emitted whether or not anything matched, because a paraphrase that evades every
   pattern is exactly the case the flag is for. */
function paraphraseReview(compiled, hits) {
  return (compiled ? compiled.paraphraseEntries : []).map(p => ({
    id: p.id, topic: p.topic, paraphrase_review: true,
    lexical_hits: (hits && hits[p.id]) || 0,
    note: 'the ledger marks this topic paraphrase_risk. This lint matched listed wording only and did '
        + 'not judge meaning; a verifier must read the copy against the topic before it is cleared.',
  }));
}

const PARAPHRASE_TAG = ' [paraphrase_review]';

module.exports = { inflect, inflectWord, statusOf, compileEntry, compileLedger, matchRule,
                   requiredLanguageSatisfied, makeHitCounter, paraphraseReview, PARAPHRASE_TAG, esc };
