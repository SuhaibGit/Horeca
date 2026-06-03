"use client";

import React, { useEffect } from "react";
import { Reservation } from "../../data/mockReservations";
import DetailDrawer from "../DetailDrawer";

interface ReservationDetailDrawerProps {
  booking: Reservation | null;
  isOpen: boolean;
  onClose: () => void;
  showActionsMenu: boolean;
  onToggleActionsMenu: () => void;
  onCloseActionsMenu: () => void;
  onEdit: (booking: Reservation) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: Reservation["status"]) => void;
}

function statusBadgeClass(status: Reservation["status"]): string {
  if (status === "Confirmed") {
    return "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400";
  }
  if (status === "Pending") {
    return "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400";
  }
  if (status === "Cancelled") {
    return "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400";
  }
  return "bg-zinc-100 dark:bg-zinc-850 text-zinc-550 dark:text-zinc-400";
}

function InfoCell({
  icon,
  label,
  value,
  colSpan = 1,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  colSpan?: 1 | 2;
}) {
  return (
    <div className={`flex items-center gap-3 ${colSpan === 2 ? "col-span-2" : "col-span-1"}`}>
      <div className="w-10 h-10 rounded-xl bg-[#EBF7FF] text-[#0A46A6] dark:text-emerald-400 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[12px] font-medium text-[#626D6F] uppercase leading-none mb-1">
          {label}
        </span>
        <span className="text-[14px] font-medium text-[#25292A] truncate leading-none pt-0.5">
          {value}
        </span>
      </div>
    </div>
  );
}

