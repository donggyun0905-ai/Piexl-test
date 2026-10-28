// 영사(아스칼론, 시즌 2): 실을 다루는 여자. 실 100가닥을 장전해 아주 빠르게 쏨 (실 하나 = 방 끝에서 끝까지 1초 보이는 실선, 그 줄의 적을 벰)
// 실에 얽힘이 5 쌓인 적은 실이 당겨 찢김 (공격력 250% + 출혈) · 실 30가닥을 쓸 때마다 노리는 적을 가로지르는 실 30가닥 연사
// (남은 실이 10 이하일 때 쏜 실은 연사에 안 셈) · 다 쓰면 장전 · 실 피해는 기본 공격력의 20%(아이템 무관), 맞을 때마다 출혈 스택 30이면 과다출혈 500%. 수치는 weaponsSilk.SILK, 아이템은 itemsSilk
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, TICK_RATE } from "../constants";
import { PW } from "../paewangDefs";
import { SILK_PERKS as K } from "../itemsSilk";
import { createRng, deriveSeed } from "../rng";
import { SILK as S, type SilkStyle } from "../weaponsSilk";
import { nearest } from "./brawlMoves";
import { healPlayer } from "./combat";
import { applyBleed, updateBleed } from "./gunExtras";
import { rot } from "./orbit";
import { inCircle, onSegment, stun, strike } from "./s2Kit";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, hasPerk, normalize, weaponOf } from "./util";
import { baseStats } from "../content";

const styleOf = (p: PlayerState): SilkStyle => weaponOf(p).silk ?? { n: 1, spread: 0, stacks: 5, rendMul: 2.5, ammo: 100 };
const roll = (s: RunState, tag: string, n: number) => createRng(deriveSeed(s.seed, tag, s.tick, n)).nextFloat();
const isSilk = (p: PlayerState) => p.characterId === "silk";
/** 핏빛 실: 실이 빨갛고 얽힘(찢기) 실은 검정 (그리기 색만) */
const crimson = (p: PlayerState) => p.weaponId === "skCrimson";

/** 장전 수 */
export const silkMag = (p: PlayerState) => styleOf(p).ammo + (hasPerk(p, "skMore") ? K.skMore.n : 0);
const reloadTicks = (p: PlayerState) => Math.round(S.reload * (hasPerk(p, "skFast") ? K.skFast.mul : 1));
/** 화면용: 남은 실 · 장전 수 · 장전 진행 0~1 (장전 중이 아니면 0) */
export function silkAmmo(p: PlayerState): { ammo: number; max: number; reload: number } {
  const r = p.skReload ?? 0;
  return { ammo: p.skAmmo ?? silkMag(p), max: silkMag(p), reload: r > 0 ? 1 - r / reloadTicks(p) : 0 };
}

/** 비단 방패: 장전하는 동안 받는 피해 (classTaken) */
export const silkTaken = (p: PlayerState) => (isSilk(p) && (p.skReload ?? 0) > 0 && hasPerk(p, "skShield") ? K.skShield.taken : 1);

/** (x, y)를 지나 (dx, dy) 쪽으로 뻗은 줄을 방 끝에서 끝까지 자름 */
function edgeLine(x: number, y: number, dx: number, dy: number): [number, number, number, number] {
  let lo = -1e9;
  let hi = 1e9;
  for (const [o, d, a, b] of [[x, dx, ROOM_MIN_X, ROOM_MAX_X], [y, dy, ROOM_MIN_Y, ROOM_MAX_Y]] as const) {
    if (Math.abs(d) < 1e-6) continue;
    const t1 = (a - o) / d;
    const t2 = (b - o) / d;
    lo = Math.max(lo, Math.min(t1, t2));
    hi = Math.min(hi, Math.max(t1, t2));
  }
  return [x + dx * lo, y + dy * lo, x + dx * hi, y + dy * hi];
}

/** 찢기: 실이 당겨 적을 찢음 */
function rend(s: RunState, e: EnemyState): void {
  const p = s.player;
  const st = styleOf(p);
  e.skStacks = 0;
  strike(s, e, p.stats.damage * (st.rendMul + (hasPerk(p, "skRend") ? K.skRend.add : 0)));
  applyBleed(e);
  if (st.cocoon) stun(e, st.cocoon);
  if (st.pull) {
    for (const o of inCircle(s, e.x, e.y, S.pullR)) {
      if (o === e) continue;
      const d = normalize(e.x - o.x, e.y - o.y);
      if (d) {
        o.x += d[0] * S.pullBy;
        o.y += d[1] * S.pullBy;
      }
      o.skStacks = (o.skStacks ?? 0) + 1;
    }
  }
  if (hasPerk(p, "skBlood")) healPlayer(s, K.skBlood.heal);
  addEffect(s, { kind: "skRend", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 10, maxTicks: 24, ...(crimson(p) ? { tint: "#141014" } : {}) });
}

/** 실 한 가닥 피해: 아이템을 뺀 기본 공격력 기준 (공격력 아이템은 찢기·과다출혈만 세짐) */
const threadDmg = (p: PlayerState) => baseStats(p.characterId, p.weaponId).damage * S.threadMul * (hasPerk(p, "skEdge") ? K.skEdge.mul : 1);

