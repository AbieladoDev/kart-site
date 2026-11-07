import type { Metadata } from "next"
import Link from "next/link"
import { Clock, Flag, MapPin } from "lucide-react"
import { acharPiloto } from "@/lib/pilotos"
import { etapas, pontuacao, proximaEtapa } from "@/lib/campeonato"

export const metadata: Metadata = { title: "Calendário" }

export default function Calendario() {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-12">
      <h1 className="font-display text-5xl font-black uppercase italic leading-none sm:text-6xl">Calendário</h1>
      <p className="mt-3 max-w-xl text-muted">
        {etapas.length} etapas na temporada. Datas a definir são combinadas no grupo e atualizadas aqui.
      </p>

      <ol className="mt-10 space-y-4">
        {etapas.map((et) => {
          const proxima = et === proximaEtapa
          const disputada = et.resultado.length > 0
          const podio = [...et.resultado].sort((a, b) => a.posicao - b.posicao).slice(0, 3)
          return (
            <li
              key={et.numero}
              className={`grid gap-4 rounded-2xl border p-5 sm:grid-cols-[7rem_1fr] sm:p-6 ${
                proxima ? "border-brand bg-brand/10" : "border-line bg-surface"
              }`}
            >
              <div>
                <div className="text-sm text-muted">Etapa {et.numero}</div>
                <div className="font-display text-4xl font-black italic leading-none">{et.data}</div>
                {proxima && (
                  <span className="mt-2 inline-block rounded-full bg-brand px-2.5 py-0.5 text-xs font-bold text-brand-fg">
                    Próxima
                  </span>
                )}
                {disputada && (
                  <span className="mt-2 inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-bold">
                    Disputada
                  </span>
                )}
              </div>
              <div>
                <ul className="flex flex-wrap gap-x-6 gap-y-2 text-muted">
                  <li className="flex items-center gap-2">
                    <MapPin className="size-4 text-brand" /> {et.local}
                  </li>
                  {et.chegada && (
                    <li className="flex items-center gap-2">
                      <Clock className="size-4 text-brand" /> Chegar até {et.chegada}
                    </li>
                  )}
                  {et.hora && (
                    <li className="flex items-center gap-2">
                      <Flag className="size-4 text-brand" /> Largada {et.hora}
                    </li>
                  )}
                </ul>
                {podio.length > 0 && (
                  <ol className="mt-4 grid gap-2 sm:grid-cols-3">
                    {podio.map((r) => {
                      const p = acharPiloto(r.piloto)
                      return (
                        <li key={r.piloto} className="rounded-xl bg-black/30 px-3 py-2">
                          <span className="font-display font-black italic text-brand">{r.posicao}º</span>{" "}
                          {p ? (
                            <Link href={`/pilotos/${p.slug}`} className="font-semibold hover:underline">
                              {p.nome}
                            </Link>
                          ) : (
                            r.piloto
                          )}
                          <span className="ml-1 text-xs text-muted">+{pontuacao[r.posicao - 1] ?? 0}</span>
                        </li>
                      )
                    })}
                  </ol>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
