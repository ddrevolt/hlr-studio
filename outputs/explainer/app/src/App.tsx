import { useEffect, useMemo, useState } from "react"
import { content, data, safeGet, safeSet, UICtx, type Mode } from "@/lib/content"
import { Accent } from "@/components/bits"
import SystemSection from "@/components/SystemSection"
import Journey from "@/components/Journey"
import Rulebook, { CardSheet } from "@/components/Rulebook"
import Changes from "@/components/Changes"
import Compare from "@/components/Compare"
import Check from "@/components/Check"
import { cn } from "@/lib/utils"

function ModeSwitch({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  return (
    <div role="group" aria-label="Detail" className="flex shrink-0 border border-fg">
      {(["plain", "technical"] as Mode[]).map((m) => (
        <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}
          className={cn("px-2.5 py-1 text-[12px] uppercase tracking-[0.12em]", mode === m ? "bg-fg text-bg" : "text-fg hover:bg-surface")}>
          {m === "plain" ? "Plain" : "Technical"}
        </button>
      ))}
    </div>
  )
}

export default function App() {
  const [mode, setModeState] = useState<Mode>(() => (safeGet("hlr-guide-mode") as Mode) || "plain")
  const [reader, setReaderState] = useState<string | null>(() => safeGet("hlr-guide-reader"))
  const [cardId, setCardId] = useState<string | null>(null)
  const setMode = (m: Mode) => { setModeState(m); safeSet("hlr-guide-mode", m) }
  const ctx = useMemo(() => ({ mode, setMode, openCard: (id: string) => setCardId(id) }), [mode])
  const meta = content.meta
  const stamp = data.stamp

  useEffect(() => {
    const id = window.location.hash.replace("#", "")
    if (id && content.nav.some((n: any) => n.id === id)) {
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView())
    }
  }, [])

  const pickReader = (r: any) => {
    setReaderState(r.id); safeSet("hlr-guide-reader", r.id); setMode(r.mode)
  }
  const chosen = content.readers.find((r: any) => r.id === reader)
  const built = (stamp?.built_at || "").slice(0, 10)
  const commit = (stamp?.brand_home_commit || "").slice(0, 7)

  return (
    <UICtx.Provider value={ctx}>
      <a href="#journey" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-bg focus:p-2">Skip to the journey</a>
      <header className="sticky z-40 border-b hair bg-bg" style={{ top: "env(safe-area-inset-top, 0px)" }}>
        <div className="gutter mx-auto flex max-w-page flex-wrap items-center gap-x-6 gap-y-2 py-3">
          <a href="#top" className="eyebrow shrink-0 font-semibold">HLR Forge Guide</a>
          <nav aria-label="Sections" className="scroll-x order-3 w-full md:order-none md:w-auto md:flex-1">
            <ul className="flex min-w-max gap-5 text-[13px]">
              {content.nav.map((n: any) => (
                <li key={n.id}><a href={`#${n.id}`} className="text-ink-muted underline-offset-4 hover:text-fg hover:underline">{n.label}</a></li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto"><ModeSwitch mode={mode} setMode={setMode} /></div>
        </div>
      </header>

      <main id="top" className="gutter mx-auto grid max-w-page gap-24 pb-24 pt-14 md:gap-32 md:pt-20">
        <section aria-labelledby="hero-h" className="grid gap-10">
          <div className="grid gap-6">
            <p className="eyebrow text-ink-muted">{meta.eyebrow}</p>
            <Accent id="hero-h" parts={meta.headline} as="h1" className="text-[56px] leading-[0.98] md:text-[96px]" />
            <p className="max-w-[60ch] text-[19px] leading-relaxed md:text-[21px]">{meta.lede}</p>
          </div>
          <div className="grid gap-4 border-t hair pt-6">
            <p className="eyebrow text-ink-muted">Who’s reading?</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {content.readers.map((r: any) => (
                <button key={r.id} type="button" aria-pressed={reader === r.id} onClick={() => pickReader(r)}
                  className={cn("grid gap-1 border p-4 text-left", reader === r.id ? "border-fg bg-fg text-bg" : "border-line hover:border-fg")}>
                  <span className="text-[17px] font-semibold">{r.label}</span>
                  <span className={cn("text-[14px]", reader === r.id ? "" : "text-ink-muted")}>{r.hint}</span>
                </button>
              ))}
            </div>
            {chosen && (
              <p className="text-[15px]" aria-live="polite">
                {mode === "technical" ? "Technical detail is on. " : "Plain language is on. "}
                <a href={`#${chosen.start}`} className="underline underline-offset-4">Start with {content.nav.find((n: any) => n.id === chosen.start)?.label.toLowerCase()} →</a>
              </p>
            )}
          </div>
          <p className="mono text-ink-muted">
            Built from the pack {built} · brand home {commit || "copy"} · {stamp?.engine} · {Object.keys(stamp?.sources || {}).length} source files checked
          </p>
        </section>

        <SystemSection />
        <Journey />
        <Rulebook />
        <Changes />
        <Compare />
        <Check />
      </main>

      <footer className="border-t hair">
        <div className="gutter mx-auto grid max-w-page gap-4 py-10 text-[14px] text-ink-muted md:grid-cols-2 md:gap-12">
          <p>{meta.fonts_note}</p>
          <p>
            Every quoted line on this page is checked against its source file by the explainer’s drift guard, and every number is counted from the pack when the page is built.
            Rebuild after each gate: <span className="mono">build_data.py</span>, then the bundle.
          </p>
        </div>
      </footer>

      <CardSheet id={cardId} onClose={() => setCardId(null)} />
    </UICtx.Provider>
  )
}
