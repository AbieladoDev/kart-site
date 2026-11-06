import {
  Bird, Crown, Flame, Gem, Mountain, Rocket, Wind, Zap,
  type LucideIcon,
} from "lucide-react"

// Desenho da pintura (livery) aplicada na figurinha.
export type Desenho = "faixas" | "chevron" | "meio" | "listra" | "pontas"

export type Equipe = {
  nome: string
  cor1: string // cor principal
  cor2: string // cor secundária
  cor3: string // detalhe
  desenho: Desenho
  emblema: LucideIcon
  // foto: caminho em public/, ex. "/pilotos/carlinhos.jpg". Sem foto = silhueta.
  pilotos: { nome: string; numero: number; foto?: string }[]
}

// Duplas na ordem da lista do grupo; 17 pilotos → a última equipe é trio (com o Arthur).
// Números sorteados uma vez e fixados aqui. Nomes de equipe inventados.
export const equipes: Equipe[] = [
  {
    nome: "Inferno Motorsport",
    cor1: "#dc2626", cor2: "#fde047", cor3: "#ffffff",
    desenho: "faixas", emblema: Flame,
    pilotos: [{ nome: "Carlinhos", numero: 67 }, { nome: "Adrian", numero: 45 }],
  },
  {
    nome: "Curto-Circuito GP",
    cor1: "#1e2a5a", cor2: "#ef4444", cor3: "#facc15",
    desenho: "chevron", emblema: Zap,
    pilotos: [{ nome: "Leonardo", numero: 77 }, { nome: "Egor", numero: 60 }],
  },
  {
    nome: "Órbita Racing",
    cor1: "#94a3b8", cor2: "#0f172a", cor3: "#2dd4bf",
    desenho: "meio", emblema: Rocket,
    pilotos: [{ nome: "Remi", numero: 25 }, { nome: "Nicolas", numero: 8 }],
  },
  {
    nome: "Furacão Laranja",
    cor1: "#f97316", cor2: "#1d4ed8", cor3: "#ffffff",
    desenho: "listra", emblema: Wind,
    pilotos: [{ nome: "Darby Biehl", numero: 20, foto: "/pilotos/darby-biehl.png" }, { nome: "Eduardo", numero: 26 }],
  },
  {
    nome: "Veneno Verde",
    cor1: "#065f46", cor2: "#a3e635", cor3: "#f0fdf4",
    desenho: "pontas", emblema: Gem,
    pilotos: [{ nome: "Leandro", numero: 38 }, { nome: "Júnior", numero: 96 }],
  },
  {
    nome: "Flamingo Veloz",
    cor1: "#38bdf8", cor2: "#ec4899", cor3: "#ffffff",
    desenho: "faixas", emblema: Bird,
    pilotos: [{ nome: "Gilnei", numero: 73 }, { nome: "Márcio", numero: 71 }],
  },
  {
    nome: "Avalanche GP",
    cor1: "#f8fafc", cor2: "#1d4ed8", cor3: "#dc2626",
    desenho: "chevron", emblema: Mountain,
    pilotos: [{ nome: "Cristian", numero: 11 }, { nome: "Gilson", numero: 27 }],
  },
  {
    nome: "Dinastia Dourada",
    cor1: "#0a0a0a", cor2: "#d4a017", cor3: "#fef3c7",
    desenho: "listra", emblema: Crown,
    pilotos: [
      { nome: "Denis", numero: 92 },
      { nome: "Aldo", numero: 63 },
      { nome: "Arthur Biehl", numero: 98, foto: "/pilotos/arthur-biehl.png" },
    ],
  },
]

export function pintura(e: Equipe): string {
  const { cor1, cor2, cor3 } = e
  switch (e.desenho) {
    case "faixas":
      return `linear-gradient(120deg, ${cor1} 0 38%, ${cor3} 38% 42%, ${cor2} 42% 56%, ${cor3} 56% 60%, ${cor1} 60%)`
    case "chevron":
      return `linear-gradient(135deg, transparent 0 55%, ${cor2} 55% 63%, ${cor3} 63% 67%, transparent 67%), linear-gradient(45deg, ${cor1} 0 55%, ${cor2} 55% 63%, ${cor3} 63% 67%, ${cor1} 67%)`
    case "meio":
      return `linear-gradient(160deg, ${cor1} 0 50%, ${cor3} 50% 53%, ${cor2} 53%)`
    case "listra":
      return `linear-gradient(90deg, ${cor1} 0 40%, ${cor2} 40% 47%, ${cor3} 47% 53%, ${cor2} 53% 60%, ${cor1} 60%)`
    case "pontas":
      return `linear-gradient(to bottom, ${cor2} 0 10%, ${cor3} 10% 12%, ${cor1} 12% 88%, ${cor3} 88% 90%, ${cor2} 90%)`
  }
}

/** Texto legível sobre a cor principal (branco ou preto). */
export function corTexto(hex: string): string {
  const n = parseInt(hex.slice(1), 16)
  const l = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)
  return l > 160 ? "#0a0a0a" : "#ffffff"
}

export const totalPilotos = equipes.reduce((s, e) => s + e.pilotos.length, 0)

export const corrida = {
  local: "P1000",
  data: "08/11",
  diaSemana: "Domingo",
  chegada: "14h00",
  largada: "15h20",
  // horário de Brasília
  largadaISO: "2026-11-08T15:20:00-03:00",
}
