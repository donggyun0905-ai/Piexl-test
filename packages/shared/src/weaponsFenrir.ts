// 펜리르(비르디아, 영물): 지난 비르디아 왕의 영물인 늙은 백랑. 왕이 쓰던 거대한 대검을 입에 물고 싸움 · 무기는 대검 하나
// 누를 때마다 고정 5연 콤보의 다음 기술: 물어 베기 → 되베기 → 지면 검기 → 난도 → 천랑 낙인(뛰어오른 동안 무적, 내려찍으면 사방 검기)
// 체력이 적지만 아주 빠르고, 기본 회피·예리함을 가짐 (계산은 sim/fenrir, 아이템은 itemsFenrir)
import type { WeaponDef } from "./content";

export const FENRIR_WEAPONS = {
  /** 선왕의 대검(처음이자 하나뿐인 무기): 누를 때마다 다섯 기술이 하나씩 이어짐 · 끝나면 공격 속도만큼 쉼 */
  fnKingBlade: { id: "fnKingBlade", kind: "fang", damageMul: 1, attackSpeed: 0.8, range: 58, projectileSpeed: 0, exclusive: "fenrir" },
} as const satisfies Record<string, WeaponDef>;

/** 펜리르 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const FENRIR = {
  /** 1타 물어 베기 · 2타 되베기 뒤 쉬는 틱 (이 사이에 누르면 다음 기술) */
  gap1: 10,
  gap2: 10,
  /** 1타 물어 베기: 피해 배율 · 부채꼴 넓이(1 = 한 줄, 0 = 반원) · 밀침 */
  biteMul: 1,
  biteArc: -0.05,
  push: 4,
  /** 2타 되베기: 피해 배율 · 부채꼴 넓이 · 사거리 배율 */
  backMul: 1,
  backArc: -0.35,
  backReach: 1.3,
  /** 3타 지면 검기: 피해 배율 · 한 틱에 나아가는 거리 · 남는 틱 · 폭(절반) · 다음 기술까지 틱 */
  waveMul: 1.3,
  waveSpeed: 6,
  waveTicks: 36,
  waveW: 20,
  gap3: 12,
  /** 4타 난도: 베기 수 · 베기 사이 틱 · 한 번 피해 배율 · 반지름 · 적을 찾는 거리 · 적이 없을 때 앞쪽 거리 */
  cutN: 6,
  cutEvery: 2,
  cutMul: 0.3,
  cutR: 40,
  cutReach: 110,
  cutAhead: 52,
  /** 5타 천랑 낙인: 뛰어오른 틱(무적) · 내려찍기 피해 배율 · 반지름 · 밀침 */
  jumpTicks: 24,
  landMul: 1.5,
  landR: 70,
  landPush: 8,
  /** 내려찍은 자리에서 사방으로 나가는 검기 (방 끝까지): 갈래 수 · 피해 배율 · 한 틱 거리 · 가장 오래 남는 틱 · 폭(절반) */
  starN: 8,
  starMul: 0.7,
  starSpeed: 5,
  starTicks: 240,
  starW: 14,
  /** 4타 난도가 끝난 뒤 쉬는 틱 · 안 누르면 처음으로 돌아가는 틱 */
  gap4: 8,
  idle: 60,
  /** 지면 검기가 바닥에 자국(그림)을 남기는 틱 간격 */
  scarEvery: 2,
};
