import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Compass, Shield, BookOpen } from "lucide-react";
import { Campaign, TravelPlan, Caravan, TravelLog, Route } from "../types";

interface TravelPlannerProps {
  campaign: Campaign;
  updateCampaign: (campaign: Campaign) => void;
  isDarkTheme: boolean;
}

const MAX_ATTR = 5;
const MAX_BONUS = 3;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export default function TravelPlanner({
  campaign,
  updateCampaign,
  isDarkTheme,
}: TravelPlannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"itinerario" | "caravana">(
    "itinerario",
  );
  const eventLogTimeoutRef = useRef<number | null>(null);

  const plan = campaign.travelPlan;

  // MUTATE TRAVEL PLAN
  const updatePlan = (updatedFields: Partial<TravelPlan>) => {
    updateCampaign({
      ...campaign,
      travelPlan: { ...plan, ...updatedFields },
    });
  };

  const updateCaravan = (updatedCaravan: Partial<Caravan>) => {
    updatePlan({
      caravan: { ...plan.caravan, ...updatedCaravan },
    });
  };

  const handleAttrChange = (field: keyof Caravan, value: number) => {
    const maxByField: Partial<Record<keyof Caravan, number>> = {
      defesa: MAX_ATTR,
      suporte: MAX_ATTR,
      diplomacia: MAX_ATTR,
      bonusAnimal: MAX_BONUS,
      bonusNatural: MAX_BONUS,
      bonusAmeaça: MAX_BONUS,
    };

    const max = maxByField[field];
    const normalized = typeof max === "number" ? clamp(value, 0, max) : value;
    updateCaravan({ [field]: normalized });
  };

  useEffect(() => {
    return () => {
      if (eventLogTimeoutRef.current !== null) {
        window.clearTimeout(eventLogTimeoutRef.current);
      }
    };
  }, []);

  // TRIP MATHEMATICS (Dynamic routing compilation)
  const getSelectedRoutes = (): Route[] => {
    return plan.selectedRouteIds
      .map((id) => campaign.routes.find((r) => r.id === id))
      .filter((r): r is Route => r !== undefined);
  };

  const toggleRouteInPlan = (routeId: string) => {
    const alreadySelected = plan.selectedRouteIds.includes(routeId);
    updatePlan({
      selectedRouteIds: alreadySelected
        ? plan.selectedRouteIds.filter((id) => id !== routeId)
        : [...plan.selectedRouteIds, routeId],
    });
  };

  return (
    <div className="z-30">
      {/* Floating trigger button in bottom-right corner area */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 rounded-full font-display font-bold text-xs uppercase tracking-wider shadow-2xl transition-all duration-150 border border-amber-400/20"
      >
        <Compass size={16} className={plan.traveling ? "animate-spin" : ""} />
        {plan.traveling
          ? `Viagem Ativa (${plan.currentSegmentIndex + 1}/${getSelectedRoutes().length})`
          : "Planejar Viagem"}
      </button>

      {/* EXPANDABLE BOTTOM SHEET PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 150, opacity: 0 }}
            className={`fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[880px] h-[480px] rounded-2xl shadow-2xl border floating-panel${!isDarkTheme ? "-light" : ""} flex flex-col overflow-hidden z-10`}
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-black/10">
              <div className="flex items-center gap-2.5">
                <Compass className="text-amber-500" size={16} />
                <h3 className="font-display font-semibold uppercase tracking-wider text-xs">
                  Planejamento da Viagem
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-white/5 opacity-60 hover:opacity-100 transition-all text-xs"
              >
                Fechar
              </button>
            </div>

            {/* Quick stats ribbon */}
            <div className="grid grid-cols-4 divide-x divide-white/5 bg-black/5 border-b border-white/5 text-center py-2.5">
              <div className="flex flex-col items-center justify-center">
                <span className="block text-[8px] uppercase tracking-widest opacity-40 mb-0.5">
                  Itinerário
                </span>
                <span className="text-[11px] font-semibold text-amber-500 truncate max-w-[120px]">
                  {plan.origin} → {plan.destination}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="block text-[8px] uppercase tracking-widest opacity-40 mb-1">
                  Suprimentos
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updatePlan({ supplies: Math.max(0, plan.supplies - 1) })
                    }
                    className="w-4 h-4 rounded-md bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 flex items-center justify-center text-[10px] text-emerald-500 font-bold hover:scale-105 transition-all select-none cursor-pointer"
                    title="Remover 1 Suprimento"
                  >
                    -
                  </button>
                  <span className="text-[11px] font-semibold text-emerald-500 font-mono">
                    {plan.supplies} / {plan.maxSupplies}
                  </span>
                  <button
                    onClick={() =>
                      updatePlan({
                        supplies: Math.min(plan.maxSupplies, plan.supplies + 1),
                      })
                    }
                    className="w-4 h-4 rounded-md bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 flex items-center justify-center text-[10px] text-emerald-500 font-bold hover:scale-105 transition-all select-none cursor-pointer"
                    title="Adicionar 1 Suprimento"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="block text-[8px] uppercase tracking-widest opacity-40 mb-1">
                  Caravana Moral
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updatePlan({ moral: Math.max(-5, plan.moral - 1) })
                    }
                    className="w-4 h-4 rounded-md bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 flex items-center justify-center text-[10px] text-amber-500 font-bold hover:scale-105 transition-all select-none cursor-pointer"
                    title="Diminuir Moral"
                  >
                    -
                  </button>
                  <span
                    className={`text-[11px] font-semibold font-mono ${plan.moral >= 1 ? "text-emerald-500" : plan.moral < 0 ? "text-red-500" : "text-slate-400"}`}
                  >
                    {plan.moral > 0 ? `+${plan.moral}` : plan.moral}
                  </span>
                  <button
                    onClick={() =>
                      updatePlan({ moral: Math.min(5, plan.moral + 1) })
                    }
                    className="w-4 h-4 rounded-md bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 flex items-center justify-center text-[10px] text-amber-500 font-bold hover:scale-105 transition-all select-none cursor-pointer"
                    title="Aumentar Moral"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="block text-[8px] uppercase tracking-widest opacity-40 mb-1">
                  Fadiga Viajante
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updatePlan({ fatigue: Math.max(0, plan.fatigue - 1) })
                    }
                    className="w-4 h-4 rounded-md bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 flex items-center justify-center text-[10px] text-rose-500 font-bold hover:scale-105 transition-all select-none cursor-pointer"
                    title="Diminuir Fadiga"
                  >
                    -
                  </button>
                  <span className="text-[11px] font-semibold text-rose-500 font-mono">
                    {plan.fatigue} pts
                  </span>
                  <button
                    onClick={() => updatePlan({ fatigue: plan.fatigue + 1 })}
                    className="w-4 h-4 rounded-md bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 flex items-center justify-center text-[10px] text-rose-500 font-bold hover:scale-105 transition-all select-none cursor-pointer"
                    title="Aumentar Fadiga"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs selector */}
            <div className="flex border-b border-white/5 text-xs bg-black/10">
              <button
                onClick={() => setActiveTab("itinerario")}
                className={`flex-1 py-2.5 text-center font-semibold border-b-2 transition-all ${
                  activeTab === "itinerario"
                    ? "border-amber-500 text-amber-400 bg-white/5"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                1. Itinerário e Custos
              </button>
              <button
                onClick={() => setActiveTab("caravana")}
                className={`flex-1 py-2.5 text-center font-semibold border-b-2 transition-all ${
                  activeTab === "caravana"
                    ? "border-amber-500 text-amber-400 bg-white/5"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                2. Caravanistas & Guildas
              </button>
            </div>

            {/* Tab content area */}
            <div className="flex-1 p-4 overflow-y-auto no-scrollbar">
              {/* TAB 1: ITINERARY */}
              {activeTab === "itinerario" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                  {/* Select parameters */}
                  <div className="space-y-3 pr-2 border-r border-white/5">
                    <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-2 text-[10px] leading-relaxed">
                      Etapa 1 · Defina ponto de partida e destino. Etapa 2 ·
                      monte o itinerário escolhendo rotas e paradas.
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase opacity-50 mb-1">
                        Partindo de (Origem)
                      </label>
                      <select
                        value={plan.origin}
                        onChange={(e) => updatePlan({ origin: e.target.value })}
                        className="themed-select w-full text-xs p-1.5 rounded-lg focus:outline-none focus:border-amber-500 text-inherit"
                      >
                        {campaign.pois.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name} ({p.type})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase opacity-50 mb-1">
                        Destino Final
                      </label>
                      <select
                        value={plan.destination}
                        onChange={(e) =>
                          updatePlan({ destination: e.target.value })
                        }
                        className="themed-select w-full text-xs p-1.5 rounded-lg focus:outline-none focus:border-amber-500 text-inherit"
                      >
                        {campaign.pois.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name} ({p.type})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Manual Stopovers input */}
                    <div>
                      <label className="block text-[10px] uppercase opacity-50 mb-1">
                        Paradas / Estalagens
                      </label>
                      <div className="flex flex-wrap gap-1 mb-1.5">
                        {plan.stops.map((st) => (
                          <span
                            key={st}
                            className="px-2 py-0.5 rounded bg-slate-800 text-[10px] border border-slate-700 inline-flex items-center gap-1"
                          >
                            {st}
                            <button
                              onClick={() =>
                                updatePlan({
                                  stops: plan.stops.filter((s) => s !== st),
                                })
                              }
                              className="hover:text-red-400"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <select
                        onChange={(e) => {
                          if (
                            e.target.value &&
                            !plan.stops.includes(e.target.value)
                          ) {
                            updatePlan({
                              stops: [...plan.stops, e.target.value],
                            });
                          }
                        }}
                        className="themed-select w-full text-[11px] p-1.5 rounded-lg focus:outline-none text-inherit"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          + Adicionar parada...
                        </option>
                        {campaign.pois.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Route selection and simulation controls */}
                  <div className="flex flex-col pl-2 gap-2">
                    <div className="rounded-xl border border-white/10 bg-black/10 p-2.5 space-y-2">
                      <div className="text-[10px] uppercase opacity-60">
                        Etapa 2 · Itinerário (Rotas)
                      </div>
                      <div className="max-h-28 overflow-y-auto no-scrollbar space-y-1">
                        {campaign.routes.map((route) => {
                          const checked = plan.selectedRouteIds.includes(
                            route.id,
                          );
                          return (
                            <label
                              key={route.id}
                              className="flex items-center justify-between gap-2 text-[10px] p-1.5 rounded border border-white/10 bg-white/5 cursor-pointer"
                            >
                              <span className="truncate">
                                {route.name} ({route.category})
                              </span>
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleRouteInPlan(route.id)}
                                className="accent-amber-500"
                              />
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/10 p-2.5 space-y-2 text-[10px]">
                      <div className="flex justify-between">
                        <span className="opacity-60">Rotas Selecionadas</span>
                        <span className="font-mono text-amber-400">
                          {getSelectedRoutes().length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-60">Custo Total (Supr.)</span>
                        <span className="font-mono text-emerald-400">
                          {getSelectedRoutes().reduce(
                            (sum, route) => sum + route.suppliesCost,
                            0,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-60">Obstáculos Totais</span>
                        <span className="font-mono text-rose-400">
                          {getSelectedRoutes().reduce(
                            (sum, route) => sum + route.obstaclesCount,
                            0,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CARAVAN RECRUITMENT */}
              {activeTab === "caravana" && (
                <div className="space-y-4">
                  <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-2 text-[10px] leading-relaxed">
                    Etapa 3 · Montagem da Caravana: configure Defesa, Suporte,
                    Diplomacia e Bônus de Travessia para modificar os resultados
                    dos eventos durante a jornada.
                  </div>

                  <div className="flex justify-between items-center bg-black/15 p-2 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase font-semibold text-amber-400">
                      Atalho Financeiro (Guilda da Rua)
                    </span>
                    <button
                      onClick={() =>
                        updateCaravan({
                          useStreetGuild: !plan.caravan.useStreetGuild,
                        })
                      }
                      className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
                        plan.caravan.useStreetGuild
                          ? "bg-red-500 text-white"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {plan.caravan.useStreetGuild
                        ? "Ativo (Baixa Qualidade)"
                        : "Inativo (Formal)"}
                    </button>
                  </div>

                  {/* Attributes recruitment grids (Defense, Support, Diplomacy & Sages) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* CORPORATE / GUILD ATTRIBUTES */}
                    <div className="space-y-4 pr-0 md:pr-3 md:border-r border-white/5 text-left">
                      <h4 className="font-display font-semibold text-[10px] uppercase tracking-wider text-amber-500 mb-2 flex items-center gap-1">
                        <Shield size={12} className="text-amber-500" />{" "}
                        Atributos Corporativos e Guildas
                      </h4>

                      {/* Defense Block */}
                      <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-xs text-slate-200">
                            Defesa (Sentinelas)
                          </span>
                          <span className="text-[9px] opacity-40">
                            Evita fadiga em desastres
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[8px] uppercase tracking-wider opacity-60 mb-0.5">
                              Atributo (0-5)
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={5}
                              value={plan.caravan.defesa}
                              onChange={(e) =>
                                handleAttrChange(
                                  "defesa",
                                  Math.max(
                                    0,
                                    Math.min(5, parseInt(e.target.value) || 0),
                                  ),
                                )
                              }
                              className="w-full text-xs p-1.5 rounded-lg bg-black/25 border border-white/10 focus:outline-none focus:border-amber-500 text-amber-400 font-mono font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] uppercase tracking-wider opacity-60 mb-0.5">
                              Membros (0-10)
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={10}
                              value={plan.caravan.sentinelasCount}
                              onChange={(e) =>
                                handleAttrChange(
                                  "sentinelasCount",
                                  Math.max(
                                    0,
                                    Math.min(10, parseInt(e.target.value) || 0),
                                  ),
                                )
                              }
                              className="w-full text-xs p-1.5 rounded-lg bg-black/25 border border-white/10 focus:outline-none focus:border-amber-500 text-amber-400 font-mono font-bold"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Support Block */}
                      <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-xs text-slate-200">
                            Suporte (Elos)
                          </span>
                          <span className="text-[9px] opacity-40">
                            Cura fadiga e poupa recursos
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[8px] uppercase tracking-wider opacity-60 mb-0.5">
                              Atributo (0-5)
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={5}
                              value={plan.caravan.suporte}
                              onChange={(e) =>
                                handleAttrChange(
                                  "suporte",
                                  Math.max(
                                    0,
                                    Math.min(5, parseInt(e.target.value) || 0),
                                  ),
                                )
                              }
                              className="w-full text-xs p-1.5 rounded-lg bg-black/25 border border-white/10 focus:outline-none focus:border-amber-500 text-amber-400 font-mono font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] uppercase tracking-wider opacity-60 mb-0.5">
                              Membros (0-10)
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={10}
                              value={plan.caravan.elosCount}
                              onChange={(e) =>
                                handleAttrChange(
                                  "elosCount",
                                  Math.max(
                                    0,
                                    Math.min(10, parseInt(e.target.value) || 0),
                                  ),
                                )
                              }
                              className="w-full text-xs p-1.5 rounded-lg bg-black/25 border border-white/10 focus:outline-none focus:border-amber-500 text-amber-400 font-mono font-bold"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Diplomacy Block */}
                      <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-xs text-slate-200">
                            Diplomacia (Mensageiros)
                          </span>
                          <span className="text-[9px] opacity-40">
                            Reduz impostos e pedágios
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[8px] uppercase tracking-wider opacity-60 mb-0.5">
                              Atributo (0-5)
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={5}
                              value={plan.caravan.diplomacia}
                              onChange={(e) =>
                                handleAttrChange(
                                  "diplomacia",
                                  Math.max(
                                    0,
                                    Math.min(5, parseInt(e.target.value) || 0),
                                  ),
                                )
                              }
                              className="w-full text-xs p-1.5 rounded-lg bg-black/25 border border-white/10 focus:outline-none focus:border-amber-500 text-amber-400 font-mono font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] uppercase tracking-wider opacity-60 mb-0.5">
                              Membros (0-10)
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={10}
                              value={plan.caravan.mensageirosCount}
                              onChange={(e) =>
                                handleAttrChange(
                                  "mensageirosCount",
                                  Math.max(
                                    0,
                                    Math.min(10, parseInt(e.target.value) || 0),
                                  ),
                                )
                              }
                              className="w-full text-xs p-1.5 rounded-lg bg-black/25 border border-white/10 focus:outline-none focus:border-amber-500 text-amber-400 font-mono font-bold"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* COMPANY OF SAGES */}
                    <div className="space-y-4 pl-0 md:pl-3 text-left">
                      <h4 className="font-display font-semibold text-[10px] uppercase tracking-wider text-amber-500 mb-2 flex items-center gap-1">
                        <BookOpen size={12} className="text-amber-500" /> Sábios
                        e Peritos (Sabedoria)
                      </h4>

                      {/* Animal Sage Block */}
                      <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-xs text-slate-200">
                            Sábio Animal
                          </span>
                          <span className="text-[9px] opacity-40">
                            Foge de criaturas nocivas
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[8px] uppercase tracking-wider opacity-60 mb-0.5">
                              Bônus (0-3)
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={3}
                              value={plan.caravan.bonusAnimal}
                              onChange={(e) =>
                                handleAttrChange(
                                  "bonusAnimal",
                                  Math.max(
                                    0,
                                    Math.min(3, parseInt(e.target.value) || 0),
                                  ),
                                )
                              }
                              className="w-full text-xs p-1.5 rounded-lg bg-black/25 border border-white/10 focus:outline-none focus:border-amber-500 text-amber-400 font-mono font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] uppercase tracking-wider opacity-60 mb-0.5">
                              Sábios (0-10)
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={10}
                              value={plan.caravan.sabioAnimalCount}
                              onChange={(e) =>
                                handleAttrChange(
                                  "sabioAnimalCount",
                                  Math.max(
                                    0,
                                    Math.min(10, parseInt(e.target.value) || 0),
                                  ),
                                )
                              }
                              className="w-full text-xs p-1.5 rounded-lg bg-black/25 border border-white/10 focus:outline-none focus:border-amber-500 text-amber-400 font-mono font-bold"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Natural Sage Block */}
                      <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-xs text-slate-200">
                            Sábio Natural
                          </span>
                          <span className="text-[9px] opacity-40">
                            Escapa de armadilhas do solo
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[8px] uppercase tracking-wider opacity-60 mb-0.5">
                              Bônus (0-3)
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={3}
                              value={plan.caravan.bonusNatural}
                              onChange={(e) =>
                                handleAttrChange(
                                  "bonusNatural",
                                  Math.max(
                                    0,
                                    Math.min(3, parseInt(e.target.value) || 0),
                                  ),
                                )
                              }
                              className="w-full text-xs p-1.5 rounded-lg bg-black/25 border border-white/10 focus:outline-none focus:border-amber-500 text-amber-400 font-mono font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] uppercase tracking-wider opacity-60 mb-0.5">
                              Sábios (0-10)
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={10}
                              value={plan.caravan.sabioNaturalCount}
                              onChange={(e) =>
                                handleAttrChange(
                                  "sabioNaturalCount",
                                  Math.max(
                                    0,
                                    Math.min(10, parseInt(e.target.value) || 0),
                                  ),
                                )
                              }
                              className="w-full text-xs p-1.5 rounded-lg bg-black/25 border border-white/10 focus:outline-none focus:border-amber-500 text-amber-400 font-mono font-bold"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Threat Sage Block */}
                      <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-xs text-slate-200">
                            Sábio Ameaça
                          </span>
                          <span className="text-[9px] opacity-40">
                            Diminui encontros de risco
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[8px] uppercase tracking-wider opacity-60 mb-0.5">
                              Bônus (0-3)
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={3}
                              value={plan.caravan.bonusAmeaça}
                              onChange={(e) =>
                                handleAttrChange(
                                  "bonusAmeaça",
                                  Math.max(
                                    0,
                                    Math.min(3, parseInt(e.target.value) || 0),
                                  ),
                                )
                              }
                              className="w-full text-xs p-1.5 rounded-lg bg-black/25 border border-white/10 focus:outline-none focus:border-amber-500 text-amber-400 font-mono font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] uppercase tracking-wider opacity-60 mb-0.5">
                              Sábios (0-10)
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={10}
                              value={plan.caravan.sabioAmeaçaCount}
                              onChange={(e) =>
                                handleAttrChange(
                                  "sabioAmeaçaCount",
                                  Math.max(
                                    0,
                                    Math.min(10, parseInt(e.target.value) || 0),
                                  ),
                                )
                              }
                              className="w-full text-xs p-1.5 rounded-lg bg-black/25 border border-white/10 focus:outline-none focus:border-amber-500 text-amber-400 font-mono font-bold"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
