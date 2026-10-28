// 시간술사 그리기: 잔상(공격한 자리에 반투명한 모습 + 시계판이 차오름) · 예지(조여 드는 시계 조준) · 시간탄·모래·되감기 원반·톱니
import type { ProjectileState, RunState } from "@pixel-rogue/shared";
import { drawBody } from "./actors";
import { sheetFor } from "../sprites";
import { type Snap } from "./palette";
import { additive, alpha, glow, shock } from "./pwFxBits";

const GLOW = "#7ae0ff";
const SAND = "#e8c878";
const TAU = Math.PI * 2;

/** 시계판: 눈금 12개 + 차오르는 빛 호 + 바늘 (f: 0~1) */
function clockFace(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, f: number, a: number): void {
  additive(ctx, () => {
    glow(ctx, x, y, r * 1.5, GLOW, 0.35 * a);
    ctx.strokeStyle = alpha(GLOW, 0.9 * a);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + TAU * f);
    ctx.stroke();
    ctx.strokeStyle = alpha("#c8f4ff", 0.6 * a);
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 12; i++) {
      const b = (i / 12) * TAU;
      const k = i % 3 === 0 ? 2.5 : 1.2;
      ctx.moveTo(x + Math.cos(b) * (r + 1), y + Math.sin(b) * (r + 1));
      ctx.lineTo(x + Math.cos(b) * (r + 1 + k), y + Math.sin(b) * (r + 1 + k));
    }
    const h = -Math.PI / 2 + TAU * f;
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(h) * (r - 1), y + Math.sin(h) * (r - 1));
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(h * 12) * r * 0.55, y + Math.sin(h * 12) * r * 0.55);
    ctx.stroke();
  });
}

/** 잔상과 예지 (플레이어 다음에) */
export function drawChrono(ctx: CanvasRenderingContext2D, s: RunState, snap: Snap): void {
  const p = s.player;
  for (const e of p.echoes ?? []) {
    const total = Math.max(1, e.at - e.born);
    const f = Math.min(1, (s.tick - e.born) / total);
    const x = snap(e.x);
    const y = snap(e.y);
    // 반투명한 푸른 내 모습 (곧 공격할수록 진해짐)
    ctx.globalAlpha = 0.15 + 0.35 * f;
    ctx.filter = "sepia(1) hue-rotate(160deg) saturate(2) brightness(1.2)";
    drawBody(ctx, p.characterId, x, y, p.r, { faceX: e.fx, faceY: e.fy, moving: false, casting: false, step: 0 }, 0, sheetFor(p.characterId, p.lv));
    ctx.filter = "none";
    ctx.globalAlpha = 1;
    clockFace(ctx, x, y, p.r + 4, f, 0.6 + 0.4 * f);
  }
  for (const fs of p.foresights ?? []) {
    // 예지: 노리는 적 둘레로 조여 드는 시계 조준 (도는 눈금 넷)
    const left = Math.max(0, fs.at - s.tick);
    const r = 6 + left / 4;
    const a = Math.max(0.2, 0.9 - left / 60);
    const x = snap(fs.x);
    const y = snap(fs.y);
    additive(ctx, () => {
      shock(ctx, x, y, r, GLOW, a, 3);
      ctx.strokeStyle = alpha("#ffffff", a);
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const b = (i * Math.PI) / 2 + s.tick / 20;
        ctx.moveTo(x + Math.cos(b) * (r - 2), y + Math.sin(b) * (r - 2));
        ctx.lineTo(x + Math.cos(b) * (r + 3), y + Math.sin(b) * (r + 3));
      }
      ctx.stroke();
    });
  }
}

/** 톱니바퀴 (톱니 n개) */
function gear(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, n: number, rot: number, c: string): void {
  ctx.fillStyle = c;
  ctx.beginPath();
  for (let i = 0; i < n * 2; i++) {
    const b = rot + (i / (n * 2)) * TAU;
    const rr = i % 2 ? r * 0.72 : r;
    ctx.lineTo(x + Math.cos(b) * rr, y + Math.sin(b) * rr);
  }
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#2a2030";
  ctx.beginPath();
  ctx.arc(x, y, r * 0.3, 0, TAU);
  ctx.fill();
}

/** 시간탄이면 그리고 true */
export function drawChronoShot(ctx: CanvasRenderingContext2D, pr: ProjectileState, x: number, y: number, tick: number): boolean {
  const sp = pr.spirit;
  if (sp !== "chrono" && sp !== "sand" && sp !== "disc" && sp !== "gear") return false;
  const ghost = pr.echo ? 0.55 : 1;
  ctx.globalAlpha = ghost;
  if (sp === "chrono") {
    // 시간탄: 뒤로 남는 잔상 셋(과거의 자리) + 빛나는 구슬 + 흰 속
    additive(ctx, () => {
      for (let i = 3; i >= 1; i--) glow(ctx, x - pr.vx * i * 1.6, y - pr.vy * i * 1.6, 4 - i * 0.6, GLOW, 0.5 - i * 0.12);
      glow(ctx, x, y, 7, GLOW, 0.9, 1.2);
    });
    ctx.fillStyle = GLOW;
    ctx.beginPath();
    ctx.arc(x, y, 2.2, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.fillRect(x - 1, y - 1, 2, 2);
  } else if (sp === "sand") {
    // 모래 물결: 반짝이는 금빛 모래알 + 옅은 빛
    additive(ctx, () => glow(ctx, x, y, 6, SAND, 0.5));
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = i % 3 ? SAND : "#fff4c8";
      ctx.fillRect(x - 2.5 + ((i * 3 + tick) % 5), y - 2.5 + ((i * 5 + tick * 2) % 5), 1, 1);
    }
  } else if (sp === "disc") {
    // 되감기 원반: 거꾸로 도는 작은 시계판
    const r = pr.r + 1.5;
    additive(ctx, () => glow(ctx, x, y, r * 2.4, GLOW, 0.6));
    ctx.fillStyle = "rgba(20, 40, 60, 0.85)";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
    clockFace(ctx, x, y, r - 0.5, 1, 1);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(-tick / 3) * r, y + Math.sin(-tick / 3) * r);
    ctx.stroke();
  } else {
    // 톱니: 도는 놋쇠 톱니 + 불똥 빛
    additive(ctx, () => glow(ctx, x, y, pr.r * 2.4, "#e8c070", 0.5));
    gear(ctx, x, y, pr.r + 1.5, 6, tick / 3, "#c8a060");
    ctx.fillStyle = "#fff0c0";
    ctx.fillRect(x + Math.cos(tick / 3) * (pr.r + 1) - 0.5, y + Math.sin(tick / 3) * (pr.r + 1) - 0.5, 1, 1);
  }
  ctx.globalAlpha = 1;
  return true;
}
