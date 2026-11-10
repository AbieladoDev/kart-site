// Pilotos: cada um por si (sem equipes desde 08/11/2026). O número do kart NÃO fica aqui —
// muda a cada corrida e vem do resultado da etapa (src/lib/campeonato.ts).

export type Piloto = {
  /** Nome como aparece na folha de cronometragem, em caixa normal. */
  nome: string
  // foto: caminho em public/, ex. "/pilotos/adrian.png". Sem foto = ícone de usuário.
  foto?: string
  apelido?: string
  cidade?: string
  frase?: string
}

// Ordem não importa: o grid e o álbum seguem a classificação.
export const cadastro: Piloto[] = [
  { nome: "Egor Ocana" },
  { nome: "Adrian Henry", foto: "/pilotos/adrian.png" },
  { nome: "Leo Ramos", foto: "/pilotos/leonardo.png" }, // confirmado 08/11/2026
  { nome: "Remi Alano" },
  { nome: "Antonio Carlos", foto: "/pilotos/carlinhos.png" }, // o "Carlinhos" (confirmado 08/11/2026)
  { nome: "Leonardo Correa" },
  { nome: "Cristian Costa", foto: "/pilotos/cristian.png" },
  { nome: "Nicolas Rodrigues" },
  { nome: "Leandro Mendes", foto: "/pilotos/leandro.png" },
  { nome: "Arthur Veronez", foto: "/pilotos/arthur-biehl.png" }, // mesma pessoa que "Arthur Biehl" (confirmado 08/11/2026)
  { nome: "Bianca Lencini", foto: "/pilotos/bianca.png" },
  { nome: "Darby Biehl", foto: "/pilotos/darby-biehl.png" },
  { nome: "Aldrovandro Fontes" },
  { nome: "Gilson Carvalho", foto: "/pilotos/gilson.png" },
  { nome: "Lucimar Silveira", foto: "/pilotos/lucimar.png" },
]

/** Tons pastel: cada piloto ganha um, fixo pela ordem do cadastro. */
export const pasteis = ["#f6d58e", "#a8d8f0", "#b9e4c9", "#f4b8a6", "#cdbdf2", "#f2a7c3"] as const

export function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export type PilotoCadastrado = Piloto & { slug: string; cor: string; primeiroNome: string }

export const todosPilotos: PilotoCadastrado[] = cadastro.map((p, i) => ({
  ...p,
  slug: slugify(p.nome),
  cor: pasteis[i % pasteis.length],
  primeiroNome: p.nome.split(" ")[0],
}))

export function acharCadastro(slug: string): PilotoCadastrado | undefined {
  return todosPilotos.find((p) => p.slug === slug)
}
