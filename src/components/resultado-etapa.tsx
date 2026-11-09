import Link from "next/link"
import { Timer } from "lucide-react"
import { comPiloto, destaquesDa, kmh, pontosDaPosicao, type Etapa } from "@/lib/campeonato"
import { Avatar } from "./visual"

const corPodio = ["#ffd23f", "#d6dae3", "#e9a46a"]

/** Folha de cronometragem da etapa, legível no celular (colunas extras somem nas telas pequenas). */
export function TabelaResultado({ etapa }: { etapa: Etapa }) {
  const { voltaRapida, maisVeloz } = destaquesDa(etapa)
  const linhas = [...etapa.resultado].sort((a, b) => a.posicao - b.posicao).map(comPiloto)

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-surface/80 backdrop-blur">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-white/10 text-[0.65rem] tracking-[0.14em] text-muted uppercase">
          <tr>
            <th className="w-10 py-3 pl-4 font-bold sm:w-auto sm:pl-5">Pos</th>
            <th className="hidden px-2 py-3 font-bold sm:table-cell">Kart</th>
            <th className="py-3 font-bold">Piloto</th>
            <th className="hidden px-3 py-3 text-right font-bold md:table-cell">Voltas</th>
            <th className="hidden px-3 py-3 text-right font-bold sm:table-cell">Diff</th>
            <th className="hidden px-3 py-3 text-right font-bold lg:table-cell">Total</th>
            <th className="hidden px-3 py-3 text-right font-bold lg:table-cell">Vel. máx</th>
            <th className="px-3 py-3 text-right font-bold">
              <span className="sm:hidden">Volta</span>
              <span className="max-sm:hidden">Melhor volta</span>
            </th>
            <th className="py-3 pr-4 text-right font-bold sm:pr-5">Pts</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((r) => (
            <tr key={r.piloto} className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.03]">
              <td className="py-2.5 pl-4 sm:pl-5">
                <span
                  className="font-num text-lg font-extrabold tabular-nums"
                  style={{ color: corPodio[r.posicao - 1] ?? "var(--color-muted)" }}
                >
                  {r.posicao}
                </span>
              </td>
              <td className="hidden px-2 py-2.5 sm:table-cell">
                <span className="inline-flex h-6 min-w-9 items-center justify-center rounded-md bg-white/90 px-1.5 font-num text-sm font-extrabold text-page tabular-nums">
                  {r.kart}
                </span>
              </td>
              <td className="py-2.5">
                <Link href={`/pilotos/${r.piloto}`} className="flex items-center gap-2.5 hover:text-brand">
                  <Avatar nome={r.p.nome} foto={r.p.foto} cor={r.p.cor} className="size-8" />
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{r.p.nome}</span>
                    <span className="block text-xs text-muted sm:hidden">
                      Kart {r.kart} · {r.diff ?? "líder"}
                    </span>
                  </span>
                </Link>
              </td>
              <td className="hidden px-3 py-2.5 text-right tabular-nums text-muted md:table-cell">{r.voltas}</td>
              <td className="hidden px-3 py-2.5 text-right tabular-nums text-muted sm:table-cell">{r.diff ?? "—"}</td>
              <td className="hidden px-3 py-2.5 text-right tabular-nums text-muted lg:table-cell">{r.total}</td>
              <td
                className={`hidden px-3 py-2.5 text-right tabular-nums lg:table-cell ${r.piloto === maisVeloz.piloto ? "font-bold text-ceu" : "text-muted"}`}
              >
                {kmh(r.velocidade)}
              </td>
              <td className="px-3 py-2.5 text-right tabular-nums">
                {r.piloto === voltaRapida.piloto ? (
                  <span className="inline-flex items-center gap-1 rounded-md bg-lavanda px-1.5 py-0.5 font-bold text-page">
                    <Timer className="size-3.5" /> {r.melhorVolta}
                  </span>
                ) : (
                  r.melhorVolta
                )}
              </td>
              <td className="py-2.5 pr-4 text-right font-num text-lg font-extrabold tabular-nums sm:pr-5">
                {pontosDaPosicao(r.posicao)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
