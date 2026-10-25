// 묵인(헬리오스) 무기 10개: 모두 몸으로 들이받는 돌진. 피해는 방어력의 300% (계산은 sim/mukin)
import type { WeaponDef } from "./content";

/** 돌진 모양: 기절 틱 · 끝에서 충격파 반경 · 되돌아오기 · 이어서 다음 적에게 · 지나간 길에 충격파 · 돌진 뒤 방어력 + · 밀침 */
export interface RamStyle {
  stun?: number;
  blast?: number;
  back?: boolean;
  chain?: number;
  trail?: boolean;
  guard?: number;
  push: number;
}

const R = (id: string, damageMul: number, attackSpeed: number, range: number, ram: RamStyle) =>
  ({ id, kind: "ram", damageMul, attackSpeed, range, projectileSpeed: 0, ram, exclusive: "mukin" }) as const;

export const MUKIN_WEAPONS = {
  /** 쇠뿔 (처음 무기) */
  ironHorn: R("ironHorn", 1, 0.9, 60, { push: 8 }),
  /** 방패 밀치기: 짧고 빠르게, 1초 기절 */
  shieldBash: R("shieldBash", 0.9, 1.1, 40, { push: 6, stun: 60 }),
  /** 지진 돌진: 끝에서 땅이 울림 */
  quakeRam: R("quakeRam", 0.9, 0.85, 60, { push: 6, blast: 30 }),
  /** 먼 돌진: 두 배 멀리 */
  longRam: R("longRam", 0.85, 0.8, 120, { push: 8 }),
  /** 왕복 돌진: 갔다가 그대로 돌아옴 */
  twinRam: R("twinRam", 0.8, 0.8, 60, { push: 4, back: true }),
  /** 연쇄 돌진: 이어서 가까운 적에게 두 번 더 */
  chainRam: R("chainRam", 0.75, 0.7, 60, { push: 4, chain: 2 }),
  /** 성벽 밀기: 멀리 밀어붙임 */
  wallRam: R("wallRam", 0.9, 0.8, 60, { push: 24 }),
  /** 땅울림 돌진: 지나간 길에 충격파 셋 */
  spikeRam: R("spikeRam", 0.8, 0.8, 70, { push: 6, trail: true }),
  /** 요새 돌진: 돌진 뒤 2초 방어력 +20 */
  fortressRam: R("fortressRam", 0.9, 0.9, 60, { push: 8, guard: 20 }),
  /** 운석 돌진: 느리지만 멀리, 끝에서 큰 충격파 */
  meteorRam: R("meteorRam", 1.4, 0.5, 90, { push: 10, blast: 44 }),
} as const satisfies Record<string, WeaponDef>;

/** 묵인 수치 (방어력 30 = 받는 피해 30% 무시, 한 번에 적어도 1은 받음) */
export const MUKIN = {
  defBase: 30,
  defMax: 90,
  /** 돌진 피해 = 방어력 × 3 × 무기 배율 + 공격력 */
  ramMul: 3,
  /** 돌진 틱 · 맞은 뒤 무적 (거의 없음: 붙어 있는 적이 틱마다 때리지 않게만) */
  ramTicks: 12,
  hurtTicks: 6,
  /** 재생력 (10초마다 그만큼) · 회복약은 1초에 최대 체력의 10%씩 천천히 */
  regenBase: 10,
  potionRate: 0.1,
  /** 요새 돌진 지속 틱 · 충격파 피해 (방어력 배율) */
  guardTicks: 120,
  blastMul: 1,
};
