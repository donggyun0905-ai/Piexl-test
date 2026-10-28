// 시즌 2 층 보스 탄: 두꺼비 왕 진흙 덩이 · 불도롱뇽 용암 덩이 (공격 효과는 s2Bosses)
import type { ProjectileState, RunState } from "@pixel-rogue/shared";
import { additive, beam, glow } from "./pwFxBits";
import { bossOf } from "./s2Bosses";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;

/** 시즌 2 층 보스의 탄: 두꺼비 진흙 덩이 · 도롱뇽 용암 덩이 (나머지는 false) */
export function drawS2BossShot(ctx: Ctx, s: RunState, pr: ProjectileState, x: number, y: number, tick: number): boolean {
  const b = bossOf(s);
  if (b === "toad" && pr.look === "rock") {
    // 진흙 덩이: 반들반들한 갈색 덩이 + 뚝뚝 떨어지는 진흙
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.ellipse(x, y + 5, 3.5, 1.5, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#5a3a1a";
    ctx.beginPath();
    ctx.arc(x, y, pr.r + 1.5, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#8a6034";
    ctx.beginPath();
    ctx.arc(x - 1, y - 1, pr.r, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#d8b888";
    ctx.fillRect(Math.round(x - 2), Math.round(y - 2), 1, 1);
    ctx.fillStyle = "#5a3a1a";
    ctx.fillRect(Math.round(x - pr.vx * 2), Math.round(y - pr.vy * 2 + ((tick >> 2) % 3)), 2, 2);
    return true;
  }
  if (b === "salamander" && pr.look === "fire") {
    // 용암 덩이: 검게 굳은 겉 사이로 빛나는 용암 + 불꼬리
    additive(ctx, () => {
      beam(ctx, x - pr.vx * 4, y - pr.vy * 4, x, y, pr.r * 1.6, "#ff5a14", 0.7);
      glow(ctx, x, y, pr.r * 3, "#ff7a2a", 0.8);
    });
    ctx.fillStyle = "#2a1410";
    ctx.beginPath();
    ctx.arc(x, y, pr.r + 1, 0, TAU);
    ctx.fill();
    ctx.fillStyle = (tick + pr.id) % 6 < 3 ? "#ffb040" : "#ff6a1a";
    ctx.fillRect(Math.round(x - 1), Math.round(y - 2), 2, 1);
    ctx.fillRect(Math.round(x), Math.round(y), 2, 1);
    ctx.fillRect(Math.round(x - 2), Math.round(y + 1), 1, 1);
    return true;
  }
  return false;
}
