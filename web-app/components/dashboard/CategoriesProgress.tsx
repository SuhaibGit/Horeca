"use client";

import React from "react";
import Card from "../Card";

export interface CategoryPerformance {
  name: string;
  value: string;
  percentage: number; // 0 to 100
}

interface CategoriesProgressProps {
  title?: string;
  categories?: CategoryPerformance[];
  footerNote?: string;
  className?: string;
}

export default function CategoriesProgress({
  title = "Top Performing Categories",
  footerNote,
  categories = [
    { name: "Starter", value: "AED 24,560", percentage: 76 },
    { name: "Main Course", value: "AED 25,000", percentage: 71 },
    { name: "Beverages", value: "AED 18,500", percentage: 65 },
    { name: "Dessert", value: "AED 14,500", percentage: 54 },
  ],
  className = "",
}: CategoriesProgressProps) {
  return (
    <Card className={`max-w-none !p-6 flex flex-col justify-between hover:shadow-md border border-zinc-100 dark:border-zinc-800 transition-all duration-300 select-none h-full min-h-0 ${className}`}>
      <h3 className="text-[20px] font-semibold text-[#333839] dark:text-zinc-200 mb-6">
        {title}
      </h3>

      <div className="space-y-5">
        {categories.map((cat, idx) => (
          <div key={idx} className="space-y-2 group">
            {/* Category Name & Metrics */}
            <div className="flex items-center justify-between text-[12px] font-semibold">
              <span className="text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors">
                {cat.name}
              </span>
              <div className="flex items-center gap-1.5 text-zinc-800 dark:text-white">
                <span>{cat.value}</span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold">
                  {cat.percentage}%
                </span>
              </div>
            </div>

            {/* Premium progress track */}
            <div className="w-full h-2 bg-zinc-50 dark:bg-zinc-850 rounded-full overflow-hidden border border-zinc-100 dark:border-zinc-800/80">
              <div
                className="h-full bg-linear-to-r from-[#041B40] to-[#0A46A6] rounded-full transition-all duration-1000 group-hover:bg-[#12503C]"
                style={{ width: `${cat.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {footerNote && (
        <p className="mt-5 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-zinc-50 dark:border-zinc-800/60 pt-4">
          {footerNote}
        </p>
      )}
    </Card>
  );
}
