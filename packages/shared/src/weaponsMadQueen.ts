// 매드퀸(탈라시아, 해방의 제독): 손가락으로 가리키면 머리 위 미래형 대포가 터지는 포탄을 한 발씩 쏨
// 쏠 때마다 확률로 맵 아무 곳에 네온 터렛(최대 4) · 몸 양옆에 날개 무기(최대 4, 레이저)
// 터렛 4 + 날개 4가 모이면 '전탄 일제사격': 맵 전체에 포탄이 쏟아지고 다시 대포만으로 시작
// 무기 = 함대 빛깔 4가지 (대포·터렛·날개 그림 색이 같이 바뀜). 계산은 sim/madQueen·madQueenArms
import type { WeaponDef } from "./content";

/** 함대 빛깔: 0 하늘(파도) · 1 빨강(적조) · 2 노랑(등대) · 3 초록(산호) */
export type FleetColor = 0 | 1 | 2 | 3;

/** 함대 하나: 빛깔 · 폭발 반지름 배율 · 폭발에 붙는 상태이상 · 터렛·날개 확률 더함 · 터렛 간격 배율 · 번개 튐 수 · 폭발 밀침 */
export interface FleetStyle {
  color: FleetColor;
  boom?: number;
  dot?: "burn" | "shock" | "poison";
  chance?: number;
  turretEvery?: number;
  chain?: number;
  push?: number;
}

const W = (id: string, damageMul: number, attackSpeed: number, fleet: FleetStyle) =>
  ({ id, kind: "fleet", damageMul, attackSpeed, range: 190, projectileSpeed: 4.2, fleet, exclusive: "madQueen" }) as const;

export const MADQUEEN_WEAPONS = {
  /** 해방의 파도포 (처음 무기, 하늘): 고른 성능 · 빠르게 쏘고 폭발이 파도처럼 넓게 퍼짐 */
  mqTide: W("mqTide", 1, 1.12, { color: 0, boom: 1.2 }),
  /** 적조 섬멸포 (빨강): 크고 센 폭발 + 화상 · 느림 */
  mqCrimson: W("mqCrimson", 1.05, 0.85, { color: 1, boom: 1.25, dot: "burn" }),
  /** 등대 번개포 (노랑): 폭발에서 번개가 튀고 터렛이 빨리 쏨 */
  mqBeacon: W("mqBeacon", 0.9, 1.05, { color: 2, dot: "shock", chain: 1, turretEvery: 0.8 }),
  /** 산호 폭풍포 (초록): 터렛·날개가 더 잘 나오고 폭발에 독 */
  mqCoral: W("mqCoral", 0.8, 1, { color: 3, dot: "poison", chance: 0.07 }),
} as const satisfies Record<string, WeaponDef>;

/** 매드퀸 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀, 확률은 0~1) */
export const MADQUEEN = {
  /** 대포: 최대 수 · 머리 위 높이 · 나란한 대포 사이 거리 · 위 줄 높이 · 둘째부터 피해 배율 */
  cannonMax: 4,
  cannonY: 25,
  cannonGap: 22,
  cannonRow: 12,
  extraMul: 0.6,
  /** 포탄이 날아가며 땅으로 내려오는 높이(한 틱) · 여러 대포 포탄이 옆으로 벌어지는 배율 · 터렛 포구 높이 */
  shellDrop: 3.5,
  shellSpread: 0.5,
  turretH: 9,
  /** 대포 포탄: 빠르기 · 날아가는 거리 · 몸 크기 · 폭발 반지름 · 피해 배율 */
  shellSpeed: 4.2,
  shellRange: 190,
  shellR: 5,
  boomR: 22,
  shellMul: 1.7,
  /** 쏠 때마다 터렛·날개가 나올 확률 · 최대 수 */
  turretChance: 0.3,
  wingChance: 0.3,
  turretMax: 4,
  wingMax: 4,
  /** 터렛: 사거리 · 쏘는 간격(틱) · 포탄 빠르기 · 몸 크기 · 폭발 반지름 · 피해 배율 · 놓을 때 나와 떨어진 최소 거리 */
  turretRange: 105,
  turretEvery: 40,
  turretSpeed: 6.2,
  turretShellR: 4,
  turretBoom: 15,
  turretMul: 0.75,
  turretGap: 24,
  /** 날개 레이저: 길이 · 굵기(절반) · 피해 배율 (날개 하나마다) */
  beamLen: 150,
  beamW: 6,
  beamMul: 0.45,
  /** 전탄 일제사격: 맵에 떨어지는 포탄 수(적마다 1 + 이만큼 아무 곳) · 떨어지기까지 틱 · 마지막 포탄 늦춤 · 폭발 반지름 · 피해 배율 · 기절 틱 */
  salvoShots: 18,
  salvoFall: 26,
  salvoSpread: 70,
  salvoR: 30,
  salvoMul: 2.4,
  salvoStun: 20,
  /** 적조: 화상 세기(포탄 피해 배율) · 산호: 독 세기(0.5초마다, 포탄 피해 배율) · 독 틱 */
  burnMul: 0.1,
  poisonMul: 0.04,
  poisonTicks: 120,
  /** 등대 번개포: 번개가 튀는 거리 · 피해 배율 */
  chainReach: 80,
  chainMul: 0.4,
};
