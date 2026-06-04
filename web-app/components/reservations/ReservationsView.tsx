"use client";

import React, { useState, useMemo } from "react";
import { mockReservations, Reservation } from "../../data/mockReservations";
import ReservationDetailDrawer from "./ReservationDetailDrawer";
import Table, { TableColumn } from "../Table";
import Dropdown from "../Dropdown";
import { ChevronDown } from "lucide-react";

const TABLE_OPTIONS = [
  { id: "Table 1", name: "Table 1", capacity: "2-4" },
  { id: "Table 2", name: "Table 2", capacity: "2-4" },
  { id: "Table 3", name: "Table 3", capacity: "2-4" },
  { id: "Table 4", name: "Table 4", capacity: "2-4" },
  { id: "Table 5", name: "Table 5", capacity: "2-4" },
  { id: "Table 6", name: "Table 6", capacity: "2-4" },
  { id: "Table 7", name: "Table 7", capacity: "2-4" },
  { id: "Table 8", name: "Table 8", capacity: "2-4" },
];

const GUEST_TAG_OPTIONS = [
  { value: "All", label: "Guest Tag" },
  { value: "VIP", label: "VIP" },
  { value: "Regular", label: "Regular" },
];

const STATUS_FILTER_OPTIONS = [
  { value: "All", label: "Status" },
  { value: "Confirmed", label: "Confirmed" },
  { value: "Pending", label: "Pending" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "Completed", label: "Completed" },
];

function formatReservationDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  if (!y || !m || !d) return dateStr;
  return `${d}/${m}/${y}`;
}

function formatStartTime(timeRange: string): string {
  const start = timeRange.split("-")[0]?.trim() ?? timeRange;
  const [hourStr, minuteStr] = start.split(":");
  const hour = Number(hourStr);
  const minute = Number(minuteStr) || 0;
  if (Number.isNaN(hour)) return timeRange;
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}

function guestTagBadge(tag: Reservation["guestTag"]) {
  return (
    <span className="inline-flex px-3 py-1 rounded-full text-[14px] font-medium bg-linear-to-r from-[#041B40] to-[#0A46A6] text-white capitalize">
      {tag === "VIP" ? "Vip" : tag}
    </span>
  );
}

function statusBadge(status: Reservation["status"]) {
  switch (status) {
    case "Confirmed":
      return (
        <span className="inline-flex px-3 py-0.5 rounded-full text-[14px] font-medium bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400">
          Confirmed
        </span>
      );
    case "Pending":
      return (
        <span className="inline-flex px-3 py-0.5 rounded-full text-[14px] font-medium bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400">
          Pending
        </span>
      );
    case "Cancelled":
      return (
        <span className="inline-flex px-3 py-0.5 rounded-full text-[14px] font-medium bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400">
          Cancelled
        </span>
      );
    case "Completed":
      return (
        <span className="inline-flex px-3 py-0.5 rounded-full text-[14px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
          Completed
        </span>
      );
    default:
      return (
        <span className="inline-flex px-3 py-0.5 rounded-full text-[14px] font-medium bg-zinc-100 text-zinc-600">
          {status}
        </span>
      );
  }
}

