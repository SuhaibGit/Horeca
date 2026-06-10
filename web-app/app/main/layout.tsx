export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden">
      {children}
    </div>
  );
}
