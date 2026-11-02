// 도박꾼의 방 (비밀의 방, sim/vault): 도박꾼 앞 탁자에 상자 셋 · 탁자 앞에서 F → 야바위 (방마다 한 번) · 탁자는 지나갈 수 없음
// 시작하면 당첨 상자를 잠깐 보여 준 뒤 덮고 섞음 (섞는 순서는 시드라 화면·다시 돌리기가 같음) → 다 섞이면 창에서 왼쪽·가운데·오른쪽 중 고름
// 당첨: 패시브 5 + 300원 + 원하는 능력치 10% 상자 2 (시련 보상 상자와 같음) · 꽝: 무작위 능력치 둘 -10%
import { GAMBLE } from "../secretDefs";
import { createRng, deriveSeed } from "../rng";
import { addBoonMod } from "./boons";
import { recalcStats } from "./items";
import { addPickup, CX, passivePool, pickDistinct, seatSalt } from "./loot";
import type { Pickup, PlayerState, RunState } from "./types";
import { addEffect, ROOM_MIN_Y } from "./util";

/** 입력 menu 기능 번호: 야바위 (a = 0 시작 · 1~3 고른 자리) */
export const GAMBLE_OP = 14;
/** 도박꾼 자리 · 상자 줄 · 상자 사이 */
export const gamblerY = () => ROOM_MIN_Y + 34;
export const cupY = () => gamblerY() + 44;
export const CUP_GAP = 22;
/** 탁자 (지나갈 수 없음): 가운데에서 옆으로 · 컵 줄 위로 · 아래로 · 앞쪽 F 자리 */
export const TABLE = { half: 38, up: 18, down: 40, front: 46 };
/** 섞기 한 번에 바뀌는 두 자리 */
export const CUP_PAIRS: readonly (readonly [number, number])[] = [[0, 1], [1, 2], [0, 2]];
/** 꽝이면 깎이는 능력치 후보 */
const LOSE_STATS = ["damage", "maxHp", "attackSpeed", "moveSpeed", "range"] as const;

type Gamble = NonNullable<PlayerState["gamble"]>;
const roomKey = (s: RunState) => s.floor * 1000 + s.roomId;
/** 이 방에서 이미 한 판 했는지 */
export const gambleUsed = (s: RunState) => !!s.player.gamble?.rooms.includes(roomKey(s));
/** 이 방의 지금 판 (없으면 null) */
export const gambleNow = (s: RunState): Gamble | null => (s.player.gamble?.room === roomKey(s) && s.player.gamble.at !== undefined ? s.player.gamble : null);
/** 다 섞이는 틱 */
export const gambleDone = (g: Gamble) => (g.at ?? 0) + GAMBLE.show + (g.swaps?.length ?? 0) * GAMBLE.swapTicks;

/** 상자마다 지금 자리 (그리기·판정): slots[상자] = 자리 · 움직이는 두 상자와 진행(0~1) · 보여 주는 중 */
export function cupState(g: Gamble, tick: number): { slots: number[]; pair: readonly [number, number] | null; f: number; show: boolean } {
  const slots = [0, 1, 2];
  const t = tick - (g.at ?? 0) - GAMBLE.show;
  if (t < 0) return { slots, pair: null, f: 0, show: true };
  const swaps = g.swaps ?? [];
  const k = Math.min(swaps.length, Math.floor(t / GAMBLE.swapTicks));
  const swapSlots = (pair: readonly [number, number]) => {
    const a = slots.indexOf(pair[0]);
    const b = slots.indexOf(pair[1]);
    [slots[a], slots[b]] = [pair[1], pair[0]];
  };
  for (let i = 0; i < k; i++) swapSlots(CUP_PAIRS[swaps[i]!]!);
  const pair = k < swaps.length ? CUP_PAIRS[swaps[k]!]! : null;
  return { slots, pair, f: pair ? (t % GAMBLE.swapTicks) / GAMBLE.swapTicks : 0, show: false };
}

/** 탁자 앞(아래)에 F 자리 (도박꾼은 탁자 너머에 있음) */
export function spawnGamble(s: RunState, roomId: number): void {
  addPickup(s, roomId, "gambler", "0", CX, cupY() + TABLE.front, 0);
}

