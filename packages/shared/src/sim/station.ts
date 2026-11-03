// 상점 대신 나오는 작업대: 아티팩터는 모든 상점이 거대한 제작대(sim/afBench) · 추적자는 라스트 보스 층 상점이 튜닝소(sim/trTune)
// 작업대 앞에서 F = 창 열기·닫기. 창에서 누른 것은 입력 menu (기능 × 4096 + a × 64 + b)로 와서 같은 결과가 나옴 (기록·협동)
import { ROUTE_OP, routeMenu } from "./routeGo";
import type { StatMod } from "../stats";
import { BENCH_OP, benchMods, benchUse } from "./afBench";
import { lastFloorOf } from "./hero";
import { addPickup, CX, CY } from "./loot";
import { tuneMods, tuneSwap, tuneUp } from "./trTune";
import { hiddenMods } from "./hiddenPerks";
import { hiddenPick } from "./hiddenDice";
import { GYM_OP, gymMenu, gymMods } from "./gym";
import { boonMods } from "./boons";
import { TRIAL_OP, trialAt, trialMenu } from "./trial";
import { ALTAR_OP, altarMenu, altarPending } from "./altar";
import { devilAt } from "./devil";
import { GAMBLE_OP, gambleAt, gambleMenu } from "./gamble";
import { AUCTION_OP, auctionAt, auctionMenu } from "./auction";
import type { StationKind } from "./stationTypes";
import type { Pickup, RunState } from "./types";

/** 튜닝소 기능 번호 (제작대 BENCH_OP 다음) */
export const TUNE_OP = { swap: 5, up: 6 } as const;

/** menu 입력 값 만들기 (화면) */
export const menuCode = (op: number, a: number, b = 0) => op * 4096 + (a & 63) * 64 + (b & 63);

/** 이 상점 자리에 작업대가 나오는지 */
export function stationFor(s: RunState): StationKind | null {
  const c = s.player.characterId;
  if (c === "artifacter") return "bench";
  if (c === "tracker" && s.floor === lastFloorOf(s) && !s.endless) return "tune";
  return null;
}

/** 상점 대신 작업대 하나 (방 가운데). 놓았으면 true (spawnShop) */
export function spawnStation(s: RunState, roomId: number): boolean {
  const kind = stationFor(s);
  if (!kind) return false;
  addPickup(s, roomId, kind, "0", CX, CY - 6, 0, 0);
  return true;
}

export const isStation = (pk: Pickup) => pk.kind === "bench" || pk.kind === "tune" || pk.kind === "gym" || pk.kind === "trial" || pk.kind === "boon" || pk.kind === "altar" || pk.kind === "devil" || pk.kind === "gambler" || pk.kind === "auction";
/** 큰 물건(비석·제단)은 조금 멀리서도 닿음 (items.updateItems) */
export const bigReach = (pk: Pickup) => (pk.kind === "trial" || pk.kind === "altar" || pk.kind === "gambler" || pk.kind === "auction" ? 24 : 0);

/** 작업대 앞: F = 창 열기·닫기 (itemId "1" = 열림) */
export function stationAt(s: RunState, pk: Pickup, interact: boolean): void {
  if (s.prompt.kind !== "none" || !isStation(pk)) return;
  if (pk.kind === "trial" || pk.kind === "boon") return trialAt(s, pk, interact);
  if (pk.kind === "altar" && !altarPending(s)) return;
  // 비밀의 방 (sim/devil·gamble·auction)
  if (pk.kind === "devil") return devilAt(s, pk, interact);
  if (pk.kind === "gambler") return gambleAt(s, pk, interact);
  if (pk.kind === "auction") return auctionAt(s, pk, interact);
  if (interact) pk.itemId = pk.itemId === "1" ? "0" : "1";
  s.prompt = { kind: "station", station: pk.kind as StationKind, open: pk.itemId === "1", ...(pk.kind === "gym" ? { device: pk.group } : {}) };
}

/** 창에서 누른 것 (지금 방에 내 작업대가 있을 때만) */
export function stationMenu(s: RunState, code: number): void {
  const op = Math.floor(code / 4096);
  const a = Math.floor(code / 64) % 64;
  const b = code % 64;
  // 히든 아이템 고르는 창 (저주받은 주사위 · 테라포밍)
  if (op === 7 || op === 8) return hiddenPick(s, op, a);
  // 단련의 방 (sim/gym): 미니게임 결과 · 강화
  if (op === GYM_OP.result || op === GYM_OP.up) return gymMenu(s, op, a, b);
  // 시련의 방 (sim/trial): 비석 대답 · 보상 상자 고르기
  if (op === TRIAL_OP.answer || op === TRIAL_OP.chest) return trialMenu(s, op, a);
  // 제단의 방 (sim/altar): 카드 고르기
  if (op === ALTAR_OP) return altarMenu(s, a);
  // 미리 정한 길로 가기 (sim/routeGo)
  if (op === ROUTE_OP) return routeMenu(s, a);
  // 비밀의 방: 야바위 · 경매
  if (op === GAMBLE_OP) return gambleMenu(s, a);
  if (op === AUCTION_OP) return auctionMenu(s, a);
  const kind = stationFor(s);
  const here = s.rooms[s.roomId]?.pickups.some((pk) => pk.kind === kind && (pk.owner === undefined || pk.owner === (s.seat ?? 0)));
  if (!kind || !here) return;
  if (kind === "bench" && op >= BENCH_OP.up && op <= BENCH_OP.fuse) benchUse(s, op, a, b);
  if (kind === "tune" && op === TUNE_OP.swap) tuneSwap(s, op, a, b);
  if (kind === "tune" && op === TUNE_OP.up) tuneUp(s, op, a);
}

/** 작업대·히든 아이템이 바꾼 능력치 (recalcStats) */
export const stationMods = (s: RunState): StatMod[] => [...benchMods(s.player), ...tuneMods(s.player), ...hiddenMods(s), ...gymMods(s.player), ...boonMods(s.player)];

/** 작업대에 돈 내기: 상점 구매 기록에도 남김 (일일 도전 진행 기록 검사가 쓴 돈을 맞춰 봄) */
export function stationPay(s: RunState, kind: StationKind, op: number, cost: number): boolean {
  if (s.gold < cost) return false;
  s.gold -= cost;
  s.goldSpent += cost;
  s.buys.push({ floor: s.floor, roomId: s.roomId, kind, itemId: String(op), price: cost });
  return true;
}
