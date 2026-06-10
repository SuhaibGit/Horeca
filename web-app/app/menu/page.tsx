import MenuBrowseView from "@/components/guest/MenuBrowseView";
import { guestMenuItems, guestMenuPageData } from "@/data/guestOrderData";

export default function MenuPage() {
  return <MenuBrowseView pageData={guestMenuPageData} items={guestMenuItems} />;
}
