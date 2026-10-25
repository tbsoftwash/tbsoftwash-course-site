export type ProgressKey = string;

export function lessonKey(opts: {
  track: "core" | "springboard";
  module?: number;
  week?: string;
  slug: string;
}) {
  if (opts.track === "core") return `core:${opts.module}:${opts.slug}`;
  return `springboard:${opts.week}:${opts.slug}`;
}

export const STORAGE_KEY = "tbsa.completedLessons.v1";
export const STORAGE_LAST = "tbsa.lastLesson.v1";
export const STORAGE_ACTIVITY = "tbsa.activityDays.v1";
export const STORAGE_BOOKMARKS = "tbsa.bookmarks.v1";
export const STORAGE_NOTES = "tbsa.notes.v1";
export const STORAGE_QUIZ_SCORES = "tbsa.quizScores.v1";
export const STORAGE_RIG_LOADOUT = "tbsa.rigLoadout.v1";
export const STORAGE_CERTIFICATES = "tbsa.certificates.v1";
export const STORAGE_EMAIL = "tbsa.memberEmail.v1";

export interface CertificateRecord {
  code: string;
  milestoneId: string;
  milestoneTitle: string;
  recipientName: string;
  email: string;
  issuedAt: string;
  issuer: string;
}

export interface CloudProfile {
  completedLessons?: string[];
  lastLesson?: string | null;
  activityDays?: Record<string, number>;
  bookmarks?: string[];
  notes?: Record<string, string>;
  quizScores?: Record<string, number>;
  rigLoadout?: string[];
  certificates?: Record<string, CertificateRecord>;
  preferences?: Record<string, string>;
  lastActiveAt?: string;
  lastLoginAt?: string;
}

export interface RosterEntry {
  email: string;
  completedCount: number;
  activeDays: number;
  bookmarksCount: number;
  notesCount: number;
  quizzesPassed?: number;
  certsIssued?: number;
  lastLesson: string | null;
  lastActiveAt: string | null;
  lastLoginAt: string | null;
}

export function loadCompleted(): Set<ProgressKey> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.map(String));
  } catch {
    return new Set();
  }
}

export function saveCompleted(keys: Set<ProgressKey>, syncMode: "merge" | "set" | false = "set") {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(keys)));
    if (syncMode) {
      void syncProgressToCloud(syncMode);
    }
  } catch {
    // ignore
  }
}

export function setLastLesson(key: ProgressKey) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_LAST, key);
  } catch {
    // ignore
  }
}

export function getLastLesson(): ProgressKey | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_LAST);
  } catch {
    return null;
  }
}

export function loadActivityDays(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_ACTIVITY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function loadBookmarks(): Set<ProgressKey> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_BOOKMARKS);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr.map(String)) : new Set();
  } catch {
    return new Set();
  }
}

export function saveBookmarks(keys: Set<ProgressKey>, sync = true) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_BOOKMARKS, JSON.stringify(Array.from(keys)));
    window.dispatchEvent(new CustomEvent("tbsa:progress"));
    if (sync) {
      void syncProgressToCloud("set");
    }
  } catch {
    // ignore
  }
}

export function loadNotes(): Record<ProgressKey, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_NOTES);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function saveLessonNote(key: ProgressKey, noteText: string, sync = true) {
  if (typeof window === "undefined") return;
  try {
    const notes = loadNotes();
    const trimmed = noteText.trim();
    if (!trimmed) {
      delete notes[key];
    } else {
      notes[key] = trimmed;
    }
    window.localStorage.setItem(STORAGE_NOTES, JSON.stringify(notes));
    window.dispatchEvent(new CustomEvent("tbsa:progress"));
    if (sync) {
      void syncProgressToCloud("set");
    }
  } catch {
    // ignore
  }
}

export function loadQuizScores(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_QUIZ_SCORES);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function saveQuizScore(quizId: string, scorePct: number, sync = true) {
  if (typeof window === "undefined") return;
  try {
    const scores = loadQuizScores();
    scores[quizId] = Math.max(Number(scores[quizId] ?? 0), Math.round(scorePct));
    window.localStorage.setItem(STORAGE_QUIZ_SCORES, JSON.stringify(scores));
    window.dispatchEvent(new CustomEvent("tbsa:progress"));
    if (sync) {
      void syncProgressToCloud("merge");
    }
  } catch {
    // ignore
  }
}

export function loadRigLoadout(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_RIG_LOADOUT);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr.map(String)) : new Set();
  } catch {
    return new Set();
  }
}

export function saveRigLoadout(keys: Set<string>, sync = true) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_RIG_LOADOUT, JSON.stringify(Array.from(keys)));
    window.dispatchEvent(new CustomEvent("tbsa:progress"));
    if (sync) {
      void syncProgressToCloud("set");
    }
  } catch {
    // ignore
  }
}

