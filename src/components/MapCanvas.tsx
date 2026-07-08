import { useState, useRef, useEffect, MouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Castle,
  Home,
  Compass,
  Anchor,
  Shield,
  MapPin,
  HelpCircle,
  Trash2,
  CornerDownRight,
  Check,
  MessageSquare,
} from "lucide-react";
import {
  Campaign,
  Region,
  Route,
  POI,
  Point,
  MapComment,
  POIType,
  RouteCategory,
} from "../types";
import { getMapCenterPoint } from "../utils/coordinates";

interface MapCanvasProps {
  campaign: Campaign;
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
  selectedElement: {
    type: "region" | "route" | "poi" | "comment" | null;
    id: string | null;
  };
  setSelectedElement: (elem: {
    type: "region" | "route" | "poi" | "comment" | null;
    id: string | null;
  }) => void;
  updateCampaign: (campaign: Campaign) => void;
  zoom: number;
  setZoom: (z: number) => void;
  pan: Point;
  setPan: (p: Point) => void;
  cameraLocked: boolean;
  layerVisibility: Record<string, boolean>;
  layerLocks: Record<string, boolean>;
  cursorPos: Point | null;
  setCursorPos: (p: Point | null) => void;
  isDarkTheme: boolean;
  layerOrder: string[];
}

