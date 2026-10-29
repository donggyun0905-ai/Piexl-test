// 로비 전시장 전시물 (이 기기에 저장): 영혼 조각(바스러져가는 왕관을 얻으면) · 월계선(순례자의 월계선을 얻으면). 전시장 그림은 lobby/hallArt
// 기록(전시장 가운데 기록집에서 봄): 악의 사도가 먹은 영혼 누적 → 10,000이면 히든 캐릭터 '몰락한 왕' · 차원의 순례자를 만난 횟수 → 10번이면 '차원의 순례자'
// 연습장에서 얻거나 모은 것은 등록하지 않음
import type { CharacterId } from "@pixel-rogue/shared";
import { loadText, saveText } from "../storage";

export type ExhibitId = "soulShard" | "laurelShip";

export interface Exhibit {
  /** 모은 수 (영혼 조각은 왕관을 얻을 때마다 +1) · 처음 놓인 날 */
  count: number;
  date: string;
}

/** 누적 기록: 악의 사도가 먹은 영혼 · 순례자를 만난 횟수 */
export interface HallRecords {
  souls: number;
  pilgrims: number;
}

/** 기록마다 채우면 열리는 히든 캐릭터 (전시물 · 기록 · 목표) */
export const HALL_GOALS: readonly { ex: ExhibitId; rec: keyof HallRecords; need: number; char?: CharacterId }[] = [
  { ex: "soulShard", rec: "souls", need: 10000, char: "fallenKing" },
  { ex: "laurelShip", rec: "pilgrims", need: 10, char: "pilgrim" },
];

const KEY = "exhibits";
const REC = "hallRecords";

function read<T>(key: string): Partial<T> {
  try {
    return JSON.parse(loadText(key) ?? "{}") as Partial<T>;
  } catch {
    return {};
  }
}

export const loadExhibits = (): Partial<Record<ExhibitId, Exhibit>> => read<Record<ExhibitId, Exhibit>>(KEY);

export function loadRecords(): HallRecords {
  const r = read<HallRecords>(REC);
  return { souls: r.souls ?? 0, pilgrims: r.pilgrims ?? 0 };
}

/** 기록을 채워 열린 히든 캐릭터 (캐릭터 고르기 목록에 보임) */
export function hallUnlocked(): CharacterId[] {
  const r = loadRecords();
  return HALL_GOALS.flatMap((g) => (g.char && r[g.rec] >= g.need ? [g.char] : []));
}

function add(id: ExhibitId): void {
  const all = loadExhibits();
  const old = all[id];
  all[id] = { count: (old?.count ?? 0) + 1, date: old?.date ?? new Date().toISOString().slice(0, 10) };
  saveText(KEY, JSON.stringify(all));
}

/** 판마다 이미 등록한 아이템 · 이미 더한 기록 */
const seenOf = new WeakMap<object, Set<string>>();
const countedOf = new WeakMap<object, HallRecords>();

/** 판 진행 중 가진 사용 아이템이 바뀔 때 (gameLoop): 이번 판에 새로 얻은 전시 아이템을 등록 */
export function noteExhibits(run: object, useSlots: readonly (string | null)[], practice: boolean): void {
  if (practice) return;
  let seen = seenOf.get(run);
  if (!seen) seenOf.set(run, (seen = new Set()));
  for (const [item, id] of [["crumblingCrown", "soulShard"], ["laurelShip", "laurelShip"]] as const) {
    if (!useSlots.includes(item) || seen.has(item)) continue;
    seen.add(item);
    add(id);
  }
}

/** 틱마다 (gameLoop): 이번 판 영혼·순례자 수가 늘면 그만큼 누적 기록에 더함 (값이 바뀔 때만 저장) */
export function noteRecords(run: object, now: HallRecords, practice: boolean): void {
  if (practice) return;
  const done = countedOf.get(run) ?? { souls: 0, pilgrims: 0 };
  countedOf.set(run, done);
  const ds = now.souls - done.souls;
  const dp = now.pilgrims - done.pilgrims;
  if (ds <= 0 && dp <= 0) return;
  const r = loadRecords();
  if (ds > 0) r.souls += ds;
  if (dp > 0) r.pilgrims += dp;
  done.souls = Math.max(done.souls, now.souls);
  done.pilgrims = Math.max(done.pilgrims, now.pilgrims);
  saveText(REC, JSON.stringify(r));
}
