// 가브리엘 공용 도우미: 맞히기(성채의 위엄) · 압박 · 빛의 망치 떨어뜨리기 · 철옹(받는 피해) · 맞음·처치 · 스킬 대기
import { srcRun } from "./dmgSrc";
import { GABRIEL_PERKS as K } from "../itemsGabriel";
import { GABRIEL as G } from "../weaponsGabriel";
import { inCircle, isBoss, stun, strike } from "./s2Kit";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, hasPerk } from "./util";

export const isGabriel = (p: PlayerState) => p.characterId === "gabriel";

/** 한 번 맞힘 (mul: 공격력 배율 · 성채의 위엄: 보호막이 있으면 더 셈) */
export function gbHit(s: RunState, e: EnemyState, mul: number, push = 0): void {
  const p = s.player;
  if (e.hp <= 0) return;
  const aegis = hasPerk(p, "gbAegis") && (p.shieldPts ?? 0) > 0 ? K.gbAegis.mul : 1;
  strike(s, e, p.stats.damage * mul * aegis, push);
}

/** 압박: 느려짐 (보스는 느려지지 않고 표시만) */
export function press(s: RunState, e: EnemyState, ticks = G.pressTicks): void {
  const t = Math.round(ticks * (hasPerk(s.player, "gbWeight") ? K.gbWeight.mul : 1));
  e.gbPress = Math.max(e.gbPress ?? 0, t);
  if (!isBoss(e)) e.slowTicks = Math.max(e.slowTicks ?? 0, t);
}

/** 빛의 망치를 하늘에서 떨어뜨림 (t틱 뒤 땅에 닿아 r 안의 적에게 dmg) · 그림은 바로 내려오기 시작 */
export function dropHammer(s: RunState, x: number, y: number, t: number, r: number, dmg: number, stunT = 0, pressed = true): void {
  (s.player.gbDrops ??= []).push({ x, y, t, r, dmg, stun: stunT, press: pressed });
  addEffect(s, { kind: "gbHammer", x, y, dirX: t, dirY: 0, size: r, maxTicks: t + 22 });
}

/** 땅이 울림: r 안의 적에게 dmg (기절·압박) + 갈라지는 고리 */
export function quake(s: RunState, x: number, y: number, r: number, dmg: number, stunT: number, pressed: boolean): void {
  for (const e of inCircle(s, x, y, r)) {
    strike(s, e, dmg, G.dropPush);
    if (stunT > 0) stun(e, stunT);
    if (pressed) press(s, e);
  }
  addEffect(s, { kind: "gbSlam", x, y, dirX: 0, dirY: 0, size: r, maxTicks: 26 });
}

/** 철옹: 가브리엘이 받는 피해 배율 (classTaken) · 패왕전은 따로 맞춤(paewangBalance) */
export function gabrielTaken(p: PlayerState, pvp: boolean): number {
  if (!isGabriel(p) || pvp) return 1;
  const iron = hasPerk(p, "gbIron") && p.hp <= p.stats.maxHp * K.gbIron.below ? K.gbIron.taken : 1;
  return (hasPerk(p, "gbPlate") ? K.gbPlate.halve : G.halve) * iron;
}

/** 압박된 적이 받는 피해 배율 (중력 핵, combat.damageEnemy) */
export function gbFoeTaken(s: RunState, e: EnemyState): number {
  return (e.gbPress ?? 0) > 0 && hasPerk(s.player, "gbGrav") ? 1 + K.gbGrav.taken : 1;
}

/** 능력치 다시 셀 때 (items.recalcStats): 공격력은 한도에서 멈추고 넘는 만큼 최대 체력으로 */
export function gabrielStats(p: PlayerState): void {
  if (!isGabriel(p) || p.stats.damage <= G.damageCap) return;
  p.stats.maxHp += (p.stats.damage - G.damageCap) * G.hpPerDamage;
  p.stats.damage = G.damageCap;
}

/** 맞은 뒤 (classTaken.afterHurt): 깜빡이는 무적 없음(묵인처럼 아주 짧게) · 가시 방패 */
export function gabrielHurt(s: RunState, env: boolean): void {
  const p = s.player;
  if (!isGabriel(p)) return;
  p.invulnTicks = Math.min(p.invulnTicks, G.hurtTicks);
  if (env || !hasPerk(p, "gbThorns")) return; return srcRun(s, "gbThorns", () => {
  for (const e of inCircle(s, p.x, p.y, K.gbThorns.r)) {
    strike(s, e, p.stats.maxHp * K.gbThorns.hpMul, 8);
    press(s, e);
  }
  addEffect(s, { kind: "gbThorn", x: p.x, y: p.y, dirX: 0, dirY: 0, size: K.gbThorns.r, maxTicks: 20 });
}); }

/** 처치할 때 (hiddenPerks.relicKill): 압괴 */
export function gabrielKill(s: RunState, e: EnemyState): void {
  const p = s.player;
  if (!isGabriel(p) || !hasPerk(p, "gbCrush") || !(e.gbPress ?? 0)) return;
  quake(s, e.x, e.y, K.gbCrush.r, p.stats.maxHp * K.gbCrush.hpMul, 0, true);
}

/** 스킬마다 대기 틱 (아이템 반영) */
export function gbCooldown(p: PlayerState, i: number): number {
  return Math.round((G.cooldowns[i] ?? 0) * (hasPerk(p, "gbFaith") ? K.gbFaith.cd : 1));
}

/** 화면용: 스킬마다 남은 대기 0~1 (0 = 쓸 수 있음) */
export function gabrielSkills(p: PlayerState): number[] {
  return [0, 1, 2, 3].map((i) => Math.min(1, (p.gbCd?.[i] ?? 0) / Math.max(1, gbCooldown(p, i))));
}
