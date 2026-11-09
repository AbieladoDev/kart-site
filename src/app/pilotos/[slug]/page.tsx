import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, ChevronRight, IdCard, UserRound } from "lucide-react"
import { acharPiloto, destaquesDa, grid, kmh, tempoMs } from "@/lib/campeonato"
import { FigurinhaFrente, FigurinhaVerso } from "@/components/figurinha"
import { FigurinhaDupla } from "@/components/figurinha-viva"
import { CompartilharWhats } from "@/components/compartilhar-whats"
import { CompartilharFigurinha } from "@/components/compartilhar-figurinha"
import { Anel } from "@/components/visual"
import { liga } from "@/lib/liga"

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return grid.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = acharPiloto((await params).slug)
  return p ? { title: p.nome } : {}
}

/** 58645 → "58.645", 60361 → "1:00.361" (mesmo formato da folha de cronometragem) */
function formatarVolta(ms: number) {
  const min = Math.floor(ms / 60000)
  const seg = ((ms % 60000) / 1000).toFixed(3)
  return min > 0 ? `${min}:${seg.padStart(6, "0")}` : seg
}

const media = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length
const umaCasa = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1 })

function Numero({ rotulo, valor, cor }: { rotulo: string; valor: React.ReactNode; cor?: string }) {
  return (
    <div>
      <dt className="text-[0.65rem] font-bold tracking-[0.16em] text-page/50 uppercase">{rotulo}</dt>
      <dd className="mt-1 font-num text-4xl leading-none font-black italic tabular-nums sm:text-5xl" style={cor ? { color: cor } : undefined}>
        {valor}
      </dd>
    </div>
  )
}

