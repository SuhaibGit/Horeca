"use client";

import Image from "next/image";
import { Check, Mail } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/cart";
import PrimaryButton from "./PrimaryButton";

const OrderConfirmedView = () => {
  const { lastOrder } = useCart();

  if (!lastOrder) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm text-[#64748B]">No recent order found.</p>
        <PrimaryButton href="/menu">Back to Menu</PrimaryButton>
      </div>
    );
  }

  return (
    <div className="w-full bg-white px-4 py-8">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#E8EEF8] text-[#0A46A6]">
          <Check className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-bold text-[#111827]">Order Confirmed</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Your fresh produce is on its way to you
        </p>
      </div>

      <section className="mt-8 rounded-2xl border border-gray-100 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-[#111827]">Order Details</h2>
          <span className="rounded-full bg-[#041B40] px-3 py-1 text-xs font-semibold capitalize text-white">
            {lastOrder.fulfillmentMethod}
          </span>
        </div>
        <InfoRow label="Order ID" value={lastOrder.id} />
        <InfoRow label="Date" value={lastOrder.dateLabel} />
      </section>

      <section className="mt-4 rounded-2xl border border-gray-100 p-4">
        <h2 className="mb-3 font-semibold text-[#111827]">Payment Method</h2>
        <InfoRow label="Paid via" value={lastOrder.paymentLabel} />
      </section>

      <section className="mt-4 rounded-2xl border border-gray-100 p-4">
        <h2 className="mb-3 font-semibold text-[#111827]">Order Items</h2>
        {lastOrder.items.map((item) => (
          <div key={item.lineId} className="flex items-center gap-3 py-2">
            <div className="relative h-12 w-12 overflow-hidden rounded-lg">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#111827]">{item.name}</p>
              {item.summary && <p className="text-xs text-[#64748B]">{item.summary}</p>}
            </div>
            <p className="text-sm font-semibold text-[#111827]">
              {formatPrice(item.unitPrice * item.quantity)}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-4 rounded-2xl border border-gray-100 p-4">
        <h2 className="mb-3 font-semibold text-[#111827]">Other Details</h2>
        <InfoRow label="Additional Notes" value={lastOrder.notes} />
        <InfoRow label="Sub Total" value={formatPrice(lastOrder.subtotal)} bold />
      </section>

      <section className="mt-4 rounded-2xl bg-[#F4F7FB] p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0A46A6]">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-[#111827]">Order Updates Sent</h3>
            <p className="mt-1 text-sm text-[#64748B]">
              Confirmation and pickup instructions have been sent to your email.
            </p>
            <ul className="mt-3 space-y-2 text-sm text-[#334155]">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#0A46A6]" />
                Order confirmation
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#0A46A6]" />
                Payment receipt
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div className="mt-8">
        <PrimaryButton href="/menu">Back to Menu</PrimaryButton>
      </div>
    </div>
  );
};

function InfoRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <span className="text-[#64748B]">{label}</span>
      <span className={bold ? "font-bold text-[#111827]" : "text-[#111827]"}>{value}</span>
    </div>
  );
}

export default OrderConfirmedView;
