"use client";

import React, { useEffect, useState } from "react";
import { InventoryItem } from "../../data/mockInventory";
import InventoryItemThumb from "./InventoryItemThumb";
import StatusBadge from "./StatusBadge";
import StockProgressBar from "./StockProgressBar";
import InfoRow from "../InfoRow";
import StockHistoryTimeline from "./StockHistoryTimeline";
import DetailDrawer from "../DetailDrawer";
import DetailDrawerTabs from "../DetailDrawerTabs";

interface InventoryDetailDrawerProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (item: InventoryItem) => void;
  onRestockClick?: (item: InventoryItem) => void;
}

type DetailTab = "overview" | "history";

function formatExpiry(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toISOString().split("T")[0];
}

export default function InventoryDetailDrawer({
  item,
  isOpen,
  onClose,
  onEdit,
  onRestockClick,
}: InventoryDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");

  useEffect(() => {
    if (isOpen) setActiveTab("overview");
  }, [isOpen, item?.id]);

  if (!item) return null;

  return (
    <DetailDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Item Details"
      footer={
        <div className="p-6 flex gap-3">
          <button
            type="button"
            onClick={() => onEdit?.(item)}
            className="flex-1 py-3 rounded-full border border-zinc-200 dark:border-zinc-700 text-[14px] font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Edit Details
          </button>
          <button
            type="button"
            onClick={() => onRestockClick?.(item)}
            className="flex-1 py-3 rounded-full bg-linear-to-r from-[#041B40] to-[#0A46A6] hover:bg-[#12503C] text-white text-[14px] font-bold transition-colors cursor-pointer"
          >
            Restock Item
          </button>
        </div>
      }
    >
      <div className="flex items-center gap-4">
        <InventoryItemThumb emoji={item.imageEmoji} color={item.imageColor} size="lg" />
        <div className="min-w-0">
          <h3 className="text-[18px] font-bold text-zinc-900 dark:text-white">{item.name}</h3>
          <p className="text-[13px] font-medium text-zinc-400 mt-0.5">SKU: {item.sku}</p>
          <div className="mt-2">
            <StatusBadge status={item.status} />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-semibold text-zinc-600 dark:text-zinc-300">Stock Level</span>
          <span className="text-[13px] font-bold text-zinc-800 dark:text-zinc-100">
            {item.currentQuantity}/{item.maxCapacity} {item.unit}
          </span>
        </div>
        <StockProgressBar
          current={item.currentQuantity}
          max={item.maxCapacity}
          unit={item.unit}
          status={item.status}
          showLabel={false}
        />
      </div>

      <DetailDrawerTabs
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "history", label: "Stock History" },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "overview" ? (
        <div className="space-y-2">
          <InfoRow label="Category" value={item.category} />
          <InfoRow label="Stock Level" value={`${item.currentQuantity} ${item.unit}`} />
          <InfoRow label="Threshold" value={`${item.minThreshold} ${item.unit}`} />
          <InfoRow label="Expiry Date" value={formatExpiry(item.expiryDate)} />
          <InfoRow label="Last Updated" value={item.lastUpdated} />
          <InfoRow label="Supplier" value={item.supplier || "—"} />
          <InfoRow label="Storage" value={item.storageLocation || "—"} />
        </div>
      ) : (
        <StockHistoryTimeline entries={item.stockHistory} />
      )}
    </DetailDrawer>
  );
}
