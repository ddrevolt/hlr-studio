import { Fragment, type ReactNode } from "react"
import { CODE_LINK, L, anchor, byLabel, decisionsById, fileShort, fmtTime, itemsById, ui } from "@/lib/data"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

/* A headline in HLR's house grammar: one italic accent word. */
export function Accent({ parts, className, as = "h2", id }: { parts: string[]; className?: string; as?: "h1" | "h2" | "h3"; id?: string }) {
  const Tag = as
  return (
    <Tag id={id} className={cn("display", className)}>
      {parts[0]}
      <em>{parts[1]}</em>
    </Tag>
  )
}

export function go(id: string) {
  const el = document.getElementById(anchor(id))
  if (!el) return
  el.scrollIntoView({ behavior: "smooth", block: "start" })
  const f = el.querySelector<HTMLElement>("h3, h4, [data-focus]") ?? el
  f.setAttribute("tabindex", "-1")
  f.focus({ preventScroll: true })
}

/* Turns C1 to C10, T6 and ledger codes in pack text into links to their decision or claim. */
export function Linked({ text }: { text: string }) {
  if (!text) return null
  const parts = text.split(/\b(C10|C[1-9]|T6|HLR-(?:REQ-01|[A-Z]\d{2}))\b/g)
  return (
    <>
      {parts.map((p, i) => {
        if (i % 2 === 0) return <Fragment key={i}>{p}</Fragment>
        const target = p.startsWith("HLR-") ? (itemsById["claims." + p] ? "claims." + p : null) : CODE_LINK[p] ?? null
        if (!target) return <Fragment key={i}>{p}</Fragment>
        const title = target.startsWith("d.") ? decisionsById[target]?.title : itemsById[target]?.title
        return (
          <a key={i} href={"#" + anchor(target)} onClick={(e) => { e.preventDefault(); go(target) }} className="underline decoration-1 underline-offset-[3px] hover:no-underline" title={title}>
            {p}
          </a>
        )
      })}
    </>
  )
}

export function Chip({ c }: { c: any }) {
  const inner = (
    <>
      <span aria-hidden="true">{c.k === "book" ? "§" : c.k === "seen" ? "◎" : c.k === "pick" ? "?" : c.k === "proposal" ? "◇" : "✓"}</span>
      {c.label}
    </>
  )
  if (c.link)
    return (
      <a href={"#" + anchor(c.link)} onClick={(e) => { e.preventDefault(); go(c.link) }} className="chip hover:border-fg" title={c.detail || undefined}>
        {inner}
      </a>
    )
  return (
    <span className={cn("chip", c.k === "proposal" && "border-dashed")} title={c.detail || undefined}>
      {inner}
    </span>
  )
}

export function Chips({ list, extra }: { list?: any[]; extra?: ReactNode }) {
  if (!list?.length && !extra) return null
  return (
    <div className="flex flex-wrap gap-1.5 text-ink-muted">
      {(list ?? []).map((c) => <Chip key={c.label} c={c} />)}
      {extra}
    </div>
  )
}

export function Decider({ k }: { k: string }) {
  return <span className="chip text-ink-muted">{ui.deciders[k] ?? k}</span>
}

export function StatusPill({ status }: { status: string }) {
  const label = ui.status[status] ?? status
  const strong = status === "change" || status === "decided"
  return (
    <span className={cn("inline-flex items-center gap-1.5 border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em]", strong ? "border-fg bg-fg text-bg" : status === "discuss" ? "changed border-transparent" : "border-fg")}>
      <span aria-hidden="true">{status === "keep" || status === "decided" || status === "confirmed" ? "✓" : status === "change" ? "✎" : status === "discuss" ? "…" : "·"}</span>
      {label}
    </span>
  )
}

export function Who({ rec }: { rec: any }) {
  const { names } = useStore()
  if (!rec) return null
  const who = byLabel(rec.by)
  const rb = rec.uid ? names[rec.uid] : ""
  return (
    <span className="text-[13px] text-ink-muted">
      {who && <>{who} · </>}
      {fmtTime(rec.at)}
      {rb && <> · {L.recorded_by} {rb}</>}
    </span>
  )
}

export function Source({ it }: { it: any }) {
  const { view } = useStore()
  if (view !== "source") return null
  return (
    <div className="mt-2 grid gap-1 border-l-2 pl-3" style={{ borderColor: "var(--line)" }}>
      <p className="mono break-words text-ink-muted">
        {fileShort(it.file)}
        {it.line ? ` · ${L.line} ${it.line}` : it.path ? ` · ${it.path}` : ""} · {it.sha}
      </p>
      <pre className="mono whitespace-pre-wrap break-words text-ink-muted">{it.raw}</pre>
    </div>
  )
}

export function GroupHead({ g, count }: { g: any; count: number }) {
  return (
    <div className="grid gap-1 pt-2">
      {g.eyebrow && <p className="eyebrow text-ink-muted">{g.eyebrow}</p>}
      <h3 className="display text-[30px] leading-tight md:text-[34px]">
        {g.title}
        <span className="mono ml-3 align-middle text-ink-muted">{count}</span>
      </h3>
      {g.intro && <p className="max-w-[62ch] text-[15px] text-ink-muted">{g.intro}</p>}
      {g.facts?.length > 0 && <FactLine facts={g.facts} />}
    </div>
  )
}

export function FactLine({ facts }: { facts: any[] }) {
  return (
    <ul className="grid gap-1.5">
      {facts.map((f) => (
        <li key={f.quote} className="max-w-[66ch] border-l-2 pl-3 text-[14px] text-ink-muted" style={{ borderColor: "var(--line)" }}>
          <span>“{f.quote.replace(/`/g, "")}”</span> <span className="mono whitespace-nowrap">{fileShort(f.source)}</span>
        </li>
      ))}
    </ul>
  )
}
