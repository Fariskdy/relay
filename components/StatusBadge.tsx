import { statusDetail, statusLabel, getTransferStatus } from "@/lib/status";
import type { Transfer, TransferStatus } from "@/lib/types";
import { classNames } from "@/lib/format";

const dotClass: Record<TransferStatus, string> = {
  active: "bg-status-active",
  expiring_soon: "bg-status-expiring",
  expired: "bg-status-expired",
  disabled: "bg-status-disabled",
};

type StatusBadgeProps = {
  status?: TransferStatus;
  transfer?: Transfer;
  compact?: boolean;
};

export default function StatusBadge({ status, transfer, compact = false }: StatusBadgeProps) {
  const effectiveStatus = status ?? (transfer ? getTransferStatus(transfer) : "active");
  const label = transfer ? statusDetail(transfer) : statusLabel(effectiveStatus);

  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-xs font-medium text-text-secondary">
      <span className={classNames("h-1.5 w-1.5 rounded-full", dotClass[effectiveStatus])} />
      {compact ? statusLabel(effectiveStatus) : label}
    </span>
  );
}
