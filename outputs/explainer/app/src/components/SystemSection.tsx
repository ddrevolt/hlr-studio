import { content, data, fill } from "@/lib/content"
import { FactChip, SectionHead, Stat, Tech } from "@/components/bits"

export default function SystemSection() {
  const s = content.system
  return (
    <section id="system" aria-labelledby="system-h" className="grid gap-12">
      <SectionHead n={1} id="system" label="The system" parts={s.headline} intro={s.intro} />
      <div className="grid gap-0 border-t hair md:grid-cols-2">
        {s.parts.map((p: any, i: number) => (
          <article
            key={p.id}
            className={
              "grid content-start gap-3 border-b hair py-7 md:px-8 " +
              (i % 2 === 0 ? "md:border-r md:pl-0" : "md:pr-0")
            }
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="display text-[30px] leading-none">{p.name}</h3>
              <span className="eyebrow text-ink-muted tabnums">{["Rules and facts", "Skills", "Figma", "Decisions"][i]}</span>
            </div>
            <p className="max-w-prose">{p.what}</p>
            <p className="max-w-prose text-ink-muted">{p.detail}</p>
            <div className="flex flex-wrap items-center gap-3">
              <Stat>{fill(p.stat)}</Stat>
              <FactChip fact={p.fact} />
            </div>
            <Tech>
              <p className="mono text-ink-muted">{p.technical}</p>
            </Tech>
          </article>
        ))}
      </div>

      <div data-ground="deep" className="grid gap-4 p-7 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-center md:p-10">
        <p className="display text-[28px] leading-tight md:text-[34px]">{s.rule.text}</p>
        <div className="grid gap-3">
          <blockquote className="border-l pl-4 text-[15px] leading-relaxed" style={{ borderColor: "var(--rule)" }}>
            “{s.rule.fact.quote}”
          </blockquote>
          <div><FactChip fact={s.rule.fact} /></div>
        </div>
      </div>

      <div className="grid gap-4">
        <p className="eyebrow text-ink-muted">{s.progress_label}</p>
        <ol className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
          {data.progress.map((st: any) => {
            const total = st.done + st.open
            const pct = total ? Math.round((st.done / total) * 100) : 0
            return (
              <li key={st.step} className="grid gap-1.5">
                <div className="flex items-baseline justify-between gap-3 text-[14px]">
                  <span className="min-w-0 truncate">{st.step.replace(/ \(read-only\)/, "")}</span>
                  <span className="mono text-ink-muted tabnums">{st.done}/{total}</span>
                </div>
                <div className="h-[3px] w-full bg-surface" style={{ outline: "1px solid var(--line)" }} aria-hidden="true">
                  <div className="h-full bg-fg" style={{ width: `${pct}%` }} />
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
