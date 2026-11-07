// Figurinha renderizada como imagem (PNG), para compartilhar e para o preview do link.
// Usa next/og (satori): só flexbox, sem `cqi`, sem clip-path, sem textPath — por isso é
// uma versão própria do desenho de src/components/figurinha.tsx. Mudou o visual lá, conferir aqui.
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { liga } from "./liga"
import { corTexto, pintura, type PilotoNoGrid } from "./pilotos"

async function dataUri(caminhoPublico: string, tipo: string) {
  const buf = await readFile(join(process.cwd(), "public", caminhoPublico))
  return `data:${tipo};base64,${buf.toString("base64")}`
}

/** Saira Condensed do Google Fonts (TTF). Sem rede, cai na fonte padrão do next/og. */
export async function fontesFigurinha() {
  try {
    const css = await (
      await fetch("https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@600;900")
    ).text()
    const urls = [...css.matchAll(/font-weight: (\d+);[\s\S]*?src: url\((.+?)\) format\('(?:truetype|opentype)'\)/g)]
    const fontes = await Promise.all(
      urls.map(async ([, peso, url]) => ({
        name: "Saira",
        data: await (await fetch(url)).arrayBuffer(),
        weight: Number(peso) as 600 | 900,
        style: "normal" as const,
      })),
    )
    return fontes.length ? fontes : undefined
  } catch {
    return undefined
  }
}

/**
 * Frente da figurinha. `u` = 1% da largura do papel (o `cqi` da versão web).
 * Largura total = 100u, altura = 140u.
 */
export async function FigurinhaImagem({ p, u }: { p: PilotoNoGrid; u: number }) {
  const e = p.equipe
  const tinta = corTexto(e.cor1)
  const tintaPlaca = corTexto(e.cor2)
  const foto = p.foto ? await dataUri(p.foto, "image/png") : undefined
  const selo = await dataUri("marca/amg-kart-simbolo.svg", "image/svg+xml")
  const largura = 100 * u
  const interna = largura - 7 * u

  return (
    <div
      style={{
        width: largura,
        height: 140 * u,
        display: "flex",
        padding: 3.5 * u,
        borderRadius: 7 * u,
        background: "#f4f2ea",
        fontFamily: "Saira",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          borderRadius: 3.5 * u,
          backgroundImage: pintura(e),
        }}
      >
        {/* número gigante ao fundo */}
        {!foto && (
          <div
            style={{
              position: "absolute",
              right: -6 * u,
              top: 4 * u,
              fontSize: 78 * u,
              fontWeight: 900,
              lineHeight: 1,
              color: e.cor3,
              opacity: 0.2,
            }}
          >
            {String(p.numero)}
          </div>
        )}

        {foto ? (
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 16 * u, display: "flex" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={foto} alt="" width={interna} height={140 * u - 7 * u - 16 * u} style={{ objectFit: "cover", objectPosition: "50% 20%" }} />
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                height: 42 * u,
                backgroundImage: `linear-gradient(to bottom, ${e.cor1}e6, ${e.cor1}80 45%, ${e.cor1}00)`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: 24 * u,
                backgroundImage: `linear-gradient(to top, ${e.cor2}, ${e.cor2}00)`,
              }}
            />
          </div>
        ) : (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 30 * u,
              display: "flex",
              justifyContent: "center",
              fontSize: 60 * u,
              color: e.cor3,
              opacity: 0.6,
              fontWeight: 900,
            }}
          >
            ?
          </div>
        )}

        {/* número */}
        <div style={{ position: "absolute", left: 4.5 * u, top: 4 * u, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 22 * u,
              fontWeight: 900,
              lineHeight: 0.85,
              color: tinta,
              textShadow: `${0.8 * u}px ${0.8 * u}px 0 ${e.cor2}`,
              transform: "skewX(-8deg)",
            }}
          >
            {String(p.numero)}
          </div>
        </div>

        {/* selo do grupo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={selo}
          alt=""
          width={20 * u}
          height={20 * u}
          style={{ position: "absolute", right: 4.5 * u, top: 4 * u, transform: "rotate(-12deg)" }}
        />

        {/* placa do nome: fundo inclinado em SVG (satori não tem clip-path) */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 26 * u, display: "flex" }}>
          <svg width={interna} height={26 * u} viewBox={`0 0 ${interna} ${26 * u}`} style={{ position: "absolute", left: 0, top: 0 }}>
            <polygon points={`0,${5.7 * u} ${interna},0 ${interna},${26 * u} 0,${26 * u}`} fill={e.cor2} />
          </svg>
          <div
            style={{
              position: "absolute",
              left: 5 * u,
              right: 5 * u,
              bottom: 4.5 * u,
              display: "flex",
              alignItems: "center",
              color: tintaPlaca,
            }}
          >
            <div
              style={{
                width: 12 * u,
                height: 12 * u,
                borderRadius: 2 * u,
                border: `${0.8 * u}px solid ${e.cor3}`,
                background: e.cor1,
                color: e.cor3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 6 * u,
                fontWeight: 900,
                marginRight: 3 * u,
              }}
            >
              {e.nome.charAt(0)}
            </div>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <div style={{ fontSize: 10 * u, fontWeight: 900, lineHeight: 0.95, textTransform: "uppercase" }}>
                {p.nome}
              </div>
              <div
                style={{
                  marginTop: 0.6 * u,
                  display: "flex",
                  fontSize: 3.8 * u,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 0.4 * u,
                  opacity: 0.85,
                }}
              >
                <span>{e.nome}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const legendaFigurinha = (p: PilotoNoGrid) =>
  `${p.nome} #${p.numero} · ${p.equipe.nome} · ${liga.nome} ${liga.temporada}`
