export type SectionType = "Header" | "Hero" | "PrimaryActions" | "Promotions" | "Reviews";

export interface ActionItem {
  id: string;
  label: string;
  icon?: string;
  url?: string;
  // For "Follow Us" type
  socialLinks?: string[];
  // For "Promotion" / "Special Offers" type
  showBankOffer?: boolean;
  showPartnerOffer?: boolean;
  showExclusiveOffer?: boolean;
}

export interface PromotionItem {
  id: string;
  title: string;
  badge: string;
  description: string;
  image: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  rating: number;
  text: string;
  avatar: string;
}

export interface SectionData {
  id: string;
  type: SectionType;
  // Header Props
  logo?: string;
  showShareButton?: boolean;

  // Hero Props
  heading?: string;
  subHeading?: string;
  description?: string;
  locationBadge?: boolean;
  location?: string;
  backgroundImage?: string;

  // PrimaryActions Props
  actionItems?: ActionItem[];
  buttonStyle?: "Filled" | "Outline";

  // Common Props
  isVisible?: boolean;
  googleRating?: number;
  googleReviewCount?: number;
  showGoogleRating?: boolean;
  promotions?: PromotionItem[];
  reviews?: ReviewItem[];
  footerPhone?: string;
  footerEmail?: string;
  footerAddress?: string;
  footerCopyright?: string;
}

export interface BuilderState {
  sections: SectionData[];
  selectedSectionId: string | null;
}
