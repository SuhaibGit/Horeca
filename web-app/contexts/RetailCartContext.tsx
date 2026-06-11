"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartLineItem } from "@/components/guest/types";
import { getCartSubtotal } from "@/lib/cart";

const STORAGE_KEY = "horeca-retail-cart";
const DEFAULT_ADDRESS = "123 St. Downtown Rd. New Jersey, 30015";

export interface RetailPlacedOrder {
  id: string;
  deliveryAddress: string;
  dateLabel: string;
  paymentLabel: string;
  notes: string;
  subtotal: number;
  items: CartLineItem[];
}

interface StoredRetailCart {
  items: CartLineItem[];
  deliveryAddress: string;
  selectedPaymentId: string | null;
  paymentLabel: string;
  lastOrder: RetailPlacedOrder | null;
}

function loadStored(): StoredRetailCart | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredRetailCart) : null;
  } catch {
    return null;
  }
}

interface AddRetailItemInput {
  itemId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  summary: string;
}

interface RetailCartContextValue {
  items: CartLineItem[];
  itemCount: number;
  subtotal: number;
  deliveryAddress: string;
  selectedPaymentId: string | null;
  paymentLabel: string;
  lastOrder: RetailPlacedOrder | null;
  addItem: (input: AddRetailItemInput) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  setDeliveryAddress: (address: string) => void;
  setPayment: (paymentId: string, label: string) => void;
  placeOrder: () => RetailPlacedOrder;
  clearCart: () => void;
}

const RetailCartContext = createContext<RetailCartContextValue | null>(null);

export function RetailCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState(DEFAULT_ADDRESS);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>("pm-1");
  const [paymentLabel, setPaymentLabel] = useState("MasterCard *4542");
  const [lastOrder, setLastOrder] = useState<RetailPlacedOrder | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadStored();
    if (stored) {
      setItems(stored.items);
      setDeliveryAddress(stored.deliveryAddress ?? DEFAULT_ADDRESS);
      setSelectedPaymentId(stored.selectedPaymentId);
      setPaymentLabel(stored.paymentLabel ?? "MasterCard *4542");
      setLastOrder(stored.lastOrder);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    const payload: StoredRetailCart = {
      items,
      deliveryAddress,
      selectedPaymentId,
      paymentLabel,
      lastOrder,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [deliveryAddress, hydrated, items, lastOrder, paymentLabel, selectedPaymentId]);

  const addItem = useCallback((input: AddRetailItemInput) => {
    setItems((prev) => [
      ...prev,
      {
        lineId: `${input.itemId}-${Date.now()}`,
        itemId: input.itemId,
        name: input.name,
        image: input.image,
        unitPrice: input.unitPrice,
        quantity: input.quantity,
        summary: input.summary,
        modifierSelections: {},
      },
    ]);
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((item) => (item.lineId === lineId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((item) => item.lineId !== lineId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const setPayment = useCallback((paymentId: string, label: string) => {
    setSelectedPaymentId(paymentId);
    setPaymentLabel(label);
  }, []);

  const placeOrder = useCallback(() => {
    const order: RetailPlacedOrder = {
      id: `ORD#${Math.floor(100 + Math.random() * 900)}`,
      deliveryAddress: deliveryAddress.trim(),
      dateLabel: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      paymentLabel,
      notes: "-",
      subtotal: getCartSubtotal(items),
      items: [...items],
    };
    setLastOrder(order);
    clearCart();
    return order;
  }, [clearCart, deliveryAddress, items, paymentLabel]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = getCartSubtotal(items);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      deliveryAddress,
      selectedPaymentId,
      paymentLabel,
      lastOrder,
      addItem,
      updateQuantity,
      removeItem,
      setDeliveryAddress,
      setPayment,
      placeOrder,
      clearCart,
    }),
    [
      addItem,
      clearCart,
      deliveryAddress,
      itemCount,
      items,
      lastOrder,
      paymentLabel,
      placeOrder,
      removeItem,
      selectedPaymentId,
      setPayment,
      subtotal,
      updateQuantity,
    ]
  );

  return (
    <RetailCartContext.Provider value={value}>{children}</RetailCartContext.Provider>
  );
}

export function useRetailCart() {
  const ctx = useContext(RetailCartContext);
  if (!ctx) throw new Error("useRetailCart must be used within RetailCartProvider");
  return ctx;
}
