import { useState } from "react";
import {
  Bell,
  Check,
  Menu,
  UserRound,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BrutalButton } from "@/components/dashboard/BrutalButton";
import { scrollToSection } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import type { Announcement, Registration } from "@/types/event";

interface NavbarProps {
  activeSection: string;
  registration: Registration | null;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenRegistration: () => void;
  onOpenSubmission: () => void;
  announcements: Announcement[];
  readIds: string[];
  onOpenAnnouncement: (id: string) => void;
  onMarkAllRead: () => void;
}

const sectionLinks = [
  { id: "dashboard", label: "Dashboard" },
  { id: "timeline", label: "Timeline" },
  { id: "tracks", label: "Tracks" },
  { id: "rewards", label: "Rewards" },
];

const iconButton =
  "flex h-10 w-10 shrink-0 items-center justify-center border-[2.5px] border-ink bg-white text-ink shadow-[2px_2px_0_#171717] transition-all hover:-translate-y-0.5 hover:bg-brand-yellow hover:shadow-[4px_4px_0_#171717] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none";

export function Navbar({
  activeSection,
  registration,
  soundEnabled,
  onToggleSound,
  onOpenRegistration,
  onOpenSubmission,
  announcements,
  readIds,
  onOpenAnnouncement,
  onMarkAllRead,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const unreadCount = announcements.filter(
    (item) => !readIds.includes(item.id),
  ).length;

  const goTo = (id: string) => {
    setMobileOpen(false);
    scrollToSection(id);
  };

  const openRegistration = () => {
    setMobileOpen(false);
    onOpenRegistration();
  };

  const openSubmission = () => {
    setMobileOpen(false);
    onOpenSubmission();
  };

  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-ink bg-paper">
      <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between gap-2 px-3 sm:px-5 lg:px-6">
        <a
          href="#dashboard"
          className="group flex min-w-0 items-center gap-2"
          aria-label="Tech4Hack IGDTUW — back to dashboard"
        >
          <span className="brutal-border shrink-0 bg-brand-lime px-2 py-1.5 font-display text-sm leading-none shadow-[3px_3px_0_#171717] transition-transform group-hover:-translate-y-0.5 sm:px-3 sm:text-lg">
            TECH4HACK<sup className="ml-0.5 text-[8px]">®</sup>
          </span>
          <span className="hidden font-mono text-[10px] font-bold leading-tight tracking-[0.08em] text-ink/70 sm:block">
            HACKRUSH
            <br />
            @ IGDTUW
          </span>
        </a>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-0.5 lg:flex xl:gap-1"
        >
          <a
            href="#dashboard"
            className={cn(
              "border-2 px-2.5 py-1.5 font-heading text-[12px] font-bold uppercase tracking-wide transition-colors xl:text-[13px]",
              activeSection === "dashboard"
                ? "border-ink bg-brand-pink shadow-[2px_2px_0_#171717]"
                : "border-transparent hover:border-ink hover:bg-brand-lime/50",
            )}
          >
            Dashboard
          </a>
          <button
            type="button"
            onClick={onOpenRegistration}
            className="border-2 border-transparent px-2.5 py-1.5 font-heading text-[12px] font-bold uppercase tracking-wide transition-colors hover:border-ink hover:bg-brand-lime/50 xl:text-[13px]"
          >
            Register
          </button>
          <button
            type="button"
            onClick={onOpenSubmission}
            className="border-2 border-transparent px-2.5 py-1.5 font-heading text-[12px] font-bold uppercase tracking-wide transition-colors hover:border-ink hover:bg-brand-lime/50 xl:text-[13px]"
          >
            Submit idea
          </button>
          {sectionLinks.slice(1).map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={cn(
                "border-2 px-2.5 py-1.5 font-heading text-[12px] font-bold uppercase tracking-wide transition-colors xl:text-[13px]",
                activeSection === link.id
                  ? "border-ink bg-brand-pink shadow-[2px_2px_0_#171717]"
                  : "border-transparent hover:border-ink hover:bg-brand-lime/50",
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onToggleSound}
            className={cn(
              iconButton,
              "hidden sm:flex",
              soundEnabled && "bg-brand-lime hover:bg-brand-lime",
            )}
            aria-pressed={soundEnabled}
            aria-label={soundEnabled ? "Turn interface sound off" : "Turn interface sound on"}
            title={soundEnabled ? "Sound on" : "Sound off"}
          >
            {soundEnabled ? (
              <Volume2 className="h-[18px] w-[18px]" />
            ) : (
              <VolumeX className="h-[18px] w-[18px]" />
            )}
          </button>

          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(iconButton, "relative")}
                aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
              >
                <Bell className="h-[18px] w-[18px]" />
                {unreadCount > 0 ? (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center border-2 border-ink bg-brand-pink px-1 font-mono text-[9px] font-bold">
                    {unreadCount}
                  </span>
                ) : null}
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={10}
              className="w-[min(21rem,calc(100vw-1.5rem))] rounded-none border-[3px] border-ink bg-white p-0 shadow-[6px_6px_0_#171717]"
            >
              <div className="flex items-center justify-between border-b-[3px] border-ink bg-brand-yellow px-3 py-2.5">
                <p className="font-display text-sm uppercase">Notifications</p>
                <button
                  type="button"
                  onClick={onMarkAllRead}
                  className="flex items-center gap-1 border-2 border-ink bg-white px-1.5 py-1 font-mono text-[9px] font-bold uppercase hover:bg-brand-lime"
                >
                  <Check className="h-3 w-3" />
                  Mark read
                </button>
              </div>
              <div className="max-h-72 divide-y-2 divide-ink/15 overflow-y-auto">
                {announcements.slice(0, 5).map((item) => {
                  const unread = !readIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setNotificationsOpen(false);
                        onOpenAnnouncement(item.id);
                      }}
                      className={cn(
                        "flex w-full items-start gap-2.5 px-3 py-3 text-left transition-colors hover:bg-brand-lime/40",
                        unread && "bg-brand-pink/15",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-1.5 h-2 w-2 shrink-0 border border-ink",
                          unread ? "bg-brand-pink" : "bg-ink/20",
                        )}
                      />
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold leading-snug">
                          {item.title}
                        </span>
                        <span className="mt-1 flex items-center gap-2 font-mono text-[9px] uppercase tracking-wide text-ink/60">
                          {item.dateLabel}
                          <span className="border border-ink/30 px-1">{item.tag}</span>
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(false);
                  goTo("announcements");
                }}
                className="w-full border-t-[3px] border-ink px-3 py-2.5 text-left font-heading text-[11px] font-bold uppercase tracking-wide hover:bg-brand-lime"
              >
                View full bulletin →
              </button>
            </PopoverContent>
          </Popover>

          <Popover open={profileOpen} onOpenChange={setProfileOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(iconButton, "relative")}
                aria-label="Demo profile menu"
              >
                <UserRound className="h-[18px] w-[18px]" />
                <span
                  className={cn(
                    "absolute -bottom-1 -right-1 h-2.5 w-2.5 border-2 border-ink",
                    registration ? "bg-brand-lime" : "bg-white",
                  )}
                />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={10}
              className="w-[min(19rem,calc(100vw-1.5rem))] rounded-none border-[3px] border-ink bg-white p-0 shadow-[6px_6px_0_#171717]"
            >
              <div className="border-b-[3px] border-ink bg-brand-lavender px-3 py-3">
                <p className="eyebrow text-ink/60">Local demo profile</p>
                <p className="mt-1 font-display text-lg uppercase leading-none">
                  Demo visitor
                </p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-wide text-ink/60">
                  No account · saved in this browser
                </p>
              </div>
              <div className="p-3">
                {registration ? (
                  <>
                    <p className="eyebrow text-ink/50">Saved demo registration</p>
                    <p className="mt-1 font-heading text-sm font-bold">
                      {registration.teamName}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] text-ink/70">
                      {registration.id}
                    </p>
                    <BrutalButton
                      variant="lime"
                      className="mt-3 w-full px-3 py-2.5"
                      onClick={() => {
                        setProfileOpen(false);
                        onOpenRegistration();
                      }}
                    >
                      Edit saved registration
                    </BrutalButton>
                  </>
                ) : (
                  <>
                    <p className="text-xs leading-relaxed text-ink/70">
                      No saved team yet. The registration portal is an
                      interactive demo stored only on this device.
                    </p>
                    <BrutalButton
                      variant="pink"
                      className="mt-3 w-full px-3 py-2.5"
                      onClick={() => {
                        setProfileOpen(false);
                        onOpenRegistration();
                      }}
                    >
                      Start a demo team
                    </BrutalButton>
                  </>
                )}
              </div>
              <div className="border-t-2 border-ink/20 px-3 py-2 font-mono text-[9px] uppercase leading-relaxed text-ink/55">
                Keyboard: R opens registration · Esc closes dialogs
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={mobileOpen} onOpenChange={setMobileOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(iconButton, "lg:hidden")}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                {mobileOpen ? (
                  <X className="h-[18px] w-[18px]" />
                ) : (
                  <Menu className="h-[18px] w-[18px]" />
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={10}
              className="w-[min(21rem,calc(100vw-1.5rem))] rounded-none border-[3px] border-ink bg-white p-3 shadow-[6px_6px_0_#171717]"
            >
              <p className="eyebrow mb-2 text-ink/50">Navigate</p>
              <div className="grid gap-1.5">
                {sectionLinks.map((link) => (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => goTo(link.id)}
                    className={cn(
                      "border-2 px-3 py-2.5 text-left font-heading text-sm font-bold uppercase tracking-wide",
                      activeSection === link.id
                        ? "border-ink bg-brand-pink"
                        : "border-ink/20 hover:border-ink hover:bg-brand-lime/50",
                    )}
                  >
                    {link.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={openRegistration}
                  className="border-2 border-ink bg-brand-lime px-3 py-2.5 text-left font-heading text-sm font-bold uppercase tracking-wide"
                >
                  Register your team
                </button>
                <button
                  type="button"
                  onClick={openSubmission}
                  className="border-2 border-ink bg-brand-lavender px-3 py-2.5 text-left font-heading text-sm font-bold uppercase tracking-wide"
                >
                  Submit an idea
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onToggleSound();
                    setMobileOpen(false);
                  }}
                  className="flex items-center justify-between border-2 border-ink/20 px-3 py-2.5 text-left font-heading text-sm font-bold uppercase tracking-wide hover:border-ink hover:bg-brand-yellow"
                >
                  Interface sound
                  <span className="font-mono text-[10px]">
                    {soundEnabled ? "ON" : "OFF"}
                  </span>
                </button>
              </div>
              <p className="mt-3 border-t-2 border-ink/15 pt-2 font-mono text-[9px] uppercase tracking-wide text-ink/50">
                Interactive demo · not the official portal
              </p>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
