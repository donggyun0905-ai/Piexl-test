// 쉐도잉(실베르): 누르고 있는 동안 붓 끝(마우스 자리, 붓이 닿는 거리까지)을 따라 바닥에 먹 획을 그림. 획에 닿은 적은 계속 피해
// 다 그리면(손을 떼면) 모양에 따라 기술: 닫힌 원 = 봉인(안의 적 큰 피해·묶음) · 곧은 줄 = 일필 베기 · 그 밖은 그냥 획
// 잉크를 써서 그리고, 쉬면 다시 참 (공격 속도 배율). 방을 나가면 획을 모두 지움. 전용 패시브 효과는 sim/shadowingArts
import { SHADOW_INK as SD } from "../weaponsShadowing";
import { SHADOWING_PERKS as K } from "../itemsShadowing";
import { rot } from "./orbit";
import type { InkStroke } from "./sdTypes";
import { centerOf, insideLoop, nearStroke, segDist2, shapeOf, strokeLen } from "./shadowingShape";
import { alive, damageEnemyLite, spiritsTick } from "./shadowingSpirits";
import { artsTick, onDraw, onFade, onFinish, onKill, onSeal, onSlash, strokeTouch } from "./shadowingArts";
import type { RunState } from "./types";
import { addEffect, hasPerk, normalize, reachOf } from "./util";

type P = RunState["player"];

export const isShadowing = (p: P) => p.characterId === "shadowing";
/** 지금 잉크 (처음엔 가득) */
export const inkOf = (p: P) => p.sdInk ?? SD.ink;
/** 붓이 닿는 거리 (사거리 증가만큼) */
export const brushReach = (p: P) => SD.reach * reachOf(p);
const roomKey = (s: RunState) => s.floor * 1000 + s.roomId;
/** 그리는 중인 획 (날개 획 빼고) */
const drawing = (p: P) => p.sdStrokes?.find((k) => k.end < 0 && !k.wing);

/** 붓 끝 자리: 조준 방향 × 누른 곳까지 거리 · 자동 조준이면 가장 가까운 적 둘레를 돎 */
function brushPoint(s: RunState): [number, number] | null {
  const p = s.player;
  if (p.pwAimD === undefined) {
    const e = s.enemies.find((f) => f.id === s.autoTargetId && alive(f));
    if (!e) return null;
    const v = rot(((s.tick % SD.autoSpin) / SD.autoSpin) * Math.PI * 2);
    return [e.x + v[0] * SD.autoR, e.y + v[1] * SD.autoR];
  }
  const d = Math.min(p.pwAimD, brushReach(p));
  return [p.x + p.faceX * d, p.y + p.faceY * d];
}

/** 새 획 (판 위 획이 많으면 가장 오래된 다 그린 획부터 지움) */
export function newStroke(p: P, x: number, y: number, wing = false): InkStroke {
  const id = (p.sdNext ?? 0) + 1;
  p.sdNext = id;
  const k: InkStroke = { id, pts: [x, y], end: -1, shape: 0, ink: 0, h: [], ...(wing ? { wing } : {}) };
  const list = (p.sdStrokes ??= []);
  list.push(k);
  while (list.length > SD.maxStrokes) {
    const i = list.findIndex((o) => o.end >= 0);
    if (i < 0) break;
    list.splice(i, 1);
  }
  return k;
}

/** 획을 다 그림: 남는 시간 · 모양 기술 · 패시브 */
export function finishStroke(s: RunState, k: InkStroke): void {
  const p = s.player;
  k.end = s.tick + Math.round(SD.life * (hasPerk(p, "sdThorn") ? K.sdThorn.life : 1));
  k.shape = k.wing ? 0 : shapeOf(k.pts);
  p.sdDone = (p.sdDone ?? 0) + 1;
  p.attackCount++;
  const dmg = p.stats.damage;
  if (k.shape === 1) {
    const c = centerOf(k.pts);
    const stun = hasPerk(p, "sdChain") ? K.sdChain.stun : SD.sealStun;
    const inside = s.enemies.filter((e) => alive(e) && (insideLoop(k.pts, e.x, e.y) || (e.x - c.x) ** 2 + (e.y - c.y) ** 2 < (e.r + 6) ** 2));
    for (const e of inside) {
      const d = normalize(e.x - c.x, e.y - c.y) ?? [0, 0];
      damageEnemyLite(s, e, dmg * SD.sealMul, d[0], d[1]);
      e.stunTicks = Math.max(e.stunTicks ?? 0, stun);
      if (e.hp <= 0) onKill(s, e);
    }
    addEffect(s, { kind: "sdSeal", x: c.x, y: c.y, dirX: 0, dirY: 0, size: c.r, maxTicks: 30, ...(hasPerk(p, "sdChain") ? { style: 1 } : {}) });
    onSeal(s, k, c, insideLoop(k.pts, p.x, p.y));
  } else if (k.shape === 2) {
    const x1 = k.pts[0]!;
    const y1 = k.pts[1]!;
    const x2 = k.pts[k.pts.length - 2]!;
    const y2 = k.pts[k.pts.length - 1]!;
    const d = normalize(x2 - x1, y2 - y1) ?? [p.faceX, p.faceY];
    for (const e of s.enemies) {
      if (!alive(e) || segDist2(e.x, e.y, x1, y1, x2, y2) > (SD.slashW + e.r) ** 2) continue;
      damageEnemyLite(s, e, dmg * SD.slashMul, d[0], d[1]);
      if (e.hp <= 0) onKill(s, e);
    }
    addEffect(s, { kind: "sdSlash", x: x1, y: y1, toX: x2, toY: y2, dirX: d[0], dirY: d[1], size: SD.slashW, maxTicks: 18 });
    onSlash(s, x1, y1, x2, y2, d);
  }
  onFinish(s, k);
}

