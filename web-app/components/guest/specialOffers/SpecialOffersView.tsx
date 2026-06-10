import GuestPageHeader from "@/components/guest/GuestPageHeader";
import OfferSection from "./OfferSection";
import type { SpecialOffersPageData } from "./types";

interface SpecialOffersViewProps {
  data: SpecialOffersPageData;
}

const SpecialOffersView = ({ data }: SpecialOffersViewProps) => {
  return (
    <div className="w-full bg-white pb-10">
      <GuestPageHeader
        title={data.title}
        subtitle={data.subtitle}
        heroImage={data.heroImage}
        backHref="/main"
        heightClass="h-[220px]"
      />

      <div className="relative z-10 -mt-6 rounded-t-3xl bg-white pt-6">
        {data.sections.map((section) => (
          <OfferSection key={section.id} section={section} layout="carousel" />
        ))}
      </div>
    </div>
  );
};

export default SpecialOffersView;
