"use client";

import React from "react";
import Card from "../Card";

export interface ReservationMetric {
  label: string;
  value: string;
  change: string;
  isPositive?: boolean;
}

interface ReservationSummaryListProps {
  title?: string;
  metrics?: ReservationMetric[];
  className?: string;
}

export default function ReservationSummaryList({
  title = "Reservation Summary",
  metrics = [
    { label: "Walk Ins", value: "88", change: "+15.4%", isPositive: true },
    { label: "Total Reservation", value: "312", change: "+15.4%", isPositive: true },
    { label: "No Shows", value: "18", change: "+15.4%", isPositive: false }, // Typically negative context, but following user mockup we will allow it!
    { label: "Cancellation", value: "24", change: "+15.4%", isPositive: false },
    { label: "Seated Rate", value: "86.5%", change: "+15.4%", isPositive: true },
  ],
  className = "",
}: ReservationSummaryListProps) {
  return (
    <Card className={`max-w-none !p-6 flex flex-col justify-between hover:shadow-md border border-zinc-100 dark:border-zinc-800 transition-all duration-300 select-none h-full ${className}`}>
      <h3 className="text-[20px] font-semibold text-[#333839] dark:text-zinc-200 mb-6">
        {title}
      </h3>

      <div className="space-y-4 flex-1 flex flex-col justify-between">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between py-1 border-b border-zinc-50 dark:border-zinc-800/40 last:border-none last:pb-0"
          >
            {/* Metric Label & Trend Change */}
            <div className="space-y-1">
              <span className="text-[14px] font-medium text-zinc-500 dark:text-zinc-400">
                {m.label}
              </span>
              <div className="flex items-center gap-1 text-[10px]">
                <span
                  className={`flex items-center gap-0.5 font-bold ${m.isPositive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-500 dark:text-red-400"
                    }`}
                >
                  {m.isPositive ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="14" viewBox="0 0 21 14" fill="none">
                      <path d="M21.0004 0.75V6.75C21.0004 6.94891 20.9214 7.13968 20.7807 7.28033C20.6401 7.42098 20.4493 7.5 20.2504 7.5C20.0515 7.5 19.8607 7.42098 19.7201 7.28033C19.5794 7.13968 19.5004 6.94891 19.5004 6.75V2.56031L11.781 10.2806C11.7114 10.3504 11.6287 10.4057 11.5376 10.4434C11.4466 10.4812 11.349 10.5006 11.2504 10.5006C11.1519 10.5006 11.0543 10.4812 10.9632 10.4434C10.8722 10.4057 10.7894 10.3504 10.7198 10.2806L7.50042 7.06031L1.28104 13.2806C1.14031 13.4214 0.94944 13.5004 0.750417 13.5004C0.551394 13.5004 0.360523 13.4214 0.219792 13.2806C0.0790616 13.1399 0 12.949 0 12.75C0 12.551 0.0790616 12.3601 0.219792 12.2194L6.96979 5.46937C7.03945 5.39964 7.12216 5.34432 7.21321 5.30658C7.30426 5.26884 7.40186 5.24941 7.50042 5.24941C7.59898 5.24941 7.69657 5.26884 7.78762 5.30658C7.87867 5.34432 7.96139 5.39964 8.03104 5.46937L11.2504 8.68969L18.4401 1.5H14.2504C14.0515 1.5 13.8607 1.42098 13.7201 1.28033C13.5794 1.13968 13.5004 0.948912 13.5004 0.75C13.5004 0.551088 13.5794 0.360322 13.7201 0.21967C13.8607 0.0790178 14.0515 0 14.2504 0H20.2504C20.4493 0 20.6401 0.0790178 20.7807 0.21967C20.9214 0.360322 21.0004 0.551088 21.0004 0.75Z" fill="#15B79F" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="14" viewBox="0 0 21 14" fill="none">
                      <path d="M21.0004 6.75042V12.7504C21.0004 12.9493 20.9214 13.1401 20.7807 13.2807C20.6401 13.4214 20.4493 13.5004 20.2504 13.5004H14.2504C14.0515 13.5004 13.8607 13.4214 13.7201 13.2807C13.5794 13.1401 13.5004 12.9493 13.5004 12.7504C13.5004 12.5515 13.5794 12.3607 13.7201 12.2201C13.8607 12.0794 14.0515 12.0004 14.2504 12.0004H18.4401L11.2504 4.81073L8.03104 8.03104C7.96139 8.10077 7.87867 8.15609 7.78762 8.19384C7.69657 8.23158 7.59898 8.25101 7.50042 8.25101C7.40186 8.25101 7.30426 8.23158 7.21321 8.19384C7.12216 8.15609 7.03945 8.10077 6.96979 8.03104L0.219792 1.28104C0.0790616 1.14031 -2.09705e-09 0.94944 0 0.750417C2.09705e-09 0.551394 0.0790616 0.360522 0.219792 0.219792C0.360523 0.0790612 0.551394 2.09705e-09 0.750417 0C0.94944 -2.09705e-09 1.14031 0.0790612 1.28104 0.219792L7.50042 6.4401L10.7198 3.21979C10.7894 3.15006 10.8722 3.09474 10.9632 3.057C11.0543 3.01925 11.1519 2.99983 11.2504 2.99983C11.349 2.99983 11.4466 3.01925 11.5376 3.057C11.6287 3.09474 11.7114 3.15006 11.781 3.21979L19.5004 10.9401V6.75042C19.5004 6.5515 19.5794 6.36074 19.7201 6.22009C19.8607 6.07943 20.0515 6.00042 20.2504 6.00042C20.4493 6.00042 20.6401 6.07943 20.7807 6.22009C20.9214 6.36074 21.0004 6.5515 21.0004 6.75042Z" fill="#F04438" />
                    </svg>
                  )}
                  {m.change}
                </span>
              </div>
            </div>

            {/* Metric Value count */}
            <span className="text-[14px] font-semibold text-[#333839] dark:text-white tracking-tight">
              {m.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
