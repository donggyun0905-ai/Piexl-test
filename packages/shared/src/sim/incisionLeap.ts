// 인시전 도살 도약: 콤보가 쌓이면 다음 공격 대신 조준한 쪽 가장 가까운 적에게 뛰어올라(공중 무적) 내려찍음
// 착지 둘레 피해 + 기절 · 갈라진 땅 (남아서 벰) · 연속 도약 (가까운 다른 적에게 한 번 더)
import { INCISION_PERKS as K } from "../itemsIncision";
import { INCISION as I } from "../weaponsIncision";
import { addCombo, addZone, icGain, icStrike, nearest } from "./incisionKit";
import { alive, inCircle, stun } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, hasPerk, keepInRoom, reachOf, roomGrid } from "./util";

/** 도약 착지 반지름 */
const leapR = (s: RunState) => I.leapR * reachOf(s.player) * (hasPerk(s.player, "icLeapBig") ? K.icLeapBig.r : 1);

/** 조준한 쪽(양옆 90도 안)에서 가장 가까운 적 · 없으면 모든 쪽 */
function pick(s: RunState): { x: number; y: number; id: number } {
  const p = s.player;
  const range = I.leapRange * reachOf(p);
  const front = alive(s)
    .filter((e) => (e.x - p.x) ** 2 + (e.y - p.y) ** 2 <= range * range && (e.x - p.x) * p.faceX + (e.y - p.y) * p.faceY >= 0)
    .sort((a, b) => (a.x - p.x) ** 2 + (a.y - p.y) ** 2 - ((b.x - p.x) ** 2 + (b.y - p.y) ** 2) || a.id - b.id)[0];
  const e = front ?? nearest(s, p.x, p.y, range);
  if (e) return { x: e.x, y: e.y, id: e.id };
  return { x: p.x + p.faceX * range * 0.4, y: p.y + p.faceY * range * 0.4, id: -1 };
}

/** 도약 시작 (도약 준비가 됐을 때 공격 대신) */
export function startLeap(s: RunState, second = false, from?: { x: number; y: number; id: number }): void {
  const p = s.player;
  const to = from ?? pick(s);
  delete p.icLeapReady;
  const mul = I.leapMul * (hasPerk(p, "icLeapPow") ? K.icLeapPow.mul : 1) * (second ? K.icDouble.mul : 1);
  p.icLeap = { x0: p.x, y0: p.y, x: to.x, y: to.y, t: I.leapAir, max: I.leapAir, mul, tg: to.id, second };
  addEffect(s, { kind: "icJumpFx", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: leapR(s), maxTicks: 16 });
}

/** 착지: 둘레 피해 · 기절 · 갈라진 땅 · 연속 도약 */
function land(s: RunState): void {
  const p = s.player;
  const l = p.icLeap!;
  delete p.icLeap;
  const r = leapR(s);
  const hit = inCircle(s, p.x, p.y, r);
  for (const e of hit) {
    icStrike(s, e, l.mul, I.leapPush);
    stun(e, I.leapStun);
  }
  addEffect(s, { kind: "icLandFx", tint: "#ff2a2a", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r, maxTicks: 30 });
  if (hasPerk(p, "icQuake")) addZone(p, { k: 1, x0: p.x, y0: p.y, x: p.x, y: p.y, t: K.icQuake.ticks, mul: K.icQuake.mul, r, next: K.icQuake.every });
  addCombo(s, hit.length);
  icGain(s, I.gainLeap);
  if (l.second || !hasPerk(p, "icDouble")) return;
  const e = nearest(s, p.x, p.y, K.icDouble.reach * reachOf(p), l.tg);
  if (e) startLeap(s, true, { x: e.x, y: e.y, id: e.id });
}

/** 도약 한 틱: 공중에서 착지 자리로 날아감 (무적, 노린 적을 따라감) · 다 오면 착지. 날고 있으면 true */
export function leapTick(s: RunState): boolean {
  const p = s.player;
  const l = p.icLeap;
  if (!l) return false;
  const e = alive(s).find((f) => f.id === l.tg);
  if (e) [l.x, l.y] = [e.x, e.y];
  l.t--;
  const f = 1 - l.t / l.max;
  p.x = l.x0 + (l.x - l.x0) * f;
  p.y = l.y0 + (l.y - l.y0) * f;
  keepInRoom(p, roomGrid(s));
  p.invulnTicks = Math.max(p.invulnTicks, 2);
  if (l.t <= 0) land(s);
  return true;
}
