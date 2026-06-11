import RetailShell from "@/components/guest/retail/RetailShell";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden bg-white">
      <RetailShell>{children}</RetailShell>
    </div>
  );
}
