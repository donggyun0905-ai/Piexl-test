// 제우스 신의 힘: 번개로 지지기(감전 쌓기·과부하) · 옮겨 붙는 번개 · 천벌 게이지 → 제우스 강림(무적·공격 두 배·방 곳곳 벼락)
// 폭풍 구름 · 구전 지지기 · 번개 걸음(대시) · 아이기스(받는 피해) · 응징(맞으면 벼락)
import { srcRun } from "./dmgSrc";
import { createRng, deriveSeed } from "../rng";
import { ZEUS_PERKS as K } from "../itemsZeus";
import { ZEUS as Z } from "../weaponsZeus";
import { blastAt } from "./combat";
import { alive, inCircle, isBoss, onSegment, strike } from "./s2Kit";
import type { EnemyState, PlayerState, ProjectileState, RunState } from "./types";
import { addEffect, hasPerk, weaponOf } from "./util";

const rnd = (s: RunState, ...tags: (string | number)[]) => createRng(deriveSeed(s.seed, "zs", s.tick, ...tags)).nextFloat();

/** 화면용: 천벌 게이지 0~1 */
export const zeusWrath = (p: PlayerState) => Math.min(1, (p.zsWrath ?? 0) / Z.wrathNeed);

/** 번개로 지짐: 감전만큼 더 아프고(거인 학살자: 보스 +50%) 감전 +1 · 천벌 게이지 · 과부하 */
export function zap(s: RunState, e: EnemyState, dmg: number): void {
  const p = s.player;
  if (e.hp <= 0) return;
  let d = dmg * (1 + (e.zsShock ?? 0) * Z.shockTaken);
  if (isBoss(e) && hasPerk(p, "zsGiant")) d *= K.zsGiant.mul;
  strike(s, e, d, 0, "shock");
  e.zsShock = Math.min(Z.shockMax, (e.zsShock ?? 0) + 1);
  if (!p.zsGod) p.zsWrath = (p.zsWrath ?? 0) + (hasPerk(p, "zsWrath") ? K.zsWrath.mul : 1);
  if (e.zsShock >= Z.shockMax && hasPerk(p, "zsOverload")) srcRun(s, "zsOverload", () => {
    e.zsShock = 0;
    blastAt(s, e.x, e.y, K.zsOverload.r, p.stats.damage * K.zsOverload.mul, { exclude: e });
    addEffect(s, { kind: "zsOverload", x: e.x, y: e.y, dirX: 0, dirY: 0, size: K.zsOverload.r, maxTicks: 18 });
  });
}

/** 하늘에서 내리치는 벼락 (r가 있으면 둘레도) */
export function skyBolt(s: RunState, e: EnemyState, dmg: number, r = 0): void {
  zap(s, e, dmg);
  if (r > 0) for (const f of inCircle(s, e.x, e.y, r)) if (f !== e) zap(s, f, dmg * 0.5);
  addEffect(s, { kind: "zsSky", x: e.x, y: e.y, dirX: 0, dirY: 0, size: Math.max(8, r), maxTicks: 16 });
}

/** 옮겨 붙는 번개: from에서 가까운 적으로 n번 (전도 +2) */
export function chainFrom(s: RunState, from: EnemyState, n: number, dmg: number): void {
  const hit = [from.id];
  let at = from;
  const total = n + (hasPerk(s.player, "zsConductor") ? K.zsConductor.n : 0);
  for (let i = 0; i < total; i++) {
    const next = alive(s)
      .filter((e) => !hit.includes(e.id))
      .sort((a, b) => Math.hypot(a.x - at.x, a.y - at.y) - Math.hypot(b.x - at.x, b.y - at.y))[0];
    if (!next || Math.hypot(next.x - at.x, next.y - at.y) > Z.chainReach) break;
    zap(s, next, dmg * Z.chainMul);
    addEffect(s, { kind: "zsArc", x: at.x, y: at.y, dirX: 0, dirY: 0, size: 2, toX: next.x, toY: next.y, maxTicks: 12 });
    hit.push(next.id);
    at = next;
  }
}

