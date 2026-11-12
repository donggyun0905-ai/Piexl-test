// 닌자 그림자: 표식이 다 차면 그 적의 그림자에서 분신이 튀어나와 벰. 무기마다 모양이 다름 (뒤에서 베기 · X자 · 땅 가시 · 환영진 9점 돌진)
// 환영진: 표식이 찬 적을 가운데로, 내 공격 범위(사거리)의 절반만 한 원 위 9곳에 그림자가 생겨 가운데로 돌진 (지나가며 베고 가운데를 내려침)
import { srcRun, srcFn, srcEach } from "./dmgSrc";
import { ENEMIES } from "../content";
import { NINJA_PERKS } from "../itemsNinja";
import { damageEnemy as damageEnemy_ } from "./combat";
import type { Shade } from "./ninjaTypes";
import type { EnemyState, RunState } from "./types";
import { dist2, hasPerk, normalize, weaponOf } from "./util";
const damageEnemy = srcFn("shades", () => damageEnemy_);

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  STRIKE_LIFE: 18,
  STRIKE_MUL: 1.8,
  /** X자 베기(그 적만) · 땅 가시(둘레까지): 피해 배율 · 범위 */
  CROSS_MUL: 2,
  SPIKE_MUL: 1.6,
  /** 환영진: 원 반지름 = 사거리 × 이 값 · 돌진 틱 · 그림자 하나 피해 배율 · 지나가며 베는 굵기 · 가운데 내려치는 범위 */
  RING_SCALE: 0.5,
  RING_MUL: 0.45,
  PASS_R: 5,
  CENTER_R: 12,
  /** 연막 구름: 0.5초마다 피해·표식·둔화 */
  SMOKE_EVERY: 30,
  SMOKE_SLOW: 40,
};
export { R as SHADES_RULES };

/** 뒤에서 베기: 나타나서 베기까지 틱 · 사라지는 틱 · 피해 배율 */
export const STRIKE_WAIT = 7;
export const SPIKE_R = 22;
export const RING_TICKS = 9;

/** 원 위 9곳 (40도 간격, 위에서 시작). 삼각함수 대신 정해 둔 값 · 쌍그림자용으로 20도 돌린 9곳 */
const RING9: readonly (readonly [number, number])[] = [
  [0, -1], [0.6428, -0.766], [0.9848, -0.1736], [0.866, 0.5], [0.342, 0.9397], [-0.342, 0.9397], [-0.866, 0.5], [-0.9848, -0.1736], [-0.6428, -0.766],
];
const RING9B: readonly (readonly [number, number])[] = [
  [0.342, -0.9397], [0.866, -0.5], [0.9848, 0.1736], [0.6428, 0.766], [0, 1], [-0.6428, 0.766], [-0.9848, 0.1736], [-0.866, -0.5], [-0.342, -0.9397],
];

/** 표식 하나 더 (다 차면 그림자). 닌자 무기를 들었을 때만 */
export function markEnemy(s: RunState, e: EnemyState, n = 1): void {
  const p = s.player;
  const w = weaponOf(p);
  if (!w.shade || e.immune || e.hp <= 0 || e.kind === "tower") return;
  const need = Math.max(1, (w.marks ?? 3) - (hasPerk(p, "shadowMark") ? 1 : 0));
  e.marks = (e.marks ?? 0) + n;
  if (e.marks < need) return;
  e.marks = 0;
  summon(s, e, 1, 0, 0);
  if (hasPerk(p, "twinShadow")) srcRun(s, "twinShadow", () => summon(s, e, NINJA_PERKS.twinShadow.damage, 1, 0));
}

function shade(kind: Shade["kind"], x: number, y: number, tx: number, ty: number, dmg: number, target: number, life: number, chain: number): Shade {
  return { kind, x, y, sx: x, sy: y, tx, ty, t: 0, life, dmg, target, hitIds: [], chain };
}

/** 그림자 부르기 (side 1 = 쌍그림자의 둘째: 옆에서·돌린 자리) */
function summon(s: RunState, e: EnemyState, mul: number, side: number, chain: number): void {
  const p = s.player;
  const list = (p.shades ??= []);
  const base = p.stats.damage * mul;
  const style = weaponOf(p).shade;
  if (style === "ring") {
    const r = p.stats.range * R.RING_SCALE;
    for (const [dx, dy] of side ? RING9B : RING9) list.push(shade("dash", e.x + dx * r, e.y + dy * r, e.x, e.y, base * R.RING_MUL, e.id, RING_TICKS + 8, chain));
    return;
  }
  if (style === "needle") {
    list.push(shade("spike", e.x, e.y, e.x, e.y, base * R.SPIKE_MUL, e.id, R.STRIKE_LIFE, chain));
    return;
  }
  // 적 뒤 (닌자 → 적 방향의 반대편). 둘째 그림자는 옆에서
  const d = normalize(e.x - p.x, e.y - p.y) ?? [1, 0];
  const [bx, by] = side ? [-d[1], d[0]] : d;
  const off = e.r + 6;
  list.push(shade(style === "blade" ? "cross" : "strike", e.x + bx * off, e.y + by * off, e.x, e.y, base * (style === "blade" ? R.CROSS_MUL : R.STRIKE_MUL), e.id, R.STRIKE_LIFE, chain));
}

