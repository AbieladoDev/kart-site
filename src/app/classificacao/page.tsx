import type { Metadata } from "next"
import Link from "next/link"
import { etapasDisputadas, grid, pontuacao, temResultado } from "@/lib/campeonato"
import { Avatar, FotoFundo } from "@/components/visual"

export const metadata: Metadata = { title: "Classificação" }

const corPodio = ["#ffd23f", "#d6dae3", "#e9a46a"]

export default function Classificacao() {
  return (
    <>
      <section className="relative mx-3 mt-4 overflow-hidden rounded-[2rem]">
        <FotoFundo src="/fotos/disputa.jpg" veu="bg-gradient-to-r from-page/95 via-page/75 to-page/25" />
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <p className="text-[0.7rem] font-bold tracking-[0.2em] text-muted uppercase">
            {temResultado
              ? `Depois de ${etapasDisputadas.length} etapa${etapasDisputadas.length > 1 ? "s" : ""}`
              : "Temporada ainda não começou"}
          </p>
          <h1 className="mt-2 text-5xl font-extrabold tracking-tight sm:text-6xl">
            <span className="text-hot">Classificação</span>
          </h1>
          <p className="mt-4 max-w-md text-ink/75">
            Cada um por si. Empate em pontos desempata por vitórias e depois pela melhor chegada.
          </p>
        </div>
      </section>

      <div className="mx-auto mt-12 grid max-w-6xl gap-12 px-4 lg:grid-cols-[1.6fr_1fr]">
        <section>
          <div className="overflow-hidden rounded-3xl border border-line bg-surface">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line text-[0.65rem] tracking-[0.14em] text-muted uppercase">
                <tr>
                  <th className="py-3 pl-4 font-bold sm:pl-5">Pos</th>
                  <th className="py-3 font-bold">Piloto</th>
                  <th className="hidden px-3 py-3 text-right font-bold sm:table-cell">Vit.</th>
                  <th className="hidden px-3 py-3 text-right font-bold sm:table-cell">Pód.</th>
                  <th className="px-3 py-3 text-right font-bold">Melhor volta</th>
                  <th className="py-3 pr-4 text-right font-bold sm:pr-5">Pts</th>
                </tr>
              </thead>
              <tbody>
                {grid.map((p) => (
                  <tr key={p.slug} className="border-b border-line/60 last:border-b-0 hover:bg-white/[0.03]">
                    <td className="py-3 pl-4 sm:pl-5">
                      <span
                        className="font-num text-xl font-black tabular-nums"
                        style={{ color: corPodio[p.posicao - 1] ?? "var(--color-muted)" }}
                      >
                        {p.posicao}
                      </span>
                    </td>
                    <td className="py-3">
                      <Link href={`/pilotos/${p.slug}`} className="flex items-center gap-3 hover:text-brand">
                        <Avatar nome={p.nome} foto={p.foto} cor={p.cor} className="size-10" />
                        <span className="min-w-0">
                          <span className="block truncate font-bold">{p.nome}</span>
                          <span className="block truncate text-xs text-muted">
                            {p.corridas} {p.corridas === 1 ? "corrida" : "corridas"} · último kart {p.ultima.kart}
                          </span>
                        </span>
                      </Link>
                    </td>
                    <td className="hidden px-3 py-3 text-right tabular-nums text-muted sm:table-cell">{p.vitorias}</td>
                    <td className="hidden px-3 py-3 text-right tabular-nums text-muted sm:table-cell">{p.podios}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-muted">{p.melhorVolta}</td>
                    <td className="py-3 pr-4 text-right font-num text-xl font-black tabular-nums sm:pr-5">{p.pontos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <p className="text-[0.7rem] font-bold tracking-[0.2em] text-muted uppercase">Por etapa</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight">Pontuação</h2>
          <ol className="mt-5 grid grid-cols-5 gap-2">
            {pontuacao.map((pts, i) => (
              <li key={i} className="rounded-2xl border border-line bg-surface px-2 py-3 text-center">
                <div className="text-[0.65rem] font-bold text-muted">{i + 1}º</div>
                <div className="font-num text-2xl font-black tabular-nums" style={{ color: corPodio[i] }}>
                  {pts}
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-sm text-muted">
            Do {pontuacao.length + 1}º lugar em diante, zero pontos. Tabela provisória — combinar no grupo.
          </p>
        </section>
      </div>
    </>
  )
}
