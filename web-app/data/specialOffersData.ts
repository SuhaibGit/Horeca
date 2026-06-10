import type { OfferImage, OfferCategoryId, SpecialOffersPageData } from "@/components/guest/specialOffers/types";
import { mainPageData } from "@/components/main/data";
import { staticAssetUrl } from "@/lib/staticAsset";

const OFFER_IMG = (name: string) => staticAssetUrl(`/Special offer/${name}`);

/** Replace image lists with your API response. */
const bankOffers: OfferImage[] = [
  { id: "bank-1", imageUrl: OFFER_IMG("bank-card-1.png"), alt: "Bank offer 1" },
  { id: "bank-2", imageUrl: OFFER_IMG("bank-card-2.png"), alt: "Bank offer 2" },
  { id: "bank-3", imageUrl: OFFER_IMG("bank-card-3.png"), alt: "Bank offer 3" },
];

const partnerOffers: OfferImage[] = [
  { id: "partner-1", imageUrl: OFFER_IMG("partner-zomato.png"), alt: "Zomato Pro offer" },
  { id: "partner-2", imageUrl: OFFER_IMG("partner-tasty.png"), alt: "Tasty Partner offer" },
  { id: "partner-3", imageUrl: OFFER_IMG("partner-cravvy.png"), alt: "Cravvy offer" },
];

const exclusiveOffers: OfferImage[] = [
  { id: "exclusive-1", imageUrl: OFFER_IMG("exclusive-brunch-1.png"), alt: "Weekend brunch offer 1" },
  { id: "exclusive-2", imageUrl: OFFER_IMG("exclusive-brunch-2.png"), alt: "Weekend brunch offer 2" },
  { id: "exclusive-3", imageUrl: OFFER_IMG("exclusive-brunch-3.png"), alt: "Weekend brunch offer 3" },
];

export const specialOffersPageData: SpecialOffersPageData = {
  title: "Special Offers",
  subtitle: "Great Food, greater offers Just for you",
  heroImage: mainPageData.restaurant.heroImage,
  sections: [
    {
      id: "bank-card",
      title: "Bank & Card Offers",
      viewAllHref: "/offers/bank-card",
      offers: bankOffers,
    },
    {
      id: "partner",
      title: "Partner Offers",
      viewAllHref: "/offers/partner",
      offers: partnerOffers,
    },
    {
      id: "exclusive",
      title: "Our Exclusive Offers",
      viewAllHref: "/offers/exclusive",
      offers: exclusiveOffers,
    },
  ],
};

export function getOfferSection(categoryId: OfferCategoryId) {
  return specialOffersPageData.sections.find((section) => section.id === categoryId);
}
