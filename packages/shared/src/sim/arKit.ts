// 아리아 공용 도우미 (sim/aria·arBurst·arFinale·arInstruments가 같이 씀): 무기 모양·시드 확률·한 대·범위·가까운 적
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";
import { createRng, deriveSeed } from "../rng";
import { AR_STYLE, ARIA_WEAPONS, type AriaWeaponId } from "../weaponsAria";
import type { AriaFx } from "./arTypes";
import { damageEnemy } from "./combat";
import type { EnemyState, RunState } from "./types";
import { addEffect, normalize } from "./util";

type P = RunState["player"];

export const isAria = (p: P) => p.characterId === "aria";
export const hasAr = (p: P, id: string) => p.passives.includes(id as never);
export const arAlive = (e: EnemyState) => e.hp > 0 && !e.immune && !e.pwHid;

/** 지금 무기의 음표 모양 (아리아 무기가 아니면 황금 지휘봉) */
export const styleOf = (p: P) => AR_STYLE[(p.weaponId in ARIA_WEAPONS ? p.weaponId : "arBaton") as AriaWeaponId];

/** 시드 확률 (굴릴 때마다 다른 값) */
export function arRng(s: RunState, tag: string) {
  const p = s.player;
  p.arRolls = (p.arRolls ?? 0) + 1;
  return createRng(deriveSeed(s.seed, tag, s.tick, p.arRolls));
}
export const arRoll = (s: RunState, tag: string) => arRng(s, tag).nextFloat();

/** 방 안 무작위 자리 (벽에서 pad만큼 떨어져) */
export function arSpot(s: RunState, tag: string, pad: number): [number, number] {
  const rng = arRng(s, tag);
  return [ROOM_MIN_X + pad + rng.nextFloat() * Math.max(1, ROOM_MAX_X - ROOM_MIN_X - pad * 2), ROOM_MIN_Y + pad + rng.nextFloat() * Math.max(1, ROOM_MAX_Y - ROOM_MIN_Y - pad * 2)];
}

/** 한 대 (밀치지 않음) */
export function arHit(s: RunState, e: EnemyState, dmg: number, dx = 0, dy = 0): void {
  damageEnemy(s, e, dmg, dx, dy, false);
}

/** 범위 피해 + 그림 · 맞힌 수 */
export function arArea(s: RunState, x: number, y: number, r: number, dmg: number, fx: AriaFx | null, style = 0, ticks = 24): number {
  let n = 0;
  for (const e of s.enemies) {
    if (!arAlive(e) || (e.x - x) ** 2 + (e.y - y) ** 2 > (r + e.r) ** 2) continue;
    const d = normalize(e.x - x, e.y - y) ?? [0, 0];
    arHit(s, e, dmg, d[0], d[1]);
    n++;
  }
  if (fx) addEffect(s, { kind: fx, x, y, dirX: 0, dirY: 0, size: r, style, maxTicks: ticks });
  return n;
}

/** 가장 가까운 적 (skip은 빼고) */
export function arNearest(s: RunState, x: number, y: number, dist = Infinity, skip: readonly number[] = []): EnemyState | null {
  let best: EnemyState | null = null;
  let bd = dist * dist;
  for (const e of s.enemies) {
    if (!arAlive(e) || skip.includes(e.id)) continue;
    const d = (e.x - x) ** 2 + (e.y - y) ** 2;
    if (d < bd) [best, bd] = [e, d];
  }
  return best;
}
