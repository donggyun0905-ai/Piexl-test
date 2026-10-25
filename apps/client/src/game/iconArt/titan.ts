// 거인 아이콘: 기계팔 무기 10개 (쇠·주황 불빛) · 전용 아이템 10개
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import { D, K, Pen, S } from "./pen";

const RUST = "#c87a3a";
const GLOW = "#ffb040";
const STEEL = "#7a8494";

/** 기계팔 (어깨 왼쪽 위 → 아래팔) */
function arm(g: Pen): void {
  g.rect(1, 2, 5, 5, K).rect(2, 3, 3, 3, STEEL).px(3, 4, GLOW);
  g.line(5, 6, 8, 9, K).line(4, 6, 7, 9, D);
}

type TitanWeapon = "ironArm" | "pistonFist" | "wreckingBall" | "drillArm" | "anvilHammer" | "rivetGun" | "magnetArm" | "bulwarkArm" | "steamVent" | "titanCore";
type TitanPassive = "armorPlate" | "bigCapacitor" | "overdriveCircuit" | "hydraulicJoint" | "scrapRepair" | "aftershock" | "counterCoil" | "chargeKnuckle" | "gyroStabilizer" | "titanHull";

export const TITAN_WEAPON_ART: Record<TitanWeapon & WeaponId, (g: Pen) => void> = {
  ironArm: (g) => {
    arm(g);
    g.rect(8, 9, 6, 5, K).rect(9, 10, 4, 3, STEEL).px(10, 11, S);
  },
  pistonFist: (g) => {
    arm(g);
    g.rect(8, 10, 3, 2, D).rect(11, 9, 4, 4, K).rect(12, 10, 2, 2, RUST);
  },
  wreckingBall: (g) => {
    g.line(3, 1, 6, 6, D).disc(9, 10, 4, K).disc(9, 10, 3, "#4a4a5a").px(8, 9, S);
  },
  drillArm: (g) => {
    arm(g);
    g.line(8, 9, 14, 15, K).line(9, 9, 14, 14, GLOW).px(11, 12, K).px(12, 13, "#fff");
  },
  anvilHammer: (g) => {
    g.line(3, 14, 9, 8, "#8a6a3a").rect(6, 2, 9, 5, K).rect(7, 3, 7, 3, STEEL).px(8, 3, S);
  },
  rivetGun: (g) => {
    g.rect(2, 7, 9, 4, K).rect(3, 8, 7, 2, STEEL).rect(4, 11, 2, 3, K).px(12, 8, GLOW).px(14, 8, GLOW);
  },
  magnetArm: (g) => {
    g.rect(3, 3, 3, 9, K).rect(10, 3, 3, 9, K).rect(3, 10, 10, 3, K).rect(4, 4, 1, 8, "#e04040").rect(11, 4, 1, 8, "#4a8aff");
  },
  bulwarkArm: (g) => {
    g.rect(3, 2, 10, 11, K).rect(4, 3, 8, 9, STEEL).rect(6, 6, 4, 3, RUST).px(5, 4, S);
  },
  steamVent: (g) => {
    g.rect(4, 9, 8, 5, K).rect(5, 10, 6, 3, STEEL).disc(6, 5, 2, "#e8e8f0").disc(10, 4, 2, "#c8c8d8").px(8, 7, "#fff");
  },
  titanCore: (g) => {
    g.disc(8, 8, 6, K).disc(8, 8, 5, STEEL).disc(8, 8, 3, RUST).disc(8, 8, 1, GLOW).px(8, 2, GLOW).px(8, 14, GLOW);
  },
};

export const TITAN_PASSIVE_ART: Record<TitanPassive & PassiveId, (g: Pen) => void> = {
  armorPlate: (g) => {
    g.rect(2, 3, 12, 10, K).rect(3, 4, 10, 8, STEEL).px(4, 5, S).px(11, 5, S).px(4, 10, S).px(11, 10, S);
  },
  bigCapacitor: (g) => {
    g.rect(4, 2, 8, 12, K).rect(5, 3, 6, 10, "#3a5a8a").rect(6, 7, 4, 5, GLOW).rect(6, 1, 4, 1, D);
  },
  overdriveCircuit: (g) => {
    g.rect(2, 4, 12, 8, "#1a4a2a").line(3, 6, 12, 6, GLOW).line(3, 9, 8, 9, GLOW).px(12, 9, "#ff4a2a").px(5, 4, S);
  },
  hydraulicJoint: (g) => {
    g.rect(2, 6, 5, 4, K).rect(7, 7, 7, 2, D).rect(3, 7, 3, 2, STEEL).px(13, 7, S);
  },
  scrapRepair: (g) => {
    g.line(3, 13, 10, 6, "#8a6a3a").rect(9, 2, 5, 3, STEEL).rect(10, 5, 3, 2, STEEL).px(3, 4, "#6ad86a").rect(2, 3, 3, 1, "#6ad86a");
  },
  aftershock: (g) => {
    g.ring(8, 9, 5, GLOW).ring(8, 9, 3, RUST).rect(5, 12, 7, 2, "#6a5a4a");
  },
  counterCoil: (g) => {
    for (let i = 0; i < 4; i++) g.line(3, 3 + i * 3, 13, 4 + i * 3, i % 2 ? D : RUST);
    g.px(14, 2, "#9ad8ff").px(13, 1, "#9ad8ff");
  },
  chargeKnuckle: (g) => {
    g.rect(3, 6, 10, 6, K).rect(4, 7, 8, 4, STEEL).px(5, 8, GLOW).px(7, 8, GLOW).px(9, 8, GLOW).line(10, 1, 7, 5, "#ffe84a");
  },
  gyroStabilizer: (g) => {
    g.ring(8, 8, 6, D).ring(8, 8, 3, GLOW).line(2, 8, 14, 8, STEEL).px(8, 8, "#fff");
  },
  titanHull: (g) => {
    g.rect(2, 5, 12, 8, K).rect(3, 6, 10, 6, "#5a6474").line(3, 9, 12, 9, RUST).px(5, 7, S).px(10, 7, S);
  },
};
