"use client";

import React from "react";
import { categoryTextStyle } from "../../lib/menuStyles";

export interface MenuDetailModifierOption {
  name: string;
  description: string;
  image?: string;
}

export interface MenuDetailModifierGroup {
  id: string;
  name: string;
  selectionType: string;
  min: number;
  max: number;
  options: MenuDetailModifierOption[];
}

export interface MenuDetailItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  fulfillmentType: string;
  servingPeriods: string[];
  image: string;
  tags: string[];
  allergens: string[];
  available: boolean;
}

interface MenuDetailViewProps {
  item: MenuDetailItem;
  modifierGroups: MenuDetailModifierGroup[];
  expandedGroupId: string | null;
  onExpandedGroupChange: (id: string | null) => void;
  onDelete: () => void;
  onEdit: () => void;
}

function tagPill(tag: string) {
  if (tag === "Chef's Pick") {
    return (
      <span
        key={tag}
        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100/80 text-amber-700 border border-amber-200"
      >
        <span>⭐</span> {tag}
      </span>
    );
  }
  if (tag === "Halal") {
    return (
      <span
        key={tag}
        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-600 border border-purple-200"
      >
        {tag}
      </span>
    );
  }
  if (tag === "Dairy") {
    return (
      <span
        key={tag}
        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-600 border border-sky-200"
      >
        {tag}
      </span>
    );
  }
  return (
    <span
      key={tag}
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-600 border border-zinc-200"
    >
      {tag}
    </span>
  );
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );
}

export default function MenuDetailView({
  item,
  modifierGroups,
  expandedGroupId,
  onExpandedGroupChange,
  onDelete,
  onEdit,
}: MenuDetailViewProps) {
  const servingLabel =
    item.servingPeriods.length > 1 ? item.servingPeriods.join(", ") : item.servingPeriods[0] || "All Day";

  return (
    <div className="space-y-6 animate-fade-in select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-[24px] font-semibold text-[#333839] dark:text-white tracking-tight">
          Menu Detail
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 text-[#E25C5C] text-[13px] font-bold hover:bg-red-100/80 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
          >
            <TrashIcon />
            Delete
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#0A46A6]/30 bg-[#EBF7FF] dark:bg-blue-950/30 text-[#0A46A6] text-[13px] font-bold hover:bg-[#EBF7FF]/80 transition-colors cursor-pointer"
          >
            <EditIcon />
            Edit
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[24px] p-6 shadow-sm">
        <h2 className="text-[13px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4">
          Meal Items Summary
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative w-full md:w-[220px] h-[160px] rounded-2xl overflow-hidden shrink-0">
            <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
          </div>

          <div className="flex-1 space-y-4 min-w-0">
            <div>
              <h3 className="text-[20px] font-bold text-zinc-900 dark:text-white">{item.name}</h3>
              <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-[13px]">
              <div className="flex justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <span className="text-zinc-400 font-medium">Category</span>
                <span className={`font-semibold ${categoryTextStyle(item.category)}`}>{item.category}</span>
              </div>
              <div className="flex justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <span className="text-zinc-400 font-medium">Price</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{item.price}</span>
              </div>
              <div className="flex justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <span className="text-zinc-400 font-medium">Fulfillment</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{item.fulfillmentType}</span>
              </div>
              <div className="flex justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <span className="text-zinc-400 font-medium">Serving Period</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{servingLabel}</span>
              </div>
              <div className="flex justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <span className="text-zinc-400 font-medium">Tag</span>
                <div className="flex flex-wrap gap-1.5 justify-end">{item.tags.map(tagPill)}</div>
              </div>
              <div className="flex justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <span className="text-zinc-400 font-medium">Allergens</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {item.allergens.length > 0 ? item.allergens.join(", ") : "—"}
                </span>
              </div>
              <div className="flex justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <span className="text-zinc-400 font-medium">Availability</span>
                <span
                  className={`font-bold ${item.available ? "text-[#0A46A6]" : "text-zinc-400"}`}
                >
                  {item.available ? "Available" : "Unavailable"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-[13px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
          Modifier Group
        </h2>

        {modifierGroups.map((group) => {
          const isExpanded = expandedGroupId === group.id;
          return (
            <div
              key={group.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => onExpandedGroupChange(isExpanded ? null : group.id)}
                className="w-full px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-zinc-50/60 dark:bg-zinc-900/60 cursor-pointer"
              >
                <div className="flex  gap-3 text-left flex-wrap">
                  <span className="w-6 h-6 mt-2 rounded-full bg-linear-to-r from-[#041B40] to-[#0A46A6] text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                    {group.options.length}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[24px] font-semibold text-black">{group.name}</span>
                    {isExpanded && (
                      <span className="text-[16px] text-[#717680] font-semibold">
                        {group.selectionType} · Min: {group.min} · Max: {group.max}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-zinc-400 text-[12px] font-semibold shrink-0">
                  <span>
                    {group.options.length} Option{group.options.length !== 1 ? "s" : ""}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {isExpanded && group.options.length > 0 && (
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-t border-zinc-100 dark:border-zinc-800">
                  {group.options.map((opt) => (
                    <div
                      key={`${group.id}-${opt.name}`}
                      className="flex items-center gap-3 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-950/40"
                    >
                      <img
                        src={opt.image || item.image}
                        alt={opt.name}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold text-zinc-800 dark:text-white truncate">
                          {opt.name}
                        </p>
                        <p className="text-[11px] text-zinc-400 font-medium">{opt.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
