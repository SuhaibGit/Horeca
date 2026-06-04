"use client";

import React, { useEffect, useState } from "react";
import DetailDrawer from "../DetailDrawer";
import {
  FILTER_STATUS_OPTIONS,
  FILTER_TYPE_OPTIONS,
  type LiveOrdersFilterState,
  type LiveOrderType,
} from "../../data/mockOrders";

export const DEFAULT_LIVE_ORDERS_FILTERS: LiveOrdersFilterState = {
  statuses: [],
  types: [],
};

interface LiveOrdersFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  appliedFilters: LiveOrdersFilterState;
  onApply: (filters: LiveOrdersFilterState) => void;
}

function FilterSection({
  title,
  options,
  selected,
  onToggle,
  defaultOpen = true,
}: {
  title: string;
  options: { label: string; value: string }[];
  selected: string[];
  onToggle: (value: string) => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-zinc-100 dark:border-zinc-800 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4 text-left cursor-pointer"
      >
        <span className="text-[14px] font-bold text-zinc-900 dark:text-white">{title}</span>
        <svg
          className={`w-4 h-4 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="pb-4 space-y-3">
          {options.map((opt) => {
            const checked = selected.includes(opt.value);
            return (
              <label
                key={opt.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(opt.value)}
                  className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-600 text-[#0A46A6] focus:ring-[#0A46A6] accent-[#0A46A6] cursor-pointer"
                />
                <span className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200">
                  {opt.label}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function LiveOrdersFilterDrawer({
  isOpen,
  onClose,
  appliedFilters,
  onApply,
}: LiveOrdersFilterDrawerProps) {
  const [draft, setDraft] = useState<LiveOrdersFilterState>(appliedFilters);

  useEffect(() => {
    if (isOpen) setDraft(appliedFilters);
  }, [isOpen, appliedFilters]);

  const toggleStatus = (value: string) => {
    setDraft((prev) => ({
      ...prev,
      statuses: prev.statuses.includes(value)
        ? prev.statuses.filter((s) => s !== value)
        : [...prev.statuses, value],
    }));
  };

  const toggleType = (value: string) => {
    const typeValue = value as LiveOrderType;
    setDraft((prev) => ({
      ...prev,
      types: prev.types.includes(typeValue)
        ? prev.types.filter((t) => t !== typeValue)
        : [...prev.types, typeValue],
    }));
  };

  const handleReset = () => setDraft(DEFAULT_LIVE_ORDERS_FILTERS);

  return (
    <DetailDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Filters"
      maxWidthClass="max-w-[293px]"
      headerActions={
        <button
          type="button"
          onClick={handleReset}
          className="text-[13px] font-semibold text-[#0A46A6] hover:underline cursor-pointer mr-1"
        >
          Reset
        </button>
      }
      contentClassName="px-6 py-2"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-[100px] border border-zinc-200 dark:border-zinc-700 text-[13px] font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            className="px-5 py-2.5 rounded-[100px] bg-linear-to-r from-[#041B40] to-[#0A46A6] text-white text-[13px] font-bold hover:opacity-95 transition-opacity cursor-pointer"
          >
            Apply Filter
          </button>
        </div>
      }
    >
      <FilterSection
        title="Order Status"
        options={FILTER_STATUS_OPTIONS}
        selected={draft.statuses}
        onToggle={toggleStatus}
      />
      <FilterSection
        title="Order Type"
        options={FILTER_TYPE_OPTIONS}
        selected={draft.types}
        onToggle={toggleType}
      />
    </DetailDrawer>
  );
}
