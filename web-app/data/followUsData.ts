import type { FollowUsPageData } from "@/components/guest/followUs/types";
import { mainPageData } from "@/components/main/data";

/** Replace this object with your API response mapped to `FollowUsPageData`. */
export const followUsPageData: FollowUsPageData = {
  title: "Follow Us",
  description:
    "Stay connected and be part of our community. Follow us on all our social channels for updates, exclusive offers, events and more!",
  heroImage: mainPageData.restaurant.heroImage,
  banner: {
    logo: mainPageData.header.logo,
    logoAlt: mainPageData.header.logoAlt,
    brandName: "HORECAS Kitchen & Bar",
    tagline: "Good food - Good mood - Good time",
    imageUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&auto=format&fit=crop&q=80",
  },
  sectionTitle: "Our Social Channels",
  channels: [
    {
      id: "s1",
      platform: "instagram",
      name: "Instagram",
      handle: "@HORECAS",
      actionLabel: "Follow",
      href: "https://instagram.com/HORECAS",
    },
    {
      id: "s2",
      platform: "twitter",
      name: "Twitter",
      handle: "@FoodiesUnite",
      actionLabel: "Follow",
      href: "https://twitter.com/FoodiesUnite",
    },
    {
      id: "s3",
      platform: "linkedin",
      name: "LinkedIn",
      handle: "HORECAS Network",
      actionLabel: "Connect",
      href: "https://linkedin.com/company/horecas",
    },
    {
      id: "s4",
      platform: "facebook",
      name: "Facebook",
      handle: "HORECAS Official",
      actionLabel: "Like",
      href: "https://facebook.com/HORECAS",
    },
    {
      id: "s5",
      platform: "tiktok",
      name: "TikTok",
      handle: "HORECAS Official",
      actionLabel: "Like",
      href: "https://tiktok.com/@HORECAS",
    },
    {
      id: "s6",
      platform: "snapchat",
      name: "Snapchat",
      handle: "HORECAS Official",
      actionLabel: "Like",
      href: "https://snapchat.com/add/HORECAS",
    },
    {
      id: "s7",
      platform: "youtube",
      name: "Youtube",
      handle: "HORECAS Official",
      actionLabel: "Like",
      href: "https://youtube.com/@HORECAS",
    },
  ],
};
