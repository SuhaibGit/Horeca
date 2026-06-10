import { mainPageData } from "@/components/main/data";
import type {
  GuestMenuItem,
  GuestMenuPageData,
  GuestModifierGroups,
  PaymentMethod,
} from "@/components/guest/types";
import { DEFAULT_MODIFIER_GROUPS } from "@/data/mockMenuItems";
import { parsePriceLabel } from "@/lib/cart";

const STEAK_IMAGE =
  "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80";

/** Replace with API response mapped to these shapes. */
export const guestMenuPageData: GuestMenuPageData = {
  title: "Our Menu",
  tagline: "Good Food Good Mood Good Time",
  heroImage: "/UserHero.png",
  categories: [
    { id: "all", label: "All", icon: "all", filterValue: null },
    { id: "starters", label: "Starters", icon: "starters", filterValue: "Starter" },
    { id: "breakfast", label: "Breakfast", icon: "breakfast", filterValue: "Breakfast" },
    { id: "main-course", label: "Main Course", icon: "main-course", filterValue: "Main Course" },
    { id: "drinks", label: "Drinks", icon: "drinks", filterValue: "Beverage" },
  ],
  promotions: mainPageData.promotions,
  footer: mainPageData.footer,
};

export const guestMenuItems: GuestMenuItem[] = [
  {
    id: "M0",
    name: "Grilled Ribeye Steak",
    description:
      "Premium ribeye seasoned with sea salt and cracked black pepper, grilled to perfection.",
    price: 550,
    priceLabel: "AED 550.00",
    category: "Starter",
    image: STEAK_IMAGE,
    available: true,
    prepTime: "20–25 mins",
    calories: "680 kcal",
    modifierGroupIds: ["cooking-style", "sauce-choice", "side-addons"],
  },
  {
    id: "M1",
    name: "Grilled Ribeye Steak",
    description: "Chef's signature cut with herb butter glaze.",
    price: 550,
    priceLabel: "AED 550.00",
    category: "Starter",
    image: STEAK_IMAGE,
    available: true,
    modifierGroupIds: ["cooking-style", "sauce-choice"],
  },
  {
    id: "M7",
    name: "Grilled Ribeye Steak",
    description: "Breakfast portion served with seasonal greens.",
    price: 550,
    priceLabel: "AED 550.00",
    category: "Breakfast",
    image: STEAK_IMAGE,
    available: true,
    modifierGroupIds: ["cooking-style"],
  },
  {
    id: "M8",
    name: "Grilled Ribeye Steak",
    description: "Slow-grilled ribeye with pepper crust.",
    price: 550,
    priceLabel: "AED 550.00",
    category: "Breakfast",
    image: STEAK_IMAGE,
    available: true,
    modifierGroupIds: ["cooking-style"],
  },
  {
    id: "M4",
    name: "Fresh Citrus Cooler",
    description: "House-blend citrus refresher.",
    price: 28,
    priceLabel: "AED 28.00",
    category: "Beverage",
    image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=600&auto=format&fit=crop&q=80",
    available: true,
    modifierGroupIds: [],
  },
];

export const guestModifierGroups: GuestModifierGroups = {
  "cooking-style": [
    {
      id: "cooking-style",
      name: "Choose Your Cooking Style",
      selectionType: "Single Select",
      min: 1,
      max: 1,
      options: [
        { name: "Rare", description: "Cool red center · 46–49°C", image: STEAK_IMAGE },
        { name: "Medium Rare", description: "Warm red center · 52–55°C", image: STEAK_IMAGE },
        { name: "Medium", description: "Warm pink center · 57–60°C", image: STEAK_IMAGE },
        { name: "Medium Well", description: "Slightly pink · 65–70°C", image: STEAK_IMAGE },
      ],
    },
  ],
  "sauce-choice": [
    {
      id: "sauce-choice",
      name: "Choose Your Sauce",
      selectionType: "Single Select",
      min: 0,
      max: 1,
      options: [
        { name: "Black Pepper Sauce", description: "Signature blend", image: STEAK_IMAGE },
        { name: "White Pepper Powder", description: "Light finish", image: STEAK_IMAGE },
        { name: "Mushroom Sauce", description: "Creamy reduction", image: STEAK_IMAGE },
      ],
    },
  ],
  "side-addons": [
    {
      id: "side-addons",
      name: "Add a Side (Optional)",
      selectionType: "Multi Select",
      min: 0,
      max: 3,
      options: [
        { name: "Fries", description: "AED 24", image: STEAK_IMAGE },
        { name: "Asparagus", description: "AED 18", image: STEAK_IMAGE },
        { name: "Mashed Potatoes", description: "AED 20", image: STEAK_IMAGE },
      ],
    },
  ],
};

/** Replace with saved delivery address from your API. */
export const defaultDeliveryAddress = "123 St. Downtown Rd. New jersey, 30015";

export const guestPaymentMethods: PaymentMethod[] = [
  {
    id: "pm-1",
    brand: "mastercard",
    label: "MasterCard *4569",
    last4: "4569",
    expiry: "07/2026",
  },
  {
    id: "pm-2",
    brand: "visa",
    label: "Visa *5589",
    last4: "5589",
    expiry: "04/2026",
  },
];

export function getGuestMenuItem(itemId: string): GuestMenuItem | undefined {
  return guestMenuItems.find((item) => item.id === itemId);
}

export function getModifierGroupsForItem(item: GuestMenuItem) {
  return item.modifierGroupIds.flatMap((groupId) => guestModifierGroups[groupId] ?? []);
}

export function getMenuSections(items: GuestMenuItem[], activeCategory: string | null) {
  const filtered = activeCategory
    ? items.filter((item) => item.category === activeCategory)
    : items;

  const sectionMap = new Map<string, GuestMenuItem[]>();
  filtered.forEach((item) => {
    const list = sectionMap.get(item.category) ?? [];
    list.push(item);
    sectionMap.set(item.category, list);
  });

  return Array.from(sectionMap.entries()).map(([title, sectionItems]) => ({
    id: title.toLowerCase().replace(/\s+/g, "-"),
    title,
    items: sectionItems,
  }));
}

/** Bridge admin mock items to guest price parsing when API is wired. */
export function mapAdminPriceToNumber(price: string): number {
  return parsePriceLabel(price);
}

export { DEFAULT_MODIFIER_GROUPS };
