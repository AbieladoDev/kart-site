import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

export const alt = "Kart dos amigos — domingo, 08/11, largada 15h20"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

/** Imagem que aparece no preview do link (WhatsApp, Instagram etc.): o logo do topo. */
export default async function Image() {
  const svg = await readFile(join(process.cwd(), "src/app/icon.svg"), "utf8")
  const kart = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`

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
          background: "#07060f",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={kart} width={420} height={210} alt="" />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <div style={{ fontSize: 150, fontWeight: 900, textTransform: "uppercase", color: "#f5f5f5" }}>
              Kart
            </div>
            <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: 14, textTransform: "uppercase", color: "#a3a3a3" }}>
              dos amigos
            </div>
          </div>
        </div>
        <div style={{ marginTop: 60, fontSize: 40, color: "#737373" }}>Domingo, 08/11 · largada 15h20</div>
      </div>
    ),
    size,
  )
}
