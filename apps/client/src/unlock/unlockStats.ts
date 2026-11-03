// 캐릭터 해금 기록 (이 기기에 저장): 여러 모드에 걸친 누적 횟수 · 가장 높았던 값 · 한 번이라도 한 것 · 모은 것
// 던전 판은 unlock/runStats가, 다른 모드는 각 기록 파일(패왕전·광야의 새벽·타워 디펜스)이 채움. 조건 표는 characterGoals
import { loadText, saveText } from "../storage";

/** 누적 횟수 */
export type CountKey = "skelarcher" | "venom" | "bombs" | "rests" | "altars" | "eliteRooms" | "traps" | "duelStreak" | "duelBest";
/** 가장 높았던 값 */
export type MaxKey = "defense" | "maxHp" | "attackSpeed" | "moveSpeed" | "endlessFloor";
/** 한 번이라도 한 것 */
export type FlagKey = "trial1000" | "heroClear" | "heroDoctor" | "heroApostle" | "dragonClear" | "arenaClear" | "swarmClear" | "tdFive" | "cupid" | "clear7" | "noShopClear";

export interface UnlockStats {
  count: Partial<Record<CountKey, number>>;
  max: Partial<Record<MaxKey, number>>;
  flag: Partial<Record<FlagKey, true>>;
  /** 먹어 본 악마의 방 패시브 · 로비 돈으로 연 캐릭터 */
  devil: string[];
  bought: string[];
}

const KEY = "unlockStats";
let cache: UnlockStats | null = null;

export function unlockStats(): UnlockStats {
  if (cache) return cache;
  try {
    const v = JSON.parse(loadText(KEY) ?? "{}") as Partial<UnlockStats>;
    cache = { count: v.count ?? {}, max: v.max ?? {}, flag: v.flag ?? {}, devil: v.devil ?? [], bought: v.bought ?? [] };
  } catch {
    cache = { count: {}, max: {}, flag: {}, devil: [], bought: [] };
  }
  return cache;
}

let dirty = false;
/** 바뀐 값은 한 번에 저장 (매 프레임 저장하지 않게) */
export function flushUnlockStats(): void {
  if (!dirty || !cache) return;
  dirty = false;
  saveText(KEY, JSON.stringify(cache));
}
const touch = () => {
  dirty = true;
};

export function bump(key: CountKey, n = 1): void {
  if (n <= 0) return;
  const c = unlockStats().count;
  c[key] = (c[key] ?? 0) + n;
  touch();
}
export function setCount(key: CountKey, n: number): void {
  unlockStats().count[key] = n;
  touch();
}
export function raise(key: MaxKey, v: number): void {
  const m = unlockStats().max;
  if (v > (m[key] ?? 0)) {
    m[key] = Math.round(v * 100) / 100;
    touch();
  }
}
export function mark(key: FlagKey): void {
  const f = unlockStats().flag;
  if (f[key]) return;
  f[key] = true;
  touch();
}
export function addDevil(id: string): void {
  const d = unlockStats().devil;
  if (d.includes(id)) return;
  d.push(id);
  touch();
}
export function addBought(id: string): void {
  unlockStats().bought.push(id);
  touch();
  flushUnlockStats();
}
