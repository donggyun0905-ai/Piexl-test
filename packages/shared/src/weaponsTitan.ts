// 거인 전용 무기: 기계팔을 단 탱커. 무기마다 평소 공격(heavy 아주 느리지만 늘 범위 · jab 빠르지만 아주 약함 · rivet 빠르고 약한 리벳 연사)과
// 기계팔 강타(맞은 피해가 에너지로 쌓여 다 차면 다음 공격이 강타)가 다름. 계산은 sim/titan
import type { WeaponDef } from "./content";

/** 평소 공격: heavy 둘레(arcCos -1) 또는 넓은 앞 반원을 크게 내려침 · jab 짧은 앞 부채꼴 연타 · rivet 리벳을 쏨 */
export type TitanStyle = "heavy" | "jab" | "rivet";

/**
 * 강타: quake 지진(둘레 크게) · piston 피스톤 주먹(앞으로 길게) · ball 쇠공 회전(둘레, 크게 밀침) · drill 드릴(앞 긴 선, 여러 번)
 * anvil 모루(둘레 모두 기절) · rivets 리벳 폭풍(사방으로) · magnet 자석(멀리서 끌어와 터뜨림) · bulwark 방벽(앞으로 충격파 셋)
 * steam 증기 폭발(둘레에 3초 동안 뜨거운 증기) · overload 과부하(점점 커지는 지진 셋)
 */
export type SmashKind = "quake" | "piston" | "ball" | "drill" | "anvil" | "rivets" | "magnet" | "bulwark" | "steam" | "overload";

const T = (id: string, style: TitanStyle, smash: SmashKind, damageMul: number, attackSpeed: number, range: number, arcCos = -1, smashMul = 6) =>
  ({ id, kind: "titan", damageMul, attackSpeed, range, projectileSpeed: style === "rivet" ? 4 : 0, arcCos, titan: style, smash, smashMul, exclusive: "titan" }) as const;

export const TITAN_WEAPONS = {
  /** 강철 의수 (처음 무기): 둘레를 느리게 내려침 · 강타 지진 */
  ironArm: T("ironArm", "heavy", "quake", 2.2, 0.55, 40),
  /** 피스톤 주먹: 빠르고 약한 연타 · 강타 앞으로 길게 뻗는 주먹 */
  pistonFist: T("pistonFist", "jab", "piston", 0.35, 4, 36, 0.4, 7),
  /** 철거용 쇠공: 넓은 앞 반원을 아주 느리게 · 강타 둘레를 돌며 크게 밀침 */
  wreckingBall: T("wreckingBall", "heavy", "ball", 2.7, 0.45, 50, -0.2, 5),
  /** 드릴 팔: 빠르고 약한 연타 · 강타 앞 긴 선을 여러 번 */
  drillArm: T("drillArm", "jab", "drill", 0.3, 3.6, 36, 0.6, 10),
  /** 모루 망치: 가장 느리고 셈 · 강타 둘레 모두 기절 */
  anvilHammer: T("anvilHammer", "heavy", "anvil", 3.3, 0.38, 44, -1, 5),
  /** 리벳 연사기: 빠르고 약한 리벳 · 강타 사방으로 리벳 폭풍 */
  rivetGun: T("rivetGun", "rivet", "rivets", 0.28, 4.5, 90, 0, 6),
  /** 자석 팔: 느린 둘레 + 끌어당김 · 강타 멀리서 끌어와 터뜨림 */
  magnetArm: T("magnetArm", "heavy", "magnet", 2, 0.5, 52, -1, 6),
  /** 방벽 팔: 느린 넓은 앞 반원, 치는 동안 받는 피해 감소 · 강타 앞으로 충격파 셋 */
  bulwarkArm: T("bulwarkArm", "heavy", "bulwark", 1.9, 0.6, 42, -0.3, 5),
  /** 증기 배출구: 빠르고 약한 둘레 증기 · 강타 증기 폭발 */
  steamVent: T("steamVent", "jab", "steam", 0.3, 3, 36, -1, 5),
  /** 거인의 심장: 느린 둘레, 에너지가 1.5배로 참 · 강타 과부하 */
  titanCore: T("titanCore", "heavy", "overload", 2.4, 0.5, 46, -1, 3),
} as const satisfies Record<string, WeaponDef>;

/** 거인 수치: 에너지 최대 · 받은 피해 1마다 에너지 · 거인의 심장 에너지 배율 · 방벽 팔 막기(틱·배율) · 증기 시간 · 자석 끌기 */
export const TITAN = {
  energyMax: 100,
  gain: 2,
  coreGain: 1.5,
  braceTicks: 40,
  braceTaken: 0.6,
  steamPulses: 6,
  steamEvery: 30,
  pull: 10,
  stun: 40,
  /** 기본 받는 피해 배율 (탱커) */
  taken: 0.85,
  /** 몸이 커서 맞는 범위도 큼 (보통 5) */
  radius: 7,
  /** 대시 대신 패링: 막는 시간 · 다시 쓰기까지 (틱) · 막은 뒤 무적. 막은 피해는 그대로 에너지로 */
  parryTicks: 18,
  parryCd: 150,
  parryInvuln: 20,
  /** 드릴 강타: 함께 앞으로 돌진하는 시간 · 몇 틱마다 한 번 깎는지 */
  drillTicks: 18,
  drillEvery: 3,
};
