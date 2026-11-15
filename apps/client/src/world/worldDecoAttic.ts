// 기록의 다락방 물건 (places/attic, worldDeco가 부름): 거울(캐릭터 고르기) · 장비 상자 · 기록서 책상(펜·잉크) · 오락실 문(네온) — 코드 그림
// (x, b) = 칸 가운데 x · 아래 끝 y · 거울·기록서·오락실 문은 은은히 빛남
import { shadow } from "./worldArt";

export type AtticDeco = "mirror" | "chest" | "desk" | "arcadeDoor";
/** 부딪힘 반지름 (픽셀) */
export const ATTIC_DECO_R: Record<AtticDeco, number> = { mirror: 6, chest: 7, desk: 9, arcadeDoor: 7 };

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

function mirror(g: Ctx, x: number, b: number, t: number): void {
  // 서 있는 큰 거울: 나무 틀 · 위가 둥근 유리 · 지나가는 빛줄기
  shadow(g, x, b, 8, 2, 0.35);
  box(g, "#4a2c18", x - 7, b - 3, 14, 3);
  box(g, "#6a4024", x - 6, b - 26, 12, 24);
  box(g, "#6a4024", x - 4, b - 28, 8, 2);
  box(g, "#9ac8e8", x - 5, b - 25, 10, 21);
  box(g, "#bfe0f4", x - 3, b - 27, 6, 2);
  box(g, "#7aa8cc", x - 5, b - 8, 10, 4);
  const s = Math.floor(((t * 0.6) % 1) * 18);
  box(g, "rgba(255,255,255,0.55)", x - 5 + Math.floor(s / 2), b - 24 + s, 2, 3);
  glow(g, x, b - 15, 14, `rgba(150,200,255,${0.12 + Math.sin(t * 2) * 0.05})`);
}

function chest(g: Ctx, x: number, b: number): void {
  // 장비 상자: 나무 · 금빛 띠·자물쇠
  shadow(g, x, b, 9, 2.2, 0.35);
  box(g, "#5a3418", x - 8, b - 11, 16, 11);
  box(g, "#7a4a24", x - 8, b - 14, 16, 4);
  box(g, "#8a5a2c", x - 7, b - 15, 14, 2);
  box(g, "#d8a838", x - 8, b - 10, 16, 1);
  box(g, "#d8a838", x - 5, b - 15, 2, 15);
  box(g, "#d8a838", x + 3, b - 15, 2, 15);
  box(g, "#ffe08a", x - 1, b - 9, 2, 3);
}

function desk(g: Ctx, x: number, b: number, t: number): void {
  // 책상 위 펼친 기록서 · 잉크병 · 깃펜 (책에서 옅은 보랏빛)
  shadow(g, x, b, 11, 2.4, 0.35);
  box(g, "#4a2c18", x - 10, b - 6, 2, 6);
  box(g, "#4a2c18", x + 8, b - 6, 2, 6);
  box(g, "#7a4a24", x - 11, b - 10, 22, 4);
  box(g, "#5a3418", x - 11, b - 7, 22, 1);
  box(g, "#f2e6c8", x - 7, b - 13, 6, 3);
  box(g, "#e6d6b0", x - 1, b - 13, 6, 3);
  box(g, "#8a6a4a", x - 1, b - 13, 1, 3);
  box(g, "#6a5a8a", x - 6, b - 12, 4, 1);
  box(g, "#6a5a8a", x, b - 12, 3, 1);
  box(g, "#202030", x + 7, b - 13, 3, 3);
  box(g, "#f6f0e0", x + 8, b - 19, 1, 6);
  box(g, "#f6f0e0", x + 9, b - 18, 1, 3);
  glow(g, x - 1, b - 13, 10, `rgba(184,154,255,${0.2 + Math.sin(t * 1.6) * 0.08})`);
}

function arcadeDoor(g: Ctx, x: number, b: number, t: number): void {
  // 벽에 붙은 오락실 문: 어두운 문짝 · 분홍·하늘 네온 테두리가 깜박임
  const on = Math.sin(t * 3) > -0.7;
  box(g, "#2a2236", x - 7, b - 24, 14, 24);
  box(g, "#3a3048", x - 6, b - 23, 12, 23);
  box(g, "#ffd84a", x + 3, b - 12, 2, 2);
  box(g, on ? "#ff6ad0" : "#7a3a6a", x - 8, b - 25, 16, 1);
  box(g, on ? "#ff6ad0" : "#7a3a6a", x - 8, b - 25, 1, 25);
  box(g, on ? "#6ad8ff" : "#2a5a7a", x + 7, b - 25, 1, 25);
  box(g, on ? "#ffe9a8" : "#6a5a3a", x - 3, b - 21, 6, 3);
  if (on) glow(g, x, b - 14, 16, "rgba(255,106,208,0.16)");
}

export function drawAtticDeco(g: Ctx, art: AtticDeco, x: number, b: number, t: number): void {
  if (art === "mirror") mirror(g, x, b, t);
  else if (art === "chest") chest(g, x, b);
  else if (art === "desk") desk(g, x, b, t);
  else arcadeDoor(g, x, b, t);
}
