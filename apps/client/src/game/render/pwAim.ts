// 패왕전 스킬 조준 미리보기 (키를 눌러 조준 중일 때): 사거리 원 · 마우스 쪽 범위 (지점 원 · 직선 띠 · 부채꼴 · 내 둘레 · 돌진 화살 · 순간이동 자리)
import { skillDef, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;

export function drawSkillAim(ctx: Ctx, s: RunState, k: number, cursor: { x: number; y: number } | null, alpha: number, snap: Snap): void {
  const def = skillDef(s, k);
  if (!def) return;
  const p = s.player;
  const x = snap(lerp(p.prevX, p.x, alpha));
  const y = snap(lerp(p.prevY, p.y, alpha));
  const cx = cursor?.x ?? x + p.faceX * def.range;
  const cy = cursor?.y ?? y + p.faceY * def.range;
  const len = Math.hypot(cx - x, cy - y) || 1;
  const dx = (cx - x) / len;
  const dy = (cy - y) / len;
  const d = Math.min(def.range, len);
  const tx = x + dx * d;
  const ty = y + dy * d;
  const c = def.tint;
  ctx.save();
  // 사거리 원 (점선)
  if (def.range > 0) {
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = c;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(x, y, def.range, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.fillStyle = c;
  ctx.strokeStyle = c;
  ctx.lineWidth = 1.5;
  const area = (draw: () => void) => {
    ctx.globalAlpha = 0.22;
    ctx.beginPath();
    draw();
    ctx.fill();
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    draw();
    ctx.stroke();
  };
  switch (def.shape) {
    case "point":
    case "summon":
      area(() => ctx.arc(tx, ty, Math.max(8, def.radius), 0, Math.PI * 2));
      break;
    case "line":
    case "dash": {
      const L = def.shape === "line" ? def.range : Math.max(40, d);
      const w = Math.max(4, def.radius);
      area(() => {
        ctx.moveTo(x - dy * w, y + dx * w);
        ctx.lineTo(x + dx * L - dy * w, y + dy * L + dx * w);
        ctx.lineTo(x + dx * L + dy * w, y + dy * L - dx * w);
        ctx.lineTo(x + dy * w, y - dx * w);
        ctx.closePath();
      });
      break;
    }
    case "cone": {
      const a = Math.atan2(dy, dx);
      const arc = def.arc ?? 0.8;
      area(() => {
        ctx.moveTo(x, y);
        ctx.arc(x, y, def.radius, a - arc, a + arc);
        ctx.closePath();
      });
      break;
    }
    case "self":
      area(() => ctx.arc(x, y, def.radius, 0, Math.PI * 2));
      break;
    case "blink":
      area(() => ctx.arc(tx, ty, 9, 0, Math.PI * 2));
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(tx, ty);
      ctx.stroke();
      break;
  }
  ctx.restore();
}
