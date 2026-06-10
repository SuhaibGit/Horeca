import type { MenuDetailModifierGroup } from "@/components/menu/MenuDetailView";
import type { FooterInfo, Promotion } from "@/components/main/types";

export type FulfillmentMethod = "pickup" | "delivery";

export type CategoryIcon =
  | "all"
  | "starters"
  | "breakfast"
  | "main-course"
  | "drinks";

export interface MenuCategory {
  id: string;
  label: string;
  icon: CategoryIcon;
  filterValue: string | null;
}

export interface GuestMenuPageData {
  title: string;
  tagline: string;
  heroImage: string;
  categories: MenuCategory[];
  promotions: Promotion[];
  footer: FooterInfo;
}

export interface GuestMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  priceLabel: string;
  category: string;
  image: string;
  available: boolean;
  prepTime?: string;
  calories?: string;
  modifierGroupIds: string[];
}

export interface PaymentMethod {
  id: string;
  brand: "mastercard" | "visa";
  label: string;
  last4: string;
  expiry: string;
}

export interface PlacedOrder {
  id: string;
  fulfillmentMethod: FulfillmentMethod;
  deliveryAddress?: string;
  dateLabel: string;
  paymentLabel: string;
  notes: string;
  subtotal: number;
  items: CartLineItem[];
}

export interface CartLineItem {
  lineId: string;
  itemId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  summary: string;
  modifierSelections: Record<string, string | string[]>;
}

export type GuestModifierGroups = Record<string, MenuDetailModifierGroup[]>;
