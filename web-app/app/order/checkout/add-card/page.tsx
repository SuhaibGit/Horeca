"use client";

import { useRouter } from "next/navigation";
import AddPaymentMethodForm from "@/components/guest/AddPaymentMethodForm";

export default function AddCardPage() {
  const router = useRouter();

  return <AddPaymentMethodForm onContinue={() => router.push("/order/checkout")} />;
}
