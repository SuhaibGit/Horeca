"use client";

import React from "react";
import { CustomerOrder } from "../../data/mockCustomers";
import { getStatusStyles } from "../orders/OrderCard";

interface CustomerOrderCardProps {
  order: CustomerOrder;
  onViewDetail: () => void;
}

export default function CustomerOrderCard({ order, onViewDetail }: CustomerOrderCardProps) {
  const statusStyle = getStatusStyles(order.status);

  return (
    <div className="rounded-xl border border-[#E7E7E7] dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900/50 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[14px] font-bold text-[#333839] dark:text-white">{order.id}</span>
        <span
          className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${statusStyle.bg} ${statusStyle.text}`}
        >
          {statusStyle.label}
        </span>
      </div>

      <p className="text-[12px] font-medium text-[#717680]">{order.timeAgo}</p>

      <p className="text-[13px] font-medium text-[#51595A] dark:text-zinc-400 leading-relaxed">
        {order.items.join(", ")}
      </p>

      <div className="border-t border-[#E7E7E7] dark:border-zinc-800 pt-3 flex items-center justify-between">
        <span className="text-[12px] font-medium text-[#717680]">{order.serviceType}</span>
        <span className="text-[16px] font-bold text-[#333839] dark:text-white">
          AED {order.total.toFixed(2)}
        </span>
      </div>

      <button
        type="button"
        onClick={onViewDetail}
        className="w-full mt-1 py-2.5 rounded-full bg-linear-to-r from-[#041B40] to-[#0A46A6] text-white text-[12px] font-bold hover:opacity-95 transition-opacity cursor-pointer"
      >
        View Detail
      </button>
    </div>
  );
}
