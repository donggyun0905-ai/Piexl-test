// 느아르 공용 도우미 (sim/noir·nrVolley·nrSkills·nrAdapt가 같이 씀): 굴림 · 한 대 · 범위 · 빨아들이기
import { createRng, deriveSeed } from "../rng";
import { damageEnemy as damageEnemy_ } from "./combat";
import { srcFn } from "./dmgSrc";
import { buFrostHit } from "./buFrost";
import { jnZapHit } from "./jnZap";
import { mzHit } from "./mzHex";
import type { HitOn } from "./nrTypes";
import { rgAfflict } from "./rgBleed";
import type { EnemyState, RunState } from "./types";
import { normalize } from "./util";
import { bjAlive as nrAlive, bjNearest } from "./bjKit";
import { bjBoss as nrBoss } from "./bjVolley";

type P = RunState["player"];
const damageEnemy = srcFn("noir", () => damageEnemy_);

export const isNoir = (p: P) => p.characterId === "noir";
/** 아슈바르는 사거리 증가를 공격에 쓰지 않음: 범위·이펙트 크기 고정 (2026-11-13 사용자 지시, i18n/guides/rangeRule에 적음) */
export const ASH_REACH = 1;
/** 아슈바르 (적응력·제약을 같이 씀): 느아르 · 루주 · 블뢰 · 존 · 마젠타 */
export const ASHVAR_IDS: readonly string[] = ["noir", "rouge", "bleu", "jaune", "magenta"];
export const isAshvar = (p: Pick<P, "characterId">) => ASHVAR_IDS.includes(p.characterId);
// 살아 있는 적 · 보스(허수아비 포함) · 가장 가까운 적은 백인장과 같은 도우미
export { bjAlive as nrAlive, bjNearest as nrNearest } from "./bjKit";
export { bjBoss as nrBoss } from "./bjVolley";

/** 시드 확률 (굴릴 때마다 다른 값) */
export function nrRoll(s: RunState, tag: string): number {
  const p = s.player;
  p.nrRolls = (p.nrRolls ?? 0) + 1;
  return createRng(deriveSeed(s.seed, tag, s.tick, p.nrRolls)).nextFloat();
}

/** 한 대 (밀지 않음: 연타가 많아서) · 출혈·화상(루주) · 빙결(블뢰, 서리 피해) · 번개(존, 감전 피해) · 준 피해 */
export function nrHit(s: RunState, e: EnemyState, dmg: number, on?: HitOn): number {
  if (!nrAlive(e)) return 0;
  if (on?.frost) return buFrostHit(s, e, dmg, on);
  if (on?.zap) return jnZapHit(s, e, dmg);
  if (on?.hex !== undefined) return mzHit(s, e, dmg, { hex: on.hex, charm: on.charm });
  const p = s.player;
  const d = normalize(e.x - p.x, e.y - p.y) ?? [p.faceX, p.faceY];
  const hp = e.hp;
  damageEnemy(s, e, dmg, d[0], d[1], false);
  if (on) rgAfflict(s, e, on);
  return hp - Math.max(0, e.hp);
}

/** 범위 안 적 모두 때림 (arc가 있으면 dx·dy 쪽 부채꼴만) · 준 피해 합 */
export function nrArea(s: RunState, x: number, y: number, r: number, dmg: number, arc?: { at: number; dx: number; dy: number }, on?: HitOn): number {
  let sum = 0;
  for (const e of s.enemies) {
    if (!nrAlive(e)) continue;
    const ex = e.x - x;
    const ey = e.y - y;
    const d = Math.sqrt(ex * ex + ey * ey);
    if (d > r + e.r) continue;
    if (arc && d > e.r && (ex * arc.dx + ey * arc.dy) / d < arc.at) continue;
    sum += nrHit(s, e, dmg, on);
  }
  return sum;
}

/** (x, y)에서 dx·dy 쪽 직선(길이 len · 너비 w) 위의 적 모두 때림 · 준 피해 합 */
export function nrLine(s: RunState, x: number, y: number, dx: number, dy: number, len: number, w: number, dmg: number, on?: HitOn): number {
  let sum = 0;
  for (const e of s.enemies) {
    if (!nrAlive(e)) continue;
    const t = Math.max(0, Math.min(len, (e.x - x) * dx + (e.y - y) * dy));
    if ((e.x - x - dx * t) ** 2 + (e.y - y - dy * t) ** 2 > (w + e.r) ** 2) continue;
    sum += nrHit(s, e, dmg, on);
  }
  return sum;
}

/** 공격 범위(range) 안 마우스 자리 (마우스가 없으면 가까운 적, 없으면 앞 절반) */
export function nrAim(s: RunState, range: number): [number, number] {
  const p = s.player;
  if (p.aimDist !== undefined) {
    const d = Math.min(p.aimDist, range);
    return [p.x + p.faceX * d, p.y + p.faceY * d];
  }
  const e = bjNearest(s, p.x, p.y, range, p.faceX, p.faceY);
  return e ? [e.x, e.y] : [p.x + p.faceX * range * 0.5, p.y + p.faceY * range * 0.5];
}

/** (x, y) 둘레 r 안의 적을 가운데로 빨아들임 (보스·허수아비 빼고) */
export function nrPull(s: RunState, x: number, y: number, r: number, pull: number): void {
  if (pull <= 0) return;
  for (const e of s.enemies) {
    if (!nrAlive(e) || nrBoss(e)) continue;
    const dx = x - e.x;
    const dy = y - e.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < 2 || d > r + e.r + 30) continue;
    const m = Math.min(pull, d - 1) / d;
    e.x += dx * m;
    e.y += dy * m;
  }
}
