// Dados do campeonato. Depois de cada corrida: copiar a folha de cronometragem para `resultado`
// da etapa — o resto (grid, ranking, pontos, kart da sessão, figurinhas) é calculado sozinho.
import { acharCadastro, todosPilotos, type PilotoCadastrado } from "./pilotos"

/** Pontos por posição final (P1, P2, ...). Posição além da lista = 0. ⚠️ Provisório — combinar no grupo. */
export const pontuacao = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]

/** Uma linha da folha de cronometragem. */
export type Resultado = {
  /** slug do piloto (ex.: "egor-ocana") */
  piloto: string
  posicao: number
  /** número do kart nesta sessão — muda a cada corrida */
  kart: string
  voltas: number
  /** diferença para o líder: "0.833", "1 volta"... (vazio no P1) */
  diff?: string
  /** tempo total "20:38.974" */
  total: string
  /** melhor velocidade, km/h */
  velocidade: number
  /** melhor volta "58.550" ou "1:00.361" */
  melhorVolta: string
}

export type Etapa = {
  numero: number
  data: string // "08/11" ou "A definir"
  local: string
  categoria?: string
  hora?: string
  chegada?: string
  /** horário de Brasília, para a contagem regressiva */
  iso?: string
  /** foto de fundo do cartão da etapa (public/fotos) */
  foto: string
  resultado: Resultado[]
}

export const etapas: Etapa[] = [
  {
    numero: 1,
    data: "08/11",
    local: "Autódromo Fueltech Velopark",
    categoria: "Indoor",
    hora: "15h20",
    chegada: "14h00",
    iso: "2026-11-08T15:20:00-03:00",
    foto: "/fotos/indoor-curva.jpg",
    // Folha de cronometragem da corrida (classe INDOOR, 18 voltas do líder).
    resultado: [
      { posicao: 1, kart: "07", piloto: "egor-ocana", voltas: 18, total: "20:38.974", velocidade: 63.945, melhorVolta: "58.550" },
      { posicao: 2, kart: "28", piloto: "adrian-henry", voltas: 18, diff: "0.833", total: "20:39.807", velocidade: 63.842, melhorVolta: "58.645" },
      { posicao: 3, kart: "68", piloto: "leo-ramos", voltas: 18, diff: "8.898", total: "20:47.872", velocidade: 63.788, melhorVolta: "58.694" },
      { posicao: 4, kart: "64", piloto: "remi-alano", voltas: 18, diff: "12.240", total: "20:51.214", velocidade: 64.005, melhorVolta: "58.495" },
      { posicao: 5, kart: "72", piloto: "antonio-carlos", voltas: 18, diff: "12.555", total: "20:51.529", velocidade: 63.818, melhorVolta: "58.667" },
      { posicao: 6, kart: "35", piloto: "leonardo-correa", voltas: 18, diff: "19.952", total: "20:58.926", velocidade: 63.038, melhorVolta: "59.393" },
      { posicao: 7, kart: "37", piloto: "cristian-costa", voltas: 18, diff: "35.352", total: "21:14.326", velocidade: 62.891, melhorVolta: "59.532" },
      { posicao: 8, kart: "65", piloto: "nicolas-rodrigues", voltas: 18, diff: "35.910", total: "21:14.884", velocidade: 62.605, melhorVolta: "59.804" },
      { posicao: 9, kart: "10", piloto: "leandro-mendes", voltas: 17, diff: "1 volta", total: "20:31.203", velocidade: 62.027, melhorVolta: "1:00.361" },
      { posicao: 10, kart: "67", piloto: "arthur-veronez", voltas: 17, diff: "1 volta", total: "20:56.684", velocidade: 60.315, melhorVolta: "1:02.074" },
      { posicao: 11, kart: "39", piloto: "bianca-lencini", voltas: 17, diff: "1 volta", total: "21:02.428", velocidade: 59.889, melhorVolta: "1:02.516" },
      { posicao: 12, kart: "60", piloto: "darby-biehl", voltas: 17, diff: "1 volta", total: "21:02.866", velocidade: 59.597, melhorVolta: "1:02.822" },
      { posicao: 13, kart: "22", piloto: "aldrovandro-fontes", voltas: 17, diff: "1 volta", total: "21:15.664", velocidade: 59.905, melhorVolta: "1:02.499" },
      { posicao: 14, kart: "03", piloto: "gilson-carvalho", voltas: 15, diff: "3 voltas", total: "21:30.039", velocidade: 53.301, melhorVolta: "1:10.242" },
      { posicao: 15, kart: "01", piloto: "lucimar-silveira", voltas: 13, diff: "5 voltas", total: "20:48.450", velocidade: 48.229, melhorVolta: "1:17.629" },
    ],
  },
  { numero: 2, data: "A definir", local: "A definir", foto: "/fotos/grid-largada.jpg", resultado: [] },
  { numero: 3, data: "A definir", local: "A definir", foto: "/fotos/indoor-pista.jpg", resultado: [] },
  { numero: 4, data: "A definir", local: "A definir", foto: "/fotos/cockpit.jpg", resultado: [] },
]

