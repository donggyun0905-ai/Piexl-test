// 제단의 방 성좌 8 (계산은 sim/altar): 카드 1 거래(주는 것·받아 가는 것) · 카드 2 증강 기술 둘 (광야의 새벽 각성 기술) · 카드 3 무시(30%로 벌칙)
// 수치는 관리자 페이지에서 바꿀 수 있음 (balanceTables)
import type { SwarmSkill } from "./sim/swarmEvo";

export type AltarId = "whale" | "turtle" | "hawk" | "wind" | "sion" | "sylvester" | "witch" | "unknown";
export const ALTAR_IDS: readonly AltarId[] = ["whale", "turtle", "hawk", "wind", "sion", "sylvester", "witch", "unknown"];

/** 거래 한 줄: 능력치 · 더하기(add) 또는 곱하기(mul) · 추가 기본 스탯(extra) */
export interface AltarTrade {
  stat: "maxHp" | "damage" | "attackSpeed" | "moveSpeed" | "regen" | "defense" | "critChance" | "sharpness";
  add?: number;
  mul?: number;
}

export interface AltarDef {
  /** 카드 1: 받는 것 · 빼앗기는 것 (무시 벌칙의 앞쪽도 빼앗기는 것) */
  give: readonly AltarTrade[];
  take: readonly AltarTrade[];
  /** 카드 2: 남은 패시브 하나에 붙는 증강 기술 둘 */
  skills: readonly [SwarmSkill, SwarmSkill];
}

export const ALTARS: Record<AltarId, AltarDef> = {
  /** 바다의 성좌 흰수염고래: 재생력 +20 · 최대 체력 -20 */
  whale: { give: [{ stat: "regen", add: 20 }], take: [{ stat: "maxHp", add: -20 }], skills: ["nova", "frost"] },
  /** 화산의 성좌 용암 거북: 방어력 +20 · 공격력 -20% */
  turtle: { give: [{ stat: "defense", add: 20 }], take: [{ stat: "damage", mul: 0.8 }], skills: ["cleave", "comet"] },
  /** 하늘의 성좌 천둥 매: 공격 속도 +15% · 치명타 확률 -15% */
  hawk: { give: [{ stat: "attackSpeed", mul: 1.15 }], take: [{ stat: "critChance", add: -0.15 }], skills: ["chain", "storm"] },
  /** 바람의 성좌 세실리아: 예리함 +20% · 이동 속도 -0.3 */
  wind: { give: [{ stat: "sharpness", add: 0.2 }], take: [{ stat: "moveSpeed", add: -0.3 }], skills: ["wave", "blades"] },
  /** 빛과 어둠의 성좌 시온: 공격 속도 +10% · 이동 속도 +1.0 · 공격력 -5 · 최대 체력 -10 */
  sion: { give: [{ stat: "attackSpeed", mul: 1.1 }, { stat: "moveSpeed", add: 1 }], take: [{ stat: "damage", add: -5 }, { stat: "maxHp", add: -10 }], skills: ["vortex", "pillar"] },
  /** 그린우드의 성좌 실베스타: 치명타 확률 +30% · 최대 체력 -30% */
  sylvester: { give: [{ stat: "critChance", add: 0.3 }], take: [{ stat: "maxHp", mul: 0.7 }], skills: ["bounce", "lance"] },
  /** 일곱 갈래의 마녀 세티아: 상태이상 면역 · 최대 체력 -20% */
  witch: { give: [], take: [{ stat: "maxHp", mul: 0.8 }], skills: ["fan", "curse"] },
  /** 알 수 없는 성좌 ???: 가진 패시브 둘을 무작위 패시브 둘로 바꿈 */
  unknown: { give: [], take: [], skills: ["boomerang", "barrage"] },
};

/** 제단 수치: 이 층부터 · 카드 2가 빼앗는 패시브 수 · 무시했을 때 벌칙 확률 · ??? 무시 벌칙 패시브 수 · ??? 거래로 바꾸는 패시브 수 · 증강을 바꿀 때 바치는 최대 체력 · 바친 뒤 남아야 하는 최대 체력 · 증강 기술 피해 배율(광야의 새벽 각성 기술 대비, 2026-11-03 낮춤) */
export const ALTAR = { fromFloor: 3, takePassives: 2, ignoreChance: 0.3, unknownIgnore: 4, unknownSwap: 2, swapHp: 20, swapMinHp: 10, augPower: 0.55 };
