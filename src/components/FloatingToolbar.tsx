import {
  MousePointer,
  Hand,
  Compass,
  MapPin,
  Ruler,
  Sun,
  Moon,
  MessageSquare,
  Info,
  Star,
} from "lucide-react";

interface FloatingToolbarProps {
  activeTool:
    | "select"
    | "pan"
    | "draw-poly"
    | "draw-route"
    | "pin"
    | "comment"
    | "ruler";
  setActiveTool: (
    tool:
      | "select"
      | "pan"
      | "draw-poly"
      | "draw-route"
      | "pin"
      | "comment"
      | "ruler",
  ) => void;
  isDarkTheme: boolean;
  setIsDarkTheme: (dark: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

export default function FloatingToolbar({
  activeTool,
  setActiveTool,
  isDarkTheme,
  setIsDarkTheme,
  setCommandPaletteOpen,
}: FloatingToolbarProps) {
  const tools = [
    {
      id: "select" as const,
      label: "Seleção",
      icon: <MousePointer size={14} />,
      desc: "Seleciona e edita elementos no mapa (atalho: S ou V)",
    },
    {
      id: "pan" as const,
      label: "Navegação",
      icon: <Hand size={14} />,
      desc: "Arrasta e navega pelo mapa com WASD/Setas (atalho: H ou P)",
    },
    {
      id: "draw-poly" as const,
      label: "Desenhar Região",
      icon: <Compass size={14} />,
      desc: "Desenha e expande polígonos inteligentes (atalho: R)",
    },
    {
      id: "draw-route" as const,
      label: "Criar Rota",
      icon: <Star size={14} />,
      desc: "Desenha rotas conectando pontos (atalho: T)",
    },
    {
      id: "pin" as const,
      label: "Fixar Pin",
      icon: <MapPin size={14} />,
      desc: "Adiciona pontos de interesse (atalho: O ou I)",
    },
    {
      id: "comment" as const,
      label: "Balão de Comentário",
      icon: <MessageSquare size={14} />,
      desc: "Adiciona notas no mapa (atalho: C)",
    },
    {
      id: "ruler" as const,
      label: "Régua de Medição",
      icon: <Ruler size={14} />,
      desc: "Mede distâncias no mapa (atalho: M, limpar: Esc)",
    },
  ];

  return (
    <div
      className={`p-2 rounded-2xl shadow-xl border floating-panel${!isDarkTheme ? "-light" : ""} flex flex-col gap-1 z-30 select-none w-12 items-center`}
    >
      {/* Tools List */}
      {tools.map((tool) => {
        const isActive = activeTool === tool.id;
        return (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`p-2.5 rounded-xl transition-all cursor-pointer relative group active:scale-95 ${
              isActive
                ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                : "hover:bg-white/5 text-inherit opacity-75 hover:opacity-100"
            }`}
          >
            {tool.icon}

            {/* Tooltip on Hover */}
            <div
              className={`absolute left-14 top-1/2 -translate-y-1/2 ml-2 px-3 py-2 rounded-xl border text-[11px] leading-snug w-52 shadow-xl hidden group-hover:block pointer-events-none floating-panel${!isDarkTheme ? "-light" : ""}`}
            >
              <span className="block font-bold text-amber-500 mb-0.5">
                {tool.label}
              </span>
              <span className="opacity-70 font-sans leading-normal">
                {tool.desc}
              </span>
            </div>
          </button>
        );
      })}

      <div className="w-8 h-[1px] bg-white/10 my-1.5" />

      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsDarkTheme(!isDarkTheme)}
        className="p-2.5 rounded-xl hover:bg-white/5 text-inherit opacity-75 hover:opacity-100 active:scale-95 transition-all cursor-pointer relative group"
        title={
          isDarkTheme
            ? "Alternar para Modo Pergaminho"
            : "Alternar para Modo Escuro"
        }
      >
        {isDarkTheme ? <Sun size={14} /> : <Moon size={14} />}

        <div
          className={`absolute left-14 top-1/2 -translate-y-1/2 ml-2 px-3 py-1 rounded-xl border text-[11px] shadow-xl hidden group-hover:block pointer-events-none floating-panel${!isDarkTheme ? "-light" : ""}`}
        >
          <span>{isDarkTheme ? "Modo Claro" : "Modo Escuro"}</span>
        </div>
      </button>

      {/* Command Palette guide */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="p-2.5 rounded-xl hover:bg-white/5 text-inherit opacity-50 hover:opacity-100 active:scale-95 transition-all cursor-pointer relative group mt-1"
        title="Ajuda e Paleta de Comandos (/)"
      >
        <Info size={14} />

        <div
          className={`absolute left-14 top-1/2 -translate-y-1/2 ml-2 px-3 py-1 rounded-xl w-52 border text-[11px] shadow-xl hidden group-hover:block pointer-events-none floating-panel${!isDarkTheme ? "-light" : ""}`}
        >
          <span>
            Dica: Pressione <strong>/</strong> para busca e{" "}
            <strong>Ctrl+Z</strong> para desfazer
          </span>
        </div>
      </button>
    </div>
  );
}
