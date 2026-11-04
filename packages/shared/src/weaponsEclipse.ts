// 이클립스(헬리오스): 헬리오스 제국의 태양(여자)과 그 거대한 뒷면, 일식의 밤의 주인(남자). 무기는 태양의 도끼 하나
// 태양: 작은 불의 도끼로 아주 빠른 5연격 · 불꽃 도끼 궤적 3번 + X자 엇베기 + 태양 낙인 · 치명타 · 이글거리는 영역 + 치유의 빛
// 일식: 도끼가 거대해짐 · 느리지만 강한 6연 콤보(마지막은 뛰어올라 내려찍기 + 블랙홀) · 치명타 없음 · 죽음의 영역
// 누를 때마다 한 동작씩 (누르고 있으면 이어짐) · 게이지(맞힐 때마다)가 다 차면 모습이 바뀜 (계산은 sim/eclipse·eclipseZone, 아이템은 itemsEclipse)
import type { WeaponDef } from "./content";

export const ECLIPSE_WEAPONS = {
  /** 태양의 도끼(처음이자 하나뿐인 무기): 한 번 누르면 콤보가 저절로 이어짐 (태양 5연격 · 일식 6연 콤보) · 끝나면 공격 속도만큼 쉼 */
  ecAxe: { id: "ecAxe", kind: "solar", damageMul: 1, attackSpeed: 1.3, range: 38, projectileSpeed: 0, exclusive: "eclipse" },
} as const satisfies Record<string, WeaponDef>;

/** 이클립스 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const ECLIPSE = {
  /** 게이지가 다 차는 값 · 태양 검격 한 번 맞힐 때 · 일식 기술 한 번 맞힐 때 · 적을 쓰러뜨리면 더 */
  gaugeMax: 100,
  sunGain: 4,
  nightGain: 4,
  killGain: 3,
  /** 바뀌는 동안(무적·공격 못 함) 틱 */
  shiftTicks: 42,

  /** 태양: 공격력 배율 · 공격 속도 배율 · 기본 치명타 확률 · 치명타 피해 + */
  sunDmg: 0.8,
  sunSpeed: 1,
  sunCrit: 0.35,
  sunCritDmg: 0.3,
  /** 태양 한 동작 뒤 쉬는 틱 (이 사이에 누르면 다음 동작) · 안 누르면 처음으로 돌아가는 틱 */
  sunGap: 9,
  idle: 60,
  /** 불꽃 도끼 궤적·엇베기·태양 낙인: 크기(사거리 배율, 모양은 sim/eclipseCuts) · 맞히는 폭(크기 배율) · 피해 배율 */
  sunReach: 1.6,
  cutW: 0.18,
  cutMul: 1,
  /** 몸 바로 앞 반원도 베는 거리(크기 배율) */
  sunNear: 0.9,
  /** 5타 (더 길게 깊게 찌름): 피해 배율 · 크기 배율 */
  sunFinMul: 1.5,
  sunFinSize: 1,
  /** 이글거리는 영역: 반지름 · 불태우는 틱 간격 · 한 번 피해(공격력 배율) · 치유의 빛 틱 간격 · 회복(최대 체력 비율) */
  sunR: 60,
  sunEvery: 20,
  sunBurn: 0.22,
  healEvery: 60,
  heal: 0.015,

  /** 일식: 공격력 배율 · 공격 속도 배율 · 사거리 배율(거대한 도끼) */
  nightDmg: 2.2,
  nightSpeed: 0.5,
  nightReach: 1.7,
  /** 일식 한 동작 뒤 쉬는 틱 (이 사이에 누르면 다음 동작) */
  nightGap: 18,
  /** 1타 내려베기 · 2타 올려베기: 피해 배율 · 부채꼴 넓이(1 = 한 줄, 0 = 반원) · 밀침 */
  hewMul: 1,
  hewArc: 0.15,
  riseArc: -0.2,
  push: 5,
  /** 3타 흑월 회전: 반지름 배율(사거리에 곱함) · 피해 배율 */
  spinR: 1.1,
  spinMul: 1.2,
  /** 4타 그림자 돌진: 틱 · 한 틱 거리 · 피해 배율 */
  rushTicks: 7,
  rushStep: 8,
  rushMul: 1.1,
  /** 5타 초승달 참격: 한 틱 거리 · 남는 틱 · 폭(절반) · 피해 배율 */
  moonSpeed: 5,
  moonTicks: 22,
  moonW: 15,
  moonMul: 1.3,
  /** 6타 일식 낙하: 뛰어오른 틱(무적) · 내려찍기 피해 배율 · 반지름 · 밀침 */
  jumpTicks: 28,
  slamMul: 2.6,
  slamR: 100,
  slamPush: 10,
  /** 내려찍은 가운데의 블랙홀: 남는 틱 · 피해 반지름 · 끌어당기는 반지름 · 한 틱에 끌리는 거리 · 때리는 틱 간격 · 한 번 피해 배율 */
  holeTicks: 72,
  holeR: 44,
  holePull: 96,
  holeStep: 1.1,
  holeEvery: 12,
  holeMul: 0.3,
  /** 죽음의 영역: 반지름 · 틱 간격 · 한 번 피해(공격력 배율) · 둔화 틱 */
  nightR: 80,
  nightEvery: 20,
  nightBurn: 0.25,
  slow: 24,
};