export default function ReservationDetailDrawer({
  booking,
  isOpen,
  onClose,
  showActionsMenu,
  onToggleActionsMenu,
  onCloseActionsMenu,
  onEdit,
  onDelete,
  onUpdateStatus,
}: ReservationDetailDrawerProps) {
  useEffect(() => {
    if (!isOpen) onCloseActionsMenu();
  }, [isOpen, onCloseActionsMenu]);

  if (!booking) return null;

  const formattedDate = new Date(booking.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const footer =
    booking.status === "Pending" || booking.status === "Confirmed" ? (
      <div className="p-5 bg-white dark:bg-zinc-900">
        {booking.status === "Pending" && (
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => onUpdateStatus(booking.id, "Confirmed")}
              className="w-full py-3.5 rounded-full bg-linear-to-r from-[#041B40] to-[#0A46A6] text-white hover:bg-[#28A388] text-[13px] font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-lg shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Mark as Confirm
            </button>
            <button
              type="button"
              onClick={() => onUpdateStatus(booking.id, "Cancelled")}
              className="w-full py-2.5 rounded-full border border-[#0A46A6] dark:border-red-950/40 text-red-650 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-200 text-[12px] font-bold uppercase tracking-wider flex items-center justify-center transition-all cursor-pointer"
            >
              Cancel Reservation
            </button>
          </div>
        )}
        {booking.status === "Confirmed" && (
          <button
            type="button"
            onClick={() => onUpdateStatus(booking.id, "Completed")}
            className="w-full py-3.5 rounded-full bg-linear-to-r from-[#041B40] to-[#0A46A6] text-white hover:bg-[#28A388] text-[13px] font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-lg shadow-md active:scale-95 transition-all cursor-pointer"
          >
            Mark as Complete
          </button>
        )}
      </div>
    ) : undefined;

  return (
    <DetailDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Booking Details"
      titleClassName="text-[17px] font-black text-zinc-900 dark:text-white uppercase tracking-tight"
      maxWidthClass="max-w-[600px]"
      outerClassName="p-3"
      panelClassName="rounded-xl"
      headerClassName="p-5"
      contentClassName="p-0 px-6 space-y-4"
      headerActions={
        <>
          <span
            className={`px-3 py-1 text-[14px] font-medium rounded-full uppercase tracking-wider ${statusBadgeClass(booking.status)}`}
          >
            {booking.status}
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleActionsMenu();
              }}
              className="text-zinc-450 hover:text-zinc-650 dark:hover:text-zinc-200 p-1.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Booking actions"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.2} d="M5 12h.01M12 12h.01M19 12h.01" />
              </svg>
            </button>

            {showActionsMenu && (
              <>
                <div className="fixed inset-0 z-40 bg-transparent" onClick={onCloseActionsMenu} />
                <div className="absolute right-0 mt-1.5 w-38 bg-white dark:bg-zinc-850 border border-zinc-200/60 dark:border-zinc-800 rounded-xl shadow-lg py-1.5 z-50 animate-fade-in text-[12.5px] font-bold text-zinc-700 dark:text-zinc-200">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseActionsMenu();
                      onEdit(booking);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>Edit Details</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseActionsMenu();
                      onDelete(booking.id);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-950/20 text-red-650 dark:text-red-400 flex items-center gap-2 cursor-pointer transition-colors border-t border-zinc-100 dark:border-zinc-800/60 mt-1 pt-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Delete Booking</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      }
      footer={footer}
    >
      <div className="p-5 rounded-[24px]  border border-[#E7E7E7] grid grid-cols-2 gap-x-4 mt-3 gap-y-5">
        <InfoCell
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M6 21V19C6 17.9391 6.42143 16.9217 7.17157 16.1716C7.92172 15.4214 8.93913 15 10 15H14C15.0609 15 16.0783 15.4214 16.8284 16.1716C17.5786 16.9217 18 17.9391 18 19V21M8 7C8 8.06087 8.42143 9.07828 9.17157 9.82843C9.92172 10.5786 10.9391 11 12 11C13.0609 11 14.0783 10.5786 14.8284 9.82843C15.5786 9.07828 16 8.06087 16 7C16 5.93913 15.5786 4.92172 14.8284 4.17157C14.0783 3.42143 13.0609 3 12 3C10.9391 3 9.92172 3.42143 9.17157 4.17157C8.42143 4.92172 8 5.93913 8 7Z" stroke="#0077FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          }
          label="Customer Name"
          value={booking.customerName}
        />
        <InfoCell
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20.8472 14.8556L16.4306 12.8766L16.4184 12.8709C16.1892 12.7729 15.939 12.7335 15.6907 12.7564C15.4424 12.7793 15.2037 12.8638 14.9963 13.0022C14.9718 13.0183 14.9484 13.0358 14.9259 13.0547L12.6441 15C11.1984 14.2978 9.70595 12.8166 9.00376 11.3897L10.9519 9.07312C10.9706 9.04968 10.9884 9.02624 11.0053 9.00093C11.1407 8.79403 11.2229 8.55686 11.2445 8.31053C11.2661 8.0642 11.2264 7.81636 11.1291 7.58906V7.57781L9.14438 3.15374C9.0157 2.8568 8.79444 2.60944 8.51362 2.44859C8.2328 2.28774 7.9075 2.22202 7.58626 2.26124C6.31592 2.42841 5.14986 3.05228 4.30588 4.01633C3.4619 4.98039 2.99771 6.2187 3.00001 7.49999C3.00001 14.9437 9.05626 21 16.5 21C17.7813 21.0023 19.0196 20.5381 19.9837 19.6941C20.9477 18.8501 21.5716 17.6841 21.7388 16.4137C21.7781 16.0926 21.7125 15.7674 21.5518 15.4866C21.3911 15.2058 21.144 14.9845 20.8472 14.8556ZM16.5 19.5C13.3185 19.4965 10.2682 18.2311 8.01856 15.9814C5.76888 13.7318 4.50348 10.6815 4.50001 7.49999C4.49648 6.58451 4.82631 5.69905 5.42789 5.00897C6.02947 4.31888 6.86167 3.87137 7.76907 3.74999C7.7687 3.75373 7.7687 3.7575 7.76907 3.76124L9.73782 8.16749L7.80001 10.4869C7.78034 10.5095 7.76247 10.5336 7.74657 10.5591C7.60549 10.7755 7.52273 11.0248 7.5063 11.2827C7.48988 11.5406 7.54035 11.7983 7.65282 12.0309C8.5022 13.7681 10.2525 15.5053 12.0084 16.3537C12.2428 16.4652 12.502 16.5139 12.7608 16.4952C13.0196 16.4764 13.2692 16.3909 13.485 16.2469C13.5091 16.2307 13.5322 16.2131 13.5544 16.1944L15.8334 14.25L20.2397 16.2234C20.2397 16.2234 20.2472 16.2234 20.25 16.2234C20.1301 17.1321 19.6833 17.966 18.9931 18.5691C18.3028 19.1721 17.4166 19.5031 16.5 19.5Z" fill="#0077FF" />
            </svg>
          }
          label="Contact"
          value={booking.phone}
        />
        <InfoCell
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M8 5.75C7.59 5.75 7.25 5.41 7.25 5V2C7.25 1.59 7.59 1.25 8 1.25C8.41 1.25 8.75 1.59 8.75 2V5C8.75 5.41 8.41 5.75 8 5.75Z" fill="#0077FF" />
              <path d="M16 5.75C15.59 5.75 15.25 5.41 15.25 5V2C15.25 1.59 15.59 1.25 16 1.25C16.41 1.25 16.75 1.59 16.75 2V5C16.75 5.41 16.41 5.75 16 5.75Z" fill="#0077FF" />
              <path d="M8.5 14.5C8.37 14.5 8.24 14.47 8.12 14.42C7.99 14.37 7.89 14.3 7.79 14.21C7.61 14.02 7.5 13.77 7.5 13.5C7.5 13.37 7.53 13.24 7.58 13.12C7.63 13 7.7 12.89 7.79 12.79C7.89 12.7 7.99 12.63 8.12 12.58C8.48 12.43 8.93 12.51 9.21 12.79C9.39 12.98 9.5 13.24 9.5 13.5C9.5 13.56 9.49 13.63 9.48 13.7C9.47 13.76 9.45 13.82 9.42 13.88C9.4 13.94 9.37 14 9.33 14.06C9.3 14.11 9.25 14.16 9.21 14.21C9.02 14.39 8.76 14.5 8.5 14.5Z" fill="#0077FF" />
              <path d="M12 14.5C11.87 14.5 11.74 14.47 11.62 14.42C11.49 14.37 11.39 14.3 11.29 14.21C11.11 14.02 11 13.77 11 13.5C11 13.37 11.03 13.24 11.08 13.12C11.13 13 11.2 12.89 11.29 12.79C11.39 12.7 11.49 12.63 11.62 12.58C11.98 12.42 12.43 12.51 12.71 12.79C12.89 12.98 13 13.24 13 13.5C13 13.56 12.99 13.63 12.98 13.7C12.97 13.76 12.95 13.82 12.92 13.88C12.9 13.94 12.87 14 12.83 14.06C12.8 14.11 12.75 14.16 12.71 14.21C12.52 14.39 12.26 14.5 12 14.5Z" fill="#0077FF" />
              <path d="M15.5 14.5C15.37 14.5 15.24 14.47 15.12 14.42C14.99 14.37 14.89 14.3 14.79 14.21C14.75 14.16 14.71 14.11 14.67 14.06C14.63 14 14.6 13.94 14.58 13.88C14.55 13.82 14.53 13.76 14.52 13.7C14.51 13.63 14.5 13.56 14.5 13.5C14.5 13.24 14.61 12.98 14.79 12.79C14.89 12.7 14.99 12.63 15.12 12.58C15.49 12.42 15.93 12.51 16.21 12.79C16.39 12.98 16.5 13.24 16.5 13.5C16.5 13.56 16.49 13.63 16.48 13.7C16.47 13.76 16.45 13.82 16.42 13.88C16.4 13.94 16.37 14 16.33 14.06C16.3 14.11 16.25 14.16 16.21 14.21C16.02 14.39 15.76 14.5 15.5 14.5Z" fill="#0077FF" />
              <path d="M8.5 18C8.37 18 8.24 17.97 8.12 17.92C8 17.87 7.89 17.8 7.79 17.71C7.61 17.52 7.5 17.26 7.5 17C7.5 16.87 7.53 16.74 7.58 16.62C7.63 16.49 7.7 16.38 7.79 16.29C8.16 15.92 8.84 15.92 9.21 16.29C9.39 16.48 9.5 16.74 9.5 17C9.5 17.26 9.39 17.52 9.21 17.71C9.02 17.89 8.76 18 8.5 18Z" fill="#0077FF" />
              <path d="M12 18C11.74 18 11.48 17.89 11.29 17.71C11.11 17.52 11 17.26 11 17C11 16.87 11.03 16.74 11.08 16.62C11.13 16.49 11.2 16.38 11.29 16.29C11.66 15.92 12.34 15.92 12.71 16.29C12.8 16.38 12.87 16.49 12.92 16.62C12.97 16.74 13 16.87 13 17C13 17.26 12.89 17.52 12.71 17.71C12.52 17.89 12.26 18 12 18Z" fill="#0077FF" />
              <path d="M15.5 18C15.24 18 14.98 17.89 14.79 17.71C14.7 17.62 14.63 17.51 14.58 17.38C14.53 17.26 14.5 17.13 14.5 17C14.5 16.87 14.53 16.74 14.58 16.62C14.63 16.49 14.7 16.38 14.79 16.29C15.02 16.06 15.37 15.95 15.69 16.02C15.76 16.03 15.82 16.05 15.88 16.08C15.94 16.1 16 16.13 16.06 16.17C16.11 16.2 16.16 16.25 16.21 16.29C16.39 16.48 16.5 16.74 16.5 17C16.5 17.26 16.39 17.52 16.21 17.71C16.02 17.89 15.76 18 15.5 18Z" fill="#0077FF" />
              <path d="M20.5 9.83997H3.5C3.09 9.83997 2.75 9.49997 2.75 9.08997C2.75 8.67997 3.09 8.33997 3.5 8.33997H20.5C20.91 8.33997 21.25 8.67997 21.25 9.08997C21.25 9.49997 20.91 9.83997 20.5 9.83997Z" fill="#0077FF" />
              <path d="M16 22.75H8C4.35 22.75 2.25 20.65 2.25 17V8.5C2.25 4.85 4.35 2.75 8 2.75H16C19.65 2.75 21.75 4.85 21.75 8.5V17C21.75 20.65 19.65 22.75 16 22.75ZM8 4.25C5.14 4.25 3.75 5.64 3.75 8.5V17C3.75 19.86 5.14 21.25 8 21.25H16C18.86 21.25 20.25 19.86 20.25 17V8.5C20.25 5.64 18.86 4.25 16 4.25H8Z" fill="#0077FF" />
            </svg>
          }
          label="Date"
          value={formattedDate}
        />
        <InfoCell
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9.16055 11.62C9.13055 11.62 9.11055 11.62 9.08055 11.62C9.03055 11.61 8.96055 11.61 8.90055 11.62C6.00055 11.53 3.81055 9.25 3.81055 6.44C3.81055 3.58 6.14055 1.25 9.00055 1.25C11.8605 1.25 14.1905 3.58 14.1905 6.44C14.1805 9.25 11.9805 11.53 9.19055 11.62C9.18055 11.62 9.17055 11.62 9.16055 11.62ZM9.00055 2.75C6.97055 2.75 5.31055 4.41 5.31055 6.44C5.31055 8.44 6.87055 10.05 8.86055 10.12C8.92055 10.11 9.05055 10.11 9.18055 10.12C11.1405 10.03 12.6805 8.42 12.6905 6.44C12.6905 4.41 11.0305 2.75 9.00055 2.75Z" fill="#0077FF" />
              <path d="M16.5404 11.75C16.5104 11.75 16.4804 11.75 16.4504 11.74C16.0404 11.78 15.6204 11.49 15.5804 11.08C15.5404 10.67 15.7904 10.3 16.2004 10.25C16.3204 10.24 16.4504 10.24 16.5604 10.24C18.0204 10.16 19.1604 8.96 19.1604 7.49C19.1604 5.97 17.9304 4.74 16.4104 4.74C16.0004 4.75 15.6604 4.41 15.6604 4C15.6604 3.59 16.0004 3.25 16.4104 3.25C18.7504 3.25 20.6604 5.16 20.6604 7.5C20.6604 9.8 18.8604 11.66 16.5704 11.75C16.5604 11.75 16.5504 11.75 16.5404 11.75Z" fill="#0077FF" />
              <path d="M9.16961 22.55C7.20961 22.55 5.23961 22.05 3.74961 21.05C2.35961 20.13 1.59961 18.87 1.59961 17.5C1.59961 16.13 2.35961 14.86 3.74961 13.93C6.74961 11.94 11.6096 11.94 14.5896 13.93C15.9696 14.85 16.7396 16.11 16.7396 17.48C16.7396 18.85 15.9796 20.12 14.5896 21.05C13.0896 22.05 11.1296 22.55 9.16961 22.55ZM4.57961 15.19C3.61961 15.83 3.09961 16.65 3.09961 17.51C3.09961 18.36 3.62961 19.18 4.57961 19.81C7.06961 21.48 11.2696 21.48 13.7596 19.81C14.7196 19.17 15.2396 18.35 15.2396 17.49C15.2396 16.64 14.7096 15.82 13.7596 15.19C11.2696 13.53 7.06961 13.53 4.57961 15.19Z" fill="#0077FF" />
              <path d="M18.3402 20.75C17.9902 20.75 17.6802 20.51 17.6102 20.15C17.5302 19.74 17.7902 19.35 18.1902 19.26C18.8202 19.13 19.4002 18.88 19.8502 18.53C20.4202 18.1 20.7302 17.56 20.7302 16.99C20.7302 16.42 20.4202 15.88 19.8602 15.46C19.4202 15.12 18.8702 14.88 18.2202 14.73C17.8202 14.64 17.5602 14.24 17.6502 13.83C17.7402 13.43 18.1402 13.17 18.5502 13.26C19.4102 13.45 20.1602 13.79 20.7702 14.26C21.7002 14.96 22.2302 15.95 22.2302 16.99C22.2302 18.03 21.6902 19.02 20.7602 19.73C20.1402 20.21 19.3602 20.56 18.5002 20.73C18.4402 20.75 18.3902 20.75 18.3402 20.75Z" fill="#0077FF" />
            </svg>
          }
          label="Guests"
          value={`${booking.guests} People`}
        />
        <InfoCell
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z" fill="#0077FF" />
              <path d="M15.7096 15.93C15.5796 15.93 15.4496 15.9 15.3296 15.82L12.2296 13.97C11.4596 13.51 10.8896 12.5 10.8896 11.61V7.51001C10.8896 7.10001 11.2296 6.76001 11.6396 6.76001C12.0496 6.76001 12.3896 7.10001 12.3896 7.51001V11.61C12.3896 11.97 12.6896 12.5 12.9996 12.68L16.0996 14.53C16.4596 14.74 16.5696 15.2 16.3596 15.56C16.2096 15.8 15.9596 15.93 15.7096 15.93Z" fill="#0077FF" />
            </svg>
          }
          label="Start Time"
          value={booking.time.split("-")[0] || "15:00"}
        />
        <InfoCell
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z" fill="#0077FF" />
              <path d="M15.7106 15.93C15.5806 15.93 15.4506 15.9 15.3306 15.82L12.2306 13.97C11.4606 13.51 10.8906 12.5 10.8906 11.61V7.51001C10.8906 7.10001 11.2306 6.76001 11.6406 6.76001C12.0506 6.76001 12.3906 7.10001 12.3906 7.51001V11.61C12.3906 11.97 12.6906 12.5 13.0006 12.68L16.1006 14.53C16.4606 14.74 16.5706 15.2 16.3606 15.56C16.2106 15.8 15.9606 15.93 15.7106 15.93Z" fill="#0077FF" />
            </svg>
          }
          label="End Time"
          value={booking.time.split("-")[1] || "16:00"}
        />
        <div className="flex items-center gap-3 col-span-2 border-t border-zinc-100 dark:border-zinc-800/60 pt-4 mt-1">
          <div className="w-10 h-10 rounded-xl bg-[#EBF7FF] text-[#0A46A6] dark:text-emerald-400 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5.6709 11.0061H11.2964V18.038H9.89005V19.4444H14.1092V18.038H12.7028V11.0061H18.3284V6.78693H5.6709V11.0061ZM7.07728 8.19331H16.922V9.5997H7.07728V8.19331Z" fill="#0077FF" />
              <path d="M2.44856 12.678C2.02913 8.26786 1.39485 4.61014 1.38534 4.55566L0 4.79822C0.0140638 4.87848 1.40526 12.9004 1.40526 19.444H2.81164C2.81164 18.5261 2.78483 17.5802 2.73861 16.6312H7.07768V19.444H8.48406C8.48406 18.4405 8.48406 15.5243 8.48406 14.5216C8.48406 12.5488 6.94069 12.4042 5.33456 12.4167C5.09505 12.4186 4.84228 12.4186 4.60146 12.4167C3.80736 12.4106 3.04693 12.3985 2.44856 12.678ZM4.59058 13.8165C4.83838 13.8184 5.0988 13.8184 5.34553 13.8165C6.89349 13.8043 7.07763 13.8649 7.07763 14.5217V15.2249H2.8116V14.5217C2.81164 13.8831 2.98913 13.804 4.59058 13.8165Z" fill="#0077FF" />
              <path d="M22.5945 19.444C22.5945 12.9037 23.9857 4.87848 23.9997 4.79817L22.6144 4.55566C22.6048 4.61014 21.9705 8.26786 21.5511 12.678C20.9527 12.3984 20.1921 12.4106 19.3982 12.4167C19.1574 12.4186 18.9047 12.4186 18.6651 12.4167C17.483 12.4074 15.5156 12.323 15.5156 14.5216V19.444H16.922V16.6312H21.2611C21.2149 17.5802 21.188 18.5261 21.188 19.444H22.5945ZM21.1881 15.2248H16.9221V14.5216C16.9221 13.8826 17.0659 13.8041 18.6542 13.8165C18.9009 13.8184 19.1613 13.8184 19.4091 13.8165C21.003 13.804 21.188 13.8803 21.188 14.5216V15.2248H21.1881Z" fill="#0077FF" />
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] font-medium text-[#626D6F] uppercase leading-none mb-1">
              Linked Tables
            </span>
            <span className="text-[14px] font-medium text-[#25292A] leading-none pt-0.5">
              {booking.tableNo} (Capacity: {booking.tableCapacity || "2-4"})
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        <h4 className="text-[14.5px] font-black text-zinc-900 dark:text-white tracking-tight uppercase leading-none">
          Special Request
        </h4>
        <div className="p-4 rounded-[20px]  border border-[#E7E7E7] text-[14px]  text-[#51595A]  leading-relaxed">
          {booking.notes ||
            "We have a vegetarian guest in our party, so could you please ensure that the table is close to the vegetarian options on the menu? Additionally, my husband is gluten-free, so we would appreciate it if you could accommodate him with gluten-free meal options. Also, we are celebrating our anniversary, and we would love it if you could surprise us with a small dessert to celebrate."}
        </div>
      </div>
    </DetailDrawer>
  );
}
