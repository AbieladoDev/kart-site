import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Beef, Beer, Clock, Flag, MapPin, Trophy } from "lucide-react"
import { liga } from "@/lib/liga"
import { comPiloto, destaquesDa, etapas, grid, kmh, proximaEtapa, totalPilotos, ultimaEtapa, type Etapa } from "@/lib/campeonato"
import { SeletorEtapas } from "@/components/seletor-etapas"
import { FigurinhaFrente } from "@/components/figurinha"
import { FigurinhaViva } from "@/components/figurinha-viva"
import { TabelaResultado } from "@/components/resultado-etapa"
import { Avatar, FotoFundo, TituloSecao } from "@/components/visual"
import { ListaApoiadores } from "@/components/lista-apoiadores"
import { Contagem } from "./contagem"

const atalhos = [
  { href: "/pilotos", titulo: "Álbum de figurinhas", texto: "Uma figurinha por piloto, com o kart e os números da corrida.", foto: "/fotos/capacete.jpg" },
  { href: "/classificacao", titulo: "Classificação", texto: "Quem lidera a temporada depois de cada etapa.", foto: "/fotos/disputa.jpg" },
  { href: "/calendario", titulo: "Calendário", texto: "As etapas da temporada e o que já foi disputado.", foto: "/fotos/indoor-pista.jpg" },
]

const roteiro = [
  { icone: Flag, titulo: "Acelera", texto: "Capacete, bandeira verde e disputa curva por curva." },
  { icone: Trophy, titulo: "Pódio e resenha", texto: "Quem ganhou comemora, quem rodou explica." },
  { icone: Beef, titulo: "Churrasco", texto: "Fogo aceso e carne na grelha com todo mundo junto." },
  { icone: Beer, titulo: "Gelada no fim", texto: "Cerveja só depois de descer do kart. Quem bebe não pilota." },
]

