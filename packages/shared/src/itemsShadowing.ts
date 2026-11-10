// 쉐도잉 전용 아이템 20개: 하나하나가 붓 그림에 새 기술·능력을 더하고 능력치도 올림 (실베르답게 먹을수록 강해짐)
// 앞 다섯은 쉐도잉 효과 그림(검격·수묵화·연꽃·학·벚꽃), 나머지 열다섯은 레이드 맵 잔패턴 그림을 씀 (화면 render/shadowingArt.SD_FX 줄 번호 = row)
// 효과는 sim/shadowingArts·shadowingSpirits. 수치는 SHADOWING_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "shadowing" as const, effect: true as const });

export const SHADOWING_PASSIVES = {
  /** 검무 일필: 일필 베기 끝에서 검기 셋이 조준한 쪽으로 날아감 */
  sdSword: P("sdSword", [{ stat: "damage", mul: 1.06 }]),
  /** 수묵 산수화: 봉인 자리에 두루마리가 펼쳐지고 먹의 용이 솟음 */
  sdScroll: P("sdScroll", [{ stat: "maxHp", add: 10 }]),
  /** 연꽃 각성: 봉인 원 안에 연꽃이 피어 안의 적에게 계속 피해 · 내가 안에 있으면 회복 */
  sdLotus: P("sdLotus", [{ stat: "maxHp", add: 15 }]),
  /** 학과 구름: 획을 마칠 때마다 학이 날아가 가까운 적에게 부딪혀 구름으로 터짐 */
  sdCrane: P("sdCrane", [{ stat: "moveSpeed", add: 0.05 }]),
  /** 벚꽃 물결: 일필 베기가 벚꽃 물결이 되어 적을 밀쳐 냄 */
  sdSakura: P("sdSakura", [{ stat: "range", mul: 1.08 }]),
  /** 사슬: 봉인 원 안 적을 오래 묶음 */
  sdChain: P("sdChain", [{ stat: "maxHp", add: 10 }]),
  /** 불기둥: 획이 사라질 때 끝에서 불기둥이 솟아 불태움 */
  sdFlame: P("sdFlame", [{ stat: "damage", mul: 1.05 }]),
  /** 얼음 결정: 획에 닿은 적이 느려짐 · 봉인 가운데 얼음 가시 */
  sdFrost: P("sdFrost", [{ stat: "moveSpeed", add: 0.05 }]),
  /** 소용돌이: 봉인 원 안 적을 가운데로 끌어당김 */
  sdVortex: P("sdVortex", [{ stat: "range", mul: 1.06 }]),
  /** 달: 몇 번째 획을 마칠 때마다 달이 떨어짐 */
  sdMoon: P("sdMoon", [{ stat: "luck", add: 2 }]),
  /** 별: 획이 크게 꺾인 자리마다 별이 터짐 */
  sdStar: P("sdStar", [{ stat: "attackSpeed", add: 0.08 }]),
  /** 시계: 잉크를 다 쓰면 잠깐 잉크가 닳지 않음 */
  sdClock: P("sdClock", [{ stat: "attackSpeed", add: 0.1 }]),
  /** 유령: 획으로 처치한 적에서 유령이 나와 가까운 적에게 날아감 */
  sdGhost: P("sdGhost", [{ stat: "luck", add: 1 }]),
  /** 가시 장미: 획이 더 오래 남고 획 피해 증가 */
  sdThorn: P("sdThorn", [{ stat: "maxHp", add: 10 }]),
  /** 혜성: 대시하면 붓 끝에서 혜성이 가까운 적에게 날아감 */
  sdComet: P("sdComet", [{ stat: "moveSpeed", add: 0.08 }]),
  /** 나비: 그리는 동안 일정 길이마다 붓 끝에서 나비가 날아감 */
  sdButterfly: P("sdButterfly", [{ stat: "attackSpeed", add: 0.08 }]),
  /** 황금 문: 봉인 원 안에 내가 있으면 잠깐 받는 피해 감소 */
  sdGate: P("sdGate", [{ stat: "maxHp", add: 20 }]),
  /** 날개: 대시한 길을 따라 잉크 없이 획이 그려짐 */
  sdWings: P("sdWings", [{ stat: "moveSpeed", add: 0.1 }]),
  /** 유성: 큰 봉인 원 안에 유성이 떨어짐 */
  sdMeteor: P("sdMeteor", [{ stat: "damage", mul: 1.06 }]),
  /** 용: 잉크를 많이 쓴 긴 획을 마치면 용이 획을 따라 날아감 */
  sdDragon: P("sdDragon", [{ stat: "damage", mul: 1.08 }]),
} as const satisfies Record<string, PassiveDef>;

