export type InventoryStatus = "in_stock" | "low_stock" | "out_of_stock" | "expiring_soon";

export type StockHistoryType = "added" | "usage" | "restock" | "adjustment";

export interface StockHistoryEntry {
  id: string;
  type: StockHistoryType;
  amount: number;
  unit: string;
  date: string;
  source: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  currentQuantity: number;
  maxCapacity: number;
  minThreshold: number;
  supplier: string;
  expiryDate: string;
  storageLocation: string;
  status: InventoryStatus;
  lastUpdated: string;
  imageEmoji: string;
  imageColor: string;
  stockHistory: StockHistoryEntry[];
}

export interface InventoryStats {
  totalItems: number;
  lowStock: number;
  outOfStock: number;
  expiringSoon: number;
}

export const CATEGORY_OPTIONS = [
  "Meat",
  "Dairy",
  "Fruit",
  "Vegetables",
  "Seafood",
  "Dry Goods",
  "Beverages",
  "Spices",
  "Nuts",
  "Poultry",
  "Oil",
];

export const UNIT_OPTIONS = ["kg", "L", "pcs", "g", "ml", "boxes"];

export const UNIT_LABELS: Record<string, string> = {
  kg: "Kilogram (Kg)",
  L: "Liter (L)",
  pcs: "Pieces (Pcs)",
  g: "Gram (g)",
  ml: "Milliliter (ml)",
  boxes: "Boxes",
};

export const CATEGORY_EMOJI: Record<string, { emoji: string; color: string }> = {
  Meat: { emoji: "🥩", color: "#FEE2E2" },
  Dairy: { emoji: "🥛", color: "#E0F2FE" },
  Fruit: { emoji: "🍎", color: "#FCE7F3" },
  Vegetables: { emoji: "🥬", color: "#DCFCE7" },
  Seafood: { emoji: "🐟", color: "#DBEAFE" },
  "Dry Goods": { emoji: "🍚", color: "#F3F4F6" },
  Beverages: { emoji: "💧", color: "#E0F2FE" },
  Spices: { emoji: "🌶️", color: "#F5F5F4" },
  Nuts: { emoji: "🥜", color: "#FEF3C7" },
  Poultry: { emoji: "🍗", color: "#FEE2E2" },
  Oil: { emoji: "🫒", color: "#ECFCCB" },
};

export function computeInventoryStatus(
  current: number,
  min: number,
  expiryDate: string
): InventoryStatus {
  if (current <= 0) return "out_of_stock";
  const expiry = new Date(expiryDate);
  const now = new Date();
  const daysUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (daysUntilExpiry <= 14 && daysUntilExpiry >= 0) return "expiring_soon";
  if (current <= min) return "low_stock";
  return "in_stock";
}

export function deriveInventoryStats(items: InventoryItem[]): InventoryStats {
  return {
    totalItems: items.length,
    lowStock: items.filter((i) => i.status === "low_stock").length,
    outOfStock: items.filter((i) => i.status === "out_of_stock").length,
    expiringSoon: items.filter((i) => i.status === "expiring_soon").length,
  };
}

export function getStockHistoryLabel(entry: StockHistoryEntry): string {
  const amount = `${entry.amount}${entry.unit}`;
  switch (entry.type) {
    case "added":
      return `Added ${amount}`;
    case "usage":
      return `Usage ${amount}`;
    case "restock":
      return `Restock ${amount}`;
    default:
      return `Adjusted ${amount}`;
  }
}

export function createHistoryEntry(
  type: StockHistoryType,
  amount: number,
  unit: string,
  source: string,
  date = "2025-08-15"
): StockHistoryEntry {
  return {
    id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    amount,
    unit,
    date,
    source,
  };
}

export function applyRestock(item: InventoryItem, quantity: number): InventoryItem {
  const newQty = Math.min(item.currentQuantity + quantity, item.maxCapacity);
  const entry = createHistoryEntry("restock", quantity, item.unit, "Manual restock");
  return refreshItem({
    ...item,
    currentQuantity: newQty,
    stockHistory: [entry, ...item.stockHistory],
  });
}

export function applyMarkOutOfStock(item: InventoryItem): InventoryItem {
  const entry = createHistoryEntry("usage", item.currentQuantity, item.unit, "Marked out of stock");
  return refreshItem({
    ...item,
    currentQuantity: 0,
    stockHistory: [entry, ...item.stockHistory],
  });
}

