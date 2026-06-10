import SpecialOffersListView from "@/components/guest/specialOffers/SpecialOffersListView";
import type { OfferCategoryId } from "@/components/guest/specialOffers/types";
import { notFound } from "next/navigation";

const VALID_CATEGORIES: OfferCategoryId[] = ["bank-card", "partner", "exclusive"];

interface OffersCategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function OffersCategoryPage({ params }: OffersCategoryPageProps) {
  const { category } = await params;

  if (!VALID_CATEGORIES.includes(category as OfferCategoryId)) {
    notFound();
  }

  return <SpecialOffersListView categoryId={category as OfferCategoryId} />;
}
