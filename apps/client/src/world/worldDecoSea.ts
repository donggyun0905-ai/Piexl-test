// 탈라시아 소품 (장소 표의 장식 deco, worldDeco가 부름): 큰 범선 · 작은 배 · 해적선(물 위에서 흔들림) · 크레인 · 화물 더미 · 등대(빛 돎) · 밧줄 말뚝 · 그물 · 닻 · 생선 노점
// 그림 파일(public/world/obj/{이름}.png)이 있으면 그 그림, 없으면 코드 그림 · (x, b) = 칸 가운데 x · 아래 끝 y
import { shadow } from "./worldArt";
import { drawObj, objOf } from "./worldTex";

export type SeaDeco = "ship" | "boat" | "pirateShip" | "crane" | "cargo" | "lighthouse" | "mooring" | "net" | "anchor" | "fishStall";
/** 배는 물 위 (부딪힘 없음, 물이 막음) */
const FLOAT: readonly SeaDeco[] = ["ship", "boat", "pirateShip"];

/** 부딪힘 반지름 (픽셀) */
export const SEA_DECO_R: Record<SeaDeco, number> = { ship: -99, boat: -99, pirateShip: -99, crane: 8, cargo: 9, lighthouse: 8, mooring: 3, net: 6, anchor: 6, fishStall: 10 };
const ART: Record<SeaDeco, string> = { ship: "ship_big", boat: "boat", pirateShip: "pirate_ship", crane: "crane", cargo: "cargo", lighthouse: "lighthouse", mooring: "mooring", net: "fish_net", anchor: "anchor", fishStall: "fish_stall" };

type Ctx = CanvasRenderingContext2D;
const box = (g: Ctx, c: string, x: number, y: number, w: number, h: number) => {
  g.fillStyle = c;
  g.fillRect(x, y, w, h);
};

export function drawSeaDeco(g: Ctx, art: SeaDeco, x: number, b0: number, t: number): void {
  const float = FLOAT.includes(art);
  const b = float ? b0 + Math.round(Math.sin(t * 1.6 + x * 0.1) * 1.5) : b0;
  if (!float) shadow(g, x, b, Math.max(4, SEA_DECO_R[art] + 2), 2.5, 0.3);
  const img = objOf(ART[art]);
  if (img) drawObj(g, img, x, b + 1);
  else {
    switch (art) {
      case "ship":
      case "pirateShip": {
        const dark = art === "pirateShip";
        box(g, dark ? "#2a2228" : "#7a5230", x - 22, b - 10, 44, 10);
        box(g, dark ? "#3e343a" : "#9a6a3e", x - 22, b - 12, 44, 3);
        for (const dx of [-10, 2, 12]) {
          box(g, "#4a3420", x + dx, b - 44, 2, 34);
          box(g, dark ? "#1a1a20" : "#f0e8d8", x + dx - 8, b - 40, 16, 14);
        }
        break;
      }
      case "boat":
        box(g, "#8a5a34", x - 9, b - 6, 18, 6);
        box(g, "#b07c48", x - 9, b - 7, 18, 2);
        break;
      case "crane":
        box(g, "#6a4a2a", x - 2, b - 40, 4, 40);
        box(g, "#6a4a2a", x - 2, b - 40, 24, 3);
        box(g, "#3a3a40", x + 18, b - 37, 1, 16 + Math.round(Math.sin(t) * 3));
        break;
      case "cargo":
        box(g, "#8a5a34", x - 9, b - 10, 9, 10);
        box(g, "#a87040", x, b - 14, 9, 14);
        box(g, "#6a4a2a", x - 5, b - 18, 8, 8);
        break;
      case "lighthouse":
        for (let i = 0; i < 6; i++) box(g, i & 1 ? "#c83a3a" : "#f0f0f0", x - 6 + Math.floor(i / 2), b - 8 - i * 8, 12 - Math.floor(i / 2) * 2, 8);
        box(g, "#ffe080", x - 4, b - 56, 8, 6);
        box(g, "#3a3a44", x - 5, b - 60, 10, 4);
        break;
      case "mooring":
        box(g, "#5a4028", x - 2, b - 8, 4, 8);
        box(g, "#d8c090", x - 3, b - 6, 6, 2);
        break;
      case "net":
        box(g, "#6a4a2a", x - 8, b - 14, 2, 14);
        box(g, "#6a4a2a", x + 6, b - 14, 2, 14);
        for (let i = 0; i < 4; i++) box(g, "#a8a890", x - 6, b - 13 + i * 3, 12, 1);
        break;
      case "anchor":
        box(g, "#4a4e58", x - 1, b - 16, 3, 14);
        box(g, "#4a4e58", x - 7, b - 4, 15, 3);
        box(g, "#4a4e58", x - 4, b - 16, 9, 2);
        break;
      case "fishStall":
        box(g, "#7a5230", x - 10, b - 8, 20, 8);
        for (let i = 0; i < 5; i++) box(g, i & 1 ? "#f0f0f0" : "#3a7ac8", x - 11 + i * 4.4, b - 20, 5, 5);
        box(g, "#a8c8d8", x - 8, b - 10, 16, 2);
        break;
    }
  }
  // 등대 불빛: 위에서 천천히 도는 빛줄기
  if (art === "lighthouse") {
    const a = t * 1.2;
    g.fillStyle = "rgba(255,240,170,0.18)";
    g.beginPath();
    g.moveTo(x, b - 54);
    g.arc(x, b - 54, 70, a, a + 0.35);
    g.fill();
  }
}
