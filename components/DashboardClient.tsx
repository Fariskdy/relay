"use client";

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Check, Clock3, Files, KeyRound, Mail, ShieldOff, Star } from "lucide-react";
import { gsap } from "gsap";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { Avatar } from "@/components/AvatarStack";
import NavRail from "@/components/NavRail";
import PreviewPane from "@/components/PreviewPane";
import TransferListPane from "@/components/TransferListPane";
import { mockData } from "@/lib/mock-data";
import { getExpiryDate, mockLink, totalSize } from "@/lib/format";
import { getTransferStatus } from "@/lib/status";
import type { CurrentView, DevState, Member, SortMode, Transfer, TransferStatus, ViewMode } from "@/lib/types";
import { parseCurrentView } from "@/lib/view";

type Toast = { id: number; message: string };
type DashboardClientProps = {
  initialView: CurrentView;
  initialSelectedId: string | null;
};

const storageKeys = {
  favorites: "relay:favorites",
  disabled: "relay:disabled",
  theme: "relay:theme",
};

export default function DashboardClient({ initialView, initialSelectedId }: DashboardClientProps) {
  const [transfers, setTransfers] = useState<Transfer[]>(mockData.transfers);
  const [activeStatus, setActiveStatus] = useState<TransferStatus | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [sort, setSort] = useState<SortMode>("recent");
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [currentView, setCurrentView] = useState<CurrentView>(initialView);
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [devState, setDevState] = useState<DevState>("default");
  const [currentUserId, setCurrentUserId] = useState(mockData.members[0].id);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [light, setLight] = useState(true);
  const [storageReady, setStorageReady] = useState(false);
  const [splashComplete, setSplashComplete] = useState(false);
  const splashShellRef = useRef<HTMLDivElement>(null);
  const splashLogoRef = useRef<HTMLDivElement>(null);
  const splashProgressRef = useRef<HTMLDivElement>(null);
  const toastIdRef = useRef(0);

  useEffect(() => {
    function syncFromUrl() {
      const params = new URLSearchParams(window.location.search);
      setCurrentView(parseCurrentView(params.get("view")));
      setSelectedId(params.get("transfer"));
      setMobilePreview(false);
    }

    window.queueMicrotask(() => {
      const favoriteMap = safeParseMap(localStorage.getItem(storageKeys.favorites));
      const disabledMap = safeParseMap(localStorage.getItem(storageKeys.disabled));
      setTransfers(
        mockData.transfers.map((item) => ({
          ...item,
          favorited: favoriteMap[item.id] ?? item.favorited,
          disabled: disabledMap[item.id] ?? item.disabled,
        })),
      );
      setLight(localStorage.getItem(storageKeys.theme) !== "dark");
      setStorageReady(true);
    });
    window.addEventListener("popstate", syncFromUrl);
    return () => {
      window.removeEventListener("popstate", syncFromUrl);
    };
  }, []);

  useEffect(() => {
    if (!splashShellRef.current || !splashLogoRef.current || !splashProgressRef.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(splashShellRef.current, { autoAlpha: 1, y: 0 });
      gsap.set(splashLogoRef.current, { autoAlpha: 1, scale: 1, y: 0 });
      gsap.set(splashProgressRef.current, { scaleX: 1 });
      const reducedMotionTimer = window.setTimeout(() => setSplashComplete(true), 900);
      return () => window.clearTimeout(reducedMotionTimer);
    }

    const ctx = gsap.context(() => {
      gsap.set(splashShellRef.current, { autoAlpha: 0, y: 6 });
      gsap.set(splashLogoRef.current, { autoAlpha: 0, scale: 0.92, y: 8 });
      gsap.set(splashProgressRef.current, { scaleX: 0, transformOrigin: "left center" });

      gsap
        .timeline({ onComplete: () => setSplashComplete(true) })
        .to(splashShellRef.current, { autoAlpha: 1, y: 0, duration: 0.18, ease: "power2.out" })
        .to(splashLogoRef.current, { autoAlpha: 1, scale: 1, y: 0, duration: 0.52, ease: "back.out(1.35)" }, 0.06)
        .to(splashProgressRef.current, { scaleX: 0.16, duration: 0.24, ease: "power2.out" }, 0.42)
        .to(splashProgressRef.current, { scaleX: 0.58, duration: 0.72, ease: "power2.inOut" })
        .to(splashProgressRef.current, { scaleX: 0.88, duration: 0.48, ease: "power2.out" })
        .to(splashProgressRef.current, { scaleX: 1, duration: 0.34, ease: "power4.out" })
        .to(splashShellRef.current, { autoAlpha: 0, y: -4, duration: 0.22, ease: "power2.in" }, "+=0.2");
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    document.documentElement.classList.toggle("light", light);
    localStorage.setItem(storageKeys.theme, light ? "light" : "dark");
  }, [light, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    localStorage.setItem(storageKeys.favorites, JSON.stringify(Object.fromEntries(transfers.map((item) => [item.id, item.favorited]))));
    localStorage.setItem(storageKeys.disabled, JSON.stringify(Object.fromEntries(transfers.map((item) => [item.id, Boolean(item.disabled)]))));
  }, [storageReady, transfers]);

  const sourceTransfers = useMemo(() => (devState === "empty" ? [] : transfers), [devState, transfers]);
  const effectiveQuery = devState === "no-results" ? "__no_results__" : query;

  const statusCounts = useMemo(() => {
    return sourceTransfers.reduce<Record<TransferStatus, number>>(
      (counts, transfer) => {
        counts[getTransferStatus(transfer)] += 1;
        return counts;
      },
      { active: 0, expiring_soon: 0, expired: 0, disabled: 0 },
    );
  }, [sourceTransfers]);

  const overviewMetrics = useMemo(
    () => [
      {
        label: "Transfers",
        value: String(sourceTransfers.length),
        detail: "Across the workspace",
        icon: Files,
      },
      {
        label: "Expiring",
        value: String(statusCounts.expiring_soon + statusCounts.expired),
        detail: "Need a decision soon",
        icon: Clock3,
      },
      {
        label: "Favorites",
        value: String(sourceTransfers.filter((transfer) => transfer.favorited).length),
        detail: "Pinned for follow-up",
        icon: Star,
      },
      {
        label: "Disabled",
        value: String(statusCounts.disabled),
        detail: "Access currently paused",
        icon: ShieldOff,
      },
    ],
    [sourceTransfers, statusCounts],
  );

  const filteredTransfers = useMemo(() => {
    const needle = effectiveQuery.trim().toLowerCase();
    return sourceTransfers
      .filter((transfer) => !activeStatus || getTransferStatus(transfer) === activeStatus)
      .filter((transfer) => currentView !== "favorites" || transfer.favorited)
      .filter((transfer) => {
        if (selectedMembers.length === 0) return true;
        return selectedMembers.some((id) => transfer.senderId === id || transfer.recipientIds.includes(id));
      })
      .filter((transfer) => {
        if (!needle) return true;
        const sender = mockData.members.find((member) => member.id === transfer.senderId)?.name ?? "";
        const recipients = transfer.recipientIds.map((id) => mockData.members.find((member) => member.id === id)?.name ?? "");
        const haystack = [transfer.title, sender, ...recipients, ...transfer.files.map((file) => file.name)].join(" ").toLowerCase();
        return haystack.includes(needle);
      })
      .sort((a, b) => {
        if (sort === "largest") return totalSize(b.files) - totalSize(a.files);
        if (sort === "expiring") return expirySortValue(a) - expirySortValue(b);
        return a.createdDaysAgo - b.createdDaysAgo;
      });
  }, [activeStatus, currentView, effectiveQuery, selectedMembers, sort, sourceTransfers]);

  const recentTransfers = useMemo(() => {
    const needle = effectiveQuery.trim().toLowerCase();
    return sourceTransfers
      .filter((transfer) => {
        if (!needle) return true;
        const sender = mockData.members.find((member) => member.id === transfer.senderId)?.name ?? "";
        const recipients = transfer.recipientIds.map((id) => mockData.members.find((member) => member.id === id)?.name ?? "");
        const haystack = [transfer.title, sender, ...recipients, ...transfer.files.map((file) => file.name)].join(" ").toLowerCase();
        return haystack.includes(needle);
      })
      .sort((a, b) => a.createdDaysAgo - b.createdDaysAgo)
      .slice(0, 5);
  }, [effectiveQuery, sourceTransfers]);

  const visibleTransfers = currentView === "overview" ? recentTransfers : filteredTransfers;

  const selectedTransfer = useMemo(() => {
    if (currentView === "settings" || !selectedId) return null;
    return visibleTransfers.find((transfer) => transfer.id === selectedId) ?? null;
  }, [currentView, selectedId, visibleTransfers]);
  const currentUser = mockData.members.find((member) => member.id === currentUserId) ?? mockData.members[0];
  const listLoading = devState === "loading";
  const showPreviewPane = currentView !== "settings" && !listLoading;
  const showMobilePreview = mobilePreview && selectedTransfer !== null;
  const showInitialSplash = !storageReady || !splashComplete;

  function urlWithParams(params: URLSearchParams) {
    const queryString = params.toString();
    return `${window.location.pathname}${queryString ? `?${queryString}` : ""}`;
  }

  function navigateView(view: CurrentView) {
    setCurrentView(view);
    setSelectedId(null);
    setMobilePreview(false);
    if (view !== "all") setActiveStatus(null);

    const params = new URLSearchParams(window.location.search);
    if (view === "all") params.delete("view");
    else params.set("view", view);
    params.delete("transfer");
    window.history.pushState(null, "", urlWithParams(params));
  }

  function selectTransfer(id: string, showMobile = true) {
    setSelectedId(id);
    const params = new URLSearchParams(window.location.search);
    params.set("transfer", id);
    if (currentView === "all") params.delete("view");
    else params.set("view", currentView);
    window.history.replaceState(null, "", urlWithParams(params));
    if (showMobile) setMobilePreview(true);
  }

  function updateTransfer(id: string, updater: (transfer: Transfer) => Transfer) {
    setTransfers((items) => items.map((item) => (item.id === id ? updater(item) : item)));
  }

  function addToast(message: string) {
    toastIdRef.current += 1;
    const id = toastIdRef.current;
    setToasts((items) => [...items, { id, message }]);
    window.setTimeout(() => setToasts((items) => items.filter((toast) => toast.id !== id)), 3000);
  }

  async function copySelectedLink() {
    if (!selectedId) return;
    await navigator.clipboard?.writeText(mockLink(selectedId));
    addToast("Link copied to clipboard.");
  }

  function downloadTransfer(id: string) {
    const transfer = transfers.find((item) => item.id === id);
    addToast(`${transfer?.files.length ?? 0} ${transfer?.files.length === 1 ? "file" : "files"} ready to download.`);
  }

  function clearFilters() {
    setActiveStatus(null);
    setSelectedMembers([]);
    setSort("recent");
    setQuery("");
    if (devState === "no-results") setDevState("default");
  }

  if (showInitialSplash) {
    return (
      <main key="splash" className="grid h-[100dvh] place-items-center bg-surface-base text-text-primary">
        <div ref={splashShellRef} className="flex w-full max-w-[260px] flex-col items-center px-6">
          <div ref={splashLogoRef} className="grid h-20 w-20 place-items-center overflow-hidden rounded-[18px] bg-surface-raised shadow-panel ring-1 ring-border-hairline">
            <Image src="/relay-logo.png" alt="Relay" width={72} height={72} priority className="h-16 w-16 object-cover" />
          </div>
          <div role="progressbar" aria-label="Loading Relay" className="mt-7 h-1.5 w-full overflow-hidden rounded-full bg-surface-overlay ring-1 ring-border-hairline">
            <div ref={splashProgressRef} className="relay-progress-bar h-full w-full rounded-full bg-accent shadow-[0_0_18px_rgba(255,75,31,0.45)]" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main key="dashboard" className="h-[100dvh] overflow-hidden bg-surface-base text-text-primary">
      <div className="flex h-full">
        <NavRail
          currentUser={currentUser}
          members={mockData.members}
          currentView={currentView}
          light={light}
          onThemeToggle={() => setLight((value) => !value)}
          devState={devState}
          onDevStateChange={setDevState}
          onViewChange={navigateView}
          onUserChange={setCurrentUserId}
        />

        <div className="flex h-[calc(100dvh-80px)] min-w-0 flex-1 lg:h-screen">
          <div className={showMobilePreview ? "hidden min-w-0 flex-1 lg:flex" : "flex min-w-0 flex-1"}>
            {currentView === "settings" ? (
              <SettingsPane
                currentUser={currentUser}
                members={mockData.members}
              />
            ) : (
              <TransferListPane
                transfers={visibleTransfers}
                hasAnyTransfers={sourceTransfers.length > 0}
                eyebrow={viewCopy(currentView).eyebrow}
                title={viewCopy(currentView).title}
                listTitle={viewCopy(currentView).listTitle}
                listDescription={viewCopy(currentView).description(visibleTransfers.length)}
                overviewMetrics={currentView === "overview" ? overviewMetrics : undefined}
                members={mockData.members}
                selectedId={selectedTransfer?.id ?? null}
                loading={listLoading}
                showStatusGroups={currentView === "all"}
                showFilterBar={currentView === "all"}
                showViewToggle={currentView !== "overview"}
                activeStatus={currentView === "all" ? activeStatus : null}
                onStatusChange={(status) => {
                  setActiveStatus(status);
                  setCurrentView("all");
                }}
                statusCounts={statusCounts}
                query={query}
                onQueryChange={setQuery}
                sort={sort}
                onSortChange={setSort}
                selectedMembers={currentView === "all" ? selectedMembers : []}
                onToggleMember={(id) => setSelectedMembers((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]))}
                viewMode={currentView === "overview" ? "list" : viewMode}
                onViewModeChange={setViewMode}
                onSelect={selectTransfer}
                onFavorite={(id) => updateTransfer(id, (item) => ({ ...item, favorited: !item.favorited }))}
                onClearFilters={clearFilters}
              />
            )}
          </div>

          {showPreviewPane ? (
            <div className={showMobilePreview ? "block min-w-0 flex-1 lg:block lg:flex-none" : "hidden min-w-0 flex-1 lg:block lg:flex-none"}>
              <PreviewPane
                transfer={selectedTransfer}
                members={mockData.members}
                onCopy={copySelectedLink}
                onDownload={downloadTransfer}
                onFavorite={(id) => updateTransfer(id, (item) => ({ ...item, favorited: !item.favorited }))}
                onExtend={(id, days, dateLabel) => {
                  updateTransfer(id, (item) => ({
                    ...item,
                    status: "active",
                    disabled: false,
                    expiredDaysAgo: undefined,
                    expiresInHours: undefined,
                    expiresInDays: days,
                  }));
                  addToast(`Expiry extended to ${dateLabel}.`);
                }}
                onDisable={(id) => {
                  updateTransfer(id, (item) => ({ ...item, disabled: true, status: "disabled" }));
                  addToast("Transfer disabled.");
                }}
                onEnable={(id) => {
                  updateTransfer(id, (item) => ({ ...item, disabled: false, status: "active" }));
                  addToast("Transfer enabled.");
                }}
                onBack={() => setMobilePreview(false)}
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className="fixed right-4 top-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div key={toast.id} className="rounded-card bg-surface-raised px-4 py-3 text-sm text-text-primary shadow-panel">
            {toast.message}
          </div>
        ))}
      </div>
    </main>
  );
}

export type OverviewMetric = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
};

