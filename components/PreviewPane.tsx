"use client";

import { Copy, Download, FileStack, Power, Share2, Star } from "lucide-react";
import { Avatar } from "@/components/AvatarStack";
import EmptyPreviewState from "@/components/EmptyPreviewState";
import ExtendExpiryPopover from "@/components/ExtendExpiryPopover";
import FileRow from "@/components/FileRow";
import FileTypeIcon from "@/components/FileTypeIcon";
import StatusBadge from "@/components/StatusBadge";
import { classNames, formatTotalSize, relativeCreated } from "@/lib/format";
import { expiryLabel, getTransferStatus } from "@/lib/status";
import type { Member, Transfer } from "@/lib/types";

type PreviewPaneProps = {
  transfer: Transfer | null;
  members: Member[];
  onCopy: () => void;
  onDownload: (id: string) => void;
  onFavorite: (id: string) => void;
  onExtend: (id: string, days: number, dateLabel: string) => void;
  onDisable: (id: string) => void;
  onEnable: (id: string) => void;
  onBack?: () => void;
};

export default function PreviewPane({ transfer, members, onCopy, onDownload, onFavorite, onExtend, onDisable, onEnable, onBack }: PreviewPaneProps) {
  if (!transfer) {
    return (
      <aside className="flex h-full w-full flex-col bg-surface-raised lg:w-80 lg:shrink-0 lg:border-l lg:border-border-hairline">
        {onBack ? <MobileBack onBack={onBack} /> : null}
        <EmptyPreviewState />
      </aside>
    );
  }

  const status = getTransferStatus(transfer);
  const expired = status === "expired";
  const disabled = status === "disabled";
  const sender = members.find((member) => member.id === transfer.senderId);
  const recipients = transfer.recipientIds.map((id) => members.find((member) => member.id === id)).filter(Boolean) as Member[];

  return (
    <aside className="flex h-full w-full flex-col overflow-hidden bg-surface-raised lg:w-80 lg:shrink-0 lg:border-l lg:border-border-hairline">
      {onBack ? <MobileBack onBack={onBack} /> : null}
      <div key={transfer.id} className="min-h-0 flex-1 overflow-y-auto p-6 pb-24 lg:pb-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
            <FileTypeIcon fileName={transfer.files[0]?.name} size={15} />
            Transfer details
          </div>
          <button
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

        <div className="relative mb-2 grid aspect-video place-items-center rounded-card bg-surface-overlay">
          {transfer.files.length > 1 ? (
            <div className="relative h-20 w-24">
              {transfer.files.slice(0, 3).map((file, index) => (
                <div
                  key={file.name}
                  className="absolute grid h-16 w-14 place-items-center rounded-card bg-surface-raised shadow-card"
                  style={{ left: index * 18, top: index * 8 }}
                >
                  <FileTypeIcon fileName={file.name} size={28} />
                </div>
              ))}
            </div>
          ) : (
            <FileTypeIcon fileName={transfer.files[0]?.name} size={48} />
          )}
          <div className="absolute bottom-3 left-3 rounded-full bg-surface-raised px-2.5 py-1 shadow-card">
            <StatusBadge transfer={transfer} />
          </div>
        </div>

        <h2 className="text-lg font-semibold text-text-primary">{transfer.title}</h2>
        <p className="mt-1 text-[13px] text-text-secondary">{sender ? `Sent by ${sender.name}` : "Sent by Relay"}</p>

        <div className="mt-6">
          <div className="grid grid-cols-3 gap-3">
            <QuickFact label="Size" value={formatTotalSize(transfer.files)} />
            <QuickFact label="Files" value={String(transfer.files.length)} />
            <QuickFact label="Expires" value={expiryLabel(transfer)} />
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">Files</div>
          <div className={classNames(transfer.files.length >= 4 && "max-h-[200px] overflow-y-auto pr-1")}>
            {transfer.files.map((file) => (
              <FileRow key={file.name} file={file} />
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">Shared with</div>
          <div>
            {recipients.map((recipient, index) => (
              <div key={recipient.id} className="flex items-center gap-3 border-t border-border-hairline py-2.5 first:border-t-0">
                <Avatar member={recipient} members={members} size={24} />
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-medium text-text-secondary">{recipient.name}</div>
                  <div className="text-xs text-text-tertiary">{index % 3 === 0 ? "Viewed today" : index % 3 === 1 ? "Pending view" : `Added ${relativeCreated(transfer.createdDaysAgo)}`}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 border-t border-dashed border-border-hairline pt-4">
          <button
            type="button"
            disabled={expired || disabled}
            title={expired || disabled ? "This transfer cannot be downloaded" : "Download files"}
            onClick={() => onDownload(transfer.id)}
            className="mb-3 flex h-10 w-full items-center justify-center gap-2 rounded-chip bg-accent px-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:bg-surface-overlay disabled:text-text-tertiary"
          >
            <Download size={18} strokeWidth={1.5} />
            Download files
          </button>
          <div className="grid grid-cols-3 gap-1">
            <button
              type="button"
              disabled={expired}
              title={expired ? "Expired transfers cannot be copied" : "Copy link"}
              onClick={onCopy}
              className="flex min-w-0 flex-col items-center gap-2 rounded-chip px-2 py-3 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-overlay hover:text-text-primary disabled:text-text-tertiary"
            >
              <Copy size={19} strokeWidth={1.5} />
              Copy link
            </button>
            <ExtendExpiryPopover disabled={expired || disabled} onExtend={(days, dateLabel) => onExtend(transfer.id, days, dateLabel)} />
            <button
              type="button"
              onClick={() => (disabled ? onEnable(transfer.id) : onDisable(transfer.id))}
              className="flex min-w-0 flex-col items-center gap-2 rounded-chip px-2 py-3 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-overlay hover:text-text-primary"
            >
              {disabled ? <Share2 size={19} strokeWidth={1.5} /> : <Power size={19} strokeWidth={1.5} />}
              {disabled ? "Enable" : "Disable"}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

function QuickFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">{label}</div>
      <div className="mt-1 truncate text-sm font-medium text-text-primary">{value}</div>
    </div>
  );
}

function MobileBack({ onBack }: { onBack: () => void }) {
  return (
    <button className="flex h-12 shrink-0 items-center gap-2 border-b border-border-hairline px-4 text-sm font-medium text-text-secondary lg:hidden" onClick={onBack}>
      <FileStack size={17} strokeWidth={1.5} />
      Transfers
    </button>
  );
}
