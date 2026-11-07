import type { Equipe } from "@/lib/pilotos"

/**
 * Kart visto de lado, pintado com as cores da equipe:
 * cor1 = carenagem, cor2 = faixa e macacão, cor3 = capacete e placa de número.
 */
export function KartEquipe({ e, className }: { e: Equipe; className?: string }) {
  return (
    <svg viewBox="0 0 200 90" className={className} role="img" aria-label={`Kart da ${e.nome}`}>
      {/* sombra no chão */}
      <ellipse cx="102" cy="84" rx="92" ry="4" fill="#000" opacity="0.35" />
      {/* para-choque traseiro e motor */}
      <rect x="6" y="58" width="22" height="6" rx="3" fill="#2a2a30" />
      <rect x="30" y="44" width="20" height="16" rx="3" fill="#5a5a64" />
      <rect x="33" y="47" width="14" height="3" rx="1.5" fill="#7a7a86" />
      {/* assoalho */}
      <rect x="28" y="64" width="146" height="4" rx="2" fill="#3a3a42" />
      {/* banco */}
      <path d="M60 50 L68 24 L79 24 L77 50 Z" fill="#1c1c22" />
      {/* piloto: macacão, braço, volante */}
      <path d="M72 50 L80 32 Q84 27 93 29 L104 35 L113 50 Z" fill={e.cor2} />
      <path d="M92 36 L116 36" stroke={e.cor2} strokeWidth="6" strokeLinecap="round" />
      <path d="M118 38 L126 52" stroke="#55555f" strokeWidth="3" strokeLinecap="round" />
      <path d="M113 30 L121 42" stroke="#1c1c22" strokeWidth="4" strokeLinecap="round" />
      {/* capacete */}
      <circle cx="88" cy="18" r="11" fill={e.cor3} />
      <path d="M77 17 A11 11 0 0 1 99 17 L99 20 L77 20 Z" fill={e.cor1} opacity="0.9" />
      <path d="M90 13 h9 a4 4 0 0 1 0 8 h-9 Z" fill="#111" />
      {/* carenagem lateral (sidepod) */}
      <path d="M64 66 L70 50 Q73 46 81 46 L127 46 Q135 46 137 52 L141 66 Z" fill={e.cor1} />
      <path d="M71 56 L137 56 L138.6 61 L69.2 61 Z" fill={e.cor2} />
      {/* bico dianteiro + placa de número */}
      <path d="M140 66 L150 52 L184 53 Q196 56 198 66 Z" fill={e.cor1} />
      <path d="M146 60 L196 60 L197 63 L144 63 Z" fill={e.cor2} />
      <ellipse cx="182" cy="58.5" rx="7" ry="4.5" fill={e.cor3} />
      {/* rodas */}
      <circle cx="46" cy="66" r="18" fill="#141418" />
      <circle cx="46" cy="66" r="8.5" fill="#8a8a96" />
      <circle cx="46" cy="66" r="3" fill="#141418" />
      <circle cx="160" cy="70" r="14" fill="#141418" />
      <circle cx="160" cy="70" r="6.5" fill="#8a8a96" />
      <circle cx="160" cy="70" r="2.4" fill="#141418" />
    </svg>
  )
}
