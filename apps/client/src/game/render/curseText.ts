// 머리 위 히든 글자 (효과 hdText, size = 번호): 저주받은 주사위가 틀렸을 때 어떤 저주인지(붉은 글자) · 신의 파편으로 얻은 힘(금빛 글자), 3초 동안 (글자는 화면 언어, render 옵션 curseNames)
import { allPlayers, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";

export function drawCurseText(ctx: CanvasRenderingContext2D, s: RunState, names: readonly string[] | undefined, a: number, snap: Snap): void {
  if (!names) return;
  const players = allPlayers(s);
  for (const fx of s.effects) {
    if (fx.kind !== "hdText") continue;
    const p = players[fx.seat ?? 0] ?? s.player;
    const text = names[fx.size];
    if (!text) continue;
    const age = fx.maxTicks - fx.ticks;
    const x = snap(lerp(p.prevX, p.x, a));
    const y = snap(lerp(p.prevY, p.y, a)) - 34 - Math.min(8, age / 4);
    ctx.save();
    ctx.globalAlpha = Math.min(1, fx.ticks / 30, age / 8);
    ctx.font = "bold 7px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#1a0410";
    ctx.strokeText(text, x, y);
    ctx.fillStyle = fx.size >= 4 ? "#ffe08a" : "#ff6a8a";
    ctx.fillText(text, x, y);
    ctx.restore();
  }
}
