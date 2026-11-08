import { useEffect, useRef, useState } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
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
  FileText,
  HeartPulse,
  Leaf,
  Pencil,
  ShieldCheck,
  ShieldCheck as ShieldIcon,
  Sparkles,
  Trash2,
  Upload,
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
import { formatBytes, getTrack, TRACKS } from "@/config/event";
import {
  createDemoId,
  removeStored,
  STORAGE_KEYS,
  writeJSON,
} from "@/lib/storage";
import { colorBlock } from "@/lib/theme";
import { cn } from "@/lib/utils";
import type {
  Registration,
  Submission,
  TrackIcon,
  TrackId,
} from "@/types/event";
import { BrutalButton } from "./BrutalButton";

const trackIcons: Record<TrackIcon, typeof Cpu> = {
  cpu: Cpu,
  coins: Coins,
  heart: HeartPulse,
  shield: ShieldIcon,
  leaf: Leaf,
};

const submissionSchema = z.object({
  teamName: z
    .string()
    .trim()
    .min(2, "Enter your team name")
    .max(50, "Keep the team name under 50 characters"),
  projectTitle: z
    .string()
    .trim()
    .min(3, "Give your project a title")
    .max(80, "Keep the title under 80 characters"),
  trackId: z.enum([
    "ai-ml",
    "fintech",
    "healthtech",
    "cybersecurity",
    "sustainability",
  ]),
  description: z
    .string()
    .trim()
    .min(20, "Write at least 20 characters")
    .max(300, "Keep the short description under 300 characters"),
  problem: z
    .string()
    .trim()
    .min(20, "Describe the problem in at least 20 characters")
    .max(500, "Keep the problem statement under 500 characters"),
  solution: z
    .string()
    .trim()
    .min(20, "Describe your solution in at least 20 characters")
    .max(500, "Keep the solution under 500 characters"),
  githubUrl: z
    .string()
    .trim()
    .max(300, "Keep the URL under 300 characters")
    .refine(
      (value) =>
        value === "" || /^https?:\/\/[^\s]+\.[^\s]+$/i.test(value),
      "Use a full URL starting with http:// or https://",
    ),
  declaration: z
    .boolean()
    .refine(
      (value) => value === true,
      "Confirm the demo declaration to continue.",
    ),
});

type SubmissionFormValues = z.infer<typeof submissionSchema>;

const ACCEPTED_EXTENSIONS = ["ppt", "pptx", "pdf"];
const MAX_FILE_BYTES = 10 * 1024 * 1024;

interface FileMeta {
  name: string;
  size: number;
  type: string;
}

function validateFile(file: File): string | null {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ACCEPTED_EXTENSIONS.includes(extension)) {
    return "Use a .ppt, .pptx, or .pdf file.";
  }
  if (file.size === 0) {
    return "That file looks empty. Pick another one.";
  }
  if (file.size > MAX_FILE_BYTES) {
    return "Keep the file under 10 MB for this demo.";
  }
  return null;
}

function buildDefaults(
  savedSubmission: Submission | null,
  registration: Registration | null,
): SubmissionFormValues {
  return {
    teamName:
      savedSubmission?.teamName ?? registration?.teamName ?? "",
    projectTitle: savedSubmission?.projectTitle ?? "",
    trackId:
      savedSubmission?.trackId ??
      registration?.trackId ??
      ("" as TrackId),
    description: savedSubmission?.description ?? "",
    problem: savedSubmission?.problem ?? "",
    solution: savedSubmission?.solution ?? "",
    githubUrl: savedSubmission?.githubUrl ?? "",
    declaration: false,
  };
}

