"use client";

import React, { useState } from "react";
import { useBuilder } from "./BuilderContext";
import { SectionData, ActionItem } from "./types";
import { Trash2, Edit2, Plus, X } from "lucide-react";
import Image from "next/image";

// ─── Toggle helper ────────────────────────────────────────────────────────────
function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <div
      className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${on ? "bg-gradient-to-r from-[#041B40] to-[#0A46A6]" : "bg-gray-300 dark:bg-gray-700"}`}
      onClick={onChange}
    >
      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${on ? "translate-x-4" : "translate-x-0"}`} />
    </div>
  );
}

// ─── Edit Action Item Modal ───────────────────────────────────────────────────
function EditActionModal({
  item,
  onSave,
  onClose,
}: {
  item: ActionItem;
  onSave: (updated: ActionItem) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<ActionItem>({ ...item });

  const isFollowUs = draft.label.toLowerCase().includes("follow");
  const isPromotion =
    draft.label.toLowerCase().includes("promotion") ||
    draft.label.toLowerCase().includes("offer") ||
    draft.label.toLowerCase().includes("deal");

  const updateField = <K extends keyof ActionItem>(key: K, value: ActionItem[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const addSocialLink = () =>
    updateField("socialLinks", [...(draft.socialLinks ?? []), ""]);

  const updateSocialLink = (i: number, val: string) => {
    const links = [...(draft.socialLinks ?? [])];
    links[i] = val;
    updateField("socialLinks", links);
  };

  const removeSocialLink = (i: number) =>
    updateField(
      "socialLinks",
      (draft.socialLinks ?? []).filter((_, idx) => idx !== i)
    );

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-end" onClick={onClose}>
      <div
        className="w-[320px] h-full bg-white dark:bg-[#1C1C1E] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Edit Action Item</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-5 space-y-5">
          {/* Action Name */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              Action Name
            </label>
            <input
              type="text"
              value={draft.label}
              onChange={(e) => updateField("label", e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-100 dark:bg-[#2C2C2E] rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B2870]"
            />
          </div>

          {/* URL (generic actions) */}
          {!isFollowUs && !isPromotion && (
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                Link URL (optional)
              </label>
              <input
                type="text"
                placeholder="https://"
                value={draft.url ?? ""}
                onChange={(e) => updateField("url", e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-100 dark:bg-[#2C2C2E] rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B2870]"
              />
            </div>
          )}

          {/* Promotion toggles */}
          {isPromotion && (
            <div className="space-y-4">
              {[
                { key: "showBankOffer" as const, label: "Show Bank Offer" },
                { key: "showPartnerOffer" as const, label: "Show Partner Offer" },
                { key: "showExclusiveOffer" as const, label: "Show Exclusive Offer" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                  <Toggle
                    on={!!draft[key]}
                    onChange={() => updateField(key, !draft[key])}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Social links */}
          {isFollowUs && (
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
                Add Your Social Link
              </label>
              <div className="space-y-2.5">
                {(draft.socialLinks ?? []).map((link, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={link}
                      onChange={(e) => updateSocialLink(i, e.target.value)}
                      placeholder={
                        i === 0 ? "https://www.Instagram.com" :
                          i === 1 ? "https://www.Facebook.com" :
                            i === 2 ? "https://www.Youtube.com" :
                              "https://..."
                      }
                      className="flex-1 px-3 py-2 bg-gray-100 dark:bg-[#2C2C2E] rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B2870]"
                    />
                    <button
                      onClick={() => removeSocialLink(i)}
                      className="text-red-400 hover:text-red-600 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addSocialLink}
                className="mt-3 w-full py-2 border border-[#0B2870] text-[#0B2870] dark:border-[#3858A6] dark:text-[#3858A6] rounded-full text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-gradient-to-r from-[#041B40] to-[#0A46A6]/5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add New Link
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => onSave(draft)}
            className="w-full py-3 bg-gradient-to-r from-[#041B40] to-[#0A46A6] hover:bg-gradient-to-r from-[#041B40] to-[#0A46A6]/90 text-white rounded-full text-sm font-semibold transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Section Editors ──────────────────────────────────────────────────────────
function HeaderEditor({ data, updateData }: { data: SectionData; updateData: (d: Partial<SectionData>) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Logo</label>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-[#041B40] to-[#0A46A6] rounded-xl flex items-center justify-center overflow-hidden relative">
            {data.logo ? (
              <Image src={data.logo} alt="Logo" fill className="object-cover" />
            ) : (
              <span className="text-white text-xs font-bold">Logo</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button className="px-4 py-1.5 border border-gray-300 dark:border-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
              Change
            </button>
            <button className="px-4 py-1.5 border border-red-200 dark:border-red-900 rounded-full text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
              Delete
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[#00000080]">Show Share Button</label>
        <Toggle on={!!data.showShareButton} onChange={() => updateData({ showShareButton: !data.showShareButton })} />
      </div>
    </div>
  );
}

function HeroEditor({ data, updateData }: { data: SectionData; updateData: (d: Partial<SectionData>) => void }) {
  return (
    <div className="space-y-5">
      {(["heading", "subHeading", "description"] as const).map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
            {field === "subHeading" ? "Sub Heading" : field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          {field === "description" ? (
            <textarea
              value={data[field] ?? ""}
              onChange={(e) => updateData({ [field]: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-gray-100 dark:bg-[#2C2C2E] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2870] resize-none"
            />
          ) : (
            <input
              type="text"
              value={data[field] ?? ""}
              onChange={(e) => updateData({ [field]: e.target.value })}
              className="w-full px-3 py-2 bg-gray-100 dark:bg-[#2C2C2E] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2870]"
            />
          )}
        </div>
      ))}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location Badge</label>
        <Toggle on={!!data.locationBadge} onChange={() => updateData({ locationBadge: !data.locationBadge })} />
      </div>
      {data.locationBadge && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
          <input
            type="text"
            value={data.location ?? ""}
            onChange={(e) => updateData({ location: e.target.value })}
            className="w-full px-3 py-2 bg-gray-100 dark:bg-[#2C2C2E] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2870]"
          />
        </div>
      )}
    </div>
  );
}

function PrimaryActionsEditor({ data, updateData }: { data: SectionData; updateData: (d: Partial<SectionData>) => void }) {
  const [editingItem, setEditingItem] = useState<ActionItem | null>(null);

  const saveItem = (updated: ActionItem) => {
    updateData({
      actionItems: data.actionItems?.map((i) => (i.id === updated.id ? updated : i)),
    });
    setEditingItem(null);
  };

  const removeItem = (id: string) =>
    updateData({ actionItems: data.actionItems?.filter((i) => i.id !== id) });

  const addItem = () => {
    const newItem: ActionItem = { id: `item-${Date.now()}`, label: "New Action", icon: "Star" };
    updateData({ actionItems: [...(data.actionItems ?? []), newItem] });
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Action Items</label>
          <div className="space-y-2 mb-4">
            {data.actionItems?.map((item) => (
              <div key={item.id} className="flex items-center gap-2 group">
                <div className="flex-1 px-3 py-2 bg-white dark:bg-[#2C2C2E] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                  {item.label}
                </div>
                <button
                  onClick={() => setEditingItem(item)}
                  className="p-2 text-gray-400 hover:text-[#0B2870] dark:hover:text-[#5b8ef0] opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addItem}
            className="w-full py-2 border border-[#0B2870] text-[#0B2870] dark:border-[#3858A6] dark:text-[#3858A6] rounded-full text-sm font-medium flex items-center justify-center gap-2 hover:bg-gradient-to-r from-[#041B40] to-[#0A46A6]/5 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Action Item
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Button Style</label>
          <div className="flex gap-3">
            {(["Filled", "Outline"] as const).map((style) => (
              <button
                key={style}
                onClick={() => updateData({ buttonStyle: style })}
                className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${data.buttonStyle === style
                  ? "bg-gradient-to-r from-[#041B40] to-[#0A46A6] text-white"
                  : "border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Edit Modal */}
      {editingItem && (
        <EditActionModal
          item={editingItem}
          onSave={saveItem}
          onClose={() => setEditingItem(null)}
        />
      )}
    </>
  );
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────
export default function BuilderSidebarRight() {
  const { sections, selectedSectionId, updateSection, removeSection } = useBuilder();
  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  if (!selectedSection) {
    return (
      <div className="w-[320px] bg-white dark:bg-[#1C1C1E] border-l border-gray-200 dark:border-gray-800 flex items-center justify-center shrink-0">
        <p className="text-sm text-gray-500">Select a section to edit</p>
      </div>
    );
  }

  const handleUpdate = (d: Partial<SectionData>) => updateSection(selectedSection.id, d);

  return (
    <div className="w-[279px] bg-white dark:bg-[#1C1C1E] border-l border-gray-200 dark:border-gray-800 flex flex-col h-full shrink-0">
      <div className="flex-1 overflow-y-auto scrollbar-hide p-6">
        <div className="mb-6">
          <h3 className="text-[14px] font-semibold text-[#333839]  mb-1">Selected Section</h3>
          <p className="text-[12px] text-[#717680] ">
            {selectedSection.type === "PrimaryActions" ? "Primary Actions" : selectedSection.type}
          </p>
        </div>

        {selectedSection.type === "Header" && <HeaderEditor data={selectedSection} updateData={handleUpdate} />}
        {selectedSection.type === "Hero" && <HeroEditor data={selectedSection} updateData={handleUpdate} />}
        {selectedSection.type === "PrimaryActions" && <PrimaryActionsEditor data={selectedSection} updateData={handleUpdate} />}
        {!["Header", "Hero", "PrimaryActions"].includes(selectedSection.type) && (
          <div className="text-sm text-gray-500 italic">Settings for {selectedSection.type} coming soon.</div>
        )}
      </div>

      <div className="p-6 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={() => removeSection(selectedSection.id)}
          className="w-full py-2.5 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-full text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <Trash2 className="w-4 h-4" /> Remove Section
        </button>
      </div>
    </div>
  );
}
