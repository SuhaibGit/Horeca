import type { MenuDetailModifierGroup } from "@/components/menu/MenuDetailView";
import type { FulfillmentType } from "@/lib/menuStyles";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  fulfillmentType: FulfillmentType;
  servingPeriods: string[];
  image: string;
  tags: string[];
  allergens: string[];
  available: boolean;
}

const STEAK_IMAGE =
  "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80";

export const DEFAULT_MODIFIER_GROUPS: MenuDetailModifierGroup[] = [
  {
    id: "mg-1",
    name: "Cooking Style",
    selectionType: "Single Select",
    min: 1,
    max: 10,
    options: [
      { name: "Rare", description: "46–49°C", image: STEAK_IMAGE },
      { name: "Medium Rare", description: "52–55°C", image: STEAK_IMAGE },
      { name: "Medium", description: "57–60°C", image: STEAK_IMAGE },
      { name: "Medium Well", description: "65–70°C", image: STEAK_IMAGE },
    ],
  },
  {
    id: "mg-2",
    name: "Sauce Choice",
    selectionType: "Single Select",
    min: 0,
    max: 2,
    options: [
      { name: "Peppercorn", description: "Classic blend", image: STEAK_IMAGE },
      { name: "Mushroom", description: "Creamy reduction", image: STEAK_IMAGE },
    ],
  },
  {
    id: "mg-3",
    name: "Side Add-ons",
    selectionType: "Multi Select",
    min: 0,
    max: 3,
    options: [{ name: "Truffle Fries", description: "Crispy golden", image: STEAK_IMAGE }],
  },
];

export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: "M0",
    name: "Grilled Ribeye Steak",
    description: "Premium ribeye seasoned with sea salt and crackerblack pepper.",
    price: "AED 129",
    category: "Main Course",
    fulfillmentType: "All Channels",
    servingPeriods: ["All Day"],
    image: STEAK_IMAGE,
    tags: ["Chef's Pick", "Halal", "Dairy"],
    allergens: ["Dairy"],
    available: true,
  },
  {
    id: "M1",
    name: "Creamy Mushroom",
    description: "Rich and creamy mushroom soup served with toasted artisanal garlic sourdough slices.",
    price: "AED 8.50",
    category: "Starter",
    fulfillmentType: "All Channels",
    servingPeriods: ["Lunch", "Dinner"],
    image: STEAK_IMAGE,
    tags: ["Vegetarian", "Gluten Free", "Dairy Free"],
    allergens: ["Gluten", "Dairy"],
    available: true,
  },
  {
    id: "M2",
    name: "Mushroom Treat",
    description: "Sautéed wild organic mushrooms tossed in premium garlic olive oil and fresh parsley.",
    price: "AED 12.00",
    category: "Main Course",
    fulfillmentType: "Delivery Only",
    servingPeriods: ["Lunch", "Dinner"],
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80",
    tags: ["Spicy", "Nut Free", "Organic"],
    allergens: ["Soy"],
    available: false,
  },
  {
    id: "M3",
    name: "Mushroom Treat",
    description: "Decadent mushroom-infused chocolate truffles crafted by our premium executive pastry chefs.",
    price: "AED 32.00",
    category: "Dessert",
    fulfillmentType: "Dine In Only",
    servingPeriods: ["Lunch", "Dinner"],
    image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=600&auto=format&fit=crop&q=80",
    tags: ["Halal", "Dairy Free"],
    allergens: ["Eggs"],
    available: true,
  },
  {
    id: "M4",
    name: "Mushroom Treat",
    description: "Fresh warm mushroom craft herbal tea blend with premium local organic honey sweeteners.",
    price: "AED 28.00",
    category: "Beverage",
    fulfillmentType: "All Channels",
    servingPeriods: ["All Day"],
    image: STEAK_IMAGE,
    tags: ["Vegan", "Sugar Free", "Organic"],
    allergens: [],
    available: true,
  },
  {
    id: "M5",
    name: "Mushroom Treat",
    description: "Tender arborio rice mushroom risotto cooked to rich perfection with premium white truffle extracts.",
    price: "AED 9.00",
    category: "Main Course",
    fulfillmentType: "Dine In Only",
    servingPeriods: ["Dinner"],
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80",
    tags: ["Halal", "Gluten Free"],
    allergens: ["Gluten"],
    available: false,
  },
  {
    id: "M6",
    name: "Mushroom Treat",
    description: "Signature cold pressed absolute botanical mushroom tonic packed with visual superfoods.",
    price: "AED 11.00",
    category: "Beverage",
    fulfillmentType: "All Channels",
    servingPeriods: ["All Day"],
    image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=600&auto=format&fit=crop&q=80",
    tags: ["Chef's Pick", "Organic", "Cold"],
    allergens: [],
    available: true,
  },
  {
    id: "M7",
    name: "Mushroom Treat",
    description: "Scrambled organic free-range eggs on sourdough loaded with gourmet brown chestnut mushrooms.",
    price: "AED 7.00",
    category: "Breakfast",
    fulfillmentType: "Delivery Only",
    servingPeriods: ["Breakfast", "Hi-Tea"],
    image: STEAK_IMAGE,
    tags: ["Vegan", "Gluten Free"],
    allergens: ["Eggs", "Gluten"],
    available: false,
  },
  {
    id: "M8",
    name: "Mushroom Treat",
    description: "Smoky charcoal-grilled field mushrooms seasoned with chef's premium custom salt blend.",
    price: "AED 9.00",
    category: "Main Course",
    fulfillmentType: "Dine In Only",
    servingPeriods: ["Dinner"],
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80",
    tags: ["Halal", "Gluten Free"],
    allergens: ["Gluten"],
    available: false,
  },
  {
    id: "M9",
    name: "Mushroom Treat",
    description: "Sweet caramelized wild chanterelles layered on a light puff pastry shell dessert.",
    price: "AED 6.50",
    category: "Dessert",
    fulfillmentType: "All Channels",
    servingPeriods: ["Lunch", "Dinner"],
    image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=600&auto=format&fit=crop&q=80",
    tags: ["Halal", "Nut Free"],
    allergens: ["Gluten"],
    available: true,
  },
  {
    id: "M10",
    name: "Mushroom Treat",
    description: "Pan-roasted king oyster mushrooms paired with aromatic garden herbs and balsamic reductions.",
    price: "AED 9.00",
    category: "Main Course",
    fulfillmentType: "Delivery Only",
    servingPeriods: ["Dinner"],
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80",
    tags: ["Halal", "Gluten Free"],
    allergens: ["Gluten"],
    available: false,
  },
];
