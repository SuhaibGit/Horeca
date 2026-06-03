import type { ChartDataPoint } from "@/components/dashboard/RevenueChart";
import type { ChannelData } from "@/components/dashboard/ChannelChart";
import type { ReservationMetric } from "@/components/dashboard/ReservationSummaryList";
import type { CategoryPerformance } from "@/components/dashboard/CategoriesProgress";
import type { TableRow } from "@/components/dashboard/PerformanceTable";
import type { GenericTableRow } from "@/components/dashboard/PerformanceTable";
import type { PeakHourDataPoint } from "@/components/dashboard/PeakHoursChart";
import type { TrendSeries } from "@/components/dashboard/TrendChart";
import type { StatCardProps } from "@/components/StatCard";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

export const SALE_CHANNELS: ChannelData[] = [
  { name: "Dine in", value: 68480, displayValue: "AED 68,480", percentage: 54, color: "#3CCB7F", hoverColor: "#3CCB7F" },
  { name: "Online Ordering", value: 840, displayValue: "AED 840", percentage: 24, color: "#FD853A", hoverColor: "#EA580C" },
  { name: "Delivery", value: 680, displayValue: "AED 680", percentage: 12, color: "#EF4444", hoverColor: "#DC2626" },
  { name: "Takeaway", value: 7040, displayValue: "AED 7,040", percentage: 10, color: "#53B1FD", hoverColor: "#2563EB" },
];

export const TOP_SELLING_ITEMS: ReservationMetric[] = [
  { label: "Chocolate Fondant", value: "AED 52,470", change: "+15.4%", isPositive: true },
  { label: "Caesar Salad", value: "AED 48,920", change: "+12.8%", isPositive: true },
  { label: "Truffle Pasta", value: "AED 47,180", change: "+9.2%", isPositive: true },
  { label: "Grilled Salmon", value: "AED 51,340", change: "+18.1%", isPositive: true },
];

export const REVENUE_CHART_DATA: ChartDataPoint[] = [
  { label: "Jan", value: 75, displayValue: "AED 75,000" },
  { label: "Feb", value: 45, displayValue: "AED 45,000" },
  { label: "Mar", value: 80, displayValue: "AED 80,000" },
  { label: "Apr", value: 78, displayValue: "AED 78,000" },
  { label: "May", value: 55, displayValue: "AED 55,000" },
  { label: "Jun", value: 78, displayValue: "AED 78,000" },
  { label: "Jul", value: 52, displayValue: "AED 52,000" },
  { label: "Aug", value: 32, displayValue: "AED 32,000" },
  { label: "Sept", value: 65, displayValue: "AED 65,000" },
  { label: "Oct", value: 55, displayValue: "AED 55,000" },
  { label: "Nov", value: 48, displayValue: "AED 48,000" },
  { label: "Dec", value: 72, displayValue: "AED 72,000" },
];

export const salesReport = {
  stats: [
    { title: "Total Revenue", value: "AED 48,290", iconType: "revenue" as StatCardProps["iconType"] },
    { title: "Total Orders", value: "2,263", iconType: "orders" as StatCardProps["iconType"] },
    { title: "Order Value", value: "AED 48,290", iconType: "value" as StatCardProps["iconType"] },
    { title: "Revenue Growth", value: "20.8%", iconType: "revenue" as StatCardProps["iconType"] },
  ],
  peakHours: [
    { name: "12PM", value: "42%", percentage: 85 },
    { name: "02PM", value: "28%", percentage: 62 },
    { name: "06PM", value: "38%", percentage: 72 },
    { name: "08PM", value: "52%", percentage: 92 },
    { name: "10PM", value: "35%", percentage: 68 },
  ] as CategoryPerformance[],
  peakFooter: "Friday & Saturday nights see a 42% spike in order volume.",
  saleSummary: [
    { channel: "Dine in", revenue: "68,430", orders: "624", avgOrderValue: "109.66", change: "+15.4%", isPositive: true },
    { channel: "Online Ordering", revenue: "29,870", orders: "430", avgOrderValue: "69.45", change: "+12.0%", isPositive: true },
    { channel: "Delivery", revenue: "82,300", orders: "1,015", avgOrderValue: "121.60", change: "+22.3%", isPositive: true },
    { channel: "Takeaways", revenue: "45,120", orders: "512", avgOrderValue: "88.25", change: "+8.7%", isPositive: true },
    { channel: "Totals", revenue: "225,720", orders: "2,581", avgOrderValue: "101.32", change: "+18.9%", isPositive: true, isTotal: true },
  ] as TableRow[],
};

