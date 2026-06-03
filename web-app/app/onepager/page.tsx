"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Edit2, ExternalLink, QrCode, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";
import Toast from "@/components/Toast";
import RevenueChart from "@/components/dashboard/RevenueChart";
import ChannelChart from "@/components/dashboard/ChannelChart";
import { BuilderProvider } from "@/components/onepager/BuilderContext";
import ReadOnlyPhonePreview from "@/components/onepager/ReadOnlyPhonePreview";

type ViewMode = "preview" | "live";

export default function OnePagerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<ViewMode>("live");
  const [isPublished, setIsPublished] = useState(true);
  const [showUnpublishDialog, setShowUnpublishDialog] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const view = searchParams.get("view");
    const status = searchParams.get("status");
    const updated = searchParams.get("updated");

    if (view === "preview") setMode("preview");
    if (view === "live") setMode("live");
    if (status === "published") setIsPublished(true);
    if (status === "unpublished") setIsPublished(false);

    if (updated === "1") {
      setToastMessage("One page updated successfully");
      setShowToast(true);
      setMode("preview");
      setIsPublished(false);
    }

    if (status === "published") {
      setToastMessage("Your One Page is live");
      setShowToast(true);
    }
  }, [searchParams]);

  const isLiveView = mode === "live";
  const showUnpublishedBanner = isLiveView && !isPublished;

  const ctaItems = [
    { label: "View Menu", value: 248 },
    { label: "Reservation", value: 128 },
    { label: "WhatsApp", value: 80 },
    { label: "Special Offers", value: 58 },
    { label: "Converted", value: 2400 },
  ];

  const trafficSources = [
    { label: "Direct Link", value: "62%" },
    { label: "QR Code", value: "22%" },
    { label: "WhatsApp", value: "10%" },
    { label: "Social Media", value: "6%" },
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto bg-white">
      <div className="w-full space-y-4 pb-6">
        {showUnpublishedBanner ? (
          <div className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-2.5 text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200">
            <p className="text-sm font-semibold">Your page is unpublished</p>
            <p className="text-xs font-medium opacity-90">
              Customers cannot view your page right now. Publish your page to make it live and visible.
            </p>
          </div>
        ) : null}

        <section className="rounded-xl bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">Guide Cafe</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Your one page is live and visible to customers.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => router.replace("/dashboard/onepager?view=live&status=published")}
                className="inline-flex items-center gap-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                Open Live Page
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
              <Link
                href="/dashboard/onepager/builder"
                className="inline-flex items-center gap-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit OnePage
              </Link>
              {isLiveView ? (
                isPublished ? (
                  <button
                    type="button"
                    onClick={() => setShowUnpublishDialog(true)}
                    className="rounded-md border border-rose-200 px-3 py-1.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-950/30"
                  >
                    Unpublish
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsPublished(true);
                      setToastMessage("Your One Page is live");
                      setShowToast(true);
                    }}
                    className="rounded-md bg-gradient-to-r from-[#041B40] to-[#0A46A6] px-3 py-1.5 text-sm font-semibold text-white hover:bg-gradient-to-r from-[#041B40] to-[#0A46A6]/90"
                  >
                    Publish One Page
                  </button>
                )
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMode("live");
                    setIsPublished(true);
                    setToastMessage("Your One Page is live");
                    setShowToast(true);
                    router.replace("/dashboard/onepager?view=live&status=published");
                  }}
                  className="rounded-md bg-gradient-to-r from-[#041B40] to-[#0A46A6] px-3 py-1.5 text-sm font-semibold text-white hover:bg-gradient-to-r from-[#041B40] to-[#0A46A6]/90"
                >
                  Publish One Page
                </button>
              )}
            </div>
          </div>

          {isLiveView ? (
            <>
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
                {[
                  ["Total Visitors", "1,248"],
                  ["QR Scans", "842"],
                  ["CTA Clicks", "32"],
                  ["Reservations", "28"],
                  ["Menu Opens", "713"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
                    <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-white">{value}</p>
                    <p className="text-[11px] text-emerald-500">+15.4% last month</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
                <RevenueChart
                  title="Visitor Overview"
                  activeTimeframe="Last 30 Days"
                  yearLabel="2025"
                  className="!p-4"
                  data={[
                    { label: "Jan", value: 75, displayValue: "1,248" },
                    { label: "Feb", value: 38, displayValue: "842" },
                    { label: "Mar", value: 70, displayValue: "1,102" },
                    { label: "Apr", value: 68, displayValue: "978" },
                    { label: "May", value: 58, displayValue: "856" },
                    { label: "Jun", value: 72, displayValue: "1,045" },
                    { label: "Jul", value: 30, displayValue: "602" },
                    { label: "Aug", value: 20, displayValue: "421" },
                    { label: "Sept", value: 52, displayValue: "913" },
                    { label: "Oct", value: 45, displayValue: "804" },
                    { label: "Nov", value: 44, displayValue: "788" },
                    { label: "Dec", value: 78, displayValue: "1,302" },
                  ]}
                />

                <ChannelChart
                  title="Traffic Sources"
                  totalLabel="Total"
                  totalValue="1248"
                  className="!p-4"
                  data={[
                    { name: "Direct Link", value: 774, displayValue: "62%", percentage: 62, color: "#3CCB7F", hoverColor: "#2FB669" },
                    { name: "QR Code", value: 275, displayValue: "22%", percentage: 22, color: "#FD853A", hoverColor: "#EA580C" },
                    { name: "WhatsApp", value: 125, displayValue: "10%", percentage: 10, color: "#EF4444", hoverColor: "#DC2626" },
                    { name: "Social Media", value: 74, displayValue: "6%", percentage: 6, color: "#53B1FD", hoverColor: "#2563EB" },
                  ]}
                />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
                <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                  <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">Top CTA Performance</h3>
                  <div className="space-y-3">
                    {ctaItems.map((item) => (
                      <div key={item.label} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-600 dark:text-zinc-300">{item.label}</span>
                          <span className="font-semibold text-zinc-900 dark:text-white">{item.value}</span>
                        </div>
                        <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
                          <div className="h-2 rounded-full bg-gradient-to-r from-[#041B40] to-[#0A46A6]" style={{ width: `${Math.min(100, item.value / 3)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Share Your One Page</h3>
                  <div className="mt-3 flex items-center gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                    <QrCode className="h-12 w-12 text-zinc-700 dark:text-zinc-300" />
                    <button className="rounded-full bg-gradient-to-r from-[#041B40] to-[#0A46A6] px-3 py-1.5 text-xs font-semibold text-white">
                      Download QR
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">Page URL</p>
                  <div className="mt-1 flex items-center justify-between rounded-md border border-zinc-200 px-2.5 py-2 dark:border-zinc-700">
                    <span className="text-xs text-zinc-700 dark:text-zinc-200">horecas.app/guidecafe</span>
                    <button className="text-xs font-medium text-[#0B2870]">Copy Link</button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[250px_1fr_250px]">
              <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Preview Your One Page</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">This is how customers see your page</p>
                <div className="mt-3 space-y-2 text-xs text-zinc-600 dark:text-zinc-300">
                  <div className="rounded-md border border-zinc-200 p-2 dark:border-zinc-700">Sections Added: 7</div>
                  <div className="rounded-md border border-zinc-200 p-2 dark:border-zinc-700">Action Items: 7</div>
                  <div className="rounded-md border border-zinc-200 p-2 dark:border-zinc-700">Promotions: 3</div>
                  <div className="rounded-md border border-zinc-200 p-2 dark:border-zinc-700">Flow Links: 5</div>
                </div>
              </div>
              <BuilderProvider>
                <ReadOnlyPhonePreview />
              </BuilderProvider>
              <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Share Your Page</h3>
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Page URL</p>
                <div className="mt-1 flex items-center justify-between rounded-md border border-zinc-200 px-2.5 py-2 dark:border-zinc-700">
                  <span className="text-xs text-zinc-700 dark:text-zinc-200">horecas.app/guidecafe</span>
                  <button className="text-xs font-medium text-[#0B2870]">Copy Link</button>
                </div>
                <h4 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-white">QR Code</h4>
                <div className="mt-2 flex h-28 items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700">
                  <QrCode className="h-16 w-16 text-zinc-700 dark:text-zinc-300" />
                </div>
                <button className="mt-3 w-full rounded-full bg-gradient-to-r from-[#041B40] to-[#0A46A6] py-2 text-xs font-semibold text-white">Download QR</button>
              </div>
            </div>
          )}
        </section>
      </div>

      <ConfirmDialog
        isOpen={showUnpublishDialog}
        onClose={() => setShowUnpublishDialog(false)}
        onConfirm={() => {
          setIsPublished(false);
          setToastMessage("One page unpublished successfully");
          setShowToast(true);
        }}
        title="Unpublish One Page"
        description="Your page will no longer be visible to customers."
        confirmLabel="Unpublish"
        cancelLabel="Cancel"
        variant="danger"
        icon={
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-500 dark:bg-rose-900/30 dark:text-rose-300">
            <Trash2 className="h-6 w-6" />
          </div>
        }
      />

      <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
}
