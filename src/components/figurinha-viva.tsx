"use client"

import { useRef, useState } from "react"
import { RotateCcw } from "lucide-react"

/** Inclina a figurinha e move o brilho holográfico conforme o ponteiro. */
export function FigurinhaViva({ children, forca = 10 }: { children: React.ReactNode; forca?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  function mover(ev: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el || ev.pointerType === "touch") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const r = el.getBoundingClientRect()
    const x = (ev.clientX - r.left) / r.width
    const y = (ev.clientY - r.top) / r.height
    el.style.setProperty("--mx", `${x * 100}%`)
    el.style.setProperty("--my", `${y * 100}%`)
    el.style.setProperty("--ry", `${(x - 0.5) * forca}deg`)
    el.style.setProperty("--rx", `${(0.5 - y) * forca}deg`)
    el.style.setProperty("--brilho", "0.32")
    el.dataset.ativo = "true"
  }

  function sair() {
    const el = ref.current
    if (!el) return
    el.style.setProperty("--rx", "0deg")
    el.style.setProperty("--ry", "0deg")
    el.style.setProperty("--brilho", "0")
    el.dataset.ativo = "false"
  }

  return (
    <div className="figurinha-palco">
      <div ref={ref} className="figurinha-corpo" onPointerMove={mover} onPointerLeave={sair}>
        {children}
      </div>
    </div>
  )
}

/** Figurinha grande com frente e verso; clicar (ou o botão) vira. */
export function FigurinhaDupla({
  frente,
  verso,
  nome,
}: {
  frente: React.ReactNode
  verso: React.ReactNode
  nome: string
}) {
  const [noVerso, setNoVerso] = useState(false)
  return (
    <div>
      <FigurinhaViva forca={8}>
        <button
          type="button"
          onClick={() => setNoVerso((v) => !v)}
          aria-label={noVerso ? `Ver a frente da figurinha de ${nome}` : `Ver o verso da figurinha de ${nome}`}
          className="virar grid w-full cursor-pointer rounded-[6%] text-left"
          data-verso={noVerso}
        >
          <div className="face [grid-area:1/1]">{frente}</div>
          <div className="face face-verso [grid-area:1/1]">{verso}</div>
        </button>
      </FigurinhaViva>
      <button
        type="button"
        onClick={() => setNoVerso((v) => !v)}
        className="mx-auto mt-6 flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
      >
        <RotateCcw className="size-4" />
        {noVerso ? "Ver a frente" : "Virar e ver os dados"}
      </button>
    </div>
  )
}
