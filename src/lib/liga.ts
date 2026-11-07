// Identidade do grupo. Trocar o nome aqui troca no site inteiro (selo, figurinhas, título).

export type Marca = { nome: string; logo?: string; link?: string }

export const liga = {
  nome: "Amigos do Kart",
  sigla: "ADK",
  modalidade: "Kart",
  temporada: 2026,
  // WhatsApp de contato para apoiadores, só dígitos com DDI: "5551999999999". Vazio = esconde o botão.
  whatsapp: "",
  // Patrocinador master: a marca aparece em TODAS as figurinhas. Logo em public/apoiadores/.
  master: undefined as Marca | undefined,
  // Apoiadores gerais (página /apoiadores e rodapé).
  apoiadores: [] as Marca[],
}