export default async function PaginaPiloto({ params }: Props) {
  const p = acharPiloto((await params).slug)
  if (!p) notFound()

  const i = grid.indexOf(p)
  const anterior = grid[(i - 1 + grid.length) % grid.length]
  const proximo = grid[(i + 1) % grid.length]
  const u = p.ultima
  const d = destaquesDa(u.etapa)
  const [primeiro, ...resto] = p.nome.split(" ")

  // Anéis da última corrida, em relação ao melhor da pista naquele dia.
  const aneis = [
    { rotulo: "Voltas completadas", valor: (u.voltas / d.voltasLider) * 100 },
    { rotulo: "Ritmo vs. volta mais rápida", valor: (tempoMs(d.voltaRapida.melhorVolta) / tempoMs(u.melhorVolta)) * 100 },
    { rotulo: "Velocidade vs. mais veloz", valor: (u.velocidade / d.maisVeloz.velocidade) * 100 },
  ]

  const temporada = [
    { rotulo: "Posição", valor: `${p.posicao}º` },
    { rotulo: "Pontos", valor: p.pontos },
    { rotulo: "Vitórias", valor: p.vitorias },
    { rotulo: "Pódios", valor: p.podios },
  ]

  // Médias por corrida disputada. `curto` = rótulo no celular (4 colunas estreitas).
  const h = p.historico
  const medias = [
    { rotulo: "Chegada média", curto: "Chegada", valor: `P${umaCasa(media(h.map((c) => c.posicao)))}` },
    { rotulo: "Pontos por corrida", curto: "Pts/corrida", valor: umaCasa(media(h.map((c) => c.pontos))) },
    { rotulo: "Melhor volta média", curto: "Volta", valor: formatarVolta(Math.round(media(h.map((c) => tempoMs(c.melhorVolta))))) },
    { rotulo: "Vel. máx média", curto: "Vel. máx", valor: umaCasa(media(h.map((c) => c.velocidade))) },
  ]

  return (
    <>
      {/* Celular: a tela inteira (100svh), sem cabeçalho — foto em cima, botões por cima da foto, números embaixo */}
      <section
        className="relative flex h-[100svh] flex-col overflow-hidden text-page md:hidden"
        style={{ background: `linear-gradient(180deg, ${p.cor} 0%, #fbfaf6 58%)` }}
      >
        <div className="relative min-h-0 flex-1">
          {p.foto ? (
            <Image
              src={p.foto}
              alt={p.nome}
              fill
              priority
              sizes="100vw"
              className="object-cover object-[50%_25%] [mask-image:linear-gradient(to_bottom,black_60%,transparent)]"
            />
          ) : (
            <div className="flex h-full items-center justify-center pt-10">
              <span className="flex size-48 items-center justify-center rounded-full bg-white/50">
                <UserRound aria-label={`${p.nome} (sem foto)`} className="size-28 text-page/30" strokeWidth={1.3} />
              </span>
            </div>
          )}
        </div>

        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <Link
            href="/pilotos"
            className="flex h-11 items-center gap-1 rounded-full bg-white/85 pr-4 pl-2.5 text-sm font-bold shadow-sm backdrop-blur"
          >
            <ChevronLeft className="size-5" /> Álbum
          </Link>
          <a href="#figurinha" className="flex h-11 items-center gap-2 rounded-full bg-page px-4 text-sm font-bold text-ink shadow-sm">
            <IdCard className="size-4 text-brand" /> Ver figurinha
          </a>
        </div>

        <div className="relative px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <div className="flex items-end justify-between gap-3">
            <h1 className="min-w-0 text-5xl leading-[0.9] font-extrabold tracking-tight">
              {primeiro}
              {resto.length > 0 && <span className="mt-1 block truncate text-2xl font-semibold text-page/55">{resto.join(" ")}</span>}
            </h1>
            <div className="shrink-0 text-right">
              <div className="text-[0.6rem] font-bold tracking-[0.16em] text-page/50 uppercase">Kart · {u.etapa.data}</div>
              <div className="font-num text-5xl leading-[0.85] font-black italic">{u.kart}</div>
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-4 gap-2 border-t border-page/10 pt-4">
            {temporada.map((n) => (
              <div key={n.rotulo}>
                <dt className="text-[0.6rem] font-bold tracking-[0.12em] text-page/50 uppercase">{n.rotulo}</dt>
                <dd className="mt-1 font-num text-3xl leading-none font-black italic tabular-nums">{n.valor}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-[0.6rem] font-bold tracking-[0.18em] text-page/45 uppercase">Médias por corrida</p>
          <dl className="mt-2 grid grid-cols-4 gap-2 border-t border-page/10 pt-3">
            {medias.map((n) => (
              <div key={n.rotulo}>
                <dt className="text-[0.6rem] font-bold tracking-[0.12em] text-page/50 uppercase">{n.curto}</dt>
                <dd className="mt-1 font-num text-xl leading-none font-black italic tabular-nums">{n.valor}</dd>
              </div>
            ))}
          </dl>

          <nav aria-label="Outros pilotos" className="mt-5 flex items-center justify-between border-t border-page/10 pt-4">
            <Link href={`/pilotos/${anterior.slug}`} className="flex min-w-0 items-center gap-1 text-sm font-bold">
              <ChevronLeft className="size-5 shrink-0" /> <span className="truncate">{anterior.primeiroNome}</span>
            </Link>
            <span className="text-xs font-semibold text-page/50">
              {p.posicao} de {grid.length}
            </span>
            <Link href={`/pilotos/${proximo.slug}`} className="flex min-w-0 items-center gap-1 text-sm font-bold">
              <span className="truncate">{proximo.primeiroNome}</span> <ChevronRight className="size-5 shrink-0" />
            </Link>
          </nav>
        </div>
      </section>

      {/* Desktop: topo claro de ponta a ponta (como o hero da home): passa por baixo do cabeçalho e funde no fundo */}
      <section
        className="relative -mt-[62px] overflow-hidden text-page max-md:hidden"
        style={{ background: `linear-gradient(120deg, #fbfaf6 0%, #fbfaf6 40%, ${p.cor} 100%)` }}
      >
        {/* foto do piloto ocupando a metade direita até a borda da tela */}
        <div className="absolute inset-y-0 right-0 hidden w-[46%] md:block">
          {p.foto ? (
            <Image
              src={p.foto}
              alt={p.nome}
              fill
              priority
              sizes="46vw"
              className="object-cover object-[50%_25%] [mask-image:linear-gradient(to_right,transparent,black_35%)]"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="flex size-72 items-center justify-center rounded-full bg-white/50">
                <UserRound aria-label={`${p.nome} (sem foto)`} className="size-40 text-page/30" strokeWidth={1.3} />
              </span>
            </div>
          )}
        </div>

        <span
          aria-hidden
          className="vazado pointer-events-none absolute top-16 left-[38%] font-num text-[18rem] leading-none font-black italic select-none max-md:hidden lg:text-[24rem]"
          style={{ color: "rgb(14 15 18 / 0.12)" }}
        >
          {u.kart}
        </span>

        <div className="relative mx-auto max-w-6xl px-5 pt-28 pb-16 sm:pt-32">
          <div className="md:max-w-[54%]">
            <Link href="/pilotos" className="inline-flex items-center gap-1 text-xs font-bold tracking-[0.14em] text-page/55 uppercase hover:text-page">
              <ChevronLeft className="size-4" /> Álbum
            </Link>

            <div className="mt-6 flex items-end gap-5">
              <h1 className="text-6xl leading-[0.9] font-extrabold tracking-tight sm:text-7xl">
                {primeiro}
                {resto.length > 0 && <span className="mt-1 block text-3xl font-semibold text-page/55 sm:text-4xl">{resto.join(" ")}</span>}
              </h1>
            </div>
            <p className="mt-4 text-sm font-semibold text-page/55">
              {liga.nome} · Temporada {liga.temporada} · kart <span className="text-page">{u.kart}</span> em {u.etapa.data}
            </p>

            <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-page/10 pt-6 sm:grid-cols-4">
              {temporada.map((n) => (
                <Numero key={n.rotulo} rotulo={n.rotulo} valor={n.valor} />
              ))}
            </dl>

            <p className="mt-8 text-[0.65rem] font-bold tracking-[0.2em] text-page/45 uppercase">Médias por corrida</p>
            <dl className="mt-3 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-page/10 pt-4 sm:grid-cols-4">
              {medias.map((n) => (
                <div key={n.rotulo}>
                  <dt className="text-[0.65rem] font-bold tracking-[0.16em] text-page/50 uppercase">{n.rotulo}</dt>
                  <dd className="mt-1 font-num text-2xl leading-none font-black italic tabular-nums sm:text-3xl">{n.valor}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex flex-wrap gap-5">
              {aneis.map((a) => (
                <Anel key={a.rotulo} valor={a.valor} rotulo={a.rotulo} />
              ))}
            </div>
            <p className="mt-3 text-xs text-page/50">Na corrida de {u.etapa.data}, comparado ao melhor da pista no dia.</p>

            <nav aria-label="Outros pilotos" className="mt-10 flex items-center gap-2">
              <Link
                href={`/pilotos/${anterior.slug}`}
                aria-label={`Anterior: ${anterior.nome}`}
                className="flex size-11 items-center justify-center rounded-full border border-page/20 transition hover:bg-page hover:text-ink"
              >
                <ChevronLeft className="size-5" />
              </Link>
              <Link
                href={`/pilotos/${proximo.slug}`}
                aria-label={`Próximo: ${proximo.nome}`}
                className="flex size-11 items-center justify-center rounded-full border border-page/20 transition hover:bg-page hover:text-ink"
              >
                <ChevronRight className="size-5" />
              </Link>
              <span className="ml-2 text-xs font-semibold text-page/50">
                {p.posicao} de {grid.length}
              </span>
            </nav>
          </div>
        </div>
      </section>

      {/* Figurinha + corridas, sem caixas: só linhas finas */}
      <div className="mx-auto mt-10 grid max-w-6xl items-start gap-12 px-4 md:mt-16 md:grid-cols-[minmax(0,340px)_1fr] lg:gap-20">
        <div id="figurinha" className="mx-auto w-full max-w-[340px] scroll-mt-6">
          <FigurinhaDupla nome={p.nome} frente={<FigurinhaFrente p={p} />} verso={<FigurinhaVerso p={p} />} />
          <div className="mt-3 flex flex-wrap items-start justify-center gap-2">
            <CompartilharFigurinha slug={p.slug} />
            <CompartilharWhats rotulo="Mandar link no WhatsApp" texto={`Olha a figurinha de ${p.nome} no álbum da ${liga.nome} ${liga.temporada} 🏁`} />
          </div>
        </div>

        <section>
          <p className="text-[0.7rem] font-bold tracking-[0.2em] text-muted uppercase">Corridas disputadas</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-extrabold tracking-tight">
              {p.corridas} {p.corridas === 1 ? "corrida" : "corridas"}
            </h2>
            <p className="text-right">
              <span className="font-num text-5xl leading-none font-black italic tabular-nums" style={{ color: p.cor }}>
                {p.pontos}
              </span>
              <span className="ml-2 text-xs font-bold tracking-[0.16em] text-muted uppercase">pontos</span>
            </p>
          </div>

          <ol className="mt-6 border-t border-line">
            {[...h].reverse().map((c) => (
              <li key={c.etapa.numero} className="border-b border-line py-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold">Corrida de {c.etapa.data}</p>
                    <p className="text-sm text-muted">
                      Etapa {c.etapa.numero} · {c.etapa.local}
                    </p>
                  </div>
                  <div className="flex items-end gap-6 text-right">
                    <div>
                      <div className="text-[0.65rem] font-bold tracking-[0.16em] text-muted uppercase">Chegada</div>
                      <div className="font-num text-4xl leading-none font-black italic" style={{ color: p.cor }}>
                        P{c.posicao}
                      </div>
                    </div>
                    <div>
                      <div className="text-[0.65rem] font-bold tracking-[0.16em] text-muted uppercase">Pontos</div>
                      <div className="font-num text-4xl leading-none font-black italic">+{c.pontos}</div>
                    </div>
                  </div>
                </div>
                <dl className="mt-5 grid grid-cols-3 gap-x-4 gap-y-4 sm:grid-cols-6">
                  {[
                    ["Kart", c.kart],
                    ["Voltas", c.voltas],
                    ["Diff", c.diff ?? "líder"],
                    ["Total", c.total],
                    ["Melhor volta", c.melhorVolta],
                    ["Vel. máx", kmh(c.velocidade)],
                  ].map(([r, v]) => (
                    <div key={r}>
                      <dt className="text-[0.65rem] font-bold tracking-[0.12em] text-muted uppercase">{r}</dt>
                      <dd className="mt-0.5 font-num text-xl font-extrabold tabular-nums">{v}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  )
}
