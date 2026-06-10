import type { CartLineItem } from "@/components/guest/types";

export function parsePriceLabel(price: string): number {
  const numeric = price.replace(/[^0-9.]/g, "");
  return Number.parseFloat(numeric) || 0;
}

export function formatPrice(amount: number, currency = "AED"): string {
  return `${currency} ${amount.toFixed(2)}`;
}

export function getCartSubtotal(items: CartLineItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export function buildModifierSummary(
  selections: Record<string, string | string[]>
): string {
  const values = Object.values(selections).flatMap((value) =>
    Array.isArray(value) ? value : [value]
  );
  return values.filter(Boolean).join(" · ");
}
