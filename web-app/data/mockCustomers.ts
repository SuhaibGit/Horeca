import type { LiveOrderStatus, LiveOrderType } from "./mockOrders";

export interface CustomerOrderLineItem {
  quantity: number;
  name: string;
  price: number;
}

/** View-model for a live order shown in customer detail */
export interface CustomerOrder {
  id: string;
  customerId: string;
  status: LiveOrderStatus;
  timeAgo: string;
  items: string[];
  lineItems: CustomerOrderLineItem[];
  serviceType: LiveOrderType;
  paymentMethod: "Credit Card" | "Cash" | "Apple Pay";
  total: number;
  subtotal: number;
  taxAndService: number;
  guests: number;
  location: string;
}
export interface CustomerReservation {
  customerName: string;
  contact: string;
  date: string;
  guests: number;
  startTime: string;
  endTime: string;
  specialRequest?: string;
  items: { quantity: number; name: string; price: number }[];
}

export type CustomerType = "Restaurant visit" | "Delivery";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarColor: string;
  customerType: CustomerType;
  customerSince: string;
  ordersCount: number;
  totalSpend: number;
  lastVisit: string;
  lastVisitDays: number;
  avgOrderValue: number;
  orders: CustomerOrder[];
  reservation?: CustomerReservation;
}

export interface CustomerStats {
  totalCustomers: number;
  newThisMonth: number;
  avgLifetimeValue: string;
  repeatRate: string;
}

export const mockCustomerStats: CustomerStats = {
  totalCustomers: 500,
  newThisMonth: 12,
  avgLifetimeValue: "AED 48,290",
  repeatRate: "67%",
};

