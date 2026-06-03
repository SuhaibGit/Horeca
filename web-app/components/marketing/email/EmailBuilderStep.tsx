"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Input from "../../Input";
import {
  EMAIL_BLOCK_PALETTE,
  EmailBlock,
  EmailBlockContent,
  EmailBlockType,
  EmailBuilderSettings,
  createEmailBlock,
  emailFontStack,
  normalizeEmailSettings,
} from "../../../data/mockEmailCampaigns";
import { EmailBlockRenderer } from "./EmailCampaignPreview";

interface EmailBuilderStepProps {
  name: string;
  subject: string;
  description?: string;
  showDescription?: boolean;
  blocks: EmailBlock[];
  settings: EmailBuilderSettings;
  onNameChange: (v: string) => void;
  onSubjectChange: (v: string) => void;
  onDescriptionChange?: (v: string) => void;
  onBlocksChange: (blocks: EmailBlock[]) => void;
  onSettingsChange: (settings: EmailBuilderSettings) => void;
}

function PaletteItem({ type, label }: { type: EmailBlockType; label: string }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type, fromPalette: true },
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      {...listeners}
      {...attributes}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-left cursor-grab active:cursor-grabbing transition-opacity ${isDragging ? "opacity-40" : "hover:border-zinc-200"
        }`}
    >
      <span className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 text-[10px] font-black uppercase">
        {label.slice(0, 2)}
      </span>
      <span className="text-[13px] font-bold text-zinc-800 dark:text-zinc-200">{label}</span>
    </button>
  );
}

function SortableCanvasBlock({
  block,
  settings,
  selected,
  onSelect,
  onRemove,
  onContentChange,
}: {
  block: EmailBlock;
  settings: EmailBuilderSettings;
  selected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onContentChange: (content: EmailBlockContent) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group relative border rounded-lg cursor-pointer ${selected
        ? "border-[#0A46A6] ring-2 ring-[#0A46A6]/20"
        : "border-transparent hover:border-[#0A46A6]/30"
        } ${isDragging ? "opacity-50 z-10" : ""}`}
    >
      <div className="absolute -left-1 top-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <button
          type="button"
          className="p-1 rounded bg-white border border-zinc-200 shadow-sm cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          <svg className="w-3.5 h-3.5 text-zinc-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 4a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2zM7 11a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2zM7 18a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-1 rounded bg-white border border-red-100 text-red-500 shadow-sm cursor-pointer"
          aria-label="Remove block"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <EmailBlockRenderer
        block={block}
        settings={settings}
        editable
        onContentChange={onContentChange}
      />
    </div>
  );
}

function CanvasArea({
  blocks,
  settings: rawSettings,
  previewMode,
  selectedBlockId,
  onSelectBlock,
  onBlocksChange,
}: {
  blocks: EmailBlock[];
  settings: EmailBuilderSettings;
  previewMode: "desktop" | "mobile";
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onBlocksChange: (blocks: EmailBlock[]) => void;
}) {
  const settings = normalizeEmailSettings(rawSettings);
  const { setNodeRef, isOver } = useDroppable({ id: "email-canvas" });
  const canvasWidth = previewMode === "mobile" ? 320 : settings.contentWidth;

  const removeBlock = (id: string) => {
    onBlocksChange(blocks.filter((b) => b.id !== id));
    if (selectedBlockId === id) onSelectBlock(null);
  };

  const updateBlockContent = (id: string, content: EmailBlockContent) => {
    onBlocksChange(
      blocks.map((b) => (b.id === id ? { ...b, content: { ...b.content, ...content } } : b))
    );
  };

  return (
    <div
      ref={setNodeRef}
      onClick={() => onSelectBlock(null)}
      className={`flex-1 min-h-0 rounded-2xl border-2 border-dashed transition-colors p-6 overflow-y-auto ${isOver ? "border-[#0A46A6] bg-[#EBF7FF] /40" : "border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/20"
        }`}
    >
      {blocks.length === 0 ? (
        <div className="h-full min-h-[360px] flex flex-col items-center justify-center text-zinc-400">
          <p className="text-[13px] font-semibold">Drag components here to build your email</p>
        </div>
      ) : (
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="mx-auto rounded-xl overflow-hidden shadow-md transition-all duration-200"
            style={{
              width: canvasWidth,
              maxWidth: "100%",
              backgroundColor: settings.backgroundColor,
              fontFamily: emailFontStack(settings.fontFamily),
              padding: "20px 12px",
            }}
          >
            <div
              className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden"
              style={{ color: settings.textColor }}
            >
              {blocks.map((block) => (
                <SortableCanvasBlock
                  key={block.id}
                  block={block}
                  settings={settings}
                  selected={selectedBlockId === block.id}
                  onSelect={() => onSelectBlock(block.id)}
                  onRemove={() => removeBlock(block.id)}
                  onContentChange={(content) => updateBlockContent(block.id, content)}
                />
              ))}
            </div>
          </div>
        </SortableContext>
      )}
    </div>
  );
}

