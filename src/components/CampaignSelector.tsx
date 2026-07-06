import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FolderOpen,
  Plus,
  Upload,
  Check,
  Compass,
  AlertCircle,
  Loader2,
  Download,
  Trash2,
} from "lucide-react";
import { Campaign } from "../types";

interface CampaignSelectorProps {
  campaigns: Campaign[];
  activeCampaignId: string;
  onSelectCampaign: (id: string) => void;
  onSaveCampaign: (campaign: Campaign) => void;
  onCreateCampaign: (campaign: Campaign) => void;
  onDeleteCampaign?: (id: string) => void;
  isDarkTheme: boolean;
}

export default function CampaignSelector({
  campaigns,
  activeCampaignId,
  onSelectCampaign,
  onSaveCampaign,
  onCreateCampaign,
  onDeleteCampaign,
  isDarkTheme,
}: CampaignSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [allowBackdropClose, setAllowBackdropClose] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Library Navigation and Preview States
  const [selectedLibraryCampId, setSelectedLibraryCampId] = useState<string>(
    activeCampaignId || "",
  );
  const [libraryTab, setLibraryTab] = useState<"preview" | "create">("preview");

  useEffect(() => {
    if (isOpen) {
      setSelectedLibraryCampId(activeCampaignId);
      setLibraryTab("preview");
      setAllowBackdropClose(false);
      const timer = window.setTimeout(() => {
        setAllowBackdropClose(true);
      }, 120);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen, activeCampaignId]);

  const openManager = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  const librarySelectedCampaign = campaigns.find(
    (c) => c.id === selectedLibraryCampId,
  );

  // New campaign state
  const [newCampaignName, setNewCampaignName] = useState("");
  const [newCampaignDesc, setNewCampaignDesc] = useState("");
  const [uploadedMapBase64, setUploadedMapBase64] = useState<string | null>(
    null,
  );
  const [uploadedMapType, setUploadedMapType] = useState<"raster" | "svg">(
    "raster",
  );

  // Import/Export States
  const [importMethod, setImportMethod] = useState<"image" | "json">("image");
  const jsonFileInputRef = useRef<HTMLInputElement>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const isSVG = file.type === "image/svg+xml" || file.name.endsWith(".svg");
    setUploadedMapType(isSVG ? "svg" : "raster");

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setUploadedMapBase64(e.target.result as string);
      }
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // LOCAL PROCEDURAL REGIONS (FAST CAMPAIGN CREATION)
  const handleForceProceduralCreate = () => {
    if (!uploadedMapBase64 || !newCampaignName.trim()) return;

    const newCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      name: newCampaignName.trim(),
      description: newCampaignDesc.trim() || "Nova Campanha de RPG.",
      mapUrl: uploadedMapBase64,
      mapType: uploadedMapType,
      mapWidth: 2000,
      mapHeight: 1400,
      regions: [],
      pois: [],
      routes: [],
      comments: [],
      travelPlan: {
        origin: "Ponto de Partida",
        destination: "Destino",
        stops: [],
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
            id: `log-proc-${Date.now()}`,
            text: "Nova campanha criada com sucesso.",
            type: "info",
            timestamp: "Agora",
          },
        ],
      },
      worldScale: 1,
    };

    onCreateCampaign(newCampaign);
    setIsOpen(false);
    resetNewCampaignState();
  };

  const resetNewCampaignState = () => {
    setNewCampaignName("");
    setNewCampaignDesc("");
    setUploadedMapBase64(null);
  };

  // Helper to trigger downloads
  const downloadFile = (dataUrl: string, fileName: string) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const safeFileName = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s_-]/g, "")
      .replace(/\s+/g, "_")
      .replace(/_+/g, "_") || "campaign";

  const escapeXml = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const buildCampaignSvg = (targetCampaign: Campaign): string => {
    const width = targetCampaign.mapWidth || 2000;
    const height = targetCampaign.mapHeight || 1400;
    const hasBackgroundImage = Boolean(targetCampaign.mapUrl);

    const backgroundMarkup = hasBackgroundImage
      ? `<image href="${escapeXml(targetCampaign.mapUrl)}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"/>`
      : `
        <rect width="100%" height="100%" fill="url(#export-sea-grad)"/>
        <rect width="100%" height="100%" fill="url(#export-grid-pattern)" opacity="0.6"/>
        <path d="M 100,200 C 300,180 400,250 500,350 C 600,450 450,700 350,780 C 250,860 150,900 120,1100 C 100,1200 300,1250 600,1200 C 800,1170 950,1100 1100,1150 C 1250,1200 1350,1300 1500,1280 C 1700,1250 1850,1100 1900,900 C 1950,700 1800,550 1750,400 C 1700,250 1800,150 1600,100 C 1400,60 1200,180 1000,150 C 800,120 700,250 500,200 Z" fill="#EDE5D6" stroke="#C0AF92" stroke-width="2"/>
      `;

    const regionsMarkup = targetCampaign.regions
      .map((region) => {
        const pointsStr = region.points.map((p) => `${p.x},${p.y}`).join(" ");
        const dash = region.type === "Floresta" ? 'stroke-dasharray="4,4"' : "";
        return `<polygon points="${pointsStr}" fill="${escapeXml(region.color)}" fill-opacity="${region.opacity}" stroke="${escapeXml(region.color)}" stroke-width="1.5" ${dash}/>`;
      })
      .join("\n");

    const routesMarkup = targetCampaign.routes
      .map((route) => {
        const pathData = route.points
          .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
          .join(" ");
        const dash =
          route.category === "Trilha"
            ? 'stroke-dasharray="6,4"'
            : route.category === "Túneis"
              ? 'stroke-dasharray="2,4"'
              : "";
        return `<path d="${pathData}" fill="none" stroke="${escapeXml(route.color)}" stroke-width="2.5" ${dash}/>`;
      })
      .join("\n");

    const travelOverlayMarkup = (
      targetCampaign.travelPlan.selectedRouteIds || []
    )
      .map((routeId) =>
        targetCampaign.routes.find((route) => route.id === routeId),
      )
      .filter((route): route is Campaign["routes"][number] => Boolean(route))
      .map((route) => {
        const pathData = route.points
          .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
          .join(" ");
        return `<path d="${pathData}" fill="none" stroke="#F59E0B" stroke-width="4" stroke-dasharray="8,6" opacity="0.75" filter="url(#export-glow)"/>`;
      })
      .join("\n");

    const poisMarkup = targetCampaign.pois
      .map((poi) => {
        const label = escapeXml(poi.name);
        const x = poi.x;
        const y = poi.y;
        return `
          <g transform="translate(${x}, ${y})">
            <circle cx="0" cy="0" r="12" fill="none" stroke="#F59E0B" stroke-width="1" opacity="0.5"/>
            <circle cx="0" cy="0" r="7" fill="#D97706" stroke="#FFFFFF" stroke-width="1.5"/>
            <rect x="-56" y="-26" width="112" height="14" rx="4" fill="#FFF8EE" stroke="#D97706" stroke-width="0.6"/>
            <text x="0" y="-16" text-anchor="middle" font-size="8" font-weight="700" fill="#3E2F1F">${label}</text>
          </g>
        `;
      })
      .join("\n");

    const commentsMarkup = targetCampaign.comments
      .map((comment) => {
        const text = escapeXml(
          comment.content.length > 28
            ? `${comment.content.substring(0, 25)}...`
            : comment.content,
        );
        const opacity = comment.resolved ? "0.4" : "1";
        return `
          <g transform="translate(${comment.x}, ${comment.y})" opacity="${opacity}">
            <circle cx="0" cy="0" r="6" fill="#8B5CF6" stroke="#FFFFFF" stroke-width="1.5"/>
            <rect x="-64" y="-30" width="128" height="18" rx="6" fill="#F5F3FF" stroke="#8B5CF6" stroke-width="0.6"/>
            <text x="0" y="-18" text-anchor="middle" font-size="7" fill="#4C1D95">${text}</text>
          </g>
        `;
      })
      .join("\n");

    return `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="export-sea-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E2D7C5"/>
      <stop offset="100%" stop-color="#CDBC9E"/>
    </linearGradient>
    <pattern id="export-grid-pattern" width="100" height="100" patternUnits="userSpaceOnUse">
      <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(62,47,31,0.05)" stroke-width="1"/>
    </pattern>
    <filter id="export-glow">
      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <style>
      text { font-family: "Space Grotesk", sans-serif; }
    </style>
  </defs>

  ${backgroundMarkup}
  <g id="export-regions">${regionsMarkup}</g>
  <g id="export-routes">${routesMarkup}</g>
  <g id="export-travel-overlay">${travelOverlayMarkup}</g>
  <g id="export-pois">${poisMarkup}</g>
  <g id="export-comments">${commentsMarkup}</g>
</svg>
    `.trim();
  };

  // Export JSON
  const handleExportJSON = () => {
    const targetCampaign = librarySelectedCampaign;
    if (!targetCampaign) return;
    const jsonString = JSON.stringify(targetCampaign, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    downloadFile(url, `${safeFileName(targetCampaign.name)}_campaign.json`);
    URL.revokeObjectURL(url);
  };

  const handleExportSVG = () => {
    const targetCampaign = librarySelectedCampaign;
    if (!targetCampaign) return;
    const svgString = buildCampaignSvg(targetCampaign);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    downloadFile(url, `${safeFileName(targetCampaign.name)}_map.svg`);
    URL.revokeObjectURL(url);
  };

  const handleExportImage = (format: "png" | "jpg") => {
    const targetCampaign = librarySelectedCampaign;
    if (!targetCampaign) return;
    const svgString = buildCampaignSvg(targetCampaign);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetCampaign.mapWidth || 2000;
      canvas.height = targetCampaign.mapHeight || 1400;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        if (format === "jpg") {
          ctx.fillStyle = isDarkTheme ? "#0d0e12" : "#FBF9F4";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);

        const type = format === "png" ? "image/png" : "image/jpeg";
        const dataUrl = canvas.toDataURL(
          type,
          format === "jpg" ? 0.92 : undefined,
        );
        downloadFile(
          dataUrl,
          `${safeFileName(targetCampaign.name)}_map.${format}`,
        );
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const handleJsonImport = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          if (!event.target?.result) return;
          const parsed = JSON.parse(event.target.result as string) as Campaign;

          if (
            !parsed.name ||
            !parsed.regions ||
            !parsed.routes ||
            !parsed.pois
          ) {
            setJsonError(
              "O arquivo JSON não é uma campanha válida (faltam campos obrigatórios).",
            );
            setImportSuccess(null);
            return;
          }

          parsed.id = `camp-imported-${Date.now()}`;
          parsed.name = `${parsed.name} (Importado)`;

          onCreateCampaign(parsed);
          setJsonError(null);
          setImportSuccess(`Campanha "${parsed.name}" importada com sucesso!`);
          setTimeout(() => {
            onSelectCampaign(parsed.id);
            setIsOpen(false);
            setImportSuccess(null);
          }, 1500);
        } catch (err) {
          setJsonError(
            "Erro ao decodificar o arquivo JSON. Certifique-se de que é um JSON válido.",
          );
          setImportSuccess(null);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="z-30">
      {/* Selector Trigger Button */}
      <button
        onClick={openManager}
        className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border font-display font-semibold transition-all hover:bg-white/5 active:scale-95 text-xs ${
          isDarkTheme
            ? "bg-slate-900/90 border-slate-800 text-slate-300 shadow-lg"
            : "bg-parchment-100 border-parchment-300 text-parchment-900 shadow-sm"
        }`}
      >
        <FolderOpen size={15} />
        <span>Gerenciar Campanhas</span>
      </button>

      {/* PERSISTENT MANAGE DIALOG OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <div
            className={`fixed inset-0 z-[99999] flex items-center justify-center p-4 ${isDarkTheme ? "bg-slate-950/95" : "bg-parchment-100/95"} backdrop-blur-lg`}
          >
            <div
              className="absolute inset-0"
              onClick={() => {
                if (allowBackdropClose) setIsOpen(false);
              }}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden z-20 flex flex-col md:flex-row h-[520px] floating-panel${!isDarkTheme ? "-light" : ""}`}
            >
              {/* Left sidebar: Campaigns library */}
              <div
                className={`w-full md:w-[260px] border-r p-4 flex flex-col justify-between ${
                  isDarkTheme
                    ? "bg-slate-950/40 border-slate-800/60"
                    : "bg-parchment-100/50 border-parchment-200"
                }`}
              >
                <div>
                  <h3 className="font-display font-semibold uppercase tracking-wider text-[10px] opacity-50 mb-3">
                    Biblioteca de Campanhas
                  </h3>
                  <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 no-scrollbar">
                    {campaigns.map((camp) => {
                      const isCurrentlyActive = camp.id === activeCampaignId;
                      const isHighlighted =
                        camp.id === librarySelectedCampaign?.id;
                      return (
                        <div
                          key={camp.id}
                          onClick={() => {
                            setSelectedLibraryCampId(camp.id);
                            setLibraryTab("preview");
                          }}
                          className={`p-3 rounded-xl cursor-pointer transition-all border text-left ${
                            isHighlighted
                              ? "bg-amber-500 border-amber-400 text-slate-950 font-semibold"
                              : isCurrentlyActive
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                                : isDarkTheme
                                  ? "bg-white/5 border-transparent hover:border-white/10 text-slate-300"
                                  : "bg-black/5 border-transparent hover:border-black/10 text-slate-800"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="block text-xs font-semibold truncate max-w-[130px]">
                              {camp.name}
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {isCurrentlyActive && (
                                <span
                                  className={`text-[8px] uppercase tracking-wider px-1 py-0.5 rounded ${
                                    isHighlighted
                                      ? "bg-slate-950 text-amber-400"
                                      : "bg-amber-500/20 text-amber-500"
                                  }`}
                                >
                                  Ativo
                                </span>
                              )}
                              {onDeleteCampaign && campaigns.length > 1 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (
                                      confirm(
                                        `Tem certeza que deseja excluir a campanha "${camp.name}"?`,
                                      )
                                    ) {
                                      onDeleteCampaign(camp.id);
                                      if (selectedLibraryCampId === camp.id) {
                                        const remaining = campaigns.filter(
                                          (c) => c.id !== camp.id,
                                        );
                                        if (remaining.length > 0) {
                                          setSelectedLibraryCampId(
                                            remaining[0].id,
                                          );
                                        }
                                      }
                                    }
                                  }}
                                  className={`p-1 rounded transition-colors cursor-pointer ${
                                    isHighlighted
                                      ? "text-slate-950 hover:bg-black/10"
                                      : "text-red-500 hover:bg-red-500/10"
                                  }`}
                                  title="Excluir Campanha"
                                >
                                  <Trash2 size={11} />
                                </button>
                              )}
                            </div>
                          </div>
                          <span
                            className={`text-[9px] line-clamp-1 opacity-70 mt-0.5 ${isHighlighted ? "text-slate-900" : ""}`}
                          >
                            {camp.description}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-white/5 mt-2">
                  <button
                    onClick={() => setLibraryTab("create")}
                    className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      libraryTab === "create"
                        ? "bg-amber-500 text-slate-950 font-bold"
                        : isDarkTheme
                          ? "bg-slate-900 hover:bg-slate-800 text-slate-300"
                          : "bg-parchment-200 hover:bg-parchment-300 text-parchment-900"
                    }`}
                  >
                    <Plus size={13} /> Criar Novo Mapa
                  </button>
                  <div className="text-[9px] opacity-40 font-mono text-center">
                    RPG Travel Maps v1.2
                  </div>
                </div>
              </div>

              {/* Right area: Details / Import / Create */}
              <div className="flex-1 p-5 overflow-y-auto no-scrollbar flex flex-col justify-between">
                {/* PREVIEW TAB */}
                {libraryTab === "preview" && librarySelectedCampaign && (
                  <div className="flex flex-col h-full justify-between space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-start">
                          <h2 className="font-display font-bold text-sm text-amber-500 uppercase tracking-wider">
                            {librarySelectedCampaign.name}
                          </h2>
                          <span className="text-[9px] font-mono opacity-50 uppercase tracking-widest">
                            Campanha
                          </span>
                        </div>
                        <p className="text-xs opacity-70 mt-1 line-clamp-2">
                          {librarySelectedCampaign.description}
                        </p>
                      </div>

                      {/* Map Image Preview */}
                      <div
                        className={`relative h-32 w-full rounded-xl overflow-hidden border ${
                          isDarkTheme
                            ? "border-slate-800 bg-slate-900"
                            : "border-parchment-200 bg-parchment-50"
                        }`}
                      >
                        <img
                          src={librarySelectedCampaign.mapUrl || undefined}
                          alt={librarySelectedCampaign.name}
                          className="w-full h-full object-cover opacity-85"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                          <span className="text-[9px] text-white font-mono bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                            {librarySelectedCampaign.mapWidth} ×{" "}
                            {librarySelectedCampaign.mapHeight} px
                          </span>
                        </div>
                      </div>

                      {/* Campaign Metrics */}
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div
                          className={`p-2 rounded-xl border ${isDarkTheme ? "bg-white/5 border-white/5" : "bg-black/5 border-black/5"}`}
                        >
                          <span className="block text-[8px] uppercase opacity-50 font-semibold">
                            Regiões
                          </span>
                          <span className="text-xs font-bold text-emerald-400">
                            {librarySelectedCampaign.regions.length}
                          </span>
                        </div>
                        <div
                          className={`p-2 rounded-xl border ${isDarkTheme ? "bg-white/5 border-white/5" : "bg-black/5 border-black/5"}`}
                        >
                          <span className="block text-[8px] uppercase opacity-50 font-semibold">
                            Estradas
                          </span>
                          <span className="text-xs font-bold text-purple-400">
                            {librarySelectedCampaign.routes.length}
                          </span>
                        </div>
                        <div
                          className={`p-2 rounded-xl border ${isDarkTheme ? "bg-white/5 border-white/5" : "bg-black/5 border-black/5"}`}
                        >
                          <span className="block text-[8px] uppercase opacity-50 font-semibold">
                            Pins POI
                          </span>
                          <span className="text-xs font-bold text-amber-400">
                            {librarySelectedCampaign.pois.length}
                          </span>
                        </div>
                        <div
                          className={`p-2 rounded-xl border ${isDarkTheme ? "bg-white/5 border-white/5" : "bg-black/5 border-black/5"}`}
                        >
                          <span className="block text-[8px] uppercase opacity-50 font-semibold">
                            Escala
                          </span>
                          <span className="text-xs font-bold text-blue-400">
                            {librarySelectedCampaign.worldScale}m
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions and Export formats */}
                    <div className="space-y-3 pt-3 border-t border-white/5">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            onSelectCampaign(librarySelectedCampaign.id);
                            setIsOpen(false);
                          }}
                          className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/15 active:scale-[0.98] transition-all cursor-pointer"
                        >
                          <Compass size={14} /> Carregar e Editar este Mapa
                        </button>
                        {onDeleteCampaign && campaigns.length > 1 && (
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  `Tem certeza que deseja excluir a campanha "${librarySelectedCampaign.name}"?`,
                                )
                              ) {
                                onDeleteCampaign(librarySelectedCampaign.id);
                                const remaining = campaigns.filter(
                                  (c) => c.id !== librarySelectedCampaign.id,
                                );
                                if (remaining.length > 0) {
                                  setSelectedLibraryCampId(remaining[0].id);
                                }
                              }
                            }}
                            className="px-3.5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer"
                            title="Excluir Campanha"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      {/* Export buttons block */}
                      <div className="text-left">
                        <span className="block text-[9px] uppercase opacity-50 mb-1.5 font-semibold text-left">
                          Formatos de Exportação
                        </span>
                        <div className="grid grid-cols-4 gap-1.5">
                          <button
                            onClick={handleExportSVG}
                            disabled={!librarySelectedCampaign}
                            className={`flex items-center justify-center gap-1 p-1.5 rounded-lg border text-[9px] font-semibold transition-all cursor-pointer ${
                              isDarkTheme
                                ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-300"
                                : "bg-black/5 border-black/10 hover:bg-black/10 hover:border-black/20 text-slate-800"
                            }`}
                          >
                            <Download size={11} /> SVG
                          </button>
                          <button
                            onClick={() => handleExportImage("png")}
                            disabled={!librarySelectedCampaign}
                            className={`flex items-center justify-center gap-1 p-1.5 rounded-lg border text-[9px] font-semibold transition-all cursor-pointer ${
                              isDarkTheme
                                ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-300"
                                : "bg-black/5 border-black/10 hover:bg-black/10 hover:border-black/20 text-slate-800"
                            }`}
                          >
                            <Download size={11} /> PNG
                          </button>
                          <button
                            onClick={() => handleExportImage("jpg")}
                            disabled={!librarySelectedCampaign}
                            className={`flex items-center justify-center gap-1 p-1.5 rounded-lg border text-[9px] font-semibold transition-all cursor-pointer ${
                              isDarkTheme
                                ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-300"
                                : "bg-black/5 border-black/10 hover:bg-black/10 hover:border-black/20 text-slate-800"
                            }`}
                          >
                            <Download size={11} /> JPG
                          </button>
                          <button
                            onClick={handleExportJSON}
                            disabled={!librarySelectedCampaign}
                            className={`flex items-center justify-center gap-1 p-1.5 rounded-lg border text-[9px] font-semibold transition-all cursor-pointer ${
                              isDarkTheme
                                ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-300"
                                : "bg-black/5 border-black/10 hover:bg-black/10 hover:border-black/20 text-slate-800"
                            }`}
                          >
                            <Download size={11} /> JSON
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* CREATE / IMPORT TAB */}
                {libraryTab === "create" && (
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      {/* Section Header with format toggle */}
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-display font-semibold text-xs uppercase tracking-wider text-amber-500">
                          Importar ou Criar Mapa
                        </h3>
                        <div className="flex gap-1.5 p-0.5 rounded-lg bg-black/25">
                          <button
                            type="button"
                            onClick={() => setImportMethod("image")}
                            className={`px-2 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer ${importMethod === "image" ? "bg-amber-500 text-slate-950 shadow-sm" : "text-slate-400 hover:text-white"}`}
                          >
                            Novo Mapa
                          </button>
                          <button
                            type="button"
                            onClick={() => setImportMethod("json")}
                            className={`px-2 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer ${importMethod === "json" ? "bg-amber-500 text-slate-950 shadow-sm" : "text-slate-400 hover:text-white"}`}
                          >
                            Importar JSON
                          </button>
                        </div>
                      </div>

                      {importMethod === "image" ? (
                        <div className="space-y-3.5">
                          {/* Name & description */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                            <div>
                              <label className="block text-[10px] uppercase opacity-50 mb-1 text-left">
                                Nome da Campanha
                              </label>
                              <input
                                type="text"
                                placeholder="Ex: Reino de Valéria"
                                value={newCampaignName}
                                onChange={(e) =>
                                  setNewCampaignName(e.target.value)
                                }
                                className={`w-full text-xs p-2 rounded-lg focus:outline-none focus:border-amber-500 text-inherit transition-all ${
                                  isDarkTheme
                                    ? "bg-white/5 border-white/10"
                                    : "bg-black/5 border-black/10"
                                }`}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase opacity-50 mb-1 text-left">
                                Descrição Curta
                              </label>
                              <input
                                type="text"
                                placeholder="Resumo da lore para os aventureiros..."
                                value={newCampaignDesc}
                                onChange={(e) =>
                                  setNewCampaignDesc(e.target.value)
                                }
                                className={`w-full text-xs p-2 rounded-lg focus:outline-none focus:border-amber-500 text-inherit transition-all ${
                                  isDarkTheme
                                    ? "bg-white/5 border-white/10"
                                    : "bg-black/5 border-black/10"
                                }`}
                              />
                            </div>
                          </div>

                          {/* Drag and drop upload zone */}
                          <div
                            onDragEnter={handleDrag}
                            onDragOver={handleDrag}
                            onDragLeave={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-150 flex flex-col items-center justify-center py-8 ${
                              dragActive
                                ? "border-amber-500 bg-amber-500/10"
                                : uploadedMapBase64
                                  ? "border-emerald-500/40 bg-emerald-500/5"
                                  : isDarkTheme
                                    ? "border-white/10 hover:border-white/20 hover:bg-white/5"
                                    : "border-black/10 hover:border-black/20 hover:bg-black/5"
                            }`}
                          >
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept=".svg,.png,.jpg,.jpeg,.webp"
                              onChange={handleFileChange}
                              className="hidden"
                            />

                            {uploadedMapBase64 ? (
                              <>
                                <Check
                                  className="text-emerald-500 mb-1"
                                  size={20}
                                />
                                <span className="text-xs font-semibold text-emerald-400">
                                  Mapa Carregado com Sucesso!
                                </span>
                                <span className="text-[9px] opacity-50 mt-0.5 uppercase font-mono">
                                  {uploadedMapType} Map File
                                </span>
                              </>
                            ) : isUploading ? (
                              <>
                                <Loader2
                                  className="animate-spin text-amber-500 mb-1"
                                  size={20}
                                />
                                <span className="text-xs">
                                  Processando arquivo...
                                </span>
                              </>
                            ) : (
                              <>
                                <Upload className="opacity-50 mb-1" size={20} />
                                <span className="text-xs font-semibold">
                                  Arraste seu arquivo de mapa ou clique aqui
                                </span>
                                <span className="text-[9px] opacity-40 mt-0.5">
                                  Formatos aceitos: SVG, PNG, JPG, JPEG, WEBP
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 py-4 text-center">
                          {/* JSON Import Area */}
                          <div
                            onClick={() => jsonFileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                              isDarkTheme
                                ? "border-white/10 hover:border-white/20 hover:bg-white/5"
                                : "border-black/10 hover:border-black/20 hover:bg-black/5"
                            }`}
                          >
                            <input
                              ref={jsonFileInputRef}
                              type="file"
                              accept=".json"
                              onChange={handleJsonImport}
                              className="hidden"
                            />
                            <Upload
                              className="opacity-50 mx-auto mb-2 text-amber-500 animate-bounce"
                              size={26}
                            />
                            <span className="text-xs font-semibold block">
                              Escolher Arquivo JSON de Campanha
                            </span>
                            <span className="text-[10px] opacity-40 mt-1 block">
                              Preserva todas as rotas, pins, regiões, e escalas
                            </span>
                          </div>

                          {jsonError && (
                            <div className="p-2.5 bg-red-600/10 border border-red-500/20 text-red-400 rounded-xl text-[10px] flex items-center gap-1.5 justify-center">
                              <AlertCircle size={12} /> {jsonError}
                            </div>
                          )}

                          {importSuccess && (
                            <div className="p-2.5 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[10px] flex items-center gap-1.5 justify-center">
                              <Check size={12} /> {importSuccess}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Confirm buttons */}
                    <div className="pt-4 border-t border-white/5 mt-4">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setLibraryTab("preview")}
                          className="px-4 py-2 text-xs hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                        >
                          Voltar ao Preview
                        </button>

                        {importMethod === "image" && (
                          <button
                            onClick={handleForceProceduralCreate}
                            disabled={
                              !uploadedMapBase64 || !newCampaignName.trim()
                            }
                            className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-lg cursor-pointer"
                          >
                            Criar Campanha
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
