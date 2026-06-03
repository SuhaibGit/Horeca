"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { DndContext, useDraggable, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import FloorPlanCanvas from "../../../components/tables/FloorPlanCanvas";
import FloorPlanTableNode, {
  FloorPlanTable,
  getFloorTableDimensions,
} from "../../../components/tables/FloorPlanTableNode";
import { resolveTableStatus } from "../../../lib/floorPlanTableStatus";
import { mockReservations } from "../../../data/mockReservations";
import { mockLiveOrders } from "../../../data/mockOrders";
import { useFloorPlan, FloorZone } from "../../../contexts/FloorPlanContext";
import Toast from "../../../components/Toast";
import TableManagementOperational from "../../../components/tables/TableManagementOperational";
import {
  clampTablePosition,
  tablePositionToPixels,
  tablesToDisplayCoords,
  withPercentPosition,
} from "../../../lib/floorPlanCoordinates";
import { useFloorCanvasSize } from "../../../hooks/useFloorCanvasSize";

type Table = FloorPlanTable;

// Draggable Sidebar Shape Element using @dnd-kit/core hooks
interface DraggableSidebarShapeProps {
  id: string;
  shape: {
    id: string;
    label: string;
    desc: string;
  };
}

function DraggableSidebarShape({ id, shape }: DraggableSidebarShapeProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: isDragging ? 100 : 1,
    touchAction: "none" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-3 rounded-xl flex flex-col items-center justify-center gap-2  cursor-grab active:cursor-grabbing transition-all select-none ${isDragging
        ? "border-[#28A388] bg-[#ECFDFF] text-[#0A46A6] dark:text-emerald-450 shadow-lg scale-105 opacity-80 z-50 ring-2 ring-[#0A46A6]"
        : "border-zinc-150 dark:border-zinc-800 text-zinc-550 hover:bg-zinc-55 dark:hover:bg-zinc-850 bg-white dark:bg-zinc-900"
        }`}
    >
      <div
        className={`shrink-0 pointer-events-none ${shape.id === "round"
          ? "w-8 h-8 rounded-full border-2 border-current"
          : shape.id === "square"
            ? "w-8 h-8 rounded-md border-2 border-current"
            : shape.id === "rectangle"
              ? "w-10 h-7 rounded-md border-2 border-current"
              : "w-14 h-5 rounded-lg border-2 border-current"
          }`}
      />
      <span className="text-[11px] leading-none pt-1 font-bold pointer-events-none">{shape.label}</span>
    </div>
  );
}

function nextTableId(existing: Table[]): string {
  const maxNum = existing.reduce((max, t) => {
    const n = parseInt(t.id.replace(/\D/g, ""), 10);
    return Number.isNaN(n) ? max : Math.max(max, n);
  }, 0);
  return `T${String(maxNum + 1).padStart(2, "0")}`;
}

// Main Table Management Component
type ZoneFilter = "all" | FloorZone;

export default function TableManagementPage() {
  const {
    hasFloors,
    hydrated,
    activeFloor,
    addFloor,
    updateActiveFloor,
    deleteFloor,
  } = useFloorPlan();

  const [mounted, setMounted] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [listView, setListView] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Layout saved successfully");
  const skipFloorResetRef = useRef(false);
  const [zoneFilter, setZoneFilter] = useState<ZoneFilter>("all");

  // Configure sensors with custom distance activation constraints to avoid click conflicts!
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const [showFloorModal, setShowFloorModal] = useState(false);
  const [floorName, setFloorName] = useState("");
  const [activeTool, setActiveTool] = useState<"select" | "table">("select");
  const [showUploadTooltip, setShowUploadTooltip] = useState(true);
  const [viewDate, setViewDate] = useState("2025-01-08");

  const tables = activeFloor?.tables ?? [];
  const floorPlanImage = activeFloor?.blueprintImage ?? null;
  const displayFloorName = activeFloor?.name ?? floorName;

  const setTables = (updater: Table[] | ((prev: Table[]) => Table[])) => {
    const next = typeof updater === "function" ? updater(tables) : updater;
    updateActiveFloor({ tables: next });
  };

  const setFloorPlanImage = (image: string | null) => {
    updateActiveFloor({ blueprintImage: image });
  };
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [selectedShape, setSelectedShape] = useState<
    "round" | "square" | "rectangle" | "bench" | "custom"
  >("round");

  // DOM Refs
  const placementRef = useRef<HTMLDivElement>(null);
  const blueprintInputRef = useRef<HTMLInputElement>(null);
  const placementSize = useFloorCanvasSize(placementRef);

  const displayTables = useMemo(
    () => tablesToDisplayCoords(tables, placementSize.width, placementSize.height),
    [tables, placementSize.width, placementSize.height]
  );

  // Hydration helper
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (skipFloorResetRef.current) {
      skipFloorResetRef.current = false;
      return;
    }
    setIsEditMode(false);
    setSelectedTableId(null);
  }, [activeFloor?.id]);

  const handleSaveLayout = () => {
    const el = placementRef.current;
    if (el && tables.length > 0) {
      const w = el.clientWidth;
      const h = el.clientHeight;
      setTables((prev) =>
        prev.map((t) => {
          const { x, y } = tablePositionToPixels(t, w, h);
          return withPercentPosition(t, x, y, w, h);
        })
      );
      updateActiveFloor({ layoutCoordVersion: 2 });
    }
    setIsEditMode(false);
    setToastMessage("Layout saved successfully");
    setShowToast(true);
  };

  const handleCreateFloor = (name: string) => {
    skipFloorResetRef.current = true;
    addFloor(name, null);
    setFloorName("");
    setShowFloorModal(false);
    setIsEditMode(true);
    setShowUploadTooltip(true);
    setSelectedTableId(null);
  };

  const handleDeleteFloor = () => {
    if (!activeFloor) return;
    if (
      !window.confirm(
        `Delete "${activeFloor.name}"? All tables on this floor will be removed.`
      )
    ) {
      return;
    }
    deleteFloor(activeFloor.id);
    setIsEditMode(false);
    setSelectedTableId(null);
  };

  const handleBlueprintUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setFloorPlanImage(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
    setShowUploadTooltip(false);
  };

  // Handle Drop event coordinates calculation
  const handleDragEnd = (event: any) => {
    const { active, delta, over } = event;
    if (!active) return;

    const placementEl = placementRef.current;
    const cw = placementEl?.clientWidth ?? 0;
    const ch = placementEl?.clientHeight ?? 0;
    if (!placementEl || cw <= 0 || ch <= 0) return;

    const rect = placementEl.getBoundingClientRect();

    // Case 1: Dragging a new shape from sidebar to drop on canvas
    if (typeof active.id === "string" && active.id.startsWith("new-") && over && over.id === "floor-canvas") {
      const shapeType = active.id.replace("new-", "") as Table["type"];
      const { width, height } = getFloorTableDimensions(shapeType);
      const dropX = event.activatorEvent.clientX + delta.x - rect.left - width / 2;
      const dropY = event.activatorEvent.clientY + delta.y - rect.top - height / 2;
      const pos = clampTablePosition(dropX, dropY, shapeType, cw, ch);

      setTables((prev) => {
        const newTable: Table = {
          id: nextTableId(prev),
          type: shapeType,
          capacity: shapeType === "bench" ? 6 : shapeType === "rectangle" ? 4 : 2,
          minGuests: 1,
          maxGuests: shapeType === "bench" ? 6 : shapeType === "rectangle" ? 4 : 2,
          x: pos.x,
          y: pos.y,
          xPct: pos.xPct,
          yPct: pos.yPct,
        };
        setTimeout(() => setSelectedTableId(newTable.id), 0);
        return [...prev, newTable];
      });
      return;
    }

    // Case 2: Dragging existing table inside canvas
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== active.id) return t;
        const { x: curX, y: curY } = tablePositionToPixels(t, cw, ch);
        const pos = clampTablePosition(curX + delta.x, curY + delta.y, t.type, cw, ch);
        return { ...t, x: pos.x, y: pos.y, xPct: pos.xPct, yPct: pos.yPct };
      })
    );
  };

  // Clicking inside canvas to add table when "Table" tool is selected
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool !== "table") return;

    // Get click offset relative to canvas bounds
    if (placementRef.current) {
      const rect = placementRef.current.getBoundingClientRect();
      const cw = placementRef.current.clientWidth;
      const ch = placementRef.current.clientHeight;
      const { width, height } = getFloorTableDimensions(selectedShape);
      const clickX = e.clientX - rect.left - width / 2;
      const clickY = e.clientY - rect.top - height / 2;
      const pos = clampTablePosition(clickX, clickY, selectedShape, cw, ch);

      const newTable: Table = {
        id: nextTableId(tables),
        type: selectedShape,
        capacity: selectedShape === "bench" ? 6 : selectedShape === "rectangle" ? 4 : 2,
        minGuests: 1,
        maxGuests: selectedShape === "bench" ? 6 : selectedShape === "rectangle" ? 4 : 2,
        x: pos.x,
        y: pos.y,
        xPct: pos.xPct,
        yPct: pos.yPct,
      };

      setTables((prev) => [...prev, newTable]);
      setSelectedTableId(newTable.id);
      setActiveTool("select"); // Toggle back to pointer select automatically!
    }
  };

  // Updating table configuration details from the properties panel
  const handleUpdateTable = (field: keyof Table, value: any) => {
    if (!selectedTableId) return;
    setTables((prev) =>
      prev.map((t) =>
        t.id === selectedTableId
          ? {
            ...t,
            [field]: value,
            // Keep min/max guests logical
            ...(field === "capacity"
              ? { maxGuests: Number(value), minGuests: Math.min(t.minGuests, Number(value)) }
              : {}),
          }
          : t
      )
    );
  };

  // Deleting a table node
  const handleDeleteTable = (id: string) => {
    setTables((prev) => prev.filter((t) => t.id !== id));
    setSelectedTableId(null);
  };

  const tableStatusById = useMemo(() => {
    const map = new Map(
      tables.map((t) => [
        t.id,
        resolveTableStatus(t.id, {
          reservations: mockReservations,
          orders: mockLiveOrders,
          viewDate,
          manualStatus: t.manualStatus,
        }),
      ])
    );
    return map;
  }, [tables, viewDate]);

  const filteredTables = useMemo(() => {
    if (zoneFilter === "all") return tables;
    return tables.filter((t) => (t.zone ?? "indoor") === zoneFilter);
  }, [tables, zoneFilter]);

  const floorStats = useMemo(() => {
    let available = 0;
    let occupied = 0;
    let reserved = 0;
    let occupiedSeats = 0;
    const totalSeats = filteredTables.reduce((sum, t) => sum + t.capacity, 0);

    for (const t of filteredTables) {
      const status = tableStatusById.get(t.id)?.status ?? "available";
      if (status === "available") available += 1;
      else if (status === "occupied") {
        occupied += 1;
        occupiedSeats += t.capacity;
      } else if (status === "reserved") reserved += 1;
    }

    return {
      total: filteredTables.length,
      available,
      occupied,
      reserved,
      occupiedSeats,
      totalSeats,
    };
  }, [filteredTables, tableStatusById]);

  if (!mounted || !hydrated) return null;

  const selectedTableObj = tables.find((t) => t.id === selectedTableId);
  const selectedResolvedStatus = selectedTableObj
    ? tableStatusById.get(selectedTableObj.id)
    : undefined;

  const showOperational = hasFloors && !isEditMode;

  return (
    <div className="space-y-6 select-none animate-fade-in pb-10">
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      {/* FLOW VIEW 1: FLOOR EMPTY STATE */}
      {!hasFloors ? (
        <div className="flex flex-col items-center justify-center min-h-[500px] bg-white dark:bg-zinc-900 shadow-sm rounded-[24px] p-8 text-center select-none shadow-xs">

          {/* Elegant custom isometric Restaurant illustration */}
          <div className="relative mb-6 select-none transform hover:scale-102 transition-transform duration-300">
            <svg className="w-64 h-64 text-zinc-300 dark:text-zinc-700" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M200 80 L350 170 L200 260 L50 170 Z" fill="currentColor" opacity="0.12" />
              <path d="M200 90 L340 175 L200 250 L60 175 Z" fill="currentColor" opacity="0.18" />
              <path d="M50 170 L50 210 L200 300 L200 260 Z" fill="currentColor" opacity="0.25" />
              <path d="M350 170 L350 210 L200 300 L200 260 Z" fill="currentColor" opacity="0.3" />

              {/* Isometric Table 1 */}
              <ellipse cx="200" cy="170" rx="35" ry="20" fill="#0A46A6" opacity="0.8" />
              <ellipse cx="200" cy="165" rx="35" ry="20" fill="#28A388" />
              <ellipse cx="200" cy="165" rx="20" ry="11" fill="#0A46A6" opacity="0.3" />

              {/* Isometric Chairs */}
              <ellipse cx="150" cy="170" rx="10" ry="6" fill="#0E4B3E" />
              <ellipse cx="250" cy="170" rx="10" ry="6" fill="#0E4B3E" />
              <ellipse cx="200" cy="140" rx="10" ry="6" fill="#0E4B3E" />
              <ellipse cx="200" cy="200" rx="10" ry="6" fill="#0E4B3E" />

              {/* Plant Pots */}
              <g transform="translate(80, 100)">
                <ellipse cx="20" cy="40" rx="12" ry="7" fill="#0A46A6" opacity="0.4" />
                <path d="M20 40 L20 15" stroke="#0A46A6" strokeWidth="3" strokeLinecap="round" />
                <circle cx="15" cy="15" r="8" fill="#28A388" />
                <circle cx="25" cy="20" r="6" fill="#0A46A6" />
                <circle cx="20" cy="10" r="5" fill="#34D399" />
              </g>
            </svg>
          </div>

          <div className="space-y-2 max-w-md">
            <h2 className="text-[18px] font-black text-zinc-900 dark:text-white uppercase tracking-tight">
              Your Restaurant Floor is Empty
            </h2>
            <p className="text-[12.5px] font-bold text-zinc-400 dark:text-zinc-500 leading-relaxed">
              Start by creating your floor layout, adding tables, and organizing dining zones to manage reservations and active dining operations efficiently.
            </p>
          </div>

          <button
            onClick={() => setShowFloorModal(true)}
            className="mt-6 px-8 py-3 rounded-full bg-linear-to-r from-[#041B40] to-[#0A46A6] hover:bg-[#12503C] text-white text-[12.5px] font-extrabold uppercase tracking-wider transition-all cursor-pointer hover:shadow-lg active:scale-95 shadow-xs"
          >
            Set Up Floor Layout
          </button>
        </div>
      ) : showOperational ? (
        <TableManagementOperational
          filteredTables={filteredTables}
          tableStatusById={tableStatusById}
          floorStats={floorStats}
          listView={listView}
          onListViewChange={setListView}
          onEditFloor={() => setIsEditMode(true)}
          onAddFloor={() => {
            setFloorName("");
            setShowFloorModal(true);
          }}
          onDeleteFloor={handleDeleteFloor}
          zoneFilter={zoneFilter}
          onZoneFilterChange={setZoneFilter}
          canvas={
            <DndContext sensors={sensors}>
              <FloorPlanCanvas
                placementRef={placementRef}
                onCanvasClick={() => { }}
                backgroundImage={floorPlanImage}
              >
                {tablesToDisplayCoords(
                  filteredTables,
                  placementSize.width,
                  placementSize.height
                ).map((table) => {
                  const resolved =
                    tableStatusById.get(table.id) ??
                    resolveTableStatus(table.id, {
                      reservations: mockReservations,
                      orders: mockLiveOrders,
                      viewDate,
                    });
                  return (
                    <FloorPlanTableNode
                      key={table.id}
                      table={table}
                      resolvedStatus={resolved}
                      isSelected={false}
                      onClick={() => { }}
                      readOnly
                    />
                  );
                })}
              </FloorPlanCanvas>
            </DndContext>
          }
        />
      ) : (
        <div className="space-y-4">

          {/* Header Row Controls (Back, Title, Count) */}
          <div className="flex items-center justify-between border-b border-zinc-150/45 dark:border-zinc-800/80 pb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsEditMode(false)}
                className="flex items-center gap-2 text-zinc-500 hover:text-zinc-850 dark:hover:text-zinc-100 text-[12.5px] font-black transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back</span>
              </button>
              <h1 className="text-xl sm:text-2xl font-black text-[#0A46A6] dark:text-[#28A388] tracking-tight uppercase leading-none">
                {displayFloorName || "Main Floor"}
              </h1>
            </div>
            <div className="flex items-center gap-4 flex-wrap justify-end">
              <label className="flex items-center gap-2 text-[11px] font-bold text-zinc-500">
                <span className="uppercase tracking-wider">Reservations</span>
                <input
                  type="date"
                  value={viewDate}
                  onChange={(e) => setViewDate(e.target.value)}
                  className="px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[12px] font-semibold text-zinc-700 dark:text-zinc-200"
                />
              </label>
              <div className="flex items-center gap-3 flex-wrap justify-end">
                <div className="text-[12.5px] font-extrabold text-zinc-500">
                  <span className="text-[#0A46A6] dark:text-[#28A388] text-[15px] font-black">
                    {tables.length}
                  </span>{" "}
                  Tables
                </div>
                <button
                  type="button"
                  onClick={handleDeleteFloor}
                  className="px-4 py-2 rounded-full border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-[11px] font-bold hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer transition-colors"
                >
                  Delete Floor
                </button>
              </div>
            </div>
          </div>

          {/* Core Layout split workspace */}
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch select-none">

              {/* Left Sidebar Option List */}
              <div className="lg:col-span-3 flex flex-col gap-4">

                {/* Toolbar Switches */}
                <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl p-3 flex gap-2 shadow-sm">
                  <button
                    onClick={() => {
                      setActiveTool("select");
                      setSelectedTableId(null);
                    }}
                    className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 text-[12px] font-black cursor-pointer transition-all ${activeTool === "select"
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200/50 dark:border-zinc-700"
                      : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                      }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    <span>Select</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTool("table");
                      setSelectedTableId(null);
                    }}
                    className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 text-[12px] font-black cursor-pointer transition-all ${activeTool === "table"
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200/50 dark:border-zinc-700"
                      : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                      }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    <span>+ Table</span>
                  </button>
                </div>

                {/* Mode-specific Left Panel Content */}
                {activeTool === "table" ? (

                  /* Shape options selector (Picture 4) */
                  <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl p-4 flex flex-col gap-3 shadow-xs">
                    <h3 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                      Drag Table Shapes
                    </h3>

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "round", label: "Round", desc: "Circular table" },
                        { id: "square", label: "Square", desc: "4-seater box" },
                        { id: "rectangle", label: "Rectangle", desc: "6-seater" },
                        { id: "bench", label: "Long Bench", desc: "Large groups" },
                      ].map((shape) => (
                        <DraggableSidebarShape
                          key={shape.id}
                          id={"new-" + shape.id}
                          shape={shape}
                        />
                      ))}
                    </div>

                    <p className="text-[10.5px] font-bold text-zinc-400 dark:text-zinc-500 leading-normal bg-zinc-50 dark:bg-zinc-850 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800/40 text-center select-none">
                      💡 Drag a shape from above and drop it directly onto the canvas grid to place a table.
                    </p>
                  </div>
                ) : (

                  /* Standard tip/instructions card (Picture 3) */
                  <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl p-4 flex flex-col gap-3 shadow-xs">
                    <h3 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
                      Design Toolkit Tips
                    </h3>
                    {[
                      { title: "Click items to select", desc: "Select nodes to edit values" },
                      { title: "Drag to reposition", desc: "Hold & drag tables across canvas" },
                      { title: "Delete to remove", desc: "Wipe nodes from canvas schema" },
                      { title: "Switch tools above", desc: "Easily swap creation tools" },
                    ].map((tip, idx) => (
                      <div
                        key={idx}
                        className="px-3.5 py-2.5 rounded-xl bg-[#F3F4F6]  text-[12px] font-semibold text-[#333839] leading-none select-none"
                      >
                        {tip.title}
                      </div>
                    ))}

                    {/* Blueprint upload element */}
                    <div className="relative mt-2">

                      {/* Floating Info Tooltip */}
                      {showUploadTooltip && (
                        <div className="absolute bottom-full left-0 right-0 mb-3 bg-linear-to-r from-[#041B40] to-[#0A46A6] text-white p-3 rounded-2xl shadow-xl z-20 text-[11px] leading-relaxed animate-fade-in select-none">
                          <button
                            onClick={() => setShowUploadTooltip(false)}
                            className="absolute top-2 right-2 text-emerald-250 hover:text-white"
                          >
                            ✕
                          </button>
                          <p className="font-semibold pr-3">
                            Upload your restaurant floor layout or blueprint to visually map and organize tables for reservations and live dining operations.
                          </p>
                          <div className="absolute top-full left-6 w-3 h-3 bg-linear-to-r from-[#041B40] to-[#0A46A6] rotate-45 -translate-y-1.5" />
                        </div>
                      )}

                      <input
                        ref={blueprintInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleBlueprintUpload}
                      />
                      <button
                        type="button"
                        onClick={() => blueprintInputRef.current?.click()}
                        className="w-full py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-55 dark:hover:bg-zinc-800 text-zinc-650 dark:text-zinc-350 text-[12px] font-black tracking-wide cursor-pointer transition-all flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span>{floorPlanImage ? "Change Blueprint" : "Upload Blueprint Image"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFloorPlanImage("/floor-plan-sample.png")}
                        className="w-full py-2 rounded-full text-[11px] font-bold text-[#0A46A6] dark:text-[#28A388] hover:bg-[#ECFDFF] dark:hover:bg-emerald-950/30 cursor-pointer transition-colors"
                      >
                        Use sample floor plan
                      </button>
                      {floorPlanImage ? (
                        <button
                          type="button"
                          onClick={() => setFloorPlanImage(null)}
                          className="w-full py-2 rounded-full text-[11px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                        >
                          Remove blueprint
                        </button>
                      ) : null}
                    </div>

                    <div className="mt-2 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-1.5">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Status legend</p>
                      {[
                        { label: "Available", color: "bg-emerald-500" },
                        { label: "Reserved", color: "bg-amber-500" },
                        { label: "Occupied", color: "bg-red-500" },
                        { label: "Cleaning", color: "bg-blue-500" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2 text-[11px] font-bold text-zinc-600 dark:text-zinc-300">
                          <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                          {item.label}
                        </div>
                      ))}
                    </div>

                  </div>
                )}

              </div>

              {/* Central Canvas Work Area */}
              <div className="lg:col-span-9 flex flex-col gap-4 select-none relative">

                <FloorPlanCanvas
                  placementRef={placementRef}
                  onCanvasClick={handleCanvasClick}
                  backgroundImage={floorPlanImage}
                >

                  {/* Canvas Empty ready state card */}
                  {tables.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center select-none text-center p-6 gap-3 z-0 animate-fade-in pointer-events-none">
                      <div className="w-12 h-12 rounded-full  text-[#0A46A6] dark:text-emerald-450 flex items-center justify-center shrink-0 ">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                      <div className="space-y-1 select-none">
                        <h3 className="text-[15px] font-semibold text-[#374151] tracking-tight uppercase">
                          {floorPlanImage ? "Floor plan loaded" : "Your canvas is ready"}
                        </h3>
                        <p className="text-[12px] text-[#9CA3AF] max-w-[320px]">
                          {floorPlanImage
                            ? "Drag tables onto the blueprint. Use IDs like T01 to match Table 1 in reservations."
                            : "Start by drawing zones, then place tables. Upload a blueprint anytime from the sidebar."}
                        </p>
                      </div>
                    </div>
                  )}

                  {displayTables.map((table) => {
                    const resolved =
                      tableStatusById.get(table.id) ??
                      resolveTableStatus(table.id, {
                        reservations: mockReservations,
                        orders: mockLiveOrders,
                        viewDate,
                      });
                    return (
                      <FloorPlanTableNode
                        key={table.id}
                        table={table}
                        resolvedStatus={resolved}
                        isSelected={selectedTableId === table.id}
                        onClick={() => setSelectedTableId(table.id)}
                      />
                    );
                  })}

                </FloorPlanCanvas>

                {/* Bottom Navigation buttons */}
                <div className="flex items-center justify-end gap-3 select-none pt-2">
                  <button
                    type="button"
                    onClick={handleSaveLayout}
                    className="px-7 py-3 rounded-full bg-linear-to-r from-[#041B40] to-[#0A46A6] hover:bg-[#12503C] text-white text-[12.5px] font-extrabold shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-95 uppercase tracking-wider"
                  >
                    Continue
                  </button>
                </div>

                {/* Right Side Table Properties panel (Picture 4) */}
                {selectedTableObj && (
                  <div className="absolute top-0 right-0 bottom-0 w-80 bg-white dark:bg-zinc-900   shadow-2xl p-5 z-30 flex flex-col justify-between animate-slide-in select-none">
                    <div className="space-y-5">

                      {/* Properties Header */}
                      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-3">
                        <h3 className="text-[14px] font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                          Table Properties
                        </h3>
                        <button
                          onClick={() => setSelectedTableId(null)}
                          className="p-1 rounded-full text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-250 cursor-pointer"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* Properties inputs */}
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">
                            Table Number
                          </label>
                          <input
                            type="text"
                            value={selectedTableObj.id}
                            onChange={(e) => handleUpdateTable("id", e.target.value)}
                            className="w-full px-3 py-2 text-[12.5px] font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A46A6]"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">
                            Capacity
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={selectedTableObj.capacity}
                            onChange={(e) => handleUpdateTable("capacity", Number(e.target.value))}
                            className="w-full px-3 py-2 text-[12.5px] font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A46A6]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">
                              Min Guests
                            </label>
                            <input
                              type="number"
                              min={1}
                              max={selectedTableObj.capacity}
                              value={selectedTableObj.minGuests}
                              onChange={(e) => handleUpdateTable("minGuests", Number(e.target.value))}
                              className="w-full px-3 py-2 text-[12.5px] font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A46A6]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">
                              Max Guests
                            </label>
                            <input
                              type="number"
                              min={selectedTableObj.minGuests}
                              value={selectedTableObj.maxGuests}
                              onChange={(e) => handleUpdateTable("maxGuests", Number(e.target.value))}
                              className="w-full px-3 py-2 text-[12.5px] font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A46A6]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">
                            Operational Status
                          </label>
                          <select
                            value={selectedTableObj.manualStatus ?? "auto"}
                            onChange={(e) =>
                              handleUpdateTable(
                                "manualStatus",
                                e.target.value === "auto"
                                  ? null
                                  : (e.target.value as "cleaning")
                              )
                            }
                            className="w-full px-3 py-2 text-[12.5px] font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer"
                          >
                            <option value="auto">Auto (from reservations & orders)</option>
                            <option value="cleaning">Cleaning</option>
                          </select>
                        </div>

                        {selectedResolvedStatus && (
                          <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 p-3 text-[12px] font-bold text-zinc-600 dark:text-zinc-300">
                            Live status:{" "}
                            <span className="capitalize text-[#0A46A6] dark:text-[#28A388]">
                              {selectedResolvedStatus.status}
                            </span>
                            {selectedResolvedStatus.label
                              ? ` · ${selectedResolvedStatus.label}`
                              : ""}
                          </div>
                        )}

                      </div>

                    </div>

                    {/* Properties deletion footer */}
                    <button
                      onClick={() => handleDeleteTable(selectedTableObj.id)}
                      className="w-full py-2.5 rounded-xl border border-red-200/50 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 text-[12px] font-black tracking-wide cursor-pointer transition-all flex items-center justify-center gap-2 select-none"
                    >
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete Table Node</span>
                    </button>

                  </div>
                )}

              </div>
            </div>
          </DndContext>

        </div>
      )}

      {/* DIALOG: CREATE NEW FLOOR DETAIL MODAL */}
      {showFloorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
          {/* Backdrop overlay */}
          <div
            onClick={() => setShowFloorModal(false)}
            className="fixed inset-0 bg-[#092219]/40 backdrop-blur-xs transition-opacity duration-300 cursor-pointer animate-fade-in"
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[20px] shadow-2xl p-6 z-10 animate-fade-in shadow-sm flex flex-col gap-4">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E7E7E7] pb-3">
              <h3 className="text-[20px] font-semibold text-[#25292A] tracking-tight">
                Floor Detail
              </h3>
              <button
                onClick={() => setShowFloorModal(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-250 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body form input */}
            <div className="space-y-4">
              <div>
                <label className="text-[14px] font-medium text-[#454545] tracking-wider block mb-1">
                  Floor Name
                </label>
                <input
                  type="text"
                  required
                  value={floorName}
                  onChange={(e) => setFloorName(e.target.value)}
                  placeholder="e.g. Roof Top"
                  className="w-full px-3.5 py-2.5 text-[16px] font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A46A6]"
                />
              </div>
            </div>

            {/* Modal Footer buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowFloorModal(false)}
                className="px-6 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-[14px] font-black cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleCreateFloor(floorName.trim() || "Main Floor");
                }}
                className="px-6 py-2.5 rounded-full bg-linear-to-r from-[#041B40] to-[#0A46A6] hover:bg-[#12503C] text-white text-[14px] font-black cursor-pointer transition-all hover:shadow-lg active:scale-95"
              >
                Create Floor
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
