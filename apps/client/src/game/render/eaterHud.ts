// 이터 '포식(DEVOUR)' 스택 창: 왼쪽 위 (악의 사도 영혼 창과 같은 자리) · 이빨 달린 아가리 · 먹은 수 · 재생력 (상한이면 붉게 빛남)
import { eaterRegen, eaterRegenCap, type RunState } from "@pixel-rogue/shared";
import { hudScale } from "./imugiAura";

type Ctx = CanvasRenderingContext2D;

export function drawEaterHud(ctx: Ctx, s: RunState, scale: number): void {
  const p = s.player;
  if (p.characterId !== "eater") return;
  const n = p.eaEaten ?? 0;
  const regen = eaterRegen(p);
  const full = regen >= eaterRegenCap(p) - 1e-6;
  const k = hudScale(scale);
  ctx.setTransform(k, 0, 0, k, 0, 0);
  ctx.save();
  ctx.globalAlpha = 0.9;
  ctx.translate(6, s.party ? ((30 + 5 * s.party.length) * scale) / k : 16);
  // 이빨 달린 검은 아가리 · 붉은 눈 (먹을 때마다 살짝 벌어졌다 닫힘)
  const open = (s.tick >> 3) % 6 === 0 ? 1 : 0;
  ctx.fillStyle = "#0e0a12";
  ctx.fillRect(-1, -12, 11, 13);
  ctx.fillStyle = full ? "#ff2030" : "#c81e2a";
  ctx.fillRect(1, -10, 2, 2);
  ctx.fillRect(6, -10, 2, 2);
  ctx.fillStyle = "#f4f0f8";
  for (let x = 0; x < 9; x += 2) {
    ctx.fillRect(x, -6 - open, 1, 2);
    ctx.fillRect(x + 1, -2 + open, 1, 2);
  }
  ctx.font = "bold 11px monospace";
  ctx.textBaseline = "alphabetic";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#0e0a12";
  const num = String(n);
  ctx.strokeText(num, 13, 0);
  ctx.fillStyle = full ? "#ff6a6a" : "#f0d8e0";
  ctx.fillText(num, 13, 0);
  const nw = ctx.measureText(num).width;
  ctx.font = "bold 6px monospace";
  const add = `DEVOUR  REGEN +${regen.toFixed(1)}  ATK +${Math.floor(regen / 10 + 1e-9) * 3}${full ? "  MAX" : ""}`;
  ctx.strokeText(add, 16 + nw, 0);
  ctx.fillText(add, 16 + nw, 0);
  ctx.restore();
}
