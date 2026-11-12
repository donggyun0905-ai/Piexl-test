// 아리아(실베르): 누르면 음표가 느리게 둥실둥실 앞으로 날아가 방 끝까지 감 (뚫고 지나가며 적마다 한 번씩, 무기마다 모양 weaponsAria.AR_STYLE)
// 음표 8종 중 하나 (방에 없는 종류를 먼저 고를 때가 많음) · 방에 서로 다른 음표 8개가 모이면 터짐(sim/arBurst) → 악기 넷이 다 있으면 악보 완성(sim/arFinale)
// 공격마다 악기 놓기·악기 연주·바이올린(sim/arInstruments) · 화음·돌림노래·포르티시모는 여기서
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";
import { ARIA_PERKS as K } from "../itemsAria";
import { AR_NOTE as N } from "../weaponsAria";
import { burstTick, checkBurst } from "./arBurst";
import { finaleTick } from "./arFinale";
import { instOnAttack, instTick } from "./arInstruments";
import { arAlive, arArea, arHit, arNearest, arRng, arRoll, hasAr, styleOf } from "./arKit";
import type { ArNote } from "./arTypes";
import { applyBleed, updateBleed } from "./gunExtras";
import { rot } from "./orbit";
import { ignite } from "./status";
import type { EnemyState, RunState } from "./types";
import { addEffect, normalize, reachOf } from "./util";

type P = RunState["player"];

export { isAria } from "./arKit";

const roomKey = (s: RunState) => s.floor * 1000 + s.roomId;

/** 음표 피해 배율 (포르티시모) */
const noteMul = (p: P) => (hasAr(p, "arForte") ? K.arForte.mul : 1);

/** 다음 음표 종류: 확률로 방에 없는 종류 · 아니면 아무거나 (skip은 이번에 이미 고른 종류) */
function pickKind(s: RunState, skip: number[]): number {
  const have = new Set([...(s.player.arNotes ?? []).map((n) => n.kind), ...skip]);
  const rng = arRng(s, "arKind");
  const missing = [...Array(N.kinds).keys()].filter((k) => !have.has(k));
  if (missing.length && rng.nextFloat() < N.prefer) return missing[Math.floor(rng.nextFloat() * missing.length)]!;
  const free = [...Array(N.kinds).keys()].filter((k) => !skip.includes(k));
  return free[Math.floor(rng.nextFloat() * free.length)] ?? 0;
}

/** 음표 하나 날리기 */
function launch(s: RunState, dx: number, dy: number, kind: number, mul: number): void {
  const p = s.player;
  const st = styleOf(p);
  const k = reachOf(p);
  const list = (p.arNotes ??= []);
  const [x, y] = [p.x + dx * 10, p.y + dy * 10 - 4];
  list.push({ bx: x, by: y, dx, dy, spd: st.speed * Math.sqrt(k), bob: st.bob, age: 0, kind, r: st.r * Math.sqrt(k), dmg: p.stats.damage * st.mul * mul * noteMul(p), hit: [], bounce: hasAr(p, "arCanon") ? K.arCanon.bounces : 0, x, y, prevX: x, prevY: y });
  if (list.length > N.cap) list.shift();
}

/** 공격 한 번: 무기의 음표 수만큼 부채꼴 · 화음이면 다른 종류 하나 더 */
function attack(s: RunState): void {
  const p = s.player;
  const st = styleOf(p);
  const used: number[] = [];
  const base = Math.atan2(p.faceY, p.faceX);
  for (let i = 0; i < st.n; i++) {
    const v = rot(base + (i - (st.n - 1) / 2) * st.spread);
    const kind = pickKind(s, used);
    used.push(kind);
    launch(s, v[0], v[1], kind, 1);
  }
  if (hasAr(p, "arChord"))
    for (let i = 0; i < K.arChord.n; i++) {
      const v = rot(base + 0.18 * (i + 1));
      const kind = pickKind(s, used);
      used.push(kind);
      launch(s, v[0], v[1], kind, K.arChord.mul);
    }
}

