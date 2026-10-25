// 학살자(헬리오스) 무기: 피에 젖은 대낫 10개. 모두 대낫이지만 한 번 누르면 아주 빠르게 이어지는 5연속 콤보가 다름 (계산은 sim/slayer·slayerMoves)
// 콤보가 끝나면 보통 공격 속도만큼 쉬고 다시 처음부터
import type { WeaponDef } from "./content";

/**
 * 콤보 기술: slash3 낫 베기 3연속(체력은 한 번만) · raid 적에게 급습하며 전면 베기 · line 일직선 베기(방 끝까지)
 * wave3 강하게 베기 + 부채꼴 긴 검기 셋 · grand 더욱 강하게 베기(범위 +30%) · spin 회오리 베기 · diamond 마름모 검기 넷
 * chop 내려찍어 땅 가르기 · throw 돌아오는 대낫 날리기 · rush 대낫 돌진 · burst 땅 뒤집기(앞으로 아주 큰 검기)
 * backstep 백스텝하며 검기 · crossX 적 자리 X자 베기 · bloodNova 사방 피의 검기 · reap 끌어당겨 베기 · skyfall 뛰어올라 적에게 내려찍기
 */
export type ScytheMove = "slash3" | "raid" | "line" | "wave3" | "grand" | "spin" | "diamond" | "chop" | "throw" | "rush" | "burst" | "backstep" | "crossX" | "bloodNova" | "reap" | "skyfall";

const S = (id: string, combo: readonly [ScytheMove, ScytheMove, ScytheMove, ScytheMove, ScytheMove], damageMul = 1) =>
  ({ id, kind: "scythe", damageMul, attackSpeed: 1, range: 56, projectileSpeed: 3.4, combo5: combo, exclusive: "slayer" }) as const;

export const SLAYER_WEAPONS = {
  /** 피의 대낫 (처음 무기): 3연속 베기 → 급습 베기 → 일직선 → 검기 셋 → 더욱 강하게 */
  bloodScythe: S("bloodScythe", ["slash3", "raid", "line", "wave3", "grand"]),
  /** 마름모 대낫 */
  diamondScythe: S("diamondScythe", ["slash3", "diamond", "raid", "diamond", "grand"]),
  /** 회오리 대낫 */
  whirlScythe: S("whirlScythe", ["spin", "raid", "spin", "spin", "bloodNova"], 0.9),
  /** 핏물 대낫 */
  tideScythe: S("tideScythe", ["wave3", "slash3", "wave3", "raid", "burst"]),
  /** 굶주린 대낫: 끌어당겨 벰 */
  hungerScythe: S("hungerScythe", ["raid", "slash3", "raid", "reap", "grand"]),
  /** 나는 대낫 */
  flyingScythe: S("flyingScythe", ["throw", "raid", "throw", "slash3", "throw"]),
  /** 돌진 대낫 */
  rushScythe: S("rushScythe", ["rush", "slash3", "rush", "crossX", "grand"]),
  /** 대지의 대낫 */
  earthScythe: S("earthScythe", ["chop", "slash3", "skyfall", "burst", "grand"], 1.1),
  /** 유령 대낫 */
  phantomScythe: S("phantomScythe", ["backstep", "wave3", "raid", "crossX", "line"]),
  /** 처형 대낫 */
  executionScythe: S("executionScythe", ["crossX", "slash3", "skyfall", "line", "bloodNova"], 1.1),
} as const satisfies Record<string, WeaponDef>;

/** 학살자 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const SLAYER = {
  /** 콤보 기술 사이 틱 · 기술마다 체력 소모 · 공격으로는 체력이 이 아래로 내려가지 않음 · 받는 피해 배율 */
  moveGap: 6,
  hpCost: 5,
  hpFloor: 40,
  taken: 1.5,
  /** 흡혈: 피의 학살 중에만 입힌 피해의 50% */
  leech: 0.5,
  /** 체력이 낮을수록 공격력 (체력 0에 가까우면 이 배) */
  lowHpMax: 2,
  /** 피의 학살 게이지: 가득 · 맞힌 적마다 · 피의 학살 틱(체력 소모 없음 · 흡혈) · 공격력·공격 속도 배율 · 이동 속도 + */
  gaugeMax: 100,
  gaugePerHit: 1,
  rageTicks: 600,
  rageDmg: 1.25,
  rageSpeed: 1.25,
  rageMove: 0.5,
  /** 기술마다 배율 */
  mul: { slash3: 0.7, raid: 1.3, line: 1.4, wave3: 1.2, grand: 2, spin: 0.9, diamond: 0.7, chop: 1.5, throw: 0.9, rush: 1.1, burst: 1.6, backstep: 1, crossX: 1.4, bloodNova: 1.1, reap: 1.3, skyfall: 1.8 } as Record<ScytheMove, number>,
  /** 베기 부채꼴(cos) · 백스텝 거리 · 검기 거리 · 땅 뒤집기 길이(사거리 배)·폭 · 일직선 폭 · 급습 거리(사거리 배) · 3연속 베기 사이 틱 */
  arc: 0.05,
  dash: 20,
  bladeRange: 160,
  burstLen: 3,
  burstW: 26,
  lineW: 12,
  raidMul: 2,
  flurryGap: 3,
} as const;