/** 틱마다 (사람마다): 탁자는 물체 — 몸이 탁자 안으로 들어가면 가장 가까운 가장자리로 밀어냄 */
export function gambleTableBlock(s: RunState): void {
  if (s.map.rooms[s.roomId]?.type !== "gamble") return;
  const p = s.player;
  const l = CX - TABLE.half - p.r;
  const r = CX + TABLE.half + p.r;
  const t = cupY() - TABLE.up - p.r;
  const b = cupY() + TABLE.down + p.r;
  if (p.x <= l || p.x >= r || p.y <= t || p.y >= b) return;
  const out = [p.x - l, r - p.x, p.y - t, b - p.y];
  const k = out.indexOf(Math.min(...out));
  if (k === 0) p.x = l;
  else if (k === 1) p.x = r;
  else if (k === 2) p.y = t;
  else p.y = b;
}

/** 도박꾼 앞 (station.stationAt): F = 창 열기·닫기 (판이 끝났으면 아무것도 없음) */
export function gambleAt(s: RunState, pk: Pickup, interact: boolean): void {
  const g = gambleNow(s);
  if (s.prompt.kind !== "none" || (gambleUsed(s) && (!g || g.pick !== undefined))) return;
  // 섞는 동안은 창 없음 (상자를 눈으로 따라감)
  if (g && s.tick < gambleDone(g)) return;
  // 다 섞인 순간 고르는 창이 저절로 열림
  if (g && g.pick === undefined && s.tick - gambleDone(g) <= 1) pk.itemId = "1";
  if (interact) pk.itemId = pk.itemId === "1" ? "0" : "1";
  s.prompt = { kind: "station", station: "gambler", open: pk.itemId === "1" };
}

/** 창에서 누른 것 */
export function gambleMenu(s: RunState, a: number): void {
  if (s.map.rooms[s.roomId]?.type !== "gamble") return;
  const p = s.player;
  const g = (p.gamble ??= { rooms: [] });
  const stand = s.rooms[s.roomId]?.pickups.find((pk) => pk.kind === "gambler");
  if (a === 0) {
    if (gambleUsed(s)) return;
    const rng = createRng(deriveSeed(s.seed, "gamble", s.floor, s.roomId, p.characterId, ...seatSalt(s)));
    g.rooms.push(roomKey(s));
    g.room = roomKey(s);
    g.at = s.tick;
    g.prize = rng.int(0, 2);
    g.swaps = Array.from({ length: GAMBLE.swaps }, () => rng.int(0, CUP_PAIRS.length - 1));
    delete g.pick;
    delete g.win;
    delete g.lost;
    delete g.pickAt;
    if (stand) stand.itemId = "0";
    return;
  }
  const now = gambleNow(s);
  if (!now || now.pick !== undefined || s.tick < gambleDone(now) || a < 1 || a > 3) return;
  now.pick = a - 1;
  now.pickAt = s.tick;
  now.win = cupState(now, s.tick).slots[now.prize ?? 0] === now.pick;
  if (stand) stand.itemId = "0";
  const x = CX + (now.pick - 1) * CUP_GAP;
  if (now.win) payout(s, x);
  else {
    const rng = createRng(deriveSeed(s.seed, "gambleLose", s.floor, s.roomId, ...seatSalt(s)));
    const lost = pickDistinct(rng, LOSE_STATS, GAMBLE.lose);
    now.lost = [...lost];
    for (const k of lost) addBoonMod(s, { stat: k, mul: 1 - GAMBLE.down });
    recalcStats(s);
    p.hp = Math.min(p.hp, p.stats.maxHp);
  }
  addEffect(s, { kind: now.win ? "srWin" : "srLose", x, y: cupY(), dirX: 0, dirY: 0, size: 60, maxTicks: 70 });
}

/** 당첨: 탁자 앞에 패시브 5 · 300원 · 원하는 능력치 상자 2가 쏟아짐 */
function payout(s: RunState, fromX: number): void {
  const rng = createRng(deriveSeed(s.seed, "gambleWin", s.floor, s.roomId, ...seatSalt(s)));
  const y = cupY() + 62;
  const drop = (kind: "passive" | "coin" | "boon", id: string, x: number, yy: number, price = 0) => {
    addPickup(s, s.roomId, kind, id, x, yy, 0, price);
    addEffect(s, { kind: "trChest", x: fromX, y: cupY(), toX: x, toY: yy, dirX: 0, dirY: 0, size: 8, maxTicks: 34 });
  };
  pickDistinct(rng, passivePool(s), GAMBLE.passives).forEach((id, i) => drop("passive", id, CX + (i - (GAMBLE.passives - 1) / 2) * 30, y));
  drop("coin", "0", CX, y + 30, GAMBLE.gold);
  for (let i = 0; i < GAMBLE.picks; i++) drop("boon", "ps", CX + (i === 0 ? -44 : 44), y + 30);
}
