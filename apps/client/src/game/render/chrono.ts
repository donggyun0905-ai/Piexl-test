// 시간술사 그리기: 잔상(공격한 자리에 반투명한 모습 + 시계 고리가 차오름) · 예지 표시 · 시간탄·모래·되감기 원반·톱니
import type { ProjectileState, RunState } from "@pixel-rogue/shared";
import { drawBody } from "./actors";
import { sheetFor } from "../sprites";
import { type Snap } from "./palette";

const GLOW = "#7ae0ff";
const SAND = "#e8c878";

/** 잔상과 예지 (플레이어 다음에) */
export function drawChrono(ctx: CanvasRenderingContext2D, s: RunState, snap: Snap): void {
  const p = s.player;
  for (const e of p.echoes ?? []) {
    const total = Math.max(1, e.at - e.born);
    const f = Math.min(1, (s.tick - e.born) / total);
    const x = snap(e.x);
    const y = snap(e.y);
    // 반투명한 내 모습 (곧 공격할수록 진해짐)
    ctx.globalAlpha = 0.15 + 0.35 * f;
    drawBody(ctx, p.characterId, x, y, p.r, { faceX: e.fx, faceY: e.fy, moving: false, casting: false, step: 0 }, 0, sheetFor(p.characterId, p.lv));
    ctx.globalAlpha = 1;
    // 시계 고리: 남은 시간만큼 차오름
    ctx.strokeStyle = `rgba(122, 224, 255, ${0.35 + 0.5 * f})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, p.r + 4, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * f);
    ctx.stroke();
    // 시곗바늘 한 개
    const a = -Math.PI / 2 + Math.PI * 2 * f;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * (p.r + 3), y + Math.sin(a) * (p.r + 3));
    ctx.stroke();
  }
  for (const fs of p.foresights ?? []) {
    // 예지: 노리는 적 둘레에 좁혀 드는 눈금
    const left = Math.max(0, fs.at - s.tick);
    const r = 6 + left / 4;
    ctx.strokeStyle = `rgba(122, 224, 255, ${0.9 - left / 60})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(snap(fs.x), snap(fs.y), r, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2 + s.tick / 20;
      ctx.fillStyle = GLOW;
      ctx.fillRect(snap(fs.x + Math.cos(a) * r) - 0.5, snap(fs.y + Math.sin(a) * r) - 0.5, 1, 1);
    }
  }
}

/** 시간술사 탄이면 그리고 true */
export function drawChronoShot(ctx: CanvasRenderingContext2D, pr: ProjectileState, x: number, y: number, tick: number): boolean {
  const sp = pr.spirit;
  if (sp !== "chrono" && sp !== "sand" && sp !== "disc" && sp !== "gear") return false;
  const ghost = pr.echo ? 0.55 : 1;
  ctx.globalAlpha = ghost;
  if (sp === "chrono") {
    // 푸른 시간탄 + 꼬리
    ctx.fillStyle = "rgba(122, 224, 255, 0.4)";
    ctx.fillRect(x - pr.vx * 2 - 1, y - pr.vy * 2 - 1, 2, 2);
    ctx.fillStyle = GLOW;
    ctx.fillRect(x - 2, y - 2, 4, 4);
    ctx.fillStyle = "#fff";
    ctx.fillRect(x - 1, y - 1, 2, 2);
  } else if (sp === "sand") {
    // 모래알 몇 개
    ctx.fillStyle = SAND;
    for (let i = 0; i < 4; i++) ctx.fillRect(x - 2 + ((i * 3 + tick) % 4), y - 2 + ((i * 5 + tick) % 4), 1, 1);
    ctx.fillStyle = "#fff4c8";
    ctx.fillRect(x - 0.5, y - 0.5, 1, 1);
  } else {
    // 원반·톱니: 돌아가는 바퀴
    const r = pr.r + (sp === "disc" ? 1 : 0.5);
    ctx.strokeStyle = sp === "disc" ? GLOW : "#c8a060";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    const teeth = sp === "disc" ? 2 : 6;
    for (let i = 0; i < teeth; i++) {
      const a = tick / 3 + (i * Math.PI * 2) / teeth;
      ctx.fillStyle = sp === "disc" ? "#fff" : "#e8c070";
      ctx.fillRect(x + Math.cos(a) * r - 0.5, y + Math.sin(a) * r - 0.5, 1.5, 1.5);
    }
  }
  ctx.globalAlpha = 1;
  return true;
}
