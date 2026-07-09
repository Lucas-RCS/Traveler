import { Campaign } from "./types";

export const DEFAULT_CAMPAIGN: Campaign = {
  id: "campaign-imperio-alexandria",
  name: "Império de Alexandria",
  description:
    "Mapa-mundi completo da campanha, cobrindo o continente setentrional, a Ilha Esmeralda, a Ilha Rósea, as Terras Sombrias e a Geleira Austral, com regiões, pontos de interesse e rotas marcados a partir da imagem de referência.",
  mapUrl: "/src/imgs/defaultMap.png",
  mapType: "raster",
  mapWidth: 7680,
  mapHeight: 3812,
  regions: [
    {
      id: "reg-norte",
      name: "Deserto do Norte",
      type: "Deserto",
      biome: "Temperado",
      climate: "Seco",
      color: "#f0dc7a",
      opacity: 0.24,
      tags: ["continente", "civilização"],
      description:
        "Vasta extensão de desertos e planícies ondulados que forma o continente setentrional do mapa, cortada por uma extensa rede fluvial e por uma fronteira política pontilhada que sugere a divisa entre dois reinos ou províncias.",
      notes: "",
      points: [
        {
          x: 4,
          y: -2,
        },
        {
          x: 7684,
          y: -2,
        },
        {
          x: 7680,
          y: 733,
        },
        {
          x: 7428,
          y: 604,
        },
        {
          x: 6834,
          y: 459,
        },
        {
          x: 6171,
          y: 452,
        },
        {
          x: 6016,
          y: 510,
        },
        {
          x: 5862,
          y: 543,
        },
        {
          x: 5675,
          y: 678,
        },
        {
          x: 5430,
          y: 749,
        },
        {
          x: 5052,
          y: 801,
        },
        {
          x: 4673,
          y: 1011,
        },
        {
          x: 4521,
          y: 1097,
        },
        {
          x: 4440,
          y: 1220,
        },
        {
          x: 4249,
          y: 1282,
        },
        {
          x: 3825,
          y: 1441,
        },
        {
          x: 3532,
          y: 1568,
        },
        {
          x: 3293,
          y: 1579,
        },
        {
          x: 3134,
          y: 1472,
        },
        {
          x: 2727,
          y: 1288,
        },
        {
          x: 2188,
          y: 942,
        },
        {
          x: 2048,
          y: 919,
        },
        {
          x: 1796,
          y: 847,
        },
        {
          x: 1626,
          y: 792,
        },
        {
          x: 1473,
          y: 641,
        },
        {
          x: 1308,
          y: 624,
        },
        {
          x: 913,
          y: 756,
        },
        {
          x: 752,
          y: 864,
        },
        {
          x: 559,
          y: 843,
        },
        {
          x: 504,
          y: 764,
        },
        {
          x: 373,
          y: 711,
        },
        {
          x: 4,
          y: 539,
        },
      ],
      regionComments: [],
      regionMarkers: [],
      regionNotes: [],
    },
    {
      id: "reg-terras-vermelhas",
      name: "Terras Vermelhas",
      type: "Deserto",
      biome: "Semiárido",
      climate: "Quente e Seco",
      color: "#C9713F",
      opacity: 0.25,
      tags: ["deserto", "terraços", "isolamento"],
      description:
        "Região de solo avermelhado e terraços estriados, separada do restante do continente por uma língua de mar. Uma formação escura e irregular no interior sugere uma cratera antiga ou ruína vulcânica.",
      notes:
        "Notas do mestre: a mancha escura ao centro pode esconder uma ruína ou ser marcada como ponto de interesse ainda não nomeado.",
      points: [
        {
          x: 5799,
          y: 633,
        },
        {
          x: 5833,
          y: 556,
        },
        {
          x: 6171,
          y: 452,
        },
        {
          x: 6745,
          y: 457,
        },
        {
          x: 6849,
          y: 459,
        },
        {
          x: 7226,
          y: 552,
        },
        {
          x: 7429,
          y: 601,
        },
        {
          x: 7680,
          y: 736,
        },
        {
          x: 7680,
          y: 1278,
        },
        {
          x: 7597,
          y: 1243,
        },
        {
          x: 7520,
          y: 1204,
        },
        {
          x: 7478,
          y: 1251,
        },
        {
          x: 7392,
          y: 1327,
        },
        {
          x: 7280,
          y: 1439,
        },
        {
          x: 7103,
          y: 1469,
        },
        {
          x: 6902,
          y: 1369,
        },
        {
          x: 6726,
          y: 1327,
        },
        {
          x: 6628,
          y: 1294,
        },
        {
          x: 6451,
          y: 1276,
        },
        {
          x: 6307,
          y: 1307,
        },
        {
          x: 6227,
          y: 1267,
        },
        {
          x: 6171,
          y: 1097,
        },
        {
          x: 6047,
          y: 930,
        },
        {
          x: 5871,
          y: 747,
        },
      ],
      regionComments: [],
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
          x: 203,
          y: 1557,
        },
        {
          x: 294,
          y: 1455,
        },
        {
          x: 378,
          y: 1359,
        },
        {
          x: 471,
          y: 1338,
        },
        {
          x: 877,
          y: 1321,
        },
        {
          x: 1197,
          y: 1370,
        },
        {
          x: 1362,
          y: 1501,
        },
        {
          x: 1472,
          y: 1730,
        },
        {
          x: 1676,
          y: 1918,
        },
        {
          x: 1951,
          y: 2025,
        },
        {
          x: 2045,
          y: 2148,
        },
        {
          x: 2473,
          y: 2327,
        },
        {
          x: 2545,
          y: 2473,
        },
        {
          x: 2566,
          y: 2672,
        },
        {
          x: 2814,
          y: 2999,
        },
        {
          x: 2721,
          y: 3119,
        },
        {
          x: 2134,
          y: 3426,
        },
        {
          x: 1532,
          y: 3442,
        },
        {
          x: 1012,
          y: 3429,
        },
        {
          x: 735,
          y: 3425,
        },
        {
          x: 476,
          y: 3332,
        },
        {
          x: 243,
          y: 3138,
        },
        {
          x: 139,
          y: 2985,
        },
        {
          x: 78,
          y: 2727,
        },
        {
          x: 80,
          y: 2465,
        },
        {
          x: 164,
          y: 2276,
        },
        {
          x: 248,
          y: 2024,
        },
        {
          x: 273,
          y: 1966,
        },
        {
          x: 217,
          y: 1844,
        },
        {
          x: 187,
          y: 1700,
        },
      ],
      regionComments: [],
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
    },
    {
      id: "reg-ilhota-ferrosa",
      name: "Ilha Cogumelo",
      type: "Outro",
      biome: "Árido Costeiro",
      climate: "Seco",
      color: "#8B5A2B",
      opacity: 0.23,
      tags: ["ilhota", "minério", "isolada"],
      description:
        "Pequena ilha rochosa de tonalidade avermelhada-marrom, isolada nas águas entre o continente e a Ilha Esmeralda, possivelmente rica em depósitos minerais.",
      notes:
        "Notas do mestre: útil como parada de reabastecimento ou esconderijo de piratas.",
      points: [
        {
          x: 2502,
          y: 1662,
        },
        {
          x: 2579,
          y: 1601,
        },
        {
          x: 2703,
          y: 1557,
        },
        {
          x: 2759,
          y: 1605,
        },
        {
          x: 2804,
          y: 1646,
        },
        {
          x: 2782,
          y: 1754,
        },
        {
          x: 2604,
          y: 1823,
        },
        {
          x: 2471,
          y: 1749,
        },
      ],
      regionComments: [],
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
          x: 3496,
          y: 1863,
        },
        {
          x: 3594,
          y: 1756,
        },
        {
          x: 3854,
          y: 1810,
        },
        {
          x: 3913,
          y: 1956,
        },
        {
          x: 3932,
          y: 2009,
        },
        {
          x: 3920,
          y: 2087,
        },
        {
          x: 3867,
          y: 2124,
        },
        {
          x: 3699,
          y: 2170,
        },
        {
          x: 3555,
          y: 2215,
        },
        {
          x: 3428,
          y: 2154,
        },
        {
          x: 3420,
          y: 2001,
        },
      ],
      regionComments: [],
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
          x: 2595,
          y: 2298,
        },
        {
          x: 2725,
          y: 2254,
        },
        {
          x: 2839,
          y: 2373,
        },
        {
          x: 2886,
          y: 2530,
        },
        {
          x: 2862,
          y: 2603,
        },
        {
          x: 2775,
          y: 2681,
        },
        {
          x: 2591,
          y: 2645,
        },
        {
          x: 2562,
          y: 2603,
        },
        {
          x: 2553,
          y: 2476,
        },
        {
          x: 2560,
          y: 2389,
        },
      ],
      regionComments: [],
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
    },
    {
      id: "reg-ilha-rosea",
      name: "Ilha Rósea",
      type: "Ilha",
      biome: "Exótico Úmido",
      climate: "Úmido Anômalo",
      color: "#D98FC4",
      opacity: 0.23,
      tags: ["exótico", "fungos", "cratera", "mágico"],
      description:
        "Ilha de coloração rósea incomum, coberta por vegetação e esporos fúngicos, com uma cratera esbranquiçada no centro que abriga um ponto avermelhado — possivelmente um lago de cristal ou ruína mágica.",
      notes:
        "Notas do mestre: forte candidata a bioma de origem mágica ou corrompida; a cratera central é um ótimo local para um santuário ou perigo sobrenatural.",
      points: [
        {
          x: 4318,
          y: 1448,
        },
        {
          x: 4617,
          y: 1380,
        },
        {
          x: 4922,
          y: 1633,
        },
        {
          x: 5099,
          y: 1653,
        },
        {
          x: 5256,
          y: 1659,
        },
        {
          x: 5367,
          y: 1669,
        },
        {
          x: 5446,
          y: 1830,
        },
        {
          x: 5309,
          y: 1980,
        },
        {
          x: 5252,
          y: 2127,
        },
        {
          x: 5262,
          y: 2259,
        },
        {
          x: 5181,
          y: 2437,
        },
        {
          x: 4884,
          y: 2559,
        },
        {
          x: 4711,
          y: 2595,
        },
        {
          x: 4588,
          y: 2538,
        },
        {
          x: 4404,
          y: 2240,
        },
        {
          x: 4322,
          y: 1935,
        },
        {
          x: 4084,
          y: 1713,
        },
        {
          x: 4070,
          y: 1589,
        },
      ],
      regionComments: [],
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
    },
    {
      id: "reg-terras-sombrias",
      name: "Terras Sombrias",
      type: "Ilha",
      biome: "Amaldiçoado / Basáltico",
      climate: "Árido Sombrio",
      color: "#5B3A4A",
      opacity: 0.27,
      tags: ["vulcânico", "sombrio", "perigo"],
      description:
        "Arquipélago de rocha escura e fraturada, com veios que lembram fissuras vulcânicas ou marcas de uma antiga catástrofe. O local mais isolado e inóspito do mapa.",
      notes:
        "Notas do mestre: excelente cenário para uma masmorra vulcânica, uma terra amaldiçoada ou o covil de uma ameaça antiga.",
      points: [
        {
          x: 5714,
          y: 1840,
        },
        {
          x: 5823,
          y: 1658,
        },
        {
          x: 5866,
          y: 1562,
        },
        {
          x: 5921,
          y: 1455,
        },
        {
          x: 6056,
          y: 1378,
        },
        {
          x: 6140,
          y: 1440,
        },
        {
          x: 6005,
          y: 1663,
        },
        {
          x: 6043,
          y: 1811,
        },
        {
          x: 6212,
          y: 1678,
        },
        {
          x: 6275,
          y: 1559,
        },
        {
          x: 6335,
          y: 1514,
        },
        {
          x: 6393,
          y: 1591,
        },
        {
          x: 6321,
          y: 1766,
        },
        {
          x: 6421,
          y: 1746,
        },
        {
          x: 6467,
          y: 1630,
        },
        {
          x: 6589,
          y: 1585,
        },
        {
          x: 6661,
          y: 1610,
        },
        {
          x: 6591,
          y: 1808,
        },
        {
          x: 6700,
          y: 1886,
        },
        {
          x: 6830,
          y: 1944,
        },
        {
          x: 6945,
          y: 1874,
        },
        {
          x: 7133,
          y: 1902,
        },
        {
          x: 7114,
          y: 2108,
        },
        {
          x: 7168,
          y: 2417,
        },
        {
          x: 7108,
          y: 2674,
        },
        {
          x: 7000,
          y: 2745,
        },
        {
          x: 6889,
          y: 2702,
        },
        {
          x: 6819,
          y: 2715,
        },
        {
          x: 6738,
          y: 2821,
        },
        {
          x: 6521,
          y: 2937,
        },
        {
          x: 6392,
          y: 2866,
        },
        {
          x: 6256,
          y: 2837,
        },
        {
          x: 5894,
          y: 2649,
        },
        {
          x: 5644,
          y: 2404,
        },
        {
          x: 5601,
          y: 2277,
        },
        {
          x: 5645,
          y: 2127,
        },
        {
          x: 5716,
          y: 2138,
        },
        {
          x: 5743,
          y: 2065,
        },
        {
          x: 5678,
          y: 1908,
        },
      ],
      regionComments: [],
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
          x: 3595,
          y: 3455,
        },
        {
          x: 3766,
          y: 3367,
        },
        {
          x: 3869,
          y: 3260,
        },
        {
          x: 4062,
          y: 3223,
        },
        {
          x: 4121,
          y: 3181,
        },
        {
          x: 4123,
          y: 3107,
        },
        {
          x: 4164,
          y: 3045,
        },
        {
          x: 4438,
          y: 2936,
        },
        {
          x: 4776,
          y: 2879,
        },
        {
          x: 5056,
          y: 2674,
        },
        {
          x: 5248,
          y: 2656,
        },
        {
          x: 5492,
          y: 2691,
        },
        {
          x: 5646,
          y: 2816,
        },
        {
          x: 5802,
          y: 2917,
        },
        {
          x: 5913,
          y: 3074,
        },
        {
          x: 6089,
          y: 3026,
        },
        {
          x: 6179,
          y: 3125,
        },
        {
          x: 6399,
          y: 3163,
        },
        {
          x: 6637,
          y: 3168,
        },
        {
          x: 6891,
          y: 3444,
        },
        {
          x: 7147,
          y: 3619,
        },
        {
          x: 7247,
          y: 3811,
        },
        {
          x: 3564,
          y: 3812,
        },
      ],
      regionComments: [],
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
          x: 3559,
          y: 2664,
        },
        {
          x: 3622,
          y: 2531,
        },
        {
          x: 3723,
          y: 2419,
        },
        {
          x: 3816,
          y: 2328,
        },
        {
          x: 3963,
          y: 2271,
        },
        {
          x: 4134,
          y: 2318,
        },
        {
          x: 4222,
          y: 2404,
        },
        {
          x: 4290,
          y: 2536,
        },
        {
          x: 4405,
          y: 2735,
        },
        {
          x: 4437,
          y: 2941,
        },
        {
          x: 4160,
          y: 3051,
        },
        {
          x: 4131,
          y: 3110,
        },
        {
          x: 4126,
          y: 3176,
        },
        {
          x: 4070,
          y: 3232,
        },
        {
          x: 3869,
          y: 3259,
        },
        {
          x: 3754,
          y: 3376,
        },
        {
          x: 3597,
          y: 3460,
        },
        {
          x: 3541,
          y: 2857,
        },
      ],
      regionComments: [],
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
    },
    {
      id: "region-1783445466753",
      name: "Terras Vermelhas (Lado Esquerdo)",
      type: "Deserto",
      biome: "Semiárido",
      climate: "Quente e Seco",
      color: "#C9713F",
      opacity: 0.28,
      tags: ["deserto", "terraços", "isolamento"],
      description:
        "Região de solo avermelhado e terraços estriados, separada do restante do continente por uma língua de mar. Uma formação escura e irregular no interior sugere uma cratera antiga ou ruína vulcânica.",
      notes:
        "Notas do mestre: a mancha escura ao centro pode esconder uma ruína ou ser marcada como ponto de interesse ainda não nomeado.",
      points: [
        {
          x: 0,
          y: 545,
        },
        {
          x: 405,
          y: 729,
        },
        {
          x: 510,
          y: 770,
        },
        {
          x: 551,
          y: 848,
        },
        {
          x: 507,
          y: 874,
        },
        {
          x: 441,
          y: 921,
        },
        {
          x: 373,
          y: 970,
        },
        {
          x: 286,
          y: 1019,
        },
        {
          x: 174,
          y: 1078,
        },
        {
          x: 0,
          y: 1093,
        },
        {
          x: 0,
          y: 855,
        },
      ],
      regionComments: [],
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
    },
  ],
  pois: [],
  routes: [],
  comments: [],
  travelPlan: {
    origin: "Porto Vermelho",
    destination: "Porto da Savana",
    stops: ["Porto Vermelho"],
    selectedRouteIds: [],
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
  },
  worldScale: 1,
};
