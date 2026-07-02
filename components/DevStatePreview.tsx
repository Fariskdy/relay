import * as Popover from "@radix-ui/react-popover";
import { Check, Settings2 } from "lucide-react";
import { classNames } from "@/lib/format";
import type { DevState } from "@/lib/types";

const states: Array<{ value: DevState; label: string }> = [
  { value: "default", label: "Default" },
  { value: "empty", label: "No transfers" },
  { value: "no-results", label: "No search results" },
  { value: "loading", label: "Loading" },
];

type DevStatePreviewProps = {
  value: DevState;
  onChange: (value: DevState) => void;
};

export default function DevStatePreview({ value, onChange }: DevStatePreviewProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="grid h-10 w-10 place-items-center rounded-chip text-text-secondary transition-colors hover:bg-surface-overlay hover:text-text-primary" aria-label="Preview states">
          <Settings2 size={19} strokeWidth={1.5} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content side="right" align="end" sideOffset={12} className="z-50 w-56 rounded-card bg-surface-raised p-2 text-sm text-text-primary shadow-panel">
          {states.map((state) => (
            <button
              key={state.value}
              type="button"
              className={classNames("flex w-full items-center gap-2 rounded-chip px-2 py-2 text-left transition-colors hover:bg-surface-overlay", value === state.value && "text-accent")}
              onClick={() => onChange(state.value)}
            >
              <span className="grid h-4 w-4 place-items-center">{value === state.value ? <Check size={14} strokeWidth={1.5} /> : null}</span>
              {state.label}
            </button>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
