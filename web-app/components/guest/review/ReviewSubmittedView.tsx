import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import PrimaryButton from "@/components/guest/PrimaryButton";
import ReviewSubmittedIllustration from "./ReviewSubmittedIllustration";
import type { ReviewSubmittedPageData } from "./types";

interface ReviewSubmittedViewProps {
  data: ReviewSubmittedPageData;
}

const ReviewSubmittedView = ({ data }: ReviewSubmittedViewProps) => {
  return (
    <div className="flex min-h-full w-full flex-col bg-white">
      <header className="flex items-center justify-between px-4 py-4">
        <Link
          href={data.backHomeHref}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1F5F9] text-[#334155]"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-base font-semibold text-[#111827]">{data.title}</h1>
        <div className="h-10 w-10" aria-hidden />
      </header>

      <div className="flex flex-1 flex-col items-center px-6 pb-10 pt-4 text-center">
        <ReviewSubmittedIllustration />

        <h2 className="mt-6 text-2xl font-bold text-[#041B40]">{data.thankYouTitle}</h2>
        <p className="mt-2 max-w-xs text-sm text-[#64748B]">{data.thankYouMessage}</p>

        <div className="mt-auto w-full pt-10">
          <PrimaryButton href={data.backHomeHref}>{data.backHomeLabel}</PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmittedView;
