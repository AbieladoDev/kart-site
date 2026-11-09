"use client"

import { useState } from "react"
import { Smartphone, Share2 } from "lucide-react"

/**
 * Compartilha uma IMAGEM gerada pelo site:
 * - tipo "figurinha": a cartinha (PNG em /pilotos/<slug>/figurinha) — é o download;
 * - tipo "story": a tela cheia 1080×1920 (JPEG em /pilotos/<slug>/story).
 * No celular abre a folha de compartilhar do sistema (WhatsApp, status, Instagram...).
 * Onde o navegador não compartilha arquivo (a maioria dos computadores), baixa a imagem.
 */
const tipos = {
  figurinha: { caminho: "figurinha", ext: "png", mime: "image/png", rotulo: "Compartilhar figurinha", icone: Share2 },
  story: { caminho: "story", ext: "jpg", mime: "image/jpeg", rotulo: "Compartilhar no story", icone: Smartphone },
} as const

export function CompartilharFigurinha({ slug, tipo = "figurinha" }: { slug: string; tipo?: keyof typeof tipos }) {
  const [estado, setEstado] = useState<"livre" | "gerando" | "erro">("livre")
  const t = tipos[tipo]
  const Icone = t.icone

  async function compartilhar() {
    setEstado("gerando")
    try {
      const resp = await fetch(`/pilotos/${slug}/${t.caminho}`)
      if (!resp.ok) throw new Error(String(resp.status))
      const blob = await resp.blob()
      const arquivo = new File([blob], `${t.caminho}-${slug}.${t.ext}`, { type: t.mime })
      // Só a imagem: sem texto nem link junto — o compartilhamento mostra só a imagem.
      const dados = { files: [arquivo] }

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
        className={`flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition disabled:opacity-60 ${
          tipo === "story" ? "bg-ink text-page hover:bg-white" : "bg-brand text-brand-fg hover:brightness-110"
        }`}
      >
        <Icone className="size-4" strokeWidth={2.5} />
        {estado === "gerando" ? "Preparando a imagem..." : t.rotulo}
      </button>
      {estado === "erro" && (
        <p role="alert" className="mt-2 text-sm text-muted">
          Não deu para gerar a imagem. Tente de novo ou use o link do WhatsApp.
        </p>
      )}
    </div>
  )
}
