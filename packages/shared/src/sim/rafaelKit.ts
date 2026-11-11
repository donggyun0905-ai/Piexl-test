// 라파엘 공용 도우미: 맞히기(초장거리·표적·숨 고르기·후광·파편) · 표적 고르기 · 줄 위의 적 · 처치(스킬 대기 감소) · 스킬 대기
import { srcRun } from "./dmgSrc";
import { RAFAEL_PERKS as K } from "../itemsRafael";
import { RAFAEL as F } from "../weaponsRafael";
import { alive, inCircle, isBoss, onSegment, strike } from "./s2Kit";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, hasPerk } from "./util";

export const isRafael = (p: PlayerState) => p.characterId === "rafael";

/** 초장거리: 멀수록 피해 배율이 커짐 (nearD부터 farD까지 0 → farBonus) */
export function farMul(p: PlayerState, e: EnemyState): number {
  const d = Math.hypot(e.x - p.x, e.y - p.y);
  const u = Math.max(0, Math.min(1, (d - F.nearD) / (F.farD - F.nearD)));
  return 1 + u * (hasPerk(p, "rfScope") ? K.rfScope.bonus : F.farBonus);
}

export const isMark = (p: PlayerState, e: EnemyState) => (p.rfMarks ?? []).includes(e.id);

/** 한 번 맞힘: 공격력 × mul × 초장거리 × 표적 × 숨 고르기 · 후광 빛 피해 · 표적이면 파편 */
export function rfHit(s: RunState, e: EnemyState, mul: number, push = 0): void {
  const p = s.player;
  if (e.hp <= 0) return;
  const mark = isMark(p, e);
  const markMul = mark ? 1 + (hasPerk(p, "rfBrand") ? K.rfBrand.taken : F.markTaken) : 1;
  const steady = hasPerk(p, "rfSteady") && (p.rfStill ?? 0) >= K.rfSteady.still ? K.rfSteady.mul : 1;
  const dmg = p.stats.damage * mul * farMul(p, e) * markMul * steady;
  strike(s, e, dmg, push);
  if (hasPerk(p, "rfHalo") && e.hp > 0) srcRun(s, "rfHalo", () => strike(s, e, dmg * K.rfHalo.mul, 0, "radiance"));
  if (!mark) return;
  addEffect(s, { kind: "rfMarkFx", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 6, maxTicks: 14 });
  if (!hasPerk(p, "rfShard")) return; return srcRun(s, "rfShard", () => {
  for (const o of inCircle(s, e.x, e.y, K.rfShard.r)) if (o !== e) strike(s, o, dmg * K.rfShard.mul);
}); }

/** 내 자리에서 (dx,dy) 쪽 줄 위의 적 (가까운 순) */
export function onRay(s: RunState, dx: number, dy: number, len: number, w: number): EnemyState[] {
  const p = s.player;
  return onSegment(s, p.x, p.y, p.x + dx * len, p.y + dy * len, w).sort((a, b) => (a.x - p.x) * dx + (a.y - p.y) * dy - ((b.x - p.x) * dx + (b.y - p.y) * dy) || a.id - b.id);
}

/** 표적 고르기: 보스 먼저, 그다음 최대 체력이 큰 적 (같으면 id 작은 쪽) · 두 번째 표적 아이템이면 둘 */
export function pickMarks(s: RunState): void {
  const p = s.player;
  if (s.tick < (p.rfMarkAt ?? 0) && (p.rfMarks ?? []).every((id) => s.enemies.some((e) => e.id === id && e.hp > 0))) return;
  p.rfMarkAt = s.tick + F.markEvery;
  const n = hasPerk(p, "rfTwin") ? K.rfTwin.n : 1;
  const list = alive(s)
    .sort((a, b) => Number(isBoss(b)) - Number(isBoss(a)) || b.maxHp - a.maxHp || a.id - b.id)
    .slice(0, n)
    .map((e) => e.id);
  if (list.length) p.rfMarks = list;
  else delete p.rfMarks;
}

/** 표적을 향한 방향 (앞쪽 cos 이상일 때만, 아니면 바라보는 쪽) */
export function aimAt(s: RunState, cos: number): [number, number] {
  const p = s.player;
  const e = s.enemies.find((o) => o.hp > 0 && isMark(p, o));
  if (e) {
    const dx = e.x - p.x;
    const dy = e.y - p.y;
    const d = Math.hypot(dx, dy);
    if (d > 0 && (dx * p.faceX + dy * p.faceY) / d >= cos) return [dx / d, dy / d];
  }
  return [p.faceX, p.faceY];
}

/** 스킬마다 대기 틱 (아이템 반영) */
export function rfCooldown(p: PlayerState, i: number): number {
  return Math.round((F.cooldowns[i] ?? 0) * (hasPerk(p, "rfPrayer") ? K.rfPrayer.cd : 1));
}

/** 처치할 때 (hiddenPerks.relicKill): 표적을 쓰러뜨리면 남은 스킬 대기 감소 */
export function rafaelKill(s: RunState, e: EnemyState): void {
  const p = s.player;
  if (!isRafael(p) || !isMark(p, e)) return;
  const keep = 1 - (hasPerk(p, "rfHunt") ? K.rfHunt.refund : F.markRefund);
  p.rfCd = (p.rfCd ?? [0, 0, 0, 0]).map((c) => Math.round(c * keep));
  p.rfMarkAt = 0;
}

/** 화면용: 스킬마다 남은 대기 0~1 (0 = 쓸 수 있음) */
export function rafaelSkills(p: PlayerState): number[] {
  return [0, 1, 2, 3].map((i) => Math.min(1, (p.rfCd?.[i] ?? 0) / Math.max(1, rfCooldown(p, i))));
}
