import React, { useState } from "react";
import {
  X,
  Compass,
  MapPin,
  Trash2,
  Plus,
  Copy,
  ChevronDown,
  ChevronUp,
  Layers,
  FileText,
  MessageSquare,
} from "lucide-react";
import {
  Campaign,
  Region,
  Route,
  POI,
  RegionType,
  RouteCategory,
  POIType,
  RegionTextItem,
  RegionReferenceItem,
} from "../types";

interface InspectorPanelProps {
  campaign: Campaign;
  selectedElement: {
    type: "region" | "route" | "poi" | "comment" | null;
    id: string | null;
  };
  setSelectedElement: (elem: {
    type: "region" | "route" | "poi" | "comment" | null;
    id: string | null;
  }) => void;
  updateCampaign: (campaign: Campaign) => void;
  isDarkTheme: boolean;
}

export default function InspectorPanel({
  campaign,
  selectedElement,
  setSelectedElement,
  updateCampaign,
  isDarkTheme,
}: InspectorPanelProps) {
  type RegionCollectionField =
    | "regionComments"
    | "regionMarkers"
    | "regionNotes";

  // Accordion Toggles
  const [openMasterNotes, setOpenMasterNotes] = useState(false);
  const [openRegionComments, setOpenRegionComments] = useState(true);
  const [openRegionMarkers, setOpenRegionMarkers] = useState(false);
  const [openRegionNotes, setOpenRegionNotes] = useState(false);
  const [openRegionReferences, setOpenRegionReferences] = useState(false);

  // Tags typing state
  const [newTagText, setNewTagText] = useState("");
  const [newRegionComment, setNewRegionComment] = useState("");
  const [newRegionMarker, setNewRegionMarker] = useState("");
  const [newRegionNoteItem, setNewRegionNoteItem] = useState("");
  const [newRegionReferenceLabel, setNewRegionReferenceLabel] = useState("");
  const [newRegionReferenceUrl, setNewRegionReferenceUrl] = useState("");

  if (!selectedElement.type || !selectedElement.id) {
    return (
      <div
        className={`w-80 p-6 rounded-2xl shadow-xl border floating-panel${!isDarkTheme ? "-light" : ""} text-center z-40 max-h-[80vh] overflow-hidden flex flex-col`}
      >
        <div className="flex flex-col items-center justify-center py-16 opacity-50 space-y-4">
          <Layers size={36} className="text-amber-500 animate-pulse" />
          <h4 className="font-display font-semibold uppercase tracking-wider text-xs">
            Inspector
          </h4>
          <p className="text-[11px] max-w-[200px]">
            Selecione um elemento no mapa ou nas camadas para ver suas ações e
            detalhes.
          </p>
        </div>
      </div>
    );
  }

  // Find the selected entity
  const region =
    selectedElement.type === "region"
      ? campaign.regions.find((r) => r.id === selectedElement.id)
      : null;
  const route =
    selectedElement.type === "route"
      ? campaign.routes.find((r) => r.id === selectedElement.id)
      : null;
  const poi =
    selectedElement.type === "poi"
      ? campaign.pois.find((p) => p.id === selectedElement.id)
      : null;

  const handleClose = () => {
    setSelectedElement({ type: null, id: null });
  };

  // REGION MUTATIONS
  const handleUpdateRegion = (updatedFields: Partial<Region>) => {
    if (!region) return;
    const updatedRegions = campaign.regions.map((r) => {
      if (r.id === region.id) {
        return { ...r, ...updatedFields };
      }
      return r;
    });
    updateCampaign({ ...campaign, regions: updatedRegions });
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!region || !newTagText.trim()) return;
    const cleanTag = newTagText.trim().toLowerCase();
    if (!region.tags.includes(cleanTag)) {
      handleUpdateRegion({ tags: [...region.tags, cleanTag] });
    }
    setNewTagText("");
  };

  const handleRemoveTag = (tag: string) => {
    if (!region) return;
    handleUpdateRegion({ tags: region.tags.filter((t) => t !== tag) });
  };

  const addRegionTextItem = (field: RegionCollectionField, text: string) => {
    if (!region || !text.trim()) return;
    const existing = region[field] || [];
    const next: RegionTextItem = {
      id: `${field}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text: text.trim(),
    };
    handleUpdateRegion({ [field]: [...existing, next] } as Partial<Region>);
  };

  const deleteRegionTextItem = (field: RegionCollectionField, id: string) => {
    if (!region) return;
    const existing = region[field] || [];
    handleUpdateRegion({
      [field]: existing.filter((item) => item.id !== id),
    } as Partial<Region>);
  };

  const addRegionReference = () => {
    if (!region || !newRegionReferenceLabel.trim()) return;
    const existing = region.regionReferences || [];
    const next: RegionReferenceItem = {
      id: `ref-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      label: newRegionReferenceLabel.trim(),
      url: newRegionReferenceUrl.trim(),
    };
    handleUpdateRegion({ regionReferences: [...existing, next] });
    setNewRegionReferenceLabel("");
    setNewRegionReferenceUrl("");
  };

  const deleteRegionReference = (id: string) => {
    if (!region) return;
    const existing = region.regionReferences || [];
    handleUpdateRegion({
      regionReferences: existing.filter((ref) => ref.id !== id),
    });
  };

  const handleDuplicateRegion = () => {
    if (!region) return;
    const duplicated: Region = {
      ...region,
      id: `reg-${Date.now()}`,
      name: `${region.name} (Cópia)`,
      // Offset points slightly
      points: region.points.map((p) => ({ x: p.x + 30, y: p.y + 30 })),
    };
    updateCampaign({
      ...campaign,
      regions: [...campaign.regions, duplicated],
    });
    setSelectedElement({ type: "region", id: duplicated.id });
  };

  const handleDeleteRegion = () => {
    if (!region) return;
    const filtered = campaign.regions.filter((r) => r.id !== region.id);
    updateCampaign({ ...campaign, regions: filtered });
    setSelectedElement({ type: null, id: null });
  };

  // ROUTE MUTATIONS
  const handleUpdateRoute = (updatedFields: Partial<Route>) => {
    if (!route) return;
    const updatedRoutes = campaign.routes.map((r) => {
      if (r.id === route.id) {
        return { ...r, ...updatedFields };
      }
      return r;
    });
    updateCampaign({ ...campaign, routes: updatedRoutes });
  };

  const handleDeleteRoute = () => {
    if (!route) return;
    const filtered = campaign.routes.filter((r) => r.id !== route.id);
    updateCampaign({ ...campaign, routes: filtered });
    setSelectedElement({ type: null, id: null });
  };

  // POI PIN MUTATIONS
  const handleUpdatePOI = (updatedFields: Partial<POI>) => {
    if (!poi) return;
    const updatedPOIs = campaign.pois.map((p) => {
      if (p.id === poi.id) {
        return { ...p, ...updatedFields };
      }
      return p;
    });

    // Also update any route points linked to this POI!
    let updatedRoutes = campaign.routes;
    if (updatedFields.x !== undefined || updatedFields.y !== undefined) {
      const newX = updatedFields.x !== undefined ? updatedFields.x : poi.x;
      const newY = updatedFields.y !== undefined ? updatedFields.y : poi.y;

      updatedRoutes = campaign.routes.map((r) => {
        let routePointsChanged = false;
        const newPoints = [...r.points];
        if (r.startPoiId === poi.id) {
          newPoints[0] = { x: newX, y: newY };
          routePointsChanged = true;
        }
        if (r.endPoiId === poi.id) {
          newPoints[newPoints.length - 1] = { x: newX, y: newY };
          routePointsChanged = true;
        }
        if (routePointsChanged) {
          return { ...r, points: newPoints };
        }
        return r;
      });
    }

    updateCampaign({ ...campaign, pois: updatedPOIs, routes: updatedRoutes });
  };

  const handleDeletePOI = () => {
    if (!poi) return;
    const filtered = campaign.pois.filter((p) => p.id !== poi.id);
    updateCampaign({ ...campaign, pois: filtered });
    setSelectedElement({ type: null, id: null });
  };

  const polygonArea = (points: { x: number; y: number }[]) => {
    if (points.length < 3) return 0;
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].x * points[j].y;
      area -= points[j].x * points[i].y;
    }
    return Math.abs(area / 2);
  };

  const routeDistance = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return 0;
    const kmPerPixel = Math.max(0.01, campaign.worldScale ?? 1);
    let total = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const dx = points[i + 1].x - points[i].x;
      const dy = points[i + 1].y - points[i].y;
      total += Math.sqrt(dx * dx + dy * dy);
    }
    return Math.round(total * kmPerPixel);
  };

  const panelSurface = isDarkTheme
    ? "bg-slate-900/55 border-white/10"
    : "bg-parchment-100/90 border-parchment-300";

  const panelMuted = isDarkTheme ? "text-slate-300" : "text-parchment-900";

  const regionComments = region?.regionComments || [];
  const regionMarkers = region?.regionMarkers || [];
  const regionNotes = region?.regionNotes || [];
  const regionReferences = region?.regionReferences || [];

  return (
    <div
      className={`w-80 p-4 rounded-2xl shadow-xl border floating-panel${!isDarkTheme ? "-light" : ""} text-xs flex flex-col max-h-[80vh] overflow-hidden no-scrollbar z-40`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
        <span className="font-display font-semibold uppercase tracking-wider opacity-60 text-[10px]">
          Inspector
        </span>
        <button
          onClick={handleClose}
          className="p-1 rounded hover:bg-white/5 opacity-60 hover:opacity-100 transition-all"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pr-1 space-y-3">
        {/* REGION INSPECTOR */}
        {region && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Compass size={14} />
              </span>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">Região</span>
                <span className="text-[9px] uppercase opacity-40">
                  Interactive Region Engine
                </span>
              </div>
            </div>

            <div
              className={`grid grid-cols-3 gap-2 p-2 rounded-xl border ${panelSurface}`}
            >
              <div className="text-center">
                <div className="text-[9px] opacity-60 uppercase">Pontos</div>
                <div className="font-mono text-amber-500 text-xs font-bold">
                  {region.points.length}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[9px] opacity-60 uppercase">Area</div>
                <div className="font-mono text-emerald-500 text-xs font-bold">
                  {Math.round(polygonArea(region.points))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[9px] opacity-60 uppercase">Tags</div>
                <div className="font-mono text-blue-400 text-xs font-bold">
                  {region.tags.length}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {/* Name */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider opacity-50 mb-1">
                  Nome da Região
                </label>
                <input
                  type="text"
                  value={region.name}
                  onChange={(e) => handleUpdateRegion({ name: e.target.value })}
                  className={`w-full text-xs p-2 rounded-lg focus:outline-none focus:border-amber-500 text-inherit transition-all ${
                    isDarkTheme
                      ? "bg-white/5 border-white/10"
                      : "bg-black/5 border-black/10"
                  }`}
                />
              </div>

              {/* Type */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider opacity-50 mb-1">
                    Tipo
                  </label>
                  <select
                    value={region.type}
                    onChange={(e) =>
                      handleUpdateRegion({ type: e.target.value as RegionType })
                    }
                    className="themed-select w-full text-xs p-2 rounded-lg focus:outline-none focus:border-amber-500 text-inherit transition-all"
                  >
                    <option value="Reino">Reino</option>
                    <option value="Floresta">Floresta</option>
                    <option value="Deserto">Deserto</option>
                    <option value="Montanha">Montanha</option>
                    <option value="Mar">Mares / Águas</option>
                    <option value="Pântano">Pântano</option>
                    <option value="Planície">Planície</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                {/* Biome */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider opacity-50 mb-1">
                    Bioma
                  </label>
                  <input
                    type="text"
                    value={region.biome}
                    onChange={(e) =>
                      handleUpdateRegion({ biome: e.target.value })
                    }
                    className={`w-full text-xs p-2 rounded-lg focus:outline-none focus:border-amber-500 text-inherit transition-all ${
                      isDarkTheme
                        ? "bg-white/5 border-white/10"
                        : "bg-black/5 border-black/10"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Climate */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider opacity-50 mb-1">
                    Clima
                  </label>
                  <select
                    value={region.climate}
                    onChange={(e) =>
                      handleUpdateRegion({ climate: e.target.value })
                    }
                    className="themed-select w-full text-xs p-2 rounded-lg focus:outline-none focus:border-amber-500 text-inherit transition-all"
                  >
                    <option value="Moderado">Moderado</option>
                    <option value="Úmido">Úmido</option>
                    <option value="Seco">Seco</option>
                    <option value="Frio">Frio</option>
                    <option value="Quente">Quente</option>
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider opacity-50 mb-1">
                    Cor
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={region.color}
                      onChange={(e) =>
                        handleUpdateRegion({ color: e.target.value })
                      }
                      className="w-8 h-8 rounded border-none bg-transparent cursor-pointer p-0"
                    />
                    <span className="font-mono text-[10px] opacity-70">
                      {region.color.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Opacity slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] uppercase tracking-wider opacity-50">
                    Opacidade Preenchimento
                  </label>
                  <span className="text-[10px] font-mono opacity-70">
                    {Math.round(region.opacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.6"
                  step="0.01"
                  value={region.opacity}
                  onChange={(e) =>
                    handleUpdateRegion({ opacity: parseFloat(e.target.value) })
                  }
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Tags badges */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider opacity-50 mb-1">
                  Tags Temáticas
                </label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {region.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px]"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-white transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <form onSubmit={handleAddTag} className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Nova tag..."
                    value={newTagText}
                    onChange={(e) => setNewTagText(e.target.value)}
                    className="w-full text-[11px] p-1.5 rounded-md bg-white/5 border border-white/10 focus:outline-none focus:border-amber-500 text-inherit"
                  />
                  <button
                    type="submit"
                    className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md border border-white/10"
                  >
                    <Plus size={12} />
                  </button>
                </form>
              </div>

              {/* Lore Description */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider opacity-50 mb-1">
                  Descrição de Lore (Jogadores)
                </label>
                <textarea
                  rows={3}
                  value={region.description}
                  onChange={(e) =>
                    handleUpdateRegion({ description: e.target.value })
                  }
                  className="w-full text-xs p-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-amber-500 text-inherit resize-none"
                />
              </div>

              {/* Accordion Panels (Region-Specific Data) */}
              <div className="border border-white/10 rounded-xl overflow-hidden divide-y divide-white/10">
                {/* Accordion Region Comments */}
                <div>
                  <button
                    onClick={() => setOpenRegionComments(!openRegionComments)}
                    className="w-full flex items-center justify-between p-2.5 hover:bg-white/5 transition-colors font-medium"
                  >
                    <span className="flex items-center gap-1.5">
                      <MessageSquare size={12} className="opacity-60" />
                      Comentários da Região ({regionComments.length})
                    </span>
                    {openRegionComments ? (
                      <ChevronUp size={12} />
                    ) : (
                      <ChevronDown size={12} />
                    )}
                  </button>
                  {openRegionComments && (
                    <div className="p-2.5 bg-black/10 space-y-1.5">
                      <div className="space-y-1 max-h-24 overflow-y-auto no-scrollbar pr-0.5">
                        {regionComments.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-2 text-[10px] p-1.5 rounded bg-white/5 border border-white/10"
                          >
                            <span className="truncate">{item.text}</span>
                            <button
                              onClick={() =>
                                deleteRegionTextItem("regionComments", item.id)
                              }
                              className="text-red-400 hover:text-red-300"
                            >
                              Excluir
                            </button>
                          </div>
                        ))}
                        {regionComments.length === 0 && (
                          <div className="text-[10px] opacity-55 p-2 rounded-lg bg-white/5 border border-white/10">
                            Nenhum comentário cadastrado.
                          </div>
                        )}
                      </div>
                      <form
                        className="flex gap-1"
                        onSubmit={(e) => {
                          e.preventDefault();
                          addRegionTextItem("regionComments", newRegionComment);
                          setNewRegionComment("");
                        }}
                      >
                        <input
                          type="text"
                          value={newRegionComment}
                          onChange={(e) => setNewRegionComment(e.target.value)}
                          placeholder="Adicionar comentário da região"
                          className="flex-1 text-[10px] p-1.5 rounded bg-white/5 border border-white/10 focus:outline-none focus:border-amber-500"
                        />
                        <button
                          type="submit"
                          className="px-2 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-400"
                        >
                          <Plus size={11} />
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                {/* Accordion Region Markers */}
                <div>
                  <button
                    onClick={() => setOpenRegionMarkers(!openRegionMarkers)}
                    className="w-full flex items-center justify-between p-2.5 hover:bg-white/5 transition-colors font-medium"
                  >
                    <span className="flex items-center gap-1.5">
                      <Compass size={12} className="opacity-60" />
                      Marcadores da Região ({regionMarkers.length})
                    </span>
                    {openRegionMarkers ? (
                      <ChevronUp size={12} />
                    ) : (
                      <ChevronDown size={12} />
                    )}
                  </button>
                  {openRegionMarkers && (
                    <div className="p-2.5 bg-black/10 space-y-1.5">
                      <div className="space-y-1 max-h-24 overflow-y-auto no-scrollbar pr-0.5">
                        {regionMarkers.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-2 text-[10px] p-1.5 rounded bg-white/5 border border-white/10"
                          >
                            <span className="truncate">{item.text}</span>
                            <button
                              onClick={() =>
                                deleteRegionTextItem("regionMarkers", item.id)
                              }
                              className="text-red-400 hover:text-red-300"
                            >
                              Excluir
                            </button>
                          </div>
                        ))}
                        {regionMarkers.length === 0 && (
                          <div className="text-[10px] opacity-55 p-2 rounded-lg bg-white/5 border border-white/10">
                            Nenhum marcador cadastrado.
                          </div>
                        )}
                      </div>
                      <form
                        className="flex gap-1"
                        onSubmit={(e) => {
                          e.preventDefault();
                          addRegionTextItem("regionMarkers", newRegionMarker);
                          setNewRegionMarker("");
                        }}
                      >
                        <input
                          type="text"
                          value={newRegionMarker}
                          onChange={(e) => setNewRegionMarker(e.target.value)}
                          placeholder="Adicionar marcador"
                          className="flex-1 text-[10px] p-1.5 rounded bg-white/5 border border-white/10 focus:outline-none focus:border-amber-500"
                        />
                        <button
                          type="submit"
                          className="px-2 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-400"
                        >
                          <Plus size={11} />
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                {/* Accordion Region Notes */}
                <div>
                  <button
                    onClick={() => setOpenRegionNotes(!openRegionNotes)}
                    className="w-full flex items-center justify-between p-2.5 hover:bg-white/5 transition-colors font-medium"
                  >
                    <span className="flex items-center gap-1.5">
                      <FileText size={12} className="opacity-60" />
                      Notas da Região ({regionNotes.length})
                    </span>
                    {openRegionNotes ? (
                      <ChevronUp size={12} />
                    ) : (
                      <ChevronDown size={12} />
                    )}
                  </button>
                  {openRegionNotes && (
                    <div className="p-2.5 bg-black/10 space-y-1.5">
                      <div className="space-y-1 max-h-24 overflow-y-auto no-scrollbar pr-0.5">
                        {regionNotes.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-2 text-[10px] p-1.5 rounded bg-white/5 border border-white/10"
                          >
                            <span className="truncate">{item.text}</span>
                            <button
                              onClick={() =>
                                deleteRegionTextItem("regionNotes", item.id)
                              }
                              className="text-red-400 hover:text-red-300"
                            >
                              Excluir
                            </button>
                          </div>
                        ))}
                        {regionNotes.length === 0 && (
                          <div className="text-[10px] opacity-55 p-2 rounded-lg bg-white/5 border border-white/10">
                            Nenhuma nota cadastrada.
                          </div>
                        )}
                      </div>
                      <form
                        className="flex gap-1"
                        onSubmit={(e) => {
                          e.preventDefault();
                          addRegionTextItem("regionNotes", newRegionNoteItem);
                          setNewRegionNoteItem("");
                        }}
                      >
                        <input
                          type="text"
                          value={newRegionNoteItem}
                          onChange={(e) => setNewRegionNoteItem(e.target.value)}
                          placeholder="Adicionar nota curta"
                          className="flex-1 text-[10px] p-1.5 rounded bg-white/5 border border-white/10 focus:outline-none focus:border-amber-500"
                        />
                        <button
                          type="submit"
                          className="px-2 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-400"
                        >
                          <Plus size={11} />
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                {/* Accordion Region References */}
                <div>
                  <button
                    onClick={() =>
                      setOpenRegionReferences(!openRegionReferences)
                    }
                    className="w-full flex items-center justify-between p-2.5 hover:bg-white/5 transition-colors font-medium"
                  >
                    <span className="flex items-center gap-1.5">
                      <MapPin size={12} className="opacity-60" />
                      Referências da Região ({regionReferences.length})
                    </span>
                    {openRegionReferences ? (
                      <ChevronUp size={12} />
                    ) : (
                      <ChevronDown size={12} />
                    )}
                  </button>
                  {openRegionReferences && (
                    <div className="p-2.5 bg-black/10 space-y-1.5">
                      <div className="space-y-1 max-h-24 overflow-y-auto no-scrollbar pr-0.5">
                        {regionReferences.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-2 text-[10px] p-1.5 rounded bg-white/5 border border-white/10"
                          >
                            <span className="truncate">
                              {item.url
                                ? `${item.label} - ${item.url}`
                                : item.label}
                            </span>
                            <button
                              onClick={() => deleteRegionReference(item.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              Excluir
                            </button>
                          </div>
                        ))}
                        {regionReferences.length === 0 && (
                          <div className="text-[10px] opacity-55 p-2 rounded-lg bg-white/5 border border-white/10">
                            Nenhuma referência cadastrada.
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <input
                          type="text"
                          value={newRegionReferenceLabel}
                          onChange={(e) =>
                            setNewRegionReferenceLabel(e.target.value)
                          }
                          placeholder="Título"
                          className="text-[10px] p-1.5 rounded bg-white/5 border border-white/10 focus:outline-none focus:border-amber-500"
                        />
                        <input
                          type="text"
                          value={newRegionReferenceUrl}
                          onChange={(e) =>
                            setNewRegionReferenceUrl(e.target.value)
                          }
                          placeholder="URL ou caminho"
                          className="text-[10px] p-1.5 rounded bg-white/5 border border-white/10 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <button
                        onClick={addRegionReference}
                        className="w-full p-1.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-semibold"
                      >
                        Adicionar Referência
                      </button>
                    </div>
                  )}
                </div>

                {/* Accordion Master Notes */}
                <div>
                  <button
                    onClick={() => setOpenMasterNotes(!openMasterNotes)}
                    className="w-full flex items-center justify-between p-2.5 hover:bg-white/5 transition-colors font-medium"
                  >
                    <span className="flex items-center gap-1.5">
                      <FileText size={12} className="opacity-60" /> Notas
                      Secretas (Mestre)
                    </span>
                    {openMasterNotes ? (
                      <ChevronUp size={12} />
                    ) : (
                      <ChevronDown size={12} />
                    )}
                  </button>
                  {openMasterNotes && (
                    <div className="p-2.5 bg-black/10">
                      <textarea
                        rows={3}
                        value={region.notes}
                        onChange={(e) =>
                          handleUpdateRegion({ notes: e.target.value })
                        }
                        className="w-full text-[11px] p-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-amber-500 text-inherit resize-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Foot Actions */}
              <div className="flex gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={handleDuplicateRegion}
                  className="w-1/2 p-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-inherit rounded-xl font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <Copy size={12} /> Duplicar
                </button>
                <button
                  onClick={handleDeleteRegion}
                  className="w-1/2 p-2 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 hover:border-red-500/40 text-red-400 rounded-xl font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <Trash2 size={12} /> Excluir
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ROUTE INSPECTOR */}
        {route && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                <Layers size={14} />
              </span>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">Rota de Viagem</span>
                <span className="text-[9px] uppercase opacity-40">
                  Caminho / Estrada
                </span>
              </div>
            </div>

            <div
              className={`grid grid-cols-3 gap-2 p-2 rounded-xl border ${panelSurface}`}
            >
              <div className="text-center">
                <div className="text-[9px] opacity-60 uppercase">Nos</div>
                <div className="font-mono text-purple-400 text-xs font-bold">
                  {route.points.length}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[9px] opacity-60 uppercase">Distancia</div>
                <div className="font-mono text-amber-500 text-xs font-bold">
                  {routeDistance(route.points)} km
                </div>
              </div>
              <div className="text-center">
                <div className="text-[9px] opacity-60 uppercase">Categoria</div>
                <div className={`text-[10px] font-semibold ${panelMuted}`}>
                  {route.category}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {/* Name */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider opacity-50 mb-1">
                  Nome da Estrada
                </label>
                <input
                  type="text"
                  value={route.name}
                  onChange={(e) => handleUpdateRoute({ name: e.target.value })}
                  className={`w-full text-xs p-2 rounded-lg focus:outline-none focus:border-amber-500 text-inherit transition-all ${
                    isDarkTheme
                      ? "bg-white/5 border-white/10"
                      : "bg-black/5 border-black/10"
                  }`}
                />
              </div>

              {/* Category */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider opacity-50 mb-1">
                    Categoria
                  </label>
                  <select
                    value={route.category}
                    onChange={(e) =>
                      handleUpdateRoute({
                        category: e.target.value as RouteCategory,
                      })
                    }
                    className="themed-select w-full text-xs p-2 rounded-lg focus:outline-none focus:border-amber-500 text-inherit transition-all"
                  >
                    <option value="Estrada">Estrada Imperial</option>
                    <option value="Trilha">Trilha Perigosa</option>
                    <option value="Túneis">Túneis / Cavernas</option>
                    <option value="Atalho">Atalho Secundário</option>
                    <option value="Marítimo">Rota Marítima</option>
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider opacity-50 mb-1">
                    Cor da Linha
                  </label>
                  <div className="flex items-center gap-1.5 pt-1">
                    <input
                      type="color"
                      value={route.color}
                      onChange={(e) =>
                        handleUpdateRoute({ color: e.target.value })
                      }
                      className="w-7 h-7 rounded border-none bg-transparent cursor-pointer p-0"
                    />
                    <span className="font-mono text-[10px] opacity-70">
                      {route.color.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mechanics metrics (Length, supplies consumed, obstacles count) */}
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                  <span className="block text-[9px] uppercase opacity-50 mb-0.5">
                    Extensão
                  </span>
                  <input
                    type="number"
                    value={route.length}
                    onChange={(e) =>
                      handleUpdateRoute({
                        length: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full text-center bg-transparent border-none text-xs font-semibold focus:outline-none text-amber-400"
                  />
                  <span className="block text-[9px] opacity-40 mt-0.5">km</span>
                </div>

                <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                  <span className="block text-[9px] uppercase opacity-50 mb-0.5">
                    Consumo
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={route.suppliesCost}
                    onChange={(e) =>
                      handleUpdateRoute({
                        suppliesCost: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full text-center bg-transparent border-none text-xs font-semibold focus:outline-none text-emerald-400"
                  />
                  <span className="block text-[9px] opacity-40 mt-0.5">
                    Suprim.
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                  <span className="block text-[9px] uppercase opacity-50 mb-0.5">
                    Obstáculos
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="15"
                    value={route.obstaclesCount}
                    onChange={(e) =>
                      handleUpdateRoute({
                        obstaclesCount: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full text-center bg-transparent border-none text-xs font-semibold focus:outline-none text-red-400"
                  />
                  <span className="block text-[9px] opacity-40 mt-0.5">
                    Desafios
                  </span>
                </div>
              </div>

              {/* Obstacles description */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider opacity-50 mb-1">
                  Obstáculos e Desafios (Consumo)
                </label>
                <textarea
                  rows={2}
                  value={route.obstaclesDescription}
                  onChange={(e) =>
                    handleUpdateRoute({ obstaclesDescription: e.target.value })
                  }
                  className="w-full text-[11px] p-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-amber-500 text-inherit resize-none"
                />
              </div>

              {/* Route notes */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider opacity-50 mb-1">
                  Anotações do Mestre
                </label>
                <textarea
                  rows={3}
                  value={route.notes}
                  onChange={(e) => handleUpdateRoute({ notes: e.target.value })}
                  className={`w-full text-[11px] p-2 rounded-lg focus:outline-none focus:border-amber-500 text-inherit resize-none transition-all ${
                    isDarkTheme
                      ? "bg-white/5 border-white/10"
                      : "bg-black/5 border-black/10"
                  }`}
                />
              </div>

              {/* Link to Pins */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider opacity-50 mb-1">
                    Pin Inicial
                  </label>
                  <select
                    value={route.startPoiId || ""}
                    onChange={(e) => {
                      const poiId = e.target.value;
                      const poi = campaign.pois.find((p) => p.id === poiId);
                      if (poi) {
                        const newPoints = [...route.points];
                        newPoints[0] = { x: poi.x, y: poi.y };
                        handleUpdateRoute({
                          startPoiId: poiId,
                          points: newPoints,
                        });
                      } else {
                        handleUpdateRoute({ startPoiId: undefined });
                      }
                    }}
                    className="themed-select w-full text-[10px] p-2 rounded-lg focus:outline-none focus:border-amber-500 text-inherit transition-all"
                  >
                    <option value="">Sem Vínculo</option>
                    {campaign.pois.map((p) => (
                      <option
                        key={p.id}
                        value={p.id}
                        className={
                          isDarkTheme
                            ? "bg-slate-950 text-white"
                            : "bg-white text-slate-900"
                        }
                      >
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider opacity-50 mb-1">
                    Pin Final
                  </label>
                  <select
                    value={route.endPoiId || ""}
                    onChange={(e) => {
                      const poiId = e.target.value;
                      const poi = campaign.pois.find((p) => p.id === poiId);
                      if (poi) {
                        const newPoints = [...route.points];
                        newPoints[newPoints.length - 1] = {
                          x: poi.x,
                          y: poi.y,
                        };
                        handleUpdateRoute({
                          endPoiId: poiId,
                          points: newPoints,
                        });
                      } else {
                        handleUpdateRoute({ endPoiId: undefined });
                      }
                    }}
                    className="themed-select w-full text-[10px] p-2 rounded-lg focus:outline-none focus:border-amber-500 text-inherit transition-all"
                  >
                    <option value="">Sem Vínculo</option>
                    {campaign.pois.map((p) => (
                      <option
                        key={p.id}
                        value={p.id}
                        className={
                          isDarkTheme
                            ? "bg-slate-950 text-white"
                            : "bg-white text-slate-900"
                        }
                      >
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Delete Route */}
              <button
                onClick={handleDeleteRoute}
                className="w-full p-2 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 hover:border-red-500/40 text-red-400 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors pt-2.5"
              >
                <Trash2 size={12} /> Excluir Rota
              </button>
            </div>
          </div>
        )}

        {/* POI PIN INSPECTOR */}
        {poi && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                <MapPin size={14} />
              </span>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">
                  Ponto de Interesse
                </span>
                <span className="text-[9px] uppercase opacity-40">
                  Marcador Pin no Mapa
                </span>
              </div>
            </div>

            <div
              className={`grid grid-cols-3 gap-2 p-2 rounded-xl border ${panelSurface}`}
            >
              <div className="text-center">
                <div className="text-[9px] opacity-60 uppercase">Tipo</div>
                <div className={`text-[10px] font-semibold ${panelMuted}`}>
                  {poi.type}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[9px] opacity-60 uppercase">X</div>
                <div className="font-mono text-blue-400 text-xs font-bold">
                  {poi.x}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[9px] opacity-60 uppercase">Y</div>
                <div className="font-mono text-blue-400 text-xs font-bold">
                  {poi.y}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {/* Name */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider opacity-50 mb-1">
                  Nome do Local
                </label>
                <input
                  type="text"
                  value={poi.name}
                  onChange={(e) => handleUpdatePOI({ name: e.target.value })}
                  className={`w-full text-xs p-2 rounded-lg focus:outline-none focus:border-amber-500 text-inherit transition-all ${
                    isDarkTheme
                      ? "bg-white/5 border-white/10"
                      : "bg-black/5 border-black/10"
                  }`}
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider opacity-50 mb-1">
                  Tipo de Local
                </label>
                <select
                  value={poi.type}
                  onChange={(e) =>
                    handleUpdatePOI({ type: e.target.value as POIType })
                  }
                  className="themed-select w-full text-xs p-2 rounded-lg focus:outline-none focus:border-amber-500 text-inherit transition-all"
                >
                  <option value="Pin">Pin Geral</option>
                  <option value="Cidade">Cidade</option>
                  <option value="Vila">Vila / Vilarejo</option>
                  <option value="Castelo">Castelo / Fortaleza</option>
                  <option value="Porto">Porto Marítimo</option>
                  <option value="Templo">Templo</option>
                  <option value="Ruína">Ruína Antiga</option>
                  <option value="Acampamento">Acampamento</option>
                  <option value="Marco">Marco Geográfico</option>
                </select>
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-2 text-center text-mono">
                <div className="p-1.5 bg-white/5 border border-white/5 rounded-lg">
                  <span className="block text-[9px] uppercase opacity-50">
                    Coordenada X
                  </span>
                  <span className="font-semibold text-amber-400">{poi.x}</span>
                </div>
                <div className="p-1.5 bg-white/5 border border-white/5 rounded-lg">
                  <span className="block text-[9px] uppercase opacity-50">
                    Coordenada Y
                  </span>
                  <span className="font-semibold text-amber-400">{poi.y}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider opacity-50 mb-1">
                  História / Detalhes do Local
                </label>
                <textarea
                  rows={4}
                  value={poi.description}
                  onChange={(e) =>
                    handleUpdatePOI({ description: e.target.value })
                  }
                  className={`w-full text-xs p-2 rounded-lg focus:outline-none focus:border-amber-500 text-inherit resize-none transition-all ${
                    isDarkTheme
                      ? "bg-white/5 border-white/10"
                      : "bg-black/5 border-black/10"
                  }`}
                />
              </div>

              {/* Delete Pin */}
              <button
                onClick={handleDeletePOI}
                className="w-full p-2 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 hover:border-red-500/40 text-red-400 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors pt-2.5"
              >
                <Trash2 size={12} /> Excluir Pin
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
