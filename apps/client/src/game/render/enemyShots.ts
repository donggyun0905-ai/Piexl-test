// 적 탄 모양 (화살·창·음표·거대 구슬·바위·검기·박쥐·그물·불덩이·빛 구슬·씨앗·영혼): 빛 번짐 · 지나온 꼬리 · 밝은 속
import type { ProjectileState } from "@pixel-rogue/shared";
import { additive, alpha, crescent, glow } from "./pwFxBits";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;

/** 지나온 쪽으로 가늘어지는 빛 꼬리 */
function tail(ctx: Ctx, x: number, y: number, dx: number, dy: number, len: number, w: number, c: string, a = 0.7): void {
  const g = ctx.createLinearGradient(x, y, x - dx * len, y - dy * len);
  g.addColorStop(0, alpha(c, a));
  g.addColorStop(1, alpha(c, 0));
  ctx.strokeStyle = g;
  ctx.lineWidth = w;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - dx * len, y - dy * len);
  ctx.stroke();
  ctx.lineCap = "butt";
}

/** 빛나는 구슬: 바깥 빛 · 어두운 테두리 · 색 · 흰 속 */
function orb(ctx: Ctx, x: number, y: number, r: number, c: string, rim: string): void {
  additive(ctx, () => glow(ctx, x, y, r * 2.6, c, 0.8));
  ctx.fillStyle = rim;
  ctx.beginPath();
  ctx.arc(x, y, r + 0.8, 0, TAU);
  ctx.fill();
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(x - r * 0.25, y - r * 0.25, Math.max(0.8, r * 0.35), 0, TAU);
  ctx.fill();
}

