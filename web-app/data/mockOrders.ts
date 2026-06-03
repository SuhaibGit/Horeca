export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export type LiveOrderStatus =
  | "New"
  | "Ready"
  | "Preparing"
  | "Served"
  | "Completed"
  | "Delay"
  | "Cancelled";

export type LiveOrderType = "Dine In" | "Delivery";

export interface LiveOrder {
  id: string;
  customerId: string;
  orderType: LiveOrderType;
  table: string;
  status: LiveOrderStatus;
  items: OrderItem[];
  guests: number;
  timeAgo: string;
  totalPrice: number;
  subtotal: number;
  taxAndService: number;
}

export interface LiveOrdersFilterState {
  statuses: string[];
  types: LiveOrderType[];
}

export type LiveOrderFilterStatusValue =
  | LiveOrderStatus
  | "Refunded"
  | "Delivered";

export const FILTER_STATUS_OPTIONS: { label: string; value: LiveOrderFilterStatusValue }[] = [
  { label: "Preparing", value: "Preparing" },
  { label: "Ready", value: "Ready" },
  { label: "Served", value: "Served" },
  { label: "Completed", value: "Completed" },
  { label: "Delayed", value: "Delay" },
  { label: "Cancelled", value: "Cancelled" },
  { label: "Refunded", value: "Refunded" },
  { label: "Delivered", value: "Delivered" },
];

export const FILTER_TYPE_OPTIONS: { label: string; value: LiveOrderType }[] = [
  { label: "Dine In", value: "Dine In" },
  { label: "Delivery", value: "Delivery" },
];

export interface LiveOrderStats {
  activeOrders: number;
  ordersInProgress: number;
  tablesOccupied: string;
  avgOrderValue: string;
}

export const mockLiveOrderStats: LiveOrderStats = {
  activeOrders: 18,
  ordersInProgress: 12,
  tablesOccupied: "20/40",
  avgOrderValue: "AED 48,290",
};

