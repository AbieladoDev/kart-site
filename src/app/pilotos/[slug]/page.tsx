import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { acharPiloto, pilotos, slugify } from "@/lib/pilotos"
import { estatisticas, posicaoDe } from "@/lib/campeonato"
import { FigurinhaFrente, FigurinhaVerso } from "@/components/figurinha"
import { FigurinhaDupla } from "@/components/figurinha-viva"
import { CompartilharWhats } from "@/components/compartilhar-whats"
import { CompartilharFigurinha } from "@/components/compartilhar-figurinha"
import { liga } from "@/lib/liga"

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return pilotos.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = acharPiloto((await params).slug)
  return p ? { title: `${p.nome} #${p.numero}` } : {}
}

export default async function PaginaPiloto({ params }: Props) {
  const p = acharPiloto((await params).slug)
  if (!p) notFound()

  const s = estatisticas(p.slug)
  const pos = posicaoDe(p.slug)
  const i = pilotos.indexOf(p)
  const anterior = pilotos[(i - 1 + pilotos.length) % pilotos.length]
  const proximo = pilotos[(i + 1) % pilotos.length]
  const companheiros = pilotos.filter((x) => x.equipe === p.equipe && x !== p)
  const Emblema = p.equipe.emblema

  const numeros = [
    { rotulo: "Posição", valor: pos ? `${pos}º` : "—" },
    { rotulo: "Pontos", valor: s.pontos },
    { rotulo: "Vitórias", valor: s.vitorias },
    { rotulo: "Pódios", valor: s.podios },
    { rotulo: "Melhor volta", valor: s.melhorVolta ?? "—" },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <Link href="/pilotos" className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-ink">
        <ChevronLeft className="size-4" /> Álbum
      </Link>

      <div className="mt-6 grid items-start gap-12 md:grid-cols-[minmax(0,380px)_1fr] lg:gap-20">
        <div className="mx-auto w-full max-w-[380px]">
          <FigurinhaDupla nome={p.nome} frente={<FigurinhaFrente p={p} />} verso={<FigurinhaVerso p={p} />} />
          <div className="mt-3 flex flex-wrap items-start justify-center gap-2">
            <CompartilharFigurinha slug={p.slug} texto={`Olha a figurinha de ${p.nome} #${p.numero} (${p.equipe.nome}) no álbum da ${liga.nome} ${liga.temporada} 🏁`} />
            <CompartilharWhats rotulo="Mandar link no WhatsApp" texto={`Olha a figurinha de ${p.nome} #${p.numero} (${p.equipe.nome}) no álbum da ${liga.nome} ${liga.temporada} 🏁`} />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3">
            <span
              className="flex size-10 items-center justify-center rounded-lg border-2"
              style={{ background: p.equipe.cor1, borderColor: p.equipe.cor2, color: p.equipe.cor2 }}
            >
              <Emblema className="size-5" />
            </span>
            <Link href={`/equipes#${slugify(p.equipe.nome)}`} className="font-semibold text-muted hover:text-ink">
              {p.equipe.nome}
            </Link>
          </div>
          <h1 className="mt-4 font-display text-6xl font-black uppercase italic leading-[0.85] sm:text-7xl">
            {p.nome}
          </h1>
          <p className="mt-2 font-display text-3xl font-black italic text-brand">#{p.numero}</p>
          {p.frase && <p className="mt-6 max-w-md text-lg italic text-muted">“{p.frase}”</p>}

          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-6">
            {numeros.map((n, i) => (
              <div key={n.rotulo} className={`bg-surface p-4 ${i < 2 ? "sm:col-span-3" : "sm:col-span-2"} ${i === numeros.length - 1 ? "col-span-2 sm:col-span-2" : ""}`}>
                <dt className="text-sm text-muted">{n.rotulo}</dt>
                <dd className="mt-1 font-display text-3xl font-black italic tabular-nums">{n.valor}</dd>
              </div>
            ))}
          </dl>

          {companheiros.length > 0 && (
            <p className="mt-8 text-muted">
              Divide a equipe com{" "}
              {companheiros.map((c, n) => (
                <span key={c.slug}>
                  {n > 0 && (n === companheiros.length - 1 ? " e " : ", ")}
                  <Link href={`/pilotos/${c.slug}`} className="font-semibold text-ink underline-offset-4 hover:underline">
                    {c.nome}
                  </Link>
                </span>
              ))}
              .
            </p>
          )}

          <nav aria-label="Outras figurinhas" className="mt-10 flex gap-3">
            <Link
              href={`/pilotos/${anterior.slug}`}
              className="flex flex-1 items-center gap-2 rounded-xl border border-line px-4 py-3 text-sm transition hover:border-muted"
            >
              <ChevronLeft className="size-4 shrink-0 text-muted" />
              <span className="truncate font-semibold">{anterior.nome}</span>
            </Link>
            <Link
              href={`/pilotos/${proximo.slug}`}
              className="flex flex-1 items-center justify-end gap-2 rounded-xl border border-line px-4 py-3 text-sm transition hover:border-muted"
            >
              <span className="truncate font-semibold">{proximo.nome}</span>
              <ChevronRight className="size-4 shrink-0 text-muted" />
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
}
