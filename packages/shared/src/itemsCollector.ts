// 수집가 수집 무기 30개 (패시브로 바닥·상자·상점에서 얻음): 얻을 때마다 콤보에 그 무기의 기술이 한 칸 늘고, 무기마다 작은 능력치
// 기술 계산은 sim/collector · 그림 차례(줄마다 10개)는 game/collectorArt와 같음
import type { StatMod } from "./stats";

/** 무기 갈래 (소리·설명 묶음): blade 베기·찌르기 · heavy 무거운 무기 · magic 마법 · shot 쏘기·던지기. 공격 하나하나는 sim/collectorMoves */
export type ClStyle = "blade" | "heavy" | "magic" | "shot";
/** 추가 효과 (val): heal 회복량 · leech 준 피해 비율 회복 · slow 느려짐 틱 · burn 불탐(피해 배율) · pull 끌어당김 · push 밀침 · stun 기절 틱 · root 묶임 틱 · bleed 출혈 */
export type ClFx = "heal" | "leech" | "slow" | "burn" | "pull" | "push" | "stun" | "root" | "bleed";

export interface ClArm {
  style: ClStyle;
  /** 피해 배율 (공격력 ×) */
  mul: number;
  /** 닿는 거리 (반지름·길이, 무기마다 쓰는 곳은 sim/collectorMoves) · 굵기(반) · 수 */
  reach: number;
  width?: number;
  n?: number;
  fx?: ClFx;
  val?: number;
  /** 이펙트 색 (무기 색) */
  color: string;
}

const A = (style: ClStyle, mul: number, reach: number, color: string, more: Partial<ClArm> = {}): ClArm => ({ style, mul, reach, color, ...more });

/** 수집 무기 기술 (그림 차례: 1줄 검·칼·지팡이 · 2줄 활·석궁·총·책·건틀릿 · 3줄 창·망치·도끼·낫·쌍월) */
export const CL_ARMS = {
  clHolySword: A("blade", 1.2, 34, "#ffe9a0", { fx: "heal", val: 1 }),
  clBloodSword: A("blade", 1.2, 34, "#ff3a48", { fx: "leech", val: 0.06 }),
  clIceSword: A("blade", 1.2, 34, "#8ad8ff", { fx: "slow", val: 60 }),
  clSunSword: A("blade", 1.2, 34, "#ffb030", { fx: "burn", val: 0.3 }),
  clVoidSword: A("blade", 1.2, 34, "#a860ff", { fx: "pull", val: 12 }),
  clChainCleaver: A("heavy", 2, 26, "#d0c8c0", { fx: "bleed" }),
  clKatana: A("blade", 1.8, 70, "#ff3040", { width: 10, fx: "bleed" }),
  clSunStaff: A("magic", 1.5, 30, "#ffd060", { fx: "burn", val: 0.3 }),
  clVoidStaff: A("magic", 1.3, 40, "#b060ff", { fx: "pull", val: 20 }),
  clVineStaff: A("magic", 1.1, 36, "#60e070", { fx: "root", val: 60 }),
  clWhiteBow: A("shot", 0.8, 150, "#f4f4ff", { width: 4, n: 3 }),
  clBloodBow: A("shot", 0.8, 150, "#ff3a48", { width: 4, n: 3, fx: "leech", val: 0.05 }),
  clIceBow: A("shot", 0.8, 150, "#8ad8ff", { width: 4, n: 3, fx: "slow", val: 45 }),
  clGoldBow: A("shot", 0.6, 150, "#ffd040", { width: 4, n: 5 }),
  clCrossbow: A("shot", 2.2, 220, "#e0a860", { width: 5, n: 1, fx: "push", val: 12 }),
  clPistol: A("shot", 0.5, 130, "#fff0c0", { width: 3, n: 4 }),
  clStarTome: A("magic", 1.2, 18, "#8ab8ff", { n: 5 }),
  clEyeTome: A("magic", 1.5, 180, "#d050ff", { width: 9, fx: "stun", val: 30 }),
  clGoldFist: A("heavy", 1.8, 50, "#ffc040", { fx: "push", val: 20 }),
  clClaw: A("blade", 0.7, 24, "#c040ff", { n: 3, fx: "bleed" }),
  clBlueSpear: A("blade", 1.6, 160, "#60a8ff", { width: 6 }),
  clRedSpear: A("blade", 1.6, 160, "#ff4050", { width: 6, fx: "bleed" }),
  clIceSpear: A("blade", 1.6, 160, "#9ae0ff", { width: 6, fx: "slow", val: 60 }),
  clGoldSpear: A("blade", 1.6, 180, "#ffd060", { width: 6, fx: "heal", val: 1 }),
  clStoneHammer: A("heavy", 2, 34, "#e0d8c8", { fx: "stun", val: 45 }),
  clBloodHammer: A("heavy", 2, 34, "#ff3a48", { fx: "leech", val: 0.05 }),
  clBlueAxe: A("heavy", 0.8, 44, "#80b8ff", { n: 2, fx: "slow", val: 45 }),
  clRedAxe: A("heavy", 0.8, 44, "#ff5030", { n: 2, fx: "burn", val: 0.3 }),
  clScythe: A("heavy", 1.8, 52, "#b860ff", { fx: "leech", val: 0.06 }),
  clCrescent: A("shot", 1, 140, "#8ab8ff", { width: 10, n: 2 }),
} satisfies Record<string, ClArm>;

