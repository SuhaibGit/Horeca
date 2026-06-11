"use client";

import { ReserveProvider } from "@/contexts/ReserveContext";

export default function ReserveShell({ children }: { children: React.ReactNode }) {
  return <ReserveProvider>{children}</ReserveProvider>;
}
