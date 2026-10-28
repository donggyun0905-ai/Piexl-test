// 역병의사 그리기: 바닥의 연기 구역 · 쥐떼 · 모기떼 · 흑사병에 걸린 적(검은 기운·파리) · 효과(쥐 터짐·흑사병 표시·모기 갉기·연기 퍼짐·죽음의 손아귀)
import type { EffectState, RunState } from "@pixel-rogue/shared";
import { additive, glow, shock, sparks } from "./pwFxBits";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;

/** 바닥: 연기 구역 (뭉게구름이 천천히 꿈틀, 끝나 갈수록 옅어짐) */
export function drawPlagueGround(ctx: Ctx, s: RunState, snap: Snap): void {
  const p = s.player;
  for (const c of p.plClouds ?? []) {
    const fade = Math.min(1, c.t / 40);
    for (let i = 0; i < 7; i++) {
      const a = i * 0.9 + s.tick * 0.01 * (i % 2 ? 1 : -1);
      const d = c.r * (0.35 + (i % 3) * 0.15);
      ctx.globalAlpha = 0.22 * fade;
      ctx.fillStyle = i % 3 === 0 ? "#5a6a3a" : i % 3 === 1 ? "#7a8a5a" : "#4a3a5a";
      ctx.beginPath();
      ctx.arc(snap(c.x + Math.cos(a) * d), snap(c.y + Math.sin(a) * d * 0.7), c.r * 0.55, 0, Math.PI * 2);
      ctx.fill();
    }
    // 연기 속 반짝이는 독 거품
    ctx.globalAlpha = 0.8 * fade;
    for (let i = 0; i < 5; i++) {
      const k = (s.tick * 0.5 + i * 13) % 40;
      ctx.fillStyle = i % 2 ? "#9aff6a" : "#ff8a2a";
      ctx.fillRect(Math.round(c.x + Math.sin(i * 2.3) * c.r * 0.6), Math.round(c.y + Math.cos(i * 1.7) * c.r * 0.4 - k * 0.4), 1, 1);
    }
  }
  ctx.globalAlpha = 1;
}

/** 쥐 한 마리 (오른쪽을 봄, flip이면 왼쪽) */
function rat(ctx: Ctx, x: number, y: number, flip: boolean, tick: number): void {
  const d = flip ? -1 : 1;
  ctx.fillStyle = "#5a4a4a";
  ctx.fillRect(x - 2, y - 1, 4, 2);
  ctx.fillRect(x + d * 2, y - 1, 1, 1);
  ctx.fillStyle = "#e8a0a0";
  ctx.fillRect(x + d * 2, y - 2, 1, 1);
  ctx.fillStyle = "#c8a0a0";
  ctx.fillRect(x - d * 3, y + ((tick >> 2) % 2), 1, 1);
  ctx.fillRect(x - d * 4, y, 1, 1);
}

