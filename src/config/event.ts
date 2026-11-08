import type {
  Announcement,
  Award,
  EventInfo,
  EventMilestone,
  Track,
} from "@/types/event";

export const EVENT = {
  organization: "Tech4Hack",
  campus: "IGDTUW",
  hackathon: "HACKRUSH",
  year: "2026",
  tagline: "BUILD. INNOVATE. SOLVE. REPEAT.",
  subtitle: "The Flagship Hackathon of Tech4Hack, IGDTUW.",
  timeZone: "Asia/Kolkata",
  timeZoneShort: "IST",
  finale: "22 November 2026",
  registrationNote:
    "The source material lists conflicting registration dates, so this portal is an interactive demonstration only.",
  registrationDisclaimer:
    "DEMO REGISTRATION — NOT AN OFFICIAL HACKRUSH SUBMISSION",
  submissionDisclaimer:
    "DEMO SUBMISSION — NO FILE IS SENT TO ORGANIZERS",
  demoNote:
    "Independent interactive demo built for the Tech4Hack x HACKRUSH evaluation. It is not the official registration platform.",
} as const;

export const TRACKS: Track[] = [
  {
    id: "ai-ml",
    name: "AI, Machine Learning & Generative AI",
    shortName: "AI, ML & GenAI",
    color: "lavender",
    icon: "cpu",
    tagline: "Make machines think, generate, and assist.",
    description:
      "Build intelligent systems that learn from data, reason through problems, or generate something useful.",
    detail:
      "This track is for teams working with machine learning, deep learning, computer vision, NLP, or generative AI. Think applied assistants, model-powered tools, data storytelling, or responsible AI experiments. Judges will look for a clear user problem, a thoughtful dataset or model choice, and an honest account of limitations.",
    highlights: [
      "Applied ML or generative AI with a real use case",
      "Clear data, model and evaluation choices",
      "Responsible handling of bias, privacy and limits",
    ],
  },
  {
    id: "fintech",
    name: "Fintech & Blockchain",
    shortName: "Fintech & Blockchain",
    color: "lime",
    icon: "coins",
    tagline: "Rethink money, trust, and everyday finance.",
    description:
      "Design safer, simpler financial products or useful blockchain-backed verification flows.",
    detail:
      "From budgeting tools and fraud signals to transparent ledgers and digital identity, this track rewards practical financial problem-solving. Teams can explore payments, lending, financial literacy, auditability, or smart-contract prototypes. Avoid speculative claims; show why your approach is trustworthy and usable.",
    highlights: [
      "A concrete financial friction worth fixing",
      "Security, consent and auditability by design",
      "A working prototype over buzzwords",
    ],
  },
  {
    id: "healthtech",
    name: "HealthTech & Biotech",
    shortName: "HealthTech & Biotech",
    color: "pink",
    icon: "heart",
    tagline: "Build care that reaches more people.",
    description:
      "Create tools for better health access, clinical workflows, wellness, or biological insight.",
    detail:
      "HealthTech and Biotech teams can prototype patient support, screening aids, care coordination, accessible wellness tools, or computational biology ideas. Focus on a real gap in care and keep human oversight central. Do not present a prototype as a medical device or a diagnosis.",
    highlights: [
      "A specific health or care-access problem",
      "Privacy-first, human-in-the-loop design",
      "Responsible, clearly bounded claims",
    ],
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity & Digital Safety",
    shortName: "Cybersecurity & Digital Safety",
    color: "sky",
    icon: "shield",
    tagline: "Make the internet safer by default.",
    description:
      "Protect people and systems with better privacy, threat detection, or digital-safety tooling.",
    detail:
      "Build defensive security tools, privacy checkers, phishing awareness experiences, secure communication demos, or digital-safety resources for vulnerable users. Ethical boundaries matter: work only with consent, avoid harmful payloads, and explain your threat model clearly.",
    highlights: [
      "Defensive and consent-based security",
      "A clear threat model and safe demo",
      "Privacy or digital-safety impact for real users",
    ],
  },
  {
    id: "sustainability",
    name: "Smart Cities & Sustainability",
    shortName: "Smart Cities & Sustainability",
    color: "yellow",
    icon: "leaf",
    tagline: "Design the city we actually want to live in.",
    description:
      "Use technology to improve public spaces, resource use, mobility, or community resilience.",
    detail:
      "This track welcomes civic tech, climate tools, waste and water ideas, accessibility maps, mobility experiments, and community-sensing projects. The strongest entries connect a local problem to a measurable improvement and consider who might be left out of the solution.",
    highlights: [
      "A local civic or climate problem",
      "Measurable resource or access improvement",
      "Inclusive, low-cost implementation",
    ],
  },
];

export const EVENT_INFO: EventInfo[] = [
  {
    id: "team-size",
    label: "Team size",
    value: "3–5 members",
    icon: "team",
    color: "lavender",
  },
  {
    id: "eligibility",
    label: "Eligibility",
    value: "UG / PG · all domains",
    icon: "cap",
    color: "lime",
  },
  {
    id: "format",
    label: "Event format",
    value: "Online + offline ceremony",
    icon: "laptop",
    color: "sky",
  },
  {
    id: "finale",
    label: "Online finale",
    value: "22 November 2026",
    icon: "calendar",
    color: "yellow",
  },
];

