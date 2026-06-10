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

  const banner = (
    <div className="relative aspect-[2.4/1] w-full overflow-hidden rounded-2xl">
      <Image
        src={activePromotion.imageUrl}
        alt={activePromotion.alt ?? "Promotion banner"}
        fill
        priority={activeIndex === 0}
        className="object-cover"
        sizes="100vw"
      />
    </div>
  );

  return (
    <section className="px-4 pb-2">
      {activePromotion.href ? (
        <a href={activePromotion.href} className="block">
          {banner}
        </a>
      ) : (
        banner
      )}

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
