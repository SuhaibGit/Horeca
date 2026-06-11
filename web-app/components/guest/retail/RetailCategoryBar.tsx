"use client";

import { Coffee, Gift, ShoppingBag, Shirt } from "lucide-react";
import type { RetailCategory } from "@/data/retailProducts";

interface RetailCategoryBarProps {
  categories: RetailCategory[];
  activeCategoryId: string;
  onChange: (categoryId: string) => void;
}

function MugIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M6 8h12v8a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V8z" />
      <path d="M18 10h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1" />
      <path d="M7 4c0-1 1-2 2-2h6c1 0 2 1 2 2" />
    </svg>
  );
}

function getIcon(icon: RetailCategory["icon"], active: boolean) {
  const className = `h-5 w-5 ${active ? "text-white" : "text-[#94A3B8]"}`;
  switch (icon) {
    case "all":
      return <ShoppingBag className={className} strokeWidth={1.5} />;
    case "beans":
      return <Coffee className={className} strokeWidth={1.5} />;
    case "mug":
      return <MugIcon className={className} />;
    case "merchandise":
      return <Shirt className={className} strokeWidth={1.5} />;
    case "gift":
      return <Gift className={className} strokeWidth={1.5} />;
    default:
      return <ShoppingBag className={className} strokeWidth={1.5} />;
  }
}

export default function RetailCategoryBar({
  categories,
  activeCategoryId,
  onChange,
}: RetailCategoryBarProps) {
  return (
    <div className="scrollbar-hide flex gap-4 overflow-x-auto px-4 py-4">
      {categories.map((category) => {
        const active = category.id === activeCategoryId;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange(category.id)}
            className="flex min-w-[72px] shrink-0 flex-col items-center gap-2"
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full border ${
                active
                  ? "border-transparent bg-gradient-to-r from-[#041B40] to-[#0A46A6]"
                  : "border-gray-100 bg-white"
              }`}
            >
              {getIcon(category.icon, active)}
            </div>
            <span
              className={`text-center text-xs font-medium ${
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
}
