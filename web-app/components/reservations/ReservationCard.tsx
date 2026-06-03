"use client";

import React from "react";
import { Reservation } from "../../data/mockReservations";

interface ReservationCardProps {
  reservation: Reservation;
  onEditStatus?: (id: string, newStatus: Reservation["status"]) => void;
}

export default function ReservationCard({ reservation, onEditStatus }: ReservationCardProps) {
  // Border and accent color selection based on reservation status
  const getStatusConfig = (status: Reservation["status"]) => {
    switch (status) {
      case "Confirmed":
        return {
          borderClass: "border-l-[5px] border-emerald-500 dark:border-emerald-400",
          bgClass: "bg-emerald-50/40 dark:bg-emerald-950/10",
          textClass: "text-emerald-700 dark:text-emerald-400",
          badgeClass: "bg-[#EBF7FF] text-emerald-600 dark:text-emerald-400",
          label: "Confirmed",
        };
      case "Pending":
        return {
          borderClass: "border-l-[5px] border-amber-500 dark:border-amber-400",
          bgClass: "bg-amber-50/40 dark:bg-amber-950/10",
          textClass: "text-amber-700 dark:text-amber-400",
          badgeClass: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
          label: "Pending",
        };
      case "Cancelled":
        return {
          borderClass: "border-l-[5px] border-red-500 dark:border-red-400",
          bgClass: "bg-red-50/40 dark:bg-red-950/10",
          textClass: "text-red-700 dark:text-red-400",
          badgeClass: "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400",
          label: "Cancelled",
        };
      default:
        return {
          borderClass: "border-l-[5px] border-zinc-300 dark:border-zinc-700",
          bgClass: "bg-zinc-50 dark:bg-zinc-800",
          textClass: "text-zinc-700 dark:text-zinc-300",
          badgeClass: "bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-400",
          label: status,
        };
    }
  };

  const config = getStatusConfig(reservation.status);

  return (
    <div className={`bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md rounded-[20px] p-5 transition-all duration-300 select-none flex flex-col justify-between ${config.borderClass}`}>

      {/* Card Top Row */}
      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <h4 className="text-[15px] font-black text-zinc-900 dark:text-white tracking-tight uppercase">
            {reservation.customerName}
          </h4>
          <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${config.badgeClass} uppercase tracking-wider`}>
            {config.label}
          </span>
        </div>

        <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">
          ID: {reservation.id}
        </span>
      </div>

      {/* Grid of Reservation Metadata */}
      <div className="grid grid-cols-2 gap-y-3 gap-x-2 my-4 text-[12.5px] font-bold text-zinc-650 dark:text-zinc-350">

        {/* Time slot */}
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-zinc-400 dark:text-zinc-555" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{reservation.time}</span>
        </div>

        {/* Table number */}
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-zinc-400 dark:text-zinc-555" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          <span className="text-zinc-850 dark:text-zinc-150">{reservation.tableNo}</span>
        </div>

        {/* Guest count */}
        <div className="flex items-center gap-2 col-span-2">
          <svg className="w-4 h-4 text-zinc-400 dark:text-zinc-555" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{reservation.guests} {reservation.guests === 1 ? "Guest" : "Guests"}</span>
        </div>

      </div>

      {/* Divider */}
      <div className="border-t border-zinc-100 dark:border-zinc-800/60 my-3" />

      {/* Customer Contact Details */}
      <div className="space-y-1.5 text-[11.5px] font-semibold text-zinc-400 dark:text-zinc-500">
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>{reservation.phone}</span>
        </div>
        <div className="flex items-center gap-2 truncate">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="truncate">{reservation.email}</span>
        </div>
      </div>

      {/* Special notes Quote Panel (optional) */}
      {reservation.notes && (
        <div className="mt-3.5 p-3 rounded-xl bg-zinc-50/50 dark:bg-zinc-800/20 text-[11.5px] font-medium text-zinc-500 dark:text-zinc-450 italic border-l-2 border-zinc-250 dark:border-zinc-800">
          "{reservation.notes}"
        </div>
      )}

      {/* Dynamic Status Action Toggles */}
      {onEditStatus && (
        <div className="mt-4 flex items-center justify-end gap-1.5">
          {reservation.status !== "Confirmed" && (
            <button
              onClick={() => onEditStatus(reservation.id, "Confirmed")}
              className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 transition-colors cursor-pointer uppercase tracking-wider"
              title="Confirm Reservation"
            >
              Confirm
            </button>
          )}
          {reservation.status !== "Pending" && (
            <button
              onClick={() => onEditStatus(reservation.id, "Pending")}
              className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 transition-colors cursor-pointer uppercase tracking-wider"
              title="Set to Pending"
            >
              Pending
            </button>
          )}
          {reservation.status !== "Cancelled" && (
            <button
              onClick={() => onEditStatus(reservation.id, "Cancelled")}
              className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-600 dark:text-red-400 transition-colors cursor-pointer uppercase tracking-wider"
              title="Cancel Reservation"
            >
              Cancel
            </button>
          )}
        </div>
      )}

    </div>
  );
}
