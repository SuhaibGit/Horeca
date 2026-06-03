"use client";

import React from "react";
import { LiveOrder } from "../../data/mockOrders";
import { getStatusStyles } from "./OrderCard";
import DetailDrawer from "../DetailDrawer";

interface OrderDetailDrawerProps {
  order: LiveOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailDrawer({ order, isOpen, onClose }: OrderDetailDrawerProps) {
  if (!order) return null;

  const statusStyle = getStatusStyles(order.status);
  const displaySubtotal = order.subtotal || order.totalPrice;
  const displayTax = order.taxAndService || displaySubtotal * 0.1;
  const displayTotal = displaySubtotal + displayTax;

  return (
    <DetailDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Order Detail"
      contentClassName="p-0 px-6 space-y-2"
      titleClassName="text-[19px] font-black text-zinc-900 dark:text-white tracking-tight uppercase"
      maxWidthClass="max-w-[460px]"

      badge={
        <span
          className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${statusStyle.bg} ${statusStyle.text} uppercase tracking-wider`}
        >
          {statusStyle.label}
        </span>
      }
      footer={
        <div className="p-6  bg-[#D1ECFF] rounded-[20px] space-y-3">
          <div className="flex justify-between items-center text-[14px] font-semibold text-[#717680]">
            <span>Subtotal</span>
            <span className="font-semibold text-[#333839] text-[18px]">
              AED {displaySubtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center text-[14px] font-semibold text-[#717680]">
            <span>Tax & Service (10%)</span>
            <span className="font-semibold text-[#333839] text-[18px]">
              AED {displayTax.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-[#AEDEFF] text-[14px] font-bold">
            <span className="text-[#333839] uppercase">Total Amount</span>
            <span className="text-[17px] font-semibold bg-linear-to-r from-[#041B40] to-[#0A46A6] bg-clip-text text-transparent">
              AED {displayTotal.toFixed(2)}
            </span>
          </div>
        </div>
      }
    >
      <div className=" border border-[#E7E7E7] mt-3 rounded-[20px] p-4 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#EBF7FF] text-[#0A46A6] dark:text-[#28A388] flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <div className="flex flex-col select-none">
            <span className="text-[12px] text-[##626D6F] font-medium uppercase tracking-wider">
              Table
            </span>
            <span className="text-[13px] font-medium text-[#25292A]">
              {order.table.replace("Table ", "")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#EBF7FF] text-[#0A46A6] dark:text-[#28A388] flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div className="flex flex-col select-none">
            <span className="text-[12px] text-[##626D6F] font-medium uppercase tracking-wider">
              Guests
            </span>
            <span className="text-[13px] font-medium text-[#25292A]">
              {order.guests === 624 ? 8 : order.guests}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#EBF7FF] text-[#0A46A6] dark:text-[#28A388] flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="flex flex-col select-none">
            <span className="text-[12px] text-[##626D6F] font-medium uppercase tracking-wider">
              Order No.
            </span>
            <span className="text-[13px] font-medium text-[#25292A]">
              {order.id.replace("#", "")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#EBF7FF] text-[#0A46A6] dark:text-[#28A388] flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex flex-col select-none">
            <span className="text-[12px] text-[##626D6F] font-medium uppercase tracking-wider">
              Time
            </span>
            <span className="text-[13px] font-medium text-[#25292A]">{order.timeAgo}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 ">
        <h3 className="text-[20px] font-bold text-[#333839] dark:text-white uppercase tracking-tight">
          Items Breakdown
        </h3>
        <div className="divide-y border border-[#E7E7E7] rounded-[20px] p-4 divide-[#E7E7E7]">
          {order.items.map((lineItem, index) => (
            <div key={index} className="py-3 flex items-center justify-between text-[14px] font-medium">
              <span className="text-[#333839]">
                {lineItem.quantity}x {lineItem.name}
              </span>
              <span className="text-[#D4AF37]  text-[18px] font-semibold">
                AED {lineItem.price * lineItem.quantity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DetailDrawer>
  );
}
