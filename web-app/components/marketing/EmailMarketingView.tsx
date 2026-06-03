"use client";

import React, { useEffect, useRef, useState } from "react";
import EmptyState from "../EmptyState";
import Modal from "../Modal";
import Input from "../Input";
import Toast from "../Toast";
import ProviderOptionCard from "./connect/ProviderOptionCard";
import OtpVerificationModal from "./connect/OtpVerificationModal";
import ConnectionSuccessModal from "./connect/ConnectionSuccessModal";
import { GmailIcon, OutlookIcon } from "./connect/EmailProviderIcons";
import EmailCampaignsView from "./email/EmailCampaignsView";
import { EMAIL_PROVIDERS, getEmailProvider } from "../../data/emailProviders";
import {
  EmailConnection,
  EmailProviderId,
  loadEmailConnection,
  saveEmailConnection,
} from "../../lib/emailConnection";

type ModalStep = null | "provider" | "connect" | "verify" | "success";

const EMAIL_ILLUSTRATION = "/emptyMark.png";

export default function EmailMarketingView() {
  const [hydrated, setHydrated] = useState(false);
  const [connection, setConnection] = useState<EmailConnection | null>(null);
  const [modalStep, setModalStep] = useState<ModalStep>(null);

  const [selectedProvider, setSelectedProvider] = useState<EmailProviderId | null>(null);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [showCodeToast, setShowCodeToast] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setConnection(loadEmailConnection());
    setHydrated(true);
  }, []);

  const isConnected = connection?.connected ?? false;
  const providerMeta = selectedProvider ? getEmailProvider(selectedProvider) : null;

  const openConnectFlow = () => {
    setSelectedProvider(connection?.provider ?? null);
    setEmail(connection?.email ?? "john.doe@email.com");
    setOtp(["", "", "", "", "", ""]);
    setModalStep("provider");
  };

  const handleProviderContinue = () => {
    if (!selectedProvider) return;
    setModalStep("connect");
  };

  const handleSendCode = () => {
    if (!email.trim() || !selectedProvider) return;
    setModalStep("verify");
    setShowCodeToast(true);
    setOtp(["", "", "", "", "", ""]);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const handleVerify = () => {
    if (otp.join("").length !== 6 || !selectedProvider) return;

    const next: EmailConnection = {
      connected: true,
      provider: selectedProvider,
      email: email.trim(),
    };
    saveEmailConnection(next);
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
            imageSrc={EMAIL_ILLUSTRATION}
            imageAlt="Connect email service"
            title="Connect Your Email Service"
            description="Connect Gmail, Outlook, or SMTP to start sending restaurant email campaigns and promotions."
            action={
              <button
                type="button"
                onClick={openConnectFlow}
                className="w-full max-w-sm mx-auto px-8 py-3.5 rounded-full bg-linear-to-r from-[#041B40] to-[#0A46A6] hover:opacity-95 text-white text-[14px] font-bold transition-all cursor-pointer shadow-sm active:scale-[0.98]"
              >
                Connect Email
              </button>
            }
          />
        </div>
      ) : (
        <EmailCampaignsView />
      )}

      {/* Choose provider */}
      <Modal
        isOpen={modalStep === "provider"}
        onClose={() => setModalStep(null)}
        size="md"
        className="!rounded-[24px]"
      >
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-[20px] font-bold text-zinc-900 dark:text-white tracking-tight">
              Connect Email Provider
            </h2>
            <p className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400 mt-1">
              Choose your email provider to start sending restaurant campaigns.
            </p>
          </div>

          <div className="space-y-3">
            {EMAIL_PROVIDERS.map((provider) => (
              <ProviderOptionCard
                key={provider.id}
                selected={selectedProvider === provider.id}
                onClick={() => setSelectedProvider(provider.id)}
                icon={provider.id === "gmail" ? <GmailIcon /> : <OutlookIcon />}
                title={provider.name}
                description={provider.description}
              />
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalStep(null)}
              className="px-6 py-2.5 rounded-full text-[13px] font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleProviderContinue}
              disabled={!selectedProvider}
              className="px-6 py-2.5 rounded-full bg-linear-to-r from-[#041B40] to-[#0A46A6] hover:bg-[#12503C] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-bold cursor-pointer transition-all"
            >
              Continue
            </button>
          </div>
        </div>
      </Modal>

      {/* Provider account email */}
      <Modal
        isOpen={modalStep === "connect"}
        onClose={() => setModalStep("provider")}
        size="md"
        showCloseButton={false}
        closeOnOverlayClick={false}
        className="!rounded-[24px]"
      >
        <div className="p-6 sm:p-8 space-y-6">
          <button
            type="button"
            onClick={() => setModalStep("provider")}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
            aria-label="Back"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div>
            <h2 className="text-[20px] font-bold text-zinc-900 dark:text-white tracking-tight">
              {providerMeta?.connectTitle ?? "Connect Email"}
            </h2>
            <p className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
              {providerMeta?.connectDescription}
            </p>
          </div>

          <Input
            id="email-connect-address"
            label="Email address"
            type="email"
            placeholder="john.doe@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            }
          />

          <button
            type="button"
            onClick={handleSendCode}
            disabled={!email.trim()}
            className="w-full py-3.5 rounded-full bg-linear-to-r from-[#041B40] to-[#0A46A6] hover:bg-[#12503C] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[14px] font-bold cursor-pointer transition-all"
          >
            Send Code
          </button>
        </div>
      </Modal>

      <OtpVerificationModal
        isOpen={modalStep === "verify"}
        onBack={() => setModalStep("connect")}
        subtitle={
          <>
            Enter the 6-digit code sent to <span className="font-bold text-zinc-700 dark:text-zinc-200">{email}</span>
          </>
        }
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
        title="Email Connected Successfully!"
        description={
          <>
            <span className="font-bold text-zinc-800 dark:text-zinc-200">{email.trim()}</span> can now
            create and send Email campaigns to customers.
          </>
        }
      />
    </div>
  );
}
