// 유리엘 공용 도우미: 맞히기 · 단죄 쌓기 → 정화의 빛 · 회복(성녀의 손길·넘치는 은총) · 결계(안에 있는지·받는 피해) · 스킬 대기
import { YURIEL_PERKS as K } from "../itemsYuriel";
import { YURIEL as Y } from "../weaponsYuriel";
import { createRng, deriveSeed } from "../rng";
import { heal } from "./heal";
import { inCircle, strike, stun } from "./s2Kit";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, hasPerk } from "./util";

export const isYuriel = (p: PlayerState) => p.characterId === "yuriel";

/** 회복 (최대 체력 비율 frac) · 넘치는 은총: 넘친 몫 일부를 보호막으로 */
export function yrHeal(s: RunState, frac: number): void {
  const p = s.player;
  const amt = p.stats.maxHp * frac * (hasPerk(p, "yrTouch") ? K.yrTouch.heal : 1);
  const over = Math.max(0, p.hp + amt - p.stats.maxHp);
  heal(s, amt);
  if (hasPerk(p, "yrGrace") && over > 0) p.shieldPts = Math.min(p.stats.maxHp * K.yrGrace.cap, (p.shieldPts ?? 0) + over * K.yrGrace.keep);
}

/** 정화의 빛: 단죄가 가득 찬 적 둘레로 빛이 터짐 (빛 피해) · 회복 · 자비 없음이면 기절 */
function purge(s: RunState, e: EnemyState): void {
  const p = s.player;
  e.yrSin = 0;
  const r = Y.purgeR * (hasPerk(p, "yrBloom") ? K.yrBloom.r : 1);
  const dmg = p.stats.damage * Y.purgeMul * (hasPerk(p, "yrPyre") ? K.yrPyre.mul : 1);
  for (const o of inCircle(s, e.x, e.y, r)) {
    strike(s, o, dmg, 0, "radiance");
    if (hasPerk(p, "yrNoMercy")) stun(o, K.yrNoMercy.stun);
  }
  yrHeal(s, Y.purgeHeal);
  addEffect(s, { kind: "yrPurgeFx", x: e.x, y: e.y, dirX: 0, dirY: 0, size: r, maxTicks: 26 });
}

/** 단죄 n 쌓기 (이단 심문: 가끔 하나 더 · 성녀 강림 중 두 배) → 가득 차면 정화 */
export function addSin(s: RunState, e: EnemyState, n: number): void {
  const p = s.player;
  if (e.hp <= 0 || n <= 0) return;
  if (hasPerk(p, "yrInquest") && createRng(deriveSeed(s.seed, "yrInquest", s.tick, e.id)).nextFloat() < K.yrInquest.chance) n++;
  if ((p.yrSaint ?? 0) > 0) n *= 2;
  e.yrSin = Math.min(Y.sinMax, (e.yrSin ?? 0) + n);
  if (e.yrSin >= Y.sinMax) purge(s, e);
}

/** 한 번 맞힘: 공격력 × mul (radiance면 빛 피해) → 단죄 sin */
export function yrHit(s: RunState, e: EnemyState, mul: number, push = 0, sin = 1, radiance = false): void {
  if (e.hp <= 0) return;
  strike(s, e, s.player.stats.damage * mul, push, radiance ? "radiance" : undefined);
  addSin(s, e, sin);
}

/** 지금 결계들 (수호 결계 · 성녀 강림 중 몸 둘레) */
export function wards(p: PlayerState): { x: number; y: number; r: number }[] {
  const list: { x: number; y: number; r: number }[] = [];
  if (p.yrWard) list.push(p.yrWard);
  if ((p.yrSaint ?? 0) > 0) list.push({ x: p.x, y: p.y, r: wardR(p, Y.ultWardR) });
  return list;
}

/** 결계 반지름 (넓은 성역) */
export const wardR = (p: PlayerState, r: number) => r * (hasPerk(p, "yrSanct") ? K.yrSanct.r : 1);

const inside = (p: PlayerState, x: number, y: number) => wards(p).some((w) => Math.hypot(x - w.x, y - w.y) <= w.r);

/** 결계 안에서 유리엘이 받는 피해 배율 (classTaken) · 패왕전은 빼고 따로 맞춤 */
export function yurielTaken(p: PlayerState, pvp: boolean): number {
  if (!isYuriel(p) || pvp || !inside(p, p.x, p.y)) return 1;
  return hasPerk(p, "yrBulwark") ? K.yrBulwark.taken : Y.wardTaken;
}

/** 적이 받는 피해 배율 (결계 안 · 죄의 낙인, classTaken.foeTaken) */
export function yrFoeTaken(s: RunState, e: EnemyState): number {
  const p = s.player;
  if (!isYuriel(p)) return 1;
  const ward = inside(p, e.x, e.y) ? Y.wardFoeTaken : 0;
  const stigma = hasPerk(p, "yrStigma") ? (e.yrSin ?? 0) * K.yrStigma.taken : 0;
  return 1 + ward + stigma;
}

/** 스킬마다 대기 틱 (아이템 반영) */
export function yrCooldown(p: PlayerState, i: number): number {
  const orb = i === 0 && hasPerk(p, "yrOrb") ? K.yrOrb.cd : 1;
  return Math.round((Y.cooldowns[i] ?? 0) * orb * (hasPerk(p, "yrPrayer") ? K.yrPrayer.cd : 1));
}

/** 화면용: 스킬마다 남은 대기 0~1 (0 = 쓸 수 있음) */
export function yurielSkills(p: PlayerState): number[] {
  return [0, 1, 2, 3].map((i) => Math.min(1, (p.yrCd?.[i] ?? 0) / Math.max(1, yrCooldown(p, i))));
}
