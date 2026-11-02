// 시련 보상: 점수 구간(100점마다)의 보상이 비석에서 상자로 쏟아짐 (상자 하나에 보상 하나, 많아 보이게 따로따로)
// 상자 itemId: "rs:능력치" 무작위 능력치 10% · "ps" 원하는 능력치 10%(창) · "pp:a,b,c" 패시브 셋 중 하나(창) · "pu:a,b,c" 사용 아이템 셋 중 하나(창) · "rv" 체력 가득 되살아남 1회
// 무작위 패시브는 보통 패시브로 바닥에 놓임. 다가가 F로 열기
import type { PassiveId, UseItemId } from "../items";
import { createRng, deriveSeed } from "../rng";
import { addBoonExtra, addBoonMod } from "./boons";
import { recalcStats } from "./items";
import { addPickup, CX, CY, passivePool, pickDistinct, seatSalt, usePool } from "./loot";
import type { Pickup, RunState } from "./types";
import { addEffect } from "./util";

/** 보상 능력치 (화면 차례 = 고르는 번호): 공격력·최대 체력·공격 속도·이동 속도·사거리는 10%, 치명타 확률은 +10% */
export const BOON_STATS = ["damage", "maxHp", "attackSpeed", "moveSpeed", "range", "critChance"] as const;
export type BoonStat = (typeof BOON_STATS)[number];
const BOON_UP = 0.1;
/** 비석 자리 (방 가운데 조금 위) */
export const STONE_Y = CY - 14;

/** 점수 구간 보상 (구간 = 100점마다 1~10): [무작위 능력치 · 원하는 능력치 · 무작위 패시브 · 고르는 패시브 · 고르는 사용 아이템 · 되살아남] */
const TABLE: readonly (readonly [number, number, number, number, number, number])[] = [
  [0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0],
  [2, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0],
  [0, 0, 3, 0, 0, 0],
  [0, 1, 0, 1, 0, 0],
  [0, 1, 0, 1, 2, 0],
  [0, 2, 0, 2, 2, 0],
  [0, 3, 0, 3, 2, 0],
  [0, 3, 0, 3, 2, 1],
  [0, 3, 0, 3, 2, 1],
];
export const trialRewardRow = (score: number) => TABLE[Math.max(0, Math.min(10, Math.floor(score / 100)))]!;

/** 능력치 하나 10% 올리기 */
export function boonStat(s: RunState, k: BoonStat): void {
  if (k === "critChance") addBoonExtra(s, "critChance", BOON_UP);
  else addBoonMod(s, { stat: k, mul: 1 + BOON_UP });
  recalcStats(s);
}

/** 끝난 시련의 점수만큼 상자를 쏟음 (비석 둘레 고리 모양) */
export function spillRewards(s: RunState, score: number): void {
  const [rs, ps, rp, pp, pu, rv] = trialRewardRow(score);
  const rng = createRng(deriveSeed(s.seed, "trialReward", s.floor, s.roomId, score, ...seatSalt(s)));
  const codes: string[] = [];
  for (let i = 0; i < rs; i++) codes.push(`rs:${rng.pick(BOON_STATS)}`);
  for (let i = 0; i < ps; i++) codes.push("ps");
  for (let i = 0; i < pp; i++) codes.push(`pp:${pickDistinct(rng, passivePool(s), 3).join(",")}`);
  for (let i = 0; i < pu; i++) codes.push(`pu:${pickDistinct(rng, usePool(s), 3).join(",")}`);
  for (let i = 0; i < rv; i++) codes.push("rv");
  const passives = pickDistinct(rng, passivePool(s), rp);
  const all = codes.length + passives.length;
  const at = (i: number): [number, number] => {
    const a = Math.PI * 0.15 + (i / Math.max(1, all - 1)) * Math.PI * 0.7;
    const r = 46 + (i % 2) * 18;
    return [Math.round(CX + Math.cos(a) * r * (all > 1 ? 1.4 : 0)), Math.round(STONE_Y + 30 + Math.sin(a) * r)];
  };
  codes.forEach((c, i) => {
    const [x, y] = at(i);
    addPickup(s, s.roomId, "boon", c, x, y, 0);
    addEffect(s, { kind: "trChest", x: CX, y: STONE_Y, toX: x, toY: y, dirX: 0, dirY: 0, size: 8, maxTicks: 30 + i * 4 });
  });
  passives.forEach((id, i) => {
    const [x, y] = at(codes.length + i);
    addPickup(s, s.roomId, "passive", id, x, y, 0);
    addEffect(s, { kind: "trChest", x: CX, y: STONE_Y, toX: x, toY: y, dirX: 0, dirY: 0, size: 8, maxTicks: 30 + (codes.length + i) * 4 });
  });
  addEffect(s, { kind: "trWake", x: CX, y: STONE_Y, dirX: 0, dirY: 0, size: 90, maxTicks: 70 });
}

/** 고르는 상자의 고를 것 (창 차례) */
export function chestOptions(code: string): string[] {
  if (code === "ps") return [...BOON_STATS];
  return code.startsWith("pp:") || code.startsWith("pu:") ? code.slice(3).split(",") : [];
}

/** 상자 앞 (interact = F) · 창에서 고름 (choice = 차례) */
export function openChest(s: RunState, pk: Pickup | null, interact: boolean, choice = -1): void {
  const p = s.player;
  const t = (p.trial ??= { rooms: [] });
  const room = s.rooms[s.roomId]!;
  const chest = pk ?? room.pickups.find((x) => x.id === t.open && x.kind === "boon");
  if (!chest) return;
  const code = chest.itemId;
  const done = () => {
    room.pickups = room.pickups.filter((x) => x.id !== chest.id);
    t.open = undefined;
    addEffect(s, { kind: "trOpen", x: chest.x, y: chest.y, dirX: 0, dirY: 0, size: 14, maxTicks: 24 });
  };
  if (choice >= 0) {
    const opt = chestOptions(code)[choice];
    if (!opt) return;
    if (code === "ps") boonStat(s, opt as BoonStat);
    else if (code.startsWith("pp:")) {
      p.passives.push(opt as PassiveId);
      recalcStats(s);
    } else giveUse(s, opt as UseItemId, chest);
    return done();
  }
  if (s.prompt.kind !== "none") return;
  const pick = chestOptions(code).length > 0;
  if (interact && !pick) {
    if (code === "rv") t.revive = (t.revive ?? 0) + 1;
    else boonStat(s, code.slice(3) as BoonStat);
    return done();
  }
  if (interact) t.open = t.open === chest.id ? undefined : chest.id;
  s.prompt = { kind: "station", station: "boon", open: t.open === chest.id };
}

/** 사용 아이템 넣기 (칸이 꽉 찼으면 오래된 것을 그 자리에 내려놓음) */
function giveUse(s: RunState, id: UseItemId, at: Pickup): void {
  const p = s.player;
  const empty = p.useSlots.indexOf(null);
  const slot = empty >= 0 ? empty : p.replaceSlot;
  const old = p.useSlots[slot];
  p.useSlots[slot] = id;
  p.replaceSlot = (slot + 1) % p.useSlots.length;
  if (old) addPickup(s, s.roomId, "use", old, at.x, at.y + 12, 0);
}

/** 보상 '되살아남': 쓰러지면 한 번 체력 가득으로 (run.checkDeath) */
export function trialRevive(s: RunState): void {
  const p = s.player;
  if (p.hp > 0 || !p.trial?.revive) return;
  p.trial.revive--;
  p.hp = p.stats.maxHp;
  p.invulnTicks = 120;
  addEffect(s, { kind: "trWake", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 40, maxTicks: 40 });
}
