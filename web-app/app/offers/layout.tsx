export default function OffersLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 min-h-0 w-full overflow-y-auto bg-white">
      {children}
    </div>
  );
}