export default function MapCanvas({
  campaign,
  activeTool,
  setActiveTool,
  selectedElement,
  setSelectedElement,
  updateCampaign,
  zoom,
  setZoom,
  pan,
  setPan,
  cameraLocked,
  layerVisibility,
  layerLocks,
  cursorPos,
  setCursorPos,
  isDarkTheme,
  layerOrder,
}: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Point>({ x: 0, y: 0 });
  const panRef = useRef(pan);
  const precisePanRef = useRef<Point>({ x: pan.x, y: pan.y });
  const renderedPanRef = useRef<Point>({ x: pan.x, y: pan.y });

  const commitPan = (nextPrecisePan: Point) => {
    precisePanRef.current = nextPrecisePan;

    // Pixel snapping reduces anti-aliasing shimmer while moving the large SVG scene.
    const snappedPan = {
      x: Math.round(nextPrecisePan.x),
      y: Math.round(nextPrecisePan.y),
    };

    if (
      snappedPan.x !== renderedPanRef.current.x ||
      snappedPan.y !== renderedPanRef.current.y
    ) {
      renderedPanRef.current = snappedPan;
      panRef.current = snappedPan;
      setPan(snappedPan);
    }
  };

  const getLayerZIndex = (layerId: string): number => {
    const index = layerOrder.indexOf(layerId);
    return index !== -1 ? (layerOrder.length - index) * 10 : 10;
  };

  const kmPerPixel = Math.max(0.01, campaign.worldScale ?? 1);

  // Local state for ruler measurement tool
  const [rulerPoints, setRulerPoints] = useState<Point[]>([]);

  // Region Drawing State
  const [drawingPoints, setDrawingPoints] = useState<Point[]>([]);
  const [pendingRegionPoints, setPendingRegionPoints] = useState<
    Point[] | null
  >(null);
  const [newRegionName, setNewRegionName] = useState("");
  const [newRegionType, setNewRegionType] = useState<Region["type"]>("Outro");
  const [newRegionBiome, setNewRegionBiome] = useState("Pradarias");
  const [newRegionClimate, setNewRegionClimate] = useState("Moderado");
  const [newRegionColor, setNewRegionColor] = useState("#22C55E");
  const [newRegionDescription, setNewRegionDescription] = useState("");

  // Route Drawing State
  const [drawingRoutePoints, setDrawingRoutePoints] = useState<Point[]>([]);

  // Hover states
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  const [hoveredRouteId, setHoveredRouteId] = useState<string | null>(null);
  const [hoveredPoiId, setHoveredPoiId] = useState<string | null>(null);

  // Vertex Editing State
  const [activeVertex, setActiveVertex] = useState<{
    regionId: string;
    index: number;
  } | null>(null);
  const [activeRouteVertex, setActiveRouteVertex] = useState<{
    routeId: string;
    index: number;
  } | null>(null);

  // Region Dragger State
  const [draggingRegionId, setDraggingRegionId] = useState<string | null>(null);
  const [dragStartCoords, setDragStartCoords] = useState<Point | null>(null);

  // New POI Modal state
  const [newPoiData, setNewPoiData] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [newPoiName, setNewPoiName] = useState("");
  const [newPoiType, setNewPoiType] = useState<POIType>("Pin");

  // New Comment Modal state
  const [newCommentData, setNewCommentData] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [newCommentAuthor, setNewCommentAuthor] = useState("Mestre");
  const [newCommentContent, setNewCommentContent] = useState("");

  // New Route Modal state
  const [pendingRoutePoints, setPendingRoutePoints] = useState<Point[] | null>(
    null,
  );
  const [routeModalPosition, setRouteModalPosition] = useState<Point | null>(
    null,
  );
  const [newRouteName, setNewRouteName] = useState("");
  const [newRouteCategory, setNewRouteCategory] =
    useState<RouteCategory>("Estrada");
  const [newRouteColor, setNewRouteColor] = useState("#A855F7");
  const [newRouteSupplies, setNewRouteSupplies] = useState(1);
  const [newRouteObstacles, setNewRouteObstacles] = useState(1);
  const [newRouteNotes, setNewRouteNotes] = useState("");

  // Handle zooming using scroll wheel
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    if (cameraLocked) return;

    const container = containerRef.current;
    if (!container) return;

    const zoomFactor = 1.08;
    const zoomDirection = e.deltaY < 0 ? 1 : -1;
    const nextZoom = zoom * Math.pow(zoomFactor, zoomDirection);
    // Bound zoom between 0.2x and 5x
    const boundedZoom = Math.max(0.2, Math.min(5, nextZoom));

    if (Math.abs(boundedZoom - zoom) < 0.01) return;

    const rect = container.getBoundingClientRect();
    const viewportOffset = {
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    };
    const zoomRatio = boundedZoom / zoom;

    commitPan({
      x:
        viewportOffset.x -
        (viewportOffset.x - precisePanRef.current.x) * zoomRatio,
      y:
        viewportOffset.y -
        (viewportOffset.y - precisePanRef.current.y) * zoomRatio,
    });
    setZoom(boundedZoom);
  };

  // Convert client cursor coordinates to map space coordinates
  const getMapCoordinates = (clientX: number, clientY: number): Point => {
    if (!containerRef.current) {
      return { x: 0, y: 0 };
    }
    // Stable conversion regardless of hovered SVG/HTML children.
    const rect = containerRef.current.getBoundingClientRect();
    const viewportCenterX = rect.width / 2;
    const viewportCenterY = rect.height / 2;
    const mapCenter = getMapCenterPoint(campaign);
    const x =
      (clientX - rect.left - viewportCenterX - pan.x) / zoom + mapCenter.x;
    const y =
      (clientY - rect.top - viewportCenterY - pan.y) / zoom + mapCenter.y;
    return {
      x: Math.round(Math.max(0, Math.min(campaign.mapWidth, x))),
      y: Math.round(Math.max(0, Math.min(campaign.mapHeight, y))),
    };
  };

  const mapToScreenPoint = (mapPoint: Point): Point => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const mapCenter = getMapCenterPoint(campaign);
    return {
      x: rect.width / 2 + pan.x + (mapPoint.x - mapCenter.x) * zoom,
      y: rect.height / 2 + pan.y + (mapPoint.y - mapCenter.y) * zoom,
    };
  };

  // Snapping Engine: Snaps coordinate to nearest Route Point or POI within a threshold
  const getSnappedPoint = (coords: Point): Point => {
    if (!coords) return { x: 0, y: 0 };
    let closestPoint = coords;
    const snapRadius = 22;
    let minDistanceSq = snapRadius * snapRadius;

    // Snap to pins (POIs)
    if (campaign && campaign.pois) {
      campaign.pois.forEach((poi) => {
        if (!poi) return;
        const dx = coords.x - poi.x;
        const dy = coords.y - poi.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < minDistanceSq) {
          minDistanceSq = distSq;
          closestPoint = { x: poi.x, y: poi.y };
        }
      });
    }

    // Snap to route vertex nodes
    if (campaign && campaign.routes) {
      campaign.routes.forEach((route) => {
        if (!route || !route.points) return;
        route.points.forEach((pt) => {
          if (!pt) return;
          const dx = coords.x - pt.x;
          const dy = coords.y - pt.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < minDistanceSq) {
            minDistanceSq = distSq;
            closestPoint = pt;
          }
        });
      });
    }

    return closestPoint;
  };

  // Drawing mode key listener (Enter to complete, Escape to cancel)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (activeTool === "draw-poly" && drawingPoints.length >= 3) {
          completePolygon();
        } else if (
          activeTool === "draw-route" &&
          drawingRoutePoints.length >= 2
        ) {
          completeRoute();
        }
      } else if (e.key === "Escape") {
        if (activeTool === "draw-poly") {
          setDrawingPoints([]);
          setActiveTool("select");
        } else if (pendingRegionPoints) {
          setPendingRegionPoints(null);
        } else if (activeTool === "draw-route") {
          setDrawingRoutePoints([]);
          setActiveTool("select");
        } else if (activeTool === "ruler") {
          setRulerPoints([]);
        } else if (pendingRoutePoints) {
          setPendingRoutePoints(null);
          setRouteModalPosition(null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    activeTool,
    drawingPoints,
    drawingRoutePoints,
    rulerPoints,
    pendingRegionPoints,
    pendingRoutePoints,
  ]);

  useEffect(() => {
    panRef.current = pan;
    precisePanRef.current = pan;
    renderedPanRef.current = pan;
  }, [pan]);

  // Use native non-passive wheel listener to allow preventDefault without warnings.
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      element.removeEventListener("wheel", handleWheel);
    };
  }, [zoom, cameraLocked]);

  // Mouse Down: handle pan start or drawing actions
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    // Only handle left click
    if (e.button !== 0) return;

    let coords = getMapCoordinates(e.clientX, e.clientY);

    // Apply snapping only for route authoring.
    if (activeTool === "draw-route") {
      coords = getSnappedPoint(coords);
    }

    // Drop new POI
    if (activeTool === "pin") {
      setNewPoiData(coords);
      return;
    }

    // Drop new Comment
    if (activeTool === "comment") {
      setNewCommentData(coords);
      return;
    }

    // Ruler measurement tool
    if (activeTool === "ruler") {
      if (rulerPoints.length >= 2) {
        setRulerPoints([coords]);
      } else {
        setRulerPoints([...rulerPoints, coords]);
      }
      return;
    }

    // Region drawing mode
    if (activeTool === "draw-poly") {
      // If close to first point, complete polygon
      if (
        drawingPoints.length > 2 &&
        getDistancePx(coords, drawingPoints[0]) < 15
      ) {
        completePolygon();
      } else {
        setDrawingPoints([...drawingPoints, coords]);
      }
      return;
    }

    // Route drawing mode
    if (activeTool === "draw-route") {
      setDrawingRoutePoints([...drawingRoutePoints, coords]);
      return;
    }

    // Pan mode or dragging vertex or dragging elements
    if (
      !cameraLocked &&
      (activeTool === "pan" ||
        e.target === containerRef.current ||
        (e.target as SVGElement).id === "map-background")
    ) {
      setIsPanning(true);
      setPanStart({
        x: e.clientX - precisePanRef.current.x,
        y: e.clientY - precisePanRef.current.y,
      });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rawCoords = getMapCoordinates(e.clientX, e.clientY);

    // Keep ruler preview stable while preserving performance elsewhere.
    const previewCoords =
      activeTool === "ruler" ? getSnappedPoint(rawCoords) : rawCoords;
    setCursorPos(previewCoords);

    if (isPanning) {
      commitPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    // Dragging Entire Region
    if (draggingRegionId && dragStartCoords) {
      if (layerLocks["regioes"]) {
        return;
      }
      const dx = rawCoords.x - dragStartCoords.x;
      const dy = rawCoords.y - dragStartCoords.y;

      if (dx !== 0 || dy !== 0) {
        const updatedRegions = campaign.regions.map((r) => {
          if (r.id === draggingRegionId) {
            const newPoints = r.points.map((p) => ({
              x: p.x + dx,
              y: p.y + dy,
            }));
            return { ...r, points: newPoints };
          }
          return r;
        });
        updateCampaign({ ...campaign, regions: updatedRegions });
        setDragStartCoords(rawCoords);
      }
      return;
    }

    // Dragging Region Vertex
    if (activeVertex && selectedElement.type === "region") {
      if (layerLocks["regioes"]) {
        return;
      }
      const updatedRegions = campaign.regions.map((r) => {
        if (r.id === activeVertex.regionId) {
          const newPoints = [...r.points];
          newPoints[activeVertex.index] = rawCoords;
          return { ...r, points: newPoints };
        }
        return r;
      });
      updateCampaign({ ...campaign, regions: updatedRegions });
      return;
    }

    // Dragging Route Node (Support Snapping to Pins)
    if (activeRouteVertex && selectedElement.type === "route") {
      if (layerLocks["rotas"]) {
        return;
      }
      const snappedCoords = getSnappedPoint(rawCoords);
      const updatedRoutes = campaign.routes.map((r) => {
        if (r.id === activeRouteVertex.routeId) {
          const newPoints = [...r.points];
          newPoints[activeRouteVertex.index] = snappedCoords;
          return { ...r, points: newPoints };
        }
        return r;
      });
      updateCampaign({ ...campaign, routes: updatedRoutes });
      return;
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setActiveVertex(null);
    setActiveRouteVertex(null);
    setDraggingRegionId(null);
    setDragStartCoords(null);
  };

  const handleMouseLeave = () => {
    setIsPanning(false);
    if (activeTool !== "ruler") {
      setCursorPos(null);
    }
  };

  const getDistancePx = (p1: Point, p2: Point): number => {
    if (
      !p1 ||
      !p2 ||
      typeof p1.x !== "number" ||
      typeof p1.y !== "number" ||
      typeof p2.x !== "number" ||
      typeof p2.y !== "number"
    ) {
      return Infinity;
    }
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  };

  const getDistanceKm = (p1: Point, p2: Point): number => {
    const pixelDistance = getDistancePx(p1, p2);
    return Number.isFinite(pixelDistance)
      ? pixelDistance * kmPerPixel
      : Infinity;
  };

  // Create a new POI Pin
  const handleSavePOI = () => {
    if (!newPoiData || !newPoiName.trim()) return;
    const newPoi: POI = {
      id: `poi-${Date.now()}`,
      name: newPoiName.trim(),
      type: newPoiType,
      x: newPoiData.x,
      y: newPoiData.y,
      description: `Um marco importante estabelecido no mapa.`,
    };

    updateCampaign({
      ...campaign,
      pois: [...campaign.pois, newPoi],
    });

    setNewPoiData(null);
    setNewPoiName("");
    setActiveTool("select");
    setSelectedElement({ type: "poi", id: newPoi.id });
  };

  // Create a new Map Comment
  const handleSaveComment = () => {
    if (!newCommentData || !newCommentContent.trim()) return;
    const newComment: MapComment = {
      id: `comment-${Date.now()}`,
      author: newCommentAuthor.trim() || "Mestre",
      avatar: (newCommentAuthor.trim() || "Mestre").charAt(0).toUpperCase(),
      content: newCommentContent.trim(),
      x: newCommentData.x,
      y: newCommentData.y,
      date:
        "Hoje às " +
        new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      resolved: false,
    };

    updateCampaign({
      ...campaign,
      comments: [...campaign.comments, newComment],
    });

    setNewCommentData(null);
    setNewCommentContent("");
    setActiveTool("select");
  };

  // Finish polygon drawing
  const completePolygon = () => {
    if (drawingPoints.length < 3) return;
    setNewRegionName(`Nova Região #${campaign.regions.length + 1}`);
    setNewRegionType("Outro");
    setNewRegionBiome("Pradarias");
    setNewRegionClimate("Moderado");
    setNewRegionColor(
      "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0"),
    );
    setNewRegionDescription("Uma área recém mapeada pelo mestre da campanha.");
    setPendingRegionPoints(drawingPoints);

    setDrawingPoints([]);
  };

  const handleSaveRegion = () => {
    if (!pendingRegionPoints || pendingRegionPoints.length < 3) return;
    const newRegion: Region = {
      id: `reg-${Date.now()}`,
      name:
        newRegionName.trim() || `Nova Região #${campaign.regions.length + 1}`,
      type: newRegionType,
      biome: newRegionBiome.trim() || "Pradarias",
      climate: newRegionClimate.trim() || "Moderado",
      color: newRegionColor,
      opacity: 0.15,
      tags: ["nova", "explorar"],
      description:
        newRegionDescription.trim() ||
        "Uma área recém mapeada pelo mestre da campanha.",
      notes: "Adicione anotações para sua aventura.",
      points: pendingRegionPoints,
    };

    updateCampaign({
      ...campaign,
      regions: [...campaign.regions, newRegion],
    });

    setPendingRegionPoints(null);
    setActiveTool("select");
    setSelectedElement({ type: "region", id: newRegion.id });
  };

  // Finish route drawing
  const completeRoute = () => {
    if (drawingRoutePoints.length < 2) return;

    let totalDistKm = 0;
    for (let i = 0; i < drawingRoutePoints.length - 1; i++) {
      totalDistKm += getDistanceKm(
        drawingRoutePoints[i],
        drawingRoutePoints[i + 1],
      );
    }
    const calculatedKm = Math.round(totalDistKm);

    setNewRouteName(`Nova Rota #${campaign.routes.length + 1}`);
    setNewRouteCategory("Estrada");
    setNewRouteColor("#A855F7");
    setNewRouteSupplies(Math.max(1, Math.round(calculatedKm / 80)));
    setNewRouteObstacles(Math.max(1, Math.round(calculatedKm / 50)));
    setNewRouteNotes("Nova rota de viagem desenhada manualmente.");

    const lastPoint = drawingRoutePoints[drawingRoutePoints.length - 1];
    if (lastPoint) {
      setRouteModalPosition(mapToScreenPoint(lastPoint));
    }
    setPendingRoutePoints(drawingRoutePoints);
    setDrawingRoutePoints([]);
  };

  useEffect(() => {
    if (!pendingRoutePoints || pendingRoutePoints.length === 0) return;
    const lastPoint = pendingRoutePoints[pendingRoutePoints.length - 1];
    setRouteModalPosition(mapToScreenPoint(lastPoint));
  }, [pendingRoutePoints, pan, zoom]);

  const handleSaveRoute = () => {
    if (!pendingRoutePoints || pendingRoutePoints.length < 2) return;

    let totalDistKm = 0;
    for (let i = 0; i < pendingRoutePoints.length - 1; i++) {
      totalDistKm += getDistanceKm(
        pendingRoutePoints[i],
        pendingRoutePoints[i + 1],
      );
    }
    const calculatedKm = Math.round(totalDistKm);

    const newRoute: Route = {
      id: `route-${Date.now()}`,
      name: newRouteName.trim() || `Nova Rota #${campaign.routes.length + 1}`,
      color: newRouteColor,
      points: pendingRoutePoints,
      length: calculatedKm,
      suppliesCost: newRouteSupplies,
      obstaclesCount: newRouteObstacles,
      category: newRouteCategory,
      obstaclesDescription: "Caminho acidentado e sem patrulha.",
      crossingsCount: 0,
      notes: newRouteNotes.trim(),
    };

    updateCampaign({
      ...campaign,
      routes: [...campaign.routes, newRoute],
    });

    setPendingRoutePoints(null);
    setRouteModalPosition(null);
    setActiveTool("select");
    setSelectedElement({ type: "route", id: newRoute.id });
  };

  // Add vertex on segment click (double click on edge to refine shapes)
  const handleEdgeClick = (regionId: string, idx: number, e: MouseEvent) => {
    e.stopPropagation();
    if (activeTool !== "select" || layerLocks["regioes"]) return;

    const region = campaign.regions.find((r) => r.id === regionId);
    if (!region) return;

    const clickCoords = getMapCoordinates(e.clientX, e.clientY);

    // Insert new vertex in between idx and idx+1
    const newPoints = [...region.points];
    newPoints.splice(idx + 1, 0, clickCoords);

    const updatedRegions = campaign.regions.map((r) => {
      if (r.id === regionId) {
        return { ...r, points: newPoints };
      }
      return r;
    });

    updateCampaign({ ...campaign, regions: updatedRegions });
  };

  // Delete vertex from region
  const handleDeleteVertex = (regionId: string, idx: number, e: MouseEvent) => {
    e.stopPropagation();
    if (layerLocks["regioes"]) return;
    const region = campaign.regions.find((r) => r.id === regionId);
    if (!region || region.points.length <= 3) return; // Must have at least 3 points

    const newPoints = region.points.filter((_, i) => i !== idx);
    const updatedRegions = campaign.regions.map((r) => {
      if (r.id === regionId) {
        return { ...r, points: newPoints };
      }
      return r;
    });

    updateCampaign({ ...campaign, regions: updatedRegions });
  };

  // Clear comment or resolver
  const handleResolveComment = (commentId: string, e: MouseEvent) => {
    e.stopPropagation();
    const updatedComments = campaign.comments.map((c) => {
      if (c.id === commentId) return { ...c, resolved: true };
      return c;
    });
    updateCampaign({ ...campaign, comments: updatedComments });
  };

  const handleDeleteComment = (commentId: string, e: MouseEvent) => {
    e.stopPropagation();
    const filtered = campaign.comments.filter((c) => c.id !== commentId);
    updateCampaign({ ...campaign, comments: filtered });
    setSelectedElement({ type: null, id: null });
  };

  // Helper icons getter
  const getPoiIcon = (type: POIType, size = 18) => {
    switch (type) {
      case "Castelo":
        return <Castle size={size} />;
      case "Cidade":
        return <Home size={size} />;
      case "Porto":
        return <Anchor size={size} />;
      case "Templo":
        return <Compass size={size} />;
      case "Vila":
        return <Home size={size} className="scale-75" />;
      case "Ruína":
        return <HelpCircle size={size} />;
      case "Acampamento":
        return <Shield size={size} />;
      default:
        return <MapPin size={size} />;
    }
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
      style={{
        cursor:
          activeTool === "pan"
            ? "grab"
            : activeTool === "select"
              ? "default"
              : "crosshair",
      }}
    >
      {/* MAP STAGE (Zoom and Pan container) */}
      <div
        className="absolute origin-center"
        style={{
          width: `${campaign.mapWidth}px`,
          height: `${campaign.mapHeight}px`,
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        {/* SVG/Raster Background Map */}
        <svg
          id="map-background"
          className="absolute inset-0 w-full h-full shadow-2xl overflow-visible"
          viewBox={`0 0 ${campaign.mapWidth} ${campaign.mapHeight}`}
        >
          <defs>
            {/* Elegant Map Gradients and textures */}
            <linearGradient id="sea-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                stopColor={isDarkTheme ? "#131622" : "#E2D7C5"}
              />
              <stop
                offset="100%"
                stopColor={isDarkTheme ? "#0a0c10" : "#CDBC9E"}
              />
            </linearGradient>

            <pattern
              id="grid-pattern"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 100 0 L 0 0 0 100"
                fill="none"
                stroke={
                  isDarkTheme
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(62, 47, 31, 0.2)"
                }
                strokeWidth="1"
              />
            </pattern>

            <filter
              id="parchment-noise"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.04"
                numOctaves="4"
                result="noise"
              />
              <feColorMatrix
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.07 0"
              />
              <feComposite operator="in" in2="SourceGraphic" />
            </filter>

            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Sea / Parchment Base */}
          {campaign.mapUrl ? (
            // User Uploaded Map
            <image
              href={campaign.mapUrl}
              width={campaign.mapWidth}
              height={campaign.mapHeight}
              preserveAspectRatio="xMidYMid slice"
            />
          ) : (
            // Native Procedural RPG Map Styling (When no custom background)
            <>
              <rect width="100%" height="100%" fill="url(#sea-grad)" />
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
              <rect
                width="100%"
                height="100%"
                filter="url(#parchment-noise)"
                opacity="0.8"
              />

              {/* Cartographic decorations */}
              {/* Coastlines */}
              <path
                d="M 100,200 C 300,180 400,250 500,350 C 600,450 450,700 350,780 C 250,860 150,900 120,1100 C 100,1200 300,1250 600,1200 C 800,1170 950,1100 1100,1150 C 1250,1200 1350,1300 1500,1280 C 1700,1250 1850,1100 1900,900 C 1950,700 1800,550 1750,400 C 1700,250 1800,150 1600,100 C 1400,60 1200,180 1000,150 C 800,120 700,250 500,200 Z"
                fill={isDarkTheme ? "#1a1e2d" : "#EDE5D6"}
                stroke={isDarkTheme ? "rgba(255,255,255,0.06)" : "#C0AF92"}
                strokeWidth="2"
                filter="url(#parchment-noise)"
              />
              <path
                d="M 100,200 C 300,180 400,250 500,350 C 600,450 450,700 350,780 C 250,860 150,900 120,1100 C 100,1200 300,1250 600,1200 C 800,1170 950,1100 1100,1150 C 1250,1200 1350,1300 1500,1280 C 1700,1250 1850,1100 1900,900 C 1950,700 1800,550 1750,400 C 1700,250 1800,150 1600,100 C 1400,60 1200,180 1000,150 C 800,120 700,250 500,200 Z"
                fill="none"
                stroke={isDarkTheme ? "rgba(255,255,255,0.03)" : "#D8CBB6"}
                strokeWidth="6"
              />

              {/* Mountains and Forests Hand-Drawn style Vector Stamps (Plausible RPG Icons) */}
              {/* Snowy Mountains representation at the top */}
              <g
                fill="none"
                stroke={isDarkTheme ? "rgba(255,255,255,0.1)" : "#9E8E76"}
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M 200,180 L 250,110 L 300,180 M 250,110 L 250,180" />
                <path d="M 230,140 L 250,145 L 270,140" />
                <path d="M 270,180 L 320,100 L 370,180 M 320,100 L 320,180" />
                <path d="M 450,160 L 500,90 L 550,160" />
                <path d="M 700,170 L 740,110 L 780,170" />
              </g>

              {/* Decorative Rivers */}
              <path
                d="M 1000,300 Q 950,550 1100,700 T 1000,1100 Q 1000,1200 1000,1300"
                fill="none"
                stroke={isDarkTheme ? "#1E2B3E" : "#A6C2D4"}
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Compass Rose */}
              <g
                transform="translate(1800, 200)"
                opacity={isDarkTheme ? 0.15 : 0.25}
                className="pointer-events-none"
              >
                <circle
                  cx="0"
                  cy="0"
                  r="80"
                  fill="none"
                  stroke={isDarkTheme ? "#fff" : "#3E2F1F"}
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
                <path
                  d="M -90,0 L 90,0 M 0,-90 L 0,90"
                  stroke={isDarkTheme ? "#fff" : "#3E2F1F"}
                  strokeWidth="0.5"
                />
                {/* 4 points */}
                <polygon
                  points="0,-100 12,-15 0,0"
                  fill={isDarkTheme ? "#90a4ae" : "#8c7b65"}
                />
                <polygon
                  points="0,-100 -12,-15 0,0"
                  fill={isDarkTheme ? "#cfd8dc" : "#a8967f"}
                />
                <polygon
                  points="0,100 12,15 0,0"
                  fill={isDarkTheme ? "#cfd8dc" : "#a8967f"}
                />
                <polygon
                  points="0,100 -12,15 0,0"
                  fill={isDarkTheme ? "#90a4ae" : "#8c7b65"}
                />
                <polygon
                  points="100,0 15,12 0,0"
                  fill={isDarkTheme ? "#cfd8dc" : "#a8967f"}
                />
                <polygon
                  points="100,0 15,-12 0,0"
                  fill={isDarkTheme ? "#90a4ae" : "#8c7b65"}
                />
                <polygon
                  points="-100,0 -15,12 0,0"
                  fill={isDarkTheme ? "#90a4ae" : "#8c7b65"}
                />
                <polygon
                  points="-100,0 -15,-12 0,0"
                  fill={isDarkTheme ? "#cfd8dc" : "#a8967f"}
                />
                {/* Text labels */}
                <text
                  x="-5"
                  y="-105"
                  fill={isDarkTheme ? "#fff" : "#3E2F1F"}
                  fontSize="14"
                  fontWeight="bold"
                >
                  N
                </text>
                <text
                  x="-5"
                  y="115"
                  fill={isDarkTheme ? "#fff" : "#3E2F1F"}
                  fontSize="14"
                  fontWeight="bold"
                >
                  S
                </text>
                <text
                  x="110"
                  y="5"
                  fill={isDarkTheme ? "#fff" : "#3E2F1F"}
                  fontSize="14"
                  fontWeight="bold"
                >
                  L
                </text>
                <text
                  x="-125"
                  y="5"
                  fill={isDarkTheme ? "#fff" : "#3E2F1F"}
                  fontSize="14"
                  fontWeight="bold"
                >
                  O
                </text>
              </g>

              {/* Big stylish typography labels directly drawn on map */}
              <text
                x="350"
                y="600"
                fill={
                  isDarkTheme ? "rgba(255,255,255,0.04)" : "rgba(62,47,31,0.08)"
                }
                fontSize="32"
                fontFamily="var(--font-display)"
                letterSpacing="12"
                fontWeight="bold"
              >
                FLORESTA DE ELDRIA
              </text>
              <text
                x="1000"
                y="650"
                fill={
                  isDarkTheme ? "rgba(255,255,255,0.04)" : "rgba(62,47,31,0.08)"
                }
                fontSize="36"
                fontFamily="var(--font-display)"
                letterSpacing="16"
                fontWeight="bold"
              >
                REINO DE VALTHOR
              </text>
              <text
                x="1600"
                y="700"
                fill={
                  isDarkTheme ? "rgba(255,255,255,0.04)" : "rgba(62,47,31,0.08)"
                }
                fontSize="32"
                fontFamily="var(--font-display)"
                letterSpacing="12"
                fontWeight="bold"
              >
                DESERTO DE AREIA
              </text>
              <text
                x="350"
                y="130"
                fill={
                  isDarkTheme ? "rgba(255,255,255,0.04)" : "rgba(62,47,31,0.08)"
                }
                fontSize="32"
                fontFamily="var(--font-display)"
                letterSpacing="12"
                fontWeight="bold"
              >
                MONTANHAS GÉLIDAS
              </text>
              <text
                x="1200"
                y="1250"
                fill={
                  isDarkTheme ? "rgba(255,255,255,0.04)" : "rgba(62,47,31,0.08)"
                }
                fontSize="32"
                fontFamily="var(--font-display)"
                letterSpacing="12"
                fontWeight="bold"
              >
                MAR DE NEBLINA
              </text>
            </>
          )}

          {/* DYNAMIC ORDERED SVG LAYERS */}
          {[...layerOrder].reverse().map((layerId) => {
            if (layerId === "regioes") {
              return (
                <g id="regioes-layer" key="regioes-layer">
                  {layerVisibility["regioes"] &&
                    campaign.regions.map((region) => {
                      const isSelected =
                        selectedElement.type === "region" &&
                        selectedElement.id === region.id;
                      const isHovered = hoveredRegionId === region.id;

                      // Build polygon points string
                      const pointsStr = region.points
                        .map((p) => `${p.x},${p.y}`)
                        .join(" ");

                      return (
                        <g key={region.id} className="group/region">
                          {/* Region Polygon shape */}
                          <polygon
                            points={pointsStr}
                            fill={region.color}
                            fillOpacity={
                              isSelected
                                ? 0.25
                                : isHovered
                                  ? 0.2
                                  : region.opacity
                            }
                            stroke={region.color}
                            strokeWidth={isSelected ? 3 : isHovered ? 2 : 1}
                            strokeDasharray={
                              region.type === "Floresta" ? "4,4" : undefined
                            }
                            className={`transition-all duration-150 cursor-pointer ${isSelected ? "region-selected" : ""}`}
                            onMouseDown={(e) => {
                              if (
                                !layerLocks["regioes"] &&
                                (activeTool === "select" ||
                                  activeTool === "pan")
                              ) {
                                e.stopPropagation();
                                setSelectedElement({
                                  type: "region",
                                  id: region.id,
                                });
                                setDraggingRegionId(region.id);
                                const coords = getMapCoordinates(
                                  e.clientX,
                                  e.clientY,
                                );
                                setDragStartCoords(coords);
                              }
                            }}
                            onClick={(e) => {
                              if (
                                !layerLocks["regioes"] &&
                                (activeTool === "select" ||
                                  activeTool === "pan")
                              ) {
                                e.stopPropagation();
                                setSelectedElement({
                                  type: "region",
                                  id: region.id,
                                });
                                setActiveTool("select");
                              }
                            }}
                            onMouseEnter={() => setHoveredRegionId(region.id)}
                            onMouseLeave={() => setHoveredRegionId(null)}
                          />

                          {/* Draw segment click targets for refinement when selected */}
                          {isSelected &&
                            activeTool === "select" &&
                            region.points.map((p, idx) => {
                              const nextP =
                                region.points[(idx + 1) % region.points.length];
                              const midX = (p.x + nextP.x) / 2;
                              const midY = (p.y + nextP.y) / 2;

                              return (
                                <circle
                                  key={`edge-${idx}`}
                                  cx={midX}
                                  cy={midY}
                                  r="5"
                                  fill="#10B981"
                                  stroke="#fff"
                                  strokeWidth="1.5"
                                  className="cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-150"
                                  onClick={(e) =>
                                    handleEdgeClick(region.id, idx, e)
                                  }
                                />
                              );
                            })}
                        </g>
                      );
                    })}
                </g>
              );
            }

            if (layerId === "rotas") {
              return (
                <g id="rotas-layer" key="rotas-layer">
                  {layerVisibility["rotas"] &&
                    campaign.routes.map((route) => {
                      const isSelected =
                        selectedElement.type === "route" &&
                        selectedElement.id === route.id;
                      const isHovered = hoveredRouteId === route.id;
                      const isPartofActiveTravel =
                        campaign.travelPlan.selectedRouteIds.includes(route.id);

                      // Create SVG path string
                      const pathData = route.points
                        .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
                        .join(" ");

                      return (
                        <g key={route.id}>
                          {/* Wider invisible mouse target line */}
                          <path
                            d={pathData}
                            fill="none"
                            stroke="transparent"
                            strokeWidth="20"
                            className="cursor-pointer"
                            onClick={(e) => {
                              if (
                                !layerLocks["rotas"] &&
                                (activeTool === "select" ||
                                  activeTool === "pan")
                              ) {
                                e.stopPropagation();
                                setSelectedElement({
                                  type: "route",
                                  id: route.id,
                                });
                                setActiveTool("select");
                              }
                            }}
                            onMouseEnter={() => setHoveredRouteId(route.id)}
                            onMouseLeave={() => setHoveredRouteId(null)}
                          />

                          {/* Visual Route line */}
                          <path
                            d={pathData}
                            fill="none"
                            stroke={route.color}
                            strokeWidth={
                              isSelected
                                ? 4
                                : isHovered
                                  ? 3
                                  : isPartofActiveTravel
                                    ? 3.5
                                    : 2
                            }
                            strokeDasharray={
                              route.category === "Trilha"
                                ? "6,4"
                                : route.category === "Túneis"
                                  ? "2,4"
                                  : undefined
                            }
                            className="transition-all duration-150 pointer-events-none"
                            filter={
                              isSelected || isPartofActiveTravel
                                ? "url(#glow)"
                                : undefined
                            }
                          />
                        </g>
                      );
                    })}
                </g>
              );
            }

            if (layerId === "travessias") {
              return (
                <g key="travessias-layer">
                  {layerVisibility["travessias"] &&
                    campaign.travelPlan &&
                    campaign.travelPlan.selectedRouteIds.length > 0 && (
                      <g className="pointer-events-none">
                        {campaign.travelPlan.selectedRouteIds.map((routeId) => {
                          const route = campaign.routes.find(
                            (r) => r.id === routeId,
                          );
                          if (!route) return null;
                          const pathData = route.points
                            .map(
                              (p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`,
                            )
                            .join(" ");
                          return (
                            <path
                              key={`travel-path-glow-${route.id}`}
                              d={pathData}
                              fill="none"
                              stroke="#F59E0B"
                              strokeWidth="5"
                              className="opacity-90"
                              filter="url(#glow)"
                            />
                          );
                        })}
                      </g>
                    )}
                </g>
              );
            }

            if (layerId === "grade") {
              return (
                <g key="grade-layer">
                  {layerVisibility["grade"] && (
                    <rect
                      width="100%"
                      height="100%"
                      fill="url(#grid-pattern)"
                      pointerEvents="none"
                    />
                  )}
                </g>
              );
            }

            return null;
          })}

          {/* Draw active nodes of selected region / route for vertex reshaping */}
          {activeTool === "select" &&
            selectedElement.type === "region" &&
            campaign.regions
              .find((r) => r.id === selectedElement.id)
              ?.points.map((p, idx) => {
                return (
                  <circle
                    key={`vertex-${idx}`}
                    cx={p.x}
                    cy={p.y}
                    r="7"
                    fill="#3B82F6"
                    stroke="#fff"
                    strokeWidth="2"
                    className="cursor-move hover:fill-blue-400 hover:stroke-amber-400 transition-colors duration-150"
                    onMouseDown={(e) => {
                      if (layerLocks["regioes"]) return;
                      e.stopPropagation();
                      setActiveVertex({
                        regionId: selectedElement.id!,
                        index: idx,
                      });
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      handleDeleteVertex(selectedElement.id!, idx, e);
                    }}
                  />
                );
              })}

          {activeTool === "select" &&
            selectedElement.type === "route" &&
            campaign.routes
              .find((r) => r.id === selectedElement.id)
              ?.points.map((p, idx) => {
                return (
                  <circle
                    key={`rvertex-${idx}`}
                    cx={p.x}
                    cy={p.y}
                    r="6"
                    fill="#A855F7"
                    stroke="#fff"
                    strokeWidth="2"
                    className="cursor-move hover:fill-purple-400 hover:stroke-amber-400 transition-colors duration-150"
                    onMouseDown={(e) => {
                      if (layerLocks["rotas"]) return;
                      e.stopPropagation();
                      setActiveRouteVertex({
                        routeId: selectedElement.id!,
                        index: idx,
                      });
                    }}
                  />
                );
              })}

          {/* RULER MEASUREMENT LAYER */}
          {activeTool === "ruler" && rulerPoints.length > 0 && (
            <g>
              <circle
                cx={rulerPoints[0].x}
                cy={rulerPoints[0].y}
                r="5"
                fill="#EF4444"
                stroke="#fff"
                strokeWidth="1.5"
              />
              {rulerPoints.length === 2 && (
                <>
                  <line
                    x1={rulerPoints[0].x}
                    y1={rulerPoints[0].y}
                    x2={rulerPoints[1].x}
                    y2={rulerPoints[1].y}
                    stroke="#EF4444"
                    strokeWidth="2"
                    strokeDasharray="6,4"
                  />
                  <circle
                    cx={rulerPoints[1].x}
                    cy={rulerPoints[1].y}
                    r="5"
                    fill="#EF4444"
                    stroke="#fff"
                    strokeWidth="1.5"
                  />
                  {/* Floating distance bubble */}
                  <g
                    transform={`translate(${(rulerPoints[0].x + rulerPoints[1].x) / 2}, ${(rulerPoints[0].y + rulerPoints[1].y) / 2 - 15})`}
                  >
                    <rect
                      x="-50"
                      y="-12"
                      width="100"
                      height="24"
                      rx="12"
                      fill="#EF4444"
                      stroke="#fff"
                      strokeWidth="1"
                    />
                    <text
                      textAnchor="middle"
                      y="4"
                      fill="#fff"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {Math.round(
                        getDistanceKm(rulerPoints[0], rulerPoints[1]),
                      )}{" "}
                      km
                    </text>
                  </g>
                </>
              )}
              {rulerPoints.length === 1 && cursorPos && (
                <>
                  <line
                    x1={rulerPoints[0].x}
                    y1={rulerPoints[0].y}
                    x2={cursorPos.x}
                    y2={cursorPos.y}
                    stroke="#EF4444"
                    strokeWidth="2"
                    strokeDasharray="6,4"
                  />
                  <circle
                    cx={cursorPos.x}
                    cy={cursorPos.y}
                    r="5"
                    fill="#EF4444"
                    stroke="#fff"
                    strokeWidth="1.5"
                  />
                  {/* Floating distance bubble */}
                  <g
                    transform={`translate(${(rulerPoints[0].x + cursorPos.x) / 2}, ${(rulerPoints[0].y + cursorPos.y) / 2 - 15})`}
                  >
                    <rect
                      x="-50"
                      y="-12"
                      width="100"
                      height="24"
                      rx="12"
                      fill="#EF4444"
                      stroke="#fff"
                      strokeWidth="1"
                    />
                    <text
                      textAnchor="middle"
                      y="4"
                      fill="#fff"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {Math.round(getDistanceKm(rulerPoints[0], cursorPos))} km
                    </text>
                  </g>
                </>
              )}
            </g>
          )}

          {/* POLYGON DRAWING IN-PROGRESS LAYER */}
          {activeTool === "draw-poly" && drawingPoints.length > 0 && (
            <g>
              <polyline
                points={drawingPoints.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke="#10B981"
                strokeWidth="2"
              />
              {drawingPoints.map((p, idx) => (
                <circle
                  key={`draw-v-${idx}`}
                  cx={p.x}
                  cy={p.y}
                  r={idx === 0 ? "7" : "5"}
                  fill={idx === 0 ? "#EF4444" : "#10B981"}
                  stroke="#fff"
                  strokeWidth="1.5"
                  className={
                    idx === 0
                      ? "cursor-pointer hover:fill-red-400 hover:stroke-amber-400 transition-colors"
                      : ""
                  }
                />
              ))}
            </g>
          )}

          {/* ROUTE DRAWING IN-PROGRESS LAYER */}
          {activeTool === "draw-route" && drawingRoutePoints.length > 0 && (
            <g>
              <polyline
                points={drawingRoutePoints
                  .map((p) => `${p.x},${p.y}`)
                  .join(" ")}
                fill="none"
                stroke="#A855F7"
                strokeWidth="2.5"
                strokeDasharray="6,4"
              />
              {drawingRoutePoints.map((p, idx) => (
                <circle
                  key={`draw-rv-${idx}`}
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  fill="#A855F7"
                  stroke="#fff"
                  strokeWidth="1"
                />
              ))}
            </g>
          )}
        </svg>

        {/* LAYER 3: POINTS OF INTEREST / PINS (HTML Overlays for absolute responsiveness) */}
        {layerVisibility["pins"] &&
          campaign.pois.map((poi) => {
            const isSelected =
              selectedElement.type === "poi" && selectedElement.id === poi.id;
            const isHovered = hoveredPoiId === poi.id;

            return (
              <div
                key={poi.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-150 select-none"
                style={{
                  left: `${poi.x}px`,
                  top: `${poi.y}px`,
                  zIndex: getLayerZIndex("pins"),
                }}
                onMouseDown={(e) => {
                  if (activeTool === "select" || activeTool === "pan") {
                    e.stopPropagation();
                  }
                }}
                onClick={(e) => {
                  if (
                    !layerLocks["pins"] &&
                    (activeTool === "select" || activeTool === "pan")
                  ) {
                    e.stopPropagation();
                    setSelectedElement({ type: "poi", id: poi.id });
                    setActiveTool("select");
                  }
                }}
                onMouseEnter={() => setHoveredPoiId(poi.id)}
                onMouseLeave={() => setHoveredPoiId(null)}
              >
                {/* Beautiful Floating Pin Card */}
                <div
                  className={`flex flex-col items-center transition-transform duration-100 ${isHovered || isSelected ? "scale-110" : "scale-100"}`}
                >
                  {/* Marker Node with Glow */}
                  <div
                    className={`p-2 rounded-full border shadow-lg ${
                      isSelected
                        ? "bg-blue-600 border-white text-white scale-110 ring-4 ring-blue-500/30"
                        : isHovered
                          ? "bg-amber-500 border-amber-300 text-white"
                          : isDarkTheme
                            ? "bg-slate-900 border-slate-700 text-amber-400"
                            : "bg-parchment-100 border-parchment-300 text-amber-700"
                    }`}
                  >
                    {getPoiIcon(poi.type, 18)}
                  </div>
                  {/* Pin Label with Fantasy Typography */}
                  <span
                    className={`mt-1.5 px-2 py-0.5 rounded text-[11px] font-medium tracking-wide border shadow-sm uppercase font-display select-none ${
                      isSelected
                        ? "bg-blue-600 border-blue-500 text-white font-semibold"
                        : isDarkTheme
                          ? "bg-slate-950/90 border-slate-800 text-slate-300"
                          : "bg-parchment-100/95 border-parchment-200 text-parchment-900"
                    }`}
                  >
                    {poi.name}
                  </span>
                </div>
              </div>
            );
          })}

        {/* Temporary Preview Pin */}
        {newPoiData && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 select-none z-30 pointer-events-none animate-pulse"
            style={{ left: `${newPoiData.x}px`, top: `${newPoiData.y}px` }}
          >
            <div className="flex flex-col items-center scale-110">
              <div className="p-2 rounded-full border border-dashed border-amber-500 bg-amber-500/30 text-amber-500 shadow-xl ring-4 ring-amber-500/20">
                <MapPin size={18} />
              </div>
              <span className="mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 border border-amber-500/40 text-amber-500 uppercase font-display backdrop-blur-xs">
                Novo Ponto...
              </span>
            </div>
          </div>
        )}

        {/* LAYER 4: MAP COMMENTS (Floating speech balloons) */}
        {layerVisibility["comentarios"] &&
          campaign.comments.map((comment) => {
            if (comment.resolved) return null;
            const isSelected =
              selectedElement.type === "comment" &&
              selectedElement.id === comment.id;

            return (
              <div
                key={comment.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  left: `${comment.x}px`,
                  top: `${comment.y}px`,
                  zIndex: getLayerZIndex("comentarios"),
                }}
                onMouseDown={(e) => {
                  if (activeTool === "select" || activeTool === "pan") {
                    e.stopPropagation();
                  }
                }}
                onClick={(e) => {
                  if (
                    !layerLocks["comentarios"] &&
                    (activeTool === "select" || activeTool === "pan")
                  ) {
                    e.stopPropagation();
                    setSelectedElement({ type: "comment", id: comment.id });
                    setActiveTool("select");
                  }
                }}
              >
                {isSelected ? (
                  // Open full interactive comment card (as per the screenshots!)
                  <div
                    className={`p-3.5 rounded-xl border shadow-xl w-64 floating-panel${!isDarkTheme ? "-light" : ""} text-xs leading-relaxed`}
                  >
                    <div className="flex items-center justify-between border-b pb-1.5 mb-2 border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold font-display text-[10px]">
                          {comment.avatar}
                        </div>
                        <span className="font-semibold">{comment.author}</span>
                      </div>
                      <span className="opacity-50 text-[10px]">
                        {comment.date}
                      </span>
                    </div>

                    <p className="opacity-90 font-sans mb-3">
                      {comment.content}
                    </p>

                    <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-white/5">
                      <button
                        className="px-2 py-1 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600 hover:text-white rounded text-[10px] font-medium transition-colors duration-100 flex items-center gap-1"
                        onClick={(e) => handleResolveComment(comment.id, e)}
                      >
                        <Check size={10} /> Resolver
                      </button>
                      <button
                        className="p-1 text-red-400 hover:bg-red-500/20 hover:text-white rounded transition-colors duration-100"
                        onClick={(e) => handleDeleteComment(comment.id, e)}
                        title="Excluir Comentário"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ) : (
                  // Small indicator icon on map
                  <div
                    className={`p-2 rounded-full border shadow-md animate-bounce ${
                      isDarkTheme
                        ? "bg-amber-600/90 border-amber-500 text-white"
                        : "bg-amber-500 border-amber-400 text-white"
                    }`}
                  >
                    <MessageSquare size={14} />
                  </div>
                )}
              </div>
            );
          })}
        {/* Temporary Preview Comment */}
        {newCommentData && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 select-none z-30 pointer-events-none animate-pulse"
            style={{
              left: `${newCommentData.x}px`,
              top: `${newCommentData.y}px`,
            }}
          >
            <div className="p-2.5 rounded-xl border border-dashed border-purple-500 bg-purple-500/20 text-purple-500 shadow-xl flex items-center gap-1.5 backdrop-blur-xs">
              <MessageSquare size={14} />
              <span className="text-[10px] font-semibold">
                Novo Comentário...
              </span>
            </div>
          </div>
        )}

        {activeTool === "draw-route" && drawingRoutePoints.length > 0 && (
          <div
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-slate-900/90 border border-purple-500/40 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md"
          >
            <span className="text-xs font-medium text-purple-400 flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-purple-500" /> Desenhando
              Rota ({drawingRoutePoints.length} nós)
            </span>
            <button
              onClick={completeRoute}
              disabled={drawingRoutePoints.length < 2}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 font-semibold shadow transition-colors cursor-pointer"
            >
              <Check size={14} /> Concluir Rota
            </button>
            <button
              onClick={() => {
                setDrawingRoutePoints([]);
                setActiveTool("select");
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* DROP NEW POI MODAL OVERLAY */}
      <AnimatePresence>
        {newPoiData && (
          <div
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-5 rounded-2xl border shadow-2xl w-80 floating-panel${!isDarkTheme ? "-light" : ""}`}
            >
              <h3 className="font-display font-semibold text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                <MapPin className="text-amber-500" /> Novo Ponto de Interesse
              </h3>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider opacity-60 mb-1">
                    Nome do Ponto
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Templo Solar"
                    value={newPoiName}
                    onChange={(e) => setNewPoiName(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-amber-500 text-inherit"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider opacity-60 mb-1">
                    Tipo de Marcador
                  </label>
                  <select
                    value={newPoiType}
                    onChange={(e) => setNewPoiType(e.target.value as POIType)}
                    className="themed-select w-full text-xs p-2 rounded-lg focus:outline-none focus:border-amber-500 text-inherit"
                  >
                    <option value="Pin">Pin Geral</option>
                    <option value="Cidade">Cidade Imperial</option>
                    <option value="Vila">Vila Local</option>
                    <option value="Castelo">Castelo / Fortaleza</option>
                    <option value="Porto">Porto Marítimo</option>
                    <option value="Templo">Templo Sagrado</option>
                    <option value="Ruína">Ruína Antiga</option>
                    <option value="Acampamento">Acampamento</option>
                    <option value="Marco">Marco de Estrada</option>
                  </select>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={() => setNewPoiData(null)}
                    className="px-3 py-1.5 text-xs hover:bg-white/5 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSavePOI}
                    disabled={!newPoiName.trim()}
                    className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Check size={14} /> Salvar Pin
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DROP NEW COMMENT MODAL OVERLAY */}
      <AnimatePresence>
        {newCommentData && (
          <div
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-5 rounded-2xl border shadow-2xl w-80 floating-panel${!isDarkTheme ? "-light" : ""}`}
            >
              <h3 className="font-display font-semibold text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                <MessageSquare className="text-amber-500" /> Adicionar
                Comentário do Mestre
              </h3>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider opacity-60 mb-1">
                    Autor
                  </label>
                  <input
                    type="text"
                    value={newCommentAuthor}
                    onChange={(e) => setNewCommentAuthor(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-amber-500 text-inherit"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider opacity-60 mb-1">
                    Anotação / Comentário
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Escreva dicas, avisos ou lore da campanha para os jogadores..."
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-amber-500 text-inherit resize-none"
                    autoFocus
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={() => setNewCommentData(null)}
                    className="px-3 py-1.5 text-xs hover:bg-white/5 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveComment}
                    disabled={!newCommentContent.trim()}
                    className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Check size={14} /> Salvar Comentário
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DROP NEW ROUTE MODAL OVERLAY */}
      <AnimatePresence>
        {pendingRoutePoints && routeModalPosition && (
          <div
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute inset-0 z-[120] pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-5 rounded-2xl border shadow-2xl w-80 floating-panel${!isDarkTheme ? "-light" : ""} pointer-events-auto absolute`}
              style={{
                left: `${Math.max(12, Math.min(routeModalPosition.x - 160, (containerRef.current?.clientWidth || 800) - 332))}px`,
                top: `${Math.max(12, routeModalPosition.y - 360)}px`,
              }}
            >
              <h3 className="font-display font-semibold text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                <CornerDownRight className="text-purple-500" /> Confirmar Nova
                Estrada
              </h3>

              <div className="space-y-3.5 text-left">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider opacity-60 mb-1 font-semibold text-left">
                    Nome da Rota
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Rota do Vale"
                    value={newRouteName}
                    onChange={(e) => setNewRouteName(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-purple-500 text-inherit"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider opacity-60 mb-1 font-semibold text-left">
                      Categoria
                    </label>
                    <select
                      value={newRouteCategory}
                      onChange={(e) =>
                        setNewRouteCategory(e.target.value as RouteCategory)
                      }
                      className="themed-select w-full text-xs p-2 rounded-lg focus:outline-none focus:border-purple-500 text-inherit"
                    >
                      <option value="Estrada">Estrada</option>
                      <option value="Trilha">Trilha</option>
                      <option value="Túneis">Túneis</option>
                      <option value="Atalho">Atalho</option>
                      <option value="Marítimo">Marítimo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider opacity-60 mb-1 font-semibold text-left">
                      Cor da Rota
                    </label>
                    <div className="flex gap-1.5 items-center justify-start h-8">
                      {[
                        "#A855F7",
                        "#F59E0B",
                        "#EF4444",
                        "#3B82F6",
                        "#10B981",
                      ].map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewRouteColor(color)}
                          className={`w-4 h-4 rounded-full transition-all cursor-pointer ${newRouteColor === color ? "ring-2 ring-white scale-125" : "opacity-70 hover:opacity-100"}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider opacity-60 mb-0.5 font-semibold text-left">
                      Suprimentos
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={newRouteSupplies}
                      onChange={(e) =>
                        setNewRouteSupplies(
                          Math.max(1, parseInt(e.target.value) || 1),
                        )
                      }
                      className="w-full text-xs p-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-purple-500 text-inherit font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider opacity-60 mb-0.5 font-semibold text-left">
                      Obstáculos
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={newRouteObstacles}
                      onChange={(e) =>
                        setNewRouteObstacles(
                          Math.max(1, parseInt(e.target.value) || 1),
                        )
                      }
                      className="w-full text-xs p-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-purple-500 text-inherit font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider opacity-60 mb-1 font-semibold text-left">
                    Anotações
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Notas adicionais sobre perigos, pedágios, etc..."
                    value={newRouteNotes}
                    onChange={(e) => setNewRouteNotes(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-purple-500 text-inherit resize-none"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={() => {
                      setPendingRoutePoints(null);
                      setRouteModalPosition(null);
                    }}
                    className="px-3 py-1.5 text-xs hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveRoute}
                    className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-lg shadow-purple-600/15"
                  >
                    <Check size={14} /> Salvar Rota
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DROP NEW REGION MODAL OVERLAY */}
      <AnimatePresence>
        {pendingRegionPoints && (
          <div
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className={`p-5 rounded-2xl border shadow-2xl w-[360px] floating-panel${!isDarkTheme ? "-light" : ""}`}
            >
              <h3 className="font-display font-semibold text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                <Compass className="text-emerald-500" /> Detalhes da Região
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider opacity-60 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={newRegionName}
                    onChange={(e) => setNewRegionName(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-emerald-500 text-inherit"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider opacity-60 mb-1">
                      Tipo
                    </label>
                    <select
                      value={newRegionType}
                      onChange={(e) =>
                        setNewRegionType(e.target.value as Region["type"])
                      }
                      className="themed-select w-full text-xs p-2 rounded-lg focus:outline-none focus:border-emerald-500 text-inherit"
                    >
                      <option value="Reino">Reino</option>
                      <option value="Floresta">Floresta</option>
                      <option value="Deserto">Deserto</option>
                      <option value="Montanha">Montanha</option>
                      <option value="Mar">Mar</option>
                      <option value="Pântano">Pântano</option>
                      <option value="Planície">Planície</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider opacity-60 mb-1">
                      Cor
                    </label>
                    <input
                      type="color"
                      value={newRegionColor}
                      onChange={(e) => setNewRegionColor(e.target.value)}
                      className="w-full h-[34px] rounded-lg bg-white/5 border border-white/10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newRegionBiome}
                    onChange={(e) => setNewRegionBiome(e.target.value)}
                    placeholder="Bioma"
                    className="text-xs p-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    value={newRegionClimate}
                    onChange={(e) => setNewRegionClimate(e.target.value)}
                    placeholder="Clima"
                    className="text-xs p-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <textarea
                  rows={2}
                  value={newRegionDescription}
                  onChange={(e) => setNewRegionDescription(e.target.value)}
                  placeholder="Descrição breve da região"
                  className="w-full text-xs p-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-emerald-500 resize-none"
                />

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setPendingRegionPoints(null)}
                    className="px-3 py-1.5 text-xs hover:bg-white/5 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveRegion}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1"
                  >
                    <Check size={14} /> Salvar Região
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
