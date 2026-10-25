// 변희 아이콘: 동물 무기 10개(동물 얼굴) · 전용 아이템 30개 (그 동물 얼굴 + 오른쪽 아래 작은 표시)
import type { AnimalKind } from "@pixel-rogue/shared";
import { K, Pen } from "./pen";

const WH = "#ffffff";
const EYE = "#1a1420";

/** 동물 얼굴 (16칸 가득) */
export function animalFace(g: Pen, a: AnimalKind): void {
  switch (a) {
    case "wolf":
      g.rect(3, 5, 10, 8, "#8a8a9a").rect(5, 11, 6, 3, "#c8c8d4").px(2, 2, "#8a8a9a").rect(2, 3, 3, 3, "#8a8a9a").rect(11, 3, 3, 3, "#8a8a9a").px(13, 2, "#8a8a9a");
      g.px(3, 4, "#e8a0a0").px(12, 4, "#e8a0a0").px(5, 8, "#ffd040").px(10, 8, "#ffd040").rect(7, 12, 2, 1, EYE).px(6, 14, WH).px(9, 14, WH);
      break;
    case "bear":
      g.disc(3, 4, 2, "#6a4428").disc(12, 4, 2, "#6a4428").disc(8, 9, 6, "#7a5030").rect(5, 10, 6, 4, "#c8a070");
      g.px(5, 7, EYE).px(10, 7, EYE).rect(7, 10, 2, 2, EYE).px(3, 4, "#3a2414").px(12, 4, "#3a2414");
      break;
    case "eagle":
      g.disc(7, 7, 5, "#5a3a20").rect(4, 3, 7, 5, WH).rect(5, 8, 5, 2, WH).px(8, 5, EYE).px(9, 5, "#ffd040");
      g.rect(11, 6, 3, 2, "#ffc030").px(14, 7, "#ffc030").px(13, 8, "#e08a10").line(2, 11, 6, 14, "#3a2414");
      break;
    case "snake":
      g.disc(8, 7, 5, "#4a9a3a").rect(5, 11, 6, 4, "#4a9a3a").rect(6, 12, 4, 3, "#c8d870").px(5, 6, "#ffd040").px(11, 6, "#ffd040");
      g.px(5, 6, EYE).px(11, 6, EYE).line(8, 12, 8, 15, "#e83a3a").px(7, 15, "#e83a3a").px(9, 15, "#e83a3a").px(6, 3, "#2a6a2a").px(10, 3, "#2a6a2a");
      break;
    case "boar":
      g.disc(8, 8, 6, "#6a4a3a").rect(5, 10, 6, 4, "#c88a7a").px(6, 11, EYE).px(9, 11, EYE).px(5, 6, EYE).px(11, 6, EYE);
      g.line(4, 13, 3, 10, WH).line(12, 13, 13, 10, WH).rect(5, 1, 6, 3, "#4a3024");
      break;
    case "scorpion":
      g.rect(4, 8, 8, 5, "#a8642a").rect(5, 9, 6, 3, "#c8843a").line(4, 9, 1, 6, "#a8642a").line(11, 9, 14, 6, "#a8642a").rect(0, 4, 2, 2, "#c8843a").rect(14, 4, 2, 2, "#c8843a");
      g.line(8, 8, 8, 4, "#a8642a").line(8, 4, 11, 1, "#a8642a").px(12, 1, "#e83a3a").px(6, 10, EYE).px(9, 10, EYE);
      break;
    case "bat":
      g.disc(8, 8, 3, "#3a2a4a").line(1, 5, 5, 9, "#4a3a5a").line(15, 5, 11, 9, "#4a3a5a").rect(1, 6, 4, 3, "#4a3a5a").rect(11, 6, 4, 3, "#4a3a5a");
      g.px(6, 3, "#3a2a4a").px(10, 3, "#3a2a4a").px(7, 7, "#ff4a4a").px(9, 7, "#ff4a4a").px(7, 10, WH).px(9, 10, WH);
      break;
    case "elephant":
      g.disc(3, 8, 3, "#8a8a9a").disc(12, 8, 3, "#8a8a9a").disc(8, 7, 4, "#a0a0b0").rect(7, 9, 3, 6, "#a0a0b0").px(8, 15, "#8a8a9a");
      g.px(6, 6, EYE).px(10, 6, EYE).line(5, 10, 4, 12, WH).line(11, 10, 12, 12, WH);
      break;
    case "spider":
      g.disc(8, 9, 4, "#2a2430").disc(8, 5, 2, "#3a3440");
      for (const [x0, y0, x1, y1] of [[5, 8, 1, 4], [5, 10, 0, 10], [5, 12, 2, 15], [11, 8, 15, 4], [11, 10, 15, 10], [11, 12, 14, 15]]) g.line(x0!, y0!, x1!, y1!, "#4a4450");
      g.px(7, 4, "#ff4a4a").px(9, 4, "#ff4a4a").px(8, 10, "#e83a3a");
      break;
    case "phoenix":
      g.disc(8, 8, 4, "#ff7a2a").rect(6, 3, 4, 4, "#ffb040").line(4, 1, 6, 4, "#ffd040").line(8, 0, 8, 3, "#ffd040").line(12, 1, 10, 4, "#ffd040");
      g.line(1, 7, 4, 11, "#e84a1a").line(15, 7, 12, 11, "#e84a1a").px(7, 6, EYE).rect(9, 7, 2, 1, "#ffe08a").line(6, 12, 8, 15, "#ff4a1a").line(10, 12, 8, 15, "#ff4a1a");
      break;
  }
}

