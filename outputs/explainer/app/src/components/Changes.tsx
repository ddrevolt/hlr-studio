import { useState } from "react"
import { cardsById, content, fill, useUI } from "@/lib/content"
import { FactChip, SectionHead } from "@/components/bits"
import { cn } from "@/lib/utils"

export default function Changes() {
  const scenarios = content.scenarios as any[]
  const [idx, setIdx] = useState(0)
  const [picks, setPicks] = useState<Record<string, string[]>>({})
  const [shown, setShown] = useState<Record<string, boolean>>({})
  const { openCard } = useUI()
  const s = scenarios[idx]
  const mine = picks[s.id] ?? []
  const revealed = !!shown[s.id]
  const toggle = (id: string) => setPicks((p) => ({ ...p, [s.id]: mine.includes(id) ? mine.filter((x) => x !== id) : [...mine, id] }))
  const right = s.answer.filter((a: string) => mine.includes(a)).length
  const extra = mine.filter((m) => !s.answer.includes(m)).length
  return (
    <section id="changes" aria-labelledby="changes-h" className="grid gap-10">
      <SectionHead n={4} id="changes" label="When things change" parts={content.changes.headline} intro={content.changes.intro} />
      <div className="grid gap-8 border-t hair pt-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] lg:gap-12">
        <ol className="grid content-start gap-0" aria-label="Changes">
          {scenarios.map((x, i) => (
            <li key={x.id}>
              <button type="button" onClick={() => setIdx(i)} aria-current={i === idx ? "true" : undefined}
                className={cn("grid w-full grid-cols-[30px_minmax(0,1fr)] gap-2 border-b border-line py-3 text-left", i === idx ? "font-semibold" : "text-ink-muted hover:text-fg")}>
                <span className="mono tabnums">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[16px]">{x.title}{shown[x.id] && <span className="ml-2 text-[12px] font-normal">✓ seen</span>}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="grid content-start gap-6">
          <div className="grid gap-2">
            <h3 className="display text-[34px] leading-tight">{s.title}</h3>
            <p className="max-w-prose text-[17px]">{s.situation}</p>
          </div>
          <div className="grid gap-3">
            <p className="eyebrow text-ink-muted">{content.changes.pick_label}</p>
            <div className="flex flex-wrap gap-2">
              {s.options.map((o: string) => {
                const on = mine.includes(o)
                const isAns = s.answer.includes(o)
                return (
                  <button key={o} type="button" aria-pressed={on} onClick={() => !revealed && toggle(o)} disabled={revealed}
                    className={cn("chip", !revealed && "chip-btn", on && !revealed && "border-fg bg-fg text-bg",
                      revealed && isAns && "border-fg font-medium", revealed && !isAns && "opacity-60")}>
                    {revealed && <span aria-hidden="true">{isAns ? "✓" : "·"}</span>}
                    {cardsById[o]?.name ?? o}
                    {revealed && on && !isAns && <span className="text-[12px]">(not this time)</span>}
                  </button>
                )
              })}
            </div>
            {!revealed ? (
              <button type="button" onClick={() => setShown((x) => ({ ...x, [s.id]: true }))}
                className="justify-self-start border border-fg px-4 py-2 text-[13px] uppercase tracking-[0.12em] hover:bg-fg hover:text-bg">
                {content.changes.reveal_label}
              </button>
            ) : (
              <p className="text-[14px] text-ink-muted" aria-live="polite">
                {mine.length === 0 ? `It touches ${s.answer.length} parts of the pack.` : `You found ${right} of ${s.answer.length}${extra ? `, plus ${extra} it leaves alone` : ""}.`}
              </p>
            )}
          </div>
          {revealed && (
            <div className="grid gap-4">
              <ol className="grid gap-0 border-t hair">
                {s.ripple.map((r: any, i: number) => (
                  <li key={r.what} className="grid grid-cols-[34px_minmax(0,1fr)] gap-3 border-b border-line py-3">
                    <span className="mono text-ink-muted tabnums">{i + 1}</span>
                    <div className="grid gap-1">
                      <p className="text-[16px]">{fill(r.what)}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="eyebrow text-ink-muted">{r.who}</span>
                        {r.fact && <FactChip fact={r.fact} />}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
              <p data-ground="warm" className="p-4 text-[15px]">{s.unchanged}</p>
              <div className="flex flex-wrap gap-2">
                <span className="eyebrow self-center text-ink-muted">Open the cards</span>
                {s.answer.map((a: string) => (
                  <button key={a} type="button" onClick={() => openCard(a)} className="chip chip-btn">{cardsById[a]?.name}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
