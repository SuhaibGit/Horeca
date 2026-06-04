"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock3,
  Eye,
  Pencil,
  Pause,
  Play,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import Modal from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";
import DetailDrawer from "@/components/DetailDrawer";
import StatCard from "@/components/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import ChannelChart from "@/components/dashboard/ChannelChart";
import Table, { TableColumn } from "@/components/Table";
import Toast from "@/components/Toast";

type OfferType = "Bank" | "Partner" | "Exclusive";
type PromotionStatus = "Active" | "Scheduled" | "Expired" | "Paused";
type ConfirmAction = "pause" | "reactivate" | "delete";

interface PromotionItem {
  id: string;
  name: string;
  type: OfferType;
  claim: number;
  expiry: string;
  status: PromotionStatus;
  discount: string;
  body: string;
  code: string;
}

type PricingType = "Fixed Price" | "Discount Offer";

interface WizardForm {
  offerType: OfferType;
  logoUrl: string;
  bannerUrl: string;
  offerName: string;
  offerTag: string;
  offerBody: string;
  discount: string;
  couponCode: string;
  ctaButtonText: string;
  pricingType: PricingType;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

const defaultWizardForm: WizardForm = {
  offerType: "Bank",
  logoUrl: "/horecaTemp1.png",
  bannerUrl: "",
  offerName: "Weekend Offer",
  offerTag: "",
  offerBody: "On HSBC Credit Cards Min Spend AED 200",
  discount: "20",
  couponCode: "LUXURY10",
  ctaButtonText: "",
  pricingType: "Discount Offer",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
};

const seedPromotions: PromotionItem[] = [
  { id: "p1", name: "Weekend Deal", type: "Bank", claim: 342, expiry: "01/04/2026", status: "Active", discount: "10%", body: "On Luxury Brand Credit Cards", code: "LUXURY10" },
  { id: "p2", name: "New Year Bonus", type: "Bank", claim: 731, expiry: "01/01/2027", status: "Scheduled", discount: "15%", body: "Instant discount on min spend", code: "NYBONUS" },
  { id: "p3", name: "Cyber Monday Deal", type: "Exclusive", claim: 357, expiry: "15/03/2025", status: "Paused", discount: "20%", body: "Online orders only", code: "CYBER20" },
  { id: "p4", name: "Summer Special", type: "Partner", claim: 263, expiry: "07/15/2026", status: "Scheduled", discount: "12%", body: "Partner cardholders offer", code: "SUMMER12" },
  { id: "p5", name: "Spring Promo", type: "Exclusive", claim: 485, expiry: "03/20/2026", status: "Active", discount: "8%", body: "All dine-in weekdays", code: "SPRING8" },
  { id: "p6", name: "Black Friday Offer", type: "Bank", claim: 914, expiry: "11/27/2025", status: "Expired", discount: "25%", body: "One-day mega deal", code: "BLACK25" },
];

const getStatusClass = (status: PromotionStatus) => {
  switch (status) {
    case "Active":
      return "bg-emerald-50 text-emerald-600";
    case "Scheduled":
      return "bg-amber-50 text-amber-600";
    case "Expired":
      return "bg-rose-50 text-rose-600";
    case "Paused":
      return "bg-violet-50 text-violet-600";
    default:
      return "bg-zinc-100 text-zinc-600";
  }
};

function InfoIcon() {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EBF7FF] text-[#0A46A6]">
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  );
}

