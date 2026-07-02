import { Plus, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import FilterBar from "@/components/FilterBar";
import ListSkeletons from "@/components/ListSkeletons";
import StatusGroupCard from "@/components/StatusGroupCard";
import TransferListItem from "@/components/TransferListItem";
import ViewToggle from "@/components/ViewToggle";
import type { Member, SortMode, Transfer, TransferStatus, ViewMode } from "@/lib/types";

const statuses: TransferStatus[] = ["active", "expiring_soon", "expired", "disabled"];

type TransferListPaneProps = {
  transfers: Transfer[];
  hasAnyTransfers: boolean;
  eyebrow: string;
  title: string;
  listTitle: string;
  listDescription: string;
  overviewMetrics?: Array<{
    label: string;
    value: string;
    detail: string;
    icon: LucideIcon;
  }>;
  members: Member[];
  selectedId: string | null;
  loading: boolean;
  showStatusGroups: boolean;
  showFilterBar: boolean;
  showViewToggle: boolean;
  activeStatus: TransferStatus | null;
  onStatusChange: (status: TransferStatus | null) => void;
  statusCounts: Record<TransferStatus, number>;
  query: string;
  onQueryChange: (value: string) => void;
  sort: SortMode;
  onSortChange: (value: SortMode) => void;
  selectedMembers: string[];
  onToggleMember: (id: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (value: ViewMode) => void;
  onSelect: (id: string) => void;
  onFavorite: (id: string) => void;
  onClearFilters: () => void;
};

export default function TransferListPane({
  transfers,
  hasAnyTransfers,
  eyebrow,
  title,
  listTitle,
  listDescription,
  overviewMetrics,
  members,
  selectedId,
  loading,
  showStatusGroups,
  showFilterBar,
  showViewToggle,
  activeStatus,
  onStatusChange,
  statusCounts,
  query,
  onQueryChange,
  sort,
  onSortChange,
  selectedMembers,
  onToggleMember,
  viewMode,
  onViewModeChange,
  onSelect,
  onFavorite,
  onClearFilters,
}: TransferListPaneProps) {
  return (
    <section className="flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-surface-base">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border-hairline px-5 lg:px-8">
        <div>
          <div className="text-[13px] font-medium text-text-secondary">{eyebrow}</div>
          <h1 className="mt-0.5 text-2xl font-semibold text-text-primary">{title}</h1>
        </div>
        <div className="flex min-w-0 items-center gap-3">
          <label className="hidden h-10 w-[280px] items-center rounded-full bg-surface-overlay px-3 text-text-secondary sm:flex">
            <Search size={16} strokeWidth={1.5} className="shrink-0" />
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search transfers, files, or people"
              className="min-w-0 flex-1 bg-transparent pl-2 text-sm text-text-primary outline-none placeholder:text-text-tertiary"
            />
          </label>
          <button
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-chip bg-accent px-3.5 text-sm font-semibold text-white shadow-card ring-1 ring-inset ring-white/10 transition-colors hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface-base"
            aria-label="New transfer"
            title="Not available in this demo"
          >
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-white/15">
              <Plus size={15} strokeWidth={2} />
            </span>
            <span className="hidden xl:inline">New transfer</span>
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-7">
          <label className="flex h-10 items-center rounded-full bg-surface-overlay px-3 text-text-secondary sm:hidden">
            <Search size={16} strokeWidth={1.5} className="shrink-0" />
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search transfers, files, or people"
              className="min-w-0 flex-1 bg-transparent pl-2 text-sm text-text-primary outline-none placeholder:text-text-tertiary"
            />
          </label>

          {overviewMetrics ? (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">Workspace pulse</h2>
                <span className="text-xs text-text-tertiary">Live mock snapshot</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {overviewMetrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.label} className="min-h-[132px] rounded-card bg-surface-raised p-5 shadow-card">
                      <div className="mb-5 flex items-start justify-between gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-card bg-accent-soft text-accent">
                          <Icon size={19} strokeWidth={1.5} />
                        </div>
                        <div className="text-3xl font-semibold leading-none text-text-primary">{metric.value}</div>
                      </div>
                      <div className="text-sm font-medium text-text-primary">{metric.label}</div>
                      <div className="mt-1 text-[13px] text-text-secondary">{metric.detail}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {showStatusGroups ? (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">Folders</h2>
                {activeStatus ? (
                  <button className="text-xs font-medium text-accent hover:text-accent-hover" onClick={() => onStatusChange(null)}>
                    Clear status
                  </button>
                ) : null}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statuses.map((status) => (
                  <StatusGroupCard
                    key={status}
                    status={status}
                    count={statusCounts[status]}
                    active={activeStatus === status}
                    onClick={() => onStatusChange(activeStatus === status ? null : status)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-text-primary">{listTitle}</h2>
                <p className="mt-1 text-[13px] text-text-secondary">{listDescription}</p>
              </div>
              {showViewToggle ? <ViewToggle value={viewMode} onChange={onViewModeChange} /> : null}
            </div>

            {showFilterBar ? <FilterBar sort={sort} onSortChange={onSortChange} members={members} selectedMembers={selectedMembers} onToggleMember={onToggleMember} /> : null}

            {loading ? (
              <ListSkeletons />
            ) : transfers.length === 0 ? (
              <EmptyState variant={hasAnyTransfers ? "no-results" : "no-transfers"} onClearFilters={onClearFilters} />
            ) : (
              <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 xl:grid-cols-3" : "rounded-card bg-surface-raised p-2 shadow-card"}>
                {transfers.map((transfer) => (
                  <TransferListItem
                    key={transfer.id}
                    transfer={transfer}
                    members={members}
                    selected={selectedId === transfer.id}
                    viewMode={viewMode}
                    onSelect={onSelect}
                    onFavorite={onFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
