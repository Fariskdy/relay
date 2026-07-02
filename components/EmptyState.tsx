import { SearchX } from "lucide-react";

type EmptyStateProps = {
  variant: "no-transfers" | "no-results";
  onClearFilters?: () => void;
};

export default function EmptyState({ variant, onClearFilters }: EmptyStateProps) {
  const isNoTransfers = variant === "no-transfers";

  return (
    <div className="grid min-h-[260px] place-items-center rounded-card bg-surface-raised p-8 text-center shadow-card">
      <div>
        <SearchX size={34} strokeWidth={1.5} className="mx-auto mb-4 text-text-tertiary" />
        <h3 className="text-sm font-medium text-text-primary">{isNoTransfers ? "No transfers yet." : "Nothing matches."}</h3>
        <p className="mt-2 max-w-sm text-[13px] text-text-secondary">
          {isNoTransfers ? "Transfers your team sends or receives will show up here." : "Try a different search or clear your filters."}
        </p>
        {!isNoTransfers && onClearFilters ? (
          <button type="button" className="mt-4 text-sm font-medium text-accent hover:text-accent-hover" onClick={onClearFilters}>
            Clear filters
          </button>
        ) : null}
      </div>
    </div>
  );
}
