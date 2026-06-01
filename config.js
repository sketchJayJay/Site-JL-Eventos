// CONFIGURAÇÕES PADRÃO DO SITE JL EVENTOS
// Você pode editar pelo próprio site na área Admin, ou direto neste arquivo.
// Os ajustes feitos no Admin ficam salvos no navegador usando localStorage.

window.JL_DEFAULT_CONFIG = {
  admin: {
    password: "JL2026"
  },
  company: {
    name: "JL Eventos",
    slogan: "SOUND QUALITY",
    whatsapp: "5532984285414",
    instagram: "",
    cityText: "Atendemos todas as regiões",
    pixText: "Solicitar chave Pix"
  },
  financial: {
    currency: "BRL",
    signalDefault: 50,
    quoteValidityDays: 7,
    reservationText: "Valor sujeito à disponibilidade da data. Frete, montagem e estrutura podem ser confirmados pela equipe JL Eventos."
  },
  led: {
    id: "painelLed",
    name: "Painel de LED",
    description: "Conteúdo, telão, marcas, cenário e impacto visual para o evento.",
    unit: "m²",
    pricePerM2: 250,
    defaultWidth: 4,
    defaultHeight: 2,
    video: "assets/videos/painel-led.mp4",
    poster: "assets/videos/painel-led.jpg"
  },
  items: [
    {
      id: "moving9r",
      category: "Iluminação",
      name: "Moving Beam 9R",
      description: "Feixes fortes para pista, palco, entrada dos noivos e momentos de impacto.",
      unit: "aparelho",
      price: 150,
      active: true,
      video: "assets/videos/moving-beam-9r.mp4",
      poster: "assets/videos/moving-beam-9r.jpg"
    },
    {
      id: "atomic",
      category: "Iluminação",
      name: "Atomic / Strobo",
      description: "Efeito de brilho rápido para viradas, shows, pista e entradas especiais.",
      unit: "aparelho",
      price: 100,
      active: true,
      video: "assets/videos/atomic-strobo.mp4",
      poster: "assets/videos/atomic-strobo.jpg"
    },
    {
      id: "parled",
      category: "Iluminação",
      name: "Par LED decorativo",
      description: "Luz de preenchimento para paredes, salão, pista e detalhes do ambiente.",
      unit: "aparelho",
      price: 80,
      active: true,
      video: "assets/videos/atomic-strobo.mp4",
      poster: "assets/videos/atomic-strobo.jpg"
    },
    {
      id: "pistaParis",
      category: "Extras premium",
      name: "Pista Paris 4x4",
      description: "Pista decorativa 4x4 para casamentos, aniversários e eventos premium.",
      unit: "unidade",
      price: 1000,
      active: true,
      video: "assets/videos/pista-paris-4x4.mp4",
      poster: "assets/videos/pista-paris-4x4.jpg"
    },
    {
      id: "somAmbiente",
      category: "Som",
      name: "Som ambiente / voz",
      description: "Sistema para cerimônia, palestra, recepção, voz e música ambiente.",
      unit: "pacote",
      price: 0,
      active: true,
      video: "assets/videos/som-ambiente.mp4",
      poster: "assets/videos/som-ambiente.jpg"
    },
    {
      id: "microfoneSemFio",
      category: "Som",
      name: "Microfone sem fio",
      description: "Ideal para palestra, cerimônia, apresentação e avisos durante o evento.",
      unit: "unidade",
      price: 0,
      active: true,
      video: "assets/videos/microfone-sem-fio.mp4",
      poster: "assets/videos/microfone-sem-fio.jpg"
    },
    {
      id: "estrutura",
      category: "Estrutura",
      name: "Estrutura / montagem especial",
      description: "Estrutura para instalação, acabamento e composição do cenário.",
      unit: "sob consulta",
      price: 0,
      active: true,
      video: "assets/videos/painel-led.mp4",
      poster: "assets/videos/painel-led.jpg"
    }
  ],
  packages: [
    {
      id: "basico",
      name: "Pacote Básico",
      tag: "entrada elegante",
      description: "Ideal para evento menor, palestra, voz e iluminação leve.",
      led: { enabled: false, width: 0, height: 0 },
      items: { somAmbiente: 1, microfoneSemFio: 1, parled: 4 }
    },
    {
      id: "casamento",
      name: "Pacote Casamento",
      tag: "mais pedido",
      description: "Painel de LED, pista Paris e iluminação para deixar o salão com brilho de cinema.",
      led: { enabled: true, width: 4, height: 2 },
      items: { moving9r: 4, atomic: 2, pistaParis: 1, somAmbiente: 1, microfoneSemFio: 1 }
    },
    {
      id: "premium",
      name: "Pacote Premium",
      tag: "evento completo",
      description: "Para quem quer presença máxima: LED maior, pista, iluminação forte e suporte completo.",
      led: { enabled: true, width: 5, height: 2 },
      items: { moving9r: 8, atomic: 4, parled: 8, pistaParis: 1, somAmbiente: 1, microfoneSemFio: 2, estrutura: 1 }
    }
  ],
  gallery: [
    { title: "Painel de LED em destaque", text: "Cenário moderno para fotos, marcas e momentos especiais.", image: "assets/videos/painel-led.jpg" },
    { title: "Pista Paris iluminada", text: "Um toque premium para casamento, debutante e formatura.", image: "assets/videos/pista-paris-4x4.jpg" },
    { title: "Iluminação de impacto", text: "Feixes, strobo e clima de show para a pista.", image: "assets/videos/moving-beam-9r.jpg" },
    { title: "Som para cerimônia e palestra", text: "Voz clara, música ambiente e suporte técnico.", image: "assets/videos/som-ambiente.jpg" }
  ],
  testimonials: [
    { name: "Cliente JL", text: "O painel de LED transformou o espaço e deixou o evento muito mais bonito." },
    { name: "Noivos", text: "A pista Paris e a iluminação fizeram toda diferença nas fotos e na festa." },
    { name: "Evento corporativo", text: "Som limpo, painel bem montado e atendimento profissional do início ao fim." }
  ],
  contract: {
    signalOptions: [30, 50],
    clauses: [
      "O orçamento gerado pelo site é uma estimativa inicial e depende de confirmação de data, local e disponibilidade.",
      "A reserva da data pode depender do pagamento de sinal combinado entre as partes.",
      "Alterações no escopo, deslocamento, montagem especial ou horários extras podem alterar o valor final.",
      "A contratante se compromete a fornecer acesso adequado ao local para montagem, passagem de cabos e retirada dos equipamentos."
    ]
  }
};
