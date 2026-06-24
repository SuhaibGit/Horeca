"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { apiGet, apiPatch, apiPost, apiUpload, getAccessToken, resolveMediaUrl } from "@/lib/api";
import {
  Building2,
  Camera,
  CreditCard,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  Mail,
  User,
} from "lucide-react";
import Input from "@/components/Input";
import ConfirmDialog from "@/components/ConfirmDialog";
import Toast from "@/components/Toast";


type SettingsTab = "profile" | "password" | "business" | "payment";

const VENUE_CATEGORIES = [
  "Restaurant",
  "Cafe",
  "Hotel",
  "Lounge",
  "Beach Club",
  "Bar",
  "Night Club",
];
function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

const TAB_ITEMS: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
  { id: "password", label: "Password", icon: <Lock className="h-4 w-4" /> },
  { id: "business", label: "Business Detail", icon: <Building2 className="h-4 w-4" /> },
  { id: "payment", label: "Payment Settings", icon: <CreditCard className="h-4 w-4" /> },
];

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
}

interface PasswordForm {
  current: string;
  next: string;
  confirm: string;
}

interface BusinessForm {
  brandLogoUrl: string;
  venueName: string;
  venueCategory: string;
  brandColor: string;
}

interface PaymentForm {
  cardholderName: string;
  cardLast4: string;
  expiry: string;
  autoRenewal: boolean;
}

const initialProfile: ProfileForm = {
  firstName: "John",
  lastName: "Williams",
  email: "john.doe@email.com",
  avatarUrl: "/avatars/avatar.jpg",
};

const initialBusiness: BusinessForm = {
  brandLogoUrl: "/Auth/TempLogo.png",
  venueName: "Horeca",
  venueCategory: "Cafe",
  brandColor: "#343edf",
};

const initialPayment: PaymentForm = {
  cardholderName: "John Williams",
  cardLast4: "3794",
  expiry: "08/28",
  autoRenewal: true,
};

function SectionHeader({
  title,
  description,
  isEditing,
  onEdit,
  onCancel,
  onSave,
}: {
  title: string;
  description: string;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void | Promise<void>;
}) {
  useEffect(() => { }, [])


  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-100 pb-5">
      <div>
        <h2 className="text-lg font-semibold text-[#333839]">{title}</h2>
        <p className="mt-1 text-sm text-[#717680]">{description}</p>
      </div>
      {isEditing ? (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="rounded-full bg-gradient-to-r from-[#041B40] to-[#0A46A6] px-5 py-2 text-sm font-medium text-white"
          >
            Save
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onEdit}
          className="rounded-full bg-gradient-to-r from-[#041B40] to-[#0A46A6] px-5 py-2 text-sm font-medium text-white"
        >
          Edit
        </button>
      )}
    </div>
  );
}

function SettingsField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block select-none text-[14px] font-medium text-[#454545]">
        {label}
      </label>
      {children}
    </div>
  );
}