export default function EmailBuilderStep({
  name,
  subject,
  description = "",
  showDescription = false,
  blocks,
  settings: settingsProp,
  onNameChange,
  onSubjectChange,
  onDescriptionChange,
  onBlocksChange,
  onSettingsChange,
}: EmailBuilderStepProps) {
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const settings = normalizeEmailSettings(settingsProp);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  const patchBlockContent = (id: string, patch: Partial<EmailBlockContent>) => {
    onBlocksChange(
      blocks.map((b) =>
        b.id === id ? { ...b, content: { ...b.content, ...patch } } : b
      )
    );
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragId(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId.startsWith("palette-")) {
      const type = activeId.replace("palette-", "") as EmailBlockType;
      if (overId === "email-canvas" || blocks.some((b) => b.id === overId)) {
        const newBlock = createEmailBlock(type);
        if (overId === "email-canvas") {
          onBlocksChange([...blocks, newBlock]);
        } else {
          const index = blocks.findIndex((b) => b.id === overId);
          const next = [...blocks];
          next.splice(index + 1, 0, newBlock);
          onBlocksChange(next);
        }
      }
      return;
    }

    const oldIndex = blocks.findIndex((b) => b.id === activeId);
    const newIndex = blocks.findIndex((b) => b.id === overId);
    if (oldIndex >= 0 && newIndex >= 0 && oldIndex !== newIndex) {
      onBlocksChange(arrayMove(blocks, oldIndex, newIndex));
    }
  };

  const patchSettings = (patch: Partial<EmailBuilderSettings>) => {
    onSettingsChange(normalizeEmailSettings({ ...settingsProp, ...patch }));
  };

  const activePaletteLabel = activeDragId?.startsWith("palette-")
    ? EMAIL_BLOCK_PALETTE.find((p) => `palette-${p.type}` === activeDragId)?.label
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      autoScroll
    >
      <div className="flex flex-col lg:flex-row flex-1 min-h-0 h-full">
        <aside className="w-full lg:w-[200px] shrink-0 border-r border-zinc-100 dark:border-zinc-800 p-4 overflow-y-auto">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3">
            Drag to add to canvas
          </p>
          <div className="space-y-2">
            {EMAIL_BLOCK_PALETTE.map((item) => (
              <PaletteItem key={item.type} type={item.type} label={item.label} />
            ))}
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0 p-4 gap-3 overflow-hidden">
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setPreviewMode("desktop")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold border cursor-pointer ${previewMode === "desktop"
                ? "border-[#0A46A6] text-[#0A46A6] bg-[#EBF7FF] "
                : "border-zinc-200 text-zinc-500"
                }`}
            >
              Desktop
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode("mobile")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold border cursor-pointer ${previewMode === "mobile"
                ? "border-[#0A46A6] text-[#0A46A6] bg-[#EBF7FF] "
                : "border-zinc-200 text-zinc-500"
                }`}
            >
              Mobile
            </button>
          </div>
          <CanvasArea
            blocks={blocks}
            settings={settingsProp}
            previewMode={previewMode}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            onBlocksChange={onBlocksChange}
          />
        </div>

        <aside className="w-full lg:w-[260px] shrink-0 border-l border-zinc-100 dark:border-zinc-800 p-4 overflow-y-auto space-y-5">
          <div className="space-y-3">
            <p className="text-[12px] font-bold text-zinc-800 dark:text-zinc-200">Campaign Details</p>
            <Input
              id="email-campaign-name"
              label={showDescription ? "Template Name" : "Campaign Name"}
              placeholder="e.g. Spring Menu Launch"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
            />
            {showDescription && onDescriptionChange && (
              <Input
                id="email-template-description"
                label="Short Description"
                placeholder="e.g. Drive sales with a compelling promotion"
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
              />
            )}
            <Input
              id="email-campaign-subject"
              label="Email Subject"
              placeholder="e.g. Discover Our New"
              value={subject}
              onChange={(e) => onSubjectChange(e.target.value)}
            />
          </div>
          {selectedBlock && (
            <div className="space-y-3 p-3 rounded-xl bg-[#EBF7FF] /60 border border-emerald-100">
              <p className="text-[12px] font-bold text-[#0A46A6]">
                Selected: {EMAIL_BLOCK_PALETTE.find((p) => p.type === selectedBlock.type)?.label ?? selectedBlock.type}
              </p>
              {selectedBlock.type === "button" && (
                <label className="block space-y-1">
                  <span className="text-[11px] font-semibold text-zinc-500">This button color</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={selectedBlock.content.buttonColor ?? settings.buttonColor}
                      onChange={(e) =>
                        patchBlockContent(selectedBlock.id, { buttonColor: e.target.value })
                      }
                      className="w-10 h-9 rounded border border-zinc-200 cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        patchBlockContent(selectedBlock.id, { buttonColor: undefined })
                      }
                      className="text-[11px] font-bold text-zinc-500 hover:text-zinc-800 cursor-pointer"
                    >
                      Use global
                    </button>
                  </div>
                </label>
              )}
              <p className="text-[11px] text-zinc-500">Click text on the canvas to edit content.</p>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-[12px] font-bold text-zinc-800 dark:text-zinc-200">Email Settings</p>
            <label className="block space-y-1">
              <span className="text-[11px] font-semibold text-zinc-500">Background Color</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) => patchSettings({ backgroundColor: e.target.value })}
                  className="w-10 h-9 rounded border border-zinc-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.backgroundColor}
                  onChange={(e) => patchSettings({ backgroundColor: e.target.value })}
                  className="flex-1 px-2 py-1.5 text-[12px] font-mono border border-zinc-200 rounded-lg"
                />
              </div>
            </label>
            <label className="block space-y-1">
              <span className="text-[11px] font-semibold text-zinc-500">
                Content Width ({settings.contentWidth}px)
              </span>
              <input
                type="range"
                min={400}
                max={720}
                step={10}
                value={settings.contentWidth}
                onChange={(e) => patchSettings({ contentWidth: Number(e.target.value) })}
                className="w-full"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-[11px] font-semibold text-zinc-500">Font Family</span>
              <select
                value={settings.fontFamily}
                onChange={(e) => patchSettings({ fontFamily: e.target.value })}
                className="w-full px-3 py-2 text-[13px] border border-zinc-200 rounded-xl bg-[#f4f5f6]"
              >
                <option value="Inter">Inter</option>
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
              </select>
            </label>
            <label className="block space-y-1">
              <span className="text-[11px] font-semibold text-zinc-500">Header Color</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.headerColor}
                  onChange={(e) => patchSettings({ headerColor: e.target.value })}
                  className="w-10 h-9 rounded border border-zinc-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.headerColor}
                  onChange={(e) => patchSettings({ headerColor: e.target.value })}
                  className="flex-1 px-2 py-1.5 text-[12px] font-mono border border-zinc-200 rounded-lg"
                />
              </div>
            </label>
            <label className="block space-y-1">
              <span className="text-[11px] font-semibold text-zinc-500">Default Button Color</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.buttonColor}
                  onChange={(e) => patchSettings({ buttonColor: e.target.value })}
                  className="w-10 h-9 rounded border border-zinc-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.buttonColor}
                  onChange={(e) => patchSettings({ buttonColor: e.target.value })}
                  className="flex-1 px-2 py-1.5 text-[12px] font-mono border border-zinc-200 rounded-lg"
                />
              </div>
            </label>
            <label className="block space-y-1">
              <span className="text-[11px] font-semibold text-zinc-500">Text Color</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.textColor}
                  onChange={(e) => patchSettings({ textColor: e.target.value })}
                  className="w-10 h-9 rounded border border-zinc-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.textColor}
                  onChange={(e) => patchSettings({ textColor: e.target.value })}
                  className="flex-1 px-2 py-1.5 text-[12px] font-mono border border-zinc-200 rounded-lg"
                />
              </div>
            </label>
            <label className="block space-y-1">
              <span className="text-[11px] font-semibold text-zinc-500">
                Corner Radius ({settings.cornerRadius}px)
              </span>
              <input
                type="range"
                min={0}
                max={24}
                value={settings.cornerRadius}
                onChange={(e) => patchSettings({ cornerRadius: Number(e.target.value) })}
                className="w-full"
              />
            </label>
          </div>
        </aside>
      </div>

      <DragOverlay>
        {activePaletteLabel ? (
          <div className="px-4 py-2 rounded-xl bg-white border-2 border-[#0A46A6] shadow-lg text-[13px] font-bold">
            {activePaletteLabel}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