/** 쥐떼 · 모기떼 · 흑사병 걸린 적 (몸 위) */
export function drawPlagueAir(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  for (const r of p.plRats ?? []) rat(ctx, snap(r.x), snap(r.y), (r.id + (s.tick >> 4)) % 2 === 0, s.tick);
  const sw = p.plSwarm;
  if (sw) {
    const x = lerp(sw.prevX, sw.x, alpha);
    const y = lerp(sw.prevY, sw.y, alpha);
    // 모기 마흔여덟 마리가 넓게 윙윙 맴돎
    for (let i = 0; i < 48; i++) {
      const a = i * 2.4 + s.tick * (0.2 + (i % 3) * 0.05);
      const rr = 4 + (i % 9) * 3.4;
      const mx = Math.round(x + Math.cos(a) * rr);
      const my = Math.round(y + Math.sin(a * 1.3) * rr * 0.7);
      ctx.fillStyle = "#1e1a24";
      ctx.fillRect(mx, my, 1, 1);
      if ((s.tick + i) % 3 === 0) {
        ctx.fillStyle = "rgba(200,224,240,0.7)";
        ctx.fillRect(mx - 1, my - 1, 1, 1);
      }
    }
  }
  // 흑사병: 검푸른 기운과 머리 위를 도는 파리
  for (const e of s.enemies) {
    if ((e.plague ?? 0) <= 0 || e.hp <= 0) continue;
    const x = snap(lerp(e.prevX, e.x, alpha));
    const y = snap(lerp(e.prevY, e.y, alpha));
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = "#1a2a14";
    ctx.beginPath();
    ctx.arc(x, y, e.r + 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    for (let i = 0; i < 3; i++) {
      const a = s.tick * 0.25 + i * 2.1;
      ctx.fillStyle = "#1e1a24";
      ctx.fillRect(Math.round(x + Math.cos(a) * (e.r + 3)), Math.round(y - e.r - 3 + Math.sin(a) * 2), 1, 1);
    }
    ctx.fillStyle = "#9aff6a";
    ctx.fillRect(x - 1, y - e.r - 6, 2, 2);
  }
}

export function drawPlagueFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  const t = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const seed = fx.x + fx.y * 3;
  switch (fx.kind) {
    case "plBurst":
      // 쥐가 터짐: 병든 초록 섬광 + 검붉은·초록 물방울이 포물선으로 튐 + 독 안개
      additive(ctx, () => {
        glow(ctx, x, y, fx.size * 1.4, "#7ad86a", (1 - t) * 0.7, t < 0.2 ? 1 : 0);
        shock(ctx, x, y, fx.size * (0.5 + t * 1.2), "#a0e060", 1 - t, 4);
      });
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2 + seed;
        ctx.globalAlpha = 1 - t;
        ctx.fillStyle = i % 2 ? "#7a1a14" : "#4a8a3a";
        ctx.fillRect(Math.round(x + Math.cos(a) * fx.size * t * 1.6), Math.round(y + Math.sin(a) * fx.size * t * 1.2 - Math.sin(t * Math.PI) * 6 + t * t * 4), 2, 2);
      }
      break;
    case "plMark": {
      // 흑사병: 초록 독 고리가 조여 듦 · 죽음의 손아귀 즉사(dirX 1): 하얀 해골이 떠오름
      const c = fx.dirX ? "#e8e0f0" : "#9aff6a";
      additive(ctx, () => {
        shock(ctx, x, y, fx.size * (0.6 + t * 0.6), c, 1 - t, 4);
        glow(ctx, x, y, fx.size * 0.8, c, (1 - t) * 0.5);
      });
      ctx.globalAlpha = 1 - t;
      if (fx.dirX) {
        additive(ctx, () => glow(ctx, x, y - 6 - t * 6, 8, "#d8f0ff", 1 - t, 1));
        ctx.fillStyle = "#f0e8e0";
        ctx.fillRect(x - 3, y - 8 - t * 6, 6, 5);
        ctx.fillRect(x - 2, y - 3 - t * 6, 4, 2);
        ctx.fillStyle = "#1e1a24";
        ctx.fillRect(x - 2, y - 7 - t * 6, 1, 2);
        ctx.fillRect(x + 1, y - 7 - t * 6, 1, 2);
      }
      break;
    }
    case "plSwarmBite": {
      // 쥐떼가 물어뜯음: 어두운 덩어리 + 붉은 이빨 자국 빛
      ctx.globalAlpha = (1 - t) * 0.5;
      ctx.fillStyle = "#3a2a3a";
      ctx.beginPath();
      ctx.arc(x, y, fx.size * (0.7 + t * 0.3), 0, Math.PI * 2);
      ctx.fill();
      additive(ctx, () => sparks(ctx, x, y, 6, fx.size, t, "#ff5a5a", seed));
      break;
    }
    case "plPuff":
      // 역병 연기: 부풀어 퍼지는 누런 초록 구름 세 겹
      for (let i = 0; i < 3; i++) {
        ctx.globalAlpha = (1 - t) * (0.35 - i * 0.08);
        ctx.fillStyle = i % 2 ? "#9aa86a" : "#7a8a4a";
        ctx.beginPath();
        ctx.ellipse(x + (i - 1) * fx.size * 0.25, y - i * 2, fx.size * (0.3 + t * 0.8) * (1 - i * 0.15), fx.size * (0.2 + t * 0.5), 0, 0, Math.PI * 2);
        ctx.fill();
      }
      additive(ctx, () => glow(ctx, x, y, fx.size * (0.4 + t), "#b8d070", (1 - t) * 0.4));
      break;
    case "plGrip": {
      // 검은 손이 움켜쥠: 초록 저주 빛 속에서 다섯 손가락이 오므려짐 → 쥐는 순간 번쩍
      const close = Math.min(1, t * 2.5);
      const a0 = Math.atan2(fx.dirY, fx.dirX);
      additive(ctx, () => glow(ctx, x, y, fx.size * 0.8, "#9aff6a", (1 - t) * 0.6, close >= 1 ? 1 : 0));
      ctx.globalAlpha = 1 - Math.max(0, t - 0.5) * 2;
      ctx.strokeStyle = "#1e1a24";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      for (let i = -2; i <= 2; i++) {
        const a = a0 + i * 0.35 * (1 - close * 0.6);
        ctx.beginPath();
        ctx.moveTo(x - fx.dirX * 6, y - fx.dirY * 6);
        ctx.quadraticCurveTo(x + Math.cos(a) * fx.size * 0.4, y + Math.sin(a) * fx.size * 0.4, x + Math.cos(a + i * 0.2 * close) * fx.size * 0.5, y + Math.sin(a + i * 0.2 * close) * fx.size * 0.5);
        ctx.stroke();
      }
      ctx.lineCap = "butt";
      ctx.fillStyle = "#9aff6a";
      ctx.fillRect(x - 1, y - 1, 2, 2);
      break;
    }
    default:
      return false;
  }
  ctx.globalAlpha = 1;
  return true;
}
