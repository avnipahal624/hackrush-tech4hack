export const STORAGE_KEYS = {
  registration: "hackrush.demo.registration.v1",
  registrationDraft: "hackrush.demo.registration-draft.v1",
  submission: "hackrush.demo.submission.v1",
  readAnnouncements: "hackrush.demo.read-announcements.v1",
  sound: "hackrush.demo.sound.v1",
} as const;

export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable in private modes; the demo still works.
  }
}

export function removeStored(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore unavailable storage.
  }
}

export function createDemoId(prefix: string): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const random = new Uint8Array(4);
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    crypto.getRandomValues(random);
  } else {
    for (let i = 0; i < random.length; i += 1) {
      random[i] = Math.floor(Math.random() * 256);
    }
  }
  const suffix = Array.from(random, (value) => alphabet[value % alphabet.length])
    .join("");
  return `${prefix}-${suffix}`;
}

export function downloadTextFile(filename: string, contents: string): void {
  const blob = new Blob([contents], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
