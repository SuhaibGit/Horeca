"use client";

import React, { useState } from "react";
import Card from "../Card";

export interface TrendSeries {
  id: string;
  label: string;
  color: string;
  values: number[];
}

export interface TrendChartProps {
  title?: string;
  timeframes?: string[];
  activeTimeframe?: string;
  onTimeframeChange?: (timeframe: string) => void;
  labels?: string[];
  series?: TrendSeries[];
  yMax?: number;
  ySuffix?: string;
  valuePrefix?: string;
  className?: string;
}

export default function TrendChart({
  title = "Performance Trends",
  timeframes = ["Last 30 Days", "Last 6 Months", "This Year"],
  activeTimeframe = "Last 30 Days",
  onTimeframeChange,
  labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
  series = [
    { id: "a", label: "Completed", color: "#0A46A6", values: [72, 48, 85, 62, 55, 78, 52, 35, 68, 55, 48, 72] },
    { id: "b", label: "Cancelled", color: "#EF4444", values: [28, 42, 35, 48, 52, 38, 45, 55, 42, 38, 45, 52] },
  ],
  yMax = 100,
  ySuffix = "",
  valuePrefix = "",
  className = "",
}: TrendChartProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hovered, setHovered] = useState<{ seriesIdx: number; pointIdx: number } | null>({
    seriesIdx: 0,
    pointIdx: 3,
  });

  const width = 600;
  const height = 260;
  const paddingX = 40;
  const paddingY = 30;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const yTicks = [0, 25, 50, 75, 100];

  const getPath = (values: number[]) => {
    const points = values.map((v, i) => ({
      x: paddingX + (i / (values.length - 1)) * chartWidth,
      y: paddingY + chartHeight - (v / yMax) * chartHeight,
    }));
    if (!points.length) return "";
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  return (
    <Card
      className={`max-w-none !p-6 flex flex-col hover:shadow-md border border-zinc-100 dark:border-zinc-800 transition-all duration-300 select-none h-full ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[20px] font-semibold text-[#333839] dark:text-zinc-200">{title}</h3>
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/40 text-[12px] font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100/50 transition-all cursor-pointer"
          >
            <span>{activeTimeframe}</span>
            <svg className={`w-3 h-3 text-zinc-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-1 w-36 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg z-25 py-1 overflow-hidden">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => {
                    onTimeframeChange?.(tf);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-[12px] font-bold hover:bg-zinc-50 dark:hover:bg-zinc-700/50 cursor-pointer ${tf === activeTimeframe ? "bg-zinc-50 text-[#0A46A6]" : "text-zinc-600"
                    }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative w-full overflow-x-auto scrollbar-hide py-1 flex-1 min-h-[200px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[500px] h-auto overflow-visible">
          {yTicks.map((val) => {
            const y = paddingY + chartHeight - (val / yMax) * chartHeight;
            return (
              <g key={val}>
                <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="#E4E4E7" strokeWidth={1} strokeDasharray="4,4" />
                <text x={paddingX - 10} y={y + 3} textAnchor="end" className="text-[12px] fill-[#000000B2] font-semibold">
                  {val}
                  {ySuffix}
                </text>
              </g>
            );
          })}

          {series.map((s, si) => (
            <path
              key={s.id}
              d={getPath(s.values)}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeLinecap="round"
            />
          ))}

          {labels.map((label, i) => {
            const x = paddingX + (i / (labels.length - 1)) * chartWidth;
            return (
              <text
                key={label}
                x={x}
                y={height - paddingY + 18}
                textAnchor="middle"
                className="text-[12px] fill-black/70 font-semibold uppercase"
              >
                {label}
              </text>
            );
          })}

          {series.map((s, si) =>
            s.values.map((v, pi) => {
              const x = paddingX + (pi / (labels.length - 1)) * chartWidth;
              const y = paddingY + chartHeight - (v / yMax) * chartHeight;
              return (
                <circle
                  key={`${si}-${pi}`}
                  cx={x}
                  cy={y}
                  r={hovered?.seriesIdx === si && hovered?.pointIdx === pi ? 5 : 0}
                  fill={s.color}
                  className="cursor-pointer"
                  onMouseEnter={() => setHovered({ seriesIdx: si, pointIdx: pi })}
                  onMouseLeave={() => setHovered(null)}
                />
              );
            })
          )}
        </svg>

        {hovered && (() => {
          const ptY =
            paddingY +
            chartHeight -
            (series[hovered.seriesIdx].values[hovered.pointIdx] / yMax) * chartHeight;
          const leftPct =
            ((paddingX + (hovered.pointIdx / (labels.length - 1)) * chartWidth) / width) * 100;
          const topPct = (ptY / height) * 100 - 18;
          return (
            <div
              className="absolute bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 shadow-lg rounded-xl py-2 px-3 pointer-events-none z-10 text-center min-w-[100px]"
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
                transform: "translate(-50%, -100%)",
              }}
            >
              <span className="text-[9px] text-zinc-400 font-bold uppercase">{labels[hovered.pointIdx]}</span>
              <span className="text-[11px] font-black text-zinc-800 dark:text-white block">
                {series[hovered.seriesIdx].label}: {valuePrefix}
                {series[hovered.seriesIdx].values[hovered.pointIdx]}
                {ySuffix}
              </span>
            </div>
          );
        })()}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-3 border-t border-zinc-50 dark:border-zinc-800/60">
        {series.map((s) => (
          <div key={s.id} className="flex items-center gap-2 text-[12px] font-semibold text-zinc-600">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label}
          </div>
        ))}
      </div>
    </Card>
  );
}
