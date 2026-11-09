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

const rotulos = ["Dias", "Horas", "Min", "Seg"]

/** Placas de dígito (um dígito por placa). Sem `alvo` = data a definir, placas com traço. */
export function Contagem({ alvo }: { alvo?: string }) {
  const [agora, setAgora] = useState<number | null>(null)

  useEffect(() => {
    if (!alvo) return
    const tick = () => setAgora(Date.now())
    const primeiro = setTimeout(tick, 0)
    const id = setInterval(tick, 1000)
    return () => {
      clearTimeout(primeiro)
      clearInterval(id)
    }
  }, [alvo])

  let valores: (string | null)[] = [null, null, null, null]
  if (alvo && agora !== null) {
    const falta = new Date(alvo).getTime() - agora
    if (falta <= 0) {
      return <p className="text-3xl font-extrabold text-brand">Bandeira verde!</p>
    }
    const p = partes(falta)
    valores = [p.dias, p.horas, p.min, p.seg].map((v) => String(v).padStart(2, "0"))
  }

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-8">
      {rotulos.map((rotulo, i) => (
        <div key={rotulo} className="text-center">
          <div className="mb-2 text-[0.65rem] font-bold tracking-[0.18em] text-ink/80 uppercase">{rotulo}</div>
          <div className="flex justify-center gap-1">
            {(valores[i] ?? "--").split("").map((d, n) => (
              <span
                key={n}
                className="flex h-11 w-7 items-center justify-center rounded-md bg-ink font-num text-2xl min-[400px]:h-12 min-[400px]:w-9 min-[400px]:text-3xl sm:rounded-lg font-extrabold text-page tabular-nums shadow-[0_6px_14px_-6px_rgba(0,0,0,0.7)] sm:h-20 sm:w-16 sm:text-5xl"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
