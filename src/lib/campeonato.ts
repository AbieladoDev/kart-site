// Dados do campeonato. Depois de cada corrida: preencher `resultado` da etapa — o resto
// (ranking, pontos, vitórias, pódios, melhor volta nas figurinhas) é calculado sozinho.
import { equipes, pilotos, type Equipe, type PilotoNoGrid } from "./pilotos"

/** Pontos por posição final (P1, P2, ...). Posição além da lista = 0. ⚠️ Provisório — combinar no grupo. */
export const pontuacao = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]

export type Resultado = {
  /** slug do piloto (ex.: "arthur-biehl") */
  piloto: string
  posicao: number
  /** "1:02.345" */
  melhorVolta?: string
}

export type Etapa = {
  numero: number
  data: string // "08/11" ou "A definir"
  local: string
  hora?: string
  chegada?: string
  /** horário de Brasília, para a contagem regressiva */
  iso?: string
  /** Desenho do traçado: caminho SVG fechado num viewBox 300×180, começando na linha de chegada (x≈122, y=140). */
  tracado?: string
  resultado: Resultado[]
}

export const etapas: Etapa[] = [
  {
    numero: 1,
    data: "08/11",
    local: "Autódromo Fueltech Velopark",
    hora: "15h20",
    chegada: "14h00",
    iso: "2026-11-08T15:20:00-03:00",
    // ⚠️ Traçado ILUSTRATIVO — não é o desenho oficial do kartódromo. Trocar pelo real quando tiver.
    tracado:
      "M40 140 L200 140 C240 140 262 128 262 100 C262 74 240 64 218 72 L170 92 C150 100 136 90 140 72 C144 52 168 46 196 44 L240 40 C262 38 270 22 252 16 L90 16 C56 16 40 32 40 58 C40 80 60 88 82 84 L110 78 C126 76 128 96 112 102 L60 112 C44 116 40 126 40 140 Z",
    resultado: [],
  },
  { numero: 2, data: "A definir", local: "A definir", resultado: [] },
  { numero: 3, data: "A definir", local: "A definir", resultado: [] },
]

export const etapasDisputadas = etapas.filter((e) => e.resultado.length > 0)
export const proximaEtapa = etapas.find((e) => e.resultado.length === 0)
export const temResultado = etapasDisputadas.length > 0

function tempoMs(volta: string): number {
  const [min, seg] = volta.includes(":") ? volta.split(":") : ["0", volta]
  return Number(min) * 60000 + Number(seg) * 1000
}

export type Estatisticas = {
  pontos: number
  vitorias: number
  podios: number
  corridas: number
  melhorVolta?: string
}

export function estatisticas(slug: string): Estatisticas {
  const s: Estatisticas = { pontos: 0, vitorias: 0, podios: 0, corridas: 0 }
  for (const etapa of etapasDisputadas) {
    const r = etapa.resultado.find((x) => x.piloto === slug)
    if (!r) continue
    s.corridas++
    s.pontos += pontuacao[r.posicao - 1] ?? 0
    if (r.posicao === 1) s.vitorias++
    if (r.posicao <= 3) s.podios++
    if (r.melhorVolta && (!s.melhorVolta || tempoMs(r.melhorVolta) < tempoMs(s.melhorVolta))) {
      s.melhorVolta = r.melhorVolta
    }
  }
  return s
}

export type LinhaPiloto = PilotoNoGrid & Estatisticas & { posicao: number }

export const classificacao: LinhaPiloto[] = pilotos
  .map((p) => ({ ...p, ...estatisticas(p.slug) }))
  .sort((a, b) => b.pontos - a.pontos || b.vitorias - a.vitorias || a.nome.localeCompare(b.nome, "pt-BR"))
  .map((p, i) => ({ ...p, posicao: i + 1 }))

export function posicaoDe(slug: string): number | undefined {
  if (!temResultado) return undefined
  return classificacao.find((p) => p.slug === slug)?.posicao
}

export type LinhaEquipe = { equipe: Equipe; pontos: number; vitorias: number; posicao: number }

export const classificacaoEquipes: LinhaEquipe[] = equipes
  .map((equipe) => {
    const linhas = classificacao.filter((p) => p.equipe === equipe)
    return {
      equipe,
      pontos: linhas.reduce((s, p) => s + p.pontos, 0),
      vitorias: linhas.reduce((s, p) => s + p.vitorias, 0),
    }
  })
  .sort((a, b) => b.pontos - a.pontos || b.vitorias - a.vitorias || a.equipe.nome.localeCompare(b.equipe.nome, "pt-BR"))
  .map((l, i) => ({ ...l, posicao: i + 1 }))
