import Link from "next/link"
import { Clock, Flag, MapPin } from "lucide-react"
import { liga } from "@/lib/liga"
import { acharPiloto, equipes, pilotos, slugify, totalPilotos } from "@/lib/pilotos"
import { classificacao, etapas, proximaEtapa, temResultado } from "@/lib/campeonato"
import { FigurinhaFrente } from "@/components/figurinha"
import { FigurinhaViva } from "@/components/figurinha-viva"
import { Contagem } from "./contagem"

// Figurinhas em leque no topo: as que já têm foto primeiro.
const destaque = [
  acharPiloto("darby-biehl"),
  acharPiloto("arthur-biehl"),
  ...pilotos.filter((p) => !p.foto),
]
  .filter((p) => p !== undefined)
  .slice(0, 3)

const leque = [
  "-rotate-[9deg] translate-y-6 -mr-[18%]",
  "z-10 -translate-y-2",
  "rotate-[9deg] translate-y-6 -ml-[18%]",
]

export default function Home() {
  const top = classificacao.slice(0, 5)

  return (
    <>
      {/* Abertura: a temporada + o leque de figurinhas */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-12 pb-16 md:grid-cols-[1fr_1.1fr] md:pt-20">
        <div>
          <p className="font-display text-lg font-extrabold italic text-brand">
            Temporada {liga.temporada}
          </p>
          <h1 className="mt-2 font-display text-6xl font-black uppercase italic leading-[0.85] tracking-tight sm:text-8xl">
            {liga.nome}
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
            {totalPilotos} amigos, {equipes.length} equipes e {etapas.length} etapas valendo pontos. Cada piloto tem
            a sua figurinha — e o álbum vai sendo preenchido corrida a corrida.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/pilotos"
              className="rounded-full bg-brand px-6 py-3 font-display text-lg font-extrabold uppercase italic text-brand-fg transition hover:brightness-110"
            >
              Abrir o álbum
            </Link>
            <Link
              href="/apoiadores"
              className="rounded-full border border-line px-6 py-3 font-display text-lg font-extrabold uppercase italic text-ink transition hover:border-ink"
            >
              Apoiar a temporada
            </Link>
          </div>
        </div>

        <div className="flex justify-center px-6 pb-6">
          {destaque.map((p, i) => (
            <Link
              key={p.slug}
              href={`/pilotos/${p.slug}`}
              className={`w-[38%] max-w-56 shrink-0 ${leque[i]}`}
              aria-label={`Figurinha de ${p.nome}`}
            >
              <FigurinhaViva>
                <FigurinhaFrente p={p} />
              </FigurinhaViva>
            </Link>
          ))}
        </div>
      </section>

      {/* Próxima etapa: placa de cronometragem */}
      {proximaEtapa && (
        <section className="border-y border-line bg-black/40">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="font-display text-3xl font-black uppercase italic sm:text-4xl">
                Etapa {proximaEtapa.numero}
                {proximaEtapa.data !== "A definir" && <span className="text-brand"> · {proximaEtapa.data}</span>}
              </h2>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-muted">
                <li className="flex items-center gap-2">
                  <MapPin className="size-4 text-brand" /> {proximaEtapa.local}
                </li>
                {proximaEtapa.chegada && (
                  <li className="flex items-center gap-2">
                    <Clock className="size-4 text-brand" /> Chegar até {proximaEtapa.chegada}
                  </li>
                )}
                {proximaEtapa.hora && (
                  <li className="flex items-center gap-2">
                    <Flag className="size-4 text-brand" /> Largada {proximaEtapa.hora}
                  </li>
                )}
              </ul>
              <p className="mt-3 text-sm text-muted">Álcool só depois da bandeirada.</p>
            </div>
            {proximaEtapa.iso && <Contagem alvo={proximaEtapa.iso} />}
          </div>
        </section>
      )}

      {/* Classificação resumida + equipes */}
      <section className="mx-auto grid max-w-6xl gap-12 px-4 pt-16 lg:grid-cols-2">
        <div>
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <h2 className="font-display text-3xl font-black uppercase italic">Classificação</h2>
            <Link href="/classificacao" className="text-sm font-semibold text-muted hover:text-ink">
              Ver completa
            </Link>
          </div>
          {!temResultado && (
            <p className="mb-4 text-sm text-muted">Todo mundo zerado — a tabela começa a mexer depois da etapa 1.</p>
          )}
          <ol className="overflow-hidden rounded-2xl border border-line bg-surface">
            {top.map((p) => (
              <li key={p.slug} className="border-b border-line last:border-b-0">
                <Link href={`/pilotos/${p.slug}`} className="flex items-center gap-3 px-4 py-3 transition hover:bg-white/5">
                  <span className="w-6 font-display text-xl font-black italic tabular-nums text-muted">{p.posicao}</span>
                  <span
                    className="flex h-7 w-10 shrink-0 items-center justify-center rounded font-display font-black italic"
                    style={{ background: p.equipe.cor1, color: p.equipe.cor2 }}
                  >
                    {p.numero}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{p.nome}</span>
                    <span className="block truncate text-xs text-muted">{p.equipe.nome}</span>
                  </span>
                  <span className="font-display text-xl font-black tabular-nums">
                    {p.pontos} <span className="text-xs font-semibold text-muted">pts</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <h2 className="font-display text-3xl font-black uppercase italic">Equipes</h2>
            <Link href="/equipes" className="text-sm font-semibold text-muted hover:text-ink">
              Ver todas
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {equipes.map((e) => {
              const Emblema = e.emblema
              return (
                <li key={e.nome}>
                  <Link
                    href={`/equipes#${slugify(e.nome)}`}
                    className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3 transition hover:border-muted"
                  >
                    <span
                      className="flex size-9 shrink-0 items-center justify-center rounded-lg border-2"
                      style={{ background: e.cor1, borderColor: e.cor2, color: e.cor2 }}
                    >
                      <Emblema className="size-5" />
                    </span>
                    <span className="min-w-0 text-sm font-semibold leading-tight">{e.nome}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* Chamada para apoiadores */}
      <section className="mx-auto max-w-6xl px-4 pt-20">
        <div className="relative overflow-hidden rounded-3xl bg-brand px-6 py-10 text-brand-fg sm:px-10">
          <div className="xadrez absolute inset-y-0 right-0 w-16 opacity-90 sm:w-28" />
          <div className="relative max-w-xl pr-16 sm:pr-0">
            <h2 className="font-display text-3xl font-black uppercase italic leading-none sm:text-4xl">
              Sua marca na figurinha de {totalPilotos} pilotos
            </h2>
            <p className="mt-4 font-medium">
              Apoiadores aparecem nas figurinhas, no site e no grid de cada etapa. Veja as cotas.
            </p>
            <Link
              href="/apoiadores"
              className="mt-6 inline-block rounded-full bg-brand-fg px-6 py-3 font-display text-lg font-extrabold uppercase italic text-brand"
            >
              Ver cotas de apoio
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
