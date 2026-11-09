// Story do piloto (1080 × 1920, tela cheia do Instagram/WhatsApp), gerado com next/og (satori).
// Faixa de cima (0–240px) fica livre para o cabeçalho do próprio Instagram; nada importante
// abaixo de ~1740px, onde fica a barra de resposta.
import { liga } from "./liga"
import { kmh, type PilotoNoGrid } from "./campeonato"
import { dataUri } from "./figurinha-imagem"

const W = 1080
const H = 1920
const PAGE = "#0e0f12"
const OURO = "#d9b45a"
const BRAND = "#ffd23f"
const LADO = 72
/** sombra para texto que cai sobre foto clara */
const SOMBRA = "0 4px 28px rgba(0,0,0,0.6)"

function Rotulo({ children }: { children: string }) {
  return (
    <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 5, color: "rgba(255,255,255,0.6)" }}>{children.toUpperCase()}</div>
  )
}

function Numero({ rotulo, valor, tamanho, cor = "#ffffff" }: { rotulo: string; valor: string; tamanho: number; cor?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
      <Rotulo>{rotulo}</Rotulo>
      <div style={{ marginTop: 10, fontFamily: "Saira", fontSize: tamanho, fontWeight: 900, lineHeight: 0.9, color: cor, transform: "skewX(-8deg)" }}>
        {valor}
      </div>
    </div>
  )
}

export async function StoryImagem({ p }: { p: PilotoNoGrid }) {
  const u = p.ultima
  const [fundo, selo, foto] = await Promise.all([
    dataUri("fotos/velocidade.jpg"),
    dataUri("marca/amg-kart-selo.png"),
    p.foto ? dataUri(p.foto) : Promise.resolve(undefined),
  ])
  const [primeiro, ...resto] = p.nome.split(" ")
  // foto do topo da tela até o bloco de números (passa por trás da faixa do Instagram e da marca)
  const FOTO_TOPO = 0
  const FOTO_ALTURA = 1460

  return (
    <div style={{ width: W, height: H, display: "flex", position: "relative", background: PAGE, fontFamily: "Jakarta", color: "#fff" }}>
      {/* pista ao fundo, tingida de dourado e escurecida */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={fundo} alt="" width={W} height={H} style={{ position: "absolute", objectFit: "cover" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, background: OURO, opacity: 0.18 }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: W,
          height: H,
          backgroundImage: `linear-gradient(to bottom, ${PAGE}e6 0%, ${PAGE}99 18%, ${PAGE}80 40%, ${PAGE} 72%, ${PAGE} 100%)`,
        }}
      />

      {/* foto do piloto de ponta a ponta, sumindo em cima e embaixo */}
      {foto ? (
        <div style={{ position: "absolute", left: 0, top: FOTO_TOPO, width: W, height: FOTO_ALTURA, display: "flex" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={foto} alt="" width={W} height={FOTO_ALTURA} style={{ objectFit: "cover", objectPosition: "50% 30%" }} />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: W,
              height: 560,
              backgroundImage: `linear-gradient(to bottom, ${PAGE}f2, ${PAGE}b3 45%, ${PAGE}00)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: W,
              height: 620,
              backgroundImage: `linear-gradient(to top, ${PAGE} 8%, ${PAGE}b3 45%, ${PAGE}00)`,
            }}
          />
        </div>
      ) : (
        <div style={{ position: "absolute", left: 0, top: 560, width: W, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: 480,
              height: 480,
              borderRadius: 240,
              background: `${OURO}cc`,
              border: "10px solid rgba(255,255,255,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={300} height={300} viewBox="0 0 24 24" fill="none" stroke="rgba(14,15,18,0.6)" strokeWidth={1.6} strokeLinecap="round">
              <circle cx="12" cy="8" r="5" />
              <path d="M20 21a8 8 0 0 0-16 0" />
            </svg>
          </div>
        </div>
      )}

      {/* topo (abaixo da faixa do Instagram): marca à esquerda, corrida à direita */}
      <div style={{ position: "absolute", left: LADO, right: LADO, top: 250, display: "flex", alignItems: "center", justifyContent: "space-between", textShadow: SOMBRA }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={selo} alt="" width={110} height={110} />
          <div style={{ display: "flex", flexDirection: "column", marginLeft: 24 }}>
            <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1 }}>{liga.nome}</div>
            <div style={{ fontSize: 26, fontWeight: 600, color: "rgba(255,255,255,0.65)", marginTop: 6 }}>{`Temporada ${liga.temporada}`}</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1 }}>{`Corrida de ${u.etapa.data}`}</div>
          <div style={{ fontSize: 26, fontWeight: 600, color: "rgba(255,255,255,0.65)", marginTop: 6 }}>{`Etapa ${u.etapa.numero} · ${u.etapa.local}`}</div>
        </div>
      </div>

      {/* kart da sessão */}
      <div style={{ position: "absolute", left: LADO, top: 440, display: "flex", flexDirection: "column", textShadow: SOMBRA }}>
        <Rotulo>Kart</Rotulo>
        <div style={{ fontFamily: "Saira", fontSize: 250, fontWeight: 900, lineHeight: 0.85, color: BRAND, transform: "skewX(-8deg)", textShadow: SOMBRA }}>{u.kart}</div>
      </div>

      {/* nome + posição na temporada */}
      <div style={{ position: "absolute", left: LADO, right: LADO, top: 1130, display: "flex", alignItems: "flex-end", justifyContent: "space-between", textShadow: SOMBRA }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 150, fontWeight: 800, lineHeight: 0.95, letterSpacing: -4 }}>{primeiro}</div>
          {resto.length > 0 && <div style={{ fontSize: 58, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>{resto.join(" ")}</div>}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", paddingBottom: 10 }}>
          <Rotulo>Temporada</Rotulo>
          <div style={{ fontFamily: "Saira", fontSize: 110, fontWeight: 900, lineHeight: 0.9, color: OURO, transform: "skewX(-8deg)" }}>{`${p.posicao}º`}</div>
        </div>
      </div>

      {/* números da corrida */}
      <div
        style={{
          position: "absolute",
          left: LADO,
          right: LADO,
          top: 1400,
          display: "flex",
          flexDirection: "column",
          borderTop: "3px solid rgba(255,255,255,0.15)",
          paddingTop: 40,
        }}
      >
        <div style={{ display: "flex" }}>
          <Numero rotulo="Chegada" valor={`P${u.posicao}`} tamanho={108} cor={OURO} />
          <Numero rotulo="Pontos" valor={`+${u.pontos}`} tamanho={108} />
          <Numero rotulo="Melhor volta" valor={u.melhorVolta} tamanho={108} />
        </div>
        <div style={{ display: "flex", marginTop: 44 }}>
          <Numero rotulo="Voltas" valor={String(u.voltas)} tamanho={68} />
          <Numero rotulo="Vel. máx" valor={kmh(u.velocidade)} tamanho={68} />
          <Numero rotulo={u.diff ? "Diff" : "Tempo"} valor={u.diff ? (u.diff.includes("volta") ? u.diff : `+${u.diff}`) : u.total} tamanho={68} />
        </div>
      </div>
    </div>
  )
}
