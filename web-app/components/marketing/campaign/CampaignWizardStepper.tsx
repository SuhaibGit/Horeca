"use client";

import React from "react";
import { CAMPAIGN_WIZARD_STEPS } from "../../../data/mockWhatsAppCampaigns";

export interface WizardStepConfig {
  id: number;
  label: string;
}

interface CampaignWizardStepperProps {
  currentStep: number;
  steps?: readonly WizardStepConfig[];
  compact?: boolean;
}

export default function CampaignWizardStepper({
  currentStep,
  steps = CAMPAIGN_WIZARD_STEPS,
  compact = false,
}: CampaignWizardStepperProps) {
  return (
    <div className={compact ? "px-0 pt-0 pb-0" : "px-6 sm:px-8 pt-6 pb-2"}>
      <div className="flex items-start justify-between max-w-3xl mx-auto">
        {steps.map((step, index) => {
          const stepNum = step.id;
          const isComplete = currentStep > stepNum;
          const isActive = currentStep === stepNum;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center flex-1 min-w-0">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 transition-colors ${isComplete || isActive
                    ? "bg-linear-to-r from-[#041B40] to-[#0A46A6] text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                    }`}
                >
                  {isComplete ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNum
                  )}
                </div>
                <span
                  className={`mt-2 text-[11px] sm:text-[12px] font-semibold text-center leading-tight px-1 ${isActive ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-zinc-500"
                    }`}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className="flex-1 h-px mt-[18px] mx-1 border-t border-dashed border-zinc-200 dark:border-zinc-700 min-w-[12px]"
                  aria-hidden
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
