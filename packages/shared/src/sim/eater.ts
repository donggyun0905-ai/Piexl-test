// 이터(헬리오스): 이빨 달린 그림자. 누를 때마다 열 가지 공격 중 하나가 확률로 나옴 (넓고 세지만 느림)
// 쓰러뜨린 적은 '먹은' 것으로 세고, 먹을 때마다 재생력 +0.1 (상한 20, 10초마다 그만큼 회복)
// 수치는 weaponsEater.EATER, 아이템은 itemsEater
import { srcRun, srcFn, srcEach } from "./dmgSrc";
import { TICK_RATE } from "../constants";
import { EATER_PERKS as K } from "../itemsEater";
import { createRng, deriveSeed } from "../rng";
import { EATER as E, type MawMove } from "../weaponsEater";
import { nearest } from "./brawlMoves";
import { healPlayer } from "./combat";
import { inCircle, inCone, isBoss, onSegment, shoot, startRush, rushTick as rushTick_, strike as strike_ } from "./s2Kit";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, hasPerk } from "./util";
import { recalcStats } from "./items";
import type { StatMod } from "../stats";
const rushTick = srcFn("eater", () => rushTick_), strike = srcFn("eater", () => strike_);

const MOVES = Object.keys(E.moves) as MawMove[];
const BITES: readonly MawMove[] = ["bite", "abyss", "triBite", "lurker"];
const roll = (s: RunState, tag: string, n: number) => createRng(deriveSeed(s.seed, tag, s.tick, n)).nextFloat();

/** 재생력 상한 (100 · 끝없는 허기 150) */
export const eaterRegenCap = (p: PlayerState) => (hasPerk(p, "eaHunger") ? K.eaHunger.max : E.regenMax);

/** 재생력 (먹은 적 × 0.1) */
export function eaterRegen(p: PlayerState): number {
  const per = E.regenPer * (hasPerk(p, "eaGluttony") ? K.eaGluttony.mul : 1);
  return Math.min(eaterRegenCap(p), (p.eaEaten ?? 0) * per);
}

/** 재생력 10마다 공격력 +3 (items.recalcStats) */
export function eaterMods(p: PlayerState): StatMod[] {
  if (p.characterId !== "eater") return [];
  const n = Math.floor(eaterRegen(p) / 10 + 1e-9);
  return n > 0 ? [{ stat: "damage", add: n * E.dmgPer10 }] : [];
}

/** 받는 피해 배율 (그림자 몸) */
export const eaterTaken = (p: PlayerState) => (p.characterId === "eater" && hasPerk(p, "eaShade") ? K.eaShade.taken : 1);

/** 맞힌 뒤: 쓰러졌으면 먹음 (재생력 · 포식) */
export function eaterOnHit(s: RunState, e: EnemyState, before = 1): void {
  const p = s.player;
  if (p.characterId !== "eater" || e.hp > 0 || before <= 0) return;
  const tier = Math.floor(eaterRegen(p) / 10 + 1e-9);
  p.eaEaten = (p.eaEaten ?? 0) + 1;
  // 재생력이 10을 넘을 때마다 공격력이 오름
  if (Math.floor(eaterRegen(p) / 10 + 1e-9) !== tier) recalcStats(s);
  if (hasPerk(p, "eaFeast")) healPlayer(s, K.eaFeast.heal);
  addEffect(s, { kind: "eaEat", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 4, maxTicks: 20, toX: p.x, toY: p.y });
}

/** 물기: 맞은 뒤 체력이 기준 이하인 일반 적은 통째로 삼킴 */
function bite(s: RunState, e: EnemyState, dmg: number, swallow: boolean): void {
  const p = s.player;
  const before = e.hp;
  strike(s, e, dmg * (hasPerk(p, "eaFang") ? K.eaFang.mul : 1), 4);
  const below = hasPerk(p, "eaDevour") ? K.eaDevour.below : E.swallow;
  if ((swallow || hasPerk(p, "eaDevour")) && e.hp > 0 && !isBoss(e) && e.kind !== "dummy" && e.hp <= e.maxHp * below) srcRun(s, "eaDevour", () => { strike(s, e, e.hp + 1); });
  eaterOnHit(s, e, before);
}
function hit(s: RunState, e: EnemyState, dmg: number, push = 4): void {
  const before = e.hp;
  strike(s, e, dmg, push);
  eaterOnHit(s, e, before);
}

