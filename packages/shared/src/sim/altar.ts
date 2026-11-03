// 제단의 방 (3층부터 층마다 하나, 푸른 바다 같은 방): 성좌 하나(시드)가 방을 감쌀 만큼 크게 떠 있음 · 성좌 앞 F → 긴 카드 셋
// 카드 1 거래 · 카드 2 패시브 둘을 바치고 남은 패시브 하나에 증강 기술 둘(광야의 새벽 각성 기술, 패시브 둘 이상일 때) · 카드 3 무시(30%로 벌칙)
// 증강이 새겨진 패시브는 다시 제단에 와도 빼앗기지 않음 · 제단 증강은 한 판에 하나: 이미 있으면 카드 2는 최대 체력 20을 바치고 바꾸기 (1·3은 여러 번)
// 고르기 전에는 방을 나갈 수 없음 (잠긴 출구도 못 지남). 수치는 altarDefs
import { ALTAR, ALTAR_IDS, ALTARS, type AltarId, type AltarTrade } from "../altarDefs";
import type { PassiveId } from "../items";
import { createRng, deriveSeed, type Rng } from "../rng";
import { addBoonExtra, addBoonMod } from "./boons";
import { recalcStats } from "./items";
import { addPickup, CX, passivePool, pickDistinct } from "./loot";
import { runSkill, type SwarmSkill } from "./swarmEvo";
import type { PlayerState, RunState } from "./types";
import { addEffect, ROOM_MIN_Y } from "./util";

/** 입력 menu 기능 번호: 카드 고르기 (a = 0 거래 · 1 증강 · 2 무시) */
export const ALTAR_OP = 13;

export interface AltarPlayerState {
  /** 쓴 제단 (층 × 1000 + 방) · 마지막 결과 (화면 안내) · 고른 카드 기록 (버프 창) */
  altar?: { rooms: number[]; last?: { id: AltarId; card: number; hit?: number; tick: number; taken?: PassiveId[]; keep?: PassiveId; swap?: boolean }; got?: { id: AltarId; card: number; hit?: number; swap?: boolean }[] };
  /** 증강: 붙은 패시브 · 기술 둘 (그 패시브를 가진 동안 늘 씀) */
  augments?: { passive: PassiveId; skills: SwarmSkill[] }[];
  /** 증강 기술 '블랙홀' (던전, 광야의 새벽은 판에 있음) */
  augVortex?: { vortex?: { x: number; y: number; t: number } };
}

const roomKey = (s: RunState) => s.floor * 1000 + s.roomId;
export const altarFloor = (floor: number) => floor >= ALTAR.fromFloor;
export const altarUsed = (s: RunState) => !!s.player.altar?.rooms.includes(roomKey(s));
/** 이 방의 성좌 (층·방 번호 시드) */
export const altarOf = (s: RunState, roomId = s.roomId): AltarId => ALTAR_IDS[createRng(deriveSeed(s.seed, "altar", s.floor, roomId)).int(0, ALTAR_IDS.length - 1)]!;
/** 아직 고르지 않은 제단 방 (나갈 수 없음) */
export const altarPending = (s: RunState) => s.map.rooms[s.roomId]?.type === "altar" && !altarUsed(s);
/** 성좌 자리 (방 위쪽 가운데, 그 앞에 제단) */
export const ALTAR_Y = ROOM_MIN_Y + 40;

export function spawnAltar(s: RunState, roomId: number): void {
  addPickup(s, roomId, "altar", "0", CX, ALTAR_Y + 26, 0);
}

function trade(s: RunState, list: readonly AltarTrade[]): void {
  for (const t of list) {
    if (t.stat === "regen" || t.stat === "defense" || t.stat === "critChance" || t.stat === "sharpness") addBoonExtra(s, t.stat, t.add ?? 0);
    else addBoonMod(s, { stat: t.stat, ...(t.add !== undefined ? { add: t.add } : {}), ...(t.mul !== undefined ? { mul: t.mul } : {}) });
  }
  recalcStats(s);
}

/** 증강 기술이 새겨진 패시브 (제단·경매) — 다시 제단에 와도 빼앗기지 않음 */
export const augmented = (p: PlayerState, id: PassiveId): boolean => !!p.augments?.some((a) => a.passive === id);
/** 카드 2(증강)를 고를 수 있는 패시브 수 */
export const ALTAR_AUG_MIN = 2;
/** 제단 증강 (한 판에 하나: 기술 둘 · 경매 증강은 하나라 따로 셈) */
const altarAug = (p: PlayerState) => p.augments?.find((a) => a.skills.length >= 2);
/** 이미 제단 증강이 있는지 → 카드 2는 '바꾸기' (최대 체력을 바치고 기존 증강을 이 성좌 것으로) */
export const altarAugTaken = (p: PlayerState): boolean => !!altarAug(p);
/** 카드 2를 고를 수 있는지: 새로 새기기는 패시브 둘 이상 · 바꾸기는 패시브 하나 이상 + 최대 체력이 남아야 함 */
export const altarAugOk = (p: PlayerState): boolean =>
  altarAugTaken(p) ? p.passives.length > 0 && p.stats.maxHp - ALTAR.swapHp >= ALTAR.swapMinHp : p.passives.length >= ALTAR_AUG_MIN;

