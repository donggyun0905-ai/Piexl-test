// 풍류사 그리기 (2): 구절 마법 효과 — 먹 붓질 + 빛 (참고 그림 art/참고/이펙트의 빛기둥·초승달 베기·별 터짐 느낌을 먹·붓으로 새로 그림)
// 구절 완성(네 글자 + 바닥 문양) · 하늘 기둥(검보라 빛 내리꽂기)·땅 기둥(금빛 솟음 + 갈라짐) · 큰 물결 · 별자리 선 · 찬바람·뜨거운 바람
// 거두기(금빛 초승달) · 서리 결정 · 금빛 물줄기 · 명검 거궐 검기 · 축지 붓질 · 먹 터짐(분신·둔갑) · 피리 가락
import type { EffectState } from "@pixel-rogue/shared";
import { brush, glyph, INK, VERSE_HANJA, VERSE_TINT } from "./pungryu";
import { additive, alpha, beam, crescent, easeOut, glow, rnd, rune, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";

const TAU = Math.PI * 2;
const GOLD = "#ffd860";
const JADE = "#3ad8b0";
const PU_FX = new Set(["puVerse", "puPillar", "puWave", "puStarLine", "puWind", "puReap", "puFrost", "puGoldStream", "puSword", "puTeleport", "puClone", "puDisguise", "puFlute"]);

/** 먹 터짐: 가운데서 먹방울이 튀어 번짐 */
function inkSplash(ctx: Ctx, x: number, y: number, r: number, f: number, seed: number): void {
  for (let k = 0; k < 9; k++) {
    const a = rnd(seed, k) * TAU;
    const d = r * (0.3 + rnd(k, seed) * 0.8) * easeOut(f);
    const s = (1.5 + rnd(k, 7) * 2.5) * (1 - f * 0.5);
    ctx.fillStyle = alpha(INK, 0.85 * (1 - f));
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d * 0.7, s, 0, TAU);
    ctx.fill();
  }
}

/** 앞으로 뻗는 줄 효과 공통: 시작 → 끝, 지금 머리 자리 */
function head(fx: EffectState, snap: Snap, f: number, speed = 1.6): [number, number, number, number, number] {
  const x = snap(fx.x);
  const y = snap(fx.y);
  const tx = snap(fx.toX ?? fx.x);
  const ty = snap(fx.toY ?? fx.y);
  const k = Math.min(1, easeOut(f * speed));
  return [x, y, x + (tx - x) * k, y + (ty - y) * k, Math.atan2(ty - y, tx - x)];
}

