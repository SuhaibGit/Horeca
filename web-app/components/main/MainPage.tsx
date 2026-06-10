import Hero from "./Hero";
import QuickActions from "./QuickActions";
import PromotionsCarousel from "./PromotionsCarousel";
import ReviewsSummary from "./ReviewsSummary";
import MainFooter from "./MainFooter";
import { MainPageData } from "./types";

interface MainPageProps {
  data: MainPageData;
}

const MainPage = ({ data }: MainPageProps) => {
  return (
    <div className="w-full min-h-full bg-white">
      <Hero restaurant={data.restaurant} header={data.header} />
      <QuickActions actions={data.actions} />
      <PromotionsCarousel promotions={data.promotions} />
      <ReviewsSummary data={data.reviews} />
      <MainFooter data={data.footer} />
    </div>
  );
};

export default MainPage;
