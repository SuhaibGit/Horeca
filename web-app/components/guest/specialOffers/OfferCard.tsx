import Image from "next/image";
import type { OfferImage } from "./types";

interface OfferCardProps {
  offer: OfferImage;
}

const OfferCard = ({ offer }: OfferCardProps) => {
  const image = (
    <div className="relative aspect-[2.4/1] w-full overflow-hidden rounded-2xl">
      <Image
        src={offer.imageUrl}
        alt={offer.alt ?? "Special offer"}
        fill
        className="object-cover"
        sizes="100vw"
      />
    </div>
  );

  if (offer.href) {
    return (
      <a href={offer.href} className="block">
        {image}
      </a>
    );
  }

  return image;
};

export default OfferCard;
