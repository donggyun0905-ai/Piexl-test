// 원소술사 테스트 도우미 (orbit·orbitNew 테스트가 같이 씀)
import type { WeaponId } from "../content";
import type { PassiveId } from "../items";
import { createRun, type EnemyState, type RunState } from "./index";
import { recalcStats } from "./items";
import { orbBodies, updateOrbit } from "./orbit";
import { enemy } from "./perkTestUtil";

/** 원소술사로 시작해 무기·아이템을 가진 채, 적 없는 방 가운데 */
export function elem(weapon: WeaponId = "elemorb", ...perks: PassiveId[]): RunState {
  const s = createRun(3, "elementalist");
  s.player.weaponId = weapon;
  s.player.passives.push(...perks);
  recalcStats(s);
  s.enemies = [];
  s.player.x = s.player.prevX = 120;
  s.player.y = s.player.prevY = 72;
  return s;
}

/** 회전체 자리에 적을 하나 두고 한 틱 */
export function onOrb(s: RunState, i = 0): EnemyState {
  const b = orbBodies(s.player, s.player.x, s.player.y, s.tick)[i]!;
  const e = enemy(50 + i, b.x, b.y);
  s.enemies.push(e);
  updateOrbit(s);
  return e;
}

export const lost = (e: EnemyState) => e.maxHp - e.hp;

