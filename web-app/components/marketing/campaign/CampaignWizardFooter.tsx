"use client";

import React from "react";

interface CampaignWizardFooterProps {
  currentStep: number;
  onBack: () => void;
  onSaveDraft: () => void;
  onContinue: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
}

export default function CampaignWizardFooter({
  currentStep,
  onBack,
  onSaveDraft,
  onContinue,
  continueLabel = "Continue",
  continueDisabled = false,
}: CampaignWizardFooterProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 sm:px-8 py-5 border-t border-zinc-100 dark:border-zinc-800">
      {currentStep > 1 ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-[13px] font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      ) : (
        <div />
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onSaveDraft}
          className="px-5 py-2.5 rounded-full border border-[#0A46A6] text-[13px] font-bold text-[#0A46A6] dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
        >
          Save Draft
        </button>
        <button
          type="button"
          onClick={onContinue}
          disabled={continueDisabled}
          className={`px-6 py-2.5 rounded-full text-[13px] font-bold text-white cursor-pointer transition-all ${currentStep === 4
            ? "bg-linear-to-r from-[#041B40] to-[#0A46A6] hover:bg-zinc-900 dark:bg-zinc-700"
            : "bg-linear-to-r from-[#041B40] to-[#0A46A6] hover:bg-zinc-800 dark:bg-zinc-600"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {continueLabel}
        </button>
      </div>
    </div>
  );
}
