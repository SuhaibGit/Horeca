"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  Heart,
  Share2,
} from "lucide-react";
import {
  getRetailProductById,
  getRetailSideProducts,
  type RetailProduct,
  type RetailWeightOption,
} from "@/data/retailProducts";
import { useRetailCart } from "@/contexts/RetailCartContext";
import { formatPrice } from "@/lib/cart";
import PrimaryButton from "@/components/guest/PrimaryButton";
import QuantitySelector from "@/components/guest/QuantitySelector";

interface RetailProductDetailViewProps {
  product: RetailProduct;
}

export default function RetailProductDetailView({ product }: RetailProductDetailViewProps) {
  const router = useRouter();
  const { addItem } = useRetailCart();
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState<RetailWeightOption | null>(
    product.weightOptions?.[0] ?? null
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedSides, setSelectedSides] = useState<Record<string, boolean>>({});

  const sideProducts = useMemo(() => getRetailSideProducts(product), [product]);
  const unitPrice = selectedWeight?.price ?? product.price;
  const sidesTotal = sideProducts.reduce(
    (sum, side) => (selectedSides[side.id] ? sum + side.price : sum),
    0
  );
  const lineTotal = (unitPrice + sidesTotal) * quantity;

  const toggleSide = (sideId: string) => {
    setSelectedSides((prev) => ({ ...prev, [sideId]: !prev[sideId] }));
  };

  const handleAddToCart = () => {
    const weightLabel = selectedWeight?.label;
    const summary = [weightLabel, product.subtitle].filter(Boolean).join(" · ");

    addItem({
      itemId: `${product.id}${selectedWeight ? `-${selectedWeight.id}` : ""}`,
      name: product.name,
      image: product.image,
      unitPrice: unitPrice + sidesTotal,
      quantity,
      summary,
    });

    sideProducts.forEach((side) => {
      if (!selectedSides[side.id]) return;
      addItem({
        itemId: side.id,
        name: side.name,
        image: side.image,
        unitPrice: side.price,
        quantity: 1,
        summary: side.subtitle,
      });
    });

    router.push("/shop/cart");
  };

  return (
    <div className="w-full bg-white pb-28">
      <section className="relative aspect-[4/3] w-full overflow-hidden rounded-b-3xl bg-[#F8FAFC]">
        <Image
          src={product.images[imageIndex] ?? product.image}
          alt={product.name}
          fill
          className="object-contain p-4"
          priority
        />
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pt-4">
          <Link
            href="/shop"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#334155] shadow-sm"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#334155] shadow-sm"
              aria-label="Share"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#334155] shadow-sm"
              aria-label="Wishlist"
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>
        </div>
        {product.images.length > 1 ? (
          <span className="absolute bottom-4 right-4 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
            {imageIndex + 1}/{product.images.length}
          </span>
        ) : null}
      </section>

      <div className="px-4 pt-5">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl font-bold text-[#111827]">{product.name}</h1>
          <p className="text-xl font-bold text-[#111827]">{formatPrice(unitPrice)}</p>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[#64748B]">{product.description}</p>

        {product.weightOptions?.length ? (
          <section className="mt-6">
            <h2 className="text-base font-semibold text-[#111827]">Choose Weight</h2>
            <p className="text-xs text-[#64748B]">Select the weight that suits you</p>
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {product.weightOptions.map((option) => {
                const selected = selectedWeight?.id === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedWeight(option)}
                    className={`min-w-[110px] shrink-0 rounded-2xl border p-3 text-left ${
                      selected
                        ? "border-[#0A46A6] bg-[#EFF6FF]"
                        : "border-[#E2E8F0] bg-white"
                    }`}
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div className="relative h-10 w-8 overflow-hidden rounded">
                        <Image src={product.image} alt="" fill className="object-contain" />
                      </div>
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                          selected
                            ? "border-[#0A46A6] bg-[#0A46A6]"
                            : "border-[#CBD5E1]"
                        }`}
                      >
                        {selected ? (
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        ) : null}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[#111827]">{option.label}</p>
                    <p className="text-xs text-[#64748B]">{option.priceLabel}</p>
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        {sideProducts.length > 0 ? (
          <section className="mt-6">
            <h2 className="text-base font-semibold text-[#111827]">Add a Side (Optional)</h2>
            <p className="text-xs text-[#64748B]">Make it a complete meal.</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {sideProducts.map((side) => (
                <button
                  key={side.id}
                  type="button"
                  onClick={() => toggleSide(side.id)}
                  className={`rounded-2xl border p-2 text-left ${
                    selectedSides[side.id]
                      ? "border-[#0A46A6] bg-[#EFF6FF]"
                      : "border-[#E2E8F0]"
                  }`}
                >
                  <div className="relative mb-2 aspect-square overflow-hidden rounded-xl bg-[#F8FAFC]">
                    <Image src={side.image} alt={side.name} fill className="object-contain p-2" />
                    <span className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#0B2870] shadow-sm">
                      +
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#111827]">{side.name}</p>
                  <p className="text-xs text-[#64748B]">{side.subtitle}</p>
                  <p className="text-xs font-semibold text-[#111827]">{side.priceLabel}</p>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {product.images.length > 1 ? (
          <div className="mt-4 flex justify-center gap-2">
            {product.images.map((img, idx) => (
              <button
                key={img}
                type="button"
                onClick={() => setImageIndex(idx)}
                className={`h-2 w-2 rounded-full ${
                  idx === imageIndex ? "bg-[#0A46A6]" : "bg-[#CBD5E1]"
                }`}
                aria-label={`Image ${idx + 1}`}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-100 bg-white px-4 py-4">
        <div className="mx-auto flex w-full max-w-md items-center gap-3">
          <QuantitySelector value={quantity} onChange={setQuantity} min={1} />
          <PrimaryButton onClick={handleAddToCart} className="flex-1">
            Add to cart | {formatPrice(lineTotal)}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
