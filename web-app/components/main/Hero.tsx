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
            <div className="absolute inset-0 bg-black/40" />

            <NavMain data={header} />

            <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-10 text-center text-white">
                <h1 className="text-[24px] font-semibold uppercase tracking-[-0.15px]">{restaurant.name}</h1>
                <p className="mt-1 text-base font-medium">{restaurant.category}</p>
                <p className="mt-2 text-[14px] font-medium tracking-[-0.15px] ">{restaurant.tagline}</p>

                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#C9A227]/50 bg-black/40 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
                    <MapPin className="h-3.5 w-3.5 text-white" />
                    {restaurant.location}
                </div>
            </div>
        </section>
    );
};

export default Hero;
