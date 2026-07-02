import type { Transfer, TransferStatus } from "./types";

export type { TransferStatus };

export function getTransferStatus(transfer: Transfer): TransferStatus {
  if (transfer.disabled || transfer.status === "disabled") return "disabled";
  return transfer.status;
}

export function statusLabel(status: TransferStatus): string {
  if (status === "expiring_soon") return "Expiring soon";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function statusDetail(transfer: Transfer): string {
  const status = getTransferStatus(transfer);
  if (status === "disabled") return "Disabled";
  if (status === "expired") return "Expired";
  if (transfer.expiresInHours !== undefined) return `Expiring in ${transfer.expiresInHours}h`;
  if ((transfer.expiresInDays ?? 0) <= 1) return "Expiring tomorrow";
  return "Active";
}

export function expiryLabel(transfer: Transfer): string {
  const status = getTransferStatus(transfer);
  if (status === "disabled") return "-";
  if (status === "expired") return `${transfer.expiredDaysAgo ?? 0} days ago`;
  if (transfer.expiresInHours !== undefined) return `in ${transfer.expiresInHours} hours`;
  return `in ${transfer.expiresInDays ?? 1} days`;
}

export function statusColorClass(status: TransferStatus): string {
  if (status === "expiring_soon") return "text-status-expiring";
  if (status === "expired") return "text-status-expired";
  if (status === "disabled") return "text-status-disabled";
  return "text-status-active";
}
