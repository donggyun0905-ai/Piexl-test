// 미카엘라 전용 아이템 20개: 콤보·광기 5 · 폭발·연쇄 5 · 투척·무기 5 · 포탈·스킬 5. 효과는 sim/michaela·michaelaKit·michaelaSkills. 수치는 MICHAELA_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "michaela" as const, effect: true as const });

export const MICHAELA_PASSIVES = {
  // ── 콤보·광기 ──
  /** 광란: 콤보 최대 증가 */
  mcFrenzy: P("mcFrenzy", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 광기: 콤보 하나마다 피해 더 증가 */
  mcMadness: P("mcMadness", [{ stat: "damage", add: 1 }]),
  /** 끊이지 않는 박자: 콤보가 더 오래 유지 */
  mcTempo: P("mcTempo", [{ stat: "moveSpeed", add: 0.1 }]),
  /** 바꿔치기: 무기를 바꿀 때 콤보 하나 더 */
  mcDouble: P("mcDouble", [{ stat: "luck", add: 1 }]),
  /** 메아리 투척: 던질 때 가끔 한 번 더 던짐 */
  mcEcho: P("mcEcho", [{ stat: "luck", add: 1 }]),
  // ── 폭발·연쇄 ──
  /** 성스러운 화약: 폭발 피해 증가 */
  mcPowder: P("mcPowder", [{ stat: "damage", add: 1 }]),
  /** 넓은 폭심: 폭발 범위 증가 */
  mcWide: P("mcWide", [{ stat: "maxHp", add: 10 }]),
  /** 공명: 연쇄가 더 멀리 닿음 */
  mcResonance: P("mcResonance", [{ stat: "range", add: 10 }]),
  /** 긴 도화선: 연쇄 폭발 피해 증가 */
  mcFuse: P("mcFuse", [{ stat: "damage", add: 1 }]),
  /** 파편: 폭발에 맞은 적이 피를 흘림 */
  mcShrapnel: P("mcShrapnel", [{ stat: "maxHp", add: 10 }]),
  // ── 투척·무기 ──
  /** 공허의 투창: 투척이 더 멀리 · 줄 위 모든 적을 꿰뚫음 */
  mcJavelin: P("mcJavelin", [{ stat: "range", add: 10 }]),
  /** 무거운 날: 투척 피해 증가 */
  mcHeavy: P("mcHeavy", [{ stat: "damage", add: 1 }]),
  /** 백은의 검: 검 베기 피해 증가 · 더 넓게 */
  mcSword: P("mcSword", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 백금의 창: 창 찌르기가 더 길고 셈 */
  mcLance: P("mcLance", [{ stat: "range", add: 10 }]),
  /** 무기 수집가: 방에 들어설 때 무기가 더 쏟아지고 더 많이 박혀 있음 */
  mcHoard: P("mcHoard", [{ stat: "maxHp", add: 10 }]),
  // ── 포탈·스킬 ──
  /** 쏟아지는 하늘: 무기 비가 더 많이 내림 */
  mcStorm: P("mcStorm", [{ stat: "maxHp", add: 10 }]),
  /** 공허 걸음: 대시로 순간 이동하는 범위 증가 */
  mcBlink: P("mcBlink", [{ stat: "moveSpeed", add: 0.1 }]),
  /** 공허의 칼날: 순간 이동해 도착할 때 베기 피해 증가 · 더 오래 무적 */
  mcVoid: P("mcVoid", [{ stat: "damage", add: 1 }]),
  /** 끝없는 무기고: 무한의 무기고가 더 오래 · 더 자주 쏟아짐 */
  mcArsenal: P("mcArsenal", [{ stat: "luck", add: 1 }]),
  /** 인도자의 기도: 모든 스킬 대기 감소 */
  mcPrayer: P("mcPrayer"),
} as const satisfies Record<string, PassiveDef>;

/** 전용 아이템 수치 (배율 1 = 100%, 시간은 틱) */
export const MICHAELA_PERKS = {
  /** 광란: 콤보 최대 더함 */
  mcFrenzy: { more: 10 },
  /** 광기: 콤보 하나마다 피해 (원래 값 대신) */
  mcMadness: { step: 0.045 },
  /** 끊이지 않는 박자: 콤보 유지 틱 더함 */
  mcTempo: { more: 120 },
  /** 바꿔치기: 바꿀 때 더 쌓는 콤보 */
  mcDouble: { more: 1 },
  /** 메아리 투척: 한 번 더 던지는 확률 · 비껴 던지는 각(cos·sin) */
  mcEcho: { chance: 0.3, c: 0.97, s: 0.26 },
  /** 성스러운 화약: 폭발 피해 배율 */
  mcPowder: { mul: 1.4 },
  /** 넓은 폭심: 폭발 반지름 배율 */
  mcWide: { r: 1.35 },
  /** 공명: 연쇄 거리 배율 */
  mcResonance: { r: 1.5 },
  /** 긴 도화선: 연쇄 폭발 피해 배율 */
  mcFuse: { mul: 1.5 },
  /** 파편: 출혈 피해 (그 폭발 피해 대비) */
  mcShrapnel: { mul: 0.2 },
  /** 공허의 투창: 거리 배율 */
  mcJavelin: { len: 1.4 },
  /** 무거운 날: 투척 피해 배율 */
  mcHeavy: { mul: 1.5 },
  /** 백은의 검: 베기 피해 배율 · 부채꼴 cos (원래 값 대신) */
  mcSword: { mul: 1.3, cos: 0 },
  /** 백금의 창: 길이 배율 · 피해 배율 */
  mcLance: { len: 1.3, mul: 1.2 },
  /** 무기 수집가: 쏟아지는 수 더함 · 박힌 무기 최대 더함 */
  mcHoard: { rain: 4, max: 6 },
  /** 쏟아지는 하늘: 무기 비 수 더함 */
  mcStorm: { more: 4 },
  /** 공허 걸음: 범위 배율 */
  mcBlink: { r: 1.4 },
  /** 공허의 칼날: 도착 피해 배율 · 무적 틱 더함 */
  mcVoid: { mul: 1.5, inv: 18 },
  /** 끝없는 무기고: 틱 더함 · 간격 배율 */
  mcArsenal: { more: 180, every: 0.7 },
  /** 인도자의 기도: 스킬 대기 배율 */
  mcPrayer: { cd: 0.85 },
};