/** 적 탄 (pr.look이 있는 것) 그리기 */
export function drawLookShot(ctx: Ctx, pr: ProjectileState, x: number, y: number, tick: number): void {
  const sp = Math.hypot(pr.vx, pr.vy) || 1;
  const dx = pr.vx / sp;
  const dy = pr.vy / sp;
  const a = Math.atan2(dy, dx);
  switch (pr.look) {
    case "arrow":
    case "spear": {
      // 화살·창: 바람을 가르는 빛 꼬리 + 나무 자루 + 쇠 촉
      const len = pr.look === "spear" ? 11 : 7;
      additive(ctx, () => tail(ctx, x, y, dx, dy, len * 2.2, 3, "#ffe0b0", 0.5));
      ctx.strokeStyle = pr.look === "spear" ? "#8a5a30" : "#c8b088";
      ctx.lineWidth = pr.look === "spear" ? 1.6 : 1;
      ctx.beginPath();
      ctx.moveTo(x - dx * len, y - dy * len);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.fillStyle = "#eef2fa";
      ctx.beginPath();
      ctx.moveTo(x + dx * 3, y + dy * 3);
      ctx.lineTo(x - dy * 1.8, y + dx * 1.8);
      ctx.lineTo(x + dy * 1.8, y - dx * 1.8);
      ctx.fill();
      return;
    }
    case "note": {
      const r = pr.r;
      const c = pr.lure ? "#ff8ad8" : "#7ae0f0";
      additive(ctx, () => glow(ctx, x, y - r * 0.6, r * 3, c, 0.7));
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.ellipse(x, y, r * 0.8, r * 0.6, -0.4, 0, TAU);
      ctx.fill();
      ctx.fillRect(Math.round(x + r * 0.6), Math.round(y - r * 2.2), 1, Math.round(r * 2.2));
      ctx.fillRect(Math.round(x + r * 0.6), Math.round(y - r * 2.2), Math.round(r), 1 + (Math.floor(tick / 8) % 2));
      return;
    }
    case "orbRuin":
    case "orbChaos": {
      // 갓이터 거대 구슬: 소용돌이 치는 테두리 + 밝은 핵
      const ruin = pr.look === "orbRuin";
      const c = ruin ? "#ff5a4a" : "#a070ff";
      additive(ctx, () => {
        glow(ctx, x, y, pr.r * 2.4, c, 0.8);
        ctx.strokeStyle = alpha(ruin ? "#ffb0a0" : "#e0c8ff", 0.8);
        ctx.lineWidth = 1.5;
        for (let k = 0; k < 3; k++) {
          const s0 = tick / 8 + (k * TAU) / 3;
          ctx.beginPath();
          ctx.arc(x, y, pr.r + 1, s0, s0 + 1.2);
          ctx.stroke();
        }
      });
      orb(ctx, x, y, pr.r * 0.7, ruin ? "#ff8a7a" : "#c8a0ff", ruin ? "#4a0a0a" : "#1e0a3a");
      return;
    }
    case "rock": {
      // 바위 파편: 바닥 그림자 · 먼지 꼬리 · 모난 돌
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.ellipse(x, y + 5, 3.5, 1.5, 0, 0, TAU);
      ctx.fill();
      tail(ctx, x, y, dx, dy, 10, 4, "#a08a70", 0.45);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(tick / 5 + pr.id);
      ctx.fillStyle = "#5a4a3a";
      ctx.beginPath();
      ctx.moveTo(-3.5, -1);
      ctx.lineTo(-1, -3.5);
      ctx.lineTo(3, -2);
      ctx.lineTo(3.5, 2);
      ctx.lineTo(0, 3.5);
      ctx.lineTo(-3, 2.5);
      ctx.fill();
      ctx.fillStyle = "#9a8a7a";
      ctx.fillRect(-2, -2.5, 3, 2);
      ctx.restore();
      return;
    }
    case "bigwave":
    case "wave": {
      // 검기: 날아가는 쪽으로 휜 빛 초승달 (거대 검기는 붉은 기운)
      const big = pr.look === "bigwave";
      const r = big ? pr.r * 1.6 : 6;
      additive(ctx, () => {
        crescent(ctx, x - dx * (big ? pr.r : 3), y - dy * (big ? pr.r : 3), r, a, 1.05, big ? 6 : 3, big ? "#ff4a4a" : "#c8d8ff", 0.9);
        crescent(ctx, x - dx * (big ? pr.r + 4 : 5), y - dy * (big ? pr.r + 4 : 5), r * 0.9, a, 0.9, big ? 4 : 2, big ? "#ff8a6a" : "#ffffff", 0.4);
      });
      return;
    }
    case "bat": {
      const up = Math.floor(tick / 4) % 2 === 0;
      ctx.fillStyle = "#2a1a3a";
      ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 3, 3);
      ctx.fillRect(Math.round(x) - 4, Math.round(y) - (up ? 2 : 0), 3, 2);
      ctx.fillRect(Math.round(x) + 2, Math.round(y) - (up ? 2 : 0), 3, 2);
      additive(ctx, () => glow(ctx, x + 0.5, y + 0.5, 3, "#ff3a3a", 0.9));
      ctx.fillStyle = "#ff5a5a";
      ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
      return;
    }
    case "net": {
      // 빛의 그물: 도는 격자 원
      additive(ctx, () => glow(ctx, x, y, pr.r * 2, "#fff0b0", 0.6));
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(tick / 20);
      ctx.strokeStyle = "#fff4c8";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, pr.r + 1, 0, TAU);
      for (const k of [-0.5, 0, 0.5]) {
        ctx.moveTo(-pr.r, k * pr.r);
        ctx.lineTo(pr.r, k * pr.r);
        ctx.moveTo(k * pr.r, -pr.r);
        ctx.lineTo(k * pr.r, pr.r);
      }
      ctx.stroke();
      ctx.restore();
      return;
    }
    case "fire": {
      // 불덩이: 뒤로 끌리는 불꼬리 + 일렁이는 테두리 + 흰 노랑 속
      additive(ctx, () => {
        tail(ctx, x, y, dx, dy, pr.r * 5, pr.r * 2, "#ff6a1a", 0.7);
        tail(ctx, x, y, dx, dy, pr.r * 3, pr.r, "#ffd040", 0.8);
        glow(ctx, x, y, pr.r * 3, "#ff7a2a", 0.8);
      });
      const fl = 1 + Math.sin(tick / 2 + pr.id) * 0.12;
      ctx.fillStyle = "#ff6a1a";
      ctx.beginPath();
      ctx.arc(x, y, (pr.r + 1) * fl, 0, TAU);
      ctx.fill();
      ctx.fillStyle = "#ffe08a";
      ctx.beginPath();
      ctx.arc(x, y, pr.r * 0.55, 0, TAU);
      ctx.fill();
      return;
    }
    case "light": {
      // 빛 구슬: 도는 빛살 넷 + 금빛 테두리
      additive(ctx, () => {
        glow(ctx, x, y, pr.r * 3, "#ffd870", 0.9, 1);
        ctx.strokeStyle = "rgba(255,248,220,0.7)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let k = 0; k < 4; k++) {
          const b = tick / 15 + (k * Math.PI) / 2;
          ctx.moveTo(x + Math.cos(b) * pr.r, y + Math.sin(b) * pr.r);
          ctx.lineTo(x + Math.cos(b) * pr.r * 2.6, y + Math.sin(b) * pr.r * 2.6);
        }
        ctx.stroke();
      });
      orb(ctx, x, y, pr.r * 0.7, "#fff4c8", "#a07a20");
      return;
    }
    default: {
      // 씨앗·영혼·그 밖: 색 구슬 + 꼬리
      const c = pr.look === "seed" ? "#8ad050" : pr.look === "soul" ? "#b890ff" : "#ffffff";
      additive(ctx, () => tail(ctx, x, y, dx, dy, 9, 3, c, 0.6));
      orb(ctx, x, y, 2, c, pr.look === "seed" ? "#1a3a0a" : "#1a0a2a");
    }
  }
}
