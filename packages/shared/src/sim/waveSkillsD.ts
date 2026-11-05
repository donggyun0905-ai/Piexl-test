// 웨이브 기술 19~24: 진주 구슬 · 물의 손 · 분수 · 물수제비 · 인어의 노래 · 물안개 (+ 물방울 포물선 · 음표)
import { WAVE_PERKS as K } from "../itemsWave";
import { createRng, deriveSeed } from "../rng";
import { rot } from "./orbit";
import { alive, isBoss, onSegment, stun } from "./s2Kit";
import type { RunState } from "./types";
import { dist2 } from "./util";
import { addBit, big, burstAt, clampIn, dmgOf, foeById, isWall, nearest, turnDir, wvHit } from "./waveKit";
import { wvFx as fx, type BitStep, type SkillCast } from "./waveSkillsA";

export const CASTS_D: Record<string, SkillCast> = {
  wvPearl: (s, m) => {
    const p = s.player;
    const k = K.wvPearl;
    addBit(s, { k: "wvPearl", x: p.x + p.faceX * 8, y: p.y + p.faceY * 8, dx: p.faceX, dy: p.faceY, t: k.life, mul: k.mul * m, n: 0, v: k.speed, hit: [] });
  },
  wvHands: (s, m) => {
    const p = s.player;
    const e = nearest(s, p.x, p.y, 200);
    const at = e ?? clampIn(s, p.x + p.faceX * 50, p.y + p.faceY * 50);
    addBit(s, { k: "wvHands", x: at.x, y: at.y, dx: 0, dy: 0, t: K.wvHands.ticks, mul: K.wvHands.mul * m, tg: e?.id });
  },
  wvFountain: (s, m) => {
    const p = s.player;
    addBit(s, { k: "wvFountain", x: p.x, y: p.y + 2, dx: 0, dy: 0, t: K.wvFountain.ticks, mul: K.wvFountain.mul * m });
  },
  wvSkip: (s, m) => {
    const p = s.player;
    addBit(s, { k: "wvSkip", x: p.x + p.faceX * 6, y: p.y + p.faceY * 6, dx: p.faceX, dy: p.faceY, t: 200, mul: K.wvSkip.mul * m, n: 0, v: 0 });
  },
  wvSiren: (s, m) => {
    const p = s.player;
    const k = K.wvSiren;
    for (let i = 0; i < k.n; i++) {
      const [c, sn] = rot((i - (k.n - 1) / 2) * k.spread);
      const [dx, dy] = turnDir(p.faceX, p.faceY, c, sn);
      addBit(s, { k: "wvNote", x: p.x + dx * 6, y: p.y + dy * 6 - 4, dx, dy, t: Math.ceil(k.range / k.speed), mul: k.mul * m, v: i * 1.7 });
    }
  },
  wvMist: (s, m) => {
    const p = s.player;
    p.wvMist = K.wvMist.ticks;
    p.wvMistMul = m;
  },
};

/** 물안개 한 틱 (sim/wave): 둘레 적 탄을 지움 · 간격마다 둘레 피해 */
export function mistTick(s: RunState): void {
  const p = s.player;
  if (!p.wvMist) return;
  const k = K.wvMist;
  const r = k.r * big(p);
  s.projectiles = s.projectiles.filter((q) => {
    if (q.fromPlayer || dist2(q, p) > r * r) return true;
    fx(s, "wvErase", q.x, q.y, 6, 14);
    return false;
  });
  if (p.wvMist % k.every === 0) burstAt(s, p.x, p.y, r, dmgOf(s, k.mul * (p.wvMistMul ?? 1)));
  if (--p.wvMist <= 0) {
    delete p.wvMist;
    delete p.wvMistMul;
  }
}

/** 받는 피해 (classTaken): 물안개 안 */
export const waveTaken = (p: { wvMist?: number }) => ((p.wvMist ?? 0) > 0 ? K.wvMist.taken : 1);

