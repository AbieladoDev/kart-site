import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { liga } from "@/lib/liga"

export const alt = `${liga.nome} — Temporada ${liga.temporada}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

/** Preview do link do site (WhatsApp, Instagram etc.): só a logo (o selo), no fundo do site. */
export default async function Image() {
  const png = await readFile(join(process.cwd(), "public/marca/amg-kart-selo.png"))
  const selo = `data:image/png;base64,${png.toString("base64")}`

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0e0f12",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={selo} width={420} height={420} alt="" />
      </div>
    ),
    size,
  )
}
