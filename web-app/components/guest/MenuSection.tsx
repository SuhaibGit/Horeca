import MenuItemCard from "./MenuItemCard";
import type { GuestMenuItem } from "./types";

interface MenuSectionProps {
  title: string;
  items: GuestMenuItem[];
  viewAllHref?: string;
}

const MenuSection = ({ title, items, viewAllHref = "#" }: MenuSectionProps) => {
  if (items.length === 0) return null;

  return (
    <section className="px-4 pb-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#111827]">{title}</h2>
        <a href={viewAllHref} className="text-sm font-medium text-[#64748B]">
          View All
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} href={`/menu/${item.id}`} />
        ))}
      </div>
    </section>
  );
};

export default MenuSection;
