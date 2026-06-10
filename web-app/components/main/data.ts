import { staticAssetUrl } from "@/lib/staticAsset";
import { MainPageData } from "./types";

/** Replace this object with your API response mapped to `MainPageData`. */
export const mainPageData: MainPageData = {
  header: {
    logo: "/UserHero.png",
    logoAlt: "Horecas",
    showShareButton: true,
    showCartButton: true,
  },
  restaurant: {
    name: "HORECAS RESTURANT",
    category: "Kitchen & Bar",
    tagline: "Good Food | Good Mood | Good Time",
    location: "Downtown Dubai",
    heroImage: "/UserHero.png",
  },
  actions: [
    { id: "a1", label: "View Menu", icon: "book-open", href: "/menu" },
    { id: "a2", label: "Order Online", icon: "order-online", href: "/order/cart" },
    { id: "a3", label: "Reserve Table", icon: "calendar", href: "/reserve" },
    { id: "a4", label: "Shop Retail", icon: "store", href: "/shop" },
    { id: "a5", label: "Special Offer", icon: "gift", href: "/offers" },
    { id: "a6", label: "Leave a Review", icon: "star", href: "/review" },
  ],
  promotions: [
    {
      id: "p1",
      imageUrl: staticAssetUrl("/heroProm.png"),
      alt: "Up to 25% OFF with Zomato Pro",
      href: "#",
    },
    {
      id: "p2",
      imageUrl: staticAssetUrl("/heroProm.png"),
      alt: "Weekend Brunch Special",
      href: "#",
    },
    {
      id: "p3",
      imageUrl: staticAssetUrl("/heroProm.png"),
      alt: "Happy Hour Offer",
      href: "#",
    },
  ],
  reviews: {
    title: "Love From Our Guest",
    averageRating: 4.7,
    totalReviews: 1250,
    platforms: [
      { id: "google", name: "Google", rating: 4.5 },
      { id: "tripadvisor", name: "Trip Advisor", rating: 4.5 },
    ],
  },
  footer: {
    copyright: "@2026 HORECAS Kitchen & Bar",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
    socialLinks: [
      { platform: "facebook", href: "https://facebook.com" },
      { platform: "instagram", href: "https://instagram.com" },
      { platform: "tiktok", href: "https://tiktok.com" },
      { platform: "youtube", href: "https://youtube.com" },
    ],
  },
};
