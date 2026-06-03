"use client";

import React, { useState } from "react";
import Card from "../Card";

export interface TableRow {
  channel: string;
  revenue: string;
  orders: string;
  avgOrderValue: string;
  change: string;
  isPositive?: boolean;
  isTotal?: boolean;
}

export type CellTone = "default" | "positive" | "negative" | "warning";

export type PillVariant =
  | "starter"
  | "main-course"
  | "dessert"
  | "beverages"
  | "whatsapp"
  | "email"
  | "sms"
  | "successful"
  | "pending"
  | "refund"
  | "failed";

export interface TableCell {
  value: string;
  tone?: CellTone;
  showTrendArrow?: boolean;
  pill?: boolean;
  pillVariant?: PillVariant;
}

export interface GenericTableRow {
  cells: TableCell[];
  isTotal?: boolean;
}

const PILL_CLASSES: Record<PillVariant, string> = {
  starter: "bg-[#FFF4ED] text-[#C4320A] border border-[#FECDCA]",
  "main-course": "bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA]",
  dessert: "bg-[#FFF1F3] text-[#C01048] border border-[#FECDD6]",
  beverages: "bg-[#EFF8FF] text-[#175CD3] border border-[#B2DDFF]",
  whatsapp: "bg-[#EBF7FF]  text-[#067647] border border-[#ABEFC6]",
  email: "bg-[#FFF4ED] text-[#C4320A] border border-[#FECDCA]",
  sms: "bg-[#F4F3FF] text-[#5925DC] border border-[#D9D6FE]",
  successful: "bg-[#ECFDF3] text-[#067647] border border-[#ABEFC6]",
  pending: "bg-[#FFFAEB] text-[#B54708] border border-[#FEDF89]",
  refund: "bg-[#EFF8FF] text-[#175CD3] border border-[#B2DDFF]",
  failed: "bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA]",
};

function resolvePillVariant(value: string, explicit?: PillVariant): PillVariant {
  if (explicit) return explicit;
  const key = value.toLowerCase().replace(/\s+/g, "-");
  if (key in PILL_CLASSES) return key as PillVariant;
  if (key === "main-course" || key === "main") return "main-course";
  if (key === "dessert" || key === "desserts") return "dessert";
  if (key === "starter" || key === "starters") return "starter";
  return "starter";
}

