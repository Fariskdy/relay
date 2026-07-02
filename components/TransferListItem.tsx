import { Star } from "lucide-react";
import AvatarStack from "@/components/AvatarStack";
import FileTypeIcon from "@/components/FileTypeIcon";
import StatusBadge from "@/components/StatusBadge";
import { classNames, fileCountLabel, relativeCreated } from "@/lib/format";
import type { Member, Transfer, ViewMode } from "@/lib/types";

type TransferListItemProps = {
  transfer: Transfer;
  members: Member[];
  selected: boolean;
  viewMode: ViewMode;
  onSelect: (id: string) => void;
  onFavorite: (id: string) => void;
};

export default function TransferListItem({ transfer, members, selected, viewMode, onSelect, onFavorite }: TransferListItemProps) {
  const recipients = transfer.recipientIds.map((id) => members.find((member) => member.id === id)).filter(Boolean) as Member[];
  const primaryFile = transfer.files[0]?.name;
  const compact = viewMode === "compact";
  const selectedSurface = "bg-accent-soft ring-1 ring-inset ring-accent hover:bg-accent-soft";

  if (viewMode === "grid") {
    return (
      <div
        className={classNames(
          "min-h-[174px] rounded-card p-5 text-left shadow-card transition-colors duration-100",
          selected ? selectedSurface : "bg-surface-raised hover:bg-surface-overlay",
        )}
      >
        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-surface-overlay">
            <FileTypeIcon fileName={primaryFile} size={23} />
          </div>
          <button
            type="button"
            className={classNames(
              "grid h-8 w-8 place-items-center rounded-full transition-colors",
              transfer.favorited ? "bg-accent-soft text-accent hover:bg-accent-soft hover:text-accent" : "text-text-tertiary hover:bg-surface-overlay hover:text-accent",
            )}
            onClick={() => onFavorite(transfer.id)}
            aria-label={transfer.favorited ? "Remove favorite" : "Favorite transfer"}
          >
            <Star size={18} strokeWidth={1.5} fill={transfer.favorited ? "currentColor" : "none"} />
          </button>
        </div>
        <button type="button" onClick={() => onSelect(transfer.id)} className="block w-full text-left">
          <div className="line-clamp-2 text-sm font-medium text-text-primary">{transfer.title}</div>
          <div className="mt-2 text-[13px] text-text-secondary">
            {fileCountLabel(transfer.files.length)} / {relativeCreated(transfer.createdDaysAgo)}
          </div>
          <div className="mt-5 flex items-center justify-between gap-3">
            <AvatarStack members={recipients} allMembers={members} />
            <StatusBadge transfer={transfer} compact />
          </div>
        </button>
      </div>
    );
  }

  return (
    <div
      className={classNames(
        "flex w-full items-center gap-3 rounded-chip pr-2 text-left transition-colors duration-100",
        compact ? "h-11" : "h-[60px]",
        selected ? selectedSurface : "hover:bg-surface-overlay",
      )}
    >
      <button type="button" onClick={() => onSelect(transfer.id)} className="flex min-w-0 flex-1 items-center gap-3 py-2 pl-3 text-left">
        <div className={classNames("grid shrink-0 place-items-center rounded-lg bg-surface-raised", compact ? "h-8 w-8" : "h-9 w-9")}>
          <FileTypeIcon fileName={primaryFile} size={compact ? 17 : 20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-text-primary">{transfer.title}</div>
          {!compact ? (
            <div className="mt-0.5 truncate text-[13px] text-text-secondary">
              {fileCountLabel(transfer.files.length)} / {relativeCreated(transfer.createdDaysAgo)}
            </div>
          ) : null}
        </div>
        <div className="hidden items-center gap-4 sm:flex">
          {!compact ? <AvatarStack members={recipients} allMembers={members} /> : null}
          <StatusBadge transfer={transfer} compact={compact} />
        </div>
      </button>
      <button
        type="button"
        className={classNames(
          "grid h-8 w-8 place-items-center rounded-full transition-colors",
          transfer.favorited ? "bg-accent-soft text-accent hover:bg-accent-soft hover:text-accent" : "text-text-tertiary hover:bg-surface-raised hover:text-accent",
        )}
        onClick={() => onFavorite(transfer.id)}
        aria-label={transfer.favorited ? "Remove favorite" : "Favorite transfer"}
      >
        <Star size={18} strokeWidth={1.5} fill={transfer.favorited ? "currentColor" : "none"} />
      </button>
    </div>
  );
}
