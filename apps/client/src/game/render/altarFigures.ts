// 제단의 방 거대한 성좌 그림 1: 흰수염고래 · 용암 거북 · 천둥 매 · 세실리아 (방을 감쌀 만큼 크게, 반투명 + 별자리 점·선)
// (cx, cy) = 방 가운데 위쪽 · W = 방 너비 · t = 틱. 나머지 넷은 altarFigures2
import { additive, alpha, glow } from "./pwFxBits";

type Ctx = CanvasRenderingContext2D;

/** 모양 칠하기: 위→아래 그라데이션 · 반투명 · 빛나는 테두리 */
export function body(ctx: Ctx, path: () => void, top: number, bottom: number, a: string, b: string, al: number): void {
  ctx.save();
  ctx.globalAlpha *= al;
  ctx.beginPath();
  path();
  const g = ctx.createLinearGradient(0, top, 0, bottom);
  g.addColorStop(0, a);
  g.addColorStop(1, b);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = alpha(a, 0.9);
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}

/** 별자리: 점(반짝임) + 이은 선 */
export function stars(ctx: Ctx, pts: readonly (readonly [number, number])[], color: string, t: number): void {
  ctx.strokeStyle = alpha(color, 0.45);
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.stroke();
  additive(ctx, () => {
    pts.forEach(([x, y], i) => {
      const tw = 0.6 + 0.4 * Math.sin(t / 9 + i * 1.7);
      glow(ctx, x, y, 6, color, tw, 1);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(Math.round(x) - 1, Math.round(y), 3, 1);
      ctx.fillRect(Math.round(x), Math.round(y) - 1, 1, 3);
    });
  });
}

/** 흰수염고래: 방을 가로지르는 몸 · 꼬리 · 가슴지느러미 · 배 주름 · 천천히 떠오르내림 */
export function drawWhale(ctx: Ctx, cx: number, cy: number, W: number, t: number): void {
  const y = cy + Math.sin(t / 60) * 4;
  const L = W * 0.42;
  body(ctx, () => {
    ctx.moveTo(cx - L, y);
    ctx.bezierCurveTo(cx - L * 0.8, y - 34, cx + L * 0.5, y - 40, cx + L * 0.8, y - 8);
    ctx.lineTo(cx + L * 1.05, y - 28 + Math.sin(t / 25) * 4);
    ctx.lineTo(cx + L * 0.98, y + 2);
    ctx.lineTo(cx + L * 1.06, y + 22 + Math.sin(t / 25) * 4);
    ctx.lineTo(cx + L * 0.8, y + 8);
    ctx.bezierCurveTo(cx + L * 0.4, y + 32, cx - L * 0.7, y + 30, cx - L, y);
  }, y - 40, y + 32, "#6ab8ff", "#0a3a6a", 0.55);
  // 가슴지느러미 · 배 주름 · 눈
  body(ctx, () => {
    ctx.moveTo(cx - L * 0.45, y + 16);
    ctx.quadraticCurveTo(cx - L * 0.3, y + 44, cx - L * 0.15, y + 34);
    ctx.quadraticCurveTo(cx - L * 0.28, y + 26, cx - L * 0.35, y + 16);
  }, y + 16, y + 44, "#8ad0ff", "#1a4a7a", 0.5);
  ctx.strokeStyle = alpha("#d8f0ff", 0.35);
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(cx - L * 0.85 + i * 8, y + 10 + i);
    ctx.quadraticCurveTo(cx - L * 0.4 + i * 8, y + 22, cx + L * 0.1 + i * 6, y + 18 - i);
    ctx.stroke();
  }
  additive(ctx, () => glow(ctx, cx - L * 0.78, y - 6, 6, "#ffffff", 0.9, 1));
  stars(ctx, [[cx - L * 0.9, y - 4], [cx - L * 0.4, y - 24], [cx + L * 0.2, y - 26], [cx + L * 0.75, y - 6], [cx + L * 1.02, y - 24], [cx + L * 0.98, y + 2], [cx + L * 1.03, y + 20]], "#bfe8ff", t);
}

