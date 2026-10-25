// 격투가 테스트 도우미: 격투가로 시작 · 공격 키 누르기 · 다음 기술까지 누르기
import type { WeaponId } from "../content";
import type { PassiveId } from "../items";
import { comboTick } from "./brawl";
import { createRun, type EnemyState, type RunState } from "./index";
import { recalcStats } from "./items";

/** 격투가로 시작해 무기·아이템을 가진 채, 적 없는 방 가운데 (오른쪽을 봄) */
export function brawler(weapon: WeaponId = "fist", ...perks: PassiveId[]): RunState {
  const s = createRun(3, "brawler");
  s.player.weaponId = weapon;
  s.player.passives.push(...perks);
  recalcStats(s);
  s.enemies = [];
  s.player.x = s.player.prevX = 120;
  s.player.y = s.player.prevY = 72;
  return s;
}

export const lost = (e: EnemyState) => e.maxHp - e.hp;
const speedOf = (s: RunState) => s.player.stats.attackSpeed;

/** 공격 키를 누른 채 n틱 (쿨다운도 같이 줄임) */
export function hold(s: RunState, n: number, want = true): void {
  for (let i = 0; i < n; i++) {
    s.tick++;
    if (s.player.attackCooldown > 0) s.player.attackCooldown--;
    comboTick(s, want, speedOf(s));
  }
}

/** 다음 기술이 나갈 때까지 누름 */
export function nextMove(s: RunState): void {
  const before = s.player.attackCount;
  for (let i = 0; i < 600 && s.player.attackCount === before; i++) hold(s, 1);
}