function ReadOnlyField({ value }: { value: string }) {
  return (
    <div className="rounded-xl border border-[#DCDFE4] bg-[#f4f5f6] px-4 py-3.5 text-[13px] font-medium text-zinc-800">
      {value}
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const brandLogoInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [editingTab, setEditingTab] = useState<SettingsTab | null>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [avatarError, setAvatarError] = useState(false);

  const [profile, setProfile] = useState<ProfileForm>(initialProfile);
  const [profileDraft, setProfileDraft] = useState<ProfileForm>(initialProfile);

  const [showSavedPassword, setShowSavedPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    current: "",
    next: "",
    confirm: "",
  });

  const [business, setBusiness] = useState<BusinessForm>(initialBusiness);
  const [businessDraft, setBusinessDraft] = useState<BusinessForm>(initialBusiness);
  const [brandLogoFile, setBrandLogoFile] = useState<File | null>(null);

  const [payment, setPayment] = useState<PaymentForm>(initialPayment);
  const [paymentDraft, setPaymentDraft] = useState<PaymentForm>(initialPayment);

  const isEditing = editingTab === activeTab;

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };
  useEffect(() => {
    async function loadProfile() {
      const token = getAccessToken();
      if (!token) return;

      const res = await apiGet<{
        success: boolean;
        user?: { full_name: string; email: string };
      }>("/auth/me", token);

      if (res.success && res.user) {
        const { firstName, lastName } = splitName(res.user.full_name);
        const loaded: ProfileForm = {
          firstName,
          lastName,
          email: res.user.email,
          avatarUrl: initialProfile.avatarUrl,
        };
        setProfile(loaded);
        setProfileDraft(loaded);
      }
    }

    async function loadVenue() {
      const token = getAccessToken();
      if (!token) return;

      const res = await apiGet<{
        success: boolean;
        venue?: {
          name: string;
          category: string;
          brand_color: string;
          logo_url: string | null;
        };
      }>("/venues/me", token);

      if (res.success && res.venue) {
        const loaded: BusinessForm = {
          venueName: res.venue.name,
          venueCategory: res.venue.category,
          brandColor: res.venue.brand_color,
          brandLogoUrl: res.venue.logo_url ?? "/Auth/TempLogo.png",
        };
        setBusiness(loaded);
        setBusinessDraft(loaded);
      }
    }

    loadProfile();
    loadVenue();
  }, []);


  const startEdit = () => {
    if (activeTab === "profile") setProfileDraft(profile);
    if (activeTab === "business") setBusinessDraft(business);
    if (activeTab === "payment") setPaymentDraft(payment);
    if (activeTab === "password") {
      setPasswordForm({ current: "", next: "", confirm: "" });
      setShowSavedPassword(false);
    }
    setEditingTab(activeTab);
  };

  const cancelEdit = () => {
    setEditingTab(null);
    setBrandLogoFile(null);
    setPasswordForm({ current: "", next: "", confirm: "" });
    setShowSavedPassword(false);
  };

  const saveEdit = async () => {
    if (activeTab === "password") {
      if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
        showToastMessage("Please fill in all password fields.");
        return;
      }
      if (passwordForm.next !== passwordForm.confirm) {
        showToastMessage("New password and confirmation do not match.");
        return;
      }
      if (passwordForm.next.length < 8) {
        showToastMessage("Password must be at least 8 characters.");
        return;
      }

      try {
        const res = await apiPost<{ success: boolean; message?: string }>(
          "/auth/change-password",
          {
            current_password: passwordForm.current,
            new_password: passwordForm.next,
          },
          true
        );

        if (!res.success) {
          showToastMessage(res.message || "Could not update password.");
          return;
        }

        setPasswordForm({ current: "", next: "", confirm: "" });
        setShowSavedPassword(false);
        setEditingTab(null);
        showToastMessage("Password updated successfully.");
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Could not connect to server.";
        showToastMessage(message);
      }
      return;
    }

    if (activeTab === "profile") {
      const token = getAccessToken();
      if (!token) {
        showToastMessage("Please sign in again.");
        return;
      }

      const full_name =
        `${profileDraft.firstName.trim()} ${profileDraft.lastName.trim()}`.trim();

      try {
        const res = await apiPatch<{
          success: boolean;
          message?: string;
        }>("/users/me", {
          full_name,
          email: profileDraft.email.trim(),
        });

        if (!res.success) {
          showToastMessage(res.message || "Could not update profile.");
          return;
        }

        setProfile(profileDraft);
        setEditingTab(null);
        showToastMessage("Profile updated successfully.");
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Could not connect to server.";
        showToastMessage(message);
      }
      return;
    }

    if (activeTab === "business") {
      const hex = businessDraft.brandColor.trim();
      if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex)) {
        showToastMessage("Enter a valid brand color (e.g. #343edf).");
        return;
      }

      try {
        let logoUrl: string | undefined;

        if (brandLogoFile) {
          const uploadRes = await apiUpload<{
            success: boolean;
            url?: string;
            message?: string;
          }>("/uploads/logo", brandLogoFile);

          if (!uploadRes.success || !uploadRes.url) {
            showToastMessage(uploadRes.message || "Could not upload logo.");
            return;
          }

          logoUrl = uploadRes.url;
        }

        const res = await apiPatch<{
          success: boolean;
          message?: string;
          venue?: {
            name: string;
            category: string;
            brand_color: string;
            logo_url: string | null;
          };
        }>("/venues/me", {
          name: businessDraft.venueName.trim(),
          category: businessDraft.venueCategory,
          brand_color: hex,
          ...(logoUrl ? { logo_url: logoUrl } : {}),
        });

        if (!res.success) {
          showToastMessage(res.message || "Could not save business details.");
          return;
        }

        const savedBusiness: BusinessForm = {
          venueName: businessDraft.venueName.trim(),
          venueCategory: businessDraft.venueCategory,
          brandColor: hex,
          brandLogoUrl: logoUrl ?? businessDraft.brandLogoUrl,
        };
        setBusiness(savedBusiness);
        setBusinessDraft(savedBusiness);
        setBrandLogoFile(null);
        setEditingTab(null);
        showToastMessage("Business details saved.");
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Could not connect to server.";
        showToastMessage(message);
      }
      return;
    } else if (activeTab === "payment") {
      setPayment(paymentDraft);
      showToastMessage("Payment settings saved.");
    }
    setEditingTab(null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToastMessage("Image must be under 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setAvatarError(false);
      setProfileDraft((prev) => ({ ...prev, avatarUrl: url }));
      if (editingTab === "profile") return;
      setProfile((prev) => ({ ...prev, avatarUrl: url }));
      showToastMessage("Profile photo updated.");
    };
    reader.readAsDataURL(file);
  };

  const handleBrandLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToastMessage("Logo must be under 5MB.");
      return;
    }
    setBrandLogoFile(file);
    setBusinessDraft((b) => ({
      ...b,
      brandLogoUrl: URL.createObjectURL(file),
    }));
  };

  const displayProfile = isEditing && activeTab === "profile" ? profileDraft : profile;
  const displayBusiness = isEditing && activeTab === "business" ? businessDraft : business;
  const displayPayment = isEditing && activeTab === "payment" ? paymentDraft : payment;

  const brandLogoSrc = resolveMediaUrl(displayBusiness.brandLogoUrl);
  const brandLogoUnoptimized =
    displayBusiness.brandLogoUrl.startsWith("data:") ||
    displayBusiness.brandLogoUrl.startsWith("blob:");

  const sectionMeta: Record<
    SettingsTab,
    { title: string; description: string }
  > = {
    profile: {
      title: "Basic Information",
      description:
        "Your key details that help identify and personalize your experience.",
    },
    password: {
      title: "Password",
      description: "Update your password to keep your account secure.",
    },
    business: {
      title: "Business Detail",
      description:
        "Manage your brand identity, venue details, and visual styling.",
    },
    payment: {
      title: "Payment Settings",
      description: "Manage your default payment method and billing preferences.",
    },
  };

  return (
    <div className="flex-1 p-4 md:p-0">
      <h1 className="mb-6 text-[28px] font-semibold text-[#333839]">Settings</h1>

      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
        <div className="flex flex-col lg:flex-row">
          {/* Left tab navigation */}
          <nav className="flex shrink-0 flex-row gap-2 overflow-x-auto border-b border-zinc-100 p-4 lg:w-[220px] lg:flex-col lg:border-b-0 lg:border-r lg:p-5">

            {TAB_ITEMS.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setEditingTab(null);
                    setShowSavedPassword(false);
                  }}
                  className={`flex items-center gap-2.5 cursor-pointer rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all whitespace-nowrap ${active
                    ? "bg-gradient-to-r from-[#041B40] to-[#0A46A6] text-white shadow-sm"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
                    }`}
                >
                  {item.icon}
                  {item.label}
                </button>

              );
            })}

            <button
              type="button"
              onClick={() => setLogoutOpen(true)}
              className="mt-0 flex items-center gap-2.5 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 lg:mt-auto"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </nav>

          {/* Right panel */}
          <div className="min-w-0 flex-1 p-6 md:p-8">
            <SectionHeader
              title={sectionMeta[activeTab].title}
              description={sectionMeta[activeTab].description}
              isEditing={isEditing}
              onEdit={startEdit}
              onCancel={cancelEdit}
              onSave={saveEdit}
            />

            <div className="mt-6">
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div className="relative h-24 w-24 shrink-0">
                    <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-zinc-100 bg-zinc-100">
                      {!avatarError && displayProfile.avatarUrl ? (
                        <Image
                          src={displayProfile.avatarUrl}
                          alt="Profile"
                          fill
                          className="object-cover"
                          onError={() => setAvatarError(true)}
                          unoptimized={displayProfile.avatarUrl.startsWith("data:")}
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-[#0A46A6]">
                          {displayProfile.firstName.charAt(0)}
                          {displayProfile.lastName.charAt(0)}
                        </span>
                      )}
                    </div>
                    {isEditing && (
                      <>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-r from-[#041B40] to-[#0A46A6] text-white shadow-md"
                          aria-label="Change profile photo"
                        >
                          <Camera className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      label="First Name"
                      id="firstName"
                      placeholder="Enter First Name"
                      value={displayProfile.firstName}
                      onChange={(e) =>
                        setProfileDraft((p) => ({ ...p, firstName: e.target.value }))
                      }
                      disabled={!isEditing}
                    />
                    <Input
                      label="Last Name"
                      id="lastName"
                      placeholder="Enter Last Name"
                      value={displayProfile.lastName}
                      onChange={(e) =>
                        setProfileDraft((p) => ({ ...p, lastName: e.target.value }))
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <Input
                    label="Email address"
                    id="email"
                    type="email"
                    value={displayProfile.email}
                    onChange={(e) =>
                      setProfileDraft((p) => ({ ...p, email: e.target.value }))
                    }
                    disabled={!isEditing}
                    icon={<Mail className="h-4 w-4" />}
                  />
                </div>
              )}

              {activeTab === "password" && (
                <div className="max-w-md">
                  {isEditing ? (
                    <div className="space-y-4">
                      <Input
                        label="Current Password"
                        id="currentPassword"
                        type="password"
                        placeholder="Enter current password"
                        value={passwordForm.current}
                        onChange={(e) =>
                          setPasswordForm((p) => ({ ...p, current: e.target.value }))
                        }
                      />
                      <Input
                        label="New Password"
                        id="newPassword"
                        type="password"
                        placeholder="Enter new password"
                        value={passwordForm.next}
                        onChange={(e) =>
                          setPasswordForm((p) => ({ ...p, next: e.target.value }))
                        }
                      />
                      <Input
                        label="Confirm New Password"
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                        value={passwordForm.confirm}
                        onChange={(e) =>
                          setPasswordForm((p) => ({ ...p, confirm: e.target.value }))
                        }
                      />
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-[14px] font-medium text-[#454545] block select-none">
                        Password
                      </label>
                      <div className="flex items-center gap-3 rounded-xl border border-[#DCDFE4] bg-white px-4 py-3.5 shadow-2xs">
                        <span className="flex-1 text-[13px] font-medium tracking-wide text-zinc-800">
                          {showSavedPassword
                            ? "Your password is set"
                            : "••••••••••••"}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowSavedPassword((v) => !v)}
                          className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-[#0A46A6] hover:underline"
                        >
                          {showSavedPassword ? (
                            <>
                              <EyeOff className="h-4 w-4" />
                              Hide password
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4" />
                              Show password
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "business" && (
                <div className="max-w-lg space-y-5">
                  <SettingsField label="Brand Logo">
                    {isEditing ? (
                      <>
                        <input
                          ref={brandLogoInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleBrandLogoChange}
                        />
                        <button
                          type="button"
                          onClick={() => brandLogoInputRef.current?.click()}
                          className="relative flex h-28 w-full max-w-sm items-center justify-center overflow-hidden rounded-xl border border-[#DCDFE4] bg-[#f4f5f6] transition-colors hover:border-[#0A46A6]/40"
                        >
                          <div className="relative h-16 w-40">
                            <Image
                              src={brandLogoSrc}
                              alt="Brand logo"
                              fill
                              className="object-contain"
                              unoptimized={brandLogoUnoptimized}
                            />
                          </div>
                          <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#041B40] to-[#0A46A6] text-white shadow-md">
                            <Camera className="h-3.5 w-3.5" />
                          </span>
                        </button>
                      </>
                    ) : (
                      <div className="flex h-28 w-full max-w-sm items-center justify-center rounded-xl border border-[#DCDFE4] bg-[#f4f5f6] px-6">
                        <div className="relative h-16 w-40">
                          <Image
                            src={brandLogoSrc}
                            alt="Brand logo"
                            fill
                            className="object-contain"
                            unoptimized={brandLogoUnoptimized}
                          />
                        </div>
                      </div>
                    )}
                  </SettingsField>

                  {isEditing ? (
                    <>
                      <Input
                        label="Venue Name"
                        id="venueName"
                        value={displayBusiness.venueName}
                        onChange={(e) =>
                          setBusinessDraft((b) => ({ ...b, venueName: e.target.value }))
                        }
                        placeholder="Enter venue name"
                      />
                      <SettingsField label="Venue Category">
                        <select
                          id="venueCategory"
                          value={displayBusiness.venueCategory}
                          onChange={(e) =>
                            setBusinessDraft((b) => ({
                              ...b,
                              venueCategory: e.target.value,
                            }))
                          }
                          className="w-full rounded-xl border border-[#DCDFE4] bg-white px-4 py-3.5 text-[13px] font-medium text-zinc-800 shadow-2xs focus:border-[#0A46A6]/80 focus:outline-none focus:ring-1 focus:ring-[#0A46A6]/80"
                        >
                          {VENUE_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </SettingsField>
                      <SettingsField label="Brand Color">
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={displayBusiness.brandColor}
                            onChange={(e) =>
                              setBusinessDraft((b) => ({
                                ...b,
                                brandColor: e.target.value,
                              }))
                            }
                            className="h-11 w-11 shrink-0 cursor-pointer rounded-lg border border-[#DCDFE4] bg-white p-0.5"
                            aria-label="Pick brand color"
                          />
                          <input
                            type="text"
                            value={displayBusiness.brandColor}
                            onChange={(e) =>
                              setBusinessDraft((b) => ({
                                ...b,
                                brandColor: e.target.value,
                              }))
                            }
                            className="flex-1 rounded-xl border border-[#DCDFE4] bg-white px-4 py-3.5 text-[13px] font-medium uppercase text-zinc-800 shadow-2xs focus:border-[#0A46A6]/80 focus:outline-none focus:ring-1 focus:ring-[#0A46A6]/80"
                            placeholder="#343edf"
                          />
                        </div>
                      </SettingsField>
                    </>
                  ) : (
                    <>
                      <SettingsField label="Venue Name">
                        <ReadOnlyField value={displayBusiness.venueName} />
                      </SettingsField>
                      <SettingsField label="Venue Category">
                        <ReadOnlyField value={displayBusiness.venueCategory} />
                      </SettingsField>
                      <SettingsField label="Brand Color">
                        <div className="flex items-center gap-3 rounded-xl border border-[#DCDFE4] bg-[#f4f5f6] px-4 py-3.5">
                          <span
                            className="h-9 w-9 shrink-0 rounded-lg border border-zinc-200/80 shadow-sm"
                            style={{ backgroundColor: displayBusiness.brandColor }}
                            aria-hidden
                          />
                          <span className="text-[13px] font-medium uppercase text-zinc-800">
                            {displayBusiness.brandColor}
                          </span>
                        </div>
                      </SettingsField>
                    </>
                  )}
                </div>
              )}

              {activeTab === "payment" && (
                <div className="max-w-lg space-y-5">
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Default card
                    </p>
                    <p className="mt-2 text-lg font-semibold text-[#333839]">
                      •••• •••• •••• {displayPayment.cardLast4}
                    </p>
                    <p className="text-sm text-[#717680]">
                      {displayPayment.cardholderName} · Expires {displayPayment.expiry}
                    </p>
                  </div>

                  {isEditing && (
                    <>
                      <Input
                        label="Cardholder Name"
                        id="cardholderName"
                        value={paymentDraft.cardholderName}
                        onChange={(e) =>
                          setPaymentDraft((p) => ({
                            ...p,
                            cardholderName: e.target.value,
                          }))
                        }
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Last 4 digits"
                          id="cardLast4"
                          maxLength={4}
                          value={paymentDraft.cardLast4}
                          onChange={(e) =>
                            setPaymentDraft((p) => ({
                              ...p,
                              cardLast4: e.target.value.replace(/\D/g, "").slice(0, 4),
                            }))
                          }
                        />
                        <Input
                          label="Expiry (MM/YY)"
                          id="expiry"
                          placeholder="08/28"
                          value={paymentDraft.expiry}
                          onChange={(e) =>
                            setPaymentDraft((p) => ({ ...p, expiry: e.target.value }))
                          }
                        />
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-4">
                    <div>
                      <p className="text-sm font-semibold text-[#333839]">Auto-renewal</p>
                      <p className="text-xs text-[#717680]">
                        Automatically renew your subscription each billing cycle.
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={!isEditing}
                      onClick={() =>
                        setPaymentDraft((p) => ({ ...p, autoRenewal: !p.autoRenewal }))
                      }
                      className={`relative cursor-pointer h-7 w-12 rounded-full transition-colors ${displayPayment.autoRenewal ? "bg-gradient-to-r from-[#041B40] to-[#0A46A6] " : "bg-zinc-300"
                        } ${!isEditing ? "cursor-default" : "cursor-pointer"}`}
                      aria-pressed={displayPayment.autoRenewal}
                    >
                      <span
                        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${displayPayment.autoRenewal ? "left-[22px]" : "left-0.5"
                          }`}
                      />
                    </button>
                  </div>

                  <button
                    type="button"
                    className="text-sm font-semibold text-[#0A46A6] hover:underline"
                    onClick={() => showToastMessage("Billing portal opening soon.")}
                  >
                    Manage subscription in Billing →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={() => {
          setLogoutOpen(false);
          localStorage.removeItem("accessToken");
          router.push("/sign-in");
        }}
        title="Log out?"
        description="You will need to sign in again to access your dashboard."
        confirmLabel="Logout"
        cancelLabel="Cancel"
        variant="danger"
        icon={<LogOut className="h-6 w-6 text-red-500" />}
      />

      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} isVisible={true} />
      )}
    </div>
  );
}
