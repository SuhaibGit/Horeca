import Image from "next/image";
import { MapPin } from "lucide-react";
import NavMain from "./NavMain";
import { HeaderInfo, RestaurantInfo } from "./types";

interface HeroProps {
  restaurant: RestaurantInfo;
  header: HeaderInfo;
}

const Hero = ({ restaurant, header }: HeroProps) => {
  return (
    <section className="relative h-[320px] overflow-hidden">
      <Image
        src={restaurant.heroImage}
        alt={restaurant.name}
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />

      <NavMain data={header} />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-10 text-center text-white">
        <h1 className="text-2xl font-bold uppercase tracking-wide">{restaurant.name}</h1>
        <p className="mt-1 text-base font-medium">{restaurant.category}</p>
        <p className="mt-2 text-xs text-white/90">{restaurant.tagline}</p>

        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#C9A227]/50 bg-black/40 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
          <MapPin className="h-3.5 w-3.5 text-[#C9A227]" />
          {restaurant.location}
        </div>
      </div>
    </section>
  );
};

export default Hero;
