import type { Metadata } from "next"
import { grid } from "@/lib/campeonato"
import { Previa } from "./previa"

// Página de conferência (não está no menu): como a figurinha sai no download, no story e no link.
export const metadata: Metadata = { title: "Prévia das figurinhas", robots: { index: false, follow: false } }

export default function PaginaPrevia() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <p className="text-[0.7rem] font-bold tracking-[0.2em] text-muted uppercase">Só para conferência</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
        Prévia das <span className="text-hot">figurinhas</span>
      </h1>
      <p className="mt-3 max-w-xl text-muted">Escolha o piloto. As imagens abaixo são as mesmas que saem no compartilhar.</p>
      <div className="mt-8">
        <Previa pilotos={grid.map((p) => ({ slug: p.slug, nome: p.nome }))} />
      </div>
    </div>
  )
}
