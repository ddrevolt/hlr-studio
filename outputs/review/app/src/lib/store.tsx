import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { BUILD, itemsById, ui } from "@/lib/data"

/* The review record lives in the artifact's shared database:
   decisions/<item or decision id>  one per decision, replaced whole on each save
   sections/<section id>            "confirm the rest of this section as written"
   notes/<auto id>                  points raised that have no item of their own
   review/state                     open or closed
   Only ids are stored for people (user.id()); names are resolved at render time. */

export type Mode = "loading" | "live" | "offline" | "readonly"
type By = "donnie" | "eddie" | "both"

type Store = {
  mode: Mode
  closed: boolean
  review: any
  decisions: Record<string, any>
  sections: Record<string, any>
  notes: { id: string; data: any }[]
  me: any
  names: Record<string, string>
  by: By
  setBy: (b: By) => void
  view: "plain" | "source"
  setView: (v: "plain" | "source") => void
  filter: string
  setFilter: (f: string) => void
  saving: Record<string, boolean>
  error: string | null
  canWrite: boolean
  saveDecision: (id: string, body: any | null) => Promise<boolean>
  saveSection: (id: string, body: any | null) => Promise<boolean>
  addNote: (body: any) => Promise<boolean>
  deleteNote: (id: string) => Promise<boolean>
  setClosed: (closed: boolean) => Promise<boolean>
}

const Ctx = createContext<Store | null>(null)

export function useStore(): Store {
  const s = useContext(Ctx)
  if (!s) throw new Error("no store")
  return s
}

