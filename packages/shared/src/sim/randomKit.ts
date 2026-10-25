// 무작위 캐릭터로 시작: 그 직업이 쓰는 무기 하나 · 패시브 하나(전용이 있으면 전용) · 사용 아이템 2개를 판 시드로 골라 들고 시작
import { PASSIVES, type PassiveDef } from "../items";
import { createRng, deriveSeed } from "../rng";
import { equipWeapon, recalcStats } from "./items";
import { passivePool, pickDistinct, usePool, weaponPool } from "./loot";
import type { RunState } from "./types";

export function giveRandomKit(s: RunState): void {
  const p = s.player;
  const rng = createRng(deriveSeed(s.seed, "randomKit"));
  const weapons = weaponPool(s);
  if (weapons.length > 0) equipWeapon(s, rng.pick(weapons));
  const pool = passivePool(s);
  const own = pool.filter((id) => (PASSIVES[id] as PassiveDef).exclusive === p.characterId);
  const passives = own.length > 0 ? own : pool;
  if (passives.length > 0) p.passives.push(rng.pick(passives));
  pickDistinct(rng, usePool(s), p.useSlots.length).forEach((id, i) => (p.useSlots[i] = id));
  recalcStats(s);
  p.hp = p.stats.maxHp;
  s.randomKit = true;
}
