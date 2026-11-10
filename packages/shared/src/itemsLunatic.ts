// 루나틱 전용 아이템 20개: 세검 5 · 약점 5 · 달빛 베기 5 · 대시·각성 5 (★ = 새 공격 방식: 삼연 찌르기 · 월광 검기 · 이어지는 달빛 · 초승달 비 · 잔상 찌르기 · 초승달 회전 베기)
// 효과는 sim/lunatic·lunaticKit. 수치는 LUNATIC_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "lunatic" as const, effect: true as const });

export const LUNATIC_PASSIVES = {
  // ── 세검 ──
  /** 섬광 같은 손목: 찌르기 간격이 짧아짐 */
  lnSwift: P("lnSwift", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 긴 칼날: 찌르기가 더 멀리 닿음 */
  lnPierce: P("lnPierce", [{ stat: "range", add: 6 }]),
  /** ★ 삼연 찌르기: 몇 번째 찌르기마다 세 갈래로 연달아 찌름 */
  lnFlurry: P("lnFlurry", [{ stat: "damage", add: 1 }]),
  /** ★ 월광 검기: 찌를 때마다 칼끝에서 초승달 검기가 앞으로 날아가 꿰뚫음 */
  lnWave: P("lnWave", [{ stat: "damage", add: 1 }]),
  /** 달려드는 발: 찌를 때 더 멀리 돌진 · 피해 증가 */
  lnLunge: P("lnLunge", [{ stat: "moveSpeed", add: 0.05 }]),
  // ── 약점 ──
  /** 꿰뚫는 눈: 기본 약점 공격 확률 증가 */
  lnEye: P("lnEye", [{ stat: "luck", add: 1 }]),
  /** 급소 찌르기: 약점 공격 추가 피해 증가 */
  lnDeep: P("lnDeep", [{ stat: "damage", add: 1 }]),
  /** 사냥꾼의 조준: 월광 표적이 더 자주 뜸 */
  lnMarkFast: P("lnMarkFast", [{ stat: "luck", add: 1 }]),
  /** 쌍둥이 달: 월광 표적이 둘씩 뜸 */
  lnTwinMark: P("lnTwinMark", [{ stat: "luck", add: 1 }]),
  /** 처형의 달: 체력이 적은 적에게 약점 공격이 훨씬 아픔 */
  lnExecute: P("lnExecute", [{ stat: "damage", add: 1 }]),
  // ── 달빛 베기 ──
  /** 만개한 달: 달빛 베기 범위 증가 */
  lnSlashBig: P("lnSlashBig", [{ stat: "range", add: 4 }]),
  /** 차가운 달빛: 달빛 베기 피해 증가 */
  lnSlashPow: P("lnSlashPow", [{ stat: "damage", add: 1 }]),
  /** ★ 이어지는 달빛: 달빛 베기가 가까운 다른 적에게 한 번 더 이어짐 */
  lnChain: P("lnChain", [{ stat: "luck", add: 1 }]),
  /** 보름달의 낙인: 달빛 베기가 달빛을 가득(보름달) 검 */
  lnFullMoon: P("lnFullMoon", [{ stat: "maxHp", add: 10 }]),
  /** ★ 초승달 비: 달빛 베기 뒤 둘레에 초승달이 떨어짐 */
  lnMoonRain: P("lnMoonRain", [{ stat: "damage", add: 1 }]),
  // ── 대시·각성 ──
  /** 돌격 세검: 대시 찌르기 피해 증가 · 더 넓게 */
  lnDashPow: P("lnDashPow", [{ stat: "moveSpeed", add: 0.05 }]),
  /** ★ 잔상 찌르기: 대시가 끝나면 지나온 길에 잔상이 한 번 더 찌름 */
  lnAfterimage: P("lnAfterimage", [{ stat: "maxHp", add: 10 }]),
  /** 리더의 성흔: 성흔이 더 빨리 참 */
  lnSense: P("lnSense", [{ stat: "luck", add: 1 }]),
  /** 지지 않는 달: 만월 각성이 더 오래 감 */
  lnEndless: P("lnEndless", [{ stat: "maxHp", add: 10 }]),
  /** ★ 초승달 회전 베기: 만월 각성 중 찌를 때마다 몸 둘레를 초승달로 벰 */
  lnCrescent: P("lnCrescent", [{ stat: "damage", add: 1 }]),
} as const satisfies Record<string, PassiveDef>;

/** 전용 아이템 수치 (배율 1 = 100%, 시간은 틱) */
export const LUNATIC_PERKS = {
  /** 섬광 같은 손목: 찌르기 간격 배율 */
  lnSwift: { time: 0.85 },
  /** 긴 칼날: 찌르기 길이 배율 */
  lnPierce: { len: 1.3 },
  /** 삼연 찌르기: 몇 번째 찌르기마다 · 양옆 찌르기 피해 배율 */
  lnFlurry: { every: 4, mul: 0.8 },
  /** 월광 검기: 피해 배율 · 빠르기 · 나는 틱 · 반지름 */
  lnWave: { mul: 0.45, speed: 6, ticks: 22, r: 8 },
  /** 달려드는 발: 돌진 거리 배율 · 찌르기 피해 배율 */
  lnLunge: { dist: 2, mul: 1.15 },
  /** 꿰뚫는 눈: 기본 약점 확률 더함 */
  lnEye: { add: 0.12 },
  /** 급소 찌르기: 약점 추가 피해 비율 (원래 0.5 대신) */
  lnDeep: { extra: 0.85 },
  /** 사냥꾼의 조준: 표적 간격 배율 */
  lnMarkFast: { every: 0.6 },
  /** 쌍둥이 달: 한 번에 뜨는 표적 수 */
  lnTwinMark: { n: 2 },
  /** 처형의 달: 체력 비율 이하 · 약점 추가 피해 배율 */
  lnExecute: { hp: 0.3, mul: 2 },
  /** 만개한 달: 달빛 베기 반지름 배율 */
  lnSlashBig: { r: 1.4 },
  /** 차가운 달빛: 달빛 베기 피해 배율 */
  lnSlashPow: { mul: 1.4 },
  /** 이어지는 달빛: 찾는 거리 · 이어진 베기 피해 배율 */
  lnChain: { reach: 110, mul: 0.7 },
  /** 보름달의 낙인: 거는 달빛 스택 */
  lnFullMoon: { stacks: 5 },
  /** 초승달 비: 초승달 수 · 떨어지는 둘레 반지름 · 맞는 반지름 · 피해 배율 · 떨어지기까지 틱 */
  lnMoonRain: { n: 4, spread: 34, r: 14, mul: 0.6, delay: 14 },
  /** 돌격 세검: 대시 찌르기 피해 배율 · 반지름 배율 */
  lnDashPow: { mul: 1.6, r: 1.3 },
  /** 잔상 찌르기: 대시 끝나고 잔상이 찌르기까지 틱 · 피해 배율 · 폭(반) */
  lnAfterimage: { delay: 18, mul: 1.2, w: 12 },
  /** 리더의 성흔: 차는 양 배율 */
  lnSense: { gain: 1.3 },
  /** 지지 않는 달: 각성 틱 더함 */
  lnEndless: { more: 90 },
  /** 초승달 회전 베기: 반지름 · 피해 배율 · 몇 번째 찌르기마다 */
  lnCrescent: { r: 36, mul: 0.7, every: 2 },
};
