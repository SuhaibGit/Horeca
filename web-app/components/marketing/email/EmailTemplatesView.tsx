"use client";

import React, { useMemo, useState } from "react";
import EmptyState from "../../EmptyState";
import Toast from "../../Toast";
import ConfirmDialog from "../../ConfirmDialog";
import EmailTemplateCard from "./EmailTemplateCard";
import EmailTemplateWizard, { EmailTemplateSaveAction } from "./EmailTemplateWizard";
import EmailTemplateDetailDrawer from "./EmailTemplateDetailDrawer";
import {
  EmailTemplate,
  templateToCampaignDraft,
} from "../../../data/mockEmailTemplates";
import {
  deleteEmailTemplate,
  loadEmailTemplates,
  upsertEmailTemplate,
} from "../../../lib/emailTemplateStorage";
import { upsertEmailCampaign } from "../../../lib/emailCampaignStorage";

const TEMPLATE_ILLUSTRATION = "/emptyMark.png";

const TEMPLATE_TAB_OPTIONS = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
];

interface EmailTemplatesViewProps {
  onUseTemplate?: (campaignId: string) => void;
  onSwitchToCampaigns?: () => void;
}

export default function EmailTemplatesView({
  onUseTemplate,
  onSwitchToCampaigns,
}: EmailTemplatesViewProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [listTab, setListTab] = useState("all");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardMode, setWizardMode] = useState<"create" | "edit">("create");
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [detailTemplate, setDetailTemplate] = useState<EmailTemplate | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  React.useEffect(() => {
    setTemplates(loadEmailTemplates());
    setHydrated(true);
  }, []);

  const filtered = useMemo(() => {
    if (listTab === "draft") return templates.filter((t) => t.status === "draft");
    return templates;
  }, [templates, listTab]);

  const openCreate = () => {
    setWizardMode("create");
    setEditingTemplate(null);
    setWizardOpen(true);
  };

  const openEdit = (t: EmailTemplate) => {
    setWizardMode("edit");
    setEditingTemplate(t);
    setWizardOpen(true);
  };

  const openView = (t: EmailTemplate) => {
    setDetailTemplate(t);
    setDrawerOpen(true);
  };

  const handleSave = (template: EmailTemplate, _action: EmailTemplateSaveAction) => {
    const list = upsertEmailTemplate(template);
    setTemplates(list);
    setToastMessage(
      wizardMode === "edit" ? "Template updated successfully" : "Template created successfully"
    );
    setShowToast(true);
  };

  const confirmDelete = () => {
    if (!deleteConfirmId) return;
    setTemplates(deleteEmailTemplate(deleteConfirmId));
    setDeleteConfirmId(null);
    if (detailTemplate?.id === deleteConfirmId) {
      setDrawerOpen(false);
      setDetailTemplate(null);
    }
    setToastMessage("Template deleted successfully");
    setShowToast(true);
  };

  const handleUseTemplate = (t: EmailTemplate) => {
    const draft = templateToCampaignDraft(t);
    upsertEmailCampaign(draft);
    setToastMessage("Campaign draft created from template");
    setShowToast(true);
    onUseTemplate?.(draft.id);
    onSwitchToCampaigns?.();
  };

  if (!hydrated) return null;

  if (wizardOpen) {
    return (
      <EmailTemplateWizard
        mode={wizardMode}
        initialTemplate={editingTemplate}
        onClose={() => setWizardOpen(false)}
        onSave={handleSave}
      />
    );
  }

  const showEmpty = templates.length === 0;

  return (
    <>
      <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-[24px] font-semibold text-[#333839] dark:text-white tracking-[-0.15px]">
            Email Templates
          </h1>
          <p className="text-[14px] font-medium text-zinc-500 dark:text-zinc-400 mt-1">
            Create and manage reusable email templates
          </p>
        </div>
        {!showEmpty && (
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-[13px] font-bold shadow-sm cursor-pointer transition-all shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Create New Email Template
          </button>
        )}
      </div>

      {!showEmpty && (
        <>
          <section className="flex flex-wrap items-center gap-2">
            {TEMPLATE_TAB_OPTIONS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setListTab(t.value)}
                className={`px-4 py-2 rounded-full text-[12px] font-bold transition-all cursor-pointer ${listTab === t.value
                  ? "bg-linear-to-r from-[#041B40] to-[#0A46A6] text-white"
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-600"
                  }`}
              >
                {t.label}
              </button>
            ))}
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((template) => (
              <EmailTemplateCard
                key={template.id}
                template={template}
                onView={() => openView(template)}
              />
            ))}
          </section>
        </>
      )}

      {showEmpty && (
        <div className="bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-100 dark:border-zinc-800 shadow-sm min-h-[480px] flex items-center justify-center">
          <EmptyState
            imageSrc={TEMPLATE_ILLUSTRATION}
            imageAlt="No email templates"
            title="No Email Templates Yet"
            description="Create reusable restaurant email templates for promotions, events, and customer engagement."
            action={
              <button
                type="button"
                onClick={openCreate}
                className="w-full max-w-sm mx-auto px-8 py-3.5 rounded-full bg-linear-to-r from-[#041B40] to-[#0A46A6] hover:opacity-95 text-white text-[14px] font-bold transition-all cursor-pointer shadow-sm"
              >
                Create Template
              </button>
            }
          />
        </div>
      )}

      <EmailTemplateDetailDrawer
        template={detailTemplate}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onEdit={openEdit}
        onDelete={(id) => setDeleteConfirmId(id)}
        onUseTemplate={handleUseTemplate}
      />

      <ConfirmDialog
        isOpen={deleteConfirmId != null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={confirmDelete}
        title="Delete Template?"
        description="Are you sure you want to delete this template? This action cannot be undone."
        confirmLabel="Delete Template"
        cancelLabel="Cancel"
        variant="danger"
      />
    </>
  );
}
