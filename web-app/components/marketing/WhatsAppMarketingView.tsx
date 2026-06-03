"use client";

import React, { useEffect, useRef, useState } from "react";
import EmptyState from "../EmptyState";
import Modal from "../Modal";
import Input from "../Input";
import Toast from "../Toast";
import OtpVerificationModal from "./connect/OtpVerificationModal";
import ConnectionSuccessModal from "./connect/ConnectionSuccessModal";
import WhatsAppCampaignsView from "./WhatsAppCampaignsView";
import {
  formatWhatsAppPhone,
  loadWhatsAppConnection,
  saveWhatsAppConnection,
  WhatsAppConnection,
} from "../../lib/whatsappConnection";

type ModalStep = null | "connect" | "verify" | "success";

const WHATSAPP_ILLUSTRATION = "/emptyMark.png";

export default function WhatsAppMarketingView() {
  const [hydrated, setHydrated] = useState(false);
  const [connection, setConnection] = useState<WhatsAppConnection | null>(null);
  const [modalStep, setModalStep] = useState<ModalStep>(null);

  const [businessName, setBusinessName] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [showCodeToast, setShowCodeToast] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setConnection(loadWhatsAppConnection());
    setHydrated(true);
  }, []);

  const isConnected = connection?.connected ?? false;
  const displayPhone =
    connection && connection.phone
      ? formatWhatsAppPhone(connection.countryCode, connection.phone)
      : formatWhatsAppPhone(countryCode, phone);

  const openConnectFlow = () => {
    setBusinessName(connection?.businessName ?? "");
    setCountryCode(connection?.countryCode ?? "+1");
    setPhone(connection?.phone ?? "");
    setOtp(["", "", "", "", "", ""]);
    setModalStep("connect");
  };

  const handleContinueToVerify = () => {
    if (!businessName.trim() || !phone.trim()) return;
    setModalStep("verify");
    setShowCodeToast(true);
    setOtp(["", "", "", "", "", ""]);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code.length !== 6) return;

    const next: WhatsAppConnection = {
      connected: true,
      businessName: businessName.trim(),
      countryCode,
      phone: phone.trim(),
    };
    saveWhatsAppConnection(next);
    setConnection(next);
    setModalStep("success");
  };

  const handleFinishConnection = () => {
    setModalStep(null);
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleResendCode = () => {
    setShowCodeToast(true);
    setOtp(["", "", "", "", "", ""]);
    otpRefs.current[0]?.focus();
  };

  if (!hydrated) return null;

  return (
    <div className="relative min-h-[calc(100vh-12rem)]">
      <Toast
        message="Verification code sent!"
        isVisible={showCodeToast}
        onClose={() => setShowCodeToast(false)}
      />

      {!isConnected ? (
        <div className="bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-100 dark:border-zinc-800 shadow-sm min-h-[560px] flex items-center justify-center">
          <EmptyState
            imageSrc={WHATSAPP_ILLUSTRATION}
            imageAlt="Connect WhatsApp Business"
            title="Connect WhatsApp Business"
            description="Connect your WhatsApp Business account to start sending promotional campaigns and customer messages."
            action={
              <button
                type="button"
                onClick={openConnectFlow}
                className="w-full max-w-xs mx-auto px-8 py-3.5 rounded-full bg-linear-to-r from-[#041B40] to-[#0A46A6] hover:bg-[#12503C] text-white text-[14px] font-bold transition-all cursor-pointer shadow-sm active:scale-[0.98]"
              >
                Connect WhatsApp
              </button>
            }
          />
        </div>
      ) : (
        <WhatsAppCampaignsView businessName={connection?.businessName} />
      )}

      {/* Connect business details */}
      <Modal
        isOpen={modalStep === "connect"}
        onClose={() => setModalStep(null)}
        size="md"
        className="!rounded-[24px]"
      >
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-[20px] font-bold text-zinc-900 dark:text-white tracking-tight">
              Connect WhatsApp Business
            </h2>
            <p className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400 mt-1">
              Enter your business details to get started.
            </p>
          </div>

          <div className="space-y-4">
            <Input
              id="wa-business-name"
              label="Business Name"
              placeholder="Enter your restaurant name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />

            <div className="space-y-1.5 w-full">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block">
                WhatsApp Business Number
              </label>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-3 py-3.5 bg-[#f4f5f6] dark:bg-zinc-800/40 border border-zinc-100/80 dark:border-zinc-800 rounded-xl text-[13px] font-semibold text-zinc-700 dark:text-zinc-200 shrink-0">
                  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
                    />
                  </svg>
                  <input
                    type="text"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-10 bg-transparent outline-none text-[13px] font-semibold"
                    aria-label="Country code"
                  />
                </div>
                <input
                  type="tel"
                  placeholder="555 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 px-4 py-3.5 bg-[#f4f5f6] dark:bg-zinc-800/40 border border-zinc-100/80 dark:border-zinc-800 rounded-xl text-[13px] font-medium text-zinc-800 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#0A46A6]/80"
                />
              </div>
              <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                We&apos;ll send a verification code to this WhatsApp number.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalStep(null)}
              className="px-6 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-[13px] font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleContinueToVerify}
              disabled={!businessName.trim() || !phone.trim()}
              className="px-6 py-2.5 rounded-full bg-linear-to-r from-[#041B40] to-[#0A46A6] hover:bg-[#12503C] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-bold cursor-pointer transition-all"
            >
              Continue
            </button>
          </div>
        </div>
      </Modal>

      <OtpVerificationModal
        isOpen={modalStep === "verify"}
        onBack={() => setModalStep("connect")}
        subtitle={<>Enter the 6-digit code sent to {displayPhone || "your number"}</>}
        otp={otp}
        otpRefs={otpRefs}
        onOtpChange={handleOtpChange}
        onOtpKeyDown={handleOtpKeyDown}
        onVerify={handleVerify}
        onResend={handleResendCode}
        verifyDisabled={otp.join("").length !== 6}
      />

      <ConnectionSuccessModal
        isOpen={modalStep === "success"}
        onClose={handleFinishConnection}
        title="WhatsApp Connected Successfully!"
        description={
          <>
            {businessName.trim() || "Your business"} can now create and send WhatsApp campaigns to
            customers.
          </>
        }
      />
    </div>
  );
}