export const mockLiveOrders: LiveOrder[] = [
  {
    id: "#1236",
    customerId: "cust-001",
    orderType: "Dine In",
    table: "Table 01",
    status: "Ready",
    items: [
      { name: "Grilled Salmon", quantity: 2, price: 98 },
      { name: "Beef Burger", quantity: 1, price: 65 },
      { name: "Fries", quantity: 1, price: 25 },
      { name: "Coke", quantity: 2, price: 15 },
      { name: "Ice Cream", quantity: 1, price: 20 },
    ],
    guests: 4,
    timeAgo: "46m ago",
    totalPrice: 420.0,
    subtotal: 500.0,
    taxAndService: 28.0,
  },
  {
    id: "#1269",
    customerId: "cust-002",
    orderType: "Dine In",
    table: "Table 04",
    status: "New",
    items: [
      { name: "Veg Burger", quantity: 1, price: 55 },
      { name: "Sweet Potato Fries", quantity: 1, price: 30 },
      { name: "Mixed Greens", quantity: 1, price: 40 },
      { name: "Lemonade", quantity: 2, price: 25 },
      { name: "Apple Pie", quantity: 1, price: 35 },
    ],
    guests: 2,
    timeAgo: "12m ago",
    totalPrice: 295.0,
    subtotal: 250.0,
    taxAndService: 45.0,
  },
  {
    id: "#1280",
    customerId: "cust-003",
    orderType: "Dine In",
    table: "Table 05",
    status: "Preparing",
    items: [
      { name: "Chicken Tikka Masala", quantity: 1, price: 120 },
      { name: "Naan Bread", quantity: 2, price: 20 },
      { name: "Basmati Rice", quantity: 1, price: 35 },
      { name: "Mango Lassi", quantity: 2, price: 30 },
    ],
    guests: 3,
    timeAgo: "28m ago",
    totalPrice: 380.0,
    subtotal: 350.0,
    taxAndService: 30.0,
  },
  {
    id: "#1291",
    customerId: "cust-004",
    orderType: "Dine In",
    table: "Table 06",
    status: "Served",
    items: [
      { name: "Sushi Platter", quantity: 1, price: 240 },
      { name: "Miso Soup", quantity: 2, price: 25 },
      { name: "Edamame", quantity: 1, price: 20 },
      { name: "Green Tea", quantity: 3, price: 15 },
      { name: "Mochi Ice Cream", quantity: 2, price: 25 },
    ],
    guests: 5,
    timeAgo: "55m ago",
    totalPrice: 525.0,
    subtotal: 480.0,
    taxAndService: 45.0,
  },
  {
    id: "#1247",
    customerId: "cust-009",
    orderType: "Dine In",
    table: "Table 02",
    status: "Completed",
    items: [
      { name: "Margherita Pizza", quantity: 1, price: 85 },
      { name: "Caesar Salad", quantity: 1, price: 45 },
      { name: "Garlic Bread", quantity: 1, price: 25 },
      { name: "Red Wine", quantity: 2, price: 60 },
    ],
    guests: 4,
    timeAgo: "1h 10m ago",
    totalPrice: 280.0,
    subtotal: 250.0,
    taxAndService: 30.0,
  },
  {
    id: "#1238",
    customerId: "cust-001",
    orderType: "Dine In",
    table: "Table 01",
    status: "Delay",
    items: [
      { name: "Grilled Salmon", quantity: 2, price: 98 },
      { name: "Beef Burger", quantity: 1, price: 65 },
      { name: "Fries", quantity: 1, price: 25 },
      { name: "Coke", quantity: 2, price: 15 },
      { name: "Ice Cream", quantity: 1, price: 20 },
    ],
    guests: 4,
    timeAgo: "1h 46m ago",
    totalPrice: 420.0,
    subtotal: 500.0,
    taxAndService: 28.0,
  },
  {
    id: "#1258",
    customerId: "cust-007",
    orderType: "Dine In",
    table: "Table 03",
    status: "Ready",
    items: [
      { name: "Spaghetti Carbonara", quantity: 1, price: 95 },
      { name: "Chicken Wings", quantity: 1, price: 45 },
      { name: "Coleslaw", quantity: 1, price: 20 },
      { name: "Iced Tea", quantity: 2, price: 18 },
      { name: "Tiramisu", quantity: 1, price: 40 },
    ],
    guests: 6,
    timeAgo: "35m ago",
    totalPrice: 350.0,
    subtotal: 310.0,
    taxAndService: 40.0,
  },
  {
    id: "#1237",
    customerId: "cust-006",
    orderType: "Delivery",
    table: "Order 15",
    status: "Preparing",
    items: [
      { name: "Grilled Salmon", quantity: 1, price: 98 },
      { name: "Quinoa Salad", quantity: 1, price: 45 },
      { name: "Garlic Bread", quantity: 1, price: 25 },
      { name: "Sparkling Water", quantity: 2, price: 12 },
      { name: "Tiramisu", quantity: 1, price: 40 },
    ],
    guests: 2,
    timeAgo: "22m ago",
    totalPrice: 390.0,
    subtotal: 360.0,
    taxAndService: 30.0,
  },
  {
    id: "#1242",
    customerId: "cust-002",
    orderType: "Delivery",
    table: "Order 08",
    status: "Cancelled",
    items: [
      { name: "Beef Burger", quantity: 2, price: 65 },
      { name: "Fries", quantity: 2, price: 25 },
      { name: "Chocolate Shake", quantity: 1, price: 35 },
    ],
    guests: 1,
    timeAgo: "8m ago",
    totalPrice: 215.0,
    subtotal: 195.0,
    taxAndService: 20.0,
  },
  {
    id: "#1245",
    customerId: "cust-004",
    orderType: "Delivery",
    table: "Order 22",
    status: "Ready",
    items: [
      { name: "Margherita Pizza", quantity: 1, price: 85 },
      { name: "Caesar Salad", quantity: 1, price: 45 },
      { name: "Lemonade", quantity: 2, price: 25 },
    ],
    guests: 3,
    timeAgo: "18m ago",
    totalPrice: 180.0,
    subtotal: 165.0,
    taxAndService: 15.0,
  },
  {
    id: "#5567",
    customerId: "cust-005",
    orderType: "Dine In",
    table: "Table 03",
    status: "Completed",
    items: [
      { name: "Grilled Salmon", quantity: 2, price: 98 },
      { name: "Caesar Salad", quantity: 1, price: 42 },
    ],
    guests: 4,
    timeAgo: "12 hours ago",
    totalPrice: 262.0,
    subtotal: 238.0,
    taxAndService: 24.0,
  },
];
