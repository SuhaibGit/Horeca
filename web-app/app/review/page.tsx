import ReviewView from "@/components/guest/review/ReviewView";
import { reviewPageData } from "@/data/reviewData";

export default function ReviewPage() {
  return <ReviewView data={reviewPageData} />;
}
