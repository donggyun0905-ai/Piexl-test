// 네일러 공용 도우미: 피해(각성 배율) · 성흔 → 달빛 각성 · 못 박기 · 날아가는 못 · 스킬 대기·화면용 값
import { srcEach, srcRun } from "./dmgSrc";
import { NAILER_PERKS as K } from "../itemsNailer";
import { NAILER as N } from "../weaponsNailer";
import { STIGMA } from "../weaponsDawn";
import { alive, inCircle, strike } from "./s2Kit";
import { addStigma, awaken, isAwake } from "./stigma";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, hasPerk, reachOf } from "./util";

export const isNailer = (p: PlayerState) => p.characterId === "nailer";

/** 공격력 × mul (달빛 각성 중 더 셈) */
export const nlDmg = (p: PlayerState, mul: number) => p.stats.damage * mul * (isAwake(p) ? N.awakeMul : 1);

/** 성흔 채움 → 가득 차면 달빛 각성 (둘레 달빛 폭발 · 잠깐 무적) */
export function nlGain(s: RunState, n: number): void {
  const p = s.player;
  if (n <= 0 || !addStigma(p, n * (hasPerk(p, "nlMoon") ? K.nlMoon.gain : 1))) return;
  awaken(p, STIGMA.awakeTicks + (hasPerk(p, "nlBlind") ? K.nlBlind.more : 0));
  for (const e of inCircle(s, p.x, p.y, N.awakeBurstR)) strike(s, e, p.stats.damage * N.awakeBurstMul, 12, "radiance");
  p.invulnTicks = Math.max(p.invulnTicks, N.awakeInv);
  addEffect(s, { kind: "blAwakeFx", x: p.x, y: p.y, dirX: 0, dirY: 0, size: N.awakeBurstR, maxTicks: 40, follow: true });
}

/** 맞힌 뒤 처치했으면: 성흔 · 끝없는 사냥 (못이 박힌 적) */
export function nlAfter(s: RunState, e: EnemyState, had: number): number {
  if (e.hp > 0) return 0;
  const p = s.player;
  if (had > 0 && hasPerk(p, "nlRelent") && p.nlCd) p.nlCd[2] = Math.max(0, (p.nlCd[2] ?? 0) - K.nlRelent.cut);
  return N.gainKill;
}

/** 못 n개를 박음 (깊은 못: 많이 박힌 적에게는 두 배) */
export function addNails(s: RunState, e: EnemyState, n: number): void {
  if (e.hp <= 0) return;
  const deep = hasPerk(s.player, "nlDeep") && (e.nlNails ?? 0) >= K.nlDeep.from ? 2 : 1;
  e.nlNails = (e.nlNails ?? 0) + n * deep;
}

/** 못 하나가 적에 박힘: 피해 + 못 1 (미늘 못: 출혈) → 차는 성흔 */
export function nailHit(s: RunState, e: EnemyState, mul: number): void {
  const p = s.player;
  const had = e.nlNails ?? 0;
  const dmg = nlDmg(p, mul * (hasPerk(p, "nlIron") ? K.nlIron.mul : 1));
  strike(s, e, dmg, 2);
  addNails(s, e, 1);
  if (hasPerk(p, "nlBarb") && e.hp > 0) srcRun(s, "nlBarb", () => strike(s, e, dmg * K.nlBarb.mul, 0, "bleed"));
  addEffect(s, { kind: "nlStickFx", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r, maxTicks: 12 });
  nlGain(s, N.gainNail + nlAfter(s, e, had));
}

/** 못 하나를 (x, y)에서 (dx, dy) 쪽으로 던짐 (tg: 쫓는 적) */
export function throwNail(p: PlayerState, x: number, y: number, dx: number, dy: number, speed: number, mul: number, k: number, tg?: number): void {
  const t = Math.ceil((tg === undefined ? N.throwRange * reachOf(p) : N.ultReach * 1.5) / speed);
  (p.nlShots ??= []).push({ x, y, vx: dx * speed, vy: dy * speed, t, mul, k, ...(tg === undefined ? {} : { tg }) });
}

/** 날아가는 못 한 틱: 나아가며 처음 닿은 적에 박힘 (못비는 노린 적을 쫓음) */
export function shotsTick(s: RunState): void {
  const p = s.player;
  const list = p.nlShots;
  if (!list) return;
  const foes = alive(s);
  for (const n of srcEach(list)) {
    if (n.tg !== undefined) {
      const e = foes.find((f) => f.id === n.tg);
      const d = e ? Math.hypot(e.x - n.x, e.y - n.y) : 0;
      if (e && d > 0) {
        const sp = Math.hypot(n.vx, n.vy);
        n.vx = ((e.x - n.x) / d) * sp;
        n.vy = ((e.y - n.y) / d) * sp;
      }
    }
    n.x += n.vx;
    n.y += n.vy;
    n.t--;
    const hit = foes.find((e) => e.hp > 0 && (n.tg === undefined || e.id === n.tg) && (e.x - n.x) ** 2 + (e.y - n.y) ** 2 <= (e.r + N.nailHitR) ** 2);
    if (!hit) continue;
    nailHit(s, hit, n.mul);
    n.t = 0;
  }
  p.nlShots = list.filter((n) => n.t > 0);
  if (p.nlShots.length === 0) delete p.nlShots;
}

/** 스킬마다 대기 틱 (빠른 손목) */
export function nlCooldown(p: PlayerState, i: number): number {
  return Math.round((N.cooldowns[i] ?? 0) * (i === 0 && hasPerk(p, "nlQuick") ? K.nlQuick.cd : 1));
}

/** 화면용: 스킬마다 남은 대기 0~1 (0 = 쓸 수 있음) */
export function nailerSkills(p: PlayerState): number[] {
  return [0, 1, 2, 3].map((i) => Math.min(1, (p.nlCd?.[i] ?? 0) / Math.max(1, nlCooldown(p, i))));
}

/** 화면용: 여러 번 누르는 스킬의 다음 단계 (1 못 던지기 1~3 · 2 붉은 실 1~2, 처음이면 0) */
export function nailerStages(p: PlayerState): number[] {
  return [p.nlStage ? p.nlStage + 1 : 0, p.nlTie ? 2 : 0, 0, 0];
}
