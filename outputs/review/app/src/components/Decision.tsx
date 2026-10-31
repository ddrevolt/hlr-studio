import { useEffect, useState } from "react"
import { L, anchor, answerText, fileShort, itemsById, ui } from "@/lib/data"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Decider, StatusPill, Who, go } from "@/components/bits"
import { Specimen } from "@/components/Item"

export function DecisionCard({ d, n }: { d: any; n: number }) {
  const st = useStore()
  const rec = st.decisions[d.id]
  const [vals, setVals] = useState<Record<string, any>>(rec?.value ?? {})
  const [note, setNote] = useState<string>(rec?.note ?? "")
  const [dirty, setDirty] = useState(false)
  const busy = !!st.saving["decisions/" + d.id]
  const off = !st.canWrite || busy

  useEffect(() => {
    if (!dirty) {
      setVals(rec?.value ?? {})
      setNote(rec?.note ?? "")
    }
  }, [rec, dirty])

  const set = (k: string, v: any) => {
    setVals((x) => ({ ...x, [k]: v }))
    setDirty(true)
  }
  const save = async (status: string) => {
    const ok = await st.saveDecision(d.id, { kind: "decision", status, value: vals, note: note.trim() })
    if (ok) setDirty(false)
  }
  const answered = d.fields.some((f: any) => {
    const v = vals[f.id]
    return v != null && v !== "" && !(Array.isArray(v) && !v.length)
  })

  return (
    <article id={anchor(d.id)} className="grid gap-5 border-t py-8 md:grid-cols-[64px_minmax(0,1fr)] md:gap-6" style={{ borderColor: "var(--rule)" }}>
      <p className="display tabnums text-[40px] leading-none text-ink-muted" aria-hidden="true">{String(n).padStart(2, "0")}</p>
      <div className="grid gap-4">
        <header className="grid gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {d.code && <span className="mono">{d.code}</span>}
            <Decider k={d.decider} />
            {d.pick && <span className="chip border-fg">{L.flagged_r1}</span>}
            {rec && <StatusPill status={rec.status} />}
            {rec && <Who rec={rec} />}
          </div>
          <h3 className="display text-[30px] leading-[1.08] md:text-[36px]" data-focus>{d.title}</h3>
          <p className="max-w-[62ch] text-[18px] leading-snug">{d.ask}</p>
          <p className="max-w-[62ch] text-[15px] text-ink-muted">{d.why}</p>
        </header>

        <details className="group border-l-2 pl-3" style={{ borderColor: "var(--line)" }}>
          <summary className="cursor-pointer text-[13px] font-semibold uppercase tracking-[0.12em] marker:content-none">
            <span className="mr-1 inline-block transition-transform group-open:rotate-90" aria-hidden="true">›</span>
            {L.now}
          </summary>
          <ul className="mt-2 grid gap-2">
            {d.facts.map((f: any) => (
              <li key={f.quote} className="grid gap-0.5 text-[15px]">
                <span>“{f.quote.replace(/`/g, "")}”</span>
                <span className="mono text-ink-muted">{fileShort(f.source)}</span>
              </li>
            ))}
          </ul>
          {d.items?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {d.items.map((id: string) => itemsById[id] && (
                <a key={id} href={"#" + anchor(id)} onClick={(e) => { e.preventDefault(); go(id) }} className="chip hover:border-fg">
                  {itemsById[id].title || itemsById[id].text.slice(0, 40)}
                </a>
              ))}
            </div>
          )}
        </details>

        {d.specimens?.length > 0 && (
          <div className="grid gap-1.5">
            {d.specimens.map((s: string) => <Specimen key={s} name={s} />)}
          </div>
        )}
        {d.swatches?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {d.swatches.map((s: any) => (
              <div key={s.hex} className="grid w-[92px] gap-1">
                <div className="h-12 border" style={{ background: s.hex, borderColor: "var(--line)" }} aria-hidden="true" />
                <span className="text-[12px] leading-tight">{s.name}</span>
                <span className="mono text-ink-muted">{s.hex}</span>
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-4">
          {d.fields.map((f: any) => (
            <Field key={f.id} f={f} v={vals[f.id]} onChange={(v) => set(f.id, v)} disabled={off} name={d.id + "." + f.id} />
          ))}
          <label className="grid gap-1">
            <span className="text-[13px] font-semibold uppercase tracking-[0.12em]">{L.note}</span>
            <textarea className="field min-h-[64px]" value={note} disabled={off} placeholder={L.note_placeholder} onChange={(e) => { setNote(e.target.value); setDirty(true) }} />
          </label>
        </div>

        {st.mode !== "offline" && (
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className="btn btn-solid" disabled={off || !answered || (!dirty && rec?.status === "decided")} onClick={() => save("decided")}>{ui.btn.record}</button>
            <button type="button" className="btn btn-quiet" disabled={off || rec?.status === "discuss"} onClick={() => save("discuss")}>{ui.btn.discuss}</button>
            {rec && (
              <button type="button" className="btn btn-quiet" disabled={off} onClick={async () => { if (await st.saveDecision(d.id, null)) { setVals({}); setNote(""); setDirty(false) } }}>
                {ui.btn.clear}
              </button>
            )}
            {dirty && <span className="text-[13px] text-ink-muted">{L.unsaved}</span>}
          </div>
        )}
        {rec?.status === "decided" && !dirty && (
          <p className="changed whitespace-pre-wrap p-3 text-[15px]">{answerText(d, rec.value)}</p>
        )}
        <p className="text-[13px] text-ink-muted">
          <span className="font-semibold">{L.applies}: </span>
          {d.applies}
        </p>
      </div>
    </article>
  )
}

function Field({ f, v, onChange, disabled, name }: { f: any; v: any; onChange: (v: any) => void; disabled: boolean; name: string }) {
  if (f.type === "text")
    return (
      <label className="grid gap-1">
        <span className="text-[13px] font-semibold uppercase tracking-[0.12em]">{f.label}</span>
        <input className="field" value={v ?? ""} disabled={disabled} onChange={(e) => onChange(e.target.value)} />
      </label>
    )
  const multi = f.type === "checks"
  const list: string[] = multi ? (Array.isArray(v) ? v : []) : []
  return (
    <fieldset className="grid gap-1.5">
      <legend className="mb-1.5 text-[13px] font-semibold uppercase tracking-[0.12em]">{f.label}</legend>
      <div className={cn("grid gap-1.5", f.options.length > 4 && "sm:grid-cols-2")} role={multi ? "group" : "radiogroup"} aria-label={f.label}>
        {f.options.map((o: any) => {
          const on = multi ? list.includes(o.id) : v === o.id
          return (
            <button
              key={o.id}
              type="button"
              role={multi ? "checkbox" : "radio"}
              aria-checked={on}
              name={name}
              disabled={disabled}
              className="opt"
              onClick={() => (multi ? onChange(on ? list.filter((x) => x !== o.id) : [...list, o.id]) : onChange(on ? null : o.id))}
            >
              <span className="mark" aria-hidden="true">{on ? (multi ? "✓" : "●") : ""}</span>
              <span>{o.label}</span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
