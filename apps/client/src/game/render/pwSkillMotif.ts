// 패왕전 스킬 그림 위에 얹는 캐릭터 느낌 (fx.motif, pwKits.PW_MOTIF): 같은 모양 스킬도 캐릭터마다 다르게 보이게
// 불(솟는 불꽃) · 얼음/원소(결정·번갈아) · 번개(지그재그) · 독(거품) · 그림자(검은 연기) · 빛(반짝이·십자) · 피(방울) · 자연(잎) · 영혼(부적·혼불)
// 기계(네모 불똥·육각) · 바람(소용돌이 줄) · 시간(시계 바늘) · 충격(금·파편) · 칼날(가는 베기 줄) · 야수(발톱 자국) · 쥐(쥐떼가 줄을 따라 달림)
// 줄 모양 스킬(toX·toY)은 줄을 따라, 나머지는 범위 안에 뿌림. 궁극기는 알갱이 두 배 + 바깥 빛 고리
import type { EffectState } from "@pixel-rogue/shared";
import { additive, glow, rnd } from "./pwFxBits";

type Ctx = CanvasRenderingContext2D;


/** 알갱이 자리 k개: 줄이면 줄 위, 부채꼴이면 앞쪽, 아니면 원 안 */
function spots(fx: EffectState, n: number, seed: number): [number, number][] {
  const out: [number, number][] = [];
  const a = Math.atan2(fx.dirY, fx.dirX);
  for (let k = 0; k < n; k++) {
    const u = rnd(seed, k);
    const v = rnd(k, seed);
    if (fx.toX !== undefined && fx.toY !== undefined) {
      const side = (v - 0.5) * fx.size * 1.6;
      const nx = -fx.dirY;
      const ny = fx.dirX;
      out.push([fx.x + (fx.toX - fx.x) * u + nx * side, fx.y + (fx.toY - fx.y) * u + ny * side]);
    } else {
      const ang = fx.arc ? a + (u - 0.5) * 2 * fx.arc : u * Math.PI * 2;
      const d = fx.size * Math.sqrt(v);
      out.push([fx.x + Math.cos(ang) * d, fx.y + Math.sin(ang) * d]);
    }
  }
  return out;
}

const px = (ctx: Ctx, x: number, y: number, w: number, h: number, c: string) => {
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
};

const SCALE = 1.7;
/** 빛나는 느낌 (겹치면 밝아짐) · 나머지(연기·피·잎 등)는 그냥 칠함 */
const GLOWING = new Set(["fire", "elements", "ice", "lightning", "holy", "spirit", "tech", "time", "wind", "blade", "beast"]);

type Draw = (ctx: Ctx, x: number, y: number, k: number, t: number, f: number, c: string, fx: EffectState) => void;

