export function formatReservationDateLabel(date: string, startTime: string): string {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = startTime.split(":").map(Number);
  if (!year || !month || !day) return `${date} ${startTime}`;

  const dateObj = new Date(year, month - 1, day, hour || 0, minute || 0);
  return dateObj.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function generateBookingId(): string {
  return `ORD#${Math.floor(100 + Math.random() * 900)}`;
}

export function isVipTag(tag: string): boolean {
  return tag === "VIP";
}