/** 제우스 탄이 맞았을 때 (s2Hits): 번개창은 옮겨 붙고 · 독수리·구전·번개창 모두 감전 */
export function zeusShotHit(s: RunState, pr: ProjectileState, e: EnemyState): void {
  if (pr.spirit !== "zsJavelin" && pr.spirit !== "zsEagle" && pr.spirit !== "zsOrb") return;
  const p = s.player;
  e.zsShock = Math.min(Z.shockMax, (e.zsShock ?? 0) + 1);
  if (!p.zsGod) p.zsWrath = (p.zsWrath ?? 0) + 1;
  if (pr.spirit === "zsJavelin") chainFrom(s, e, weaponOf(p).zeus?.chains ?? 2, pr.damage);
}

/** 틱마다: 천벌 → 강림 · 강림 중 벼락 · 폭풍 구름 · 구전 · 번개 걸음 */
export function powerTick(s: RunState): void {
  const p = s.player;
  if (!p.zsGod && (p.zsWrath ?? 0) >= Z.wrathNeed) {
    p.zsWrath = 0;
    p.zsGod = Z.godTicks;
    for (const e of alive(s)) skyBolt(s, e, p.stats.damage * Z.godMul);
    addEffect(s, { kind: "zsDescend", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 200, maxTicks: 50 });
  }
  if (p.zsGod) {
    p.zsGod--;
    p.invulnTicks = Math.max(p.invulnTicks, 2);
    const foes = alive(s);
    if (s.tick % Z.godGap === 0 && foes.length) skyBolt(s, foes[Math.floor(rnd(s, "god") * foes.length)]!, p.stats.damage * Z.godMul, 20);
  }
  if (p.zsClouds?.length) {
    for (const c of p.zsClouds) {
      c.t--;
      if (c.t % Z.stormGap !== 0) continue;
      const near = inCircle(s, c.x, c.y, c.r ?? 40);
      const e = near[Math.floor(rnd(s, "cloud", c.x) * near.length)];
      if (e) skyBolt(s, e, c.dmg ?? 0);
      else addEffect(s, { kind: "zsSky", x: c.x + (rnd(s, "cx") - 0.5) * 40, y: c.y + (rnd(s, "cy") - 0.5) * 30, dirX: 0, dirY: 0, size: 8, maxTicks: 16 });
    }
    p.zsClouds = p.zsClouds.filter((c) => c.t > 0);
  }
  if (s.tick % Z.orbGap === 0) {
    for (const pr of s.projectiles) {
      if (pr.spirit !== "zsOrb") continue;
      for (const e of inCircle(s, pr.x, pr.y, weaponOf(p).zeus?.radius ?? 44)) {
        zap(s, e, p.stats.damage * Z.orbMul);
        addEffect(s, { kind: "zsArc", x: pr.x, y: pr.y, dirX: 0, dirY: 0, size: 1, toX: e.x, toY: e.y, maxTicks: 8 });
      }
    }
  }
  stepDash(s);
}

/** 번개 걸음: 대시한 길을 따라 번개 (번개 걸음 아이템: 두 배 · 대시 중 무적) */
function stepDash(s: RunState): void {
  const p = s.player;
  if (p.dashTicks > 0) {
    p.zsDash ??= { x: p.x, y: p.y };
    if (hasPerk(p, "zsStep")) p.invulnTicks = Math.max(p.invulnTicks, 2);
    return;
  }
  const from = p.zsDash;
  if (!from) return;
  delete p.zsDash;
  const mul = Z.dashMul * (hasPerk(p, "zsStep") ? K.zsStep.mul : 1);
  for (const e of onSegment(s, from.x, from.y, p.x, p.y, Z.dashWidth)) zap(s, e, p.stats.damage * mul);
  addEffect(s, { kind: "zsArc", x: from.x, y: from.y, dirX: 0, dirY: 0, size: 3, toX: p.x, toY: p.y, maxTicks: 16 });
}

/** 받는 피해 (아이기스를 들면 줄어듦) · combat classTaken */
export const zeusTaken = (p: PlayerState) => (p.characterId === "zeus" && weaponOf(p).zeus?.mode === "aegis" ? Z.aegisTaken : 1);

/** 맞은 뒤: 응징 (확률로 적 셋에게 벼락) · combat afterHurt */
export function zeusHurt(s: RunState): void {
  const p = s.player;
  if (!hasPerk(p, "zsRetort") || rnd(s, "retort") >= K.zsRetort.chance) return; return srcRun(s, "zsRetort", () => {
  const foes = alive(s);
  for (let i = 0; i < K.zsRetort.n && foes.length; i++) skyBolt(s, foes[Math.floor(rnd(s, "rt", i) * foes.length)]!, p.stats.damage * K.zsRetort.mul);
}); }
