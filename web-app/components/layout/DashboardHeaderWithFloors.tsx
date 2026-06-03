"use client";

import React from "react";
import { usePathname } from "next/navigation";
import DashboardHeader, { Branch, UserProfile } from "./DashboardHeader";
import { useFloorPlanOptional } from "../../contexts/FloorPlanContext";

interface DashboardHeaderWithFloorsProps {
  title?: string;
  branches?: Branch[];
  activeBranchId?: string;
  onBranchSelect?: (id: string) => void;
  user?: UserProfile;
  dateString?: string;
  onDateClick?: () => void;
  onMobileMenuToggle?: () => void;
  className?: string;
}

export default function DashboardHeaderWithFloors(props: DashboardHeaderWithFloorsProps) {
  const pathname = usePathname();
  const floorCtx = useFloorPlanOptional();
  const isTablesRoute = pathname.includes("/dashboard/tables");

  return (
    <DashboardHeader
      {...props}
      floors={
        isTablesRoute && floorCtx?.hydrated && floorCtx.floors.length > 1
          ? floorCtx.floors.map((f) => ({ id: f.id, name: f.name }))
          : undefined
      }
      activeFloorId={floorCtx?.activeFloorId}
      onFloorSelect={floorCtx?.setActiveFloorId}
    />
  );
}