function FormField({
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
  const inputId = props.id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");
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

function TextareaField({
  label,
  error,
  hint,
  counter,
  containerClassName,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  hint?: string;
  counter?: string;
  containerClassName?: string;
}) {
  const inputId =
    props.id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");
  const errorId = `${inputId}-error`;

  return (
    <div className={cn("min-w-0", containerClassName)}>
      <div className="flex items-end justify-between gap-2">
        <label htmlFor={inputId} className="brutal-label">
          {label}
        </label>
        {counter ? (
          <span className="mb-1 font-mono text-[8px] font-bold uppercase tracking-wide text-ink/40">
            {counter}
          </span>
        ) : null}
      </div>
      <textarea
        id={inputId}
        className={cn("brutal-input min-h-[92px] resize-y leading-relaxed", className)}
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

interface SubmissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savedRegistration: Registration | null;
  savedSubmission: Submission | null;
  onSaved: (submission: Submission) => void;
  onClear: () => void;
}

export function SubmissionModal({
  open,
  onOpenChange,
  savedRegistration,
  savedSubmission,
  onSaved,
  onClear,
}: SubmissionModalProps) {
  const [view, setView] = useState<"form" | "confirm" | "success">("form");
  const [saved, setSaved] = useState<Submission | null>(savedSubmission);
  const [fileMeta, setFileMeta] = useState<FileMeta | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [clearArmed, setClearArmed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const wasOpen = useRef(false);
  const reduceMotion = useReducedMotion();

  const form = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    mode: "onTouched",
    defaultValues: buildDefaults(savedSubmission, savedRegistration),
  });

  const errors = form.formState.errors;
  const values = form.watch();
  const declaration = Boolean(values.declaration);
  const watchedTrack = values.trackId;
  const selectedTrack = getTrack(watchedTrack);

  useEffect(() => {
    if (!open) {
      wasOpen.current = false;
      return;
    }
    if (wasOpen.current) return;
    wasOpen.current = true;

    const source = savedSubmission;
    form.reset(buildDefaults(source, savedRegistration));
    setSaved(source);
    setFileMeta(
      source
        ? { name: source.fileName, size: source.fileSize, type: source.fileType }
        : null,
    );
    setFileError(null);
    setView(source ? "success" : "form");
    setClearArmed(false);
  }, [open, savedSubmission, savedRegistration, form]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [view]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setFileError(error);
      setFileMeta(null);
      event.target.value = "";
      toast.error(error);
      return;
    }

    setFileError(null);
    setFileMeta({
      name: file.name,
      size: file.size,
      type:
        file.type ||
        file.name.split(".").pop()?.toUpperCase() ||
        "application/octet-stream",
    });
    toast.success("File selected. It stays on your device in this demo.");
  };

  const removeFile = () => {
    setFileMeta(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const reviewSubmission = async () => {
    const valid = await form.trigger(undefined, { shouldFocus: true });
    if (!fileMeta) {
      setFileError("Select a .ppt, .pptx, or .pdf file (max 10 MB).");
    }
    if (!valid || !fileMeta) {
      toast.error("Complete the highlighted fields and add your idea deck.");
      return;
    }
    setFileError(null);
    setView("confirm");
  };

  const onConfirm = form.handleSubmit((data) => {
    if (!fileMeta) {
      setFileError("Select a .ppt, .pptx, or .pdf file (max 10 MB).");
      setView("form");
      return;
    }

    const submission: Submission = {
      id: savedSubmission?.id ?? saved?.id ?? createDemoId("IDEA"),
      savedAt: new Date().toISOString(),
      teamName: data.teamName.trim(),
      projectTitle: data.projectTitle.trim(),
      trackId: data.trackId,
      description: data.description.trim(),
      problem: data.problem.trim(),
      solution: data.solution.trim(),
      fileName: fileMeta.name,
      fileSize: fileMeta.size,
      fileType: fileMeta.type,
      githubUrl: data.githubUrl.trim(),
    };

    writeJSON(STORAGE_KEYS.submission, submission);
    onSaved(submission);
    setSaved(submission);
    setView("success");
    toast.success("Demo submission saved locally. The file was not uploaded.");
  }, () => {
    toast.error("Check the highlighted fields before saving this demo.");
    setView("form");
  });

  const clearSubmission = () => {
    if (!clearArmed) {
      setClearArmed(true);
      toast.info("Press clear again to remove the saved demo submission.");
      return;
    }
    removeStored(STORAGE_KEYS.submission);
    onClear();
    setSaved(null);
    setFileMeta(null);
    setFileError(null);
    setClearArmed(false);
    setView("form");
    form.reset(buildDefaults(null, savedRegistration));
    toast.success("Saved demo submission cleared from this browser.");
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setClearArmed(false);
    onOpenChange(nextOpen);
  };

  const checklist = [
    { label: "Team name", done: Boolean(values.teamName?.trim()) },
    {
      label: "Project title",
      done: Boolean(values.projectTitle?.trim()),
    },
    { label: "Track selected", done: Boolean(watchedTrack) },
    {
      label: "Short description",
      done: Boolean(values.description?.trim() && values.description.trim().length >= 20),
    },
    {
      label: "Problem & solution",
      done:
        Boolean(values.problem?.trim() && values.problem.trim().length >= 20) &&
        Boolean(values.solution?.trim() && values.solution.trim().length >= 20),
    },
    { label: "Deck selected", done: Boolean(fileMeta) },
    { label: "Declaration ticked", done: declaration },
  ];
  const doneCount = checklist.filter((item) => item.done).length;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[min(62rem,calc(100vw-1rem))] max-w-none gap-0 rounded-none border-[3px] border-ink bg-paper p-0 shadow-[8px_8px_0_#171717] sm:max-w-[62rem]"
      >
        <DialogTitle className="sr-only">
          Tech4Hack HACKRUSH 2026 demo idea submission
        </DialogTitle>
        <DialogDescription className="sr-only">
          A local demo form that saves text fields and file metadata only. No
          file is uploaded or sent to organizers.
        </DialogDescription>

        <div
          ref={scrollRef}
          className="max-h-[92vh] overflow-y-auto overscroll-contain sm:max-h-[88vh]"
        >
          <header className="sticky top-0 z-20 border-b-[3px] border-ink bg-white">
            <div className="flex items-center justify-between gap-3 bg-brand-sky px-3 py-2.5 sm:px-4">
              <div className="min-w-0">
                <p className="eyebrow text-ink/60">Idea submission · demo</p>
                <h3 className="truncate font-display text-lg uppercase leading-tight sm:text-xl">
                  {view === "form"
                    ? "Drop your big idea!"
                    : view === "confirm"
                      ? "Confirm demo submission"
                      : "Idea saved locally"}
                </h3>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="hidden border-2 border-ink bg-white px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-wide sm:block">
                  No upload
                </span>
                <DialogClose asChild>
                  <button
                    type="button"
                    aria-label="Close idea submission portal"
                    className="flex h-8 w-8 items-center justify-center border-[2.5px] border-ink bg-white shadow-[2px_2px_0_#171717] hover:bg-brand-pink active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </DialogClose>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 bg-white px-3 py-1.5 sm:px-4">
              <div className="flex items-center gap-3">
                {["Details", "Confirm", "Saved"].map((label, index) => {
                  const active =
                    (view === "form" && index === 0) ||
                    (view === "confirm" && index === 1) ||
                    (view === "success" && index === 2);
                  const complete =
                    (view === "confirm" && index === 0) ||
                    (view === "success" && index < 2);
                  return (
                    <span
                      key={label}
                      className={cn(
                        "flex items-center gap-1 font-mono text-[8px] font-bold uppercase tracking-[0.08em]",
                        active ? "text-ink" : "text-ink/40",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-4 w-4 items-center justify-center border-2 border-ink text-[8px]",
                          active
                            ? "bg-brand-sky"
                            : complete
                              ? "bg-brand-lime"
                              : "bg-white",
                        )}
                      >
                        {complete ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : index + 1}
                      </span>
                      {label}
                    </span>
                  );
                })}
              </div>
              <span className="font-mono text-[8px] font-bold uppercase text-ink/40">
                Demo · local only
              </span>
            </div>
          </header>

          <div className="p-3 sm:p-4">
            <div className="mb-3 border-[2.5px] border-ink bg-brand-yellow px-2.5 py-2">
              <p className="font-mono text-[8px] font-bold uppercase leading-relaxed tracking-[0.04em]">
                DEMO SUBMISSION — NO FILE IS SENT TO ORGANIZERS
              </p>
              <p className="mt-1 text-[10px] leading-relaxed text-ink/65">
                Text fields and file metadata are saved in this browser only.
                The selected PPT/PDF is never uploaded or transmitted. This is
                not an official HACKRUSH submission.
              </p>
            </div>

            {view === "form" ? (
              <form onSubmit={(event) => event.preventDefault()} noValidate>
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_270px]">
                  <div className="min-w-0 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <FormField
                        label="Team name"
                        placeholder="Your demo squad"
                        hint={
                          savedRegistration
                            ? "Prefilled from saved demo registration."
                            : "You can submit without registering first."
                        }
                        error={errors.teamName?.message}
                        {...form.register("teamName")}
                      />
                      <FormField
                        label="Project title"
                        placeholder="e.g. Signal — campus safety map"
                        error={errors.projectTitle?.message}
                        {...form.register("projectTitle")}
                      />
                    </div>

                    <div>
                      <p className="brutal-label">Selected track</p>
                      <div className="grid gap-2 sm:grid-cols-2">
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
                                "flex items-center gap-2 border-[2.5px] border-ink px-2 py-1.5 text-left transition-all",
                                colorBlock[track.color],
                                selected
                                  ? "translate-x-0.5 translate-y-0.5 shadow-[1px_1px_0_#171717]"
                                  : "shadow-[2px_2px_0_#171717] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#171717]",
                                index === TRACKS.length - 1 && "sm:col-span-2",
                              )}
                            >
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center border-2 border-ink bg-white">
                                <Icon className="h-3 w-3" />
                              </span>
                              <span className="min-w-0 flex-1 truncate font-heading text-[10px] font-bold uppercase tracking-wide">
                                {track.shortName}
                              </span>
                              {selected ? (
                                <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={3} />
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                      {errors.trackId?.message ? (
                        <p
                          role="alert"
                          className="mt-1 font-mono text-[9px] font-bold uppercase text-[#b3261e]"
                        >
                          Pick a track for your idea.
                        </p>
                      ) : null}
                    </div>

                    <TextareaField
                      label="Short project description"
                      placeholder="One or two lines that make someone want to try it."
                      maxLength={300}
                      counter={`${values.description?.length ?? 0}/300`}
                      error={errors.description?.message}
                      {...form.register("description")}
                    />

                    <TextareaField
                      label="Problem statement"
                      placeholder="What real problem are you solving, and for whom?"
                      maxLength={500}
                      counter={`${values.problem?.length ?? 0}/500`}
                      error={errors.problem?.message}
                      {...form.register("problem")}
                    />

                    <TextareaField
                      label="Proposed solution"
                      placeholder="How does your idea work? What is the smallest useful version?"
                      maxLength={500}
                      counter={`${values.solution?.length ?? 0}/500`}
                      error={errors.solution?.message}
                      {...form.register("solution")}
                    />

                    <div>
                      <label htmlFor="pptFile" className="brutal-label">
                        Idea deck (.ppt, .pptx, .pdf)
                      </label>
                      <input
                        ref={fileInputRef}
                        id="pptFile"
                        type="file"
                        accept=".ppt,.pptx,.pdf,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                      <div
                        className={cn(
                          "border-[2.5px] border-ink bg-white p-2.5",
                          fileError && "bg-[#fff2f0]",
                        )}
                      >
                        {fileMeta ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-ink bg-brand-lime">
                              <FileText className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[11px] font-semibold">
                                {fileMeta.name}
                              </p>
                              <p className="font-mono text-[8px] uppercase tracking-wide text-ink/50">
                                {formatBytes(fileMeta.size)} ·{" "}
                                {fileMeta.type || "deck"} · metadata only
                              </p>
                            </div>
                            <div className="flex gap-1.5">
                              <label
                                htmlFor="pptFile"
                                className="flex cursor-pointer items-center gap-1 border-2 border-ink bg-white px-2 py-1 font-mono text-[8px] font-bold uppercase hover:bg-brand-lime"
                              >
                                <Upload className="h-2.5 w-2.5" />
                                Replace
                              </label>
                              <button
                                type="button"
                                onClick={removeFile}
                                className="flex items-center gap-1 border-2 border-ink bg-white px-2 py-1 font-mono text-[8px] font-bold uppercase hover:bg-brand-pink"
                              >
                                <X className="h-2.5 w-2.5" />
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 py-2 text-center">
                            <label
                              htmlFor="pptFile"
                              className="brutal-btn cursor-pointer bg-brand-lime px-4 py-2.5 text-[10px] uppercase tracking-[0.08em]"
                            >
                              <Upload className="h-4 w-4" />
                              Choose deck
                            </label>
                            <p className="font-mono text-[8px] uppercase leading-relaxed tracking-wide text-ink/45">
                              .ppt / .pptx / .pdf · max 10 MB
                              <br />
                              Validation runs locally. Nothing is uploaded.
                            </p>
                          </div>
                        )}
                      </div>
                      {fileError ? (
                        <p
                          role="alert"
                          className="mt-1 font-mono text-[9px] font-bold uppercase leading-snug text-[#b3261e]"
                        >
                          {fileError}
                        </p>
                      ) : null}
                    </div>

                    <FormField
                      label="Optional GitHub / prototype URL"
                      type="url"
                      inputMode="url"
                      placeholder="https://github.com/your-team/project"
                      error={errors.githubUrl?.message}
                      {...form.register("githubUrl")}
                    />
                  </div>

                  <aside className="min-w-0 space-y-3">
                    <div className="border-[3px] border-ink bg-white shadow-[4px_4px_0_#171717]">
                      <div className="flex items-center justify-between gap-2 border-b-[3px] border-ink bg-brand-lime px-2.5 py-2">
                        <p className="font-display text-xs uppercase">
                          Submission checklist
                        </p>
                        <span className="border-2 border-ink bg-white px-1.5 py-0.5 font-mono text-[9px] font-bold">
                          {doneCount}/{checklist.length}
                        </span>
                      </div>
                      <ul className="space-y-1.5 p-2.5">
                        {checklist.map((item) => (
                          <li
                            key={item.label}
                            className="flex items-start gap-2 text-[10px] font-medium leading-snug"
                          >
                            <span
                              className={cn(
                                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border-2 border-ink transition-colors",
                                item.done ? "bg-brand-lime" : "bg-white",
                              )}
                            >
                              <AnimatePresence initial={false}>
                                {item.done ? (
                                  <motion.span
                                    initial={reduceMotion ? false : { scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                  >
                                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                                  </motion.span>
                                ) : null}
                              </AnimatePresence>
                            </span>
                            <span
                              className={cn(
                                item.done ? "text-ink" : "text-ink/55",
                              )}
                            >
                              {item.label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-[2.5px] border-ink bg-white p-2.5">
                      <p className="eyebrow text-ink/45">Declaration</p>
                      <div className="mt-1.5 flex items-start gap-2">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={declaration}
                          aria-invalid={Boolean(errors.declaration)}
                          onClick={() =>
                            form.setValue("declaration", !declaration, {
                              shouldValidate: true,
                            })
                          }
                          className={cn(
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-[2.5px] border-ink transition-colors",
                            declaration ? "bg-brand-lime" : "bg-white",
                          )}
                        >
                          {declaration ? (
                            <Check className="h-3.5 w-3.5" strokeWidth={3} />
                          ) : null}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            form.setValue("declaration", !declaration, {
                              shouldValidate: true,
                            })
                          }
                          className="text-left text-[10px] leading-relaxed text-ink/65"
                        >
                          I understand this is a demo. No file or form data is
                          sent to Tech4Hack, and this is not an official
                          submission.
                        </button>
                      </div>
                      {errors.declaration?.message ? (
                        <p
                          role="alert"
                          className="mt-1 font-mono text-[8px] font-bold uppercase leading-snug text-[#b3261e]"
                        >
                          {errors.declaration.message}
                        </p>
                      ) : null}
                    </div>

                    <BrutalButton
                      variant="lime"
                      onClick={reviewSubmission}
                      className="w-full justify-between py-3"
                    >
                      Review submission
                      <ArrowRight className="h-4 w-4" />
                    </BrutalButton>

                    <p className="font-mono text-[8px] uppercase leading-relaxed tracking-[0.04em] text-ink/40">
                      No fake upload progress. No backend. Your deck stays on
                      your device.
                    </p>
                  </aside>
                </div>
              </form>
            ) : null}

            {view === "confirm" ? (
              <div className="mx-auto max-w-3xl">
                <div className="border-[3px] border-ink bg-white shadow-[5px_5px_0_#171717]">
                  <div className="flex items-center gap-2 border-b-[3px] border-ink bg-brand-lavender px-3 py-2.5">
                    <Sparkles className="h-4 w-4" />
                    <p className="font-display text-sm uppercase">
                      Confirm demo submission
                    </p>
                  </div>
                  <div className="space-y-3 p-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="border-2 border-ink bg-paper p-2.5">
                        <p className="eyebrow text-ink/45">Team</p>
                        <p className="mt-0.5 text-sm font-semibold">
                          {values.teamName}
                        </p>
                        <p className="font-mono text-[9px] uppercase text-ink/50">
                          {selectedTrack?.shortName ?? "No track"}
                        </p>
                      </div>
                      <div className="border-2 border-ink bg-paper p-2.5">
                        <p className="eyebrow text-ink/45">Project</p>
                        <p className="mt-0.5 text-sm font-semibold">
                          {values.projectTitle}
                        </p>
                        <p className="font-mono text-[9px] uppercase text-ink/50">
                          {fileMeta?.name ?? "No deck selected"}
                        </p>
                      </div>
                    </div>

                    <div className="border-2 border-ink bg-paper p-2.5">
                      <p className="eyebrow text-ink/45">Short description</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink/70">
                        {values.description}
                      </p>
                    </div>

                    <div className="border-[2.5px] border-ink bg-brand-yellow px-2.5 py-2">
                      <p className="font-mono text-[9px] font-bold uppercase leading-relaxed tracking-[0.04em]">
                        DEMO SUBMISSION — NO FILE IS SENT TO ORGANIZERS
                      </p>
                      <p className="mt-1 text-[10px] leading-relaxed text-ink/65">
                        Confirming saves the text below and{" "}
                        <strong>only the file metadata</strong> in this browser.
                        The deck itself is not uploaded, copied, or transmitted.
                      </p>
                    </div>

                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                      <BrutalButton
                        variant="white"
                        onClick={() => setView("form")}
                        className="w-full py-2.5 sm:w-auto"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back to edit
                      </BrutalButton>
                      <BrutalButton
                        variant="lime"
                        onClick={onConfirm}
                        className="w-full justify-between py-3 sm:w-auto sm:justify-center"
                      >
                        Save demo submission
                        <Check className="h-4 w-4" strokeWidth={3} />
                      </BrutalButton>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {view === "success" && saved ? (
              <div className="mx-auto max-w-3xl">
                <div className="border-[3px] border-ink bg-white shadow-[5px_5px_0_#171717]">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b-[3px] border-ink bg-brand-lime px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center border-2 border-ink bg-white">
                        <Check className="h-4 w-4" strokeWidth={3} />
                      </span>
                      <div>
                        <p className="eyebrow text-ink/60">Saved locally</p>
                        <p className="font-display text-sm uppercase">
                          Demo submission
                        </p>
                      </div>
                    </div>
                    <span className="border-2 border-ink bg-white px-2 py-1 font-mono text-[9px] font-bold uppercase">
                      {saved.id}
                    </span>
                  </div>

                  <div className="p-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="border-2 border-ink bg-paper p-2.5">
                        <p className="eyebrow text-ink/45">Project</p>
                        <p className="mt-0.5 text-sm font-semibold">
                          {saved.projectTitle}
                        </p>
                        <p className="mt-0.5 font-mono text-[9px] uppercase text-ink/50">
                          {saved.teamName}
                        </p>
                      </div>
                      <div className="border-2 border-ink bg-paper p-2.5">
                        <p className="eyebrow text-ink/45">Track</p>
                        <p className="mt-0.5 text-sm font-semibold">
                          {getTrack(saved.trackId)?.shortName ?? saved.trackId}
                        </p>
                        <p className="mt-0.5 font-mono text-[9px] uppercase text-ink/50">
                          Updated{" "}
                          {new Date(saved.savedAt).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 flex items-start gap-2 border-2 border-ink bg-brand-sky/40 p-2.5">
                      <FileText className="mt-0.5 h-4 w-4 shrink-0" />
                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-semibold">
                          {saved.fileName}
                        </p>
                        <p className="font-mono text-[8px] uppercase tracking-wide text-ink/55">
                          {formatBytes(saved.fileSize)} ·{" "}
                          {saved.fileType || "deck"} · metadata saved only
                        </p>
                        <p className="mt-1 text-[10px] leading-relaxed text-ink/60">
                          The actual file was not uploaded anywhere. Only this
                          filename and size are stored in your browser.
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 border-[2.5px] border-ink bg-brand-yellow px-2.5 py-2">
                      <p className="font-mono text-[9px] font-bold uppercase leading-relaxed tracking-[0.04em]">
                        DEMO SUBMISSION — NO FILE IS SENT TO ORGANIZERS
                      </p>
                      <p className="mt-1 text-[10px] leading-relaxed text-ink/65">
                        Nothing was submitted to Tech4Hack. This record lives in
                        LocalStorage on this device and can be edited or cleared
                        at any time.
                      </p>
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-3">
                      <BrutalButton
                        variant="lime"
                        onClick={() => setView("form")}
                        className="justify-center py-2.5"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit details
                      </BrutalButton>
                      <BrutalButton
                        variant={clearArmed ? "pink" : "white"}
                        onClick={clearSubmission}
                        className="justify-center py-2.5"
                      >
                        <Trash2 className="h-4 w-4" />
                        {clearArmed ? "Confirm clear" : "Clear saved demo"}
                      </BrutalButton>
                      <BrutalButton
                        variant="white"
                        onClick={() => onOpenChange(false)}
                        className="justify-center py-2.5"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        Close
                      </BrutalButton>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
