// 실버불렛(새벽의 성흔, 은빛 집행자): 쌍권총 + 은탄 + 성수 폭탄. 스킬 없이 성흔 게이지 (공용 weaponsDawn.STIGMA)
// 기본 공격: 한 번에 은탄 두 발 (오른손 → 조금 뒤 왼손, 탕-탕) · 공격력은 낮고 빠름 · 모든 공격이 달빛 상태이상 · 몇 번마다 성수 폭탄(광역 정화)
// 대시: 앞 장애물·기둥을 넘어감 + 가까운 적에게 은탄 두 발 · 적에게 박힌 은탄 마크가 30이면 연사(2초 동안 두 발씩 몰아 쏨, 성흔 안 참)
// 성흔이 가득 차면 달빛 각성: 버프 + 몸이 고정되고 앞에 흰 활 ) → 가운데 두 발·양끝 유도 두 발씩 매우 빠르게. 계산은 sim/silverBullet·silverBulletKit
import type { WeaponDef } from "./content";

export const SILVER_BULLET_WEAPONS = {
  /** 은빛 쌍권총: 은탄과 성수 폭탄을 쓰는 악마 사냥꾼의 쌍권총 */
  sbPistols: { id: "sbPistols", kind: "silverGun", damageMul: 1, attackSpeed: 1.4, range: 170, projectileSpeed: 9, exclusive: "silverBullet" },
} as const satisfies Record<string, WeaponDef>;

/** 실버불렛 수치 (배율 1 = 100%, 시간은 틱(60 = 1초), 거리는 픽셀) */
export const SILVER_BULLET = {
  /** 기본 공격 간격 배율 (공격 속도 따름) · 왼손 총이 오른손보다 늦게 쏘는 틱 · 총 두 자루 사이 반 폭 */
  shotTime: 0.5,
  offTicks: 5,
  gunSide: 5,
  /** 은탄: 날아가는 빠르기 · 날아가는 거리(사거리 증가 따름) · 피해 배율 · 맞는 반지름 */
  shotSpeed: 9,
  shotRange: 170,
  shotMul: 0.42,
  hitR: 4,
  /** 은탄 마크: 이만큼 박히면 연사 · 연사: 틱 · 두 발씩 쏘는 간격 틱 · 한 발 피해 배율 · 빠르기 */
  markNeed: 30,
  barrageTicks: 120,
  barrageGap: 4,
  barrageMul: 0.3,
  barrageSpeed: 11,
  /** 성수 폭탄: 기본 공격 이 번째마다 · 던지는 거리 · 폭발 반지름 · 피해 배율 · 날아가는 틱 */
  bombEvery: 8,
  bombRange: 110,
  bombR: 42,
  bombMul: 1.2,
  bombFly: 18,
  /** 대시: 쏘는 은탄 수 · 피해 배율 · 장애물 안에서 더 미끄러질 수 있는 최대 틱 (넘다가 멈추면 밀려남) */
  dashShots: 2,
  dashMul: 0.6,
  vaultMax: 40,
  /** 성흔: 은탄이 맞힐 때 · 처치 · 성수 폭탄에 맞은 적마다 */
  gainHit: 1.5,
  gainKill: 4,
  gainBomb: 2,
  /** 달빛 각성: 피해 배율 · 공격 속도 배율 · 걸리는 달빛 스택 · 각성 순간 달빛 폭발 반지름 · 피해 배율 · 무적 틱 */
  awakeMul: 1.3,
  awakeSpeed: 1.3,
  awakeMoon: 2,
  awakeBurstR: 80,
  awakeBurstMul: 1.4,
  awakeInv: 30,
  /** 은빛 활 일제 사격 (각성 순간, 몸 고정): 틱 · 네 발씩 쏘는 간격 틱 · 한 발 피해 배율 · 빠르기 · 활 반 폭 · 유도 꺾임(0~1) */
  ultTicks: 150,
  ultGap: 3,
  ultMul: 0.32,
  ultSpeed: 12,
  ultSide: 14,
  ultTurn: 0.25,
};
