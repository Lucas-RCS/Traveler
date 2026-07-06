import { Campaign } from "./types";
import defaultMapPng from "./imgs/defaultMap.png";

export const DEFAULT_CAMPAIGN: Campaign = {
  id: "campaign-imperio-alexandria",
  name: "Império de Alexandria",
  description:
    "Mapa-mundi completo da campanha, cobrindo o continente setentrional, a Ilha Esmeralda, a Ilha Rósea, as Terras Sombrias e a Geleira Austral, com regiões, pontos de interesse e rotas marcados a partir da imagem de referência.",
  mapUrl: defaultMapPng,
  mapType: "raster",
  mapWidth: 7680,
  mapHeight: 3812,
  regions: [
    {
      id: "reg-norte",
      name: "Planícies do Norte",
      type: "Planície",
      biome: "Temperado",
      climate: "Continental Moderado",
      color: "#D9C97A",
      opacity: 0.16,
      tags: ["continente", "civilização", "rios"],
      description:
        "Vasta extensão de planícies e planaltos ondulados que forma o continente setentrional do mapa, cortada por uma extensa rede fluvial e por uma fronteira política pontilhada que sugere a divisa entre dois reinos ou províncias.",
      notes:
        "Notas do mestre: os rios que cruzam a região favorecem rotas comerciais internas; a linha pontilhada pode ser usada como fronteira entre dois domínios rivais.",
      points: [
        {
          x: 0,
          y: 0,
        },
        {
          x: 5775,
          y: 0,
        },
        {
          x: 5750,
          y: 550,
        },
        {
          x: 5850,
          y: 850,
        },
        {
          x: 5650,
          y: 1025,
        },
        {
          x: 5250,
          y: 1150,
        },
        {
          x: 4750,
          y: 1350,
        },
        {
          x: 4250,
          y: 1500,
        },
        {
          x: 3750,
          y: 1625,
        },
        {
          x: 3250,
          y: 1675,
        },
        {
          x: 2800,
          y: 1600,
        },
        {
          x: 2400,
          y: 1450,
        },
        {
          x: 2000,
          y: 1275,
        },
        {
          x: 1600,
          y: 1100,
        },
        {
          x: 1200,
          y: 975,
        },
        {
          x: 750,
          y: 900,
        },
        {
          x: 300,
          y: 825,
        },
        {
          x: 0,
          y: 750,
        },
      ],
      regionComments: [
        {
          id: "regionComments-reg-norte-1",
          text: "Comentário inicial sobre Planícies do Norte.",
        },
      ],
      regionMarkers: [
        {
          id: "regionMarkers-reg-norte-1",
          text: "Marcador de referência para Planícies do Norte.",
        },
      ],
      regionNotes: [
        {
          id: "regionNotes-reg-norte-1",
          text: "Notas do mestre: os rios que cruzam a região favorecem rotas comerciais internas; a linha pontilhada pode ser usada como fronteira entre dois domínios rivais.",
        },
      ],
      regionReferences: [
        {
          id: "ref-reg-norte-1",
          label: "Referência de lore — Planícies do Norte",
          url: "",
        },
      ],
    },
    {
      id: "reg-vale-verde",
      name: "Vale Fértil do Sul",
      type: "Floresta",
      biome: "Subtropical Úmido",
      climate: "Úmido / Chuvas Sazonais",
      color: "#7CC142",
      opacity: 0.22,
      tags: ["agricultura", "rio", "fertilidade"],
      description:
        "Baixada fértil formada pelo delta dos rios que descem das Planícies do Norte, reconhecida por suas terras verdejantes e alta produtividade agrícola.",
      notes:
        "Notas do mestre: bom local para uma vila agrícola ou um conflito por terras férteis entre nobres locais.",
      points: [
        {
          x: 2800,
          y: 1175,
        },
        {
          x: 5000,
          y: 1275,
        },
        {
          x: 5400,
          y: 1450,
        },
        {
          x: 5000,
          y: 1600,
        },
        {
          x: 4350,
          y: 1650,
        },
        {
          x: 3750,
          y: 1700,
        },
        {
          x: 3250,
          y: 1675,
        },
        {
          x: 2950,
          y: 1500,
        },
        {
          x: 2800,
          y: 1300,
        },
      ],
      regionComments: [
        {
          id: "regionComments-reg-vale-verde-1",
          text: "Comentário inicial sobre Vale Fértil do Sul.",
        },
      ],
      regionMarkers: [
        {
          id: "regionMarkers-reg-vale-verde-1",
          text: "Marcador de referência para Vale Fértil do Sul.",
        },
      ],
      regionNotes: [
        {
          id: "regionNotes-reg-vale-verde-1",
          text: "Notas do mestre: bom local para uma vila agrícola ou um conflito por terras férteis entre nobres locais.",
        },
      ],
      regionReferences: [
        {
          id: "ref-reg-vale-verde-1",
          label: "Referência de lore — Vale Fértil do Sul",
          url: "",
        },
      ],
    },
    {
      id: "reg-terras-vermelhas",
      name: "Terras Vermelhas",
      type: "Deserto",
      biome: "Semiárido",
      climate: "Quente e Seco",
      color: "#C9713F",
      opacity: 0.2,
      tags: ["deserto", "terraços", "isolamento"],
      description:
        "Região de solo avermelhado e terraços estriados, separada do restante do continente por uma língua de mar. Uma formação escura e irregular no interior sugere uma cratera antiga ou ruína vulcânica.",
      notes:
        "Notas do mestre: a mancha escura ao centro pode esconder uma ruína ou ser marcada como ponto de interesse ainda não nomeado.",
      points: [
        {
          x: 5775,
          y: 0,
        },
        {
          x: 7680,
          y: 0,
        },
        {
          x: 7680,
          y: 1500,
        },
        {
          x: 7350,
          y: 1675,
        },
        {
          x: 7000,
          y: 1500,
        },
        {
          x: 6500,
          y: 1100,
        },
        {
          x: 6100,
          y: 650,
        },
        {
          x: 5800,
          y: 300,
        },
      ],
      regionComments: [
        {
          id: "regionComments-reg-terras-vermelhas-1",
          text: "Comentário inicial sobre Terras Vermelhas.",
        },
      ],
      regionMarkers: [
        {
          id: "regionMarkers-reg-terras-vermelhas-1",
          text: "Marcador de referência para Terras Vermelhas.",
        },
      ],
      regionNotes: [
        {
          id: "regionNotes-reg-terras-vermelhas-1",
          text: "Notas do mestre: a mancha escura ao centro pode esconder uma ruína ou ser marcada como ponto de interesse ainda não nomeado.",
        },
      ],
      regionReferences: [
        {
          id: "ref-reg-terras-vermelhas-1",
          label: "Referência de lore — Terras Vermelhas",
          url: "",
        },
      ],
    },
    {
      id: "reg-floresta-esmeralda",
      name: "Floresta da Ilha Esmeralda",
      type: "Floresta",
      biome: "Tropical Úmido",
      climate: "Quente e Úmido",
      color: "#1F6B3A",
      opacity: 0.28,
      tags: ["ilha", "floresta", "lagos gêmeos"],
      description:
        "Densa mata que cobre a metade oeste da grande ilha ao sudoeste, envolta por um anel de praias brancas (atol) e abrigando dois lagos gêmeos no seu interior.",
      notes:
        "Notas do mestre: os lagos gêmeos podem conter ruínas submersas ou uma comunidade isolada.",
      points: [
        {
          x: 150,
          y: 1600,
        },
        {
          x: 550,
          y: 1500,
        },
        {
          x: 1150,
          y: 1540,
        },
        {
          x: 1600,
          y: 1675,
        },
        {
          x: 1950,
          y: 1875,
        },
        {
          x: 2150,
          y: 2100,
        },
        {
          x: 2225,
          y: 2350,
        },
        {
          x: 2200,
          y: 2725,
        },
        {
          x: 2100,
          y: 3000,
        },
        {
          x: 1900,
          y: 3225,
        },
        {
          x: 1550,
          y: 3375,
        },
        {
          x: 1100,
          y: 3400,
        },
        {
          x: 650,
          y: 3300,
        },
        {
          x: 300,
          y: 3075,
        },
        {
          x: 100,
          y: 2725,
        },
        {
          x: 50,
          y: 2300,
        },
        {
          x: 75,
          y: 1950,
        },
      ],
      regionComments: [
        {
          id: "regionComments-reg-floresta-esmeralda-1",
          text: "Comentário inicial sobre Floresta da Ilha Esmeralda.",
        },
      ],
      regionMarkers: [
        {
          id: "regionMarkers-reg-floresta-esmeralda-1",
          text: "Marcador de referência para Floresta da Ilha Esmeralda.",
        },
      ],
      regionNotes: [
        {
          id: "regionNotes-reg-floresta-esmeralda-1",
          text: "Notas do mestre: os lagos gêmeos podem conter ruínas submersas ou uma comunidade isolada.",
        },
      ],
      regionReferences: [
        {
          id: "ref-reg-floresta-esmeralda-1",
          label: "Referência de lore — Floresta da Ilha Esmeralda",
          url: "",
        },
      ],
    },
    {
      id: "reg-savana-dourada",
      name: "Savana Dourada",
      type: "Planície",
      biome: "Tropical Seco",
      climate: "Quente com Estação Seca",
      color: "#C9D46B",
      opacity: 0.24,
      tags: ["ilha", "savana", "planície costeira"],
      description:
        "Extensão de gramíneas douradas na porção leste da Ilha Esmeralda, cortada por riachos que descem da floresta vizinha até a costa.",
      notes: "Notas do mestre: boa área para tribos nômades ou postos de caça.",
      points: [
        {
          x: 1500,
          y: 1975,
        },
        {
          x: 2000,
          y: 2050,
        },
        {
          x: 2225,
          y: 2275,
        },
        {
          x: 2300,
          y: 2500,
        },
        {
          x: 2250,
          y: 2825,
        },
        {
          x: 2125,
          y: 3075,
        },
        {
          x: 1900,
          y: 3275,
        },
        {
          x: 1600,
          y: 3375,
        },
        {
          x: 1375,
          y: 3300,
        },
        {
          x: 1400,
          y: 2850,
        },
        {
          x: 1475,
          y: 2350,
        },
      ],
      regionComments: [
        {
          id: "regionComments-reg-savana-dourada-1",
          text: "Comentário inicial sobre Savana Dourada.",
        },
      ],
      regionMarkers: [
        {
          id: "regionMarkers-reg-savana-dourada-1",
          text: "Marcador de referência para Savana Dourada.",
        },
      ],
      regionNotes: [
        {
          id: "regionNotes-reg-savana-dourada-1",
          text: "Notas do mestre: boa área para tribos nômades ou postos de caça.",
        },
      ],
      regionReferences: [
        {
          id: "ref-reg-savana-dourada-1",
          label: "Referência de lore — Savana Dourada",
          url: "",
        },
      ],
    },
    {
      id: "reg-ilhota-ferrosa",
      name: "Ilhota Ferrosa",
      type: "Ilha",
      biome: "Árido Costeiro",
      climate: "Seco",
      color: "#8B5A2B",
      opacity: 0.3,
      tags: ["ilhota", "minério", "isolada"],
      description:
        "Pequena ilha rochosa de tonalidade avermelhada-marrom, isolada nas águas entre o continente e a Ilha Esmeralda, possivelmente rica em depósitos minerais.",
      notes:
        "Notas do mestre: útil como parada de reabastecimento ou esconderijo de piratas.",
      points: [
        {
          x: 2625,
          y: 1625,
        },
        {
          x: 2950,
          y: 1600,
        },
        {
          x: 3000,
          y: 1800,
        },
        {
          x: 2875,
          y: 1925,
        },
        {
          x: 2675,
          y: 1900,
        },
        {
          x: 2600,
          y: 1750,
        },
      ],
      regionComments: [
        {
          id: "regionComments-reg-ilhota-ferrosa-1",
          text: "Comentário inicial sobre Ilhota Ferrosa.",
        },
      ],
      regionMarkers: [
        {
          id: "regionMarkers-reg-ilhota-ferrosa-1",
          text: "Marcador de referência para Ilhota Ferrosa.",
        },
      ],
      regionNotes: [
        {
          id: "regionNotes-reg-ilhota-ferrosa-1",
          text: "Notas do mestre: útil como parada de reabastecimento ou esconderijo de piratas.",
        },
      ],
      regionReferences: [
        {
          id: "ref-reg-ilhota-ferrosa-1",
          label: "Referência de lore — Ilhota Ferrosa",
          url: "",
        },
      ],
    },
    {
      id: "reg-ilhota-verdejante",
      name: "Ilhota Verdejante",
      type: "Ilha",
      biome: "Tropical",
      climate: "Úmido",
      color: "#6FBE44",
      opacity: 0.3,
      tags: ["ilhota", "vegetação"],
      description:
        "Pequena ilha coberta por vegetação densa, situada nas rotas marítimas centrais do mapa.",
      notes:
        "Notas do mestre: pode servir como marco de navegação entre as ilhas centrais.",
      points: [
        {
          x: 3500,
          y: 1875,
        },
        {
          x: 3850,
          y: 1840,
        },
        {
          x: 4000,
          y: 1975,
        },
        {
          x: 3975,
          y: 2125,
        },
        {
          x: 3750,
          y: 2175,
        },
        {
          x: 3550,
          y: 2075,
        },
      ],
      regionComments: [
        {
          id: "regionComments-reg-ilhota-verdejante-1",
          text: "Comentário inicial sobre Ilhota Verdejante.",
        },
      ],
      regionMarkers: [
        {
          id: "regionMarkers-reg-ilhota-verdejante-1",
          text: "Marcador de referência para Ilhota Verdejante.",
        },
      ],
      regionNotes: [
        {
          id: "regionNotes-reg-ilhota-verdejante-1",
          text: "Notas do mestre: pode servir como marco de navegação entre as ilhas centrais.",
        },
      ],
      regionReferences: [
        {
          id: "ref-reg-ilhota-verdejante-1",
          label: "Referência de lore — Ilhota Verdejante",
          url: "",
        },
      ],
    },
    {
      id: "reg-ilhota-sul",
      name: "Ilhota do Sul",
      type: "Ilha",
      biome: "Tropical",
      climate: "Úmido",
      color: "#8FD15A",
      opacity: 0.3,
      tags: ["ilhota", "vegetação"],
      description:
        "Ilhota de vegetação intensa localizada mais ao sul, próxima às águas geladas que se aproximam da calota polar.",
      notes:
        "Notas do mestre: contraste climático interessante por estar próxima da região gelada.",
      points: [
        {
          x: 2525,
          y: 2340,
        },
        {
          x: 2825,
          y: 2340,
        },
        {
          x: 2825,
          y: 2600,
        },
        {
          x: 2525,
          y: 2600,
        },
      ],
      regionComments: [
        {
          id: "regionComments-reg-ilhota-sul-1",
          text: "Comentário inicial sobre Ilhota do Sul.",
        },
      ],
      regionMarkers: [
        {
          id: "regionMarkers-reg-ilhota-sul-1",
          text: "Marcador de referência para Ilhota do Sul.",
        },
      ],
      regionNotes: [
        {
          id: "regionNotes-reg-ilhota-sul-1",
          text: "Notas do mestre: contraste climático interessante por estar próxima da região gelada.",
        },
      ],
      regionReferences: [
        {
          id: "ref-reg-ilhota-sul-1",
          label: "Referência de lore — Ilhota do Sul",
          url: "",
        },
      ],
    },
    {
      id: "reg-ilha-rosea",
      name: "Ilha Rósea (Terras Fúngicas)",
      type: "Ilha",
      biome: "Exótico Úmido",
      climate: "Úmido Anômalo",
      color: "#D98FC4",
      opacity: 0.3,
      tags: ["exótico", "fungos", "cratera", "mágico"],
      description:
        "Ilha de coloração rósea incomum, coberta por vegetação e esporos fúngicos, com uma cratera esbranquiçada no centro que abriga um ponto avermelhado — possivelmente um lago de cristal ou ruína mágica.",
      notes:
        "Notas do mestre: forte candidata a bioma de origem mágica ou corrompida; a cratera central é um ótimo local para um santuário ou perigo sobrenatural.",
      points: [
        {
          x: 4225,
          y: 1500,
        },
        {
          x: 4750,
          y: 1475,
        },
        {
          x: 5150,
          y: 1575,
        },
        {
          x: 5325,
          y: 1825,
        },
        {
          x: 5300,
          y: 2100,
        },
        {
          x: 5150,
          y: 2325,
        },
        {
          x: 4850,
          y: 2500,
        },
        {
          x: 4500,
          y: 2475,
        },
        {
          x: 4250,
          y: 2275,
        },
        {
          x: 4125,
          y: 1975,
        },
        {
          x: 4150,
          y: 1675,
        },
      ],
      regionComments: [
        {
          id: "regionComments-reg-ilha-rosea-1",
          text: "Comentário inicial sobre Ilha Rósea (Terras Fúngicas).",
        },
      ],
      regionMarkers: [
        {
          id: "regionMarkers-reg-ilha-rosea-1",
          text: "Marcador de referência para Ilha Rósea (Terras Fúngicas).",
        },
      ],
      regionNotes: [
        {
          id: "regionNotes-reg-ilha-rosea-1",
          text: "Notas do mestre: forte candidata a bioma de origem mágica ou corrompida; a cratera central é um ótimo local para um santuário ou perigo sobrenatural.",
        },
      ],
      regionReferences: [
        {
          id: "ref-reg-ilha-rosea-1",
          label: "Referência de lore — Ilha Rósea (Terras Fúngicas)",
          url: "",
        },
      ],
    },
    {
      id: "reg-terras-sombrias",
      name: "Terras Sombrias",
      type: "Ilha",
      biome: "Amaldiçoado / Basáltico",
      climate: "Árido Sombrio",
      color: "#5B3A4A",
      opacity: 0.32,
      tags: ["vulcânico", "sombrio", "perigo"],
      description:
        "Arquipélago de rocha escura e fraturada, com veios que lembram fissuras vulcânicas ou marcas de uma antiga catástrofe. O local mais isolado e inóspito do mapa.",
      notes:
        "Notas do mestre: excelente cenário para uma masmorra vulcânica, uma terra amaldiçoada ou o covil de uma ameaça antiga.",
      points: [
        {
          x: 6450,
          y: 1500,
        },
        {
          x: 6950,
          y: 1450,
        },
        {
          x: 7350,
          y: 1500,
        },
        {
          x: 7680,
          y: 1600,
        },
        {
          x: 7680,
          y: 2500,
        },
        {
          x: 7400,
          y: 2700,
        },
        {
          x: 7000,
          y: 2650,
        },
        {
          x: 6650,
          y: 2450,
        },
        {
          x: 6450,
          y: 2150,
        },
        {
          x: 6375,
          y: 1800,
        },
      ],
      regionComments: [
        {
          id: "regionComments-reg-terras-sombrias-1",
          text: "Comentário inicial sobre Terras Sombrias.",
        },
      ],
      regionMarkers: [
        {
          id: "regionMarkers-reg-terras-sombrias-1",
          text: "Marcador de referência para Terras Sombrias.",
        },
      ],
      regionNotes: [
        {
          id: "regionNotes-reg-terras-sombrias-1",
          text: "Notas do mestre: excelente cenário para uma masmorra vulcânica, uma terra amaldiçoada ou o covil de uma ameaça antiga.",
        },
      ],
      regionReferences: [
        {
          id: "ref-reg-terras-sombrias-1",
          label: "Referência de lore — Terras Sombrias",
          url: "",
        },
      ],
    },
    {
      id: "reg-geleira-austral",
      name: "Geleira Austral",
      type: "Planície Gélida",
      biome: "Tundra / Gelo",
      climate: "Polar",
      color: "#BFE3E8",
      opacity: 0.35,
      tags: ["gelo", "polar", "inóspito"],
      description:
        "Extensa massa de gelo e tundra que domina o sul do mapa, com manchas de degelo formando lagoas azul-turquesa espalhadas pela paisagem congelada.",
      notes:
        "Notas do mestre: viagens aqui devem considerar penalidades de suprimentos e fadiga por frio extremo.",
      points: [
        {
          x: 3500,
          y: 2925,
        },
        {
          x: 4750,
          y: 2850,
        },
        {
          x: 6000,
          y: 2825,
        },
        {
          x: 7000,
          y: 2825,
        },
        {
          x: 7680,
          y: 2850,
        },
        {
          x: 7680,
          y: 3810,
        },
        {
          x: 3500,
          y: 3810,
        },
      ],
      regionComments: [
        {
          id: "regionComments-reg-geleira-austral-1",
          text: "Comentário inicial sobre Geleira Austral.",
        },
      ],
      regionMarkers: [
        {
          id: "regionMarkers-reg-geleira-austral-1",
          text: "Marcador de referência para Geleira Austral.",
        },
      ],
      regionNotes: [
        {
          id: "regionNotes-reg-geleira-austral-1",
          text: "Notas do mestre: viagens aqui devem considerar penalidades de suprimentos e fadiga por frio extremo.",
        },
      ],
      regionReferences: [
        {
          id: "ref-reg-geleira-austral-1",
          label: "Referência de lore — Geleira Austral",
          url: "",
        },
      ],
    },
    {
      id: "reg-arquipelago-gelado",
      name: "Arquipélago Gelado",
      type: "Ilha",
      biome: "Subpolar",
      climate: "Frio",
      color: "#4FA3D1",
      opacity: 0.3,
      tags: ["arquipélago", "gelo", "navegação difícil"],
      description:
        "Aglomerado de pequenas ilhas rochosas e placas de gelo flutuante nas águas que antecedem a Geleira Austral, tornando a navegação traiçoeira.",
      notes:
        "Notas do mestre: ótimo obstáculo natural para rotas marítimas, exigindo perícia de navegação ou guia local.",
      points: [
        {
          x: 3575,
          y: 2375,
        },
        {
          x: 4000,
          y: 2300,
        },
        {
          x: 4400,
          y: 2350,
        },
        {
          x: 4475,
          y: 2550,
        },
        {
          x: 4350,
          y: 2775,
        },
        {
          x: 4000,
          y: 2900,
        },
        {
          x: 3650,
          y: 2825,
        },
        {
          x: 3550,
          y: 2600,
        },
      ],
      regionComments: [
        {
          id: "regionComments-reg-arquipelago-gelado-1",
          text: "Comentário inicial sobre Arquipélago Gelado.",
        },
      ],
      regionMarkers: [
        {
          id: "regionMarkers-reg-arquipelago-gelado-1",
          text: "Marcador de referência para Arquipélago Gelado.",
        },
      ],
      regionNotes: [
        {
          id: "regionNotes-reg-arquipelago-gelado-1",
          text: "Notas do mestre: ótimo obstáculo natural para rotas marítimas, exigindo perícia de navegação ou guia local.",
        },
      ],
      regionReferences: [
        {
          id: "ref-reg-arquipelago-gelado-1",
          label: "Referência de lore — Arquipélago Gelado",
          url: "",
        },
      ],
    },
  ],
  pois: [
    {
      id: "poi-capital-norte",
      name: "Capital das Planícies",
      type: "Cidade",
      x: 3800,
      y: 650,
      description:
        "Capital do reino do norte, erguida junto à confluência dos principais rios da região.",
    },
    {
      id: "poi-porto-vermelho",
      name: "Porto Vermelho",
      type: "Porto",
      x: 6900,
      y: 1450,
      description:
        "Entreposto comercial nas Terras Vermelhas, único porto natural da região árida.",
    },
    {
      id: "poi-vila-vale",
      name: "Vila do Vale Fértil",
      type: "Vila",
      x: 3700,
      y: 1350,
      description:
        "Pequena vila agrícola que abastece o continente com grãos cultivados no Vale Fértil.",
    },
    {
      id: "poi-porto-esmeralda",
      name: "Porto da Savana",
      type: "Porto",
      x: 2050,
      y: 2300,
      description:
        "Porto comercial na costa leste da Ilha Esmeralda, ponto de partida das rotas marítimas para o continente.",
    },
    {
      id: "poi-templo-lago",
      name: "Templo dos Lagos Gêmeos",
      type: "Ruína",
      x: 1150,
      y: 2650,
      description:
        "Ruínas de um antigo templo situado entre os dois lagos no coração da Floresta Esmeralda.",
    },
    {
      id: "poi-farol-atol",
      name: "Farol do Atol",
      type: "Marco",
      x: 250,
      y: 2450,
      description:
        "Antigo farol erguido sobre o anel de areia branca que circunda a Ilha Esmeralda.",
    },
    {
      id: "poi-santuario-roseo",
      name: "Santuário da Cratera Rósea",
      type: "Templo",
      x: 4750,
      y: 1950,
      description:
        "Local sagrado (ou amaldiçoado) erguido na cratera central da Ilha Rósea.",
    },
    {
      id: "poi-forte-sombrio",
      name: "Forte das Terras Sombrias",
      type: "Ruína",
      x: 7100,
      y: 2050,
      description:
        "Fortaleza em ruínas construída sobre a rocha basáltica das Terras Sombrias.",
    },
    {
      id: "poi-posto-gelado",
      name: "Posto Avançado Austral",
      type: "Posto",
      x: 5000,
      y: 3000,
      description:
        "Última guarnição habitada antes da Geleira Austral, usada para expedições ao gelo.",
    },
    {
      id: "poi-ilhota-ferrosa-marco",
      name: "Marco da Ilhota Ferrosa",
      type: "Porto",
      x: 2775,
      y: 1750,
      description:
        "Pequeno marco de navegação erguido na Ilhota Ferrosa, usado como referência por navegantes.",
    },
  ],
  routes: [
    {
      id: "route-comercio-mar",
      name: "Rota Comercial Marítima",
      color: "#3B82F6",
      points: [
        {
          x: 6900,
          y: 1450,
        },
        {
          x: 5500,
          y: 2000,
        },
        {
          x: 3500,
          y: 2250,
        },
        {
          x: 2050,
          y: 2300,
        },
      ],
      length: 480,
      suppliesCost: 6,
      obstaclesCount: 3,
      category: "Marítimo",
      obstaclesDescription:
        "Correntes marítimas irregulares e proximidade com a Ilhota Ferrosa exigem atenção da tripulação.",
      crossingsCount: 0,
      notes:
        "Principal rota comercial entre as Terras Vermelhas e a Ilha Esmeralda.",
      startPoiId: "poi-porto-vermelho",
      endPoiId: "poi-porto-esmeralda",
    },
    {
      id: "route-interior-norte",
      name: "Estrada do Vale",
      color: "#F59E0B",
      points: [
        {
          x: 3800,
          y: 650,
        },
        {
          x: 3750,
          y: 1000,
        },
        {
          x: 3700,
          y: 1350,
        },
      ],
      length: 160,
      suppliesCost: 2,
      obstaclesCount: 1,
      category: "Estrada",
      obstaclesDescription:
        "Terreno fluvial pode exigir travessias de rio em pontos estreitos.",
      crossingsCount: 2,
      notes: "Liga a capital ao vale agrícola que sustenta o reino do norte.",
      startPoiId: "poi-capital-norte",
      endPoiId: "poi-vila-vale",
    },
    {
      id: "route-templo-farol",
      name: "Trilha do Atol",
      color: "#10B981",
      points: [
        {
          x: 250,
          y: 2450,
        },
        {
          x: 700,
          y: 2550,
        },
        {
          x: 1150,
          y: 2650,
        },
      ],
      length: 90,
      suppliesCost: 1,
      obstaclesCount: 1,
      category: "Trilha",
      obstaclesDescription:
        "Vegetação densa da floresta dificulta o trajeto até os lagos gêmeos.",
      crossingsCount: 0,
      notes:
        "Caminho local usado por peregrinos que visitam o templo entre os lagos.",
      startPoiId: "poi-farol-atol",
      endPoiId: "poi-templo-lago",
    },
  ],
  comments: [
    {
      id: "comment-cratera-vermelha",
      author: "Mestre",
      avatar: "M",
      content:
        "A mancha escura nas Terras Vermelhas ainda não tem nome — decidir se é cratera, ruína ou mina.",
      x: 6500,
      y: 1100,
      date: "Hoje",
      resolved: false,
    },
    {
      id: "comment-cratera-rosea",
      author: "Mestre",
      avatar: "M",
      content:
        "A cratera branca no centro da Ilha Rósea pode ser o gancho principal desta região — definir se é bênção ou maldição.",
      x: 4750,
      y: 1950,
      date: "Hoje",
      resolved: false,
    },
    {
      id: "comment-gelo",
      author: "Mestre",
      avatar: "M",
      content:
        "Avaliar regras de fadiga/suprimentos extras para viagens que cruzem o Arquipélago Gelado e a Geleira Austral.",
      x: 4000,
      y: 2600,
      date: "Hoje",
      resolved: false,
    },
  ],
  travelPlan: {
    origin: "Porto Vermelho",
    destination: "Porto da Savana",
    stops: ["Porto Vermelho"],
    selectedRouteIds: ["route-comercio-mar"],
    caravan: {
      defesa: 1,
      suporte: 1,
      diplomacia: 1,
      bonusAnimal: 0,
      bonusNatural: 0,
      bonusAmeaça: 0,
      sentinelasCount: 1,
      elosCount: 1,
      mensageirosCount: 1,
      sabioAnimalCount: 0,
      sabioNaturalCount: 0,
      sabioAmeaçaCount: 0,
      useStreetGuild: false,
    },
    supplies: 12,
    maxSupplies: 20,
    moral: 0,
    fatigue: 0,
    traveling: false,
    currentSegmentIndex: 0,
    historyLog: [
      {
        id: "log-imperio-1",
        text: "Mapa do Império de Alexandria carregado a partir da imagem de referência, com regiões, POIs e rotas iniciais definidos.",
        type: "info",
        timestamp: "Agora",
      },
    ],
  },
  worldScale: 1,
};
