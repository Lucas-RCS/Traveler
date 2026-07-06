import { Campaign } from "./types";

export const DEFAULT_CAMPAIGN: Campaign = {
  id: "campaign-default",
  name: "Mapa Base",
  description:
    "Campanha padrão simplificada com placeholders para todas as funções principais.",
  mapUrl: "",
  mapType: "svg",
  mapWidth: 2000,
  mapHeight: 1400,
  regions: [
    {
      id: "reg-central",
      name: "Região Central",
      type: "Planície",
      biome: "Temperado",
      climate: "Moderado",
      color: "#22C55E",
      opacity: 0.16,
      tags: ["base", "placeholder"],
      description: "Região inicial usada para testes e edição rápida.",
      notes: "Notas do mestre: ajuste livre para sua campanha.",
      points: [
        { x: 700, y: 500 },
        { x: 1300, y: 500 },
        { x: 1300, y: 950 },
        { x: 700, y: 950 },
      ],
      regionComments: [
        {
          id: "regionComments-default-1",
          text: "Comentário inicial da região.",
        },
      ],
      regionMarkers: [
        {
          id: "regionMarkers-default-1",
          text: "Marcador inicial.",
        },
      ],
      regionNotes: [
        {
          id: "regionNotes-default-1",
          text: "Nota curta inicial.",
        },
      ],
      regionReferences: [
        {
          id: "ref-default-1",
          label: "Referência inicial",
          url: "",
        },
      ],
    },
  ],
  pois: [
    {
      id: "poi-start",
      name: "Ponto Inicial",
      type: "Cidade",
      x: 900,
      y: 680,
      description: "POI de origem para o planejamento da viagem.",
    },
    {
      id: "poi-end",
      name: "Ponto Final",
      type: "Vila",
      x: 1200,
      y: 760,
      description: "POI de destino para o planejamento da viagem.",
    },
  ],
  routes: [
    {
      id: "route-default",
      name: "Rota Inicial",
      color: "#3B82F6",
      points: [
        { x: 900, y: 680 },
        { x: 1040, y: 700 },
        { x: 1200, y: 760 },
      ],
      length: 120,
      suppliesCost: 2,
      obstaclesCount: 2,
      category: "Estrada",
      obstaclesDescription: "Obstáculos moderados para testes de jornada.",
      crossingsCount: 1,
      notes: "Rota padrão para validar mecânicas de deslocamento.",
      startPoiId: "poi-start",
      endPoiId: "poi-end",
    },
  ],
  comments: [
    {
      id: "comment-default-1",
      author: "Mestre",
      avatar: "M",
      content: "Comentário de exemplo no mapa padrão.",
      x: 1060,
      y: 710,
      date: "Hoje",
      resolved: false,
    },
  ],
  travelPlan: {
    origin: "Ponto Inicial",
    destination: "Ponto Final",
    stops: ["Ponto Inicial"],
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
    historyLog: [
      {
        id: "log-default-1",
        text: "Campanha padrão criada com dados mínimos e placeholders.",
        type: "info",
        timestamp: "Agora",
      },
    ],
  },
  worldScale: 1,
};
