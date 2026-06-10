export type SocialPlatformId =
  | "instagram"
  | "twitter"
  | "linkedin"
  | "facebook"
  | "tiktok"
  | "snapchat"
  | "youtube";

export type SocialActionLabel = "Follow" | "Connect" | "Like";

export interface FollowUsBannerData {
  logo: string;
  logoAlt?: string;
  brandName: string;
  tagline: string;
  imageUrl: string;
}

export interface SocialChannel {
  id: string;
  platform: SocialPlatformId;
  name: string;
  handle: string;
  actionLabel: SocialActionLabel;
  href: string;
}

export interface FollowUsPageData {
  title: string;
  description: string;
  heroImage: string;
  banner: FollowUsBannerData;
  sectionTitle: string;
  channels: SocialChannel[];
}
