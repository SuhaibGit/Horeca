"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "../../components/layout/Sidebar";
import DashboardHeaderWithFloors from "../../components/layout/DashboardHeaderWithFloors";
import { Branch, UserProfile } from "../../components/layout/DashboardHeader";
import { FloorPlanProvider } from "../../contexts/FloorPlanContext";
import { apiGet, clearAccessToken, getAccessToken } from "../../lib/api";

const BRANCHES: Branch[] = [
  { id: "1", name: "The Grand Restaurant", location: "Downtown Location" },
  { id: "2", name: "Horeca Lounge", location: "Marina Branch" },
  { id: "3", name: "Horeca Beach Club", location: "Palm Jumeirah" },
];

const BranchContext = createContext<{
  activeBranchId: string;
  setActiveBranchId: (id: string) => void;
}>({
  activeBranchId: "1",
  setActiveBranchId: () => { },
});

export const useBranch = () => useContext(BranchContext);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [activeBranchId, setActiveBranchId] = useState<string>("1");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [headerUser, setHeaderUser] = useState<UserProfile>({
    name: "User",
    avatarUrl: "/avatars/avatar.jpg",
  });

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/sign-in");
      return;
    }

    async function loadUser() {
      try {
        const res = await apiGet<{
          success: boolean;
          user?: { full_name: string; email: string };
        }>("/auth/me", token);

        if (!res.success) {
          clearAccessToken();
          router.push("/sign-in");
          return;
        }
        if (res.success && res.user?.full_name) {
          setHeaderUser({
            name: res.user.full_name,
            avatarUrl: "/avatars/avatar.jpg",
          });
        }
      } catch {
        // Keep fallback name if profile fetch fails
      }
      setAuthChecked(true);
      if (!authChecked) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
      }
    }

    loadUser();
  }, [router, pathname]);

  // Extract active ID from current route pathname
  const pathParts = pathname.split("/");
  let activeTab = "dashboard";
  if (pathParts.length > 2 && pathParts[2]) {
    activeTab = pathParts[2];
  }

  const handleSidebarSelect = (id: string) => {
    setMobileMenuOpen(false);
    if (id === "dashboard") {
      router.push("/dashboard");
    } else {
      router.push(`/dashboard/${id}`);
    }
  };

  const getPageTitle = (tab: string) => {
    if (tab === "dashboard") return "Dashboard Overview";
    if (tab === "marketing-whatsapp") return "Marketing";
    if (tab === "marketing-email-campaign") return "Marketing";
    if (tab.startsWith("reports-")) {
      const reportTitles: Record<string, string> = {
        "reports-sales-report": "Sales Report",
        "reports-orders-report": "Orders Report",
        "reports-reservation-report": "Reservations Report",
        "reports-menu-performance": "Menu Performance",
        "reports-customer-report": "Customer Report",
        "reports-marketing-report": "Marketing Report",
        "reports-payment-report": "Payment Report",
      };
      return reportTitles[tab] ?? "Reports";
    }
    return tab.charAt(0).toUpperCase() + tab.slice(1).replace(/-/g, " ");
  };

  const isOnePagerRoute = pathname?.includes("/onepager");
  const isBuilderMode = pathname?.includes("/onepager/builder");
  const isTablesRoute = pathname?.includes("/dashboard/tables");

  const dashboardShell = (
    <div className="flex h-full min-h-0 w-full bg-zinc-50 dark:bg-zinc-950 font-sans transition-colors duration-300 overflow-hidden">

      {/* 1. SIDEBAR (DESKTOP) */}
      <Sidebar
        activeId={activeTab}
        onItemSelect={handleSidebarSelect}
        className="hidden lg:flex"
      />

      {/* 2. SIDEBAR DRAWER (MOBILE) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop overlay */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-[#092219]/60 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Drawer content panel */}
          <div className="relative flex flex-col w-64 h-full bg-[#092219] shadow-xl animate-slide-in">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Sidebar activeId={activeTab} onItemSelect={handleSidebarSelect} className="h-full border-none" />
          </div>
        </div>
      )}

      {/* 3. MAIN DASHBOARD CONTENT */}
      <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden">

        {/* TOP BAR HEADER */}
        <DashboardHeaderWithFloors
          title={getPageTitle(activeTab)}
          branches={BRANCHES}
          activeBranchId={activeBranchId}
          onBranchSelect={setActiveBranchId}
          user={headerUser}
          dateString="Date Selection"
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
        />

        {/* SCROLLABLE MAIN VIEW */}
        <main className={isOnePagerRoute
          ? "flex-1 min-h-0 overflow-hidden flex flex-col"
          : "flex-1 min-h-0 overflow-y-auto overflow-x-hidden space-y-6 dashboard-scroll-container p-6"
        }>
          {children}
        </main>
      </div>
    </div>
  );

  if (isBuilderMode) {
    return (
      <BranchContext.Provider value={{ activeBranchId, setActiveBranchId }}>
        {children}
      </BranchContext.Provider>
    );
  }

  const content = (
    <BranchContext.Provider value={{ activeBranchId, setActiveBranchId }}>
      {dashboardShell}
    </BranchContext.Provider>
  );

  return isTablesRoute ? <FloorPlanProvider>{content}</FloorPlanProvider> : content;
}