/** 패시브 n개를 빼앗음 (증강이 새겨진 것·keep은 빼고, 빼앗은 것 목록) */
function takePassives(p: PlayerState, rng: Rng, n: number, keep?: PassiveId): PassiveId[] {
  const out: PassiveId[] = [];
  for (let i = 0; i < n; i++) {
    const can = p.passives.map((id, k) => [id, k] as const).filter(([id]) => id !== keep && !augmented(p, id));
    if (can.length === 0) break;
    const [, k] = can[rng.int(0, can.length - 1)]!;
    out.push(...p.passives.splice(k, 1));
  }
  return out;
}

/** 카드를 고름 */
export function altarMenu(s: RunState, card: number): void {
  if (!altarPending(s) || card < 0 || card > 2) return;
  const p = s.player;
  const id = altarOf(s);
  const def = ALTARS[id];
  const rng = createRng(deriveSeed(s.seed, "altarPick", s.floor, s.roomId, card, p.characterId));
  if (card === 1 && !altarAugOk(p)) return;
  const a = (p.altar ??= { rooms: [] });
  a.rooms.push(roomKey(s));
  a.last = { id, card, tick: s.tick };
  if (card === 0) {
    if (id === "witch") p.boonImmune = true;
    if (id === "unknown") {
      const n = takePassives(p, rng, ALTAR.unknownSwap).length;
      p.passives.push(...pickDistinct(rng, passivePool(s), n));
    }
    trade(s, [...def.give, ...def.take]);
  } else if (card === 1 && altarAugTaken(p)) {
    // 바꾸기: 최대 체력을 바치고 기존 제단 증강의 기술을 이 성좌 것으로 (그 패시브를 잃었으면 가진 패시브 하나로 옮김)
    const aug = altarAug(p)!;
    if (!p.passives.includes(aug.passive)) aug.passive = p.passives[rng.int(0, p.passives.length - 1)]!;
    aug.skills = [...def.skills];
    addBoonMod(s, { stat: "maxHp", add: -ALTAR.swapHp });
    p.hp = Math.min(p.hp, p.stats.maxHp);
    Object.assign(a.last, { keep: aug.passive, swap: true });
  } else if (card === 1) {
    // 새길 패시브(아직 증강이 없는 것 먼저)를 정하고, 나머지 중 증강 없는 것을 바침
    const fresh = p.passives.filter((x) => !augmented(p, x));
    const keep = (fresh.length > 0 ? fresh : p.passives)[rng.int(0, (fresh.length > 0 ? fresh : p.passives).length - 1)]!;
    const taken = takePassives(p, rng, ALTAR.takePassives, keep);
    (p.augments ??= []).push({ passive: keep, skills: [...def.skills] });
    Object.assign(a.last, { keep, taken });
    recalcStats(s);
  } else if (rng.nextFloat() < ALTAR.ignoreChance) {
    // 무시: 30%로 벌칙 (빼앗기는 능력치 또는 패시브 둘 · ???는 패시브 넷)
    const first = id !== "unknown" && rng.nextFloat() < 0.5;
    a.last.hit = first ? 1 : 2;
    if (first) trade(s, def.take);
    else {
      a.last.taken = takePassives(p, rng, id === "unknown" ? ALTAR.unknownIgnore : ALTAR.takePassives);
      recalcStats(s);
    }
  }
  (a.got ??= []).push({ id, card, ...(a.last.hit ? { hit: a.last.hit } : {}), ...(a.last.swap ? { swap: true } : {}) });
  addEffect(s, { kind: "alChoose", x: CX, y: ALTAR_Y, dirX: ALTAR_IDS.indexOf(id), dirY: 0, size: 80, maxTicks: 60, width: card });
}

/** 틱마다 (사람마다): 가진 패시브에 붙은 증강 기술 (시련 중에는 안 나감) · 고르기 전 제단 방은 잠김 */
export function altarTick(s: RunState): void {
  const p = s.player;
  if (altarPending(s)) s.rooms[s.roomId]!.cleared = false;
  if (!p.augments?.length || s.swarm || s.pvp || s.trialRun?.room === s.roomId) return;
  // 제단·경매 증강은 광야의 새벽 각성 기술보다 약하게 (공격력에 ALTAR.augPower를 곱해 씀)
  const keep = p.stats.damage;
  p.stats.damage = keep * ALTAR.augPower;
  for (const aug of p.augments) if (p.passives.includes(aug.passive)) for (const k of aug.skills) runSkill(s, k);
  p.stats.damage = keep;
}