function safeGet(k: string): string | null {
  try {
    return window.localStorage.getItem(k)
  } catch {
    return null
  }
}
function safeSet(k: string, v: string) {
  try {
    window.localStorage.setItem(k, v)
  } catch {
    /* storage unavailable: the choice lasts for this visit */
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function StoreProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("loading")
  const [decisions, setDecisions] = useState<Record<string, any>>({})
  const [sections, setSections] = useState<Record<string, any>>({})
  const [notes, setNotes] = useState<{ id: string; data: any }[]>([])
  const [review, setReview] = useState<any>(null)
  const [me, setMe] = useState<any>(null)
  const [names, setNames] = useState<Record<string, string>>({})
  const [by, setByState] = useState<By>(() => (safeGet("hlr-review-by") as By) || "donnie")
  const [view, setViewState] = useState<"plain" | "source">(() => (safeGet("hlr-review-view") as any) || "plain")
  const [filter, setFilter] = useState("all")
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)
  const dbRef = useRef<any>(null)
  const userRef = useRef<any>(null)
  const pending = useRef<Set<string>>(new Set())
  const modeRef = useRef<Mode>("loading")
  modeRef.current = mode

  const setBy = (b: By) => {
    setByState(b)
    safeSet("hlr-review-by", b)
  }
  const setView = (v: "plain" | "source") => {
    setViewState(v)
    safeSet("hlr-review-view", v)
  }

  useEffect(() => {
    let alive = true
    const unsubs: (() => void)[] = []
    ;(async () => {
      const c = (window as any).claude
      if (!c || typeof c.use !== "function") {
        setMode("offline")
        return
      }
      const [db, user] = await Promise.all([c.use("db").catch(() => null), c.use("user").catch(() => null)])
      if (!alive) return
      userRef.current = user
      let readonly = false
      if (user) {
        try {
          setMe(await user.me())
          const can = await user.can("data.write")
          if (can === false) readonly = true
        } catch {
          /* reads never reject; ignore */
        }
      }
      if (!db) {
        setMode("offline")
        return
      }
      dbRef.current = db
      const onErr = (e: any) => {
        if (e?.code === "revoked" || e?.code === "unavailable") setMode("offline")
      }
      unsubs.push(db.collection("decisions").onSnapshot((s: any) => setDecisions(Object.fromEntries(s.docs.map((d: any) => [d.id, d.data()]))), onErr))
      unsubs.push(db.collection("sections").onSnapshot((s: any) => setSections(Object.fromEntries(s.docs.map((d: any) => [d.id, d.data()]))), onErr))
      unsubs.push(db.collection("notes").onSnapshot((s: any) => setNotes(s.docs.map((d: any) => ({ id: d.id, data: d.data() }))), onErr))
      unsubs.push(db.doc("review/state").onSnapshot((s: any) => setReview(s.exists ? s.data() : null), onErr))
      setMode(readonly ? "readonly" : "live")
    })()
    return () => {
      alive = false
      unsubs.forEach((u) => u())
    }
  }, [])

  /* Resolve the people the record names, every time the set of ids changes. */
  const uidKey = useMemo(() => {
    const ids = new Set<string>()
    Object.values(decisions).forEach((d: any) => d?.uid && ids.add(d.uid))
    Object.values(sections).forEach((d: any) => d?.uid && ids.add(d.uid))
    notes.forEach((n) => n.data?.uid && ids.add(n.data.uid))
    if (review?.uid) ids.add(review.uid)
    return [...ids].sort().join(",")
  }, [decisions, sections, notes, review])
  useEffect(() => {
    const u = userRef.current
    if (!u || !uidKey) return
    let alive = true
    u.profiles(uidKey.split(",")).then((ps: any) => {
      if (!alive) return
      const m: Record<string, string> = {}
      for (const [k, p] of Object.entries(ps as Record<string, any>)) m[k] = p?.name || ""
      setNames(m)
    })
    return () => {
      alive = false
    }
  }, [uidKey])

  const guarded = useCallback(async (key: string, fn: () => Promise<void>) => {
    if (!dbRef.current || modeRef.current !== "live") return false
    if (pending.current.has(key)) return false
    pending.current.add(key)
    setSaving((s) => ({ ...s, [key]: true }))
    try {
      try {
        await fn()
      } catch (e: any) {
        if (e?.code !== "unavailable") throw e
        await sleep(400 + Math.random() * 600)
        await fn()
      }
      setError(null)
      return true
    } catch (e: any) {
      if (e?.code === "invalid_argument") {
        setMode("readonly")
        setError(ui.db.readonly)
      } else if (e?.code === "quota_exceeded") setError(ui.db.full)
      else if (e?.code === "revoked") setMode("offline")
      else setError(ui.db.error)
      return false
    } finally {
      pending.current.delete(key)
      setSaving((s) => {
        const n = { ...s }
        delete n[key]
        return n
      })
    }
  }, [])

  const stamp = useCallback(() => ({ by, uid: me?.id ?? null, at: new Date().toISOString(), build: BUILD }), [by, me])

  const saveDecision = useCallback(
    (id: string, body: any | null) =>
      guarded("decisions/" + id, async () => {
        const ref = dbRef.current.doc("decisions/" + id)
        if (body === null) await ref.delete()
        else {
          const it = itemsById[id]
          await ref.set({ item: id, section: it?.section ?? "decisions", base: it?.sha ?? null, ...stamp(), ...body })
        }
      }),
    [guarded, stamp],
  )
  const saveSection = useCallback(
    (id: string, body: any | null) =>
      guarded("sections/" + id, async () => {
        const ref = dbRef.current.doc("sections/" + id)
        if (body === null) await ref.delete()
        else await ref.set({ section: id, ...stamp(), ...body })
      }),
    [guarded, stamp],
  )
  const addNote = useCallback(
    (body: any) =>
      guarded("notes/new", async () => {
        await dbRef.current.collection("notes").add({ ...stamp(), ...body })
      }),
    [guarded, stamp],
  )
  const deleteNote = useCallback((id: string) => guarded("notes/" + id, async () => dbRef.current.doc("notes/" + id).delete()), [guarded])
  const setClosed = useCallback(
    (closed: boolean) => guarded("review/state", async () => dbRef.current.doc("review/state").set({ closed, ...stamp() })),
    [guarded, stamp],
  )

  const closed = !!review?.closed
  const value: Store = {
    mode,
    closed,
    review,
    decisions,
    sections,
    notes,
    me,
    names,
    by,
    setBy,
    view,
    setView,
    filter,
    setFilter,
    saving,
    error,
    canWrite: mode === "live" && !closed,
    saveDecision,
    saveSection,
    addNote,
    deleteNote,
    setClosed,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
