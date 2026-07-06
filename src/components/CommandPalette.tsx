import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Map,
  MapPin,
  Globe,
  Eye,
  Command,
  ArrowRight,
  CornerDownLeft,
} from "lucide-react";
import { Campaign, Point } from "../types";

interface CommandPaletteProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  campaign: Campaign;
  setSelectedElement: (elem: {
    type: "region" | "route" | "poi" | "comment" | null;
    id: string | null;
  }) => void;
  setPan: (p: Point) => void;
  setZoom: (z: number) => void;
  layerVisibility: Record<string, boolean>;
  setLayerVisibility: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  isDarkTheme: boolean;
}

export default function CommandPalette({
  isOpen,
  setIsOpen,
  campaign,
  setSelectedElement,
  setPan,
  setZoom,
  layerVisibility,
  setLayerVisibility,
  isDarkTheme,
}: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const focusTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsOpen]);

  useEffect(() => {
    if (isOpen) {
      if (focusTimerRef.current !== null) {
        window.clearTimeout(focusTimerRef.current);
      }
      focusTimerRef.current = window.setTimeout(
        () => inputRef.current?.focus(),
        100,
      );
      setSearch("");
      setSelectedIndex(0);
    }

    return () => {
      if (focusTimerRef.current !== null) {
        window.clearTimeout(focusTimerRef.current);
      }
    };
  }, [isOpen]);

  const items = useMemo(() => {
    const aggregated: {
      id: string;
      name: string;
      category: string;
      type: "region" | "route" | "poi" | "command";
      action: () => void;
    }[] = [];

    campaign.regions.forEach((r) => {
      aggregated.push({
        id: r.id,
        name: r.name,
        category: `Região • ${r.type}`,
        type: "region",
        action: () => {
          const xs = r.points.map((p) => p.x);
          const ys = r.points.map((p) => p.y);
          const minX = Math.min(...xs);
          const maxX = Math.max(...xs);
          const minY = Math.min(...ys);
          const maxY = Math.max(...ys);
          const centerX = (minX + maxX) / 2;
          const centerY = (minY + maxY) / 2;

          setPan({
            x: -(centerX - campaign.mapWidth / 2),
            y: -(centerY - campaign.mapHeight / 2),
          });
          setZoom(1.2);
          setSelectedElement({ type: "region", id: r.id });
        },
      });
    });

    campaign.pois.forEach((p) => {
      aggregated.push({
        id: p.id,
        name: p.name,
        category: `Ponto de Interesse • ${p.type}`,
        type: "poi",
        action: () => {
          setPan({
            x: -(p.x - campaign.mapWidth / 2),
            y: -(p.y - campaign.mapHeight / 2),
          });
          setZoom(1.5);
          setSelectedElement({ type: "poi", id: p.id });
        },
      });
    });

    campaign.routes.forEach((route) => {
      aggregated.push({
        id: route.id,
        name: route.name,
        category: `Rota de Viagem • ${route.category}`,
        type: "route",
        action: () => {
          const pStart = route.points[0];
          setPan({
            x: -(pStart.x - campaign.mapWidth / 2),
            y: -(pStart.y - campaign.mapHeight / 2),
          });
          setZoom(1.2);
          setSelectedElement({ type: "route", id: route.id });
        },
      });
    });

    aggregated.push({
      id: "cmd-layer-regioes",
      name: "Alternar Camada: Regiões",
      category: "Ação Rápida",
      type: "command",
      action: () =>
        setLayerVisibility((prev) => ({ ...prev, regioes: !prev.regioes })),
    });
    aggregated.push({
      id: "cmd-layer-rotas",
      name: "Alternar Camada: Rotas",
      category: "Ação Rápida",
      type: "command",
      action: () =>
        setLayerVisibility((prev) => ({ ...prev, rotas: !prev.rotas })),
    });
    aggregated.push({
      id: "cmd-layer-pins",
      name: "Alternar Camada: Pontos de Interesse",
      category: "Ação Rápida",
      type: "command",
      action: () =>
        setLayerVisibility((prev) => ({ ...prev, pins: !prev.pins })),
    });
    aggregated.push({
      id: "cmd-reset-view",
      name: "Redefinir Câmera e Centralizar Mapa",
      category: "Ação Rápida",
      type: "command",
      action: () => {
        setPan({ x: 0, y: 0 });
        setZoom(0.85);
      },
    });

    return aggregated;
  }, [campaign, setLayerVisibility, setPan, setSelectedElement, setZoom]);

  // Filter items
  const filtered = items
    .filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase()),
    )
    .slice(0, 8);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filtered.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        (prev) => (prev - 1 + filtered.length) % filtered.length,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        setIsOpen(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-md">
          {/* Backdrop closer */}
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className={`w-[540px] rounded-2xl border shadow-2xl overflow-hidden z-10 floating-panel${!isDarkTheme ? "-light" : ""}`}
            onKeyDown={handleKeyDown}
          >
            {/* Search Input bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <Search className="opacity-50" size={18} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Buscar regiões, rotas, vilas ou comandos..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full bg-transparent border-none text-xs focus:outline-none focus:ring-0 text-inherit"
              />
              <div className="flex items-center gap-1 opacity-40 text-[10px] bg-white/10 px-2 py-0.5 rounded border border-white/5 font-mono">
                <Command size={10} />
                <span>ESC</span>
              </div>
            </div>

            {/* Results */}
            <div className="p-2 max-h-[320px] overflow-y-auto">
              {filtered.length > 0 ? (
                filtered.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-amber-500 text-slate-950 font-medium"
                          : "hover:bg-white/5 text-inherit"
                      }`}
                      onClick={() => {
                        item.action();
                        setIsOpen(false);
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                    >
                      <div className="flex items-center gap-3">
                        {item.type === "region" ? (
                          <Globe size={15} className="opacity-70" />
                        ) : item.type === "poi" ? (
                          <MapPin size={15} className="opacity-70" />
                        ) : item.type === "route" ? (
                          <Map size={15} className="opacity-70" />
                        ) : (
                          <Eye size={15} className="opacity-70" />
                        )}

                        <div className="flex flex-col">
                          <span className="text-xs">{item.name}</span>
                          <span
                            className={`text-[9px] uppercase tracking-wider ${isSelected ? "text-slate-800" : "opacity-40"}`}
                          >
                            {item.category}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="flex items-center gap-1 opacity-60 text-[9px] font-mono">
                          <span>Ir para</span>
                          <CornerDownLeft size={10} />
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-xs opacity-50 font-sans">
                  Nenhum resultado encontrado para "{search}"
                </div>
              )}
            </div>

            {/* Footer with hint */}
            <div className="px-4 py-2 bg-black/10 border-t border-white/5 flex items-center justify-between text-[10px] opacity-40">
              <span className="flex items-center gap-1">
                <ArrowRight size={10} /> Use as setas ↑ ↓ para navegar e Enter
                para selecionar
              </span>
              <span>RPG Travel Maps</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
