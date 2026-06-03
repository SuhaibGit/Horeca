"use client";

import React, { useEffect, useRef, useState } from "react";
import EmptyState from "../EmptyState";
import Modal from "../Modal";
import DetailDrawer from "../DetailDrawer";
import Input from "../Input";
import Toast from "../Toast";
import StatCard from "../StatCard";
import Table, { TableColumn } from "../Table";
import ActionMenu from "../ActionMenu";
import ProviderOptionCard from "../marketing/connect/ProviderOptionCard";
import OtpVerificationModal from "../marketing/connect/OtpVerificationModal";
import ConnectionSuccessModal from "../marketing/connect/ConnectionSuccessModal";
import {
  MOCK_REVIEWS,
  MOCK_REVIEWS_STATS,
  Review,
  ReviewPlatformId,
  updateReviewResponse,
} from "../../data/mockReviews";

interface ReviewPlatformOption {
  id: ReviewPlatformId;
  name: string;
  description: string;
  connectTitle: string;
  connectDescription: string;
  icon: React.ReactNode;
}

const REVIEW_PLATFORMS: ReviewPlatformOption[] = [
  {
    id: "google",
    name: "Google Business Profile",
    description: "Sync public business reviews, ratings, photos, and answer queries directly.",
    connectTitle: "Connect with Google",
    connectDescription: "You will be redirected to Google to authorize HORECA to send emails on your behalf.",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 48 48" aria-hidden>
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.98 24.52c0-1.57-.15-3.09-.38-4.52H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.68z" />
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
      </svg>
    ),
  },
  {
    id: "tripadvisor",
    name: "Tripadvisor Business",
    description: "Connect restaurant & hotel reputation profile to track luxury reviews.",
    connectTitle: "Connect with Tripadvisor",
    connectDescription: "You will be redirected to Tripadvisor to authorize HORECA to sync reviews on your behalf.",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 48 48" aria-hidden>
        <circle cx="24" cy="24" r="24" fill="#34E0A1" />
        <path fill="#000" d="M24 10.5c-4.4 0-8.5 1.7-11.6 4.8-1.6 1.6-2.8 3.5-3.6 5.6-.4 1-.6 2.1-.6 3.2 0 4.1 2.1 7.9 5.5 10.2l-1.8 3.2h3.6l1.3-2.3c2.2.8 4.6 1.2 7.2 1.2s5-.4 7.2-1.2l1.3 2.3h3.6l-1.8-3.2c3.4-2.3 5.5-6.1 5.5-10.2 0-1.1-.2-2.2-.6-3.2-.8-2.1-2-4-3.6-5.6-3.1-3.1-7.2-4.8-11.6-4.8zm-9 12c2.5 0 4.5 2 4.5 4.5s-2 4.5-4.5 4.5-4.5-2-4.5-4.5 2-4.5 4.5-4.5zm18 0c2.5 0 4.5 2 4.5 4.5s-2 4.5-4.5 4.5-4.5-2-4.5-4.5 2-4.5 4.5-4.5z" />
        <circle cx="15" cy="27" r="1.5" fill="#000" />
        <circle cx="33" cy="27" r="1.5" fill="#000" />
      </svg>
    ),
  },
  {
    id: "yelp",
    name: "Yelp for Business",
    description: "Sync local market reviews and engage with community complaints.",
    connectTitle: "Connect with Yelp",
    connectDescription: "You will be redirected to Yelp to authorize HORECA to sync reviews on your behalf.",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 48 48" aria-hidden>
        <rect width="48" height="48" rx="8" fill="#FF1A1A" />
        <path fill="#fff" d="M22 13.5l1.5 5.5 5-2.5-1.5-6-5 3zm6.5 7.5l6-3.5 1 5.5-5.5 2-1.5-4zm-8-1l-3-6-5 2.5 1.5 6 6.5-2.5zm-5 6.5l-6-2.5-2.5 5.5 6 3.5 2.5-6.5zm5.5 3l-1.5 6 5.5 3 2.5-5.5-6.5-3.5z" />
      </svg>
    ),
  },
  {
    id: "facebook",
    name: "Facebook Pages Manager",
    description: "Manage recommendation ratings, user likes, and comments on posts.",
    connectTitle: "Connect with Facebook",
    connectDescription: "You will be redirected to Facebook to authorize HORECA to sync reviews on your behalf.",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 48 48" aria-hidden>
        <path fill="#1877F2" d="M48 24c0-13.255-10.745-24-24-24S0 10.745 0 24c0 11.979 8.776 21.908 20.25 23.708v-16.77h-6.094V24h6.094v-5.288c0-6.014 3.583-9.337 9.065-9.337 2.625 0 5.372.469 5.372.469v5.906h-3.026c-2.981 0-3.911 1.85-3.911 3.75V24h6.656l-1.064 6.938H27.75v16.77C39.224 45.908 48 35.978 48 24z" />
        <path fill="#fff" d="M33.342 30.938L34.406 24h-6.656v-4.5c0-1.9.93-3.75 3.911-3.75h3.026v-5.906s-2.747-.469-5.372-.469c-5.482 0-9.065 3.323-9.065 9.337V24h-6.094v6.938h6.094v16.77a24.267 24.267 0 007.5 0v-16.77h6.592z" />
      </svg>
    ),
  },
];

