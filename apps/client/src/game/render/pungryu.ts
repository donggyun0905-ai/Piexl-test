// 풍류사 그리기 (1): 천자문 글자탄 · 구절 마법 효과 (구절 글자 · 하늘·땅 기둥 · 물결 · 별자리 선 · 바람 · 거두기 · 서리 · 금빛 물줄기 · 명검 · 순간이동 · 분신 · 둔갑 · 피리)
// 몸 둘레(구름·네 칸·해달 구슬·비구름·분신·먹물)는 render/pungryuBody
import type { EffectState, ProjectileState } from "@pixel-rogue/shared";
import { glowEdge } from "./pwFxBits";
import type { Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
const INK = "#1a1628";
const GOLD = "#ffd860";
const JADE = "#3ad8b0";

/** 무기(구절)마다 네 글자 */
export const VERSE_HANJA: Record<string, string> = {
  puHeaven: "天地玄黃",
  puFlood: "宇宙洪荒",
  puSunMoon: "日月盈昃",
  puStars: "辰宿列張",
  puSeasons: "寒來暑往",
  puHarvest: "秋收冬藏",
  puRain: "雲騰致雨",
  puFrost: "露結爲霜",
  puGold: "金生麗水",
  puSword: "劍號巨闕",
};
/** 무기마다 글자 빛깔 */
export const VERSE_TINT: Record<string, string> = {
  puHeaven: "#ffd860",
  puFlood: "#6ac8ff",
  puSunMoon: "#ff9a6a",
  puStars: "#c8b0ff",
  puSeasons: "#a8e8ff",
  puHarvest: "#e8b84a",
  puRain: "#8ad0ff",
  puFrost: "#d8f4ff",
  puGold: "#ffe070",
  puSword: "#e8ecf4",
};

/** 한자 하나 (먹 테두리 + 빛깔) */
export function glyph(ctx: Ctx, ch: string, x: number, y: number, size: number, c: string): void {
  ctx.font = `bold ${size}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 2;
  ctx.strokeStyle = INK;
  ctx.strokeText(ch, x, y);
  ctx.fillStyle = c;
  ctx.fillText(ch, x, y);
}

function line(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, c: string, w: number): void {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  glowEdge(ctx, c, w);
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.stroke();
}

/** 글자탄 (spirit puLetter, tint = "무기 id:몇 번째 글자"): 먹물 꼬리 + 빛나는 한자 */
export function drawPungryuShot(ctx: Ctx, pr: ProjectileState, x: number, y: number): boolean {
  if (pr.spirit !== "puLetter") return false;
  const [id = "puHeaven", n = "0"] = (pr.tint ?? "").split(":");
  const ch = (VERSE_HANJA[id] ?? VERSE_HANJA.puHeaven!)[Number(n) % 4] ?? "天";
  const len = Math.hypot(pr.vx, pr.vy) || 1;
  ctx.globalAlpha = 0.5;
  line(ctx, x - (pr.vx / len) * 10, y - (pr.vy / len) * 10, x, y, INK, 3);
  ctx.globalAlpha = 1;
  glyph(ctx, ch, Math.round(x), Math.round(y), 9, VERSE_TINT[id] ?? GOLD);
  return true;
}

const PU_FX = new Set(["puVerse", "puPillar", "puWave", "puStarLine", "puWind", "puReap", "puFrost", "puGoldStream", "puSword", "puTeleport", "puClone", "puDisguise", "puFlute"]);

/** 구절 효과 (풍류사 효과 종류만) */
export function drawPungryuFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!PU_FX.has(fx.kind)) return false;
  const t = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const r = fx.size;
  const fade = 1 - t;
  ctx.globalAlpha = Math.max(0, fade);
  switch (fx.kind) {
    case "puVerse": {
      // 구절 완성: 네 글자가 머리 위로 떠올라 퍼짐
      const word = VERSE_HANJA[fx.tint ?? ""] ?? "天地玄黃";
      for (let i = 0; i < 4; i++) glyph(ctx, word[i] ?? "", x + (i - 1.5) * (8 + t * 6), y - 8 - t * 10, 9, VERSE_TINT[fx.tint ?? ""] ?? GOLD);
      break;
    }
    case "puPillar": {
      const earth = fx.tint === "earth";
      const c = earth ? "#e8b84a" : "#4a3a8a";
      const w = r * (0.6 + 0.4 * fade);
      ctx.fillStyle = c;
      ctx.fillRect(x - w / 2, earth ? y - 2 : y - 80, w, earth ? 2 + t * 40 : 80);
      ctx.strokeStyle = earth ? "#fff0a8" : "#a89aff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * 0.45, 0, 0, TAU);
      ctx.stroke();
      break;
    }
    case "puWave":
    case "puGoldStream":
    case "puSword": {
      const c = fx.kind === "puWave" ? "#4ab8ff" : fx.kind === "puGoldStream" ? GOLD : "#e8ecf4";
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      const k = Math.min(1, t * 2.5);
      line(ctx, x, y, x + (tx - x) * k, y + (ty - y) * k, c, fx.size * (fx.kind === "puSword" ? 0.6 : 1) * fade + 1);
      if (fx.kind === "puSword") glyph(ctx, "劍", x + (tx - x) * k, y + (ty - y) * k, 14, GOLD);
      break;
    }
    case "puStarLine":
      line(ctx, x, y, snap(fx.toX ?? fx.x), snap(fx.toY ?? fx.y), "#c8b0ff", 2);
      ctx.fillStyle = GOLD;
      ctx.fillRect(snap(fx.toX ?? fx.x) - 1, snap(fx.toY ?? fx.y) - 1, 3, 3);
      break;
    case "puWind": {
      const c = fx.tint === "hot" ? "#ff7a3a" : "#a8e8ff";
      const a = Math.atan2(fx.dirY, fx.dirX);
      ctx.strokeStyle = c;
      for (let i = 0; i < 3; i++) {
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, r * (0.4 + 0.25 * i + 0.3 * t), a - 0.9, a + 0.9);
        ctx.stroke();
      }
      break;
    }
    case "puReap":
      line(ctx, x - r, y - r * 0.4, x + r, y + r * 0.4, "#e8b84a", 3);
      glyph(ctx, "收", x, y - r, 11, GOLD);
      break;
    case "puFrost":
      ctx.strokeStyle = "#d8f4ff";
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * TAU;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
        ctx.stroke();
      }
      break;
    case "puTeleport":
      ctx.globalAlpha = fade * 0.7;
      line(ctx, x, y, snap(fx.toX ?? fx.x), snap(fx.toY ?? fx.y), JADE, 2);
      glyph(ctx, "縮", x, y - 8, 9, JADE);
      break;
    case "puClone":
    case "puDisguise":
      ctx.fillStyle = "#e8ecf4";
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * TAU + t;
        ctx.fillRect(x + Math.cos(a) * r * (0.5 + t), y + Math.sin(a) * r * (0.5 + t), 2, 2);
      }
      if (fx.kind === "puDisguise") glyph(ctx, "遁", x, y - 14, 11, JADE);
      break;
    case "puFlute":
      ctx.strokeStyle = JADE;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, r * t, 0, TAU);
      ctx.stroke();
      glyph(ctx, "♪", x + 8, y - 12 - t * 6, 9, "#ffffff");
      break;
  }
  ctx.globalAlpha = 1;
  return true;
}
