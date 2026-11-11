// 훅 더블배럴 산탄총 (sim/hook가 씀): 초근접 부채꼴 발사 · 끌려온 적은 걸린 자리 쯤으로 튕겨 날아감 · 벽에 부딪히면 난파
// 공용 도우미: 갈고리 종류 · 거리 · 걸리는 수 · 맞히기 · 받는 피해
import { srcRun } from "./dmgSrc";
import { HOOK_PERKS as K } from "../itemsHook";
import { HOOK as H, type HookStyle } from "../weaponsHook";
import { damageEnemy, healPlayer } from "./combat";
import type { HkCaught } from "./hookTypes";
import { bodyFits } from "./layout";
import { addGold } from "./loot";
import { alive, isBoss, stun } from "./s2Kit";
import { ignite } from "./status";
import { statusHit } from "./statusHit";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, dist2, hasPerk, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, reachOf, roomGrid, weaponOf } from "./util";

export const isHook = (p: PlayerState) => p.characterId === "hook";
export const hookOf = (p: PlayerState): HookStyle => weaponOf(p).hook ?? { hook: "rusty" };
/** 갈고리 거리 (갈고리 · 닻사슬) */
/** 갈고리를 던지는 거리 (사거리 증가만큼 멀리 · 산탄총은 그대로) */
export const hookReach = (p: PlayerState) => H.reach * (hookOf(p).reach ?? 1) * (hasPerk(p, "hkChain") ? K.hkChain.reach : 1) * reachOf(p);
/** 한 번에 걸리는 적 수 */
export const catchMax = (p: PlayerState) => H.catchMax + (hookOf(p).catch ?? 0) + (hasPerk(p, "hkGrapnel") ? K.hkGrapnel.catch : 0);
/** 움직일 수 없는 적 (보스·허수아비): 끌려오지도 튕기지도 않음 */
export const anchored = (e: EnemyState) => isBoss(e) || e.kind === "dummy";

/** 훅 공격 한 번: 폭풍탄은 번개 색 · 용의 숨결은 불탐 */
export function hkHit(s: RunState, e: EnemyState, dmg: number, fx: number, fy: number): void {
  const [dx, dy] = normalize(e.x - fx, e.y - fy) ?? [s.player.faceX, s.player.faceY];
  const dot = hookOf(s.player).dot;
  if (dot) statusHit(s, e, dot, dmg, dx, dy, false);
  else damageEnemy(s, e, dmg, dx, dy, false);
  if (dot === "burn") ignite(e, dmg * H.burnMul);
}

/** 폭풍탄: 맞은 적에게서 가까운 다른 적에게 번개 */
function stormBolt(s: RunState, from: EnemyState, dmg: number): void {
  let best: EnemyState | undefined;
  for (const e of alive(s)) {
    if (e.id === from.id || dist2(e, from) > H.boltReach ** 2) continue;
    if (!best || dist2(e, from) < dist2(best, from)) best = e;
  }
  if (!best) return;
  hkHit(s, best, dmg * H.boltMul, from.x, from.y);
  addEffect(s, { kind: "hkBolt", x: from.x, y: from.y, toX: best.x, toY: best.y, dirX: 0, dirY: 0, size: 5, maxTicks: 12 });
}

/** 튕겨 날아가게 함 (tx, ty 쪽으로 H.slideTicks 동안) */
function knock(s: RunState, e: EnemyState, tx: number, ty: number, wreck: number): void {
  const p = s.player;
  const list = (p.hkSlides ??= []).filter((w) => w.id !== e.id);
  list.push({ id: e.id, vx: (tx - e.x) / H.slideTicks, vy: (ty - e.y) / H.slideTicks, t: H.slideTicks, dmg: wreck });
  p.hkSlides = list;
}