const MOTIFS: Record<string, Draw> = {
  fire: (ctx, x, y, k, t, f) => {
    // 솟아오르며 작아지는 불씨 (주황 → 노랑 속)
    const yy = y - f * 12 - (k % 4);
    const s = (2.4 + (k % 3) * 0.6) * (1 - f * 0.6);
    glow(ctx, x, yy, s * 2, "#ff5a1a", 0.9 * t);
    glow(ctx, x, yy, s, "#ffd040", t, 1);
  },
  elements: (ctx, x, y, k, t, f) => MOTIFS[["fire", "ice", "lightning"][k % 3]!]!(ctx, x, y, k, t, f, "", {} as EffectState),
  ice: (ctx, x, y, k) => {
    px(ctx, x, y - 2, 1, 5, "#c8f0ff");
    px(ctx, x - 2, y, 5, 1, "#c8f0ff");
    if (k % 2) px(ctx, x, y, 1, 1, "#ffffff");
  },
  lightning: (ctx, x, y, k) => {
    ctx.strokeStyle = k % 2 ? "#fff8a0" : "#8ad8ff";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y - 6);
    ctx.lineTo(x + 2, y - 2);
    ctx.lineTo(x - 1, y);
    ctx.lineTo(x + 1, y + 4);
    ctx.stroke();
  },
  poison: (ctx, x, y, k, t, f) => {
    // 떠오르다 터지는 독 거품 (밝은 점 하나)
    const yy = y - f * 9;
    const r = 1.4 + (k % 3) * 0.6;
    ctx.fillStyle = `rgba(110,210,70,${0.35 * t})`;
    ctx.beginPath();
    ctx.arc(x, yy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `rgba(190,255,120,${0.9 * t})`;
    ctx.lineWidth = 0.6;
    ctx.stroke();
    ctx.fillStyle = `rgba(255,255,255,${0.8 * t})`;
    ctx.fillRect(x - r * 0.4, yy - r * 0.5, 0.6, 0.6);
  },
  shadow: (ctx, x, y, k, t, f) => {
    // 흩어지며 사라지는 보랏빛 그림자 연기
    const yy = y - f * 7;
    const r = (2 + (k % 3)) * (0.6 + f * 0.6);
    const g = ctx.createRadialGradient(x, yy, 0, x, yy, r);
    g.addColorStop(0, `rgba(40,20,70,${0.55 * t})`);
    g.addColorStop(0.6, `rgba(90,50,150,${0.3 * t})`);
    g.addColorStop(1, "rgba(90,50,150,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x + Math.sin(f * 6 + k) * 1.5, yy, r, 0, Math.PI * 2);
    ctx.fill();
  },
  holy: (ctx, x, y, k, t, f) => {
    // 반짝이는 네 갈래 별
    const s = (k % 3 === 0 ? 4 : 2.5) * (0.6 + 0.4 * Math.sin(f * 12 + k));
    const yy = y - f * 6;
    ctx.fillStyle = `rgba(255,246,200,${t})`;
    ctx.beginPath();
    ctx.moveTo(x, yy - s);
    ctx.lineTo(x + s * 0.25, yy);
    ctx.lineTo(x, yy + s);
    ctx.lineTo(x - s * 0.25, yy);
    ctx.closePath();
    ctx.moveTo(x - s, yy);
    ctx.lineTo(x, yy + s * 0.25);
    ctx.lineTo(x + s, yy);
    ctx.lineTo(x, yy - s * 0.25);
    ctx.closePath();
    ctx.fill();
    glow(ctx, x, yy, s, "#fff0a0", 0.6 * t);
  },
  blood: (ctx, x, y, k, t, f) => {
    // 튀는 핏방울 (둥근 머리 + 가는 꼬리)
    const yy = y + f * 5 - (1 - f) * 2;
    ctx.fillStyle = `rgba(200,16,42,${t})`;
    ctx.beginPath();
    ctx.arc(x, yy, 1.1 + (k % 2) * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x - 0.3, yy - 2.2, 0.6, 2);
    ctx.fillStyle = `rgba(255,120,130,${0.8 * t})`;
    ctx.fillRect(x - 0.5, yy - 0.6, 0.5, 0.5);
  },
  nature: (ctx, x, y, k, t, f) => {
    // 흔들리며 날리는 잎사귀 (잎맥 하나)
    ctx.save();
    ctx.translate(x + Math.sin(f * 5 + k) * 3, y - f * 7);
    ctx.rotate(f * 4 + k);
    ctx.fillStyle = k % 2 ? `rgba(110,216,74,${t})` : `rgba(168,232,106,${t})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, 2.2, 1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `rgba(40,110,30,${t})`;
    ctx.lineWidth = 0.4;
    ctx.beginPath();
    ctx.moveTo(-2, 0);
    ctx.lineTo(2, 0);
    ctx.stroke();
    ctx.restore();
  },
  spirit: (ctx, x, y, k, t, f) => {
    if (k % 3 === 0) {
      // 부적 종이
      px(ctx, x - 1, y - f * 8 - 3, 3, 5, "#ffe8a0");
      px(ctx, x, y - f * 8 - 2, 1, 3, "#c82a2a");
    } else {
      ctx.fillStyle = "#a8e8ff";
      ctx.beginPath();
      ctx.arc(x, y - f * 10, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  tech: (ctx, x, y, k, t, f) => {
    // 빛나는 회로 불똥: 꺾인 짧은 선 + 끝에 빛 점
    const d = f * 5 * (k % 2 ? 1 : -1);
    ctx.strokeStyle = k % 2 ? `rgba(90,216,255,${t})` : `rgba(255,208,96,${t})`;
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + d, y);
    ctx.lineTo(x + d, y - 2.5);
    ctx.stroke();
    glow(ctx, x + d, y - 2.5, 2, k % 2 ? "#5ad8ff" : "#ffd060", t, 1);
  },
  wind: (ctx, x, y, k, t, f) => {
    ctx.strokeStyle = "#e8f4ff";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, 3 + (k % 3), f * 6 + k, f * 6 + k + 2.2);
    ctx.stroke();
  },
  time: (ctx, x, y, k, t, f) => {
    ctx.strokeStyle = "#e8d8a0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(f * 8 + k) * 3, y + Math.sin(f * 8 + k) * 3);
    ctx.stroke();
  },
  impact: (ctx, x, y, k, t, f) => {
    // 튀어 오르는 돌 조각 (작은 삼각형)
    const dx = (rnd(k, 3) - 0.5) * f * 14;
    const dy = (rnd(3, k) - 0.5) * f * 10 - f * (1 - f) * 16;
    ctx.fillStyle = k % 2 ? `rgba(200,176,144,${t})` : `rgba(140,120,100,${t})`;
    ctx.beginPath();
    ctx.moveTo(x + dx, y + dy - 1.5);
    ctx.lineTo(x + dx + 1.5, y + dy + 1);
    ctx.lineTo(x + dx - 1.5, y + dy + 1);
    ctx.closePath();
    ctx.fill();
  },
  blade: (ctx, x, y, k) => {
    ctx.strokeStyle = k % 2 ? "#ffffff" : "#c8d8ff";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - 4, y + 2);
    ctx.lineTo(x + 4, y - 2);
    ctx.stroke();
  },
  beast: (ctx, x, y, k, t) => {
    if (k % 2) return;
    // 휘어진 발톱 자국 셋 (흰 빛)
    ctx.strokeStyle = `rgba(255,255,255,${t})`;
    ctx.lineWidth = 0.9;
    ctx.lineCap = "round";
    for (let j = -1; j <= 1; j++) {
      ctx.beginPath();
      ctx.moveTo(x - 3 + j * 2, y - 4);
      ctx.quadraticCurveTo(x + j * 2, y - 1, x + 1.5 + j * 2, y + 4);
      ctx.stroke();
    }
    ctx.lineCap = "butt";
  },
};

/** 쥐떼: 줄의 시작에서 끝으로 달려감 (몸·귀·꼬리) */
function rats(ctx: Ctx, fx: EffectState, f: number, seed: number): void {
  const n = fx.ult ? 12 : 8;
  const toX = fx.toX ?? fx.x + fx.dirX * fx.size;
  const toY = fx.toY ?? fx.y + fx.dirY * fx.size;
  for (let k = 0; k < n; k++) {
    const u = Math.min(1, f * 1.3 - rnd(seed, k) * 0.3);
    if (u < 0) continue;
    const side = (rnd(k, seed) - 0.5) * 14;
    const x = fx.x + (toX - fx.x) * u - fx.dirY * side;
    const y = fx.y + (toY - fx.y) * u + fx.dirX * side + (Math.floor((f * 40 + k) % 2) ? -1 : 0);
    const d = Math.sign(fx.dirX || 1);
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    ctx.scale(2, 2);
    px(ctx, -3, -2, 6, 3, "#1a1410");
    px(ctx, -2, -2, 4, 2, "#8a7a68");
    px(ctx, d * 2, -3, 1, 1, "#e8b0b0");
    px(ctx, d * 3, -1, 1, 1, "#ff3a3a");
    px(ctx, -d * 4, 0, 2, 1, "#c8a0a0");
    ctx.restore();
  }
}

export function drawMotif(ctx: Ctx, fx: EffectState, t: number, f: number, seed: number): void {
  const m = fx.motif;
  if (!m) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, t * 1.4);
  if (m === "rats") rats(ctx, fx, f, seed);
  else {
    const draw = MOTIFS[m];
    if (draw) {
      const n = Math.round((fx.ult ? 22 : 11) * Math.min(2, Math.max(0.6, fx.size / 30)));
      // 알갱이는 1.7배로 (작은 도트가 묻히지 않게) · 빛나는 느낌은 겹치면 밝아지게
      const each = () => {
        for (const [k, [x, y]] of spots(fx, n, seed).entries()) {
          ctx.save();
          ctx.translate(Math.round(x), Math.round(y));
          ctx.scale(SCALE, SCALE);
          draw(ctx, 0, 0, k, t, f, fx.tint ?? "#ffffff", fx);
          ctx.restore();
        }
      };
      if (GLOWING.has(m)) additive(ctx, each);
      else each();
    }
  }
  // 궁극기: 바깥으로 번지는 두 겹 빛 고리
  if (fx.ult && fx.toX === undefined) {
    ctx.globalAlpha = t * 0.8;
    ctx.strokeStyle = fx.tint ?? "#ffffff";
    ctx.lineWidth = 2;
    for (const s of [1, 1.35]) {
      ctx.beginPath();
      ctx.arc(fx.x, fx.y, Math.max(1, fx.size * s * (0.6 + f * 0.6)), 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  ctx.restore();
}
