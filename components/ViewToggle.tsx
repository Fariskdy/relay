import { LayoutGrid, List, Rows3 } from "lucide-react";
import { classNames } from "@/lib/format";
import type { ViewMode } from "@/lib/types";

const options: Array<{ value: ViewMode; label: string; icon: typeof List }> = [
  { value: "list", label: "List view", icon: List },
  { value: "grid", label: "Grid view", icon: LayoutGrid },
  { value: "compact", label: "Compact view", icon: Rows3 },
];

type ViewToggleProps = {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
};

export default function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-full bg-surface-raised p-1">
      {options.map((option) => {
        const Icon = option.icon;
        const active = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            className={classNames(
              "grid h-8 w-8 place-items-center rounded-full text-text-secondary transition-colors duration-100 hover:text-text-primary",
              active && "bg-surface-overlay text-text-primary",
            )}
            onClick={() => onChange(option.value)}
            aria-label={option.label}
            aria-pressed={active}
            title={option.label}
          >
            <Icon size={17} strokeWidth={1.5} />
          </button>
        );
      })}
    </div>
  );
}
