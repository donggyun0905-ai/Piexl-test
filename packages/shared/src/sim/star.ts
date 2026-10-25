// 별지기(히든): 공격하면 그 자리에 별을 박음 · 가까운 별끼리 빛줄기로 이어져 닿는 적을 태움 · 별이 가득 차면 별자리 완성, 모든 별이 터짐
import { TICK_RATE } from "../constants";
import { ENEMIES } from "../enemyDefs";
import { STAR_PERKS as K } from "../itemsStar";
import { STAR, STAR_COLORS, type StarStyle } from "../weaponsStar";
import { createRng, deriveSeed } from "../rng";
import { damageEnemy, healPlayer, ignite } from "./combat";
import type { StarNode } from "./starTypes";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, dist2, hasPerk, weaponOf } from "./util";

const styleOf = (p: PlayerState): StarStyle => weaponOf(p).star ?? "plain";
const roomKey = (s: RunState) => `${s.floor}/${s.roomId}`;
const roll = (s: RunState, label: string, n = 0) => createRng(deriveSeed(s.seed, label, s.tick, n)).nextFloat();

/** 별자리를 이루는 별 수 (가득 차면 터짐) */
export function starMax(p: PlayerState): number {
  const st = styleOf(p);
  const base = st === "nova" ? STAR.nova.max : st === "galaxy" ? STAR.galaxy.max : STAR.max;
  return base + (hasPerk(p, "extraStar") ? K.extraStar.more : 0);
}

/** 빛줄기가 이어지는 거리 */
export function starLink(p: PlayerState): number {
  return STAR.link * (styleOf(p) === "galaxy" ? STAR.galaxy.link : 1) * (hasPerk(p, "wideSky") ? K.wideSky.link : 1);
}

/** 이어진 별 쌍 (북극성이면 나도 별 하나) · 그리기에도 씀 */
export function starLinks(p: PlayerState): [StarNode, StarNode][] {
  const nodes: StarNode[] = [...(p.stStars ?? [])];
  if (styleOf(p) === "polaris") nodes.push({ x: p.x, y: p.y, left: 1 });
  const link = starLink(p);
  const out: [StarNode, StarNode][] = [];
  for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) if (dist2(nodes[i]!, nodes[j]!) <= link * link) out.push([nodes[i]!, nodes[j]!]);
  return out;
}

/** 틱마다 (별지기 무기를 들었을 때 player에서). want = 공격 키 */
export function starTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  if (p.stWhere !== roomKey(s)) {
    p.stStars = [];
    p.stWhere = roomKey(s);
  }
  const stars = (p.stStars ??= []);
  if (styleOf(p) === "blackhole") pullTick(s, stars);
  if (s.tick % STAR.lineEvery === 0) lineTick(s);
  p.stStars = stars.filter((o) => --o.left > 0);
  if (!want || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  const [x, y] = spot(s);
  const st = styleOf(p);
  if (st === "comet") cometPath(s, x, y);
  if (st === "twin") {
    // 바라보는 방향과 직각으로 나란히 둘
    const h = STAR.twinGap / 2;
    place(s, x - p.faceY * h, y + p.faceX * h);
    place(s, x + p.faceY * h, y - p.faceX * h);
  } else place(s, x, y);
  if (st === "meteor") meteors(s, x, y);
  if (hasPerk(p, "starfall") && roll(s, "starfall") < K.starfall.chance) {
    const a = roll(s, "starfallAt") * Math.PI * 2;
    place(s, x + Math.cos(a) * K.starfall.spread, y + Math.sin(a) * K.starfall.spread);
  }
  if ((p.stStars ?? []).length >= starMax(p)) burst(s);
}

/** 별을 박을 자리: 아직 별이 없는 가장 가까운 적 → 모두 별이 있으면 가장 가까운 적을 사이에 두고 마주 보게(빛줄기가 적을 지나가게) → 적이 없으면 앞쪽 */
function spot(s: RunState): [number, number] {
  const p = s.player;
  const inRange = s.enemies
    .filter((e) => e.hp > 0 && dist2(e, p) <= (p.stats.range + e.r) * (p.stats.range + e.r))
    .sort((a, b) => dist2(a, p) - dist2(b, p) || a.id - b.id);
  const stars = p.stStars ?? [];
  const free = inRange.find((e) => stars.every((o) => dist2(o, e) > STAR.spotGap * STAR.spotGap));
  if (free) return [free.x, free.y];
  const e: EnemyState | undefined = inRange[0];
  if (!e) return [p.x + p.faceX * p.stats.range * 0.6, p.y + p.faceY * p.stats.range * 0.6];
  const k = stars.length;
  const a = k * Math.PI + Math.floor(k / 2) * 1.1;
  return [e.x + Math.cos(a) * STAR.ring, e.y + Math.sin(a) * STAR.ring];
}

/** 둘레 적을 때림 (효과는 따로 그림) */
function hitArea(s: RunState, x: number, y: number, r: number, dmg: number): void {
  for (const e of [...s.enemies]) if (e.hp > 0 && dist2(e, { x, y }) < (r + e.r) * (r + e.r)) damageEnemy(s, e, dmg, 0, 0);
}

/** 별 하나 박기: 그 자리 둘레 적을 때림 */
function place(s: RunState, x: number, y: number): void {
  const p = s.player;
  const life = Math.round(STAR.life * (hasPerk(p, "longNight") ? K.longNight.life : 1));
  (p.stStars ??= []).push({ x, y, left: life });
  p.stPlaced = (p.stPlaced ?? 0) + 1;
  if (hasPerk(p, "zodiac") && p.stPlaced % K.zodiac.every === 0) p.stZodiac = true;
  hitArea(s, x, y, STAR.placeR, p.stats.damage * STAR.placeMul);
  addEffect(s, { kind: "stPlace", x, y, dirX: 0, dirY: 0, size: STAR.placeR, maxTicks: 14, tint: STAR_COLORS[styleOf(p)] });
}

