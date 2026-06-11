"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Check, ChevronLeft, Mail } from "lucide-react";
import { useReserve } from "@/contexts/ReserveContext";
import { mainPageData } from "@/components/main/data";
import PrimaryButton from "@/components/guest/PrimaryButton";
import { isVipTag } from "@/lib/reservationFormat";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[#F1F5F9] py-3 text-sm last:border-b-0">
      <span className="text-[#64748B]">{label}</span>
      <span className="font-medium text-[#111827]">{value}</span>
    </div>
  );
}

function downloadCalendarEvent({
  title,
  date,
  startTime,
  description,
}: {
  title: string;
  date: string;
  startTime: string;
  description: string;
}) {
  const [year, month, day] = date.split("-");
  const [hour, minute] = startTime.split(":");
  const start = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute)
  );
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const formatIcs = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `DTSTART:${formatIcs(start)}`,
    `DTEND:${formatIcs(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "reservation.ics";
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function TableConfirmedView() {
  const { lastReservation } = useReserve();

  if (!lastReservation) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm text-[#64748B]">No reservation found.</p>
        <PrimaryButton href="/reserve">Reserve a Table</PrimaryButton>
      </div>
    );
  }

  const showVip = isVipTag(lastReservation.guestTag);
  const tableList = lastReservation.linkedTables
    .map((t) => t.replace("Table ", ""))
    .join(", ");

  return (
    <div className="w-full bg-white px-4 pb-10 pt-4">
      <header className="mb-2 flex items-center">
        <Link
          href="/main"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1F5F9] text-[#334155]"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
      </header>

      <div className="text-center">
        <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center">
          <Image
            src="/TbConfirm.png"
            alt="Table confirmed"
            width={112}
            height={112}
            className="h-28 w-28 object-contain"
            priority
          />
        </div>
        <h1 className="text-2xl font-bold text-[#111827]">Table Confirmed</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Excellent choice of {mainPageData.restaurant.name}
        </p>
      </div>

      <section className="mt-8 rounded-2xl border border-[#E2E8F0] p-4">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-semibold text-[#111827]">Reservation Details</h2>
          {showVip ? (
            <span className="rounded-full bg-gradient-to-r from-[#041B40] to-[#0A46A6] px-3 py-1 text-xs font-semibold uppercase text-white">
              VIP
            </span>
          ) : null}
        </div>
        <InfoRow label="Booking ID" value={lastReservation.id} />
        <InfoRow label="Date" value={lastReservation.dateLabel} />
        <InfoRow label="Guest" value={String(lastReservation.guests)} />
        <InfoRow label="Table" value={tableList} />
      </section>

      {lastReservation.specialRequest ? (
        <section className="mt-4 rounded-2xl border border-[#E2E8F0] p-4">
          <h2 className="mb-2 font-semibold text-[#111827]">Special Request</h2>
          <p className="text-sm leading-relaxed text-[#64748B]">
            {lastReservation.specialRequest}
          </p>
        </section>
      ) : null}

      <section className="mt-4 rounded-2xl bg-[#F4F7FB] p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#0A46A6]">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-[#111827]">Reservation Details Sent</h3>
            <p className="mt-1 text-sm text-[#64748B]">
              We&apos;ve sent your reservation confirmation and booking details to
              your registered email address
            </p>
            <ul className="mt-3 space-y-2 text-sm text-[#334155]">
              {[
                "Reservation confirmation",
                "Booking details updated",
                "Reminder notification before your reservation",
                "Any updates regarding your booking",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0A46A6] text-white">
                    <Check className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="mt-8 space-y-3">
        <PrimaryButton
          onClick={() =>
            downloadCalendarEvent({
              title: `Table Reservation — ${mainPageData.restaurant.name}`,
              date: lastReservation.date,
              startTime: lastReservation.startTime,
              description: `Booking ${lastReservation.id}\nTables: ${lastReservation.linkedTables.join(", ")}\nGuests: ${lastReservation.guests}`,
            })
          }
          className="gap-2"
        >
          <Calendar className="h-4 w-4" />
          Add to Calendar
        </PrimaryButton>
        <Link
          href="/main"
          className="flex w-full items-center justify-center py-2 text-sm font-semibold text-[#0A46A6]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
