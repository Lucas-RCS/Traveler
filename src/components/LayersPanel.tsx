import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Layers,
  Plus,
  X,
  ChevronUp,
  ChevronDown,
  GripVertical,
  RotateCcw,
} from "lucide-react";

interface LayersPanelProps {
  layerVisibility: Record<string, boolean>;
  setLayerVisibility: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  layerLocks: Record<string, boolean>;
  setLayerLocks: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  isDarkTheme: boolean;
  counts: {
    regions: number;
    routes: number;
    pois: number;
    comments: number;
  };
  customLayers?: { id: string; name: string; color: string }[];
  onAddCustomLayer?: (id: string, name: string, color: string) => void;
  onDeleteCustomLayer?: (id: string) => void;
  onRenameCustomLayer?: (id: string, newName: string) => void;
  layerOrder: string[];
  setLayerOrder: (order: string[]) => void;
}

export default function LayersPanel({
  layerVisibility,
  setLayerVisibility,
  layerLocks,
  setLayerLocks,
  isDarkTheme,
  counts,
  customLayers = [],
  onAddCustomLayer,
  onDeleteCustomLayer,
  onRenameCustomLayer,
  layerOrder,
  setLayerOrder,
}: LayersPanelProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newLayerName, setNewLayerName] = useState("");
  const [newLayerColor, setNewLayerColor] = useState("bg-indigo-500");

  // Custom layer renaming states
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [editingLayerName, setEditingLayerName] = useState("");

  // Drag and Drop State
  const [draggedLayerId, setDraggedLayerId] = useState<string | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const baseLayerOrder = [
    "comentarios",
    "pins",
    "travessias",
    "rotas",
    "regioes",
    "grade",
  ];

  const availableColors = [
    { name: "Índigo", class: "bg-indigo-500" },
    { name: "Esmeralda", class: "bg-emerald-500" },
    { name: "Azul", class: "bg-blue-500" },
    { name: "Roxo", class: "bg-purple-500" },
    { name: "Rosa", class: "bg-rose-500" },
    { name: "Laranja", class: "bg-amber-500" },
  ];

  const getLayerInfo = (id: string) => {
    // Check custom layers first
    const custom = customLayers.find((cl) => cl.id === id);
    if (custom) {
      return {
        id: custom.id,
        name: custom.name,
        color: custom.color,
        count: 0,
        isCustom: true,
      };
    }

    // Base layer properties
    const baseLayers: Record<
      string,
      {
        id: string;
        name: string;
        color: string;
        count: number;
        isCustom?: boolean;
      }
    > = {
      regioes: {
        id: "regioes",
        name: "Regiões",
        color: "bg-emerald-500",
        count: counts.regions,
      },
      rotas: {
        id: "rotas",
        name: "Rotas",
        color: "bg-purple-500",
        count: counts.routes,
      },
      pins: {
        id: "pins",
        name: "Pontos de Interesse",
        color: "bg-blue-500",
        count: counts.pois,
      },
      comentarios: {
        id: "comentarios",
        name: "Comentários",
        color: "bg-amber-500",
        count: counts.comments,
      },
      travessias: {
        id: "travessias",
        name: "Travessias (Ativas)",
        color: "bg-teal-500",
        count: counts.routes > 0 ? 1 : 0,
      },
      grade: {
        id: "grade",
        name: "Grade de Coordenadas",
        color: "bg-slate-400",
        count: 0,
      },
    };

    return (
      baseLayers[id] || {
        id,
        name: id,
        color: "bg-slate-500",
        count: 0,
        isCustom: false,
      }
    );
  };

  const toggleVisibility = (id: string) => {
    setLayerVisibility((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleLock = (id: string) => {
    setLayerLocks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...layerOrder];
    const temp = newOrder[index];
    newOrder[index] = newOrder[index - 1];
    newOrder[index - 1] = temp;
    setLayerOrder(newOrder);
  };

  const moveDown = (index: number) => {
    if (index === layerOrder.length - 1) return;
    const newOrder = [...layerOrder];
    const temp = newOrder[index];
    newOrder[index] = newOrder[index + 1];
    newOrder[index + 1] = temp;
    setLayerOrder(newOrder);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLayerName.trim()) return;
    const newId = "custom-" + Date.now();
    if (onAddCustomLayer) {
      onAddCustomLayer(newId, newLayerName.trim(), newLayerColor);
    }
    setNewLayerName("");
    setIsAdding(false);
  };

  const handleRenameSave = (id: string) => {
    if (editingLayerName.trim() && onRenameCustomLayer) {
      onRenameCustomLayer(id, editingLayerName.trim());
    }
    setEditingLayerId(null);
  };

  // Drag & Drop Handler Functions
  const handleDragStart = (e: React.DragEvent, layerId: string) => {
    setDraggedLayerId(layerId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", layerId);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedLayerId === null) return;
    setDragOverIdx(index);
  };

  const handleDragEnd = () => {
    setDraggedLayerId(null);
    setDragOverIdx(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceLayerId =
      e.dataTransfer.getData("text/plain") || draggedLayerId;
    if (!sourceLayerId) return;
    const sourceIndex = layerOrder.indexOf(sourceLayerId);
    if (sourceIndex === -1 || sourceIndex === targetIndex) return;

    const newOrder = [...layerOrder];
    const draggedItem = newOrder[sourceIndex];
    newOrder.splice(sourceIndex, 1);
    newOrder.splice(targetIndex, 0, draggedItem);

    setLayerOrder(newOrder);
    setDraggedLayerId(null);
    setDragOverIdx(null);
  };

  // Preset Controls
  const showAllLayers = () => {
    const updated: Record<string, boolean> = {};
    layerOrder.forEach((id) => {
      updated[id] = true;
    });
    setLayerVisibility((prev) => ({ ...prev, ...updated }));
  };

  const hideAllLayers = () => {
    const updated: Record<string, boolean> = {};
    layerOrder.forEach((id) => {
      updated[id] = false;
    });
    setLayerVisibility((prev) => ({ ...prev, ...updated }));
  };

  const lockAllLayers = () => {
    const updated: Record<string, boolean> = {};
    layerOrder.forEach((id) => {
      updated[id] = true;
    });
    setLayerLocks((prev) => ({ ...prev, ...updated }));
  };

  const unlockAllLayers = () => {
    const updated: Record<string, boolean> = {};
    layerOrder.forEach((id) => {
      updated[id] = false;
    });
    setLayerLocks((prev) => ({ ...prev, ...updated }));
  };

  const soloLayer = (id: string) => {
    const updated: Record<string, boolean> = {};
    layerOrder.forEach((layerId) => {
      updated[layerId] = layerId === id;
    });
    setLayerVisibility((prev) => ({ ...prev, ...updated }));
  };

  const resetLayerOrder = () => {
    const customIds = layerOrder.filter((id) => id.startsWith("custom-"));
    setLayerOrder([...customIds, ...baseLayerOrder]);
  };

  return (
    <div
      className={`w-72 p-4 rounded-2xl shadow-xl border floating-panel${!isDarkTheme ? "-light" : ""} text-xs z-40 max-h-[80vh] overflow-hidden flex flex-col`}
    >
      {/* Title Header */}
      <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Layers
            size={14}
            className="opacity-70 text-amber-500 animate-pulse"
          />
          <span className="font-display font-bold uppercase tracking-wider">
            Gestor de Camadas
          </span>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`p-1.5 rounded-lg hover:bg-white/5 opacity-70 hover:opacity-100 transition-all cursor-pointer ${isAdding ? "text-amber-500 opacity-100 bg-white/5" : ""}`}
          title="Nova Camada Personalizada"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Preset Action Buttons Toolbar (icon-only) */}
      <div className="grid grid-cols-5 gap-1 mb-3.5 bg-black/10 dark:bg-black/20 p-1.5 rounded-xl border border-white/5">
        <button
          type="button"
          onClick={showAllLayers}
          className="h-7 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-all border border-emerald-500/10 cursor-pointer flex items-center justify-center"
          title="Exibir todas as camadas"
        >
          <Eye size={12} />
        </button>
        <button
          type="button"
          onClick={hideAllLayers}
          className="h-7 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all border border-red-500/10 cursor-pointer flex items-center justify-center"
          title="Ocultar todas as camadas"
        >
          <EyeOff size={12} />
        </button>
        <button
          type="button"
          onClick={lockAllLayers}
          className="h-7 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-all border border-amber-500/10 cursor-pointer flex items-center justify-center"
          title="Bloquear todas as camadas"
        >
          <Lock size={12} />
        </button>
        <button
          type="button"
          onClick={unlockAllLayers}
          className="h-7 rounded bg-slate-500/10 hover:bg-slate-500/20 text-slate-300 transition-all border border-slate-500/10 cursor-pointer flex items-center justify-center"
          title="Desbloquear todas as camadas"
        >
          <Unlock size={12} />
        </button>
        <button
          type="button"
          onClick={resetLayerOrder}
          className="h-7 rounded bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 transition-all border border-sky-500/10 cursor-pointer flex items-center justify-center"
          title="Resetar ordem de renderização"
        >
          <RotateCcw size={12} />
        </button>
      </div>

      {/* Add Custom Layer Form */}
      {isAdding && (
        <form
          onSubmit={handleAddSubmit}
          className="mb-3.5 p-3 rounded-xl border border-dashed border-white/10 bg-white/5 space-y-2.5"
        >
          <div>
            <label className="block text-[9px] uppercase opacity-50 mb-1">
              Nome da Camada
            </label>
            <input
              type="text"
              placeholder="Ex: Monstros, Ruínas..."
              value={newLayerName}
              onChange={(e) => setNewLayerName(e.target.value)}
              className="w-full text-xs p-1.5 rounded-lg bg-black/20 border border-white/10 text-inherit focus:outline-none focus:border-amber-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[9px] uppercase opacity-50 mb-1">
              Cor do Marcador
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableColors.map((color) => (
                <button
                  type="button"
                  key={color.class}
                  onClick={() => setNewLayerColor(color.class)}
                  className={`w-4 h-4 rounded-full ${color.class} border-2 transition-all ${
                    newLayerColor === color.class
                      ? "border-white scale-125"
                      : "border-transparent opacity-65 hover:opacity-100"
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-1.5 pt-1 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-2.5 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!newLayerName.trim()}
              className="px-2.5 py-1 text-[10px] bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg disabled:opacity-50 flex items-center gap-0.5 cursor-pointer"
            >
              Criar
            </button>
          </div>
        </form>
      )}

      {/* Dynamic Ordered Layers List - SELF CONTAINED OVERFLOW CONTAINER */}
      <div className="space-y-1.5 overflow-y-auto pr-1 no-scrollbar scrollbar-thin flex-1 min-h-0">
        {layerOrder.map((layerId, idx) => {
          const layer = getLayerInfo(layerId);
          const isVisible = layerVisibility[layer.id] !== false;
          const isLocked = layerLocks[layer.id] === true;

          return (
            <div
              key={layer.id}
              draggable
              onDragStart={(e) => handleDragStart(e, layer.id)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnd={handleDragEnd}
              onDrop={(e) => handleDrop(e, idx)}
              className={`flex flex-col p-1.5 rounded-xl transition-all border cursor-grab active:cursor-grabbing ${
                draggedLayerId === layer.id
                  ? "opacity-30 border-dashed border-amber-500/50 bg-amber-500/5"
                  : dragOverIdx === idx
                    ? "border-t-2 border-t-amber-500 bg-amber-500/10"
                    : !isVisible
                      ? "bg-black/10 opacity-60 border-transparent hover:border-white/5"
                      : "bg-white/5 border-transparent hover:border-white/5"
              }`}
            >
              <div className="flex items-center justify-between">
                {/* Repositioning and Color Dot */}
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="opacity-45 shrink-0"
                    title="Arraste para reposicionar"
                  >
                    <GripVertical size={12} />
                  </span>
                  {/* Order control arrows (kept as accessory controls) */}
                  <div className="flex flex-col gap-0.5 mr-0.5 shrink-0 pointer-events-auto">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        moveUp(idx);
                      }}
                      className="p-0.5 rounded hover:bg-white/10 disabled:opacity-20 text-inherit transition-colors cursor-pointer"
                      title="Mover para Frente (Z-Index Maior)"
                    >
                      <ChevronUp size={10} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === layerOrder.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        moveDown(idx);
                      }}
                      className="p-0.5 rounded hover:bg-white/10 disabled:opacity-20 text-inherit transition-colors cursor-pointer"
                      title="Mover para Trás (Z-Index Menor)"
                    >
                      <ChevronDown size={10} />
                    </button>
                  </div>

                  <span
                    className={`w-2 h-2 rounded-full ${layer.color} shadow-sm shrink-0`}
                  />

                  {/* Title / Renaming input */}
                  {editingLayerId === layer.id ? (
                    <input
                      type="text"
                      value={editingLayerName}
                      onChange={(e) => setEditingLayerName(e.target.value)}
                      onBlur={() => handleRenameSave(layer.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRenameSave(layer.id);
                        if (e.key === "Escape") setEditingLayerId(null);
                      }}
                      className="text-xs px-1.5 py-0.5 rounded bg-black/30 border border-amber-500/50 w-24 focus:outline-none focus:border-amber-500 text-inherit"
                      autoFocus
                    />
                  ) : (
                    <span
                      className="font-semibold truncate max-w-[100px] cursor-pointer"
                      title={
                        layer.isCustom
                          ? `${layer.name} (Duplo-clique para renomear)`
                          : layer.name
                      }
                      onDoubleClick={() => {
                        if (layer.isCustom) {
                          setEditingLayerId(layer.id);
                          setEditingLayerName(layer.name);
                        }
                      }}
                    >
                      {layer.name}
                    </span>
                  )}

                  {/* Delete Custom Layer X */}
                  {layer.isCustom && onDeleteCustomLayer && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          confirm(
                            `Excluir a camada personalizada "${layer.name}"?`,
                          )
                        ) {
                          onDeleteCustomLayer(layer.id);
                        }
                      }}
                      className="p-0.5 rounded text-red-500 hover:bg-red-500/10 cursor-pointer ml-1 shrink-0"
                      title="Excluir Camada Personalizada"
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>

                {/* Layer Control Buttons */}
                <div className="flex items-center gap-1.5 shrink-0 pointer-events-auto">
                  {/* Count badge */}
                  {layer.count > 0 && (
                    <span className="px-1 py-0.2 rounded font-mono text-[8px] bg-black/30 opacity-70">
                      {layer.count}
                    </span>
                  )}

                  {/* Solo visibility mode */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soloLayer(layer.id);
                    }}
                    className="p-1 rounded transition-colors cursor-pointer text-inherit opacity-60 hover:opacity-100"
                    title="Mostrar apenas esta camada"
                  >
                    <Layers size={11} />
                  </button>

                  {/* Eye visibility toggle */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVisibility(layer.id);
                    }}
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      isVisible
                        ? "text-inherit opacity-60 hover:opacity-100"
                        : "text-red-500 bg-red-500/10"
                    }`}
                    title={isVisible ? "Ocultar Camada" : "Exibir Camada"}
                  >
                    {isVisible ? <Eye size={11} /> : <EyeOff size={11} />}
                  </button>

                  {/* Lock click toggle */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLock(layer.id);
                    }}
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      isLocked
                        ? "text-amber-500 bg-amber-500/10"
                        : "text-inherit opacity-30 hover:opacity-80"
                    }`}
                    title={isLocked ? "Desbloquear Camada" : "Bloquear Camada"}
                  >
                    {isLocked ? <Lock size={11} /> : <Unlock size={11} />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
