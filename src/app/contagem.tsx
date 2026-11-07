"use client"

import { useEffect, useState } from "react"

function partes(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return {
    dias: Math.floor(s / 86400),
    horas: Math.floor((s % 86400) / 3600),
    min: Math.floor((s % 3600) / 60),
    seg: s % 60,
  }
}

export function Contagem({ alvo }: { alvo: string }) {
  const [agora, setAgora] = useState<number | null>(null)

  useEffect(() => {
    const tick = () => setAgora(Date.now())
    const primeiro = setTimeout(tick, 0)
    const id = setInterval(tick, 1000)
    return () => {
      clearTimeout(primeiro)
      clearInterval(id)
    }
  }, [])

  if (agora === null) return <div className="h-20 sm:h-24" />

  const falta = new Date(alvo).getTime() - agora
  if (falta <= 0) {
    return <p className="font-display text-5xl font-black uppercase italic text-brand">Bandeira verde! 🏁</p>
  }

  const p = partes(falta)
  const itens = [
    { v: p.dias, l: "dias" },
    { v: p.horas, l: "horas" },
    { v: p.min, l: "min" },
    { v: p.seg, l: "seg" },
  ]

  return (
    <div className="flex items-start justify-center gap-2 sm:gap-4">
      {itens.map((i, n) => (
        <div key={i.l} className="flex items-start gap-2 sm:gap-4">
          {n > 0 && (
            <span className="font-display text-4xl font-black leading-none text-white/25 sm:text-7xl">:</span>
          )}
          <div className="text-center">
            <div className="font-display text-5xl font-black italic leading-none tabular-nums text-brand sm:text-7xl">
              {String(i.v).padStart(2, "0")}
            </div>
            <div className="mt-2 text-xs font-semibold text-muted sm:text-sm">{i.l}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
