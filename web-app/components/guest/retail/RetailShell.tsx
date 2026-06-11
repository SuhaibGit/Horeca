"use client";

import { RetailCartProvider } from "@/contexts/RetailCartContext";

export default function RetailShell({ children }: { children: React.ReactNode }) {
  return <RetailCartProvider>{children}</RetailCartProvider>;
}
