import Image from "next/image";
import Link from "next/link";
import { Share2, ShoppingBag } from "lucide-react";
import { HeaderInfo } from "./types";

interface NavMainProps {
  data: HeaderInfo;
}

const NavMain = ({ data }: NavMainProps) => {
  return (
    <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-4">
      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-black/80 ring-1 ring-[#C9A227]/60">
        {data.logo ? (
          <Image src={data.logo} alt={data.logoAlt ?? "Logo"} fill className="object-cover" />
        ) : (
          <span className="text-sm font-bold text-[#C9A227]">H</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {data.showShareButton && (
          <button
            type="button"
            aria-label="Share"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0B2870] shadow-sm"
          >
            <Share2 className="h-4 w-4" />
          </button>
        )}
        {data.showCartButton && (
          <Link
            href="/order/cart"
            aria-label="Cart"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0B2870] shadow-sm"
          >
            <ShoppingBag className="h-4 w-4" />
          </Link>
        )}
      </div>
    </header>
  );
};

export default NavMain;