function safeParseMap(value: string | null): Record<string, boolean> {
  if (!value) return {};
  try {
    return JSON.parse(value) as Record<string, boolean>;
  } catch {
    return {};
  }
}

function expirySortValue(transfer: Transfer) {
  const date = getExpiryDate(transfer);
  if (!date || transfer.disabled) return Number.MAX_SAFE_INTEGER;
  return date.getTime();
}

function viewCopy(view: CurrentView) {
  if (view === "overview") {
    return {
      eyebrow: "Overview / Recent",
      title: "Relay",
      listTitle: "Recent",
      description: (count: number) => `${count} recent ${count === 1 ? "transfer" : "transfers"}`,
    };
  }
  if (view === "favorites") {
    return {
      eyebrow: "Collections / Favorites",
      title: "Favorites",
      listTitle: "Favorite Transfers",
      description: (count: number) => `${count} favorited ${count === 1 ? "transfer" : "transfers"}`,
    };
  }
  return {
    eyebrow: "All Transfers / Sent",
    title: "Relay",
    listTitle: "All Transfers",
    description: (count: number) => `${count} visible ${count === 1 ? "transfer" : "transfers"}`,
  };
}

type SettingsPaneProps = {
  currentUser: Member;
  members: Member[];
};

function SettingsPane({ currentUser, members }: SettingsPaneProps) {
  const [firstName = currentUser.name, ...restName] = currentUser.name.split(" ");
  const lastName = restName.join(" ") || "User";
  const email = `${firstName.toLowerCase()}.${lastName.split(" ")[0].toLowerCase()}@relay.example`;

  return (
    <section className="flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-surface-base">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border-hairline px-5 lg:px-8">
        <h1 className="text-base font-semibold text-text-primary">Settings</h1>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-2 border-b border-border-hairline pb-5">
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">Settings</div>
              <h2 className="text-2xl font-semibold leading-tight text-text-primary">Account settings</h2>
              <p className="mt-2 max-w-2xl text-base text-text-secondary">Manage your profile, password, and notification preferences.</p>
            </div>
          </div>

          <SettingsSection
            sidebar={
              <div className="flex min-w-0 items-start gap-3">
              <Avatar member={currentUser} members={members} size={56} />
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-text-primary">{currentUser.name}</div>
                <div className="mt-1 flex items-center gap-1.5 text-sm text-text-secondary">
                  <span className="h-1.5 w-1.5 rounded-full bg-status-active" />
                  {currentUser.role}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-text-primary">Account</h3>
                <p className="mt-1.5 text-sm leading-6 text-text-secondary">Your public identity inside Relay.</p>
              </div>
            </div>
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              <SettingsField label="First name" value={firstName} />
              <SettingsField label="Last name" value={lastName} />
              <SettingsField label="Email address" value={email} icon={Mail} muted />
              <SettingsField label="Sign-in method" value="Google" muted />
              <div className="flex justify-end md:col-span-2">
                <button className="inline-flex h-11 items-center justify-center gap-2 rounded-chip bg-accent px-4 text-sm font-semibold text-white shadow-card transition-colors hover:bg-accent-hover">
                  <Check size={16} strokeWidth={2} />
                  Save profile
                </button>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection sidebar={<SectionIntro title="Security" description="Change the password used for email sign-in." />}>
            <div className="grid gap-4 md:grid-cols-2">
              <PasswordField label="Current password" />
              <PasswordField label="New password" />
              <PasswordField label="Confirm new password" />
              <div className="flex items-end justify-end">
                <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-chip border border-border-hairline bg-surface-raised px-4 text-sm font-semibold text-text-secondary transition-colors hover:bg-surface-overlay hover:text-text-primary md:w-auto">
                  <KeyRound size={16} strokeWidth={1.8} />
                  Update password
                </button>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection sidebar={<SectionIntro title="Notifications" description="Choose the transfer updates you want to receive." />}>
            <div className="grid gap-3">
              <label className="flex items-center justify-between gap-4 rounded-card border border-border-hairline bg-surface-raised px-4 py-3">
                <span className="text-sm font-medium text-text-primary">Expiry reminders</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-[var(--accent)]" />
              </label>
              <label className="flex items-center justify-between gap-4 rounded-card border border-border-hairline bg-surface-raised px-4 py-3">
                <span className="text-sm font-medium text-text-primary">Download receipts</span>
                <input type="checkbox" className="h-4 w-4 accent-[var(--accent)]" />
              </label>
            </div>
          </SettingsSection>
        </div>
      </div>
    </section>
  );
}

function SettingsSection({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
  return (
    <section className="grid gap-6 border-b border-border-hairline py-6 last:border-b-0 md:grid-cols-[340px_minmax(0,1fr)]">
      <div className="min-w-0">{sidebar}</div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function SectionIntro({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <p className="mt-1.5 max-w-[260px] text-sm leading-6 text-text-secondary">{description}</p>
    </div>
  );
}

function SettingsField({ label, value, icon: Icon, muted = false }: { label: string; value: string; icon?: LucideIcon; muted?: boolean }) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold uppercase tracking-wide text-text-secondary">{label}</span>
      <div className="mt-2 flex h-10 items-center rounded-chip border border-border-hairline bg-surface-raised px-3">
        {Icon ? <Icon size={15} strokeWidth={1.6} className="mr-2 shrink-0 text-text-tertiary" /> : null}
        <input readOnly value={value} className={muted ? "min-w-0 flex-1 bg-transparent text-sm text-text-secondary outline-none" : "min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none"} />
      </div>
    </label>
  );
}

function PasswordField({ label }: { label: string }) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold uppercase tracking-wide text-text-secondary">{label}</span>
      <input type="password" className="mt-2 h-10 w-full rounded-chip border border-border-hairline bg-surface-raised px-3 text-sm text-text-primary outline-none focus:border-accent" />
    </label>
  );
}
