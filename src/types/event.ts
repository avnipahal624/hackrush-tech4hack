export type TrackId =
  | "ai-ml"
  | "fintech"
  | "healthtech"
  | "cybersecurity"
  | "sustainability";

export type TrackColor = "lavender" | "lime" | "pink" | "sky" | "yellow";

export type TrackIcon = "cpu" | "coins" | "heart" | "shield" | "leaf";

export interface Track {
  id: TrackId;
  name: string;
  shortName: string;
  color: TrackColor;
  icon: TrackIcon;
  tagline: string;
  description: string;
  detail: string;
  highlights: string[];
}

export type MilestoneKind =
  | "announcement"
  | "submission-open"
  | "submission-close"
  | "result"
  | "mentorship"
  | "finale"
  | "ceremony";

export interface EventMilestone {
  id: string;
  title: string;
  shortTitle: string;
  dateLabel: string;
  /** ISO timestamp with an explicit +05:30 offset (Asia/Kolkata). */
  start?: string;
  end?: string;
  kind: MilestoneKind;
  targetLabel: string;
  summary: string;
  details: string[];
  /** Result-type milestones must never be presented as published. */
  isResult?: boolean;
  tba?: boolean;
}

export interface EventInfo {
  id: string;
  label: string;
  value: string;
  icon: "team" | "cap" | "laptop" | "calendar";
  color: TrackColor;
}

export interface Award {
  id: string;
  rank: string;
  title: string;
  perks: string;
  color: TrackColor;
  icon: "trophy" | "medal" | "award" | "sparkles" | "rocket";
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  dateLabel: string;
  sortDate: string;
  tag: string;
  isScheduled: boolean;
}

export interface RegistrationMember {
  name: string;
  email: string;
  college: string;
}

export type TeamSize = 3 | 4 | 5;

export interface Registration {
  id: string;
  createdAt: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  college: string;
  teamSize: TeamSize;
  members: RegistrationMember[];
  trackId: TrackId;
}

export interface Submission {
  id: string;
  savedAt: string;
  teamName: string;
  projectTitle: string;
  trackId: TrackId;
  description: string;
  problem: string;
  solution: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  githubUrl: string;
}

export type MilestoneState = "upcoming" | "in-progress" | "passed" | "tba";

export interface MilestoneStatus {
  state: MilestoneState;
  label: string;
  note: string;
}
