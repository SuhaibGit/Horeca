import ReviewSubmittedView from "@/components/guest/review/ReviewSubmittedView";
import { reviewSubmittedPageData } from "@/data/reviewData";

export default function ReviewSubmittedPage() {
  return <ReviewSubmittedView data={reviewSubmittedPageData} />;
}
