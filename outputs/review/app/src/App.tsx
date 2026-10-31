import { useEffect, useState } from "react"
import { L, data, decisions, items, sections, ui } from "@/lib/data"
import { StoreProvider, useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Accent, Chip, go } from "@/components/bits"
import { DecisionCard } from "@/components/Decision"
import { SectionView, Points } from "@/components/Section"
import { Summary } from "@/components/Summary"
import { MarkImage } from "@/components/Item"

export default function App() {
  return (
    <StoreProvider>
      <Page />
    </StoreProvider>
  )
}

function Page() {
  const st = useStore()
  const content = sections.filter((s) => s.groups)
  return (
    <div className="min-h-screen bg-bg text-fg">
      <a href="#s-decisions" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-bg focus:p-2">{sections[1].nav}</a>
      <Header />
      <main className="gutter mx-auto grid max-w-page gap-16 pb-24 pt-8 md:pt-12">
        <Start />
        <section id="s-decisions" aria-labelledby="s-decisions-h" className="grid gap-6 border-t pt-12" style={{ borderColor: "var(--rule)" }}>
          <header className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:items-end md:gap-12">
            <div className="grid gap-3">
              <p className="eyebrow tabnums text-ink-muted"><span aria-hidden="true">01 · </span>{sections[1].nav}</p>
              <Accent id="s-decisions-h" parts={sections[1].title} className="text-[40px] leading-[1.02] md:text-[54px]" />
            </div>
            <p className="max-w-[62ch] text-[17px]">{sections[1].intro}</p>
          </header>
          <div className="grid">
            {decisions.map((d, i) => (decisionVisible(d, st) ? <DecisionCard key={d.id} d={d} n={i + 1} /> : null))}
          </div>
          <div className="border p-5 md:p-6" style={{ borderColor: "var(--fg)" }}>
            <Points section="decisions" />
          </div>
        </section>
        {content.map((s, i) => <SectionView key={s.id} s={s} n={i + 2} />)}
        <Summary n={content.length + 2} />
        <footer className="grid gap-1 border-t pt-6 text-[13px] text-ink-muted" style={{ borderColor: "var(--rule)" }}>
          <p>{ui.footer}</p>
          <p className="mono">
            {items.length} items · {decisions.length} decisions · build {data.stamp.build}
            {data.stamp.brand_home_commit ? ` · commit ${String(data.stamp.brand_home_commit).slice(0, 8)}` : ""} · {data.stamp.built_at}
          </p>
        </footer>
      </main>
    </div>
  )
}

function decisionVisible(d: any, st: any): boolean {
  const r = st.decisions[d.id]
  if (st.filter === "open") return !r || r.status !== "decided"
  if (st.filter === "changed") return r?.status === "decided"
  if (st.filter === "discuss") return r?.status === "discuss"
  return true
}

function Header() {
  const st = useStore()
  const decided = decisions.filter((d) => st.decisions[d.id]?.status === "decided").length
  const changes = items.filter((i) => st.decisions[i.id]?.status === "change").length
  const discuss = Object.values(st.decisions).filter((r: any) => r?.status === "discuss").length
  const [active, setActive] = useState("start")
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        let cur = sections[0].id
        for (const s of sections) {
          const el = document.getElementById("s-" + s.id)
          if (el && el.getBoundingClientRect().top <= 170) cur = s.id
        }
        setActive(cur)
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(`nav a[href="#s-${active}"]`)
    const nav = el?.closest(".scroll-x") as HTMLElement | null
    if (el && nav) nav.scrollTo({ left: Math.max(0, el.offsetLeft - 24), behavior: "smooth" })
  }, [active])
  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-40 border-b bg-bg" style={{ borderColor: "var(--rule)" }}>
      <div className="gutter mx-auto grid max-w-page gap-2 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <a href="#s-start" className="display text-[22px] leading-none" onClick={(e) => { e.preventDefault(); document.getElementById("s-start")?.scrollIntoView({ behavior: "smooth" }) }}>
            {ui.title}
          </a>
          <p className="tabnums text-[13px]" aria-live="polite">
            <span className="font-semibold">{decided}/{decisions.length}</span> {L.decided_count} · <span className="font-semibold">{changes}</span> {L.changes_count} · <span className="font-semibold">{discuss}</span> {L.discuss_count}
            {st.closed && <span className="ml-2 border border-fg px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em]">{ui.summary.closed}</span>}
          </p>
        </div>
        <nav aria-label="Sections" className="scroll-x -mx-1">
          <ul className="flex min-w-max gap-1 px-1">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={"#s-" + s.id}
                  aria-current={active === s.id ? "true" : undefined}
                  className={cn("block border px-2.5 py-1 text-[12px] uppercase tracking-[0.1em]", active === s.id ? "border-fg bg-fg text-bg" : "border-transparent hover:border-fg")}
                >
                  {s.nav}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px]">
          <Seg label={ui.deciding} value={st.by} options={ui.by} onChange={(v) => st.setBy(v as any)} />
          <label className="flex items-center gap-2">
            <span className="uppercase tracking-[0.12em] text-ink-muted">{ui.show}</span>
            <select className="min-h-[30px] border border-line bg-bg px-2 py-1 text-[12px] hover:border-fg" value={st.filter} onChange={(e) => st.setFilter(e.target.value)}>
              {ui.filters.map((f: any) => <option key={f.id} value={f.id}>{f.label}</option>)}
            </select>
          </label>
          <button type="button" aria-pressed={st.view === "source"} onClick={() => st.setView(st.view === "source" ? "plain" : "source")}
            className={cn("min-h-[30px] border px-2.5 py-1", st.view === "source" ? "border-fg bg-fg text-bg" : "border-line hover:border-fg")}>
            {ui.btn.source}
          </button>
        </div>
      </div>
      {(st.mode !== "live" || st.error || st.closed) && (
        <div className="gutter mx-auto max-w-page pb-2">
          <p className="changed px-3 py-1.5 text-[13px]" role="status">
            {st.error ?? (st.mode === "loading" ? ui.db.loading : st.mode === "offline" ? ui.db.offline : st.mode === "readonly" ? ui.db.readonly : ui.db.closed)}
          </p>
        </div>
      )}
    </header>
  )
}

