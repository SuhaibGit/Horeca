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
  EMAIL_WIZARD_STEPS,
  EmailBlock,
  EmailBuilderSettings,
  EmailCampaign,
  createEmptyEmailCampaignForm,
  emailCampaignToForm,
} from "../../../data/mockEmailCampaigns";

export type EmailCampaignSaveAction = "draft" | "scheduled" | "sent";

interface EmailCampaignWizardProps {
  mode: "create" | "edit";
  initialCampaign?: EmailCampaign | null;
  onClose: () => void;
  onSave: (campaign: EmailCampaign, action: EmailCampaignSaveAction) => void;
}

export default function EmailCampaignWizard({
  mode,
  initialCampaign,
  onClose,
  onSave,
}: EmailCampaignWizardProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [audienceIds, setAudienceIds] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<EmailBlock[]>([]);
  const [settings, setSettings] = useState<EmailBuilderSettings>(
    createEmptyEmailCampaignForm().settings
  );
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const isBuilderStep = step === 2;

  useEffect(() => {
    setStep(1);
    if (mode === "edit" && initialCampaign) {
      const form = emailCampaignToForm(initialCampaign);
      setName(form.name);
      setSubject(form.subject);
      setAudienceIds(form.audienceIds);
      setBlocks(form.blocks);
      setSettings(form.settings);
      setScheduleDate(form.scheduleDate);
      setScheduleTime(form.scheduleTime);
    } else {
      const empty = createEmptyEmailCampaignForm();
      setName(empty.name);
      setSubject(empty.subject);
      setAudienceIds(empty.audienceIds);
      setBlocks(empty.blocks);
      setSettings(empty.settings);
      setScheduleDate(empty.scheduleDate);
      setScheduleTime(empty.scheduleTime);
    }
  }, [mode, initialCampaign]);

  const toggleAudience = (id: string) => {
    setAudienceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const buildCampaign = (action: EmailCampaignSaveAction): EmailCampaign => {
    const now = new Date().toISOString();
    let status: EmailCampaign["status"] = "draft";
    if (action === "scheduled") status = "scheduled";
    if (action === "sent") status = "sent";

    return {
      id: initialCampaign?.id ?? `em-${Date.now()}`,
      name: name.trim() || "Untitled Campaign",
      subject: subject.trim() || name.trim() || "Untitled",
      audienceIds,
      blocks,
      settings,
      scheduleDate,
      scheduleTime,
      status,
      opened: initialCampaign?.opened,
      clicked: initialCampaign?.clicked,
      createdAt: initialCampaign?.createdAt ?? now,
      updatedAt: now,
    };
  };

  const handleSaveDraft = () => {
    onSave(buildCampaign("draft"), "draft");
    onClose();
  };

  const handleContinue = () => {
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    const hasSchedule = scheduleDate && scheduleTime;
    onSave(buildCampaign(hasSchedule ? "scheduled" : "sent"), hasSchedule ? "scheduled" : "sent");
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

  const continueLabel = step === 3 ? "Preview" : step === 4 ? "Send Now" : "Continue";

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
          <header className="shrink-0 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <div className="flex items-center gap-4 px-4 sm:px-6 lg:px-8 py-4">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer shrink-0 w-[100px]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              <div className="flex-1 min-w-0 flex justify-center">
                <div className="w-full max-w-3xl">
                  <CampaignWizardStepper currentStep={step} steps={EMAIL_WIZARD_STEPS} compact />
                </div>
              </div>

              <div className="hidden sm:block shrink-0 w-[100px]" aria-hidden />
            </div>
          </header>

          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            <EmailBuilderStep
              name={name}
              subject={subject}
              blocks={blocks}
              settings={settings}
              onNameChange={setName}
              onSubjectChange={setSubject}
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
      <div className="px-6 sm:px-8 pt-6 pb-2 border-b border-zinc-100 dark:border-zinc-800 shrink-0 flex items-start justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-[13px] font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer mb-3"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h2 className="text-[20px] font-bold text-zinc-900 dark:text-white">
            {mode === "edit" ? "Edit Campaign" : "Create New Campaign"}
          </h2>
        </div>
      </div>

      <CampaignWizardStepper currentStep={step} steps={EMAIL_WIZARD_STEPS} />

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
          <div className="flex-1 overflow-y-auto">
            <EmailCampaignReviewStep
              name={name}
              subject={subject}
              audienceIds={audienceIds}
              blocks={blocks}
              settings={settings}
            />
          </div>
        )}
      </div>

      {footer}
    </div>
  );
}