/** 연막 구름 (dmg = 0.5초마다 피해) */
export function addSmoke(s: RunState, x: number, y: number, dmg: number, delay: number, life: number): void {
  const sm = shade("smoke", x, y, x, y, dmg, 0, life, 0);
  sm.t = -delay;
  (s.player.shades ??= []).push(sm);
}

/** 그림자 피해 (월광·암살 반영). 그림자 질주·그림자 연쇄도 여기서 */
function shadowHit(s: RunState, sh: Shade, e: EnemyState, dmg: number): void {
  const p = s.player;
  if (e.hp <= 0) return;
  let d = dmg;
  if (hasPerk(p, "moonlight")) d *= NINJA_PERKS.moonlight.damage;
  if (hasPerk(p, "assassin") && e.hp <= e.maxHp * NINJA_PERKS.assassin.below) d *= NINJA_PERKS.assassin.damage;
  const dir = normalize(e.x - sh.x, e.y - sh.y) ?? [0, 1];
  damageEnemy(s, e, d, dir[0], dir[1]);
  if (hasPerk(p, "shadowRush")) p.kageTicks = NINJA_PERKS.shadowRush.ticks;
  // 그림자 연쇄: 쓰러뜨리면 가까운 적에게 옮겨 붙음
  if (e.hp <= 0 && hasPerk(p, "shadowChain") && sh.chain < NINJA_PERKS.shadowChain.hits) srcRun(s, "shadowChain", () => {
    const next = nearestOther(s, e, NINJA_PERKS.shadowChain.radius);
    if (next) summon(s, next, 1, 0, sh.chain + 1);
  });
}

function nearestOther(s: RunState, from: EnemyState, radius: number): EnemyState | null {
  let best: EnemyState | null = null;
  for (const e of s.enemies) {
    if (e === from || e.hp <= 0 || e.immune || dist2(e, from) > radius * radius) continue;
    if (!best || dist2(e, from) < dist2(best, from)) best = e;
  }
  return best;
}

function around(s: RunState, x: number, y: number, r: number): EnemyState[] {
  return s.enemies.filter((e) => e.hp > 0 && (e.x - x) * (e.x - x) + (e.y - y) * (e.y - y) <= (r + e.r) * (r + e.r));
}

/** 틱마다 그림자 움직이기·베기 */
export function updateShades(s: RunState): void {
  const p = s.player;
  if (!p.shades?.length) return;
  for (const sh of srcEach(p.shades)) {
    sh.t++;
    const target = sh.target ? s.enemies.find((e) => e.id === sh.target && e.hp > 0) : undefined;
    if (sh.kind === "dash") {
      // 가운데(표식이 찬 적)를 따라가며 모여듦 (밀려나도 놓치지 않게)
      if (target && sh.t <= RING_TICKS) {
        sh.tx = target.x;
        sh.ty = target.y;
      }
      const f = Math.min(1, sh.t / RING_TICKS);
      sh.x = sh.sx + (sh.tx - sh.sx) * f;
      sh.y = sh.sy + (sh.ty - sh.sy) * f;
      if (sh.t <= RING_TICKS) {
        for (const e of around(s, sh.x, sh.y, R.PASS_R)) {
          if (sh.hitIds.includes(e.id)) continue;
          sh.hitIds.push(e.id);
          shadowHit(s, sh, e, sh.dmg);
        }
      }
      if (sh.t === RING_TICKS) for (const e of around(s, sh.tx, sh.ty, R.CENTER_R)) shadowHit(s, sh, e, sh.dmg);
    } else if (sh.kind === "smoke") {
      if (sh.t > 0 && sh.t % R.SMOKE_EVERY === 0) {
        const r = weaponOf(p).blast ?? 26;
        for (const e of around(s, sh.x, sh.y, r)) {
          if (!ENEMIES[e.kind].boss) e.slowTicks = Math.max(e.slowTicks ?? 0, R.SMOKE_SLOW);
          damageEnemy(s, e, sh.dmg, 0, 0);
          markEnemy(s, e);
        }
      }
    } else {
      // 뒤에서 베기·X자·가시: 적을 따라가다 때가 되면 벰
      if (target && sh.t < STRIKE_WAIT) {
        const dx = sh.x - sh.tx;
        const dy = sh.y - sh.ty;
        sh.tx = target.x;
        sh.ty = target.y;
        sh.x = target.x + dx;
        sh.y = target.y + dy;
      }
      if (sh.t === STRIKE_WAIT) {
        // 뒤에서 베기·X자 베기는 그 적만, 땅 가시는 둘레까지
        if (sh.kind !== "spike") {
          if (target) shadowHit(s, sh, target, sh.dmg);
        } else for (const e of around(s, sh.tx, sh.ty, SPIKE_R)) shadowHit(s, sh, e, sh.dmg);
      }
    }
  }
  p.shades = p.shades.filter((sh) => sh.t < sh.life);
}