/**
 * All timestamps use an explicit +05:30 offset so countdowns and statuses are
 * anchored to Asia/Kolkata regardless of the visitor's device time zone.
 */
export const MILESTONES: EventMilestone[] = [
  {
    id: "announcement",
    title: "HACKRUSH 2026 announcement",
    shortTitle: "Announcement",
    dateLabel: "9 Nov 2026",
    start: "2026-11-09T00:00:00+05:30",
    kind: "announcement",
    targetLabel: "ANNOUNCEMENT IN",
    summary:
      "The HACKRUSH 2026 journey is scheduled to begin, with the event brief and track themes shared with participants.",
    details: [
      "Scheduled per the published HACKRUSH 2026 timeline.",
      "This demo dashboard does not publish official participant or registration numbers.",
      "Registration dates in the source material are inconsistent, so no official deadline is claimed here.",
    ],
  },
  {
    id: "submissions-open",
    title: "Idea / PPT submission opens",
    shortTitle: "Idea / PPT submissions open",
    dateLabel: "9 Nov 2026",
    start: "2026-11-09T09:00:00+05:30",
    kind: "submission-open",
    targetLabel: "SUBMISSIONS OPEN IN",
    summary:
      "Teams can begin preparing their idea deck: problem statement, proposed solution, and chosen track.",
    details: [
      "Submission window is scheduled for 9–16 November 2026.",
      "The idea/PPT portal on this dashboard is a local demo and never sends a file.",
      "Accepted demo file types: .ppt, .pptx, .pdf.",
    ],
  },
  {
    id: "submissions-close",
    title: "Idea / PPT submission closes",
    shortTitle: "Idea / PPT submission ends",
    dateLabel: "16 Nov 2026 · 23:59 IST",
    start: "2026-11-16T23:59:00+05:30",
    kind: "submission-close",
    targetLabel: "SUBMISSIONS CLOSE IN",
    summary:
      "The scheduled idea submission window comes to a close. Teams should have their deck ready by this checkpoint.",
    details: [
      "Scheduled close: 16 November 2026, 23:59 IST.",
      "No upload is performed by this demo; only local metadata is saved in your browser.",
      "The source material does not provide a verified, official registration link.",
    ],
  },
  {
    id: "top-80",
    title: "Top 80 teams announcement",
    shortTitle: "Top 80 teams",
    dateLabel: "18 Nov 2026",
    start: "2026-11-18T12:00:00+05:30",
    kind: "result",
    targetLabel: "TOP 80 CHECKPOINT IN",
    summary:
      "This is the scheduled date for the Top 80 shortlist. Actual results are not published by this demo.",
    details: [
      "Scheduled per the official timeline — this is not a confirmed result.",
      "This dashboard never invents teams, scores, or shortlist names.",
      "When the date passes, the milestone will read “Date passed · result not published here”.",
    ],
    isResult: true,
  },
  {
    id: "mentorship",
    title: "Mentorship round",
    shortTitle: "Mentorship round",
    dateLabel: "19–20 Nov 2026",
    start: "2026-11-19T09:00:00+05:30",
    end: "2026-11-20T20:00:00+05:30",
    kind: "mentorship",
    targetLabel: "MENTORSHIP STARTS IN",
    summary:
      "A two-day mentorship window is scheduled to help shortlisted teams sharpen their prototypes and narratives.",
    details: [
      "Scheduled range: 19–20 November 2026.",
      "Mentor names, session links, and schedules are not part of the verified source material.",
      "Dates and formats may change; always rely on official Tech4Hack communication.",
    ],
  },
  {
    id: "top-30",
    title: "Top 30 teams announcement",
    shortTitle: "Top 30 teams",
    dateLabel: "21 Nov 2026",
    start: "2026-11-21T12:00:00+05:30",
    kind: "result",
    targetLabel: "TOP 30 CHECKPOINT IN",
    summary:
      "This is the scheduled date for the Top 30 shortlist. This demo does not publish or predict results.",
    details: [
      "Scheduled per the official timeline — not a confirmed result.",
      "No participant statistics or shortlist details are fabricated here.",
      "After the date passes, the status becomes “Date passed · result not published here”.",
    ],
    isResult: true,
  },
  {
    id: "finale",
    title: "Online finale",
    shortTitle: "Finale round (online)",
    dateLabel: "22 Nov 2026",
    start: "2026-11-22T09:00:00+05:30",
    end: "2026-11-22T18:00:00+05:30",
    kind: "finale",
    targetLabel: "ONLINE FINALE IN",
    summary:
      "The live online finale is scheduled for 22 November 2026, with final presentations to the judging panel.",
    details: [
      "The event is described as online, with an offline award ceremony.",
      "Finale running order, links, and judging panel are not published in the verified source material.",
      "Award ceremony is planned offline at IGDTUW; its date is still to be announced.",
    ],
  },
  {
    id: "results",
    title: "Final results declaration",
    shortTitle: "Final results",
    dateLabel: "25 Nov 2026",
    start: "2026-11-25T18:00:00+05:30",
    kind: "result",
    targetLabel: "RESULTS CHECKPOINT IN",
    summary:
      "The scheduled date for final results declaration. No winners are shown or invented on this demo.",
    details: [
      "Scheduled per the official timeline — not a confirmed result.",
      "This dashboard does not display winners, scores, or prize allocations beyond the published award categories.",
      "Refer to official Tech4Hack channels for verified results.",
    ],
    isResult: true,
  },
  {
    id: "ceremony",
    title: "Award ceremony — offline at IGDTUW",
    shortTitle: "Award ceremony (TBA)",
    dateLabel: "Date to be announced",
    kind: "ceremony",
    targetLabel: "AWARD CEREMONY",
    summary:
      "The award ceremony is planned offline at IGDTUW. The date has not been announced in the source material.",
    details: [
      "Offline award ceremony at IGDTUW.",
      "Date is still to be announced; this dashboard does not guess it.",
      "Winners will only be reflected after an official announcement.",
    ],
    tba: true,
  },
];

