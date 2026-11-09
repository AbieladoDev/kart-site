import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Clock, Flag, MapPin } from "lucide-react"
import { comPiloto, etapas, proximaEtapa } from "@/lib/campeonato"
import { TabelaResultado } from "@/components/resultado-etapa"
import { Avatar } from "@/components/visual"

export const metadata: Metadata = { title: "Calendário" }

export default function Calendario() {
  return (
    <div className="mx-auto max-w-6xl px-3 pt-10 sm:px-4">
      <p className="text-[0.7rem] font-bold tracking-[0.2em] text-muted uppercase">{etapas.length} etapas na temporada</p>
      <h1 className="mt-2 text-5xl font-extrabold tracking-tight sm:text-6xl">
        <span className="text-hot">Calendário</span>
      </h1>
      <p className="mt-4 max-w-md text-muted">Datas a definir são combinadas no grupo e atualizadas aqui.</p>

      <ol className="mt-10 space-y-4">
        {etapas.map((et) => {
          const proxima = et === proximaEtapa
          const disputada = et.resultado.length > 0
          const podio = [...et.resultado].sort((a, b) => a.posicao - b.posicao).slice(0, 3).map(comPiloto)
          return (
            <li key={et.numero} className="overflow-hidden rounded-[2rem] border border-line bg-surface">
              <div className="relative">
                <Image src={et.foto} alt="" fill sizes="100vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-page/95 via-page/80 to-page/30" />
                <div className="relative flex flex-wrap items-end justify-between gap-6 p-6 sm:p-8">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold tracking-[0.16em] text-muted uppercase">Etapa {et.numero}</span>
                      {proxima && <span className="rounded-full bg-brand px-2.5 py-0.5 text-[0.65rem] font-bold text-brand-fg">Próxima</span>}
                      {disputada && <span className="rounded-full bg-menta px-2.5 py-0.5 text-[0.65rem] font-bold text-page">Disputada</span>}
                    </div>
                    <div className="mt-1 text-4xl font-extrabold tracking-tight sm:text-5xl">
                      {disputada ? `Corrida de ${et.data}` : et.data}
                    </div>
                    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink/75">
                      <li className="flex items-center gap-1.5">
                        <MapPin className="size-4 text-hot" /> {et.local}
                      </li>
                      {et.chegada && (
                        <li className="flex items-center gap-1.5">
                          <Clock className="size-4 text-hot" /> Chegada {et.chegada}
                        </li>
                      )}
                      {et.hora && (
                        <li className="flex items-center gap-1.5">
                          <Flag className="size-4 text-hot" /> Largada {et.hora}
                        </li>
                      )}
                    </ul>
                  </div>
                  {podio.length > 0 && (
                    <ol className="flex flex-wrap gap-2">
                      {podio.map((r) => (
                        <li key={r.piloto}>
                          <Link
                            href={`/pilotos/${r.piloto}`}
                            className="vidro flex items-center gap-2 rounded-full border border-white/10 py-1 pr-4 pl-1 text-sm hover:border-white/30"
                          >
                            <Avatar nome={r.p.nome} foto={r.p.foto} cor={r.p.cor} className="size-8" />
                            <span className="font-num font-black text-brand">{r.posicao}º</span>
                            <span className="font-semibold">{r.p.nome}</span>
                          </Link>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </div>
              {disputada && (
                <details className="group border-t border-line">
                  <summary className="cursor-pointer list-none px-6 py-4 text-sm font-bold text-muted hover:text-ink sm:px-8">
                    <span className="group-open:hidden">Ver resultado completo</span>
                    <span className="hidden group-open:inline">Esconder resultado</span>
                  </summary>
                  <div className="px-3 pb-3 sm:px-4 sm:pb-4">
                    <TabelaResultado etapa={et} />
                  </div>
                </details>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
