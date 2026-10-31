import { useEffect, useState } from "react"
import { assets } from "@/data/assets"
import { L, anchor, currentValue, ui, valueText } from "@/lib/data"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Chips, Decider, Linked, Source, StatusPill, Who } from "@/components/bits"

/* One pack item: what it says, where it came from, and the controls to keep it, change it or park it. */
export function Item({ it }: { it: any }) {
  const st = useStore()
  const rec = st.decisions[it.id]
  const confirmed = !rec && !!st.sections[it.section]
  const [editing, setEditing] = useState(false)
  return (
    <article id={anchor(it.id)} className={cn("grid gap-4 border-t py-5", !editing && "md:grid-cols-[minmax(0,1fr)_228px] md:gap-10")} style={{ borderColor: "var(--line)" }}>
      <div className="grid min-w-0 content-start gap-3">
        <Body it={it} rec={rec} />
        <div className="flex flex-wrap items-center gap-2">
          <Chips list={it.prov} extra={<Decider k={it.decider} />} />
          {it.review1 && <span className="chip border-fg">{L.flagged_r1}</span>}
        </div>
        <Source it={it} />
      </div>
      <Controls it={it} rec={rec} confirmed={confirmed} editing={editing} setEditing={setEditing} />
    </article>
  )
}

function Title({ children, className }: { children: any; className?: string }) {
  if (!children) return null
  return <h4 className={cn("text-[13px] font-semibold uppercase tracking-[0.12em]", className)}>{children}</h4>
}

