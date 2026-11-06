/** Kart visto de lado, com linhas de velocidade. Usado no topo e (em SVG puro) no favicon. */
export function KartIcone({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 70" className={className} aria-hidden="true">
      {/* linhas de velocidade */}
      <rect x="2" y="30" width="22" height="4" rx="2" fill="#ec4899" />
      <rect x="8" y="39" width="18" height="4" rx="2" fill="#3b82f6" />
      <rect x="0" y="48" width="24" height="4" rx="2" fill="#22c55e" />
      {/* banco */}
      <path d="M56 38 L60 22 L69 22 L67 38 Z" fill="#1f2937" />
      {/* piloto (capacete) */}
      <circle cx="72" cy="20" r="10" fill="#ec4899" />
      <path d="M74 15 h9 a3 3 0 0 1 0 8 h-9 Z" fill="#0a0a0a" />
      {/* volante */}
      <path d="M80 36 L88 25" stroke="#e5e7eb" strokeWidth="3" strokeLinecap="round" />
      <path d="M85 22 L92 28" stroke="#e5e7eb" strokeWidth="4" strokeLinecap="round" />
      {/* carroceria */}
      <path d="M30 46 L44 36 L102 36 L122 43 L126 50 L30 50 Z" fill="#facc15" />
      <rect x="62" y="40" width="22" height="5" rx="2" fill="#0a0a0a" opacity="0.35" />
      {/* rodas */}
      <circle cx="46" cy="53" r="12" fill="#0a0a0a" stroke="#f5f5f5" strokeWidth="3" />
      <circle cx="46" cy="53" r="4" fill="#facc15" />
      <circle cx="111" cy="54" r="10" fill="#0a0a0a" stroke="#f5f5f5" strokeWidth="3" />
      <circle cx="111" cy="54" r="3.5" fill="#facc15" />
    </svg>
  )
}

export function Logo() {
  return (
    <div className="flex items-center justify-center gap-3">
      <KartIcone className="h-14 w-auto sm:h-16" />
      <div className="leading-none">
        <div className="text-3xl font-black uppercase italic tracking-tight sm:text-4xl">Kart</div>
        <div className="titulo-arcoiris text-sm font-black uppercase italic tracking-[0.25em] sm:text-base">
          dos amigos
        </div>
      </div>
    </div>
  )
}
