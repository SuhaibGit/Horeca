"use client";

import React, { useMemo, useState } from "react";
import StatCard from "../StatCard";
import Table, { TableColumn } from "../Table";
import Dropdown from "../Dropdown";
import EmptyState from "../EmptyState";
import ActionMenu from "../ActionMenu";
import Toast from "../Toast";
import ConfirmDialog from "../ConfirmDialog";
import CampaignWizardModal, { CampaignSaveAction } from "./campaign/CampaignWizardModal";
import {
  MOCK_CAMPAIGN_STATS,
  WhatsAppCampaign,
  WhatsAppCampaignStatus,
  getAudienceLabels,
} from "../../data/mockWhatsAppCampaigns";
import {
  deleteCampaign,
  loadCampaigns,
  upsertCampaign,
} from "../../lib/whatsappCampaignStorage";

const TAB_OPTIONS = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Schedule" },
];

const TIME_FILTER_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
];

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "Status" },
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
  { value: "sent", label: "Sent" },
  { value: "failed", label: "Failed" },
];

function statusStyles(status: WhatsAppCampaignStatus) {
  switch (status) {
    case "sent":
      return "text-emerald-600 dark:text-emerald-400";
    case "scheduled":
      return "text-blue-600 dark:text-blue-400";
    case "failed":
      return "text-red-600 dark:text-red-400";
    case "draft":
    default:
      return "text-amber-600 dark:text-amber-400";
  }
}

function formatDisplayDate(isoDate: string) {
  if (!isoDate) return "—";
  const [y, m, d] = isoDate.split("-");
  if (!d) return isoDate;
  return `${d}/${m}/${y}`;
}

interface WhatsAppCampaignsViewProps {
  businessName?: string;
}

