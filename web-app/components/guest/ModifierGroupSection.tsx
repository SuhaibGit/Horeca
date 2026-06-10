"use client";

import Image from "next/image";
import type { MenuDetailModifierGroup } from "@/components/menu/MenuDetailView";

interface ModifierGroupSectionProps {
  group: MenuDetailModifierGroup;
  subtitle?: string;
  selected: string | string[];
  onSelect: (value: string | string[]) => void;
  variant?: "card" | "pill";
}

function isSelected(selected: string | string[], optionName: string) {
  return Array.isArray(selected) ? selected.includes(optionName) : selected === optionName;
}

const ModifierGroupSection = ({
  group,
  subtitle,
  selected,
  onSelect,
  variant = "card",
}: ModifierGroupSectionProps) => {
  const isMulti = group.selectionType === "Multi Select";

  const handleSelect = (optionName: string) => {
    if (isMulti) {
      const current = Array.isArray(selected) ? selected : [];
      if (current.includes(optionName)) {
        onSelect(current.filter((value) => value !== optionName));
      } else {
        onSelect([...current, optionName]);
      }
      return;
    }
    onSelect(optionName);
  };

  return (
    <section className="px-4 pb-6">
      <h3 className="text-base font-semibold text-[#111827]">{group.name}</h3>
      {subtitle && <p className="mt-1 text-xs text-[#64748B]">{subtitle}</p>}

      <div
        className={`mt-3 ${
          variant === "pill"
            ? "flex gap-3 overflow-x-auto pb-1"
            : "grid grid-cols-2 gap-3 sm:grid-cols-4"
        }`}
      >
        {group.options.map((option) => {
          const active = isSelected(selected, option.name);

          return (
            <button
              key={option.name}
              type="button"
              onClick={() => handleSelect(option.name)}
              className={`relative overflow-hidden rounded-2xl border text-left transition-colors ${
                active
                  ? "border-[#0A46A6] ring-1 ring-[#0A46A6]"
                  : "border-gray-200"
              } ${variant === "pill" ? "min-w-[120px] shrink-0" : ""}`}
            >
              {option.image && (
                <div className={`relative ${variant === "pill" ? "h-20" : "h-24"} w-full`}>
                  <Image src={option.image} alt={option.name} fill className="object-cover" />
                </div>
              )}
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-[#111827]">{option.name}</p>
                  <span
                    className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border ${
                      active ? "border-[#0A46A6] bg-[#0A46A6]" : "border-gray-300"
                    }`}
                  />
                </div>
                <p className="mt-1 text-[11px] text-[#64748B]">{option.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default ModifierGroupSection;