/** 산탄 발사 (dx, dy 쪽 부채꼴): caught = 끌려온 적 (초근접 피해 · 걸린 자리로 튕김) · tap = 둘째 총열 */
export function blast(s: RunState, dx: number, dy: number, caught: readonly HkCaught[], mul = 1, tap = false): void {
  const p = s.player;
  const st = hookOf(p);
  const spread = st.spread ?? 1;
  const arc = 1 - (1 - H.shotArc) * spread;
  const reach = H.shotReach * Math.sqrt(spread);
  const base = p.stats.damage * H.shotMul * mul * (hasPerk(p, "hkPowder") ? K.hkPowder.mul : 1);
  const wreck = p.stats.damage * H.wreckMul * (st.wreck ?? 1) * (hasPerk(p, "hkWreck") ? K.hkWreck.mul : 1);
  const far = H.knockDist * (st.knock ?? 1);
  let bolts = 0;
  for (const e of alive(s)) {
    const ox = e.x - p.x;
    const oy = e.y - p.y;
    const d = Math.hypot(ox, oy);
    const held = caught.find((c) => c.id === e.id);
    if (!held && (d > reach + e.r || (d > e.r + p.r && (ox * dx + oy * dy) / d < arc))) continue;
    hkHit(s, e, base * (held ? H.pointBlank : 1), p.x, p.y);
    if (st.dot === "shock" && bolts < 3) {
      bolts++;
      stormBolt(s, e, base);
    }
    if (hasPerk(p, "hkJolly")) e.slowTicks = Math.max(e.slowTicks ?? 0, K.hkJolly.slow);
    if (held && e.hp <= 0 && hasPerk(p, "hkPlunder")) srcRun(s, "hkPlunder", () => addGold(s, K.hkPlunder.gold));
    if (anchored(e) || e.hp <= 0) continue;
    // 걸린 적은 걸린 자리로 · 아닌 적은 쏜 쪽으로 밀려남 (역조는 더 멀리)
    const [ux, uy] = normalize(ox, oy) ?? [dx, dy];
    if (held) knock(s, e, held.ox, held.oy, wreck);
    else knock(s, e, e.x + ux * far, e.y + uy * far, wreck);
  }
  if (!tap && hasPerk(p, "hkRum") && caught.length) healPlayer(s, p.stats.maxHp * K.hkRum.heal * caught.length);
  p.hkShot = s.tick;
  addEffect(s, { kind: tap ? "hkTap" : "hkBlast", x: p.x + dx * 8, y: p.y + dy * 8 - 3, dirX: dx, dirY: dy, size: reach, maxTicks: tap ? 16 : 22 });
  if (!tap && hasPerk(p, "hkDoubleTap")) p.hkTap = { t: K.hkDoubleTap.delay, dx, dy };
}

/** 틱마다: 튕겨 날아가는 적 · 벽에 부딪히면 난파 (피해 + 기절) */
export function slideTick(s: RunState): void {
  const p = s.player;
  if (!p.hkSlides) return;
  const g = roomGrid(s);
  p.hkSlides = p.hkSlides.filter((w) => {
    const e = s.enemies.find((o) => o.id === w.id && o.hp > 0);
    if (!e) return false;
    const nx = e.x + w.vx;
    const ny = e.y + w.vy;
    const out = nx < ROOM_MIN_X + e.r || nx > ROOM_MAX_X - e.r || ny < ROOM_MIN_Y + e.r || ny > ROOM_MAX_Y - e.r;
    if (out || (g !== null && !bodyFits(g, nx, ny, e.r))) {
      hkHit(s, e, w.dmg, e.x - w.vx, e.y - w.vy);
      stun(e, Math.round(H.wreckStun * (hasPerk(p, "hkWreck") ? K.hkWreck.stun : 1)));
      addEffect(s, { kind: "hkWreck", x: e.x, y: e.y, dirX: w.vx, dirY: w.vy, size: e.r + 10, maxTicks: 20 });
      return false;
    }
    e.x = nx;
    e.y = ny;
    e.stunTicks = Math.max(e.stunTicks ?? 0, 2);
    return --w.t > 0;
  });
  if (p.hkSlides.length === 0) delete p.hkSlides;
}

/** 자유의 돛 (classTaken) */
export const hookTaken = (p: PlayerState) => (hasPerk(p, "hkFreedom") ? K.hkFreedom.taken : 1);