const orderTrendSeries: TrendSeries[] = [
  { id: "completed", label: "Completed", color: "#0A46A6", values: [72, 48, 85, 62, 55, 78, 52, 35, 68, 55, 48, 72] },
  { id: "cancelled", label: "Cancelled", color: "#EF4444", values: [28, 42, 35, 48, 52, 38, 45, 55, 42, 38, 45, 52] },
];

export const ordersReport = {
  stats: [
    { title: "Total Orders", value: "3,254", iconType: "orders" as StatCardProps["iconType"] },
    { title: "Completed Orders", value: "2,263", iconType: "orders" as StatCardProps["iconType"] },
    { title: "Cancelled Orders", value: "263", iconType: "orders" as StatCardProps["iconType"] },
    { title: "Avg Prep Time", value: "21m", iconType: "value" as StatCardProps["iconType"] },
  ],
  trend: { labels: MONTH_LABELS, series: orderTrendSeries },
  channelSummary: [
    {
      cells: [
        { value: "Dine in" },
        { value: "624" },
        { value: "580", tone: "positive" as const },
        { value: "44", tone: "negative" as const },
        { value: "AED 68,430" },
      ],
    },
    {
      cells: [
        { value: "Online Ordering" },
        { value: "430" },
        { value: "398", tone: "positive" as const },
        { value: "32", tone: "negative" as const },
        { value: "AED 29,870" },
      ],
    },
    {
      cells: [
        { value: "Delivery" },
        { value: "1,015" },
        { value: "942", tone: "positive" as const },
        { value: "73", tone: "negative" as const },
        { value: "AED 82,300" },
      ],
    },
    {
      cells: [
        { value: "Takeaways" },
        { value: "512" },
        { value: "478", tone: "positive" as const },
        { value: "34", tone: "negative" as const },
        { value: "AED 45,120" },
      ],
    },
  ] as GenericTableRow[],
  recentOrders: [
    {
      cells: [
        { value: "#ORD-1000" },
        { value: "David Miller" },
        { value: "Online Ordering" },
        { value: "Completed", tone: "positive" as const },
        { value: "AED 109.66" },
        { value: "20:44" },
      ],
    },
    {
      cells: [
        { value: "#ORD-1001" },
        { value: "Sarah Chen" },
        { value: "Dine in" },
        { value: "Completed", tone: "positive" as const },
        { value: "AED 245.00" },
        { value: "19:12" },
      ],
    },
    {
      cells: [
        { value: "#ORD-1002" },
        { value: "James Wilson" },
        { value: "Delivery" },
        { value: "Cancelled", tone: "negative" as const },
        { value: "AED 68.50" },
        { value: "18:05" },
      ],
    },
    {
      cells: [
        { value: "#ORD-1003" },
        { value: "Emma Brooks" },
        { value: "Takeaway" },
        { value: "Completed", tone: "positive" as const },
        { value: "AED 88.25" },
        { value: "17:30" },
      ],
    },
  ] as GenericTableRow[],
};

const reservationTrendSeries: TrendSeries[] = [
  { id: "completed", label: "Completed", color: "#0A46A6", values: [82, 65, 90, 72, 68, 88, 75, 58, 85, 70, 62, 78] },
  { id: "cancelled", label: "Cancelled", color: "#F04438", values: [35, 48, 42, 55, 60, 45, 52, 65, 48, 42, 50, 55] },
  { id: "noshow", label: "No-show", color: "#F79009", values: [22, 30, 28, 38, 42, 32, 40, 48, 35, 30, 28, 36] },
];

export const RESERVATION_SOURCES: ChannelData[] = [
  { name: "Website", value: 318625, displayValue: "318,625", percentage: 22, color: "#3CCB7F", hoverColor: "#3CCB7F" },
  { name: "Phone", value: 498625, displayValue: "498,625", percentage: 28, color: "#FD853A", hoverColor: "#EA580C" },
  { name: "Walk-in", value: 566625, displayValue: "566,625", percentage: 26, color: "#EF4444", hoverColor: "#DC2626" },
  { name: "Online Reservation", value: 719625, displayValue: "719,625", percentage: 24, color: "#53B1FD", hoverColor: "#2563EB" },
];

