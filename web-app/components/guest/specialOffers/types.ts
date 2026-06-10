export type OfferCategoryId = "bank-card" | "partner" | "exclusive";

export interface OfferImage {
  id: string;
  imageUrl: string;
  alt?: string;
  href?: string;
}

export interface OfferSectionData {
  id: OfferCategoryId;
  title: string;
  viewAllHref: string;
  offers: OfferImage[];
}

export interface SpecialOffersPageData {
  title: string;
  subtitle: string;
  heroImage: string;
  sections: OfferSectionData[];
}
