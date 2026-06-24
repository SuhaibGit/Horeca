"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Settings } from "lucide-react";
import { logout } from "../../lib/api";

export interface Branch {
  id: string;
  name: string;
  location: string;
}

export interface UserProfile {
  name: string;
  avatarUrl: string;
  role?: string;
}

export interface FloorOption {
  id: string;
  name: string;
}

interface DashboardHeaderProps {
  title?: string;
  branches?: Branch[];
  activeBranchId?: string;
  onBranchSelect?: (id: string) => void;
  floors?: FloorOption[];
  activeFloorId?: string | null;
  onFloorSelect?: (id: string) => void;
  user?: UserProfile;
  dateString?: string;
  onDateClick?: () => void;
  onMobileMenuToggle?: () => void;
  className?: string;
}

export default function DashboardHeader({
  title = "Dashboard",
  branches = [
    { id: "1", name: "The Grand Restaurant", location: "Downtown Location" },
    { id: "2", name: "Horeca Lounge", location: "Marina Branch" },
    { id: "3", name: "Horeca Beach Club", location: "Palm Jumeirah" },
  ],
  activeBranchId = "1",
  onBranchSelect,
  floors,
  activeFloorId,
  onFloorSelect,
  user = {
    name: "John Williams",
    avatarUrl: "/avatars/avatar.jpg", // Fallback avatar rendering with custom initials is safe and beautiful!
  },
  dateString = "Date",
  onDateClick,
  onMobileMenuToggle,
  className = "",
}: DashboardHeaderProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [floorDropdownOpen, setFloorDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0];
  const showFloorDropdown = floors && floors.length > 1;
  const activeFloor =
    floors?.find((f) => f.id === activeFloorId) ?? floors?.[0];

  const handleBranchClick = (id: string) => {
    if (onBranchSelect) {
      onBranchSelect(id);
    }
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
    router.replace("/sign-in");
  };

  return (
    <header
      className={`w-full bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 select-none shrink-0 ${className}`}
    >
      {/* Title & Branch Selector Selector */}
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Dynamic Branch Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-between gap-4 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/40 text-left hover:bg-zinc-100/50 transition-all cursor-pointer w-[240px]"
          >
            <div className="flex flex-col truncate">
              <span className="text-[12px] font-bold text-zinc-800 dark:text-zinc-200 truncate">
                {activeBranch.name}
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold truncate">
                {activeBranch.location}
              </span>
            </div>
            <svg
              className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-[240px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg z-30 py-1.5 overflow-hidden animate-fade-in">
              {branches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handleBranchClick(b.id)}
                  className={`w-full text-left px-4 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 flex flex-col cursor-pointer transition-colors ${b.id === activeBranchId ? "bg-zinc-50/80 dark:bg-zinc-700/30" : ""
                    }`}
                >
                  <span className="text-[12px] font-bold text-zinc-800 dark:text-zinc-200">
                    {b.name}
                  </span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                    {b.location}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {showFloorDropdown && activeFloor ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setFloorDropdownOpen(!floorDropdownOpen)}
              className="flex items-center justify-between gap-4 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/40 text-left hover:bg-zinc-100/50 transition-all cursor-pointer w-[200px]"
            >
              <div className="flex flex-col truncate">
                <span className="text-[12px] font-bold text-zinc-800 dark:text-zinc-200 truncate">
                  {activeFloor.name}
                </span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold truncate">
                  Floor plan
                </span>
              </div>
              <svg
                className={`w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0 ${floorDropdownOpen ? "rotate-180" : ""
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {floorDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-[200px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg z-30 py-1.5 overflow-hidden animate-fade-in">
                {floors!.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      onFloorSelect?.(f.id);
                      setFloorDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 cursor-pointer transition-colors ${f.id === activeFloor.id ? "bg-zinc-50/80 dark:bg-zinc-700/30" : ""
                      }`}
                  >
                    <span className="text-[12px] font-bold text-zinc-800 dark:text-zinc-200">
                      {f.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* User profile, notifications & date filter */}
      <div className="flex items-center justify-between md:justify-end gap-4">
        {/* Date Selector Filter */}
        <button
          onClick={onDateClick || (() => alert("Date Picker Clicked!"))}
          className="flex items-center gap-2 px-4.5 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 text-[12px] font-bold text-zinc-600 dark:text-zinc-300 transition-all cursor-pointer"
        >
          <span>{dateString}</span>
          <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>

        {/* User menu */}
        <div className="relative pl-4 border-l border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-3 rounded-xl px-1 py-1 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
          >
            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-[#0A46A6]/10 flex items-center justify-center border border-zinc-100 dark:border-zinc-800">
              {user.avatarUrl && !user.avatarUrl.includes("avatar.jpg") ? (
                <Image src={user.avatarUrl} alt={user.name} fill className="object-cover" />
              ) : (
                <span className="text-[11px] font-extrabold text-[#0A46A6] tracking-tight">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              )}
            </div>
            <span className="text-[12.5px] font-bold text-zinc-800 dark:text-zinc-200 hidden sm:inline">
              {user.name}
            </span>
            <svg
              className={`w-4 h-4 text-zinc-400 transition-transform duration-200 hidden sm:block ${userMenuOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {userMenuOpen && (
            <div className="absolute top-full right-0 mt-1.5 w-48 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg z-30 py-1.5 overflow-hidden animate-fade-in">
              <Link
                href="/dashboard/settings"
                onClick={() => setUserMenuOpen(false)}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[12px] font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
              >
                <Settings className="h-4 w-4 text-zinc-500" />
                Settings
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[12px] font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
