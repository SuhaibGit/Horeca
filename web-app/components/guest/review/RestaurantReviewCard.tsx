import Image from "next/image";
import type { ReviewRestaurantInfo } from "./types";

interface RestaurantReviewCardProps {
  restaurant: ReviewRestaurantInfo;
}

const RestaurantReviewCard = ({ restaurant }: RestaurantReviewCardProps) => {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#F1F5F9] bg-white p-3 shadow-sm">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
        <Image
          src={restaurant.imageUrl}
          alt={restaurant.name}
          fill
          className="object-cover"
          sizes="56px"
        />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold uppercase tracking-wide text-[#111827]">
          {restaurant.name}
        </p>
        <p className="text-xs text-[#64748B]">{restaurant.category}</p>
      </div>
    </div>
  );
};

export default RestaurantReviewCard;
