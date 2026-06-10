import { Star } from "lucide-react";
import FloralLeaf from "./FloralLeaf";
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
  return (
    <section className="bg-[#F3F4F6] px-4 py-8">
      <h2 className="mb-5 text-center text-[22px] font-medium tracking-tight text-[#111827]">
        {data.title}
      </h2>

      <div className="relative overflow-hidden rounded-[32px] bg-white">
        {/* pale yellow blobs */}
        {/* <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 12% 18%, rgba(255,249,230,0.9) 0%, transparent 42%), radial-gradient(circle at 88% 82%, rgba(255,249,230,0.75) 0%, transparent 40%)",
          }}
        /> */}

        {/* corner floral decorations */}
        <FloralLeaf className="pointer-events-none absolute left-0 top-0 h-[97px] w-[82px] opacity-[0.22]" />
        <FloralLeaf className="pointer-events-none absolute bottom-0 right-0 h-[97px] w-[82px] rotate-180 opacity-[0.22]" />

        <div className="relative z-10 px-6 py-10 text-center">
          {/* stars */}
          <div className="mb-4 flex items-center justify-center gap-1.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className="h-7 w-7 fill-[#FBC02D] text-[#FBC02D]"
                strokeWidth={0}
              />
            ))}
          </div>

          {/* average rating */}
          <p className="text-[32px] font-bold leading-tight text-[#111827]">
            {data.averageRating.toFixed(1)}{" "}
            <span className="text-[22px] font-semibold">Average Rating</span>
          </p>

          {/* divider with leaf icon */}
          <div className="mx-auto my-5 flex w-[68%] max-w-[240px] items-center gap-3">
            <div className="h-px flex-1 bg-[#5F5C7C]" />
            <FloralLeaf className="h-[22px] w-[18px] shrink-0 opacity-100" />
            <div className="h-px flex-1 bg-[#5F5C7C]" />
          </div>

          {/* review count */}
          <p className="text-[15px] font-medium text-[#111827]">
            Based on {formatReviewCount(data.totalReviews)} Reviews
          </p>
        </div>

        {data.platforms.length > 0 && (
          <div className="relative z-10 grid grid-cols-2 divide-x divide-gray-100 border-t border-gray-100 bg-[#FAFAFA]">
            {data.platforms.map((platform) => (
              <div
                key={platform.id}
                className="flex items-center justify-center gap-2 px-3 py-3"
              >
                {platform.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={platform.logoUrl}
                    alt={platform.name}
                    className="h-5 w-5 object-contain"
                  />
                ) : (
                  <PlatformBadge name={platform.name} />
                )}
                <span className="text-xs font-medium text-[#334155]">{platform.name}</span>
                <Star className="h-3.5 w-3.5 fill-[#FBC02D] text-[#FBC02D]" strokeWidth={0} />
                <span className="text-xs font-semibold text-[#111827]">
                  {platform.rating.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSummary;
