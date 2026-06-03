import { Reservation } from "../data/mockReservations";
import { LiveOrder } from "../data/mockOrders";

export type FloorTableStatus = "available" | "reserved" | "occupied" | "cleaning";

export interface ResolvedTableStatus {
  status: FloorTableStatus;
  label?: string;
}

/** Match "Table 1", "T01", "Table 01" to the same key */
export function normalizeTableKey(id: string): string {
  const digits = id.replace(/\D/g, "");
  if (digits) return String(parseInt(digits, 10));
  return id.trim().toLowerCase();
}

export function formatReservationStartTime(timeRange: string): string {
  const start = timeRange.split("-")[0]?.trim() ?? timeRange;
  const [hourStr, minuteStr] = start.split(":");
  const hour = Number(hourStr);
  const minute = Number(minuteStr) || 0;
  if (Number.isNaN(hour)) return timeRange;
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}

function parseElapsedMinutes(timeAgo: string): string | undefined {
  const match = timeAgo.match(/(\d+)\s*m/i);
  if (match) return `${match[1]} min`;
  return timeAgo;
}

const ACTIVE_ORDER_STATUSES: LiveOrder["status"][] = [
  "New",
  "Ready",
  "Preparing",
  "Served",
  "Delay",
];

export function resolveTableStatus(
  tableId: string,
  options: {
    reservations: Reservation[];
    orders: LiveOrder[];
    viewDate: string;
    manualStatus?: "available" | "cleaning" | null;
  }
): ResolvedTableStatus {
  const { reservations, orders, viewDate, manualStatus } = options;
  const key = normalizeTableKey(tableId);

  if (manualStatus === "cleaning") {
    return { status: "cleaning", label: "Cleaning" };
  }

  const activeOrder = orders.find(
    (o) =>
      normalizeTableKey(o.table) === key &&
      ACTIVE_ORDER_STATUSES.includes(o.status)
  );
  if (activeOrder) {
    return {
      status: "occupied",
      label: parseElapsedMinutes(activeOrder.timeAgo) ?? "Occupied",
    };
  }

  const tableReservations = reservations.filter(
    (r) =>
      r.date === viewDate &&
      normalizeTableKey(r.tableNo) === key &&
      (r.status === "Confirmed" || r.status === "Pending")
  );

  if (tableReservations.length > 0) {
    const next = [...tableReservations].sort((a, b) =>
      (a.time.split("-")[0] ?? "").localeCompare(b.time.split("-")[0] ?? "")
    )[0];
    return {
      status: "reserved",
      label: formatReservationStartTime(next.time),
    };
  }

  return { status: "available" };
}

export const FLOOR_TABLE_STATUS_STYLES: Record<
  FloorTableStatus,
  { ring: string; label: string }
> = {
  available: {
    ring: "ring-[#10B981] ring-[3px]",
    label: "text-emerald-600 dark:text-emerald-400",
  },
  reserved: {
    ring: "ring-[#F59E0B] ring-[3px]",
    label: "text-amber-600 dark:text-amber-400",
  },
  occupied: {
    ring: "ring-[#EF4444] ring-[3px]",
    label: "text-red-600 dark:text-red-400",
  },
  cleaning: {
    ring: "ring-[#3B82F6] ring-[3px]",
    label: "text-blue-600 dark:text-blue-400",
  },
};
