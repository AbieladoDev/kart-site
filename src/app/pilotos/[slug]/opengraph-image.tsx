import { ImageResponse } from "next/og"
import sharp from "sharp"
import { acharPiloto, grid as pilotos } from "@/lib/campeonato"
import { FigurinhaImagem, fontesFigurinha } from "@/lib/figurinha-imagem"

// Preview do link da página do piloto (WhatsApp, Instagram): só a figurinha, sem texto em volta.
// Sai em JPEG: o PNG com foto passava de 600 KB e o WhatsApp não mostra prévia de imagem acima de ~300 KB.
export const size = { width: 600, height: 840 }
export const contentType = "image/jpeg"
export const alt = "Figurinha do piloto"

export function generateStaticParams() {
  return pilotos.map((p) => ({ slug: p.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const p = acharPiloto((await params).slug)
  if (!p) return new Response("Piloto não encontrado", { status: 404 })

  const png = await new ImageResponse(await FigurinhaImagem({ p, u: 6 }), { ...size, fonts: await fontesFigurinha() }).arrayBuffer()
  // fundo do site atrás dos cantos arredondados (JPEG não tem transparência)
  const jpg = await sharp(Buffer.from(png)).flatten({ background: "#0e0f12" }).jpeg({ quality: 82, mozjpeg: true }).toBuffer()
  return new Response(new Uint8Array(jpg), { headers: { "Content-Type": "image/jpeg" } })
}
