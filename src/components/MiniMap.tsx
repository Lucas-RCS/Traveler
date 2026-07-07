import { Map } from "lucide-react";
import { Campaign, Point } from "../types";

interface MiniMapProps {
  campaign: Campaign;
  cursorPos: Point | null;
  zoom: number;
  isDarkTheme: boolean;
  onUpdateScale?: (scale: number) => void;
}

export default function MiniMap({
  campaign,
  cursorPos,
  zoom,
  isDarkTheme,
  onUpdateScale,
}: MiniMapProps) {
  // Round coordinates for cleaner displays
  const xCoord = cursorPos ? Math.round(cursorPos.x) : 0;
  const yCoord = cursorPos ? Math.round(cursorPos.y) : 0;

  // Convert map coordinates to approximate miles or kilometers for scale
  // Using user calibrated scale (km per pixel) defaulting to 0.5
  const pixelScaleKm =
    campaign?.worldScale !== undefined ? campaign.worldScale : 0.5;
  const currentScaleBarLength = 100; // 100px bar
  const scaleInKm = Math.round((currentScaleBarLength / zoom) * pixelScaleKm);

  return (
    <div
      className={`w-52 p-3 rounded-2xl shadow-xl border floating-panel${!isDarkTheme ? "-light" : ""} text-[11px] z-30 space-y-2.5`}
    >
      {/* Thumbnail map header */}
      <div className="flex items-center justify-between opacity-60">
        <span className="font-semibold uppercase tracking-wider text-[9px] flex items-center gap-1">
          <Map size={11} /> Coordenadas e Escala
        </span>
        <span className="font-mono text-[9px] bg-white/5 px-1 py-0.2 rounded">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      {/* Coordinate HUD */}
      <div className="flex justify-between items-center p-2 rounded-xl bg-black/15 border border-white/5 font-mono">
        <div className="flex items-center gap-2">
          <span className="opacity-40">LAT:</span>
          <span className="font-semibold text-amber-400">{yCoord}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="opacity-40">LON:</span>
          <span className="font-semibold text-amber-400">{xCoord}</span>
        </div>
      </div>

      {/* Scale Indicator */}
      <div className="space-y-1.5 pt-0.5 border-t border-white/5">
        <div className="flex justify-between items-center text-[9px] opacity-65">
          <span>Escala: {pixelScaleKm.toFixed(1)} km/px</span>
          <span className="font-semibold text-amber-500 font-mono">
            ~{scaleInKm} km
          </span>
        </div>

        {onUpdateScale && (
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0.1"
              max="2.5"
              step="0.1"
              value={pixelScaleKm}
              onChange={(e) => onUpdateScale(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400"
              title="Calibrar escala geográfica do mapa"
            />
          </div>
        )}
      </div>
    </div>
  );
}
