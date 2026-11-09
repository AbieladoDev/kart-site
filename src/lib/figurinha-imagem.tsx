// Figurinha renderizada como imagem (PNG), para compartilhar e para o preview do link.
// Usa next/og (satori): só flexbox, sem `cqi`, sem mix-blend, sem textPath — por isso é
// uma versão própria do desenho de src/components/figurinha.tsx. Mudou o visual lá, conferir aqui.
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { liga } from "./liga"
import { voltaCurta, type PilotoNoGrid } from "./campeonato"

async function dataUri(caminhoPublico: string) {
  const buf = await readFile(join(process.cwd(), "public", caminhoPublico))
  const tipo = caminhoPublico.endsWith(".jpg") ? "image/jpeg" : "image/png"
  return `data:${tipo};base64,${buf.toString("base64")}`
}

async function fonteGoogle(familia: string, pesos: number[], nome: string) {
  const css = await (
    await fetch(`https://fonts.googleapis.com/css2?family=${familia}:wght@${pesos.join(";")}`)
  ).text()
  const urls = [...css.matchAll(/font-weight: (\d+);[\s\S]*?src: url\((.+?)\) format\('(?:truetype|opentype)'\)/g)]
  return Promise.all(
    urls.map(async ([, peso, url]) => ({
      name: nome,
      data: await (await fetch(url)).arrayBuffer(),
      weight: Number(peso) as 600 | 800 | 900,
      style: "normal" as const,
    })),
  )
}

/** Plus Jakarta Sans + Saira Condensed do Google Fonts (TTF). Sem rede, cai na fonte padrão do next/og. */
export async function fontesFigurinha() {
  try {
    const fontes = [
      ...(await fonteGoogle("Plus+Jakarta+Sans", [600, 800], "Jakarta")),
      ...(await fonteGoogle("Saira+Condensed", [900], "Saira")),
    ]
    return fontes.length ? fontes : undefined
  } catch {
    return undefined
  }
}

const PAGE = "#0e0f12"
// dourado igual a OURO/OURO_BORDA de src/components/figurinha.tsx
const OURO = "#d9b45a"
const OURO_BORDA = "linear-gradient(135deg, #f6e3a1 0%, #c8973a 30%, #f3d98c 55%, #a8772a 80%, #e9c977 100%)"
const BRAND = "#ffd23f"

/** Ícone de usuário (mesmo desenho do UserRound do lucide), em SVG simples para o satori. */
function IconeUsuario({ tamanho, cor }: { tamanho: number; cor: string }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth={1.6} strokeLinecap="round">
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  )
}

/**
 * Frente da figurinha. `u` = 1% da largura do papel (o `cqi` da versão web).
 * Largura total = 100u, altura = 140u.
 */
export async function FigurinhaImagem({ p, u }: { p: PilotoNoGrid; u: number }) {
  const ult = p.ultima
  const foto = p.foto ? await dataUri(p.foto) : undefined
  const fundo = await dataUri("fotos/velocidade-card.jpg")
  const selo = await dataUri("marca/amg-kart-selo.png")
  const [primeiro, ...resto] = p.nome.split(" ")
  const borda = 0.6 * u
  const interna = 100 * u - 2 * borda
  const alturaInterna = 140 * u - 2 * borda

  // números lado a lado, sem fundo, na fonte do kart
  const numero = (rotulo: string, valor: string, cor = "#ffffff", largura = 1 / 3) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: `${largura * 100}%` }}>
      <div style={{ fontSize: 2.8 * u, fontWeight: 800, letterSpacing: 0.45 * u, color: "rgba(255,255,255,0.6)" }}>
        {rotulo.toUpperCase()}
      </div>
      <div
        style={{
          marginTop: u,
          fontFamily: "Saira",
          fontSize: 11 * u,
          fontWeight: 900,
          lineHeight: 0.9,
          color: cor,
          transform: "skewX(-8deg)",
        }}
      >
        {valor}
      </div>
    </div>
  )

  return (
    <div
      style={{
        width: 100 * u,
        height: 140 * u,
        display: "flex",
        padding: borda,
        borderRadius: 2.4 * u,
        backgroundImage: OURO_BORDA,
        fontFamily: "Jakarta",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          width: interna,
          height: alturaInterna,
          overflow: "hidden",
          borderRadius: 1.8 * u,
          background: PAGE,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={fundo} alt="" width={interna} height={alturaInterna} style={{ position: "absolute", objectFit: "cover" }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: interna, height: alturaInterna, background: OURO, opacity: 0.3 }} />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: interna,
            height: alturaInterna,
            backgroundImage: `linear-gradient(to bottom, ${PAGE}55, ${PAGE}77 50%, ${PAGE}f2)`,
          }}
        />

        {foto ? (
          <div style={{ position: "absolute", left: 0, top: 0, width: interna, height: alturaInterna - 22 * u, display: "flex" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={foto} alt="" width={interna} height={alturaInterna - 22 * u} style={{ objectFit: "cover", objectPosition: "50% 25%" }} />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: interna,
                height: 34 * u,
                backgroundImage: `linear-gradient(to bottom, ${PAGE}bf, ${PAGE}00)`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                bottom: 0,
                width: interna,
                height: 40 * u,
                backgroundImage: `linear-gradient(to top, ${PAGE}, ${PAGE}00)`,
              }}
            />
          </div>
        ) : (
          <div style={{ position: "absolute", left: 0, top: 24 * u, width: interna, display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: 52 * u,
                height: 52 * u,
                borderRadius: 26 * u,
                background: `${OURO}cc`,
                border: `${u}px solid rgba(255,255,255,0.25)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconeUsuario tamanho={32 * u} cor="rgba(14,15,18,0.6)" />
            </div>
          </div>
        )}

        {/* topo: kart da sessão */}
        <div style={{ position: "absolute", left: 5 * u, top: 5 * u, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 3 * u, fontWeight: 800, letterSpacing: 0.6 * u, color: "rgba(255,255,255,0.8)" }}>KART</div>
          <div style={{ fontFamily: "Saira", fontSize: 19 * u, fontWeight: 900, lineHeight: 0.9, color: BRAND, transform: "skewX(-8deg)" }}>
            {ult.kart}
          </div>
          <div style={{ marginTop: u, fontSize: 3 * u, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
            {`Corrida de ${ult.etapa.data}`}
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={selo}
          alt=""
          width={19 * u}
          height={19 * u}
          style={{ position: "absolute", right: 5 * u, top: 5 * u, transform: "rotate(-12deg)" }}
        />

        {/* nome e resultado */}
        <div style={{ position: "absolute", left: 5 * u, right: 5 * u, bottom: 5 * u, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 11 * u, fontWeight: 800, lineHeight: 1, color: "#fff" }}>{primeiro}</div>
          {resto.length > 0 && (
            <div style={{ fontSize: 5 * u, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>{resto.join(" ")}</div>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              marginTop: 4 * u,
              paddingTop: 3 * u,
              borderTop: `${0.25 * u}px solid rgba(255,255,255,0.15)`,
            }}
          >
            {numero(`Etapa ${ult.etapa.numero}`, `P${ult.posicao}`, OURO)}
            {numero("Pontos", String(p.pontos))}
            {numero("Melhor volta", voltaCurta(ult.melhorVolta))}
          </div>
        </div>
      </div>
    </div>
  )
}

export const legendaFigurinha = (p: PilotoNoGrid) =>
  `${p.nome} · kart ${p.ultima.kart} · ${liga.nome} ${liga.temporada}`