/** 용암 거북: 거대한 등딱지(육각 무늬에 용암이 맥박) · 머리 · 네 다리 */
export function drawTurtle(ctx: Ctx, cx: number, cy: number, W: number, t: number): void {
  const R = W * 0.3;
  const y = cy + 10;
  for (const [dx, dy] of [[-0.8, 0.5], [0.8, 0.5], [-0.65, -0.2], [0.65, -0.2]] as const) {
    body(ctx, () => ctx.ellipse(cx + dx * R, y + dy * R * 0.6, 16, 10, dx * 0.4, 0, Math.PI * 2), y - 10, y + 30, "#7a3a2a", "#2a0e08", 0.7);
  }
  body(ctx, () => ctx.ellipse(cx, y - R * 0.55 - 10, 18, 14, 0, 0, Math.PI * 2), y - R, y - R * 0.4, "#9a4a32", "#3a1408", 0.75);
  additive(ctx, () => {
    glow(ctx, cx - 7, y - R * 0.6 - 12, 4, "#ffd08a", 1, 1);
    glow(ctx, cx + 7, y - R * 0.6 - 12, 4, "#ffd08a", 1, 1);
  });
  body(ctx, () => ctx.ellipse(cx, y, R, R * 0.62, 0, Math.PI, Math.PI * 2), y - R * 0.62, y, "#5a2a1e", "#1a0804", 0.85);
  body(ctx, () => ctx.ellipse(cx, y, R, 10, 0, 0, Math.PI), y, y + 10, "#3a1a10", "#1a0804", 0.85);
  // 등딱지 육각 무늬: 용암이 맥박처럼
  const pulse = 0.5 + 0.5 * Math.sin(t / 15);
  ctx.strokeStyle = alpha("#ff7a2a", 0.4 + 0.5 * pulse);
  ctx.lineWidth = 2;
  for (let row = 0; row < 3; row++) {
    for (let col = -2 + (row % 2) * 0.5; col <= 2; col++) {
      const hx = cx + col * 26;
      const hy = y - 12 - row * 18;
      if ((hx - cx) ** 2 / R ** 2 + (hy - y) ** 2 / (R * 0.62) ** 2 > 0.8) continue;
      ctx.beginPath();
      for (let k = 0; k <= 6; k++) ctx.lineTo(hx + Math.cos((k * Math.PI) / 3) * 10, hy + Math.sin((k * Math.PI) / 3) * 7);
      ctx.stroke();
    }
  }
  additive(ctx, () => glow(ctx, cx, y - R * 0.3, R * 0.9, "#ff6a2a", 0.25 + 0.15 * pulse));
  stars(ctx, [[cx - R, y], [cx - R * 0.6, y - R * 0.5], [cx, y - R * 0.62], [cx + R * 0.6, y - R * 0.5], [cx + R, y], [cx, y - R * 0.55 - 10]], "#ffd08a", t);
}

