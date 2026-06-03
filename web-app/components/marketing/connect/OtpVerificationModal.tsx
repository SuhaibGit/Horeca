"use client";

import React from "react";
import Modal from "../../Modal";
import Button from "../../Button";

interface OtpVerificationModalProps {
  isOpen: boolean;
  onBack: () => void;
  subtitle: React.ReactNode;
  otp: string[];
  otpRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onOtpChange: (index: number, value: string) => void;
  onOtpKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onVerify: () => void;
  onResend: () => void;
  verifyDisabled?: boolean;
}

export default function OtpVerificationModal({
  isOpen,
  onBack,
  subtitle,
  otp,
  otpRefs,
  onOtpChange,
  onOtpKeyDown,
  onVerify,
  onResend,
  verifyDisabled,
}: OtpVerificationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onBack}
      size="lg"
      showCloseButton={false}
      closeOnOverlayClick={false}
      className="!rounded-[24px]"
    >
      <div className="p-6 sm:p-8 space-y-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
          aria-label="Back"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div>
          <h2 className="text-[32px] font-semibold text-[#333839] tracking-tight">
            Verification Code
          </h2>
          <p className="text-[16px]  text-[#717680] mt-1.5 leading-relaxed">{subtitle}</p>
        </div>

        <div className="flex justify-center gap-4 ">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                otpRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => onOtpChange(i, e.target.value)}
              onKeyDown={(e) => onOtpKeyDown(i, e)}
              className="w-14 h-14 text-center text-[18px] font-bold rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A46A6]/40"
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>

        <Button type="button" onClick={onVerify} disabled={verifyDisabled} className="!rounded-full">
          Verify
        </Button>

        <p className="text-center text-[16px]  text-[#626D6F] pb-2">
          Didn&apos;t receive a code?{" "}
          <button
            type="button"
            onClick={onResend}
            className="text-[#0F3D33]  hover:underline cursor-pointer"
          >
            Resend
          </button>
        </p>
      </div>
    </Modal>
  );
}
