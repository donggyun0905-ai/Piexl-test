// 라파엘 전용 아이템 20개: 저격·거리 5 · 표적·지휘관 5 · 폭풍·바람 5 · 스킬·빛 5. 효과는 sim/rafael·rafaelKit·rafaelSkills. 수치는 RAFAEL_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "rafael" as const, effect: true as const });

export const RAFAEL_PASSIVES = {
  // ── 저격·거리 ──
  /** 정밀 스코프: 초장거리 피해 더 증가 */
  rfScope: P("rfScope", [{ stat: "range", add: 10 }]),
  /** 긴 시위: 화살이 더 멀리 날아감 */
  rfReach: P("rfReach", [{ stat: "range", add: 10 }]),
  /** 관통 화살촉: 1·2타 화살이 적 하나 더 꿰뚫음 */
  rfPierce: P("rfPierce", [{ stat: "damage", add: 1 }]),
  /** 숨 고르기: 가만히 서 있으면 피해 증가 */
  rfSteady: P("rfSteady", [{ stat: "maxHp", add: 10 }]),
  /** 머리를 노려라: 3타 저격 피해 증가 */
  rfHead: P("rfHead", [{ stat: "damage", add: 1 }]),
  // ── 표적·지휘관 ──
  /** 사냥꾼의 낙인: 표적이 받는 피해 더 증가 */
  rfBrand: P("rfBrand", [{ stat: "damage", add: 1 }]),
  /** 지휘관 사냥: 표적을 쓰러뜨리면 스킬 대기가 더 줄어듦 */
  rfHunt: P("rfHunt"),
  /** 빌린 시야: 1·2타 화살도 표적을 향함 */
  rfSpotter: P("rfSpotter", [{ stat: "luck", add: 1 }]),
  /** 파편 화살: 표적을 맞히면 둘레 적에게 파편 */
  rfShard: P("rfShard"),
  /** 두 번째 표적: 두 번째로 강한 적도 표적 */
  rfTwin: P("rfTwin"),
  // ── 폭풍·바람 ──
  /** 폭풍의 눈: 폭풍 화살비가 더 넓음 */
  rfEye: P("rfEye", [{ stat: "maxHp", add: 10 }]),
  /** 끝없는 비: 폭풍 화살비가 더 많이 내림 */
  rfRain: P("rfRain"),
  /** 순풍: 바람 걸음이 더 멀리 · 이동 속도 */
  rfTail: P("rfTail", [{ stat: "moveSpeed", add: 0.1 }]),
  /** 뇌전 화살: 3타 저격에 맞은 적에게 번개 */
  rfThunder: P("rfThunder", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 바람 깃: 1·2타 화살이 밀쳐내고 느리게 함 */
  rfFeather: P("rfFeather", [{ stat: "attackSpeed", add: 0.05 }]),
  // ── 스킬·빛 ──
  /** 집중: 에테르 스코프가 더 오래 감 */
  rfFocus: P("rfFocus"),
  /** 넓은 빛살: 천공의 빛 화살이 더 굵음 */
  rfLance: P("rfLance", [{ stat: "maxHp", add: 10 }]),
  /** 천벌: 천공의 빛 화살 피해 증가 */
  rfWrath: P("rfWrath", [{ stat: "damage", add: 1 }]),
  /** 후광 화살: 화살마다 빛 피해 추가 */
  rfHalo: P("rfHalo", [{ stat: "luck", add: 1 }]),
  /** 바람의 기도: 모든 스킬 대기 감소 */
  rfPrayer: P("rfPrayer"),
} as const satisfies Record<string, PassiveDef>;

/** 전용 아이템 수치 (배율 1 = 100%, 시간은 틱) */
export const RAFAEL_PERKS = {
  /** 정밀 스코프: 가장 셀 때 더하는 피해 (원래 값 대신) */
  rfScope: { bonus: 1 },
  /** 긴 시위: 화살 거리 배율 */
  rfReach: { len: 1.3 },
  /** 관통 화살촉: 더 꿰뚫는 적 수 */
  rfPierce: { more: 1 },
  /** 숨 고르기: 가만히 있어야 하는 틱 · 피해 배율 */
  rfSteady: { still: 30, mul: 1.25 },
  /** 머리를 노려라: 저격 피해 배율 */
  rfHead: { mul: 1.4 },
  /** 사냥꾼의 낙인: 표적이 받는 피해 더함 (원래 값 대신) */
  rfBrand: { taken: 0.5 },
  /** 지휘관 사냥: 줄이는 비율 (원래 값 대신) */
  rfHunt: { refund: 0.6 },
  /** 빌린 시야: 표적이 앞쪽(cos 이상)이면 1·2타도 향함 */
  rfSpotter: { cos: 0 },
  /** 파편 화살: 반지름 · 피해 배율 */
  rfShard: { r: 40, mul: 0.3 },
  /** 두 번째 표적: 표적 수 */
  rfTwin: { n: 2 },
  /** 폭풍의 눈: 반지름 배율 */
  rfEye: { r: 1.3 },
  /** 끝없는 비: 내리는 횟수 더함 */
  rfRain: { more: 3 },
  /** 순풍: 거리 배율 */
  rfTail: { dist: 1.4 },
  /** 뇌전 화살: 번개 피해 배율 */
  rfThunder: { mul: 0.4 },
  /** 바람 깃: 밀침 · 느려짐 틱 */
  rfFeather: { push: 8, slow: 30 },
  /** 집중: 스코프 틱 더함 */
  rfFocus: { more: 120 },
  /** 넓은 빛살: 폭 배율 */
  rfLance: { w: 1.5 },
  /** 천벌: 피해 배율 */
  rfWrath: { mul: 1.4 },
  /** 후광 화살: 빛 피해 (그 화살 피해 대비) */
  rfHalo: { mul: 0.2 },
  /** 바람의 기도: 스킬 대기 배율 */
  rfPrayer: { cd: 0.85 },
};
