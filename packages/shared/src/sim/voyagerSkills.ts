// 운명의 여행자 기술: 다 모은 한 발을 쏘는 방식 (유도 · 휘는 화살 · 부채꼴 · 거대한 마력 화살 · 화살비 · 튕김 · 되돌아옴 · 갈라짐 · 빛줄기 · 번개 · 고리 · 연사 · 운석 · 십자 · 유령 · 추적 · 쌍둥이 · 물결 · 저격 · 소용돌이)
// 땅에 떨어지는 것(화살비·운석·바위·목마)도 여기서 터뜨림
import { ROOM_WIDTH } from "../constants";
import { createRng, deriveSeed } from "../rng";
import { FATES } from "../voyagerFates";
import { VOYAGER as V } from "../weaponsVoyager";
import { blastAt as blastAt_ } from "./combat";
import { rot } from "./orbit";
import { alive, inLine, shoot, strike as strike_ } from "./s2Kit";
import type { ProjectileState, RunState } from "./types";
import { addEffect } from "./util";
import { buffVal } from "./voyager";
import { srcEach, srcFn, srcRun } from "./dmgSrc";
const blastAt = srcFn("voyagerSkills", () => blastAt_), strike = srcFn("voyagerSkills", () => strike_);

type Extra = Partial<Pick<ProjectileState, "homing" | "seek" | "bounces" | "back" | "span" | "split" | "ghost" | "pierce" | "slow">>;

/** 화살 하나 (a: 바라보는 쪽에서 돌린 각도) · 관통·크기 버프를 같이 넣음 */
function arrow(s: RunState, a: number, dmg: number, extra: Extra = {}, spirit: "vyArrow" | "vyMagic" | "vyChain" | "vyWave" = "vyArrow", r = V.arrowR, speed?: number, range?: number): ProjectileState | undefined {
  const p = s.player;
  const pierce = (extra.pierce ?? 0) + (buffVal(p, "pierce") ?? 0);
  shoot(s, a, { damage: dmg, spirit, r: r * (buffVal(p, "giant") ?? 1), range: range ?? p.stats.range, ...(speed ? { speed } : {}), ...(pierce ? { pierce } : {}) });
  const pr = s.projectiles[s.projectiles.length - 1];
  if (!pr) return;
  Object.assign(pr, extra, pierce ? { pierce, hitIds: [] } : {});
  if (extra.back) pr.span = pr.ticksLeft;
  return pr;
}

/** 시드로 고른 적 n명의 자리 (모자라면 되풀이) */
function spots(s: RunState, n: number, tag: string): { x: number; y: number }[] {
  const foes = alive(s);
  const r = createRng(deriveSeed(s.seed, "vySpot", tag, s.tick));
  const p = s.player;
  return Array.from({ length: n }, (_, i) => {
    const e = foes[i % Math.max(1, foes.length)];
    const [dx, dy] = rot(r.nextFloat() * Math.PI * 2);
    const off = i < foes.length ? 0 : 14;
    return e ? { x: e.x + dx * off, y: e.y + dy * off } : { x: p.x + dx * 60, y: p.y + dy * 60 };
  });
}

/** 땅에 떨어질 것 놓기 (화살비·운석·바위·목마) */
export function drop(s: RunState, x: number, y: number, t: number, r: number, dmg: number, kind: string): void {
  (s.player.vyMarks ??= []).push({ x, y, t, r, dmg, kind });
}

/** 다 모은 한 발 (tilt: 화살통 덤 화살의 기울기) */
export function fireSkill(s: RunState, dmg: number, full: boolean, tilt = 0): void {
  const f = s.player.vyFate;
  if (full && !tilt && f) srcRun(s, `n:vyS${f.i}`, () => fireOne(s, dmg, full, tilt));
  else fireOne(s, dmg, full, tilt);
}

