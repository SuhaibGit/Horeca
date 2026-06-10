export type ExperienceTagIcon =
  | "food"
  | "staff"
  | "service"
  | "ambience"
  | "value"
  | "clean";

export interface ExperienceTag {
  id: string;
  label: string;
  icon: ExperienceTagIcon;
}

export interface ReviewRestaurantInfo {
  name: string;
  category: string;
  imageUrl: string;
}

export interface ReviewPageData {
  title: string;
  description: string;
  heroImage: string;
  restaurant: ReviewRestaurantInfo;
  experienceTags: ExperienceTag[];
  submitLabel: string;
}

export interface ReviewSubmittedPageData {
  title: string;
  thankYouTitle: string;
  thankYouMessage: string;
  backHomeLabel: string;
  backHomeHref: string;
}
