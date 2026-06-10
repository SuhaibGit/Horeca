import Image from "next/image";
import { Trash2 } from "lucide-react";
import type { CartLineItem } from "./types";
import QuantitySelector from "./QuantitySelector";
import { formatPrice } from "@/lib/cart";

interface CartLineItemRowProps {
  item: CartLineItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

const CartLineItemRow = ({ item, onQuantityChange, onRemove }: CartLineItemRowProps) => {
  return (
    <div className="border-b border-dashed border-gray-200 py-4 last:border-b-0">
      <div className="flex gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
          <Image src={item.image} alt={item.name} fill className="object-cover" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-[#111827]">{item.name}</p>
              {item.summary && (
                <p className="text-xs text-[#64748B]">{item.summary}</p>
              )}
            </div>
            <button
              type="button"
              aria-label="Remove item"
              onClick={onRemove}
              className="text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <QuantitySelector
              value={item.quantity}
              onChange={onQuantityChange}
              min={1}
            />
            <p className="text-sm font-semibold text-[#111827]">
              {formatPrice(item.unitPrice * item.quantity)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartLineItemRow;
