import GuestShell from "@/components/guest/GuestShell";

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden bg-white">
      <GuestShell>{children}</GuestShell>
    </div>
  );
}
