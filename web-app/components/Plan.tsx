"use client";

import React from "react";
import PricingCard from "./auth/PricingCard";

export type PlanId = "Basic" | "Standard" | "Enterprise";

export interface PlanDefinition {
  id: PlanId;
  name: string;
  price: string;
  subtitle?: string;
  description: string;
  benefits: string[];
  isHighlighted?: boolean;
  isPopular?: boolean;
}

export const PLANS: PlanDefinition[] = [
  {
    id: "Basic",
    name: "Basic",
    price: "1,500",
    description: "Start managing your fleet with essential tools and simplicity.",
    benefits: [
      "Digital QR Menu",
      "Menu Management",
      "Multi-language support",
      "Branding (logo & colours)",
      "Link in bio one pager",
      "QR code generation",
    ],
  },
  {
    id: "Standard",
    name: "Standard",
    price: "3,000",
    subtitle: "Premium Vault Access",
    description: "Scale your operations with powerful features and deeper insights.",
    isHighlighted: true,
    isPopular: true,
    benefits: [
      "Table Reservation System",
      "Table Layout Builder",
      "Guest database (CRM)",
      "Reservation analytics",
      "Google Reserve Integration (Phase 2)",
      "Multi User Access",
    ],
  },
  {
    id: "Enterprise",
    name: "Enterprise",
    price: "5,000",
    description: "Unlock full flexibility, control, and enterprise-grade capabilities.",
    benefits: [
      "Dine-in ordering (QR)",
      "Online ordering & delivery",
      "Retail/e-commerce module",
      "Email marketing campaigns",
      "WhatsApp broadcasts",
      "Automation & loyalty",
      "Kitchen display system (KDS)",
      "Advanced analytics",
      "Payment integrations",
    ],
  },
];

export function getPlanById(id: PlanId) {
  return PLANS.find((plan) => plan.id === id) ?? PLANS[1];
}

interface PlanProps {
  selectedPlanId?: PlanId;
  onSelectPlan: (planId: PlanId) => void;
  onBack?: () => void;
  onContinue?: () => void;
  showHeader?: boolean;
  showFooter?: boolean;
  compact?: boolean;
  className?: string;
}

export default function Plan({
  selectedPlanId = "Standard",
  onSelectPlan,
  onBack,
  onContinue,
  showHeader = true,
  showFooter = true,
  compact = false,
  className = "",
}: PlanProps) {
  return (
    <div
      className={`flex w-full flex-col animate-fade-in ${compact ? "" : "justify-between"} ${className}`}
    >
      {showHeader ? (
        <div className={`mx-auto max-w-xl text-center ${compact ? "py-2" : "py-4"}`}>
          <h1
            className={`font-black uppercase leading-none tracking-tight text-zinc-900 dark:text-white ${
              compact ? "text-xl sm:text-2xl" : "text-3xl lg:text-[2.25rem]"
            }`}
          >
            Choose Your Plan
          </h1>
          <p
            className={`font-medium text-zinc-400 dark:text-zinc-500 ${
              compact ? "mt-1.5 text-xs" : "mt-3 text-sm"
            }`}
          >
            Select the plan that fits your business needs
          </p>
        </div>
      ) : null}

      <div
        className={`grid grid-cols-1 items-stretch md:grid-cols-3 ${
          compact ? "my-4 gap-4" : "my-8 gap-6"
        }`}
      >
        {PLANS.map((plan) => (
          <PricingCard
            key={plan.id}
            name={plan.name}
            price={plan.price}
            description={plan.description}
            benefits={plan.benefits}
            isHighlighted={plan.isHighlighted}
            isPopular={plan.isPopular}
            compact={compact}
            onSelect={() => onSelectPlan(plan.id)}
          />
        ))}
      </div>

      {showFooter && (onBack || onContinue) ? (
        <div
          className={`flex select-none items-center justify-between ${
            compact
              ? "sticky bottom-0 z-10 mt-2 border-t border-zinc-200/80 bg-[#f8f9fa] py-4 dark:border-zinc-800 dark:bg-zinc-950"
              : "mt-4 pt-8"
          }`}
        >
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="cursor-pointer rounded-xl border border-zinc-200 px-6 py-2.5 text-xs font-bold text-zinc-600 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
            >
              Back
            </button>
          ) : (
            <span />
          )}
          {onContinue ? (
            <button
              type="button"
              onClick={onContinue}
              className="cursor-pointer rounded-xl bg-linear-to-r from-[#041B40] to-[#0A46A6] px-8 py-3 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#12503C]"
            >
              Continue
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
