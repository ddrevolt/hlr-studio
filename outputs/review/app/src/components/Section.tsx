import { useState } from "react"
import { L, itemsIn, ui } from "@/lib/data"
import { useStore } from "@/lib/store"
import { Accent, FactLine, GroupHead, Who } from "@/components/bits"
import { Item } from "@/components/Item"

export function passes(it: any, st: any): boolean {
  const rec = st.decisions[it.id]
  if (st.filter === "open") return it.review1 && !rec
  if (st.filter === "changed") return rec?.status === "change"
  if (st.filter === "discuss") return rec?.status === "discuss"
  return true
}

export function SectionView({ s, n }: { s: any; n: number }) {
  const st = useStore()
  const all = itemsIn(s.id)
  const visible = all.filter((i) => passes(i, st))
  return (
    <section id={"s-" + s.id} aria-labelledby={"s-" + s.id + "-h"} className="grid gap-8 border-t pt-12" style={{ borderColor: "var(--rule)" }}>
      <header className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:items-end md:gap-12">
        <div className="grid gap-3">
          <p className="eyebrow tabnums text-ink-muted">
            <span aria-hidden="true">{String(n).padStart(2, "0")} · </span>
            {s.nav}
          </p>
          <Accent id={"s-" + s.id + "-h"} parts={s.title} className="text-[40px] leading-[1.02] md:text-[54px]" />
        </div>
        <div className="grid gap-3">
          <p className="max-w-[62ch] text-[17px]">{s.intro}</p>
          {s.facts?.length > 0 && <FactLine facts={s.facts} />}
        </div>
      </header>
      {visible.length === 0 && <p className="text-ink-muted">{ui.summary.none}</p>}
      {s.groups.map((g: any) => {
        const list = visible.filter((i) => i.group === g.id)
        if (!list.length) return null
        return (
          <div key={g.id} className="grid gap-1">
            <GroupHead g={g} count={list.length} />
            <div className="grid">{list.map((it) => <Item key={it.id} it={it} />)}</div>
          </div>
        )
      })}
      <SectionFooter s={s} count={all.length} />
    </section>
  )
}

function SectionFooter({ s, count }: { s: any; count: number }) {
  const st = useStore()
  const rec = st.sections[s.id]
  const decided = itemsIn(s.id).filter((i) => st.decisions[i.id]).length
  const busy = !!st.saving["sections/" + s.id]
  return (
    <div className="grid gap-5 border p-5 md:p-6" style={{ borderColor: "var(--fg)" }}>
      <div className="grid gap-2">
        <p className="eyebrow">{s.nav}</p>
        <p className="text-[15px] text-ink-muted tabnums">
          {decided} {L.of} {count} {L.decided}
        </p>
        {rec ? (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[15px] font-semibold">{L.section_confirmed}</span>
            <Who rec={rec} />
            {st.mode !== "offline" && <button type="button" className="btn btn-quiet" disabled={!st.canWrite || busy} onClick={() => st.saveSection(s.id, null)}>{ui.btn.undo_confirm}</button>}
          </div>
        ) : (
          st.mode !== "offline" && (
            <div>
              <button type="button" className="btn" disabled={!st.canWrite || busy} onClick={() => st.saveSection(s.id, { confirmed: true })}>{ui.btn.confirm_rest}</button>
            </div>
          )
        )}
      </div>
      <Points section={s.id} />
    </div>
  )
}

export function Points({ section }: { section: string }) {
  const st = useStore()
  const [text, setText] = useState("")
  const list = st.notes.filter((n) => n.data?.section === section).sort((a, b) => String(a.data.at).localeCompare(String(b.data.at)))
  const add = async () => {
    if (!text.trim()) return
    if (await st.addNote({ section, text: text.trim() })) setText("")
  }
  return (
    <div className="grid gap-2">
      <p className="text-[13px] font-semibold uppercase tracking-[0.12em]">{L.points}</p>
      {list.length > 0 && (
        <ul className="grid gap-2">
          {list.map((n) => (
            <li key={n.id} className="grid gap-1 border-l-2 pl-3" style={{ borderColor: "var(--fg)" }}>
              <p className="whitespace-pre-wrap text-[15px]">{n.data.text}</p>
              <div className="flex flex-wrap items-center gap-2">
                <Who rec={n.data} />
                {st.canWrite && (
                  <button type="button" className="text-[13px] underline underline-offset-2" onClick={() => st.deleteNote(n.id)}>
                    {ui.btn.clear}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {st.mode !== "offline" && (
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
          <textarea className="field min-h-[44px]" value={text} disabled={!st.canWrite} placeholder={L.point_placeholder} aria-label={L.points} onChange={(e) => setText(e.target.value)} />
          <button type="button" className="btn btn-quiet" disabled={!st.canWrite || !text.trim() || !!st.saving["notes/new"]} onClick={add}>{ui.btn.add_point}</button>
        </div>
      )}
    </div>
  )
}
