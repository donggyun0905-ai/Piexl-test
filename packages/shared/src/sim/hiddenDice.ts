// 히든 사용 아이템 둘째 묶음 (itemsHidden): 운명의 주사위 · 저주받은 주사위(숫자 고르는 창) · 테라포밍(보스 고르는 창) · 포탈건
// 고르는 창은 입력 menu (기능 7 저주받은 주사위 숫자 · 8 테라포밍 보스 번호, sim/station.stationMenu가 넘김)
import { BOSS_TIERS, type BossKind } from "../content";
import { HIDDEN_PERKS as K } from "../itemsHidden";
import { createRng, deriveSeed, type Rng } from "../rng";
import { spawnBoss } from "./bosses";
import { equipWeapon, recalcStats } from "./items";
import { addPickup, passivePool, pickDistinct, usePool, weaponPool } from "./loot";
import { spawnEnemies, warpRoom } from "./rooms";
import { EMPTY_HANDS } from "./shop";
import type { RunState } from "./types";
import { addEffect, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";
import { splicePassives } from "./retag";

/** 고르는 창 기능 번호 (menu 입력) */
export const PICK_OP = { curse: 7, terra: 8 } as const;
/** 테라포밍으로 고를 수 있는 보스 (모든 층 보스, 최종 보스 제외) */
export const TERRA_BOSSES: readonly BossKind[] = BOSS_TIERS.flat();

const rngOf = (s: RunState, tag: string) => {
  const p = s.player;
  return createRng(deriveSeed(s.seed, tag, (p.stN = (p.stN ?? 0) + 1)));
};
const near = (v: number, lo: number, hi: number) => Math.max(lo + 14, Math.min(hi - 14, v));

/** 내 둘레에 바닥 물건 (group > 0 = 그중 하나만 가짐) */
function drop(s: RunState, kind: "passive" | "use" | "weapon", ids: readonly string[], dy: number, group = 0): void {
  const p = s.player;
  ids.forEach((id, i) => addPickup(s, s.roomId, kind, id, near(p.x + (i - (ids.length - 1) / 2) * 26, ROOM_MIN_X, ROOM_MAX_X), near(p.y + dy, ROOM_MIN_Y, ROOM_MAX_Y), group));
}

const groupId = (s: RunState) => 7000 + (s.player.stN ?? 0);

/** 운명의 주사위: 1 패시브 하나 뺏김 · 2 무기 바뀜 · 3 패시브 하나 · 4 체력 1 · 5 보상 꾸러미 · 6 여섯 가지 능력치 */
export function fateDice(s: RunState): void {
  const p = s.player;
  const rng = rngOf(s, "fateDice");
  const n = rng.int(1, 6);
  addEffect(s, { kind: "hdDice", x: p.x, y: p.y - 22, dirX: 0, dirY: 0, size: n, maxTicks: 70 });
  if (n === 1 && p.passives.length) splicePassives(p, rng.int(0, p.passives.length - 1), 1);
  if (n === 2) {
    const pool = weaponPool(s);
    if (pool.length) equipWeapon(s, rng.pick(pool));
  }
  if (n === 3) p.passives.push(rng.pick(passivePool(s)));
  if (n === 4) p.hp = 1;
  if (n === 5) {
    p.passives.push(...pickDistinct(rng, passivePool(s), 3));
    drop(s, "passive", pickDistinct(rng, passivePool(s), 3), 24, groupId(s));
    drop(s, "use", pickDistinct(rng, usePool(s), 2), -24);
  }
  if (n === 6) p.fateSix = (p.fateSix ?? 0) + 1;
  recalcStats(s);
}

/** 저주받은 주사위: 고른 숫자와 같으면 화려한 보물 상자, 다르면 저주 넷 중 하나 */
function cursedDice(s: RunState, pick: number): void {
  const p = s.player;
  const rng = rngOf(s, "cursedDice");
  const n = rng.int(1, 6);
  addEffect(s, { kind: "hdDice", x: p.x, y: p.y - 22, dirX: 0, dirY: 0, size: n, maxTicks: 70, width: 1 });
  if (n === pick) {
    const w = K.curseWin;
    addEffect(s, { kind: "hdChest", x: p.x, y: p.y - 4, dirX: 0, dirY: 0, size: 40, maxTicks: 90 });
    for (let i = 0; i < w.passives; i++) p.passives.push(rng.pick(passivePool(s)));
    drop(s, "weapon", pickDistinct(rng, weaponPool(s), 3), 26, groupId(s));
    drop(s, "use", pickDistinct(rng, usePool(s), 2), -26);
    p.curseWin = true;
  } else {
    addEffect(s, { kind: "hdCurse", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 36, maxTicks: 50 });
    const which = rng.int(0, 3);
    // 머리 위 글자: 어떤 저주인지 (size = 저주 번호, 화면이 글자로)
    addEffect(s, { kind: "hdText", x: p.x, y: p.y, dirX: 0, dirY: 0, size: which, maxTicks: 180 });
    if (which === 0) summon(s, rng);
    if (which === 1) p.curseHp = K.curseWin.curseHp;
    if (which === 2) {
      p.passives = [];
      delete p.retag;
    }
    if (which === 3) {
      equipWeapon(s, EMPTY_HANDS);
      summon(s, rng, true);
    }
  }
  recalcStats(s);
}

/** 저주: 이 방에 몬스터 무리 또는 보스를 부름 (방이 다시 잠김) */
function summon(s: RunState, rng: Rng, packOnly = false): void {
  const boss = !packOnly && rng.nextFloat() < 0.5;
  const more = boss ? [spawnBoss(s, rng.pick(TERRA_BOSSES))] : spawnEnemies(s, s.roomId, true);
  s.enemies.push(...more);
  s.rooms[s.roomId]!.cleared = false;
}

/** 창에서 고름 (menu 기능 7·8) */
export function hiddenPick(s: RunState, op: number, a: number): void {
  const p = s.player;
  if (op === PICK_OP.curse && p.hdPick === "curse" && a >= 1 && a <= 6) {
    delete p.hdPick;
    cursedDice(s, a);
  }
  if (op === PICK_OP.terra && p.hdPick === "terra" && TERRA_BOSSES[a]) {
    delete p.hdPick;
    s.terraBoss = { floor: s.floor, kind: TERRA_BOSSES[a]! };
    addEffect(s, { kind: "hdWarp", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 30, maxTicks: 40 });
  }
}

/** 이 층 보스 (테라포밍으로 바꿨으면 그 보스) */
export const terraBoss = (s: RunState): BossKind | undefined => (s.terraBoss?.floor === s.floor ? (s.terraBoss.kind as BossKind) : undefined);

/** 포탈건: 처음엔 이 방을 기억 (아이템 그대로), 다시 쓰면 기억한 방으로 감 (사라짐). 다른 층이면 새로 기억 */
export function portalGun(s: RunState, slot: number): void {
  const p = s.player;
  const m = s.portalMark;
  addEffect(s, { kind: "hdWarp", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 20, maxTicks: 30 });
  if (!m || m.floor !== s.floor) {
    s.portalMark = { floor: s.floor, room: s.roomId };
    p.useSlots[slot] = "portalGun";
    return;
  }
  delete s.portalMark;
  warpRoom(s, m.room);
}