/** 전용 아이템 수치 (피해 배율은 공격력 ×, 시간은 틱, 거리는 픽셀) */
export const SHADOWING_PERKS = {
  /** 검무 일필: 검기 수 · 피해 배율 · 빠르기 · 날아가는 틱 */
  sdSword: { n: 3, mul: 1.2, speed: 6, ticks: 40 },
  /** 수묵 산수화: 솟기까지 틱 · 반지름 (봉인 원 반지름의 배율) · 피해 배율 */
  sdScroll: { delay: 36, size: 1.5, mul: 4 },
  /** 연꽃 각성: 피어 있는 틱 · 피해 간격 · 피해 배율 · 회복 */
  sdLotus: { ticks: 180, every: 30, mul: 0.8, heal: 1 },
  /** 학과 구름: 획 가장 짧은 길이 · 피해 배율 · 터지는 반지름 · 빠르기 */
  sdCrane: { minLen: 60, mul: 1.5, r: 36, speed: 4 },
  /** 벚꽃 물결: 미는 거리 · 피해 배율 */
  sdSakura: { push: 24, mul: 1 },
  /** 사슬: 묶는 틱 */
  sdChain: { stun: 90 },
  /** 불기둥: 반지름 · 피해 배율 · 불 피해 배율 */
  sdFlame: { r: 30, mul: 1.2, burn: 0.5 },
  /** 얼음 결정: 느려지는 틱 · 가시 반지름 · 피해 배율 */
  sdFrost: { slow: 60, r: 28, mul: 1 },
  /** 소용돌이: 끌어당기는 틱 · 틱마다 당기는 거리 */
  sdVortex: { ticks: 48, pull: 1.5 },
  /** 달: 몇 번째 획마다 · 떨어지기까지 틱 · 반지름 · 피해 배율 */
  sdMoon: { every: 5, delay: 30, r: 56, mul: 3 },
  /** 별: 꺾임 기준 (앞뒤 방향 cos 이하) · 반지름 · 피해 배율 · 한 획에 가장 많이 */
  sdStar: { bend: 0.3, r: 20, mul: 1, max: 6 },
  /** 시계: 잉크가 닳지 않는 틱 · 다시 쓰기까지 틱 */
  sdClock: { ticks: 90, cool: 600 },
  /** 유령: 피해 배율 · 빠르기 */
  sdGhost: { mul: 1.5, speed: 3.5 },
  /** 가시 장미: 남는 시간 배율 · 획 피해 배율 */
  sdThorn: { life: 1.6, mul: 1.3 },
  /** 혜성: 피해 배율 · 빠르기 · 다시 쓰기까지 틱 */
  sdComet: { mul: 2.5, speed: 7, cool: 120 },
  /** 나비: 몇 픽셀 그릴 때마다 · 피해 배율 · 빠르기 */
  sdButterfly: { every: 100, mul: 0.8, speed: 3 },
  /** 황금 문: 받는 피해 배율 · 이어지는 틱 */
  sdGate: { taken: 0.6, ticks: 120 },
  /** 날개: 대시 중 점 사이 거리 (잉크 없이) */
  sdWings: { seg: 8 },
  /** 유성: 원 지름이 이만큼 넘어야 · 유성 수 · 반지름 · 피해 배율 · 떨어지기까지 틱 */
  sdMeteor: { size: 120, n: 3, r: 30, mul: 2, delay: 40 },
  /** 용: 잉크를 이만큼 넘게 쓴 획 · 피해 배율 · 획을 따라가는 빠르기 (틱마다 점 수) */
  sdDragon: { ink: 80, mul: 2, speed: 2 },
};
