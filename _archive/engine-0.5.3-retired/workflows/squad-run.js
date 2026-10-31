export const meta = {
  name: 'squad-run',
  description: 'Turn a brief into finished route packets with one fresh-context worker per route, gate and judge them with the independent pairwise verifier, and render the options board',
  whenToUse: 'A brief has been through brief-intake (a <slug>.brief.json and <slug>.routes.json exist) and the human wants every route developed and ranked before picking. Expensive: about 250K tokens per route worker plus the judge.',
  phases: [
    { title: 'Workers', detail: 'one copy worker per route, fresh context, writes a route packet' },
    { title: 'Gates', detail: 'verify_packets.js: schema, lint verdicts, fingerprints, signals, pairs' },
    { title: 'Judge', detail: 'fresh-context pairwise judge, mirrored pairs, judge brief only' },
    { title: 'Rank', detail: 'pairwise_rank.js and render_board.js' },
  ],
}

/* args (all paths absolute on the machine the agents run on):
   { slug, engine, pack, brief, routes_file, outputs, routes: [{id, axis, angle}], surfaces: any of 'email', 'paid', 'web', 'social' (default ['email']),
     timestamp: '2026-09-07T21:00:00Z', sequential: false, judge_batch: 6, board_title }
   Workers develop one route each under brief.selected_route so the angle gate runs inside the route's frame; nobody is
   present, so the recommendation develops and the packet is labelled provisional. Cost is measured only when sequential:
   the workflow budget counts output tokens for the whole run, so parallel workers cannot be told apart. */
const A = args || {}
if (!A.slug || !A.engine || !A.pack || !A.brief || !A.outputs || !Array.isArray(A.routes) || !A.routes.length) {
  throw new Error('squad-run needs args {slug, engine, pack, brief, outputs, routes:[{id, axis, angle}], surfaces?, timestamp}')
}
const SURFACES = A.surfaces && A.surfaces.length ? A.surfaces : ['email']
const SKILL_FOR = { email: 'email-copy', paid: 'paid-ad-copy', web: 'web-copy', social: 'social-copy' }
const unknownSurfaces = SURFACES.filter(x => !SKILL_FOR[x])
if (unknownSurfaces.length) throw new Error('squad-run: no copy skill for surface(s) ' + unknownSurfaces.join(', ') + '; surfaces are ' + Object.keys(SKILL_FOR).join(', '))
const TS = A.timestamp || 'unknown'
/* The completion contract type per surface (skills/options-board/references/completion-contract.json). */
const COMPLETION_TYPE = { email: 'email', paid: 'paid_static', web: 'web', social: 'social' }
const completionFor = SURFACES.length === 1
  ? `brief_type ${COMPLETION_TYPE[SURFACES[0]]}`
  : `brief_type ${COMPLETION_TYPE[SURFACES[0]]} (the first surface's contract; add the items of ${SURFACES.slice(1).map(x => COMPLETION_TYPE[x]).join(' and ')} from ${A.engine}/skills/options-board/references/completion-contract.json to the same list)`
const routeDir = r => `${A.outputs}/${A.slug}-squad/${r.id}`

