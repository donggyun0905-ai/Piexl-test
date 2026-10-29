// 타워 디펜스 맵 꾸밈 그림: 테마마다 나무·선인장·눈 덮인 소나무·갈대·용암 웅덩이·수정·기둥, 그리고 테두리(울타리)
import type { TdTheme } from "@pixel-rogue/shared";
import type { Theme } from "./tdArt";

type Ctx = CanvasRenderingContext2D;

function rect(ctx: Ctx, color: string, x: number, y: number, w: number, h: number): void {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function shadow(ctx: Ctx, x: number, y: number, w: number): void {
  rect(ctx, "rgba(0,0,0,0.22)", x + 8 - w / 2, y + 13, w, 2);
}

function tree(ctx: Ctx, x: number, y: number, dark: string, mid: string, light: string): void {
  shadow(ctx, x, y, 12);
  rect(ctx, "#5a3a22", x + 7, y + 9, 2, 5);
  rect(ctx, dark, x + 3, y + 3, 10, 8);
  rect(ctx, dark, x + 5, y + 1, 6, 11);
  rect(ctx, mid, x + 4, y + 3, 7, 6);
  rect(ctx, mid, x + 6, y + 2, 4, 8);
  rect(ctx, light, x + 5, y + 3, 3, 2);
}

function rock(ctx: Ctx, x: number, y: number, base: string, light: string): void {
  shadow(ctx, x, y, 10);
  rect(ctx, base, x + 4, y + 7, 9, 6);
  rect(ctx, base, x + 5, y + 6, 6, 1);
  rect(ctx, light, x + 5, y + 7, 4, 2);
}

/** 꾸밈 칸 하나 (h: 칸마다 정해진 0~1 값으로 모양 고르기) */
export function drawDecor(ctx: Ctx, theme: TdTheme, x: number, y: number, h: number): void {
  switch (theme) {
    case "meadow":
      if (h < 0.7) tree(ctx, x, y, "#2e5e26", "#3f7a32", "#6aa84a");
      else {
        rock(ctx, x, y, "#7a7a72", "#a8a89c");
        rect(ctx, "#f0e060", x + 2, y + 3, 1, 1);
        rect(ctx, "#f080b0", x + 12, y + 4, 1, 1);
      }
      return;
    case "desert":
      if (h < 0.55) {
        // 선인장
        shadow(ctx, x, y, 8);
        rect(ctx, "#3f7a3a", x + 7, y + 2, 3, 12);
        rect(ctx, "#3f7a3a", x + 4, y + 5, 2, 4);
        rect(ctx, "#3f7a3a", x + 4, y + 8, 3, 1);
        rect(ctx, "#3f7a3a", x + 11, y + 4, 2, 4);
        rect(ctx, "#3f7a3a", x + 10, y + 7, 2, 1);
        rect(ctx, "#5aa04e", x + 8, y + 3, 1, 10);
        if (h < 0.2) rect(ctx, "#f05a8a", x + 8, y + 1, 1, 1);
      } else rock(ctx, x, y, "#a0703e", "#c8925a");
      return;
    case "frost":
      if (h < 0.7) {
        // 눈 덮인 소나무
        shadow(ctx, x, y, 10);
        rect(ctx, "#4a3426", x + 7, y + 11, 2, 3);
        rect(ctx, "#2a5a4a", x + 3, y + 8, 10, 3);
        rect(ctx, "#2a5a4a", x + 4, y + 5, 8, 3);
        rect(ctx, "#2a5a4a", x + 6, y + 2, 4, 3);
        rect(ctx, "#f4f8fc", x + 3, y + 8, 10, 1);
        rect(ctx, "#f4f8fc", x + 4, y + 5, 8, 1);
        rect(ctx, "#f4f8fc", x + 6, y + 2, 4, 1);
      } else {
        // 얼음 덩어리
        shadow(ctx, x, y, 10);
        rect(ctx, "#8ac0e6", x + 4, y + 6, 8, 7);
        rect(ctx, "#cdeaff", x + 5, y + 7, 3, 3);
      }
      return;
    case "swamp":
      if (h < 0.5) {
        // 고인 물 + 연잎
        rect(ctx, "#1e3a3a", x + 2, y + 4, 12, 9);
        rect(ctx, "#2a5050", x + 3, y + 5, 10, 7);
        rect(ctx, "#4a8a3a", x + 5, y + 7, 4, 3);
        rect(ctx, "#e8a0c8", x + 6, y + 7, 1, 1);
      } else {
        // 갈대
        for (const [dx, hh] of [[4, 9], [7, 12], [10, 8], [12, 10]] as const) {
          rect(ctx, "#6a8a3a", x + dx, y + 14 - hh, 1, hh);
          rect(ctx, "#7a5030", x + dx, y + 13 - hh, 1, 3);
        }
      }
      return;
    case "volcano":
      if (h < 0.45) {
        // 용암 웅덩이
        rect(ctx, "#1a0a08", x + 2, y + 4, 12, 9);
        rect(ctx, "#ff5a1a", x + 3, y + 5, 10, 7);
        rect(ctx, "#ffb040", x + 5, y + 7, 5, 3);
        rect(ctx, "#fff0a0", x + 7, y + 8, 1, 1);
      } else {
        rock(ctx, x, y, "#2a1c1a", "#4a302a");
        rect(ctx, "#ff7a2a", x + 7, y + 9, 1, 3);
      }
      return;
    case "crystal": {
      // 수정 묶음
      const glow = h < 0.5 ? ["#3ac8d8", "#a8f4ff"] : ["#a05ae0", "#e0c0ff"];
      shadow(ctx, x, y, 10);
      rect(ctx, glow[0]!, x + 7, y + 2, 3, 11);
      rect(ctx, glow[0]!, x + 4, y + 6, 2, 7);
      rect(ctx, glow[0]!, x + 11, y + 7, 2, 6);
      rect(ctx, glow[1]!, x + 8, y + 3, 1, 8);
      rect(ctx, glow[1]!, x + 4, y + 7, 1, 4);
      return;
    }
    case "sky":
      if (h < 0.6) {
        // 대리석 기둥
        shadow(ctx, x, y, 8);
        rect(ctx, "#a8a0c0", x + 4, y + 1, 8, 2);
        rect(ctx, "#f8f6fc", x + 5, y + 3, 6, 9);
        rect(ctx, "#cfc8e0", x + 9, y + 3, 2, 9);
        rect(ctx, "#a8a0c0", x + 4, y + 12, 8, 2);
      } else {
        // 금빛 화분
        shadow(ctx, x, y, 8);
        rect(ctx, "#d8a840", x + 5, y + 9, 6, 4);
        rect(ctx, "#5aa04e", x + 6, y + 4, 4, 5);
        rect(ctx, "#ff9ac0", x + 7, y + 4, 2, 2);
      }
      return;
    case "abyss":
      if (h < 0.5) {
        // 작은 균열 (붉게 빛나는 틈)
        rect(ctx, "#05020a", x + 3, y + 5, 10, 6);
        rect(ctx, "#ff3a6a", x + 5, y + 7, 6, 1);
        rect(ctx, "#ff8aa8", x + 7, y + 7, 2, 1);
        rect(ctx, "#a01a40", x + 4, y + 8, 2, 1);
      } else {
        // 검은 뾰족 바위 + 보랏빛 눈
        rock(ctx, x, y, "#1e1424", "#3a2a44");
        rect(ctx, "#c060ff", x + 6, y + 8, 1, 1);
        rect(ctx, "#c060ff", x + 9, y + 8, 1, 1);
      }
  }
}

/** 테두리 칸 (울타리·절벽·눈더미·물·바위·동굴 벽·구름) */
export function drawEdge(ctx: Ctx, theme: TdTheme, th: Theme, x: number, y: number, h: number): void {
  rect(ctx, th.edge, x, y, 16, 16);
  switch (theme) {
    case "meadow":
      // 덤불
      rect(ctx, th.edgeTop, x + 1, y + 2, 7, 6);
      rect(ctx, th.edgeTop, x + 8, y + 6, 7, 7);
      rect(ctx, "#5a8e44", x + 3, y + 3, 2, 2);
      rect(ctx, "#5a8e44", x + 10, y + 7, 2, 2);
      if (h < 0.25) rect(ctx, "#e85050", x + 12, y + 3, 1, 1);
      return;
    case "desert":
      // 절벽 줄무늬
      rect(ctx, th.edgeTop, x, y + 2 + Math.floor(h * 4), 16, 2);
      rect(ctx, "#7a4c2a", x, y + 10 + Math.floor(h * 3), 16, 1);
      return;
    case "frost":
      // 눈더미
      rect(ctx, th.edgeTop, x, y, 16, 9);
      rect(ctx, "#c4d8ea", x, y + 9, 16, 2);
      rect(ctx, "#ffffff", x + 2 + Math.floor(h * 8), y + 2, 4, 2);
      return;
    case "swamp":
      // 검은 물결
      rect(ctx, th.edgeTop, x + Math.floor(h * 8), y + 5, 6, 1);
      rect(ctx, th.edgeTop, x + 2 + Math.floor(h * 5), y + 11, 7, 1);
      return;
    case "volcano":
      // 갈라진 바위 사이 용암
      rect(ctx, th.edgeTop, x + 1, y + 1, 14, 6);
      rect(ctx, "#ff5a1a", x + Math.floor(h * 12), y + 9, 3, 1);
      rect(ctx, "#ff5a1a", x + 4, y + 12, 1, 3);
      return;
    case "crystal":
      // 동굴 벽과 작은 수정
      rect(ctx, th.edgeTop, x, y + 10, 16, 6);
      if (h < 0.4) {
        rect(ctx, "#6a5ab8", x + 6, y + 5, 2, 6);
        rect(ctx, "#b8a8ff", x + 6, y + 5, 1, 3);
      }
      return;
    case "sky":
      // 구름 가장자리
      rect(ctx, th.edgeTop, x + Math.floor(h * 6), y + 4, 10, 6);
      rect(ctx, th.edgeTop, x + 2, y + 7, 12, 5);
      rect(ctx, "#d8ecfa", x + 2, y + 11, 12, 1);
      return;
    case "abyss":
      // 끝없는 어둠 가장자리 + 붉은 틈
      rect(ctx, th.edgeTop, x, y + 2, 16, 10);
      rect(ctx, "#ff3a6a", x + Math.floor(h * 12), y + 7, 3, 1);
  }
}
