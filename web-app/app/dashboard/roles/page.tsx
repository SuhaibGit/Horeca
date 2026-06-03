"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown, Pencil, Trash2, X } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import Modal from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";
import StatCard from "@/components/StatCard";
import Table, { TableColumn } from "@/components/Table";
import Toast from "@/components/Toast";

type MemberStatus = "Present" | "Pending";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  joinedDate: string;
  status: MemberStatus;
}

interface InviteFormState {
  role: string;
  name: string;
  email: string;
  permissions: string[];
}

const ROLE_OPTIONS = [
  "Sub Admin",
  "Super Admin",
  "Marketing Manager",
  "Manager",
  "Staff",
  "Custom",
];

const PERMISSION_OPTIONS = [
  "Dashboard",
  "Live Orders",
  "Reservations",
  "Table Management",
  "Menu Management",
  "Customers",
  "Inventory",
  "Marketing",
  "Reports",
];

const defaultInviteForm: InviteFormState = {
  role: "",
  name: "",
  email: "",
  permissions: [],
};

function formatJoinedDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function getStatusClass(status: MemberStatus) {
  return status === "Present"
    ? "bg-emerald-50 text-emerald-600"
    : "bg-amber-50 text-amber-600";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function RolesPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [deleteMemberId, setDeleteMemberId] = useState<string | null>(null);
  const [inviteForm, setInviteForm] = useState<InviteFormState>(defaultInviteForm);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const isEditing = Boolean(editingMemberId);
  const deleteTarget = members.find((member) => member.id === deleteMemberId);

  const stats = useMemo(() => {
    const active = members.filter((member) => member.status === "Present").length;
    const pending = members.filter((member) => member.status === "Pending").length;
    return {
      total: members.length,
      active,
      pending,
    };
  }, [members]);

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const resetInviteForm = () => {
    setInviteForm(defaultInviteForm);
    setEditingMemberId(null);
    setPermissionsOpen(false);
  };

  const openInviteModal = () => {
    resetInviteForm();
    setInviteOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMemberId(member.id);
    setInviteForm({
      role: member.role,
      name: member.name,
      email: member.email,
      permissions: member.permissions,
    });
    setInviteOpen(true);
  };

  const togglePermission = (permission: string) => {
    setInviteForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((item) => item !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const removePermission = (permission: string) => {
    setInviteForm((prev) => ({
      ...prev,
      permissions: prev.permissions.filter((item) => item !== permission),
    }));
  };

  const handleSaveMember = () => {
    if (!inviteForm.role || !inviteForm.name.trim() || !inviteForm.email.trim()) {
      showToastMessage("Please fill all required fields.");
      return;
    }

    if (inviteForm.permissions.length === 0) {
      showToastMessage("Please select at least one permission.");
      return;
    }

    if (editingMemberId) {
      setMembers((prev) =>
        prev.map((member) =>
          member.id === editingMemberId
            ? {
              ...member,
              name: inviteForm.name.trim(),
              email: inviteForm.email.trim(),
              role: inviteForm.role,
              permissions: inviteForm.permissions,
            }
            : member
        )
      );
      setInviteOpen(false);
      resetInviteForm();
      showToastMessage("Team member updated successfully.");
      return;
    }

    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      name: inviteForm.name.trim(),
      email: inviteForm.email.trim(),
      role: inviteForm.role,
      permissions: inviteForm.permissions,
      joinedDate: formatJoinedDate(new Date()),
      status: "Pending",
    };

    setMembers((prev) => [newMember, ...prev]);
    setInviteOpen(false);
    resetInviteForm();
    showToastMessage("Invitation sent successfully.");
  };

  const handleDeleteMember = () => {
    if (!deleteMemberId) return;
    const target = members.find((member) => member.id === deleteMemberId);
    setMembers((prev) => prev.filter((member) => member.id !== deleteMemberId));
    setDeleteMemberId(null);
    showToastMessage(
      target ? `${target.name} removed successfully.` : "Team member deleted successfully."
    );
  };

  const columns: TableColumn<TeamMember>[] = [
    {
      key: "name",
      header: "Campaign",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EBF7FF] text-xs font-bold text-[#0A46A6]">
            {getInitials(item.name)}
          </div>
          <div>
            <p className="font-semibold text-[#333839]">{item.name}</p>
            <p className="text-xs text-zinc-500">{item.email}</p>
          </div>
        </div>
      ),
    },
    { key: "joinedDate", header: "Joined Date" },
    { key: "role", header: "Role" },
    {
      key: "permissions",
      header: "Audience",
      render: (item) => {
        const visible = item.permissions.slice(0, 2);
        const hiddenCount = item.permissions.length - visible.length;
        return (
          <div className="flex flex-wrap gap-1">
            {visible.map((permission) => (
              <span
                key={permission}
                className="rounded-full bg-[#EBF7FF] px-2 py-0.5 text-[11px] font-semibold text-[#0A46A6]"
              >
                {permission}
              </span>
            ))}
            {hiddenCount > 0 ? (
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-600">
                +{hiddenCount} more
              </span>
            ) : null}
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${getStatusClass(item.status)}`}>
          {item.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Action",
      align: "center",
      render: (item) => (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteMemberId(item.id);
            }}
            className="rounded-md border border-rose-200 p-1.5 text-rose-600 hover:bg-rose-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(item);
            }}
            className="rounded-md border border-zinc-200 p-1.5 text-zinc-600 hover:bg-zinc-50"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto  p-4 md:p-6">
      {members.length === 0 ? (
        <div className="flex min-h-[75vh] items-center justify-center rounded-2xl bg-white">
          <EmptyState
            imageSrc="/emptyMark.png"
            imageAlt="No team members"
            title="No Team Members Added Yet"
            description="Invite staff members, assign roles, and manage access permissions across your restaurant operations from one place."
            action={
              <button
                type="button"
                onClick={openInviteModal}
                className="w-full cursor-pointer rounded-full bg-gradient-to-r from-[#041B40] to-[#0A46A6] px-6 py-3 text-sm font-semibold text-white"
              >
                Invite Team Member
              </button>
            }
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4">
            <h1 className="text-xl font-semibold text-[#333839]">Users & Roles</h1>
            <button
              type="button"
              onClick={openInviteModal}
              className="rounded-full bg-gradient-to-r from-[#041B40] to-[#0A46A6] px-5 py-2 text-sm font-semibold text-white"
            >
              Invite Team Member
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard title="Total Users" value={`${stats.total}`} iconType="orders" />
            <StatCard title="Active" value={`${stats.active}`} iconType="reservations" />
            <StatCard title="Pending" value={`${stats.pending}`} iconType="value" />
          </div>

          <Table<TeamMember>
            columns={columns}
            data={members}
            searchPlaceholder="Search..."
            searchFilter={(item, query) =>
              item.name.toLowerCase().includes(query.toLowerCase()) ||
              item.email.toLowerCase().includes(query.toLowerCase()) ||
              item.role.toLowerCase().includes(query.toLowerCase())
            }
            headerRight={
              <>
                <button className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600">
                  All Roles
                </button>
                <button className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600">
                  Status
                </button>
              </>
            }
          />
        </div>
      )}

      <Modal
        isOpen={inviteOpen}
        onClose={() => {
          setInviteOpen(false);
          resetInviteForm();
        }}
        size="lg"
        className="!max-w-[560px]"
      >
        <div className="p-6">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[24px] font-semibold text-[#333839]">
                {isEditing ? "Edit Sub-Admin & Configure Access" : "Invite Sub-Admin & Configure Access"}
              </h2>
              <p className=" text-[14px] text-[#717680]">
                Set up a new administrator with custom permission levels
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setInviteOpen(false);
                resetInviteForm();
              }}
              className="text-zinc-400 hover:text-zinc-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="relative" >
              <label className="mb-1 block text-xs font-semibold text-zinc-600">
                User Role<span className="text-rose-500">*</span>
              </label>
              <select
                className="appearance-none w-full rounded-lg bg-[#F2F4F7] px-3 py-2 text-sm"
                value={inviteForm.role}
                onChange={(e) => setInviteForm((prev) => ({ ...prev, role: e.target.value }))}
              >
                <option value="">Set Role</option>
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <ChevronDown className={`h-4 w-4 transition-transform absolute right-3 top-1/2 text-zinc-500 pointer-events-none`} />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-zinc-600">
                Full Name<span className="text-rose-500">*</span>
              </label>
              <input
                className="w-full rounded-lg bg-[#F2F4F7] px-3 py-2 text-[14px]"
                placeholder="John doe"
                value={inviteForm.name}
                onChange={(e) => setInviteForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-zinc-600">
                Email Address<span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                className="w-full rounded-lg bg-[#F2F4F7] px-3 py-2 text-[14px]"
                placeholder="admin@school.edu"
                value={inviteForm.email}
                onChange={(e) => setInviteForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="relative">
              <label className="mb-1 block text-xs font-semibold text-zinc-600">
                Permissions<span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setPermissionsOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-lg bg-[#F2F4F7] px-3 py-2 text-left text-[14px] text-zinc-600"
              >
                <span>{inviteForm.permissions.length ? `${inviteForm.permissions.length} selected` : "Set Permissions"}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${permissionsOpen ? "rotate-180" : ""}`} />
              </button>

              {permissionsOpen ? (
                <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg bg-[#F2F4F7] bg-white p-2 shadow-lg">
                  {PERMISSION_OPTIONS.map((permission) => (
                    <label
                      key={permission}
                      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[14px] hover:bg-zinc-50"
                    >
                      <input
                        type="checkbox"
                        checked={inviteForm.permissions.includes(permission)}
                        onChange={() => togglePermission(permission)}
                      />
                      <span>{permission}</span>
                    </label>
                  ))}
                </div>
              ) : null}

              {inviteForm.permissions.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {inviteForm.permissions.map((permission) => (
                    <span
                      key={permission}
                      className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700"
                    >
                      {permission}
                      <button type="button" onClick={() => removePermission(permission)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setInviteOpen(false);
                resetInviteForm();
              }}
              className="rounded-full cursor-pointer border border-zinc-200 px-5 py-2 text-sm font-semibold text-zinc-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveMember}
              className="rounded-full cursor-pointer bg-gradient-to-r from-[#041B40] to-[#0A46A6] px-5 py-2 text-sm font-semibold text-white"
            >
              {isEditing ? "Save Changes" : "Send Invites"}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteMemberId)}
        onClose={() => setDeleteMemberId(null)}
        onConfirm={handleDeleteMember}
        title="Delete Sub-Admin"
        description={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.name}?`
            : "Are you sure you want to delete this sub-admin?"
        }
        confirmLabel="Yes Delete"
        cancelLabel="Cancel"
        variant="danger"
      />

      <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
}
