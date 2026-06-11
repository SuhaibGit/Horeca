import { mainPageData } from "@/components/main/data";
import type { FooterInfo } from "@/components/main/types";

export type RetailCategoryId =
  | "all"
  | "coffee-beans"
  | "mug"
  | "merchandise"
  | "gift";

export interface RetailCategory {
  id: RetailCategoryId;
  label: string;
  icon: "all" | "beans" | "mug" | "merchandise" | "gift";
  filterValue: string | null;
}

export interface RetailWeightOption {
  id: string;
  label: string;
  price: number;
  priceLabel: string;
}

export interface RetailProduct {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  category: Exclude<RetailCategoryId, "all">;
  sectionId: string;
  image: string;
  images: string[];
  price: number;
  priceLabel: string;
  weightOptions?: RetailWeightOption[];
  sideProductIds?: string[];
}

export interface RetailSection {
  id: string;
  title: string;
  category: Exclude<RetailCategoryId, "all">;
}

export interface RetailPageData {
  title: string;
  tagline: string;
  heroImage: string;
  categories: RetailCategory[];
  sections: RetailSection[];
  footer: FooterInfo;
  promo: {
    image: string;
    title: string;
    description: string;
    ctaLabel: string;
    href: string;
  };
}

/** Replace with API response mapped to these shapes. */
export const retailPageData: RetailPageData = {
  title: "Shop Retail",
  tagline: "Bring the cafe experience home with our handpicked favourites",
  heroImage: "/UserHero.png",
  categories: [
    { id: "all", label: "All", icon: "all", filterValue: null },
    { id: "coffee-beans", label: "Coffee Beans", icon: "beans", filterValue: "coffee-beans" },
    { id: "mug", label: "Mug", icon: "mug", filterValue: "mug" },
    { id: "merchandise", label: "Merchandise", icon: "merchandise", filterValue: "merchandise" },
    { id: "gift", label: "Gift", icon: "gift", filterValue: "gift" },
  ],
  sections: [
    { id: "coffee-beans", title: "Coffee Beans", category: "coffee-beans" },
    { id: "mugs", title: "Mugs", category: "mug" },
  ],
  footer: mainPageData.footer,
  promo: {
    image: "/promo.png",
    title: "The Perfect Gift for Every Occasion",
    description: "Gift moments. Gift dining. Gift unforgettable experiences.",
    ctaLabel: "Buy Gift Card",
    href: "#",
  },
};

export const retailProducts: RetailProduct[] = [
  {
    id: "house-blend-cream",
    name: "House Blend",
    subtitle: "Medium Roast",
    description:
      "Crafted from premium Arabica beans, our House Blend delivers a smooth, balanced flavor with notes of chocolate and roasted nuts. Perfect for any time of the day.",
    category: "coffee-beans",
    sectionId: "coffee-beans",
    image: "/bag1.png",
    images: ["/bag1.png", "/bag2.png", "/bag1.png"],
    price: 250,
    priceLabel: "AED 550.00",
    weightOptions: [
      { id: "w-250", label: "250g", price: 250, priceLabel: "AED 250" },
      { id: "w-350", label: "350g", price: 350, priceLabel: "AED 350" },
      { id: "w-450", label: "450g", price: 450, priceLabel: "AED 450" },
    ],
    sideProductIds: ["ceramic-mug", "stoneware-mug"],
  },
  {
    id: "house-blend-dark",
    name: "House Blend",
    subtitle: "Dark Roast",
    description:
      "Bold espresso blend with intense chocolate notes. Whole bean, expertly roasted for a rich crema and full-bodied cup.",
    category: "coffee-beans",
    sectionId: "coffee-beans",
    image: "/bag2.png",
    images: ["/bag2.png", "/bag1.png", "/bag2.png"],
    price: 250,
    priceLabel: "AED 550.00",
    weightOptions: [
      { id: "w-250", label: "250g", price: 250, priceLabel: "AED 250" },
      { id: "w-350", label: "350g", price: 350, priceLabel: "AED 350" },
      { id: "w-450", label: "450g", price: 450, priceLabel: "AED 450" },
    ],
    sideProductIds: ["ceramic-mug", "stoneware-mug"],
  },
  {
    id: "ceramic-mug",
    name: "Ceramic Mug",
    subtitle: "350ml",
    description:
      "Matte black ceramic mug with gold Gourmet branding. Perfect for your morning brew at home.",
    category: "mug",
    sectionId: "mugs",
    image: "/cup1.png",
    images: ["/cup1.png"],
    price: 550,
    priceLabel: "AED 550.00",
  },
  {
    id: "stoneware-mug",
    name: "Stoneware Mug",
    subtitle: "400ml",
    description:
      "Speckled stoneware mug with a handcrafted feel. Durable, elegant, and made for everyday use.",
    category: "mug",
    sectionId: "mugs",
    image: "/cup2.png",
    images: ["/cup2.png"],
    price: 550,
    priceLabel: "AED 550.00",
  },
];

export function getRetailProductById(id: string): RetailProduct | undefined {
  return retailProducts.find((product) => product.id === id);
}

export function getRetailProductsByCategory(
  categoryId: RetailCategoryId,
  searchQuery = ""
): RetailProduct[] {
  const query = searchQuery.trim().toLowerCase();
  return retailProducts.filter((product) => {
    const matchesCategory =
      categoryId === "all" || product.category === categoryId;
    const matchesSearch =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.subtitle.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });
}

export function getRetailSections(
  categoryId: RetailCategoryId,
  searchQuery = ""
): { section: RetailSection; products: RetailProduct[] }[] {
  const filtered = getRetailProductsByCategory(categoryId, searchQuery);

  if (categoryId !== "all") {
    const section = retailPageData.sections.find((s) => s.category === categoryId);
    if (!section) return [];
    return [{ section, products: filtered }];
  }

  return retailPageData.sections
    .map((section) => ({
      section,
      products: filtered.filter((product) => product.sectionId === section.id),
    }))
    .filter((entry) => entry.products.length > 0);
}

export function getRetailSideProducts(product: RetailProduct): RetailProduct[] {
  if (!product.sideProductIds?.length) return [];
  return product.sideProductIds
    .map((id) => getRetailProductById(id))
    .filter((item): item is RetailProduct => Boolean(item));
}
