import type { CurrentView } from "@/lib/types";

export function parseCurrentView(value: string | null | undefined): CurrentView {
  if (value === "overview" || value === "favorites" || value === "settings" || value === "all") return value;
  return "all";
}
