"use client";

import React from "react";
import { InventoryStatus } from "../../data/mockInventory";

interface StockProgressBarProps {
  current: number;
  max: number;
  unit: string;
  status: InventoryStatus;
  showLabel?: boolean;
  className?: string;
}

function getBarColor(status: InventoryStatus, percent: number): string {
  if (status === "out_of_stock" || percent <= 0) return "bg-red-500";
  if (status === "low_stock" || percent < 40)
    return "bg-[#E62E05]";
  if (percent < 60) return "bg-[#EAAA08]";
  return "bg-[#099250]";
}

export default function StockProgressBar({
  current,
  max,
  unit,
  status,
  showLabel = true,
  className = "",
}: StockProgressBarProps) {
  const percent = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0;




  return (
    <div className={`min-w-[120px] ${className}`}>
      {showLabel && (
        <p className="text-[13px] font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">
          {current}
          {unit}
        </p>
      )}
      <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${getBarColor(status, percent)}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
