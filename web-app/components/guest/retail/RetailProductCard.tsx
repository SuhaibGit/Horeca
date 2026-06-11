"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { RetailProduct } from "@/data/retailProducts";

interface RetailProductCardProps {
  product: RetailProduct;
}

export default function RetailProductCard({ product }: RetailProductCardProps) {
  return (
    <Link href={`/shop/${product.id}`} className="group block">
      <div className="relative mb-2 aspect-[4/5] overflow-hidden rounded-2xl bg-[#F8FAFC]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-2"
          sizes="50vw"
        />
        <span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#0B2870] shadow-sm">
          <Plus className="h-4 w-4" />
        </span>
      </div>
      <p className="text-sm font-semibold text-[#111827]">{product.name}</p>
      <p className="text-xs text-[#64748B]">{product.subtitle}</p>
      <p className="mt-0.5 text-sm font-semibold text-[#111827]">{product.priceLabel}</p>
    </Link>
  );
}