function fireOne(s: RunState, dmg: number, full: boolean, tilt: number): void {
  const p = s.player;
  const fate = p.vyFate ? FATES[p.vyFate.i]! : null;
  const [kind, n] = fate?.skill ?? ["fan", 1];
  // 덜 모았으면 기술 없이 화살 하나
  if (!full || tilt) {
    arrow(s, tilt, dmg);
    return;
  }
  const many = (k: number) => dmg * Math.max(0.35, 2 / k);
  switch (kind) {
    case "homing":
      for (let i = 0; i < n; i++) arrow(s, (i - (n - 1) / 2) * 0.3, many(n), { homing: true });
      break;
    case "curve":
      for (let i = 0; i < n; i++) arrow(s, (i % 2 ? 1 : -1) * (0.7 + Math.floor(i / 2) * 0.25), many(n), { homing: true });
      break;
    case "fan":
      for (let i = 0; i < n; i++) arrow(s, (i - (n - 1) / 2) * 0.16, many(n));
      break;
    case "giant":
      arrow(s, 0, dmg * (1 + n * 0.5), { pierce: 99 }, "vyMagic", V.giantR * n, 3.5, p.stats.range * 1.6);
      break;
    case "rain":
      spots(s, n, "rain").forEach((q, i) => drop(s, q.x, q.y, 36 + i * 4, 16, many(n) * 1.5, "rain"));
      break;
    case "bounce":
      arrow(s, 0, dmg, { bounces: n }, "vyArrow", V.arrowR, undefined, p.stats.range * (1 + n * 0.5));
      break;
    case "back":
      arrow(s, 0, dmg * 1.2, { back: true, pierce: 99 });
      break;
    case "split":
      arrow(s, 0, dmg, { split: true, pierce: n - 1 });
      break;
    case "beam": {
      const len = ROOM_WIDTH;
      for (const e of inLine(s, len, 6 * n)) strike(s, e, dmg * 1.2);
      addEffect(s, { kind: "vyBeam", x: p.x, y: p.y - 3, dirX: p.faceX, dirY: p.faceY, size: 4 * n, toX: p.x + p.faceX * len, toY: p.y - 3 + p.faceY * len, maxTicks: 24 });
      break;
    }
    case "chain":
      arrow(s, 0, dmg, {}, "vyChain");
      break;
    case "ring":
      for (let i = 0; i < n; i++) arrow(s, (i * Math.PI * 2) / n, many(n) * 1.5);
      break;
    case "volley":
      arrow(s, 0, dmg * 0.8);
      p.vyVolley = Array.from({ length: n - 1 }, (_, i) => ({ t: (i + 1) * 8, mul: dmg * 0.8 }));
      break;
    case "meteor":
      spots(s, n, "met").forEach((q, i) => drop(s, q.x, q.y, 50 + i * 15, 40, dmg * 2.5, "meteor"));
      break;
    case "cross":
      for (let i = 0; i < 4; i++) arrow(s, (i * Math.PI) / 2, dmg * 0.7, { homing: true, pierce: 2 });
      break;
    case "ghost":
      arrow(s, 0, dmg * 1.3, { ghost: true, homing: true, pierce: 99 });
      break;
    case "seek":
      for (let i = 0; i < n; i++) arrow(s, (i - (n - 1) / 2) * 0.5, many(n), { seek: true, homing: true }, "vyArrow", 2);
      break;
    case "twin":
      for (let i = 0; i < n; i++) {
        const pr = arrow(s, 0, many(n) * 1.2);
        if (!pr) continue;
        const off = (i - (n - 1) / 2) * 8;
        pr.x += -p.faceY * off;
        pr.y += p.faceX * off;
      }
      break;
    case "wave":
      arrow(s, 0, dmg * 1.4, { pierce: 99, slow: 60 }, "vyWave", 14, 3, p.stats.range * 0.8);
      break;
    case "snipe":
      arrow(s, 0, dmg * n, { pierce: 2 }, "vyArrow", V.arrowR, 9, p.stats.range * 2);
      break;
    case "spiral":
      for (let i = 0; i < n; i++) arrow(s, (i * Math.PI * 2) / n, many(n) * 1.3, { homing: true });
      break;
  }
}

/** 틱마다: 연사 남은 화살 · 떨어질 것(화살비·운석·바위·목마) */
export function tickVolley(s: RunState): void {
  const p = s.player;
  if (p.vyVolley?.length) {
    for (const v of srcEach(p.vyVolley)) if (--v.t === 0) arrow(s, 0, v.mul);
    p.vyVolley = p.vyVolley.filter((v) => v.t > 0);
  }
  if (!p.vyMarks?.length) return;
  const keep = [];
  for (const m of srcEach(p.vyMarks)) {
    if (--m.t > 0) {
      keep.push(m);
      continue;
    }
    blastAt(s, m.x, m.y, m.r ?? 20, m.dmg ?? 0, { push: m.kind === "horse" ? 14 : 4 });
    addEffect(s, { kind: m.kind === "rain" ? "vyRain" : m.kind === "boulder" ? "vyBoulder" : m.kind === "horse" ? "vyHorse" : "vyMeteor", x: m.x, y: m.y, dirX: 0, dirY: 0, size: m.r ?? 20, maxTicks: 20 });
    // 트로이의 목마: 터지며 병사들의 창이 사방으로
    if (m.kind === "horse") {
      for (let i = 0; i < 8; i++) {
        const [dx, dy] = rot((i * Math.PI) / 4);
        s.projectiles.push({ id: s.nextId++, fromPlayer: true, x: m.x, y: m.y, prevX: m.x, prevY: m.y, r: 3, vx: dx * 4, vy: dy * 4, damage: (m.dmg ?? 0) * 0.4, ticksLeft: 30, spirit: "vySpear", pierce: 3, hitIds: [] });
      }
    }
  }
  p.vyMarks = keep;
}
