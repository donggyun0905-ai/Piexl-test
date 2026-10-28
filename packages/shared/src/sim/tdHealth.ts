// 타워 디펜스 타워 체력: 길을 가는 적이 가까운 타워를 때림(보스는 더 아프게) · 최종 보스가 나올 때 파동으로 모든 타워 체력이 깎임
// 돈으로 수리 · 부서지면 같은 캐릭터는 잠시 다시 못 세움(재건축 중) · 캐릭터마다 타워는 하나만. 수치는 TD_RULES (관리자 '타워 디펜스')
import { ENEMIES } from "../content";
import { TD_RULES } from "../tdDefs";
import { tileCenter } from "./tdTowers";
import type { TdState, TdTower } from "./tdTypes";
import { addEffect } from "./util";

export const towerMaxHp = (level: number): number => TD_RULES.towerHp + TD_RULES.towerHpLevel * (level - 1);

/** 이 캐릭터를 지금 세울 수 있는지: 이미 서 있으면 안 됨 · 부서진 뒤 재건축 중이면 안 됨 */
export function charFree(td: TdState, character: string): boolean {
  return !td.towers.some((t) => t.character === character) && rebuildLeft(td, character) <= 0;
}

/** 재건축 남은 초 (0 = 세울 수 있음) */
export const rebuildLeft = (td: TdState, character: string): number => Math.max(0, Math.ceil(((td.rebuild[character] ?? 0) - td.run.tick) / 60));

/** 수리 값 (가득이면 0) */
export const repairCost = (t: TdTower): number => Math.ceil(Math.max(0, t.maxHp - t.hp) * TD_RULES.repairCost);

/** 수리: 돈을 내고 체력을 가득 (돈이 모자라거나 가득이면 false) */
export function repairTower(td: TdState, id: number): boolean {
  const t = td.towers.find((x) => x.id === id);
  const cost = t ? repairCost(t) : 0;
  if (!t || cost <= 0 || td.run.gold < cost) return false;
  td.run.gold -= cost;
  t.hp = t.maxHp;
  addEffect(td.run, { kind: "plus", x: tileCenter(t.col), y: tileCenter(t.row), dirX: 0, dirY: 0, size: 12, maxTicks: 20 });
  return true;
}

/** 타워 체력 깎기 · 0이 되면 부서짐 (재건축 대기) */
function hurt(td: TdState, t: TdTower, dmg: number): void {
  t.hp -= dmg;
  if (t.hp > 0) return;
  td.towers = td.towers.filter((x) => x !== t);
  td.rebuild[t.character] = td.run.tick + TD_RULES.rebuildSec * 60;
  addEffect(td.run, { kind: "pwFx", x: tileCenter(t.col), y: tileCenter(t.row), dirX: 0, dirY: 0, size: 18, maxTicks: 30, tint: "#ff7a4a", style: 0 });
}

/** 틱마다: 적이 가까운 타워를 때림 (가장 가까운 하나, 간격마다) */
export function hitTowers(td: TdState): void {
  for (const e of td.run.enemies) {
    if (e.hp <= 0 || (e.stunTicks ?? 0) > 0) continue;
    if ((e.tdHitCd ?? 0) > 0) {
      e.tdHitCd = (e.tdHitCd ?? 0) - 1;
      continue;
    }
    const reach = TD_RULES.enemyReach + e.r;
    let best: TdTower | null = null;
    let bd = reach * reach;
    for (const t of td.towers) {
      const d = (tileCenter(t.col) - e.x) ** 2 + (tileCenter(t.row) - e.y) ** 2;
      if (d <= bd) [bd, best] = [d, t];
    }
    if (!best) continue;
    const def = ENEMIES[e.kind];
    e.tdHitCd = TD_RULES.enemyHitEvery;
    const tx = tileCenter(best.col);
    const ty = tileCenter(best.row);
    addEffect(td.run, { kind: "hit", x: tx, y: ty, dirX: tx - e.x, dirY: ty - e.y, size: def.boss ? 8 : 5, maxTicks: 10 });
    hurt(td, best, Math.max(1, def.contactDamage) * TD_RULES.enemyHitMul * (def.boss ? TD_RULES.bossHitMul : 1));
  }
}

/** 최종 보스 등장: 맵 전체로 퍼지는 파동 · 모든 타워 체력 −(최대 체력 × finalQuake) */
export function finalQuake(td: TdState, x: number, y: number): void {
  addEffect(td.run, { kind: "pwFx", x, y, dirX: 0, dirY: 0, size: 420, maxTicks: 60, tint: "#ff3a5a", style: 5, ult: true });
  for (const t of [...td.towers]) hurt(td, t, t.maxHp * TD_RULES.finalQuake);
}
