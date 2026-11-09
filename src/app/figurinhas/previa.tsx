"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { liga } from "@/lib/liga"

type Item = { slug: string; nome: string }

/**
 * Prévia das imagens que saem do site, com as imagens REAIS (as mesmas rotas que o botão usa):
 * o PNG do download, como ele fica num story 9:16 e a prévia do link no WhatsApp.
 */
export function Previa({ pilotos }: { pilotos: Item[] }) {
  const [slug, setSlug] = useState(pilotos[0].slug)
  const atual = pilotos.find((p) => p.slug === slug)!
  const png = `/pilotos/${slug}/figurinha`

  return (
    <>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {pilotos.map((p) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => setSlug(p.slug)}
            aria-pressed={p.slug === slug}
            className={`shrink-0 rounded-lg border px-4 py-2 text-sm font-bold transition ${
              p.slug === slug ? "border-ink bg-ink text-page" : "border-line text-muted hover:text-ink"
            }`}
          >
            {p.nome}
          </button>
        ))}
      </div>

      <div className="mt-10 grid items-start gap-12 lg:grid-cols-3">
        {/* 1. Download */}
        <section>
          <h2 className="text-lg font-extrabold">Download</h2>
          <p className="mt-1 text-sm text-muted">O arquivo que o botão baixa ou manda pelo celular. PNG 1000 × 1400.</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={png} src={png} alt={`Figurinha de ${atual.nome}`} className="mt-5 w-full max-w-sm" />
          <a
            href={png}
            download={`figurinha-${slug}.png`}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-page transition hover:bg-brand"
          >
            <Download className="size-4" /> Baixar PNG
          </a>
        </section>

        {/* 2. Story: imagem própria 1080×1920 (a mesma do botão "Compartilhar no story") */}
        <section>
          <h2 className="text-lg font-extrabold">Story</h2>
          <p className="mt-1 text-sm text-muted">Tela cheia 1080 × 1920. A faixa de cima fica livre para o cabeçalho do Instagram.</p>
          <div className="relative mt-5 aspect-[9/16] w-full max-w-[300px] overflow-hidden rounded-[1.75rem] border-[6px] border-[#222] bg-black shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={`s-${slug}`} src={`/pilotos/${slug}/story`} alt={`Story de ${atual.nome}`} className="absolute inset-0 size-full" />
            {/* cabeçalho do Instagram por cima, só para conferir que nada fica escondido */}
            <div className="absolute inset-x-3 top-3 h-0.5 rounded-full bg-white/40">
              <div className="h-full w-1/3 rounded-full bg-white" />
            </div>
            <div className="absolute top-6 left-3 flex items-center gap-2 text-xs font-semibold text-white">
              <span className="size-6 rounded-full bg-white/30" /> você
            </div>
            <div className="absolute inset-x-3 bottom-3 rounded-full border border-white/50 px-3 py-1.5 text-[0.6rem] text-white/80">
              Enviar mensagem
            </div>
          </div>
          <a
            href={`/pilotos/${slug}/story`}
            download={`story-${slug}.jpg`}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-bold transition hover:border-ink"
          >
            <Download className="size-4" /> Baixar story
          </a>
        </section>

        {/* 3. Link no WhatsApp: a prévia que aparece ao mandar o link da página do piloto */}
        <section>
          <h2 className="text-lg font-extrabold">Link no WhatsApp</h2>
          <p className="mt-1 text-sm text-muted">Ao mandar o link da página do piloto. O link do site mostra só a logo.</p>
          <div className="mt-5 max-w-[300px] rounded-2xl bg-[#005c4b] p-1.5 text-white shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={`o-${slug}`} src={`/pilotos/${slug}/opengraph-image`} alt="" className="w-full rounded-xl" />
            <div className="px-2 pt-2 pb-1">
              <p className="text-sm font-bold">
                {atual.nome} · {liga.nome}
              </p>
              <p className="text-xs text-white/70">Temporada {liga.temporada} do campeonato de kart da galera…</p>
            </div>
          </div>
          <div className="mt-6 max-w-[300px] rounded-2xl bg-[#005c4b] p-1.5 text-white shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/opengraph-image" alt="" className="w-full rounded-xl" />
            <div className="px-2 pt-2 pb-1">
              <p className="text-sm font-bold">
                {liga.nome} — Temporada {liga.temporada}
              </p>
              <p className="text-xs text-white/70">Link do site (qualquer página que não seja de piloto)</p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
