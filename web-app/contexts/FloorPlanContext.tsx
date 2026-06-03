"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { FloorPlanTable } from "../components/tables/FloorPlanTableNode";

export type FloorZone = "indoor" | "outdoor" | "vip" | "terrace";

export interface RestaurantFloor {
  id: string;
  name: string;
  blueprintImage: string | null;
  tables: FloorPlanTable[];
  createdAt: string;
  /** 2 = table xPct/yPct are relative to the blueprint placement box */
  layoutCoordVersion?: number;
}

interface FloorPlanContextValue {
  floors: RestaurantFloor[];
  activeFloorId: string | null;
  activeFloor: RestaurantFloor | null;
  setActiveFloorId: (id: string) => void;
  addFloor: (name: string, blueprintImage?: string | null) => string;
  updateActiveFloor: (
    patch: Partial<Pick<RestaurantFloor, "name" | "blueprintImage" | "tables" | "layoutCoordVersion">>
  ) => void;
  deleteFloor: (id: string) => void;
  hasFloors: boolean;
  hydrated: boolean;
}

const STORAGE_KEY = "horeca-floor-plans-v2";

const FloorPlanContext = createContext<FloorPlanContextValue | null>(null);

function loadFloors(): RestaurantFloor[] {
  if (typeof window === "undefined") return [];
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ??
      localStorage.getItem("horeca-floor-plans-v1");
    if (!raw) return [];
    return JSON.parse(raw) as RestaurantFloor[];
  } catch {
    return [];
  }
}

function saveFloors(floors: RestaurantFloor[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(floors));
}

export function FloorPlanProvider({ children }: { children: React.ReactNode }) {
  const [floors, setFloors] = useState<RestaurantFloor[]>([]);
  const [activeFloorId, setActiveFloorId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadFloors();
    setFloors(loaded);
    setActiveFloorId(loaded[0]?.id ?? null);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveFloors(floors);
  }, [floors, hydrated]);

  const activeFloor = floors.find((f) => f.id === activeFloorId) ?? null;

  const addFloor = useCallback((name: string, blueprintImage: string | null = null) => {
    const id = `floor-${Date.now()}`;
    const floor: RestaurantFloor = {
      id,
      name: name.trim() || "Main Floor",
      blueprintImage,
      tables: [],
      createdAt: new Date().toISOString(),
      layoutCoordVersion: 2,
    };
    setFloors((prev) => [...prev, floor]);
    setActiveFloorId(id);
    return id;
  }, []);

  const updateActiveFloor = useCallback(
    (patch: Partial<Pick<RestaurantFloor, "name" | "blueprintImage" | "tables" | "layoutCoordVersion">>) => {
      if (!activeFloorId) return;
      setFloors((prev) =>
        prev.map((f) => (f.id === activeFloorId ? { ...f, ...patch } : f))
      );
    },
    [activeFloorId]
  );

  const deleteFloor = useCallback((id: string) => {
    setFloors((prev) => {
      const next = prev.filter((f) => f.id !== id);
      setActiveFloorId((current) => {
        if (current !== id) return current;
        return next[0]?.id ?? null;
      });
      return next;
    });
  }, []);

  return (
    <FloorPlanContext.Provider
      value={{
        floors,
        activeFloorId,
        activeFloor,
        setActiveFloorId,
        addFloor,
        updateActiveFloor,
        deleteFloor,
        hasFloors: floors.length > 0,
        hydrated,
      }}
    >
      {children}
    </FloorPlanContext.Provider>
  );
}

export function useFloorPlan() {
  const ctx = useContext(FloorPlanContext);
  if (!ctx) throw new Error("useFloorPlan must be used within FloorPlanProvider");
  return ctx;
}

export function useFloorPlanOptional() {
  return useContext(FloorPlanContext);
}