export const mockCustomers: Customer[] = [
  {
    id: "cust-001",
    name: "Naomi Clark",
    email: "sarah.j@email.com",
    phone: "+1(555)123-4567",
    avatarColor: "#0A46A6",
    customerType: "Restaurant visit",
    customerSince: "Jan 2023",
    ordersCount: 624,
    totalSpend: 2340,
    lastVisit: "2 days ago",
    lastVisitDays: 2,
    avgOrderValue: 49.8,
    orders: [],
    reservation: {
      customerName: "Naomi Clark",
      contact: "+1(555)123-4567",
      date: "Dec 18, 2025",
      guests: 4,
      startTime: "19:00",
      endTime: "21:00",
      specialRequest: "Window table preferred.",
      items: [
        { quantity: 2, name: "Grilled Salmon", price: 98 },
        { quantity: 1, name: "Caesar Salad", price: 42 },
      ],
    },
  },
  {
    id: "cust-002",
    name: "Aisha Khan",
    email: "aisha.khan@email.com",
    phone: "+1(555)234-5678",
    avatarColor: "#28A388",
    customerType: "Delivery",
    customerSince: "Mar 2024",
    ordersCount: 459,
    totalSpend: 1870,
    lastVisit: "1 week ago",
    lastVisitDays: 7,
    avgOrderValue: 40.7,
    orders: [],
  },
  {
    id: "cust-003",
    name: "Ethan Brooks",
    email: "ethan.brooks@email.com",
    phone: "+1(555)345-6789",
    avatarColor: "#15B79F",
    customerType: "Restaurant visit",
    customerSince: "Jun 2022",
    ordersCount: 991,
    totalSpend: 4500,
    lastVisit: "3 days ago",
    lastVisitDays: 3,
    avgOrderValue: 45.4,
    orders: [],
  },
  {
    id: "cust-004",
    name: "Sophia Lee",
    email: "sophia.lee@email.com",
    phone: "+1(555)678-9012",
    avatarColor: "#0A46A6",
    customerType: "Delivery",
    customerSince: "Aug 2024",
    ordersCount: 284,
    totalSpend: 1850,
    lastVisit: "6 days ago",
    lastVisitDays: 6,
    avgOrderValue: 52.1,
    orders: [],
  },
  {
    id: "cust-005",
    name: "Maya Chen",
    email: "maya.chen@email.com",
    phone: "+1(555)456-7890",
    avatarColor: "#2D8A77",
    customerType: "Restaurant visit",
    customerSince: "Feb 2024",
    ordersCount: 373,
    totalSpend: 2010,
    lastVisit: "12 hours ago",
    lastVisitDays: 0,
    avgOrderValue: 53.9,
    orders: [],
  },
  {
    id: "cust-006",
    name: "Liam Martinez",
    email: "liam.martinez@email.com",
    phone: "+1(555)987-6543",
    avatarColor: "#28A388",
    customerType: "Delivery",
    customerSince: "Nov 2023",
    ordersCount: 812,
    totalSpend: 3120,
    lastVisit: "5 hours ago",
    lastVisitDays: 0,
    avgOrderValue: 38.4,
    orders: [],
  },
  {
    id: "cust-007",
    name: "Carlos Diaz",
    email: "carlos.diaz@email.com",
    phone: "+1(555)567-8901",
    avatarColor: "#0A46A6",
    customerType: "Restaurant visit",
    customerSince: "Sep 2023",
    ordersCount: 655,
    totalSpend: 3300,
    lastVisit: "4 days ago",
    lastVisitDays: 4,
    avgOrderValue: 50.4,
    orders: [],
  },
  {
    id: "cust-008",
    name: "Emily Rodriguez",
    email: "emily.r@email.com",
    phone: "+1(555)789-0123",
    avatarColor: "#15B79F",
    customerType: "Delivery",
    customerSince: "Jun 2023",
    ordersCount: 412,
    totalSpend: 2680,
    lastVisit: "9 days ago",
    lastVisitDays: 9,
    avgOrderValue: 65.0,
    orders: [],
  },
  {
    id: "cust-009",
    name: "James Wilson",
    email: "james.wilson@email.com",
    phone: "+1(555)890-1234",
    avatarColor: "#2D8A77",
    customerType: "Restaurant visit",
    customerSince: "Aug 2022",
    ordersCount: 210,
    totalSpend: 9850,
    lastVisit: "5 days ago",
    lastVisitDays: 5,
    avgOrderValue: 46.9,
    orders: [],
  },
  {
    id: "cust-010",
    name: "Olivia Martinez",
    email: "olivia.m@email.com",
    phone: "+1(555)901-2345",
    avatarColor: "#0A46A6",
    customerType: "Restaurant visit",
    customerSince: "Dec 2024",
    ordersCount: 128,
    totalSpend: 1420,
    lastVisit: "Yesterday",
    lastVisitDays: 1,
    avgOrderValue: 52.5,
    orders: [],
  },
  {
    id: "cust-011",
    name: "Noah Thompson",
    email: "noah.t@email.com",
    phone: "+1(555)012-3456",
    avatarColor: "#28A388",
    customerType: "Delivery",
    customerSince: "Oct 2024",
    ordersCount: 156,
    totalSpend: 980,
    lastVisit: "3 days ago",
    lastVisitDays: 3,
    avgOrderValue: 52.0,
    orders: [],
  },
  {
    id: "cust-012",
    name: "Amelie Poulain",
    email: "amelie.poulain@gmail.com",
    phone: "+1(555)123-7890",
    avatarColor: "#15B79F",
    customerType: "Restaurant visit",
    customerSince: "Apr 2024",
    ordersCount: 220,
    totalSpend: 4100,
    lastVisit: "2 weeks ago",
    lastVisitDays: 14,
    avgOrderValue: 50.0,
    orders: [],
  },
  {
    id: "cust-013",
    name: "Zara Malik",
    email: "zara.malik@email.com",
    phone: "+1(555)234-8901",
    avatarColor: "#2D8A77",
    customerType: "Delivery",
    customerSince: "Jan 2025",
    ordersCount: 89,
    totalSpend: 1560,
    lastVisit: "11 days ago",
    lastVisitDays: 11,
    avgOrderValue: 48.2,
    orders: [],
  },
];
