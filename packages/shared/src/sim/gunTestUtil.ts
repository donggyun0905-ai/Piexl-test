// 거너 테스트 도우미: 무기·아이템을 든 거너 · 공격 키를 누른 채 n틱
import type { WeaponId } from "../content";
import type { PassiveId } from "../items";
import { gunTick } from "./gun";
import { createRun, type RunState } from "./index";
import { recalcStats } from "./items";

/** 거너로 시작해 무기·아이템을 가진 채, 적 없는 방 가운데 (오른쪽을 봄) */
export function gunner(weapon: WeaponId = "pistol", ...perks: PassiveId[]): RunState {
  const s = createRun(3, "gunner");
  s.player.weaponId = weapon;
  s.player.passives.push(...perks);
  recalcStats(s);
  s.enemies = [];
  s.player.x = s.player.prevX = 120;
  s.player.y = s.player.prevY = 72;
  return s;
}

/** 공격 키를 누른 채(또는 놓고) n틱 */
export function hold(s: RunState, n: number, want = true): void {
  for (let i = 0; i < n; i++) {
    s.tick++;
    if (s.player.attackCooldown > 0) s.player.attackCooldown--;
    gunTick(s, want, s.player.stats.attackSpeed);
  }
}
