"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { guestMenuPageData } from "@/data/guestOrderData";
import { formatPrice } from "@/lib/cart";
import CartLineItemRow from "./CartLineItemRow";
import GuestPageHeader from "./GuestPageHeader";
import PrimaryButton from "./PrimaryButton";

const CartView = () => {
  const router = useRouter();
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  return (
    <div className="w-full bg-white pb-32">
      <GuestPageHeader
        title="Cart"
        heroImage={guestMenuPageData.heroImage}
        backHref="/menu"
      />

      <div className="relative z-10 -mt-6 min-h-[60vh] rounded-t-3xl bg-white px-4 pt-6">
        <h2 className="mb-2 text-base font-semibold text-[#111827]">Order Items</h2>

        {items.length === 0 ? (
          <p className="py-10 text-center text-sm text-[#64748B]">
            Your cart is empty. Browse the menu to add items.
          </p>
        ) : (
          <div>
            {items.map((item) => (
              <CartLineItemRow
                key={item.lineId}
                item={item}
                onQuantityChange={(quantity) => updateQuantity(item.lineId, quantity)}
                onRemove={() => removeItem(item.lineId)}
              />
            ))}
          </div>
        )}

        <div className="mt-6">
          <p className="mb-2 text-sm font-semibold text-[#111827]">Promo Code</p>
          <div className="flex items-center justify-between rounded-2xl border border-gray-200 px-4 py-3">
            <input
              type="text"
              placeholder="Enter Promo Code"
              className="w-full bg-transparent text-sm text-[#111827] outline-none placeholder:text-[#94A3B8]"
            />
            <ChevronRight className="h-4 w-4 text-[#94A3B8]" />
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-100 bg-white px-4 py-4">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-[#64748B]">Sub Total</span>
            <span className="text-lg font-bold text-[#0A46A6]">{formatPrice(subtotal)}</span>
          </div>
          <PrimaryButton
            href={items.length > 0 ? "/order/checkout" : undefined}
            onClick={() => items.length > 0 && router.push("/order/checkout")}
            disabled={items.length === 0}
          >
            Proceed to Checkout
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default CartView;