function Seg({ label, value, options, onChange }: { label: string; value: string; options: any[]; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="uppercase tracking-[0.12em] text-ink-muted">{label}</span>}
      <div role="group" aria-label={label || undefined} className="flex">
        {options.map((o, i) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={value === o.id}
            onClick={() => onChange(o.id)}
            className={cn("min-h-[30px] border px-2.5 py-1", i > 0 && "-ml-px", value === o.id ? "border-fg bg-fg text-bg" : "border-line hover:border-fg")}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function Start() {
  const st = useStore()
  return (
    <section id="s-start" aria-labelledby="s-start-h" className="grid gap-10">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-end md:gap-12">
        <div className="grid gap-5">
          <p className="eyebrow text-ink-muted">{ui.eyebrow}</p>
          <Accent as="h1" id="s-start-h" parts={ui.headline} className="text-[52px] leading-[0.98] md:text-[84px]" />
          <p className="max-w-[56ch] text-[18px] leading-relaxed">{ui.lede}</p>
        </div>
        <MarkImage file="wordmark.svg" label="High Light Rituals wordmark" className="h-[150px] [&_span]:max-w-[300px]" />
      </div>

      <div className="grid gap-8 md:grid-cols-3 md:gap-10">
        <div className="grid content-start gap-3">
          <p className="eyebrow">{ui.how_title}</p>
          <ol className="grid gap-3">
            {ui.how.map((h: string, i: number) => (
              <li key={i} className="grid grid-cols-[28px_minmax(0,1fr)] gap-2 text-[15px]">
                <span className="display tabnums text-[22px] leading-none text-ink-muted">{i + 1}</span>
                <span>{h}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="grid content-start gap-3">
          <p className="eyebrow">{ui.who_title}</p>
          <ul className="grid gap-3">
            {ui.who.map((w: any) => (
              <li key={w.k} className="grid gap-0.5 text-[15px]">
                <span className="font-semibold">{w.label}</span>
                <span className="text-ink-muted">{w.text}</span>
              </li>
            ))}
          </ul>
          <p className="text-[13px] text-ink-muted">
            {ui.recording_as}: <span className="font-semibold text-fg">{st.me?.name || "?"}</span> · {ui.deciding}: <span className="font-semibold text-fg">{ui.by.find((b: any) => b.id === st.by)?.label}</span>
          </p>
        </div>
        <div className="grid content-start gap-3">
          <p className="eyebrow">{ui.legend_title}</p>
          <ul className="grid gap-2">
            {ui.legend.map((l: any) => (
              <li key={l.k} className="grid gap-1 text-[14px]">
                <span><Chip c={{ k: l.k, label: l.label }} /></span>
                <span className="text-ink-muted">{l.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="border-l-2 pl-3 text-[14px]" style={{ borderColor: "var(--fg)" }}>{ui.license_flag}</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-solid" onClick={() => go("d.c2")}>{sections[1].nav}</button>
        <button type="button" className="btn" onClick={() => { st.setFilter("open"); setTimeout(() => go("d.c2"), 50) }}>{ui.filters[1].label}</button>
      </div>
    </section>
  )
}
