import { ImageResponse } from "next/og"
import { liga } from "@/lib/liga"
import { acharPiloto, pilotos } from "@/lib/pilotos"
import { FigurinhaImagem, fontesFigurinha } from "@/lib/figurinha-imagem"

// Preview do link da página do piloto (WhatsApp, Instagram): a figurinha + o nome.
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "Figurinha do piloto"

export function generateStaticParams() {
  return pilotos.map((p) => ({ slug: p.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const p = acharPiloto((await params).slug)
  if (!p) return new Response("Piloto não encontrado", { status: 404 })

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "#121216",
          padding: "0 80px",
          fontFamily: "Saira",
        }}
      >
        <div style={{ display: "flex", transform: "rotate(-3deg)" }}>{await FigurinhaImagem({ p, u: 3.8 })}</div>
        <div style={{ display: "flex", flexDirection: "column", marginLeft: 70, color: "#ecebe6" }}>
          <div style={{ fontSize: 34, fontWeight: 600, color: "#ffd400" }}>
            {`${liga.nome} · temporada ${liga.temporada}`}
          </div>
          <div style={{ fontSize: 110, fontWeight: 900, lineHeight: 0.95, textTransform: "uppercase", marginTop: 10 }}>
            {p.nome}
          </div>
          <div style={{ fontSize: 44, fontWeight: 600, color: "#9a9aa6", marginTop: 16 }}>
            {`#${p.numero} · ${p.equipe.nome}`}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: await fontesFigurinha() },
  )
}
