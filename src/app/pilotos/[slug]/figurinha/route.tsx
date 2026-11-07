import { ImageResponse } from "next/og"
import { acharPiloto, pilotos } from "@/lib/pilotos"
import { FigurinhaImagem, fontesFigurinha } from "@/lib/figurinha-imagem"

// PNG da figurinha (1000×1400) — o que o botão "Compartilhar figurinha" envia/baixa.
export function generateStaticParams() {
  return pilotos.map((p) => ({ slug: p.slug }))
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const p = acharPiloto((await params).slug)
  if (!p) return new Response("Piloto não encontrado", { status: 404 })

  return new ImageResponse(await FigurinhaImagem({ p, u: 10 }), {
    width: 1000,
    height: 1400,
    fonts: await fontesFigurinha(),
    headers: { "Content-Disposition": `inline; filename="figurinha-${p.slug}.png"` },
  })
}
