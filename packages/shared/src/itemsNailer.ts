// 네일러 전용 아이템 20개: 못 5 · 망치 5 · 심판 5 · 사냥꾼 5. 효과는 sim/nailer·nailerSkills·nailerKit. 수치는 NAILER_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "nailer" as const, effect: true as const });

export const NAILER_PASSIVES = {
  // ── 못 ──
  /** 무거운 못: 못 피해 증가 */
  nlIron: P("nlIron", [{ stat: "damage", add: 1 }]),
  /** 미늘 못: 박힌 못이 피를 흘리게 함 */
  nlBarb: P("nlBarb", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 빠른 손목: 1 못 던지기 대기 감소 */
  nlQuick: P("nlQuick", [{ stat: "moveSpeed", add: 0.1 }]),
  /** 흩뿌리는 못: 1 못 던지기 3번째에 못이 더 많이 나감 */
  nlSpread: P("nlSpread", [{ stat: "luck", add: 1 }]),
  /** 깊은 못: 못이 많이 박힌 적에게는 못이 두 개씩 박힘 */
  nlDeep: P("nlDeep", [{ stat: "damage", add: 1 }]),
  // ── 망치 ──
  /** 대형 망치: 망치 피해 증가 */
  nlSledge: P("nlSledge", [{ stat: "damage", add: 1 }]),
  /** 넓은 내려치기: 망치가 더 멀리·넓게 닿음 */
  nlWide: P("nlWide", [{ stat: "range", add: 10 }]),
  /** 못 박기: 망치로 못이 박힌 적을 치면 못이 하나 더 박힘 */
  nlDrive: P("nlDrive", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 머리 치기: 못이 많이 박힌 적을 망치로 치면 잠깐 멈춤 */
  nlStun: P("nlStun", [{ stat: "maxHp", add: 10 }]),
  /** 울리는 쇠: 박힌 못이 많을수록 망치가 셈 */
  nlEcho: P("nlEcho", [{ stat: "damage", add: 1 }]),
  // ── 심판 ──
  /** 붉은 실: 2 붉은 실 돌진이 더 세고 못을 더 박음 */
  nlChain: P("nlChain", [{ stat: "maxHp", add: 10 }]),
  /** 단단한 고정: 2 붉은 실 고정이 더 오래 감 */
  nlBind: P("nlBind", [{ stat: "maxHp", add: 10 }]),
  /** 피의 원: 2 붉은 실 망치 원이 넓어지고 출혈이 셈 */
  nlBleed: P("nlBleed", [{ stat: "damage", add: 1 }]),
  /** 깊은 저주: 3 저주의 도화선 못 하나마다 피해 증가 */
  nlCurse: P("nlCurse", [{ stat: "luck", add: 1 }]),
  /** 긴 도화선: 3 저주의 도화선 뒤에도 못이 조금 남음 */
  nlFuse: P("nlFuse", [{ stat: "maxHp", add: 10 }]),
  // ── 사냥꾼 ──
  /** 못비: 4 심판의 못비를 더 많이 침 */
  nlRain: P("nlRain", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 단 하나의 표적: 4 심판의 못비 피해 증가 */
  nlFocus: P("nlFocus", [{ stat: "damage", add: 1 }]),
  /** 달빛 못: 성흔이 더 빨리 참 */
  nlMoon: P("nlMoon", [{ stat: "luck", add: 1 }]),
  /** 눈가리개 붕대: 달빛 각성이 더 오래 감 */
  nlBlind: P("nlBlind", [{ stat: "maxHp", add: 10 }]),
  /** 끝없는 사냥: 못이 박힌 적을 처치하면 3 저주의 도화선 대기가 줄어듦 */
  nlRelent: P("nlRelent", [{ stat: "moveSpeed", add: 0.1 }]),
} as const satisfies Record<string, PassiveDef>;

/** 전용 아이템 수치 (배율 1 = 100%, 시간은 틱) */
export const NAILER_PERKS = {
  /** 무거운 못: 못 피해 배율 */
  nlIron: { mul: 1.25 },
  /** 미늘 못: 박힐 때 출혈 피해 (그 못 피해 대비) */
  nlBarb: { mul: 0.3 },
  /** 빠른 손목: 1 못 던지기 대기 배율 */
  nlQuick: { cd: 0.6 },
  /** 흩뿌리는 못: 3번째에 더 나가는 못 수 */
  nlSpread: { add: 2 },
  /** 깊은 못: 이만큼 박힌 적에게는 못이 두 개씩 */
  nlDeep: { from: 10 },
  /** 대형 망치: 망치 피해 배율 */
  nlSledge: { mul: 1.3 },
  /** 넓은 내려치기: 망치 거리 배율 · 부채꼴 cos (작을수록 넓음) */
  nlWide: { r: 1.3, arc: 0 },
  /** 못 박기: 더 박는 못 */
  nlDrive: { add: 1 },
  /** 머리 치기: 이만큼 박힌 적 · 멈춤 틱 */
  nlStun: { from: 5, ticks: 24 },
  /** 울리는 쇠: 못 하나마다 망치 피해 더함 · 최대 */
  nlEcho: { per: 0.02, max: 0.4 },
  /** 붉은 실: 돌진 피해 배율 · 더 박는 못 */
  nlChain: { mul: 1.5, add: 2 },
  /** 단단한 고정: 고정 틱 배율 */
  nlBind: { mul: 1.5 },
  /** 피의 원: 망치 원 반지름 배율 · 출혈 배율 */
  nlBleed: { r: 1.4, mul: 2 },
  /** 깊은 저주: 못 하나마다 공격력 배율 (원래 대신) */
  nlCurse: { perNail: 0.45 },
  /** 긴 도화선: 터진 뒤 남는 못 (비율) */
  nlFuse: { keep: 0.3 },
  /** 못비: 더 치는 수 */
  nlRain: { add: 4 },
  /** 단 하나의 표적: 못비 피해 배율 */
  nlFocus: { mul: 1.25 },
  /** 달빛 못: 성흔 차는 양 배율 */
  nlMoon: { gain: 1.3 },
  /** 눈가리개 붕대: 각성 틱 더함 */
  nlBlind: { more: 120 },
  /** 끝없는 사냥: 줄어드는 3번 대기 틱 */
  nlRelent: { cut: 120 },
};