export type ClArmId = keyof typeof CL_ARMS;
/** 수집 무기 차례 (그림 시트·아이콘 차례) */
export const CL_ARM_IDS = Object.keys(CL_ARMS) as ClArmId[];

/** 무기마다 작은 능력치 (검·도끼·낫 공격력 · 활·창·지팡이 사거리 · 망치·건틀릿·칼 체력 · 카타나·총·발톱 공격 속도) */
const MOD: Record<ClArmId, StatMod[]> = {
  clHolySword: [{ stat: "damage", add: 2 }],
  clBloodSword: [{ stat: "damage", add: 2 }],
  clIceSword: [{ stat: "damage", add: 2 }],
  clSunSword: [{ stat: "damage", add: 2 }],
  clVoidSword: [{ stat: "damage", add: 2 }],
  clChainCleaver: [{ stat: "maxHp", add: 8 }],
  clKatana: [{ stat: "attackSpeed", mul: 1.04 }],
  clSunStaff: [{ stat: "range", add: 6 }],
  clVoidStaff: [{ stat: "range", add: 6 }],
  clVineStaff: [{ stat: "maxHp", add: 6 }],
  clWhiteBow: [{ stat: "range", add: 6 }],
  clBloodBow: [{ stat: "range", add: 6 }],
  clIceBow: [{ stat: "range", add: 6 }],
  clGoldBow: [{ stat: "range", add: 6 }],
  clCrossbow: [{ stat: "damage", add: 2 }],
  clPistol: [{ stat: "attackSpeed", mul: 1.04 }],
  clStarTome: [{ stat: "maxHp", add: 6 }],
  clEyeTome: [{ stat: "range", add: 6 }],
  clGoldFist: [{ stat: "maxHp", add: 8 }],
  clClaw: [{ stat: "attackSpeed", mul: 1.04 }],
  clBlueSpear: [{ stat: "range", add: 6 }],
  clRedSpear: [{ stat: "range", add: 6 }],
  clIceSpear: [{ stat: "range", add: 6 }],
  clGoldSpear: [{ stat: "range", add: 6 }],
  clStoneHammer: [{ stat: "maxHp", add: 10 }],
  clBloodHammer: [{ stat: "maxHp", add: 10 }],
  clBlueAxe: [{ stat: "damage", add: 2 }],
  clRedAxe: [{ stat: "damage", add: 2 }],
  clScythe: [{ stat: "damage", add: 2 }],
  clCrescent: [{ stat: "moveSpeed", add: 0.05 }],
};

/** 수집 무기 = 수집가 전용 패시브 (한 판에 하나씩) */
export const COLLECTOR_PASSIVES = Object.fromEntries(CL_ARM_IDS.map((id) => [id, { id, mods: MOD[id], exclusive: "collector" as const, effect: true as const }] as const)) as Record<ClArmId, { id: ClArmId; mods: StatMod[]; exclusive: "collector"; effect: true }>;
