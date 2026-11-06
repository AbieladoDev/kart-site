// Dados do campeonato. Atualizar aqui depois de cada corrida.

export type Etapa = {
  numero: number
  data: string // "08/11" ou "A definir"
  local: string
  hora?: string
}

export const etapas: Etapa[] = [
  { numero: 1, data: "08/11", local: "Autódromo Fueltech Velopark", hora: "15h20" },
  { numero: 2, data: "A definir", local: "A definir" },
  { numero: 3, data: "A definir", local: "A definir" },
]

// Pontos por piloto (nome exatamente como em pilotos.ts). Vazio até a 1ª corrida.
export const pontos: Record<string, number> = {}

// Apoiadores. Vazio = mostra os espaços "sua marca aqui".
export const apoiadores: { nome: string; logo?: string; link?: string }[] = []
