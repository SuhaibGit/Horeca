import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Search, Share2 } from "lucide-react";

interface GuestPageHeaderProps {
  title?: string;
  subtitle?: string;
  description?: string;
  heroImage: string;
  backHref?: string;
  showSearch?: boolean;
  showShare?: boolean;
  showTitle?: boolean;
  heightClass?: string;
}

const GuestPageHeader = ({
  title,
  subtitle,
  description,
  heroImage,
  backHref = "/main",
  showSearch = false,
  showShare = false,
  showTitle = true,
  heightClass = "h-[200px]",
}: GuestPageHeaderProps) => {
  return (
    <section className={`relative w-full overflow-hidden ${heightClass}`}>
      <Image src={heroImage} alt={title ?? "Page header"} fill priority className="object-cover" />
      <div className="absolute inset-0 bg-black/50" />

      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pt-4">
        <Link
          href={backHref}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#334155] shadow-sm"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>

        <div className="flex items-center gap-2">
          {showSearch && (
            <button
              type="button"
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#334155] shadow-sm"
            >
              <Search className="h-5 w-5" />
            </button>
          )}
          {showShare && (
            <button
              type="button"
              aria-label="Share"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#334155] shadow-sm"
            >
              <Share2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {showTitle && (
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-8 text-center text-white">
          {title && <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>}
          {subtitle && <p className="mt-1 text-sm text-white/90">{subtitle}</p>}
          {description && (
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-white/85">{description}</p>
          )}
        </div>
      )}
    </section>
  );
};

export default GuestPageHeader;
