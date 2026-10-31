// 플라이(비르디아) 무기: 날카로운 발톱 10개. 공격하면 겨눈 쪽으로 공중을 가르며 급습 (그동안 무적), 지나간 적을 베고 끝에서 할큄 (계산은 sim/fly)
import type { WeaponDef } from "./content";

/**
 * 발톱 종류: glass 기본 · twin 지나간 적을 두 번 · wind 끝에서 바람 칼날 셋 · venom 중독 · thunder 끝에서 연쇄 번개
 * frost 느리게·멈춤 · blood 흡혈 · mirage 0.5초 뒤 지나간 자리가 한 번 더 터짐 · shadow 잠시 뒤 그림자 분신이 같은 길을 되짚어 벰 · queen 끝에서 날개 칼날 넷
 */
export type TalonStyle = "glass" | "twin" | "wind" | "venom" | "thunder" | "frost" | "blood" | "mirage" | "shadow" | "queen";

const T = (id: string, talon: TalonStyle, damageMul: number, attackSpeed: number, range: number) =>
  ({ id, kind: "talon", damageMul, attackSpeed, range, projectileSpeed: 3.6, talon, exclusive: "fly" }) as const;

export const FLY_WEAPONS = {
  /** 유리 발톱 (처음 무기) */
  glassClaw: T("glassClaw", "glass", 1, 1.5, 60),
  /** 쌍발톱 */
  twinTalon: T("twinTalon", "twin", 0.7, 1.5, 56),
  /** 바람 발톱 */
  windTalon: T("windTalon", "wind", 0.9, 1.4, 70),
  /** 독 발톱 */
  venomClaw: T("venomClaw", "venom", 0.9, 1.5, 60),
  /** 번개 발톱 */
  thunderClaw: T("thunderClaw", "thunder", 1, 1.3, 64),
  /** 서리 발톱 */
  frostClaw: T("frostClaw", "frost", 0.9, 1.4, 60),
  /** 피 발톱 */
  bloodClaw: T("bloodClaw", "blood", 1, 1.5, 58),
  /** 신기루 발톱 */
  mirageClaw: T("mirageClaw", "mirage", 0.9, 1.4, 66),
  /** 그림자 발톱 */
  shadowClaw: T("shadowClaw", "shadow", 1.1, 1.3, 62),
  /** 잠자리 여왕의 발톱 */
  queenTalon: T("queenTalon", "queen", 1.2, 1.4, 70),
} as const satisfies Record<string, WeaponDef>;

/** 플라이 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const FLY = {
  /** 급습 틱 · 급습 거리(사거리 배) · 끝 할퀴기 범위·배율·부채꼴(cos) */
  swoopTicks: 8,
  reachMul: 2,
  rakeR: 20,
  rakeMul: 1.2,
  rakeArc: 0.2,
  /** 바람 칼날 수·배율 · 날개 칼날 배율 · 칼날 날아가는 거리 */
  windBlades: 3,
  bladeMul: 0.6,
  wingMul: 0.7,
  bladeRange: 90,
  /** 번개 수·배율 · 서리 느려짐·멈춤 · 흡혈 비율 · 신기루 지연·반경·배율 · 그림자 분신 지연·배율 · 독 */
  bolts: 3,
  boltMul: 0.6,
  /** 서리 발톱 서리 피해 (공격력 배율) */
  frostMul: 0.3,
  frostSlow: 60,
  frostStun: 15,
  leech: 0.08,
  mirageDelay: 30,
  mirageR: 16,
  mirageMul: 0.8,
  shadeDelay: 18,
  shadeMul: 0.9,
  /** 하늘 습격: 확률 · 내리긋기 수 · 한 번 배율 · 사이 틱 */
  raidChance: 0.2,
  /** 패왕전: 하늘 습격 대신 붉은 급습 피해 배율 */
  pvpRedMul: 2,
  raidPasses: 10,
  raidMul: 0.3,
  raidGap: 6,
  venom: 0.3,
  venomTicks: 150,
} as const;
