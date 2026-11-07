"use client"

import { useState } from "react"
import { Share2 } from "lucide-react"

/**
 * Compartilha a IMAGEM da figurinha (PNG gerado em /pilotos/<slug>/figurinha).
 * No celular abre a folha de compartilhar do sistema (WhatsApp, status, Instagram...).
 * Onde o navegador não compartilha arquivo (a maioria dos computadores), baixa o PNG.
 */
export function CompartilharFigurinha({ slug, texto }: { slug: string; texto: string }) {
  const [estado, setEstado] = useState<"livre" | "gerando" | "erro">("livre")

  async function compartilhar() {
    setEstado("gerando")
    try {
      const resp = await fetch(`/pilotos/${slug}/figurinha`)
      if (!resp.ok) throw new Error(String(resp.status))
      const blob = await resp.blob()
      const arquivo = new File([blob], `figurinha-${slug}.png`, { type: "image/png" })
      const dados = { files: [arquivo], text: `${texto}\n${window.location.href}` }

      if (navigator.canShare?.(dados)) {
        try {
          await navigator.share(dados)
        } catch (err) {
          // Cancelar a folha de compartilhar não é erro.
          if ((err as DOMException).name !== "AbortError") throw err
        }
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = arquivo.name
        a.click()
        URL.revokeObjectURL(url)
      }
      setEstado("livre")
    } catch {
      setEstado("erro")
    }
  }

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={compartilhar}
        disabled={estado === "gerando"}
        className="flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-fg transition hover:brightness-110 disabled:opacity-60"
      >
        <Share2 className="size-4" strokeWidth={2.5} />
        {estado === "gerando" ? "Preparando a figurinha..." : "Compartilhar figurinha"}
      </button>
      {estado === "erro" && (
        <p role="alert" className="mt-2 text-sm text-muted">
          Não deu para gerar a imagem. Tente de novo ou use o link do WhatsApp.
        </p>
      )}
    </div>
  )
}
