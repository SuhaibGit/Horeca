"use client";

import React, { useEffect, useState } from "react";
import { Customer, CustomerOrder } from "../../data/mockCustomers";
import type { CustomerWithLiveOrders } from "../../lib/customerOrders";
import CustomerAvatar from "./CustomerAvatar";
import CustomerOrderCard from "./CustomerOrderCard";
import CustomerOrderDetailModal from "./CustomerOrderDetailModal";
import DetailDrawer from "../DetailDrawer";
import DetailDrawerTabs from "../DetailDrawerTabs";

interface CustomerDetailDrawerProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

type DetailTab = "orders" | "reservations";

function MiniStatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-800/30 rounded-xl p-4 text-center">
      <p className="text-[12px] font-medium text-zinc-400 dark:text-zinc-500 mb-1">{label}</p>
      <p className="text-[18px] font-bold text-[#0A46A6] dark:text-[#28A388]">{value}</p>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-[#EBF7FF]  dark:bg-emerald-950/40 text-[#0A46A6] dark:text-[#28A388] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[12px] font-medium text-[#626D6F]  tracking-wider">
          {label}
        </p>
        <p className="text-[14px] font-medium text-[#25292A]">{value}</p>
      </div>
    </div>
  );
}

export default function CustomerDetailDrawer({
  customer,
  isOpen,
  onClose,
}: CustomerDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("orders");
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab("orders");
    } else {
      setOrderDetailOpen(false);
      setSelectedOrder(null);
    }
  }, [isOpen, customer?.id]);

  if (!customer) return null;

  const reservation = customer.reservation;
  const profile = customer as CustomerWithLiveOrders;
  const liveOrderCount = customer.orders.length;
  const liveSpend = profile.liveOrdersSpend ?? 0;

  return (
    <DetailDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Customer Information"
      badge={
        <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#EDFCF2] text-[#099250] dark:text-[#28A388]">
          Active
        </span>
      }
      headerActions={
        <button
          type="button"
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="More options"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
        </button>
      }
    >
      <div className="flex items-start gap-4 border-b border-[#E5E7EB] pb-5 mb-5">
        <CustomerAvatar name={customer.name} color={customer.avatarColor} size="lg" />
        <div className=" min-w-0">
          <h3 className="text-[20px] font-semibold text-[#333839]">{customer.name}</h3>
          <p className="text-[14px] font-medium text-[#333839]">
            Customer since {customer.customerSince}
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-1.5 text-[13px]  text-[#717680]">
              <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {customer.phone}
            </div>
            <div className="flex items-center gap-1.5 text-[13px]  text-[#717680]">
              <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {customer.email}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 border-b border-[#E5E7EB] pb-5 mb-5">
        <h4 className="text-[16px] font-semibold text-[#0A0A0A]">Customer Stats</h4>
        <div className="grid grid-cols-2 gap-3">
          <MiniStatCard label="Live Orders" value={String(liveOrderCount)} />
          <MiniStatCard label="Avg. Order Value" value={`AED ${customer.avgOrderValue.toFixed(2)}`} />
          <MiniStatCard
            label="Lifetime Orders"
            value={String(customer.ordersCount)}
          />
          <MiniStatCard
            label="Live Spend"
            value={`AED ${liveSpend.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          />
        </div>
      </div>

      <DetailDrawerTabs
        tabs={[
          { id: "orders", label: "Orders" },
          { id: "reservations", label: "Reservations" },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "orders" ? (
        <div className="space-y-3">
          {customer.orders.length > 0 ? (
            customer.orders.map((order) => (
              <CustomerOrderCard
                key={order.id}
                order={order}
                onViewDetail={() => {
                  setSelectedOrder(order);
                  setOrderDetailOpen(true);
                }}
              />
            ))
          ) : (
            <p className="text-center py-8 text-[13px] font-medium text-zinc-400">
              No live orders linked to this customer yet.
            </p>
          )}
        </div>
      ) : reservation ? (
        <div className="space-y-6">
          <div className="space-y-4 rounded-xl border border-[#E7E7E7] b p-4">
            <h4 className="text-[20px] font-semibold text-[#333839]">Booking Detail</h4>
            <div className="grid grid-cols-2 gap-4">
              <DetailRow
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
                label="Customer Name"
                value={reservation.customerName}
              />
              <DetailRow
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
                label="Contact"
                value={reservation.contact}
              />
              <DetailRow
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
                label="Date"
                value={reservation.date}
              />
              <DetailRow
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
                label="Guests"
                value={String(reservation.guests)}
              />
              <DetailRow
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                label="Start Time"
                value={reservation.startTime}
              />
              <DetailRow
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                label="End Time"
                value={reservation.endTime}
              />
            </div>
          </div>

          {reservation.specialRequest && (
            <div className="space-y-2">
              <h4 className="text-[20px] font-semibold text-[#333839] dark:text-white">Special Request</h4>
              <div className="rounded-xl border border-[#E7E7E7] b p-4">
                <p className="text-[14px] text-[#51595A] dark:text-zinc-300 leading-relaxed">
                  {reservation.specialRequest}
                </p>
              </div>
            </div>
          )}

          {reservation.items.length > 0 && (
            <div className="space-y-2 ">
              <h4 className="text-[20px] font-bold text-[#333839]">Items Breakdown</h4>
              <div className="divide-y divide-[#E7E7E7] rounded-xl border border-[#E7E7E7] b p-4">
                {reservation.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="py-3 flex items-center justify-between text-[13px] font-bold "
                  >
                    <span className="text-[#333839] text-[14px]">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-[#D4AF37] text-[18px] ">AED {item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center py-8 text-[13px] font-medium text-zinc-400">
          No reservations for this customer yet.
        </p>
      )}
      <CustomerOrderDetailModal
        order={selectedOrder}
        customer={customer}
        isOpen={orderDetailOpen}
        onClose={() => {
          setOrderDetailOpen(false);
          setSelectedOrder(null);
        }}
      />
    </DetailDrawer>
  );
}
