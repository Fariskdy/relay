"use client";

import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";
import Image from "next/image";
import { Bell, Check, CreditCard, HelpCircle, Home, Inbox, LogOut, Moon, Settings, Star, Sun, UserRound, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Avatar } from "@/components/AvatarStack";
import DevStatePreview from "@/components/DevStatePreview";
import { classNames } from "@/lib/format";
import type { CurrentView, DevState, Member } from "@/lib/types";

type NavRailProps = {
  currentUser: Member;
  members: Member[];
  currentView: CurrentView;
  light: boolean;
  onThemeToggle: () => void;
  devState: DevState;
  onDevStateChange: (value: DevState) => void;
  onViewChange: (view: CurrentView) => void;
  onUserChange: (id: string) => void;
};

const navItems: Array<{ label: string; view: CurrentView; icon: LucideIcon }> = [
  { label: "Overview", view: "overview", icon: Home },
  { label: "All transfers", view: "all", icon: Inbox },
  { label: "Favorites", view: "favorites", icon: Star },
  { label: "Settings", view: "settings", icon: Settings },
];

export default function NavRail({ currentUser, members, currentView, light, onThemeToggle, devState, onDevStateChange, onViewChange, onUserChange }: NavRailProps) {
  return (
    <>
      <aside className="hidden h-screen w-[72px] shrink-0 flex-col border-r border-border-hairline bg-surface-sunken lg:flex">
        <div className="flex h-16 items-center justify-center">
          <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-surface-raised shadow-card ring-1 ring-border-hairline" aria-label="Relay">
            <Image src="/relay-logo.png" alt="Relay" width={36} height={36} className="h-9 w-9 object-cover" priority unoptimized />
          </div>
        </div>

        <nav className="flex flex-1 flex-col items-center gap-2 pt-4">
          {navItems.map((item) => (
            <RailButton key={item.view} label={item.label} view={item.view} active={currentView === item.view} icon={item.icon} onViewChange={onViewChange} />
          ))}
        </nav>

        <div className="flex flex-col items-center gap-2 pb-4">
          <button
            type="button"
            title={light ? "Dark mode" : "Light mode"}
            className="grid h-10 w-10 place-items-center rounded-chip text-text-secondary transition-colors hover:bg-surface-overlay hover:text-text-primary"
            onClick={onThemeToggle}
            aria-label="Toggle theme"
          >
            {light ? <Moon size={19} strokeWidth={1.5} /> : <Sun size={19} strokeWidth={1.5} />}
          </button>
          <DevStatePreview value={devState} onChange={onDevStateChange} />
          <AvatarPicker currentUser={currentUser} members={members} onUserChange={onUserChange} onViewChange={onViewChange} />
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-border-hairline bg-surface-sunken px-2 lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              type="button"
              key={item.view}
              className={classNames("grid h-11 w-11 place-items-center rounded-chip text-text-secondary", currentView === item.view && "bg-accent-soft text-accent")}
              aria-label={item.label}
              aria-current={currentView === item.view ? "page" : undefined}
              title={item.label}
              onClick={() => onViewChange(item.view)}
            >
              <Icon size={19} strokeWidth={1.5} />
            </button>
          );
        })}
        <button className="grid h-11 w-11 place-items-center rounded-chip text-text-secondary" onClick={onThemeToggle} aria-label="Toggle theme">
          {light ? <Moon size={20} strokeWidth={1.5} /> : <Sun size={20} strokeWidth={1.5} />}
        </button>
      </nav>
    </>
  );
}

function AvatarPicker({
  currentUser,
  members,
  onUserChange,
  onViewChange,
}: {
  currentUser: Member;
  members: Member[];
  onUserChange: (id: string) => void;
  onViewChange: (view: CurrentView) => void;
}) {
  const [open, setOpen] = useState(false);

  function selectUser(id: string) {
    onUserChange(id);
    setOpen(false);
  }

  function openSettings() {
    onViewChange("settings");
    setOpen(false);
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="mt-1 grid h-10 w-10 place-items-center rounded-chip transition-colors hover:bg-surface-overlay focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface-sunken"
          aria-label="Select account"
          title="Select account"
        >
          <Avatar member={currentUser} members={members} size={32} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content side="right" align="end" sideOffset={12} className="z-50 w-72 rounded-card border border-border-hairline bg-surface-raised p-2 text-sm text-text-primary shadow-panel">
          <div className="flex items-center gap-3 rounded-card bg-surface-overlay p-3">
            <Avatar member={currentUser} members={members} size={38} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-text-primary">{currentUser.name}</div>
              <div className="truncate text-xs text-text-secondary">{currentUser.role}</div>
            </div>
          </div>
          <div className="py-2">
            <UserMenuItem icon={UserRound} label="View profile" />
            <UserMenuItem icon={Settings} label="Account settings" onClick={openSettings} />
            <UserMenuItem icon={Bell} label="Notification preferences" />
            <UserMenuItem icon={CreditCard} label="Billing and plan" />
            <UserMenuItem icon={HelpCircle} label="Help and support" />
          </div>
          <div className="border-t border-border-hairline pt-2">
            <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">Switch account</div>
            {members.map((member) => {
              const selected = member.id === currentUser.id;
              return (
                <Popover.Close asChild key={member.id}>
                  <button
                    type="button"
                    className={classNames(
                      "flex w-full items-center gap-3 rounded-chip px-2 py-2 text-left transition-colors hover:bg-surface-overlay",
                      selected && "bg-accent-soft text-accent",
                    )}
                    onClick={() => selectUser(member.id)}
                    aria-pressed={selected}
                  >
                    <Avatar member={member} members={members} size={30} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{member.name}</span>
                      <span className="block truncate text-xs text-text-tertiary">{member.role}</span>
                    </span>
                    <span className="grid h-5 w-5 place-items-center text-accent">{selected ? <Check size={16} strokeWidth={1.8} /> : null}</span>
                  </button>
                </Popover.Close>
              );
            })}
          </div>
          <div className="mt-2 border-t border-border-hairline pt-2">
            <UserMenuItem icon={Users} label="Invite teammates" />
            <UserMenuItem icon={LogOut} label="Sign out" danger />
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function UserMenuItem({ icon: Icon, label, onClick, danger = false }: { icon: LucideIcon; label: string; onClick?: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        "flex w-full items-center gap-3 rounded-chip px-2 py-2 text-left transition-colors hover:bg-surface-overlay",
        danger ? "text-status-expired" : "text-text-secondary hover:text-text-primary",
      )}
    >
      <Icon size={16} strokeWidth={1.6} className="shrink-0" />
      <span className="truncate text-sm font-medium">{label}</span>
    </button>
  );
}

function RailButton({
  label,
  view,
  icon: Icon,
  active,
  onViewChange,
}: {
  label: string;
  view: CurrentView;
  icon: LucideIcon;
  active?: boolean;
  onViewChange: (view: CurrentView) => void;
}) {
  return (
    <button
      type="button"
      title={label}
      className={classNames("grid h-10 w-10 place-items-center rounded-chip text-text-secondary transition-colors hover:bg-surface-overlay hover:text-text-primary", active && "bg-accent-soft text-accent")}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      onClick={() => onViewChange(view)}
    >
      <Icon size={19} strokeWidth={1.5} />
    </button>
  );
}
