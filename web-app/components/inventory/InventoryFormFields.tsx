"use client";

import React from "react";
import Input from "../Input";
import SelectField from "../SelectField";
import { CATEGORY_OPTIONS, UNIT_OPTIONS, UNIT_LABELS } from "../../data/mockInventory";

export interface InventoryFormValues {
  name: string;
  sku: string;
  category: string;
  unit: string;
  currentQuantity: number;
  minThreshold: number;
  supplier: string;
  expiryDate: string;
  storageLocation: string;
}

interface InventoryFormFieldsProps {
  values: InventoryFormValues;
  onChange: (field: keyof InventoryFormValues, value: string | number) => void;
  idPrefix?: string;
  showUpload?: boolean;
  showGallery?: boolean;
  galleryEmoji?: string;
  expiryInputType?: "date" | "text";
  expiryPlaceholder?: string;
}

const FIELD_CLASS = "!py-2.5 !px-3";

export default function InventoryFormFields({
  values,
  onChange,
  idPrefix = "inv",
  showUpload = false,
  showGallery = false,
  galleryEmoji = "📦",
  expiryInputType = "date",
  expiryPlaceholder,
}: InventoryFormFieldsProps) {
  const unitOptions = UNIT_OPTIONS.map((u) => ({
    value: u,
    label: UNIT_LABELS[u] ?? u,
  }));

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          id={`${idPrefix}-name`}
          label="Ingredient Name"
          placeholder="e.g. Ribeye Steak"
          value={values.name}
          onChange={(e) => onChange("name", e.target.value)}
          className={FIELD_CLASS}
          required
        />
        <Input
          id={`${idPrefix}-sku`}
          label="SKU"
          placeholder="PRO-X-001"
          value={values.sku}
          onChange={(e) => onChange("sku", e.target.value)}
          className={FIELD_CLASS}
        />
        <SelectField
          id={`${idPrefix}-category`}
          label="Category"
          placeholder="Select category"
          options={CATEGORY_OPTIONS.map((c) => ({ value: c, label: c }))}
          value={values.category}
          onChange={(e) => onChange("category", e.target.value)}
          className={FIELD_CLASS}
        />
        <SelectField
          id={`${idPrefix}-unit`}
          label="Unit Type"
          placeholder="Select unit"
          options={unitOptions}
          value={values.unit}
          onChange={(e) => onChange("unit", e.target.value)}
          className={FIELD_CLASS}
        />
        <Input
          id={`${idPrefix}-qty`}
          label="Current Quantity"
          type="number"
          min={0}
          placeholder="e.g. 0"
          value={values.currentQuantity || ""}
          onChange={(e) => onChange("currentQuantity", Number(e.target.value) || 0)}
          className={FIELD_CLASS}
        />
        <Input
          id={`${idPrefix}-threshold`}
          label="Minimum Threshold"
          type="number"
          min={0}
          placeholder="e.g. 0"
          value={values.minThreshold || ""}
          onChange={(e) => onChange("minThreshold", Number(e.target.value) || 0)}
          className={FIELD_CLASS}
        />
        <Input
          id={`${idPrefix}-supplier`}
          label="Supplier"
          placeholder="e.g. Premium Meats Co."
          value={values.supplier}
          onChange={(e) => onChange("supplier", e.target.value)}
          className={FIELD_CLASS}
        />
        <Input
          id={`${idPrefix}-expiry`}
          label="Expiry Date"
          type={expiryInputType}
          placeholder={expiryPlaceholder}
          value={values.expiryDate}
          onChange={(e) => onChange("expiryDate", e.target.value)}
          className={FIELD_CLASS}
        />
      </div>

      <div className="mt-3">
        <Input
          id={`${idPrefix}-storage`}
          label="Storage Location"
          placeholder="e.g. Freezer A, Shelf 3"
          value={values.storageLocation}
          onChange={(e) => onChange("storageLocation", e.target.value)}
          className={FIELD_CLASS}
        />
      </div>

      {showUpload && (
        <div className="mt-3 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl py-4 px-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#28A388]/50 hover:bg-[#EBF7FF] /30 dark:hover:bg-emerald-950/10 transition-colors">
          <div className="w-8 h-8 rounded-full bg-[#EBF7FF]  dark:bg-emerald-950/40 flex items-center justify-center text-[#0A46A6] dark:text-[#28A388] mb-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <p className="text-[13px] font-bold text-[#0A46A6] dark:text-[#28A388]">Upload Ingredient Image</p>
          <p className="text-[11px] font-medium text-zinc-400 mt-0.5">PNG, JPG up to 5MB</p>
        </div>
      )}

      {showGallery && (
        <div className="mt-3 relative rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
          <div className="grid grid-cols-3 gap-0.5 h-24">
            {["#FEE2E2", "#F3F4F6", "#FFEDD5"].map((color, i) => (
              <div
                key={i}
                className="flex items-center justify-center text-2xl"
                style={{ backgroundColor: color }}
              >
                {galleryEmoji}
              </div>
            ))}
          </div>
          <button
            type="button"
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 text-zinc-500 flex items-center justify-center text-xs shadow-sm"
            aria-label="Remove images"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
