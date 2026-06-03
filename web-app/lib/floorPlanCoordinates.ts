import { FloorPlanTable } from "../components/tables/FloorPlanTableNode";
import { getFloorTableDimensions } from "../components/tables/FloorPlanTableNode";

/** Store positions as fractions of canvas size so layout survives responsive width changes. */
export function tablePositionToPercent(
  x: number,
  y: number,
  canvasWidth: number,
  canvasHeight: number
): { xPct: number; yPct: number } {
  if (canvasWidth <= 0 || canvasHeight <= 0) {
    return { xPct: 0, yPct: 0 };
  }
  return {
    xPct: x / canvasWidth,
    yPct: y / canvasHeight,
  };
}

export function tablePositionToPixels(
  table: FloorPlanTable,
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number } {
  if (table.xPct != null && table.yPct != null && canvasWidth > 0 && canvasHeight > 0) {
    return {
      x: table.xPct * canvasWidth,
      y: table.yPct * canvasHeight,
    };
  }
  return { x: table.x, y: table.y };
}

export function clampTablePosition(
  x: number,
  y: number,
  type: FloorPlanTable["type"],
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number; xPct: number; yPct: number } {
  const { width, height } = getFloorTableDimensions(type);
  const labelSpace = 24;
  const clampedX = Math.max(10, Math.min(canvasWidth - width - 10, x));
  const clampedY = Math.max(10, Math.min(canvasHeight - height - labelSpace, y));
  const { xPct, yPct } = tablePositionToPercent(clampedX, clampedY, canvasWidth, canvasHeight);
  return { x: clampedX, y: clampedY, xPct, yPct };
}

export function withPercentPosition(
  table: FloorPlanTable,
  x: number,
  y: number,
  canvasWidth: number,
  canvasHeight: number
): FloorPlanTable {
  const pos = clampTablePosition(x, y, table.type, canvasWidth, canvasHeight);
  return { ...table, x: pos.x, y: pos.y, xPct: pos.xPct, yPct: pos.yPct };
}

export function tablesToDisplayCoords(
  tables: FloorPlanTable[],
  canvasWidth: number,
  canvasHeight: number
): FloorPlanTable[] {
  if (canvasWidth <= 0 || canvasHeight <= 0) return tables;
  return tables.map((t) => {
    const { x, y } = tablePositionToPixels(t, canvasWidth, canvasHeight);
    return { ...t, x, y };
  });
}