const WORKER_SCHEMA = {
  type: 'object', required: ['route_id', 'packet_path', 'verdicts', 'notes'],
  properties: {
    route_id: { type: 'string' }, packet_path: { type: 'string' },
    verdicts: { type: 'object', additionalProperties: true },
    files: { type: 'array', items: { type: 'string' } },
    notes: { type: 'array', items: { type: 'string' } },
  },
}
const GATES_SCHEMA = {
  type: 'object', required: ['signals_path', 'pairs_path', 'batch_paths', 'rankable', 'not_rankable', 'verdict', 'brief_path', 'preference'],
  properties: {
    signals_path: { type: 'string' }, pairs_path: { type: 'string' }, brief_path: { type: 'string' }, preference: { type: 'string' },
    batch_paths: { type: 'array', items: { type: 'string' } },
    rankable: { type: 'array', items: { type: 'string' } },
    not_rankable: { type: 'array', items: { type: 'object', additionalProperties: true } },
    verdict: { type: 'string' }, pairs: { type: 'integer' },
  },
}
const JUDGE_SCHEMA = {
  type: 'object', required: ['judgments'],
  properties: { judgments: { type: 'array', items: { type: 'object', required: ['pair_id', 'winner', 'reason'],
    properties: { pair_id: { type: 'string' }, winner: { type: 'string', enum: ['A', 'B', 'tie'] },
      dimensions: { type: 'object', additionalProperties: true }, reason: { type: 'string' } } } } },
}
const RANK_SCHEMA = {
  type: 'object', required: ['ranked', 'board_path', 'verified_dir', 'warns'],
  properties: { ranked: { type: 'array', items: { type: 'object', additionalProperties: true } }, board_path: { type: 'string' },
    verified_dir: { type: 'string' }, warns: { type: 'array', items: { type: 'string' } }, calibration: { type: 'object', additionalProperties: true } },
}

const workerPrompt = r => `You are one route worker in a creative squad. You develop exactly one route of one brief into finished copy and return a route packet. You have not seen the other routes and must not look for them.

Engine (studio-engine 0.5.1): ${A.engine}. Read ${SURFACES.map(x => SKILL_FOR[x]).filter(Boolean).map(k => A.engine + '/skills/' + k + '/SKILL.md').join(' and ')} and follow them exactly: resolve products with node ${A.engine}/skills/email-copy/scripts/sku_lookup.js --pack ${A.pack} --match "<name>" (the one product lookup for every surface), favorites first with the skill's own exemplar_pick.js (record the SHOWN ids), compose whole, map, cut, node ${A.engine}/scripts/fit_check.js, the skill's lint, node ${A.engine}/scripts/voice_lint.js. Pack: ${A.pack}. Brief: ${A.brief}${A.routes_file ? ` (route plan: ${A.routes_file})` : ''}.

Your route: ${r.id}, axis ${r.axis}: "${r.angle}". Set brief.selected_route to {id: "${r.id}", axis: "${r.axis}", selected_by: "human"} so the angle gate runs INSIDE this route's frame (options differ on scene); nobody is present, so develop the recommended angle and set angle_gate {picked_by: "recommended", provisional: true}. Surfaces to produce: ${SURFACES.join(', ')} (email: the launch send as type sale_launch or the type the brief names; paid: one concept set on this route with three executions; web: the page the brief names; social: one post per route, the first post the brief's social channel names, in its format, as one social-copy file, with any other posts the brief names listed in notes as not developed).

Write everything under ${routeDir(r)}/ (create it): the copy JSON (slates, paid, page or social), the fit_check, lint and voice-lint reports, the one-pager for email, the findings file. Run every script from the engine with --pack ${A.pack}; never edit the pack. Iterate on lint errors up to three passes; never ship a FAIL; INSUFFICIENT-INPUT items are recorded, not dodged.

Then write ${routeDir(r)}/${A.slug}.${r.id}.packet.json conforming to ${A.engine}/skills/options-board/references/packet-schema.json: kind route-packet, format 1, route_id "${r.id}", frame "${r.axis}", angle as given, brief_ref "${A.brief}", brand from the pack, worker {skill: "squad-run worker", model: null, run_id: null, started_at: "${TS}", finished_at: null}, one channel_deliverables entry per surface with copy.path, lint {path, verdict}, fit_check {path, verdict}, voice_lint {path, verdict, model_version, model_weak, mean_likelihood}, renders as one placeholder entry per required render with path null and placeholder true (no renderer exists yet; social: one per panel or frame at each ratio, each with its 1-based item), image_plan null, image_files []; passed_over listing every gate option you did not recommend with a reason from occasion, weaker, off-brief, duplicate, blocked; provenance {brand, brand_context, generated_at: "${TS}", voice, guardrails, cost: {model: null, input_tokens: null, output_tokens: null, media_calls: 0, measured_by: "not measured"}}; verifier null; completion for ${completionFor} with every item, done true only for items the files on disk prove, complete false, verdict INSUFFICIENT-INPUT. Use absolute paths inside the packet.

Return only: route_id, packet_path, verdicts (per surface: lint, fit_check, voice mean), files written, and notes (what needed a human, what you could not do). No copy in the return; it is in the files.`

