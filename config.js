// CONFIGURAÇÕES DO SITE JL EVENTOS
// Para alterar preço, nome, WhatsApp ou vídeo, mexa só aqui.
// Para trocar um vídeo, substitua o arquivo dentro de assets/videos mantendo o mesmo nome.

window.JL_CONFIG = {
  whatsapp: "5532984285414", // DDI + DDD + número. Ex: 55 32 98428-5414
  empresa: "JL Eventos",
  slogan: "SOUND QUALITY",
  led: {
    id: "painelLed",
    nome: "Painel de LED",
    descricao: "Conteúdo, telão, marcas e cenário para o evento.",
    unidade: "m²",
    precoMetro: 250,
    video: {
      arquivo: "assets/videos/painel-led.mp4",
      poster: "assets/videos/painel-led.jpg",
      titulo: "Vídeo demonstrativo do Painel de LED"
    }
  },
  iluminacao: [
    {
      id: "moving9r",
      nome: "Moving Beam 9R",
      descricao: "Efeito de feixe forte para palco, pista e destaque.",
      preco: 150,
      unidade: "aparelho",
      video: {
        arquivo: "assets/videos/moving-beam-9r.mp4",
        poster: "assets/videos/moving-beam-9r.jpg",
        titulo: "Vídeo demonstrativo do Moving Beam 9R"
      }
    },
    {
      id: "atomic",
      nome: "Atomic / Strobo",
      descricao: "Efeito strobo para momentos de impacto na festa.",
      preco: 100,
      unidade: "aparelho",
      video: {
        arquivo: "assets/videos/atomic-strobo.mp4",
        poster: "assets/videos/atomic-strobo.jpg",
        titulo: "Vídeo demonstrativo do Atomic / Strobo"
      }
    }
  ],
  extras: [
    {
      id: "pistaParis",
      nome: "Pista Paris 4x4",
      descricao: "Pista decorativa 4x4 para casamento e eventos premium.",
      preco: 1000,
      unidade: "unidade",
      video: {
        arquivo: "assets/videos/pista-paris-4x4.mp4",
        poster: "assets/videos/pista-paris-4x4.jpg",
        titulo: "Vídeo demonstrativo da Pista Paris 4x4"
      }
    },
    {
      id: "somAmbiente",
      nome: "Som ambiente / voz",
      descricao: "Opção para cerimônia, palestra, voz e música ambiente.",
      preco: 0,
      unidade: "sob consulta",
      video: {
        arquivo: "assets/videos/som-ambiente.mp4",
        poster: "assets/videos/som-ambiente.jpg",
        titulo: "Vídeo demonstrativo de Som ambiente / voz"
      }
    },
    {
      id: "microfoneSemFio",
      nome: "Microfone sem fio",
      descricao: "Ideal para palestra, cerimônia e apresentação.",
      preco: 0,
      unidade: "sob consulta",
      video: {
        arquivo: "assets/videos/microfone-sem-fio.mp4",
        poster: "assets/videos/microfone-sem-fio.jpg",
        titulo: "Vídeo demonstrativo do Microfone sem fio"
      }
    }
  ]
};
