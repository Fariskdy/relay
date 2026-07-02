import { Folder } from "lucide-react";
import { classNames } from "@/lib/format";
import { statusColorClass, statusLabel } from "@/lib/status";
import type { TransferStatus } from "@/lib/types";

type StatusGroupCardProps = {
  status: TransferStatus;
  count: number;
  active: boolean;
  onClick: () => void;
};

export default function StatusGroupCard({ status, count, active, onClick }: StatusGroupCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        "min-h-[128px] rounded-card bg-surface-raised p-5 text-left shadow-card transition-colors duration-100 ease-out hover:bg-surface-overlay",
        active && "bg-surface-overlay",
      )}
      aria-pressed={active}
    >
      <div className={classNames("mb-5 inline-grid h-10 w-10 place-items-center rounded-xl bg-accent-soft", statusColorClass(status))}>
        <Folder size={20} strokeWidth={1.5} />
      </div>
      <div className="text-sm font-medium text-text-primary">{statusLabel(status)}</div>
      <div className="mt-1 text-[13px] text-text-secondary">
        {count} {count === 1 ? "transfer" : "transfers"}
      </div>
    </button>
  );
}