const gatesPrompt = (packetPaths) => `Run the deterministic half of the verifier and nothing else. Engine: ${A.engine}. Pack: ${A.pack}.

Run: node ${A.engine}/skills/verify/scripts/verify_packets.js --packets ${packetPaths.join(',')} --pack ${A.pack} --out ${A.outputs}/${A.slug}-squad/verify-signals.json --pairs ${A.outputs}/${A.slug}-squad/pairs.json --mirror --seed 7

Then run: node ${A.engine}/skills/verify/scripts/judge_brief.js --pack ${A.pack} --out ${A.outputs}/${A.slug}-squad/judge-brief.md (exit 1 is expected when the pack names no judge_rubric: the brief is still written and tells the judge so). Return its brief_path and its preference.status as preference.

Then split the pairs file into batches of at most ${A.judge_batch || 6} pairs each, written as ${A.outputs}/${A.slug}-squad/pairs-batch-N.json with the same {dimensions, note, pairs} shape (each batch carries the full note and dimensions). Do not read the packets' copy yourself beyond what the script prints. Return signals_path, pairs_path, batch_paths, brief_path, preference, rankable route ids, not_rankable [{route_id, reasons}], the script's verdict and the pair count.`

const judgePrompt = (batchPath, i, briefPath) => `You are an independent copy judge (batch ${i + 1}). Read exactly two files and nothing else: ${briefPath} (your whole brief: the method, then the brand's own measured preference, whose by-role guidance wins where it conflicts with its general rule) and ${batchPath} (route pairs: A and B are copy exhibits for two routes on the same brief, grouped by surface and role). Do not open any other file, do not search for sources, do not run code.

For every pair answer the three dimensions (brief_adherence, voice_fit, distinctiveness) and winner with A, B or tie, and one sentence of reason. Judge every pair in the file exactly once. Return the judgments as structured output.`

const rankPrompt = (signalsPath, judgmentsPath, packetPaths) => `Finish the verifier and render the board. Engine: ${A.engine}. Pack: ${A.pack}.

1. node ${A.engine}/skills/verify/scripts/pairwise_rank.js --signals ${signalsPath} --judgments ${judgmentsPath} --out-dir ${A.outputs}/${A.slug}-squad/verified --judge "squad-run judge, fresh-context agents, rubric 0.5.1, mirrored pairs" --independent true --pack ${A.pack}
2. Write a board manifest ${A.outputs}/${A.slug}-squad/board.json: {title: "${A.board_title || A.slug + ' squad board'}", brief_ref: "${A.brief}", packets: [the verified packet paths in ${A.outputs}/${A.slug}-squad/verified/]} and run node ${A.engine}/skills/options-board/scripts/render_board.js with its documented flags (read ${A.engine}/skills/options-board/SKILL.md for the exact command) to ${A.outputs}/${A.slug}-squad/board.html.
3. Return ranked (route_id, rank, copeland, bradley_terry, one most-frequent reason from the judgments for that route), board_path, verified_dir, the scripts' warns, and the calibration block from any verified packet.`

