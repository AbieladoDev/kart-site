/* eslint-disable @next/next/no-img-element -- fotos vêm do R2 já no tamanho certo */
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Foto } from "@/lib/fotos"
import { TituloSecao } from "./visual"

/**
 * Últimas fotos do álbum na home: a mais nova grande, as outras pequenas em volta.
 * Celular: grade 4×2 — grande 2×2 à esquerda, 4 pequenas quadradas em 2×2 à direita.
 * Desktop: largura toda e altura fixa baixa — grande em 1/3 da largura, 4 pequenas deitadas em 2×2 nos outros 2/3.
 * Sem foto nenhuma, a seção não aparece.
 */
export function UltimasFotos({ fotos }: { fotos: Foto[] }) {
  if (!fotos.length) return null
  const [grande, ...pequenas] = fotos

  return (
    <section className="mx-auto max-w-6xl px-4 pt-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <TituloSecao rotulo="Direto da pista" antes="Últimas " destaque="fotos" />
        <Link href="/fotos" className="inline-flex items-center gap-1 text-sm font-bold text-muted hover:text-ink">
          Ver todas as fotos <ArrowRight className="size-4" />
        </Link>
      </div>

      <ul className="mt-8 grid grid-cols-4 grid-rows-2 gap-2 md:h-[22rem] md:grid-cols-6 md:gap-3">
        <li className="col-span-2 row-span-2 aspect-square md:aspect-auto">
          <Link href={`/fotos/${grande.etapa}`} className="group block size-full overflow-hidden rounded-2xl bg-surface" aria-label={`Fotos da Etapa ${grande.etapa}`}>
            <img src={grande.url} alt="" className="size-full object-cover transition duration-500 group-hover:scale-[1.03]" />
          </Link>
        </li>
        {pequenas.map((f) => (
          <li key={f.chave} className="aspect-square md:col-span-2 md:aspect-auto">
            <Link href={`/fotos/${f.etapa}`} className="group block size-full overflow-hidden rounded-xl bg-surface" aria-label={`Fotos da Etapa ${f.etapa}`}>
              <img src={f.url} alt="" loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-[1.05]" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
