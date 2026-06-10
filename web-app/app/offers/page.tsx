import SpecialOffersView from "@/components/guest/specialOffers/SpecialOffersView";
import { specialOffersPageData } from "@/data/specialOffersData";

export default function OffersPage() {
  return <SpecialOffersView data={specialOffersPageData} />;
}