export function refreshItem(item: InventoryItem): InventoryItem {
  return {
    ...item,
    status: computeInventoryStatus(item.currentQuantity, item.minThreshold, item.expiryDate),
    lastUpdated: "Just now",
  };
}

const ribeyeHistory: StockHistoryEntry[] = [
  { id: "h1", type: "added", amount: 50, unit: "kg", date: "2025-08-15", source: "Chef Marco" },
  { id: "h2", type: "usage", amount: 5, unit: "kg", date: "2025-08-15", source: "System (sync)" },
  { id: "h3", type: "restock", amount: 50, unit: "kg", date: "2025-08-15", source: "09:30 AM" },
  { id: "h4", type: "usage", amount: 12, unit: "kg", date: "2025-08-14", source: "Kitchen Service" },
  { id: "h5", type: "added", amount: 30, unit: "kg", date: "2025-08-12", source: "Supplier delivery" },
];

function defaultHistory(item: InventoryItem): StockHistoryEntry[] {
  if (item.id === "inv-001") return ribeyeHistory;
  return [
    createHistoryEntry("added", item.maxCapacity, item.unit, "Initial stock", "2025-08-10"),
    createHistoryEntry("usage", Math.max(1, Math.floor(item.currentQuantity * 0.1)), item.unit, "System (sync)", "2025-08-14"),
  ];
}

function withHistory(item: Omit<InventoryItem, "stockHistory">): InventoryItem {
  const full = { ...item, stockHistory: [] as StockHistoryEntry[] };
  full.stockHistory = defaultHistory(full);
  return full;
}

