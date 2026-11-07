"use client"

import { MessageCircle } from "lucide-react"

/**
 * Abre o WhatsApp com uma mensagem pronta + o link da página atual.
 * `wa.me/?text=` deixa a pessoa escolher o contato ou grupo; funciona no celular e no WhatsApp Web.
 */
export function CompartilharWhats({ texto, rotulo = "Compartilhar no WhatsApp", className = "" }: {
  texto: string
  rotulo?: string
  className?: string
}) {
  function abrir() {
    const msg = `${texto}\n${window.location.href}`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer")
  }

  return (
    <button
      type="button"
      onClick={abrir}
      className={`flex items-center justify-center gap-2 rounded-full bg-[#25d366] px-5 py-2.5 text-sm font-bold text-[#0b2e17] transition hover:brightness-110 ${className}`}
    >
      <MessageCircle className="size-4" strokeWidth={2.5} />
      {rotulo}
    </button>
  )
}
