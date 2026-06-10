import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { GuestMenuItem } from "./types";

interface MenuItemCardProps {
  item: GuestMenuItem;
  href: string;
}

const MenuItemCard = ({ item, href }: MenuItemCardProps) => {
  return (
    <Link href={href} className="group block">
      <div className="relative mb-2 aspect-[4/3] overflow-hidden rounded-2xl">
        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="50vw" />
        <span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#0B2870] shadow-sm">
          <Plus className="h-4 w-4" />
        </span>
      </div>
      <p className="text-sm font-semibold text-[#111827]">{item.name}</p>
      <p className="text-xs text-[#64748B]">{item.priceLabel}</p>
    </Link>
  );
};

export default MenuItemCard;