export const mockInventoryItems: InventoryItem[] = [
  withHistory({
    id: "inv-001",
    name: "Ribeye Beef",
    sku: "BEEF-RIB-001",
    category: "Meat",
    unit: "kg",
    currentQuantity: 45,
    maxCapacity: 100,
    minThreshold: 20,
    supplier: "Premium Meats Co.",
    expiryDate: "2026-05-20",
    storageLocation: "Freezer A, Shelf 3",
    status: "in_stock",
    lastUpdated: "2 hours ago",
    imageEmoji: "🥩",
    imageColor: "#FEE2E2",
  }),
  withHistory({
    id: "inv-002",
    name: "Pasteurized Milk",
    sku: "DAIRY-MLK-002",
    category: "Dairy",
    unit: "L",
    currentQuantity: 10,
    maxCapacity: 50,
    minThreshold: 15,
    supplier: "Fresh Farms Dairy",
    expiryDate: "2026-04-02",
    storageLocation: "Fridge B, Shelf 1",
    status: "low_stock",
    lastUpdated: "5 hours ago",
    imageEmoji: "🥛",
    imageColor: "#E0F2FE",
  }),
  withHistory({
    id: "inv-003",
    name: "Granny Smith Apple",
    sku: "FRT-APL-003",
    category: "Fruit",
    unit: "kg",
    currentQuantity: 55,
    maxCapacity: 80,
    minThreshold: 20,
    supplier: "Green Valley Produce",
    expiryDate: "2026-04-15",
    storageLocation: "Cold Room A",
    status: "in_stock",
    lastUpdated: "3 hours ago",
    imageEmoji: "🍏",
    imageColor: "#DCFCE7",
  }),
  withHistory({
    id: "inv-004",
    name: "Spinach",
    sku: "VEG-SPN-004",
    category: "Vegetables",
    unit: "kg",
    currentQuantity: 8,
    maxCapacity: 40,
    minThreshold: 12,
    supplier: "Green Valley Produce",
    expiryDate: "2026-04-10",
    storageLocation: "Cold Room C",
    status: "low_stock",
    lastUpdated: "3 hours ago",
    imageEmoji: "🥬",
    imageColor: "#DCFCE7",
  }),
  withHistory({
    id: "inv-005",
    name: "Almonds",
    sku: "NUT-ALM-005",
    category: "Nuts",
    unit: "kg",
    currentQuantity: 60,
    maxCapacity: 100,
    minThreshold: 15,
    supplier: "Nut House Co.",
    expiryDate: "2026-08-01",
    storageLocation: "Dry Store, Aisle 1",
    status: "in_stock",
    lastUpdated: "6 hours ago",
    imageEmoji: "🥜",
    imageColor: "#FEF3C7",
  }),
  withHistory({
    id: "inv-006",
    name: "Whole Chicken",
    sku: "PLT-CHK-006",
    category: "Poultry",
    unit: "kg",
    currentQuantity: 32,
    maxCapacity: 80,
    minThreshold: 25,
    supplier: "Premium Meats Co.",
    expiryDate: "2026-04-18",
    storageLocation: "Freezer A, Shelf 1",
    status: "in_stock",
    lastUpdated: "4 hours ago",
    imageEmoji: "🍗",
    imageColor: "#FEE2E2",
  }),
  withHistory({
    id: "inv-007",
    name: "Atlantic Salmon",
    sku: "FISH-SAL-007",
    category: "Seafood",
    unit: "kg",
    currentQuantity: 0,
    maxCapacity: 40,
    minThreshold: 10,
    supplier: "Ocean Catch Ltd.",
    expiryDate: "2026-03-28",
    storageLocation: "Freezer B, Shelf 1",
    status: "out_of_stock",
    lastUpdated: "1 day ago",
    imageEmoji: "🐟",
    imageColor: "#DBEAFE",
  }),
  withHistory({
    id: "inv-008",
    name: "Extra Virgin Olive Oil",
    sku: "OIL-EVO-008",
    category: "Oil",
    unit: "L",
    currentQuantity: 24,
    maxCapacity: 40,
    minThreshold: 10,
    supplier: "Mediterranean Foods",
    expiryDate: "2026-12-01",
    storageLocation: "Dry Store, Aisle 4",
    status: "in_stock",
    lastUpdated: "8 hours ago",
    imageEmoji: "🫒",
    imageColor: "#ECFCCB",
  }),
  withHistory({
    id: "inv-009",
    name: "Parmesan Cheese",
    sku: "DAIRY-PRM-009",
    category: "Dairy",
    unit: "kg",
    currentQuantity: 18,
    maxCapacity: 30,
    minThreshold: 8,
    supplier: "Italian Imports",
    expiryDate: "2026-06-15",
    storageLocation: "Fridge A, Shelf 2",
    status: "in_stock",
    lastUpdated: "6 hours ago",
    imageEmoji: "🧀",
    imageColor: "#FEF9C3",
  }),
  withHistory({
    id: "inv-010",
    name: "Lamb Chops",
    sku: "MEAT-LMB-010",
    category: "Meat",
    unit: "kg",
    currentQuantity: 14,
    maxCapacity: 50,
    minThreshold: 15,
    supplier: "Premium Meats Co.",
    expiryDate: "2026-04-05",
    storageLocation: "Freezer A, Shelf 2",
    status: "low_stock",
    lastUpdated: "12 hours ago",
    imageEmoji: "🍖",
    imageColor: "#FEE2E2",
  }),
  withHistory({
    id: "inv-011",
    name: "Heavy Cream",
    sku: "DAIRY-CRM-011",
    category: "Dairy",
    unit: "L",
    currentQuantity: 0,
    maxCapacity: 20,
    minThreshold: 5,
    supplier: "Fresh Farms Dairy",
    expiryDate: "2026-03-25",
    storageLocation: "Fridge B, Shelf 3",
    status: "out_of_stock",
    lastUpdated: "2 days ago",
    imageEmoji: "🥛",
    imageColor: "#E0F2FE",
  }),
  withHistory({
    id: "inv-012",
    name: "Organic Tomatoes",
    sku: "VEG-TOM-012",
    category: "Vegetables",
    unit: "kg",
    currentQuantity: 22,
    maxCapacity: 60,
    minThreshold: 12,
    supplier: "Green Valley Produce",
    expiryDate: "2026-04-08",
    storageLocation: "Cold Room C",
    status: "expiring_soon",
    lastUpdated: "1 hour ago",
    imageEmoji: "🍅",
    imageColor: "#FFEDD5",
  }),
  withHistory({
    id: "inv-013",
    name: "Basmati Rice",
    sku: "DRY-RIC-013",
    category: "Dry Goods",
    unit: "kg",
    currentQuantity: 120,
    maxCapacity: 200,
    minThreshold: 40,
    supplier: "Global Grains",
    expiryDate: "2027-01-10",
    storageLocation: "Dry Store, Aisle 2",
    status: "in_stock",
    lastUpdated: "1 day ago",
    imageEmoji: "🍚",
    imageColor: "#F3F4F6",
  }),
];
