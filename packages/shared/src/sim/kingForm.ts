// 바스러져가는 왕관 (사용): 그 방에서 한 번, 거인만 한 옛 제국의 왕으로 변신 (능력치·공격이 아예 바뀜, 대검 콤보는 sim/kingBlade)
// 방을 나가면(클리어하고 나가면) 풀리고 원래 체력으로 돌아옴 · 왕의 체력이 다 닳아도 변신만 풀림
import type { ExtraStats } from "../characters";
import type { Stats } from "../stats";
import { recalcStats } from "./items";
import type { PlayerState, RunState } from "./types";
import { addEffect } from "./util";

const R = {
  /** 왕 능력치: 최대 체력 · 공격력 · 초당 공격 · 방어력 · 재생력 · 치명타 확률 · 치명타 피해 배율 · 이동 속도 · 사거리 · 탄 속도 */
  maxHp: 1000,
  damage: 100,
  attackSpeed: 1,
  defense: 30,
  regen: 50,
  critChance: 0.5,
  critDamage: 3,
  moveSpeed: 1,
  range: 90,
  projectileSpeed: 4,
};
export { R as KING_FORM_RULES };

/** 변신 중이면 왕의 능력치 (recalcStats) */
export function kingStats(p: PlayerState): Stats | null {
  if (p.kingRoom === undefined) return null;
  return { maxHp: R.maxHp, damage: R.damage, attackSpeed: R.attackSpeed, range: R.range, moveSpeed: R.moveSpeed, projectileSpeed: R.projectileSpeed, luck: 0 };
}

/** 변신 중 추가 스탯 (baseStats.extraOf) */
export function kingExtras(p: PlayerState): ExtraStats | null {
  if (p.kingRoom === undefined) return null;
  return { critChance: R.critChance, critDamage: R.critDamage, defense: R.defense, reduction: 0, dodge: 0, regen: R.regen, lifesteal: 0, sharpness: 0, statusPower: 0, goldGain: 0 };
}

/** 왕관을 씀: 변신 (원래 체력은 기억) */
export function kingStart(s: RunState): void {
  const p = s.player;
  p.kingHp = p.hp;
  p.kingRoom = s.roomId;
  p.kgStep = 0;
  recalcStats(s);
  p.hp = p.stats.maxHp;
  addEffect(s, { kind: "kgForm", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 30, maxTicks: 40, tint: "#ff4a2a" });
}

/** 변신 풀기 (방을 나감 · 왕의 체력이 다 닳음) */
export function kingEnd(s: RunState): void {
  const p = s.player;
  if (p.kingRoom === undefined) return;
  const hp = p.kingHp ?? 1;
  delete p.kingRoom;
  delete p.kingHp;
  delete p.kgStep;
  recalcStats(s);
  p.hp = Math.max(1, Math.min(p.stats.maxHp, hp));
  p.invulnTicks = Math.max(p.invulnTicks, 60);
  addEffect(s, { kind: "kgForm", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 18, maxTicks: 30, tint: "#8aff6a" });
}

/** 틱마다 (hiddenTick): 방을 나가면 풀림 */
export function kingFormTick(s: RunState): void {
  const p = s.player;
  if (p.kingRoom !== undefined && p.kingRoom !== s.roomId) kingEnd(s);
}

/** 쓰러질 때 (checkDeath): 변신 중이면 변신만 풀리고 버팀 */
export function kingFall(s: RunState): boolean {
  if (s.player.kingRoom === undefined || s.player.hp > 0) return false;
  kingEnd(s);
  return true;
}
