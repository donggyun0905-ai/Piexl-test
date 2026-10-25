// 일일 미션: 하루(한국 시간) 3개, 판이 끝날 때마다 진행. 다 하면 쿠폰, 3개 모두 하면 덤
import { createRng, dayKey, hashString, type RunState } from "@pixel-rogue/shared";
import { loadText, saveText } from "../storage";
import { addMissionCoupons } from "./wallet";

export type MissionKind = "kills" | "boss" | "floor" | "gold" | "daily" | "td" | "runs";
export interface MissionDef {
  kind: MissionKind;
  goal: number;
}
const POOL: readonly MissionDef[] = [
  { kind: "kills", goal: 60 },
  { kind: "boss", goal: 1 },
  { kind: "floor", goal: 3 },
  { kind: "gold", goal: 150 },
  { kind: "daily", goal: 1 },
  { kind: "td", goal: 5 },
  { kind: "runs", goal: 3 },
];
/** 미션 하나 · 3개 모두 했을 때 덤 */
export const MISSION_COUPONS = 2;
export const MISSION_BONUS = 2;
const COUNT = 3;

interface Progress {
  day: string;
  value: Partial<Record<MissionKind, number>>;
  claimed: MissionKind[];
  bonus: boolean;
}

const today = () => dayKey(Date.now());

/** 오늘의 미션 3개 (날짜로 정해져 모두 같음) */
export function todayMissions(): MissionDef[] {
  const rng = createRng(hashString(`missions/${today()}`));
  const pool = [...POOL];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [pool[i], pool[j]] = [pool[j]!, pool[i]!];
  }
  return pool.slice(0, COUNT);
}

export function loadProgress(): Progress {
  try {
    const p = JSON.parse(loadText("missions") ?? "{}") as Progress;
    if (p.day === today()) return p;
  } catch {
    // 처음이면 아래에서 새로
  }
  return { day: today(), value: {}, claimed: [], bonus: false };
}

function bump(kind: MissionKind, n: number, max = false): void {
  const p = loadProgress();
  p.value[kind] = max ? Math.max(p.value[kind] ?? 0, n) : (p.value[kind] ?? 0) + n;
  saveText("missions", JSON.stringify(p));
}

/** 판이 끝났을 때 (연습장 제외) */
export function recordRun(run: RunState): void {
  bump("kills", run.kills);
  bump("boss", run.bossKills);
  bump("floor", run.floor, true);
  bump("gold", run.goldEarned);
  bump("runs", 1);
  if (run.sudden) bump("daily", 1);
}

/** 타워 디펜스가 끝났을 때 (넘긴 라운드) */
export function recordTd(round: number): void {
  bump("td", round, true);
  bump("runs", 1);
}

/** 다 한 미션 보상 받기 (3개 모두면 덤까지). 받은 쿠폰 수 */
export function claim(kind: MissionKind): number {
  const p = loadProgress();
  const m = todayMissions().find((x) => x.kind === kind);
  if (!m || p.claimed.includes(kind) || (p.value[kind] ?? 0) < m.goal) return 0;
  p.claimed.push(kind);
  let got = MISSION_COUPONS;
  if (!p.bonus && p.claimed.length >= COUNT) {
    p.bonus = true;
    got += MISSION_BONUS;
  }
  saveText("missions", JSON.stringify(p));
  addMissionCoupons(got);
  return got;
}
