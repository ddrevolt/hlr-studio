import contentJson from "@/data/content.json"
import dataJson from "@/data/review-data.json"

export const content: any = contentJson
export const data: any = dataJson
export const ui: any = content.ui
export const L: any = ui.labels
export const items: any[] = data.items
export const itemsById: Record<string, any> = Object.fromEntries(items.map((i) => [i.id, i]))
export const decisions: any[] = content.decisions
export const decisionsById: Record<string, any> = Object.fromEntries(decisions.map((d) => [d.id, d]))
export const sections: any[] = content.sections
export const BUILD: string = data.stamp.build

/** A DOM id for an item or a decision. */
export function anchor(id: string): string {
  return id.startsWith("d.") ? "d-" + id.slice(2).replace(/[^A-Za-z0-9]+/g, "-") : "i-" + id.replace(/[^A-Za-z0-9]+/g, "-")
}

/** C1 to C10 and T6 point at their decision; ledger codes point at their claim. */
export const CODE_LINK: Record<string, string> = {}
for (const d of decisions) if (/^(C\d+|T6)$/.test(d.code)) CODE_LINK[d.code] = d.id

export function itemsIn(section: string, group?: string): any[] {
  return items.filter((i) => i.section === section && (!group || i.group === group))
}

export function sectionTitle(id: string): string {
  return sections.find((s) => s.id === id)?.nav ?? id
}

export function fileShort(f: string): string {
  return f.replace(/^brand-pack\//, "").replace(/^outputs\/step-\d-[a-z]+\//, "")
}

/** The plain text a decision changes, for the summary and the editor. */
export function currentValue(it: any): any {
  if (it.edit === "fields") return { ...(it.fields ?? {}) }
  if (it.edit === "lines") return (it.entries ?? []).map((e: any) => (e.why ? `${e.quote} (${e.why})` : e.quote)).join("\n")
  if (it.edit === "hex") return { hex: it.hex ?? "", text: it.text ?? "" }
  if (it.edit === "claim") return it.claim?.requires ?? ""
  return it.text ?? ""
}

export function valueText(it: any, v: any): string {
  if (v == null) return ""
  if (typeof v === "string") return v
  if (Array.isArray(v)) return v.join("\n")
  if (it?.edit === "hex") return [v.hex, v.text].filter(Boolean).join(": ")
  return Object.entries(v)
    .filter(([, x]) => x !== "" && x != null)
    .map(([k, x]) => `${L[k] ?? k}: ${x}`)
    .join("\n")
}

export function answerText(d: any, value: any): string {
  if (!value) return ""
  const out: string[] = []
  for (const f of d.fields) {
    const v = value[f.id]
    if (v == null || v === "" || (Array.isArray(v) && !v.length)) continue
    if (f.type === "radio") out.push(`${f.label}: ${f.options.find((o: any) => o.id === v)?.label ?? v}`)
    else if (f.type === "checks") out.push(`${f.label}: ${(v as string[]).map((x) => f.options.find((o: any) => o.id === x)?.label ?? x).join("; ")}`)
    else out.push(`${f.label}: ${v}`)
  }
  return out.join("\n")
}

export function fmtTime(iso?: string): string {
  if (!iso) return ""
  try {
    const d = new Date(iso)
    return d.toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
  } catch {
    return iso
  }
}

export function byLabel(b?: string): string {
  return ui.by.find((x: any) => x.id === b)?.label ?? ""
}
