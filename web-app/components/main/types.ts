export type QuickActionIcon =
  | "book-open"
  | "order-online"
  | "calendar"
  | "store"
  | "gift"
  | "star";

export type SocialPlatform = "facebook" | "instagram" | "tiktok" | "youtube";

export interface HeaderInfo {
  logo: string;
  logoAlt?: string;
  showShareButton?: boolean;
  showCartButton?: boolean;
}

export interface RestaurantInfo {
  name: string;
  category: string;
  tagline: string;
  location: string;
  heroImage: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: QuickActionIcon;
  href?: string;
}

export interface Promotion {
  id: string;
  imageUrl: string;
  alt?: string;
  href?: string;
}

export interface PlatformRating {
  id: string;
  name: string;
  rating: number;
  logoUrl?: string;
}

export interface ReviewsSummaryData {
  title: string;
  averageRating: number;
  totalReviews: number;
  platforms: PlatformRating[];
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: SocialPlatform;
  href: string;
}

export interface FooterInfo {
  copyright: string;
  links: FooterLink[];
  socialLinks: SocialLink[];
}

export interface MainPageData {
  header: HeaderInfo;
  restaurant: RestaurantInfo;
  actions: QuickAction[];
  promotions: Promotion[];
  reviews: ReviewsSummaryData;
  footer: FooterInfo;
}
