// 붐버(테라코어, 시즌 2): "폭발은 예술이다". 던지고·붙이고·깔고·쏘아 올려 터뜨림
// 예술 연쇄: 1초 안에 또 터지면 한 칸씩 쌓여 폭발이 커짐 · 터져 쓰러진 적 자리에 여진. 수치는 weaponsBomber.BOMBER, 아이템은 itemsBomber
import { manualAim } from "./pwBasic";
import { TICK_RATE } from "../constants";
import { BOMBER_PERKS as K } from "../itemsBomber";
import { createRng, deriveSeed } from "../rng";
import { BOMBER as B, type BombMode, type BombStyle } from "../weaponsBomber";
import { nearest } from "./brawlMoves";
import { blastAt, damagePlayer, ignite } from "./combat";
import { addFlame } from "./flames";
import { placeMine, updateMines } from "./bomberMines";
import { backMissiles } from "./missiles";
import { alive, inCircle } from "./s2Kit";
import type { Bomb } from "./tcTypes";
import type { EnemyState, PlayerState, ProjectileState, RunState } from "./types";
import { addEffect, dist2, hasPerk, weaponOf } from "./util";

const styleOf = (p: PlayerState): BombStyle => weaponOf(p).bomb ?? { mode: "lob", r: 20, fuse: 24 };
const roll = (s: RunState, tag: string, n: number) => createRng(deriveSeed(s.seed, tag, s.tick, n)).nextFloat();
const TINT: Partial<Record<BombMode, string>> = { napalm: "#ff6a1a", mega: "#ffe060", sticky: "#8aff6a", chain: "#6ae8ff" };
const STARS = ["#ff6a8a", "#ffd040", "#6ae8ff", "#a87aff", "#8aff8a"];

/** 방폭복: 받는 피해 (classTaken) */
export const bomberTaken = (p: PlayerState) => (p.characterId === "bomber" && hasPerk(p, "bmSuit") ? K.bmSuit.taken : 1);

/** 폭탄 하나를 (sx,sy)에서 (x,y)로 t틱 동안 날림 */
function toss(p: PlayerState, b: Omit<Bomb, "max">): void {
  (p.bmBombs ??= []).push({ ...b, max: Math.max(1, b.t) });
}

/** 펑: 예술 연쇄 · 반경·피해 아이템 · 여진 · 파편 · 불 · 여진 아이템 (after: 여진이면 더 잇지 않음) */
export function boom(s: RunState, x: number, y: number, r0: number, dmg0: number, opt: { tint?: string; after?: boolean; echo?: boolean; star?: boolean } = {}): void {
  const p = s.player;
  const max = hasPerk(p, "bmArtist") ? K.bmArtist.max : B.artMax;
  p.bmArt = s.tick - (p.bmArtT ?? -999) <= B.artWindow ? Math.min(max, (p.bmArt ?? 0) + 1) : 0;
  p.bmArtT = s.tick;
  const art = p.bmArt;
  const r = r0 * (1 + art * B.artR) * (hasPerk(p, "bmWide") ? K.bmWide.r : 1);
  const dmg = dmg0 * (1 + art * B.artDmg) * (hasPerk(p, "bmPowder") ? K.bmPowder.mul : 1);
  const before = inCircle(s, x, y, r);
  blastAt(s, x, y, r, dmg, { push: 4 });
  addEffect(s, { kind: opt.star ? "bmStar" : "bmBoom", x, y, dirX: 0, dirY: 0, size: r, maxTicks: opt.star ? 34 : 20, tint: opt.tint, width: art });
  // 터지는 자리에 나도 있으면 피해 (폭발은 예술이지만 나에게도 아픔)
  if (dist2(p, { x, y }) <= (r + p.r) ** 2) damagePlayer(s, B.selfDmg);
  if (hasPerk(p, "bmBurn")) for (const e of before) ignite(e, dmg * 0.5);
  if (hasPerk(p, "bmShrapnel") && !opt.after) shrapnel(s, x, y, dmg * K.bmShrapnel.mul);
  if (opt.after) return;
  // 터져 쓰러진 적 자리의 여진
  const afterMul = hasPerk(p, "bmFinale") ? K.bmFinale.mul : B.afterMul;
  for (const e of before) if (e.hp <= 0) toss(p, { x: e.x, y: e.y, sx: e.x, sy: e.y, t: 6, dmg: p.stats.damage * afterMul, r: B.afterR, mode: "lob", after: true });
  if (hasPerk(p, "bmEcho") && !opt.echo && roll(s, "echo", Math.round(x)) < K.bmEcho.chance) toss(p, { x, y, sx: x, sy: y, t: K.bmEcho.delay, dmg: dmg0 * K.bmEcho.mul, r: r0, mode: "lob", echo: true });
}

