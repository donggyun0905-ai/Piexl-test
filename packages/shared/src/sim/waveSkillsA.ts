// 웨이브 기술 1~6: 물나비 · 물창 · 물의 갑옷 · 물의 여신 · 꿈의 고래 · 거품 감옥 (cast = 나갈 때 · step = 빚은 것 한 틱, false면 끝)
import { WAVE_PERKS as K } from "../itemsWave";
import { rot } from "./orbit";
import { alive, isBoss, onSegment, stun } from "./s2Kit";
import type { WvBit } from "./waveTypes";
import type { RunState } from "./types";
import { addEffect, dist2, normalize } from "./util";
import { addBit, big, burstAt, densest, dmgOf, foeById, isWall, nearest, steer, turnDir, wvHit } from "./waveKit";

export type SkillCast = (s: RunState, m: number) => void;
export type BitStep = (s: RunState, b: WvBit) => boolean;

const fx = (s: RunState, kind: string, x: number, y: number, size: number, ticks: number, more: { dirX?: number; dirY?: number; toX?: number; toY?: number } = {}) =>
  addEffect(s, { kind: kind as never, x, y, dirX: more.dirX ?? 0, dirY: more.dirY ?? 0, size, maxTicks: ticks, ...(more.toX !== undefined ? { toX: more.toX, toY: more.toY } : {}) });
export { fx as wvFx };

export const CASTS_A: Record<string, SkillCast> = {
  wvButterfly: (s, m) => {
    const p = s.player;
    const k = K.wvButterfly;
    for (let i = 0; i < k.n; i++) {
      const [c, sn] = rot((i - (k.n - 1) / 2) * 0.5);
      const [dx, dy] = turnDir(p.faceX, p.faceY, c, sn);
      addBit(s, { k: "wvButterfly", x: p.x + dx * 6, y: p.y + dy * 6 - 4, dx, dy, t: k.life, mul: k.mul * m, v: i * 1.3 });
    }
  },
  wvSpear: (s, m) => {
    const p = s.player;
    let far = undefined as ReturnType<typeof nearest>;
    for (const e of alive(s)) if (dist2(e, p) < 260 ** 2 && (!far || dist2(e, p) > dist2(far, p))) far = e;
    addBit(s, { k: "wvSpear", x: p.x, y: p.y - 18, dx: p.faceX, dy: p.faceY, t: K.wvSpear.aim + Math.ceil(K.wvSpear.range / K.wvSpear.speed), mul: K.wvSpear.mul * m, n: 0, tg: far?.id, hit: [] });
  },
  wvArmor: (s, m) => {
    const p = s.player;
    p.shieldPts = (p.shieldPts ?? 0) + p.stats.maxHp * K.wvArmor.shield * Math.min(1.5, m);
    p.wvArmor = K.wvArmor.ticks;
  },
  wvGoddess: (s, m) => {
    const p = s.player;
    addBit(s, { k: "wvGoddess", x: p.x - p.faceX * 16, y: p.y - 2, dx: 0, dy: 0, t: K.wvGoddess.ticks, mul: K.wvGoddess.mul * m });
  },
  wvWhale: (s, m) => {
    const p = s.player;
    const to = densest(s, 90);
    const d = normalize(to.x - p.x, to.y - p.y) ?? [p.faceX, p.faceY];
    addBit(s, { k: "wvWhale", x: p.x, y: p.y, dx: d[0], dy: d[1], t: 120, mul: K.wvWhale.mul * m, ox: to.x, oy: to.y });
  },
  wvBubble: (s, m) => {
    const p = s.player;
    const k = K.wvBubble;
    const got: number[] = [];
    for (let i = 0; i < k.n; i++) {
      const e = nearest(s, p.x, p.y, k.reach, got);
      if (!e) break;
      got.push(e.id);
      stun(e, k.ticks);
      addBit(s, { k: "wvBubble", x: e.x, y: e.y, dx: 0, dy: 0, t: k.ticks, mul: k.mul * m, tg: e.id, v: e.r });
    }
    if (got.length === 0) fx(s, "wvBubblePop", p.x + p.faceX * 30, p.y + p.faceY * 30, 14, 20);
  },
};

