import { useCallback, useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import { toast } from "sonner";
import { Navbar } from "@/components/dashboard/Navbar";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { Marquee } from "@/components/dashboard/Marquee";
import { TrackExplorer } from "@/components/dashboard/TrackExplorer";
import { EventTimeline } from "@/components/dashboard/EventTimeline";
import { AwardsSection } from "@/components/dashboard/AwardsSection";
import { AnnouncementBoard } from "@/components/dashboard/AnnouncementBoard";
import { Footer } from "@/components/dashboard/Footer";
import { RegistrationModal } from "@/components/dashboard/RegistrationModal";
import { SubmissionModal } from "@/components/dashboard/SubmissionModal";
import { CustomCursor } from "@/components/dashboard/CustomCursor";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { useClickSound } from "@/hooks/use-click-sound";
import { ANNOUNCEMENTS } from "@/config/event";
import { STORAGE_KEYS } from "@/lib/storage";
import type { Registration, Submission, TrackId } from "@/types/event";

const WATCHED_SECTIONS = [
  "dashboard",
  "tracks",
  "timeline",
  "rewards",
  "announcements",
];

export default function Landing() {
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [submissionOpen, setSubmissionOpen] = useState(false);
  const [initialTrack, setInitialTrack] = useState<TrackId | null>(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [expandedAnnouncement, setExpandedAnnouncement] = useState<string | null>(
    null,
  );

  const [savedRegistration, setSavedRegistration] =
    usePersistentState<Registration | null>(STORAGE_KEYS.registration, null);
  const [savedSubmission, setSavedSubmission] =
    usePersistentState<Submission | null>(STORAGE_KEYS.submission, null);
  const [readIds, setReadIds] = usePersistentState<string[]>(
    STORAGE_KEYS.readAnnouncements,
    [],
  );
  const [soundEnabled, setSoundEnabled] = usePersistentState<boolean>(
    STORAGE_KEYS.sound,
    false,
  );

  useClickSound(soundEnabled);

  const markRead = useCallback(
    (id: string) => {
      setReadIds((current) =>
        current.includes(id) ? current : [...current, id],
      );
    },
    [setReadIds],
  );

  const openRegistration = useCallback((track: TrackId | null = null) => {
    setInitialTrack(track);
    setRegistrationOpen(true);
  }, []);

  const handleRegistrationChange = (open: boolean) => {
    setRegistrationOpen(open);
    if (!open) setInitialTrack(null);
  };

  const openAnnouncement = (id: string) => {
    setExpandedAnnouncement(id);
    markRead(id);
    window.setTimeout(() => {
      document
        .getElementById("announcements")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const handleExpandAnnouncement = (id: string | null) => {
    setExpandedAnnouncement(id);
    if (id) markRead(id);
  };

  const markAllRead = () => {
    setReadIds(ANNOUNCEMENTS.map((item) => item.id));
    toast.success("All notices marked as read on this device.");
  };

  const toggleSound = () => {
    setSoundEnabled((current) => {
      if (current) {
        toast.info("Interface sound turned off.");
        return false;
      }
      toast.success("Interface sound turned on.");
      return true;
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      {
        rootMargin: "-24% 0px -58% 0px",
        threshold: [0, 0.1, 0.25, 0.5],
      },
    );

    WATCHED_SECTIONS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "r" || event.metaKey || event.ctrlKey) {
        return;
      }
      const target = event.target as HTMLElement | null;
      const isTyping = Boolean(
        target?.closest(
          "input, textarea, select, [contenteditable='true'], [role='textbox']",
        ),
      );
      if (isTyping || registrationOpen || submissionOpen) return;

      event.preventDefault();
      openRegistration(null);
      toast.info("Registration shortcut: R. Demo portal opened.");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [registrationOpen, submissionOpen, openRegistration]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen overflow-x-clip bg-paper text-ink">
        <a
          href="#dashboard"
          className="fixed left-3 top-3 z-[200] -translate-y-24 border-[3px] border-ink bg-brand-lime px-3 py-2 font-heading text-sm font-bold uppercase shadow-[3px_3px_0_#171717] focus:translate-y-0"
        >
          Skip to dashboard
        </a>

        <div className="border-b-2 border-ink bg-ink px-3 py-1.5 text-center">
          <p className="font-mono text-[7px] font-bold uppercase leading-relaxed tracking-[0.1em] text-paper/80 sm:text-[9px] sm:tracking-[0.14em]">
            Interactive demo <span className="text-brand-lime">·</span> Not the
            official registration platform{" "}
            <span className="hidden sm:inline">
              <span className="text-brand-lime">·</span> All demo data stays in
              your browser
            </span>
          </p>
        </div>

        <Navbar
          activeSection={activeSection}
          registration={savedRegistration}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          onOpenRegistration={() => openRegistration(null)}
          onOpenSubmission={() => setSubmissionOpen(true)}
          announcements={ANNOUNCEMENTS}
          readIds={readIds}
          onOpenAnnouncement={openAnnouncement}
          onMarkAllRead={markAllRead}
        />

        <main>
          <HeroSection
            onOpenRegistration={() => openRegistration(null)}
            onExplore={() =>
              document
                .getElementById("timeline")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          />

          <Marquee />

          <TrackExplorer onSelectTrack={(track) => openRegistration(track)} />

          <EventTimeline />

          <AwardsSection />

          <AnnouncementBoard
            readIds={readIds}
            expandedId={expandedAnnouncement}
            onExpand={handleExpandAnnouncement}
            onMarkAllRead={markAllRead}
          />
        </main>

        <Footer
          onOpenRegistration={() => openRegistration(null)}
          onOpenSubmission={() => setSubmissionOpen(true)}
        />

        <CustomCursor />

        <RegistrationModal
          open={registrationOpen}
          onOpenChange={handleRegistrationChange}
          savedRegistration={savedRegistration}
          initialTrack={initialTrack}
          onSaved={(registration) => setSavedRegistration(registration)}
          onClear={() => setSavedRegistration(null)}
        />

        <SubmissionModal
          open={submissionOpen}
          onOpenChange={setSubmissionOpen}
          savedRegistration={savedRegistration}
          savedSubmission={savedSubmission}
          onSaved={(submission) => setSavedSubmission(submission)}
          onClear={() => setSavedSubmission(null)}
        />
      </div>
    </MotionConfig>
  );
}
