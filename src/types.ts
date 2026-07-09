export interface Point {
  x: number;
  y: number;
}

export interface RegionTextItem {
  id: string;
  text: string;
}

export type RegionType =
  | "Floresta"
  | "Reino"
  | "Deserto"
  | "Montanha"
  | "Mar"
  | "Pântano"
  | "Planície"
  | "Planície Gélida"
  | "Ilha"
  | "Outro";

export interface Region {
  id: string;
  name: string;
  type: RegionType;
  biome: string;
  climate: string;
  color: string;
  opacity: number;
  tags: string[];
  description: string;
  notes: string;
  points: Point[]; // Polygons in coordinate space (0 to 2000 or absolute)
  regionComments?: RegionTextItem[];
  regionMarkers?: RegionTextItem[];
  regionNotes?: RegionTextItem[];
}

export type RouteCategory =
  | "Estrada"
  | "Trilha"
  | "Túneis"
  | "Atalho"
  | "Marítimo";

export interface Route {
  id: string;
  name: string;
  color: string;
  points: Point[]; // Path control points
  length: number; // in km
  suppliesCost: number; // Supplies consumption
  obstaclesCount: number; // Number of obstacles
  category: RouteCategory;
  obstaclesDescription: string;
  crossingsCount: number;
  notes: string;
  startPoiId?: string;
  endPoiId?: string;
}

export type POIType =
  | "Cidade"
  | "Vila"
  | "Ruína"
  | "Templo"
  | "Porto"
  | "Castelo"
  | "Acampamento"
  | "Posto"
  | "Marco"
  | "Pin";

export interface POI {
  id: string;
  name: string;
  type: POIType;
  x: number;
  y: number;
  description: string;
}

export interface MapComment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  x: number;
  y: number;
  date: string;
  resolved: boolean;
}

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  count: number;
  icon: string;
  color: string;
}

export interface Caravan {
  defesa: number; // 0-5
  suporte: number; // 0-5
  diplomacia: number; // 0-5
  bonusAnimal: number; // 0-3
  bonusNatural: number; // 0-3
  bonusAmeaça: number; // 0-3
  sentinelasCount: number;
  elosCount: number;
  mensageirosCount: number;
  sabioAnimalCount: number;
  sabioNaturalCount: number;
  sabioAmeaçaCount: number;
  useStreetGuild: boolean; // Guilda da Rua (cheaper/less reliable)
}

export interface TravelLog {
  id: string;
  text: string;
  type: "info" | "success" | "warning" | "danger" | "event";
  timestamp: string;
}

export interface TravelPlan {
  origin: string;
  destination: string;
  stops: string[];
  selectedRouteIds: string[];
  caravan: Caravan;
  supplies: number;
  maxSupplies: number;
  moral: number; // -5 to +5
  fatigue: number; // accumulated fatigue per traveler
  traveling: boolean;
  currentSegmentIndex: number; // which route index we are currently on
  historyLog: TravelLog[];
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  mapUrl: string;
  mapType: "raster" | "svg";
  mapWidth: number;
  mapHeight: number;
  regions: Region[];
  routes: Route[];
  pois: POI[];
  comments: MapComment[];
  travelPlan: TravelPlan;
  worldScale?: number;
}

export interface CampaignList {
  campaigns: Campaign[];
  activeCampaignId: string;
}
