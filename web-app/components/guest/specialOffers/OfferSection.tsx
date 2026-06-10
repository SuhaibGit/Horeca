import Link from "next/link";
import OfferCard from "./OfferCard";
import type { OfferSectionData } from "./types";

interface OfferSectionProps {
  section: OfferSectionData;
  layout?: "carousel" | "list";
}

const OfferSection = ({ section, layout = "carousel" }: OfferSectionProps) => {
  const isCarousel = layout === "carousel";

  return (
    <section className="pb-6">
      <div className="mb-3 flex items-center justify-between px-4">
        <h2 className="text-base font-semibold text-[#111827]">{section.title}</h2>
        {isCarousel && (
          <Link href={section.viewAllHref} className="text-sm font-medium text-[#64748B]">
            View All
          </Link>
        )}
      </div>

      {isCarousel ? (
        <div className="flex w-full snap-x snap-mandatory overflow-x-auto scrollbar-hide">
          {section.offers.map((offer) => (
            <div key={offer.id} className="w-full shrink-0 grow-0 basis-full snap-start snap-always px-4">
              <OfferCard offer={offer} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 px-4">
          {section.offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </section>
  );
};

export default OfferSection;