/** 실에 맞음: 출혈 스택 (최대 30) · 다 쌓이면 과다출혈 (공격력 500%) */
function bleedStack(s: RunState, e: EnemyState): void {
  if (e.hp <= 0) return;
  applyBleed(e);
  e.skBleed = (e.skBleed ?? 0) + 1;
  if (e.skBleed < S.bleedMax) return;
  e.skBleed = 0;
  strike(s, e, s.player.stats.damage * S.overbleedMul);
  addEffect(s, { kind: "skBleed", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 14, maxTicks: 30 });
}

/** 실 한 가닥: (x, y)를 지나 방 끝에서 끝까지 · 그 줄의 적을 베고 얽힘 */
function thread(s: RunState, x: number, y: number, dx: number, dy: number, dmg: number): void {
  const p = s.player;
  const st = styleOf(p);
  // 패왕전: 방 끝까지 가면 화면을 다 덮어서, 내 앞(연사는 표적 둘레)으로 짧게
  const L = PW.silkReach;
  const self = x === p.x;
  const [x0, y0, x1, y1] = s.pvp ? [self ? x : x - (dx * L) / 2, self ? y : y - (dy * L) / 2, x + (dx * L) / (self ? 1 : 2), y + (dy * L) / (self ? 1 : 2)] : edgeLine(x, y, dx, dy);
  const need = st.stacks - (hasPerk(p, "skTangle") ? K.skTangle.n : 0);
  for (const e of onSegment(s, x0, y0, x1, y1, S.width)) {
    strike(s, e, dmg);
    bleedStack(s, e);
    if (st.slow) e.slowTicks = Math.max(e.slowTicks ?? 0, st.slow);
    e.skStacks = (e.skStacks ?? 0) + 1;
    if (e.hp > 0 && e.skStacks >= need) rend(s, e);
  }
  addEffect(s, { kind: "skLine", x: x0, y: y0, dirX: dx, dirY: dy, size: 1, toX: x1, toY: y1, maxTicks: S.lineTicks, ...(crimson(p) ? { tint: "#e0203a" } : {}) });
  if (st.linger) (p.skLines ??= []).push({ x0, y0, x1, y1, t: S.lineTicks, dmg });
}

/** 한 번 쏘기: 노리는 적 쪽으로 n가닥 (실 n개 씀) */
function fire(s: RunState): void {
  const p = s.player;
  const st = styleOf(p);
  const target = nearest(s, p.stats.range * 1.5);
  const d = (target && normalize(target.x - p.x, target.y - p.y)) || [p.faceX, p.faceY];
  [p.faceX, p.faceY] = d;
  const dmg = threadDmg(p);
  const before = p.skAmmo ?? silkMag(p);
  const n = Math.min(st.n, before);
  for (let i = 0; i < n; i++) {
    const [c, sn] = rot((i - (n - 1) / 2) * st.spread);
    thread(s, p.x, p.y - 3, d[0] * c - d[1] * sn, d[0] * sn + d[1] * c, dmg);
  }
  p.skAmmo = before - n;
  // 실을 쓴 만큼 연사 (남은 실이 적을 때 쏜 건 안 셈)
  if (before > S.burstLow) {
    const every = hasPerk(p, "skFrenzy") ? K.skFrenzy.every : S.burstEvery;
    p.skUsed = (p.skUsed ?? 0) + n;
    if (p.skUsed >= every && target && !p.skBurst) {
      p.skUsed -= every;
      p.skBurst = { id: target.id, left: S.burstN, gap: 0 };
    }
  }
  if (p.skAmmo <= 0) p.skReload = reloadTicks(p);
}

/** 틱마다: 장전 · 실 연사 · 남은 실(하프 현) */
function update(s: RunState): void {
  const p = s.player;
  if ((p.skReload ?? 0) > 0) {
    p.skReload = (p.skReload ?? 0) - 1;
    if (p.skReload <= 0) {
      p.skAmmo = silkMag(p);
      addEffect(s, { kind: "skReload", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 12, maxTicks: 14 });
    }
  }
  const b = p.skBurst;
  if (b && --b.gap <= 0) {
    const e = s.enemies.find((o) => o.id === b.id && o.hp > 0) ?? nearest(s, p.stats.range * 2);
    if (!e) delete p.skBurst;
    else {
      const [c, sn] = rot(roll(s, "skBurst", b.left) * Math.PI);
      thread(s, e.x, e.y, c, sn, threadDmg(p) * S.burstMul);
      b.gap = S.burstGap;
      if (--b.left <= 0) delete p.skBurst;
    }
  }
  if (p.skLines?.length) {
    for (const l of p.skLines) {
      if (--l.t % S.lingerGap !== 0) continue;
      for (const e of onSegment(s, l.x0, l.y0, l.x1, l.y1, S.width)) strike(s, e, l.dmg * 0.5);
    }
    p.skLines = p.skLines.filter((l) => l.t > 0);
  }
  updateBleed(s);
}

/** 틱마다 (실을 들었을 때 player에서) */
export function silkTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  if (!isSilk(p)) return;
  if (p.skAmmo === undefined) p.skAmmo = silkMag(p);
  update(s);
  if (!want || p.attackCooldown > 0 || (p.skReload ?? 0) > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  fire(s);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetSilk(p: PlayerState): void {
  for (const k of ["skAmmo", "skReload", "skUsed", "skBurst", "skLines"] as const) delete p[k];
}
