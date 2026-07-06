import { useState, useEffect, useRef } from "react";
import { Compass, Search } from "lucide-react";

import { Campaign, Point, Region, Route, POI, MapComment } from "./types";
import { DEFAULT_CAMPAIGN } from "./defaultCampaign";

// Import all sub-components
import MapCanvas from "./components/MapCanvas";
import FloatingToolbar from "./components/FloatingToolbar";
import ZoomControl from "./components/ZoomControl";
import MiniMap from "./components/MiniMap";
import LayersPanel from "./components/LayersPanel";
import InspectorPanel from "./components/InspectorPanel";
import TravelPlanner from "./components/TravelPlanner";
import CampaignSelector from "./components/CampaignSelector";
import CommandPalette from "./components/CommandPalette";

import logo from "./imgs/logo.svg";

const THEME_STORAGE_KEY = "traveler-theme";
const CAMPAIGNS_STORAGE_KEY = "traveler-campaigns";
const ACTIVE_CAMPAIGN_STORAGE_KEY = "traveler-active-campaign-id";
const STORAGE_WRITE_DELAY_MS = 180;

type CopiedElement =
  | { type: "region"; data: Region }
  | { type: "route"; data: Route }
  | { type: "poi"; data: POI }
  | { type: "comment"; data: MapComment };

const cloneCampaign = (campaign: Campaign): Campaign => {
  if (typeof structuredClone === "function") {
    return structuredClone(campaign);
  }

  return JSON.parse(JSON.stringify(campaign)) as Campaign;
};

const normalizeCampaign = (campaign: Campaign): Campaign => {
  const normalizedTravelPlan = {
    ...campaign.travelPlan,
    origin: campaign.travelPlan?.origin || "Ponto de Partida",
    destination: campaign.travelPlan?.destination || "Destino",
    stops: Array.isArray(campaign.travelPlan?.stops)
      ? campaign.travelPlan.stops
      : [],
    selectedRouteIds: Array.isArray(campaign.travelPlan?.selectedRouteIds)
      ? campaign.travelPlan.selectedRouteIds
      : [],
    caravan: {
      defesa: campaign.travelPlan?.caravan?.defesa ?? 1,
      suporte: campaign.travelPlan?.caravan?.suporte ?? 1,
      diplomacia: campaign.travelPlan?.caravan?.diplomacia ?? 1,
      bonusAnimal: campaign.travelPlan?.caravan?.bonusAnimal ?? 0,
      bonusNatural: campaign.travelPlan?.caravan?.bonusNatural ?? 0,
      bonusAmeaça: campaign.travelPlan?.caravan?.bonusAmeaça ?? 0,
      sentinelasCount: campaign.travelPlan?.caravan?.sentinelasCount ?? 1,
      elosCount: campaign.travelPlan?.caravan?.elosCount ?? 1,
      mensageirosCount: campaign.travelPlan?.caravan?.mensageirosCount ?? 1,
      sabioAnimalCount: campaign.travelPlan?.caravan?.sabioAnimalCount ?? 0,
      sabioNaturalCount: campaign.travelPlan?.caravan?.sabioNaturalCount ?? 0,
      sabioAmeaçaCount: campaign.travelPlan?.caravan?.sabioAmeaçaCount ?? 0,
      useStreetGuild: campaign.travelPlan?.caravan?.useStreetGuild ?? false,
    },
    supplies: campaign.travelPlan?.supplies ?? 12,
    maxSupplies: campaign.travelPlan?.maxSupplies ?? 20,
    moral: campaign.travelPlan?.moral ?? 0,
    fatigue: campaign.travelPlan?.fatigue ?? 0,
    traveling: campaign.travelPlan?.traveling ?? false,
    currentSegmentIndex: campaign.travelPlan?.currentSegmentIndex ?? 0,
    historyLog: Array.isArray(campaign.travelPlan?.historyLog)
      ? campaign.travelPlan.historyLog
      : [],
  };

  return {
    ...campaign,
    description: campaign.description || "Campanha de viagem sem descrição.",
    mapUrl: campaign.mapUrl || "",
    mapType: campaign.mapType || "svg",
    mapWidth: campaign.mapWidth || 2000,
    mapHeight: campaign.mapHeight || 1400,
    worldScale: campaign.worldScale ?? 1,
    regions: (campaign.regions || []).map((region) => ({
      ...region,
      tags: Array.isArray(region.tags) ? region.tags : [],
      notes: region.notes || "",
      description: region.description || "",
      biome: region.biome || "Não definido",
      climate: region.climate || "Não definido",
      regionComments: Array.isArray(region.regionComments)
        ? region.regionComments
        : [],
      regionMarkers: Array.isArray(region.regionMarkers)
        ? region.regionMarkers
        : [],
      regionNotes: Array.isArray(region.regionNotes) ? region.regionNotes : [],
      regionReferences: Array.isArray(region.regionReferences)
        ? region.regionReferences
        : [],
    })),
    routes: Array.isArray(campaign.routes) ? campaign.routes : [],
    pois: Array.isArray(campaign.pois) ? campaign.pois : [],
    comments: Array.isArray(campaign.comments) ? campaign.comments : [],
    travelPlan: normalizedTravelPlan,
  };
};

