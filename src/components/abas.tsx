"use client"

import { useState } from "react"

type Aba = { rotulo: string; detalhe?: string }

/** Etiquetas (pílulas) que trocam o painel embaixo. Painéis vêm prontos do servidor, na mesma ordem das abas. */
export function Abas({ abas, paineis, rotulo, inicial = 0 }: { abas: Aba[]; paineis: React.ReactNode[]; rotulo: string; inicial?: number }) {
  const [atual, setAtual] = useState(inicial)

  return (
    <>
      <div role="tablist" aria-label={rotulo} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
        {abas.map((a, i) => {
          const ativa = i === atual
          return (
            <button
              key={a.rotulo}
              type="button"
              role="tab"
              aria-selected={ativa}
              onClick={() => setAtual(i)}
              className={`shrink-0 rounded-lg border px-4 py-2 text-left transition ${
                ativa ? "border-ink bg-ink text-page" : "vidro border-white/15 text-ink hover:border-white/40"
              }`}
            >
              <span className="block text-sm leading-tight font-bold">{a.rotulo}</span>
              {a.detalhe && <span className={`block text-[0.65rem] font-semibold ${ativa ? "text-page/60" : "text-muted"}`}>{a.detalhe}</span>}
            </button>
          )
        })}
      </div>
      <div role="tabpanel" className="mt-8">
        {paineis[atual]}
      </div>
    </>
  )
}
