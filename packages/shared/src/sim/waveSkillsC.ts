// 웨이브 기술 13~18: 파도 타기 · 물방울 회오리 · 만조 · 물고기 떼 · 물밧줄 · 물풍선 (+ 물방울 · 웅덩이)
import { WAVE_PERKS as K } from "../itemsWave";
import { rot } from "./orbit";
import { alive, isBoss, onSegment, stun } from "./s2Kit";
import type { RunState } from "./types";
import { dist2, keepInRoom, normalize, roomGrid } from "./util";
import { addBit, anchored, big, burstAt, clampIn, dmgOf, foeById, isWall, nearest, wvHit } from "./waveKit";
import { wvFx as fx, type BitStep, type SkillCast } from "./waveSkillsA";

export const CASTS_C: Record<string, SkillCast> = {
  wvSurf: (s, m) => {
    const p = s.player;
    p.wvSurf = { dx: p.faceX, dy: p.faceY, t: K.wvSurf.ticks, hit: [], m };
  },
  wvSpiral: (s, m) => {
    const p = s.player;
    addBit(s, { k: "wvSpiral", x: p.x, y: p.y, dx: p.faceX, dy: p.faceY, t: K.wvSpiral.ticks, mul: K.wvSpiral.mul * m, n: 0 });
  },
  wvFlood: (s, m) => {
    const p = s.player;
    p.wvFlood = K.wvFlood.ticks;
    p.wvFloodMul = m;
    fx(s, "wvFloodWave", p.x, p.y, 120, 40);
  },
  wvSchool: (s, m) => {
    const p = s.player;
    addBit(s, { k: "wvSchool", x: p.x + p.faceX * 10, y: p.y + p.faceY * 10, dx: p.faceX, dy: p.faceY, t: K.wvSchool.ticks, mul: K.wvSchool.mul * m, tg: nearest(s, p.x, p.y, 220)?.id });
  },
  wvRope: (s, m) => {
    const p = s.player;
    const k = K.wvRope;
    const ids: number[] = [];
    for (let i = 0; i < k.n; i++) {
      const e = nearest(s, p.x, p.y, k.reach, ids);
      if (!e) break;
      ids.push(e.id);
    }
    if (ids.length === 0) return fx(s, "wvSplash", p.x + p.faceX * 20, p.y + p.faceY * 20, 14, 18);
    addBit(s, { k: "wvRope", x: p.x, y: p.y, dx: 0, dy: 0, t: k.wait, mul: m, ids });
  },
  wvBalloon: (s, m) => {
    const p = s.player;
    const k = K.wvBalloon;
    const e = nearest(s, p.x, p.y, k.reach);
    const to = e ? { x: e.x, y: e.y } : clampIn(s, p.x + p.faceX * 120, p.y + p.faceY * 120);
    addBit(s, { k: "wvBalloon", x: p.x, y: p.y, dx: p.faceX, dy: p.faceY, t: k.flight, mul: k.mul * m, pts: [p.x, p.y, to.x, to.y] });
  },
};

/** 파도 타기 한 틱 (sim/wave): 무적으로 내달리며 앞을 쓸어 버림 → 끝에 물보라. 끝나면 false */
export function surfTick(s: RunState): boolean {
  const p = s.player;
  const v = p.wvSurf;
  if (!v) return false;
  const k = K.wvSurf;
  p.invulnTicks = Math.max(p.invulnTicks, 3);
  const ax = p.x;
  const ay = p.y;
  p.x += v.dx * k.step;
  p.y += v.dy * k.step;
  keepInRoom(p, roomGrid(s));
  p.faceX = v.dx;
  p.faceY = v.dy;
  for (const e of onSegment(s, ax, ay, p.x + v.dx * 8, p.y + v.dy * 8, 14 * big(p))) {
    if (v.hit.includes(e.id)) continue;
    v.hit.push(e.id);
    wvHit(s, e, dmgOf(s, k.mul * v.m), ax - v.dx * 10, ay - v.dy * 10, k.push);
  }
  const stuck = Math.hypot(p.x - ax, p.y - ay) < k.step * 0.3;
  if (--v.t > 0 && !stuck) return true;
  burstAt(s, p.x, p.y, k.r * big(p), dmgOf(s, k.end * v.m), 10);
  fx(s, "wvSurfEnd", p.x, p.y, k.r * big(p), 30, { dirX: v.dx, dirY: v.dy });
  delete p.wvSurf;
  return false;
}

/** 만조 한 틱 (sim/wave): 방 전체 물에 잠김 · 간격마다 모든 적 피해·둔화 */
export function floodTick(s: RunState): void {
  const p = s.player;
  if (!p.wvFlood) return;
  const k = K.wvFlood;
  if (p.wvFlood % k.every === 0) {
    for (const e of alive(s)) {
      wvHit(s, e, dmgOf(s, k.mul * (p.wvFloodMul ?? 1)), p.x, p.y);
      if (!isBoss(e)) e.slowTicks = Math.max(e.slowTicks ?? 0, k.slow);
    }
    fx(s, "wvFloodWave", p.x, p.y, 90, 30);
  }
  if (--p.wvFlood <= 0) {
    delete p.wvFlood;
    delete p.wvFloodMul;
  }
}