/** 무기 속성 (맞은 적) */
function status(s: RunState, e: EnemyState, n: ArNote): void {
  const st = styleOf(s.player);
  if (!st.status || e.hp <= 0) return;
  if (st.chance < 1 && arRoll(s, "arStatus") >= st.chance) return;
  if (st.status === 1) ignite(e, n.dmg);
  else if (st.status === 2) e.slowTicks = Math.max(e.slowTicks ?? 0, st.ticks);
  else if (st.status === 3) e.stunTicks = Math.max(e.stunTicks ?? 0, st.ticks);
  else if (st.status === 4) applyBleed(e);
  else if (st.status === 5) arArea(s, e.x, e.y, st.ticks, n.dmg * N.echoMul, "arEcho", n.kind, 16);
}

/** 음표 움직임: 곧게 나아가며 옆으로 둥실 · 리라는 가까운 적에게 휨 · 방 끝에서 사라짐(돌림노래는 튕김) · 닿은 적 한 번씩 */
function notesTick(s: RunState): void {
  const p = s.player;
  const st = styleOf(p);
  const keep: ArNote[] = [];
  for (const n of p.arNotes ?? []) {
    n.prevX = n.x;
    n.prevY = n.y;
    n.age++;
    if (st.home > 0) {
      const e = arNearest(s, n.x, n.y, N.lyreSight, n.hit);
      const d = e ? normalize(e.x - n.x, e.y - n.y) : null;
      if (d) [n.dx, n.dy] = normalize(n.dx + d[0] * st.home, n.dy + d[1] * st.home) ?? [n.dx, n.dy];
    }
    n.bx += n.dx * n.spd;
    n.by += n.dy * n.spd;
    if (n.bx < ROOM_MIN_X || n.bx > ROOM_MAX_X || n.by < ROOM_MIN_Y || n.by > ROOM_MAX_Y) {
      if (n.bounce <= 0) continue;
      n.bounce--;
      if (n.bx < ROOM_MIN_X || n.bx > ROOM_MAX_X) n.dx = -n.dx;
      if (n.by < ROOM_MIN_Y || n.by > ROOM_MAX_Y) n.dy = -n.dy;
      n.bx = Math.min(ROOM_MAX_X, Math.max(ROOM_MIN_X, n.bx));
      n.by = Math.min(ROOM_MAX_Y, Math.max(ROOM_MIN_Y, n.by));
      n.hit = [];
    }
    if (n.age > N.life) continue;
    const w = rot(n.age * N.bobSpeed)[1] * n.bob;
    n.x = n.bx - n.dy * w;
    n.y = n.by + n.dx * w;
    for (const e of s.enemies) {
      if (!arAlive(e) || n.hit.includes(e.id) || (e.x - n.x) ** 2 + (e.y - n.y) ** 2 > (n.r + e.r) ** 2) continue;
      n.hit.push(e.id);
      arHit(s, e, n.dmg, n.dx, n.dy);
      status(s, e, n);
      addEffect(s, { kind: "arPop", x: n.x, y: n.y, dirX: 0, dirY: 0, size: n.r, style: n.kind, maxTicks: 12 });
    }
    keep.push(n);
  }
  p.arNotes = keep;
}

/** 틱마다 (음표 무기를 들었을 때 player에서) */
export function ariaTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  const key = roomKey(s);
  if (p.arRoom !== key) {
    p.arRoom = key;
    p.arNotes = [];
    p.arInst = [];
    p.arShots = [];
    p.arEchoes = [];
    delete p.arFinale;
    delete p.arViolin;
  }
  if ((p.arCd ?? 0) > 0) p.arCd = (p.arCd ?? 0) - 1;
  if (want && (p.arCd ?? 0) <= 0) {
    const st = styleOf(p);
    p.arCd = Math.max(6, Math.round(st.cd / Math.max(0.3, speed)));
    p.attackCount++;
    p.arAtkAt = s.tick;
    attack(s);
    instOnAttack(s);
  }
  notesTick(s);
  checkBurst(s);
  burstTick(s);
  instTick(s);
  finaleTick(s);
  if (styleOf(p).status === 4) updateBleed(s);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetAria(p: P): void {
  for (const k of ["arCd", "arRoom", "arAtkAt", "arNotes", "arInst", "arShots", "arEchoes", "arViolin", "arFinale", "arFinaleReady", "arBoomAt", "arBursts", "arRolls"] as const) delete p[k];
}