/** 오른쪽 아래 작은 표시 */
type Badge = "up" | "shield" | "spark" | "drop" | "heart" | "star" | "ring" | "fang" | "wind";
function badge(g: Pen, b: Badge): void {
  g.rect(10, 10, 6, 6, K);
  const c = { up: "#ffd040", shield: "#8ac8ff", spark: "#ffe04a", drop: "#7ae05a", heart: "#ff6a8a", star: "#fff4c0", ring: "#c08aff", fang: WH, wind: "#a8e8ff" }[b];
  if (b === "up") g.px(13, 11, c).rect(12, 12, 3, 1, c).rect(13, 13, 1, 2, c);
  else if (b === "shield") g.rect(11, 11, 4, 3, c).rect(12, 14, 2, 1, c);
  else if (b === "spark") g.line(14, 11, 12, 13, c).line(12, 13, 14, 13, c).line(14, 13, 12, 15, c);
  else if (b === "drop") g.px(13, 11, c).rect(12, 12, 3, 2, c).px(13, 14, c);
  else if (b === "heart") g.px(12, 12, c).px(14, 12, c).rect(11, 13, 5, 1, c).rect(12, 14, 3, 1, c).px(13, 15, c);
  else if (b === "star") g.px(13, 11, c).rect(11, 13, 5, 1, c).px(13, 12, c).px(13, 14, c).px(12, 15, c).px(14, 15, c);
  else if (b === "ring") g.ring(13, 13, 2, c);
  else if (b === "fang") g.line(11, 11, 12, 14, c).line(15, 11, 14, 14, c);
  else g.line(11, 12, 15, 12, c).line(11, 14, 14, 14, c);
}

const art = (a: AnimalKind, b: Badge) => (g: Pen) => {
  animalFace(g, a);
  badge(g, b);
};

export const MORPH_WEAPON_ART: Record<"wolfForm" | "bearForm" | "eagleForm" | "snakeForm" | "boarForm" | "scorpionForm" | "batForm" | "elephantForm" | "spiderForm" | "phoenixForm", (g: Pen) => void> = {
  wolfForm: (g) => animalFace(g, "wolf"),
  bearForm: (g) => animalFace(g, "bear"),
  eagleForm: (g) => animalFace(g, "eagle"),
  snakeForm: (g) => animalFace(g, "snake"),
  boarForm: (g) => animalFace(g, "boar"),
  scorpionForm: (g) => animalFace(g, "scorpion"),
  batForm: (g) => animalFace(g, "bat"),
  elephantForm: (g) => animalFace(g, "elephant"),
  spiderForm: (g) => animalFace(g, "spider"),
  phoenixForm: (g) => animalFace(g, "phoenix"),
};

export const MORPH_PASSIVE_ART = {
  wolfFang: art("wolf", "fang"),
  wolfPack: art("wolf", "star"),
  wolfHowl: art("wolf", "wind"),
  bearHide: art("bear", "shield"),
  bearRage: art("bear", "up"),
  bearQuake: art("bear", "ring"),
  eagleEye: art("eagle", "up"),
  eagleStorm: art("eagle", "wind"),
  eagleDive: art("eagle", "spark"),
  snakeVenom: art("snake", "drop"),
  snakeCoil: art("snake", "ring"),
  snakeSpit: art("snake", "wind"),
  boarTusk: art("boar", "fang"),
  boarStampede: art("boar", "wind"),
  boarMud: art("boar", "shield"),
  scorpTail: art("scorpion", "drop"),
  scorpPincer: art("scorpion", "fang"),
  scorpShell: art("scorpion", "shield"),
  batDrain: art("bat", "heart"),
  batEcho: art("bat", "ring"),
  batSwarm: art("bat", "star"),
  eleTrunk: art("elephant", "wind"),
  eleMammoth: art("elephant", "up"),
  eleHerd: art("elephant", "shield"),
  spiderNest: art("spider", "ring"),
  spiderFang: art("spider", "fang"),
  spiderBrood: art("spider", "star"),
  phoenixFlare: art("phoenix", "up"),
  phoenixSun: art("phoenix", "star"),
  phoenixRebirth: art("phoenix", "heart"),
};
