// 사막 소품 (장소 표의 장식 deco, worldDeco가 부름): 야자수 둘 · 선인장 · 마른 덤불 · 무너진 기둥 · 반쯤 묻힌 석상 · 짐승 뼈 · 천막
// 그림 파일(public/world/obj/{이름}.png)이 있으면 그 그림, 없으면 코드 그림 · (x, b) = 칸 가운데 x · 아래 끝 y
import { shadow } from "./worldArt";
import { drawObj, objOf } from "./worldTex";

export type DesertDeco = "palm" | "palm2" | "cactus" | "tumbleweed" | "column" | "stoneHead" | "ribcage" | "tent";
export const DESERT_DECOS: readonly DesertDeco[] = ["palm", "palm2", "cactus", "tumbleweed", "column", "stoneHead", "ribcage", "tent"];

/** 부딪힘 반지름 (픽셀) */
export const DESERT_DECO_R: Record<DesertDeco, number> = { palm: 4, palm2: 5, cactus: 4, tumbleweed: -99, column: 5, stoneHead: 11, ribcage: 10, tent: 11 };
/** 그림 파일 이름 */
const ART: Record<DesertDeco, string> = { palm: "palm", palm2: "palm2", cactus: "cactus", tumbleweed: "tumbleweed", column: "column", stoneHead: "stone_head", ribcage: "ribcage", tent: "tent" };

type Ctx = CanvasRenderingContext2D;
const box = (g: Ctx, c: string, x: number, y: number, w: number, h: number) => {
  g.fillStyle = c;
  g.fillRect(x, y, w, h);
};

export function drawDesertDeco(g: Ctx, art: DesertDeco, x: number, b: number, t: number): void {
  const r = Math.max(0, DESERT_DECO_R[art]);
  shadow(g, x, b, Math.max(4, r + 2), 2.5, 0.3);
  const img = objOf(ART[art]);
  if (img) {
    drawObj(g, img, x, b + 1);
    return;
  }
  switch (art) {
    case "palm":
    case "palm2": {
      // 굽은 줄기 · 위 잎 다섯 (바람에 살짝)
      const s = Math.round(Math.sin(t * 1.5 + x) * 1);
      for (let i = 0; i < 6; i++) box(g, "#8a6034", x - 1 + Math.round(i * 0.3), b - 5 - i * 5, 3, 5);
      for (const [dx, dy] of [[-8, 1], [8, 1], [-6, -3], [6, -3], [0, -4]] as const) box(g, "#3e8a3a", x + 1 + dx / 2 + s, b - 34 + dy, 8, 3);
      box(g, "#6a4a24", x, b - 32, 3, 3);
      break;
    }
    case "cactus":
      box(g, "#3e8a4a", x - 2, b - 20, 5, 20);
      box(g, "#3e8a4a", x - 7, b - 14, 3, 7);
      box(g, "#3e8a4a", x + 5, b - 17, 3, 8);
      box(g, "#6ab872", x - 1, b - 20, 1, 20);
      break;
    case "tumbleweed": {
      const k = (t * 0.5 + x * 0.01) % 1;
      g.strokeStyle = "#a8804a";
      g.beginPath();
      g.arc(x + Math.sin(k * 6.28) * 2, b - 4, 4, 0, Math.PI * 2);
      g.stroke();
      break;
    }
    case "column":
      box(g, "#c8a06a", x - 4, b - 22, 8, 22);
      box(g, "#e0bc84", x - 4, b - 22, 2, 22);
      box(g, "#a87c46", x - 5, b - 4, 10, 4);
      box(g, "#a87c46", x - 3, b - 24, 5, 2);
      break;
    case "stoneHead":
      box(g, "#b89a70", x - 10, b - 16, 20, 16);
      box(g, "#d0b488", x - 10, b - 16, 20, 3);
      box(g, "#5a4630", x - 6, b - 11, 3, 2);
      box(g, "#5a4630", x + 3, b - 11, 3, 2);
      box(g, "#8a6e4a", x - 2, b - 7, 4, 3);
      break;
    case "ribcage":
      for (let i = -8; i <= 8; i += 4) box(g, "#efe6d0", x + i, b - 12 + Math.abs(i) / 2, 2, 12 - Math.abs(i) / 2);
      box(g, "#efe6d0", x - 10, b - 2, 20, 2);
      break;
    case "tent":
      g.fillStyle = "#c8583a";
      g.beginPath();
      g.moveTo(x - 12, b);
      g.lineTo(x, b - 18);
      g.lineTo(x + 12, b);
      g.fill();
      box(g, "#3a2414", x - 3, b - 8, 6, 8);
      box(g, "#e8d8a8", x - 12, b - 1, 24, 1);
      break;
  }
}
