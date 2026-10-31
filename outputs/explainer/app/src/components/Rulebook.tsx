import { useMemo, useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cardsById, content, data, fill, gapRows, plainGap, useUI } from "@/lib/content"
import { ExampleVerdict, FactChip, SectionHead, Stat, Tech } from "@/components/bits"
import { cn } from "@/lib/utils"

function ownerKey(c: any): string {
  const o = (c.owner || "").toLowerCase()
  if (o.startsWith("hlr")) return "hlr"
  if (o.startsWith("eddie")) return "eddie"
  return "shared"
}

function statusOf(c: any): string {
  if (c.state) return c.state
  if (c.file && /empty|planned/.test(c.file)) return "Not filled yet"
  if (/for him to confirm|for eddie to confirm/i.test(c.owner || "")) return "Awaiting Eddie"
  if (c.status) return "Provisional"
  return "In force"
}

export function CardSheet({ id, onClose }: { id: string | null; onClose: () => void }) {
  const c = id ? cardsById[id] : null
  const layer = c ? content.layers.find((l: any) => l.id === c.layer) : null
  const gaps = c ? gapRows(c.gaps) : []
  return (
    <Sheet open={!!c} onOpenChange={(o) => { if (!o) onClose() }}>
      <SheetContent side="right" className="w-full overflow-y-auto rounded-none border-l hair bg-bg p-0 text-fg sm:max-w-[560px]">
        {c && (
          <div className="grid gap-6 p-6 pb-12 md:p-8">
            <SheetHeader className="grid gap-2 text-left">
              <p className="eyebrow text-ink-muted">{layer?.name} · {statusOf(c)}</p>
              <SheetTitle className="display text-[38px] font-normal leading-none text-fg">{c.name}</SheetTitle>
              <SheetDescription className="text-[16px] leading-relaxed text-fg">{fill(c.controls)}</SheetDescription>
            </SheetHeader>
            <div className="grid gap-1">
              <Stat>{fill(c.stat)}</Stat>
              <p className="mono break-words text-ink-muted">{c.file}</p>
              <Tech>{c.roles?.length > 0 && <p className="mono text-ink-muted">File map role: {c.roles.join(", ")}</p>}</Tech>
            </div>
            {c.example && (
              <Block label="An example">
                <p>{fill(c.example.text)}</p>
                {c.example.fact?.quote && <blockquote className="display mt-2 text-[19px] leading-snug">“{c.example.fact.quote}”</blockquote>}
                {c.example.fact && <div className="mt-2"><FactChip fact={c.example.fact} /></div>}
                {c.example.verdict && <ExampleVerdict id={c.example.verdict} />}
              </Block>
            )}
            <Block label="Why it exists">
              <p>{c.why.text}</p>
              {c.why.fact && (
                <>
                  <blockquote className="mt-2 border-l pl-3 text-[15px] text-ink-muted" style={{ borderColor: "var(--rule)" }}>“{c.why.fact.quote}”</blockquote>
                  <div className="mt-2"><FactChip fact={c.why.fact} /></div>
                </>
              )}
            </Block>
            {c.status && (
              <Block label="Status">
                <p>{c.status.text}</p>
                {c.status.fact && <div className="mt-2"><FactChip fact={c.status.fact} /></div>}
              </Block>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <Block label="Who changes it"><p>{c.owner}</p></Block>
              <Block label="Approval"><p>{c.tier}</p></Block>
            </div>
            <Block label="What enforces it">
              <ul className="grid gap-1">{c.enforced.map((e: string) => <li key={e}>{e}</li>)}</ul>
            </Block>
            <Block label="After a change">
              <p>{c.rerun}</p>
              {c.rerun_fact && <div className="mt-2"><FactChip fact={c.rerun_fact} /></div>}
            </Block>
            {c.open && (
              <Block label="Still open">
                <p>{c.open.text}</p>
                <div className="mt-2"><FactChip fact={c.open.fact} /></div>
              </Block>
            )}
            {gaps.length > 0 && (
              <Block label="Open gaps">
                <ul className="grid gap-3">
                  {gaps.map((g: any) => (
                    <li key={g.item} className="grid gap-0.5 border-t border-line pt-2">
                      <span className="font-medium">{plainGap(g.item) ?? g.item}</span>
                      <span className="text-[14px] text-ink-muted">Owner: {g.owner} · Blocks: {g.blocks}</span>
                      <Tech><span className="mono text-ink-muted">{g.item} · {g.state}</span></Tech>
                    </li>
                  ))}
                </ul>
              </Block>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 border-t hair pt-3 text-[15px] leading-relaxed">
      <p className="eyebrow text-ink-muted">{label}</p>
      <div>{children}</div>
    </div>
  )
}

function Waiting() {
  const rows = data.gaps.filter((g: any) => g.owner === "HLR")
  return (
    <div data-ground="deep" className="grid gap-6 p-6 md:p-10">
      <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:gap-10">
        <h3 className="display text-[34px] leading-none">{content.rulebook.waiting_label}</h3>
        <p className="max-w-prose text-[15px]">{content.rulebook.waiting_intro}</p>
      </div>
      <ol className="grid gap-0 md:grid-cols-2 md:gap-x-10">
        {rows.map((g: any, i: number) => (
          <li key={g.item} className="grid grid-cols-[32px_minmax(0,1fr)] gap-3 border-t py-4" style={{ borderColor: "var(--rule)" }}>
            <span className="mono tabnums" style={{ color: "var(--ink-muted)" }}>{String(i + 1).padStart(2, "0")}</span>
            <div className="grid gap-1">
              <p className="text-[16px] font-medium">{plainGap(g.item) ?? g.item}</p>
              <p className="text-[14px]" style={{ color: "var(--ink-muted)" }}>Unblocks: {g.blocks}</p>
              <p className="eyebrow" style={{ color: "var(--ink-muted)" }}>{/Review 1/.test(g.step) ? "Asked at Review 1" : g.step}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function Rulebook() {
  const { openCard, mode } = useUI()
  const [layer, setLayer] = useState<string>("all")
  const [owner, setOwner] = useState<string>("all")
  const [waiting, setWaiting] = useState(false)
  const cards = useMemo(
    () => (content.cards as any[]).filter((c) => (layer === "all" || c.layer === layer) && (owner === "all" || ownerKey(c) === owner)),
    [layer, owner]
  )
  const layers = [{ id: "all", name: "All" }, ...content.layers]
  return (
    <section id="rulebook" aria-labelledby="rulebook-h" className="grid gap-10">
      <SectionHead n={3} id="rulebook" label="The rulebook" parts={content.rulebook.headline} intro={content.rulebook.intro} />
      <div className="grid gap-4 border-y hair py-4">
        <div className="scroll-x">
          <div role="group" aria-label="Filter by layer" className="flex min-w-max gap-1">
            {layers.map((l: any) => (
              <button key={l.id} type="button" aria-pressed={layer === l.id && !waiting} onClick={() => { setLayer(l.id); setWaiting(false) }}
                className={cn("border px-3 py-1.5 text-[13px] uppercase tracking-[0.1em]", layer === l.id && !waiting ? "border-fg bg-fg text-bg" : "border-line hover:border-fg")}>
                {l.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow text-ink-muted">Owner</span>
          {[["all", "Anyone"], ["hlr", "HLR"], ["eddie", "Eddie"], ["shared", "Shared or fixed"]].map(([k, label]) => (
            <button key={k} type="button" aria-pressed={owner === k && !waiting} onClick={() => { setOwner(k); setWaiting(false) }}
              className={cn("border px-2.5 py-1 text-[13px]", owner === k && !waiting ? "border-fg" : "border-line text-ink-muted hover:text-fg")}>
              {label}
            </button>
          ))}
          <span className="mx-1 h-5 w-px bg-line" aria-hidden="true" />
          <button type="button" aria-pressed={waiting} onClick={() => setWaiting(!waiting)}
            className={cn("border px-3 py-1 text-[13px] uppercase tracking-[0.1em]", waiting ? "border-fg bg-fg text-bg" : "border-fg hover:bg-surface")}>
            {content.rulebook.waiting_label} · {data.gaps.filter((g: any) => g.owner === "HLR").length}
          </button>
        </div>
      </div>

      {waiting ? (
        <Waiting />
      ) : (
        <>
          {layer !== "all" && <p className="max-w-prose text-ink-muted">{content.layers.find((l: any) => l.id === layer)?.blurb}</p>}
          <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3" style={{ outline: "1px solid var(--line)" }}>
            {cards.map((c) => (
              <li key={c.id} className="bg-bg">
                <button type="button" onClick={() => openCard(c.id)} className="group grid h-full w-full content-start gap-3 p-5 text-left hover:bg-surface">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="eyebrow text-ink-muted">{content.layers.find((l: any) => l.id === c.layer)?.name}</span>
                    <span className="eyebrow text-ink-muted">{statusOf(c)}</span>
                  </div>
                  <h3 className="display text-[26px] leading-tight">{c.name}</h3>
                  <p className="clamp-3 text-[15px] text-ink-muted">{fill(c.controls)}</p>
                  <Stat>{fill(c.stat)}</Stat>
                  {mode === "technical" && <p className="mono break-words text-ink-muted">{c.file}</p>}
                  <span className="mt-auto text-[13px] uppercase tracking-[0.12em] underline-offset-4 group-hover:underline">Open the card →</span>
                </button>
              </li>
            ))}
            {cards.length === 0 && <li className="bg-bg p-5 text-ink-muted">No card matches both filters.</li>}
          </ul>
        </>
      )}
    </section>
  )
}
