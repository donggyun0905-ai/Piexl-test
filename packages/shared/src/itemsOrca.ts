// 오르카 전용 아이템 10개: 콤보 3 · 상어 3 · 해방 4. 효과는 sim/orca·orcaMoves. 수치는 ORCA_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "orca" as const, effect: true as const });

export const ORCA_PASSIVES = {
  // ── 콤보 ──
  /** 물보라 장갑: 1타 물보라가 멀리·세게 */
  ocSpray: P("ocSpray"),
  /** 밑물결: 2타 소용돌이가 크고 세게 끌어당김 */
  ocUndertow: P("ocUndertow"),
  /** 파도 타기: 대시 직후 다음 타격이 세고, 콤보가 끊기지 않고 한 단계 건너뜀 */
  ocSurf: P("ocSurf"),
  // ── 상어 ──
  /** 등지느러미: 상어 기공파 사냥 횟수 + */
  ocFin: P("ocFin"),
  /** 피 냄새: 상어가 한 번 물 때마다 다음 물기가 더 셈 */
  ocFrenzy: P("ocFrenzy", [{ stat: "damage", add: 1 }]),
  /** 반향정위: 상어가 터질 때 물기둥이 솟고 터짐이 넓어짐 */
  ocEcho: P("ocEcho"),
  // ── 해방 ──
  /** 고래의 숨: 해방 게이지가 빨리 참 */
  ocBreath: P("ocBreath"),
  /** 해방의 노래: 해방 상태가 더 오래 감 */
  ocLiberty: P("ocLiberty"),
  /** 물거품 방패: 범고래 돌파로 내려앉으면 체력 회복 */
  ocFoam: P("ocFoam", [{ stat: "maxHp", add: 10 }]),
  /** 바닷바람: 이동 속도 + · 받는 피해 줄어듦 */
  ocSeaWind: P("ocSeaWind", [{ stat: "moveSpeed", add: 0.1 }]),
} as const satisfies Record<string, PassiveDef>;

/** 오르카 아이템 수치 */
export const ORCA_PERKS = {
  /** 물보라 장갑: 1타 거리 배율 · 피해 배율 */
  ocSpray: { reach: 1.35, mul: 1.3 },
  /** 밑물결: 2타 반지름 배율 · 끌어당김 배율 */
  ocUndertow: { r: 1.25, pull: 1.8 },
  /** 파도 타기: 대시 뒤 남는 틱 · 다음 타격 피해 배율 */
  ocSurf: { ticks: 40, mul: 1.5 },
  /** 등지느러미: 사냥 횟수 더함 */
  ocFin: { hunts: 2 },
  /** 피 냄새: 물 때마다 다음 물기 피해 더함 */
  ocFrenzy: { up: 0.25 },
  /** 반향정위: 터짐 반지름 배율 */
  ocEcho: { r: 1.5 },
  /** 고래의 숨: 게이지 차는 배율 */
  ocBreath: { gain: 1.5 },
  /** 해방의 노래: 해방 상태 더 늘어나는 틱 */
  ocLiberty: { ticks: 300 },
  /** 물거품 방패: 회복(최대 체력 비율) */
  ocFoam: { heal: 0.12 },
  /** 바닷바람: 받는 피해 배율 */
  ocSeaWind: { taken: 0.9 },
};
