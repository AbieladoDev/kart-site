/**
 * Desenho do traçado da pista. `d` = caminho SVG fechado num viewBox 300×180
 * (vem de `etapa.tracado`, em src/lib/campeonato.ts).
 * Asfalto escuro com zebra clara nas bordas, faixa central e a linha de chegada.
 */
export function TracadoPista({ d, nome, className }: { d: string; nome: string; className?: string }) {
  return (
    <svg viewBox="0 0 300 180" className={className} role="img" aria-label={`Traçado da pista: ${nome}`}>
      <defs>
        <pattern id="tracado-xadrez" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="#121216" />
          <rect width="2" height="2" fill="#ecebe6" />
          <rect x="2" y="2" width="2" height="2" fill="#ecebe6" />
        </pattern>
      </defs>
      <path d={d} fill="none" stroke="#ecebe6" strokeWidth="17" strokeLinejoin="round" strokeDasharray="6 6" />
      <path d={d} fill="none" stroke="#dc2626" strokeWidth="17" strokeLinejoin="round" strokeDasharray="6 6" strokeDashoffset="6" />
      <path d={d} fill="none" stroke="#2a2a31" strokeWidth="13" strokeLinejoin="round" />
      <path d={d} fill="none" stroke="#ffd400" strokeWidth="1" strokeDasharray="4 5" opacity="0.7" />
      {/* linha de chegada: no começo do caminho */}
      <rect x="118" y="133" width="8" height="14" fill="url(#tracado-xadrez)" />
    </svg>
  )
}
