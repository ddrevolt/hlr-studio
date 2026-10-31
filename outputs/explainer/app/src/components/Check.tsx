import { useState } from "react"
import { content, data } from "@/lib/content"
import { Accent, FactChip, SectionHead } from "@/components/bits"
import { cn } from "@/lib/utils"

function splitLast(t: string): [string, string] {
  const w = t.split(" ")
  return [w.slice(0, -1).join(" ") + " ", w[w.length - 1]]
}

export default function Check() {
  const quiz = content.quiz as any[]
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const done = Object.keys(answers).length
  const score = quiz.filter((q, i) => answers[i] === q.answer).length
  return (
    <section id="check" aria-labelledby="check-h" className="grid gap-12">
      <SectionHead n={6} id="check" label="Check yourself" parts={content.check.headline} intro={content.check.intro} />
      <ol className="grid gap-px bg-line md:grid-cols-2" style={{ outline: "1px solid var(--line)" }}>
        {quiz.map((q, i) => {
          const picked = answers[i]
          const answered = picked !== undefined
          return (
            <li key={q.q} className="grid content-start gap-4 bg-bg p-5 md:p-6">
              <p className="mono text-ink-muted tabnums">Question {i + 1} of {quiz.length}</p>
              <p className="text-[18px] leading-snug">{q.q}</p>
              <div role="radiogroup" aria-label={`Question ${i + 1}`} className="grid gap-2">
                {q.options.map((o: string, j: number) => {
                  const isRight = j === q.answer
                  return (
                    <button key={o} type="button" role="radio" aria-checked={picked === j} disabled={answered}
                      onClick={() => setAnswers((a) => ({ ...a, [i]: j }))}
                      className={cn("flex items-start gap-3 border px-3 py-2 text-left text-[15px]",
                        !answered && "border-line hover:border-fg",
                        answered && isRight && "border-fg font-medium",
                        answered && !isRight && picked === j && "border-fg bg-fg text-bg",
                        answered && !isRight && picked !== j && "border-line opacity-60")}>
                      <span className="mono pt-[2px]" aria-hidden="true">{answered ? (isRight ? "✓" : picked === j ? "×" : "·") : String.fromCharCode(65 + j)}</span>
                      <span>{o}</span>
                    </button>
                  )
                })}
              </div>
              {answered && (
                <div data-ground="warm" className="grid gap-2 p-4 text-[15px]" aria-live="polite">
                  <p className="font-medium">{picked === q.answer ? "Right." : "Not quite."}</p>
                  <p>{q.why}</p>
                  {q.fact && <div><FactChip fact={q.fact} /></div>}
                </div>
              )}
            </li>
          )
        })}
        <li className="grid content-start gap-4 bg-bg p-5 md:p-6">
          <Accent parts={splitLast(content.close.headline)} as="h3" className="text-[34px] leading-none" />
          <ul className="grid gap-2">
            {content.close.items.map((t: string) => (
              <li key={t} className="grid grid-cols-[22px_minmax(0,1fr)] gap-2 border-t border-line pt-2"><span aria-hidden="true">✓</span><span>{t}</span></li>
            ))}
          </ul>
          <p className="text-[15px] text-ink-muted">{content.close.next}</p>
          {done > 0 && <p className="mono tabnums" aria-live="polite">{score} of {done} right so far</p>}
        </li>
      </ol>

      <div className="grid gap-5">
        <h3 className="display text-[30px] leading-none">Words used here</h3>
        <dl className="grid gap-x-10 gap-y-0 md:grid-cols-2">
          {content.glossary.map((g: any) => (
            <div key={g.term} className="grid grid-cols-[132px_minmax(0,1fr)] gap-4 border-t border-line py-3">
              <dt className="display text-[20px] leading-tight">{g.term}</dt>
              <dd className="text-[15px] text-ink-muted">{g.plain}</dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="sr-only">{data.stamp?.engine}</p>
    </section>
  )
}
