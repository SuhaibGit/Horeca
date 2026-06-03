"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { getObjectContainPlacement } from "../../lib/floorPlanBlueprintBounds";
import { useFloorCanvasSize } from "../../hooks/useFloorCanvasSize";

interface FloorPlanCanvasProps {
  backgroundImage?: string | null;
  placementRef: React.RefObject<HTMLDivElement | null>;
  onPlacementSizeChange?: (width: number, height: number) => void;
  onCanvasClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  children: React.ReactNode;
}

/**
 * Floor plan with tables positioned inside a layer that tracks the visible
 * blueprint (object-contain). Prevents misalignment when the canvas is resized.
 */
export default function FloorPlanCanvas({
  backgroundImage,
  placementRef,
  onPlacementSizeChange,
  onCanvasClick,
  children,
}: FloorPlanCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerSize = useFloorCanvasSize(containerRef);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setNaturalSize({ width: 0, height: 0 });
  }, [backgroundImage]);

  const placement = useMemo(() => {
    if (backgroundImage && naturalSize.width > 0 && naturalSize.height > 0) {
      return getObjectContainPlacement(
        containerSize.width,
        containerSize.height,
        naturalSize.width,
        naturalSize.height
      );
    }
    return {
      width: containerSize.width,
      height: containerSize.height,
      offsetX: 0,
      offsetY: 0,
    };
  }, [backgroundImage, naturalSize, containerSize.width, containerSize.height]);

  useEffect(() => {
    onPlacementSizeChange?.(placement.width, placement.height);
  }, [placement.width, placement.height, onPlacementSizeChange]);

  const { setNodeRef } = useDroppable({ id: "floor-canvas" });

  return (
    <div
      ref={containerRef}
      onClick={onCanvasClick}
      className={`relative w-full h-[560px] border border-zinc-200/60 dark:border-zinc-800 rounded-[24px] shadow-inner overflow-hidden ${
        backgroundImage
          ? "bg-zinc-100 dark:bg-zinc-950"
          : "bg-zinc-50 dark:bg-zinc-900"
      }`}
    >
      {backgroundImage ? (
        <img
          src={backgroundImage}
          alt="Restaurant floor plan"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
          draggable={false}
          onLoad={(e) => {
            const img = e.currentTarget;
            setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
          }}
        />
      ) : null}

      <div
        ref={(node) => {
          setNodeRef(node);
          if (placementRef) {
            (placementRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }
        }}
        className="absolute"
        style={{
          left: placement.offsetX,
          top: placement.offsetY,
          width: placement.width,
          height: placement.height,
        }}
      >
        {children}
      </div>
    </div>
  );
}
