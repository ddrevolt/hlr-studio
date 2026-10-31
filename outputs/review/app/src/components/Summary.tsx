import { useMemo, useRef } from "react"
import { L, answerText, byLabel, currentValue, decisions, fileShort, fmtTime, items, itemsById, sectionTitle, sections, ui, valueText } from "@/lib/data"
import { useStore } from "@/lib/store"
import { Accent, StatusPill, Who, go } from "@/components/bits"

export function Summary({ n }: { n: number }) {
  const st = useStore()
  const S = ui.summary
  const ta = useRef<HTMLTextAreaElement>(null)

  const decided = decisions.filter((d) => st.decisions[d.id])
  const changes = items.filter((i) => st.decisions[i.id]?.status === "change")
  const discussI = items.filter((i) => st.decisions[i.id]?.status === "discuss")
  const keeps = items.filter((i) => st.decisions[i.id]?.status === "keep")
  const confirmed = sections.filter((s) => st.sections[s.id])
  const notes = [...st.notes].sort((a, b) => String(a.data.at).localeCompare(String(b.data.at)))

  const text = useMemo(() => {
    const who = (r: any) => [byLabel(r.by), fmtTime(r.at)].filter(Boolean).join(", ")
    const out: string[] = [`${ui.title}: ${ui.eyebrow}`, ""]
    out.push(`${S.decisions.toUpperCase()}`)
    for (const d of decisions) {
      const r = st.decisions[d.id]
      if (!r) continue
      out.push(`${d.code ? d.code + " " : ""}${d.title} [${ui.status[r.status] ?? r.status}] (${who(r)})`)
      const a = answerText(d, r.value)
      if (a) out.push(...a.split("\n").map((x) => "  " + x))
      if (r.note) out.push("  " + L.note + ": " + r.note)
    }
    out.push("", S.changes.toUpperCase())
    for (const i of changes) {
      const r = st.decisions[i.id]
      out.push(`${sectionTitle(i.section)} / ${i.title || i.id} (${fileShort(i.file)}${i.line ? " " + L.line + " " + i.line : ""}) (${who(r)})`)
      out.push("  " + L.was + ": " + valueText(i, currentValue(i)).replace(/\n/g, "\n  "))
      out.push("  " + L.now_reads + ": " + valueText(i, r.value).replace(/\n/g, "\n  "))
      if (r.note) out.push("  " + L.note + ": " + r.note)
    }
    out.push("", S.discuss.toUpperCase())
    for (const i of discussI) {
      const r = st.decisions[i.id]
      out.push(`${sectionTitle(i.section)} / ${i.title || i.id}${r.note ? ": " + r.note : ""} (${who(r)})`)
    }
    out.push("", S.confirmed.toUpperCase())
    for (const s of confirmed) out.push(`${s.nav} (${who(st.sections[s.id])})`)
    out.push("", S.points.toUpperCase())
    for (const nn of notes) out.push(`${sectionTitle(nn.data.section)}: ${nn.data.text} (${who(nn.data)})`)
    return out.join("\n")
  }, [st.decisions, st.sections, st.notes, changes, discussI, confirmed, notes, S])

  const busy = !!st.saving["review/state"]
  return (
    <section id="s-summary" aria-labelledby="s-summary-h" className="grid gap-8 border-t pt-12" style={{ borderColor: "var(--rule)" }}>
      <header className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:items-end md:gap-12">
        <div className="grid gap-3">
          <p className="eyebrow tabnums text-ink-muted"><span aria-hidden="true">{String(n).padStart(2, "0")} · </span>{sectionTitle("summary")}</p>
          <Accent id="s-summary-h" parts={S.title} className="text-[40px] leading-[1.02] md:text-[54px]" />
        </div>
        <p className="max-w-[62ch] text-[17px]">{S.intro}</p>
      </header>

      <dl className="grid grid-cols-2 border-l border-t sm:grid-cols-3 lg:grid-cols-6" style={{ borderColor: "var(--line)" }}>
        {[
          [S.decisions, `${decided.filter((d) => st.decisions[d.id].status === "decided").length} / ${decisions.length}`],
          [S.changes, changes.length],
          [S.discuss, discussI.length + decisions.filter((d) => st.decisions[d.id]?.status === "discuss").length],
          [S.keeps, keeps.length],
          [S.confirmed, confirmed.length],
          [S.points, notes.length],
        ].map(([k, v]) => (
          <div key={String(k)} className="grid gap-1 border-b border-r p-4" style={{ borderColor: "var(--line)" }}>
            <dt className="text-[12px] uppercase tracking-[0.12em] text-ink-muted">{k}</dt>
            <dd className="display tabnums text-[34px] leading-none">{v}</dd>
          </div>
        ))}
      </dl>

      <Block title={S.decisions}>
        {decided.length === 0 ? <None /> : decided.map((d) => {
          const r = st.decisions[d.id]
          return (
            <li key={d.id} className="grid gap-1 border-t py-3" style={{ borderColor: "var(--line)" }}>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" className="text-left font-semibold underline-offset-4 hover:underline" onClick={() => go(d.id)}>{d.code ? d.code + " " : ""}{d.title}</button>
                <StatusPill status={r.status} />
                <Who rec={r} />
              </div>
              {answerText(d, r.value) && <p className="whitespace-pre-wrap text-[15px]">{answerText(d, r.value)}</p>}
              {r.note && <p className="text-[14px] text-ink-muted">{L.note}: {r.note}</p>}
            </li>
          )
        })}
      </Block>

      <Block title={S.changes}>
        {changes.length === 0 ? <None /> : changes.map((i) => {
          const r = st.decisions[i.id]
          return (
            <li key={i.id} className="grid gap-1.5 border-t py-3" style={{ borderColor: "var(--line)" }}>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" className="text-left font-semibold underline-offset-4 hover:underline" onClick={() => go(i.id)}>{sectionTitle(i.section)} / {i.title || itemsById[i.id]?.text.slice(0, 48)}</button>
                <span className="mono text-ink-muted">{fileShort(i.file)}{i.line ? ` · ${L.line} ${i.line}` : ""}</span>
                <Who rec={r} />
              </div>
              <p className="strike whitespace-pre-wrap text-[14px]">{valueText(i, currentValue(i))}</p>
              <p className="changed whitespace-pre-wrap p-2 text-[15px]">{valueText(i, r.value)}</p>
              {r.note && <p className="text-[14px] text-ink-muted">{L.note}: {r.note}</p>}
            </li>
          )
        })}
      </Block>

      <Block title={S.discuss}>
        {discussI.length + decisions.filter((d) => st.decisions[d.id]?.status === "discuss").length === 0 ? <None /> : (
          <>
            {decisions.filter((d) => st.decisions[d.id]?.status === "discuss").map((d) => (
              <li key={d.id} className="border-t py-2" style={{ borderColor: "var(--line)" }}>
                <button type="button" className="font-semibold underline-offset-4 hover:underline" onClick={() => go(d.id)}>{d.title}</button>
                {st.decisions[d.id].note && <span className="text-ink-muted">: {st.decisions[d.id].note}</span>}
              </li>
            ))}
            {discussI.map((i) => (
              <li key={i.id} className="border-t py-2" style={{ borderColor: "var(--line)" }}>
                <button type="button" className="font-semibold underline-offset-4 hover:underline" onClick={() => go(i.id)}>{sectionTitle(i.section)} / {i.title || i.text.slice(0, 48)}</button>
                {st.decisions[i.id].note && <span className="text-ink-muted">: {st.decisions[i.id].note}</span>}
              </li>
            ))}
          </>
        )}
      </Block>

      <Block title={S.points}>
        {notes.length === 0 ? <None /> : notes.map((nn) => (
          <li key={nn.id} className="grid gap-0.5 border-t py-2" style={{ borderColor: "var(--line)" }}>
            <span className="text-[13px] text-ink-muted">{sectionTitle(nn.data.section)}</span>
            <span className="whitespace-pre-wrap">{nn.data.text}</span>
            <Who rec={nn.data} />
          </li>
        ))}
      </Block>

      <div className="grid gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="display text-[28px]">{S.text_title}</h3>
          <button type="button" className="btn btn-quiet" onClick={() => { ta.current?.focus(); ta.current?.select() }}>{ui.btn.copy}</button>
        </div>
        <textarea ref={ta} readOnly className="field mono min-h-[220px] text-[12px]" value={text} aria-label={S.text_title} />
      </div>

      <div className="grid gap-4 border p-5 md:p-6" style={{ borderColor: "var(--fg)" }}>
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill status={st.closed ? "decided" : "none"} />
          <span className="font-semibold">{st.closed ? S.closed : ""}</span>
          {st.review && <Who rec={st.review} />}
        </div>
        <p className="max-w-[62ch]">{st.closed ? S.closed_note : S.open_note}</p>
        {st.mode === "live" && (
          <div>
            {st.closed ? (
              <button type="button" className="btn btn-quiet" disabled={busy} onClick={() => st.setClosed(false)}>{ui.btn.reopen}</button>
            ) : (
              <button type="button" className="btn btn-solid" disabled={busy} onClick={() => st.setClosed(true)}>{ui.btn.close}</button>
            )}
          </div>
        )}
        <div className="grid gap-2 border-t pt-4" style={{ borderColor: "var(--line)" }}>
          <p className="eyebrow">{S.next_title}</p>
          <ol className="grid list-decimal gap-1.5 pl-5 text-[15px]">
            {S.next.map((x: string) => <li key={x}>{x}</li>)}
          </ol>
        </div>
      </div>
    </section>
  )
}

function Block({ title, children }: { title: string; children: any }) {
  return (
    <div className="grid gap-2">
      <h3 className="display text-[28px] leading-tight">{title}</h3>
      <ul className="grid">{children}</ul>
    </div>
  )
}

function None() {
  return <li className="border-t py-2 text-ink-muted" style={{ borderColor: "var(--line)" }}>{ui.summary.none}</li>
}
