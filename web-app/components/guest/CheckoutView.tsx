"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Plus, Wallet } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { guestMenuPageData, guestPaymentMethods } from "@/data/guestOrderData";
import { formatPrice } from "@/lib/cart";
import GuestPageHeader from "./GuestPageHeader";
import PaymentMethodSheet from "./PaymentMethodSheet";
import PrimaryButton from "./PrimaryButton";

const CheckoutView = () => {
  const router = useRouter();
  const {
    items,
    subtotal,
    fulfillmentMethod,
    notes,
    selectedPaymentId,
    setFulfillmentMethod,
    setNotes,
    setSelectedPaymentId,
    placeOrder,
  } = useCart();
  const [paymentSheetOpen, setPaymentSheetOpen] = useState(false);

  const selectedPayment = guestPaymentMethods.find(
    (method) => method.id === selectedPaymentId
  );

  const handlePayNow = () => {
    const order = placeOrder(selectedPayment?.label ?? "Card");
    router.push(`/order/confirmed?orderId=${order.id}`);
  };

  return (
    <div className="w-full bg-white pb-28">
      <GuestPageHeader
        title="Checkout"
        heroImage={guestMenuPageData.heroImage}
        backHref="/order/cart"
      />

      <div className="relative z-10 -mt-6 rounded-t-3xl bg-white px-4 pt-6">
        <p className="text-sm text-[#64748B]">How would you like to receive your order?</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {(["pickup", "delivery"] as const).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setFulfillmentMethod(method)}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold capitalize ${
                fulfillmentMethod === method
                  ? "bg-gradient-to-r from-[#041B40] to-[#0A46A6] text-white"
                  : "border border-[#0A46A6] text-[#0A46A6]"
              }`}
            >
              {method}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-[#0A46A6]" />
              <span className="text-sm font-semibold text-[#111827]">Payment Method</span>
            </div>
            <button
              type="button"
              onClick={() => setPaymentSheetOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-[#0A46A6]"
              aria-label="Change payment method"
            >
              {selectedPayment ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </button>
          </div>
          {selectedPayment && (
            <p className="mt-2 text-sm text-[#64748B]">{selectedPayment.label}</p>
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-semibold text-[#111827]">Order Items</h2>
          <div className="mt-3 space-y-4">
            {items.map((item) => (
              <div key={item.lineId} className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#111827]">{item.name}</p>
                  {item.summary && (
                    <p className="text-xs text-[#64748B]">{item.summary}</p>
                  )}
                </div>
                <p className="text-sm font-semibold text-[#111827]">
                  {formatPrice(item.unitPrice * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-dashed border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#64748B]">Total Amount</span>
              <span className="text-2xl font-bold text-[#111827]">{formatPrice(subtotal)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="text-sm font-semibold text-[#111827]">Additional Notes</label>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Add notes here..."
            rows={4}
            className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#111827] outline-none placeholder:text-[#94A3B8] focus:border-[#0A46A6]"
          />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 bg-white px-4 py-4">
        <div className="mx-auto w-full max-w-md">
          <PrimaryButton onClick={handlePayNow} disabled={items.length === 0}>
            Pay Now
          </PrimaryButton>
        </div>
      </div>

      <PaymentMethodSheet
        open={paymentSheetOpen}
        methods={guestPaymentMethods}
        selectedId={selectedPaymentId}
        onClose={() => setPaymentSheetOpen(false)}
        onSelect={(id) => {
          setSelectedPaymentId(id);
          setPaymentSheetOpen(false);
        }}
        onAddNew={() => router.push("/order/checkout/add-card")}
      />
    </div>
  );
};

export default CheckoutView;
