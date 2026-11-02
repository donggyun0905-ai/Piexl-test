// 시련의 방 (4층부터 층마다 하나, 새빨간 방): 가운데 거대한 비석 · F → "시련을 시작하겠습니까?" YES/NO
// NO: 벌칙 10가지 중 하나 (시드) · YES: 시련 4가지 중 하나 (암흑 무리 10% · 체력 1 무리 5% · 보스 셋 20% · 끝없는 몬스터 65%, sim/trialRun)
// 창에서 누른 것은 입력 menu로 와서 같은 결과 (기록·다시 돌리기)
import { createRng, deriveSeed } from "../rng";
import { addBoonMod } from "./boons";
import { equipWeapon, recalcStats } from "./items";
import { addPickup, CX } from "./loot";
import { EMPTY_HANDS } from "./shop";
import { startTrial } from "./trialRun";
import { openChest, STONE_Y } from "./trialRewards";
import type { TrialKind } from "./trialTypes";
import type { Pickup, PlayerState, RunState } from "./types";
import { addEffect } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 이 층부터 층마다 시련의 방 하나 */
  FROM_FLOOR: 4,
  /** 시련이 나올 몫 (%): 암흑 무리 · 체력 1 무리 · 보스 셋 · 끝없는 몬스터 */
  W_DARK: 10,
  W_HP1: 5,
  W_BOSS: 20,
  W_ENDLESS: 65,
  /** 거절 벌칙: 최대 체력 % · 공격력 · 공격 속도 % · 사거리 · 이동 속도 · 빼앗는 사용 아이템 수 */
  P_MAXHP: 0.2,
  P_DAMAGE: 3,
  P_ATKSPD: 0.1,
  P_RANGE: 6,
  P_MOVE: 0.3,
  P_ITEMS: 2,
};
export { R as TRIAL_RULES };

/** 입력 menu 기능 번호: 비석 대답 (a = 1 YES · 0 NO) · 보상 상자 고르기 (a = 고른 차례) */
export const TRIAL_OP = { answer: 11, chest: 12 } as const;

const roomKey = (s: RunState) => s.floor * 1000 + s.roomId;
const ensure = (p: PlayerState) => (p.trial ??= { rooms: [] });
/** 이 방 비석을 이미 썼는지 */
export const trialUsed = (s: RunState) => !!s.player.trial?.rooms.includes(roomKey(s));
/** 시련 중인지 (방이 잠김, rooms.checkCleared) */
export const trialBusy = (s: RunState) => !!s.trialRun && s.trialRun.room === s.roomId;

/** 방에 처음 들어가면 비석 하나 */
export function spawnTrial(s: RunState, roomId: number): void {
  addPickup(s, roomId, "trial", "0", CX, STONE_Y + 14, 0);
}

/** 비석·보상 상자 앞 (station.stationAt): 비석은 F로 창 열기·닫기, 상자는 F로 열기 */
export function trialAt(s: RunState, pk: Pickup, interact: boolean): void {
  if (pk.kind === "boon") return openChest(s, pk, interact);
  if (trialUsed(s) || s.trialRun) return;
  if (interact) pk.itemId = pk.itemId === "1" ? "0" : "1";
  s.prompt = { kind: "station", station: "trial", open: pk.itemId === "1" };
}

/** 창에서 누른 것 */
export function trialMenu(s: RunState, op: number, a: number): void {
  if (op === TRIAL_OP.chest) return openChest(s, null, false, a);
  if (s.map.rooms[s.roomId]?.type !== "trial" || trialUsed(s) || s.trialRun) return;
  const p = s.player;
  ensure(p).rooms.push(roomKey(s));
  const rng = createRng(deriveSeed(s.seed, "trial", s.floor, s.roomId, p.characterId));
  const stone = s.rooms[s.roomId]?.pickups.find((pk) => pk.kind === "trial");
  if (stone) stone.itemId = "0";
  addEffect(s, { kind: "trWake", x: CX, y: STONE_Y, dirX: 0, dirY: 0, size: 70, maxTicks: 60 });
  if (a === 1) {
    const roll = rng.nextFloat() * (R.W_DARK + R.W_HP1 + R.W_BOSS + R.W_ENDLESS);
    const kind: TrialKind = roll < R.W_DARK ? 1 : roll < R.W_DARK + R.W_HP1 ? 2 : roll < R.W_DARK + R.W_HP1 + R.W_BOSS ? 3 : 4;
    return startTrial(s, kind);
  }
  const n = penalty(s, rng.nextFloat());
  p.trial!.last = { penalty: n, tick: s.tick };
  addEffect(s, { kind: "trCurse", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 30, maxTicks: 40, follow: true });
}

/** 거절 벌칙 (r: 0~1 시드): 1 최대 체력 · 2 공격력 · 3 공격 속도 · 4 사거리 · 5 무기 압수 · 6 패시브 하나 · 7 사용 아이템 둘 · 8 이 층 암흑 · 9 이 층 체력 1 · 10 이동 속도. 할 수 없는 것은 빼고 고름 */
function penalty(s: RunState, r: number): number {
  const p = s.player;
  const ok = [1, 2, 3, 4, 8, 9, 10];
  if (p.weaponId !== EMPTY_HANDS && p.characterId !== "novice") ok.push(5);
  if (p.passives.length > 0) ok.push(6);
  if (p.useSlots.some((u) => u)) ok.push(7);
  ok.sort((x, y) => x - y);
  const n = ok[Math.floor(r * ok.length)] ?? 1;
  const t = ensure(p);
  if (n === 1) addBoonMod(s, { stat: "maxHp", mul: 1 - R.P_MAXHP });
  if (n === 2) addBoonMod(s, { stat: "damage", add: -R.P_DAMAGE });
  if (n === 3) addBoonMod(s, { stat: "attackSpeed", mul: 1 - R.P_ATKSPD });
  if (n === 4) addBoonMod(s, { stat: "range", add: -R.P_RANGE });
  if (n === 5) equipWeapon(s, EMPTY_HANDS);
  if (n === 6) {
    p.passives.splice(Math.floor(r * 997) % p.passives.length, 1);
    recalcStats(s);
  }
  if (n === 7) for (let i = 0, k = 0; i < p.useSlots.length && k < R.P_ITEMS; i++) if (p.useSlots[i]) [p.useSlots[i], k] = [null, k + 1];
  if (n === 8) t.dark = s.floor;
  if (n === 9) {
    t.hp1 = s.floor;
    p.hp = 1;
  }
  if (n === 10) addBoonMod(s, { stat: "moveSpeed", add: -R.P_MOVE });
  return n;
}

/** 틱마다: 거절 벌칙(이 층 암흑 · 체력 1) */
export function trialCurseTick(s: RunState): void {
  const t = s.player.trial;
  if (!t) return;
  if (t.dark === s.floor) s.player.blindTicks = Math.max(s.player.blindTicks ?? 0, 2);
  if (t.hp1 === s.floor && s.player.hp > 1) s.player.hp = 1;
}
