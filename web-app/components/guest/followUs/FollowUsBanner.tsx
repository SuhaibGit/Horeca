import Image from "next/image";
import type { FollowUsBannerData } from "./types";

interface FollowUsBannerProps {
  data: FollowUsBannerData;
}

const FollowUsBanner = ({ data }: FollowUsBannerProps) => {
  return (
    <div className="mx-4 overflow-hidden rounded-2xl bg-[#F5F0E8]">
      <div className="flex items-center gap-3 p-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[#041B40] ring-2 ring-[#C9A227]/40">
          {data.logo ? (
            <Image src={data.logo} alt={data.logoAlt ?? "Logo"} fill className="object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-lg font-bold text-[#C9A227]">
              H
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-serif text-base font-semibold text-[#111827]">{data.brandName}</p>
          <p className="text-xs text-[#64748B]">{data.tagline}</p>
        </div>

        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl">
          <Image src={data.imageUrl} alt={data.brandName} fill className="object-cover" sizes="80px" />
        </div>
      </div>
    </div>
  );
};

export default FollowUsBanner;
