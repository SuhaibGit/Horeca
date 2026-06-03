"use client";

import React, { useEffect, useState } from "react";
import FormModalLayout from "../FormModalLayout";
import InventoryFormFields, { InventoryFormValues } from "./InventoryFormFields";
import {
  InventoryItem,
  CATEGORY_EMOJI,
  computeInventoryStatus,
  createHistoryEntry,
  refreshItem,
} from "../../data/mockInventory";

export type InventoryModalMode = "add" | "edit" | "restock";

export interface InventoryModalState {
  mode: InventoryModalMode;
  item?: InventoryItem;
}

interface InventoryModalProps {
  state: InventoryModalState | null;
  onClose: () => void;
  onAdd: (item: InventoryItem) => void;
  onSave: (item: InventoryItem) => void;
  onRestock: (item: InventoryItem, quantity: number) => void;
}

const EMPTY_FORM: InventoryFormValues = {
  name: "",
  sku: "",
  category: "",
  unit: "",
  currentQuantity: 0,
  minThreshold: 0,
  supplier: "",
  expiryDate: "",
  storageLocation: "",
};

function toDisplayDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function parseDisplayDate(value: string): string {
  const parts = value.split("/");
  if (parts.length !== 3) return value;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

const MODE_CONFIG = {
  add: {
    title: "Add New Item",
    submitLabel: "Add Items",
    size: "lg" as const,
    maxWidthClass: "!max-w-[520px]",
    formClassName: "p-5",
  },
  edit: {
    title: "Edit Inventory",
    submitLabel: "Save Inventory",
    size: "lg" as const,
    maxWidthClass: "!max-w-[520px]",
    formClassName: "p-5",
  },
  restock: {
    title: "Restock Item",
    submitLabel: "Confirm Restock",
    size: "sm" as const,
    maxWidthClass: "!max-w-[420px]",
    formClassName: "p-6",
  },
};

export default function InventoryModal({
  state,
  onClose,
  onAdd,
  onSave,
  onRestock,
}: InventoryModalProps) {
  const mode = state?.mode ?? "add";
  const item = state?.item ?? null;
  const isOpen = state !== null;
  const config = MODE_CONFIG[mode];

  const [form, setForm] = useState<InventoryFormValues>(EMPTY_FORM);
  const [restockQty, setRestockQty] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "add") {
      setForm(EMPTY_FORM);
      return;
    }

    if (!item) return;

    if (mode === "edit") {
      setForm({
        name: item.name,
        sku: item.sku,
        category: item.category,
        unit: item.unit,
        currentQuantity: item.currentQuantity,
        minThreshold: item.minThreshold,
        supplier: item.supplier,
        expiryDate: toDisplayDate(item.expiryDate),
        storageLocation: item.storageLocation,
      });
    }

    if (mode === "restock") {
      setRestockQty("");
    }
  }, [isOpen, mode, item?.id]);

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setRestockQty("");
    onClose();
  };

  const updateForm = (field: keyof InventoryFormValues, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "restock") {
      if (!item) return;
      const qty = parseFloat(restockQty);
      if (!qty || qty <= 0) return;
      onRestock(item, qty);
      handleClose();
      return;
    }

    if (!form.name.trim()) return;

    if (mode === "add") {
      const maxCapacity = Math.max(form.currentQuantity * 2, form.minThreshold * 3, 100);
      const meta = CATEGORY_EMOJI[form.category] ?? { emoji: "📦", color: "#F3F4F6" };
      const expiry = form.expiryDate || new Date().toISOString().split("T")[0];
      const unit = form.unit || "kg";
      const initialEntry = createHistoryEntry(
        "added",
        form.currentQuantity || maxCapacity,
        unit,
        "Manual entry"
      );

      const newItem: InventoryItem = refreshItem({
        id: `inv-${Date.now()}`,
        name: form.name.trim(),
        sku: form.sku.trim() || `SKU-${Date.now()}`,
        category: form.category || "Dry Goods",
        unit,
        currentQuantity: form.currentQuantity,
        maxCapacity,
        minThreshold: form.minThreshold,
        supplier: form.supplier.trim(),
        expiryDate: expiry,
        storageLocation: form.storageLocation.trim(),
        status: computeInventoryStatus(form.currentQuantity, form.minThreshold, expiry),
        lastUpdated: "Just now",
        imageEmoji: meta.emoji,
        imageColor: meta.color,
        stockHistory: [initialEntry],
      });

      onAdd(newItem);
      handleClose();
      return;
    }

    if (mode === "edit" && item) {
      const expiryIso = parseDisplayDate(form.expiryDate);
      const meta = CATEGORY_EMOJI[form.category] ?? {
        emoji: item.imageEmoji,
        color: item.imageColor,
      };

      const updated: InventoryItem = refreshItem({
        ...item,
        name: form.name.trim(),
        sku: form.sku.trim(),
        category: form.category,
        unit: form.unit,
        currentQuantity: form.currentQuantity,
        minThreshold: form.minThreshold,
        supplier: form.supplier.trim(),
        expiryDate: expiryIso,
        storageLocation: form.storageLocation.trim(),
        status: computeInventoryStatus(
          form.currentQuantity,
          form.minThreshold,
          expiryIso
        ),
        imageEmoji: meta.emoji,
        imageColor: meta.color,
      });

      onSave(updated);
      handleClose();
    }
  };

  if (mode !== "add" && !item) return null;

  const unitLabel = item?.unit === "kg" ? "Kg" : item?.unit ?? "";

  return (
    <FormModalLayout
      isOpen={isOpen}
      onClose={handleClose}
      title={config.title}
      submitLabel={config.submitLabel}
      onSubmit={handleSubmit}
      size={config.size}
      maxWidthClass={config.maxWidthClass}
      formClassName={config.formClassName}
    >
      {mode === "restock" && item ? (
        <>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/40 p-4 text-center">
              <p className="text-[20px] font-bold text-zinc-900 dark:text-white">
                {item.currentQuantity}
                {item.unit}
              </p>
              <p className="text-[12px] font-semibold text-zinc-400 mt-1">Current</p>
            </div>
            <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/40 p-4 text-center">
              <p className="text-[20px] font-bold text-zinc-900 dark:text-white">
                {item.minThreshold}
                {item.unit}
              </p>
              <p className="text-[12px] font-semibold text-zinc-400 mt-1">Threshold</p>
            </div>
          </div>

          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1.5">
            Quantity to Add
          </label>
          <div className="relative mb-2">
            <input
              type="number"
              min="0"
              step="0.1"
              value={restockQty}
              onChange={(e) => setRestockQty(e.target.value)}
              placeholder="eg.0.0"
              className="w-full px-4 py-3 pr-14 bg-[#f4f5f6] dark:bg-zinc-800/40 border border-zinc-100/80 dark:border-zinc-800 rounded-xl text-[13px] font-medium text-zinc-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0A46A6]/80"
            />
            <span className="absolute inset-y-0 right-4 flex items-center text-[13px] font-bold text-zinc-400">
              {unitLabel}
            </span>
          </div>
        </>
      ) : (
        <InventoryFormFields
          values={form}
          onChange={updateForm}
          idPrefix={mode === "edit" ? "edit" : "inv"}
          showUpload={mode === "add"}
          showGallery={mode === "edit"}
          galleryEmoji={item?.imageEmoji ?? "📦"}
          expiryInputType={mode === "add" ? "date" : "text"}
          expiryPlaceholder={mode === "edit" ? "DD/MM/YYYY" : undefined}
        />
      )}
    </FormModalLayout>
  );
}