/** 파편: 사방으로 짧게 */
function shrapnel(s: RunState, x: number, y: number, dmg: number): void {
  for (let i = 0; i < K.bmShrapnel.n; i++) {
    const a = (i / K.bmShrapnel.n) * Math.PI * 2 + s.tick * 0.1;
    s.projectiles.push({ id: s.nextId++, fromPlayer: true, x, y, prevX: x, prevY: y, r: 2, vx: Math.cos(a) * 3, vy: Math.sin(a) * 3, damage: dmg, ticksLeft: 14, spirit: "bmShard" });
  }
}

/** 폭탄이 다 날아가 터질 때 (방식마다) */
function land(s: RunState, b: Bomb): void {
  const p = s.player;
  const st = styleOf(p);
  if (b.stick !== undefined) {
    const e = s.enemies.find((o) => o.id === b.stick && o.hp > 0);
    if (e) {
      b.x = e.x;
      b.y = e.y;
    }
  }
  if (b.mode === "sticky" && !b.stuck) return stick(s, b);
  if (b.stuck) {
    // 붙은 수만큼 크고 세게
    const k = (b.stack ?? 1) - 1;
    return boom(s, b.x, b.y, b.r * (1 + k * B.stickR), b.dmg * (1 + k * B.stickMul), { tint: TINT.sticky });
  }
  if (b.after || b.echo || b.small) return boom(s, b.x, b.y, b.r, b.dmg, { after: b.after, echo: b.echo, tint: b.tint, star: b.star });
  boom(s, b.x, b.y, b.r, b.dmg, { tint: TINT[b.mode] });
  switch (b.mode) {
    case "cluster":
      for (let i = 0; i < (st.n ?? 6); i++) {
        const a = (i / (st.n ?? 6)) * Math.PI * 2 + roll(s, "cl", i);
        const d = 18 + roll(s, "cd", i) * 16;
        toss(p, { x: b.x + Math.cos(a) * d, y: b.y + Math.sin(a) * d, sx: b.x, sy: b.y, t: 10 + i, dmg: b.dmg * B.bombletMul, r: st.r * 0.75, mode: "lob", small: true });
      }
      break;
    case "firework":
      for (let i = 0; i < (st.n ?? 8); i++) {
        const a = (i / (st.n ?? 8)) * Math.PI * 2;
        const d = B.starSpread * (i % 2 ? 0.6 : 1);
        toss(p, { x: b.x + Math.cos(a) * d, y: b.y + Math.sin(a) * d, sx: b.x, sy: b.y, t: 6 + i * 2, dmg: b.dmg, r: st.r, mode: "lob", small: true, star: true, tint: STARS[i % STARS.length] });
      }
      break;
    case "napalm":
      // 화염병처럼 넓게 번지는 불바다 (가운데 + 둘레)
      for (let i = 0; i <= B.napalmPatches; i++) {
        const a = (i / B.napalmPatches) * Math.PI * 2 + roll(s, "np", 0) * 3;
        const d = i === 0 ? 0 : B.napalmSpread;
        (p.bmFires ??= []).push({ x: b.x + Math.cos(a) * d, y: b.y + Math.sin(a) * d * 0.7, t: B.fireTicks, dmg: p.stats.damage * B.fireMul });
      }
      break;
    case "chain":
      if ((b.chain ?? 0) > 0) {
        const next = alive(s)
          .filter((e) => dist2(e, b) > 16 && dist2(e, b) <= B.chainReach ** 2)
          .sort((a, c) => dist2(a, b) - dist2(c, b) || a.id - c.id)[0];
        if (next) toss(p, { x: next.x, y: next.y, sx: b.x, sy: b.y, t: 8, dmg: b.dmg, r: b.r, mode: "chain", chain: (b.chain ?? 1) - 1 });
      }
      break;
  }
}

/** 끈끈이가 닿음: 적 몸에 붙음 (이미 붙은 끈끈이가 있으면 하나로 합쳐 수가 늘어남) */
function stick(s: RunState, b: Bomb): void {
  const p = s.player;
  const e = b.stick !== undefined ? s.enemies.find((o) => o.id === b.stick && o.hp > 0) : undefined;
  if (!e) return boom(s, b.x, b.y, b.r, b.dmg, { tint: TINT.sticky });
  const on = (p.bmBombs ?? []).find((o) => o.stuck && o.stick === e.id);
  if (on) {
    on.stack = Math.min(B.stickMax, (on.stack ?? 1) + 1);
    on.dmg += b.dmg;
    return;
  }
  toss(p, { ...b, x: e.x, y: e.y, sx: e.x, sy: e.y, t: B.stickTicks, stuck: true, stack: 1 });
}

