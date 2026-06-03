"use client";

import React from "react";

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  benefits: string[];
  isHighlighted?: boolean;
  isPopular?: boolean;
  buttonText?: string;
  compact?: boolean;
  onSelect: () => void;
}

export default function PricingCard({
  name,
  price,
  period = "/month",
  description,
  benefits,
  isHighlighted = false,
  isPopular = false,
  buttonText = "Get Started",
  compact = false,
  onSelect,
}: PricingCardProps) {
  const cardRadius = compact ? "rounded-2xl" : "rounded-[24px]";
  const sectionPad = compact ? "p-5" : "p-8";
  const priceSize = compact ? "text-2xl" : "text-3xl";
  const benefitGap = compact ? "space-y-2" : "space-y-3.5";
  const btnPad = compact ? "py-2.5" : "py-3.5";

  if (isHighlighted) {
    return (
      <div className={`bg-white dark:bg-zinc-900 ${cardRadius} shadow-[0_16px_40px_-8px_rgba(24,103,78,0.06)] flex h-full flex-col overflow-hidden relative transition-all duration-300`}>
        {/* Premium Gradient Header Block */}
        <div className={`bg-linear-to-r from-[#041B40] to-[#0A46A6] ${sectionPad} text-white space-y-3 flex flex-col justify-between flex-shrink-0`}>
          <div className="flex justify-between items-center">
            <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full select-none">
              {name}
            </span>
            {isPopular && (
              <span className="text-[10px] bg-white text-[#0A46A6] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider select-none">
                Most Popular
              </span>
            )}
          </div>
          <div className="pt-1">
            <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider block">AED</span>
            <span className={`${priceSize} font-black`}>{price}</span>
            <span className="text-zinc-200 font-bold text-sm">{period}</span>
          </div>
          <p className="text-xs text-zinc-100/90 leading-relaxed font-medium">
            {description}
          </p>
          <div className="pt-1">
            <button
              onClick={onSelect}
              type="button"
              className={`w-full ${btnPad} bg-white text-[#0A46A6] hover:bg-zinc-50 active:scale-[0.98] text-xs font-black rounded-xl transition-all shadow-md cursor-pointer`}
            >
              {buttonText}
            </button>
          </div>
        </div>

        {/* Benefits checklist — grows so all cards match row height */}
        <div className={`${sectionPad} pt-4 flex flex-1 flex-col bg-white dark:bg-zinc-900`}>
          <div className={`${benefitGap} flex-1`}>
            <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Benefits:</p>
            {benefits.map((ben) => (
              <div key={ben} className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                <svg className="w-4 h-4 text-[#0A46A6] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium text-left">{ben}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-zinc-900 ${cardRadius} dark:border-zinc-800 ${sectionPad} shadow-xs flex h-full flex-col transition-all duration-300 hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700`}>
      <div className="shrink-0 space-y-3">
        <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-bold rounded-full select-none">
          {name}
        </span>
        <div className="pt-1">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">AED</span>
          <span className={`${priceSize} font-black text-zinc-900 dark:text-white`}>{price}</span>
          <span className="text-zinc-400 dark:text-zinc-500 font-bold text-sm">{period}</span>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
          {description}
        </p>
        <div className="pt-1">
          <button
            onClick={onSelect}
            type="button"
            className={`w-full ${btnPad} bg-linear-to-r from-[#041B40] to-[#0A46A6] hover:bg-[#12503C] active:scale-[0.98] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer`}
          >
            {buttonText}
          </button>
        </div>
      </div>

      {/* Benefits checklist — grows so all cards match row height */}
      <div
        className={`flex flex-1 flex-col border-t border-zinc-100 dark:border-zinc-800/80 ${
          compact ? "mt-4 pt-4" : "mt-6 pt-6"
        }`}
      >
        <div className={`${benefitGap} flex-1`}>
          <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Benefits:</p>
          {benefits.map((ben) => (
            <div key={ben} className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
              <svg className="w-4 h-4 text-[#0A46A6] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium text-left">{ben}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