export const STEPS_A: Record<string, BitStep> = {
  /** 팔랑팔랑: 서로 다른 적을 고르고 좌우로 흔들리며 날아가 앉으면 터짐 */
  wvButterfly: (s, b) => {
    const k = K.wvButterfly;
    const taken = (s.player.wvBits ?? []).filter((o) => o !== b && o.k === "wvButterfly" && o.tg !== undefined).map((o) => o.tg!);
    let e = foeById(s, b.tg);
    if (!e) {
      e = nearest(s, b.x, b.y, 240, taken) ?? nearest(s, b.x, b.y, 240);
      b.tg = e?.id;
    }
    if (e) steer(b, e.x, e.y, 0.14);
    const age = b.t0 - b.t;
    const w = rot(age * 0.35 + (b.v ?? 0))[1] * 1.3;
    b.x += b.dx * k.speed - b.dy * w;
    b.y += b.dy * k.speed + b.dx * w;
    if (isWall(s, b.x, b.y)) [b.dx, b.dy] = [-b.dx, -b.dy];
    if (e && dist2(e, b) <= (e.r + 5) ** 2) {
      wvHit(s, e, dmgOf(s, b.mul), b.x, b.y, 2);
      if (!isBoss(e)) e.slowTicks = Math.max(e.slowTicks ?? 0, k.slow);
      fx(s, "wvFlyPop", b.x, b.y, 12, 22, { dirX: b.dx, dirY: b.dy });
      return false;
    }
    if (--b.t > 0) return true;
    fx(s, "wvFlyPop", b.x, b.y, 8, 16);
    return false;
  },
  /** 머리 위에서 겨눔 → 꿰뚫고 날아감 (지나간 줄 모두) */
  wvSpear: (s, b) => {
    const p = s.player;
    const k = K.wvSpear;
    b.t--;
    if (b.n === 0) {
      b.x = p.x;
      b.y = p.y - 18;
      const e = foeById(s, b.tg);
      const d = e ? normalize(e.x - b.x, e.y - b.y) : [p.faceX, p.faceY] as const;
      if (d) [b.dx, b.dy] = d;
      if (b.t0 - b.t >= k.aim) b.n = 1;
      return true;
    }
    const ax = b.x;
    const ay = b.y;
    b.x += b.dx * k.speed;
    b.y += b.dy * k.speed;
    for (const e of onSegment(s, ax, ay, b.x, b.y, k.w * big(p))) {
      if (b.hit!.includes(e.id)) continue;
      b.hit!.push(e.id);
      wvHit(s, e, dmgOf(s, b.mul), ax, ay, 6);
      fx(s, "wvPierce", e.x, e.y, 14, 16, { dirX: b.dx, dirY: b.dy });
    }
    if (b.t > 0 && !isWall(s, b.x, b.y)) return true;
    fx(s, "wvSplash", b.x, b.y, 22, 22, { dirX: b.dx, dirY: b.dy });
    return false;
  },
  /** 바다의 보석: 세운 자리에서 적이 몰린 곳에 물빛을 쏘아 물기둥 */
  wvGoddess: (s, b) => {
    const p = s.player;
    const k = K.wvGoddess;
    const age = b.t0 - b.t;
    if (age > 10 && age % k.every === 0 && alive(s).length > 0) {
      const at = densest(s);
      for (const e of burstAt(s, at.x, at.y, k.r * big(p), dmgOf(s, b.mul))) if (!isBoss(e)) e.slowTicks = Math.max(e.slowTicks ?? 0, 40);
      fx(s, "wvPour", b.x, b.y - 22, k.r * big(p), 26, { toX: at.x, toY: at.y });
    }
    return --b.t > 0;
  },
  /** 바닥 아래 그림자 → 무리 밑에서 솟구침 */
  wvWhale: (s, b) => {
    const p = s.player;
    const k = K.wvWhale;
    const tx = b.ox ?? b.x;
    const ty = b.oy ?? b.y;
    const left = Math.hypot(tx - b.x, ty - b.y);
    if (left > k.speed && --b.t > 0) {
      b.x += b.dx * k.speed;
      b.y += b.dy * k.speed;
      return true;
    }
    for (const e of burstAt(s, tx, ty, k.r * big(p), dmgOf(s, b.mul), 8)) stun(e, k.stun);
    fx(s, "wvBreach", tx, ty, k.r * big(p), 44, { dirX: b.dx, dirY: b.dy });
    return false;
  },
  /** 거품에 갇혀 살짝 떠오름 → 터짐 */
  wvBubble: (s, b) => {
    const k = K.wvBubble;
    const e = foeById(s, b.tg);
    if (!e) {
      fx(s, "wvBubblePop", b.x, b.y, 16, 20);
      return false;
    }
    if (!isBoss(e) && e.kind !== "dummy" && b.t > k.ticks * 0.3) e.y -= 0.12;
    b.x = e.x;
    b.y = e.y;
    if (--b.t > 0) return true;
    wvHit(s, e, dmgOf(s, b.mul), e.x, e.y - 1);
    burstAt(s, e.x, e.y, k.r, dmgOf(s, b.mul * k.near / k.mul), 6, [e.id]);
    fx(s, "wvBubblePop", e.x, e.y, (b.v ?? 6) + 12, 24);
    return false;
  },
};
