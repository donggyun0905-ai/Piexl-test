// 헬피스트 공용 도우미: 피해(악마의 아귀) · 악마화(맞힐수록 사거리 증가) · 성흔 → 적혈 각성 · 각성 회복 · 허공 긁기 대상 고르기
import { HELLFIST_PERKS as K } from "../itemsHellfist";
import { HELLFIST as H } from "../weaponsHellfist";
import { STIGMA } from "../weaponsDawn";
import { healPlayer } from "./combat";
import { alive, inCircle, strike } from "./s2Kit";
import { addStigma, awaken, isAwake } from "./stigma";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, hasPerk, reachOf } from "./util";

export const isHellfist = (p: PlayerState) => p.characterId === "hellfist";

/** 악마화 최대 스택 */
export const rageMax = (p: PlayerState) => H.rageMax + (hasPerk(p, "hfGrow") ? K.hfGrow.add : 0);
/** 지금 악마화 스택 (각성 중에는 가득) */
export const rageOf = (p: PlayerState) => (isAwake(p) ? rageMax(p) : Math.min(rageMax(p), p.hfRage ?? 0));

/** 사거리 배율: 사거리 증가(reachOf) × 악마화 × 각성 */
export function hfReach(p: PlayerState): number {
  const per = hasPerk(p, "hfSpread") ? K.hfSpread.per : H.ragePer;
  return reachOf(p) * (1 + per * rageOf(p)) * (isAwake(p) ? H.awakeReach : 1);
}

/** 공격력 × mul (악마의 아귀: 악마화 가득이면 더 셈) */
export const hfDmg = (p: PlayerState, mul: number) => p.stats.damage * mul * (hasPerk(p, "hfMaw") && rageOf(p) >= rageMax(p) ? K.hfMaw.mul : 1);

/** 맞힌 뒤: 악마화 쌓기 · 각성 중 회복 · 성흔 채움 (n = 맞힌 적 수, gain = 적마다 성흔) */
export function hfHit(s: RunState, n: number, gain: number): void {
  const p = s.player;
  if (n <= 0) return;
  p.hfRage = Math.min(rageMax(p), (p.hfRage ?? 0) + (hasPerk(p, "hfFeed") ? K.hfFeed.add : 1));
  p.hfIdle = 0;
  if (isAwake(p)) {
    const m = hasPerk(p, "hfLeech") ? K.hfLeech.mul : 1;
    healPlayer(s, p.stats.maxHp * Math.min(H.awakeHealCap * m, H.awakeHeal * m * n));
  }
  hfGain(s, n * gain);
}

/** 성흔 채움 → 가득 차면 적혈 각성 (둘레 지옥불 폭발 · 잠깐 무적) */
function hfGain(s: RunState, n: number): void {
  const p = s.player;
  if (n <= 0 || !addStigma(p, n * (hasPerk(p, "hfBlood") ? K.hfBlood.gain : 1))) return;
  awaken(p, STIGMA.awakeTicks + (hasPerk(p, "hfLong") ? K.hfLong.more : 0));
  const b = hasPerk(p, "hfBurst");
  const r = H.awakeBurstR * (b ? K.hfBurst.r : 1);
  for (const e of inCircle(s, p.x, p.y, r)) strike(s, e, p.stats.damage * H.awakeBurstMul * (b ? K.hfBurst.mul : 1), 12, "hellfire");
  p.invulnTicks = Math.max(p.invulnTicks, H.awakeInv);
  addEffect(s, { kind: "hfAwakeFx", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r, maxTicks: 40, follow: true });
}

/** 악마화 한 틱: 한참 안 맞히면 하나씩 빠짐 */
export function rageTick(p: PlayerState): void {
  if (!p.hfRage) return;
  p.hfIdle = (p.hfIdle ?? 0) + 1;
  const hold = hasPerk(p, "hfHold") ? K.hfHold.hold : H.rageHold;
  if (p.hfIdle < hold || (p.hfIdle - hold) % H.rageDecay !== 0) return;
  p.hfRage--;
  if (p.hfRage <= 0) delete p.hfRage;
}

/** 허공 긁기 대상: 바라보는 쪽 가리킬 수 있는 적 중 겨눈 방향에 가까운 순 (같으면 가까운 순) */
export function clawTargets(s: RunState, range: number, n: number): EnemyState[] {
  const p = s.player;
  const list: { e: EnemyState; c: number; d: number }[] = [];
  for (const e of alive(s)) {
    const d = Math.hypot(e.x - p.x, e.y - p.y);
    if (d > range + e.r) continue;
    const c = d < 1 ? 1 : ((e.x - p.x) * p.faceX + (e.y - p.y) * p.faceY) / d;
    if (c < H.clawCos && d > e.r + p.r) continue;
    list.push({ e, c, d });
  }
  list.sort((a, b) => b.c - a.c || a.d - b.d || a.e.id - b.e.id);
  return list.slice(0, n).map((o) => o.e);
}
