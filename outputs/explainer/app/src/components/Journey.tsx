import { useState } from "react"
import { content, data, fill } from "@/lib/content"
import { CardChip, ExampleVerdict, FactChip, Predict, SectionHead, Tech, Verdict } from "@/components/bits"
import { previewSrc, previewSize } from "@/data/preview"
import { cn } from "@/lib/utils"

const demo = data.demo
const labels = { predict: content.journey.predict_label, reveal: content.journey.reveal_label }

function lintVerdict(key: string) {
  return demo.lints?.[key]?.verdict ?? "n/a"
}

function Strip({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  const stages = content.stages as any[]
  const main = stages.map((s, i) => ({ s, i })).filter((x) => !x.s.branch)
  const squadIdx = stages.findIndex((s) => s.branch)
  return (
    <div>
      <div>
        <ol className="relative grid grid-cols-4 gap-y-5 md:grid-cols-8 md:gap-y-0" aria-label="Stages">
          <span className="absolute left-[6.25%] right-[6.25%] top-[21px] hidden h-px bg-rule md:block" aria-hidden="true" />
          {main.map(({ s, i }) => (
            <li key={s.id} className="relative flex justify-center">
              <button
                type="button"
                onClick={() => onPick(i)}
                aria-current={active === i ? "step" : undefined}
                className="group grid justify-items-center gap-2 px-1 pb-1 text-center"
              >
                <span
                  className={cn(
                    "relative grid h-[42px] w-[42px] place-items-center border text-[14px] tabnums transition-colors",
                    active === i ? "border-fg bg-fg text-bg" : "border-fg bg-bg group-hover:bg-surface"
                  )}
                >
                  {s.n}
                </span>
                <span className={cn("text-[13px] leading-tight", active === i ? "font-semibold" : "text-ink-muted")}>{s.name}</span>
              </button>
            </li>
          ))}
        </ol>
        {squadIdx >= 0 && (
          <div className="relative mt-4 grid grid-cols-8">
            <div className="col-span-8 flex justify-center md:col-span-3 md:col-start-3">
              <button
                type="button"
                onClick={() => onPick(squadIdx)}
                aria-current={active === squadIdx ? "step" : undefined}
                className={cn(
                  "flex w-full items-center justify-center gap-3 border border-dashed px-3 py-2 text-[13px]",
                  active === squadIdx ? "border-fg bg-fg text-bg" : "border-ink-muted text-ink-muted hover:border-fg hover:text-fg"
                )}
              >
                <span className="eyebrow">Optional</span>
                <span>Squad: every route at once, judged in pairs, laid out on a board</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Evidence({ kind, stage }: { kind: string; stage: any }) {
  if (kind === "brief") {
    return (
      <div className="grid gap-3">
        <p className="eyebrow text-ink-muted">The rehearsal brief</p>
        <h4 className="display text-[22px] leading-snug">{briefTitle(demo.brief.title)}</h4>
        <dl className="grid gap-2 text-[14px]">
          {demo.brief.sections.map((sec: any) => (
            <div key={sec.heading} className="grid grid-cols-[110px_minmax(0,1fr)] gap-3 border-t border-line pt-2 sm:grid-cols-[150px_minmax(0,1fr)]">
              <dt className="eyebrow pt-[3px] text-ink-muted">{sec.heading}</dt>
              <dd className="min-w-0 clamp-3">{briefLine(sec.text)}</dd>
            </div>
          ))}
        </dl>
      </div>
    )
  }
  if (kind === "intake") {
    const first = demo.intake_first_run
    return (
      <div className="grid gap-4">
        <p className="eyebrow text-ink-muted">What intake returned</p>
        <div className="flex flex-wrap items-center gap-2 text-[14px]">
          {first && (<><span className="text-ink-muted">First run</span><Verdict v={first.verdict} small /></>)}
          <span className="text-ink-muted">Re-run</span><Verdict v={demo.intake.verdict ?? "n/a"} small />
        </div>
        {first && (
          <p className="text-[14px] text-ink-muted">
            {stage.first_run.text} <FactChip fact={stage.first_run.fact} />
          </p>
        )}
        <Tech>{first && <p className="mono break-words text-ink-muted">{first.error}</p>}</Tech>
        <div className="grid gap-3">
          {Object.entries(demo.intake.gaps).map(([owner, items]: any) => (
            <div key={owner} className="border-t border-line pt-2">
              <p className="eyebrow">Gaps for {owner === "you" ? "the requester" : owner}</p>
              <ul className="mt-1 grid gap-1 text-[14px]">
                {items.map((t: string) => <li key={t} className="text-ink-muted">{t}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (kind === "routes") {
    return (
      <div className="grid gap-3">
        <p className="eyebrow text-ink-muted">The route plan</p>
        <ol className="grid gap-3">
          {demo.routes.map((r: any) => (
            <li key={r.id} className={cn("grid gap-1 border p-3", r.id === demo.recommended ? "border-fg" : "border-line")}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="mono">{r.id}</span>
                <span className="eyebrow">{r.axis}</span>
                {r.id === demo.recommended && <span className="eyebrow border border-fg px-1.5 py-[1px]">Recommended</span>}
              </div>
              <p className="text-[15px]">{r.angle}</p>
              <p className="text-[14px] text-ink-muted">{r.tension}</p>
            </li>
          ))}
        </ol>
        <p className="text-[14px] text-ink-muted"><span className="font-medium text-fg">Why route 1: </span>{demo.recommended_why}</p>
        <p className="border-l pl-3 text-[14px]" style={{ borderColor: "var(--rule)" }}>{stage.route_note}</p>
      </div>
    )
  }
  if (kind === "copy") {
    const groups = demo.findings.groups as any[]
    return (
      <div className="grid gap-4">
        <p className="eyebrow text-ink-muted">The approved copy, route 1</p>
        <div className="grid gap-1 text-[14px]">
          <p><span className="text-ink-muted">Subject </span>{demo.subject}</p>
          <p><span className="text-ink-muted">Preheader </span>{demo.preheader}</p>
        </div>
        <div className="scroll-x">
          <table className="w-full min-w-[420px] border-collapse text-left text-[14px]">
            <thead>
              <tr className="border-b hair"><th className="eyebrow py-2 pr-3 font-medium text-ink-muted">Slot</th><th className="eyebrow py-2 font-medium text-ink-muted">Copy</th></tr>
            </thead>
            <tbody>
              {demo.copy.slice(0, 7).map((r: any) => (
                <tr key={r.slot} className="border-b border-line align-top">
                  <td className="mono py-2 pr-3 text-ink-muted">{r.slot}</td>
                  <td className="py-2">{accentize(r.copy, r.accent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[13px]">
          {stage.checks.map((c: any) => (
            <span key={c.key} className="flex items-center gap-1.5"><span className="text-ink-muted">{c.name}</span><Verdict v={lintVerdict(c.key)} small /></span>
          ))}
        </div>
        <p className="text-[14px] text-ink-muted">{stage.voice_note.text} <FactChip fact={stage.voice_note.fact} /></p>
        <div className="border-t border-line pt-3">
          <p className="text-[14px]">{demo.findings.summary}</p>
          <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {groups.map((g) => (
              <li key={g.owner} className="border border-line p-2">
                <p className="eyebrow">{g.owner}</p>
                <p className="mono text-ink-muted tabnums">{g.items.length} {g.items.length === 1 ? "finding" : "findings"}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
  if (kind === "squad") {
    return (
      <div className="grid gap-4">
        <p className="eyebrow text-ink-muted">How a squad run is shaped</p>
        <ol className="grid gap-2 text-[14px]">
          {["One worker per route writes a finished route packet", "Hard gates by script: schema, lint verdicts, completion", "A fresh judge compares routes in pairs on yes-or-no criteria", "The board shows every route side by side, ranked by the judge", "A person picks"].map((t, i) => (
            <li key={t} className="grid grid-cols-[28px_minmax(0,1fr)] gap-2 border-t border-line pt-2"><span className="mono text-ink-muted tabnums">{i + 1}</span><span>{t}</span></li>
          ))}
        </ol>
        <p className="text-[14px]"><span className="text-ink-muted">Cost: </span>{stage.cost.text} <FactChip fact={stage.cost.fact} /></p>
      </div>
    )
  }
  if (kind === "build") {
    return (
      <div className="grid gap-4">
        <p className="eyebrow text-ink-muted">The built email, from Figma</p>
        <div className="grid gap-4 sm:grid-cols-[minmax(0,240px)_minmax(0,1fr)]">
          <div className="h-[460px] overflow-y-auto border border-line bg-paper" tabIndex={0} aria-label="Preview of the rehearsal email; scroll to see all of it">
            <img src={previewSrc} width={previewSize.w} height={previewSize.h} alt="The rehearsal email as built in HLR Library: a dark hero photo with the headline Made after you choose it, a two-column text block, a grid of four pendants, an editorial band, a closing button and the footer." className="block h-auto w-full" />
          </div>
          <div className="grid content-start gap-3 text-[14px]">
            <ul className="grid gap-2">
              {stage.checks.map((c: any) => (
                <li key={c.name} className="flex items-center justify-between gap-3 border-t border-line pt-2"><span>{c.name}</span><Verdict v={c.verdict} small /></li>
              ))}
            </ul>
            <div><FactChip fact={stage.checks_fact} /></div>
            <p className="text-ink-muted">{stage.fact.quote}. <FactChip fact={stage.fact} /></p>
            <Tech><p className="mono break-words text-ink-muted">{demo.where[0]}</p></Tech>
            <p className="text-ink-muted">Preview is a server screenshot, scaled down. Judge the type in Figma itself.</p>
          </div>
        </div>
      </div>
    )
  }
  if (kind === "review") {
    return (
      <div className="grid gap-4">
        <p className="eyebrow text-ink-muted">Two lessons from this build</p>
        {stage.lessons.map((l: any) => (
          <article key={l.title} className="grid gap-2 border-t border-line pt-3">
            <h4 className="display text-[22px] leading-snug">{l.title}</h4>
            <p className="text-[15px]">{l.text}</p>
            <div className="flex flex-wrap gap-2">{l.facts.map((f: any) => <FactChip key={f.quote} fact={f} />)}</div>
            {l.verdict && <ExampleVerdict id={l.verdict} />}
          </article>
        ))}
      </div>
    )
  }
  if (kind === "ship") {
    return (
      <div className="grid gap-4">
        <p className="eyebrow text-ink-muted">Seven slices, each with alt text</p>
        <ol className="grid gap-2 text-[14px]">
          {demo.slices.map((s: any) => (
            <li key={s.slice} className="grid grid-cols-[92px_minmax(0,1fr)] gap-3 border-t border-line pt-2">
              <span className="mono text-ink-muted">{s.slice}</span><span className="min-w-0 clamp-3">{s.alt}</span>
            </li>
          ))}
        </ol>
        <p data-ground="warm" className="p-3 text-[14px]">{stage.status_note.text} <FactChip fact={stage.status_note.fact} /></p>
      </div>
    )
  }
  if (kind === "learn") {
    const rows = data.gaps.filter((g: any) => ["favorites", "voice_model", "judge_rubric", "judge_calibration", "voice_calibration"].includes(g.item.replace(/`/g, "")))
    return (
      <div className="grid gap-4">
        <p className="eyebrow text-ink-muted">What fills in after the first marks</p>
        <ul className="grid gap-2 text-[14px]">
          {rows.map((g: any) => (
            <li key={g.item} className="grid gap-0.5 border-t border-line pt-2">
              <span className="mono">{g.item.replace(/`/g, "")}</span>
              <span className="text-ink-muted">Without it: {g.blocks}</span>
            </li>
          ))}
        </ul>
        <p className="text-[14px] text-ink-muted">{stage.fact.quote[0].toUpperCase() + stage.fact.quote.slice(1)}, says every run today. <FactChip fact={stage.fact} /></p>
      </div>
    )
  }
  return null
}

function briefTitle(t: string) {
  const x = t.replace(/^Brief: /, "")
  return x.charAt(0).toUpperCase() + x.slice(1)
}

function briefLine(t: string) {
  const lines = t.split("\n").map((l) => l.trim()).filter(Boolean)
  const items = lines.filter((l) => l.startsWith("- ")).map((l) => l.slice(2))
  return items.length ? items.join("; ") : lines[0]
}

function accentize(text: string, accent: string) {
  if (!accent) return text
  const i = text.indexOf(accent)
  if (i < 0) return text
  return (<>{text.slice(0, i)}<em className="display text-[16px]">{accent}</em>{text.slice(i + accent.length)}</>)
}

export default function Journey() {
  const stages = content.stages as any[]
  const [active, setActive] = useState(0)
  const s = stages[active]
  const order = stages.map((_, i) => i)
  const pos = order.indexOf(active)
  return (
    <section id="journey" aria-labelledby="journey-h" className="grid gap-10">
      <SectionHead n={2} id="journey" label="The journey" parts={content.journey.headline} intro={content.journey.intro} />
      <p className="max-w-prose border-l pl-4 text-[14px] text-ink-muted" style={{ borderColor: "var(--rule)" }}>{content.meta.rehearsal}</p>
      <Strip active={active} onPick={setActive} />
      <div className="grid gap-10 border-t hair pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
        <div className="grid content-start gap-5">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h3 className="display text-[38px] leading-none">{s.name}</h3>
            {s.branch && <span className="eyebrow text-ink-muted">Optional branch</span>}
            <Tech>{s.skill && <span className="mono text-ink-muted">{s.skill}</span>}</Tech>
          </div>
          {s.plain.map((p: string) => <p key={p} className="max-w-prose">{fill(p)}</p>)}
          <div className="grid gap-1 border-l-2 pl-4" style={{ borderColor: "var(--fg)" }}>
            <p className="eyebrow text-ink-muted">The human call</p>
            <p className="text-[16px]">{s.human}</p>
            {s.fact && <div><FactChip fact={s.fact} /></div>}
          </div>
          {s.reads?.length > 0 && (
            <div className="grid gap-2">
              <p className="eyebrow text-ink-muted">Reads from the pack</p>
              <div className="flex flex-wrap gap-2">{s.reads.map((r: string) => <CardChip key={r} id={r} />)}</div>
            </div>
          )}
          {s.makes?.length > 0 && (
            <div className="grid gap-2">
              <p className="eyebrow text-ink-muted">Makes</p>
              <ul className="flex flex-wrap gap-2">
                {s.makes.map((m: any) => (
                  <li key={m.file} className="chip"><span>{m.label}</span><Tech><span className="mono text-ink-muted">{m.file}</span></Tech></li>
                ))}
              </ul>
            </div>
          )}
          <Tech>
            {s.technical && (
              <p className="mono break-words text-ink-muted">{s.technical.text} <FactChip fact={s.technical.fact} /></p>
            )}
          </Tech>
          {s.predict && <Predict key={s.id} q={s.predict.q} a={s.predict.a} fact={s.predict.fact} verdict={s.predict.verdict} labels={labels} />}
          <div className="flex items-center justify-between gap-3 border-t border-line pt-4">
            <button type="button" disabled={pos <= 0} onClick={() => setActive(order[pos - 1])} className="text-[13px] uppercase tracking-[0.12em] disabled:opacity-40">← Previous</button>
            <span className="mono text-ink-muted tabnums">{pos + 1} of {stages.length}</span>
            <button type="button" disabled={pos >= stages.length - 1} onClick={() => setActive(order[pos + 1])} className="text-[13px] uppercase tracking-[0.12em] disabled:opacity-40">Next →</button>
          </div>
        </div>
        <div className="min-w-0 border border-line p-5 md:p-6">
          <Evidence kind={s.evidence} stage={s} />
        </div>
      </div>
    </section>
  )
}