export function loadCertificates(): Record<string, CertificateRecord> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_CERTIFICATES);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function saveCertificateLocal(cert: CertificateRecord) {
  if (typeof window === "undefined") return;
  try {
    const certs = loadCertificates();
    certs[cert.milestoneId] = cert;
    window.localStorage.setItem(STORAGE_CERTIFICATES, JSON.stringify(certs));
    window.dispatchEvent(new CustomEvent("tbsa:progress"));
  } catch {
    // ignore
  }
}

export function clearProgress() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(STORAGE_LAST);
    window.localStorage.removeItem(STORAGE_ACTIVITY);
    void syncProgressToCloud("reset");
  } catch {
    // ignore
  }
}

export function applyCloudProfileToLocal(profile: CloudProfile | null | undefined, mode: "merge" | "replace" = "merge") {
  if (typeof window === "undefined" || !profile) return;
  try {
    const localCompleted = mode === "replace" ? new Set<string>() : loadCompleted();
    for (const k of profile.completedLessons ?? []) {
      localCompleted.add(String(k));
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(localCompleted)));

    if (profile.lastLesson && (mode === "replace" || !getLastLesson())) {
      window.localStorage.setItem(STORAGE_LAST, String(profile.lastLesson));
    }

    const localDays = mode === "replace" ? {} : loadActivityDays();
    for (const [day, cnt] of Object.entries(profile.activityDays ?? {})) {
      localDays[day] = Math.max(Number(localDays[day] ?? 0), Number(cnt ?? 0));
    }
    window.localStorage.setItem(STORAGE_ACTIVITY, JSON.stringify(localDays));

    const localBookmarks = mode === "replace" ? new Set<string>() : loadBookmarks();
    for (const b of profile.bookmarks ?? []) {
      localBookmarks.add(String(b));
    }
    window.localStorage.setItem(STORAGE_BOOKMARKS, JSON.stringify(Array.from(localBookmarks)));

    const localNotes = mode === "replace" ? {} : loadNotes();
    for (const [nk, nv] of Object.entries(profile.notes ?? {})) {
      if (nv && (!localNotes[nk] || mode === "replace")) {
        localNotes[nk] = String(nv);
      }
    }
    window.localStorage.setItem(STORAGE_NOTES, JSON.stringify(localNotes));

    const localQuizzes = mode === "replace" ? {} : loadQuizScores();
    for (const [qk, qv] of Object.entries(profile.quizScores ?? {})) {
      localQuizzes[qk] = Math.max(Number(localQuizzes[qk] ?? 0), Number(qv ?? 0));
    }
    window.localStorage.setItem(STORAGE_QUIZ_SCORES, JSON.stringify(localQuizzes));

    const localRig = mode === "replace" ? new Set<string>() : loadRigLoadout();
    for (const rk of profile.rigLoadout ?? []) {
      localRig.add(String(rk));
    }
    window.localStorage.setItem(STORAGE_RIG_LOADOUT, JSON.stringify(Array.from(localRig)));

    if (profile.certificates && typeof profile.certificates === "object") {
      const localCerts = mode === "replace" ? {} : loadCertificates();
      for (const [cid, crec] of Object.entries(profile.certificates)) {
        if (crec && crec.code) {
          localCerts[cid] = crec;
        }
      }
      window.localStorage.setItem(STORAGE_CERTIFICATES, JSON.stringify(localCerts));
    }

    window.dispatchEvent(new CustomEvent("tbsa:progress"));
  } catch {
    // ignore
  }
}

export async function syncProgressToCloud(mode: "merge" | "set" | "reset" = "merge"): Promise<{
  authenticated: boolean;
  email?: string;
  isAdmin?: boolean;
  profile?: CloudProfile | null;
  roster?: RosterEntry[] | null;
}> {
  if (typeof window === "undefined") return { authenticated: false };
  try {
    const completedLessons = Array.from(loadCompleted());
    const lastLesson = getLastLesson();
    const activityDays = loadActivityDays();
    const bookmarks = Array.from(loadBookmarks());
    const notes = loadNotes();
    const quizScores = loadQuizScores();
    const rigLoadout = Array.from(loadRigLoadout());
    const preferences: Record<string, string> = {};
    for (const pk of ["theme", "tbsa.diagramStyle.v1", "tbsa.previewMode.v1", "tbsa.themePreset.v1"]) {
      const val = window.localStorage.getItem(pk);
      if (val) preferences[pk] = val;
    }

    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode,
        completedLessons,
        lastLesson,
        activityDays,
        bookmarks,
        notes,
        quizScores,
        rigLoadout,
        preferences,
      }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        window.localStorage.removeItem(STORAGE_EMAIL);
      }
      return { authenticated: false };
    }

    const json = await res.json();
    if (json?.authenticated && json?.email) {
      window.localStorage.setItem(STORAGE_EMAIL, String(json.email));
      if (json.profile && mode === "merge") {
        applyCloudProfileToLocal(json.profile, "merge");
      }
    }
    return {
      authenticated: Boolean(json?.authenticated),
      email: json?.email,
      isAdmin: Boolean(json?.isAdmin),
      profile: json?.profile ?? null,
      roster: json?.roster ?? null,
    };
  } catch {
    return { authenticated: false };
  }
}
