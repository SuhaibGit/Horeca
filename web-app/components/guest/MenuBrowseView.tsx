"use client";

import { useMemo, useState } from "react";
import PromotionsCarousel from "@/components/main/PromotionsCarousel";
import MainFooter from "@/components/main/MainFooter";
import { getMenuSections } from "@/data/guestOrderData";
import CategoryFilterBar from "./CategoryFilterBar";
import GuestPageHeader from "./GuestPageHeader";
import MenuSection from "./MenuSection";
import type { GuestMenuItem, GuestMenuPageData } from "./types";

interface MenuBrowseViewProps {
  pageData: GuestMenuPageData;
  items: GuestMenuItem[];
}

const MenuBrowseView = ({ pageData, items }: MenuBrowseViewProps) => {
  const [activeCategoryId, setActiveCategoryId] = useState("all");

  const activeCategory = useMemo(() => {
    return pageData.categories.find((category) => category.id === activeCategoryId);
  }, [activeCategoryId, pageData.categories]);

  const sections = useMemo(
    () => getMenuSections(items, activeCategory?.filterValue ?? null),
    [activeCategory?.filterValue, items]
  );

  return (
    <div className="w-full bg-white">
      <GuestPageHeader
        title={pageData.title}
        subtitle={pageData.tagline}
        heroImage={pageData.heroImage}
        backHref="/main"
        showSearch
      />

      <div className="relative z-10 -mt-6 rounded-t-3xl bg-white">
        <CategoryFilterBar
          categories={pageData.categories}
          activeCategoryId={activeCategoryId}
          onChange={setActiveCategoryId}
        />

        <PromotionsCarousel promotions={pageData.promotions} />

        {sections.map((section) => (
          <MenuSection key={section.id} title={section.title} items={section.items} />
        ))}

        <MainFooter data={pageData.footer} />
      </div>
    </div>
  );
};

export default MenuBrowseView;
