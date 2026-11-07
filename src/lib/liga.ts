// Identidade do grupo. Trocar o nome aqui troca no site inteiro (selo, figurinhas, título).

// `descricao` = texto do title (passar o mouse).
// `cartao` = imagem inteira (cartão de visita, logo com fundo) no lugar da logo; a placa mostra
// embaixo frase, nome e contatos (telefone, e-mail, Instagram), centralizados.
export type Marca = {
  nome: string
  logo?: string
  cartao?: string
  link?: string
  descricao?: string
  /** só dígitos com DDI: "5551996071459" */
  telefone?: string
  email?: string
  /** frase curta acima do nome (ex.: slogan) */
  frase?: string
  /** não mostra a linha do nome embaixo (a marca já está na imagem) */
  ocultarNome?: boolean
  /** @ do(s) Instagram, sem o @ — vários ficam na mesma linha */
  instagram?: string | string[]
}

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
  apoiadores: [
    {
      nome: "Eng. Antônio Carlos Wacht Soares",
      descricao: "Projetos, engenharia de segurança do trabalho, engenharia mecânica, perícias trabalhistas e PPCI/SPCI",
      // só as atividades, recortadas do cartão (nome e contatos já vão no texto embaixo)
      cartao: "/apoiadores/antonio-wacht-atividades.png",
      telefone: "5551996071459",
      email: "eng.antonio.wachts@gmail.com",
    },
    {
      nome: "BiehlBier",
      cartao: "/apoiadores/biehl-bier.png",
      frase: "Beba melhor",
      // ⚠️ @ deduzido do carimbo da arte (divulgacao/biehl-bier) — conferir o perfil real.
      instagram: "biehlbier",
    },
    {
      nome: "db",
      descricao: "db - Consultoria, Gestão em TI, desenvolvemos Aplicações personalizadas",
      // Darby Biehl (assessoria e consultoria) + db.app (app developer), montado de db-admin/public/Logo-DB
      cartao: "/apoiadores/db.png",
      frase: "Consultoria, Gestão em TI\ndesenvolvemos Aplicações personalizadas",
      ocultarNome: true,
      instagram: ["db.app_", "darbybiehl"],
    },
  ] as Marca[],
}
