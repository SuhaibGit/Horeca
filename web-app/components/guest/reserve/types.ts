import type { ReservationGuestTag } from "@/data/mockReservations";

export type GuestTagOption = ReservationGuestTag;

export const GUEST_TAG_OPTIONS: { value: GuestTagOption; label: string }[] = [
  { value: "VIP", label: "VIP" },
  { value: "Regular", label: "Regular" },
];

export interface TableReservation {
  id: string;
  customerName: string;
  contact: string;
  guestTag: GuestTagOption;
  guests: number;
  date: string;
  startTime: string;
  linkedTables: string[];
  specialRequest: string;
  dateLabel: string;
}

export const LINKED_TABLE_OPTIONS = [
  "Table 1",
  "Table 2",
  "Table 3",
  "Table 4",
  "Table 5",
  "Table 6",
  "Table 7",
  "Table 8",
];
