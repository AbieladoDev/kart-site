import { ImageResponse } from "next/og"
import sharp from "sharp"
import { acharPiloto, grid as pilotos } from "@/lib/campeonato"
import { fontesFigurinha } from "@/lib/figurinha-imagem"
import { StoryImagem } from "@/lib/story-imagem"

// Story do piloto (1080×1920), em JPEG — o que o botão "Compartilhar no story" envia/baixa.
export function generateStaticParams() {
  return pilotos.map((p) => ({ slug: p.slug }))
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const p = acharPiloto((await params).slug)
  if (!p) return new Response("Piloto não encontrado", { status: 404 })

  const png = await new ImageResponse(await StoryImagem({ p }), {
    width: 1080,
    height: 1920,
    fonts: await fontesFigurinha(),
  }).arrayBuffer()
  const jpg = await sharp(Buffer.from(png)).jpeg({ quality: 88, mozjpeg: true }).toBuffer()

  return new Response(new Uint8Array(jpg), {
    headers: { "Content-Type": "image/jpeg", "Content-Disposition": `inline; filename="story-${p.slug}.jpg"` },
  })
}
