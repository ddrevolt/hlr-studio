import contentJson from "@/data/content.json"
import dataJson from "@/data/explainer-data.json"
import verdictsJson from "@/data/examples-verified.json"
import { createContext, useContext } from "react"

/* eslint-disable @typescript-eslint/no-explicit-any */
export const content: any = contentJson
export const data: any = dataJson
export const verdicts: any = verdictsJson

export type Fact = { source: string; quote?: string; checked?: string; note?: string }
export type Mode = "plain" | "technical"

/* Resolve a values path the same way guards/explainer_drift.py does. */
export function resolvePath(path: string): any {
  let node: any = data
  for (const part of path.split(".")) {
    if (part === "#") return Array.isArray(node) ? node.length : node && typeof node === "object" ? Object.keys(node).length : undefined
    const m = part.match(/^(\w+)\[(\w+)=([^\]]+)\]$/)
    if (m) {
      const arr = node?.[m[1]] ?? []
      node = arr.filter((x: any) => x && String(x[m[2]]) === m[3])
      continue
    }
    if (node == null || typeof node !== "object" || !(part in node)) return undefined
    node = node[part]
  }
  return node
}

const values: Record<string, string> = content.values
export function fill(s: string | undefined | null): string {
  if (!s) return ""
  return s.replace(/\{(\w+)\}/g, (whole, key) => {
    if (!(key in values)) return whole
    const v = resolvePath(values[key])
    return v == null ? whole : String(v)
  })
}

export const cardsById: Record<string, any> = Object.fromEntries(content.cards.map((c: any) => [c.id, c]))
export const verdictById: Record<string, any> = Object.fromEntries(verdicts.examples.map((e: any) => [e.id, e]))

export function gapRows(matches: string[]): any[] {
  if (!matches?.length) return []
  return data.gaps.filter((g: any) => matches.some((m) => g.item.toLowerCase().startsWith(m.toLowerCase()) || g.item.toLowerCase().includes(m.toLowerCase())))
}

export function plainGap(item: string): string | null {
  const hit = content.gap_plain.find((p: any) => item.toLowerCase().includes(p.match.toLowerCase()))
  return hit ? hit.plain : null
}

export function sourceLabel(f: Fact): { kind: "file" | "engine" | "web"; label: string; href?: string } {
  if (f.source.startsWith("http")) {
    const u = new URL(f.source)
    return { kind: "web", label: u.hostname.replace(/^www\./, ""), href: f.source }
  }
  if (f.source.startsWith("engine:")) return { kind: "engine", label: f.source.slice(7) }
  return { kind: "file", label: f.source }
}

type Ctx = {
  mode: Mode
  setMode: (m: Mode) => void
  openCard: (id: string) => void
}
export const UICtx = createContext<Ctx>({ mode: "plain", setMode: () => {}, openCard: () => {} })
export const useUI = () => useContext(UICtx)

export function safeGet(key: string): string | null {
  try { return window.localStorage.getItem(key) } catch { return null }
}
export function safeSet(key: string, value: string) {
  try { window.localStorage.setItem(key, value) } catch { /* storage can be unavailable */ }
}