export const reservationsReport = {
  stats: [
    { title: "Total Reservations", value: "3,254", iconType: "reservations" as StatCardProps["iconType"] },
    { title: "Walk-ins", value: "2,263", iconType: "reservations" as StatCardProps["iconType"] },
    { title: "No-show Rate", value: "8.1%", iconType: "value" as StatCardProps["iconType"] },
    { title: "Cancellation Rate", value: "12.4%", iconType: "value" as StatCardProps["iconType"] },
  ],
  trend: { labels: MONTH_LABELS, series: reservationTrendSeries },
  sourceEfficiency: [
    {
      cells: [
        { value: "Website" },
        { value: "68,430" },
        { value: "624", tone: "positive" as const },
        { value: "62", tone: "negative" as const },
        { value: "22", tone: "warning" as const },
        { value: "88%" },
      ],
    },
    {
      cells: [
        { value: "Phone" },
        { value: "54,200" },
        { value: "498", tone: "positive" as const },
        { value: "48", tone: "negative" as const },
        { value: "18", tone: "warning" as const },
        { value: "85%" },
      ],
    },
    {
      cells: [
        { value: "Walk-in" },
        { value: "42,100" },
        { value: "412", tone: "positive" as const },
        { value: "35", tone: "negative" as const },
        { value: "15", tone: "warning" as const },
        { value: "82%" },
      ],
    },
    {
      cells: [
        { value: "Reservation" },
        { value: "71,960" },
        { value: "680", tone: "positive" as const },
        { value: "52", tone: "negative" as const },
        { value: "28", tone: "warning" as const },
        { value: "90%" },
      ],
    },
  ] as GenericTableRow[],
  peakVolume: [
    { name: "12PM", value: "15", percentage: 75 },
    { name: "02PM", value: "10", percentage: 50 },
    { name: "06PM", value: "10", percentage: 50 },
    { name: "08PM", value: "8", percentage: 40 },
    { name: "10PM", value: "7", percentage: 35 },
  ] as CategoryPerformance[],
  peakFooter: "Operational focus recommended during 19:00 - 21:00 window",
};

const menuTrendSeries: TrendSeries[] = [
  { id: "current", label: "Current Period", color: "#0A46A6", values: [42, 55, 68, 72, 58, 75, 62, 48, 70, 65, 52, 78] },
  { id: "previous", label: "Previous Period", color: "#FDA4AF", values: [38, 48, 60, 65, 52, 68, 55, 42, 62, 58, 48, 70] },
];

export const MENU_CATEGORIES: ChannelData[] = [
  { name: "Starters", value: 25000, displayValue: "+5.7%", percentage: 22, color: "#3CCB7F", hoverColor: "#3CCB7F" },
  { name: "Desserts", value: 18000, displayValue: "+0.7%", percentage: 18, color: "#FD853A", hoverColor: "#EA580C" },
  { name: "Main Course", value: 95000, displayValue: "+14.8%", percentage: 38, color: "#EF4444", hoverColor: "#DC2626" },
  { name: "Beverages", value: 42000, displayValue: "+11.8%", percentage: 22, color: "#53B1FD", hoverColor: "#2563EB" },
];

export const menuPerformanceReport = {
  stats: [
    { title: "Total Menu Revenue", value: "AED 242,500", iconType: "revenue" as StatCardProps["iconType"] },
    { title: "Best Selling Dish", value: "Venison Wellington", iconType: "orders" as StatCardProps["iconType"] },
    { title: "Average Order Value", value: "AED 2,500", iconType: "value" as StatCardProps["iconType"] },
    { title: "Gross Profit", value: "AED 242,500", iconType: "revenue" as StatCardProps["iconType"] },
  ],
  trend: { labels: MONTH_LABELS, series: menuTrendSeries },
  peakHours: [
    { time: "11am", occupancy: 35 },
    { time: "12pm", occupancy: 72 },
    { time: "1pm", occupancy: 88 },
    { time: "2pm", occupancy: 65 },
    { time: "6pm", occupancy: 78 },
    { time: "7pm", occupancy: 92 },
    { time: "8pm", occupancy: 100 },
    { time: "9pm", occupancy: 68 },
    { time: "10pm", occupancy: 42 },
  ] as PeakHourDataPoint[],
  menuAnalytics: [
    {
      cells: [
        { value: "Grilled Halloumi" },
        { value: "Starter", pill: true, pillVariant: "starter" },
        { value: "124" },
        { value: "AED 12.00" },
        { value: "AED 11.50" },
        { value: "+8.7%", tone: "positive" as const, showTrendArrow: true },
      ],
    },
    {
      cells: [
        { value: "Spicy Tuna Tartare" },
        { value: "Starter", pill: true, pillVariant: "starter" },
        { value: "98" },
        { value: "AED 14.00" },
        { value: "AED 6.20" },
        { value: "+11.2%", tone: "positive" as const, showTrendArrow: true },
      ],
    },
    {
      cells: [
        { value: "Beef Carpaccio" },
        { value: "Main Course", pill: true, pillVariant: "main-course" },
        { value: "76" },
        { value: "AED 22.00" },
        { value: "AED 8.40" },
        { value: "+14.2%", tone: "positive" as const, showTrendArrow: true },
      ],
    },
    {
      cells: [
        { value: "Chocolate Fondant" },
        { value: "Dessert", pill: true, pillVariant: "dessert" },
        { value: "156" },
        { value: "AED 18.00" },
        { value: "AED 5.40" },
        { value: "+22.1%", tone: "positive" as const, showTrendArrow: true },
      ],
    },
    {
      cells: [
        { value: "House Lemonade" },
        { value: "Beverages", pill: true, pillVariant: "beverages" },
        { value: "210" },
        { value: "AED 8.00" },
        { value: "AED 2.10" },
        { value: "+6.4%", tone: "positive" as const, showTrendArrow: true },
      ],
    },
  ] as GenericTableRow[],
};

