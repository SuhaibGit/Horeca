export interface BlueprintPlacement {
  /** Width of the area where tables are placed (matches visible blueprint). */
  width: number;
  /** Height of the placement area. */
  height: number;
  /** Offset from the left of the outer canvas (letterbox). */
  offsetX: number;
  /** Offset from the top of the outer canvas (letterbox). */
  offsetY: number;
}

/** Compute the on-screen box for an `object-contain` image inside a container. */
export function getObjectContainPlacement(
  containerWidth: number,
  containerHeight: number,
  imageNaturalWidth: number,
  imageNaturalHeight: number
): BlueprintPlacement {
  if (
    containerWidth <= 0 ||
    containerHeight <= 0 ||
    imageNaturalWidth <= 0 ||
    imageNaturalHeight <= 0
  ) {
    return {
      width: Math.max(containerWidth, 0),
      height: Math.max(containerHeight, 0),
      offsetX: 0,
      offsetY: 0,
    };
  }

  const scale = Math.min(
    containerWidth / imageNaturalWidth,
    containerHeight / imageNaturalHeight
  );
  const width = imageNaturalWidth * scale;
  const height = imageNaturalHeight * scale;

  return {
    width,
    height,
    offsetX: (containerWidth - width) / 2,
    offsetY: (containerHeight - height) / 2,
  };
}
