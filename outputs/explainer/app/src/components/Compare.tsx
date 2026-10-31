import { useState } from "react"
import { content, fill } from "@/lib/content"
import { FactChip, SectionHead } from "@/components/bits"
import { cn } from "@/lib/utils"

export default function Compare() {
  const c = content.compare
  const [job, setJob] = useState<number | null>(null)
  return (
    <section id="compare" aria-labelledby="compare-h" className="grid gap-12">
      <SectionHead n={5} id="compare" label="Forge or Claude Design" parts={c.headline} intro={c.intro} />

      <p className="display max-w-[30ch] text-[34px] leading-[1.12] md:text-[46px]">{c.thesis}</p>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-12">
        <div data-ground="deep" className="grid content-start gap-5 p-6 md:p-8">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="display text-[32px] leading-none">Where the forge does better</h3>
            <span className="eyebrow tabnums">{c.forge_better.length}</span>
          </div>
          <ol className="grid gap-0">
            {c.forge_better.map((f: any, i: number) => (
              <li key={f.point} className="grid grid-cols-[30px_minmax(0,1fr)] gap-3 border-t py-4" style={{ borderColor: "var(--rule)" }}>
                <span className="mono tabnums" style={{ color: "var(--ink-muted)" }}>{String(i + 1).padStart(2, "0")}</span>
                <div className="grid gap-2">
                  <p className="text-[17px] font-semibold leading-snug">{f.point}</p>
                  <p className="text-[15px] leading-relaxed">{fill(f.detail)}</p>
                  {f.facts?.length > 0 && <div className="flex flex-wrap gap-2">{f.facts.map((x: any) => <FactChip key={x.quote} fact={x} />)}</div>}
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="grid content-start gap-5 border border-line p-6 md:p-8">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="display text-[32px] leading-none">Where Claude Design does better</h3>
            <span className="eyebrow tabnums text-ink-muted">{c.cd_better.length}</span>
          </div>
          <ol className="grid gap-0">
            {c.cd_better.map((f: any, i: number) => (
              <li key={f.point} className="grid grid-cols-[30px_minmax(0,1fr)] gap-3 border-t border-line py-4">
                <span className="mono text-ink-muted tabnums">{String(i + 1).padStart(2, "0")}</span>
                <div className="grid gap-1">
                  <p className="text-[17px] font-semibold leading-snug">{f.point}</p>
                  <p className="text-[15px] leading-relaxed text-ink-muted">{f.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="grid gap-3 border-t hair pt-4">
            <p className="eyebrow text-ink-muted">Claude Design today, checked {c.checked}</p>
            <ul className="grid gap-3 text-[14px]">
              {c.cd_facts.map((f: any) => (
                <li key={f.text} className="grid gap-1">
                  <span>{f.text}</span>
                  <span><FactChip fact={f} /></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <h3 className="display text-[30px] leading-none">Side by side</h3>
        <div className="scroll-x border-y hair">
          <table className="w-full min-w-[680px] border-collapse text-left text-[15px]">
            <thead>
              <tr className="border-b hair">
                <th scope="col" className="eyebrow w-[22%] py-3 pr-4 font-medium text-ink-muted"> </th>
                <th scope="col" className="eyebrow w-[39%] py-3 pr-4 font-medium">Claude Design</th>
                <th scope="col" className="eyebrow w-[39%] py-3 font-medium">The forge</th>
              </tr>
            </thead>
            <tbody>
              {c.rows.map((r: any) => (
                <tr key={r.dim} className="border-b border-line align-top">
                  <th scope="row" className="py-3 pr-4 text-[14px] font-medium">{r.dim}</th>
                  <td className="py-3 pr-4 text-ink-muted">{fill(r.cd)}</td>
                  <td className="py-3">{fill(r.forge)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-12">
        <div className="grid content-start gap-3">
          <h3 className="display text-[30px] leading-none">Together</h3>
          <ul className="grid gap-3">
            {c.together.map((t: string) => <li key={t} className="max-w-prose border-t border-line pt-3">{t}</li>)}
          </ul>
        </div>
        <div className="grid content-start gap-3">
          <h3 className="display text-[30px] leading-none">Which tool for this job?</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {c.picker.map((p: any, i: number) => (
              <button key={p.job} type="button" aria-pressed={job === i} onClick={() => setJob(job === i ? null : i)}
                className={cn("grid gap-2 border p-3 text-left", job === i ? "border-fg" : "border-line hover:border-fg")}>
                <span className="text-[15px] font-medium">{p.job}</span>
                {job === i ? (
                  <span className="grid gap-1" aria-live="polite">
                    <span className="eyebrow">{p.pick === "forge" ? "The forge" : "Claude Design"}</span>
                    <span className="text-[14px] text-ink-muted">{p.why}</span>
                  </span>
                ) : (
                  <span className="text-[13px] text-ink-muted">Tap to see the pick</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