// ---------------------------------------------------------------- Workers
phase('Workers')
log(`squad-run ${A.slug}: ${A.routes.length} route(s), surfaces ${SURFACES.join('+')}, ${A.sequential ? 'sequential (cost measured per route)' : 'parallel (cost measured for the run)'}`)
const spent0 = budget.spent()
const workers = []
if (A.sequential) {
  for (const r of A.routes) {
    const before = budget.spent()
    const w = await agent(workerPrompt(r), { label: `worker:${r.id}`, phase: 'Workers', schema: WORKER_SCHEMA })
    if (w) w.output_tokens = budget.spent() - before
    workers.push(w)
    log(`${r.id}: ${w ? 'packet written' : 'worker failed'}${w ? `, ~${Math.round((budget.spent() - before) / 1000)}k output tokens` : ''}`)
  }
} else {
  const ws = await parallel(A.routes.map(r => () => agent(workerPrompt(r), { label: `worker:${r.id}`, phase: 'Workers', schema: WORKER_SCHEMA })))
  workers.push(...ws)
}
const good = workers.filter(Boolean)
const workerTokens = budget.spent() - spent0
log(`${good.length}/${A.routes.length} packets; workers spent ~${Math.round(workerTokens / 1000)}k output tokens${A.sequential ? '' : ' in total (parallel, not attributable per route)'}`)
if (good.length < 1) return { error: 'no worker returned a packet', workers }

// ---------------------------------------------------------------- Gates
phase('Gates')
const gates = await agent(gatesPrompt(good.map(w => w.packet_path)), { label: 'gates', phase: 'Gates', schema: GATES_SCHEMA, effort: 'low' })
if (!gates) return { error: 'gates agent failed', workers: good }
log(`judge brief: ${gates.brief_path} (brand preference: ${gates.preference})`)
log(`gates: ${gates.verdict}; rankable ${gates.rankable.join(', ') || 'none'}; not rankable ${gates.not_rankable.map(x => x.route_id).join(', ') || 'none'}; ${gates.pairs} pairs in ${gates.batch_paths.length} batch(es)`)
if (gates.rankable.length < 2) {
  return { workers: good, gates, note: 'fewer than two rankable routes: nothing to compare, board is unranked', board: null }
}

// ---------------------------------------------------------------- Judge (fresh contexts, judge brief only)
phase('Judge')
const judged = await pipeline(gates.batch_paths, (b, _item, i) => agent(judgePrompt(b, i, gates.brief_path), { label: `judge:${i + 1}`, phase: 'Judge', schema: JUDGE_SCHEMA }))
const judgments = judged.filter(Boolean).flatMap(j => j.judgments)
log(`judge: ${judgments.length} judgments from ${judged.filter(Boolean).length}/${gates.batch_paths.length} batches`)
if (!judgments.length) return { workers: good, gates, error: 'no judgments returned' }

// ---------------------------------------------------------------- Rank and board
phase('Rank')
const writer = await agent(`Write this JSON array verbatim to ${A.outputs}/${A.slug}-squad/judgments.json and return the path only:\n${JSON.stringify(judgments)}`, { label: 'write-judgments', phase: 'Rank', effort: 'low' })
const rank = await agent(rankPrompt(`${A.outputs}/${A.slug}-squad/verify-signals.json`, `${A.outputs}/${A.slug}-squad/judgments.json`, good.map(w => w.packet_path)), { label: 'rank+board', phase: 'Rank', schema: RANK_SCHEMA, effort: 'low' })
const total = budget.spent() - spent0
log(`done: ${rank ? rank.ranked.length + ' routes ranked' : 'rank failed'}; run spent ~${Math.round(total / 1000)}k output tokens`)
return { slug: A.slug, timestamp: TS, workers: good, gates: { verdict: gates.verdict, rankable: gates.rankable, not_rankable: gates.not_rankable, pairs: gates.pairs, judge_brief: gates.brief_path, brand_preference: gates.preference }, judgments: judgments.length, rank, cost: { output_tokens_run: total, output_tokens_workers: workerTokens, per_route: A.sequential ? good.map(w => ({ route_id: w.route_id, output_tokens: w.output_tokens })) : 'not attributable (parallel)', measured_by: 'workflow budget.spent(), output tokens only' } }