export const AWARDS: Award[] = [
  {
    id: "first",
    rank: "01",
    title: "First position",
    perks: "Internship opportunity, credits, goodies",
    color: "yellow",
    icon: "trophy",
  },
  {
    id: "second",
    rank: "02",
    title: "Second position",
    perks: "Internship opportunity, credits, goodies",
    color: "lavender",
    icon: "medal",
  },
  {
    id: "third",
    rank: "03",
    title: "Third position",
    perks: "Internship opportunity, credits, goodies",
    color: "sky",
    icon: "award",
  },
  {
    id: "female-team",
    rank: "★",
    title: "Best female team",
    perks: "Goodies",
    color: "pink",
    icon: "sparkles",
  },
  {
    id: "startup-idea",
    rank: "★",
    title: "Most promising startup idea",
    perks: "Goodies",
    color: "lime",
    icon: "rocket",
  },
];

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "portal-open",
    title: "The HACKRUSH 2026 dashboard is live",
    body:
      "Explore the tracks, read the schedule, and try the registration and submission demos. This is an interactive demonstration, not an official registration platform.",
    dateLabel: "Portal demo",
    sortDate: "2026-11-08T09:00:00+05:30",
    tag: "NOTICE",
    isScheduled: false,
  },
  {
    id: "submission-window",
    title: "Idea / PPT window scheduled: 9–16 November",
    body:
      "The published timeline places idea and PPT submissions between 9 and 16 November 2026. The submission portal here is a local demo; no file is uploaded to organizers.",
    dateLabel: "9 Nov",
    sortDate: "2026-11-09T09:00:00+05:30",
    tag: "SCHEDULED",
    isScheduled: true,
  },
  {
    id: "top-80",
    title: "Top 80 teams scheduled for 18 November",
    body:
      "The Top 80 shortlist is scheduled for 18 November 2026. This dashboard does not publish or predict results, and no teams or scores are shown here.",
    dateLabel: "18 Nov",
    sortDate: "2026-11-18T12:00:00+05:30",
    tag: "SCHEDULED",
    isScheduled: true,
  },
  {
    id: "mentorship-round",
    title: "Mentorship round scheduled for 19–20 November",
    body:
      "A two-day mentorship round is planned for shortlisted teams. Mentor names and session details are not included in the verified source material.",
    dateLabel: "19 Nov",
    sortDate: "2026-11-19T09:00:00+05:30",
    tag: "SCHEDULED",
    isScheduled: true,
  },
  {
    id: "top-30",
    title: "Top 30 teams scheduled for 21 November",
    body:
      "The scheduled Top 30 checkpoint follows the mentorship round. Scheduled dates are shown as planned checkpoints, never as confirmed announcements.",
    dateLabel: "21 Nov",
    sortDate: "2026-11-21T12:00:00+05:30",
    tag: "SCHEDULED",
    isScheduled: true,
  },
  {
    id: "finale-online",
    title: "Online finale scheduled for 22 November",
    body:
      "The finale is scheduled online on 22 November 2026. The award ceremony is planned offline at IGDTUW with a date still to be announced.",
    dateLabel: "22 Nov",
    sortDate: "2026-11-22T09:00:00+05:30",
    tag: "SCHEDULED",
    isScheduled: true,
  },
  {
    id: "results",
    title: "Final results scheduled for 25 November",
    body:
      "Final results are scheduled for 25 November 2026. No winners or outcomes are fabricated on this dashboard; check official Tech4Hack channels for verified results.",
    dateLabel: "25 Nov",
    sortDate: "2026-11-25T18:00:00+05:30",
    tag: "SCHEDULED",
    isScheduled: true,
  },
];

export const formatBytes = (bytes: number): string => {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const getTrack = (id: string | null | undefined): Track | undefined =>
  TRACKS.find((track) => track.id === id);
