// 로비 펫: 고양이 · 강아지 · 슬라임 · 아기 용 · 토끼 · 병아리. 시간 t만으로 움직임, 가끔 하트·음표
import { ell, r } from "./lobbyItems";

type Ctx = CanvasRenderingContext2D;
type PetKind = "cat" | "dog" | "slime" | "dragon" | "bunny" | "chick";

interface Pet {
  kind: PetKind;
  /** 오가는 두 자리 */
  a: readonly [number, number];
  b: readonly [number, number];
  speed: number;
  off: number;
}

const PETS: readonly Pet[] = [
  { kind: "cat", a: [60, 182], b: [120, 186], speed: 0.4, off: 0 },
  { kind: "dog", a: [140, 190], b: [200, 196], speed: 0.7, off: 1 },
  { kind: "slime", a: [40, 140], b: [52, 172], speed: 0.3, off: 2 },
  { kind: "dragon", a: [130, 82], b: [210, 92], speed: 0.5, off: 0.5 },
  { kind: "bunny", a: [230, 150], b: [250, 196], speed: 0.45, off: 3 },
  { kind: "chick", a: [100, 120], b: [128, 128], speed: 0.6, off: 4 },
];

function at(p: Pet, t: number) {
  const tt = t * p.speed + p.off;
  const k = (Math.sin(tt) + 1) / 2;
  const face = Math.cos(tt) >= 0 ? (p.b[0] >= p.a[0] ? 1 : -1) : p.b[0] >= p.a[0] ? -1 : 1;
  return { x: p.a[0] + (p.b[0] - p.a[0]) * k, y: p.a[1] + (p.b[1] - p.a[1]) * k, face, tt };
}

const shadow = (ctx: Ctx, x: number, y: number, w: number) => ell(ctx, x, y, w, 1, "rgba(0,0,0,0.3)");
const eye = (ctx: Ctx, x: number, y: number) => r(ctx, x, y, 1, 1, "#1a1420");

function draw(ctx: Ctx, kind: PetKind, x: number, y: number, f: number, t: number): void {
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
  }
}

/** 하트·음표가 가끔 떠오름 */
function emote(ctx: Ctx, x: number, y: number, tt: number, kind: PetKind): void {
  const c = tt % 6;
  if (c > 1.4) return;
  const up = c * 6;
  const col = kind === "dragon" ? "#ffd040" : "#ff6a9a";
  r(ctx, x - 2, y - 14 - up, 2, 2, col);
  r(ctx, x + 1, y - 14 - up, 2, 2, col);
  r(ctx, x - 2, y - 12 - up, 5, 1, col);
  r(ctx, x - 1, y - 11 - up, 3, 1, col);
  r(ctx, x, y - 10 - up, 1, 1, col);
}

export function petDrawers(ctx: Ctx, t: number): { y: number; draw: () => void }[] {
  return PETS.map((p) => {
    const { x, y, face, tt } = at(p, t);
    return {
      y,
      draw: () => {
        draw(ctx, p.kind, Math.round(x), Math.round(y), face, t + p.off);
        emote(ctx, Math.round(x), Math.round(y), tt, p.kind);
      },
    };
  });
}
