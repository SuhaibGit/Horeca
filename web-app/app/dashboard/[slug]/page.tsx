"use client";

import React from "react";
import { useParams } from "next/navigation";
import ReportsView, { isReportSlug } from "@/components/reports/ReportsView";

function PlaceholderTab({ slug }: { slug: string }) {
  const formattedTitle = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-150/40 dark:border-zinc-800 p-8 rounded-[20px] text-center select-none py-24 flex flex-col items-center justify-center gap-4 max-w-2xl mx-auto shadow-xs animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-[#0A46A6] dark:text-emerald-400 flex items-center justify-center shrink-0">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      </div>
      <div className="space-y-1">
        <h2 className="text-[17px] font-black text-zinc-900 dark:text-white tracking-tight uppercase">
          {formattedTitle} Screen
        </h2>
        <p className="text-[12.5px] font-bold text-zinc-405 dark:text-zinc-500 max-w-md leading-relaxed">
          The simulated {formattedTitle} module is currently under construction. All layouts utilize the same premium
          styling tokens.
        </p>
      </div>
    </div>
  );
}

export default function DashboardSlugPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "tab";

  if (isReportSlug(slug)) {
    return <ReportsView slug={slug} />;
  }

  return <PlaceholderTab slug={slug} />;
}
