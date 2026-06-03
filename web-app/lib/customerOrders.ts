import type { Customer, CustomerOrder } from "../data/mockCustomers";
import type { LiveOrder } from "../data/mockOrders";

export function resolveOrderLocation(order: LiveOrder): string {
  if (order.orderType === "Delivery") {
    return order.table.startsWith("Order") ? order.table : `Delivery · ${order.table}`;
  }
  return order.table;
}

export function liveOrderToCustomerOrder(order: LiveOrder): CustomerOrder {
  const lineItems = order.items.map((item) => ({
    quantity: item.quantity,
    name: item.name,
    price: item.price,
  }));

  const items = order.items.map((item) =>
    item.quantity > 1 ? `${item.quantity}x ${item.name}` : item.name
  );

  return {
    id: order.id,
    status: order.status,
    timeAgo: order.timeAgo,
    items,
    lineItems,
    serviceType: order.orderType,
    paymentMethod: "Credit Card",
    total: order.totalPrice,
    subtotal: order.subtotal,
    taxAndService: order.taxAndService,
    guests: order.guests,
    location: resolveOrderLocation(order),
    customerId: order.customerId,
  };
}

export function getOrdersForCustomer(
  customerId: string,
  liveOrders: LiveOrder[]
): CustomerOrder[] {
  return liveOrders
    .filter((order) => order.customerId === customerId)
    .map(liveOrderToCustomerOrder);
}

export function enrichCustomerWithLiveOrders(
  customer: Customer,
  liveOrders: LiveOrder[]
): Customer {
  const orders = getOrdersForCustomer(customer.id, liveOrders);
  const liveSpend = orders.reduce((sum, order) => sum + order.total, 0);
  const avgFromLive =
    orders.length > 0 ? liveSpend / orders.length : customer.avgOrderValue;

  return {
    ...customer,
    orders,
    ordersCount: customer.ordersCount,
    totalSpend: customer.totalSpend,
    avgOrderValue: avgFromLive,
    liveOrdersCount: orders.length,
    liveOrdersSpend: liveSpend,
  };
}

export type CustomerWithLiveOrders = Customer & {
  liveOrdersCount: number;
  liveOrdersSpend: number;
};
