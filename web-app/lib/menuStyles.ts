export const MENU_CATEGORIES = [
  "Starter",
  "Breakfast",
  "Main Course",
  "Brunch",
  "Hi-Tea",
  "Buffet",
  "Shakes",
  "Alcoholic Beverage",
  "Non-Alcoholic Beverage",
  "Dessert",
  "Beverage",
] as const;

export type FulfillmentType = "All Channels" | "Dine In Only" | "Delivery Only";

export const FULFILLMENT_TYPES: FulfillmentType[] = [
  "All Channels",
  "Dine In Only",
  "Delivery Only",
];

export const SERVING_PERIOD_OPTIONS = [
  "All Day",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Hi-tea",
];

export function getCategoryPillStyle(category: string): string {
  const styles: Record<string, string> = {
    Starter: "bg-amber-50 dark:bg-amber-950/20 text-[#D97706] border-amber-200/50",
    "Main Course": "bg-blue-50 dark:bg-blue-950/20 text-blue-600 border-blue-200/50",
    Dessert: "bg-pink-50 dark:bg-pink-950/20 text-pink-600 border-pink-200/50",
    Beverage: "bg-[#E6F4F1] dark:bg-emerald-950/20 text-[#0F766E] border-emerald-250/30",
    "Non-Alcoholic Beverage":
      "bg-[#E6F4F1] dark:bg-emerald-950/20 text-[#0F766E] border-emerald-250/30",
    "Alcoholic Beverage":
      "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 border-indigo-200/50",
    Breakfast: "bg-purple-50 dark:bg-purple-950/20 text-purple-600 border-purple-200/50",
    Brunch: "bg-orange-50 dark:bg-orange-950/20 text-orange-600 border-orange-200/50",
    "Hi-Tea": "bg-rose-50 dark:bg-rose-950/20 text-rose-600 border-rose-200/50",
    Buffet: "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 border-zinc-200/50",
    Shakes: "bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600 border-cyan-200/50",
  };
  return styles[category] ?? "bg-amber-50 dark:bg-amber-950/20 text-[#D97706] border-amber-200/50";
}

export function categoryTextStyle(category: string): string {
  if (category === "Main Course") return "text-blue-600";
  if (category === "Dessert") return "text-pink-600";
  if (category === "Beverage" || category === "Non-Alcoholic Beverage") return "text-[#0F766E]";
  if (category === "Breakfast") return "text-purple-600";
  if (category === "Brunch") return "text-orange-600";
  if (category === "Hi-Tea") return "text-rose-600";
  return "text-amber-600";
}
