// 추적자 튜닝소 (라스트 보스 층 상점 대신, sim/station): 저격총 부위마다 부품을 갈아 끼우거나 골드로 강화
// 강화는 단계가 오를수록 성공 확률이 떨어지고(100 · 75 · 50 · 25 · 그 뒤 10%), 실패하면 한 단계 내려감 (0 아래로는 안 내려감)
// 부품 효과는 편의성만 (trackerParts). 능력치는 stationMods, 스킬 수치는 tracker가 tuneVal로 읽음
import { createRng, deriveSeed } from "../rng";
import type { StatMod } from "../stats";
import { TUNE, TUNE_MUL_KEYS, TUNE_SLOTS, type TunePartFx } from "../trackerParts";
import { recalcStats } from "./items";
import { depth } from "./hero";
import type { PlayerState, RunState } from "./types";
import { addEffect } from "./util";
import { stationPay } from "./station";

type FxKey = keyof TunePartFx;

const partOf = (p: PlayerState, slot: number) => p.trParts?.[slot] ?? 0;
const lvOf = (p: PlayerState, slot: number) => p.trLv?.[slot] ?? 0;

/** 끼운 부품 효과를 모두 합친 값 (배율은 곱, 나머지는 합). 추적자가 아니면 배율 1·합 0 */
export function tuneVal(p: PlayerState, key: FxKey): number {
  const mul = TUNE_MUL_KEYS.includes(key);
  let v = mul ? 1 : 0;
  if (p.characterId !== "tracker" || !p.trParts) return v;
  TUNE_SLOTS.forEach((slot, i) => {
    const base = slot.parts[partOf(p, i)]?.fx[key];
    if (base === undefined) return;
    const grow = 1 + TUNE.lvStep * lvOf(p, i);
    if (mul) v *= 1 + (base - 1) * grow;
    else v += base * grow;
  });
  return v;
}

/** 능력치로 바뀌는 부품 효과 (recalcStats) */
export function tuneMods(p: PlayerState): StatMod[] {
  if (p.characterId !== "tracker" || !p.trParts) return [];
  return [
    { stat: "range", mul: tuneVal(p, "range") },
    { stat: "moveSpeed", mul: tuneVal(p, "move") },
    { stat: "projectileSpeed", mul: tuneVal(p, "proj") },
    { stat: "maxHp", add: tuneVal(p, "hp") },
    { stat: "luck", add: tuneVal(p, "luck") },
  ];
}

/** 다음 강화 성공 확률 */
export const tuneChance = (lv: number) => TUNE.chances[Math.min(lv, TUNE.chances.length - 1)]!;

/** 값 (골드): 갈아 끼우기 · 그 부위 강화 */
export function tuneCost(s: RunState, up: boolean, slot: number): number {
  const floor = TUNE.perFloor * (depth(s) - 1);
  return up ? TUNE.upCost + TUNE.upCostStep * lvOf(s.player, slot) + floor : TUNE.swapCost + floor;
}

function result(s: RunState, op: number, ok: 0 | 1 | 2 | 3, slot: number): void {
  const p = s.player;
  p.stLast = { op, ok, slot, tick: s.tick };
  addEffect(s, { kind: ok === 1 ? "stOk" : "stFail", x: p.x, y: p.y - 10, dirX: 0, dirY: 0, size: 18, maxTicks: 40, width: 1 });
}

/** 부위 slot에 부품 part를 끼움 (이미 끼운 것이면 그대로). 강화 단계는 부위에 남음 */
export function tuneSwap(s: RunState, op: number, slot: number, part: number): void {
  const p = s.player;
  const def = TUNE_SLOTS[slot];
  if (!def || !def.parts[part] || partOf(p, slot) === part || !stationPay(s, "tune", op, tuneCost(s, false, slot))) return;
  p.trParts ??= TUNE_SLOTS.map(() => 0);
  p.trParts[slot] = part;
  result(s, op, 1, slot);
  recalcStats(s);
}

/** 부위 slot 강화: 성공하면 +1, 실패하면 -1 (0이면 그대로) */
export function tuneUp(s: RunState, op: number, slot: number): void {
  const p = s.player;
  const lv = lvOf(p, slot);
  if (!TUNE_SLOTS[slot] || lv >= TUNE.maxLv || !stationPay(s, "tune", op, tuneCost(s, true, slot))) return;
  p.trParts ??= TUNE_SLOTS.map(() => 0);
  p.trLv ??= TUNE_SLOTS.map(() => 0);
  const n = (p.stN = (p.stN ?? 0) + 1);
  const ok = createRng(deriveSeed(s.seed, "trTune", n)).nextFloat() < tuneChance(lv);
  p.trLv[slot] = ok ? lv + 1 : Math.max(0, lv - 1);
  result(s, op, ok ? 1 : lv > 0 ? 3 : 0, slot);
  recalcStats(s);
}