export default function Home() {
  const etapa = ultimaEtapa
  const d = etapa && destaquesDa(etapa)

  const numeros = d && [
    { rotulo: "Vencedor", valor: comPiloto(d.vencedor).p.nome, detalhe: `Kart ${d.vencedor.kart} · ${d.vencedor.total}` },
    { rotulo: "Volta mais rápida", valor: d.voltaRapida.melhorVolta, detalhe: comPiloto(d.voltaRapida).p.nome },
    { rotulo: "Mais veloz", valor: kmh(d.maisVeloz.velocidade), detalhe: comPiloto(d.maisVeloz).p.nome },
    { rotulo: "Na pista", valor: `${totalPilotos} pilotos`, detalhe: `${d.voltasLider} voltas do líder` },
  ]

  return (
    <>
      {/* Abertura: foto de pista, título central, assinatura em letra cursiva */}
      <section className="relative -mt-[74px] overflow-hidden md:-mt-[62px]">
        <FotoFundo src="/fotos/indoor-curva.jpg" prioridade posicao="60% 50%" veu="bg-[linear-gradient(to_bottom,var(--color-page)_0%,rgb(14_15_18/0.55)_18%,rgb(14_15_18/0.35)_45%,rgb(14_15_18/0.8)_78%,var(--color-page)_100%)]" />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[22%] text-center text-[34vw] leading-none font-extrabold tracking-tighter text-white/[0.06] select-none sm:text-[22vw]"
        >
          {liga.sigla}
        </span>

        <div className="relative mx-auto flex min-h-[92svh] max-w-6xl flex-col px-5 pt-32 pb-8 sm:min-h-[44rem] sm:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-[2.6rem] leading-[1.02] font-extrabold tracking-tight sm:text-6xl">
              Na pista ninguém alivia.
              <br />
              Depois, é resenha.
            </h1>
            <p className="relative z-10 -mt-1 -rotate-3 font-script text-5xl text-brand drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] sm:-mt-2 sm:text-7xl">
              {liga.apelido}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="#resultado"
                className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-page transition hover:bg-brand"
              >
                Ver resultado da corrida
              </a>
              <Link
                href="/pilotos"
                className="rounded-full border border-white/25 px-6 py-3 text-sm font-bold text-ink backdrop-blur transition hover:border-ink"
              >
                Abrir o álbum
              </Link>
            </div>
          </div>

          {etapa && numeros && (
            <div className="mt-auto pt-16">
              <p className="text-sm font-bold">
                Corrida de {etapa.data} <span className="font-medium text-muted">· {etapa.local}</span>
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-4">
                {numeros.map((n) => (
                  <div key={n.rotulo} className="border-t border-white/15 pt-3">
                    <dt className="text-[0.65rem] font-bold tracking-[0.16em] text-muted uppercase">{n.rotulo}</dt>
                    <dd className="mt-1 truncate text-base font-bold sm:text-lg">{n.valor}</dd>
                    <dd className="truncate text-xs text-muted">{n.detalhe}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </section>

      {/* Atalhos em foto (cartões grandes) */}
      {/* celular: carrossel com encaixe; desktop: 3 colunas */}
      <section className="mx-auto flex max-w-6xl snap-x snap-mandatory gap-3 overflow-x-auto px-4 pt-3 [scrollbar-width:none] md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:pt-6">
        {atalhos.map((a) => (
          <Link key={a.href} href={a.href} className="group relative flex aspect-[4/5] w-[78%] shrink-0 snap-center overflow-hidden rounded-[1.75rem] md:aspect-[3/4] md:w-auto">
            <Image src={a.foto} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-page via-page/30 to-transparent" />
            <div className="relative mt-auto p-6">
              <h2 className="text-3xl leading-none font-extrabold tracking-tight">{a.titulo}</h2>
              <p className="mt-2 max-w-xs text-sm text-ink/75">{a.texto}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.14em] text-brand uppercase">
                Abrir <ArrowUpRight className="size-4" />
              </span>
            </div>
          </Link>
        ))}
      </section>

      {/* Etapas: etiquetas no topo escolhem a etapa; disputada mostra pódio + folha, as outras "a definir" */}
      <SeletorEtapas
        inicial={Math.max(0, etapas.indexOf(ultimaEtapa ?? etapas[0]))}
        abas={etapas.map((et) => ({
          numero: et.numero,
          rotulo: `Etapa ${et.numero}`,
          detalhe: et.resultado.length > 0 ? `Corrida de ${et.data}` : et.data === "A definir" ? "Data a definir" : et.data,
        }))}
        paineis={etapas.map((et) => (et.resultado.length > 0 ? <PainelEtapa key={et.numero} etapa={et} /> : <EtapaAguardando key={et.numero} etapa={et} />))}
      />

      {/* Próxima etapa: contagem em placas */}
      {proximaEtapa && (
        <section className="relative mx-3 mt-4 overflow-hidden rounded-[2rem]">
          <FotoFundo src={proximaEtapa.foto} veu="bg-page/70" />
          <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center sm:py-28">
            <div className="vidro w-full max-w-3xl rounded-3xl border border-white/10 p-6 sm:p-10">
              <p className="text-sm font-bold">
                Etapa {proximaEtapa.numero}
                <span className="text-muted"> · {proximaEtapa.data === "A definir" ? "data a definir" : proximaEtapa.data}</span>
              </p>
              <div className="mt-5">
                <Contagem alvo={proximaEtapa.iso} />
              </div>
              {!proximaEtapa.iso && (
                <p className="mt-5 text-sm text-muted">A contagem começa quando a data for marcada no grupo.</p>
              )}
            </div>
            <ul className="mt-6 flex flex-wrap justify-center gap-2 text-sm">
              <li className="vidro flex items-center gap-2 rounded-full border border-white/10 px-4 py-2">
                <MapPin className="size-4 text-hot" /> {proximaEtapa.local}
              </li>
              {proximaEtapa.chegada && (
                <li className="vidro flex items-center gap-2 rounded-full border border-white/10 px-4 py-2">
                  <Clock className="size-4 text-hot" /> Chegar até {proximaEtapa.chegada}
                </li>
              )}
              <li>
                <Link href="/calendario" className="flex items-center gap-2 rounded-full bg-hot px-5 py-2 font-bold text-page transition hover:brightness-110">
                  Ver calendário
                </Link>
              </li>
            </ul>
          </div>
        </section>
      )}

      {/* O grid: cartões pequenos, um por piloto */}
      <section className="mx-auto max-w-6xl px-4 pt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <TituloSecao rotulo="Cada um por si" antes="Quem acelerou na " destaque="temporada" />
          <Link href="/classificacao" className="inline-flex items-center gap-1 text-sm font-bold text-muted hover:text-ink">
            Classificação completa <ArrowRight className="size-4" />
          </Link>
        </div>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/pilotos/${p.slug}`}
                className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 transition hover:border-white/25"
              >
                <Avatar nome={p.nome} foto={p.foto} cor={p.cor} className="size-12" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold">{p.nome}</span>
                  <span className="block truncate text-xs text-muted">
                    Kart {p.ultima.kart} · melhor volta {p.melhorVolta}
                  </span>
                </span>
                <span className="text-right">
                  <span className="block font-num text-2xl leading-none font-black tabular-nums" style={{ color: p.cor }}>
                    {p.posicao}º
                  </span>
                  <span className="text-[0.65rem] font-bold text-muted">{p.pontos} pts</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* O dia de corrida: foto da turma + roteiro */}
      <section className="mx-auto max-w-6xl px-4 pt-24">
        <div className="grid items-center gap-8 rounded-[2rem] border border-line bg-surface p-3 md:grid-cols-[1fr_1.1fr] md:p-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] md:aspect-auto md:h-full md:min-h-96">
            <Image src="/fotos/turma.jpg" alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="px-3 pb-4 md:px-4 md:py-6">
            <TituloSecao rotulo="O roteiro de cada etapa" antes="Corrida boa termina em " destaque="churrasco" />
            <p className="mt-4 max-w-md text-muted">
              O campeonato é desculpa para juntar a turma. Cada etapa segue o mesmo roteiro, nesta ordem.
            </p>
            <ol className="mt-8 grid gap-3 sm:grid-cols-2">
              {roteiro.map(({ icone: Icone, titulo, texto }) => (
                <li key={titulo} className="rounded-2xl border border-line bg-page/60 p-4">
                  <Icone className="size-5 text-hot" strokeWidth={2} />
                  <h3 className="mt-3 font-bold">{titulo}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Apoiadores */}
      <section className="mx-auto max-w-6xl px-4 pt-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <TituloSecao rotulo="Quem faz acontecer" antes="Nossos " destaque="apoiadores" />
          <Link href="/apoiadores" className="inline-flex items-center gap-1 text-sm font-bold text-muted hover:text-ink">
            Quero apoiar <ArrowRight className="size-4" />
          </Link>
        </div>
        {liga.master && (
          <p className="mb-4 text-muted">
            Patrocinador master: <span className="font-semibold text-ink">{liga.master.nome}</span>
          </p>
        )}
        <ListaApoiadores />
      </section>
    </>
  )
}

/** Painel da etapa disputada: título, pódio em figurinhas e a folha de cronometragem. */
function PainelEtapa({ etapa }: { etapa: Etapa }) {
  const podio = [2, 1, 3]
    .map((n) => etapa.resultado.find((r) => r.posicao === n))
    .filter((r) => r !== undefined)
    .map(comPiloto)
  return (
    <>
      <TituloSecao
        rotulo={`Etapa ${etapa.numero} · ${etapa.local}${etapa.categoria ? ` · ${etapa.categoria}` : ""}`}
        antes="Corrida de "
        destaque={etapa.data}
      />

      <ol className="mx-auto mt-10 grid max-w-3xl grid-cols-3 items-end gap-3 sm:gap-6">
        {podio.map((r) => {
          const p = grid.find((x) => x.slug === r.piloto)!
          return (
            <li key={r.piloto} className={r.posicao === 1 ? "" : "pt-10"}>
              <Link href={`/pilotos/${p.slug}`} aria-label={`Figurinha de ${p.nome}`} className="block">
                <FigurinhaViva>
                  <FigurinhaFrente p={p} />
                </FigurinhaViva>
              </Link>
              <p className="mt-3 text-center font-num text-3xl font-black text-brand italic">{r.posicao}º</p>
            </li>
          )
        })}
      </ol>

      <div className="mt-12">
        <TabelaResultado etapa={etapa} />
        <p className="mt-3 text-xs text-muted">
          Pontos provisórios (25-18-15-12-10-8-6-4-2-1). Em destaque: a volta mais rápida e a maior velocidade.
        </p>
      </div>
    </>
  )
}

/** Etapa ainda não disputada: só o que se sabe (data/local) e o aviso de que o resultado entra aqui. */
function EtapaAguardando({ etapa }: { etapa: Etapa }) {
  return (
    <div className="py-10 text-center">
      <TituloSecao rotulo={`Etapa ${etapa.numero}`} antes={etapa.data === "A definir" ? "Data " : "Corrida de "} destaque={etapa.data === "A definir" ? "a definir" : etapa.data} />
      <p className="mx-auto mt-4 max-w-md text-muted">
        {etapa.local === "A definir" ? "Local e data são combinados no grupo." : `${etapa.local}.`} O pódio e a folha de
        cronometragem aparecem aqui depois da corrida.
      </p>
    </div>
  )
}
