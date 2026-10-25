// 플라이 아이콘: 발톱 10개(세 갈래 발톱, 무기마다 색·덧그림) · 전용 아이템 10개 (날개·바람·눈)
import type { Pen } from "./pen";

const WING = "#c8f4ff";
const WING_D = "#6ad8e8";
const WH = "#ffffff";

/** 세 갈래 휘어진 발톱 (색 c, 끝 색 tip) */
function claws(g: Pen, c: string, tip = WH): void {
  for (const dx of [0, 4, 8]) {
    g.line(3 + dx, 13, 5 + dx, 6, c).line(5 + dx, 6, 4 + dx, 2, c).px(4 + dx, 1, tip);
    g.px(4 + dx, 13, "#3a3446");
  }
}
/** 잠자리 날개 한 쌍 */
function wings(g: Pen, y = 6): void {
  g.rect(1, y, 6, 2, WING).rect(9, y, 6, 2, WING).rect(2, y + 3, 5, 2, WING_D).rect(9, y + 3, 5, 2, WING_D).rect(7, y - 1, 2, 8, "#2a3a4a");
}

export const FLY_WEAPON_ART: Record<"glassClaw" | "twinTalon" | "windTalon" | "venomClaw" | "thunderClaw" | "frostClaw" | "bloodClaw" | "mirageClaw" | "shadowClaw" | "queenTalon", (g: Pen) => void> = {
  glassClaw: (g) => claws(g, "#c8e8f4"),
  twinTalon: (g) => {
    claws(g, "#a8b8c8");
    g.line(2, 9, 14, 4, "#e8f4ff");
  },
  windTalon: (g) => {
    claws(g, "#a8e8c8");
    g.line(0, 15, 6, 15, "#a8e8ff").line(9, 15, 15, 15, "#a8e8ff");
  },
  venomClaw: (g) => claws(g, "#5a9a3a", "#9aff5a"),
  thunderClaw: (g) => {
    claws(g, "#8a8aa8", "#ffe04a");
    g.line(14, 8, 12, 11, "#ffe04a").line(12, 11, 14, 11, "#ffe04a").line(14, 11, 12, 14, "#ffe04a");
  },
  frostClaw: (g) => claws(g, "#8ad8ff", WH),
  bloodClaw: (g) => claws(g, "#a82a3a", "#ff6a6a"),
  mirageClaw: (g) => {
    claws(g, "#e8c8a8");
    g.px(1, 4, "#f4e0c0").px(2, 8, "#f4e0c0").px(14, 5, "#f4e0c0");
  },
  shadowClaw: (g) => claws(g, "#4a3a6a", "#a88aff"),
  queenTalon: (g) => {
    wings(g, 9);
    claws(g, "#6ad8e8", "#ffd040");
  },
};

export const FLY_PASSIVE_ART = {
  flyWings: (g: Pen) => wings(g),
  flyAfterburn: (g: Pen) => {
    wings(g, 4);
    g.line(2, 12, 13, 12, "#ff9a3a").line(4, 14, 11, 14, "#ffd040");
  },
  flyLonger: (g: Pen) => g.line(1, 8, 14, 8, WING_D).px(13, 7, WING_D).px(13, 9, WING_D).px(12, 6, WING_D).px(12, 10, WING_D).rect(1, 6, 2, 5, WING),
  flyKeen: (g: Pen) => claws(g, "#e8ecf4", "#ff4a4a"),
  flyEvade: (g: Pen) => g.rect(3, 4, 4, 8, "rgba(200,244,255,0.5)").rect(6, 4, 4, 8, "#a8d8e8").rect(9, 4, 4, 8, WING_D),
  flyRecharge: (g: Pen) => g.ring(8, 8, 6, WING_D).line(8, 2, 11, 1, WING_D).line(8, 2, 10, 4, WING_D).px(8, 8, WH),
  flyGust: (g: Pen) => g.line(1, 4, 12, 4, "#a8e8ff").line(3, 8, 15, 8, "#a8e8ff").line(1, 12, 10, 12, "#a8e8ff").px(13, 3, "#a8e8ff"),
  flyHunt: (g: Pen) => g.ring(8, 8, 6, "#ff6a6a").line(8, 0, 8, 15, "#ff6a6a").line(0, 8, 15, 8, "#ff6a6a").px(8, 8, WH),
  flyDragonEye: (g: Pen) => g.disc(5, 8, 4, "#3ac8a0").disc(11, 8, 4, "#3ac8a0").px(4, 7, WH).px(10, 7, WH).px(6, 9, "#1a5a4a").px(12, 9, "#1a5a4a"),
  flyFrenzy: (g: Pen) => {
    claws(g, "#ff8a3a", "#ffd040");
    g.px(1, 1, "#ff4a1a").px(14, 2, "#ff4a1a");
  },
};
