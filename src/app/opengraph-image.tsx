import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { liga } from "@/lib/liga"

export const alt = `${liga.nome} — Temporada ${liga.temporada}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

/** Imagem que aparece no preview do link (WhatsApp, Instagram etc.): o logo do topo. */
export default async function Image() {
  const png = await readFile(join(process.cwd(), "public/marca/amg-kart-selo.png"))
  const kart = `data:image/png;base64,${png.toString("base64")}`

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#121216",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={kart} width={220} height={220} alt="" />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <div style={{ fontSize: 92, fontWeight: 900, textTransform: "uppercase", color: "#f5f5f5" }}>
              {liga.nome}
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: 8, textTransform: "uppercase", color: "#a3a3a3" }}>
              {`Temporada ${liga.temporada}`}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  )
}