export default function WhatsAppCampaignsView({ businessName }: WhatsAppCampaignsViewProps) {
  const [campaigns, setCampaigns] = useState<WhatsAppCampaign[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [tab, setTab] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardMode, setWizardMode] = useState<"create" | "edit">("create");
  const [editingCampaign, setEditingCampaign] = useState<WhatsAppCampaign | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  React.useEffect(() => {
    setCampaigns(loadCampaigns());
    setHydrated(true);
  }, []);

  const filtered = useMemo(() => {
    let list = [...campaigns];
    if (tab === "draft") list = list.filter((c) => c.status === "draft");
    if (tab === "scheduled") list = list.filter((c) => c.status === "scheduled");
    if (statusFilter !== "all") list = list.filter((c) => c.status === statusFilter);
    return list;
  }, [campaigns, tab, statusFilter]);

  const stats = useMemo(() => {
    const scheduled = campaigns.filter((c) => c.status === "scheduled").length;
    return {
      total: MOCK_CAMPAIGN_STATS.totalCampaigns,
      sent: MOCK_CAMPAIGN_STATS.sent,
      scheduled: scheduled || MOCK_CAMPAIGN_STATS.scheduled,
    };
  }, [campaigns]);

  const openCreate = () => {
    setWizardMode("create");
    setEditingCampaign(null);
    setWizardOpen(true);
  };

  const openEdit = (c: WhatsAppCampaign) => {
    setWizardMode("edit");
    setEditingCampaign(c);
    setWizardOpen(true);
  };

  const handleSave = (campaign: WhatsAppCampaign, _action: CampaignSaveAction) => {
    const list = upsertCampaign(campaign);
    setCampaigns(list);
    setToastMessage(
      wizardMode === "edit" ? "Campaign updated successfully" : "Campaign created successfully"
    );
    setShowToast(true);
  };

  const confirmDelete = () => {
    if (!deleteConfirmId) return;
    setCampaigns(deleteCampaign(deleteConfirmId));
    setDeleteConfirmId(null);
    setToastMessage("Campaign deleted successfully");
    setShowToast(true);
  };

  const searchFilter = (c: WhatsAppCampaign, q: string) => {
    const term = q.toLowerCase();
    return c.name.toLowerCase().includes(term);
  };

  const columns: TableColumn<WhatsAppCampaign>[] = [
    {
      key: "name",
      header: "Campaign",
      render: (c) => (
        <span className="font-bold text-zinc-850 dark:text-zinc-100">{c.name}</span>
      ),
    },
    {
      key: "audience",
      header: "Audience",
      render: (c) => {
        const labels = getAudienceLabels(c.audienceIds);
        const visible = labels.slice(0, 2);
        const extra = labels.length - visible.length;
        return (
          <div className="flex flex-wrap items-center gap-1.5">
            {visible.map((label) => (
              <span
                key={label}
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#EBF7FF]  dark:bg-emerald-950/40 text-[#0A46A6] dark:text-[#28A388] border border-emerald-100/60 dark:border-emerald-900/40"
              >
                {label}
              </span>
            ))}
            {extra > 0 && (
              <span className="text-[11px] font-bold text-zinc-500">+{extra} more</span>
            )}
          </div>
        );
      },
    },
    {
      key: "date",
      header: "Date",
      render: (c) => (
        <span className="font-semibold text-zinc-600 dark:text-zinc-300">
          {formatDisplayDate(c.scheduleDate)}
        </span>
      ),
    },
    {
      key: "opened",
      header: "Opened",
      render: (c) => (
        <span className="font-semibold text-zinc-600 dark:text-zinc-300">
          {c.opened != null ? c.opened.toLocaleString() : "—"}
        </span>
      ),
    },
    {
      key: "clicked",
      header: "Clicked",
      render: (c) => (
        <span className="font-semibold text-zinc-600 dark:text-zinc-300">
          {c.clicked != null ? c.clicked.toLocaleString() : "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (c) => (
        <span className={`font-bold capitalize ${statusStyles(c.status)}`}>{c.status}</span>
      ),
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      render: (c) => (
        <ActionMenu
          items={[
            { id: "edit", label: "Edit Campaign", onClick: () => openEdit(c) },
            {
              id: "delete",
              label: "Delete",
              variant: "danger",
              onClick: () => setDeleteConfirmId(c.id),
            },
          ]}
        />
      ),
    },
  ];

  if (!hydrated) return null;

  const showEmpty = campaigns.length === 0;
  const showTable = !showEmpty;

  return (
    <div className="space-y-6 select-none">
      <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-[24px] font-semibold text-[#333839] dark:text-white tracking-[-0.15px]">
            WhatsApp Campaigns
          </h1>
          <p className="text-[14px] font-medium text-zinc-500 dark:text-zinc-400 mt-1">
            Create and manage WhatsApp promotional campaigns
          </p>
        </div>
        {showTable && (
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-[#041B40] to-[#0A46A6] hover:bg-zinc-800  text-white text-[13px] font-bold shadow-sm cursor-pointer transition-all shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Create WhatsApp Campaign
          </button>
        )}
      </div>

      {showTable && (
        <>
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard title="Total Campaigns" value={String(stats.total)} iconType="orders" />
            <StatCard title="Sent" value={String(stats.sent)} iconType="reservations" />
            <StatCard title="Scheduled" value={String(stats.scheduled)} iconType="revenue" />
          </section>

          <section className="flex flex-wrap items-center gap-2">
            {TAB_OPTIONS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTab(t.value)}
                className={`px-4 py-2 rounded-full text-[12px] font-bold transition-all cursor-pointer ${tab === t.value
                  ? "bg-linear-to-r from-[#041B40] to-[#0A46A6] text-white"
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300"
                  }`}
              >
                {t.label}
              </button>
            ))}
          </section>

          <section>
            <Table
              columns={columns}
              data={filtered}
              searchPlaceholder="Search..."
              searchFilter={searchFilter}
              initialRowsPerPage={10}
              headerRight={
                <>
                  <Dropdown options={TIME_FILTER_OPTIONS} value={timeFilter} onChange={setTimeFilter} />
                  <Dropdown
                    options={STATUS_FILTER_OPTIONS}
                    value={statusFilter}
                    onChange={setStatusFilter}
                  />
                </>
              }
            />
          </section>
        </>
      )}

      {showEmpty && (
        <div className="bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-100 dark:border-zinc-800 shadow-sm min-h-[480px] flex items-center justify-center">
          <EmptyState
            imageSrc="/emptyMark.png"
            imageAlt="No WhatsApp campaigns"
            title="No WhatsApp Campaigns Yet"
            description="Create promotional WhatsApp campaigns, offers, and customer engagement messages for your restaurant."
            action={
              <button
                type="button"
                onClick={openCreate}
                className="w-full max-w-sm mx-auto px-8 py-3.5 rounded-full bg-linear-to-r from-[#041B40] to-[#0A46A6] hover:opacity-95 text-white text-[14px] font-bold transition-all cursor-pointer shadow-sm"
              >
                Create WhatsApp Campaign
              </button>
            }
          />
        </div>
      )}

      <CampaignWizardModal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        mode={wizardMode}
        initialCampaign={editingCampaign}
        businessName={businessName}
        onSave={handleSave}
      />

      <ConfirmDialog
        isOpen={deleteConfirmId != null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={confirmDelete}
        title="Delete Campaign?"
        description="Are you sure you want to delete this Campaign? This action cannot be undone."
        confirmLabel="Delete Campaign"
        cancelLabel="Cancel"
        variant="danger"
      />
    </div>
  );
}