export const STEPS_D: Record<string, BitStep> = {
  /** 진주: 벽에 튕길 때마다 빨라지고 세짐 (튈 때마다 같은 적을 다시 맞힘) */
  wvPearl: (s, b) => {
    const k = K.wvPearl;
    const sp = b.v ?? k.speed;
    let bounced = false;
    if (isWall(s, b.x + b.dx * sp, b.y)) [b.dx, bounced] = [-b.dx, true];
    if (isWall(s, b.x, b.y + b.dy * sp)) [b.dy, bounced] = [-b.dy, true];
    if (bounced) {
      b.n = (b.n ?? 0) + 1;
      b.v = sp + k.faster;
      b.hit = [];
      fx(s, "wvPearlBounce", b.x, b.y, 10 + (b.n ?? 0) * 2, 16);
      if ((b.n ?? 0) > k.bounces) return false;
    }
    const ax = b.x;
    const ay = b.y;
    b.x += b.dx * sp;
    b.y += b.dy * sp;
    for (const e of onSegment(s, ax, ay, b.x, b.y, 5)) {
      if (b.hit!.includes(e.id)) continue;
      b.hit!.push(e.id);
      wvHit(s, e, dmgOf(s, b.mul * (1 + k.up * (b.n ?? 0))), ax, ay, 4);
    }
    return --b.t > 0;
  },
  /** 물의 손: 적을 따라 양옆에서 모여 손뼉 (가운데 기절 · 손 사이 줄 피해) */
  wvHands: (s, b) => {
    const k = K.wvHands;
    const e = foeById(s, b.tg);
    if (e) [b.x, b.y] = [e.x, e.y];
    if (--b.t > 0) return true;
    const p = s.player;
    const r = k.r * big(p);
    const got = burstAt(s, b.x, b.y, r, dmgOf(s, b.mul));
    for (const o of got) stun(o, k.stun);
    const hit = got.map((o) => o.id);
    for (const o of onSegment(s, b.x - k.gap, b.y, b.x + k.gap, b.y, 12)) if (!hit.includes(o.id)) wvHit(s, o, dmgOf(s, (b.mul * k.between) / k.mul), b.x, b.y, 6);
    fx(s, "wvClap", b.x, b.y, r, 28);
    return false;
  },
  /** 분수: 둘레 아무 적에게나 물방울을 포물선으로 */
  wvFountain: (s, b) => {
    const k = K.wvFountain;
    const age = b.t0 - b.t;
    if (age > 8 && age % k.every === 0) {
      const near = alive(s).filter((e) => dist2(e, b) <= k.reach ** 2);
      if (near.length > 0) {
        const e = createRng(deriveSeed(s.seed, "wvFountain", s.tick)).pick(near);
        addBit(s, { k: "wvLob", x: b.x, y: b.y, dx: 0, dy: 0, t: k.flight, mul: b.mul, pts: [b.x, b.y - 10, e.x, e.y] });
      }
    }
    return --b.t > 0;
  },
  /** 포물선 물방울: 떨어진 자리에서 작게 터짐 */
  wvLob: (s, b) => {
    const [x0, y0, x1, y1] = b.pts as [number, number, number, number];
    const f = 1 - b.t / b.t0;
    b.x = x0 + (x1 - x0) * f;
    b.y = y0 + (y1 - y0) * f;
    if (--b.t > 0) return true;
    burstAt(s, x1, y1, K.wvFountain.r * big(s.player), dmgOf(s, b.mul), 3);
    fx(s, "wvLob", x1, y1, K.wvFountain.r * big(s.player), 18);
    return false;
  },
  /** 물수제비: 통통 튀며 앞으로 · 땅에 닿을 때마다 물결 고리 */
  wvSkip: (s, b) => {
    const k = K.wvSkip;
    b.x += b.dx * k.speed;
    b.y += b.dy * k.speed;
    b.v = (b.v ?? 0) + k.speed;
    if (b.v >= k.hop * (1 + (b.n ?? 0) * 0.12)) {
      b.v = 0;
      b.n = (b.n ?? 0) + 1;
      const r = k.r * big(s.player);
      burstAt(s, b.x, b.y, r, dmgOf(s, b.mul), 6);
      fx(s, "wvSkipRing", b.x, b.y, r, 22);
      if (b.n >= k.hops) return false;
    }
    return --b.t > 0 && !isWall(s, b.x, b.y);
  },
  /** 음표: 물결치며 날아가 처음 닿은 적을 잠재움 */
  wvNote: (s, b) => {
    const k = K.wvSiren;
    const w = rot((b.t0 - b.t) * 0.25 + (b.v ?? 0))[1] * 1.4;
    b.x += b.dx * k.speed - b.dy * w;
    b.y += b.dy * k.speed + b.dx * w;
    for (const e of alive(s)) {
      if (dist2(e, b) > (e.r + 5) ** 2) continue;
      wvHit(s, e, dmgOf(s, b.mul), b.x, b.y);
      if (!isBoss(e) && e.hp > 0) {
        stun(e, k.sleep);
        const z = (s.player.wvSleep ??= []);
        if (!z.includes(e.id)) z.push(e.id);
        if (z.length > 12) z.shift();
      }
      fx(s, "wvNote", e.x, e.y - 8, 10, 30);
      return false;
    }
    return --b.t > 0 && !isWall(s, b.x, b.y);
  },
};
