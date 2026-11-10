// 대장간 (2층부터 층마다 확률로 하나, 특별한 방 sim/specialRooms): 가운데 모루 옆 대장장이 앞에서 F → 창 (누른 것은 입력 menu, sim/station)
// ① 무기 강화: 성공 확률 100% → 단계마다 10%씩 낮아져 최저 20% · 실패하면 단계 -1 · 단계마다 무기 피해 +
// ② 꼬리표 변환: 가진 무기·패시브 하나를 원하는 꼬리표로 (대장간마다 처음 1번 무료, 그다음은 점점 비쌈) · 무기는 원래 꼬리표가 없고 변환하면 생김
// ③ 암흑 강화 (무기만): 50% · 성공하면 암흑 단계 +1 (일반 강화 2단계만큼) · 실패하면 무기 파괴 (맨손이 됨)
// 강화·암흑 강화·꼬리표는 그 무기에만 남음 (무기 id마다 기록: 바꿨다가 다시 들면 그대로)
import { ITEM_TAGS, type ItemTag } from "../itemsTags";
import { createRng, deriveSeed } from "../rng";
import type { StatMod } from "../stats";
import { depth } from "./hero";
import { equipWeapon, recalcStats } from "./items";
import { addPickup, CX, CY } from "./loot";
import { stationPay } from "./station";
import { EMPTY_HANDS } from "./shop";
import type { PlayerState, RunState } from "./types";
import { addEffect } from "./util";
import { setRetag } from "./retag";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 이 층부터 · 층마다 나올 확률 */
  FROM_FLOOR: 2,
  CHANCE: 0.6,
  /** 강화 값: 처음 + 단계마다 + 층마다 · 최대 단계 · 단계마다 성공 확률이 줄어드는 양 · 최저 확률 · 단계마다 무기 피해 + */
  UP_COST: 15,
  UP_PER_LV: 10,
  PER_FLOOR: 3,
  MAX_LV: 10,
  UP_STEP: 0.1,
  UP_MIN: 0.2,
  UP_DMG: 0.08,
  /** 꼬리표 변환 값 (무료를 쓴 뒤 n번째마다 n배) */
  TAG_COST: 60,
  /** 암흑 강화: 값 처음 + 단계마다 · 성공 확률 · 단계마다 무기 피해 + · 최대 단계 */
  DARK_COST: 40,
  DARK_PER_LV: 20,
  DARK_CHANCE: 0.5,
  DARK_DMG: 0.16,
  DARK_MAX: 5,
};
export { R as FORGE_RULES };

/** 입력 menu 기능 번호: 강화 · 꼬리표 변환 (a = 0 무기 / k+1 = k번째 패시브, b = 꼬리표 차례) · 암흑 강화 */
export const FORGE_OP = { up: 17, tag: 18, dark: 19 } as const;

/** 무기마다 대장간 기록 */
export interface ForgeMark {
  lv?: number;
  dark?: number;
  tag?: ItemTag;
}

export interface ForgePlayerState {
  /** 무기 id → 강화·암흑 강화·꼬리표 */
  forge?: Record<string, ForgeMark>;
  /** 꼬리표를 바꾼 패시브 ("패시브 id#같은 패시브 중 차례" → 꼬리표, sim/retag) */
  retag?: Record<string, ItemTag>;
  /** 무료 변환을 쓴 대장간 (층 × 1000 + 방) · 돈을 낸 변환 수 */
  forgeFree?: number[];
  forgePaid?: number;
}

export const forgeFloor = (floor: number) => floor >= R.FROM_FLOOR;
const roomKey = (s: RunState) => s.floor * 1000 + s.roomId;
/** 지금 무기의 기록 */
export const forgeOf = (p: PlayerState, weaponId: string = p.weaponId): ForgeMark => p.forge?.[weaponId] ?? {};

/** 처음 들어간 대장간: 가운데 모루 (대장장이는 그 옆에 그림) */
export function spawnForge(s: RunState, roomId: number): void {
  addPickup(s, roomId, "forge", "0", CX, CY - 8, 0);
}

