"use client";
import { useRouter } from "next/navigation";
import { apiPost, apiUpload, getAccessToken } from "../../lib/api";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Checkbox from "../../components/Checkbox";
import Plan, { getPlanById, PlanId } from "../../components/Plan";

type SignUpStep =
  | "signup"
  | "verify"
  | "workspace"
  | "identity"
  | "plan"
  | "payment"
  | "success";

export default function SignupPage() {
  const [step, setStep] = useState<SignUpStep>("signup");

  // Multi-step global form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: true,
    verificationCode: ["", "", "", "", "", ""],
    venueName: "",
    venueCategory: "Cafe",
    brandColor: "#0A46A6",
    stripeEmail: "",
    stripeCardNumber: "",
    stripeCardExpiry: "",
    stripeCardCvc: "",
    stripeCardName: "",
    stripeCountry: "United Arab Emirates",
  });

  // UI state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("Standard");
  const [signupGuid, setSignupGuid] = useState("");

  // Code input references for automatic focus shifting in Step 2
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  // Step 1: Sign up validation & advance
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    // ... keep your existing validation ...

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await apiPost<{
        success: boolean;
        message?: string;
        guid?: string;
        otp?: string;
      }>("/auth/register/account", {
        full_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim(),
      });

      if (!res.success || !res.guid) {
        setErrors({ email: res.message || "Registration failed" });
        return;
      }

      setSignupGuid(res.guid);
      setStep("verify");
    } catch {
      alert("Could not connect to server. Is the API running?");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verification Code automatic focus shifting and submit
  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // numeric only

    const newCode = [...formData.verificationCode];
    newCode[index] = value.substring(value.length - 1);
    setFormData((prev) => ({ ...prev, verificationCode: newCode }));

    // Focus next input if value added
    if (value && index < 5 && codeRefs.current[index + 1]) {
      codeRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !formData.verificationCode[index] && index > 0) {
      // Focus previous input on backspace
      codeRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const code = formData.verificationCode.join("");
    if (code.length < 6) {
      setErrors({ verification: "Please enter the full 6-digit verification code" });
      return;
    }

    if (!signupGuid) {
      setErrors({ verification: "Session expired. Please sign up again." });
      return;
    }

    setIsSubmitting(true);

    try {
      const verifyRes = await apiPost<{ success: boolean; message?: string }>(
        "/auth/verify-verification-code",
        { guid: signupGuid, code }
      );

      if (!verifyRes.success) {
        setErrors({ verification: verifyRes.message || "Invalid code" });
        return;
      }

      const passwordRes = await apiPost<{ success: boolean; message?: string }>(
        "/auth/create-password",
        {
          guid: signupGuid,
          code,
          password: formData.password,
        }
      );

      if (!passwordRes.success) {
        setErrors({ verification: passwordRes.message || "Could not set password" });
        return;
      }

      const loginRes = await apiPost<{
        success: boolean;
        accessToken?: string;
        message?: string;
      }>("/auth/authenticate/credential", {
        username: formData.email.trim(),
        password: formData.password,
      });

      if (!loginRes.success || !loginRes.accessToken) {
        setErrors({
          verification: loginRes.message || "Account created but sign-in failed.",
        });
        return;
      }

      localStorage.setItem("accessToken", loginRes.accessToken);
      setErrors({});
      setStep("workspace");
    } catch {
      alert("Could not connect to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3: Workspace settings submit
  const handleWorkspaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.venueName.trim()) {
      setErrors({ venueName: "Venue Name is required" });
      return;
    }
    setErrors({});
    setStep("identity");
  };

  // Step 4: Visual Identity drag-and-drop & submit
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Logo must be under 5MB.");
      return;
    }
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleIdentitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!getAccessToken()) {
        alert("Session expired. Please sign in again.");
        return;
      }

      let logoUrl: string | undefined;

      if (logoFile) {
        const uploadRes = await apiUpload<{
          success: boolean;
          url?: string;
          message?: string;
        }>("/uploads/logo", logoFile);

        if (!uploadRes.success || !uploadRes.url) {
          alert(uploadRes.message || "Could not upload logo.");
          return;
        }

        logoUrl = uploadRes.url;
      }

      const venueRes = await apiPost<{
        success: boolean;
        message?: string;
      }>(
        "/venues",
        {
          name: formData.venueName.trim(),
          category: formData.venueCategory,
          brand_color: formData.brandColor,
          ...(logoUrl ? { logo_url: logoUrl } : {}),
        },
        true
      );

      if (!venueRes.success) {
        alert(venueRes.message || "Could not create venue.");
        return;
      }

      setStep("plan");
    } catch {
      alert("Could not connect to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 6: Checkout payment submit
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep("success");
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-zinc-950 font-sans transition-colors duration-300">

      {/* RENDER SPLIT LAYOUT FOR STEPS 1-4 & SUCCESS */}
      {(step === "signup" || step === "verify" || step === "workspace" || step === "identity" || step === "success") && (
        <div className="lg:h-screen w-full p-[22px] flex flex-col lg:flex-row lg:overflow-hidden">

          {/* LEFT COLUMN: Forest Green Brand Panel */}
          <div className="w-full lg:w-[44%] h-[50vh] lg:h-full rounded-[16px] bg-linear-to-r from-[#041B40] to-[#0A46A6] dark:bg-[#063322] relative overflow-hidden flex flex-col justify-between p-8 sm:p-12 lg:p-6 text-white shrink-0 select-none">

            {/* Logo Header using TempLogo.png */}
            <div className="relative z-10 select-none">
              <Image
                src="/Auth/TempLogo.png"
                alt="Horecas Logo"
                width={160}
                height={40}
                className="object-contain"
                priority
              />
            </div>

            {/* Brand Value Proposition */}
            <div className="relative z-10 my-4 lg:my-10">
              <h1 className="text-3xl lg:text-[32px] font-bold tracking-[-0.2px] leading-[38px] uppercase">
                One Platform. Every <br /> Guest Experience.
              </h1>
              <p className="mt-3 text-[16px]  font-light leading-[22px] max-w-sm">
                Replace 57 fragmented tools with a single, unified operating system. Own your guests, own your data, and own your revenue.
              </p>
            </div>

            {/* Dashboard Graphic fitted to the bottom */}
            <div className="relative w-[100%] top-20 aspect-[1.3] sm:aspect-[1.35] lg:aspect-[1.03] sm:translate-y-6 scale-[1.25] pointer-events-none">
              <Image src="/Auth/AuthIMG.png" alt="Horeca Dashboard Preview" fill className="object-contain" sizes="(max-w-1024px) 100vw, 40vw" priority />
            </div>
          </div>

          {/* RIGHT COLUMN: Soft Grey Background with Floating Card */}
          <div className="w-full lg:w-[56%] h-full bg-white dark:bg-zinc-950 p-4 sm:p-8 lg:p-10 flex flex-col items-center justify-center lg:overflow-y-auto">
            <Card className="shadow-lg border border-zinc-150/40 relative overflow-hidden ">

              {/* BACK BUTTON ROW (STEPS 2-4) */}
              {step !== "signup" && (
                <button
                  onClick={() => {
                    if (step === "verify") setStep("signup");
                    if (step === "workspace") setStep("verify");
                    if (step === "identity") setStep("workspace");
                  }}
                  className="absolute top-6 left-6 w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              )}

              {/* STEP 1: CREATE ACCOUNT */}
              {step === "signup" && (
                <form onSubmit={handleSignupSubmit} className="space-y-5">
                  <div>
                    <h2 className="text-[25px] font-extrabold text-[#111111] dark:text-white tracking-tight leading-none">
                      Create your Account
                    </h2>
                    <p className="mt-2 text-[13px] text-zinc-400 dark:text-zinc-500 font-medium">
                      Already have an account?{" "}
                      <Link href="/sign-in" className="font-bold text-[#0A46A6] dark:text-emerald-400 hover:underline transition-colors">Sign in</Link>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter First Name"
                      error={errors.firstName}
                    />
                    <Input
                      label="Last Name"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter Last Name"
                      error={errors.lastName}
                    />
                  </div>

                  <Input
                    label="Email address"
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john.doe@email.com"
                    error={errors.email}
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    }
                  />

                  <Input
                    label="Password"
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    error={errors.password}
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    }
                    endIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 hover:text-[#0A46A6] transition-colors focus:outline-none"
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        )}
                      </button>
                    }
                  />

                  <Input
                    label="Confirm Password"
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm Password"
                    error={errors.confirmPassword}
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    }
                    endIcon={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="p-1 hover:text-[#0A46A6] transition-colors focus:outline-none"
                      >
                        {showConfirmPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        )}
                      </button>
                    }
                  />

                  <div className="pt-1">
                    <Button type="submit" isLoading={isSubmitting}>Sign Up</Button>
                  </div>

                  <Checkbox
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    error={errors.agreeToTerms}
                    label={
                      <>
                        <div className="mb-0">
                          By creating an account, you agree to our{" "}
                          <a href="#" className="font-bold text-[#0A46A6] dark:text-emerald-400 hover:underline">Terms & Conditioins</a> and{" "}
                          <a href="#" className="font-bold text-[#0A46A6] dark:text-emerald-400 hover:underline">Privacy Policy</a>
                        </div>
                      </>
                    }
                  />
                </form>
              )}

              {/* STEP 2: VERIFICATION CODE */}
              {step === "verify" && (
                <form onSubmit={handleVerifySubmit} className="space-y-6 pt-6">
                  <div>
                    <h2 className="text-[25px] font-extrabold text-[#111111] dark:text-white tracking-tight leading-none">
                      Verification Code
                    </h2>
                    <p className="mt-2 text-[13px] text-zinc-400 dark:text-zinc-500 font-medium">
                      Enter the code send to <span className="font-semibold text-zinc-700 dark:text-zinc-300">{formData.email || "abc@gmail.com"}</span>
                    </p>
                  </div>

                  {/* 6 digits numeric boxes */}
                  <div className="flex justify-between gap-2.5 sm:gap-3 py-2">
                    {formData.verificationCode.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          codeRefs.current[idx] = el;
                        }}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(idx, e.target.value)}
                        onKeyDown={(e) => handleCodeKeyDown(idx, e)}
                        className="w-11 h-11 sm:w-12 sm:h-12 text-center text-xl font-bold bg-[#f4f5f6] dark:bg-zinc-800/40 border border-zinc-150 dark:border-zinc-800 rounded-xl focus:ring-1 focus:ring-[#0A46A6] focus:border-[#0A46A6] focus:outline-none transition-all"
                      />
                    ))}
                  </div>

                  {errors.verification && (
                    <p className="text-xs text-red-500 font-medium">{errors.verification}</p>
                  )}

                  <Button type="submit" isLoading={isSubmitting}>Verify</Button>

                  <p className="text-center text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                    Didn't receive a code?{" "}
                    <button
                      type="button"
                      onClick={() => alert("Verification code resent!")}
                      className="font-bold text-[#0A46A6] dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      Resend
                    </button>
                  </p>
                </form>
              )}

              {/* STEP 3: DEFINE WORKSPACE */}
              {step === "workspace" && (
                <form onSubmit={handleWorkspaceSubmit} className="space-y-6 pt-6">
                  <div>
                    <h2 className="text-[25px] font-extrabold text-[#111111] dark:text-white tracking-tight leading-none">
                      Define your workspace
                    </h2>
                    <p className="mt-2 text-[13px] text-zinc-400 dark:text-zinc-500 font-medium leading-relaxed">
                      Tell us about your establishment. We'll tailor your dashboard tools and CRM features based on your venue type.
                    </p>
                  </div>

                  <Input
                    label="Veue Name"
                    id="venueName"
                    name="venueName"
                    value={formData.venueName}
                    onChange={handleInputChange}
                    placeholder="Enter Venue Name"
                    error={errors.venueName}
                  />

                  {/* Selectable category pills grid */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      Veue Category
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Restaurant", "Cafe", "Hotel", "Lounge", "Beach Club", "Bar", "Night Club"].map((cat) => {
                        const isSelected = formData.venueCategory === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, venueCategory: cat }))}
                            className={`py-3.5 px-3 rounded-xl border text-center text-[12px] font-bold transition-all duration-300 cursor-pointer ${isSelected
                              ? "border-[#0A46A6] bg-[#f4faf8] text-[#0A46A6]"
                              : "border-zinc-150 dark:border-zinc-800/80 bg-[#f4f5f6] dark:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/50"
                              } ${cat === "Night Club" ? "col-span-1" : ""}`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Button type="submit">Continue</Button>
                </form>
              )}

              {/* STEP 4: VISUAL IDENTITY */}
              {step === "identity" && (
                <form onSubmit={handleIdentitySubmit} className="space-y-6 pt-6">
                  <div>
                    <h2 className="text-[25px] font-extrabold text-[#111111] dark:text-white tracking-tight leading-none">
                      Visual Identity
                    </h2>
                    <p className="mt-2 text-[13px] text-zinc-400 dark:text-zinc-500 font-medium">
                      Your brand, digitized perfectly
                    </p>
                  </div>

                  {/* Drag and Drop Container */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block">
                      Brand Logo
                    </label>
                    <div
                      onClick={() => document.getElementById("logo-upload")?.click()}
                      className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-[#0A46A6] rounded-2xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 bg-zinc-50/50 dark:bg-zinc-900/30"
                    >
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {logoPreview ? (
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-zinc-100">
                          <Image src={logoPreview} alt="Logo preview" fill className="object-cover" />
                        </div>
                      ) : (
                        <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      )}
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
                        {logoFile ? logoFile.name : "Drag & drop logo"}
                      </span>
                    </div>
                  </div>

                  {/* Brand color input picker */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block">
                      Brand Color
                    </label>
                    <div className="flex items-center gap-3">
                      <div
                        onClick={() => document.getElementById("color-picker")?.click()}
                        className="flex items-center justify-center gap-2.5 w-full bg-[#f4f5f6] dark:bg-zinc-800/40 border border-zinc-150 dark:border-zinc-800 rounded-xl px-4 py-3.5 cursor-pointer hover:bg-zinc-100/50 transition-all"
                      >
                        <input
                          id="color-picker"
                          type="color"
                          value={formData.brandColor}
                          onChange={(e) => setFormData((prev) => ({ ...prev, brandColor: e.target.value }))}
                          className="w-5 h-5 rounded-full border-none cursor-pointer p-0 bg-transparent shrink-0"
                        />
                        <span className="text-[13px] font-bold text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 w-full">
                          <span className="text-zinc-300 font-normal">+</span> Add Color
                        </span>
                        <span className="text-xs font-mono font-semibold text-zinc-400 uppercase select-none">{formData.brandColor}</span>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" isLoading={isSubmitting}>Continue</Button>
                </form>
              )}

              {/* STEP 7: PAYMENT SUCCESSFUL */}
              {step === "success" && (
                <div className="text-center py-6 animate-fade-in space-y-6">
                  <div className="w-16 h-16 bg-linear-to-r from-[#041B40] to-[#0A46A6] rounded-full flex items-center justify-center mx-auto shadow-md border border-[#12503C]">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-[25px] font-extrabold text-[#111111] dark:text-white tracking-tight leading-none text-center">
                      Payment Successful
                    </h2>
                    <p className="text-[13px] text-zinc-400 dark:text-zinc-500 font-medium leading-relaxed max-w-[280px] mx-auto text-center">
                      Your subscription has been successfully processed. All premium features are now unlocked.
                    </p>
                  </div>

                  <div className="pt-2">
                    <Button
                      onClick={() => alert("Welcome to the Horeca Hospitality Platform dashboard!")}
                    >
                      Go to Dashboard
                    </Button>
                  </div>
                </div>
              )}

            </Card>
          </div>
        </div>
      )}

      {/* STEP 5: CHOOSE YOUR PLAN (scrollable, compact) */}
      {step === "plan" && (
        <div className="h-dvh max-h-dvh w-full overflow-y-auto bg-[#f8f9fa] dark:bg-zinc-950">
          <div className="mx-auto flex w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
            <Plan
              compact
              selectedPlanId={selectedPlan}
              onSelectPlan={(planId) => {
                setSelectedPlan(planId);
                setStep("payment");
              }}
              onBack={() => setStep("identity")}
              onContinue={() => setStep("payment")}
            />
          </div>
        </div>
      )}

      {/* STEP 6: PAYMENT CHECKOUT (FULL-SCREEN LAYOUT) */}
      {step === "payment" && (
        <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col md:flex-row animate-fade-in">

          {/* Checkout Left Side Summary */}
          <div className="w-full md:w-1/2 bg-zinc-50 dark:bg-zinc-900/30 p-8 sm:p-12 lg:p-20 flex flex-col justify-between border-r border-zinc-100 dark:border-zinc-800/80">
            <div>
              <button
                onClick={() => setStep("plan")}
                className="flex items-center gap-2 text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer mb-12"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Plans
              </button>

              <div className="space-y-4">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">Subscribe to Horeca</span>
                <h2 className="text-3xl font-extrabold text-[#111111] dark:text-white capitalize">
                  {selectedPlan} Plan payment
                </h2>
                <div className="flex items-baseline gap-2 pt-2">
                  <span className="text-4xl font-black text-zinc-900 dark:text-white">
                    AED {getPlanById(selectedPlan).price}
                  </span>
                  <span className="text-zinc-400 font-bold text-sm">/ month</span>
                </div>
              </div>
            </div>

            <div className="pt-12 md:pt-0 text-xs text-zinc-400 dark:text-zinc-500 font-semibold select-none">
              Powered by <span className="text-zinc-700 dark:text-zinc-300 font-bold">stripe</span> | <a href="#" className="hover:underline">Terms</a> | <a href="#" className="hover:underline">Privacy</a>
            </div>
          </div>

          {/* Checkout Right Side Payment Fields */}
          <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-20 flex flex-col justify-center max-w-[620px]">
            <form onSubmit={handlePaymentSubmit} className="space-y-6">

              {/* Checkout Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  required
                  value={formData.stripeEmail}
                  onChange={(e) => setFormData((prev) => ({ ...prev, stripeEmail: e.target.value }))}
                  placeholder="john.doe@email.com"
                  className="w-full px-4 py-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all placeholder-zinc-300 shadow-2xs"
                />
              </div>

              {/* Card Number / MM / YY / CVC Container */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Card Information</label>
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-800 overflow-hidden shadow-2xs">
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="1234 5678 1234 5678"
                      className="w-full px-4 py-3.5 bg-transparent border-none text-sm focus:outline-none focus:ring-0 placeholder-zinc-300"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-zinc-300 select-none uppercase">Visa</span>
                      <span className="text-[10px] font-bold text-zinc-300 select-none uppercase">MC</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-zinc-200 dark:divide-zinc-800">
                    <input
                      type="text"
                      required
                      placeholder="MM / YY"
                      className="w-full px-4 py-3.5 bg-transparent border-none text-sm focus:outline-none focus:ring-0 placeholder-zinc-300 text-center"
                    />
                    <input
                      type="text"
                      required
                      placeholder="CVC"
                      className="w-full px-4 py-3.5 bg-transparent border-none text-sm focus:outline-none focus:ring-0 placeholder-zinc-300 text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Cardholder Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Cardholder name</label>
                <input
                  type="text"
                  required
                  placeholder="Full name on card"
                  className="w-full px-4 py-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all placeholder-zinc-300 shadow-2xs"
                />
              </div>

              {/* Country select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Country or region</label>
                <select className="w-full px-4 py-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all shadow-2xs text-zinc-600 dark:text-zinc-300 font-medium">
                  <option>United Arab Emirates</option>
                  <option>Saudi Arabia</option>
                  <option>Qatar</option>
                  <option>Oman</option>
                  <option>Kuwait</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                </select>
              </div>

              {/* Link agreement checkout */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/80 rounded-xl p-4 transition-all">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mt-0.5 w-4 h-4 text-blue-600 border-zinc-300 rounded focus:ring-blue-500 accent-blue-600 cursor-pointer"
                  />
                  <div className="space-y-1 select-none">
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
                      Securely save my information for 1-click checkout
                    </span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-normal block">
                      Pay faster on HORECAS and everywhere Link is accepted.
                    </span>
                  </div>
                </label>
              </div>

              {/* Stripe Blue Payment Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#0070F0] hover:bg-[#0062D2] text-white font-extrabold rounded-xl transition-all shadow-md hover:shadow-lg focus:outline-none disabled:opacity-75 disabled:pointer-events-none text-base cursor-pointer"
              >
                {isSubmitting ? "Processing Payment..." : "Pay"}
              </button>

            </form>
          </div>

        </div>
      )}

    </div>
  );
}
