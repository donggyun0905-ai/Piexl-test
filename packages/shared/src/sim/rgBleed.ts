// 루주 출혈·화상 (혈장미 기본 패시브): 맞으면 출혈 스택(최대 5) · 다른 출혈보다 2배 빨리 피해 · 붉은 장미의 장례 동안 한 번 더 2배
import { RG_ROSE as R } from "../itemsRouge";
import type { HitOn } from "./nrTypes";
import { dotDamage, ignite } from "./status";
import type { EnemyState, RunState } from "./types";

/** 맞은 적에게 출혈 스택·화상 (스택 피해는 지금 공격력 기준, 더 센 값으로) */
export function rgAfflict(s: RunState, e: EnemyState, on: HitOn): void {
  if (e.hp <= 0 || e.immune) return;
  const D = s.player.stats.damage;
  if (on.bleed) {
    e.rgBleed = Math.min(R.stacks, (e.rgBleed ?? 0) + on.bleed);
    e.rgBleedEnd = s.tick + R.ticks;
    e.rgBleedDmg = Math.max(e.rgBleedDmg ?? 0, D * R.perStack);
  }
  if (on.burn) ignite(e, D);
}

/** 틱마다: 출혈 걸린 적에게 스택만큼 피해 (간격 15틱, 장례 동안 8틱) */
export function rgBleedTick(s: RunState): void {
  for (const e of s.enemies) {
    if (!e.rgBleed) continue;
    if ((e.rgBleedEnd ?? 0) <= s.tick || e.hp <= 0) {
      delete e.rgBleed;
      continue;
    }
    const every = (e.rgFast ?? 0) > s.tick ? R.fastEvery : R.tickEvery;
    if ((e.rgBleedEnd! - s.tick) % every === 0) dotDamage(s, e, "bleed", e.rgBleed * (e.rgBleedDmg ?? 0));
  }
}
