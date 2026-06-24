"use client";
import { useRouter } from "next/navigation";
import { apiPost, getAccessToken, setAccessToken } from "../../lib/api";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Button from "../../components/Button";

type SignInStep = "signin" | "forgot" | "verify" | "reset";

export default function SignInPage() {

  const router = useRouter();

  const [step, setStep] = useState<SignInStep>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Verification code states
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Password Reset states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  useEffect(() => {
    if (getAccessToken()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await apiPost<{
        success: boolean;
        message?: string;
        accessToken?: string;
      }>("/auth/authenticate/credential", {
        username: email,
        password,
      });

      if (!res.success || !res.accessToken) {
        alert(res.message || "Login failed");
        return;
      }

      setAccessToken(res.accessToken);
      router.push("/dashboard");
    } catch {
      alert("Could not connect to server. Is the API running?");
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter a valid email address.");
      return;
    }
    setStep("verify");
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length < 6) {
      alert("Please fill in the 6-digit code.");
      return;
    }
    setStep("reset");
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    alert("Password successfully reset! Returning to Login.");
    setStep("signin");
  };

  // Custom digit box handlers
  const handleCodeChange = (val: string, index: number) => {
    const cleanVal = val.replace(/[^0-9]/g, "");
    if (!cleanVal) return;

    const newCode = [...code];
    newCode[index] = cleanVal.slice(-1);
    setCode(newCode);

    // Auto focus next input
    if (index < 5 && codeRefs.current[index + 1]) {
      codeRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const newCode = [...code];
      newCode[index] = "";
      setCode(newCode);

      // Auto focus previous input
      if (index > 0 && codeRefs.current[index - 1]) {
        codeRefs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-zinc-950 font-sans transition-colors duration-300">
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
              Welcome Back
            </h1>
            <p className="mt-3 text-[16px] font-light leading-[22px] max-w-sm text-zinc-200/90">
              Log in to access your dashboard. Manage your reservations, live orders, and guest experiences seamlessly.
            </p>
          </div>

          {/* Dashboard Graphics Mockup */}
          <div className="relative w-full top-20 aspect-[1.3] select-none pointer-events-none self-center">
            <Image
              src="/Auth/AuthIMG.png"
              alt="Dashboard Mockup"
              fill
              className="object-contain object-bottom transform rotate-2 shadow-2xl rounded-lg scale-105"
              priority
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Auth Forms Wizard Container */}
        <div className="w-full lg:w-[56%] min-h-[50vh] lg:h-full flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
          <Card className="max-w-[420px] w-full p-8 sm:p-10 relative">

            {/* SCREEN 1: SIGN IN */}
            {step === "signin" && (
              <form onSubmit={handleSignInSubmit} className="space-y-6 animate-fade-in">
                <div className="space-y-1.5">
                  <h2 className="text-[25px] font-extrabold text-[#111111] dark:text-white tracking-tight leading-none">
                    Welcome back
                  </h2>
                  <p className="text-[13px] text-zinc-400 dark:text-zinc-500 font-medium">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/sign-up"
                      className="text-[#0A46A6] hover:text-[#12503C] hover:underline font-bold transition-all"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Email address"
                    type="email"
                    placeholder="john.doe@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    icon={
                      <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    }
                  />

                  <div className="relative">
                    <Input
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      icon={
                        <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute bottom-3.5 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 focus:outline-none transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit">Sign In</Button>
                </div>

                <div className="text-center pt-2 select-none">
                  <button
                    type="button"
                    onClick={() => setStep("forgot")}
                    className="text-xs font-bold text-[#0A46A6] hover:text-[#12503C] hover:underline transition-all cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
              </form>
            )}

            {/* SCREEN 2: FORGOT PASSWORD */}
            {step === "forgot" && (
              <form onSubmit={handleForgotSubmit} className="space-y-6 animate-fade-in">
                {/* Back button */}
                <button
                  type="button"
                  onClick={() => setStep("signin")}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-all text-zinc-600 dark:text-zinc-300 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="space-y-1.5">
                  <h2 className="text-[25px] font-extrabold text-[#111111] dark:text-white tracking-tight leading-none">
                    Forgot Password?
                  </h2>
                  <p className="text-[13px] text-zinc-400 dark:text-zinc-500 font-medium">
                    Enter an email that is associated with your account
                  </p>
                </div>

                <Input
                  label="Email address"
                  type="email"
                  placeholder="john.doe@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  icon={
                    <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                />

                <div className="pt-2">
                  <Button type="submit">Send Code</Button>
                </div>
              </form>
            )}

            {/* SCREEN 3: VERIFICATION CODE */}
            {step === "verify" && (
              <form onSubmit={handleVerifySubmit} className="space-y-6 animate-fade-in">
                {/* Back button */}
                <button
                  type="button"
                  onClick={() => setStep("forgot")}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-all text-zinc-600 dark:text-zinc-300 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="space-y-1.5">
                  <h2 className="text-[25px] font-extrabold text-[#111111] dark:text-white tracking-tight leading-none">
                    Verification Code
                  </h2>
                  <p className="text-[13px] text-zinc-400 dark:text-zinc-500 font-medium">
                    Enter the code send to <span className="font-bold text-zinc-600 dark:text-zinc-300">{email || "abc@gmail.com"}</span>
                  </p>
                </div>

                {/* 6 Digit custom boxes grid */}
                <div className="grid grid-cols-6 gap-2 py-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <input
                      key={i}
                      ref={(el) => { codeRefs.current[i] = el; }}
                      type="text"
                      maxLength={1}
                      value={code[i]}
                      onChange={(e) => handleCodeChange(e.target.value, i)}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      className="w-full aspect-square text-center bg-[#f4f5f6] dark:bg-zinc-800/40 border border-zinc-100/80 dark:border-zinc-800 focus:ring-1 focus:ring-[#0A46A6] focus:border-[#0A46A6] rounded-xl text-zinc-900 dark:text-white font-extrabold text-lg focus:outline-none transition-all shadow-2xs"
                    />
                  ))}
                </div>

                <div className="pt-2">
                  <Button type="submit">Verify</Button>
                </div>

                <div className="text-center pt-2 select-none text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                  Didn&apos;t receive a code?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      alert("Code resent successfully!");
                      setCode(Array(6).fill(""));
                    }}
                    className="font-bold text-[#0A46A6] hover:text-[#12503C] hover:underline cursor-pointer"
                  >
                    Resend
                  </button>
                </div>
              </form>
            )}

            {/* SCREEN 4: SET NEW PASSWORD */}
            {step === "reset" && (
              <form onSubmit={handleResetSubmit} className="space-y-6 animate-fade-in">
                {/* Back button */}
                <button
                  type="button"
                  onClick={() => setStep("verify")}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-all text-zinc-600 dark:text-zinc-300 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="space-y-1.5">
                  <h2 className="text-[25px] font-extrabold text-[#111111] dark:text-white tracking-tight leading-none">
                    Set New Password
                  </h2>
                  <p className="text-[13px] text-zinc-400 dark:text-zinc-500 font-medium">
                    Enter a New Password and Remember it
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      label="Password"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      icon={
                        <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute bottom-3.5 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 focus:outline-none transition-colors cursor-pointer"
                    >
                      {showNewPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      )}
                    </button>
                  </div>

                  <Input
                    label="Re-type password"
                    type="password"
                    placeholder="Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    icon={
                      <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    }
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit">Reset</Button>
                </div>
              </form>
            )}

          </Card>
        </div>

      </div>
    </div>
  );
}
