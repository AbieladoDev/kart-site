import { useId } from "react"
import { liga } from "@/lib/liga"

/*
 * Logo do grupo "Amigos do Kart".
 * Símbolo: uma reta de pista em perspectiva que forma um "A"; a travessa do A é a
 * linha de chegada quadriculada. Inclinado para dar velocidade.
 * Mesma geometria em src/app/icon.svg (favicon) — mudou aqui, mudar lá.
 */

const AMARELO = "#ffd400"
const ASFALTO = "#121216"

/** Desenho do símbolo, sem o fundo — reaproveitado no quadrado e no selo. */
function Pista({ id, cor = ASFALTO, faixa = AMARELO }: { id: string; cor?: string; faixa?: string }) {
  return (
    <g transform="skewX(-10) translate(5 0)">
      <defs>
        <clipPath id={`${id}-pista`}>
          <polygon points="12,52 52,52 34,8 30,8" />
        </clipPath>
        <pattern id={`${id}-xadrez`} width="5" height="5" patternUnits="userSpaceOnUse">
          <rect width="5" height="5" fill={cor} />
          <rect width="2.5" height="2.5" fill="#ecebe6" />
          <rect x="2.5" y="2.5" width="2.5" height="2.5" fill="#ecebe6" />
        </pattern>
      </defs>
      <polygon points="12,52 52,52 34,8 30,8" fill={cor} />
      <g clipPath={`url(#${id}-pista)`}>
        {/* linha de chegada = travessa do A */}
        <rect x="0" y="30" width="64" height="5" fill={`url(#${id}-xadrez)`} />
        {/* faixa central, encurtando com a perspectiva */}
        <rect x="30.6" y="40" width="2.8" height="8" rx="0.6" fill={faixa} />
        <rect x="30.9" y="22" width="2.2" height="5" rx="0.5" fill={faixa} />
        <rect x="31.35" y="14.5" width="1.3" height="2.6" rx="0.4" fill={faixa} />
      </g>
    </g>
  )
}

/** Símbolo em quadrado amarelo (favicon, avatar, cabeçalho). */
export function SimboloAmigos({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "")
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="15" fill={AMARELO} />
      <Pista id={id} />
    </svg>
  )
}

/** Símbolo + nome. `tamanho` controla a altura do conjunto via classe no pai. */
export function LogoAmigos({ className = "", compacto = false }: { className?: string; compacto?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} aria-label={liga.nome} role="img">
      <SimboloAmigos className="h-full w-auto" />
      {!compacto && (
        <span className="flex flex-col justify-center font-display font-black uppercase italic leading-[0.82] tracking-tight">
          <span className="text-[1.15em]">Amigos</span>
          <span className="text-[0.62em] tracking-[0.24em] text-muted not-italic font-extrabold">do Kart</span>
        </span>
      )}
    </span>
  )
}

/**
 * Selo redondo que vai sobreposto nas figurinhas: símbolo no centro,
 * nome e temporada no anel.
 */
export function SeloAmigos({ className, title = true }: { className?: string; title?: boolean }) {
  const id = useId().replace(/:/g, "")
  const anel = `${liga.nome} · temporada ${liga.temporada} · `
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
        fontSize="8"
        fontWeight="800"
        letterSpacing="1"
        style={{ fontFamily: "var(--font-display)", textTransform: "uppercase" }}
      >
        <textPath href={`#${id}-anel`} textLength="232" lengthAdjust="spacing">
          {anel}
        </textPath>
      </text>
      <circle cx="50" cy="50" r="29" fill={AMARELO} />
      <svg x="26" y="25" width="48" height="48" viewBox="0 0 64 64">
        <Pista id={`${id}-s`} />
      </svg>
    </svg>
  )
}
