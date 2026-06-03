"use client";

import React from "react";
import { InventoryStatus } from "../../data/mockInventory";

const STATUS_CONFIG: Record<
  InventoryStatus,
  { label: string; bg: string; text: string }
> = {
  in_stock: {
    label: "In Stock",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  low_stock: {
    label: "Low Stock",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-400",
  },
  out_of_stock: {
    label: "Out of Stock",
    bg: "bg-red-50 dark:bg-red-950/40",
    text: "text-red-600 dark:text-red-400",
  },
  expiring_soon: {
    label: "Expiring Soon",
    bg: "bg-orange-50 dark:bg-orange-950/40",
    text: "text-orange-700 dark:text-orange-400",
  },
};

interface StatusBadgeProps {
  status: InventoryStatus;
  className?: string;
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex px-2.5 py-0.5 text-[11px] font-bold rounded-full ${config.bg} ${config.text} ${className}`}
    >
      {config.label}
    </span>
  );
}

export function getStatusLabel(status: InventoryStatus): string {
  return STATUS_CONFIG[status].label;
}
