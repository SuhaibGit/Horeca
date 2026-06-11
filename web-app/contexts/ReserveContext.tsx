"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { TableReservation } from "@/components/guest/reserve/types";

const STORAGE_KEY = "horeca-last-reservation";

interface ReserveContextValue {
  lastReservation: TableReservation | null;
  confirmReservation: (reservation: TableReservation) => void;
  clearReservation: () => void;
}

const ReserveContext = createContext<ReserveContextValue | null>(null);

function loadStored(): TableReservation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TableReservation) : null;
  } catch {
    return null;
  }
}

export function ReserveProvider({ children }: { children: React.ReactNode }) {
  const [lastReservation, setLastReservation] = useState<TableReservation | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLastReservation(loadStored());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (lastReservation) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(lastReservation));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [lastReservation, hydrated]);

  const confirmReservation = (reservation: TableReservation) => {
    setLastReservation(reservation);
  };

  const clearReservation = () => setLastReservation(null);

  return (
    <ReserveContext.Provider
      value={{ lastReservation, confirmReservation, clearReservation }}
    >
      {children}
    </ReserveContext.Provider>
  );
}

export function useReserve() {
  const ctx = useContext(ReserveContext);
  if (!ctx) throw new Error("useReserve must be used within ReserveProvider");
  return ctx;
}
