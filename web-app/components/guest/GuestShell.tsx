"use client";

import { CartProvider } from "@/contexts/CartContext";

export default function GuestShell({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