export const STEPS_C: Record<string, BitStep> = {
  /** 몸을 따라가며 두 갈래 나선으로 물방울을 쏟음 */
  wvSpiral: (s, b) => {
    const p = s.player;
    const k = K.wvSpiral;
    b.x = p.x;
    b.y = p.y;
    const age = b.t0 - b.t;
    if (age % k.every === 0) {
      const [c, sn] = rot((b.n ?? 0) * k.turn);
      b.n = (b.n ?? 0) + 1;
      for (const sg of [1, -1]) addBit(s, { k: "wvDrop", x: p.x + c * sg * 6, y: p.y + sn * sg * 6 - 3, dx: c * sg, dy: sn * sg, t: Math.ceil(k.range / k.speed), mul: b.mul, v: k.speed });
    }
    return --b.t > 0;
  },
  /** 물방울 하나: 곧게 날아가 처음 닿은 적 */
  wvDrop: (s, b) => {
    b.x += b.dx * (b.v ?? 4);
    b.y += b.dy * (b.v ?? 4);
    for (const e of alive(s)) {
      if (dist2(e, b) > (e.r + 3) ** 2) continue;
      wvHit(s, e, dmgOf(s, b.mul), b.x - b.dx * 3, b.y - b.dy * 3, 1);
      fx(s, "wvSplash", b.x, b.y, 6, 10);
      return false;
    }
    return --b.t > 0 && !isWall(s, b.x, b.y);
  },
  /** 물고기 떼: 적을 따라 감싸 돌며 뜯어먹음 (적이 쓰러지면 다음 적) */
  wvSchool: (s, b) => {
    const k = K.wvSchool;
    let e = foeById(s, b.tg);
    if (!e) {
      e = nearest(s, b.x, b.y, 220);
      b.tg = e?.id;
    }
    if (e) {
      const to = normalize(e.x - b.x, e.y - b.y);
      const d = Math.sqrt(dist2(e, b));
      if (to) {
        b.x += to[0] * Math.min(k.speed, d);
        b.y += to[1] * Math.min(k.speed, d);
      }
    }
    const age = b.t0 - b.t;
    if (age % k.every === 0) burstAt(s, b.x, b.y, k.r * big(s.player), dmgOf(s, b.mul));
    return --b.t > 0;
  },
  /** 물밧줄: 묶인 적 가운데로 줄이 당겨짐 → 끝에 한데 끌어 부딪힘 */
  wvRope: (s, b) => {
    const k = K.wvRope;
    const tied = (b.ids ?? []).map((id) => foeById(s, id)).filter((e) => e !== undefined);
    if (tied.length === 0) return false;
    b.x = tied.reduce((a, e) => a + e.x, 0) / tied.length;
    b.y = tied.reduce((a, e) => a + e.y, 0) / tied.length;
    if (--b.t > 0) return true;
    const dmg = dmgOf(s, (k.mul + k.per * tied.length) * b.mul);
    for (const e of tied) {
      if (!anchored(e)) {
        e.x = b.x + (e.x - b.x) * 0.2;
        e.y = b.y + (e.y - b.y) * 0.2;
        keepInRoom(e, roomGrid(s));
      }
      wvHit(s, e, dmg, b.x, b.y);
      stun(e, k.stun);
    }
    fx(s, "wvRopeCrash", b.x, b.y, 26, 26);
    return false;
  },
  /** 포물선으로 날아가 터짐 → 웅덩이 */
  wvBalloon: (s, b) => {
    const k = K.wvBalloon;
    const [x0, y0, x1, y1] = b.pts as [number, number, number, number];
    const f = 1 - b.t / b.t0;
    b.x = x0 + (x1 - x0) * f;
    b.y = y0 + (y1 - y0) * f;
    if (--b.t > 0) return true;
    const r = k.r * big(s.player);
    burstAt(s, x1, y1, r, dmgOf(s, b.mul), 8);
    fx(s, "wvBalloonPop", x1, y1, r, 28);
    addBit(s, { k: "wvPuddle", x: x1, y: y1, dx: 0, dy: 0, t: k.pool, mul: (b.mul * k.poolMul) / k.mul, v: r });
    return false;
  },
  /** 미끄러운 웅덩이: 밟은 적 둔화 · 간격마다 피해 */
  wvPuddle: (s, b) => {
    const k = K.wvBalloon;
    const r = b.v ?? k.r;
    for (const e of alive(s)) if (!isBoss(e) && dist2(e, b) <= (r + e.r) ** 2) e.slowTicks = Math.max(e.slowTicks ?? 0, 6);
    if ((b.t0 - b.t) % k.every === k.every - 1) burstAt(s, b.x, b.y, r, dmgOf(s, b.mul));
    return --b.t > 0;
  },
};
