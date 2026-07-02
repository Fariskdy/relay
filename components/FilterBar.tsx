import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown, SlidersHorizontal } from "lucide-react";
import { classNames } from "@/lib/format";
import type { Member, SortMode } from "@/lib/types";

type FilterBarProps = {
  sort: SortMode;
  onSortChange: (value: SortMode) => void;
  members: Member[];
  selectedMembers: string[];
  onToggleMember: (id: string) => void;
};

const sortOptions: Array<{ value: SortMode; label: string }> = [
  { value: "recent", label: "Most recent" },
  { value: "expiring", label: "Expiring first" },
  { value: "largest", label: "Largest first" },
];

export default function FilterBar({ sort, onSortChange, members, selectedMembers, onToggleMember }: FilterBarProps) {
  const sortLabel = sortOptions.find((item) => item.value === sort)?.label ?? "Most recent";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
      <div className="flex items-center gap-2">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="inline-flex h-10 items-center gap-2 rounded-chip bg-surface-raised px-3 text-sm text-text-secondary transition-colors hover:bg-surface-overlay hover:text-text-primary">
              <SlidersHorizontal size={16} strokeWidth={1.5} />
              {selectedMembers.length ? `${selectedMembers.length} member${selectedMembers.length === 1 ? "" : "s"}` : "Members"}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content align="end" sideOffset={8} className="z-50 w-56 rounded-card bg-surface-raised p-2 text-sm text-text-primary shadow-panel">
              {members.map((member) => {
                const checked = selectedMembers.includes(member.id);
                return (
                  <DropdownMenu.CheckboxItem
                    key={member.id}
                    checked={checked}
                    onCheckedChange={() => onToggleMember(member.id)}
                    className="flex cursor-pointer items-center gap-2 rounded-chip px-2 py-2 outline-none transition-colors hover:bg-surface-overlay"
                  >
                    <span className="grid h-4 w-4 place-items-center text-accent">{checked ? <Check size={14} strokeWidth={1.5} /> : null}</span>
                    <span>{member.name}</span>
                  </DropdownMenu.CheckboxItem>
                );
              })}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="inline-flex h-10 items-center gap-2 rounded-chip bg-surface-raised px-3 text-sm text-text-secondary transition-colors hover:bg-surface-overlay hover:text-text-primary">
              {sortLabel}
              <ChevronDown size={15} strokeWidth={1.5} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content align="end" sideOffset={8} className="z-50 w-44 rounded-card bg-surface-raised p-2 text-sm text-text-primary shadow-panel">
              {sortOptions.map((option) => (
                <DropdownMenu.Item
                  key={option.value}
                  onSelect={() => onSortChange(option.value)}
                  className={classNames(
                    "cursor-pointer rounded-chip px-2 py-2 outline-none transition-colors hover:bg-surface-overlay",
                    sort === option.value && "text-accent",
                  )}
                >
                  {option.label}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
}
