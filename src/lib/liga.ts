// Identidade do grupo. Trocar o nome aqui troca no site inteiro (selo, figurinhas, título).

// `descricao` = texto do title (passar o mouse).
// `cartao` = imagem inteira (cartão de visita, logo com fundo) no topo do card; embaixo vão
// nome, ramo e contatos (site, telefone, e-mail, Instagram).
export type Marca = {
  nome: string
  logo?: string
  cartao?: string
  link?: string
  descricao?: string
  /** só dígitos com DDI: "5551996071459" */
  telefone?: string
  email?: string
  /** o que a marca faz, em poucas palavras (linha embaixo do nome) */
  ramo?: string
  /** @ do(s) Instagram, sem o @ — vários ficam na mesma linha */
  instagram?: string | string[]
}

export const liga = {
  nome: "AMG Kart",
  sigla: "AMG",
  // Subtítulo embaixo do nome na home.
  apelido: "Amigos do Kart",
  // O que significa cada letra da sigla (aparece embaixo do título na home).
  significado: [
    { letra: "A", palavra: "Amizade" },
    { letra: "M", palavra: "Movimento" },
    { letra: "G", palavra: "Global" },
  ],
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
      ramo: "Engenharia e segurança do trabalho",
      telefone: "5551996071459",
      email: "eng.antonio.wachts@gmail.com",
    },
    {
      nome: "BiehlBier",
      cartao: "/apoiadores/biehl-bier.png",
      ramo: "Cerveja artesanal · Beba melhor",
      instagram: "biehlbier",
    },
    // Darby Biehl e db.app: duas marcas, um card cada (artes geradas de db-admin/public/Logo-DB, no azul da marca)
    {
      nome: "Darby Biehl",
      descricao: "Assessoria e consultoria, gestão em TI",
      cartao: "/apoiadores/darby-biehl.png",
      ramo: "Assessoria e consultoria em TI",
      instagram: "darbybiehl",
    },
    {
      nome: "db.app",
      descricao: "Desenvolvimento de aplicações personalizadas",
      cartao: "/apoiadores/db-app-developer.png",
      ramo: "Sistemas e aplicativos sob medida",
      link: "https://db.app.br",
      instagram: "db.app_",
    },
  ] as Marca[],
}
