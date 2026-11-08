// 블루 플레임 전용 아이템 20개: 활 5 · 불꽃 감옥 5 · 불꽃 기둥 5 · 청염·각성 5 (푸른 날개 화살비 포함). 효과는 sim/blueFlame·blueFlameKit. 수치는 BLUE_FLAME_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "blueFlame" as const, effect: true as const });

export const BLUE_FLAME_PASSIVES = {
  // ── 활 ──
  /** 빠른 시위: 기본 공격 간격이 짧아짐 */
  bzDraw: P("bzDraw", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 청염 깃: 화살 피해 증가 */
  bzFletch: P("bzFletch", [{ stat: "damage", add: 1 }]),
  /** 갈래 화살: 바깥 범위의 다른 적에게도 화살 하나 더 */
  bzSplit: P("bzSplit", [{ stat: "luck", add: 1 }]),
  /** 불씨 화살: 화살이 박힌 자리 둘레에도 피해 */
  bzEmber: P("bzEmber", [{ stat: "damage", add: 1 }]),
  /** 넓은 감각: 세 겹 범위 모두 넓어짐 */
  bzWide: P("bzWide", [{ stat: "range", add: 8 }]),
  // ── 불꽃 감옥 ──
  /** 청염 감옥: 불꽃 감옥 피해 증가 */
  bzPrison: P("bzPrison", [{ stat: "damage", add: 1 }]),
  /** 단단한 감옥: 더 오래 가둠 */
  bzCage: P("bzCage", [{ stat: "maxHp", add: 10 }]),
  /** 감옥 붕괴: 불꽃 감옥 범위 증가 */
  bzImplode: P("bzImplode", [{ stat: "range", add: 6 }]),
  /** 봉인: 불꽃 감옥에 갇힌 적이 기절 */
  bzSeal: P("bzSeal", [{ stat: "maxHp", add: 10 }]),
  /** 가까운 공포: 안쪽 범위가 넓어짐 */
  bzInner: P("bzInner", [{ stat: "maxHp", add: 10 }]),
  // ── 불꽃 기둥 ──
  /** 솟는 불길: 불꽃 기둥 피해 증가 */
  bzPillar: P("bzPillar", [{ stat: "damage", add: 1 }]),
  /** 쌍기둥: 가운데 범위의 다른 적에게도 기둥 하나 더 */
  bzTwin: P("bzTwin", [{ stat: "luck", add: 1 }]),
  /** 불기둥 폭: 불꽃 기둥 범위 증가 */
  bzBlaze: P("bzBlaze", [{ stat: "range", add: 6 }]),
  /** 불기둥 밀침: 기둥에 맞은 적을 밀쳐냄 */
  bzKnock: P("bzKnock", [{ stat: "moveSpeed", add: 0.05 }]),
  /** 남는 불꽃: 청염이 더 오래 감 */
  bzLinger: P("bzLinger", [{ stat: "luck", add: 1 }]),
  // ── 청염·각성 ──
  /** 푸른 날개: 공격하다 확률로 날개가 돋고 머리 위 활들이 앞쪽에 화살비 */
  bzWing: P("bzWing", [{ stat: "luck", add: 1 }]),
  /** 영혼 소각: 청염 피해 증가 */
  bzSoul: P("bzSoul", [{ stat: "damage", add: 1 }]),
  /** 맹인의 감각: 성흔이 더 빨리 참 */
  bzSense: P("bzSense", [{ stat: "luck", add: 1 }]),
  /** 거대한 화살: 각성 폭격 범위·피해 증가 */
  bzGreat: P("bzGreat", [{ stat: "damage", add: 1 }]),
  /** 꺼지지 않는 불: 열화상 각성이 더 오래 감 */
  bzEndless: P("bzEndless", [{ stat: "maxHp", add: 10 }]),
} as const satisfies Record<string, PassiveDef>;

/** 전용 아이템 수치 (배율 1 = 100%, 시간은 틱) */
export const BLUE_FLAME_PERKS = {
  /** 빠른 시위: 기본 공격 간격 배율 */
  bzDraw: { time: 0.85 },
  /** 청염 깃: 화살 피해 배율 */
  bzFletch: { mul: 1.35 },
  /** 갈래 화살: 더 쏘는 화살 수 */
  bzSplit: { add: 1 },
  /** 불씨 화살: 둘레 반지름 · 피해 배율 */
  bzEmber: { r: 18, mul: 0.5 },
  /** 넓은 감각: 세 겹 범위 배율 */
  bzWide: { r: 1.12 },
  /** 청염 감옥: 피해 배율 */
  bzPrison: { mul: 1.35 },
  /** 단단한 감옥: 가두는 틱 더함 */
  bzCage: { more: 30 },
  /** 감옥 붕괴: 반지름 배율 */
  bzImplode: { r: 1.35 },
  /** 봉인: 기절 틱 */
  bzSeal: { stun: 40 },
  /** 가까운 공포: 안쪽 경계 비율 (원래 대신) */
  bzInner: { ring: 0.45 },
  /** 솟는 불길: 피해 배율 */
  bzPillar: { mul: 1.35 },
  /** 쌍기둥: 더 세우는 기둥 수 */
  bzTwin: { add: 1 },
  /** 불기둥 폭: 반지름 배율 */
  bzBlaze: { r: 1.4 },
  /** 불기둥 밀침: 밀치는 거리 */
  bzKnock: { push: 12 },
  /** 남는 불꽃: 청염 지속 배율 */
  bzLinger: { ticks: 1.6 },
  /** 푸른 날개: 공격마다 화살비 확률 */
  bzWing: { chance: 0.12 },
  /** 영혼 소각: 청염 피해 배율 */
  bzSoul: { mul: 1.4 },
  /** 맹인의 감각: 차는 양 배율 */
  bzSense: { gain: 1.3 },
  /** 거대한 화살: 폭격 반지름 배율 · 피해 배율 */
  bzGreat: { r: 1.3, mul: 1.25 },
  /** 꺼지지 않는 불: 각성 틱 더함 */
  bzEndless: { more: 90 },
};
