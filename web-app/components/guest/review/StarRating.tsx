"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
}

const StarRating = ({ value, onChange }: StarRatingProps) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;
        return (
          <button
            key={star}
            type="button"
            aria-label={`Rate ${star} star${star === 1 ? "" : "s"}`}
            onClick={() => onChange(star)}
            className="p-0.5 transition-transform active:scale-95"
          >
            <Star
              className={`h-8 w-8 ${filled ? "fill-[#FBBF24] text-[#FBBF24]" : "fill-none text-[#D1D5DB]"}`}
              strokeWidth={filled ? 0 : 1.5}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
