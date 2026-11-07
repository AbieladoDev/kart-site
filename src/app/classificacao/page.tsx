import type { Metadata } from "next"
import Link from "next/link"
import { Medal } from "lucide-react"
import { classificacao, classificacaoEquipes, etapasDisputadas, pontuacao, temResultado } from "@/lib/campeonato"

export const metadata: Metadata = { title: "Classificação" }

const medalha = ["#ffd400", "#cbd5e1", "#d97706"]

function Posicao({ n }: { n: number }) {
  return (
    <span className="flex w-8 justify-center font-display text-xl font-black italic tabular-nums text-muted">
      {temResultado && n <= 3 ? <Medal className="size-5" style={{ color: medalha[n - 1] }} aria-label={`${n}º`} /> : n}
    </span>
  )
}

export default function Classificacao() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12">
      <h1 className="font-display text-5xl font-black uppercase italic leading-none sm:text-6xl">Classificação</h1>
      <p className="mt-3 max-w-xl text-muted">
        {temResultado
          ? `Depois de ${etapasDisputadas.length} etapa${etapasDisputadas.length > 1 ? "s" : ""}.`
          : "Todo mundo zerado — a tabela começa a mexer depois da etapa 1."}
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <h2 className="mb-4 font-display text-2xl font-black uppercase italic">Pilotos</h2>
          <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
            <table className="w-full min-w-[480px] text-left">
              <thead className="border-b border-line text-sm text-muted">
                <tr>
                  <th className="px-3 py-3 font-medium">
                    <span className="sr-only">Posição</span>
                  </th>
                  <th className="py-3 font-medium">Piloto</th>
                  <th className="px-3 py-3 text-right font-medium">Vit.</th>
                  <th className="px-3 py-3 text-right font-medium">Pód.</th>
                  <th className="px-4 py-3 text-right font-medium">Pts</th>
                </tr>
              </thead>
              <tbody>
                {classificacao.map((p) => (
                  <tr key={p.slug} className="border-b border-line last:border-b-0">
                    <td className="px-3 py-3">
                      <Posicao n={p.posicao} />
                    </td>
                    <td className="py-3">
                      <Link href={`/pilotos/${p.slug}`} className="flex items-center gap-3 hover:text-brand">
                        <span
                          className="flex h-7 w-10 shrink-0 items-center justify-center rounded font-display font-black italic"
                          style={{ background: p.equipe.cor1, color: p.equipe.cor2 }}
                        >
                          {p.numero}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-semibold">{p.nome}</span>
                          <span className="block truncate text-xs text-muted">{p.equipe.nome}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-muted">{p.vitorias}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-muted">{p.podios}</td>
                    <td className="px-4 py-3 text-right font-display text-xl font-black tabular-nums">{p.pontos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="space-y-12">
          <section>
            <h2 className="mb-4 font-display text-2xl font-black uppercase italic">Equipes</h2>
            <ol className="overflow-hidden rounded-2xl border border-line bg-surface">
              {classificacaoEquipes.map(({ equipe: e, pontos, posicao }) => {
                const Emblema = e.emblema
                return (
                  <li key={e.nome} className="flex items-center gap-3 border-b border-line px-3 py-3 last:border-b-0">
                    <Posicao n={posicao} />
                    <span
                      className="flex size-8 shrink-0 items-center justify-center rounded-lg border-2"
                      style={{ background: e.cor1, borderColor: e.cor2, color: e.cor2 }}
                    >
                      <Emblema className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1 truncate font-semibold">{e.nome}</span>
                    <span className="pr-1 font-display text-xl font-black tabular-nums">{pontos}</span>
                  </li>
                )
              })}
            </ol>
          </section>

          <section>
            <h2 className="mb-4 font-display text-2xl font-black uppercase italic">Pontuação por etapa</h2>
            <ol className="grid grid-cols-5 gap-2">
              {pontuacao.map((pts, i) => (
                <li key={i} className="rounded-xl border border-line bg-surface px-2 py-3 text-center">
                  <div className="text-xs text-muted">{i + 1}º</div>
                  <div className="font-display text-2xl font-black italic tabular-nums">{pts}</div>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-sm text-muted">Do {pontuacao.length + 1}º lugar em diante, zero pontos.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
