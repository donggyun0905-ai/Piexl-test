// 운명의 여행자 운명 36칸 (주사위 두 개 6×6): 칸마다 버프(한 발을 세게) · 기술(활 쏘는 방식) · 능력(보조)
// 칸 번호 = (첫 눈 - 1) × 6 + (둘째 눈 - 1). 주사위가 하나면 첫 눈의 줄에서 둘째 눈을 시드로 정함
// 줄: 1 바다 · 2 바람 · 3 괴물 · 4 신들 · 5 전쟁 · 6 귀향 (이름·설명은 화면 쪽 i18n/items/voyagerFates)

/** 버프: mul 피해 배율 · crit 치명 확률(3배) · quick 모으는 시간 배율 · pierce 관통 · giant 화살 크기(피해 +30%) · execute 이 비율 아래 보통 적은 끝
 *  · boss 보스 배율 · blast 터지는 범위 · shred 맞은 적이 5초간 더 받는 비율 · leech 준 피해의 회복 비율 · stun 기절 틱 · first 운명이 바뀐 뒤 첫 발 배율 */
export type BuffKind = "mul" | "crit" | "quick" | "pierce" | "giant" | "execute" | "boss" | "blast" | "shred" | "leech" | "stun" | "first";
/** 기술: 다 모은 한 발을 쏘는 방식 (n은 화살 수·횟수·배율) */
export type SkillKind = "homing" | "curve" | "fan" | "giant" | "rain" | "bounce" | "back" | "split" | "beam" | "chain" | "ring" | "volley" | "meteor" | "cross" | "ghost" | "seek" | "twin" | "wave" | "snipe" | "spiral";
/** 능력: 운명이 이어지는 동안 돕는 힘 (v는 세기) */
export type AbilityKind = "ship" | "soldiers" | "wind" | "shield" | "regen" | "siren" | "boulder" | "wave" | "whirl" | "swift" | "gold" | "dog" | "bolt" | "pig" | "calypso" | "owl" | "horse" | "lotus" | "hermes" | "shade" | "sun" | "gods";

export interface Fate {
  buff: readonly [BuffKind, number];
  skill: readonly [SkillKind, number];
  ability: readonly [AbilityKind, number];
}

const F = (buff: Fate["buff"], skill: Fate["skill"], ability: Fate["ability"]): Fate => ({ buff, skill, ability });

export const FATES: readonly Fate[] = [
  // 1 바다
  F(["mul", 1.4], ["bounce", 3], ["ship", 2]),
  F(["shred", 0.3], ["seek", 4], ["wave", 2.5]),
  F(["pierce", 3], ["curve", 3], ["whirl", 0.5]),
  F(["stun", 60], ["snipe", 1.5], ["siren", 1]),
  F(["crit", 0.3], ["fan", 5], ["dog", 1.2]),
  F(["boss", 1.8], ["wave", 1], ["ship", 4]),
  // 2 바람
  F(["quick", 0.6], ["homing", 3], ["wind", 30]),
  F(["blast", 30], ["spiral", 6], ["hermes", 1]),
  F(["pierce", 5], ["volley", 3], ["swift", 1.25]),
  F(["crit", 0.4], ["cross", 1], ["bolt", 1.5]),
  F(["leech", 0.1], ["twin", 2], ["shield", 25]),
  F(["giant", 1.8], ["ring", 12], ["whirl", 1]),
  // 3 괴물
  F(["mul", 1.6], ["meteor", 1], ["boulder", 2.5]),
  F(["execute", 0.15], ["fan", 6], ["dog", 2]),
  F(["shred", 0.5], ["split", 1], ["pig", 1]),
  F(["stun", 90], ["chain", 4], ["siren", 2]),
  F(["leech", 0.2], ["ghost", 1], ["lotus", 1]),
  F(["boss", 2.2], ["giant", 1.5], ["shade", 1]),
  // 4 신들
  F(["crit", 0.5], ["homing", 5], ["owl", 1.3]),
  F(["blast", 45], ["chain", 6], ["bolt", 3]),
  F(["pierce", 99], ["beam", 1], ["sun", 2]),
  F(["execute", 0.25], ["seek", 6], ["shade", 2]),
  F(["mul", 1.5], ["rain", 6], ["shield", 50]),
  F(["first", 3], ["back", 1], ["calypso", 1]),
  // 5 전쟁
  F(["mul", 1.5], ["fan", 7], ["soldiers", 3]),
  F(["crit", 0.6], ["volley", 5], ["shield", 35]),
  F(["boss", 2.5], ["meteor", 2], ["horse", 1]),
  F(["stun", 120], ["rain", 10], ["soldiers", 5]),
  F(["giant", 2.2], ["giant", 2], ["gold", 3]),
  F(["first", 5], ["ring", 8], ["swift", 1.4]),
  // 6 귀향
  F(["quick", 0.4], ["bounce", 6], ["dog", 3]),
  F(["shred", 0.8], ["split", 2], ["regen", 3]),
  F(["leech", 0.4], ["curve", 6], ["regen", 6]),
  F(["pierce", 12], ["snipe", 2.5], ["owl", 1.6]),
  F(["boss", 3], ["beam", 2], ["hermes", 2]),
  F(["mul", 3], ["ring", 24], ["gods", 1]),
];
