export type TransferStatus = "active" | "expiring_soon" | "expired" | "disabled";

export type Member = {
  id: string;
  name: string;
  role: string;
  initials: string;
};

export type TransferFile = {
  name: string;
  size_mb: number;
};

export type Transfer = {
  id: string;
  title: string;
  senderId: string;
  recipientIds: string[];
  files: TransferFile[];
  createdDaysAgo: number;
  expiresInDays?: number;
  expiresInHours?: number;
  expiredDaysAgo?: number;
  status: TransferStatus;
  favorited: boolean;
  disabled?: boolean;
};

export type SortMode = "recent" | "expiring" | "largest";
export type DevState = "default" | "empty" | "no-results" | "loading";
export type ViewMode = "list" | "grid" | "compact";
export type CurrentView = "overview" | "all" | "favorites" | "settings";
