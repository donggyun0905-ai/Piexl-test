// 헬리오스 소품 (장소 표의 장식 deco, worldDeco가 부름): 황금 분수(물 솟음) · 붉은 깃발 기둥(펄럭임) · 검은 의식 제단(보랏빛 촛불)
// 광장 황제 석상 = 레이드 아레나 입구 (worldPlaceArt가 부름) · (x, b) = 칸 가운데 x · 아래 끝 y
import { shadow } from "./worldArt";
import { drawProp } from "./worldDecoArt";
import { windNow } from "./worldWeather";
import { objOf } from "./worldTex";

export type EmpireDeco = "fountainGold" | "banner" | "altar";

/** 부딪힘 반지름 (픽셀) */
export const EMPIRE_DECO_R: Record<EmpireDeco, number> = { fountainGold: 13, banner: 3, altar: 7 };

type Ctx = CanvasRenderingContext2D;
const box = (g: Ctx, c: string, x: number, y: number, w: number, h: number) => {
  g.fillStyle = c;
  g.fillRect(x, y, w, h);
};

export function drawEmpireDeco(g: Ctx, art: EmpireDeco, x: number, b: number, t: number): void {
  switch (art) {
    case "fountainGold": {
      // 둥근 금 테 연못 · 가운데 기둥 · 위로 솟아 떨어지는 물방울
      shadow(g, x, b, 15, 4, 0.3);
      g.fillStyle = "#c89a38";
      g.beginPath();
      g.ellipse(x, b - 5, 15, 6, 0, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#4a8ad8";
      g.beginPath();
      g.ellipse(x, b - 6, 12, 4, 0, 0, Math.PI * 2);
      g.fill();
      box(g, "#e8b830", x - 2, b - 20, 4, 14);
      box(g, "#fff0a0", x - 2, b - 20, 1, 14);
      box(g, "#d8a428", x - 5, b - 22, 10, 3);
      for (let i = 0; i < 6; i++) {
        const k = (t * 0.9 + i / 6) % 1;
        const dx = (i % 2 ? 1 : -1) * (2 + k * 9);
        box(g, `rgba(190,230,255,${0.9 - k * 0.6})`, x + dx, b - 24 + k * k * 18 - k * 6, 2, 2);
      }
      break;
    }
    case "banner":
      // 긴 붉은 깃발 (세로 줄마다 조금씩 출렁임, 바람 세기만큼)
      shadow(g, x, b, 3, 1.5, 0.3);
      box(g, "#3a2414", x - 1, b - 34, 2, 34);
      box(g, "#ffd84a", x - 2, b - 36, 4, 2);
      for (let i = 0; i < 7; i++) {
        const s = Math.round(Math.sin(t * 3 - i * 0.6) * (i / 6) * (0.6 + windNow()));
        box(g, i === 0 ? "#d84a3a" : "#a82a2a", x + 1 + i, b - 32 + s, 1, 18);
      }
      box(g, "#ffd84a", x + 3, b - 26, 2, 3);
      break;
    case "altar":
      // 검은 돌 제단 · 보랏빛 촛불 넷 (깜박임) · 은은한 보랏빛
      shadow(g, x, b, 8, 2.5, 0.35);
      box(g, "#1e1a24", x - 7, b - 9, 14, 9);
      box(g, "#3a3446", x - 8, b - 11, 16, 3);
      box(g, "#6a3a8a", x - 3, b - 7, 6, 1);
      for (const dx of [-7, -3, 2, 6]) {
        box(g, "#d8d0e0", x + dx, b - 15, 1, 4);
        const f = Math.sin(t * 9 + dx) > 0 ? 1 : 0;
        box(g, "#c86aff", x + dx, b - 17 - f, 1, 2);
      }
      g.fillStyle = `rgba(160,80,220,${0.12 + Math.sin(t * 2) * 0.05})`;
      g.beginPath();
      g.arc(x, b - 10, 14, 0, Math.PI * 2);
      g.fill();
      break;
  }
}

/** 광장 황제 석상 (레이드 아레나 입구): 받침 · 관 쓴 사람 돌상 · 위로 들어 올린 검 · 발밑 금빛 (x, y = 칸 가운데) */
export function drawStatue(g: Ctx, x: number, y: number, t: number): void {
  const b = y + 7;
  shadow(g, x, b, 12, 3.5, 0.35);
  const img = objOf("ruler_statue");
  if (img) {
    drawProp(g, "ruler_statue", img, x, b, t, 12);
    return;
  }
  box(g, "#a49cb2", x - 10, b - 8, 20, 8);
  box(g, "#c8c0d4", x - 10, b - 8, 20, 2);
  box(g, "#d8a428", x - 4, b - 5, 8, 2);
  // 몸 · 망토 · 머리 · 관
  box(g, "#9a94a8", x - 5, b - 26, 10, 18);
  box(g, "#86809a", x - 7, b - 24, 3, 16);
  box(g, "#b4aec4", x - 4, b - 26, 3, 18);
  box(g, "#a49cb2", x - 3, b - 33, 6, 7);
  box(g, "#e8b830", x - 4, b - 36, 8, 3);
  box(g, "#e8b830", x - 4, b - 38, 1, 2);
  box(g, "#e8b830", x - 1, b - 39, 2, 3);
  box(g, "#e8b830", x + 3, b - 38, 1, 2);
  // 들어 올린 검 (빛이 숨 쉬듯)
  box(g, "#9a94a8", x + 5, b - 30, 3, 3);
  box(g, "#c8c0d4", x + 6, b - 46, 2, 16);
  box(g, "#d8a428", x + 4, b - 31, 6, 2);
  g.fillStyle = `rgba(255,220,120,${0.25 + Math.sin(t * 2.2) * 0.12})`;
  g.beginPath();
  g.arc(x + 7, b - 44, 6, 0, Math.PI * 2);
  g.fill();
}