/** 겨눌 곳: 가까운 적 (없으면 바라보는 쪽 사거리 끝) */
function target(s: RunState, reach: number): { x: number; y: number; e: EnemyState | null } {
  const p = s.player;
  const e = nearest(s, reach);
  return e ? { x: e.x, y: e.y, e } : { x: p.x + p.faceX * reach * 0.7, y: p.y + p.faceY * reach * 0.7, e: null };
}

/** 이번에 나올 공격 (심연의 부름: 심연·낚아채기 두 배) */
function pick(s: RunState, p: PlayerState, n: number): MawMove {
  const w = (m: MawMove) => E.moves[m][0] * (hasPerk(p, "eaAbyss") && (m === "abyss" || m === "lurker") ? K.eaAbyss.mul : 1);
  let r = roll(s, "maw", n) * MOVES.reduce((a, m) => a + w(m), 0);
  for (const m of MOVES) if ((r -= w(m)) < 0) return m;
  return "slash";
}

const fx = (s: RunState, kind: "eaSlash" | "eaBite" | "eaAbyss" | "eaSpear" | "eaX" | "eaLurk", x: number, y: number, size: number, extra: { toX?: number; toY?: number; width?: number } = {}) =>
  addEffect(s, { kind, x, y, dirX: s.player.faceX, dirY: s.player.faceY, size, maxTicks: kind === "eaAbyss" || kind === "eaLurk" ? 30 : 18, ...extra });

