"use client";

import {
  Coffee,
  ConciergeBell,
  GlassWater,
  Soup,
  UtensilsCrossed,
} from "lucide-react";
import type { CategoryIcon, MenuCategory } from "./types";

interface CategoryFilterBarProps {
  categories: MenuCategory[];
  activeCategoryId: string;
  onChange: (categoryId: string) => void;
}

function getCategoryIcon(icon: CategoryIcon, active: boolean) {
  const className = `h-5 w-5 ${active ? "text-white" : "text-[#94A3B8]"}`;

  switch (icon) {
    case "all":
      return <ConciergeBell className={className} strokeWidth={1.5} />;
    case "starters":
      return <Soup className={className} strokeWidth={1.5} />;
    case "breakfast":
      return <Coffee className={className} strokeWidth={1.5} />;
    case "main-course":
      return <UtensilsCrossed className={className} strokeWidth={1.5} />;
    case "drinks":
      return <GlassWater className={className} strokeWidth={1.5} />;
    default:
      return <ConciergeBell className={className} strokeWidth={1.5} />;
  }
}

const CategoryFilterBar = ({
  categories,
  activeCategoryId,
  onChange,
}: CategoryFilterBarProps) => {
  return (
    <div className="scrollbar-hide flex gap-4 overflow-x-auto px-4 py-4">
      {categories.map((category) => {
        const active = category.id === activeCategoryId;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange(category.id)}
            className="flex min-w-[72px] flex-col items-center gap-2"
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full border ${
                active
                  ? "border-transparent bg-gradient-to-r from-[#041B40] to-[#0A46A6]"
                  : "border-gray-100 bg-white"
              }`}
            >
              {getCategoryIcon(category.icon, active)}
            </div>
            <span
              className={`text-xs font-medium ${
                active ? "text-[#0A46A6]" : "text-[#64748B]"
              }`}
            >
              {category.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilterBar;
