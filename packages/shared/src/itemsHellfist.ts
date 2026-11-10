// 헬피스트 전용 아이템 20개: 주먹 5 · 악마화 5 · 허공 긁기 5 · 적혈 5. 효과는 sim/hellfist·hellfistKit. 수치는 HELLFIST_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "hellfist" as const, effect: true as const });

export const HELLFIST_PASSIVES = {
  // ── 주먹 ──
  /** 굳은 주먹: 1타 찌르기 피해 증가 */
  hfKnuckle: P("hfKnuckle", [{ stat: "damage", add: 1 }]),
  /** 쌍주먹: 1타 찌르기가 한 번 더 때림 */
  hfDouble: P("hfDouble", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 짓밟기: 2타 내려찍기 피해 증가 */
  hfCrush: P("hfCrush", [{ stat: "damage", add: 1 }]),
  /** 땅울림: 2타 내려찍기에 맞은 적이 잠깐 멈춤 */
  hfQuake: P("hfQuake", [{ stat: "maxHp", add: 10 }]),
  /** 무쇠 팔: 2타 내려찍기가 더 넓고 더 밀침 */
  hfIron: P("hfIron", [{ stat: "range", add: 8 }]),
  // ── 악마화 ──
  /** 자라는 팔: 악마화 최대 스택 증가 */
  hfGrow: P("hfGrow", [{ stat: "range", add: 8 }]),
  /** 침식: 악마화 스택마다 늘어나는 사거리 증가 */
  hfSpread: P("hfSpread", [{ stat: "range", add: 8 }]),
  /** 깊은 저주: 악마화가 더 늦게 빠짐 */
  hfHold: P("hfHold", [{ stat: "maxHp", add: 10 }]),
  /** 굶주린 팔: 악마화가 두 배로 쌓임 */
  hfFeed: P("hfFeed", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 악마의 아귀: 악마화가 가득이면 모든 피해 증가 */
  hfMaw: P("hfMaw", [{ stat: "damage", add: 1 }]),
  // ── 허공 긁기 ──
  /** 긴 손톱: 허공 긁기 검격 줄 하나 더 */
  hfNail: P("hfNail", [{ stat: "damage", add: 1 }]),
  /** 사냥꾼의 검지: 허공 긁기 대상 하나 더 */
  hfAim: P("hfAim", [{ stat: "luck", add: 1 }]),
  /** 찢어발기기: 허공 긁기에 맞은 적이 피를 흘림 */
  hfRend: P("hfRend", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 먼 손짓: 허공 긁기가 더 멀리 있는 적을 가리킴 */
  hfFar: P("hfFar", [{ stat: "range", add: 10 }]),
  /** 잔상 할퀴기: 허공 긁기 둘레 적도 더 크게·넓게 벰 */
  hfEcho: P("hfEcho", [{ stat: "luck", add: 1 }]),
  // ── 적혈 ──
  /** 끓는 피: 성흔이 더 빨리 참 */
  hfBlood: P("hfBlood", [{ stat: "luck", add: 1 }]),
  /** 깨어난 악마: 적혈 각성이 더 오래 감 */
  hfLong: P("hfLong", [{ stat: "maxHp", add: 10 }]),
  /** 광란: 적혈 각성 중 공격 속도가 더 빨라짐 */
  hfFrenzy: P("hfFrenzy", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 피의 갈증: 적혈 각성 중 회복이 두 배 */
  hfLeech: P("hfLeech", [{ stat: "maxHp", add: 10 }]),
  /** 지옥불 분출: 각성하는 순간 지옥불 폭발이 더 크고 셈 */
  hfBurst: P("hfBurst", [{ stat: "damage", add: 1 }]),
} as const satisfies Record<string, PassiveDef>;

/** 전용 아이템 수치 (배율 1 = 100%, 시간은 틱) */
export const HELLFIST_PERKS = {
  /** 굳은 주먹: 찌르기 피해 배율 */
  hfKnuckle: { mul: 1.4 },
  /** 쌍주먹: 한 번 더 때리는 피해 (그 찌르기 피해 대비) */
  hfDouble: { mul: 0.6 },
  /** 짓밟기: 내려찍기 피해 배율 */
  hfCrush: { mul: 1.3 },
  /** 땅울림: 멈춤 틱 */
  hfQuake: { stun: 30 },
  /** 무쇠 팔: 내려찍기 거리 배율 · 밀침 배율 */
  hfIron: { r: 1.2, push: 1.8 },
  /** 자라는 팔: 더하는 최대 스택 */
  hfGrow: { add: 5 },
  /** 침식: 스택마다 사거리 배율 (원래 대신) */
  hfSpread: { per: 0.06 },
  /** 깊은 저주: 빠지기 시작하는 틱 (원래 대신) */
  hfHold: { hold: 360 },
  /** 굶주린 팔: 한 번에 쌓이는 스택 */
  hfFeed: { add: 2 },
  /** 악마의 아귀: 악마화 가득일 때 피해 배율 */
  hfMaw: { mul: 1.25 },
  /** 긴 손톱: 더하는 검격 줄 */
  hfNail: { add: 1 },
  /** 사냥꾼의 검지: 더하는 대상 */
  hfAim: { add: 1 },
  /** 찢어발기기: 출혈 피해 (그 줄 피해 대비) */
  hfRend: { mul: 0.4 },
  /** 먼 손짓: 가리키는 거리 배율 */
  hfFar: { r: 1.3 },
  /** 잔상 할퀴기: 둘레 반지름 배율 · 둘레 적 피해 배율 (원래 대신) */
  hfEcho: { r: 2, mul: 1 },
  /** 끓는 피: 차는 양 배율 */
  hfBlood: { gain: 1.3 },
  /** 깨어난 악마: 각성 틱 더함 */
  hfLong: { more: 120 },
  /** 광란: 각성 중 공격 속도 배율 (원래 대신) */
  hfFrenzy: { speed: 1.8 },
  /** 피의 갈증: 각성 회복 배율 */
  hfLeech: { mul: 2 },
  /** 지옥불 분출: 각성 폭발 반지름·피해 배율 */
  hfBurst: { r: 1.4, mul: 2 },
};