/** 천둥 매: 방 너비만큼 편 날개(깃털 줄) · 머리·부리 · 날개 끝 사이로 번개가 튐 */
export function drawHawk(ctx: Ctx, cx: number, cy: number, W: number, t: number): void {
  const y = cy + Math.sin(t / 40) * 3;
  const span = W * 0.47;
  const flap = Math.sin(t / 30) * 6;
  for (const side of [-1, 1]) {
    body(ctx, () => {
      ctx.moveTo(cx, y);
      ctx.quadraticCurveTo(cx + side * span * 0.5, y - 40 - flap, cx + side * span, y - 30 - flap);
      for (let k = 0; k < 6; k++) ctx.lineTo(cx + side * (span - k * span * 0.12), y - 8 + k * 6 + (k % 2) * 5);
      ctx.quadraticCurveTo(cx + side * span * 0.25, y + 30, cx, y + 16);
    }, y - 46, y + 30, "#fff4a0", "#3a3a6a", 0.55);
    ctx.strokeStyle = alpha("#ffffff", 0.3);
    for (let k = 1; k < 6; k++) {
      ctx.beginPath();
      ctx.moveTo(cx + side * 12, y + 2);
      ctx.lineTo(cx + side * (span - k * span * 0.12), y - 6 + k * 6 - flap * 0.3);
      ctx.stroke();
    }
  }
  body(ctx, () => {
    ctx.moveTo(cx - 10, y + 24);
    ctx.quadraticCurveTo(cx - 14, y - 26, cx, y - 34);
    ctx.lineTo(cx + 6, y - 28);
    ctx.lineTo(cx + 2, y - 24);
    ctx.quadraticCurveTo(cx + 14, y - 8, cx + 10, y + 24);
  }, y - 34, y + 24, "#fffbe0", "#4a4a7a", 0.7);
  additive(ctx, () => glow(ctx, cx + 1, y - 28, 4, "#ffe04a", 1, 1));
  // 번개: 날개 끝 → 몸 (몇 틱마다 번쩍)
  if (t % 50 < 6) {
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    for (const side of [-1, 1]) {
      ctx.beginPath();
      let x = cx + side * span;
      let yy = y - 30;
      ctx.moveTo(x, yy);
      for (let k = 0; k < 6; k++) {
        x -= (side * span) / 6;
        yy += Math.sin(t * 3 + k * 7) * 10 + 4;
        ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }
    additive(ctx, () => glow(ctx, cx, y, span * 0.6, "#ffe04a", 0.35));
  }
  stars(ctx, [[cx - span, y - 30 - flap], [cx - span * 0.5, y - 26], [cx, y - 34], [cx + span * 0.5, y - 26], [cx + span, y - 30 - flap]], "#ffffff", t);
}

/** 세실리아(바람 대정령): 바람으로 된 여인 · 흩날리는 머리카락·드레스가 소용돌이 줄로 */
export function drawWind(ctx: Ctx, cx: number, cy: number, W: number, t: number): void {
  const y = cy + Math.sin(t / 45) * 4;
  const H = 80;
  body(ctx, () => {
    ctx.moveTo(cx - 8, y - H * 0.55);
    ctx.quadraticCurveTo(cx - 22, y, cx - W * 0.32, y + H * 0.45 + Math.sin(t / 20) * 6);
    ctx.quadraticCurveTo(cx, y + H * 0.3, cx + W * 0.32, y + H * 0.45 + Math.cos(t / 20) * 6);
    ctx.quadraticCurveTo(cx + 22, y, cx + 8, y - H * 0.55);
  }, y - H * 0.55, y + H * 0.5, "#c8fff0", "#0a5a4a", 0.5);
  body(ctx, () => ctx.ellipse(cx, y - H * 0.65, 9, 11, 0, 0, Math.PI * 2), y - H * 0.8, y - H * 0.5, "#e8fff8", "#3a8a7a", 0.75);
  // 머리카락: 옆으로 길게 흩날리는 바람 줄
  ctx.lineWidth = 2;
  for (let k = 0; k < 7; k++) {
    ctx.strokeStyle = alpha(k % 2 ? "#5ae8c0" : "#e0fff4", 0.55);
    ctx.beginPath();
    const yy = y - H * 0.7 + k * 3;
    ctx.moveTo(cx, yy);
    for (let j = 1; j <= 8; j++) ctx.lineTo(cx + j * (W * 0.05), yy + Math.sin(t / 12 + j * 0.8 + k) * (4 + j));
    ctx.stroke();
  }
  // 팔: 양옆으로 펼쳐 바람을 부름
  for (const side of [-1, 1]) {
    ctx.strokeStyle = alpha("#c8fff0", 0.6);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx + side * 8, y - H * 0.45);
    ctx.quadraticCurveTo(cx + side * 40, y - H * 0.7, cx + side * 64, y - H * 0.5 + Math.sin(t / 18) * 5);
    ctx.stroke();
  }
  stars(ctx, [[cx - 64, y - H * 0.5], [cx, y - H * 0.65], [cx + 64, y - H * 0.5], [cx + W * 0.32, y + H * 0.45], [cx - W * 0.32, y + H * 0.45], [cx - 64, y - H * 0.5]], "#e0fff4", t);
}
