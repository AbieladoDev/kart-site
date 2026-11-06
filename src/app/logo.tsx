/** Kart visto de lado, com linhas de velocidade. Usado no topo e (em SVG puro) no favicon. */
export function KartIcone({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 70" className={className} aria-hidden="true">
      {/* linhas de velocidade */}
      <rect x="2" y="30" width="22" height="4" rx="2" fill="#737373" />
      <rect x="8" y="39" width="18" height="4" rx="2" fill="#a3a3a3" />
      <rect x="0" y="48" width="24" height="4" rx="2" fill="#525252" />
      {/* banco */}
      <path d="M56 38 L60 22 L69 22 L67 38 Z" fill="#404040" />
      {/* piloto (capacete) */}
      <circle cx="72" cy="20" r="10" fill="#e5e5e5" />
      <path d="M74 15 h9 a3 3 0 0 1 0 8 h-9 Z" fill="#171717" />
      {/* volante */}
      <path d="M80 36 L88 25" stroke="#a3a3a3" strokeWidth="3" strokeLinecap="round" />
      <path d="M85 22 L92 28" stroke="#a3a3a3" strokeWidth="4" strokeLinecap="round" />
      {/* carroceria */}
      <path d="M30 46 L44 36 L102 36 L122 43 L126 50 L30 50 Z" fill="#f5f5f5" />
      <rect x="62" y="40" width="22" height="5" rx="2" fill="#171717" opacity="0.25" />
      {/* rodas */}
      <circle cx="46" cy="53" r="12" fill="#171717" stroke="#d4d4d4" strokeWidth="3" />
      <circle cx="46" cy="53" r="4" fill="#737373" />
      <circle cx="111" cy="54" r="10" fill="#171717" stroke="#d4d4d4" strokeWidth="3" />
      <circle cx="111" cy="54" r="3.5" fill="#737373" />
    </svg>
  )
}

export function Logo() {
  return (
    <div className="flex items-center justify-center gap-3">
      <KartIcone className="h-14 w-auto sm:h-16" />
      <div className="leading-none">
        <div className="text-3xl font-black uppercase italic tracking-tight text-neutral-100 sm:text-4xl">Kart</div>
        <div className="text-sm font-bold uppercase tracking-[0.3em] text-neutral-400 sm:text-base">
          dos amigos
        </div>
      </div>
    </div>
  )
}