export default function App() {
  // Campaign Lists & Loading state
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeCampaignId, setActiveCampaignId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // GET ACTIVE CAMPAIGN OBJECT
  const activeCampaign =
    campaigns.find((c) => c.id === activeCampaignId) || null;

  // Active Tool Selection
  const [activeTool, setActiveTool] = useState<
    "select" | "pan" | "draw-poly" | "draw-route" | "pin" | "comment" | "ruler"
  >("select");
  const [selectedElement, setSelectedElement] = useState<{
    type: "region" | "route" | "poi" | "comment" | null;
    id: string | null;
  }>({ type: null, id: null });

  // Camera Zoom & Pan Offset State
  const [zoom, setZoom] = useState<number>(0.85);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [cameraLocked, setCameraLocked] = useState<boolean>(false);

  // Interactive Layer state
  const [layerVisibility, setLayerVisibility] = useState<
    Record<string, boolean>
  >({
    regioes: true,
    rotas: true,
    pins: true,
    comentarios: true,
    travessias: true,
    grade: true,
  });
  const [layerLocks, setLayerLocks] = useState<Record<string, boolean>>({
    regioes: false,
    rotas: false,
    pins: false,
    comentarios: false,
    travessias: false,
    grade: true,
  });
  const [customLayers, setCustomLayers] = useState<
    { id: string; name: string; color: string }[]
  >([]);

  const [layerOrder, setLayerOrder] = useState<string[]>([
    "comentarios",
    "pins",
    "travessias",
    "rotas",
    "regioes",
    "grade",
  ]);

  const handleAddCustomLayer = (id: string, name: string, color: string) => {
    setCustomLayers((prev) => [...prev, { id, name, color }]);
    setLayerVisibility((prev) => ({ ...prev, [id]: true }));
    setLayerLocks((prev) => ({ ...prev, [id]: false }));
    setLayerOrder((prev) => [id, ...prev]);
  };

  const handleDeleteCustomLayer = (id: string) => {
    setCustomLayers((prev) => prev.filter((cl) => cl.id !== id));
    setLayerOrder((prev) => prev.filter((lId) => lId !== id));
  };

  const handleRenameCustomLayer = (id: string, newName: string) => {
    setCustomLayers((prev) =>
      prev.map((cl) => (cl.id === id ? { ...cl, name: newName } : cl)),
    );
  };

  // Theme & Search Command Palette state
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === "dark") return true;
    if (storedTheme === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);

  // Map Cursor tracking (for MiniMap coordinates HUD)
  const [cursorPos, setCursorPos] = useState<Point | null>(null);

  // Keyboard Shortcuts & WASD Map Navigation State
  const [copiedElement, setCopiedElement] = useState<CopiedElement | null>(
    null,
  );
  const [undoStack, setUndoStack] = useState<Campaign[]>([]);
  const historyCooldownRef = useRef(false);
  const historyCooldownTimeoutRef = useRef<number | null>(null);
  const campaignsPersistTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (historyCooldownTimeoutRef.current !== null) {
        window.clearTimeout(historyCooldownTimeoutRef.current);
      }
      if (campaignsPersistTimeoutRef.current !== null) {
        window.clearTimeout(campaignsPersistTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ignore key shortcuts when typing in form inputs
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (
        activeTag === "input" ||
        activeTag === "textarea" ||
        document.activeElement?.hasAttribute("contenteditable")
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      const isCtrl = e.ctrlKey || e.metaKey;
      const isMovementKey =
        key === "w" ||
        key === "a" ||
        key === "s" ||
        key === "d" ||
        key === "arrowup" ||
        key === "arrowdown" ||
        key === "arrowleft" ||
        key === "arrowright";

      // Copy and Paste actions
      if (isCtrl) {
        if (key === "z") {
          if (undoStack.length > 0) {
            const previous = undoStack[0];
            setUndoStack((prev) => prev.slice(1));
            handleUpdateActiveCampaign(previous, { recordHistory: false });
            setActiveCampaignId(previous.id);
            setSelectedElement({ type: null, id: null });
          }
          e.preventDefault();
          return;
        }

        if (key === "c") {
          if (activeCampaign && selectedElement.id && selectedElement.type) {
            const { type, id } = selectedElement;

            if (type === "region") {
              const region = activeCampaign.regions.find((r) => r.id === id);
              if (region) setCopiedElement({ type: "region", data: region });
            } else if (type === "route") {
              const route = activeCampaign.routes.find((r) => r.id === id);
              if (route) setCopiedElement({ type: "route", data: route });
            } else if (type === "poi") {
              const poi = activeCampaign.pois.find((p) => p.id === id);
              if (poi) setCopiedElement({ type: "poi", data: poi });
            } else if (type === "comment") {
              const comment = activeCampaign.comments.find((c) => c.id === id);
              if (comment) {
                setCopiedElement({ type: "comment", data: comment });
              }
            }
          }
          e.preventDefault();
          return;
        }
        if (key === "v") {
          if (activeCampaign && copiedElement) {
            const { type, data } = copiedElement;
            const newId = `${type}-${Date.now()}`;

            const defaultPastePoint =
              type === "region" || type === "route"
                ? data.points[0] || { x: 200, y: 200 }
                : { x: data.x, y: data.y };

            // Use current map cursor, or default offset from original
            const pasteX = cursorPos ? cursorPos.x : defaultPastePoint.x + 45;
            const pasteY = cursorPos ? cursorPos.y : defaultPastePoint.y + 45;

            const updatedCampaign = { ...activeCampaign };

            if (type === "region") {
              const pts = data.points;
              if (pts && pts.length > 0) {
                const minX = Math.min(...pts.map((p) => p.x));
                const minY = Math.min(...pts.map((p) => p.y));
                const dx = pasteX - minX;
                const dy = pasteY - minY;
                const newPoints = pts.map((p) => ({
                  x: p.x + dx,
                  y: p.y + dy,
                }));

                const clonedRegion = {
                  ...data,
                  id: newId,
                  name: `${data.name} (Cópia)`,
                  points: newPoints,
                };
                updatedCampaign.regions = [
                  ...activeCampaign.regions,
                  clonedRegion,
                ];
              }
            } else if (type === "route") {
              const pts = data.points;
              if (pts && pts.length > 0) {
                const dx = pasteX - pts[0].x;
                const dy = pasteY - pts[0].y;
                const newPoints = pts.map((p) => ({
                  x: p.x + dx,
                  y: p.y + dy,
                }));

                const clonedRoute = {
                  ...data,
                  id: newId,
                  name: `${data.name} (Cópia)`,
                  points: newPoints,
                };
                updatedCampaign.routes = [
                  ...activeCampaign.routes,
                  clonedRoute,
                ];
              }
            } else if (type === "poi") {
              const clonedPoi = {
                ...data,
                id: newId,
                name: `${data.name} (Cópia)`,
                x: pasteX,
                y: pasteY,
              };
              updatedCampaign.pois = [...activeCampaign.pois, clonedPoi];
            } else if (type === "comment") {
              const clonedComment = {
                ...data,
                id: newId,
                content: `${data.content} (Cópia)`,
                x: pasteX,
                y: pasteY,
                date: new Date().toLocaleDateString("pt-BR"),
              };
              updatedCampaign.comments = [
                ...activeCampaign.comments,
                clonedComment,
              ];
            }

            handleUpdateActiveCampaign(updatedCampaign);
            setSelectedElement({ type, id: newId });
          }
          e.preventDefault();
          return;
        }
      }

      // Delete action (Delete or Backspace)
      if (key === "delete" || key === "backspace") {
        if (activeCampaign && selectedElement.id && selectedElement.type) {
          const { type, id } = selectedElement;
          const updatedCampaign = { ...activeCampaign };

          if (type === "region") {
            updatedCampaign.regions = activeCampaign.regions.filter(
              (r) => r.id !== id,
            );
          } else if (type === "route") {
            updatedCampaign.routes = activeCampaign.routes.filter(
              (r) => r.id !== id,
            );
          } else if (type === "poi") {
            updatedCampaign.pois = activeCampaign.pois.filter(
              (p) => p.id !== id,
            );
          } else if (type === "comment") {
            updatedCampaign.comments = activeCampaign.comments.filter(
              (c) => c.id !== id,
            );
          }

          handleUpdateActiveCampaign(updatedCampaign);
          setSelectedElement({ type: null, id: null });
        }
        return;
      }

      // WASD/Arrow keys are reserved for camera movement in MapCanvas.
      if (isMovementKey) {
        return;
      }

      // Tool Shortcuts
      if (key === "v") {
        setActiveTool("select");
      } else if (key === "h" || key === "p") {
        setActiveTool("pan");
      } else if (key === "r") {
        setActiveTool("draw-poly");
      } else if (key === "t") {
        setActiveTool("draw-route");
      } else if (key === "o" || key === "i") {
        setActiveTool("pin");
      } else if (key === "c") {
        setActiveTool("comment");
      } else if (key === "m") {
        setActiveTool("ruler");
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [activeCampaign, selectedElement, copiedElement, cursorPos, undoStack]);

  // LOAD CAMPAIGNS FROM LOCAL STORAGE ON MOUNT
  useEffect(() => {
    try {
      const rawCampaigns = window.localStorage.getItem(CAMPAIGNS_STORAGE_KEY);
      const parsedCampaigns = rawCampaigns ? JSON.parse(rawCampaigns) : null;

      if (Array.isArray(parsedCampaigns) && parsedCampaigns.length > 0) {
        const normalized = parsedCampaigns.map((c) =>
          normalizeCampaign(c as Campaign),
        );
        setCampaigns(normalized);

        const storedActiveId = window.localStorage.getItem(
          ACTIVE_CAMPAIGN_STORAGE_KEY,
        );
        const resolvedActiveId = normalized.some((c) => c.id === storedActiveId)
          ? storedActiveId
          : normalized[0].id;

        setActiveCampaignId(resolvedActiveId || normalized[0].id);
      } else {
        setCampaigns([normalizeCampaign(DEFAULT_CAMPAIGN)]);
        setActiveCampaignId(DEFAULT_CAMPAIGN.id);
      }
    } catch (err) {
      console.error(
        "Error loading campaigns from localStorage, using default campaign:",
        err,
      );
      setCampaigns([normalizeCampaign(DEFAULT_CAMPAIGN)]);
      setActiveCampaignId(DEFAULT_CAMPAIGN.id);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loading) return;

    if (campaignsPersistTimeoutRef.current !== null) {
      window.clearTimeout(campaignsPersistTimeoutRef.current);
    }

    campaignsPersistTimeoutRef.current = window.setTimeout(() => {
      window.localStorage.setItem(
        CAMPAIGNS_STORAGE_KEY,
        JSON.stringify(campaigns),
      );
      if (activeCampaignId) {
        window.localStorage.setItem(
          ACTIVE_CAMPAIGN_STORAGE_KEY,
          activeCampaignId,
        );
      }
    }, STORAGE_WRITE_DELAY_MS);

    return () => {
      if (campaignsPersistTimeoutRef.current !== null) {
        window.clearTimeout(campaignsPersistTimeoutRef.current);
      }
    };
  }, [campaigns, activeCampaignId, loading]);

  useEffect(() => {
    const themeValue = isDarkTheme ? "dark" : "light";
    document.documentElement.classList.toggle("dark", isDarkTheme);
    document.documentElement.setAttribute("data-theme", themeValue);
    window.localStorage.setItem(THEME_STORAGE_KEY, themeValue);
  }, [isDarkTheme]);

  // PERSIST MUTATED CAMPAIGN TO LOCAL STATE/STORAGE
  const handleUpdateActiveCampaign = (
    updatedCampaign: Campaign,
    options?: { recordHistory?: boolean },
  ) => {
    const normalizedCampaign = normalizeCampaign(updatedCampaign);
    const recordHistory = options?.recordHistory !== false;

    setCampaigns((prevCampaigns) => {
      const existing = prevCampaigns.find(
        (c) => c.id === normalizedCampaign.id,
      );

      if (recordHistory && existing && !historyCooldownRef.current) {
        setUndoStack((prev) => [cloneCampaign(existing), ...prev].slice(0, 50));
        historyCooldownRef.current = true;
        if (historyCooldownTimeoutRef.current !== null) {
          window.clearTimeout(historyCooldownTimeoutRef.current);
        }
        historyCooldownTimeoutRef.current = window.setTimeout(() => {
          historyCooldownRef.current = false;
          historyCooldownTimeoutRef.current = null;
        }, 400);
      }

      return prevCampaigns.map((campaign) =>
        campaign.id === normalizedCampaign.id ? normalizedCampaign : campaign,
      );
    });
  };

  const handleCreateCampaign = (newCampaign: Campaign) => {
    const normalizedCampaign = normalizeCampaign(newCampaign);
    const newList = [...campaigns, normalizedCampaign];
    setCampaigns(newList);
    setActiveCampaignId(normalizedCampaign.id);
    setUndoStack([]);
  };

  const handleDeleteCampaign = (id: string) => {
    if (campaigns.length <= 1) return;
    const filtered = campaigns.filter((c) => c.id !== id);
    setCampaigns(filtered);
    if (activeCampaignId === id) {
      setActiveCampaignId(filtered[0].id);
      setSelectedElement({ type: null, id: null });
    }
    setUndoStack([]);
  };

  // Switch Active Campaign ID
  const handleSelectCampaign = (id: string) => {
    setActiveCampaignId(id);
    setSelectedElement({ type: null, id: null });
    setZoom(0.85);
    setPan({ x: 0, y: 0 });
    setUndoStack([]);
  };

  return (
    <div
      className={`fixed inset-0 overflow-hidden w-screen h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDarkTheme
          ? "bg-slate-950 text-slate-100"
          : "bg-parchment-200 text-parchment-950"
      }`}
    >
      {/* BACKGROUND MAP RENDERING VIEW (Full screen viewport) */}
      <div className="absolute inset-0 w-full h-full z-10">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-slate-950 text-slate-300">
            <Compass className="animate-spin text-amber-500" size={32} />
            <span className="font-display font-semibold tracking-wider text-xs">
              Abertura dos Mapas de Viagem...
            </span>
          </div>
        ) : activeCampaign ? (
          <MapCanvas
            campaign={activeCampaign}
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
            zoom={zoom}
            setZoom={setZoom}
            pan={pan}
            setPan={setPan}
            cameraLocked={cameraLocked}
            layerVisibility={layerVisibility}
            layerLocks={layerLocks}
            updateCampaign={handleUpdateActiveCampaign}
            cursorPos={cursorPos}
            setCursorPos={setCursorPos}
            isDarkTheme={isDarkTheme}
            layerOrder={layerOrder}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="opacity-50">
              Nenhuma campanha carregada. Clique em Gerenciar Campanhas para
              começar.
            </span>
          </div>
        )}
      </div>

      {/* FLOAT FLOATING UI OVERLAY CONTAINER  */}
      {!loading && activeCampaign && (
        <div className="absolute inset-0 pointer-events-none z-10 w-full h-full flex flex-col justify-between p-4">
          {/* TOP HUD ROW (Campaign name, selectors, Search launcher) */}
          <header className="flex justify-between items-start w-full pointer-events-auto">
            {/* Left side: Campaign Label Title & Description */}
            <div className=" p-2 rounded-xl bg-amber-500 text-slate-950">
              <img src={logo} alt="Logo" className="w-8" />
            </div>
            {/* Right side: Search shortcut trigger & Campaign selection card */}
            <div className="flex items-center gap-3">
              {/* Command Palette Launcher button */}
              <button
                onClick={() => setCommandPaletteOpen(true)}
                className={`p-2.5 rounded-xl border cursor-pointer flex items-center gap-2 font-semibold transition-all text-xs ${
                  isDarkTheme
                    ? "bg-[#12141dd9] border-slate-800 text-slate-300 shadow-lg hover:bg-slate-800"
                    : "bg-[#faf6eef5] border-parchment-300 text-parchment-900 shadow-sm hover:bg-parchment-200"
                }`}
              >
                <Search size={14} className="opacity-70" />
                <span className="hidden sm:inline">Buscar...</span>
                <span className="font-mono text-[9px] opacity-40 bg-white/10 px-1.5 py-0.2 rounded border border-white/5">
                  /
                </span>
              </button>

              <CampaignSelector
                campaigns={campaigns}
                activeCampaignId={activeCampaignId}
                onSelectCampaign={handleSelectCampaign}
                onCreateCampaign={handleCreateCampaign}
                onDeleteCampaign={handleDeleteCampaign}
                isDarkTheme={isDarkTheme}
              />
            </div>
          </header>

          {/* MIDDLE HUD ZONE: Left Toolbar vs Right Layer/Inspect panels */}
          <div className="flex-1 w-full flex justify-between items-center my-4 overflow-hidden">
            {/* Left toolbar pane */}
            <div className="pointer-events-auto shrink-0 self-center">
              <FloatingToolbar
                activeTool={activeTool}
                setActiveTool={setActiveTool}
                isDarkTheme={isDarkTheme}
                setIsDarkTheme={setIsDarkTheme}
                setCommandPaletteOpen={setCommandPaletteOpen}
              />
            </div>

            {/* Right panels group (Layers Panel & Active Propriedades) */}
            <div className="pointer-events-auto shrink-0 self-stretch flex flex-col items-end gap-3 max-h-full overflow-visible">
              {/* Top: visual layers switch panel */}
              <LayersPanel
                layerVisibility={layerVisibility}
                setLayerVisibility={setLayerVisibility}
                layerLocks={layerLocks}
                setLayerLocks={setLayerLocks}
                isDarkTheme={isDarkTheme}
                counts={{
                  regions: activeCampaign.regions.length,
                  routes: activeCampaign.routes.length,
                  pois: activeCampaign.pois.length,
                  comments: activeCampaign.comments.length,
                }}
                customLayers={customLayers}
                onAddCustomLayer={handleAddCustomLayer}
                onDeleteCustomLayer={handleDeleteCustomLayer}
                onRenameCustomLayer={handleRenameCustomLayer}
                layerOrder={layerOrder}
                setLayerOrder={setLayerOrder}
              />

              {/* Bottom: selected elements attributes inspector */}
              <InspectorPanel
                campaign={activeCampaign}
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
                updateCampaign={handleUpdateActiveCampaign}
                isDarkTheme={isDarkTheme}
              />
            </div>
          </div>

          {/* BOTTOM BAR HUD: Zoom cameras, distance scales, interactive Planner */}
          <footer className="flex justify-between items-end w-full pointer-events-auto mt-auto">
            {/* Left corner: MiniMap coordinates & geographical scale bar */}
            <MiniMap
              campaign={activeCampaign}
              cursorPos={cursorPos}
              zoom={zoom}
              isDarkTheme={isDarkTheme}
              onUpdateScale={(scale) =>
                handleUpdateActiveCampaign({
                  ...activeCampaign,
                  worldScale: scale,
                })
              }
            />

            {/* Center area: Zoom Controls camera locks */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-4 hidden md:block">
              <ZoomControl
                zoom={zoom}
                setZoom={setZoom}
                setPan={setPan}
                cameraLocked={cameraLocked}
                setCameraLocked={setCameraLocked}
                isDarkTheme={isDarkTheme}
              />
            </div>

            {/* Right corner: Interactive Travel Mechanics planner board */}
            <TravelPlanner
              campaign={activeCampaign}
              updateCampaign={handleUpdateActiveCampaign}
              isDarkTheme={isDarkTheme}
            />
          </footer>
        </div>
      )}

      {/* QUICK COMMAND PALETTE POPUP */}
      {!loading && activeCampaign && (
        <CommandPalette
          isOpen={commandPaletteOpen}
          setIsOpen={setCommandPaletteOpen}
          campaign={activeCampaign}
          setSelectedElement={setSelectedElement}
          setPan={setPan}
          setZoom={setZoom}
          layerVisibility={layerVisibility}
          setLayerVisibility={setLayerVisibility}
          isDarkTheme={isDarkTheme}
        />
      )}
    </div>
  );
}
