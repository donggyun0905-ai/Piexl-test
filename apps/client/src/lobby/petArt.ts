// 펫 그림 (로비를 돌아다니는 펫 · 펫 상점 · 게임 속 따라다니는 펫이 같이 씀)
import { ell, r } from "./lobbyItems";

type Ctx = CanvasRenderingContext2D;
export type PetKind = "cat" | "dog" | "slime" | "dragon" | "bunny" | "chick" | "phoenix" | "turtle";

const shadow = (ctx: Ctx, x: number, y: number, w: number) => ell(ctx, x, y, w, 1, "rgba(0,0,0,0.3)");
const eye = (ctx: Ctx, x: number, y: number) => r(ctx, x, y, 1, 1, "#1a1420");

/** 펫 하나 (x, y = 발, f = 바라보는 쪽 ±1, t = 초) */
export function drawPetArt(ctx: Ctx, kind: PetKind, x: number, y: number, f: number, t: number): void {
  const step = Math.floor(t * 8) % 2;
  switch (kind) {
    case "cat": {
      shadow(ctx, x, y, 4);
      ell(ctx, x, y - 3, 4, 2, "#f0a050");
      ell(ctx, x + f * 4, y - 6, 3, 3, "#f0a050");
      r(ctx, x + f * 4 - 3, y - 10, 1, 2, "#f0a050");
      r(ctx, x + f * 4 + 2, y - 10, 1, 2, "#f0a050");
      eye(ctx, x + f * 5, y - 7);
      r(ctx, x + f * 4, y - 5, 1, 1, "#ff8a9a");
      // 꼬리 살랑
      r(ctx, x - f * 5, y - 5 - step, 1, 3, "#f0a050");
      r(ctx, x - 2, y - 1, 1, 1 + step, "#f6e8d8");
      r(ctx, x + 2, y - 1, 1, 2 - step, "#f6e8d8");
      break;
    }
    case "dog": {
      shadow(ctx, x, y, 5);
      ell(ctx, x, y - 4, 5, 3, "#c8905a");
      ell(ctx, x + f * 5, y - 7, 3, 3, "#c8905a");
      r(ctx, x + f * 5 - (f > 0 ? 3 : -1), y - 8, 2, 4, "#8a5a32");
      eye(ctx, x + f * 6, y - 8);
      r(ctx, x + f * 8, y - 7, 1, 1, "#1a1420");
      r(ctx, x - f * 6, y - 7 + step, 2, 1, "#c8905a");
      r(ctx, x - 3, y - 1, 1, 1 + step, "#8a5a32");
      r(ctx, x + 3, y - 1, 1, 2 - step, "#8a5a32");
      break;
    }
    case "slime": {
      const sq = Math.abs(Math.sin(t * 5));
      shadow(ctx, x, y, 5);
      ell(ctx, x, y - 3 - sq * 3, 5 - sq, 3 + sq, "#5ad87a");
      r(ctx, x - 2, y - 5 - sq * 4, 2, 1, "#c8ffd0");
      eye(ctx, x - 2, y - 3 - sq * 3);
      eye(ctx, x + 2, y - 3 - sq * 3);
      break;
    }
    case "dragon": {
      const h = 10 + Math.sin(t * 3) * 2;
      shadow(ctx, x, y, 4);
      ell(ctx, x, y - h, 4, 3, "#a87aff");
      ell(ctx, x + f * 4, y - h - 3, 3, 2, "#a87aff");
      eye(ctx, x + f * 5, y - h - 4);
      // 날갯짓
      const w = step ? -3 : 0;
      r(ctx, x - 4, y - h - 4 + w, 3, 2, "#e0c8ff");
      r(ctx, x + 1, y - h - 4 + w, 3, 2, "#e0c8ff");
      r(ctx, x - f * 5, y - h + 1, 2, 1, "#a87aff");
      r(ctx, x + f * 4, y - h - 6, 1, 2, "#ffd040");
      break;
    }
    case "bunny": {
      const hop = Math.abs(Math.sin(t * 5)) * 4;
      shadow(ctx, x, y, 4);
      ell(ctx, x, y - 3 - hop, 4, 3, "#f8f6ff");
      ell(ctx, x + f * 3, y - 6 - hop, 3, 2, "#f8f6ff");
      r(ctx, x + f * 2, y - 12 - hop, 1, 4, "#f8f6ff");
      r(ctx, x + f * 4, y - 12 - hop, 1, 4, "#f8f6ff");
      r(ctx, x + f * 4, y - 11 - hop, 1, 2, "#ffb0c0");
      eye(ctx, x + f * 4, y - 7 - hop);
      r(ctx, x - f * 4, y - 4 - hop, 2, 2, "#ffffff");
      break;
    }
    case "chick": {
      shadow(ctx, x, y, 3);
      ell(ctx, x, y - 3, 3, 3, "#ffe050");
      r(ctx, x + f * 3, y - 4, 1, 1, "#ff8a1a");
      eye(ctx, x + f * 1, y - 5);
      r(ctx, x - 1, y, 1, 1, "#ff8a1a");
      r(ctx, x + 1, y - step, 1, 1, "#ff8a1a");
      break;
    }
    case "phoenix": {
      const h = 12 + Math.sin(t * 3) * 2;
      shadow(ctx, x, y, 4);
      ell(ctx, x, y - h, 4, 3, "#ff7a2a");
      ell(ctx, x + f * 4, y - h - 3, 2, 2, "#ffb040");
      eye(ctx, x + f * 5, y - h - 4);
      r(ctx, x + f * 7, y - h - 3, 1, 1, "#ffd040");
      // 불꽃 날개 · 꼬리
      const w = step ? -3 : 0;
      r(ctx, x - 5, y - h - 4 + w, 4, 2, "#ffd040");
      r(ctx, x + 1, y - h - 4 + w, 4, 2, "#ffd040");
      r(ctx, x - f * 6, y - h + 1, 3, 1, "#ff4a1a");
      r(ctx, x - f * 7, y - h + 2 + step, 2, 1, "#ffb040");
      r(ctx, x + f * 4, y - h - 6, 1, 2, "#fff0a0");
      break;
    }
    case "turtle": {
      shadow(ctx, x, y, 5);
      ell(ctx, x, y - 4, 5, 3, "#d8a020");
      ell(ctx, x, y - 5, 3, 2, "#ffd040");
      r(ctx, x - 1, y - 6, 2, 1, "#fff0a0");
      ell(ctx, x + f * 6, y - 3, 2, 2, "#8ac85a");
      eye(ctx, x + f * 7, y - 4);
      r(ctx, x - 4, y - 1, 2, 1 + step, "#8ac85a");
      r(ctx, x + 3, y - 1, 2, 2 - step, "#8ac85a");
      break;
    }
  }
}

