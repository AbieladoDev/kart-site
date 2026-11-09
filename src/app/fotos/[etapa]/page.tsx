import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { etapasDoAlbum } from "@/lib/campeonato"
import { fotosDaEtapa } from "@/lib/fotos"
import { AlbumFotos } from "@/components/album-fotos"

type Props = { params: Promise<{ etapa: string }> }

const acharEtapa = (param: string) => etapasDoAlbum.find((e) => String(e.numero) === param)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const et = acharEtapa((await params).etapa)
  return { title: et ? `Fotos da Etapa ${et.numero}` : "Fotos" }
}

// Lista o bucket a cada visita: foto enviada aparece na hora para todo mundo.
export const dynamic = "force-dynamic"

export default async function FotosDaEtapa({ params }: Props) {
  const et = acharEtapa((await params).etapa)
  if (!et) notFound()
  const fotos = await fotosDaEtapa(et.numero)

  return (
    <div className="mx-auto max-w-6xl px-3 pt-10 sm:px-4">
      <Link
        href="/fotos"
        className="vidro inline-flex h-10 items-center gap-1 rounded-full border border-white/15 pr-4 pl-2.5 text-sm font-bold hover:border-white/40"
      >
        <ChevronLeft className="size-4" /> Todas as etapas
      </Link>

      <p className="mt-8 text-[0.7rem] font-bold tracking-[0.2em] text-muted uppercase">
        {et.data === "A definir" ? "Data a definir" : `${et.data} · ${et.local}`} · {fotos.length === 1 ? "1 foto" : `${fotos.length} fotos`}
      </p>
      <h1 className="mt-2 text-5xl font-extrabold tracking-tight sm:text-6xl">
        Etapa <span className="text-hot">{et.numero}</span>
      </h1>
      <p className="mt-4 max-w-md text-muted">Tire uma foto ou toque no + para mandar as suas. Todo mundo vê.</p>

      <div className="mt-10">
        <AlbumFotos numero={et.numero} rotulo={`Etapa ${et.numero}`} fotos={fotos} />
      </div>
    </div>
  )
}