export function drawPungryuFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!PU_FX.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const fade = 1 - f;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const r = fx.size;
  switch (fx.kind) {
    case "puVerse": {
      // 바닥에 금빛 문양이 돌며 퍼지고, 네 글자가 차례로 떠올라 빛남
      const word = VERSE_HANJA[fx.tint ?? ""] ?? "天地玄黃";
      const c = VERSE_TINT[fx.tint ?? ""] ?? GOLD;
      additive(ctx, () => {
        rune(ctx, x, y + 8, 14 + easeOut(f) * 14, c, fade, f * 3);
        glow(ctx, x, y - 8, 22, c, 0.5 * fade, 0.3);
      });
      for (let i = 0; i < 4; i++) {
        const show = Math.max(0, Math.min(1, f * 5 - i * 0.6));
        if (show <= 0) continue;
        ctx.globalAlpha = Math.min(1, show) * fade;
        glyph(ctx, word[i] ?? "", x + (i - 1.5) * 9, y - 10 - easeOut(f) * 10 - (i % 2) * 3, 10, c);
      }
      ctx.globalAlpha = 1;
      break;
    }
    case "puPillar": {
      const earth = fx.tint === "earth";
      const c = earth ? "#ffc04a" : "#8a6aff";
      const w = r * (0.9 + 0.6 * fade);
      additive(ctx, () => {
        if (earth) {
          // 땅 기둥: 바닥이 갈라지며 아래에서 솟음
          const h = 70 * easeOut(Math.min(1, f * 2));
          beam(ctx, x, y, x, y - h, w * 0.7, c, fade);
          for (let k = 0; k < 6; k++) {
            const a = rnd(k, 3) * TAU;
            ctx.strokeStyle = alpha(c, fade);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(a) * r * 1.2, y + Math.sin(a) * r * 0.5);
            ctx.stroke();
          }
        } else beam(ctx, x, y - 110 + 110 * Math.min(1, f * 4), x, y, w * 0.7, c, fade);
        shock(ctx, x, y, r * (0.6 + easeOut(f)), c, fade, 6);
        sparks(ctx, x, y - 4, 10, r * 1.4, f, c, earth ? 11 : 5);
      });
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(1, 0.45);
      ctx.fillStyle = alpha(earth ? "#5a3a10" : INK, 0.5 * fade);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, TAU);
      ctx.fill();
      ctx.restore();
      break;
    }
    case "puWave": {
      // 큰 물결: 굵은 푸른 띠 + 흰 물마루가 출렁이며 앞으로
      const [sx, sy, hx, hy, a] = head(fx, snap, f);
      const nx = -Math.sin(a);
      const ny = Math.cos(a);
      additive(ctx, () => beam(ctx, sx, sy, hx, hy, r * 1.6 * fade + 3, "#3a8aff", fade));
      ctx.strokeStyle = `rgba(255,255,255,${0.9 * fade})`;
      ctx.lineWidth = 1.5;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        for (let k = 0; k <= 16; k++) {
          const u = k / 16;
          const wob = Math.sin(u * 14 + f * 20) * 2 + r * 0.8 * side;
          ctx.lineTo(sx + (hx - sx) * u + nx * wob, sy + (hy - sy) * u + ny * wob);
        }
        ctx.stroke();
      }
      additive(ctx, () => sparks(ctx, hx, hy, 8, r * 1.5, f, "#a8e8ff", 21));
      break;
    }
    case "puGoldStream": {
      const [sx, sy, hx, hy] = head(fx, snap, f);
      additive(ctx, () => {
        beam(ctx, sx, sy, hx, hy, r * 1.8 * fade + 3, "#ffc83a", fade);
        sparks(ctx, hx, hy, 10, 18, f, GOLD, 31);
        glow(ctx, hx, hy, 14, GOLD, fade, 0.6);
      });
      break;
    }
    case "puSword": {
      // 명검 거궐: 날아가는 칼 둘레로 큰 검기 초승달이 겹겹이 그어지고, 지나간 길에 흰 검기 줄 (천천히 날아감)
      const [sx, sy, hx, hy, a] = head(fx, snap, f, 1.05);
      additive(ctx, () => {
        beam(ctx, sx, sy, hx, hy, 6 * fade + 2, "#cfe8ff", fade);
        for (let k = 0; k < 4; k++) crescent(ctx, hx - Math.cos(a) * k * 12, hy - Math.sin(a) * k * 12, r * (1.6 - k * 0.25), a, 1.15, 11 - k * 2, k === 0 ? "#ffffff" : "#9fd0ff", fade * (1 - k * 0.2));
        glow(ctx, hx, hy, 26, "#e8f4ff", fade, 1);
        sparks(ctx, hx, hy, 10, r, f, "#dff0ff", 81);
      });
      glyph(ctx, "劍", hx, hy, 13, GOLD);
      break;
    }
    case "puStarLine": {
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      additive(ctx, () => {
        beam(ctx, x, y, tx, ty, 2, "#b89aff", fade);
        sparks(ctx, tx, ty, 6, 10, f, "#ffe88a", 41);
        glow(ctx, tx, ty, 8, "#ffe88a", fade, 1);
      });
      break;
    }
    case "puWind": {
      // 찬바람(하늘빛 초승달 + 눈송이) · 뜨거운 바람(주황 초승달 + 불티)
      const hot = fx.tint === "hot";
      const c = hot ? "#ff7a2a" : "#8ae0ff";
      const a = Math.atan2(fx.dirY, fx.dirX);
      additive(ctx, () => {
        for (let k = 0; k < 3; k++) crescent(ctx, x, y, r * (0.45 + 0.22 * k + 0.25 * easeOut(f)), a, 0.9, 8, c, fade * (1 - k * 0.15));
        sparks(ctx, x + Math.cos(a) * r * 0.6, y + Math.sin(a) * r * 0.6, 12, r * 0.6, f, hot ? "#ffd060" : "#ffffff", hot ? 51 : 52);
      });
      break;
    }
    case "puReap":
      additive(ctx, () => {
        crescent(ctx, x, y, r * 1.3, -0.4, 1.2, 7, "#ffc040", fade);
        sparks(ctx, x, y, 10, r * 1.6, f, GOLD, 61);
      });
      glyph(ctx, "收", x, y - r - 4 - f * 6, 12, GOLD);
      break;
    case "puFrost":
      additive(ctx, () => {
        shock(ctx, x, y, r * (0.5 + easeOut(f)), "#bfe8ff", fade, 5);
        for (let k = 0; k < 6; k++) {
          const a = (k / 6) * TAU + 0.3;
          beam(ctx, x, y, x + Math.cos(a) * r * 1.1, y + Math.sin(a) * r * 0.8, 1.5, "#d8f4ff", fade);
        }
      });
      break;
    case "puTeleport": {
      // 축지: 먹 붓질 한 획 + 양 끝 구름
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      brush(ctx, x, y, tx, ty, 5, INK, 0.8 * fade);
      additive(ctx, () => glow(ctx, tx, ty, 14, JADE, fade, 0.4));
      ctx.fillStyle = alpha("#c8d4f0", 0.7 * fade);
      for (const [cx, cy] of [[x, y], [tx, ty]] as const) for (let k = 0; k < 4; k++) ctx.fillRect(cx - 6 + k * 3, cy + 3 - (k % 2) * 2, 4, 3);
      glyph(ctx, "縮", tx, ty - 14, 9, JADE);
      break;
    }
    case "puClone":
    case "puDisguise":
      inkSplash(ctx, x, y, r * 1.4, f, fx.kind === "puClone" ? 71 : 72);
      if (fx.kind === "puDisguise") glyph(ctx, "遁", x, y - 16 - f * 6, 11, JADE);
      else glyph(ctx, "分", x, y - 16 - f * 6, 10, "#e8ecf4");
      break;
    case "puFlute":
      additive(ctx, () => shock(ctx, x, y, r * easeOut(f), JADE, fade, 6));
      ctx.globalAlpha = fade;
      for (let k = 0; k < 3; k++) glyph(ctx, "♪", x + Math.cos(k * 2.1 + f * 3) * r * 0.6, y - 10 - f * 14 + Math.sin(k * 2.1) * 6, 9, "#e8fff4");
      ctx.globalAlpha = 1;
      break;
  }
  return true;
}
