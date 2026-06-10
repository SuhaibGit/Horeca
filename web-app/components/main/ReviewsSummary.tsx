import { Star } from "lucide-react";
import { ReviewsSummaryData } from "./types";

interface ReviewsSummaryProps {
  data: ReviewsSummaryData;
}

function formatReviewCount(count: number) {
  return new Intl.NumberFormat("en-US").format(count);
}

function PlatformBadge({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase();

  if (name.toLowerCase().includes("google")) {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#4285F4] ring-1 ring-gray-200">
        G
      </span>
    );
  }

  if (name.toLowerCase().includes("trip")) {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#34A853] text-[8px] font-bold text-white">
        TA
      </span>
    );
  }

  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-600">
      {initial}
    </span>
  );
}

const ReviewsSummary = ({ data }: ReviewsSummaryProps) => {
  const fullStars = Math.round(data.averageRating);

  return (
    <section className="px-4 py-6">
      <h2 className="mb-4 text-center font-serif text-xl text-[#1E293B]">{data.title}</h2>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div
          className="relative px-6 py-8 text-center"
          style={{
            backgroundImage:
              "radial-gradient(circle at 0% 0%, rgba(148,163,184,0.08) 0%, transparent 45%), radial-gradient(circle at 100% 0%, rgba(148,163,184,0.08) 0%, transparent 45%), radial-gradient(circle at 0% 100%, rgba(148,163,184,0.08) 0%, transparent 45%), radial-gradient(circle at 100% 100%, rgba(148,163,184,0.08) 0%, transparent 45%)",
          }}
        >
          <div className="mb-3 flex items-center justify-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`h-5 w-5 ${
                  index < fullStars ? "fill-[#EAB308] text-[#EAB308]" : "text-gray-200"
                }`}
              />
            ))}
          </div>

          <p className="text-3xl font-bold text-[#0F172A]">
            {data.averageRating.toFixed(1)}{" "}
            <span className="text-base font-semibold text-[#334155]">Average Rating</span>
          </p>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">✦</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <p className="text-sm text-gray-500">
            Based on {formatReviewCount(data.totalReviews)} Reviews
          </p>
        </div>

        <div className="grid grid-cols-2 divide-x divide-gray-100 border-t border-gray-100 bg-[#FAFAFA]">
          {data.platforms.map((platform) => (
            <div key={platform.id} className="flex items-center justify-center gap-2 px-3 py-3">
              {platform.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={platform.logoUrl} alt={platform.name} className="h-5 w-5 object-contain" />
              ) : (
                <PlatformBadge name={platform.name} />
              )}
              <span className="text-xs font-medium text-[#334155]">{platform.name}</span>
              <Star className="h-3.5 w-3.5 fill-[#EAB308] text-[#EAB308]" />
              <span className="text-xs font-semibold text-[#0F172A]">
                {platform.rating.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSummary;
