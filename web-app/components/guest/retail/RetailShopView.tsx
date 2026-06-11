"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, Search, ShoppingBag } from "lucide-react";
import MainFooter from "@/components/main/MainFooter";
import {
  getRetailSections,
  retailPageData,
  type RetailCategoryId,
} from "@/data/retailProducts";
import { useRetailCart } from "@/contexts/RetailCartContext";
import RetailCategoryBar from "./RetailCategoryBar";
import RetailProductCard from "./RetailProductCard";

export default function RetailShopView() {
  const { itemCount } = useRetailCart();
  const [activeCategory, setActiveCategory] = useState<RetailCategoryId>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const sections = useMemo(
    () => getRetailSections(activeCategory, searchQuery),
    [activeCategory, searchQuery]
  );

  return (
    <div className="w-full bg-white">
      <section className="relative h-[220px] w-full overflow-hidden">
        <Image
          src={retailPageData.heroImage}
          alt="Shop Retail"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />

        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pt-4">
          <Link
            href="/main"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#334155] shadow-sm"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <Link
            href="/shop/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#334155] shadow-sm"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0A46A6] px-1 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            ) : null}
          </Link>
        </div>

        <div className="absolute bottom-8 left-5 right-5 z-10 text-white">
          <h1 className="text-[26px] font-bold leading-tight">{retailPageData.title}</h1>
          <p className="mt-1 text-sm text-white/90">{retailPageData.tagline}</p>
        </div>
      </section>

      <div className="relative z-10 -mt-6 rounded-t-[28px] bg-white">
        <div className="px-4 pt-5">
          <div className="flex items-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-[#94A3B8]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-transparent text-sm text-[#111827] outline-none placeholder:text-[#94A3B8]"
            />
          </div>
        </div>

        <RetailCategoryBar
          categories={retailPageData.categories}
          activeCategoryId={activeCategory}
          onChange={(id) => setActiveCategory(id as RetailCategoryId)}
        />

        {sections.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-[#64748B]">
            No products match your search.
          </p>
        ) : (
          sections.map(({ section, products }) => (
            <section key={section.id} className="px-4 pb-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-semibold text-[#111827]">{section.title}</h2>
                <button
                  type="button"
                  onClick={() => setActiveCategory(section.category)}
                  className="text-xs font-semibold text-[#0A46A6]"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {products.map((product) => (
                  <RetailProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          ))
        )}

        <div className="px-4 pb-8">
          <div className="relative overflow-hidden rounded-2xl">
            <Image
              src={retailPageData.promo.image}
              alt={retailPageData.promo.title}
              width={800}
              height={320}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>

        <MainFooter data={retailPageData.footer} />
      </div>
    </div>
  );
}