/** 혜성 꼬리: 나에서 별까지 지나간 길의 적 */
function cometPath(s: RunState, x: number, y: number): void {
  const p = s.player;
  for (const e of [...s.enemies]) if (e.hp > 0 && segDist2(e, p, { x, y }) <= (e.r + 4) * (e.r + 4)) damageEnemy(s, e, p.stats.damage * STAR.cometMul, p.faceX, p.faceY);
  addEffect(s, { kind: "stComet", x: p.x, y: p.y, dirX: x - p.x, dirY: y - p.y, size: 3, maxTicks: 12, tint: STAR_COLORS.comet });
}

/** 유성우: 둘레에 유성이 떨어짐 */
function meteors(s: RunState, x: number, y: number): void {
  const p = s.player;
  for (let i = 0; i < STAR.meteor.n; i++) {
    const a = roll(s, "meteor", i) * Math.PI * 2;
    const r = STAR.meteor.spread * (0.5 + roll(s, "meteorR", i) * 0.5);
    const mx = x + Math.cos(a) * r;
    const my = y + Math.sin(a) * r;
    hitArea(s, mx, my, STAR.meteor.r, p.stats.damage * STAR.meteor.mul);
    addEffect(s, { kind: "stPlace", x: mx, y: my, dirX: 0, dirY: 0, size: STAR.meteor.r, maxTicks: 12, tint: STAR_COLORS.meteor });
  }
}

/** 빛줄기: 이어진 별 사이에 닿은 적 */
function lineTick(s: RunState): void {
  const p = s.player;
  const links = starLinks(p);
  if (links.length === 0) return;
  const st = styleOf(p);
  const dmg = p.stats.damage * STAR.lineMul * (st === "galaxy" ? STAR.galaxy.lineMul : 1) * (hasPerk(p, "brightStar") ? K.brightStar.line : 1);
  for (const e of [...s.enemies]) {
    if (e.hp <= 0) continue;
    const w = e.r + STAR.lineW;
    const n = links.filter(([a, b]) => segDist2(e, a, b) <= w * w).length;
    if (n === 0) continue;
    damageEnemy(s, e, dmg * n, 0, 0);
    if (st === "frost") e.slowTicks = Math.max(e.slowTicks ?? 0, STAR.frostSlow);
    if (st === "sun") ignite(e, p.stats.damage * STAR.sunBurn);
  }
}

/** 검은 별: 둘레 적(보스 빼고)을 별 쪽으로 끌어당김 */
function pullTick(s: RunState, stars: StarNode[]): void {
  for (const o of stars) {
    for (const e of s.enemies) {
      if (e.hp <= 0 || ENEMIES[e.kind].boss) continue;
      const d2 = dist2(e, o);
      if (d2 > STAR.pullR * STAR.pullR || d2 < 4) continue;
      const d = Math.sqrt(d2);
      e.x += ((o.x - e.x) / d) * STAR.pull;
      e.y += ((o.y - e.y) / d) * STAR.pull;
    }
  }
}

/** 별자리 완성: 모든 별이 터짐 */
function burst(s: RunState): void {
  const p = s.player;
  const st = styleOf(p);
  const r = st === "nova" ? STAR.nova.burstR : STAR.burstR;
  const mul = (st === "nova" ? STAR.nova.burstMul : STAR.burstMul) * (p.stZodiac ? K.zodiac.mul : 1);
  for (const o of p.stStars ?? []) {
    if (hasPerk(p, "eclipse") || st === "sun")
      for (const e of s.enemies) {
        if (e.hp <= 0 || dist2(e, o) > (r + e.r) * (r + e.r)) continue;
        if (hasPerk(p, "eclipse")) e.stunTicks = Math.max(e.stunTicks ?? 0, K.eclipse.stun);
        if (st === "sun") ignite(e, p.stats.damage * STAR.sunBurn * 2);
      }
    hitArea(s, o.x, o.y, r, p.stats.damage * mul);
    addEffect(s, { kind: "stBurst", x: o.x, y: o.y, dirX: 0, dirY: 0, size: r, maxTicks: 22, tint: STAR_COLORS[st] });
  }
  p.stStars = [];
  p.stZodiac = false;
  if (hasPerk(p, "stardust")) healPlayer(s, p.stats.maxHp * K.stardust.heal);
  if (hasPerk(p, "starWard")) {
    const add = Math.max(0, Math.min(K.starWard.shield, K.starWard.max - (p.stWard ?? 0)));
    p.stWard = (p.stWard ?? 0) + add;
    p.shieldPts = (p.shieldPts ?? 0) + add;
  }
  if (p.stWard) p.stWard = Math.min(p.stWard, p.shieldPts ?? 0);
}

/** 점 e와 선분 a-b 사이 거리의 제곱 */
function segDist2(e: { x: number; y: number }, a: { x: number; y: number }, b: { x: number; y: number }): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = dx * dx + dy * dy;
  const t = len === 0 ? 0 : Math.max(0, Math.min(1, ((e.x - a.x) * dx + (e.y - a.y) * dy) / len));
  const px = a.x + dx * t - e.x;
  const py = a.y + dy * t - e.y;
  return px * px + py * py;
}

/** 연습장 등에서 처음으로 */
export function resetStar(p: PlayerState): void {
  p.stStars = p.stWhere = p.stPlaced = p.stZodiac = p.stWard = undefined;
}
