import { useState, type ReactNode } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cardsById, data, fill, sourceLabel, useUI, verdictById, type Fact } from "@/lib/content"
import { cn } from "@/lib/utils"

/* A headline in HLR's house style: one italic accent word per display line. */
export function Accent({ parts, className, as = "h2", id }: { parts: [string, string] | string[]; className?: string; as?: "h1" | "h2" | "h3"; id?: string }) {
  const Tag = as
  return (
    <Tag id={id} className={cn("display", className)}>
      {parts[0]}
      <em>{parts[1]}</em>
    </Tag>
  )
}

export function SectionHead({ n, label, parts, intro, id }: { n: number; label: string; parts: string[]; intro?: string; id: string }) {
  return (
    <header className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-12 md:items-end">
      <div className="grid gap-4">
        <p className="eyebrow text-ink-muted tabnums">
          <span aria-hidden="true">{String(n).padStart(2, "0")}</span>
          <span className="mx-2" aria-hidden="true">·</span>
          {label}
        </p>
        <Accent id={`${id}-h`} parts={parts} as="h2" className="text-[40px] leading-[1.02] md:text-[56px]" />
      </div>
      {intro && <p id={`${id}-intro`} className="max-w-prose text-[17px] text-ink-muted">{intro}</p>}
    </header>
  )
}

export function Tech({ children }: { children: ReactNode }) {
  const { mode } = useUI()
  if (mode !== "technical") return null
  return <>{children}</>
}

/* Verdict pills: state is carried by the word and the shape, never by color alone. */
export function Verdict({ v, small }: { v: string; small?: boolean }) {
  const key = (v || "").toLowerCase()
  const inverted = key === "fail" || key === "blocked"
  const warm = key === "warn" || key === "asks a person" || key === "listed for review"
  const glyph = key === "pass" || key === "clear" ? "✓" : inverted ? "×" : "!"
  return (
    <span
      data-ground={warm ? "warm" : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 border font-medium uppercase tracking-[0.12em] whitespace-nowrap",
        small ? "px-1.5 py-[1px] text-[10.5px]" : "px-2 py-0.5 text-[11.5px]",
        inverted ? "border-fg bg-fg text-bg" : warm ? "border-transparent" : "border-fg"
      )}
    >
      <span aria-hidden="true">{glyph}</span>
      {v}
    </span>
  )
}

export function FactChip({ fact, label }: { fact?: Fact | null; label?: string }) {
  const { mode } = useUI()
  if (!fact) return null
  const s = sourceLabel(fact)
  const engine = data.stamp?.engine
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="chip chip-btn mono max-w-full break-all text-left text-ink-muted align-middle"
          aria-label={`Source: ${s.label}`}
        >
          <span aria-hidden="true">↳</span>
          {label ?? (mode === "technical" || s.kind === "web" ? s.label : s.label.split("/").pop()?.split("#")[0])}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(92vw,420px)] rounded-none border-line bg-bg p-4 text-fg shadow-none" align="start">
        <p className="eyebrow mb-2 text-ink-muted">{s.kind === "web" ? "Outside source" : s.kind === "engine" ? "The engine" : "The pack and the record"}</p>
        {fact.quote && <blockquote className="display mb-3 text-[19px] leading-snug">“{fact.quote}”</blockquote>}
        <p className="mono break-words text-ink-muted">
          {s.kind === "engine" ? `${engine ?? "hlr-studio-engine"} · ${s.label}` : s.kind === "web" ? fact.source : s.label}
        </p>
        {s.kind === "web" ? (
          <p className="mt-2 text-[13px] text-ink-muted">
            Checked {fact.checked}.{" "}
            <a className="underline underline-offset-4" href={fact.source} target="_blank" rel="noreferrer">Open the page</a>
          </p>
        ) : (
          <p className="mt-2 text-[13px] text-ink-muted">Quoted word for word; the drift guard checks it against the file at every rebuild.</p>
        )}
      </PopoverContent>
    </Popover>
  )
}

export function CardChip({ id }: { id: string }) {
  const { openCard, mode } = useUI()
  const c = cardsById[id]
  if (!c) return null
  return (
    <button type="button" onClick={() => openCard(id)} className="chip chip-btn text-fg">
      <span>{c.name}</span>
      {mode === "technical" && <span className="mono text-ink-muted">{c.file.split(" · ")[0].replace("brand-pack/", "")}</span>}
    </button>
  )
}

export function ExampleVerdict({ id }: { id: string }) {
  const e = verdictById[id]
  if (!e) return null
  const hits = [
    ...e.ledger_hits.map((h: any) => `${h.id} (${h.severity.replace("_", "-")})`),
    ...e.pattern_hits.map((h: any) => `never-say pattern ${h.index}`),
  ]
  return (
    <div className="mt-3 border border-line p-3">
      <p className="text-[14px]">
        <span className="text-ink-muted">Run through the engine’s claims matcher: </span>
        <q className="display text-[17px]">{e.text}</q>
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Verdict v={e.verdict} small />
        <span className="text-[13px] text-ink-muted">{hits.length ? hits.join(" · ") : "no listed wording matched"}</span>
      </div>
      <Tech>
        <p className="mono mt-2 text-ink-muted">{verdictsMeta()}</p>
      </Tech>
    </div>
  )
}

function verdictsMeta() {
  return "verify_examples.js · lib/claims.js · " + (data.stamp?.engine ?? "")
}

export function Predict({ q, a, fact, verdict, labels }: { q: string; a: string; fact?: Fact; verdict?: string; labels: { predict: string; reveal: string } }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-t hair pt-4">
      <p className="eyebrow text-ink-muted">{labels.predict}</p>
      <p className="mt-2 text-[18px] leading-snug">{q}</p>
      {!open ? (
        <button type="button" onClick={() => setOpen(true)} className="mt-3 border border-fg px-4 py-2 text-[13px] uppercase tracking-[0.12em] hover:bg-fg hover:text-bg">
          {labels.reveal}
        </button>
      ) : (
        <div data-ground="warm" className="mt-3 p-4" aria-live="polite">
          <p className="text-[16px] leading-relaxed">{fill(a)}</p>
          {fact && <div className="mt-2"><FactChip fact={fact} /></div>}
          {verdict && <ExampleVerdict id={verdict} />}
        </div>
      )}
    </div>
  )
}

export function Stat({ children }: { children: ReactNode }) {
  return <p className="mono text-ink-muted tabnums">{children}</p>
}
