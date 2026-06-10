import { notFound } from "next/navigation";
import MenuItemDetailView from "@/components/guest/MenuItemDetailView";
import { getGuestMenuItem, guestMenuPageData } from "@/data/guestOrderData";

interface MenuItemPageProps {
  params: Promise<{ itemId: string }>;
}

export default async function MenuItemPage({ params }: MenuItemPageProps) {
  const { itemId } = await params;
  const item = getGuestMenuItem(itemId);

  if (!item) {
    notFound();
  }

  return <MenuItemDetailView item={item} heroImage={guestMenuPageData.heroImage} />;
}