const customerTrendSeries: TrendSeries[] = [
  { id: "new", label: "New", color: "#0A46A6", values: [45, 52, 68, 72, 58, 75, 62, 48, 70, 65, 55, 78] },
  { id: "returning", label: "Returning", color: "#EF4444", values: [55, 48, 62, 58, 72, 65, 78, 82, 68, 72, 75, 80] },
];

export const CUSTOMER_SEGMENTS: ChannelData[] = [
  { name: "VIP Customers", value: 1240, displayValue: "1,240", percentage: 10, color: "#3CCB7F", hoverColor: "#3CCB7F" },
  { name: "Loyalty Members", value: 8240, displayValue: "8,240", percentage: 66, color: "#FD853A", hoverColor: "#EA580C" },
  { name: "New Customers", value: 2450, displayValue: "2,450", percentage: 16, color: "#EF4444", hoverColor: "#DC2626" },
  { name: "Occasional", value: 550, displayValue: "550", percentage: 8, color: "#53B1FD", hoverColor: "#2563EB" },
];

export const customerReport = {
  stats: [
    { title: "Total Customers", value: "12,480", iconType: "reservations" as StatCardProps["iconType"] },
    { title: "New Customers", value: "4,850", iconType: "orders" as StatCardProps["iconType"] },
    { title: "Retention Rate", value: "68.5%", iconType: "value" as StatCardProps["iconType"] },
    { title: "Avg. Spend Customer", value: "AED 142.50", iconType: "revenue" as StatCardProps["iconType"] },
  ],
  trend: { labels: MONTH_LABELS, series: customerTrendSeries },
};

const marketingTrendSeries: TrendSeries[] = [
  { id: "opens", label: "Opens", color: "#0A46A6", values: [62, 55, 78, 72, 68, 85, 70, 58, 82, 75, 65, 88] },
  { id: "clicks", label: "Clicks", color: "#53B1FD", values: [42, 38, 55, 48, 45, 62, 50, 40, 58, 52, 45, 65] },
  { id: "conversions", label: "Conversions", color: "#FD853A", values: [28, 25, 38, 32, 30, 42, 35, 28, 40, 36, 32, 48] },
];

export const marketingReport = {
  stats: [
    { title: "Campaign Reach", value: "48,200", iconType: "orders" as StatCardProps["iconType"] },
    { title: "Open Rate", value: "42.8%", iconType: "value" as StatCardProps["iconType"] },
    { title: "Click-through Rate", value: "18.4%", iconType: "value" as StatCardProps["iconType"] },
    { title: "Conversion Rate", value: "6.2%", iconType: "revenue" as StatCardProps["iconType"] },
  ],
  trend: { labels: MONTH_LABELS, series: marketingTrendSeries },
  engagementFunnel: [
    { name: "Sent", value: "48,200", percentage: 100 },
    { name: "Delivered", value: "46,800", percentage: 92 },
    { name: "Opened", value: "20,600", percentage: 68 },
    { name: "Clicked", value: "8,880", percentage: 45 },
    { name: "Converted", value: "2,990", percentage: 28 },
  ] as CategoryPerformance[],
  topCampaigns: [
    {
      cells: [
        { value: "Black Label Vineyard" },
        { value: "Whatsapp", pill: true, pillVariant: "whatsapp" },
        { value: "12,400" },
        { value: "48.2%" },
        { value: "6.2%" },
        { value: "AED 18,420" },
      ],
    },
    {
      cells: [
        { value: "Crimson Oak Estate" },
        { value: "Email", pill: true, pillVariant: "email" },
        { value: "8,200" },
        { value: "62.1%" },
        { value: "8.4%" },
        { value: "AED 24,680" },
      ],
    },
    {
      cells: [
        { value: "Weekend Brunch Promo" },
        { value: "Email", pill: true, pillVariant: "email" },
        { value: "15,600" },
        { value: "38.5%" },
        { value: "5.1%" },
        { value: "AED 12,340" },
      ],
    },
    {
      cells: [
        { value: "Loyalty Rewards Blast" },
        { value: "Whatsapp", pill: true, pillVariant: "whatsapp" },
        { value: "6,800" },
        { value: "55.0%" },
        { value: "7.8%" },
        { value: "AED 9,870" },
      ],
    },
  ] as GenericTableRow[],
};

