"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Calendar, ChevronDown, ChevronLeft, Clock, Lock } from "lucide-react";
import { useReserve } from "@/contexts/ReserveContext";
import { mainPageData } from "@/components/main/data";
import PrimaryButton from "@/components/guest/PrimaryButton";
import { GUEST_TAG_OPTIONS, LINKED_TABLE_OPTIONS, type GuestTagOption } from "./types";
import {
  formatReservationDateLabel,
  generateBookingId,
} from "@/lib/reservationFormat";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-xs font-medium text-[#64748B]">{children}</label>
  );
}

function TextField({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-3 text-sm text-[#111827] placeholder:text-[#94A3B8] focus:border-[#0A46A6] focus:outline-none focus:ring-1 focus:ring-[#0A46A6]/30"
    />
  );
}

function pickerTriggerClass(open: boolean) {
  return `flex w-full items-center justify-between rounded-xl border bg-white px-3.5 py-3 text-left text-sm transition-colors ${
    open
      ? "border-[#0A46A6] ring-1 ring-[#0A46A6]/25"
      : "border-[#E2E8F0] hover:border-[#CBD5E1]"
  }`;
}

function pickerPanelClass() {
  return "absolute left-0 right-0 top-full z-30 mt-1.5 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white py-1 shadow-[0_8px_24px_rgba(15,23,42,0.12)]";
}

export default function ReserveTableView() {
  const router = useRouter();
  const { confirmReservation } = useReserve();
  const guestTagPickerRef = useRef<HTMLDivElement>(null);
  const tablePickerRef = useRef<HTMLDivElement>(null);

  const [customerName, setCustomerName] = useState("");
  const [contact, setContact] = useState("");
  const [guestTag, setGuestTag] = useState<GuestTagOption>("Regular");
  const [guests, setGuests] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [linkedTables, setLinkedTables] = useState<string[]>([]);
  const [specialRequest, setSpecialRequest] = useState("");
  const [guestTagOpen, setGuestTagOpen] = useState(false);
  const [tablesOpen, setTablesOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        guestTagPickerRef.current &&
        !guestTagPickerRef.current.contains(target)
      ) {
        setGuestTagOpen(false);
      }
      if (
        tablePickerRef.current &&
        !tablePickerRef.current.contains(target)
      ) {
        setTablesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTable = (table: string) => {
    setLinkedTables((prev) =>
      prev.includes(table) ? prev.filter((t) => t !== table) : [...prev, table]
    );
  };

  const handleSubmit = () => {
    if (!customerName.trim() || !contact.trim() || !guests || !date || !startTime) {
      setError("Please fill in all required fields.");
      return;
    }
    if (linkedTables.length === 0) {
      setError("Please select at least one table.");
      return;
    }

    const guestCount = Number(guests);
    if (Number.isNaN(guestCount) || guestCount < 1) {
      setError("Please enter a valid guest count.");
      return;
    }

    setError("");
    const reservation = {
      id: generateBookingId(),
      customerName: customerName.trim(),
      contact: contact.trim(),
      guestTag,
      guests: guestCount,
      date,
      startTime,
      linkedTables,
      specialRequest: specialRequest.trim(),
      dateLabel: formatReservationDateLabel(date, startTime),
    };

    confirmReservation(reservation);
    router.push("/reserve/confirmed");
  };

  const tablesLabel =
    linkedTables.length > 0
      ? linkedTables.join(", ")
      : "Click to select tables";

  return (
    <div className="w-full bg-white pb-10">
      <section className="relative h-[230px] w-full overflow-hidden">
        <Image
          src={mainPageData.restaurant.heroImage}
          alt="Restaurant"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />

        <Link
          href="/main"
          className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#334155] shadow-sm"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>

        <div className="absolute bottom-8 left-5 right-5 z-10 text-white">
          <h1 className="text-[26px] font-bold leading-tight">Reserve a Table</h1>
          <p className="mt-1 text-sm text-white/90">
            Great Food awaits, Reserve your spot
          </p>
        </div>
      </section>

      <div className="relative z-10 -mt-6 rounded-t-[28px] bg-white px-4 pb-8 pt-6">
        <div className="grid grid-cols-2 gap-3 overflow-visible">
          <div>
            <FieldLabel>Customer Name</FieldLabel>
            <TextField
              id="customerName"
              value={customerName}
              onChange={setCustomerName}
              placeholder="e.g. Sophie Laurent"
            />
          </div>
          <div>
            <FieldLabel>Contact</FieldLabel>
            <TextField
              id="contact"
              value={contact}
              onChange={setContact}
              placeholder="e.g. +32 2 555 1234"
            />
          </div>
          <div className="relative" ref={guestTagPickerRef}>
            <FieldLabel>Guest Tag</FieldLabel>
            <button
              id="guestTag"
              type="button"
              aria-expanded={guestTagOpen}
              aria-haspopup="listbox"
              onClick={() => {
                setGuestTagOpen((open) => !open);
                setTablesOpen(false);
              }}
              className={pickerTriggerClass(guestTagOpen)}
            >
              <span className="font-medium text-[#111827]">{guestTag}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-[#64748B] transition-transform ${
                  guestTagOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {guestTagOpen ? (
              <div className={pickerPanelClass()} role="listbox">
                {GUEST_TAG_OPTIONS.map((option) => {
                  const selected = guestTag === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => {
                        setGuestTag(option.value);
                        setGuestTagOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm transition-colors ${
                        selected
                          ? "bg-[#EFF6FF] font-semibold text-[#0A46A6]"
                          : "text-[#111827] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      {option.label}
                      {selected ? (
                        <svg
                          className="h-4 w-4 text-[#0A46A6]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
          <div>
            <FieldLabel>Guest</FieldLabel>
            <TextField
              id="guests"
              value={guests}
              onChange={setGuests}
              placeholder="Guests"
              type="number"
            />
          </div>
          <div>
            <FieldLabel>Date</FieldLabel>
            <div className="relative">
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] bg-white py-3 pl-3.5 pr-10 text-sm text-[#111827] focus:border-[#0A46A6] focus:outline-none focus:ring-1 focus:ring-[#0A46A6]/30"
              />
              <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
            </div>
          </div>
          <div>
            <FieldLabel>Start Time</FieldLabel>
            <div className="relative">
              <input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] bg-white py-3 pl-3.5 pr-10 text-sm text-[#111827] focus:border-[#0A46A6] focus:outline-none focus:ring-1 focus:ring-[#0A46A6]/30"
              />
              <Clock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
            </div>
          </div>
        </div>

        <div className="relative mt-4" ref={tablePickerRef}>
          <FieldLabel>Linked Tables</FieldLabel>
          <button
            type="button"
            onClick={() => {
              setTablesOpen((open) => !open);
              setGuestTagOpen(false);
            }}
            className={pickerTriggerClass(tablesOpen)}
          >
            <span
              className={
                linkedTables.length === 0
                  ? "text-[#94A3B8]"
                  : "font-medium text-[#111827]"
              }
            >
              {tablesLabel}
            </span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-[#64748B] transition-transform ${
                tablesOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {tablesOpen && (
            <div className={`${pickerPanelClass()} max-h-44 overflow-y-auto p-2`}>
              {LINKED_TABLE_OPTIONS.map((table) => {
                const selected = linkedTables.includes(table);
                return (
                  <button
                    key={table}
                    type="button"
                    onClick={() => toggleTable(table)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-[#111827] hover:bg-[#F8FAFC]"
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                        selected
                          ? "border-[#041B40] bg-gradient-to-r from-[#041B40] to-[#0A46A6] text-white"
                          : "border-[#CBD5E1] bg-white"
                      }`}
                    >
                      {selected ? (
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : null}
                    </span>
                    {table}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-4">
          <FieldLabel>Special Request</FieldLabel>
          <textarea
            id="specialRequest"
            value={specialRequest}
            onChange={(e) => setSpecialRequest(e.target.value)}
            placeholder="e.g. Family celebration, please keep tables close together"
            rows={4}
            className="w-full resize-none rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-3 text-sm text-[#111827] placeholder:text-[#94A3B8] focus:border-[#0A46A6] focus:outline-none focus:ring-1 focus:ring-[#0A46A6]/30"
          />
        </div>

        {error ? (
          <p className="mt-3 text-center text-xs font-medium text-red-500">{error}</p>
        ) : null}

        <div className="mt-6">
          <PrimaryButton onClick={handleSubmit}>Confirm Reservation</PrimaryButton>
        </div>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-[#94A3B8]">
          <Lock className="h-3 w-3 shrink-0" />
          Your information is secure and will not be shared
        </p>
      </div>
    </div>
  );
}
