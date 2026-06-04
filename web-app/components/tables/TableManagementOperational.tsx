"use client";

import React from "react";
import { DndContext } from "@dnd-kit/core";
import FloorPlanTableNode, { FloorPlanTable } from "./FloorPlanTableNode";
import StatCard from "../StatCard";
import { ResolvedTableStatus } from "../../lib/floorPlanTableStatus";
import { FloorZone } from "../../contexts/FloorPlanContext";

type ZoneFilter = "all" | FloorZone;

const ZONE_CHIPS: { id: ZoneFilter; label: string }[] = [
  { id: "all", label: "All Zones" },
  { id: "indoor", label: "Indoor" },
  { id: "outdoor", label: "Outdoor" },
  { id: "vip", label: "Vip" },
  { id: "terrace", label: "Terrace" },
];

interface TableManagementOperationalProps {
  filteredTables: FloorPlanTable[];
  tableStatusById: Map<string, ResolvedTableStatus>;
  floorStats: {
    total: number;
    available: number;
    occupied: number;
    reserved: number;
    occupiedSeats: number;
    totalSeats: number;
  };
  listView: boolean;
  onListViewChange: (list: boolean) => void;
  onEditFloor: () => void;
  onAddFloor: () => void;
  onDeleteFloor?: () => void;
  zoneFilter: ZoneFilter;
  onZoneFilterChange: (zone: ZoneFilter) => void;
  canvas: React.ReactNode;
}

export default function TableManagementOperational({
  filteredTables,
  tableStatusById,
  floorStats,
  listView,
  onListViewChange,
  onEditFloor,
  onAddFloor,
  onDeleteFloor,
  zoneFilter,
  onZoneFilterChange,
  canvas,
}: TableManagementOperationalProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center p-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => onListViewChange(false)}
            className={`px-5 py-2 rounded-full text-[12px] font-bold transition-all cursor-pointer ${!listView
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
          >
            Floor Plan
          </button>
          <button
            type="button"
            onClick={() => onListViewChange(true)}
            className={`px-5 py-2 rounded-full text-[12px] font-bold transition-all cursor-pointer ${listView
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
          >
            List View
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onEditFloor}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-[12px] font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Edit Floor
          </button>
          <button
            type="button"
            onClick={onAddFloor}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-[#041B40] to-[#0A46A6] hover:bg-[#12503C] text-white text-[12px] font-bold cursor-pointer transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add Floor
          </button>
          {onDeleteFloor ? (
            <button
              type="button"
              onClick={onDeleteFloor}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-[12px] font-bold hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer transition-all"
            >
              Delete Floor
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Tables" value={String(floorStats.total)} compare={true} />
        <StatCard title="Available" value={String(floorStats.available)} compare={true} />
        <StatCard
          title="Occupied"
          value={`${floorStats.occupiedSeats} / ${floorStats.totalSeats || 0}`}
          compare={true} />
        <StatCard title="Reserved" value={String(floorStats.reserved)} compare={true} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {ZONE_CHIPS.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => onZoneFilterChange(chip.id)}
              className={`px-4 py-2 rounded-full text-[12px] font-bold border transition-all cursor-pointer ${zoneFilter === chip.id
                ? "bg-linear-to-r from-[#041B40] to-[#0A46A6] border-[#0A46A6] text-white"
                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-zinc-300"
                }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-zinc-600 dark:text-zinc-300">
          {[
            { label: "Available", color: "bg-emerald-500" },
            { label: "Occupied", color: "bg-red-500" },
            { label: "Clean", color: "bg-blue-500" },
            { label: "Reserved", color: "bg-amber-500" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {listView ? (
        <div className="bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-200/60 dark:border-zinc-800 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <th className="px-5 py-3">Table</th>
                <th className="px-5 py-3">Capacity</th>
                <th className="px-5 py-3">Zone</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTables.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-[13px] font-semibold text-zinc-400">
                    No tables on this floor yet. Use Edit Floor to add tables.
                  </td>
                </tr>
              ) : (
                filteredTables.map((t) => {
                  const status = tableStatusById.get(t.id)?.status ?? "available";
                  return (
                    <tr
                      key={t.id}
                      className="border-b border-zinc-50 dark:border-zinc-800/80 last:border-0"
                    >
                      <td className="px-5 py-3 text-[13px] font-bold text-zinc-800 dark:text-zinc-100">
                        {t.id}
                      </td>
                      <td className="px-5 py-3 text-[13px] font-semibold text-zinc-600 dark:text-zinc-300">
                        {t.capacity}
                      </td>
                      <td className="px-5 py-3 text-[13px] font-semibold text-zinc-600 dark:text-zinc-300 capitalize">
                        {t.zone ?? "indoor"}
                      </td>
                      <td className="px-5 py-3 text-[13px] font-bold capitalize text-[#0A46A6] dark:text-[#28A388]">
                        {status}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        canvas
      )}
    </div>
  );
}