export default function PromotionPage() {
  const [promotions, setPromotions] = useState<PromotionItem[]>(seedPromotions);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardForm, setWizardForm] = useState<WizardForm>(defaultWizardForm);
  const [editingPromotionId, setEditingPromotionId] = useState<string | null>(null);
  const [drawerItem, setDrawerItem] = useState<PromotionItem | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const totalClaims = useMemo(
    () => promotions.reduce((sum, item) => sum + item.claim, 0),
    [promotions]
  );

  const tableData = promotions;

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const updatePromotion = (id: string, patch: Partial<PromotionItem>) => {
    setPromotions((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    setDrawerItem((prev) => (prev && prev.id === id ? { ...prev, ...patch } : prev));
  };

  const openEditWizard = (item: PromotionItem) => {
    setDrawerItem(null);
    setEditingPromotionId(item.id);
    setWizardForm({
      ...defaultWizardForm,
      offerType: item.type,
      offerName: item.name,
      offerBody: item.body,
      discount: item.discount.replace("%", ""),
      couponCode: item.code,
      endDate: item.expiry,
    });
    setWizardStep(2);
    setWizardOpen(true);
  };

  const isEditingPromotion = Boolean(editingPromotionId);
  const offerDetailStepLabel = isEditingPromotion ? "Edit Offer Detail" : "Offer Detail";

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: "logoUrl" | "bannerUrl"
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToastMessage("Please upload a PNG or JPG image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToastMessage("Image must be 5MB or smaller.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setWizardForm((prev) => ({ ...prev, [field]: reader.result }));
      }
    };
    reader.onerror = () => {
      showToastMessage("Failed to upload image. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const renderUploadZone = (
    label: string,
    hint: string,
    field: "logoUrl" | "bannerUrl",
    tall = false
  ) => {
    const imageUrl = wizardForm[field];
    const inputId = `promotion-upload-${field}`;

    return (
      <div>
        <label htmlFor={inputId} className="mb-1 block text-xs font-semibold text-zinc-600">
          {label}
        </label>
        <div
          className={`relative overflow-hidden rounded-xl border border-dashed border-[#97B5E4] bg-[#FAFCFF] ${tall ? "h-[120px]" : "h-[84px]"
            }`}
        >
          {imageUrl ? (
            <div className="relative flex h-full items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Uploaded preview" className="max-h-full max-w-full rounded-lg object-contain" />
              <button
                type="button"
                onClick={() => setWizardForm((prev) => ({ ...prev, [field]: "" }))}
                className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-zinc-500 shadow hover:text-zinc-800"
                aria-label="Remove image"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <>
              <input
                id={inputId}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={(event) => handleImageUpload(event, field)}
              />
              <label
                htmlFor={inputId}
                className="flex h-full cursor-pointer flex-col items-center justify-center gap-1 px-3 text-sm font-medium text-[#0B2870]"
              >
                <Upload className="h-5 w-5" />
                <span>{hint}</span>
                <span className="text-[11px] font-normal text-zinc-500">PNG, JPG up to 5MB</span>
              </label>
            </>
          )}
        </div>
      </div>
    );
  };

  const handleConfirmAction = () => {
    if (!drawerItem || !confirmAction) return;

    const campaignName = drawerItem.name;

    if (confirmAction === "pause") {
      if (drawerItem.status !== "Active") {
        showToastMessage(`Unable to pause "${campaignName}". Please try again.`);
        return;
      }
      updatePromotion(drawerItem.id, { status: "Paused" });
      showToastMessage(`Campaign '${campaignName}' paused. Vouchers taken offline.`);
      return;
    }

    if (confirmAction === "reactivate") {
      if (drawerItem.status !== "Paused") {
        showToastMessage(`Unable to reactivate "${campaignName}". Please try again.`);
        return;
      }
      updatePromotion(drawerItem.id, { status: "Active" });
      showToastMessage(`Campaign '${campaignName}' reactivated successfully.`);
      return;
    }

    if (confirmAction === "delete") {
      setPromotions((prev) => prev.filter((item) => item.id !== drawerItem.id));
      setDrawerItem(null);
      showToastMessage(`Campaign '${campaignName}' deleted successfully.`);
    }
  };

  const renderDrawerFooter = (item: PromotionItem) => {
    if (item.status === "Scheduled") {
      return (
        <div className="flex w-full items-center gap-2">
          <button
            type="button"
            onClick={() => setConfirmAction("delete")}
            className="inline-flex w-1/2 items-center justify-center gap-1.5 rounded-full border border-rose-200 px-5 py-2.5 text-sm font-semibold text-rose-600"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
          <button
            type="button"
            onClick={() => openEditWizard(item)}
            className="inline-flex w-1/2 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#041B40] to-[#0A46A6] px-5 py-2.5 text-sm font-semibold text-white"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
        </div>
      );
    }

    if (item.status === "Paused") {
      return (
        <div className="flex w-full flex-col gap-2">
          <button
            type="button"
            onClick={() => setConfirmAction("reactivate")}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#041B40] to-[#0A46A6] px-5 py-2.5 text-sm font-semibold text-white"
          >
            <Play className="h-4 w-4" />
            Reactive
          </button>
          <div className="flex w-full items-center gap-2">
            <button
              type="button"
              onClick={() => setConfirmAction("delete")}
              className="inline-flex w-1/2 items-center justify-center gap-1.5 rounded-full border border-rose-200 px-5 py-2.5 text-sm font-semibold text-rose-600"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
            <button
              type="button"
              onClick={() => openEditWizard(item)}
              className="inline-flex w-1/2 items-center justify-center gap-1.5 rounded-full border border-[#0B2870] px-5 py-2.5 text-sm font-semibold text-[#0B2870]"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
          </div>
        </div>
      );
    }

    if (item.status === "Active") {
      return (
        <div className="flex w-full items-center gap-2">
          <button
            type="button"
            onClick={() => setConfirmAction("delete")}
            className="inline-flex w-1/2 items-center justify-center gap-1.5 rounded-full border border-rose-200 px-5 py-2.5 text-sm font-semibold text-rose-600"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
          <button
            type="button"
            onClick={() => setConfirmAction("pause")}
            className="inline-flex w-1/2 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#041B40] to-[#0A46A6] px-5 py-2.5 text-sm font-semibold text-white"
          >
            <Pause className="h-4 w-4" />
            Pause
          </button>
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={() => setConfirmAction("delete")}
        className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-rose-200 px-5 py-2.5 text-sm font-semibold text-rose-600"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </button>
    );
  };

  const columns: TableColumn<PromotionItem>[] = [
    {
      key: "name",
      header: "Promotion Name",
      render: (item) => (
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 rounded bg-zinc-100" />
          <span>{item.name}</span>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (item) => (
        <span className="rounded-full bg-gradient-to-r from-[#041B40] to-[#0A46A6] px-2 py-0.5 text-[11px] font-semibold text-white">
          {item.type}
        </span>
      ),
    },
    { key: "claim", header: "Claim" },
    { key: "expiry", header: "Expiry" },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${getStatusClass(item.status)}`}>
          {item.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: (item) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setDrawerItem(item);
          }}
          className="text-zinc-500 hover:text-zinc-700"
        >
          <Eye className="h-4 w-4" />
        </button>
      ),
    },
  ];

  const resetWizard = () => {
    setWizardStep(1);
    setWizardForm(defaultWizardForm);
    setEditingPromotionId(null);
  };

  const savePromotion = () => {
    const discount = `${wizardForm.discount || "10"}%`;
    const payload = {
      name: wizardForm.offerName || "Bank Offer",
      type: wizardForm.offerType,
      expiry: wizardForm.endDate || "12/31/2026",
      discount,
      body: wizardForm.offerBody || "Special card discount",
      code: wizardForm.couponCode || "PROMO10",
    };

    if (editingPromotionId) {
      updatePromotion(editingPromotionId, payload);
      showToastMessage("Promotion updated successfully.");
    } else {
      const next: PromotionItem = {
        id: `p-${Date.now()}`,
        claim: 0,
        status: wizardForm.startDate ? "Scheduled" : "Active",
        ...payload,
      };
      setPromotions((prev) => [next, ...prev]);
      showToastMessage("Your Bank Offer Create Successfully");
    }

    setWizardOpen(false);
    resetWizard();
  };

  return (
    <div className="flex-1 h-full overflow-y-auto   scrollbar-hide p-6">
      <div className="space-y-4">
        {promotions.length === 0 ? (
          <div className="flex min-h-[70vh] flex-col items-center justify-center rounded-2xl bg-white">
            <Image src="/emptyMark.png" alt="No Promotion" width={220} height={150} className="h-auto w-[220px]" />
            <h2 className="mt-4 text-xl font-semibold text-[#333839]">No Promotions Created Yet</h2>
            <p className="mt-1 text-center text-sm text-zinc-500">
              Create exclusive offers, bank card perks, loyalty rewards, and seasonal campaigns in just a few clicks.
            </p>
            <button
              type="button"
              onClick={() => setWizardOpen(true)}
              className="mt-5 rounded-full bg-gradient-to-r from-[#041B40] to-[#0A46A6] px-8 py-2.5 text-sm font-semibold text-white"
            >
              Create Promotion
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between rounded-xl bg-white p-4">
              <div>
                <h1 className="text-xl font-semibold text-[#333839]">Promotion Dashboard</h1>
                <p className="text-sm text-zinc-500">Track offer performance and manage campaigns.</p>
              </div>
              <button
                type="button"
                onClick={() => setWizardOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#041B40] to-[#0A46A6] px-4 py-2 text-sm font-semibold text-white"
              >
                <Plus className="h-4 w-4" />
                Create New Promotion
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard title="Active Promotions" value={`${tableData.filter((p) => p.status === "Active").length}`} iconType="orders" />
              <StatCard title="Revenue Generated" value="AED 200,050" iconType="revenue" />
              <StatCard title="Total Redeemers" value={`${totalClaims || 952}`} iconType="reservations" />
              <StatCard title="Conversion Rate" value="18.7%" iconType="value" />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
              <RevenueChart
                title="Revenue"
                activeTimeframe="Last 30 Days"
                className="!p-4"
                data={[
                  { label: "Jan", value: 75, displayValue: "AED 75,000" },
                  { label: "Feb", value: 45, displayValue: "AED 45,000" },
                  { label: "Mar", value: 80, displayValue: "AED 80,000" },
                  { label: "Apr", value: 78, displayValue: "AED 78,000" },
                  { label: "May", value: 55, displayValue: "AED 55,000" },
                  { label: "Jun", value: 78, displayValue: "AED 78,000" },
                  { label: "Jul", value: 52, displayValue: "AED 52,000" },
                  { label: "Aug", value: 32, displayValue: "AED 32,000" },
                  { label: "Sept", value: 65, displayValue: "AED 65,000" },
                  { label: "Oct", value: 55, displayValue: "AED 55,000" },
                  { label: "Nov", value: 48, displayValue: "AED 48,000" },
                  { label: "Dec", value: 72, displayValue: "AED 72,000" },
                ]}
              />
              <ChannelChart
                title="Top Promotion"
                totalLabel="Total"
                totalValue="100%"
                className="!p-4"
                data={[
                  { name: "Bank Offer", value: 150440, displayValue: "AED 150,440", percentage: 75, color: "#3CCB7F", hoverColor: "#2FB669" },
                  { name: "Partner Offer", value: 840, displayValue: "AED 840", percentage: 15, color: "#FD853A", hoverColor: "#EA580C" },
                  { name: "Exclusive Offer", value: 4680, displayValue: "AED 4,680", percentage: 10, color: "#53B1FD", hoverColor: "#2563EB" },
                ]}
              />
            </div>

            <Table<PromotionItem>
              columns={columns}
              data={tableData}
              searchPlaceholder="Search..."
              searchFilter={(item, query) =>
                item.name.toLowerCase().includes(query.toLowerCase()) ||
                item.type.toLowerCase().includes(query.toLowerCase())
              }
              onRowClick={(item) => setDrawerItem(item)}
              headerRight={
                <>
                  <button className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600">Type</button>
                  <button className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600">Status</button>
                </>
              }
            />
          </>
        )}
      </div>

      <Modal
        isOpen={wizardOpen}
        onClose={() => {
          setWizardOpen(false);
          resetWizard();
        }}
        size="3xl"
        className="!max-w-[920px]"
      >
        <div className="p-6">
          <div className="mb-6 grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${wizardStep >= step ? "bg-gradient-to-r from-[#041B40] to-[#0A46A6] text-white" : "bg-zinc-200 text-zinc-600"}`}>
                  {wizardStep > step ? <Check className="h-3.5 w-3.5" /> : step}
                </div>
                <span className="text-xs font-semibold text-zinc-700">
                  {step === 1 ? "Offer Type" : step === 2 ? offerDetailStepLabel : step === 3 ? "Schedule" : "Review & Confirm"}
                </span>
              </div>
            ))}
          </div>

          {wizardStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-[#333839]">Offer Type</h3>
              <p className="text-sm text-zinc-500">Choose Promotion</p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {(["Bank", "Partner", "Exclusive"] as OfferType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setWizardForm((prev) => ({ ...prev, offerType: type }))}
                    className={`rounded-2xl border p-4 text-left ${wizardForm.offerType === type ? "border-[#0B2870] bg-[#EBF7FF]" : "border-zinc-200"}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M9.99935 18.3327C14.5827 18.3327 18.3327 14.5827 18.3327 9.99935C18.3327 5.41602 14.5827 1.66602 9.99935 1.66602C5.41602 1.66602 1.66602 5.41602 1.66602 9.99935C1.66602 14.5827 5.41602 18.3327 9.99935 18.3327Z" stroke="#21AB70" strokeWidth="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M6.45898 10.0009L8.81732 12.3592L13.5423 7.64258" stroke="#21AB70" strokeWidth="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <h4 className="text-base font-semibold">{type} Offer</h4>
                    <p className="text-xs text-zinc-500">Create {type.toLowerCase()} based campaign offers.</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {wizardStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-[#333839]">{offerDetailStepLabel}</h3>

              {wizardForm.offerType === "Bank" && (
                <>
                  {renderUploadZone("Upload Logo (Optional)", "Click to upload Logo", "logoUrl")}
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-zinc-600">Offer Name</label>
                      <input
                        className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                        placeholder="Enter offer name"
                        value={wizardForm.offerName}
                        onChange={(e) => setWizardForm((prev) => ({ ...prev, offerName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-zinc-600">Offer Body Text</label>
                      <textarea
                        className="h-20 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                        placeholder="Enter offer body text"
                        value={wizardForm.offerBody}
                        onChange={(e) => setWizardForm((prev) => ({ ...prev, offerBody: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-zinc-600">Discount Value</label>
                        <div className="relative">
                          <input
                            className="w-full rounded-lg border border-zinc-200 px-3 py-2 pr-7 text-sm"
                            placeholder="20"
                            value={wizardForm.discount}
                            onChange={(e) => setWizardForm((prev) => ({ ...prev, discount: e.target.value }))}
                          />
                          <span className="absolute right-3 top-2.5 text-sm text-zinc-500">%</span>
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-zinc-600">Coupon Voucher Code</label>
                        <input
                          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                          placeholder="Enter voucher code"
                          value={wizardForm.couponCode}
                          onChange={(e) => setWizardForm((prev) => ({ ...prev, couponCode: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {wizardForm.offerType === "Partner" && (
                <>
                  {renderUploadZone("Upload Logo (Optional)", "Click to upload Logo", "logoUrl")}
                  {renderUploadZone("Upload Banner", "Click to upload Banner", "bannerUrl", true)}
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-zinc-600">Offer Title</label>
                      <input
                        className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                        placeholder="Enter offer name"
                        value={wizardForm.offerName}
                        onChange={(e) => setWizardForm((prev) => ({ ...prev, offerName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-zinc-600">Short Description</label>
                      <textarea
                        className="h-20 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                        placeholder="Enter offer body text"
                        value={wizardForm.offerBody}
                        onChange={(e) => setWizardForm((prev) => ({ ...prev, offerBody: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-zinc-600">Discount Value (Optional)</label>
                        <div className="relative">
                          <input
                            className="w-full rounded-lg border border-zinc-200 px-3 py-2 pr-7 text-sm"
                            placeholder="20"
                            value={wizardForm.discount}
                            onChange={(e) => setWizardForm((prev) => ({ ...prev, discount: e.target.value }))}
                          />
                          <span className="absolute right-3 top-2.5 text-sm text-zinc-500">%</span>
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-zinc-600">CTA Button Text</label>
                        <input
                          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                          placeholder="eg., Join Now, Subscribe Now"
                          value={wizardForm.ctaButtonText}
                          onChange={(e) => setWizardForm((prev) => ({ ...prev, ctaButtonText: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {wizardForm.offerType === "Exclusive" && (
                <>
                  {renderUploadZone("Upload Banner", "Click to upload Banner", "bannerUrl", true)}
                  <div className="grid grid-cols-1 gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-zinc-600">Offer Title</label>
                        <input
                          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                          placeholder="Enter offer name"
                          value={wizardForm.offerName}
                          onChange={(e) => setWizardForm((prev) => ({ ...prev, offerName: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-zinc-600">Offer Tag</label>
                        <input
                          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                          placeholder="Enter offer tag"
                          value={wizardForm.offerTag}
                          onChange={(e) => setWizardForm((prev) => ({ ...prev, offerTag: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-zinc-600">Short Description</label>
                      <textarea
                        className="h-20 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                        placeholder="Enter offer body text"
                        value={wizardForm.offerBody}
                        onChange={(e) => setWizardForm((prev) => ({ ...prev, offerBody: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-zinc-600">Pricing Type</label>
                      <select
                        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700"
                        value={wizardForm.pricingType}
                        onChange={(e) =>
                          setWizardForm((prev) => ({
                            ...prev,
                            pricingType: e.target.value as PricingType,
                          }))
                        }
                      >
                        <option value="Fixed Price">Fixed Price</option>
                        <option value="Discount Offer">Discount Offer</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {wizardStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-[#333839]">Schedule</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="date"
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                    value={wizardForm.startDate}
                    onChange={(e) => setWizardForm((prev) => ({ ...prev, startDate: e.target.value }))}
                  />
                  <Calendar className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-zinc-400" />
                </div>
                <div className="relative">
                  <input
                    type="time"
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                    value={wizardForm.startTime}
                    onChange={(e) => setWizardForm((prev) => ({ ...prev, startTime: e.target.value }))}
                  />
                  <Clock3 className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-zinc-400" />
                </div>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                    value={wizardForm.endDate}
                    onChange={(e) => setWizardForm((prev) => ({ ...prev, endDate: e.target.value }))}
                  />
                  <Calendar className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-zinc-400" />
                </div>
                <div className="relative">
                  <input
                    type="time"
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                    value={wizardForm.endTime}
                    onChange={(e) => setWizardForm((prev) => ({ ...prev, endTime: e.target.value }))}
                  />
                  <Clock3 className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-zinc-400" />
                </div>
              </div>
            </div>
          )}

          {wizardStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-[#333839]">Review & Confirm</h3>
              <div className="rounded-2xl bg-[#F7F4F2] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="h-8 w-8 rounded-full bg-white" />
                    <h4 className="text-4xl font-semibold text-[#1F3D35]">{wizardForm.discount}% Instant Discount</h4>
                    <p className="text-lg text-zinc-600">on {wizardForm.offerBody}</p>
                    <p className="text-2xl font-medium text-[#2F3A3B]">Min. spend AED 200</p>
                    <div className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2">
                      <span className="text-zinc-500">Code:</span>
                      <span className="font-semibold">{wizardForm.couponCode}</span>
                    </div>
                  </div>
                  <div className="h-28 w-44 rounded-xl bg-black/90" />
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setWizardStep((prev) => Math.max(1, prev - 1))}
              className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
            {wizardStep < 4 ? (
              <button
                type="button"
                onClick={() => setWizardStep((prev) => Math.min(4, prev + 1))}
                className="rounded-full bg-gradient-to-r from-[#041B40] to-[#0A46A6] px-5 py-2 text-xs font-semibold text-white"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={savePromotion}
                className="rounded-full bg-gradient-to-r from-[#041B40] to-[#0A46A6] px-5 py-2 text-xs font-semibold text-white"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </Modal>

      <DetailDrawer
        isOpen={Boolean(drawerItem)}
        onClose={() => setDrawerItem(null)}
        title={drawerItem?.type === "Bank" ? "Bank Offer" : drawerItem?.name ?? "Offer Detail"}
        badge={
          drawerItem ? (
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${getStatusClass(drawerItem.status)}`}>
              {drawerItem.status}
            </span>
          ) : null
        }
        maxWidthClass="max-w-[520px]"
        footer={drawerItem ? renderDrawerFooter(drawerItem) : undefined}
      >
        {drawerItem ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-[#F7F4F2] p-4">
              <p className="text-2xl font-semibold text-[#1F3D35]">{drawerItem.discount} Instant Discount</p>
              <p className="mt-1 text-sm text-zinc-600">on {drawerItem.body}</p>
              <p className="mt-1 text-sm font-medium text-[#2F3A3B]">Min. spend AED 200</p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-1.5">
                <span className="text-xs text-zinc-500">Code:</span>
                <span className="text-sm font-semibold">{drawerItem.code}</span>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-[#333839]">Real-time Performance</p>
              <div className="grid grid-cols-2 gap-3 rounded-xl border border-zinc-200 p-4">
                <div>
                  <p className="text-xs text-zinc-500">Voucher Clicks</p>
                  <p className="text-lg font-semibold">{Math.max(drawerItem.claim * 4, 1420)}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Voucher Claims</p>
                  <p className="text-lg font-semibold">{drawerItem.claim}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Revenue</p>
                  <p className="text-lg font-semibold">AED 42,850</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Conversion Rate</p>
                  <p className="text-lg font-semibold">24.10%</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DetailDrawer>

      <ConfirmDialog
        isOpen={confirmAction === "pause"}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
        title="Pause Promotion?"
        description={`This will take "${drawerItem?.name ?? "this campaign"}" offline. Customers will no longer see vouchers on your One Pager, Offers page, and active menus.`}
        confirmLabel="Pause Promotion"
        cancelLabel="Cancel"
        variant="primary"
        icon={<InfoIcon />}
      />

      <ConfirmDialog
        isOpen={confirmAction === "reactivate"}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
        title="Reactivate Promotion?"
        description={`This will bring the campaign back online instantly. Customers will see ${drawerItem?.name ?? "this offer"} across your One Pager Homepage, Offers page, and active menus again.`}
        confirmLabel="Reactive Promotion"
        cancelLabel="Cancel"
        variant="primary"
        icon={<InfoIcon />}
      />

      <ConfirmDialog
        isOpen={confirmAction === "delete"}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
        title="Delete Promotion?"
        description={`Are you sure you want to delete "${drawerItem?.name ?? "this promotion"}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
      />

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => {
          setShowToast(false);
          setToastMessage("");
        }}
      />
    </div>
  );
}