function CellPill({ value, variant }: { value: string; variant: PillVariant }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${PILL_CLASSES[variant]}`}
    >
      {value}
    </span>
  );
}

interface PerformanceTableProps {
  title?: string;
  headers?: string[];
  rows?: TableRow[];
  genericRows?: GenericTableRow[];
  className?: string;
  headerFilterLabel?: string;
  showPagination?: boolean;
  paginationFrom?: number;
  paginationTo?: number;
  paginationTotal?: number;
  pageSize?: number;
}

function toneClass(tone: CellTone = "default", isTotal?: boolean): string {
  if (isTotal) return "text-zinc-900 dark:text-white";
  switch (tone) {
    case "positive":
      return "text-[#28A388] dark:text-[#28A388]";
    case "negative":
      return "text-red-500 dark:text-red-400";
    case "warning":
      return "text-amber-600 dark:text-amber-400";
    default:
      return "text-zinc-700 dark:text-zinc-300";
  }
}

function TrendArrow({ positive }: { positive: boolean }) {
  return positive ? (
    <svg className="w-4 h-4 mb-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 17l6-6 4 4 8-8" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7h5v5" />
    </svg>
  ) : (
    <svg className="w-4 h-4 mb-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7l6 6 4-4 8 8" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 17h5v-5" />
    </svg>
  );
}

export default function PerformanceTable({
  title = "Top Performing Categories",
  headers = ["Channel", "Revenue", "Orders", "Avg order value", "% Change"],
  rows,
  genericRows,
  className = "",
  headerFilterLabel,
  showPagination = false,
  paginationFrom = 1,
  paginationTo = 5,
  paginationTotal = 13,
  pageSize = 10,
}: PerformanceTableProps) {
  const [filterOpen, setFilterOpen] = useState(false);

  const legacyRows: TableRow[] =
    rows ??
    [
      {
        channel: "Dine in",
        revenue: "68,430",
        orders: "624",
        avgOrderValue: "109.66",
        change: "+15.4%",
        isPositive: true,
      },
      {
        channel: "Online Ordering",
        revenue: "29,870",
        orders: "430",
        avgOrderValue: "69.45",
        change: "+12.0%",
        isPositive: true,
      },
      {
        channel: "Delivery",
        revenue: "82,300",
        orders: "1,015",
        avgOrderValue: "121.60",
        change: "+22.3%",
        isPositive: true,
      },
      {
        channel: "Takeaways",
        revenue: "45,120",
        orders: "512",
        avgOrderValue: "88.25",
        change: "+8.7%",
        isPositive: true,
      },
      {
        channel: "Totals",
        revenue: "126,430",
        orders: "1248",
        avgOrderValue: "101.32",
        change: "+18.9%",
        isPositive: true,
        isTotal: true,
      },
    ];

  const useGeneric = Boolean(genericRows?.length);

  const renderCellContent = (cell: TableCell, rowWeight: string) => {
    if (cell.pill) {
      const variant = resolvePillVariant(cell.value, cell.pillVariant);
      return (
        <span className={`inline-flex`}>
          <CellPill value={cell.value} variant={variant} />
        </span>
      );
    }
    if (cell.showTrendArrow) {
      return (
        <span
          className={`inline-flex items-center gap-1 ${rowWeight} ${toneClass(cell.tone)}`}
        >
          <TrendArrow positive={cell.tone !== "negative"} />
          {cell.value}
        </span>
      );
    }
    return cell.value;
  };

  return (
    <Card
      className={`max-w-none !p-0 overflow-hidden flex flex-col hover:shadow-md border border-zinc-100 dark:border-zinc-800 transition-all duration-300 select-none h-full ${className}`}
    >
      <div className="flex items-center justify-between gap-4 pt-6 px-6 mb-7">
        <h3 className="text-[20px] font-semibold text-[#18181B] dark:text-zinc-200">{title}</h3>
        {headerFilterLabel && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/40 text-[12px] font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100/50 transition-all cursor-pointer"
            >
              {headerFilterLabel}
              <svg className={`w-3 h-3 text-zinc-400 ${filterOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {filterOpen && (
              <div className="absolute top-full right-0 mt-1 w-32 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg z-20 py-1">
                {["All", "Successful", "Pending", "Refund", "Failed"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFilterOpen(false)}
                    className="w-full text-left px-3 py-2 text-[12px] font-bold text-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 cursor-pointer"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="w-full overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr>
              {headers.map((header, idx) => (
                <th
                  key={header}
                  className={`text-[13px] font-medium text-[#333839] dark:text-zinc-400 pb-4 pt-2 border-b border-zinc-100 dark:border-zinc-800 first:pl-6 last:pr-6`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {useGeneric
              ? genericRows!.map((row, idx) => {
                const rowWeight = row.isTotal ? "font-bold" : "font-normal";
                const tdBorderClass = row.isTotal ? "" : "border-b border-[#F0F0F5]";
                return (
                  <tr
                    key={idx}
                    className={`transition-colors  ${row.isTotal ? "bg-[#EAEBEB] dark:bg-zinc-800/50" : ""}`}
                  >
                    {row.cells.map((cell, ci) => {
                      return (
                        <td
                          key={ci}
                          className={`py-4 text-[13px] first:pl-6 last:pr-6 ${tdBorderClass} ${rowWeight} ${!cell.pill ? toneClass(cell.tone, row.isTotal) : ""}`}
                        >
                          {renderCellContent(cell, rowWeight)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
              : legacyRows.map((row, idx) => {
                const rowWeight = row.isTotal ? "font-bold" : "font-normal";
                const textColor = row.isTotal
                  ? "text-zinc-900 dark:text-white"
                  : "text-zinc-700 dark:text-zinc-300";

                const tdBorderClass = row.isTotal ? "" : "border-b border-[#F0F0F5] dark:border-zinc-800/40";

                return (
                  <tr
                    key={idx}
                    className={`transition-colors  dark:hover:bg-zinc-800/10 ${row.isTotal ? "bg-[#EAEBEB] dark:bg-zinc-800/50" : ""}`}
                  >
                    <td className={`py-4 text-[13px] first:pl-6 ${tdBorderClass} ${rowWeight} ${textColor}`}>{row.channel}</td>
                    <td className={`py-4 text-[13px] ${tdBorderClass} ${rowWeight} ${textColor}`}>{row.revenue}</td>
                    <td className={`py-4 text-[13px] ${tdBorderClass} ${rowWeight} ${textColor}`}>{row.orders}</td>
                    <td className={`py-4 text-[13px] ${tdBorderClass} ${rowWeight} ${textColor}`}>
                      {row.avgOrderValue}
                    </td>
                    <td className={`py-4 text-[13px] last:pr-6 ${tdBorderClass}`}>
                      <span
                        className={`inline-flex items-center gap-1 ${rowWeight} ${row.isPositive
                          ? "text-[#28A388] dark:text-[#28A388]"
                          : "text-red-500 dark:text-red-400"
                          }`}
                      >
                        <TrendArrow positive={row.isPositive ?? true} />
                        {row.change}
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="flex items-center justify-end gap-4 mt-4 px-6 pb-6 pt-4 border-t border-zinc-50 dark:border-zinc-800/60 text-[12px] text-zinc-500 font-semibold">
          <span>Rows per page:</span>
          <button
            type="button"
            className="flex items-center gap-1 px-2 py-1 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-700"
          >
            {pageSize}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <span>
            {paginationFrom}-{paginationTo} of {paginationTotal}
          </span>
          <div className="flex items-center gap-1">
            <button type="button" className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="Previous page">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button type="button" className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="Next page">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
