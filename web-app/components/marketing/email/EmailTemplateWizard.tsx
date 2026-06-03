"use client";

import React, { useEffect, useState } from "react";
import FullScreenShell from "../../FullScreenShell";
import CampaignWizardStepper from "../campaign/CampaignWizardStepper";
import CampaignWizardFooter from "../campaign/CampaignWizardFooter";
import SelectAudienceStep from "../campaign/steps/SelectAudienceStep";
import ScheduleStep from "../campaign/steps/ScheduleStep";
import EmailBuilderStep from "./EmailBuilderStep";
import EmailCampaignReviewStep from "./EmailCampaignReviewStep";
import {
  EMAIL_TEMPLATE_WIZARD_STEPS,
  EmailTemplate,
  EmailTemplateStatus,
  createEmptyEmailTemplateForm,
  emailTemplateToForm,
} from "../../../data/mockEmailTemplates";
import {
  EmailBlock,
  EmailBuilderSettings,
  normalizeEmailSettings,
} from "../../../data/mockEmailCampaigns";

export type EmailTemplateSaveAction = "draft" | "publish";

interface EmailTemplateWizardProps {
  mode: "create" | "edit";
  initialTemplate?: EmailTemplate | null;
  onClose: () => void;
  onSave: (template: EmailTemplate, action: EmailTemplateSaveAction) => void;
}

export default function EmailTemplateWizard({
  mode,
  initialTemplate,
  onClose,
  onSave,
}: EmailTemplateWizardProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [audienceIds, setAudienceIds] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<EmailBlock[]>([]);
  const [settings, setSettings] = useState<EmailBuilderSettings>(
    createEmptyEmailTemplateForm().settings
  );
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const isBuilderStep = step === 2;

  useEffect(() => {
    setStep(1);
    if (mode === "edit" && initialTemplate) {
      const form = emailTemplateToForm(initialTemplate);
      setName(form.name);
      setDescription(form.description);
      setSubject(form.subject);
      setAudienceIds(form.audienceIds);
      setBlocks(form.blocks);
      setSettings(form.settings);
      setScheduleDate(form.scheduleDate);
      setScheduleTime(form.scheduleTime);
    } else {
      const empty = createEmptyEmailTemplateForm();
      setName(empty.name);
      setDescription(empty.description);
      setSubject(empty.subject);
      setAudienceIds(empty.audienceIds);
      setBlocks(empty.blocks);
      setSettings(empty.settings);
      setScheduleDate(empty.scheduleDate);
      setScheduleTime(empty.scheduleTime);
    }
  }, [mode, initialTemplate]);

  const toggleAudience = (id: string) => {
    setAudienceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const buildTemplate = (action: EmailTemplateSaveAction): EmailTemplate => {
    const now = new Date().toISOString();
    let status: EmailTemplateStatus = "draft";
    if (action === "publish") status = "published";

    return {
      id: initialTemplate?.id ?? `tpl-${Date.now()}`,
      name: name.trim() || "Untitled Template",
      description:
        description.trim() || "Reusable email template for restaurant marketing.",
      subject: subject.trim() || name.trim() || "Untitled",
      audienceIds,
      blocks,
      settings: normalizeEmailSettings(settings),
      scheduleDate,
      scheduleTime,
      status,
      stats: initialTemplate?.stats ?? {
        totalCustomers: 0,
        opened: 0,
        clicked: 0,
        pending: 0,
      },
      createdAt: initialTemplate?.createdAt ?? now,
      updatedAt: now,
    };
  };

  const handleSaveDraft = () => {
    onSave(buildTemplate("draft"), "draft");
    onClose();
  };

  const handleContinue = () => {
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    onSave(buildTemplate("publish"), "publish");
    onClose();
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      return;
    }
    onClose();
  };

  const continueDisabled =
    (step === 1 && audienceIds.length === 0) ||
    (step === 2 && (!name.trim() || !subject.trim() || blocks.length === 0));

  const continueLabel = step === 3 ? "Preview" : step === 4 ? "Create Template" : "Continue";

  const title =
    mode === "edit" ? "Edit Template" : "Create New Template";

  const footer = (
    <CampaignWizardFooter
      currentStep={step}
      onBack={handleBack}
      onSaveDraft={handleSaveDraft}
      onContinue={handleContinue}
      continueLabel={continueLabel}
      continueDisabled={continueDisabled}
    />
  );

  if (isBuilderStep) {
    return (
      <FullScreenShell>
        <div className="flex flex-col h-full w-full bg-white dark:bg-zinc-900">
          <header className="shrink-0 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-4 px-4 sm:px-6 lg:px-8 py-4">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-zinc-500 hover:text-zinc-800 cursor-pointer shrink-0 w-[100px]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <div className="flex-1 flex justify-center">
                <div className="w-full max-w-3xl">
                  <CampaignWizardStepper
                    currentStep={step}
                    steps={EMAIL_TEMPLATE_WIZARD_STEPS}
                    compact
                  />
                </div>
              </div>
              <div className="hidden sm:block shrink-0 w-[100px]" aria-hidden />
            </div>
          </header>
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            <EmailBuilderStep
              name={name}
              subject={subject}
              description={description}
              showDescription
              blocks={blocks}
              settings={settings}
              onNameChange={setName}
              onSubjectChange={setSubject}
              onDescriptionChange={setDescription}
              onBlocksChange={setBlocks}
              onSettingsChange={setSettings}
            />
          </div>
          {footer}
        </div>
      </FullScreenShell>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col max-h-[calc(100vh-12rem)]">
      <div className="px-6 sm:px-8 pt-6 pb-2 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-zinc-500 hover:text-zinc-800 cursor-pointer mb-3"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h2 className="text-[20px] font-bold text-zinc-900 dark:text-white">{title}</h2>
      </div>

      <CampaignWizardStepper currentStep={step} steps={EMAIL_TEMPLATE_WIZARD_STEPS} />

      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        {step === 1 && (
          <div className="flex-1 overflow-y-auto">
            <SelectAudienceStep selectedIds={audienceIds} onToggle={toggleAudience} />
          </div>
        )}
        {step === 3 && (
          <div className="flex-1 overflow-y-auto">
            <ScheduleStep
              scheduleDate={scheduleDate}
              scheduleTime={scheduleTime}
              onDateChange={setScheduleDate}
              onTimeChange={setScheduleTime}
            />
          </div>
        )}
        {step === 4 && (
          <div className="flex-1 overflow-hidden">
            <EmailCampaignReviewStep
              name={name}
              subject={subject}
              audienceIds={audienceIds}
              blocks={blocks}
              settings={settings}
              detailsTitle="Template Details"
              entityLabel="Template"
            />
          </div>
        )}
      </div>

      {footer}
    </div>
  );
}
