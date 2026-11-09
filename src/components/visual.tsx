import Image from "next/image"
import { UserRound } from "lucide-react"

/**
 * Foto de fundo de seção (public/fotos) com véu escuro por cima para o texto ler bem.
 * `veu` = classes do gradiente; o padrão escurece mais embaixo.
 */
export function FotoFundo({
  src,
  veu = "bg-gradient-to-b from-page/70 via-page/55 to-page",
  posicao = "center",
  prioridade = false,
}: {
  src: string
  veu?: string
  posicao?: string
  prioridade?: boolean
}) {
  return (
    <>
      <Image
        src={src}
        alt=""
        fill
        priority={prioridade}
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: posicao }}
      />
      <div className={`absolute inset-0 ${veu}`} />
    </>
  )
}

/** Foto do piloto ou, sem foto, ícone de usuário sobre o tom pastel dele. */
export function Avatar({
  nome,
  foto,
  cor,
  className = "size-11",
}: {
  nome: string
  foto?: string
  cor: string
  className?: string
}) {
  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full ${className}`}
      style={{ background: cor }}
    >
      {foto ? (
        <Image src={foto} alt={nome} fill sizes="96px" className="object-cover object-[50%_25%]" />
      ) : (
        <UserRound aria-label={`${nome} (sem foto)`} className="size-[58%] text-black/45" strokeWidth={1.75} />
      )}
    </span>
  )
}

/** Título de seção: rótulo pequeno + frase com uma palavra em destaque. */
export function TituloSecao({
  rotulo,
  antes,
  destaque,
  depois,
  className = "",
}: {
  rotulo?: string
  antes?: string
  destaque?: string
  depois?: string
  className?: string
}) {
  return (
    <div className={className}>
      {rotulo && <p className="text-[0.7rem] font-bold tracking-[0.2em] text-muted uppercase">{rotulo}</p>}
      <h2 className="mt-2 text-3xl leading-[1.05] font-extrabold tracking-tight sm:text-4xl">
        {antes}
        {destaque && <span className="text-hot">{destaque}</span>}
        {depois}
      </h2>
    </div>
  )
}

/** Anel de porcentagem em CSS (conic-gradient), estilo painel de F1. */
export function Anel({ valor, rotulo, cor = "#121216" }: { valor: number; rotulo: string; cor?: string }) {
  const v = Math.max(0, Math.min(100, valor))
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div
        className="relative grid size-20 place-items-center rounded-full sm:size-24"
        style={{ background: `conic-gradient(${cor} ${v * 3.6}deg, rgb(0 0 0 / 0.1) 0)` }}
      >
        <div className="absolute inset-[7px] rounded-full bg-white/80" />
        <span className="relative font-num text-xl font-extrabold tabular-nums sm:text-2xl">
          {v.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%
        </span>
      </div>
      <span className="max-w-24 text-[0.7rem] leading-tight font-semibold text-black/60">{rotulo}</span>
    </div>
  )
}
