// 웨이브 기술 7~12: 물시계 · 해파리 등불 · 물거울 · 소나기 구름 · 용오름 · 물연꽃
import { WAVE_PERKS as K } from "../itemsWave";
import { createRng, deriveSeed } from "../rng";
import { rot } from "./orbit";
import { alive, isBoss, onSegment } from "./s2Kit";
import type { WvBit } from "./waveTypes";
import { dist2, normalize } from "./util";
import { addBit, anchored, big, burstAt, clampIn, densest, dmgOf, foeById, isWall, moveFoe, nearest, strongest, wvHit } from "./waveKit";
import { wvFx as fx, type BitStep, type SkillCast } from "./waveSkillsA";

const TAU = Math.PI * 2;

/** 해파리 셋 자리 (가운데 둘레 삼각형, 천천히 돎) — 화면도 같이 씀 */
export function jellyPts(b: Pick<WvBit, "x" | "y" | "t" | "t0">, r = K.wvJelly.r): [number, number][] {
  const spin = (b.t0 - b.t) * 0.02;
  return [0, 1, 2].map((i) => {
    const [c, sn] = rot(spin + (i * TAU) / 3);
    return [b.x + c * r, b.y + sn * r * 0.8];
  });
}

export const CASTS_B: Record<string, SkillCast> = {
  wvClock: (s, m) => {
    const at = densest(s);
    addBit(s, { k: "wvClock", x: at.x, y: at.y, dx: 0, dy: 0, t: K.wvClock.ticks, mul: K.wvClock.mul * m });
  },
  wvJelly: (s, m) => {
    const p = s.player;
    const at = clampIn(s, p.x + p.faceX * 40, p.y + p.faceY * 40);
    addBit(s, { k: "wvJelly", x: at.x, y: at.y, dx: 0, dy: 0, t: K.wvJelly.ticks, mul: K.wvJelly.mul * m });
  },
  wvMirror: (s, m) => {
    const p = s.player;
    const at = clampIn(s, p.x - p.faceX * K.wvMirror.back, p.y - p.faceY * K.wvMirror.back);
    addBit(s, { k: "wvMirror", x: at.x, y: at.y, dx: p.faceX, dy: p.faceY, t: K.wvMirror.ticks, mul: m });
  },
  wvCloud: (s, m) => {
    const p = s.player;
    addBit(s, { k: "wvCloud", x: p.x, y: p.y - 10, dx: 0, dy: 0, t: K.wvCloud.ticks, mul: K.wvCloud.mul * m, tg: strongest(s)?.id });
  },
  wvSpout: (s, m) => {
    const p = s.player;
    addBit(s, { k: "wvSpout", x: p.x + p.faceX * 16, y: p.y + p.faceY * 16, dx: p.faceX, dy: p.faceY, t: K.wvSpout.ticks, mul: K.wvSpout.mul * m });
  },
  wvLotus: (s, m) => {
    const p = s.player;
    const k = K.wvLotus;
    const e = nearest(s, p.x, p.y, 170);
    const at = e ? { x: e.x, y: e.y } : clampIn(s, p.x + p.faceX * 50, p.y + p.faceY * 50);
    addBit(s, { k: "wvLotus", x: at.x, y: at.y, dx: p.faceX, dy: p.faceY, t: k.bloom + k.petals * k.every + 10, mul: m, n: 0 });
  },
};

