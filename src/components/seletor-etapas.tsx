"use client"

import { useState } from "react"
import Image from "next/image"

type Aba = { numero: number; rotulo: string; detalhe: string }

/** Mesma foto de fundo para todas as etapas (a do placar). */
const FUNDO = "/fotos/disputa.jpg"

/**
 * Seção de etapas da home: foto do placar ao fundo (a mesma em todas), sem borda, fundindo no fundo da página,
 * etiquetas no topo para escolher a etapa e o painel dela embaixo.
 * Os painéis vêm prontos do servidor (um por aba, mesma ordem); aqui só troca qual aparece.
 */
export function SeletorEtapas({ abas, paineis, inicial = 0 }: { abas: Aba[]; paineis: React.ReactNode[]; inicial?: number }) {
  const [atual, setAtual] = useState(inicial)

  return (
    <section id="resultado" className="relative mt-24 scroll-mt-20 overflow-hidden">
      <Image src={FUNDO} alt="" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-page)_0%,rgb(14_15_18/0.7)_14%,rgb(14_15_18/0.82)_40%,rgb(14_15_18/0.94)_75%,var(--color-page)_100%)]" />

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div role="tablist" aria-label="Etapas da temporada" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {abas.map((a, i) => {
            const ativa = i === atual
            return (
              <button
                key={a.numero}
                type="button"
                role="tab"
                aria-selected={ativa}
                onClick={() => setAtual(i)}
                className={`shrink-0 rounded-lg border px-4 py-2 text-left transition ${
                  ativa
                    ? "border-ink bg-ink text-page"
                    : "vidro border-white/15 text-ink hover:border-white/40"
                }`}
              >
                <span className="block text-sm leading-tight font-bold">{a.rotulo}</span>
                <span className={`block text-[0.65rem] font-semibold ${ativa ? "text-page/60" : "text-muted"}`}>{a.detalhe}</span>
              </button>
            )
          })}
        </div>

        <div role="tabpanel" className="mt-10">
          {paineis[atual]}
        </div>
      </div>
    </section>
  )
}
