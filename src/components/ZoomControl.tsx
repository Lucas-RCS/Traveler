import { ZoomIn, ZoomOut, Maximize, Lock, Unlock } from "lucide-react";

interface ZoomControlProps {
  zoom: number;
  setZoom: (z: number) => void;
  setPan: (p: { x: number; y: number }) => void;
  cameraLocked: boolean;
  setCameraLocked: (locked: boolean) => void;
  isDarkTheme: boolean;
}

export default function ZoomControl({
  zoom,
  setZoom,
  setPan,
  cameraLocked,
  setCameraLocked,
  isDarkTheme,
}: ZoomControlProps) {
  const handleZoomIn = () => {
    if (cameraLocked) return;
    setZoom(Math.min(3.5, zoom + 0.15));
  };

  const handleZoomOut = () => {
    if (cameraLocked) return;
    setZoom(Math.max(0.4, zoom - 0.15));
  };

  const handleReset = () => {
    if (cameraLocked) return;
    setZoom(0.85);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div
      className={`p-1.5 rounded-2xl shadow-xl border floating-panel${!isDarkTheme ? "-light" : ""} flex items-center gap-1 text-xs select-none z-30`}
    >
      {/* Zoom Out Button */}
      <button
        onClick={handleZoomOut}
        disabled={cameraLocked || zoom <= 0.4}
        className="p-2 rounded-xl hover:bg-white/5 active:scale-95 disabled:opacity-40 transition-all text-inherit"
        title="Afastar Câmera"
      >
        <ZoomOut size={13} />
      </button>

      {/* Percentage Readout */}
      <span className="w-12 text-center font-mono font-semibold text-[10px] opacity-75">
        {Math.round(zoom * 100)}%
      </span>

      {/* Zoom In Button */}
      <button
        onClick={handleZoomIn}
        disabled={cameraLocked || zoom >= 3.5}
        className="p-2 rounded-xl hover:bg-white/5 active:scale-95 disabled:opacity-40 transition-all text-inherit"
        title="Aproximar Câmera"
      >
        <ZoomIn size={13} />
      </button>

      <div className="w-[1px] h-4 bg-white/10 mx-1" />

      {/* Fit to Frame/Reset View */}
      <button
        onClick={handleReset}
        disabled={cameraLocked}
        className="p-2 rounded-xl hover:bg-white/5 active:scale-95 disabled:opacity-40 transition-all text-inherit"
        title="Centralizar Câmera e Redefinir"
      >
        <Maximize size={13} />
      </button>

      {/* Lock camera */}
      <button
        onClick={() => setCameraLocked(!cameraLocked)}
        className={`p-2 rounded-xl transition-all active:scale-95 ${
          cameraLocked
            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            : "hover:bg-white/5 text-inherit border border-transparent"
        }`}
        title={
          cameraLocked
            ? "Desbloquear Movimento do Mapa"
            : "Bloquear Movimento do Mapa"
        }
      >
        {cameraLocked ? <Lock size={13} /> : <Unlock size={13} />}
      </button>
    </div>
  );
}