/** 값 (화면도 씀, 못 하면 -1) · 성공 확률 */
export function forgeCost(s: RunState, op: number): number {
  const m = forgeOf(s.player);
  const floor = R.PER_FLOOR * (depth(s) - 1);
  if (op === FORGE_OP.up) return (m.lv ?? 0) >= R.MAX_LV ? -1 : R.UP_COST + R.UP_PER_LV * (m.lv ?? 0) + floor;
  if (op === FORGE_OP.dark) return (m.dark ?? 0) >= R.DARK_MAX ? -1 : R.DARK_COST + R.DARK_PER_LV * (m.dark ?? 0) + floor;
  return s.player.forgeFree?.includes(roomKey(s)) ? R.TAG_COST * ((s.player.forgePaid ?? 0) + 1) : 0;
}
export const forgeChance = (p: PlayerState, op: number): number => (op === FORGE_OP.dark ? R.DARK_CHANCE : op === FORGE_OP.up ? Math.max(R.UP_MIN, 1 - R.UP_STEP * (forgeOf(p).lv ?? 0)) : 1);

/** 강화한 무기 피해 (recalcStats → stationMods) */
export function forgeMods(p: PlayerState): StatMod[] {
  const m = forgeOf(p);
  const add = R.UP_DMG * (m.lv ?? 0) + R.DARK_DMG * (m.dark ?? 0);
  return add > 0 ? [{ stat: "damage", mul: 1 + add }] : [];
}

/** 결과 (창 연출 · 모루 위 효과): 1 성공 · 0 실패 · 3 단계 떨어짐 · 2 파괴 */
function result(s: RunState, op: number, ok: 0 | 1 | 2 | 3, id: string): void {
  const p = s.player;
  p.stLast = { op, ok, id, tick: s.tick };
  const kind = ok === 1 ? "stOk" : ok === 2 ? "stBreak" : "stFail";
  addEffect(s, { kind, x: CX, y: CY - 22, dirX: 0, dirY: 0, size: op === FORGE_OP.dark ? 26 : 20, maxTicks: ok === 2 ? 50 : 40, ...(op === FORGE_OP.dark ? { tint: "#b45cff" } : {}) });
}

/** 창에서 누름 (지금 방이 대장간일 때만) */
export function forgeMenu(s: RunState, op: number, a: number, b: number): void {
  if (s.map.rooms[s.roomId]?.type !== "forge") return;
  const p = s.player;
  const cost = forgeCost(s, op);
  if (cost < 0) return;
  const tag = ITEM_TAGS[b];
  if (op === FORGE_OP.tag && (!tag || (a > 0 && !p.passives[a - 1]))) return;
  if (cost > 0 && !stationPay(s, "forge", op, cost)) return;
  const w = p.weaponId;
  const m = ((p.forge ??= {})[w] ??= {});
  const n = (p.stN = (p.stN ?? 0) + 1);
  const roll = createRng(deriveSeed(s.seed, "forge", n)).nextFloat();
  if (op === FORGE_OP.up) {
    const ok = roll < forgeChance(p, op);
    const lv = m.lv ?? 0;
    m.lv = ok ? lv + 1 : Math.max(0, lv - 1);
    result(s, op, ok ? 1 : lv > 0 ? 3 : 0, w);
  } else if (op === FORGE_OP.dark) {
    if (roll < R.DARK_CHANCE) {
      m.dark = (m.dark ?? 0) + 1;
      result(s, op, 1, w);
    } else {
      // 파괴: 그 무기 기록을 지우고 맨손 (휴지통에 버린 것과 같음)
      delete p.forge[w];
      // 레이드: 대장간 처음부터 다시 하면 이 무기를 돌려받게 기억 (sim/raidPrep)
      if (s.raidBoss) p.raidLostWeapon ??= w;
      equipWeapon(s, EMPTY_HANDS);
      result(s, op, 2, w);
    }
  } else {
    if (cost === 0) (p.forgeFree ??= []).push(roomKey(s));
    else p.forgePaid = (p.forgePaid ?? 0) + 1;
    if (a === 0) m.tag = tag;
    else setRetag(p, a - 1, tag!);
    result(s, op, 1, a === 0 ? w : p.passives[a - 1]!);
  }
  if (!Object.keys(m).length) delete p.forge[w];
  recalcStats(s);
}
