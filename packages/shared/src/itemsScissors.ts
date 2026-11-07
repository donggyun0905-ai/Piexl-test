// 시저스 전용 아이템 20개: 절단 5 · 실 5 · 단죄 5 · 달빛 5. 효과는 sim/scissors·scissorsKit. 수치는 SCISSORS_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "scissors" as const, effect: true as const });

export const SCISSORS_PASSIVES = {
  // ── 절단 ──
  /** 벼린 날: 모든 가위질 피해 증가 */
  sxEdge: P("sxEdge", [{ stat: "damage", add: 1 }]),
  /** 크게 벌린 날: 열기가 더 멀리·넓게 */
  sxWide: P("sxWide", [{ stat: "range", add: 10 }]),
  /** 맞물리는 날: 닫기 피해 증가 */
  sxSnap: P("sxSnap", [{ stat: "damage", add: 1 }]),
  /** 녹슨 날: 닫기에 맞은 적이 피를 흘림 */
  sxRust: P("sxRust", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 쌍날: 닫기가 한 번 더 벰 */
  sxTwin: P("sxTwin", [{ stat: "attackSpeed", add: 0.05 }]),
  // ── 실 ──
  /** 실타래: 운명의 실을 더 많이 묶음 */
  sxSpool: P("sxSpool", [{ stat: "luck", add: 1 }]),
  /** 질긴 실: 운명의 실이 더 오래 감 */
  sxLong: P("sxLong", [{ stat: "maxHp", add: 10 }]),
  /** 팽팽한 실: 팽팽한 실을 끊을 때 더 셈 */
  sxTaut: P("sxTaut", [{ stat: "damage", add: 1 }]),
  /** 엮인 운명: 끊기는 실이 지나는 적도 더 크게 벰 */
  sxWeave: P("sxWeave", [{ stat: "range", add: 10 }]),
  /** 얽매임: 실에 묶인 적이 느려짐 */
  sxBind: P("sxBind", [{ stat: "moveSpeed", add: 0.1 }]),
  // ── 단죄 ──
  /** 목 사냥꾼: 더 많이 남은 체력에서도 목을 자름 */
  sxHead: P("sxHead", [{ stat: "luck", add: 1 }]),
  /** 연쇄 단죄: 목을 자르면 둘레를 한 번 더 벰 */
  sxChain: P("sxChain", [{ stat: "damage", add: 1 }]),
  /** 거인 사냥: 체력이 적은 보스에게 더 셈 */
  sxGiant: P("sxGiant", [{ stat: "maxHp", add: 10 }]),
  /** 수확: 목을 자르면 체력 회복 */
  sxHarvest: P("sxHarvest", [{ stat: "maxHp", add: 10 }]),
  /** 공포: 목을 자르면 둘레 적이 얼어붙음 */
  sxFear: P("sxFear", [{ stat: "moveSpeed", add: 0.1 }]),
  // ── 달빛 ──
  /** 달빛 실: 성흔이 더 빨리 참 */
  sxMoon: P("sxMoon", [{ stat: "luck", add: 1 }]),
  /** 보름달: 달빛 각성이 더 오래 감 */
  sxFull: P("sxFull", [{ stat: "maxHp", add: 10 }]),
  /** 초승달 날: 각성 중 실을 더 자주 저절로 끊음 */
  sxCrescent: P("sxCrescent", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 달무리: 각성하는 순간 달빛 폭발이 더 크고 셈 */
  sxHalo: P("sxHalo", [{ stat: "damage", add: 1 }]),
  /** 남은 달빛: 각성이 끝나도 성흔이 조금 남음 */
  sxRemain: P("sxRemain", [{ stat: "luck", add: 1 }]),
} as const satisfies Record<string, PassiveDef>;

/** 전용 아이템 수치 (배율 1 = 100%, 시간은 틱) */
export const SCISSORS_PERKS = {
  /** 벼린 날: 가위질 피해 배율 */
  sxEdge: { mul: 1.2 },
  /** 크게 벌린 날: 열기 거리 배율 · 부채꼴 cos (작을수록 넓음) */
  sxWide: { r: 1.25, arc: -0.5 },
  /** 맞물리는 날: 닫기 피해 배율 */
  sxSnap: { mul: 1.3 },
  /** 녹슨 날: 출혈 피해 (그 닫기 피해 대비) */
  sxRust: { mul: 0.3 },
  /** 쌍날: 한 번 더 베는 피해 (그 닫기 피해 대비) */
  sxTwin: { mul: 0.5 },
  /** 실타래: 더 묶는 실 수 */
  sxSpool: { add: 3 },
  /** 질긴 실: 더 가는 틱 */
  sxLong: { more: 240 },
  /** 팽팽한 실: 팽팽할 때 더하는 배율에 곱함 */
  sxTaut: { mul: 1.4 },
  /** 엮인 운명: 실이 지나는 적 피해 배율에 곱함 */
  sxWeave: { mul: 2 },
  /** 얽매임: 느려지는 틱 (실이 묶여 있는 동안 계속) */
  sxBind: { slow: 20 },
  /** 목 사냥꾼: 목을 자르는 체력 비율 (원래 대신) */
  sxHead: { at: 0.28 },
  /** 연쇄 단죄: 둘레 반지름 · 피해 배율 */
  sxChain: { r: 60, mul: 1 },
  /** 거인 사냥: 체력이 적은 보스 피해 배율 (원래 대신) */
  sxGiant: { mul: 1.8 },
  /** 수확: 회복 (최대 체력 대비) */
  sxHarvest: { heal: 0.02 },
  /** 공포: 반지름 · 멈춤 틱 */
  sxFear: { r: 70, stun: 60 },
  /** 달빛 실: 차는 양 배율 */
  sxMoon: { gain: 1.3 },
  /** 보름달: 각성 틱 더함 */
  sxFull: { more: 120 },
  /** 초승달 날: 저절로 끊는 틱 (원래 대신) */
  sxCrescent: { snip: 60 },
  /** 달무리: 각성 폭발 반지름·피해 배율 */
  sxHalo: { r: 1.4, mul: 2 },
  /** 남은 달빛: 각성이 끝난 뒤 남는 성흔 (최대 대비) */
  sxRemain: { keep: 0.3 },
};
