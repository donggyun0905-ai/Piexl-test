// 패왕전 스킬 그림 (pwFx·pwWarn, 색은 스킬마다 tint, 위에 캐릭터 느낌 pwSkillMotif): 폭발 · 낙하 · 기둥 · 비 · 빛줄기 · 파동 · 베기 · 회오리 · 돌진 자국 · 순간이동 · 오라 · 장판 · 회복 · 그물 · 소환 · 예고(원·줄·부채꼴)
import type { EffectState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";
import { cone, glow, lineBand, ring, rnd, warn } from "./pwFxBits";
import { drawMotif } from "./pwSkillMotif";

type Ctx = CanvasRenderingContext2D;
const STYLES = ["burst", "meteor", "pillar", "rain", "beam", "wave", "slash", "spin", "dash", "blink", "aura", "field", "heal", "net", "summon"] as const;

export function drawPwSkillFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (fx.kind !== "pwFx" && fx.kind !== "pwWarn") return false;
  const c = fx.tint ?? "#ffffff";
  const t = fx.ticks / fx.maxTicks;
  const f = 1 - t;
  if (fx.kind === "pwWarn") {
    warn(ctx, fx, c, f);
    return true;
  }
  const x = snap(fx.x);
  const y = snap(fx.y);
  const r = fx.size;
  const style = STYLES[fx.style ?? 0] ?? "burst";
  const a = Math.atan2(fx.dirY, fx.dirX);
  const seed = Math.round(fx.x * 7 + fx.y * 3);
  ctx.save();
  // 줄 모양 스킬인데 줄 그림이 아닌 모양(파동·회오리·장판 등)은 줄을 따라 빛 띠로 (예전엔 시작점에 작은 고리만 보였음)
  const line = fx.toX !== undefined && fx.toY !== undefined && style !== "beam" && style !== "slash";
  if (line) lineBand(ctx, x, y, fx.toX!, fx.toY!, r, c, t, f);
  else switch (style) {
    case "burst":
    case "meteor": {
      // 퍼지는 원 + 빛 + 튀는 조각 (낙하는 위에서 떨어진 자국과 금)
      glow(ctx, x, y, r * (0.6 + f * 0.6), c, 0.7 * t);
      ctx.globalAlpha = t;
      ring(ctx, x, y, r * (0.4 + f * 0.8), "#ffffff", 2);
      ring(ctx, x, y, r * (0.3 + f * 0.9), c, 3);
      for (let k = 0; k < 10; k++) {
        const aa = (k / 10) * Math.PI * 2 + rnd(seed, k);
        const d = r * (0.3 + f * (0.8 + rnd(k, seed) * 0.6));
        ctx.fillStyle = k % 2 ? c : "#ffffff";
        ctx.fillRect(Math.round(x + Math.cos(aa) * d) - 1, Math.round(y + Math.sin(aa) * d) - 1, 2, 2);
      }
      if (style === "meteor") {
        ctx.strokeStyle = "#2a1a10";
        ctx.lineWidth = 1;
        for (let k = 0; k < 6; k++) {
          const aa = (k / 6) * Math.PI * 2 + rnd(seed, k + 9);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + Math.cos(aa) * r * 0.9, y + Math.sin(aa) * r * 0.9);
          ctx.stroke();
        }
      }
      break;
    }
    case "pillar": {
      // 하늘에서 내려꽂는 빛기둥
      const w = r * (0.9 - f * 0.4);
      const g = ctx.createLinearGradient(x, y - 90, x, y);
      g.addColorStop(0, `${c}00`);
      g.addColorStop(1, c);
      ctx.globalAlpha = t;
      ctx.fillStyle = g;
      ctx.fillRect(x - w / 2, y - 90, w, 90);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x - w / 6, y - 90, w / 3, 90);
      glow(ctx, x, y, r, c, 0.6 * t);
      ring(ctx, x, y, r * (0.5 + f * 0.7), c, 2);
      break;
    }
    case "rain": {
      // 비처럼 쏟아지는 작은 줄 (부채꼴이면 앞쪽으로)
      ctx.globalAlpha = t;
      ctx.strokeStyle = c;
      ctx.lineWidth = 1.5;
      for (let k = 0; k < 14; k++) {
        const ang = fx.arc ? a + (rnd(seed, k) - 0.5) * 2 * fx.arc : rnd(seed, k) * Math.PI * 2;
        const d = fx.arc ? r * (0.2 + rnd(k, seed) * 0.8) : r * Math.sqrt(rnd(k, seed));
        const px = x + Math.cos(ang) * d;
        const py = y + Math.sin(ang) * d;
        ctx.beginPath();
        ctx.moveTo(px - 2, py - 8 + f * 6);
        ctx.lineTo(px, py);
        ctx.stroke();
      }
      if (!fx.arc) ring(ctx, x, y, r, `${c}80`, 1);
      break;
    }
    case "beam": {
      // 굵은 빛줄기 (줄이면 toX·toY까지, 부채꼴이면 펼친 빛)
      if (fx.toX !== undefined && fx.toY !== undefined) {
        ctx.lineCap = "round";
        for (const [col, w] of [[c, r * 2 * t + 2], ["#ffffff", r * t + 1]] as const) {
          ctx.strokeStyle = col;
          ctx.lineWidth = w;
          ctx.globalAlpha = t;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(fx.toX, fx.toY);
          ctx.stroke();
        }
      } else cone(ctx, x, y, a, fx.arc ?? 0.8, r, c, t);
      break;
    }
    case "wave":
      if (fx.arc) cone(ctx, x, y, a, fx.arc, r * (0.4 + f * 0.6), c, t);
      else {
        ctx.globalAlpha = t;
        ring(ctx, x, y, r * (0.3 + f * 0.7), c, 4);
        ring(ctx, x, y, r * (0.2 + f * 0.6), "#ffffff", 1.5);
      }
      break;
    case "slash": {
      // 초승달 베기 자국 (줄이면 줄 따라 X자)
      ctx.globalAlpha = t;
      if (fx.toX !== undefined && fx.toY !== undefined) {
        ctx.strokeStyle = c;
        ctx.lineWidth = Math.max(2, r * t);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(fx.toX, fx.toY);
        ctx.stroke();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        const rr = Math.max(10, r);
        ctx.strokeStyle = c;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x, y, rr * (0.7 + f * 0.3), a - (fx.arc ?? 1.1), a + (fx.arc ?? 1.1));
        ctx.stroke();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      break;
    }
    case "spin": {
      // 둘레를 도는 칼날 셋
      ctx.globalAlpha = t;
      const rr = Math.max(12, r);
      for (let k = 0; k < 3; k++) {
        const aa = f * Math.PI * 4 + (k / 3) * Math.PI * 2;
        ctx.strokeStyle = c;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, rr, aa, aa + 0.9);
        ctx.stroke();
      }
      ring(ctx, x, y, rr, `${c}55`, 1);
      break;
    }
    case "dash":
    case "blink": {
      // 지나간 자리 잔상 · 순간이동 연기
      glow(ctx, x, y, r * 1.2, c, 0.6 * t);
      ctx.globalAlpha = t;
      for (let k = 0; k < 6; k++) {
        const aa = rnd(seed, k) * Math.PI * 2;
        const d = r * (0.3 + f) * rnd(k, seed + 1);
        ctx.fillStyle = k % 2 ? "#ffffff" : c;
        ctx.fillRect(Math.round(x + Math.cos(aa) * d), Math.round(y + Math.sin(aa) * d - f * 6), 2, 2);
      }
      break;
    }
    case "aura":
    case "heal":
    case "summon": {
      // 오라·회복·소환: 발밑 고리와 솟는 빛 (회복은 초록 +)
      glow(ctx, x, y, r, c, 0.5 * t);
      ctx.globalAlpha = t;
      ring(ctx, x, y + 2, r * (0.6 + f * 0.4), c, 2);
      for (let k = 0; k < 6; k++) {
        const px = x + (rnd(seed, k) - 0.5) * r * 1.4;
        const py = y - f * 20 - rnd(k, seed) * 8;
        ctx.fillStyle = style === "heal" ? "#7aff8a" : c;
        if (style === "heal") {
          ctx.fillRect(Math.round(px) - 1, Math.round(py), 3, 1);
          ctx.fillRect(Math.round(px), Math.round(py) - 1, 1, 3);
        } else ctx.fillRect(Math.round(px), Math.round(py), 2, 2);
      }
      break;
    }
    case "field": {
      // 장판: 흐릿한 원과 일렁이는 테두리
      ctx.globalAlpha = 0.25 + t * 0.2;
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.8;
      ctx.setLineDash([4, 3]);
      ctx.lineDashOffset = -f * 20;
      ring(ctx, x, y, r, c, 1.5);
      ctx.setLineDash([]);
      break;
    }
    case "net": {
      // 그물·속박: 원 안 격자
      ctx.globalAlpha = t;
      ring(ctx, x, y, r, c, 2);
      ctx.strokeStyle = c;
      ctx.lineWidth = 1;
      for (let k = -2; k <= 2; k++) {
        const o = (k / 2.5) * r;
        const h = Math.sqrt(Math.max(0, r * r - o * o));
        ctx.beginPath();
        ctx.moveTo(x + o, y - h);
        ctx.lineTo(x + o, y + h);
        ctx.moveTo(x - h, y + o);
        ctx.lineTo(x + h, y + o);
        ctx.stroke();
      }
      break;
    }
  }
  ctx.restore();
  drawMotif(ctx, fx, t, f, seed);
  return true;
}
