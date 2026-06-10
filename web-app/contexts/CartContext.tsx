"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartLineItem, FulfillmentMethod, PlacedOrder } from "@/components/guest/types";
import { defaultDeliveryAddress } from "@/data/guestOrderData";
import { getCartSubtotal } from "@/lib/cart";

const CART_STORAGE_KEY = "horeca-guest-cart";

interface StoredCartState {
  items: CartLineItem[];
  fulfillmentMethod: FulfillmentMethod;
  deliveryAddress: string;
  notes: string;
  selectedPaymentId: string | null;
  lastOrder: PlacedOrder | null;
}

function loadStoredCart(): StoredCartState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredCartState) : null;
  } catch {
    return null;
  }
}

interface AddToCartInput {
  itemId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  summary: string;
  modifierSelections: Record<string, string | string[]>;
}

interface CartContextValue {
  items: CartLineItem[];
  itemCount: number;
  subtotal: number;
  fulfillmentMethod: FulfillmentMethod;
  deliveryAddress: string;
  notes: string;
  selectedPaymentId: string | null;
  lastOrder: PlacedOrder | null;
  addItem: (input: AddToCartInput) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  setFulfillmentMethod: (method: FulfillmentMethod) => void;
  setDeliveryAddress: (address: string) => void;
  setNotes: (notes: string) => void;
  setSelectedPaymentId: (paymentId: string | null) => void;
  placeOrder: (paymentLabel: string) => PlacedOrder;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [fulfillmentMethod, setFulfillmentMethod] = useState<FulfillmentMethod>("pickup");
  const [deliveryAddress, setDeliveryAddress] = useState(defaultDeliveryAddress);
  const [notes, setNotes] = useState("");
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>("pm-1");
  const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadStoredCart();
    if (stored) {
      setItems(stored.items);
      setFulfillmentMethod(stored.fulfillmentMethod);
      setDeliveryAddress(stored.deliveryAddress ?? defaultDeliveryAddress);
      setNotes(stored.notes);
      setSelectedPaymentId(stored.selectedPaymentId);
      setLastOrder(stored.lastOrder);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    const payload: StoredCartState = {
      items,
      fulfillmentMethod,
      deliveryAddress,
      notes,
      selectedPaymentId,
      lastOrder,
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
  }, [deliveryAddress, fulfillmentMethod, hydrated, items, lastOrder, notes, selectedPaymentId]);

  const addItem = useCallback((input: AddToCartInput) => {
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
        modifierSelections: input.modifierSelections,
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

  const clearCart = useCallback(() => {
    setItems([]);
    setNotes("");
  }, []);

  const placeOrder = useCallback(
    (paymentLabel: string) => {
      const order: PlacedOrder = {
        id: `ORD#${Math.floor(100 + Math.random() * 900)}`,
        fulfillmentMethod,
        deliveryAddress:
          fulfillmentMethod === "delivery" ? deliveryAddress.trim() : undefined,
        dateLabel: new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
        paymentLabel,
        notes: notes.trim() || "-",
        subtotal: getCartSubtotal(items),
        items: [...items],
      };
      setLastOrder(order);
      clearCart();
      return order;
    },
    [clearCart, deliveryAddress, fulfillmentMethod, items, notes]
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = getCartSubtotal(items);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      fulfillmentMethod,
      deliveryAddress,
      notes,
      selectedPaymentId,
      lastOrder,
      addItem,
      updateQuantity,
      removeItem,
      setFulfillmentMethod,
      setDeliveryAddress,
      setNotes,
      setSelectedPaymentId,
      placeOrder,
      clearCart,
    }),
    [
      addItem,
      clearCart,
      deliveryAddress,
      fulfillmentMethod,
      itemCount,
      items,
      lastOrder,
      notes,
      placeOrder,
      removeItem,
      selectedPaymentId,
      subtotal,
      updateQuantity,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
