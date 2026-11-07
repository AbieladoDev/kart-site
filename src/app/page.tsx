import Link from "next/link"
import { Beef, Beer, Clock, Flag, MapPin, Trophy } from "lucide-react"
import { liga } from "@/lib/liga"
import { equipes, slugify, totalPilotos } from "@/lib/pilotos"
import { classificacao, etapas, proximaEtapa, temResultado } from "@/lib/campeonato"
import { FigurinhaIlustrativa } from "@/components/figurinha"
import { FigurinhaViva } from "@/components/figurinha-viva"
import { Contagem } from "./contagem"
import { TracadoPista } from "@/components/tracado-pista"
import { ListaApoiadores } from "@/components/lista-apoiadores"

// Leque do topo: figurinhas ILUSTRATIVAS (sem nome nem foto de piloto — pedido), uma por equipe, até 5.
const destaque = equipes.slice(0, 5)

/** Posição de cada carta no leque: gira e desce conforme se afasta do centro; o centro fica por cima. */
function noLeque(i: number, total: number): React.CSSProperties {
  const d = i - (total - 1) / 2
  return {
    rotate: `${d * 7}deg`,
    translate: `0 ${Math.abs(d) * Math.abs(d) * 0.6 + Math.abs(d) * 0.4}rem`,
    zIndex: 10 - Math.round(Math.abs(d) * 2),
    marginLeft: i === 0 ? 0 : "-14%",
  }
}

const roteiro = [
  {
    icone: Flag,
    titulo: "Acelera",
    texto: "Capacete, bandeira verde e disputa curva por curva. Na pista, amizade fica no box.",
  },
  {
    icone: Trophy,
    titulo: "Pódio e resenha",
    texto: "Quem ganhou comemora, quem rodou explica. Revanche marcada para a próxima etapa.",
  },
  {
    icone: Beef,
    titulo: "Churrasco e gelada",
    texto: "Fogo aceso, carne na grelha e cerveja liberada — só agora, com todo mundo fora do kart.",
    destaque: true,
  },
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
          <p className="mt-7 flex items-end gap-3">
            <span className="font-display text-7xl font-black italic leading-[0.8] text-brand sm:text-8xl">
              {totalPilotos}
            </span>
            <span className="pb-1 font-display text-2xl font-extrabold uppercase italic leading-[0.95] sm:text-3xl">
              amigos
              <br />
              no grid
            </span>
          </p>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
            Na pista ninguém alivia. Depois da bandeirada é resenha, churrasco e a gelada que ficou esperando.{" "}
            {equipes.length} equipes, {etapas.length} etapas e uma figurinha para cada piloto.
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
          {destaque.map((e, i) => (
            <Link
              key={e.nome}
              href="/pilotos"
              className="w-[30%] max-w-52 shrink-0"
              style={noLeque(i, destaque.length)}
              aria-label="Abrir o álbum de figurinhas"
            >
              <FigurinhaViva>
                <FigurinhaIlustrativa e={e} />
              </FigurinhaViva>
            </Link>
          ))}
        </div>
      </section>

      {/* Próxima etapa: placa de cronometragem */}
      {proximaEtapa && (
        <section className="border-y border-line bg-black/40">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[1fr_auto_auto] lg:items-center lg:gap-12">
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
            </div>
            {proximaEtapa.tracado && (
              <TracadoPista d={proximaEtapa.tracado} nome={proximaEtapa.local} className="mx-auto w-full max-w-72 lg:w-64" />
            )}
            {proximaEtapa.iso && <Contagem alvo={proximaEtapa.iso} />}
          </div>
        </section>
      )}

      {/* O dia de corrida: acelera, resenha, churrasco — a ordem importa (álcool só no fim) */}
      <section className="mx-auto max-w-6xl px-4 pt-20">
        <h2 className="max-w-2xl font-display text-4xl font-black uppercase italic leading-[0.9] sm:text-5xl">
          Corrida boa termina em churrasco
        </h2>
        <p className="mt-4 max-w-xl text-muted">
          O campeonato é desculpa para juntar a turma. Cada etapa segue o mesmo roteiro, nesta ordem.
        </p>

        <ol className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-3">
          {roteiro.map(({ icone: Icone, titulo, texto, destaque: forte }, i) => (
            <li key={titulo} className={`relative p-6 sm:p-8 ${forte ? "bg-brand text-brand-fg" : "bg-surface"}`}>
              <div className="flex items-center justify-between">
                <Icone className={`size-8 ${forte ? "" : "text-brand"}`} strokeWidth={1.75} />
                <span
                  className={`font-display text-5xl font-black italic leading-none ${forte ? "text-brand-fg/25" : "text-white/10"}`}
                >
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-6 font-display text-2xl font-black uppercase italic leading-none">{titulo}</h3>
              <p className={`mt-3 leading-relaxed ${forte ? "font-medium" : "text-muted"}`}>{texto}</p>
            </li>
          ))}
        </ol>

        <p className="mt-5 flex items-center gap-2.5 text-sm font-semibold">
          <Beer className="size-5 text-brand" />
          Regra do grupo: cerveja só depois de descer do kart. Quem bebe não pilota.
        </p>
      </section>

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

      {/* Apoiadores: logos de quem já apoia; vazio = espaços livres */}
      <section className="mx-auto max-w-6xl px-4 pt-20">
        <div className="mb-5 flex items-baseline justify-between gap-4">
          <h2 className="font-display text-3xl font-black uppercase italic">Apoiadores</h2>
          <Link href="/apoiadores" className="text-sm font-semibold text-muted hover:text-ink">
            Ver cotas
          </Link>
        </div>
        {liga.master && (
          <p className="mb-4 text-muted">
            Patrocinador master: <span className="font-semibold text-ink">{liga.master.nome}</span>
          </p>
        )}
        <ListaApoiadores />
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
