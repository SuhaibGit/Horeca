import { notFound } from "next/navigation";
import GuestPageHeader from "@/components/guest/GuestPageHeader";
import OfferSection from "./OfferSection";
import type { OfferCategoryId } from "./types";
import { getOfferSection, specialOffersPageData } from "@/data/specialOffersData";

interface SpecialOffersListViewProps {
  categoryId: OfferCategoryId;
}

const SpecialOffersListView = ({ categoryId }: SpecialOffersListViewProps) => {
  const section = getOfferSection(categoryId);

  if (!section) {
    notFound();
  }

  return (
    <div className="w-full bg-white pb-10">
      <GuestPageHeader
        title={section.title}
        heroImage={specialOffersPageData.heroImage}
        backHref="/offers"
        heightClass="h-[180px]"
      />

      <div className="relative z-10 -mt-6 rounded-t-3xl bg-white pt-6">
        <OfferSection section={section} layout="list" />
      </div>
    </div>
  );
};

export default SpecialOffersListView;