function Body({ it, rec }: { it: any; rec: any }) {
  const changed = rec?.status === "change" ? rec.value : undefined
  switch (it.kind) {
    case "check":
      return (
        <div className="grid gap-1.5">
          <Title>{it.title}</Title>
          <p className={cn("display text-[24px] leading-snug md:text-[27px]", changed != null && "strike")}>{it.text}</p>
          <Changed it={it} v={changed} />
        </div>
      )
    case "quotes":
      return (
        <div className="grid gap-2">
          <Title>{it.title}</Title>
          <ul className={cn("grid gap-3", changed != null && "strike")}>
            {it.entries.map((e: any) => (
              <li key={e.quote} className="grid gap-0.5">
                <span className="display text-[21px] leading-snug">“{e.quote}”</span>
                <span className="text-[13px] text-ink-muted">{e.src}</span>
              </li>
            ))}
          </ul>
          <Changed it={it} v={changed} />
        </div>
      )
    case "notlike":
      return (
        <div className="grid gap-2">
          <Title>{it.title}</Title>
          <ul className={cn("grid gap-2", changed != null && "strike")}>
            {it.entries.map((e: any) => (
              <li key={e.quote} className="flex flex-wrap items-baseline gap-x-3">
                <span className="display text-[19px] leading-snug text-ink-muted line-through decoration-1">“{e.quote}”</span>
                <span className="chip">{e.why}</span>
              </li>
            ))}
          </ul>
          <Changed it={it} v={changed} />
        </div>
      )
    case "claim":
      return <Claim it={it} changed={changed} />
    case "never":
      return (
        <div className="grid gap-1.5">
          <p className="text-[17px] font-semibold leading-snug">{it.title}</p>
          <p className={cn("max-w-[66ch]", changed != null && "strike")}>
            <Linked text={it.text} />
          </p>
          <Changed it={it} v={changed} />
        </div>
      )
    case "color":
      return (
        <div className="grid gap-3 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-5">
          <div className="h-[96px] border sm:h-[120px]" style={{ background: it.hex, borderColor: "var(--line)" }} aria-hidden="true" />
          <div className="grid content-start gap-1.5">
            <p className="display text-[28px] leading-none">{it.title}</p>
            <p className="mono tabnums text-ink-muted">
              {it.hex}
              {it.cmyk && ` · ${L.cmyk} ${it.cmyk}`}
              {it.pantone && ` · ${it.pantone}`}
            </p>
            <p className={cn("max-w-[62ch] text-[15px]", changed != null && "strike")}>
              <Linked text={it.text} />
            </p>
            <Changed it={it} v={changed} />
          </div>
        </div>
      )
    case "ramp":
      return (
        <div className="grid gap-2">
          <p className="display text-[28px] leading-none">{it.title}</p>
          <div className="grid grid-cols-5 gap-1 sm:grid-cols-10">
            {it.ramp.map((r: any) => (
              <div key={r.name} className="grid gap-1">
                <div className="h-12 border" style={{ background: r.hex, borderColor: "var(--line)" }} aria-hidden="true" />
                <span className="mono tabnums text-ink-muted">{r.name.replace("neutral-", "")}</span>
              </div>
            ))}
          </div>
          <p className={cn("max-w-[62ch] text-[15px]", changed != null && "strike")}>{it.text}</p>
          <Changed it={it} v={changed} />
        </div>
      )
    case "ground":
      return <Ground it={it} changed={changed} />
    case "face":
      return (
        <div className="grid gap-1.5">
          <p className="display text-[30px] leading-none">{it.title}</p>
          <p className={cn("max-w-[64ch] text-[15px]", changed != null && "strike")}>
            <Linked text={it.text} />
          </p>
          <Changed it={it} v={changed} />
        </div>
      )
    case "typerole":
      return (
        <div className="grid gap-2">
          <Title>{it.title}</Title>
          {it.specimen && <Specimen name={it.specimen} />}
          <Fields it={it} changed={changed} keys={["face", "case", "leading", "where"]} />
        </div>
      )
    case "table":
      return (
        <div className="grid gap-2">
          <Title>{it.title}</Title>
          <div className="scroll-x">
            <table className="w-full min-w-[420px] border-collapse text-left text-[14px]">
              <thead>
                <tr>{it.table.head.map((h: string) => <th key={h} className="border-b px-2 py-1.5 font-semibold" style={{ borderColor: "var(--rule)" }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {it.table.rows.map((r: string[]) => (
                  <tr key={r[0]}>{r.map((c, i) => <td key={i} className="tabnums border-b px-2 py-1.5" style={{ borderColor: "var(--line)" }}>{c}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
          <Changed it={it} v={changed} />
        </div>
      )
    case "mark":
      return (
        <div className="grid gap-3 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-5">
          <MarkImage file={it.image} label={it.title} />
          <div className="grid content-start gap-1">
            <Title>{it.title}</Title>
            <Fields it={it} changed={changed} keys={["role", "state"]} />
          </div>
        </div>
      )
    case "photocard":
      return (
        <div className="grid gap-2">
          <Title>{it.title}</Title>
          <Fields it={it} changed={changed} keys={["light", "colour", "styling", "live"]} />
        </div>
      )
    case "registry":
      return (
        <div className="grid gap-1">
          <p className="text-[17px] font-semibold leading-snug">{it.title}</p>
          {(it.formats?.length > 0 || it.cadence) && (
            <p className="text-[13px] text-ink-muted">
              {it.formats?.length > 0 && <>{L.formats}: {it.formats.join(", ")}</>}
              {it.cadence && <>{L.cadence}: {it.cadence}</>}
            </p>
          )}
          {it.text && <p className={cn("max-w-[64ch] text-[15px]", changed != null && "strike")}><Linked text={it.text} /></p>}
          <Changed it={it} v={changed} />
        </div>
      )
    default:
      return (
        <div className="grid gap-1.5">
          <Title>{it.title}</Title>
          <p className={cn("max-w-[66ch] text-[16px] leading-relaxed", changed != null && "strike")}>
            <Linked text={it.text} />
          </p>
          <Changed it={it} v={changed} />
        </div>
      )
  }
}

function Changed({ it, v }: { it: any; v: any }) {
  if (v == null) return null
  return (
    <div className="changed grid gap-1 p-3">
      <p className="eyebrow">{L.now_reads}</p>
      <p className="whitespace-pre-wrap text-[16px]">{valueText(it, v)}</p>
    </div>
  )
}

function Fields({ it, changed, keys }: { it: any; changed: any; keys: string[] }) {
  return (
    <dl className="grid gap-x-4 gap-y-1 text-[15px] sm:grid-cols-[150px_minmax(0,1fr)]">
      {keys
        .filter((k) => it.fields?.[k] || changed?.[k])
        .map((k) => {
          const now = changed?.[k]
          const diff = now != null && now !== it.fields?.[k]
          return (
            <div key={k} className="contents">
              <dt className="text-[13px] text-ink-muted sm:pt-0.5">{L[k] ?? k}</dt>
              <dd className="max-w-[60ch]">
                <span className={cn(diff && "strike")}><Linked text={it.fields?.[k] ?? ""} /></span>
                {diff && <span className="changed ml-1 block px-1.5 py-0.5">{now}</span>}
              </dd>
            </div>
          )
        })}
    </dl>
  )
}

function Claim({ it, changed }: { it: any; changed: any }) {
  const c = it.claim
  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="mono">{c.code}</span>
        <p className="text-[18px] font-semibold leading-snug">{it.title}</p>
      </div>
      <dl className="grid gap-x-4 gap-y-1.5 text-[15px] sm:grid-cols-[150px_minmax(0,1fr)]">
        <dt className="text-[13px] text-ink-muted sm:pt-0.5">{L.requires}</dt>
        <dd className="max-w-[62ch]">
          <span className={cn(changed != null && "strike")}><Linked text={c.requires} /></span>
        </dd>
        {c.words?.length > 0 && (
          <>
            <dt className="text-[13px] text-ink-muted sm:pt-0.5">{L.words_watched}</dt>
            <dd className="max-w-[62ch] text-[14px]">
              {c.words.join(", ")}
              {c.patterns > 0 && <span className="text-ink-muted"> · {c.patterns} {L.patterns}</span>}
            </dd>
          </>
        )}
        <dt className="text-[13px] text-ink-muted sm:pt-0.5">{L.evidence}</dt>
        <dd className="max-w-[62ch] text-[14px] text-ink-muted"><Linked text={c.evidence} /></dd>
        <dt className="text-[13px] text-ink-muted sm:pt-0.5">{L.ruling}</dt>
        <dd className="max-w-[62ch] text-[14px]">{c.ruling ?? L.no_ruling}</dd>
      </dl>
      {c.required_language && (
        <div className="paper grid gap-1 p-4">
          <p className="eyebrow">{L.required_text}</p>
          <p className="text-[15px]">{c.required_language}</p>
        </div>
      )}
      <Changed it={it} v={changed} />
    </div>
  )
}

function Ground({ it, changed }: { it: any; changed: any }) {
  const g = it.ground
  const photo = !g.hex
  return (
    <div className="grid gap-3 sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-5">
      <div
        className="grid h-[112px] content-end gap-0.5 border p-3"
        style={{ background: photo ? "repeating-linear-gradient(135deg, #8a8580 0 8px, #6f6a65 8px 16px)" : g.hex, color: g.ink_hex ?? "#ffffff", borderColor: "var(--line)" }}
        aria-hidden="true"
      >
        <span className="display text-[34px] leading-none">Aa</span>
        <span className="text-[12px]">{g.ink}</span>
      </div>
      <div className="grid content-start gap-1.5">
        <p className="display text-[26px] leading-tight">{g.name}</p>
        {g.mode && <p className="mono text-ink-muted">{L.mode}: {g.mode}</p>}
        <dl className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-4 gap-y-0.5 text-[14px]">
          <dt className="text-ink-muted">{L.ink}</dt>
          <dd>{g.ink}</dd>
          <dt className="text-ink-muted">{L.ratio}</dt>
          <dd className="tabnums">{g.ratio}</dd>
          <dt className="text-ink-muted">{L.body}</dt>
          <dd>{g.body}</dd>
          {g.display && (
            <>
              <dt className="text-ink-muted">{L.display}</dt>
              <dd>{g.display}</dd>
            </>
          )}
          <dt className="text-ink-muted">{L.accent}</dt>
          <dd>{g.accent}</dd>
        </dl>
        <Changed it={it} v={changed} />
      </div>
    </div>
  )
}

export function Specimen({ name, className }: { name: string; className?: string }) {
  const s = assets.specimens[name]
  if (!s) return null
  return (
    <div className={cn("paper border", className)} style={{ borderColor: "var(--line)" }}>
      <img src={s.src} width={s.w} height={s.h} alt={s.text} className="block h-auto max-w-full" style={{ width: s.w }} />
    </div>
  )
}

export function MarkImage({ file, label, className }: { file: string; label: string; className?: string }) {
  const m = assets.marks[file]
  if (!m) return null
  return (
    <div className={cn("paper flex h-[140px] items-center justify-center border p-5", className)} style={{ borderColor: "var(--line)" }}>
      {m.svg ? (
        <span role="img" aria-label={label} className="block w-full max-w-[170px] text-[var(--hlr-color-brand-onyx)]" dangerouslySetInnerHTML={{ __html: m.svg }} />
      ) : (
        <img src={m.src} alt={label} className="max-h-full max-w-full object-contain" />
      )}
    </div>
  )
}

/* Keep, change or park one item. */
function Controls({ it, rec, confirmed, editing, setEditing }: { it: any; rec: any; confirmed: boolean; editing: boolean; setEditing: (b: boolean) => void }) {
  const st = useStore()
  const [draft, setDraft] = useState<any>(null)
  const [note, setNote] = useState("")
  const [noteOpen, setNoteOpen] = useState(false)
  const busy = !!st.saving["decisions/" + it.id]
  const off = !st.canWrite || busy

  useEffect(() => {
    if (!editing) setNote(rec?.note ?? "")
  }, [rec, editing])

  const start = () => {
    setDraft(rec?.status === "change" && rec.value != null ? rec.value : currentValue(it))
    setNote(rec?.note ?? "")
    setEditing(true)
  }
  const save = async (status: string, value: any = null) => {
    const ok = await st.saveDecision(it.id, { kind: "item", status, value, note: note.trim() })
    if (ok) {
      setEditing(false)
      setNoteOpen(false)
    }
  }

  if (editing)
    return (
      <div className="grid gap-3 border p-3" style={{ borderColor: "var(--fg)" }}>
        <p className="eyebrow">{L.your_edit}</p>
        <Editor it={it} value={draft} onChange={setDraft} />
        <label className="grid gap-1">
          <span className="text-[13px] text-ink-muted">{L.note}</span>
          <textarea className="field min-h-[60px]" value={note} placeholder={L.note_placeholder} onChange={(e) => setNote(e.target.value)} />
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-solid" disabled={off} onClick={() => save("change", draft)}>{ui.btn.save}</button>
          <button type="button" className="btn btn-quiet" onClick={() => setEditing(false)}>{ui.btn.cancel}</button>
        </div>
      </div>
    )

  return (
    <div className="grid content-start gap-2 md:border-l md:pl-5" style={{ borderColor: "var(--line)" }}>
      <div className="flex flex-wrap items-center gap-2">
        {rec ? <StatusPill status={rec.status} /> : confirmed ? <StatusPill status="confirmed" /> : <span className="text-[12px] uppercase tracking-[0.12em] text-ink-muted md:block hidden">{ui.status.none}</span>}
        {rec && <Who rec={rec} />}
      </div>
      {rec?.note && <p className="max-w-[62ch] border-l-2 pl-3 text-[14px]" style={{ borderColor: "var(--fg)" }}>{rec.note}</p>}
      {st.mode !== "offline" && (
        <div className="flex flex-wrap gap-2">
          {(!rec || rec.status !== "keep") && <button type="button" className="btn btn-quiet" disabled={off} onClick={() => save("keep", null)}>{ui.btn.keep}</button>}
          <button type="button" className="btn btn-quiet" disabled={off} onClick={start}>{ui.btn.change}</button>
          {(!rec || rec.status !== "discuss") && (
            <button type="button" className="btn btn-quiet" disabled={off} onClick={() => (noteOpen ? save("discuss", null) : setNoteOpen(true))}>
              {ui.btn.discuss}
            </button>
          )}
          {rec && <button type="button" className="btn btn-quiet" disabled={off} onClick={() => st.saveDecision(it.id, null)}>{ui.btn.clear}</button>}
        </div>
      )}
      {noteOpen && (
        <div className="grid gap-2">
          <label className="grid gap-1">
            <span className="text-[13px] text-ink-muted">{L.note}</span>
            <textarea className="field min-h-[60px]" value={note} placeholder={L.note_placeholder} onChange={(e) => setNote(e.target.value)} autoFocus />
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-solid" disabled={off} onClick={() => save("discuss", null)}>{ui.btn.discuss}</button>
            <button type="button" className="btn btn-quiet" onClick={() => setNoteOpen(false)}>{ui.btn.cancel}</button>
          </div>
        </div>
      )}
    </div>
  )
}

function Editor({ it, value, onChange }: { it: any; value: any; onChange: (v: any) => void }) {
  if (it.edit === "fields") {
    return (
      <div className="grid gap-2">
        {Object.keys(it.fields ?? {}).map((k) => (
          <label key={k} className="grid gap-1">
            <span className="text-[13px] text-ink-muted">{L[k] ?? k}</span>
            <textarea className="field min-h-[44px]" value={value?.[k] ?? ""} onChange={(e) => onChange({ ...value, [k]: e.target.value })} />
          </label>
        ))}
      </div>
    )
  }
  if (it.edit === "hex") {
    const ok = /^#[0-9a-fA-F]{6}$/.test(value?.hex ?? "")
    return (
      <div className="grid gap-2">
        <label className="grid gap-1">
          <span className="text-[13px] text-ink-muted">{L.hex}</span>
          <span className="flex items-center gap-2">
            <input className="field mono max-w-[160px]" value={value?.hex ?? ""} onChange={(e) => onChange({ ...value, hex: e.target.value.trim() })} />
            <span className="h-9 w-14 border" style={{ background: ok ? value.hex : "transparent", borderColor: "var(--line)" }} aria-hidden="true" />
          </span>
        </label>
        <label className="grid gap-1">
          <span className="text-[13px] text-ink-muted">{L.role}</span>
          <textarea className="field min-h-[88px]" value={value?.text ?? ""} onChange={(e) => onChange({ ...value, text: e.target.value })} />
        </label>
      </div>
    )
  }
  return (
    <textarea
      className="field min-h-[120px]"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      aria-label={L.your_edit}
      rows={Math.min(12, Math.max(3, String(value ?? "").split("\n").length + 1))}
    />
  )
}
