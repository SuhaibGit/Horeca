"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import {
  FLOOR_TABLE_STATUS_STYLES,
  ResolvedTableStatus,
} from "../../lib/floorPlanTableStatus";

export type FloorPlanTableType = "round" | "square" | "rectangle" | "bench" | "custom";

export interface FloorPlanTable {
  id: string;
  type: FloorPlanTableType;
  capacity: number;
  minGuests: number;
  maxGuests: number;
  x: number;
  y: number;
  /** 0–1 position relative to canvas width (used when saving layout across screen sizes) */
  xPct?: number;
  /** 0–1 position relative to canvas height */
  yPct?: number;
  manualStatus?: "available" | "cleaning" | null;
  zone?: "indoor" | "outdoor" | "vip" | "terrace";
}

export interface FloorTableDimensions {
  width: number;
  height: number;
  surfaceClass: string;
}

export function getFloorTableDimensions(type: FloorPlanTableType): FloorTableDimensions {
  switch (type) {
    case "round":
      return { width: 72, height: 72, surfaceClass: "w-[72px] h-[72px] rounded-full" };
    case "square":
      return { width: 72, height: 72, surfaceClass: "w-[72px] h-[72px] rounded-xl" };
    case "rectangle":
      return { width: 96, height: 64, surfaceClass: "w-[96px] h-[64px] rounded-2xl" };
    case "bench":
      return { width: 136, height: 52, surfaceClass: "w-[136px] h-[52px] rounded-2xl" };
    default:
      return { width: 72, height: 72, surfaceClass: "w-[72px] h-[72px] rounded-xl" };
  }
}

interface FloorPlanTableNodeProps {
  table: FloorPlanTable;
  resolvedStatus: ResolvedTableStatus;
  isSelected: boolean;
  onClick: () => void;
  readOnly?: boolean;
}

function Chair({ className }: { className: string }) {
  return (
    <span
      className={`absolute block w-3 h-1.5 rounded-sm bg-zinc-300 dark:bg-zinc-600 ${className}`}
    />
  );
}

export default function FloorPlanTableNode({
  table,
  resolvedStatus,
  isSelected,
  onClick,
  readOnly = false,
}: FloorPlanTableNodeProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: table.id,
    disabled: readOnly,
  });

  const styles = FLOOR_TABLE_STATUS_STYLES[resolvedStatus.status];
  const dims = getFloorTableDimensions(table.type);
  const isRound = table.type === "round";
  const isBench = table.type === "bench";
  const showCornerChairs = table.type === "square" || table.type === "rectangle";

  const style = {
    position: "absolute" as const,
    left: `${table.x}px`,
    top: `${table.y}px`,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: isDragging ? 50 : 10,
    touchAction: "none",
  };

  const surfaceClass = dims.surfaceClass;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(readOnly ? {} : listeners)}
      {...(readOnly ? {} : attributes)}
      onClick={(e) => {
        e.stopPropagation();
        if (!readOnly) onClick();
      }}
      className={`select-none ${readOnly ? "cursor-default" : "cursor-grab active:cursor-grabbing"} ${
        isSelected ? "ring-4 ring-offset-2 ring-[#10B981] dark:ring-offset-zinc-950 rounded-full" : ""
      }`}
    >
      <div className="relative flex flex-col items-center">
        <div className={`relative ${surfaceClass}`}>
          {isRound && (
            <>
              <Chair className="left-1/2 -translate-x-1/2 -top-2" />
              <Chair className="left-1/2 -translate-x-1/2 -bottom-2" />
              <Chair className="top-1/2 -translate-y-1/2 -left-2 rotate-90" />
              <Chair className="top-1/2 -translate-y-1/2 -right-2 rotate-90" />
            </>
          )}
          {showCornerChairs && (
            <>
              <Chair className="left-1/2 -translate-x-1/2 -top-2" />
              <Chair className="left-1/2 -translate-x-1/2 -bottom-2" />
              <Chair className="top-1/2 -translate-y-1/2 -left-2 rotate-90" />
              <Chair className="top-1/2 -translate-y-1/2 -right-2 rotate-90" />
            </>
          )}
          {isBench && (
            <>
              <Chair className="left-[18%] -translate-x-1/2 -top-2" />
              <Chair className="left-1/2 -translate-x-1/2 -top-2" />
              <Chair className="left-[82%] -translate-x-1/2 -top-2" />
              <Chair className="left-[18%] -translate-x-1/2 -bottom-2" />
              <Chair className="left-1/2 -translate-x-1/2 -bottom-2" />
              <Chair className="left-[82%] -translate-x-1/2 -bottom-2" />
            </>
          )}

          <div
            className={`absolute inset-0 ${surfaceClass} bg-white dark:bg-zinc-100 ${styles.ring} shadow-sm flex flex-col items-center justify-center`}
          >
            <span className="text-[13px] font-black text-zinc-800 leading-none">
              {table.id}
            </span>
            <span className="text-[11px] font-bold text-zinc-500 mt-0.5 leading-none">
              {table.capacity}
            </span>
          </div>
        </div>

        {resolvedStatus.label ? (
          <span
            className={`mt-1.5 text-[10px] font-bold whitespace-nowrap ${styles.label}`}
          >
            {resolvedStatus.label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
