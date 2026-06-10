"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Clock, Flame } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { getModifierGroupsForItem } from "@/data/guestOrderData";
import { buildModifierSummary, formatPrice } from "@/lib/cart";
import GuestPageHeader from "./GuestPageHeader";
import ModifierGroupSection from "./ModifierGroupSection";
import PrimaryButton from "./PrimaryButton";
import QuantitySelector from "./QuantitySelector";
import type { GuestMenuItem } from "./types";

interface MenuItemDetailViewProps {
  item: GuestMenuItem;
  heroImage: string;
}

const MenuItemDetailView = ({ item, heroImage }: MenuItemDetailViewProps) => {
  const router = useRouter();
  const { addItem } = useCart();
  const modifierGroups = useMemo(() => getModifierGroupsForItem(item), [item]);
  const [quantity, setQuantity] = useState(1);
  const [selections, setSelections] = useState<Record<string, string | string[]>>({});

  const lineTotal = item.price * quantity;

  const handleAddToCart = () => {
    addItem({
      itemId: item.id,
      name: item.name,
      image: item.image,
      unitPrice: item.price,
      quantity,
      summary: buildModifierSummary(selections),
      modifierSelections: selections,
    });
    router.push("/order/cart");
  };

  return (
    <div className="w-full bg-white pb-36">
      <GuestPageHeader
        heroImage={item.image || heroImage}
        backHref="/menu"
        showShare
        showTitle={false}
        heightClass="h-[280px]"
      />

      <div className="relative z-10 -mt-6 rounded-t-3xl bg-white px-4 pt-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-xl font-bold text-[#111827]">{item.name}</h1>
          <p className="text-lg font-bold text-[#111827]">{formatPrice(item.price)}</p>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{item.description}</p>

        {modifierGroups.map((group, index) => (
          <ModifierGroupSection
            key={group.id}
            group={group}
            subtitle={
              index === 0
                ? "Baked and juicy cooked just the way you like it."
                : index === 1
                  ? "Select one signature sauce to complement your steak."
                  : "Make it a complete meal."
            }
            selected={selections[group.id] ?? (group.selectionType === "Multi Select" ? [] : "")}
            onSelect={(value) =>
              setSelections((prev) => ({
                ...prev,
                [group.id]: value,
              }))
            }
            variant={index === 1 ? "pill" : "card"}
          />
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-100 bg-white">
        <div className="mx-auto flex w-full max-w-md items-center gap-4 px-4 py-4">
          <QuantitySelector value={quantity} onChange={setQuantity} />
          <PrimaryButton onClick={handleAddToCart} className="flex-1">
            Add to cart | {formatPrice(lineTotal)}
          </PrimaryButton>
        </div>

        {(item.prepTime || item.calories) && (
          <div className="bg-[#111827] px-4 py-3 text-xs text-white">
            <div className="mx-auto flex w-full max-w-md items-center justify-center gap-6">
              {item.prepTime && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Prep time: {item.prepTime}
                </span>
              )}
              {item.calories && (
                <span className="inline-flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5" />
                  {item.calories}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuItemDetailView;
