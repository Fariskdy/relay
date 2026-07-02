import * as Popover from "@radix-ui/react-popover";
import { CalendarPlus } from "lucide-react";
import { formatDate } from "@/lib/format";

type ExtendExpiryPopoverProps = {
  disabled: boolean;
  onExtend: (days: number, dateLabel: string) => void;
};

const options = [3, 7, 14];

export default function ExtendExpiryPopover({ disabled, onExtend }: ExtendExpiryPopoverProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          title={disabled ? "Cannot extend expired or disabled transfers" : "Extend expiry"}
          className="flex min-w-0 flex-1 flex-col items-center gap-2 rounded-chip px-2 py-3 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-overlay hover:text-text-primary disabled:text-text-tertiary"
        >
          <CalendarPlus size={19} strokeWidth={1.5} />
          Extend
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="center" sideOffset={8} className="z-50 w-44 rounded-card bg-surface-raised p-2 text-sm text-text-primary shadow-panel">
          {options.map((days) => {
            const date = new Date();
            date.setDate(date.getDate() + days);
            const label = formatDate(date);

            return (
              <button
                key={days}
                type="button"
                className="w-full rounded-chip px-2 py-2 text-left transition-colors hover:bg-surface-overlay"
                onClick={() => onExtend(days, label)}
              >
                +{days} days
                <span className="block text-xs text-text-secondary">{label}</span>
              </button>
            );
          })}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