export const PAYMENT_METHODS: ChannelData[] = [
  { name: "Credit Card", value: 68480, displayValue: "AED 68,480", percentage: 54, color: "#3CCB7F", hoverColor: "#3CCB7F" },
  { name: "Debit Card", value: 840, displayValue: "AED 840", percentage: 24, color: "#FD853A", hoverColor: "#EA580C" },
  { name: "Bank Transfer", value: 680, displayValue: "AED 680", percentage: 12, color: "#EF4444", hoverColor: "#DC2626" },
  { name: "Cash", value: 7040, displayValue: "AED 7,040", percentage: 10, color: "#53B1FD", hoverColor: "#2563EB" },
];

export const paymentReport = {
  stats: [
    { title: "Total Revenue", value: "AED 14,002.50", iconType: "revenue" as StatCardProps["iconType"] },
    { title: "Successful Payments", value: "12,402", iconType: "orders" as StatCardProps["iconType"] },
    { title: "Pending Payments", value: "842", iconType: "orders" as StatCardProps["iconType"] },
    { title: "Refunded Amount", value: "AED 102.50", iconType: "value" as StatCardProps["iconType"] },
    { title: "Average Transaction Value", value: "AED 102.50", iconType: "value" as StatCardProps["iconType"] },
    { title: "Failed Transactions", value: "102", iconType: "orders" as StatCardProps["iconType"] },
    { title: "Invoice Collection Rate", value: "94.2%", iconType: "revenue" as StatCardProps["iconType"] },
    { title: "Net Profit", value: "AED 14,002.50", iconType: "revenue" as StatCardProps["iconType"] },
  ],
  peakHours: [
    { time: "11am", occupancy: 25 },
    { time: "12pm", occupancy: 45 },
    { time: "1pm", occupancy: 58 },
    { time: "2pm", occupancy: 42 },
    { time: "6pm", occupancy: 72 },
    { time: "7pm", occupancy: 85 },
    { time: "8pm", occupancy: 95 },
    { time: "9pm", occupancy: 62 },
    { time: "10pm", occupancy: 35 },
  ] as PeakHourDataPoint[],
  recentTransactions: [
    {
      cells: [
        { value: "Sterling" },
        { value: "Credit Card" },
        { value: "April 12, 2023" },
        { value: "AED 45.00" },
        { value: "successful", pill: true, pillVariant: "successful" },
      ],
    },
    {
      cells: [
        { value: "Alexander" },
        { value: "Digital Wallet" },
        { value: "July 8, 2024" },
        { value: "AED 7,200" },
        { value: "Pending", pill: true, pillVariant: "pending" },
      ],
    },
    {
      cells: [
        { value: "Isabella" },
        { value: "Bank Transfer" },
        { value: "November 19, 2022" },
        { value: "AED 5,900" },
        { value: "Refund", pill: true, pillVariant: "refund" },
      ],
    },
    {
      cells: [
        { value: "Blackwood" },
        { value: "Cash" },
        { value: "February 27, 2025" },
        { value: "AED 6,300" },
        { value: "Failed", pill: true, pillVariant: "failed" },
      ],
    },
  ] as GenericTableRow[],
};

export type ReportSlug =
  | "reports-sales-report"
  | "reports-orders-report"
  | "reports-reservation-report"
  | "reports-menu-performance"
  | "reports-customer-report"
  | "reports-marketing-report"
  | "reports-payment-report";

export const REPORT_PAGE_TITLES: Record<ReportSlug, string> = {
  "reports-sales-report": "Sales Report",
  "reports-orders-report": "Orders Report",
  "reports-reservation-report": "Reservations Report",
  "reports-menu-performance": "Menu Performance",
  "reports-customer-report": "Customer Report",
  "reports-marketing-report": "Marketing Report",
  "reports-payment-report": "Payment Report",
};
