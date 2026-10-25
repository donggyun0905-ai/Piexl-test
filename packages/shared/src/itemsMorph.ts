// 변희 전용 아이템 30개: 동물(무기) 열 마리마다 셋, 그 동물을 들었을 때만 나옴 (행운이 높을수록 잘 나옴). 효과는 sim/morph. 수치는 MORPH_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <I extends string>(id: I, forWeapon: string, mods: StatMod[] = []) => ({ id, mods, exclusive: "byeonhui" as const, effect: true as const, forWeapon });

export const MORPH_PASSIVES = {
  /** 송곳니: 공격력 +20% */
  wolfFang: P("wolfFang", "wolfForm", [{ stat: "damage", mul: 1.2 }]),
  /** 우두머리: 센 물기가 세 번째 → 두 번째마다 */
  wolfPack: P("wolfPack", "wolfForm"),
  /** 늑대 울음: 센 물기가 둘레 적을 겁먹게 (0.5초 멈춤) */
  wolfHowl: P("wolfHowl", "wolfForm"),
  /** 두꺼운 가죽: 곰일 때 받는 피해 -20% */
  bearHide: P("bearHide", "bearForm"),
  /** 분노: 체력이 절반 아래면 피해 +40% */
  bearRage: P("bearRage", "bearForm"),
  /** 땅 울림: 네 번째 할퀴기마다 둘레 충격파 (공격력 1.5배) */
  bearQuake: P("bearQuake", "bearForm"),
  /** 매의 눈: 사거리 +20% · 공격력 +10% */
  eagleEye: P("eagleEye", "eagleForm", [{ stat: "range", mul: 1.2 }, { stat: "damage", mul: 1.1 }]),
  /** 깃털 폭풍: 깃털 다섯 */
  eagleStorm: P("eagleStorm", "eagleForm"),
  /** 급강하: 다섯 번째 공격마다 가장 가까운 적에게 내리꽂음 (공격력 3배) */
  eagleDive: P("eagleDive", "eagleForm"),
  /** 맹독: 독 피해 두 배 */
  snakeVenom: P("snakeVenom", "snakeForm"),
  /** 휘감기: 물린 적이 0.5초 묶임 */
  snakeCoil: P("snakeCoil", "snakeForm"),
  /** 독 침: 세 번째 물기마다 독 침을 멀리 뱉음 */
  snakeSpit: P("snakeSpit", "snakeForm"),
  /** 엄니: 돌진 피해 +40% */
  boarTusk: P("boarTusk", "boarForm"),
  /** 폭주: 돌진 거리 +60% */
  boarStampede: P("boarStampede", "boarForm"),
  /** 진흙 갑옷: 돌진하는 동안 무적 */
  boarMud: P("boarMud", "boarForm"),
  /** 독 꼬리: 꼬리에 찔린 적이 중독 */
  scorpTail: P("scorpTail", "scorpionForm"),
  /** 집게: 찌르기 전에 앞쪽 가까운 적을 집게로 집음 (공격력 60%) */
  scorpPincer: P("scorpPincer", "scorpionForm"),
  /** 갑각: 전갈일 때 받는 피해 -15% · 최대 체력 +10 */
  scorpShell: P("scorpShell", "scorpionForm", [{ stat: "maxHp", add: 10 }]),
  /** 흡혈: 회복 두 배 */
  batDrain: P("batDrain", "batForm"),
  /** 메아리: 음파가 0.4초 뒤 겨눈 곳에서 한 번 더 울림 */
  batEcho: P("batEcho", "batForm"),
  /** 박쥐 떼: 네 번째 공격마다 작은 박쥐 셋이 날아감 */
  batSwarm: P("batSwarm", "batForm"),
  /** 코 휘두르기: 짓밟은 뒤 앞쪽 적을 멀리 밀침 */
  eleTrunk: P("eleTrunk", "elephantForm"),
  /** 매머드: 짓밟기 범위 +35% */
  eleMammoth: P("eleMammoth", "elephantForm"),
  /** 무리: 코끼리일 때 받는 피해 -20% · 최대 체력 +15 */
  eleHerd: P("eleHerd", "elephantForm", [{ stat: "maxHp", add: 15 }]),
  /** 거미줄 둥지: 거미줄이 맞은 자리에서 퍼져 둘레 적도 느려짐 */
  spiderNest: P("spiderNest", "spiderForm"),
  /** 독니: 느려진 적에게 피해 +40% */
  spiderFang: P("spiderFang", "spiderForm"),
  /** 새끼 거미: 세 번째 공격마다 거미줄 세 갈래 */
  spiderBrood: P("spiderBrood", "spiderForm"),
  /** 불꽃 날개: 불덩이 폭발 범위 +50% */
  phoenixFlare: P("phoenixFlare", "phoenixForm"),
  /** 태양: 다섯 번째 공격마다 둘레에 큰 불꽃 */
  phoenixSun: P("phoenixSun", "phoenixForm"),
  /** 불사의 불꽃: 체력이 30% 아래면 1초마다 체력 1 회복 */
  phoenixRebirth: P("phoenixRebirth", "phoenixForm"),
} as const satisfies Record<string, PassiveDef>;

/** 변희 아이템 수치 (배율·비율은 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const MORPH_PERKS = {
  wolfPack: { every: 2 },
  wolfHowl: { r: 36, stun: 30 },
  bearHide: { taken: 0.8 },
  bearRage: { below: 0.5, damage: 1.4 },
  bearQuake: { every: 4, r: 44, mul: 1.5 },
  eagleStorm: { feathers: 5 },
  eagleDive: { every: 5, mul: 3, r: 20 },
  snakeVenom: { mul: 2 },
  snakeCoil: { ticks: 30 },
  snakeSpit: { every: 3, mul: 1, range: 140 },
  boarTusk: { mul: 1.4 },
  boarStampede: { reach: 1.6 },
  scorpPincer: { reach: 22, mul: 0.6 },
  scorpShell: { taken: 0.85 },
  batDrain: { mul: 2 },
  batEcho: { delay: 24, r: 26 },
  batSwarm: { every: 4, bats: 3, mul: 0.5 },
  eleTrunk: { push: 22 },
  eleMammoth: { reach: 1.35 },
  eleHerd: { taken: 0.8 },
  spiderNest: { r: 24 },
  spiderFang: { mul: 0.4 },
  spiderBrood: { every: 3 },
  phoenixFlare: { r: 1.5 },
  phoenixSun: { every: 5, r: 50, mul: 1.2 },
  phoenixRebirth: { below: 0.3, every: 60, heal: 1 },
};