/** 한 번 던지기 */
function attack(s: RunState): void {
  const p = s.player;
  const st = styleOf(p);
  const dmg = p.stats.damage;
  const more = hasPerk(p, "bmMore") ? K.bmMore.n : 0;
  // 사거리 안의 적만 (폭발 반경만큼 사거리를 넘어 맞히지 않게) · 네이팜은 수동 조준이면 누른 곳으로
  // 패왕전 사람은 늘 마우스 자리 (자동 조준 없음)
  const manual = manualAim(s, p.stats.range);
  const aimed = st.mode === "napalm" && p.aimDist !== undefined;
  const t = aimed || manual ? null : nearest(s, p.stats.range);
  const far = aimed ? Math.min(p.aimDist!, p.stats.range) : p.stats.range * 0.7;
  const tx = manual ? manual.x : t ? t.x : p.x + p.faceX * far;
  const ty = manual ? manual.y : t ? t.y : p.y + p.faceY * far;
  const flight = Math.max(8, st.fuse);
  const throwAt = (x: number, y: number, extra: Partial<Bomb> = {}) => toss(p, { x, y, sx: p.x, sy: p.y - 6, t: flight, dmg, r: st.r, mode: st.mode, ...extra });
  switch (st.mode) {
    case "mine":
      placeMine(s, (st.n ?? 6) + more, dmg, st.r);
      return;
    case "rocket":
      for (let i = 0; i <= more; i++) {
        const a = Math.atan2(ty - p.y, tx - p.x) + (i - more / 2) * 0.15;
        s.projectiles.push({ id: s.nextId++, fromPlayer: true, x: p.x, y: p.y - 4, prevX: p.x, prevY: p.y - 4, r: 3, vx: Math.cos(a) * 3.8, vy: Math.sin(a) * 3.8, damage: dmg, ticksLeft: Math.ceil((p.stats.range * 1.1) / 3.8), homing: !manual, seek: !manual, spirit: "bmRocket" });
      }
      if (roll(s, "rmini", 0) < B.rocketMini) backMissiles(s, B.rocketMiniN, dmg * B.rocketMiniMul, 10, true);
      return;
    case "fan": {
      const n = (st.n ?? 3) + more;
      const base = Math.atan2(ty - p.y, tx - p.x);
      const d = Math.hypot(tx - p.x, ty - p.y);
      for (let i = 0; i < n; i++) {
        const a = base + (i - (n - 1) / 2) * 0.35;
        throwAt(p.x + Math.cos(a) * d, p.y + Math.sin(a) * d);
      }
      return;
    }
    case "sticky":
      for (let i = 0; i <= more; i++) throwAt(tx + i * 6, ty, { stick: t?.id });
      return;
    case "chain":
      throwAt(tx, ty, { chain: st.n ?? 4 });
      for (let i = 0; i < more; i++) throwAt(tx + 14, ty + 8, { chain: st.n ?? 4 });
      return;
    default:
      throwAt(tx, ty);
      for (let i = 0; i < more; i++) throwAt(tx + (roll(s, "mx", i) - 0.5) * 30, ty + (roll(s, "my", i) - 0.5) * 30);
  }
}

/** 틱마다: 날아가는 폭탄 · 지뢰 · 불바다 */
function update(s: RunState): void {
  const p = s.player;
  if (p.bmBombs?.length) {
    const now = p.bmBombs;
    p.bmBombs = [];
    const landed: Bomb[] = [];
    for (const b of now) {
      if (b.stick !== undefined) {
        const e = s.enemies.find((o) => o.id === b.stick && o.hp > 0);
        if (e) {
          b.x = e.x;
          b.y = e.y;
        }
      }
      if (--b.t > 0) p.bmBombs.push(b);
      else landed.push(b);
    }
    // 다 돌고 나서 터뜨림 (끈끈이가 이미 붙은 끈끈이를 찾을 수 있게)
    for (const b of landed) land(s, b);
  }
  updateMines(s, (x, y, r, dmg) => boom(s, x, y, r, dmg));
  if (p.bmFires?.length) {
    for (const f of p.bmFires) {
      if (--f.t % 30 !== 0) continue;
      for (const e of inCircle(s, f.x, f.y, B.fireR)) ignite(e, f.dmg * 4 * addFlame(s, e));
    }
    p.bmFires = p.bmFires.filter((f) => f.t > 0);
  }
}

/** 로켓이 맞았을 때 (s2Hits) */
export function rocketHit(s: RunState, pr: ProjectileState, e: EnemyState): void {
  if (s.player.characterId !== "bomber") return;
  boom(s, e.x, e.y, styleOf(s.player).r, pr.damage, { tint: "#ffb04a" });
}

/** 틱마다 (붐버 무기를 들었을 때 player에서) */
export function bomberTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  update(s);
  // 유도 지뢰는 적이 없어도 박아 둠
  if ((!want && styleOf(p).mode !== "mine") || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  attack(s);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetBomber(p: PlayerState): void {
  for (const k of ["bmBombs", "bmMines", "bmFires", "bmArt", "bmArtT"] as const) delete p[k];
}
