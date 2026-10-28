import type { PassiveId } from "@pixel-rogue/shared";
import type { Names } from "./names";

/** 떠돌이·파수꾼 특징을 키우는 전용 패시브 설명 (sim/origin) */
export const ORIGIN_EFFECT_DESC: Partial<Record<PassiveId, Names>> = {
  ambush: {
    ko: "떠돌이 기습 강화: 대시 직후 {ticks:sec}초 안의 첫 공격이 2배 → {damage}배 + 맞힌 적 최대 체력의 {hpCut:pct}% 피해 (보스는 그 {bossCut:pct}%만, 공격력의 {cap}배까지)",
    en: "Empowers the Drifter's ambush: the first attack within {ticks:sec}s after a dash deals {damage}x instead of 2x, plus {hpCut:pct}% of the target's max HP (only {bossCut:pct}% of that on bosses, up to {cap}x your damage)",
    ja: "流れ者の奇襲を強化: ダッシュ後{ticks:sec}秒以内の最初の攻撃が2倍→{damage}倍 + 当てた敵の最大体力の{hpCut:pct}%ダメージ (ボスはその{bossCut:pct}%、攻撃力の{cap}倍まで)",
  },
  counterGuard: {
    ko: "맞으면 주변 적을 밀어내며 공격력만큼 피해 + 파수꾼 반격 강화: 맞은 뒤 첫 한 바퀴 베기가 1.5배 → {swing}배, 범위 +{reach:up}%",
    en: "When hit, push back nearby enemies and deal your damage to them + empowers the Warden's counter: the first full spin after a hit deals {swing}x instead of 1.5x, with +{reach:up}% reach",
    ja: "被弾すると周りの敵を押し返し、攻撃力分のダメージ + 番人の反撃を強化: 被弾後最初の全周斬りが1.5倍→{swing}倍、範囲+{reach:up}%",
  },
};
