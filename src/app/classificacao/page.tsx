import type { Metadata } from "next"
import Link from "next/link"
import { Timer, Zap } from "lucide-react"
import { comPiloto, destaquesDa, etapas, etapasDisputadas, grid, kmh, pontosDaPosicao, pontuacao, type Etapa } from "@/lib/campeonato"
import { Abas } from "@/components/abas"
import { Avatar, FotoFundo } from "@/components/visual"

export const metadata: Metadata = { title: "Classificação" }

/** Ouro, prata, bronze: cor da posição e da faixa lateral do pódio. */
const corPodio = ["#ffd23f", "#d6dae3", "#e9a46a"]
const corDa = (pos: number) => corPodio[pos - 1]

const th = "py-3 text-[0.62rem] font-bold tracking-[0.16em] text-muted uppercase"

/** Célula da posição: número grande em itálico, faixa colorida à esquerda no pódio. */
function Posicao({ n }: { n: number }) {
  const cor = corDa(n)
  return (
    <td className="relative w-14 py-4 pl-4 sm:w-20 sm:pl-6">
      {cor && <span aria-hidden className="absolute inset-y-2 left-0 w-1 rounded-r-full" style={{ background: cor }} />}
      <span className="font-num text-3xl leading-none font-black italic tabular-nums sm:text-4xl" style={{ color: cor ?? "var(--color-muted)" }}>
        {n}
      </span>
    </td>
  )
}

function Piloto({ slug, nome, foto, cor, sub }: { slug: string; nome: string; foto?: string; cor: string; sub: React.ReactNode }) {
  return (
    <td className="py-4">
      <Link href={`/pilotos/${slug}`} className="group flex items-center gap-3">
        <Avatar nome={nome} foto={foto} cor={cor} className="size-10 sm:size-12" />
        <span className="min-w-0">
          <span className="block truncate font-bold transition group-hover:text-brand sm:text-lg">{nome}</span>
          <span className="block truncate text-xs text-muted">{sub}</span>
        </span>
      </Link>
    </td>
  )
}

function Pontos({ valor }: { valor: number }) {
  return (
    <td className="py-4 pr-4 text-right sm:pr-6">
      <span className="font-num text-3xl leading-none font-black italic tabular-nums sm:text-4xl">{valor}</span>
      <span className="ml-1 text-[0.6rem] font-bold text-muted uppercase">pts</span>
    </td>
  )
}

const linha = "border-b border-white/[0.06] transition last:border-b-0 hover:bg-white/[0.035]"
const caixa = "overflow-hidden rounded-3xl bg-surface/85 ring-1 ring-white/[0.06] backdrop-blur"

