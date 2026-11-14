// 실베르 소품 (장소 표의 장식 deco, worldDeco가 부름): 망루 · 바리케이드 · 투석기 · 화로(불빛) · 마물 뼈 · 부러진 창 무더기 · 얼음 결정 · 막사 · 악마의 문(붉은 소용돌이)
// 그림 파일(public/world/obj/{이름}.png)이 있으면 그 그림, 없으면 코드 그림 · 악마의 문은 코드 그림만 · (x, b) = 칸 가운데 x · 아래 끝 y
import { shadow } from "./worldArt";
import { drawProp } from "./worldDecoArt";
import { objOf } from "./worldTex";

export type NorthDeco = "watchtower" | "barricade" | "catapult" | "brazier" | "skull" | "spears" | "iceCrystal" | "armyTent" | "demonGate";
export const NORTH_DECOS: readonly NorthDeco[] = ["watchtower", "barricade", "catapult", "brazier", "skull", "spears", "iceCrystal", "armyTent", "demonGate"];

/** 부딪힘 반지름 (픽셀) */
export const NORTH_DECO_R: Record<NorthDeco, number> = { watchtower: 9, barricade: 8, catapult: 9, brazier: 4, skull: 10, spears: 6, iceCrystal: 6, armyTent: 11, demonGate: 22 };
const ART: Partial<Record<NorthDeco, string>> = { watchtower: "watchtower", barricade: "barricade", catapult: "catapult", brazier: "brazier", skull: "monster_skull", spears: "spear_pile", iceCrystal: "ice_crystal", armyTent: "army_tent" };

type Ctx = CanvasRenderingContext2D;
const box = (g: Ctx, c: string, x: number, y: number, w: number, h: number) => {
  g.fillStyle = c;
  g.fillRect(x, y, w, h);
};
const glow = (g: Ctx, x: number, y: number, r: number, c: string) => {
  const gr = g.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, c);
  gr.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = gr;
  g.fillRect(x - r, y - r, r * 2, r * 2);
};

function demonGate(g: Ctx, x: number, b: number, t: number): void {
  // 검은 돌 아치 · 뿔 장식 · 안쪽 붉은 소용돌이 (숨 쉬듯)
  shadow(g, x, b, 26, 5, 0.4);
  box(g, "#22202a", x - 24, b - 44, 12, 44);
  box(g, "#22202a", x + 12, b - 44, 12, 44);
  box(g, "#2e2a38", x - 24, b - 52, 48, 10);
  box(g, "#3e3a4a", x - 24, b - 52, 48, 2);
  for (const s of [-1, 1]) {
    box(g, "#d8d0c0", x + s * 22 - 2, b - 62, 4, 10);
    box(g, "#d8d0c0", x + s * 25 - 1, b - 66, 3, 5);
  }
  const k = 0.5 + Math.sin(t * 2) * 0.2;
  box(g, "#140810", x - 12, b - 42, 24, 42);
  for (let i = 0; i < 4; i++) {
    g.strokeStyle = `rgba(230,40,50,${k - i * 0.1})`;
    g.beginPath();
    g.arc(x, b - 20, 4 + i * 4, t * 2 + i, t * 2 + i + 4);
    g.stroke();
  }
  glow(g, x, b - 20, 30, `rgba(220,30,40,${0.25 * k})`);
}

export function drawNorthDeco(g: Ctx, art: NorthDeco, x: number, b: number, t: number): void {
  if (art === "demonGate") return demonGate(g, x, b, t);
  shadow(g, x, b, Math.max(4, NORTH_DECO_R[art] + 2), 2.5, 0.3);
  const img = objOf(ART[art]!);
  if (img) drawProp(g, ART[art]!, img, x, b, t, NORTH_DECO_R[art]);
  else {
    switch (art) {
      case "watchtower":
        box(g, "#6a4a2a", x - 8, b - 30, 2, 30);
        box(g, "#6a4a2a", x + 6, b - 30, 2, 30);
        box(g, "#8a6034", x - 10, b - 36, 20, 8);
        box(g, "#eef4fc", x - 10, b - 37, 20, 2);
        break;
      case "barricade":
        for (let i = -8; i <= 8; i += 4) box(g, "#7a5230", x + i, b - 10 - (i & 4), 2, 10 + (i & 4));
        box(g, "#5a3a20", x - 9, b - 6, 18, 2);
        break;
      case "catapult":
        box(g, "#6a4a2a", x - 9, b - 5, 18, 5);
        box(g, "#8a6034", x - 2, b - 20, 3, 16);
        box(g, "#5a5a64", x - 5, b - 23, 6, 4);
        break;
      case "brazier":
        box(g, "#3a3a44", x - 4, b - 9, 8, 9);
        box(g, "#5a5a64", x - 5, b - 10, 10, 2);
        break;
      case "skull":
        box(g, "#e8e0d0", x - 9, b - 12, 18, 10);
        box(g, "#3a3440", x - 5, b - 9, 3, 3);
        box(g, "#3a3440", x + 2, b - 9, 3, 3);
        break;
      case "spears":
        for (let i = -4; i <= 4; i += 2) box(g, "#7a5a3a", x + i, b - 16 + Math.abs(i), 1, 16 - Math.abs(i));
        box(g, "#8a8a96", x - 6, b - 4, 12, 3);
        break;
      case "iceCrystal":
        box(g, "#a8e0f8", x - 3, b - 18, 6, 18);
        box(g, "#e0f6ff", x - 2, b - 18, 2, 18);
        box(g, "#a8e0f8", x + 3, b - 10, 4, 10);
        break;
      case "armyTent":
        g.fillStyle = "#7a6a58";
        g.beginPath();
        g.moveTo(x - 12, b);
        g.lineTo(x, b - 18);
        g.lineTo(x + 12, b);
        g.fill();
        box(g, "#2a2018", x - 3, b - 8, 6, 8);
        box(g, "#eef4fc", x - 6, b - 13, 12, 2);
        break;
    }
  }
  if (art === "brazier") glow(g, x, b - 12, 18 + Math.sin(t * 9) * 2, "rgba(255,150,60,0.35)");
}
