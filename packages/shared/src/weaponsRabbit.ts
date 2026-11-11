// 래빗(실베르, 망치를 든 유령 소녀): 무기는 커다란 토끼 망치 하나. 누르면 바라보는 쪽 앞에 망치를 내리찍어 땅울림(원) 피해
// 전용 패시브 20개(땅울림 파동·토끼인장·홈런·슈퍼 럭키 등)는 itemsRabbit · 계산은 sim/rabbit·rabbitMarks·rabbitUlt
import type { WeaponDef } from "./content";

export const RABBIT_WEAPONS = {
  /** 래빗의 토끼 망치: 앞에 내리찍어 땅울림 (사거리 = 내리찍는 거리) */
  rbHammer: { id: "rbHammer", kind: "rabbitHammer", damageMul: 1, attackSpeed: 1, range: 40, projectileSpeed: 4, exclusive: "rabbit" },
} as const satisfies Record<string, WeaponDef>;

/** 래빗 망치 수치 (시간은 틱(60 = 1초), 거리는 픽셀, 피해 배율은 공격력 × 배율) */
export const RABBIT_HAMMER = {
  /** 내리찍는 자리까지 거리 · 땅울림 반지름 (사거리 증가만큼 늘어남) */
  reach: 30,
  slamR: 24,
  /** 내리찍기 피해 배율 · 다시 내리찍기까지 틱 (공격 속도로 짧아짐) */
  mul: 1.25,
  cd: 30,
  /** 내리찍은 뒤 땅울림 그림이 커지는 틱 (그림 1~3번째 칸) */
  grow: 12,
  /** 땅울림 파동: 반지름(그림 4번째 칸 크기) · 한 번 쿵 찍고 다음 쿵까지 틱 · 한 번에 앞으로 가는 거리(반지름 배) · 피해 배율 · 3방향일 때 벌어지는 각도(라디안) */
  waveR: 30,
  waveEvery: 9,
  waveStep: 1.1,
  waveMul: 0.8,
  waveSpread: 0.5,
  /** 한 번에 있는 가장 많은 파동 수 */
  waveMax: 12,
};

/** 슈퍼 럭키(초거대 망치) 수치: 왼쪽 밖에서 빠르게 나와 맵 1/5에서 느려지고, 맵을 다 가리면 오른쪽 밖으로 빠르게 휘둘러짐 */
export const RABBIT_ULT = {
  /** 나오는 틱 · 느린 틱(이 동안 나눠 때림) · 휘둘러 나가는 틱 */
  enter: 14,
  slow: 108,
  swing: 14,
  /** 나눠 때리는 수(최대) · 그 수를 다 때리는 틱(느려진 뒤부터) · 모두 합친 피해 배율 · 보스에게 주는 비율 */
  hits: 60,
  hitTicks: 60,
  mul: 36,
  bossMul: 0.6,
  /** 느린 동안 적 탄 빠르기 배율 */
  shotSlow: 0.08,
};
