import React, { useState } from "react";
import Input from "../Input";
import Button from "../Button";
import Checkbox from "../Checkbox";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API registration
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8 px-2 animate-fade-in">
        <div className="w-16 h-16 bg-[#f4f5f6] dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-zinc-100 dark:border-zinc-800">
          <svg
            className="w-8 h-8 text-[#0A46A6]"
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
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
          Account Created!
        </h3>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed max-w-xs mx-auto">
          Welcome to HORECAS. We've sent a registration link to{" "}
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            {formData.email}
          </span>.
        </p>
        <div className="mt-6">
          <button
            onClick={() => setIsSuccess(false)}
            className="px-6 py-2.5 bg-linear-to-r from-[#041B40] to-[#0A46A6] hover:bg-[#12503C] text-white font-bold rounded-xl text-xs transition-all shadow-xs"
          >
            Enter Workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-[25px] font-extrabold text-[#111111] dark:text-white tracking-tight leading-none">
          Create your Account
        </h2>
        <p className="mt-2 text-[13px] text-zinc-400 dark:text-zinc-500 font-medium">
          Already have an account?{" "}
          <a
            href="#"
            className="font-bold text-[#0A46A6] dark:text-emerald-400 hover:text-[#12503C] dark:hover:text-emerald-300 transition-colors focus:outline-none"
          >
            Sign in
          </a>
        </p>
      </div>

      {/* Name fields in grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First Name"
          id="firstName"
          name="firstName"
          type="text"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Enter First Name"
          error={errors.firstName}
        />
        <Input
          label="Last Name"
          id="lastName"
          name="lastName"
          type="text"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Enter Last Name"
          error={errors.lastName}
        />
      </div>

      {/* Email field */}
      <Input
        label="Email address"
        id="email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="john.doe@email.com"
        error={errors.email}
        icon={
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        }
      />

      {/* Password field */}
      <Input
        label="Password"
        id="password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        error={errors.password}
        icon={
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        }
      />

      {/* Confirm Password field */}
      <Input
        label="Confirm Password"
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm Password"
        error={errors.confirmPassword}
        icon={
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        }
      />

      {/* Button */}
      <div className="pt-1">
        <Button type="submit" isLoading={isSubmitting}>
          Sign Up
        </Button>
      </div>

      {/* Agreement Checkbox */}
      <Checkbox
        id="agreeToTerms"
        name="agreeToTerms"
        checked={formData.agreeToTerms}
        onChange={handleChange}
        error={errors.agreeToTerms}
        label={
          <>
            <div className="pb-2">
              By creating an account, you agree to our{" "}
              <a
                href="#"
                className="font-bold text-[#0A46A6] dark:text-emerald-400 hover:underline"
              >
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="font-bold text-[#0A46A6] dark:text-emerald-400 hover:underline"
              >
                Privacy Policy
              </a>
            </div>
          </>
        }
      />
    </form>
  );
}
