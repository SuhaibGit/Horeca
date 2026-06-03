"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  hasSubmenu?: boolean;
  submenuItems?: string[];
}

interface SidebarProps {
  activeId?: string;
  onItemSelect?: (id: string) => void;
  className?: string;
}

export default function Sidebar({
  activeId = "dashboard",
  onItemSelect,
  className = "",
}: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    marketing: activeId.startsWith("marketing"),
    reports: activeId.startsWith("reports"),
  });

  // Auto-expand parent menu when navigating to a submenu route (still allows manual collapse).
  useEffect(() => {
    setExpandedMenus((prev) => {
      const next = { ...prev };
      if (activeId.startsWith("marketing")) next.marketing = true;
      if (activeId.startsWith("reports")) next.reports = true;
      return next;
    });
  }, [activeId]);

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const handleItemClick = (id: string, hasSubmenu?: boolean) => {
    if (hasSubmenu) {
      toggleSubmenu(id);
    } else if (onItemSelect) {
      onItemSelect(id);
    }
  };

  // Reusable SVG Icon helper
  const getIcon = (type: string, isActive: boolean = false) => {
    const className = "w-5 h-5";
    const fill = isActive ? "url(#active-icon-grad)" : "none";
    const stroke = isActive ? "none" : "currentColor";
    const svgProps = { className, fill, stroke, viewBox: "0 0 24 24" };

    switch (type) {
      case "dashboard":
        return isActive ? (
          <svg {...svgProps}><path d="M11.47 2.47a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06l-.72-.72V21a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-2a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75v-10.69l-.72.72a.75.75 0 11-1.06-1.06l7.5-7.5z" /></svg>
        ) : (
          <svg {...svgProps} strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        );
      case "orders":
        return isActive ? (
          <svg {...svgProps}><path fillRule="evenodd" d="M10.5 3A1.5 1.5 0 009 4.5h6A1.5 1.5 0 0013.5 3h-3zm-2.693.178A3 3 0 0110.5 1.5h3a3 3 0 012.694 1.678c.497.042.992.092 1.486.15 1.497.173 2.57 1.46 2.57 2.929V19.5a3 3 0 01-3 3H6.75a3 3 0 01-3-3V6.257c0-1.47 1.073-2.756 2.57-2.93.493-.057.989-.107 1.487-.15zM7.5 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zm0 3a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zm0 3a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>
        ) : (
          <svg {...svgProps} strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
        );
      case "reservations":
        return isActive ? (
          <svg {...svgProps}><path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" /></svg>
        ) : (
          <svg {...svgProps} strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        );
      case "tables":
        return isActive ? (
          <svg {...svgProps}><path fillRule="evenodd" d="M2.25 4.5A.75.75 0 013 3.75h18a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zm0 6A.75.75 0 013 9.75h18a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zm0 6a.75.75 0 01.75-.75h18a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>
        ) : (
          <svg {...svgProps} strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>
        );
      case "menu":
        return isActive ? (
          <svg {...svgProps}><path fillRule="evenodd" d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm3 4.5a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H8.25a.75.75 0 01-.75-.75zm0 4.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>
        ) : (
          <svg {...svgProps} strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        );
      case "customers":
        return isActive ? (
          <svg {...svgProps}><path fillRule="evenodd" d="M8 8a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm9 0a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-9 2.5A5.5 5.5 0 0 0 2.5 16v1.5h11V16A5.5 5.5 0 0 0 8 10.5Zm9 0A5.5 5.5 0 0 0 13.664 12c.795 1.085 1.264 2.42 1.326 3.864V17.5h6.51V16a5.5 5.5 0 0 0-4.5-5.5Z" clipRule="evenodd" /></svg>
        ) : (
          <svg {...svgProps} strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
        );
      case "inventory":
        return isActive ? (
          <svg {...svgProps}><path d="M21 7.5l-9-4.5-9 4.5 9 4.5 9-4.5z" /><path d="M2.5 9.5v5l9 4.5v-5l-9-4.5z" /><path d="M21.5 9.5v5l-9 4.5v-5l9-4.5z" /></svg>
        ) : (
          <svg {...svgProps} strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
        );
      case "marketing":
        return isActive ? (
          <svg {...svgProps}><path fillRule="evenodd" d="M11 2.25c-1.38 0-2.6.86-3.1 2.15l-1.5 3.85H4.5A2.25 2.25 0 002.25 10.5v3c0 1.24 1.01 2.25 2.25 2.25h1.9l1.5 3.85c.5 1.29 1.72 2.15 3.1 2.15h.75A2.25 2.25 0 0014 19.5v-15A2.25 2.25 0 0011.75 2.25H11zm5.75 4a.75.75 0 01.75-.75c2.3 0 4.25 1.87 4.25 4.25s-1.95 4.25-4.25 4.25a.75.75 0 010-1.5c1.47 0 2.75-1.23 2.75-2.75s-1.28-2.75-2.75-2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>
        ) : (
          <svg {...svgProps} strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
        );
      case "reports":
        return isActive ? (
          <svg {...svgProps}><path fillRule="evenodd" d="M4 11a1 1 0 011-1h2a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1v-8zm6-4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V7zm6 6a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" clipRule="evenodd" /></svg>
        ) : (
          <svg {...svgProps} strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2" /></svg>
        );
      case "reviews":
        return isActive ? (
          <svg {...svgProps}><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>
        ) : (
          <svg {...svgProps} strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        );
      case "onepager":
        return isActive ? (
          <svg {...svgProps}><path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zm7.125 4.5V3.375l5.25 5.25h-3.375A1.875 1.875 0 0112.75 6z" clipRule="evenodd" /></svg>
        ) : (
          <svg {...svgProps} strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
        );
      case "roles":
        return isActive ? (
          <svg {...svgProps}><path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>
        ) : (
          <svg {...svgProps} strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        );
      case "billing":
        return isActive ? (
          <svg {...svgProps}><path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" /><path d="M1.5 10.5v6a3 3 0 003 3h15a3 3 0 003-3v-6h-21z" /></svg>
        ) : (
          <svg {...svgProps} strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
        );

      case "settings":
        return isActive ? (
          <svg {...svgProps}><path fillRule="evenodd" d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 01-.517.608 7.45 7.45 0 00-.478.198.798.798 0 01-.796-.064l-.453-.324a1.875 1.875 0 00-2.416.2l-.243.243a1.875 1.875 0 00-.2 2.416l.324.453a.798.798 0 01.064.796 7.448 7.448 0 00-.198.478.798.798 0 01-.608.517l-.55.092a1.875 1.875 0 00-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 01-.064.796l-.324.453a1.875 1.875 0 00.2 2.416l.243.243c.643.643 1.58.793 2.416.2l.453-.324a.798.798 0 01.796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 01.517-.608 7.52 7.52 0 00.478-.198.798.798 0 01.796.064l.453.324a1.875 1.875 0 002.416-.2l.243-.243a1.875 1.875 0 00.2-2.416l-.324-.453a.798.798 0 01-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 001.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 01-.608-.517 7.507 7.507 0 00-.198-.478.798.798 0 01.064-.796l.324-.453a1.875 1.875 0 00-.2-2.416l-.243-.243a1.875 1.875 0 00-2.416-.2l-.453.324a.798.798 0 01-.796.064 7.462 7.462 0 00-.478-.198.798.798 0 01-.517-.608l-.091-.55a1.875 1.875 0 00-1.85-1.566h-.344zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" /></svg>
        ) : (
          <svg {...svgProps} strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        );
      default:
        return null;
    }
  };

  const isActiveItem = (id: string) => activeId === id || (id === "marketing" && activeId.startsWith("marketing"));

  const menuItems: SidebarItem[] = [
    { id: "dashboard", label: "Dashboard", icon: getIcon("dashboard", isActiveItem("dashboard")) },
    { id: "live-orders", label: "Live Orders", icon: getIcon("orders", isActiveItem("live-orders")) },
    { id: "reservations", label: "Reservations", icon: getIcon("reservations", isActiveItem("reservations")) },
    { id: "tables", label: "Table Management", icon: getIcon("tables", isActiveItem("tables")) },
    { id: "menu", label: "Menu Management", icon: getIcon("menu", isActiveItem("menu")) },
    { id: "customers", label: "Customers", icon: getIcon("customers", isActiveItem("customers")) },
    { id: "inventory", label: "Inventory", icon: getIcon("inventory", isActiveItem("inventory")) },
    {
      id: "marketing",
      label: "Marketing",
      icon: getIcon("marketing", isActiveItem("marketing")),
      hasSubmenu: true,
      submenuItems: ["WhatsApp", "Email Campaign"],
    },
    {
      id: "reports",
      label: "Reports",
      icon: getIcon("reports", isActiveItem("reports")),
      hasSubmenu: true,
      submenuItems: ["Sales Report", "Orders Report", "Reservation Report", "Menu Performance", "Customer Report", "Marketing Report", "Payment Report"],
    },
    { id: "reviews", label: "Reviews", icon: getIcon("reviews", isActiveItem("reviews")) },
    { id: "onepager", label: "One Pager", icon: getIcon("onepager", isActiveItem("onepager")) },
    { id: "promotion", label: "Promotion", icon: getIcon("roles", isActiveItem("promotion")) },
    { id: "roles", label: "User & Role", icon: getIcon("roles", isActiveItem("roles")) },
    { id: "billing", label: "Billing", icon: getIcon("billing", isActiveItem("billing")) },
    { id: "settings", label: "Settings", icon: getIcon("settings", isActiveItem("settings")) },
  ];

  return (
    <aside
      className={`w-70 bg-[#031410] text-zinc-400 pt-5 pb-5 pl-5 pr-0 flex flex-col h-full min-h-0 overflow-hidden shrink-0 border-r border-[#123024] [color-scheme:dark] ${className}`}
    >
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <linearGradient id="active-icon-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C7A97A" />
            <stop offset="100%" stopColor="#FFE2B5" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col pr-4 scrollbar-hide">
        {/* Brand Logo Header */}
        <div className="mb-8 select-none p-2">
          <Image
            src="/horecaTemp1.png"
            alt="Horeca Logo"
            width={277}
            height={66}
            priority
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 ">
          {menuItems.map((item) => {
            const isActive =
              activeId === item.id ||
              (item.id === "marketing" && activeId.startsWith("marketing"));
            const isExpanded = Boolean(expandedMenus[item.id]);

            return (
              <div key={item.id} className="space-y-1 ">
                <button
                  onClick={() => handleItemClick(item.id, item.hasSubmenu)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-[91px] text-[16px] font-semibold transition-all duration-200 select-none cursor-pointer ${isActive
                    ? "bg-linear-to-r from-[#041B40] to-[#0A46A6] shadow-xs font-bold"
                    : "hover:bg-linear-to-r from-[#041B40] to-[#0A46A6]/0 hover:text-zinc-200"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? "" : "text-zinc-500 group-hover:text-zinc-200"}>
                      {item.icon}
                    </span>
                    <span className={isActive ? "bg-gradient-to-b from-[#C7A97A] to-[#FFE2B5] text-transparent bg-clip-text" : ""}>
                      {item.label}
                    </span>
                  </div>
                  {item.hasSubmenu && (
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""} ${isActive ? "!stroke-[url(#active-icon-grad)]" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>

                {/* Submenu Expansion */}
                {item.hasSubmenu && isExpanded && item.submenuItems && (
                  <div className="pl-12 pr-2 py-1 animate-fade-in">
                    <div className="relative border-l border-zinc-700/50 space-y-1">
                      {item.submenuItems.map((sub, idx) => {
                        const subId = `${item.id}-${sub.toLowerCase().replace(/\s+/g, "-")}`;
                        const isSubActive = activeId === subId;
                        return (
                          <div key={idx} className="relative flex items-center">
                            {isSubActive && (
                              <div className="absolute -left-[1px] top-1/2 -translate-y-1/2 w-[3px] h-5 bg-linear-to-r from-[#041B40] to-[#0A46A6] rounded-full" />
                            )}
                            <button
                              onClick={() => onItemSelect?.(subId)}
                              className={`w-full text-left py-2 pl-4 pr-3 ml-2 text-[14px] font-medium rounded-lg transition-all select-none cursor-pointer ${isSubActive
                                ? "text-[#C7A97A] "
                                : "text-zinc-500 hover:text-zinc-200 hover:bg-linear-to-r from-[#041B40] to-[#0A46A6]/20"
                                }`}
                            >
                              {sub}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer Branding Info */}
      <div className="shrink-0 pt-4 border-t border-[#123024] select-none text-[10px] text-zinc-600 font-semibold mr-5">
        v1.2.0 • Active Session
      </div>
    </aside>
  );
}
