// 웨이브 기술 25~30: 대왕 문어 · 물의 날개 · 심해의 눈 · 밀물 썰물 · 물발자국 · 자유의 해일 (+ 깃털)
import { WAVE_PERKS as K } from "../itemsWave";
import { WAVE } from "../weaponsWave";
import { rot } from "./orbit";
import { alive, isBoss, onSegment, stun } from "./s2Kit";
import type { RunState } from "./types";
import { dist2, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";
import { addBit, anchored, big, burstAt, densest, dmgOf, foeById, isWall, moveFoe, nearest, steer, strongest, turnDir, wvHit } from "./waveKit";
import { wvFx as fx, type BitStep, type SkillCast } from "./waveSkillsA";

const TAU = Math.PI * 2;

export const CASTS_E: Record<string, SkillCast> = {
  wvOctopus: (s, m) => {
    const p = s.player;
    const at = densest(s);
    const k = K.wvOctopus;
    addBit(s, { k: "wvOctopus", x: at.x, y: at.y, dx: p.faceX, dy: p.faceY, t: k.arms * k.every + 16, mul: k.mul * m, n: 0 });
  },
  wvWings: (s, m) => {
    const p = s.player;
    p.wvWings = K.wvWings.ticks;
    p.wvWingsMul = m;
  },
  wvEye: (s, m) => {
    const p = s.player;
    const e = strongest(s);
    addBit(s, { k: "wvEye", x: e?.x ?? p.x + p.faceX * 50, y: e?.y ?? p.y + p.faceY * 50, dx: 0, dy: 0, t: K.wvEye.ticks, mul: K.wvEye.mul * m, tg: e?.id });
  },
  wvEbb: (s, m) => {
    const p = s.player;
    const k = K.wvEbb;
    addBit(s, { k: "wvEbb", x: p.x, y: p.y, dx: 0, dy: 0, t: k.out + k.hold + k.in, mul: k.mul * m, v: 0, hit: [], n: 0 });
  },
  wvTrail: (s, m) => {
    const p = s.player;
    let pts = [...(p.wvSteps ?? [])];
    // 가만히 서 있었으면 앞으로 한 줄
    if (pts.length < 8) {
      pts = [];
      for (let i = 0; i < 10; i++) pts.push(p.x + p.faceX * i * 10, p.y + p.faceY * i * 10);
    }
    addBit(s, { k: "wvTrail", x: p.x, y: p.y, dx: 0, dy: 0, t: (pts.length / 2) * K.wvTrail.every + 2, mul: K.wvTrail.mul * m, n: 0, pts, hit: [] });
  },
  wvTsunami: (s, m) => {
    const p = s.player;
    addBit(s, { k: "wvTsunami", x: p.x - p.faceX * 30, y: p.y - p.faceY * 30, dx: p.faceX, dy: p.faceY, t: K.wvTsunami.ticks, mul: K.wvTsunami.mul * m, hit: [] });
  },
};

/** 물의 날개 한 틱 (sim/wave): 날갯짓마다 깃털이 가까운 적 쪽으로 펼쳐 날아감 */
export function wingsTick(s: RunState): void {
  const p = s.player;
  if (!p.wvWings) return;
  const k = K.wvWings;
  if (p.wvWings % k.every === 0) {
    const e = nearest(s, p.x, p.y, 220);
    const [ax, ay] = (e && normalize(e.x - p.x, e.y - p.y)) || [p.faceX, p.faceY];
    for (let i = 0; i < k.n; i++) {
      const [c, sn] = rot((i - (k.n - 1) / 2) * 0.45);
      const [dx, dy] = turnDir(ax, ay, c, sn);
      addBit(s, { k: "wvFeather", x: p.x - dx * 4, y: p.y - 6, dx, dy, t: Math.ceil(k.range / k.speed), mul: k.mul * (p.wvWingsMul ?? 1), tg: e?.id });
    }
    fx(s, "wvFeather", p.x, p.y - 6, 18, 18, { dirX: ax, dirY: ay });
  }
  if (--p.wvWings <= 0) {
    delete p.wvWings;
    delete p.wvWingsMul;
  }
}

/** 이동 속도 배율 (moveMul): 물의 날개 · 만조 */
export const waveMoveMul = (p: { wvWings?: number; wvFlood?: number }) => ((p.wvWings ?? 0) > 0 ? WAVE.wingsMove : 1) * ((p.wvFlood ?? 0) > 0 ? WAVE.floodMove : 1);

export const STEPS_E: Record<string, BitStep> = {
  /** 문어 다리: 바라보는 쪽부터 차례로 바깥으로 내리침 */
  wvOctopus: (s, b) => {
    const k = K.wvOctopus;
    const age = b.t0 - b.t;
    const n = b.n ?? 0;
    if (age >= 8 && (age - 8) % k.every === 0 && n < k.arms) {
      const [c, sn] = rot((n * TAU * 3) / k.arms);
      const [dx, dy] = turnDir(b.dx, b.dy, c, sn);
      const len = k.len * big(s.player);
      // 다리는 가운데에서 조금 떨어져 바깥으로 (한가운데 적이 여덟 번 다 맞지 않게)
      for (const e of onSegment(s, b.x + dx * 16, b.y + dy * 16, b.x + dx * len, b.y + dy * len, k.w)) wvHit(s, e, dmgOf(s, b.mul), b.x, b.y, k.push);
      fx(s, "wvSlam", b.x, b.y, k.w, 20, { toX: b.x + dx * len, toY: b.y + dy * len });
      b.n = n + 1;
    }
    return --b.t > 0;
  },
  /** 깃털: 살짝 휘어 쫓아가 처음 닿은 적 */
  wvFeather: (s, b) => {
    const k = K.wvWings;
    const e = foeById(s, b.tg);
    if (e) steer(b, e.x, e.y, 0.07);
    b.x += b.dx * k.speed;
    b.y += b.dy * k.speed;
    for (const o of alive(s)) {
      if (dist2(o, b) > (o.r + 3) ** 2) continue;
      wvHit(s, o, dmgOf(s, b.mul), b.x - b.dx * 3, b.y - b.dy * 3, 1);
      return false;
    }
    return --b.t > 0 && !isWall(s, b.x, b.y);
  },
  /** 심해의 눈: 센 적 밑에서 노려봄 → 수압으로 짓누름 */
  wvEye: (s, b) => {
    const k = K.wvEye;
    const e = foeById(s, b.tg);
    if (e) [b.x, b.y] = [e.x, e.y];
    if (--b.t > 0) return true;
    const r = k.r * big(s.player);
    if (e) wvHit(s, e, dmgOf(s, b.mul), e.x, e.y - 1);
    burstAt(s, b.x, b.y, r, dmgOf(s, (b.mul * k.near) / k.mul), 10, e ? [e.id] : []);
    fx(s, "wvCrush", b.x, b.y, r, 36);
    return false;
  },
  /** 밀물 썰물: 고리가 밀려 나가며 밀치고, 다시 밀려 들어오며 끌어당김 (두 번 침) */
  wvEbb: (s, b) => {
    const k = K.wvEbb;
    const R = k.r * big(s.player);
    const age = b.t0 - b.t;
    const r0 = b.v ?? 0;
    const r = age < k.out ? (R * (age + 1)) / k.out : age < k.out + k.hold ? R : R * (1 - (age - k.out - k.hold + 1) / k.in);
    b.v = r;
    if (age === k.out + k.hold) {
      b.hit = [];
      fx(s, "wvRing", b.x, b.y, R, k.in + 4, { dirX: -1 });
    }
    if (age === 0) fx(s, "wvRing", b.x, b.y, R, k.out + 4, { dirX: 1 });
    const out = age < k.out;
    for (const e of alive(s)) {
      const d = Math.sqrt(dist2(e, b));
      if (d > R + e.r) continue;
      const crossed = out ? d <= r + e.r && d >= r0 - e.r - 2 : age >= k.out + k.hold && d >= r - e.r;
      if (crossed && !b.hit!.includes(e.id)) {
        b.hit!.push(e.id);
        wvHit(s, e, dmgOf(s, b.mul), b.x, b.y, out ? k.push : 0);
      }
      // 들어오는 고리에 실려 가운데로
      if (!out && age >= k.out + k.hold && d > r && r > 24 && !anchored(e)) {
        const to = normalize(b.x - e.x, b.y - e.y);
        if (to) moveFoe(s, e, to[0] * Math.min(d - r, 3), to[1] * Math.min(d - r, 3));
      }
    }
    return --b.t > 0;
  },
  /** 물발자국: 오래된 자리부터 차례로 물가시 (한 적은 cap번까지) */
  wvTrail: (s, b) => {
    const k = K.wvTrail;
    const pts = b.pts ?? [];
    const age = b.t0 - b.t;
    if (age % k.every === 0 && (b.n ?? 0) * 2 < pts.length) {
      const i = (b.n ?? 0) * 2;
      const x = pts[i]!;
      const y = pts[i + 1]!;
      for (const e of alive(s)) {
        if (dist2(e, { x, y }) > (k.r + e.r) ** 2) continue;
        if (b.hit!.filter((id) => id === e.id).length >= k.cap) continue;
        b.hit!.push(e.id);
        wvHit(s, e, dmgOf(s, b.mul), x, y + 4, 2);
        stun(e, 6);
      }
      fx(s, "wvSpike", x, y, k.r, 22);
      b.n = (b.n ?? 0) + 1;
    }
    return --b.t > 0;
  },
  /** 자유의 해일: 방을 가로지르는 띠가 지나간 적을 한 번씩 치고 밀어 실어 감 */
  wvTsunami: (s, b) => {
    const k = K.wvTsunami;
    b.x += b.dx * k.speed;
    b.y += b.dy * k.speed;
    const depth = k.depth * big(s.player);
    for (const e of alive(s)) {
      const along = (e.x - b.x) * b.dx + (e.y - b.y) * b.dy;
      if (Math.abs(along) > depth + e.r) continue;
      if (!b.hit!.includes(e.id)) {
        b.hit!.push(e.id);
        wvHit(s, e, dmgOf(s, b.mul), e.x - b.dx * 10, e.y - b.dy * 10, isBoss(e) ? 0 : k.push * 0.4);
        stun(e, k.stun);
        fx(s, "wvTsunamiHit", e.x, e.y, 12, 18, { dirX: b.dx, dirY: b.dy });
      }
      if (!anchored(e)) moveFoe(s, e, b.dx * k.carry, b.dy * k.carry);
    }
    const out = b.x < ROOM_MIN_X - 40 || b.x > ROOM_MAX_X + 40 || b.y < ROOM_MIN_Y - 40 || b.y > ROOM_MAX_Y + 40;
    return --b.t > 0 && !out;
  },
};
