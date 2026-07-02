import type { Transfer } from "./types";

export function classNames(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function getCreatedDate(transfer: Transfer): Date {
  const date = new Date();
  date.setDate(date.getDate() - transfer.createdDaysAgo);
  return date;
}

export function getExpiryDate(transfer: Transfer): Date | null {
  const date = new Date();
  if (transfer.expiredDaysAgo !== undefined) {
    date.setDate(date.getDate() - transfer.expiredDaysAgo);
    return date;
  }
  if (transfer.expiresInHours !== undefined) {
    date.setHours(date.getHours() + transfer.expiresInHours);
    return date;
  }
  if (transfer.expiresInDays !== undefined) {
    date.setDate(date.getDate() + transfer.expiresInDays);
    return date;
  }
  return null;
}

export function relativeCreated(daysAgo: number): string {
  if (daysAgo === 0) return "today";
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  return formatter.format(-daysAgo, "day");
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export function totalSize(files: { size_mb: number }[]): number {
  return files.reduce((sum, file) => sum + file.size_mb, 0);
}

export function formatFileSize(mb: number): string {
  if (mb < 1) return `${mb.toFixed(1)} MB`;
  if (mb < 1000) return `${Math.round(mb)} MB`;
  return `${(mb / 1000).toFixed(1)} GB`;
}

export function formatTotalSize(files: { size_mb: number }[]): string {
  return formatFileSize(totalSize(files));
}

export function fileCountLabel(count: number): string {
  return `${count} ${count === 1 ? "file" : "files"}`;
}

export function getFileExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

export function mockLink(id: string): string {
  if (typeof window === "undefined") return `https://relay.local/?transfer=${id}`;
  return `${window.location.origin}/?transfer=${id}`;
}
