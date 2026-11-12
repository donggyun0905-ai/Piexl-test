// 아리아 전용 아이템 10개: 악기 넷(피아노·하프·호른·클라리넷 → 넷이 다 놓이면 악보 완성) · 영혼의 바이올린 · 음표를 바꾸는 넷 · 악기를 돕는 마에스트로
// 효과는 sim/aria·arBurst·arFinale·arInstruments. 수치는 ARIA_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "aria" as const, effect: true as const });

export const ARIA_PASSIVES = {
  /** 피아노: 공격마다 확률로 방 어딘가에 피아노 (하나까지·60초) · 음표 셋을 적에게 날림 */
  arPiano: P("arPiano", [{ stat: "damage", mul: 1.05 }]),
  /** 하프: 공격마다 확률로 방 어딘가에 하프 (하나까지·60초) · 음표 다섯을 부채꼴로 날림 */
  arHarp: P("arHarp", [{ stat: "range", mul: 1.06 }]),
  /** 호른: 공격마다 확률로 방 어딘가에 호른 (둘까지·30초) · 빠른 음표를 하나씩 자주 쏨 */
  arHorn: P("arHorn", [{ stat: "attackSpeed", add: 0.06 }]),
  /** 클라리넷: 공격마다 확률로 적을 따라다니는 클라리넷 (둘까지·30초) · 둘레 적이 느려지고 공격이 늦어지며 받는 피해가 늘어남 */
  arClarinet: P("arClarinet", [{ stat: "luck", add: 2 }]),
  /** 영혼의 바이올린: 영혼 팔이 켜는 바이올린이 곁을 떠다니다 가까운 적을 활로 휘감아 벰 */
  arViolin: P("arViolin", [{ stat: "maxHp", add: 15 }]),
  /** 화음: 공격마다 다른 종류 음표가 하나 더 */
  arChord: P("arChord", [{ stat: "damage", mul: 1.05 }]),
  /** 돌림노래: 음표가 방 끝에 닿으면 한 번 튕겨 돌아옴 */
  arCanon: P("arCanon", [{ stat: "range", mul: 1.06 }]),
  /** 포르티시모: 음표 피해와 여덟 음표 터짐 범위가 커짐 */
  arForte: P("arForte", [{ stat: "damage", mul: 1.08 }]),
  /** 앙코르: 여덟 음표가 터진 자리에서 잠시 뒤 한 번 더 터짐 · 악보 완성이 더 길어짐 */
  arEncore: P("arEncore", [{ stat: "maxHp", add: 10 }]),
  /** 마에스트로: 악기가 더 잘 나오고 오래 남으며 악기 음표가 세짐 */
  arMaestro: P("arMaestro", [{ stat: "luck", add: 2 }]),
} as const satisfies Record<string, PassiveDef>;

/** 전용 아이템 수치 (피해 배율은 공격력 ×, 시간은 틱(60 = 1초), 거리는 픽셀, 확률은 0~1) */
export const ARIA_PERKS = {
  /** 피아노: 공격마다 확률 · 방에 가장 많이 · 남는 틱 · 몇 틱마다 · 음표 수 · 음표 피해 배율 · 음표 빠르기 */
  arPiano: { chance: 0.06, max: 1, life: 3600, rate: 80, n: 3, mul: 1.1, speed: 2.6 },
  /** 하프: 공격마다 확률 · 방에 가장 많이 · 남는 틱 · 몇 틱마다 · 음표 수 · 음표 피해 배율 · 음표 빠르기 · 부채꼴 사이 각도 */
  arHarp: { chance: 0.06, max: 1, life: 3600, rate: 100, n: 5, mul: 0.8, speed: 2.4, spread: 0.22 },
  /** 호른: 공격마다 확률 · 방에 가장 많이 · 남는 틱 · 몇 틱마다 · 음표 피해 배율 · 음표 빠르기 */
  arHorn: { chance: 0.08, max: 2, life: 1800, rate: 18, mul: 0.5, speed: 5 },
  /** 클라리넷: 공격마다 확률 · 방에 가장 많이 · 남는 틱 · 따라가는 빠르기 · 둘레 반지름 · 받는 피해 배율 · 공격 늦춤(몇 틱마다 준비 한 틱 되돌림) */
  arClarinet: { chance: 0.08, max: 2, life: 1800, speed: 1.6, r: 64, taken: 1.25, lag: 3 },
  /** 영혼의 바이올린: 몇 틱마다 · 적을 찾는 거리 · 벰 반지름 · 피해 배율 · 맞는 수 · 벰 사이 틱 */
  arViolin: { rate: 150, sight: 110, r: 72, mul: 1.3, hits: 2, gap: 10 },
  /** 화음: 공격마다 더 나오는 음표 수 · 그 음표 피해 배율 */
  arChord: { n: 1, mul: 0.7 },
  /** 돌림노래: 튕기는 수 */
  arCanon: { bounces: 1 },
  /** 포르티시모: 음표 피해 배율 · 여덟 음표 터짐 반지름 배율 */
  arForte: { mul: 1.25, burst: 1.3 },
  /** 앙코르: 다시 터지기까지 틱 · 다시 터지는 피해 배율 · 악보 완성 늘어나는 틱 */
  arEncore: { delay: 30, mul: 0.6, finale: 180 },
  /** 마에스트로: 악기 나올 확률 배율 · 남는 틱 배율 · 악기 음표 피해 배율 */
  arMaestro: { chance: 1.5, life: 1.5, mul: 1.3 },
};
