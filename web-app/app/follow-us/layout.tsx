export default function FollowUsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden bg-white">
      {children}
    </div>
  );
}