export const STEPS_B: Record<string, BitStep> = {
  /** 둘레 시간이 느려짐: 적은 둔화 · 적 탄은 천천히 · 째깍마다 피해 */
  wvClock: (s, b) => {
    const k = K.wvClock;
    const r = k.r * big(s.player);
    for (const e of alive(s)) if (dist2(e, b) <= (r + e.r) ** 2 && !isBoss(e)) e.slowTicks = Math.max(e.slowTicks ?? 0, 2);
    for (const q of s.projectiles) {
      if (q.fromPlayer || dist2(q, b) > r * r) continue;
      q.x -= q.vx * (1 - k.shot);
      q.y -= q.vy * (1 - k.shot);
    }
    const age = b.t0 - b.t;
    if (age > 0 && age % k.every === 0) burstAt(s, b.x, b.y, r, dmgOf(s, b.mul));
    return --b.t > 0;
  },
  /** 떠다니는 해파리 셋: 가까운 적 쪽으로 · 찌릿마다 서로 잇는 전기 줄·몸에 닿은 적 감전 (한 번에 한 적 한 번) */
  wvJelly: (s, b) => {
    const k = K.wvJelly;
    const e = nearest(s, b.x, b.y);
    const to = e && normalize(e.x - b.x, e.y - b.y);
    if (to && dist2(e, b) > 100) {
      b.x += to[0] * k.speed;
      b.y += to[1] * k.speed;
    }
    const age = b.t0 - b.t;
    if (age % k.every === 0) {
      const pts = jellyPts(b, k.r * big(s.player));
      const got = new Set<number>();
      for (let i = 0; i < 3; i++) {
        const [ax, ay] = pts[i]!;
        const [bx, by] = pts[(i + 1) % 3]!;
        for (const o of onSegment(s, ax, ay, bx, by, 6)) got.add(o.id);
        for (const o of alive(s)) if (dist2(o, { x: ax, y: ay }) <= (10 + o.r) ** 2) got.add(o.id);
      }
      for (const o of alive(s)) if (got.has(o.id)) wvHit(s, o, dmgOf(s, b.mul), b.x, b.y);
      if (got.size > 0) fx(s, "wvZap", b.x, b.y, k.r, 10);
    }
    return --b.t > 0;
  },
  /** 물거울: 가만히 서서 나를 따라 바라봄 (초승달은 sim/wave가 같이 날림) */
  wvMirror: (s, b) => {
    b.dx = s.player.faceX;
    b.dy = s.player.faceY;
    return --b.t > 0;
  },
  /** 센 적을 따라가며 빗방울 */
  wvCloud: (s, b) => {
    const k = K.wvCloud;
    let e = foeById(s, b.tg);
    if (!e) {
      e = strongest(s);
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
    if (age > 12 && age % k.every === 0) {
      const rng = createRng(deriveSeed(s.seed, "wvRain", s.tick, b.t0));
      const x = b.x + (rng.nextFloat() - 0.5) * 32;
      const y = b.y + (rng.nextFloat() - 0.5) * 24;
      for (const o of burstAt(s, x, y, k.r, dmgOf(s, b.mul))) if (!isBoss(o)) o.slowTicks = Math.max(o.slowTicks ?? 0, 20);
      fx(s, "wvSplash", x, y, 7, 12);
    }
    return --b.t > 0;
  },
  /** 물 회오리: 벽에 튕기며 돌아다니고 둘레 적을 빨아들여 돌림 */
  wvSpout: (s, b) => {
    const k = K.wvSpout;
    const r = k.r * big(s.player);
    if (isWall(s, b.x + b.dx * k.speed * 3, b.y)) b.dx = -b.dx;
    if (isWall(s, b.x, b.y + b.dy * k.speed * 3)) b.dy = -b.dy;
    b.x += b.dx * k.speed;
    b.y += b.dy * k.speed;
    for (const e of alive(s)) {
      const d2 = dist2(e, b);
      if (d2 > (r + e.r) ** 2 || anchored(e)) continue;
      const to = normalize(b.x - e.x, b.y - e.y);
      // 끌려오면서 회오리 둘레로 돌아감
      if (to) moveFoe(s, e, (to[0] - to[1] * 0.8) * k.pull * (d2 > 64 ? 1 : 0.2), (to[1] + to[0] * 0.8) * k.pull * (d2 > 64 ? 1 : 0.2));
    }
    const age = b.t0 - b.t;
    if (age % k.every === 0) burstAt(s, b.x, b.y, r, dmgOf(s, b.mul));
    return --b.t > 0;
  },
  /** 꽃이 피고 꽃잎이 하나씩 소용돌이로 날아감 → 끝에 가운데 터짐 */
  wvLotus: (s, b) => {
    const k = K.wvLotus;
    const age = b.t0 - b.t;
    if (age >= k.bloom && (age - k.bloom) % k.every === 0 && (b.n ?? 0) < k.petals) {
      const [c, sn] = rot(((b.n ?? 0) * TAU) / k.petals);
      addBit(s, { k: "wvPetal", x: b.x, y: b.y, dx: c, dy: sn, t: Math.ceil(k.range / k.speed), mul: k.mul * b.mul, hit: [] });
      b.n = (b.n ?? 0) + 1;
    }
    if (--b.t > 0) return true;
    burstAt(s, b.x, b.y, 30 * big(s.player), dmgOf(s, k.core * b.mul), 8);
    fx(s, "wvBloom", b.x, b.y, 30 * big(s.player), 26);
    return false;
  },
  /** 꽃잎: 휘어 돌며 뚫고 날아감 */
  wvPetal: (s, b) => {
    const k = K.wvLotus;
    const [c, sn] = rot(0.045);
    [b.dx, b.dy] = [b.dx * c - b.dy * sn, b.dx * sn + b.dy * c];
    b.x += b.dx * k.speed;
    b.y += b.dy * k.speed;
    for (const e of alive(s)) {
      if (b.hit!.includes(e.id) || dist2(e, b) > (e.r + 6) ** 2) continue;
      b.hit!.push(e.id);
      wvHit(s, e, dmgOf(s, b.mul), b.x - b.dx * 4, b.y - b.dy * 4, 3);
    }
    return --b.t > 0 && !isWall(s, b.x, b.y);
  },
};