/** 공격 하나 */
export function mawMove(s: RunState, move: MawMove): void {
  const p = s.player;
  const r = p.stats.range * (hasPerk(p, "eaMaw") ? K.eaMaw.mul : 1);
  const d = p.stats.damage * E.moves[move][1];
  const queue = (e: EnemyState, n: number, gap: number) => {
    p.eaQueue ??= [];
    for (let i = 0; i < n; i++) p.eaQueue.push({ id: e.id, x: e.x, y: e.y, t: 1 + i * gap, dmg: d, bite: BITES.includes(move) });
  };
  switch (move) {
    case "slash":
      for (const e of inCone(s, r, E.arc)) hit(s, e, d);
      fx(s, "eaSlash", p.x, p.y, r, { toX: p.attackCount % 2 });
      return;
    case "blades":
      for (const a of [-0.3, 0, 0.3]) shoot(s, a, { damage: d, spirit: "eaBlade", r: 5, pierce: 3, range: E.bladeRange, speed: 3.2 });
      return;
    case "bite": {
      const x = p.x + p.faceX * r * 0.6;
      const y = p.y + p.faceY * r * 0.6;
      for (const e of inCircle(s, x, y, r * 0.55)) bite(s, e, d, false);
      fx(s, "eaBite", x, y, r * 0.55);
      return;
    }
    case "abyss": {
      const t = target(s, r * 1.5);
      const rr = E.abyssR * (hasPerk(p, "eaAbyss") ? 1.3 : 1) * (r / 60);
      for (const e of inCircle(s, t.x, t.y, rr)) bite(s, e, d, false);
      fx(s, "eaAbyss", t.x, t.y, rr);
      return;
    }
    case "spear": {
      const bx = p.x + p.faceX * r * 1.6;
      const by = p.y + p.faceY * r * 1.6;
      for (const e of onSegment(s, p.x, p.y, bx, by, E.spearW)) hit(s, e, d, 6);
      fx(s, "eaSpear", p.x, p.y, E.spearW, { toX: bx, toY: by });
      return;
    }
    case "barrage": {
      const t = target(s, r * 1.5);
      if (t.e) queue(t.e, E.barrageN, E.barrageGap);
      for (let i = 0; i < E.barrageN; i++) {
        const a = Math.atan2(p.faceY, p.faceX) + Math.PI + (i - 2) * 0.45;
        addEffect(s, { kind: "eaSpear", x: p.x + Math.cos(a) * 14, y: p.y + Math.sin(a) * 14, dirX: 0, dirY: i * E.barrageGap, size: 4, maxTicks: 18 + i * E.barrageGap, toX: t.x, toY: t.y });
      }
      return;
    }
    case "xcut": {
      const t = target(s, r * 1.5);
      const k = r * 0.5;
      for (const [ax, ay, bx, by] of [[t.x - k, t.y - k, t.x + k, t.y + k], [t.x + k, t.y - k, t.x - k, t.y + k]] as const) for (const e of onSegment(s, ax, ay, bx, by, 6)) hit(s, e, d);
      fx(s, "eaX", t.x, t.y, k);
      return;
    }
    case "dashBite":
      startRush(p, { t: 8, dx: p.faceX, dy: p.faceY, step: r / 8, dmg: d, push: 6, invuln: true, tint: "#ff2a3a" });
      return;
    case "triBite": {
      const t = target(s, r * 1.2);
      if (t.e) queue(t.e, 3, E.triGap);
      for (let i = 0; i < 3; i++) addEffect(s, { kind: "eaBite", x: t.x, y: t.y + (i - 1) * 8, dirX: p.faceX, dirY: p.faceY, size: r * 0.4, maxTicks: 14 + i * E.triGap, width: i * E.triGap });
      return;
    }
    case "lurker": {
      const t = target(s, r * E.lurkReach);
      // 땅에서 솟아 그 둘레를 통째로 낚아챔
      for (const e of inCircle(s, t.x, t.y, Math.max(E.splash, r * 0.4))) bite(s, e, d, true);
      fx(s, "eaLurk", t.x, t.y, r * 0.4);
      return;
    }
  }
}

/** 늦게 들어가는 물기 (연타·세 번 씹기) */
function drainQueue(s: RunState): void {
  const p = s.player;
  if (!p.eaQueue?.length) return;
  for (const q of srcEach(p.eaQueue)) {
    if (--q.t > 0) continue;
    // 그 적 자리(없으면 처음 자리) 둘레를 함께 물어뜯음
    const at = s.enemies.find((x) => x.id === q.id && x.hp > 0) ?? q;
    for (const e of inCircle(s, at.x, at.y, E.splash)) {
      if (q.bite) bite(s, e, q.dmg, false);
      else hit(s, e, q.dmg);
    }
  }
  p.eaQueue = p.eaQueue.filter((q) => q.t > 0);
}

/** 틱마다 (그림자를 들었을 때 player에서) */
export function eaterTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  if (p.s2Rush) rushTick(s, (e) => eaterOnHit(s, e));
  drainQueue(s);
  // 재생력: 다른 캐릭터보다 빠르게 0.5초마다 1/10씩 (5초에 그만큼)
  const regen = eaterRegen(p);
  if (regen > 0 && s.tick % (TICK_RATE / 2) === 0 && p.hp > 0 && p.hp < p.stats.maxHp) healPlayer(s, regen / 10);
  if (!want || p.attackCooldown > 0 || p.s2Rush) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  mawMove(s, pick(s, p, p.attackCount));
  if (hasPerk(p, "eaEcho") && roll(s, "echo", p.attackCount) < K.eaEcho.chance) srcRun(s, "eaEcho", () => mawMove(s, pick(s, p, -p.attackCount)));
}

/** 연습장 등에서 다시 시작할 때 */
export function resetEater(p: PlayerState): void {
  for (const k of ["eaEaten", "eaQueue"] as const) delete p[k];
}
