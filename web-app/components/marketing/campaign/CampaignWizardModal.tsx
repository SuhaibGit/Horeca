"use client";

import React, { useEffect, useState } from "react";
import Modal from "../../Modal";
import CampaignWizardStepper from "./CampaignWizardStepper";
import CampaignWizardFooter from "./CampaignWizardFooter";
import SelectAudienceStep from "./steps/SelectAudienceStep";
import CreateMessageStep from "./steps/CreateMessageStep";
import ScheduleStep from "./steps/ScheduleStep";
import ReviewStep from "./steps/ReviewStep";
import {
  CampaignCtaButton,
  CampaignMediaType,
  WhatsAppCampaign,
  campaignToForm,
  createEmptyCampaignForm,
} from "../../../data/mockWhatsAppCampaigns";

export type CampaignSaveAction = "draft" | "scheduled" | "sent";

interface CampaignWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  initialCampaign?: WhatsAppCampaign | null;
  businessName?: string;
  onSave: (campaign: WhatsAppCampaign, action: CampaignSaveAction) => void;
}

function newButtonId() {
  return `btn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export default function CampaignWizardModal({
  isOpen,
  onClose,
  mode,
  initialCampaign,
  businessName,
  onSave,
}: CampaignWizardModalProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [audienceIds, setAudienceIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [mediaType, setMediaType] = useState<CampaignMediaType>("image");
  const [mediaFileName, setMediaFileName] = useState<string | undefined>();
  const [buttons, setButtons] = useState<CampaignCtaButton[]>([
    { id: "btn-1", label: "", url: "" },
    { id: "btn-2", label: "", url: "" },
    { id: "btn-3", label: "", url: "" },
  ]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setStep(1);
    if (mode === "edit" && initialCampaign) {
      const form = campaignToForm(initialCampaign);
      setName(form.name);
      setAudienceIds(form.audienceIds);
      setMessage(form.message);
      setMediaType(form.mediaType);
      setMediaFileName(form.mediaFileName);
      setButtons(form.buttons);
      setScheduleDate(form.scheduleDate);
      setScheduleTime(form.scheduleTime);
    } else {
      const empty = createEmptyCampaignForm();
      setName(empty.name);
      setAudienceIds(empty.audienceIds);
      setMessage(empty.message);
      setMediaType(empty.mediaType);
      setMediaFileName(undefined);
      setButtons(empty.buttons);
      setScheduleDate(empty.scheduleDate);
      setScheduleTime(empty.scheduleTime);
    }
  }, [isOpen, mode, initialCampaign]);

  const toggleAudience = (id: string) => {
    setAudienceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const buildCampaign = (action: CampaignSaveAction): WhatsAppCampaign => {
    const now = new Date().toISOString();
    const activeButtons = buttons.filter((b) => b.label.trim() && b.url.trim());
    let status: WhatsAppCampaign["status"] = "draft";
    if (action === "scheduled") status = "scheduled";
    if (action === "sent") status = "sent";

    return {
      id: initialCampaign?.id ?? `wa-${Date.now()}`,
      name: name.trim() || "Untitled Campaign",
      audienceIds,
      message: message.trim(),
      mediaType,
      mediaFileName,
      buttons: activeButtons,
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

  const continueDisabled =
    (step === 1 && audienceIds.length === 0) ||
    (step === 2 && (!name.trim() || !message.trim())) ||
    (step === 3 && (!scheduleDate || !scheduleTime));

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" className="!rounded-[24px] !max-w-[900px]">
      <div className="flex flex-col max-h-[90vh]">
        <div className="px-6 sm:px-8 pt-6 pb-2 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <h2 className="text-[20px] font-bold text-zinc-900 dark:text-white pr-10">
            {mode === "edit" ? "Edit Campaign" : "Create New Campaign"}
          </h2>
        </div>

        <CampaignWizardStepper currentStep={step} />

        <div className="flex-1 overflow-hidden min-h-0">
          {step === 1 && (
            <SelectAudienceStep selectedIds={audienceIds} onToggle={toggleAudience} />
          )}
          {step === 2 && (
            <CreateMessageStep
              name={name}
              message={message}
              mediaType={mediaType}
              mediaFileName={mediaFileName}
              buttons={buttons}
              onNameChange={setName}
              onMessageChange={setMessage}
              onMediaTypeChange={setMediaType}
              onMediaFile={setMediaFileName}
              onButtonChange={(id, field, value) =>
                setButtons((prev) =>
                  prev.map((b) => (b.id === id ? { ...b, [field]: value } : b))
                )
              }
              onAddButton={() => {
                if (buttons.length >= 3) return;
                setButtons((prev) => [...prev, { id: newButtonId(), label: "", url: "" }]);
              }}
              onRemoveButton={(id) =>
                setButtons((prev) => {
                  const next = prev.filter((b) => b.id !== id);
                  while (next.length < 3) {
                    next.push({ id: newButtonId(), label: "", url: "" });
                  }
                  return next.slice(0, 3);
                })
              }
            />
          )}
          {step === 3 && (
            <ScheduleStep
              scheduleDate={scheduleDate}
              scheduleTime={scheduleTime}
              onDateChange={setScheduleDate}
              onTimeChange={setScheduleTime}
            />
          )}
          {step === 4 && (
            <ReviewStep
              name={name}
              audienceIds={audienceIds}
              message={message}
              buttons={buttons}
              businessName={businessName}
            />
          )}
        </div>

        <CampaignWizardFooter
          currentStep={step}
          onBack={() => setStep((s) => Math.max(1, s - 1))}
          onSaveDraft={handleSaveDraft}
          onContinue={handleContinue}
          continueLabel={step === 4 ? "Send Now" : "Continue"}
          continueDisabled={continueDisabled}
        />
      </div>
    </Modal>
  );
}
