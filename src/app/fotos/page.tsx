/* eslint-disable @next/next/no-img-element -- miniaturas vêm do R2 já no tamanho certo */
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Camera, ChevronRight, MapPin } from "lucide-react"
import { etapasDoAlbum } from "@/lib/campeonato"
import { fotosDaEtapa } from "@/lib/fotos"

export const metadata: Metadata = { title: "Fotos" }

// Lista o bucket a cada visita: foto enviada aparece na hora para todo mundo.
export const dynamic = "force-dynamic"

export default async function Fotos() {
  const etapas = await Promise.all(etapasDoAlbum.map(async (et) => ({ et, fotos: await fotosDaEtapa(et.numero) })))
  const total = etapas.reduce((s, e) => s + e.fotos.length, 0)

  return (
    <div className="mx-auto max-w-6xl px-3 pt-10 sm:px-4">
      <p className="text-[0.7rem] font-bold tracking-[0.2em] text-muted uppercase">
        {total === 1 ? "1 foto" : `${total} fotos`} da temporada
      </p>
      <h1 className="mt-2 text-5xl font-extrabold tracking-tight sm:text-6xl">
        <span className="text-hot">Fotos</span>
      </h1>
      <p className="mt-4 max-w-md text-muted">Escolha a etapa para ver as fotos e mandar as suas. Todo mundo vê.</p>

      <ol className="mt-10 space-y-4">
        {etapas.map(({ et, fotos }) => {
          const disputada = et.resultado.length > 0
          return (
            <li key={et.numero}>
              <Link
                href={`/fotos/${et.numero}`}
                className="group relative block overflow-hidden rounded-[2rem] border border-line bg-surface transition hover:border-white/30"
              >
                <Image src={et.foto} alt="" fill sizes="100vw" className="object-cover transition duration-500 group-hover:scale-[1.02]" />
                <div className="absolute inset-0 bg-gradient-to-r from-page/95 via-page/80 to-page/30" />
                <div className="relative flex flex-wrap items-end justify-between gap-6 p-6 sm:p-8">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold tracking-[0.16em] text-muted uppercase">Etapa {et.numero}</span>
                      {!disputada && <span className="rounded-full bg-brand px-2.5 py-0.5 text-[0.65rem] font-bold text-brand-fg">Próxima</span>}
                    </div>
                    <div className="mt-1 text-4xl font-extrabold tracking-tight sm:text-5xl">
                      {disputada ? `Corrida de ${et.data}` : et.data}
                    </div>
                    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink/75">
                      <li className="flex items-center gap-1.5">
                        <MapPin className="size-4 text-hot" /> {et.local}
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Camera className="size-4 text-hot" /> {fotos.length === 1 ? "1 foto" : `${fotos.length} fotos`}
                      </li>
                    </ul>
                  </div>

                  <div className="flex items-center gap-3">
                    {fotos.length > 0 && (
                      <ul className="flex -space-x-3" aria-hidden>
                        {fotos.slice(0, 4).map((f) => (
                          <li key={f.chave} className="size-14 overflow-hidden rounded-xl border-2 border-page bg-surface">
                            <img src={f.miniatura} alt="" loading="lazy" className="size-full object-cover" />
                          </li>
                        ))}
                      </ul>
                    )}
                    <span className="vidro flex items-center gap-1 rounded-full border border-white/15 py-2 pr-3 pl-4 text-sm font-bold">
                      Abrir <ChevronRight className="size-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