/** Classificação geral da temporada. */
function TabelaGeral() {
  const lider = grid[0]?.pontos ?? 0
  return (
    <div className={caixa}>
      <table className="w-full text-left">
        <thead className="border-b border-white/10">
          <tr>
            <th className={`${th} pl-4 sm:pl-6`}>Pos</th>
            <th className={th}>Piloto</th>
            <th className={`${th} hidden px-3 text-right md:table-cell`}>Corridas</th>
            <th className={`${th} hidden px-3 text-right sm:table-cell`}>Vit.</th>
            <th className={`${th} hidden px-3 text-right sm:table-cell`}>Pód.</th>
            <th className={`${th} hidden px-3 text-right lg:table-cell`}>Melhor volta</th>
            <th className={`${th} hidden px-3 text-right md:table-cell`}>Para o líder</th>
            <th className={`${th} pr-4 text-right sm:pr-6`}>Pontos</th>
          </tr>
        </thead>
        <tbody>
          {grid.map((p) => (
            <tr key={p.slug} className={linha}>
              <Posicao n={p.posicao} />
              <Piloto
                slug={p.slug}
                nome={p.nome}
                foto={p.foto}
                cor={p.cor}
                sub={
                  <>
                    {p.corridas} {p.corridas === 1 ? "corrida" : "corridas"} · último kart {p.ultima.kart}
                  </>
                }
              />
              <td className="hidden px-3 py-4 text-right font-num text-xl font-extrabold tabular-nums md:table-cell">{p.corridas}</td>
              <td className="hidden px-3 py-4 text-right font-num text-xl font-extrabold tabular-nums sm:table-cell">{p.vitorias}</td>
              <td className="hidden px-3 py-4 text-right font-num text-xl font-extrabold tabular-nums sm:table-cell">{p.podios}</td>
              <td className="hidden px-3 py-4 text-right font-num text-xl font-extrabold tabular-nums text-muted lg:table-cell">{p.melhorVolta}</td>
              <td className="hidden px-3 py-4 text-right font-num text-xl font-extrabold tabular-nums text-muted md:table-cell">
                {p.posicao === 1 ? "—" : `−${lider - p.pontos}`}
              </td>
              <Pontos valor={p.pontos} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Resultado de uma etapa: a folha de cronometragem no mesmo visual da geral. */
function TabelaEtapa({ etapa }: { etapa: Etapa }) {
  const { voltaRapida, maisVeloz } = destaquesDa(etapa)
  const linhas = [...etapa.resultado].sort((a, b) => a.posicao - b.posicao).map(comPiloto)
  return (
    <>
      <div className="mb-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <span className="flex items-center gap-2">
          <Timer className="size-4 text-lavanda" /> Volta mais rápida:{" "}
          <b>
            {comPiloto(voltaRapida).p.nome} · {voltaRapida.melhorVolta}
          </b>
        </span>
        <span className="flex items-center gap-2">
          <Zap className="size-4 text-ceu" /> Mais veloz:{" "}
          <b>
            {comPiloto(maisVeloz).p.nome} · {kmh(maisVeloz.velocidade)}
          </b>
        </span>
      </div>
      <div className={caixa}>
        <table className="w-full text-left">
          <thead className="border-b border-white/10">
            <tr>
              <th className={`${th} pl-4 sm:pl-6`}>Pos</th>
              <th className={`${th} hidden px-2 sm:table-cell`}>Kart</th>
              <th className={th}>Piloto</th>
              <th className={`${th} hidden px-3 text-right md:table-cell`}>Voltas</th>
              <th className={`${th} hidden px-3 text-right md:table-cell`}>Diff</th>
              <th className={`${th} hidden px-3 text-right lg:table-cell`}>Total</th>
              <th className={`${th} hidden px-3 text-right lg:table-cell`}>Vel. máx</th>
              <th className={`${th} hidden px-3 text-right sm:table-cell`}>Melhor volta</th>
              <th className={`${th} pr-4 text-right sm:pr-6`}>Pontos</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((r) => (
              <tr key={r.piloto} className={linha}>
                <Posicao n={r.posicao} />
                <td className="hidden px-2 py-4 sm:table-cell">
                  <span className="inline-flex h-7 min-w-10 items-center justify-center rounded-md bg-ink px-1.5 font-num text-base font-black text-page italic tabular-nums">
                    {r.kart}
                  </span>
                </td>
                <Piloto
                  slug={r.piloto}
                  nome={r.p.nome}
                  foto={r.p.foto}
                  cor={r.p.cor}
                  sub={
                    <>
                      <span className="sm:hidden">
                        Kart {r.kart} · {r.melhorVolta} ·{" "}
                      </span>
                      {r.diff ? `+${r.diff.includes("volta") ? r.diff : `${r.diff}s`}` : "vencedor"}
                    </>
                  }
                />
                <td className="hidden px-3 py-4 text-right font-num text-xl font-extrabold tabular-nums md:table-cell">{r.voltas}</td>
                <td className="hidden px-3 py-4 text-right font-num text-xl font-extrabold tabular-nums text-muted md:table-cell">{r.diff ?? "—"}</td>
                <td className="hidden px-3 py-4 text-right font-num text-xl font-extrabold tabular-nums text-muted lg:table-cell">{r.total}</td>
                <td
                  className={`hidden px-3 py-4 text-right font-num text-xl font-extrabold tabular-nums lg:table-cell ${r.piloto === maisVeloz.piloto ? "text-ceu" : "text-muted"}`}
                >
                  {kmh(r.velocidade).replace(" km/h", "")}
                </td>
                <td
                  className={`hidden px-3 py-4 text-right font-num text-xl font-extrabold tabular-nums sm:table-cell ${r.piloto === voltaRapida.piloto ? "text-lavanda" : ""}`}
                >
                  {r.melhorVolta}
                </td>
                <Pontos valor={pontosDaPosicao(r.posicao)} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function EtapaAguardando({ etapa }: { etapa: Etapa }) {
  return (
    <div className={`${caixa} px-6 py-16 text-center`}>
      <p className="text-[0.7rem] font-bold tracking-[0.2em] text-muted uppercase">Etapa {etapa.numero}</p>
      <p className="mt-2 text-2xl font-extrabold">{etapa.data === "A definir" ? "Data a definir" : `Corrida de ${etapa.data}`}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">A classificação da etapa aparece aqui depois da corrida.</p>
    </div>
  )
}

export default function Classificacao() {
  const abas = [
    { rotulo: "Geral", detalhe: `${etapasDisputadas.length} de ${etapas.length} etapas` },
    ...etapas.map((et) => ({
      rotulo: `Etapa ${et.numero}`,
      detalhe: et.resultado.length > 0 ? `Corrida de ${et.data}` : "Data a definir",
    })),
  ]
  const paineis = [
    <TabelaGeral key="geral" />,
    ...etapas.map((et) => (et.resultado.length > 0 ? <TabelaEtapa key={et.numero} etapa={et} /> : <EtapaAguardando key={et.numero} etapa={et} />)),
  ]

  return (
    <>
      {/* topo de ponta a ponta, foto fundindo no fundo (como o hero da home) */}
      <section className="relative -mt-[74px] overflow-hidden md:-mt-[62px]">
        <FotoFundo
          src="/fotos/disputa.jpg"
          prioridade
          veu="bg-[linear-gradient(to_bottom,var(--color-page)_0%,rgb(14_15_18/0.6)_25%,rgb(14_15_18/0.75)_60%,var(--color-page)_100%)]"
        />
        <div className="relative mx-auto max-w-6xl px-4 pt-36 pb-10 sm:pt-40">
          <p className="text-[0.7rem] font-bold tracking-[0.2em] text-muted uppercase">Temporada 2026 · cada um por si</p>
          <h1 className="mt-2 text-5xl font-extrabold tracking-tight sm:text-7xl">
            <span className="text-hot">Classificação</span>
          </h1>
          <p className="mt-4 max-w-md text-ink/75">
            A geral soma todas as etapas. Empate em pontos desempata por vitórias e depois pela melhor chegada.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <Abas rotulo="Classificação" abas={abas} paineis={paineis} />

        <section className="mt-16">
          <p className="text-[0.7rem] font-bold tracking-[0.2em] text-muted uppercase">Por etapa</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight">Pontuação</h2>
          <ol className="mt-5 grid grid-cols-5 gap-x-2 gap-y-5 sm:grid-cols-10">
            {pontuacao.map((pts, i) => (
              <li key={i} className="border-t border-line pt-3 text-center">
                <div className="text-[0.62rem] font-bold tracking-[0.14em] text-muted uppercase">{i + 1}º</div>
                <div className="font-num text-3xl font-black italic tabular-nums" style={{ color: corDa(i + 1) }}>
                  {pts}
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-muted">
            Do {pontuacao.length + 1}º lugar em diante, zero pontos. Tabela provisória — combinar no grupo.
          </p>
        </section>
      </div>
    </>
  )
}