export default function ReservationsView() {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [dateFilter, setDateFilter] = useState("All");
  const [guestTagFilter, setGuestTagFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedBooking, setSelectedBooking] = useState<Reservation | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [deleteConfirmBookingId, setDeleteConfirmBookingId] = useState<string | null>(null);
  const [cancelConfirmBookingId, setCancelConfirmBookingId] = useState<string | null>(null);

  const [newCustName, setNewCustName] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");
  const [newCustEmail, setNewCustEmail] = useState("");
  const [newCustTable, setNewCustTable] = useState("Table 1");
  const [newCustGuests, setNewCustGuests] = useState(2);
  const [newCustTime, setNewCustTime] = useState("15:00-16:00");
  const [newCustDate, setNewCustDate] = useState("2026-04-01");
  const [newCustGuestTag, setNewCustGuestTag] = useState<Reservation["guestTag"]>("Regular");
  const [newCustStatus, setNewCustStatus] = useState<Reservation["status"]>("Confirmed");
  const [newCustNotes, setNewCustNotes] = useState("");

  const dateFilterOptions = useMemo(() => {
    const dates = [...new Set(reservations.map((r) => r.date))].sort();
    return [
      { value: "All", label: "Date" },
      ...dates.map((d) => ({ value: d, label: formatReservationDate(d) })),
    ];
  }, [reservations]);

  const filteredBookings = useMemo(() => {
    return reservations.filter((res) => {
      const matchesDate = dateFilter === "All" || res.date === dateFilter;
      const matchesGuestTag = guestTagFilter === "All" || res.guestTag === guestTagFilter;
      const matchesStatus = statusFilter === "All" || res.status === statusFilter;
      return matchesDate && matchesGuestTag && matchesStatus;
    });
  }, [reservations, dateFilter, guestTagFilter, statusFilter]);

  const handleUpdateStatus = (id: string, newStatus: Reservation["status"]) => {
    setReservations((prev) =>
      prev.map((res) => (res.id === id ? { ...res, status: newStatus } : res))
    );
    if (selectedBooking?.id === id) {
      setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const getBookingGridCoordinates = (timeStr: string) => {
    try {
      const clean = timeStr.replace(/\s+/g, "");
      const parts = clean.split("-");
      if (parts.length < 2) return { colStart: 2, colSpan: 2 };

      const getDecimalHour = (hStr: string) => {
        const split = hStr.split(":");
        if (split.length < 2) return 15;
        return Number(split[0]) + Number(split[1]) / 60;
      };

      const startHour = getDecimalHour(parts[0]);
      const endHour = getDecimalHour(parts[1]);
      const colStart = Math.max(2, Math.min(15, Math.floor((startHour - 15) * 2) + 2));
      const colSpan = Math.max(1, Math.min(14, Math.ceil((endHour - startHour) * 2)));
      return { colStart, colSpan };
    } catch {
      return { colStart: 2, colSpan: 2 };
    }
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) return;

    const { colStart, colSpan } = getBookingGridCoordinates(newCustTime);

    if (editingBookingId) {
      setReservations((prev) =>
        prev.map((res) =>
          res.id === editingBookingId
            ? {
              ...res,
              customerName: newCustName,
              phone: newCustPhone || "+971 50 000 0000",
              email: newCustEmail || "guest@horeca.com",
              date: newCustDate,
              time: newCustTime,
              guests: Number(newCustGuests),
              tableNo: newCustTable,
              guestTag: newCustGuestTag,
              status: newCustStatus,
              notes: newCustNotes,
              gridColStart: colStart,
              gridColSpan: colSpan,
            }
            : res
        )
      );
      setEditingBookingId(null);
    } else {
      const newBooking: Reservation = {
        id: `#RES-${Math.floor(100 + Math.random() * 900)}`,
        customerName: newCustName,
        phone: newCustPhone || "+971 50 000 0000",
        email: newCustEmail || "guest@horeca.com",
        date: newCustDate,
        time: newCustTime,
        guests: Number(newCustGuests),
        tableNo: newCustTable,
        tableCapacity: "2-4",
        guestTag: newCustGuestTag,
        status: newCustStatus,
        notes: newCustNotes,
        gridColStart: colStart,
        gridColSpan: colSpan,
      };
      setReservations((prev) => [...prev, newBooking]);
    }

    setNewCustName("");
    setNewCustPhone("");
    setNewCustEmail("");
    setNewCustTable("Table 1");
    setNewCustGuests(2);
    setNewCustTime("15:00-16:00");
    setNewCustDate("2026-04-01");
    setNewCustGuestTag("Regular");
    setNewCustStatus("Confirmed");
    setNewCustNotes("");
    setIsAddModalOpen(false);
  };

  const handleDeleteBooking = (id: string) => {
    setDeleteConfirmBookingId(id);
  };

  const handleCancelReservation = (id: string) => {
    setCancelConfirmBookingId(id);
  };

  const handleEditBooking = (booking: Reservation) => {
    setNewCustName(booking.customerName);
    setNewCustPhone(booking.phone);
    setNewCustEmail(booking.email);
    setNewCustTable(booking.tableNo);
    setNewCustGuests(booking.guests);
    setNewCustTime(booking.time);
    setNewCustDate(booking.date);
    setNewCustGuestTag(booking.guestTag);
    setNewCustStatus(booking.status);
    setNewCustNotes(booking.notes || "");
    setEditingBookingId(booking.id);
    setIsAddModalOpen(true);
    setSelectedBooking(null);
    setShowActionsMenu(false);
  };

  const resetAddForm = () => {
    setEditingBookingId(null);
    setNewCustName("");
    setNewCustPhone("");
    setNewCustEmail("");
    setNewCustTable("Table 1");
    setNewCustGuests(2);
    setNewCustTime("15:00-16:00");
    setNewCustDate("2026-04-01");
    setNewCustGuestTag("Regular");
    setNewCustStatus("Confirmed");
    setNewCustNotes("");
  };

  const tableColumns: TableColumn<Reservation>[] = [
    {
      key: "tableNo",
      header: "Table",
      render: (res) => (
        <span className="font-semibold text-zinc-800 dark:text-zinc-100">{res.tableNo}</span>
      ),
    },
    {
      key: "customerName",
      header: "Customer",
      render: (res) => (
        <span className="font-medium text-zinc-800 dark:text-zinc-200">{res.customerName}</span>
      ),
    },
    {
      key: "guests",
      header: "Guest",
      align: "center",
      render: (res) => (
        <span className="font-semibold text-zinc-700 dark:text-zinc-300">{res.guests}</span>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (res) => (
        <span className="text-zinc-600 dark:text-zinc-400">{formatReservationDate(res.date)}</span>
      ),
    },
    {
      key: "time",
      header: "Start Time",
      render: (res) => (
        <span className="text-zinc-600 dark:text-zinc-400">{formatStartTime(res.time)}</span>
      ),
    },
    {
      key: "guestTag",
      header: "Guest Tag",
      render: (res) => guestTagBadge(res.guestTag),
    },
    {
      key: "status",
      header: "Status",
      render: (res) => statusBadge(res.status),
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: (res) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedBooking(res);
          }}
          className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-[#0A46A6] hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label={`View ${res.customerName}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 select-none animate-fade-in pb-10">
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[24px] font-semibold text-[#333839] dark:text-white tracking-[-0.15px]">
            Reservations
          </h1>
          <p className="text-[14px] text-[#717680] dark:text-zinc-400">
            Click on any booking to view details and manage reservations
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetAddForm();
            setIsAddModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-full bg-linear-to-r from-[#041B40] to-[#0A46A6] hover:opacity-95 text-white text-[14px] font-semibold flex items-center justify-center gap-2 shadow-sm transition-opacity cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Manual Booking
        </button>
      </section>

      <Table
        columns={tableColumns}
        data={filteredBookings}
        initialRowsPerPage={10}
        onRowClick={(res) => setSelectedBooking(res)}
        headerRight={
          <>
            <Dropdown options={dateFilterOptions} value={dateFilter} onChange={setDateFilter} />
            <Dropdown
              options={GUEST_TAG_OPTIONS}
              value={guestTagFilter}
              onChange={setGuestTagFilter}
            />
            <Dropdown
              options={STATUS_FILTER_OPTIONS}
              value={statusFilter}
              onChange={setStatusFilter}
            />
          </>
        }
      />

      <ReservationDetailDrawer
        booking={selectedBooking}
        isOpen={!!selectedBooking}
        onClose={() => {
          setSelectedBooking(null);
          setShowActionsMenu(false);
        }}
        showActionsMenu={showActionsMenu}
        onToggleActionsMenu={() => setShowActionsMenu((open) => !open)}
        onCloseActionsMenu={() => setShowActionsMenu(false)}
        onEdit={handleEditBooking}
        onDelete={handleDeleteBooking}
        onUpdateStatus={handleUpdateStatus}
        onCancelReservation={handleCancelReservation}
      />

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsAddModalOpen(false)}
            className="fixed inset-0 bg-[#092219]/40 backdrop-blur-xs transition-opacity animate-fade-in cursor-pointer"
            aria-hidden
          />

          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[24px] shadow-2xl p-6 z-10 animate-fade-in border border-zinc-150/40 dark:border-zinc-800">
            <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800/60 pb-3 mb-4">
              <h3 className="text-[16px] font-bold text-zinc-900 dark:text-white tracking-tight">
                {editingBookingId ? "Edit Booking Details" : "Add Manual Booking"}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-250 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="text-[14px] font-medium text-[#454545] dark:text-zinc-500  tracking-wider block mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    placeholder="e.g. Maria Barbara"
                    className="w-full px-3 py-2 text-[12.5px] font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A46A6]"
                  />
                </div>
                <div>
                  <label className="text-[14px] font-medium text-[#454545] dark:text-zinc-500  tracking-wider block mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    placeholder="+971 50 111 2222"
                    className="w-full px-3 py-2 text-[12.5px] font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A46A6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">

                {/* <div>
                  <label className="text-[14px] font-medium text-[#454545] dark:text-zinc-500  tracking-wider block mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newCustEmail}
                    onChange={(e) => setNewCustEmail(e.target.value)}
                    placeholder="maria@gmail.com"
                    className="w-full px-3 py-2 text-[12.5px] font-semibold text-zinc-850 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A46A6]"
                  />
                </div> */}
              </div>

              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="text-[14px] font-medium text-[#454545] dark:text-zinc-500  tracking-wider block mb-1">
                    Guests Count
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newCustGuests}
                    onChange={(e) => setNewCustGuests(Number(e.target.value))}
                    className="w-full px-3 py-2 text-[12.5px] font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A46A6]"
                  />
                </div>
                <div className="relative">
                  <label className="text-[14px] font-medium text-[#454545] dark:text-zinc-500  tracking-wider block mb-1">
                    Guest Tag
                  </label>
                  <select
                    value={newCustGuestTag}
                    onChange={(e) =>
                      setNewCustGuestTag(e.target.value as Reservation["guestTag"])
                    }
                    className="w-full appearance-none px-3 py-2 text-[12.5px] font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer"
                  >
                    <option value="VIP">VIP</option>
                    <option value="Regular">Regular</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-7 translate-y-1/2 h-4 w-4 text-[#454545] pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[14px] font-medium text-[#454545] dark:text-zinc-500  tracking-wider block mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newCustDate}
                    onChange={(e) => setNewCustDate(e.target.value)}
                    className="w-full px-3 py-2 text-[12.5px] font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A46A6]"
                  />
                </div>
                <div className="relative">
                  <label className="text-[14px] font-medium text-[#454545] dark:text-zinc-500  tracking-wider block mb-1">
                    Time Slot
                  </label>
                  <select
                    value={newCustTime}
                    onChange={(e) => setNewCustTime(e.target.value)}
                    className="w-full appearance-none px-3 py-2 text-[12.5px] font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer"
                  >
                    <option value="15:00-16:00">15:00 - 16:00</option>
                    <option value="15:30-17:00">15:30 - 17:00 (1.5h)</option>
                    <option value="16:00-17:00">16:00 - 17:00</option>
                    <option value="17:00-18:00">17:00 - 18:00</option>
                    <option value="18:00-19:00">18:00 - 19:00</option>
                    <option value="19:00-20:00">19:00 - 20:00</option>
                    <option value="20:00-21:00">20:00 - 21:00</option>
                    <option value="21:00-22:00">21:00 - 22:00</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-7 translate-y-1/2 h-4 w-4 text-[#454545] pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">

                {/* <div className="relative">
                  <label className="text-[14px] font-medium text-[#454545] dark:text-zinc-500  tracking-wider block mb-1">
                    Initial Status
                  </label>
                  <select
                    value={newCustStatus}
                    onChange={(e) =>
                      setNewCustStatus(e.target.value as Reservation["status"])
                    }
                    className="w-full appearance-none px-3 py-2 text-[12.5px] font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-7 translate-y-1/2 h-4 w-4 text-[#454545] pointer-events-none" />
                </div> */}
              </div>
              <div className="relative">
                <label className="text-[14px] font-medium text-[#454545] dark:text-zinc-500  tracking-wider block mb-1">
                  Assign Table
                </label>
                <select
                  value={newCustTable}
                  onChange={(e) => setNewCustTable(e.target.value)}
                  className="w-full appearance-none px-3 py-2 text-[12.5px] font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer"
                >
                  {TABLE_OPTIONS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.capacity})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-7 translate-y-1/2 h-4 w-4 text-[#454545] pointer-events-none" />
              </div>
              <div>
                <label className="text-[14px] font-medium text-[#454545] dark:text-zinc-500  tracking-wider block mb-1">
                  Special Requests / Notes
                </label>
                <textarea
                  value={newCustNotes}
                  onChange={(e) => setNewCustNotes(e.target.value)}
                  placeholder="e.g. Vegetarian diet, window table preferred..."
                  rows={2}
                  className="w-full px-3 py-2 text-[12.5px] font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A46A6] resize-none"
                />
              </div>

              {editingBookingId ? (
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="py-2.5 px-4 mt-2 rounded-xl bg-white text-black border border-[#E5E7EB] hover:bg-zinc-50 text-[12.5px] font-bold cursor-pointer transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-4 mt-2 rounded-xl bg-linear-to-r from-[#041B40] to-[#0A46A6] text-white text-[12.5px] font-bold cursor-pointer transition-all"
                  >
                    Update
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-2.5 mt-2 rounded-xl bg-linear-to-r from-[#041B40] to-[#0A46A6] text-white text-[12.5px] font-bold cursor-pointer transition-all"
                >
                  Register Booking
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {deleteConfirmBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center select-none p-4">
          <div
            onClick={() => setDeleteConfirmBookingId(null)}
            className="fixed inset-0 bg-[#092219]/40 backdrop-blur-xs transition-opacity animate-fade-in cursor-pointer"
            aria-hidden
          />

          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[24px] shadow-2xl p-6 z-10 animate-fade-in border border-zinc-150/45 dark:border-zinc-800 flex flex-col gap-5">
            <div className="flex gap-4 items-start justify-between">
              <div className="flex gap-3.5 items-start">
                <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/20 text-[#E25C5C] flex items-center justify-center shrink-0 relative">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[16px] font-bold text-zinc-900 dark:text-white leading-tight">
                    Delete Booking?
                  </h4>
                  <p className="text-[12px] font-medium text-zinc-500 dark:text-zinc-400 leading-normal max-w-[280px]">
                    Are you sure you want to delete this booking? This action cannot be undone.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeleteConfirmBookingId(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-250 cursor-pointer transition-colors"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmBookingId(null)}
                className="px-6 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-[12.5px] font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setReservations((prev) =>
                    prev.filter((res) => res.id !== deleteConfirmBookingId)
                  );
                  setSelectedBooking(null);
                  setDeleteConfirmBookingId(null);
                }}
                className="px-6 py-2 rounded-full bg-[#E25C5C] hover:bg-[#D14B4B] text-white text-[12.5px] font-semibold shadow-md transition-all cursor-pointer"
              >
                Delete Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {cancelConfirmBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center select-none p-4">
          <div
            onClick={() => setCancelConfirmBookingId(null)}
            className="fixed inset-0 bg-[#092219]/40 backdrop-blur-xs transition-opacity animate-fade-in cursor-pointer"
            aria-hidden
          />

          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[24px] shadow-2xl p-6 z-10 animate-fade-in border border-zinc-150/45 dark:border-zinc-800 flex flex-col gap-5">
            <div className="flex gap-4 items-start justify-between">
              <div className="flex gap-3.5 items-start">
                <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/20 text-[#E25C5C] flex items-center justify-center shrink-0 relative">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[16px] font-bold text-zinc-900 dark:text-white leading-tight">
                    Cancel Booking?
                  </h4>
                  <p className="text-[12px] font-medium text-zinc-500 dark:text-zinc-400 leading-normal max-w-[280px]">
                    Are you sure you want to cancel this booking? This action cannot be undone.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCancelConfirmBookingId(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-250 cursor-pointer transition-colors"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setCancelConfirmBookingId(null)}
                className="px-6 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-[12.5px] font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleUpdateStatus(cancelConfirmBookingId, "Cancelled");
                  setCancelConfirmBookingId(null);
                }}
                className="px-6 py-2 rounded-full bg-[#E25C5C] hover:bg-[#D14B4B] text-white text-[12.5px] font-semibold shadow-md transition-all cursor-pointer"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
