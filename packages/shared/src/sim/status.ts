// 상태이상 공용 계산: 상태이상 피해(화면에 그 색 숫자) · 점화(화상) · 독 · 틱마다 화상·독 피해. 수치는 아래 묶음 (관리자 '규칙·기술 수치' STATUS_RULES)
// 출혈은 gunExtras(applyBleed·updateBleed), 예리함 출혈은 baseStats, 불꽃 스택은 flames, 캐릭터마다의 독·부식·죽음은 각 캐릭터 파일
import { PERKS } from "../perks";
import { statusMul } from "./baseStats";
import { dotCrit } from "./novice";
import { devilMul } from "./devilPerks";
import type { DotKind, EnemyState, RunState } from "./types";
import { hasPerk, markDot } from "./util";
import { setBurnMul, setPoisonMul } from "./buildSets";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 점화: 지속 틱 (2초) · 화상·독 피해가 들어가는 틱 간격 (0.5초) */
  BURN_TICKS: 120,
  DOT_EVERY: 30,
};
export { R as STATUS_RULES };

/** 상태이상 피해: 맞음 효과·밀림 없이 체력만 · 탐식 방어력 깎기 · 악의(악의 사도) · 상태이상 강화(기본 스탯) */
export function dotDamage(s: RunState, e: EnemyState, kind: DotKind, amount: number): void {
  if (e.immune || e.hp <= 0 || amount <= 0) return;
  const dmg = dotCrit(s, e, amount) * (1 + (e.apDef ?? 0)) * devilMul(s, e) * (hasPerk(s.player, "malice") ? PERKS.malice.dot : 1) * statusMul(s.player);
  e.hp -= dmg;
  e.hitFlash = 3;
  markDot(s, e, kind, dmg);
}

/** 점화: 2초 동안 0.5초마다 공격력의 25% 피해 (총 공격력만큼) */
export function ignite(e: EnemyState, dmg: number): void {
  e.burnTicks = R.BURN_TICKS;
  e.burnDmg = dmg * PERKS.igniteTip.damage;
}

/** 틱마다: 불타는 적·독 걸린 적 피해 (상태이상 강화가 붙음) */
export function tickDots(s: RunState): void {
  if (s.tick % R.DOT_EVERY === 0) {
    const mul = statusMul(s.player);
    for (const e of s.enemies) {
      for (const [kind, ticks, dmg] of [["burn", e.burnTicks, e.burnDmg], ["poison", e.poisonTicks, e.poisonDmg]] as const) {
        if (e.hp <= 0 || (ticks ?? 0) <= 0 || e.immune) continue;
        const d = dotCrit(s, e, (dmg ?? 0) * mul * (kind === "burn" ? setBurnMul(s.player) : setPoisonMul(s.player))) * devilMul(s, e);
        e.hp -= d;
        e.hitFlash = 3;
        markDot(s, e, kind, d);
      }
    }
  }
  for (const e of s.enemies) {
    if ((e.burnTicks ?? 0) > 0) e.burnTicks = (e.burnTicks ?? 0) - 1;
    if ((e.poisonTicks ?? 0) > 0) e.poisonTicks = (e.poisonTicks ?? 0) - 1;
  }
}
