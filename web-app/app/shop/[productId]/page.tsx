import { notFound } from "next/navigation";
import RetailProductDetailView from "@/components/guest/retail/RetailProductDetailView";
import { getRetailProductById } from "@/data/retailProducts";

interface ShopProductPageProps {
  params: Promise<{ productId: string }>;
}

export default async function ShopProductPage({ params }: ShopProductPageProps) {
  const { productId } = await params;
  const product = getRetailProductById(productId);

  if (!product) {
    notFound();
  }

  return <RetailProductDetailView product={product} />;
}