type ModalStep = null | "provider" | "connect" | "verify" | "success";

const REVIEW_ILLUSTRATION = "/emptyMark.png";

export default function ReviewsView() {
  const [hydrated, setHydrated] = useState(false);
  const [connectedPlatforms, setConnectedPlatforms] = useState<ReviewPlatformId[]>([]);
  const [modalStep, setModalStep] = useState<ModalStep>(null);

  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);

  const [selectedProvider, setSelectedProvider] = useState<ReviewPlatformId | null>(null);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isEditingResponse, setIsEditingResponse] = useState(false);
  const [responseText, setResponseText] = useState("");

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const providerMeta = selectedProvider ? REVIEW_PLATFORMS.find(p => p.id === selectedProvider) : null;

  const openConnectFlow = () => {
    setSelectedProvider(null);
    setEmail("john.doe@email.com");
    setOtp(["", "", "", "", "", ""]);
    setModalStep("provider");
  };

  const handleProviderContinue = () => {
    if (!selectedProvider) return;
    if (connectedPlatforms.includes(selectedProvider)) return; // Already connected
    setModalStep("connect");
  };

  const handleSendCode = () => {
    if (!email.trim() || !selectedProvider) return;
    setModalStep("verify");
    setToastMessage("Verification code sent!");
    setShowToast(true);
    setOtp(["", "", "", "", "", ""]);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const handleVerify = () => {
    if (otp.join("").length !== 6 || !selectedProvider) return;
    setConnectedPlatforms(prev => [...prev, selectedProvider]);
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
    setToastMessage("Verification code sent!");
    setShowToast(true);
    setOtp(["", "", "", "", "", ""]);
    otpRefs.current[0]?.focus();
  };

  const openReview = (review: Review) => {
    setSelectedReview(review);
    setResponseText(review.response?.text || "");
    setIsEditingResponse(false);
  };

  const handleSaveResponse = () => {
    if (selectedReview && responseText.trim()) {
      updateReviewResponse(selectedReview.id, responseText);
      setReviews([...MOCK_REVIEWS]); // Force re-render with updated data
      setToastMessage("Response updated successfully");
      setShowToast(true);

      const updatedReview = MOCK_REVIEWS.find(r => r.id === selectedReview.id);
      if (updatedReview) {
        setSelectedReview(updatedReview);
        setIsEditingResponse(false);
      }
    }
  };

  if (!hydrated) return null;

  const isAnyConnected = connectedPlatforms.length > 0;

  const columns: TableColumn<Review>[] = [
    {
      key: "customer",
      header: "Customer",
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-200 overflow-hidden shrink-0">
            <img src="/avatar-placeholder.png" alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = `<span class="flex h-full w-full items-center justify-center font-bold text-zinc-500">${r.customerName.charAt(0)}</span>`; }} />
          </div>
          <span className=" text-[#25292A]">{r.customerName}</span>
        </div>
      ),
    },
    {
      key: "platform",
      header: "Platform",
      render: (r) => {
        const p = REVIEW_PLATFORMS.find((pl) => pl.id === r.platform);
        return (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 shrink-0 flex items-center justify-center">
              {p?.icon}
            </div>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              {p?.name.split(" ")[0]}
            </span>
          </div>
        );
      },
    },
    {
      key: "preview",
      header: "Review Preview",
      render: (r) => (
        <span className="text-zinc-600 dark:text-zinc-400">
          {r.preview}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (r) => (
        <span className="font-semibold text-zinc-600 dark:text-zinc-300">
          {r.date}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <span
          className={`px-3 py-1 text-[14px] font-medium rounded-full  ${r.status === "Replied"
            ? "bg-[#0096881A]  text-[#009688] "
            : "bg-[#FEFBE8]  text-[#EAAA08] "
            }`}
        >
          {r.status}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      render: (r) => (
        <button
          onClick={() => openReview(r)}
          className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      ),
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-12rem)] space-y-6">
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      {!isAnyConnected ? (
        <div className="bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-100 dark:border-zinc-800 shadow-sm min-h-[560px] flex items-center justify-center">
          <EmptyState
            imageSrc={REVIEW_ILLUSTRATION}
            imageAlt="Connect review platform"
            title="Connect Your Review Platforms"
            description="Manage customer reviews from Google, Facebook, Tripadvisor, and other platforms in one unified dashboard."
            action={
              <button
                type="button"
                onClick={openConnectFlow}
                className="w-full max-w-sm mx-auto px-8 py-3.5 rounded-full bg-linear-to-r from-[#041B40] to-[#0A46A6] hover:opacity-95 text-white text-[14px] font-bold transition-all cursor-pointer shadow-sm active:scale-[0.98]"
              >
                Connect Platform
              </button>
            }
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-[24px] font-semibold text-[#333839] dark:text-white tracking-[-0.15px]">
                Reviews Management
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={openConnectFlow}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-[13px] font-bold shadow-sm cursor-pointer transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Connect Platform
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-[13px] font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer">
                Date
                <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard title="Overall Rating" value={MOCK_REVIEWS_STATS.overallRating} comparisonLabel={`Based on ${MOCK_REVIEWS_STATS.totalReviews} reviews`} className="col-span-1 lg:col-span-1" />
            <StatCard title="Total Reviews" value={MOCK_REVIEWS_STATS.totalReviews} change={MOCK_REVIEWS_STATS.totalReviewsGrowth} />
            <StatCard title="New Reviews" value={MOCK_REVIEWS_STATS.newReviews} change={MOCK_REVIEWS_STATS.newReviewsGrowth} />
            <StatCard title="Replied Reviews" value={MOCK_REVIEWS_STATS.repliedReviews} change={MOCK_REVIEWS_STATS.repliedReviewsGrowth} />
            <StatCard title="Average Response Time" value={MOCK_REVIEWS_STATS.averageResponseTime} change={MOCK_REVIEWS_STATS.averageResponseTimeGrowth} />
          </section>

          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">All Reviews</h2>
            <Table
              columns={columns}
              data={reviews}
              searchPlaceholder="Search..."
              searchFilter={(r, q) => r.customerName.toLowerCase().includes(q.toLowerCase()) || r.preview.toLowerCase().includes(q.toLowerCase())}
              headerRight={
                <>
                  <button className="flex items-center gap-2 px-3 py-1.5 text-[14px] font-medium text-[#121212] bg-white cursor-pointer border border-[#DCDFE4] rounded-lg hover:bg-zinc-50">
                    All Platforms <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 text-[14px] font-medium text-[#121212] bg-white cursor-pointer border border-[#DCDFE4] rounded-lg hover:bg-zinc-50">
                    All Ratings <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 text-[14px] font-medium text-[#121212] bg-white cursor-pointer border border-[#DCDFE4] rounded-lg hover:bg-zinc-50">
                    Status <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                </>
              }
            />
          </div>
        </div>
      )}

      {/* Choose provider */}
      <Modal
        isOpen={modalStep === "provider"}
        onClose={() => setModalStep(null)}
        size="2xl"
        className="!rounded-[24px]"
      >
        <div>
          <div className="p-6 border-b border-[#E7E7E7]" >
            <h2 className="text-[20px] font-semibold text-[#25292A] dark:text-white tracking-tight">
              Connect Email Provider
            </h2>
            <p className="text-[16px] font-medium text-[#717680] max-w-[335px] mt-1">
              Choose your email provider to start sending restaurant campaigns.
            </p>
          </div>

          <div className="space-y-6 p-6">
            {REVIEW_PLATFORMS.map((provider) => {
              const isConnected = connectedPlatforms.includes(provider.id);
              return (
                <div
                  key={provider.id}
                  className="w-full flex items-center gap-4 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-[#F5F5F5] hover:border-zinc-200 dark:hover:border-zinc-700 transition-all text-left"
                >
                  <div className="w-11 h-11 shrink-0 flex items-center justify-center">{provider.icon}</div>
                  <div className="min-w-0 space-y-0.5 flex-1">
                    <p className="text-[16px] font-semibold text-[#333839] ">{provider.name}</p>
                    <p className="text-[12px] font-medium text-[#A4A7AE] leading-relaxed">
                      {provider.description}
                    </p>
                  </div>
                  <div className="shrink-0 pl-2">
                    {isConnected ? (
                      <span className="px-5 py-2 rounded-full bg-zinc-500 text-white text-[13px] font-bold select-none">
                        Connected
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProvider(provider.id);
                          setModalStep("connect");
                        }}
                        className="px-5 py-2 rounded-full bg-linear-to-r from-[#041B40] to-[#0A46A6]  text-white text-[13px] font-bold cursor-pointer transition-all"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>

      {/* Provider account email */}
      <Modal
        isOpen={modalStep === "connect"}
        onClose={() => setModalStep("provider")}
        size="lg"
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
            <h2 className="text-[32px] font-semibold text-[#333839] tracking-tight">
              {providerMeta?.connectTitle ?? "Connect"}
            </h2>
            <p className="text-[16px] font-medium text-[#717680] mt-1.5 leading-relaxed">
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
        title={`${providerMeta?.name ?? "Platform"} Connected Successfully!`}
        description={
          <>
            You can now manage customer reviews from <span className="font-bold text-zinc-800 dark:text-zinc-200">{providerMeta?.name}</span>.
          </>
        }
      />

      <DetailDrawer
        isOpen={selectedReview !== null}
        onClose={() => {
          setSelectedReview(null);
          setIsEditingResponse(false);
        }}
        title={
          selectedReview ? (
            <span className="flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center">
                {REVIEW_PLATFORMS.find((p) => p.id === selectedReview.platform)?.icon}
              </span>
              {REVIEW_PLATFORMS.find((p) => p.id === selectedReview.platform)?.name}
            </span>
          ) : (
            "Review"
          )
        }
        badge={
          selectedReview ? (
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                selectedReview.status === "Replied"
                  ? "bg-[#EBF7FF] text-[#28A388] border border-emerald-100/60"
                  : "bg-amber-50 text-amber-600 border border-amber-200/60"
              }`}
            >
              {selectedReview.status}
            </span>
          ) : null
        }
        maxWidthClass="max-w-[520px]"
        contentClassName="p-6 space-y-6"
        footer={
          selectedReview && (selectedReview.status !== "Replied" || isEditingResponse) ? (
            <div className="flex justify-end w-full">
              <button
                type="button"
                onClick={handleSaveResponse}
                disabled={!responseText.trim()}
                className="px-5 py-2.5 rounded-full bg-linear-to-r from-[#041B40] to-[#0A46A6] hover:bg-[#12503C] disabled:opacity-50 text-white text-[13px] font-bold cursor-pointer transition-all"
              >
                {isEditingResponse ? "Save Changes" : "Submit Review"}
              </button>
            </div>
          ) : undefined
        }
      >
        {selectedReview && (
          <>
            {/* Customer Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-200 overflow-hidden">
                  <img src="/avatar-placeholder.png" alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = `<span class="flex h-full w-full items-center justify-center font-bold text-zinc-500">${selectedReview.customerName.charAt(0)}</span>`; }} />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white text-sm">{selectedReview.customerName}</h3>
                  <p className="text-xs text-zinc-500">Customer since {selectedReview.customerSince || "Jan 2024"}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{selectedReview.date}</p>
                <p className="text-xs text-zinc-500">{selectedReview.time}</p>
              </div>
            </div>

            {/* Rating & Review */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400 text-sm">
                    {"★".repeat(selectedReview.rating)}{"☆".repeat(5 - selectedReview.rating)}
                  </div>
                  <span className="font-bold text-sm">{selectedReview.rating.toFixed(1)}</span>
                </div>
                <a href="#" className="text-sm font-bold text-[#0A46A6] hover:underline">View on {REVIEW_PLATFORMS.find(p => p.id === selectedReview.platform)?.name.split(" ")[0]}</a>
              </div>

              <p className="text-[14px] text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                {selectedReview.fullReview}
              </p>

              {/* Images if any */}
              {selectedReview.images && selectedReview.images.length > 0 && (
                <div className="flex items-center gap-2 mt-4 overflow-hidden">
                  {selectedReview.images.map((img, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                      {i === 3 && selectedReview.images!.length > 4 ? (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">+{selectedReview.images!.length - 3}</span>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-zinc-300"></div> // Placeholder for image
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Response Area */}
            {selectedReview.status === "Replied" && !isEditingResponse ? (
              <div className="bg-[#EBF7FF] dark:bg-emerald-950/20 p-4 rounded-2xl border border-[#0A46A6]/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Your Response <span className="text-zinc-500 font-normal">({selectedReview.response?.date} {selectedReview.response?.time})</span></h4>
                </div>
                <p className="text-[13px] text-zinc-700 dark:text-zinc-300 mb-3 font-medium">
                  {selectedReview.response?.text}
                </p>
                <button
                  onClick={() => setIsEditingResponse(true)}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#0A46A6] hover:opacity-80 transition-opacity"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  Edit Response
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Response</h4>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Write your response"
                  className="w-full min-h-[120px] p-3 text-sm text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A46A6] transition-all resize-none"
                />
              </div>
            )}
          </>
        )}
      </DetailDrawer>
    </div>
  );
}
