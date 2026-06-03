"use client";

import React from "react";
import Modal from "../Modal";
import { Customer, CustomerOrder } from "../../data/mockCustomers";
import { getStatusStyles } from "../orders/OrderCard";

interface CustomerOrderDetailModalProps {
  order: CustomerOrder | null;
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

function MetaCell({
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
      <div className="w-9 h-9 rounded-lg bg-[#EBF7FF] dark:bg-blue-950/40 text-[#0A46A6] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[12px] font-medium text-[#626D6F]">{label}</p>
        <p className="text-[13px] font-semibold text-[#25292A] dark:text-zinc-100 truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

function ServiceTypeIcon({ type }: { type: CustomerOrder["serviceType"] }) {
  if (type === "Delivery") {
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0h2m-2 0a2 2 0 104 0m-6 0a2 2 0 104 0m6-8h3.5L21 10v6h-2"
        />
      </svg>
    );
  }
  if (type === "Takeaway") {
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
    </svg>
  );
}

export default function CustomerOrderDetailModal({
  order,
  customer,
  isOpen,
  onClose,
}: CustomerOrderDetailModalProps) {
  if (!order) return null;

  const displaySubtotal = order.subtotal;
  const displayTax = order.taxAndService;
  const displayTotal = order.total;
  const statusStyle = getStatusStyles(order.status);
  const taxPercent =
    displaySubtotal > 0 ? Math.round((displayTax / displaySubtotal) * 100) : 10;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      showCloseButton={false}
      wrapperClassName="!z-[70]"
      className="!max-w-[440px] !w-[calc(100%-2rem)]"
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-4 shrink-0">
          <h2 className="text-[18px] font-bold text-zinc-900 dark:text-white">Order Detail</h2>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full ${statusStyle.bg} ${statusStyle.text}`}
            >
              {statusStyle.label}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="border border-[#E7E7E7] dark:border-zinc-800 rounded-2xl p-4 grid grid-cols-2 gap-4 mb-4">
          <MetaCell
            icon={<ServiceTypeIcon type={order.serviceType} />}
            label={order.serviceType}
            value={order.serviceType}
          />
          <MetaCell
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            }
            label="Guests"
            value={String(order.guests)}
          />
          <MetaCell
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            }
            label="Order No"
            value={order.id}
          />
          <MetaCell
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            label="Time"
            value={order.timeAgo}
          />
        </div>

        {customer && (
          <div className="mb-4">
            <h3 className="text-[15px] font-bold text-[#333839] dark:text-white mb-2">
              Customer information
            </h3>
            <div className="space-y-2 text-[14px]">
              <div className="flex justify-between gap-4">
                <span className="text-[#717680] font-medium">Name</span>
                <span className="font-semibold text-[#333839] dark:text-zinc-100 text-right">
                  {customer.name}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#717680] font-medium">Phone</span>
                <span className="font-semibold text-[#333839] dark:text-zinc-100 text-right">
                  {customer.phone}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#717680] font-medium">Location</span>
                <span className="font-semibold text-[#333839] dark:text-zinc-100 text-right">
                  {order.location}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-[15px] font-bold text-[#333839] dark:text-white mb-2">
            Items Breakdown
          </h3>
          <div className="divide-y divide-[#E7E7E7] dark:divide-zinc-800 rounded-2xl border border-[#E7E7E7] dark:border-zinc-800 p-4">
            {order.lineItems.map((item, idx) => (
              <div
                key={idx}
                className="py-3 flex items-center justify-between text-[14px] font-medium first:pt-0 last:pb-0"
              >
                <span className="text-[#333839] dark:text-zinc-200">
                  {item.quantity}x {item.name}
                </span>
                <span className="text-[#D4AF37] text-[18px] font-semibold">
                  AED {item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#D1ECFF] dark:bg-blue-950/30 rounded-2xl p-4 space-y-2.5 shrink-0">
          <div className="flex justify-between items-center text-[14px] font-semibold text-[#717680]">
            <span>Subtotal</span>
            <span className="text-[#333839] dark:text-zinc-100 text-[16px] font-semibold">
              AED {displaySubtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center text-[14px] font-semibold text-[#717680]">
            <span>Tax & Service ({taxPercent}%)</span>
            <span className="text-[#333839] dark:text-zinc-100 text-[16px] font-semibold">
              AED {displayTax.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-[#AEDEFF] dark:border-blue-900/50">
            <span className="text-[14px] font-bold text-[#333839] dark:text-white">Total Amount</span>
            <span className="text-[17px] font-bold bg-linear-to-r from-[#041B40] to-[#0A46A6] bg-clip-text text-transparent">
              AED {displayTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
