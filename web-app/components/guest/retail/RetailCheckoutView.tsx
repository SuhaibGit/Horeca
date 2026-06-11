"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin, Pencil, Plus, Wallet } from "lucide-react";
import { retailPageData } from "@/data/retailProducts";
import { useRetailCart } from "@/contexts/RetailCartContext";
import { formatPrice } from "@/lib/cart";
import DeliveryAddressSheet from "@/components/guest/DeliveryAddressSheet";
import GuestPageHeader from "@/components/guest/GuestPageHeader";
import PrimaryButton from "@/components/guest/PrimaryButton";

export default function RetailCheckoutView() {
  const router = useRouter();
  const {
    items,
    subtotal,
    deliveryAddress,
    paymentLabel,
    selectedPaymentId,
    setDeliveryAddress,
    placeOrder,
  } = useRetailCart();
  const [addressSheetOpen, setAddressSheetOpen] = useState(false);
  const [draftAddress, setDraftAddress] = useState(deliveryAddress);

  const hasAddress = deliveryAddress.trim().length > 0;
  const hasPayment = Boolean(selectedPaymentId);
  const canPay = items.length > 0 && hasAddress && hasPayment;

  const handlePayNow = () => {
    const order = placeOrder();
    router.push(`/shop/confirmed?orderId=${order.id}`);
  };

  return (
    <div className="w-full bg-white pb-28">
      <GuestPageHeader
        title="Checkout"
        heroImage={retailPageData.heroImage}
        backHref="/shop/cart"
        showTitle
      />

      <div className="relative z-10 -mt-6 rounded-t-3xl bg-white px-4 pt-6">
        {hasAddress ? (
          <div className="mb-3 rounded-2xl border border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#0A46A6]" />
                <span className="text-sm font-semibold text-[#111827]">Delivery Address</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDraftAddress(deliveryAddress);
                  setAddressSheetOpen(true);
                }}
                className="text-[#0A46A6]"
                aria-label="Edit address"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-sm text-[#64748B]">{deliveryAddress}</p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setDraftAddress(deliveryAddress);
              setAddressSheetOpen(true);
            }}
            className="mb-3 flex w-full items-center justify-between rounded-2xl border border-gray-200 px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#0A46A6]" />
              <span className="text-sm font-semibold text-[#111827]">Delivery Address</span>
            </div>
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#0A46A6] text-[#0A46A6]">
              <Plus className="h-4 w-4" />
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={() => router.push("/shop/checkout/add-card")}
          className="mb-6 flex w-full items-center justify-between rounded-2xl border border-gray-200 px-4 py-3"
        >
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-[#0A46A6]" />
            <span className="text-sm font-semibold text-[#111827]">Payment Method</span>
          </div>
          {hasPayment ? (
            <span className="text-xs text-[#64748B]">{paymentLabel}</span>
          ) : (
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#0A46A6] text-[#0A46A6]">
              <Plus className="h-4 w-4" />
            </span>
          )}
        </button>

        <h2 className="mb-3 text-sm font-semibold text-[#111827]">Order Items</h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.lineId} className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#F8FAFC]">
                <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#111827]">{item.name}</p>
                {item.summary ? (
                  <p className="text-xs text-[#64748B]">{item.summary}</p>
                ) : null}
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
            <span className="text-lg font-bold text-[#0A46A6]">{formatPrice(subtotal)}</span>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 bg-white px-4 py-4">
        <div className="mx-auto w-full max-w-md">
          <PrimaryButton onClick={handlePayNow} disabled={!canPay}>
            Pay Now
          </PrimaryButton>
        </div>
      </div>

      <DeliveryAddressSheet
        open={addressSheetOpen}
        address={draftAddress}
        onClose={() => setAddressSheetOpen(false)}
        onChange={setDraftAddress}
        onSave={() => {
          setDeliveryAddress(draftAddress);
          setAddressSheetOpen(false);
        }}
      />
    </div>
  );
}
