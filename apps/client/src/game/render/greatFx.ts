// 대정령 기술 그리기: 티탄코어 돌주먹 내려찍기 · 아비스루인 심연 입방체 · 실반가드 주문·거대 마법 화살 · 엄브라 그림자 레이저 · 베놈하이드 독가스 · 머리 위 마법 문자(▤▥▧▨)
import type { EffectState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";
import { GREAT_GLOW, GREATS } from "./spirits";

type Ctx = CanvasRenderingContext2D;

/** 떨어지는 동안 위에서 내려오는 높이 (0 = 닿음) */
const fallH = (fx: EffectState, far: number) => {
  const wait = fx.dirY || 1;
  const done = fx.maxTicks - fx.ticks;
  const k = Math.min(1, done / wait);
  return { h: (1 - k * k) * far, landed: done >= wait, after: Math.max(0, done - wait) };
};

/** 바닥 그림자 + 닿은 뒤 퍼지는 고리·금 */
function impact(ctx: Ctx, x: number, y: number, r: number, k: number, landed: boolean, after: number, c: string): void {
  if (!landed) {
    ctx.globalAlpha = 0.25 + k * 0.35;
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.ellipse(x, y + 2, r * (0.3 + k * 0.6), r * (0.15 + k * 0.3), 0, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  const u = Math.min(1, after / 14);
  ctx.globalAlpha = 1 - u;
  ctx.strokeStyle = c;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(x, y + 2, r * (0.6 + u * 0.6), r * (0.3 + u * 0.3), 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#2a2018";
  ctx.lineWidth = 1;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.4;
    ctx.beginPath();
    ctx.moveTo(x, y + 2);
    ctx.lineTo(x + Math.cos(a) * r * 0.8, y + 2 + Math.sin(a) * r * 0.4);
    ctx.stroke();
  }
}

/** 돌주먹: 바위 손등·손가락 마디·주황 빛 금 */
function fist(ctx: Ctx, x: number, y: number, s: number): void {
  ctx.fillStyle = "#6a5a48";
  ctx.fillRect(x - s, y - s * 1.6, s * 2, s * 1.2);
  ctx.fillStyle = "#8a7a62";
  for (let i = 0; i < 4; i++) ctx.fillRect(x - s + i * (s / 2), y - s * 0.5, s / 2 - 1, s * 0.8);
  ctx.fillStyle = "#a89a80";
  ctx.fillRect(x - s, y - s * 1.6, s * 2, 2);
  ctx.fillStyle = "#ff9a3a";
  ctx.fillRect(x - s * 0.4, y - s * 1.3, 1, s * 0.7);
  ctx.fillRect(x + s * 0.3, y - s * 1.1, 1, s * 0.5);
}

/** 알 수 없는 입방체: 빙글 도는 보랏빛 정육면체 (앞면·윗면·옆면 + 무늬) */
function cube(ctx: Ctx, x: number, y: number, s: number, spin: number): void {
  const d = Math.cos(spin) * s * 0.5;
  ctx.fillStyle = "#3a1a5a";
  ctx.fillRect(x - s, y - s, s * 2, s * 2);
  ctx.fillStyle = "#5a2a8a";
  ctx.beginPath();
  ctx.moveTo(x - s, y - s);
  ctx.lineTo(x - s + d, y - s - s * 0.6);
  ctx.lineTo(x + s + d, y - s - s * 0.6);
  ctx.lineTo(x + s, y - s);
  ctx.fill();
  ctx.fillStyle = "#2a1040";
  ctx.beginPath();
  ctx.moveTo(x + s, y - s);
  ctx.lineTo(x + s + d, y - s - s * 0.6);
  ctx.lineTo(x + s + d, y + s - s * 0.6);
  ctx.lineTo(x + s, y + s);
  ctx.fill();
  ctx.strokeStyle = "#d8a8ff";
  ctx.lineWidth = 1;
  ctx.strokeRect(x - s + 2, y - s + 2, s * 2 - 4, s * 2 - 4);
  ctx.beginPath();
  ctx.moveTo(x - s + 2, y);
  ctx.lineTo(x + s - 2, y);
  ctx.moveTo(x, y - s + 2);
  ctx.lineTo(x, y + s - 2);
  ctx.stroke();
}

/** 마법 문자 ▤▥▧▨ 하나 (7칸 네모 + 빗금) */
function rune(ctx: Ctx, x: number, y: number, kind: number): void {
  ctx.strokeRect(x - 3.5, y - 3.5, 7, 7);
  ctx.beginPath();
  for (let i = -2; i <= 2; i += 2) {
    if (kind === 0) {
      ctx.moveTo(x - 3, y + i);
      ctx.lineTo(x + 3, y + i);
    } else if (kind === 1) {
      ctx.moveTo(x + i, y - 3);
      ctx.lineTo(x + i, y + 3);
    } else {
      const f = kind === 2 ? 1 : -1;
      ctx.moveTo(x - 3 + i + 1, y - 3 * f);
      ctx.lineTo(x + 3 + i - 1 - Math.abs(i), y + (3 - Math.abs(i)) * f);
    }
  }
  ctx.stroke();
}

export function drawGreatFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  const t = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const r = fx.size;
  switch (fx.kind) {
    case "gsFist": {
      const f = fallH(fx, 46);
      impact(ctx, x, y, r, 1 - f.h / 46, f.landed, f.after, "#ff9a3a");
      ctx.globalAlpha = f.landed ? Math.max(0, 1 - f.after / 8) : 1;
      fist(ctx, x, y - f.h, Math.max(6, r * 0.35));
      break;
    }
    case "gsCube": {
      const f = fallH(fx, 46);
      impact(ctx, x, y, r, 1 - f.h / 46, f.landed, f.after, "#a86aff");
      if (!f.landed) {
        // 머리 위에서 잠시 떠 돌다가 떨어짐 (보랏빛 고리)
        ctx.globalAlpha = 0.7;
        ctx.strokeStyle = "#d8a8ff";
        ctx.beginPath();
        ctx.ellipse(x, y - f.h - 10, 12, 4, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
        cube(ctx, x, y - f.h - 4, 7, fx.ticks * 0.25);
      } else {
        ctx.globalAlpha = Math.max(0, 1 - f.after / 14);
        ctx.fillStyle = "#a86aff";
        ctx.beginPath();
        ctx.arc(x, y, r * (0.4 + f.after / 20), 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "gsChant": {
      // 주문: 대정령 둘레를 도는 초록 마법진 + 앞으로 모이는 빛
      ctx.globalAlpha = 0.8;
      ctx.strokeStyle = "#7ae05a";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, r * (1.2 - t * 0.5), 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + t * 6;
        ctx.fillStyle = "#c8ff8a";
        ctx.fillRect(Math.round(x + Math.cos(a) * r), Math.round(y + Math.sin(a) * r * 0.5), 2, 2);
      }
      ctx.fillStyle = "#ffffff";
      ctx.globalAlpha = t;
      ctx.beginPath();
      ctx.arc(x + fx.dirX * 8, y + fx.dirY * 8, 1 + t * 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "gsArrow":
    case "gsBeam": {
      // 거대 마법 화살(초록·흰 심) · 엄브라 레이저(붉은 그림자, 채찍만큼 굵게)
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      const arrow = fx.kind === "gsArrow";
      const reach = arrow ? Math.min(1, t * 3) : 1;
      const ex = x + (tx - x) * reach;
      const ey = y + (ty - y) * reach;
      ctx.lineCap = "round";
      for (const [c, w] of (arrow ? [["rgba(122,224,90,0.45)", r * 1.6], ["#9aff6a", r * 0.8], ["#ffffff", r * 0.3]] : [["rgba(90,0,30,0.5)", r * 1.6], ["#ff3a6a", r * 0.9], ["#ffd0dc", r * 0.3]]) as [string, number][]) {
        ctx.globalAlpha = 1 - t * 0.8;
        ctx.strokeStyle = c;
        ctx.lineWidth = w * (arrow ? 1 : 1 - t * 0.5);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(ex, ey);
        ctx.stroke();
      }
      ctx.lineCap = "butt";
      if (arrow) {
        // 화살촉
        const len = Math.hypot(tx - x, ty - y) || 1;
        const dx = (tx - x) / len;
        const dy = (ty - y) / len;
        ctx.globalAlpha = 1 - t;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(ex + dx * 10, ey + dy * 10);
        ctx.lineTo(ex - dy * r, ey + dx * r);
        ctx.lineTo(ex + dy * r, ey - dx * r);
        ctx.fill();
      }
      break;
    }
    case "gsGas": {
      // 연막탄처럼 퍼졌다가 옅어지는 초록 독가스 (뭉게구름)
      const grow = Math.min(1, t * 8);
      const fade = t > 0.75 ? (1 - t) * 4 : 1;
      for (let i = 0; i < 5; i++) {
        const a = i * 1.3 + fx.dirX + t * 2;
        const cx = x + Math.cos(a) * r * 0.45;
        const cy = y + Math.sin(a) * r * 0.3;
        ctx.globalAlpha = 0.28 * fade;
        ctx.fillStyle = i % 2 ? "#6ac83a" : "#9aff5a";
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.6 * grow, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 0.6 * fade;
      ctx.fillStyle = "#d8ff9a";
      for (let i = 0; i < 4; i++) ctx.fillRect(Math.round(x + Math.sin(fx.ticks * 0.1 + i * 2) * r * 0.6), Math.round(y - ((fx.ticks * 0.3 + i * 5) % (r * 0.8))), 1, 1);
      break;
    }
    case "gsRune": {
      // 대정령 머리 위에 떠오르는 마법 문자 넷 (번갈아 반짝임)
      const c = GREAT_GLOW[GREATS[fx.dirX] ?? "titanCore"];
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        ctx.globalAlpha = (1 - t) * ((fx.ticks + i) % 4 < 3 ? 1 : 0.4);
        ctx.strokeStyle = i % 2 ? "#ffffff" : c;
        rune(ctx, x + (i - 1.5) * 9, y - t * 8 + Math.sin(t * 6 + i) * 1.5, (i + Math.floor(t * 4)) % 4);
      }
      break;
    }
    default:
      return false;
  }
  ctx.globalAlpha = 1;
  return true;
}
