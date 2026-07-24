export type Category = "workflow" | "ids" | "wam" | "payment" | "all";

export interface QuizAttempt {
  id: string;
  date: string;          // ISO string
  category: Category;
  score: number;
  total: number;
  pct: number;
  categoryBreakdown: Record<string, { correct: number; total: number }>;
}

const KEY = "ifms_quiz_progress";

export function loadAttempts(): QuizAttempt[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as QuizAttempt[]) : [];
  } catch {
    return [];
  }
}

export function saveAttempt(attempt: Omit<QuizAttempt, "id" | "date">): QuizAttempt {
  const attempts = loadAttempts();
  const full: QuizAttempt = {
    ...attempt,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date: new Date().toISOString(),
  };
  attempts.push(full);
  localStorage.setItem(KEY, JSON.stringify(attempts));
  return full;
}

export function clearAttempts(): void {
  localStorage.removeItem(KEY);
}

const NAME_KEY = "ifms_staff_name";
const DEPT_KEY = "ifms_staff_dept";

export function loadName(): string {
  return localStorage.getItem(NAME_KEY) ?? "";
}

export function saveName(name: string): void {
  localStorage.setItem(NAME_KEY, name.trim());
}

export function loadDept(): string {
  return localStorage.getItem(DEPT_KEY) ?? "";
}

export function saveDept(dept: string): void {
  localStorage.setItem(DEPT_KEY, dept.trim());
}

// ── Supervisor Roster ────────────────────────────────────────────
export interface RosterEntry {
  id: string;
  addedAt: string;
  name: string;
  dept: string;
  latestPct: number;
  bestPct: number;
  totalAttempts: number;
  date: string;
  catBest: Record<string, number>;
}

const ROSTER_KEY = "ifms_supervisor_roster";

export function loadRoster(): RosterEntry[] {
  try {
    const raw = localStorage.getItem(ROSTER_KEY);
    return raw ? (JSON.parse(raw) as RosterEntry[]) : [];
  } catch { return []; }
}

export function addToRoster(entry: Omit<RosterEntry, "id" | "addedAt">): RosterEntry {
  const roster = loadRoster();
  const full: RosterEntry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    addedAt: new Date().toISOString(),
  };
  roster.push(full);
  localStorage.setItem(ROSTER_KEY, JSON.stringify(roster));
  return full;
}

export function removeFromRoster(id: string): void {
  const roster = loadRoster().filter(e => e.id !== id);
  localStorage.setItem(ROSTER_KEY, JSON.stringify(roster));
}

export function clearRoster(): void {
  localStorage.removeItem(ROSTER_KEY);
}

// ── Share Link Encoding ──────────────────────────────────────────
export interface SharePayload {
  n: string;
  d: string;
  s: number;
  b: number;
  a: number;
  t: string;
  c: Record<string, number>;
}

export function encodeSharePayload(p: SharePayload): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(p))));
}

export function decodeSharePayload(encoded: string): SharePayload | null {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(encoded)))) as SharePayload;
  } catch { return null; }
}

export function getStats(attempts: QuizAttempt[]) {
  if (!attempts.length) return null;
  const all = attempts.filter(a => a.category === "all");
  const byCategory: Record<string, QuizAttempt[]> = {};
  for (const a of attempts) {
    if (!byCategory[a.category]) byCategory[a.category] = [];
    byCategory[a.category].push(a);
  }
  const recent = [...attempts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const bestAll = all.length ? Math.max(...all.map(a => a.pct)) : null;
  const latestAll = all.length ? all[all.length - 1] : null;
  const prevAll   = all.length > 1 ? all[all.length - 2] : null;
  const trend = latestAll && prevAll ? latestAll.pct - prevAll.pct : null;
  return { all, byCategory, recent, bestAll, latestAll, prevAll, trend, totalAttempts: attempts.length };
}