/** 붓을 누르고 있는 동안: 붓 끝을 따라 점을 더함 (잉크가 모자라면 그 자리에서 다 그림) */
function paint(s: RunState, bx: number, by: number): void {
  const p = s.player;
  let k = drawing(p);
  if (!k) {
    if (inkOf(p) < SD.restart && (p.sdClockT ?? 0) <= 0) return;
    k = newStroke(p, bx, by);
    return;
  }
  const lx = k.pts[k.pts.length - 2]!;
  const ly = k.pts[k.pts.length - 1]!;
  const d = Math.hypot(bx - lx, by - ly);
  if (d < SD.seg) return;
  const free = (p.sdClockT ?? 0) > 0;
  const cost = free ? 0 : d * SD.cost;
  if (cost > inkOf(p)) return finishStroke(s, k);
  p.sdInk = inkOf(p) - cost;
  k.ink += d * SD.cost;
  k.pts.push(bx, by);
  onDraw(s, bx, by, d);
  // 자동 조준: 적 둘레를 한 바퀴 돌면 원을 닫아 봉인
  const lap = p.pwAimD === undefined && strokeLen(k.pts) >= SD.autoR * 6.3;
  if (lap || k.pts.length >= SD.maxPts * 2) finishStroke(s, k);
}

/** 획에 닿은 적 피해 (같은 적은 hitCd 뒤에 다시) · 시간이 다 된 획 지우기 */
function strokesTick(s: RunState, speed: number): void {
  const p = s.player;
  const list = p.sdStrokes;
  if (!list?.length) return;
  const cd = Math.max(4, Math.round(SD.hitCd / Math.max(0.5, speed)));
  const dmg = p.stats.damage * SD.inkMul * (hasPerk(p, "sdThorn") ? K.sdThorn.mul : 1);
  for (const k of list) {
    const h: number[] = [];
    for (let i = 0; i < k.h.length; i += 2) if (s.tick - k.h[i + 1]! < cd) h.push(k.h[i]!, k.h[i + 1]!);
    k.h = h;
    for (const e of s.enemies) {
      if (!alive(e) || hitBefore(k, e.id) || !nearStroke(k.pts, e.x, e.y, SD.width + e.r)) continue;
      k.h.push(e.id, s.tick);
      damageEnemyLite(s, e, dmg, 0, 0);
      strokeTouch(s, e);
      if (e.hp <= 0) onKill(s, e);
    }
  }
  p.sdStrokes = list.filter((k) => {
    if (k.end < 0 || k.end > s.tick) return true;
    onFade(s, k);
    return false;
  });
}

const hitBefore = (k: InkStroke, id: number) => {
  for (let i = 0; i < k.h.length; i += 2) if (k.h[i] === id) return true;
  return false;
};

/** 날개: 대시하는 동안 지나간 길을 따라 잉크 없이 획이 그려짐 */
function wingsTick(s: RunState): void {
  const p = s.player;
  if (!hasPerk(p, "sdWings")) return;
  const w = p.sdStrokes?.find((k) => k.end < 0 && k.wing);
  if (p.dashTicks > 0) {
    if (!w) newStroke(p, p.x, p.y, true);
    else if (Math.hypot(p.x - w.pts[w.pts.length - 2]!, p.y - w.pts[w.pts.length - 1]!) >= K.sdWings.seg && w.pts.length < SD.maxPts * 2) w.pts.push(p.x, p.y);
  } else if (w) finishStroke(s, w);
}

/** 틱마다 (쉐도잉 붓을 들었을 때 player에서) */
export function shadowingTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  const key = roomKey(s);
  if (p.sdRoom !== key) {
    p.sdRoom = key;
    p.sdStrokes = [];
    p.sdSpirits = [];
    p.sdZones = [];
  }
  const b = brushPoint(s);
  if (b) [p.sdBx, p.sdBy] = b;
  else delete p.sdBx;
  artsTick(s);
  wingsTick(s);
  const k = drawing(p);
  if (want && b) paint(s, b[0], b[1]);
  else if (k) finishStroke(s, k);
  // 그리는 획이 없으면 잠깐 뒤 잉크가 참 (누르고 있어도 잉크가 모자라 쉬는 동안은 참)
  if (drawing(p)) p.sdWait = SD.refillDelay;
  else if ((p.sdWait ?? 0) > 0) p.sdWait = (p.sdWait ?? 0) - 1;
  else p.sdInk = Math.min(SD.ink, inkOf(p) + SD.refill * speed);
  strokesTick(s, speed);
  spiritsTick(s);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetShadowing(p: P): void {
  for (const k of ["sdStrokes", "sdNext", "sdDone", "sdRoom", "sdInk", "sdWait", "sdBx", "sdBy", "sdSpirits", "sdZones", "sdFly", "sdClockT", "sdClockCd", "sdCometCd", "sdGateT", "sdDash"] as const) delete p[k];
}

/** 황금 문: 봉인 원 안에서 받는 피해 줄임 */
export const shadowingTaken = (p: P) => ((p.sdGateT ?? 0) > 0 ? K.sdGate.taken : 1);
