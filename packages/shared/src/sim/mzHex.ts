// 마젠타 한 대 (nrKit.nrHit가 on.hex일 때 부름 · nrKit을 불러오지 않음, 서로 불러오는 순환을 피함)
// 저주: 맞을 때마다 겹이 쌓이고 간격마다 겹 수만큼 저주 피해 · 매료의 향기: 확률로 매혹(느려지고 끌려옴, 분홍 매혹 피해) · 매혹·향기 연기 안이면 받는 피해 증가
import { MZ_CHARM as C, MZ_HEX as H, MZ_SCENT as W } from "../itemsMagenta";
import { createRng, deriveSeed } from "../rng";
import { ashDot } from "./ashDot";
import { bjAlive } from "./bjKit";
import { bjBoss } from "./bjVolley";
import { damageEnemy as damageEnemy_ } from "./combat";
import { srcFn } from "./dmgSrc";
import type { EnemyState, RunState } from "./types";
import { addEffect, normalize } from "./util";

const damageEnemy = srcFn("magenta", () => damageEnemy_);

/** 마젠타 한 대에 붙는 것: 쌓을 저주 겹 · 반드시 매혹 */
export interface MzOn {
  hex: number;
  charm?: boolean;
}

/** 받는 피해 배율: 매혹 +10% · 향기 연기 안 +10% */
export function mzTaken(s: RunState, e: EnemyState): number {
  const charmed = (e.mzCharm ?? 0) > s.tick ? C.taken : 0;
  const scent = s.player.mzScents?.some((f) => (f.x - e.x) ** 2 + (f.y - e.y) ** 2 <= (W.r + e.r) ** 2) ? W.taken : 0;
  return 1 + charmed + scent;
}

/** 매혹 걸기: 분홍 매혹 피해 + 효과 (이미 걸려 있으면 시간만 늘림) */
export function mzCharm(s: RunState, e: EnemyState): void {
  if (!bjAlive(e)) return;
  const was = (e.mzCharm ?? 0) > s.tick;
  e.mzCharm = s.tick + C.ticks;
  if (was) return;
  ashDot(s, e, "charm", s.player.stats.damage * C.dmg * mzTaken(s, e));
  addEffect(s, { kind: "mzCharm", x: e.x, y: e.y - e.r - 6, dirX: 0, dirY: 0, size: 10, maxTicks: 24 });
}

/** 저주 겹 쌓기 */
export function mzHexAdd(s: RunState, e: EnemyState, n: number): void {
  e.mzHex = Math.min(H.max, (e.mzHex ?? 0) + n);
  e.mzHexAt = s.tick;
}

/** 저주 터뜨리기: 겹 수 × 공격력 × 배율 저주 피해 · 겹이 사라짐 · 준 피해 */
export function mzBurst(s: RunState, e: EnemyState, mul: number): number {
  const n = e.mzHex ?? 0;
  if (n <= 0 || !bjAlive(e)) return 0;
  delete e.mzHex;
  addEffect(s, { kind: "mzPop", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 8 + n * 2, maxTicks: 16 });
  return ashDot(s, e, "curse", s.player.stats.damage * H.burst * mul * n * mzTaken(s, e));
}

/** 시드 확률 (nrKit.nrRoll과 같은 칸을 씀) */
function roll(s: RunState, tag: string): number {
  const p = s.player;
  p.nrRolls = (p.nrRolls ?? 0) + 1;
  return createRng(deriveSeed(s.seed, tag, s.tick, p.nrRolls)).nextFloat();
}

/** 마젠타 한 대: 받는 피해 배율 · 저주 쌓기 · 확률(또는 반드시) 매혹 · 준 피해 */
export function mzHit(s: RunState, e: EnemyState, dmg: number, on: MzOn): number {
  const p = s.player;
  const d = normalize(e.x - p.x, e.y - p.y) ?? [p.faceX, p.faceY];
  const hp = e.hp;
  damageEnemy(s, e, dmg * mzTaken(s, e), d[0], d[1], false);
  if (!bjAlive(e)) return hp - Math.max(0, e.hp);
  mzHexAdd(s, e, on.hex);
  if (on.charm || roll(s, "mzCharm") < C.chance) mzCharm(s, e);
  return hp - Math.max(0, e.hp);
}

/** 틱마다: 저주 피해 · 풀림 · 매혹(느려지고 끌려옴, 보스는 느려지기만) · 연기 정리 · 낙인 터짐 */
export function mzHexTick(s: RunState): void {
  const p = s.player;
  for (const e of s.enemies) {
    if (!bjAlive(e)) continue;
    if ((e.mzHex ?? 0) > 0) {
      if (s.tick - (e.mzHexAt ?? 0) > H.life) delete e.mzHex;
      else if ((s.tick - (e.mzHexAt ?? 0)) % H.every === H.every - 1) ashDot(s, e, "curse", p.stats.damage * H.per * (e.mzHex ?? 0) * mzTaken(s, e));
    }
    if ((e.mzCharm ?? 0) <= s.tick) continue;
    e.slowTicks = Math.max(e.slowTicks ?? 0, 2);
    if (bjBoss(e)) continue;
    const dx = p.x - e.x;
    const dy = p.y - e.y;
    const dd = Math.sqrt(dx * dx + dy * dy);
    if (dd > e.r + p.r + 14) [e.x, e.y] = [e.x + (dx / dd) * C.pull, e.y + (dy / dd) * C.pull];
  }
  if (p.mzScents?.length) p.mzScents = p.mzScents.filter((f) => f.until > s.tick);
}
