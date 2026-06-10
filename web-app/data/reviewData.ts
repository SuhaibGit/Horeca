import type { ReviewPageData, ReviewSubmittedPageData } from "@/components/guest/review/types";
import { mainPageData } from "@/components/main/data";

/** Replace with your API response mapped to `ReviewPageData`. */
export const reviewPageData: ReviewPageData = {
  title: "Leave a Review",
  description:
    "We'd love to hear about your experience. Your feedback helps us serve you better.",
  heroImage: mainPageData.restaurant.heroImage,
  restaurant: {
    name: mainPageData.restaurant.name,
    category: mainPageData.restaurant.category,
    imageUrl: mainPageData.restaurant.heroImage,
  },
  experienceTags: [
    { id: "food", label: "Great Food", icon: "food" },
    { id: "staff", label: "Friendly Staff", icon: "staff" },
    { id: "service", label: "Fast Service", icon: "service" },
    { id: "ambience", label: "Nice Ambience", icon: "ambience" },
    { id: "value", label: "Value for Money", icon: "value" },
    { id: "clean", label: "Clean Environment", icon: "clean" },
  ],
  submitLabel: "Submit Review",
};

export const reviewSubmittedPageData: ReviewSubmittedPageData = {
  title: "Review Submitted",
  thankYouTitle: "Thank You!",
  thankYouMessage: "Your Review has been submitted successfully",
  backHomeLabel: "Back to Home",
  backHomeHref: "/main",
};
