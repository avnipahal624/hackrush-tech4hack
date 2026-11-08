import { useEffect, useId, useRef, useState } from "react";
import type { InputHTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Coins,
  Cpu,
  Download,
  HeartPulse,
  Leaf,
  Pencil,
  ShieldCheck as ShieldIcon,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { getTrack, TRACKS } from "@/config/event";
import {
  createDemoId,
  downloadTextFile,
  readJSON,
  removeStored,
  STORAGE_KEYS,
  writeJSON,
} from "@/lib/storage";
import { colorBlock } from "@/lib/theme";
import { cn } from "@/lib/utils";
import type {
  Registration,
  RegistrationMember,
  TeamSize,
  TrackIcon,
  TrackId,
} from "@/types/event";
import { BrutalButton } from "./BrutalButton";
import { Confetti } from "./Confetti";

const memberSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter the member's full name")
    .max(60, "Keep the name under 60 characters"),
  email: z.string().trim().email("Enter a valid email address"),
  college: z
    .string()
    .trim()
    .min(2, "Enter the college or university")
    .max(100, "Keep the college name under 100 characters"),
});

const registrationSchema = z.object({
  teamName: z
    .string()
    .trim()
    .min(2, "Enter a team name")
    .max(50, "Keep the team name under 50 characters"),
  leaderName: z
    .string()
    .trim()
    .min(2, "Enter the team leader's name")
    .max(60, "Keep the name under 60 characters"),
  leaderEmail: z.string().trim().email("Enter a valid email address"),
  leaderPhone: z
    .string()
    .trim()
    .min(7, "Enter a phone number")
    .max(18, "Keep the phone number under 18 characters")
    .regex(/^\+?[\d\s()-]{7,18}$/, "Use digits, spaces, +, - or parentheses"),
  college: z
    .string()
    .trim()
    .min(2, "Enter the college or university")
    .max(100, "Keep the college name under 100 characters"),
  teamSize: z.union([z.literal(3), z.literal(4), z.literal(5)]),
  members: z.array(memberSchema).min(2).max(4),
  trackId: z.enum([
    "ai-ml",
    "fintech",
    "healthtech",
    "cybersecurity",
    "sustainability",
  ]),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;
type RegistrationDraft = Partial<RegistrationFormValues>;

const STEPS = [
  { label: "Squad", title: "Create your squad", short: "Squad" },
  { label: "Crew", title: "Assemble your crew", short: "Crew" },
  { label: "Track", title: "Pick your track", short: "Track" },
  { label: "Review", title: "Review & confirm", short: "Review" },
];

const trackIcons: Record<TrackIcon, typeof Cpu> = {
  cpu: Cpu,
  coins: Coins,
  heart: HeartPulse,
  shield: ShieldIcon,
  leaf: Leaf,
};

const emptyMember = (): RegistrationMember => ({
  name: "",
  email: "",
  college: "",
});

function normalizeMembers(
  raw: RegistrationMember[] | undefined,
  size: number,
): RegistrationMember[] {
  return Array.from({ length: Math.max(2, size - 1) }, (_, index) => ({
    name: raw?.[index]?.name ?? "",
    email: raw?.[index]?.email ?? "",
    college: raw?.[index]?.college ?? "",
  }));
}

function buildDefaults(
  saved: Registration | null,
  draft: RegistrationDraft | null,
  initialTrack: TrackId | null,
): RegistrationFormValues {
  const rawSize = saved?.teamSize ?? draft?.teamSize ?? 3;
  const size = ([3, 4, 5].includes(Number(rawSize)) ? Number(rawSize) : 3) as TeamSize;

  return {
    teamName: saved?.teamName ?? draft?.teamName ?? "",
    leaderName: saved?.leaderName ?? draft?.leaderName ?? "",
    leaderEmail: saved?.leaderEmail ?? draft?.leaderEmail ?? "",
    leaderPhone: saved?.leaderPhone ?? draft?.leaderPhone ?? "",
    college: saved?.college ?? draft?.college ?? "",
    teamSize: size,
    members: normalizeMembers(saved?.members ?? draft?.members, size),
    trackId:
      initialTrack ??
      saved?.trackId ??
      (draft?.trackId as TrackId | undefined) ??
      ("" as TrackId),
  };
}

function Field({
  label,
  error,
  hint,
  containerClassName,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}) {
  const generatedId = useId();
  const inputId = props.id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className={cn("min-w-0", containerClassName)}>
      <label htmlFor={inputId} className="brutal-label">
        {label}
      </label>
      <input
        id={inputId}
        className={cn("brutal-input", className)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-1 font-mono text-[9px] font-bold uppercase leading-snug text-[#b3261e]"
        >
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1 font-mono text-[8px] uppercase leading-snug tracking-wide text-ink/45">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function ReviewBlock({
  title,
  step,
  onEdit,
  children,
}: {
  title: string;
  step: number;
  onEdit: (step: number) => void;
  children: React.ReactNode;
}) {
  return (
    <section className="border-[2.5px] border-ink bg-white p-3">
      <div className="mb-2 flex items-center justify-between gap-2 border-b-2 border-ink/10 pb-1.5">
        <h4 className="font-mono text-[9px] font-bold uppercase tracking-[0.12em]">
          {title}
        </h4>
        <button
          type="button"
          onClick={() => onEdit(step)}
          className="flex items-center gap-1 border-2 border-ink bg-white px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase hover:bg-brand-lime"
        >
          <Pencil className="h-2.5 w-2.5" />
          Edit
        </button>
      </div>
      {children}
    </section>
  );
}

interface RegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savedRegistration: Registration | null;
  initialTrack: TrackId | null;
  onSaved: (registration: Registration) => void;
  onClear: () => void;
}

export function RegistrationModal({
  open,
  onOpenChange,
  savedRegistration,
  initialTrack,
  onSaved,
  onClear,
}: RegistrationModalProps) {
  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState<Registration | null>(null);
  const [clearArmed, setClearArmed] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const wasOpen = useRef(false);
  const reduceMotion = useReducedMotion();

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    mode: "onTouched",
    defaultValues: buildDefaults(savedRegistration, null, initialTrack),
  });

  const teamSize = form.watch("teamSize");
  const members = form.watch("members");
  const watchedTrack = form.watch("trackId");
  const errors = form.formState.errors;

  useEffect(() => {
    const size = Number(teamSize);
    const current = form.getValues("members") ?? [];
    if (current.length !== size - 1) {
      form.setValue(
        "members",
        Array.from({ length: Math.max(2, size - 1) }, (_, index) => ({
          name: current[index]?.name ?? "",
          email: current[index]?.email ?? "",
          college: current[index]?.college ?? "",
        })),
      );
    }
  }, [teamSize, form]);

  useEffect(() => {
    if (!open) {
      wasOpen.current = false;
      return;
    }
    if (wasOpen.current) return;

    wasOpen.current = true;
    const draft = readJSON<RegistrationDraft | null>(
      STORAGE_KEYS.registrationDraft,
      null,
    );
    form.reset(buildDefaults(savedRegistration, draft, initialTrack));
    setStep(0);
    setSuccess(null);
    setClearArmed(false);
    if (initialTrack) {
      const track = getTrack(initialTrack);
      if (track) toast.info(`Track preselected: ${track.shortName}`);
    }
  }, [open, savedRegistration, initialTrack, form]);

  useEffect(() => {
    if (!open || success) return;
    const subscription = form.watch((values) => {
      writeJSON(STORAGE_KEYS.registrationDraft, values);
    });
    return () => subscription.unsubscribe();
  }, [form, open, success]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [step, success]);

  const goNext = async () => {
    if (step === 0) {
      const valid = await form.trigger(
        [
          "teamName",
          "leaderName",
          "leaderEmail",
          "leaderPhone",
          "college",
          "teamSize",
        ],
        { shouldFocus: true },
      );
      if (valid) setStep(1);
      return;
    }

    if (step === 1) {
      const fields = (members ?? []).flatMap((_, index) => [
        `members.${index}.name`,
        `members.${index}.email`,
        `members.${index}.college`,
      ] as const);
      const valid = await form.trigger(fields, { shouldFocus: true });
      if (valid) setStep(2);
      return;
    }

    if (step === 2) {
      if (!form.getValues("trackId")) {
        form.setError("trackId", {
          type: "manual",
          message: "Pick a track to continue.",
        });
        return;
      }
      form.clearErrors("trackId");
      setStep(3);
    }
  };

  const onSubmit = (values: RegistrationFormValues) => {
    const registration: Registration = {
      id: savedRegistration?.id ?? createDemoId("HR26"),
      createdAt: savedRegistration?.createdAt ?? new Date().toISOString(),
      teamName: values.teamName.trim(),
      leaderName: values.leaderName.trim(),
      leaderEmail: values.leaderEmail.trim(),
      leaderPhone: values.leaderPhone.trim(),
      college: values.college.trim(),
      teamSize: values.teamSize,
      members: values.members.map((member) => ({
        name: member.name.trim(),
        email: member.email.trim(),
        college: member.college.trim(),
      })),
      trackId: values.trackId,
    };

    writeJSON(STORAGE_KEYS.registration, registration);
    removeStored(STORAGE_KEYS.registrationDraft);
    onSaved(registration);
    setSuccess(registration);
    setStep(3);
    toast.success("Demo registration saved locally.");
  };

  const downloadSummary = () => {
    if (!success) return;
    const track = getTrack(success.trackId);
    const lines = [
      "HACKRUSH 2026 — DEMO REGISTRATION SUMMARY",
      "==========================================",
      "",
      "DEMO REGISTRATION — NOT AN OFFICIAL HACKRUSH SUBMISSION",
      "This summary is generated locally in the browser. No data was sent to Tech4Hack.",
      "",
      `Demo registration ID : ${success.id}`,
      `Saved at             : ${new Date(success.createdAt).toLocaleString("en-IN")}`,
      "",
      "SQUAD",
      `Team name            : ${success.teamName}`,
      `Team size            : ${success.teamSize} members`,
      `Track                : ${track?.name ?? success.trackId}`,
      "",
      "TEAM LEADER",
      `Name                 : ${success.leaderName}`,
      `Email                : ${success.leaderEmail}`,
      `Phone                : ${success.leaderPhone}`,
      `College              : ${success.college}`,
      "",
      "TEAM MEMBERS",
      ...success.members.map(
        (member, index) =>
          `${String(index + 2).padStart(2, "0")}. ${member.name} · ${member.email} · ${member.college}`,
      ),
      "",
      "NOTE: The source material lists conflicting registration dates.",
      "This portal is an interactive demonstration and does not claim that",
      "official HACKRUSH registration is open.",
    ];

    downloadTextFile(`HACKRUSH-2026-${success.id}.txt`, lines.join("\n"));
    toast.info("Demo registration summary downloaded.");
  };

  const clearRegistration = () => {
    if (!clearArmed) {
      setClearArmed(true);
      toast.info("Press clear again to remove the saved demo registration.");
      return;
    }
    removeStored(STORAGE_KEYS.registration);
    removeStored(STORAGE_KEYS.registrationDraft);
    onClear();
    setSuccess(null);
    setStep(0);
    setClearArmed(false);
    form.reset(buildDefaults(null, null, null));
    toast.success("Saved demo registration cleared from this browser.");
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setClearArmed(false);
    onOpenChange(nextOpen);
  };

  const selectedTrack = getTrack(watchedTrack);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[min(58rem,calc(100vw-1rem))] max-w-none gap-0 rounded-none border-[3px] border-ink bg-paper p-0 shadow-[8px_8px_0_#171717] sm:max-w-[58rem]"
      >
        <DialogTitle className="sr-only">
          HACKRUSH 2026 demo registration portal
        </DialogTitle>
        <DialogDescription className="sr-only">
          A four-step demo team registration saved only in this browser. It is
          not an official HACKRUSH submission.
        </DialogDescription>

        <div
          ref={scrollRef}
          className="max-h-[92vh] overflow-y-auto overscroll-contain sm:max-h-[88vh]"
        >
          <header className="sticky top-0 z-20 border-b-[3px] border-ink bg-white">
            <div className="flex items-center justify-between gap-3 bg-brand-lime px-3 py-2.5 sm:px-4">
              <div className="min-w-0">
                <p className="eyebrow text-ink/60">
                  Registration portal · demo
                </p>
                <h3 className="truncate font-display text-lg uppercase leading-tight sm:text-xl">
                  {success ? "Squad saved" : STEPS[step].title}
                </h3>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {selectedTrack && !success ? (
                  <span className="hidden max-w-[180px] truncate border-2 border-ink bg-white px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-wide lg:block">
                    Track: {selectedTrack.shortName}
                  </span>
                ) : null}
                <DialogClose asChild>
                  <button
                    type="button"
                    aria-label="Close registration portal"
                    className="flex h-8 w-8 items-center justify-center border-[2.5px] border-ink bg-white shadow-[2px_2px_0_#171717] hover:bg-brand-pink active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </DialogClose>
              </div>
            </div>

            {!success ? (
              <div className="grid grid-cols-4 bg-white">
                {STEPS.map((item, index) => {
                  const active = index === step;
                  const complete = index < step;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        if (index < step) setStep(index);
                      }}
                      disabled={index > step}
                      aria-current={active ? "step" : undefined}
                      className={cn(
                        "flex items-center gap-1.5 border-t-2 border-ink/10 px-2 py-2 text-left transition-colors sm:px-3",
                        active && "bg-brand-pink/35",
                        complete && "hover:bg-brand-lime/30",
                        index > step && "cursor-not-allowed opacity-45",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center border-2 border-ink font-mono text-[9px] font-bold",
                          active
                            ? "bg-brand-pink"
                            : complete
                              ? "bg-brand-lime"
                              : "bg-white",
                        )}
                      >
                        {complete ? <Check className="h-3 w-3" strokeWidth={3} /> : index + 1}
                      </span>
                      <span className="truncate font-mono text-[8px] font-bold uppercase tracking-[0.08em] sm:text-[9px]">
                        {item.short}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </header>

          {success ? (
            <div className="p-3 sm:p-5">
              <Confetti />
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="border-[3px] border-ink bg-white shadow-[6px_6px_0_#171717]"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b-[3px] border-ink bg-brand-lime px-3 py-3 sm:px-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-10 w-10 items-center justify-center border-[3px] border-ink bg-white">
                      <Check className="h-5 w-5" strokeWidth={3} />
                    </span>
                    <div>
                      <p className="eyebrow text-ink/60">Demo complete</p>
                      <p className="font-display text-lg uppercase leading-none sm:text-xl">
                        You made the squad
                      </p>
                    </div>
                  </div>
                  <span className="border-2 border-ink bg-white px-2 py-1 font-mono text-[9px] font-bold uppercase">
                    Local only
                  </span>
                </div>

                <div className="p-3 sm:p-4">
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
                    <div>
                      <p className="eyebrow text-ink/50">Registration ID</p>
                      <p className="mt-0.5 break-all font-mono text-2xl font-bold tracking-tight sm:text-3xl">
                        {success.id}
                      </p>
                      <p className="mt-1 text-sm font-semibold">{success.teamName}</p>
                      <p className="font-mono text-[10px] uppercase tracking-wide text-ink/55">
                        {getTrack(success.trackId)?.name ?? success.trackId} ·{" "}
                        {success.teamSize} members
                      </p>
                    </div>
                    <div className="border-2 border-ink bg-brand-yellow px-2.5 py-2 font-mono text-[9px] font-bold uppercase leading-relaxed">
                      Saved in this browser
                      <br />
                      No server · no upload
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <div className="border-2 border-ink bg-paper p-2.5">
                      <p className="eyebrow text-ink/45">Team leader</p>
                      <p className="mt-1 text-sm font-semibold">{success.leaderName}</p>
                      <p className="font-mono text-[10px] text-ink/60">
                        {success.leaderEmail}
                      </p>
                      <p className="font-mono text-[10px] text-ink/60">
                        {success.leaderPhone}
                      </p>
                    </div>
                    <div className="border-2 border-ink bg-paper p-2.5">
                      <p className="eyebrow text-ink/45">Crew</p>
                      <ul className="mt-1 space-y-1">
                        {success.members.map((member, index) => (
                          <li
                            key={`${member.email}-${index}`}
                            className="text-[11px] leading-snug"
                          >
                            <span className="font-mono text-[9px] text-ink/45">
                              {String(index + 2).padStart(2, "0")}
                            </span>{" "}
                            <span className="font-semibold">{member.name}</span>
                            <span className="block pl-4 font-mono text-[9px] text-ink/50">
                              {member.college}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-3 border-[2.5px] border-ink bg-brand-yellow px-2.5 py-2">
                    <p className="font-mono text-[9px] font-bold uppercase leading-relaxed tracking-[0.04em]">
                      DEMO REGISTRATION — NOT AN OFFICIAL HACKRUSH SUBMISSION
                    </p>
                    <p className="mt-1 text-[10px] leading-relaxed text-ink/65">
                      Nothing was sent to Tech4Hack. Registration dates in the
                      source material are inconsistent, so this portal does not
                      claim that official registration is open.
                    </p>
                  </div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    <BrutalButton
                      variant="lime"
                      onClick={downloadSummary}
                      className="justify-center py-3"
                    >
                      <Download className="h-4 w-4" />
                      Download summary
                    </BrutalButton>
                    <BrutalButton
                      variant="white"
                      onClick={() => {
                        setSuccess(null);
                        setStep(0);
                      }}
                      className="justify-center py-3"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit registration
                    </BrutalButton>
                    <BrutalButton
                      variant={clearArmed ? "pink" : "white"}
                      onClick={clearRegistration}
                      className="justify-center py-3"
                    >
                      <Trash2 className="h-4 w-4" />
                      {clearArmed ? "Confirm clear" : "Clear saved demo"}
                    </BrutalButton>
                  </div>

                  <p className="mt-3 text-center font-mono text-[8px] uppercase leading-relaxed tracking-[0.06em] text-ink/45">
                    Demo data lives only in LocalStorage on this device. Clear it
                    any time with the button above.
                  </p>
                </div>
              </motion.div>
            </div>
          ) : (
            <form
              onSubmit={form.handleSubmit(onSubmit, () =>
                toast.error("Check the highlighted fields before confirming."),
              )}
              noValidate
            >
              <div className="p-3 sm:p-4">
                <div className="mb-3 border-[2.5px] border-ink bg-brand-yellow px-2.5 py-2">
                  <p className="font-mono text-[8px] font-bold uppercase leading-relaxed tracking-[0.04em]">
                    DEMO REGISTRATION — NOT AN OFFICIAL HACKRUSH SUBMISSION
                  </p>
                  <p className="mt-1 text-[10px] leading-relaxed text-ink/65">
                    This interactive portal saves your details only in this
                    browser. No application is submitted to Tech4Hack.
                  </p>
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={step}
                    initial={reduceMotion ? false : { opacity: 0, x: 14 }}
                    animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, x: -14 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    {step === 0 ? (
                      <div>
                        <div className="mb-3 flex items-start gap-2">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-ink bg-brand-lavender">
                            <Users className="h-4 w-4" />
                          </span>
                          <div>
                            <h4 className="font-heading text-sm font-bold uppercase tracking-wide">
                              Stage 01 — your squad
                            </h4>
                            <p className="text-[11px] leading-relaxed text-ink/60">
                              Start with the basics. You can move backward at any
                              time without losing what you typed.
                            </p>
                          </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Field
                            label="Team name"
                            placeholder="e.g. Null Pointers"
                            containerClassName="sm:col-span-2"
                            autoComplete="organization"
                            error={errors.teamName?.message}
                            {...form.register("teamName")}
                          />
                          <Field
                            label="Team leader name"
                            placeholder="Full name"
                            autoComplete="name"
                            error={errors.leaderName?.message}
                            {...form.register("leaderName")}
                          />
                          <Field
                            label="Leader email"
                            type="email"
                            inputMode="email"
                            placeholder="you@campus.edu"
                            autoComplete="email"
                            error={errors.leaderEmail?.message}
                            {...form.register("leaderEmail")}
                          />
                          <Field
                            label="Leader phone"
                            type="tel"
                            inputMode="tel"
                            placeholder="+91 98xxxxxx00"
                            autoComplete="tel"
                            error={errors.leaderPhone?.message}
                            {...form.register("leaderPhone")}
                          />
                          <Field
                            label="College / university"
                            placeholder="Institution name"
                            error={errors.college?.message}
                            {...form.register("college")}
                          />
                          <div>
                            <label htmlFor="teamSize" className="brutal-label">
                              Team size
                            </label>
                            <select
                              id="teamSize"
                              className="brutal-input"
                              {...form.register("teamSize", {
                                valueAsNumber: true,
                              })}
                            >
                              <option value={3}>3 members</option>
                              <option value={4}>4 members</option>
                              <option value={5}>5 members</option>
                            </select>
                            <p className="mt-1 font-mono text-[8px] uppercase leading-snug tracking-wide text-ink/45">
                              Including the team leader.
                            </p>
                          </div>
                          <div className="flex items-end">
                            <div className="w-full border-2 border-ink bg-brand-lime/40 px-2 py-1.5">
                              <p className="font-mono text-[8px] font-bold uppercase tracking-[0.06em] text-ink/60">
                                You will add {Number(teamSize) - 1} teammate
                                {Number(teamSize) - 1 === 1 ? "" : "s"} next.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {step === 1 ? (
                      <div>
                        <div className="mb-3 flex items-start gap-2">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-ink bg-brand-sky">
                            <Users className="h-4 w-4" />
                          </span>
                          <div>
                            <h4 className="font-heading text-sm font-bold uppercase tracking-wide">
                              Stage 02 — assemble your crew
                            </h4>
                            <p className="text-[11px] leading-relaxed text-ink/60">
                              Add the remaining {Number(teamSize) - 1} teammate
                              {Number(teamSize) - 1 === 1 ? "" : "s"}. Only
                              essential details, nothing sensitive.
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-3">
                          {(members ?? []).map((_, index) => (
                            <div
                              key={index}
                              className="border-[2.5px] border-ink bg-white p-3 shadow-[3px_3px_0_#171717]"
                            >
                              <div className="mb-2 flex items-center justify-between gap-2 border-b-2 border-ink/10 pb-1.5">
                                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.1em]">
                                  Member {String(index + 2).padStart(2, "0")}
                                </p>
                                <span className="font-mono text-[8px] uppercase text-ink/40">
                                  Required
                                </span>
                              </div>
                              <div className="grid gap-3 sm:grid-cols-2">
                                <Field
                                  label="Full name"
                                  placeholder="Teammate name"
                                  error={errors.members?.[index]?.name?.message}
                                  {...form.register(`members.${index}.name`)}
                                />
                                <Field
                                  label="Email"
                                  type="email"
                                  inputMode="email"
                                  placeholder="teammate@campus.edu"
                                  error={errors.members?.[index]?.email?.message}
                                  {...form.register(`members.${index}.email`)}
                                />
                                <Field
                                  label="College / university"
                                  placeholder="Institution name"
                                  containerClassName="sm:col-span-2"
                                  error={errors.members?.[index]?.college?.message}
                                  {...form.register(`members.${index}.college`)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {step === 2 ? (
                      <div>
                        <div className="mb-3 flex items-start gap-2">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-ink bg-brand-yellow">
                            <Sparkles className="h-4 w-4" />
                          </span>
                          <div>
                            <h4 className="font-heading text-sm font-bold uppercase tracking-wide">
                              Stage 03 — pick your track
                            </h4>
                            <p className="text-[11px] leading-relaxed text-ink/60">
                              Choose the theme your squad wants to build in. You
                              can change this before confirming.
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-2.5 sm:grid-cols-2">
                          {TRACKS.map((track, index) => {
                            const Icon = trackIcons[track.icon];
                            const selected = watchedTrack === track.id;
                            return (
                              <button
                                key={track.id}
                                type="button"
                                aria-pressed={selected}
                                onClick={() => {
                                  form.setValue("trackId", track.id, {
                                    shouldValidate: true,
                                  });
                                  form.clearErrors("trackId");
                                }}
                                className={cn(
                                  "relative flex items-start gap-2.5 border-[3px] border-ink p-2.5 text-left transition-all",
                                  colorBlock[track.color],
                                  selected
                                    ? "translate-x-0.5 translate-y-0.5 shadow-[1px_1px_0_#171717]"
                                    : "shadow-[3px_3px_0_#171717] hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#171717]",
                                  index === TRACKS.length - 1 && "sm:col-span-2",
                                )}
                              >
                                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border-2 border-ink bg-white">
                                  <Icon className="h-4 w-4" />
                                </span>
                                <span className="min-w-0">
                                  <span className="block font-display text-[11px] uppercase leading-tight">
                                    {track.shortName}
                                  </span>
                                  <span className="mt-0.5 block text-[10px] font-medium leading-snug text-ink/65">
                                    {track.tagline}
                                  </span>
                                </span>
                                {selected ? (
                                  <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center border-2 border-ink bg-white">
                                    <Check className="h-3 w-3" strokeWidth={3} />
                                  </span>
                                ) : null}
                              </button>
                            );
                          })}
                        </div>
                        {errors.trackId?.message ? (
                          <p
                            role="alert"
                            className="mt-2 border-2 border-[#b3261e] bg-[#fff2f0] px-2 py-1 font-mono text-[9px] font-bold uppercase text-[#b3261e]"
                          >
                            {errors.trackId.message}
                          </p>
                        ) : null}
                      </div>
                    ) : null}

                    {step === 3 ? (
                      <div>
                        <div className="mb-3 flex items-start gap-2">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-ink bg-brand-pink">
                            <Check className="h-4 w-4" strokeWidth={3} />
                          </span>
                          <div>
                            <h4 className="font-heading text-sm font-bold uppercase tracking-wide">
                              Stage 04 — review & confirm
                            </h4>
                            <p className="text-[11px] leading-relaxed text-ink/60">
                              Everything stays on this device. Edit any stage
                              before you confirm.
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-2.5">
                          <ReviewBlock title="Squad" step={0} onEdit={setStep}>
                            <p className="font-heading text-base font-bold">
                              {form.watch("teamName") || "—"}
                            </p>
                            <div className="mt-1 grid gap-0.5 font-mono text-[10px] leading-relaxed text-ink/65">
                              <span>{form.watch("leaderName") || "—"}</span>
                              <span>{form.watch("leaderEmail") || "—"}</span>
                              <span>{form.watch("leaderPhone") || "—"}</span>
                              <span>{form.watch("college") || "—"}</span>
                              <span className="mt-1 font-bold uppercase text-ink/45">
                                {Number(teamSize)} members including leader
                              </span>
                            </div>
                          </ReviewBlock>

                          <ReviewBlock title="Crew" step={1} onEdit={setStep}>
                            <ul className="grid gap-1.5 sm:grid-cols-2">
                              {(members ?? []).map((member, index) => (
                                <li
                                  key={index}
                                  className="border-2 border-ink/15 px-2 py-1.5"
                                >
                                  <p className="font-mono text-[8px] font-bold uppercase text-ink/40">
                                    Member {String(index + 2).padStart(2, "0")}
                                  </p>
                                  <p className="text-[11px] font-semibold">
                                    {member.name || "—"}
                                  </p>
                                  <p className="font-mono text-[9px] text-ink/55">
                                    {member.email || "—"}
                                  </p>
                                  <p className="font-mono text-[9px] text-ink/55">
                                    {member.college || "—"}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </ReviewBlock>

                          <ReviewBlock title="Track" step={2} onEdit={setStep}>
                            {selectedTrack ? (
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "flex h-7 w-7 items-center justify-center border-2 border-ink",
                                    colorBlock[selectedTrack.color],
                                  )}
                                >
                                  {(() => {
                                    const Icon = trackIcons[selectedTrack.icon];
                                    return <Icon className="h-3.5 w-3.5" />;
                                  })()}
                                </span>
                                <div>
                                  <p className="font-heading text-xs font-bold">
                                    {selectedTrack.name}
                                  </p>
                                  <p className="font-mono text-[9px] uppercase text-ink/50">
                                    Selectable · editable until confirm
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs text-[#b3261e]">
                                No track selected yet.
                              </p>
                            )}
                          </ReviewBlock>
                        </div>

                        <div className="mt-3 flex items-start gap-2 border-[2.5px] border-ink bg-brand-lime/50 px-2.5 py-2">
                          <ShieldIcon className="mt-0.5 h-4 w-4 shrink-0" />
                          <p className="text-[10px] leading-relaxed text-ink/70">
                            Confirming generates a demo registration ID and saves
                            these details in this browser only. It does not
                            register your team with Tech4Hack.
                          </p>
                        </div>

                        {savedRegistration ? (
                          <p className="mt-2 font-mono text-[8px] uppercase leading-relaxed tracking-wide text-ink/45">
                            This will update your saved demo registration (
                            {savedRegistration.id}).
                          </p>
                        ) : null}
                      </div>
                    ) : null}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-4 flex flex-col-reverse gap-2 border-t-2 border-ink/15 pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    {step > 0 ? (
                      <BrutalButton
                        variant="white"
                        onClick={() => setStep((current) => Math.max(0, current - 1))}
                        className="w-full py-2.5 sm:w-auto"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </BrutalButton>
                    ) : (
                      <p className="hidden max-w-xs font-mono text-[8px] uppercase leading-relaxed tracking-wide text-ink/40 sm:block">
                        Interactive demonstration · no server · no account
                      </p>
                    )}
                  </div>

                  {step < 3 ? (
                    <BrutalButton
                      variant="lime"
                      onClick={goNext}
                      className="w-full justify-between py-3 sm:w-auto sm:justify-center"
                    >
                      {step === 2 ? "Review squad" : "Continue"}
                      <ArrowRight className="h-4 w-4" />
                    </BrutalButton>
                  ) : (
                    <BrutalButton
                      type="submit"
                      variant="lime"
                      className="w-full justify-between py-3 sm:w-auto sm:justify-center"
                    >
                      Confirm demo registration
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </BrutalButton>
                  )}
                </div>

                <p className="mt-3 border-t-2 border-ink/10 pt-2 font-mono text-[8px] uppercase leading-relaxed tracking-[0.04em] text-ink/40">
                  The source material lists conflicting registration dates. This
                  portal does not claim that official registration is open.
                </p>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