export const etapasDisputadas = etapas.filter((e) => e.resultado.length > 0)
export const proximaEtapa = etapas.find((e) => e.resultado.length === 0)
export const ultimaEtapa = etapasDisputadas.at(-1)
export const temResultado = etapasDisputadas.length > 0

export function tempoMs(volta: string): number {
  const [min, seg] = volta.includes(":") ? volta.split(":") : ["0", volta]
  return Number(min) * 60000 + Number(seg) * 1000
}

/** Volta em segundos com 1 casa (3 algarismos), para a figurinha: "58.645" → "58.6", "1:00.361" → "60.4" */
export const voltaCurta = (volta: string) => (Math.round(Math.round(tempoMs(volta)) / 100) / 10).toFixed(1)

export const pontosDaPosicao = (posicao: number) => pontuacao[posicao - 1] ?? 0

/** "63.945" → "63,9 km/h" */
export const kmh = (v: number) => `${v.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km/h`

/** Destaques de uma etapa: vencedor, volta mais rápida, mais veloz, diferença P1-P2. */
export function destaquesDa(etapa: Etapa) {
  const r = etapa.resultado
  const voltaRapida = r.reduce((a, b) => (tempoMs(b.melhorVolta) < tempoMs(a.melhorVolta) ? b : a))
  const maisVeloz = r.reduce((a, b) => (b.velocidade > a.velocidade ? b : a))
  return {
    vencedor: r.find((x) => x.posicao === 1)!,
    segundo: r.find((x) => x.posicao === 2),
    voltaRapida,
    maisVeloz,
    voltasLider: Math.max(...r.map((x) => x.voltas)),
  }
}

export type Corrida = Resultado & { etapa: Etapa; pontos: number }

export type Estatisticas = {
  pontos: number
  vitorias: number
  podios: number
  corridas: number
  melhorPosicao?: number
  melhorVolta?: string
  velocidade?: number
  /** corridas do piloto, da mais antiga para a mais nova */
  historico: Corrida[]
}

export function estatisticas(slug: string): Estatisticas {
  const s: Estatisticas = { pontos: 0, vitorias: 0, podios: 0, corridas: 0, historico: [] }
  for (const etapa of etapasDisputadas) {
    const r = etapa.resultado.find((x) => x.piloto === slug)
    if (!r) continue
    const pontos = pontosDaPosicao(r.posicao)
    s.historico.push({ ...r, etapa, pontos })
    s.corridas++
    s.pontos += pontos
    if (r.posicao === 1) s.vitorias++
    if (r.posicao <= 3) s.podios++
    if (!s.melhorPosicao || r.posicao < s.melhorPosicao) s.melhorPosicao = r.posicao
    if (!s.melhorVolta || tempoMs(r.melhorVolta) < tempoMs(s.melhorVolta)) s.melhorVolta = r.melhorVolta
    if (!s.velocidade || r.velocidade > s.velocidade) s.velocidade = r.velocidade
  }
  return s
}

export type PilotoNoGrid = PilotoCadastrado &
  Estatisticas & {
    posicao: number
    /** última corrida disputada: dela vem o kart que aparece na figurinha */
    ultima: Corrida
  }

/**
 * O grid = quem já correu pelo menos uma etapa, na ordem da classificação.
 * Desempate: pontos, vitórias, melhor posição, nome.
 */
export const grid: PilotoNoGrid[] = todosPilotos
  .map((p) => ({ ...p, ...estatisticas(p.slug) }))
  .filter((p) => p.corridas > 0)
  .sort(
    (a, b) =>
      b.pontos - a.pontos ||
      b.vitorias - a.vitorias ||
      (a.melhorPosicao ?? 99) - (b.melhorPosicao ?? 99) ||
      a.nome.localeCompare(b.nome, "pt-BR"),
  )
  .map((p, i) => ({ ...p, posicao: i + 1, ultima: p.historico[p.historico.length - 1] }))

export const totalPilotos = grid.length

export function acharPiloto(slug: string): PilotoNoGrid | undefined {
  return grid.find((p) => p.slug === slug)
}

/** Linha do resultado + cadastro do piloto (para foto, cor e nome). */
export function comPiloto(r: Resultado) {
  const p = acharCadastro(r.piloto)
  if (!p) throw new Error(`Piloto "${r.piloto}" está no resultado mas não no cadastro (src/lib/pilotos.ts)`)
  return { ...r, p }
}
