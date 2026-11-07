// Identidade do grupo. Trocar o nome aqui troca no site inteiro (selo, figurinhas, título).

// `descricao` = linha curta embaixo do nome no card de apoiador (opcional).
export type Marca = { nome: string; logo?: string; link?: string; descricao?: string }

export const liga = {
  nome: "AMG Kart",
  sigla: "AMG",
  modalidade: "Kart",
  temporada: 2026,
  // WhatsApp de contato para apoiadores, só dígitos com DDI: "5551999999999". Vazio = esconde o botão.
  whatsapp: "",
  // Patrocinador master: a marca aparece em TODAS as figurinhas. Logo em public/apoiadores/.
  master: undefined as Marca | undefined,
  // Apoiadores gerais (página /apoiadores e rodapé).
  apoiadores: [] as Marca[],
}
