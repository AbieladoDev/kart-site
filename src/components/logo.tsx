import { useId } from "react"
import { liga } from "@/lib/liga"

/*
 * Logo do grupo "AMG Kart".
 * Símbolo: monograma AMG em traço grosso, inclinado, sobre uma faixa quadriculada de chegada.
 * Desenhado em traço (não em texto) para não depender de fonte — funciona no favicon.
 * Mesma geometria em src/app/icon.svg (favicon) — mudou aqui, mudar lá.
 */

const AMARELO = "#ffd400"
const ASFALTO = "#121216"
const GIZ = "#ecebe6"

/** Desenho do símbolo, sem o fundo — reaproveitado no quadrado e no selo. */
function Monograma() {
  return (
    <g transform="translate(32 32) scale(0.84) translate(-32 -32) translate(7.5 0) skewX(-10)">
      <path d="M5 39 L11.5 17 L18 39" fill="none" stroke={ASFALTO} strokeWidth={4.4} strokeLinejoin="bevel" strokeLinecap="butt" />
      <path d="M7.6 31.5 H15.4" fill="none" stroke={ASFALTO} strokeWidth={4.4} strokeLinejoin="bevel" strokeLinecap="butt" />
      <path d="M23 39 V17 L29.5 28 L36 17 V39" fill="none" stroke={ASFALTO} strokeWidth={4.4} strokeLinejoin="bevel" strokeLinecap="butt" />
      <path d="M54 17 H42 V39 H54 V29 H48.5" fill="none" stroke={ASFALTO} strokeWidth={4.4} strokeLinejoin="bevel" strokeLinecap="butt" />
      {/* faixa quadriculada */}
      <rect x={5} y={45} width={4.9} height={4.6} fill={GIZ} />
      <rect x={5} y={49.6} width={4.9} height={4.6} fill={ASFALTO} />
      <rect x={9.9} y={45} width={4.9} height={4.6} fill={ASFALTO} />
      <rect x={9.9} y={49.6} width={4.9} height={4.6} fill={GIZ} />
      <rect x={14.8} y={45} width={4.9} height={4.6} fill={GIZ} />
      <rect x={14.8} y={49.6} width={4.9} height={4.6} fill={ASFALTO} />
      <rect x={19.7} y={45} width={4.9} height={4.6} fill={ASFALTO} />
      <rect x={19.7} y={49.6} width={4.9} height={4.6} fill={GIZ} />
      <rect x={24.6} y={45} width={4.9} height={4.6} fill={GIZ} />
      <rect x={24.6} y={49.6} width={4.9} height={4.6} fill={ASFALTO} />
      <rect x={29.5} y={45} width={4.9} height={4.6} fill={ASFALTO} />
      <rect x={29.5} y={49.6} width={4.9} height={4.6} fill={GIZ} />
      <rect x={34.4} y={45} width={4.9} height={4.6} fill={GIZ} />
      <rect x={34.4} y={49.6} width={4.9} height={4.6} fill={ASFALTO} />
      <rect x={39.3} y={45} width={4.9} height={4.6} fill={ASFALTO} />
      <rect x={39.3} y={49.6} width={4.9} height={4.6} fill={GIZ} />
      <rect x={44.2} y={45} width={4.9} height={4.6} fill={GIZ} />
      <rect x={44.2} y={49.6} width={4.9} height={4.6} fill={ASFALTO} />
      <rect x={49.1} y={45} width={4.9} height={4.6} fill={ASFALTO} />
      <rect x={49.1} y={49.6} width={4.9} height={4.6} fill={GIZ} />
    </g>
  )
}

/** Símbolo em quadrado amarelo (favicon, avatar, cabeçalho). */
export function SimboloLiga({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="15" fill={AMARELO} />
      <Monograma />
    </svg>
  )
}

/** Símbolo + nome. A altura vem da classe (`h-10`), o tamanho do nome do `text-*`. */
export function LogoLiga({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} aria-label={liga.nome} role="img">
      <SimboloLiga className="h-full w-auto" />
      <span className="flex flex-col justify-center font-display font-black uppercase italic leading-[0.82] tracking-tight">
        <span className="text-[1.2em]">AMG</span>
        <span className="text-[0.62em] font-extrabold not-italic tracking-[0.42em] text-muted">Kart</span>
      </span>
    </span>
  )
}

/**
 * Selo redondo que vai sobreposto nas figurinhas: símbolo no centro,
 * nome e temporada no anel.
 */
export function SeloLiga({ className, title = true }: { className?: string; title?: boolean }) {
  const id = useId().replace(/:/g, "")
  const anel = `${liga.nome} · ${liga.temporada} · `.repeat(2)
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{`${liga.nome} — temporada ${liga.temporada}`}</title>}
      <defs>
        <path id={`${id}-anel`} d="M50 50 m-37.5 0 a37.5 37.5 0 1 1 75 0 a37.5 37.5 0 1 1 -75 0" />
      </defs>
      <circle cx="50" cy="50" r="49" fill={ASFALTO} />
      <circle cx="50" cy="50" r="46.5" fill="none" stroke={AMARELO} strokeWidth="1.5" />
      <text
        fill="#ecebe6"
        fontSize="8.4"
        fontWeight="800"
        letterSpacing="1.4"
        style={{ fontFamily: "var(--font-display)", textTransform: "uppercase" }}
      >
        <textPath href={`#${id}-anel`} textLength="232" lengthAdjust="spacing">
          {anel}
        </textPath>
      </text>
      <circle cx="50" cy="50" r="29" fill={AMARELO} />
      <svg x="28" y="28" width="44" height="44" viewBox="0 0 64 64">
        <Monograma />
      </svg>
    </svg>
  )
}
