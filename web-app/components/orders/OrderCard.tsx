"use client";

import React from "react";
import { LiveOrder } from "../../data/mockOrders";

interface OrderCardProps {
  order: LiveOrder;
  onViewDetail: () => void;
}

export const getStatusStyles = (status: LiveOrder["status"]) => {
  switch (status) {
    case "Ready":
      return {
        bg: "bg-[#0096881A]",
        text: "text-[#009688]",
        label: "Ready",
      };
    case "New":
      return {
        bg: "bg-[#2196F31A]",
        text: "text-[#2196F3]",
        label: "New",
      };
    case "Preparing":
      return {
        bg: "bg-[#FFF4ED]",
        text: "text-[#FF4405]",
        label: "Preparing",
      };
    case "Served":
      return {
        bg: "bg-[#F4F3FF]",
        text: "text-[#7A5AF8]",
        label: "Served",
      };
    case "Completed":
      return {
        bg: "bg-[#FAFAFA]",
        text: "text-[#717680]",
        label: "Completed",
      };
    case "Delay":
      return {
        bg: "bg-[#FFF1F3]",
        text: "text-[#F63D68]",
        label: "Delay",
      };
    case "Cancelled":
      return {
        bg: "bg-zinc-100 dark:bg-zinc-800",
        text: "text-zinc-500 dark:text-zinc-400",
        label: "Cancelled",
      };
    default:
      return {
        bg: "bg-zinc-55",
        text: "text-zinc-600",
        label: status,
      };
  }
};

function TableIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
      <path
        d="M6 0H1.5C1.10218 0 0.720644 0.158035 0.43934 0.43934C0.158035 0.720644 0 1.10218 0 1.5V6C0 6.39782 0.158035 6.77936 0.43934 7.06066C0.720644 7.34196 1.10218 7.5 1.5 7.5H6C6.39782 7.5 6.77936 7.34196 7.06066 7.06066C7.34196 6.77936 7.5 6.39782 7.5 6V1.5C7.5 1.10218 7.34196 0.720644 7.06066 0.43934C6.77936 0.158035 6.39782 0 6 0ZM6 6H1.5V1.5H6V6ZM15 0H10.5C10.1022 0 9.72064 0.158035 9.43934 0.43934C9.15804 0.720644 9 1.10218 9 1.5V6C9 6.39782 9.15804 6.77936 9.43934 7.06066C9.72064 7.34196 10.1022 7.5 10.5 7.5H15C15.3978 7.5 15.7794 7.34196 16.0607 7.06066C16.342 6.77936 16.5 6.39782 16.5 6V1.5C16.5 1.10218 16.342 0.720644 16.0607 0.43934C15.7794 0.158035 15.3978 0 15 0ZM15 6H10.5V1.5H15V6ZM6 9H1.5C1.10218 9 0.720644 9.15804 0.43934 9.43934C0.158035 9.720644 0 10.1022 0 10.5V15C0 15.3978 0.158035 15.7794 0.43934 16.0607C0.720644 16.342 1.10218 16.5 1.5 16.5H6C6.39782 16.5 6.77936 16.342 7.06066 16.0607C7.34196 15.7794 7.5 15.3978 7.5 15V10.5C7.5 10.1022 7.34196 9.720644 7.06066 9.43934C6.77936 9.15804 6.39782 9 6 9ZM6 15H1.5V10.5H6V15ZM15 9H10.5C10.1022 9 9.72064 9.15804 9.43934 9.43934C9.15804 9.720644 9 10.1022 9 10.5V15C9 15.3978 9.15804 15.7794 9.43934 16.0607C9.72064 16.342 10.1022 16.5 10.5 16.5H15C15.3978 16.5 15.7794 16.342 16.0607 16.0607C16.342 15.7794 16.5 15.3978 16.5 15V10.5C16.5 10.1022 16.342 9.720644 16.0607 9.43934C15.7794 9.15804 15.3978 9 15 9ZM15 15H10.5V10.5H15V15Z"
        fill="#0A46A6"
      />
    </svg>
  );
}

function DeliveryIcon() {
  return (
    <svg className="w-[17px] h-[17px] text-[#0A46A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0h2m-2 0a2 2 0 104 0m-6 0a2 2 0 104 0m6-8h3.5L21 10v6h-2m-6-4V6"
      />
    </svg>
  );
}

export default function OrderCard({ order, onViewDetail }: OrderCardProps) {
  const statusStyle = getStatusStyles(order.status);
  const isDelivery = order.orderType === "Delivery";

  // Calculate shown items (first 2 items)
  const displayItems = order.items.slice(0, 2);
  const remainingCount = order.items.length - displayItems.length;

  return (
    <div className="bg-white dark:bg-zinc-900 shadow-md rounded-[20px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between hover:shadow-md transition-shadow duration-300 select-none">

      {/* Card Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {/* Table Grid Icon */}
          <span className="shrink-0">
            {isDelivery ? <DeliveryIcon /> : <TableIcon />}
          </span>
          <span className="font-semibold text-[20px]  bg-linear-to-r from-[#041B40] to-[#0A46A6] bg-clip-text text-transparent ">
            {isDelivery ? "Delivery" : order.table}
          </span>
        </div>

        {/* Status Badge */}
        <span className={`px-3 py-1 text-[14px] font-medium rounded-full ${statusStyle.bg} ${statusStyle.text}  tracking-wider`}>
          {statusStyle.label}
        </span>
      </div>

      {/* Order ID */}
      <div className="text-[16px] font-medium text-[#717680] dark:text-[#717680] mb-5">
        Order: <span className="text-[#333839] ">{order.id}</span>
      </div>

      {/* Items Breakdown list */}
      <div className="space-y-2 flex-1">
        {displayItems.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-[14px] font-medium">
            <span className="text-zinc-700 dark:text-zinc-350">
              {item.quantity}x {item.name}
            </span>
            <span className="text-[#D4AF37] text-[18px] font-semibold">
              ${item.price * item.quantity}
            </span>
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="text-[12px] font-semibold text-[#717680] pt-0.5">
            +{remainingCount} more items
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-zinc-100 dark:border-zinc-800/60 my-4" />

      {/* Footer Content */}
      <div className="flex items-center justify-between w-full">

        {/* Stats Row: Guest count & Time elapsed */}
        <div className="flex flex-col w-full gap-4">
          <div className="flex  gap-1 justify-between w-full">
            <div className="flex items-center gap-1.5 text-[14px]  text-zinc-400 dark:text-zinc-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>{order.guests} Guest</span>
            </div>
            <div className="flex items-center gap-1.5 text-[14px]  text-[#717680]">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{order.timeAgo}</span>
            </div>
          </div>

          {/* Price & Action Button */}
          <div className="flex  items-end gap-1.5 w-full justify-between">
            <div className="text-[20px] font-semibold text-[#333839] tracking-tight">
              AED {order.totalPrice.toFixed(2)}
            </div>
            <button
              onClick={onViewDetail}
              className="px-8 py-2 text-[11px] font-bold text-white bg-linear-to-br from-[#041B40] to-[#0A46A6] hover:bg-[#073027] rounded-[100px] transition-colors cursor-pointer uppercase tracking-wider"
            >
              View Detail
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
