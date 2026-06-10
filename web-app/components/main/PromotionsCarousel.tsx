"use client";

import Image from "next/image";
import { useState } from "react";
import { Promotion } from "./types";

interface PromotionsCarouselProps {
  promotions: Promotion[];
}

const PromotionsCarousel = ({ promotions }: PromotionsCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (promotions.length === 0) return null;

  const activePromotion = promotions[activeIndex];

  return (
    <section className="px-4 pb-2">
      <div
        className="relative flex min-h-[140px] overflow-hidden rounded-2xl"
        style={{ backgroundColor: activePromotion.themeColor }}
      >
        <div className="flex flex-1 flex-col justify-center gap-1 px-4 py-4 text-white">
          <span className="text-[10px] font-semibold uppercase tracking-wide opacity-90">
            {activePromotion.partner}
          </span>
          <p className="text-lg font-bold leading-tight">
            {activePromotion.title}
            <span className="block text-sm font-semibold">{activePromotion.subtitle}</span>
          </p>
          <p className="text-[10px] text-white/80">{activePromotion.validity}</p>
          {activePromotion.buttonHref ? (
            <a
              href={activePromotion.buttonHref}
              className="mt-2 inline-flex w-fit rounded-full bg-white px-4 py-1.5 text-xs font-semibold"
              style={{ color: activePromotion.themeColor }}
            >
              {activePromotion.buttonText}
            </a>
          ) : (
            <button
              type="button"
              className="mt-2 inline-flex w-fit rounded-full bg-white px-4 py-1.5 text-xs font-semibold"
              style={{ color: activePromotion.themeColor }}
            >
              {activePromotion.buttonText}
            </button>
          )}
        </div>

        <div className="relative h-[140px] w-[130px] shrink-0">
          <Image
            src={activePromotion.imageUrl}
            alt={activePromotion.title}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {promotions.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {promotions.map((promotion, index) => (
            <button
              key={promotion.id}
              type="button"
              aria-label={`Go to promotion ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === activeIndex ? "w-4 bg-[#0B2870]" : "w-1.5 bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default PromotionsCarousel;
