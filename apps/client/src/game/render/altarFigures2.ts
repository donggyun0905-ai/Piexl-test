// 제단의 방 거대한 성좌 그림 2: 시온(빛과 어둠의 사람 모습) · 실베스타(그린우드의 숲 수호자) · 세티아(일곱 갈래의 마녀) · ???(알 수 없는 성좌)
import { additive, alpha, glow, rnd } from "./pwFxBits";
import { body, stars } from "./altarFigures";

type Ctx = CanvasRenderingContext2D;

/** 사람 모습 실루엣 (머리·어깨·긴 옷자락) */
function figure(ctx: Ctx, cx: number, y: number, H: number, wide: number): void {
  ctx.moveTo(cx - 6, y - H * 0.5);
  ctx.quadraticCurveTo(cx - 24, y - H * 0.45, cx - 26, y - H * 0.3);
  ctx.quadraticCurveTo(cx - wide * 0.6, y + H * 0.2, cx - wide, y + H * 0.5);
  ctx.lineTo(cx + wide, y + H * 0.5);
  ctx.quadraticCurveTo(cx + wide * 0.6, y + H * 0.2, cx + 26, y - H * 0.3);
  ctx.quadraticCurveTo(cx + 24, y - H * 0.45, cx + 6, y - H * 0.5);
}

/** 시온: 왼쪽은 빛(금빛·하얀 날개), 오른쪽은 어둠(보라·검은 날개) · 뒤에 반은 빛·반은 어둠인 고리 · 도는 빛·어둠 구슬 */
export function drawSion(ctx: Ctx, cx: number, cy: number, W: number, t: number): void {
  const y = cy + Math.sin(t / 50) * 3;
  const H = 86;
  additive(ctx, () => {
    glow(ctx, cx - 30, y - 10, 70, "#fff0b0", 0.35);
    glow(ctx, cx + 30, y - 10, 70, "#8a5aff", 0.35);
  });
  for (const side of [-1, 1]) {
    body(ctx, () => {
      ctx.moveTo(cx + side * 10, y - H * 0.35);
      for (let k = 0; k < 5; k++) ctx.quadraticCurveTo(cx + side * (40 + k * 22), y - H * 0.6 + k * 10, cx + side * (W * 0.44 - k * 14), y - H * 0.2 + k * 14);
      ctx.lineTo(cx + side * 16, y);
    }, y - H * 0.6, y + 10, side < 0 ? "#ffffff" : "#5a3a8a", side < 0 ? "#c8a84a" : "#0a0414", 0.5);
  }
  ctx.save();
  ctx.beginPath();
  ctx.rect(cx - W, y - H, W, H * 2);
  ctx.clip();
  body(ctx, () => figure(ctx, cx, y, H, 40), y - H * 0.5, y + H * 0.5, "#fffbe8", "#c8a84a", 0.65);
  ctx.restore();
  ctx.save();
  ctx.beginPath();
  ctx.rect(cx, y - H, W, H * 2);
  ctx.clip();
  body(ctx, () => figure(ctx, cx, y, H, 40), y - H * 0.5, y + H * 0.5, "#4a2a6a", "#0a0414", 0.75);
  ctx.restore();
  body(ctx, () => ctx.ellipse(cx, y - H * 0.6, 10, 12, 0, 0, Math.PI * 2), y - H * 0.75, y - H * 0.45, "#fff8e0", "#3a2a5a", 0.8);
  ctx.lineWidth = 2;
  ctx.strokeStyle = alpha("#fff0b0", 0.8);
  ctx.beginPath();
  ctx.arc(cx, y - H * 0.6, 20, Math.PI * 0.5, Math.PI * 1.5);
  ctx.stroke();
  ctx.strokeStyle = alpha("#b48aff", 0.8);
  ctx.beginPath();
  ctx.arc(cx, y - H * 0.6, 20, -Math.PI * 0.5, Math.PI * 0.5);
  ctx.stroke();
  additive(ctx, () => {
    for (let i = 0; i < 6; i++) {
      const a = t / 40 + (i * Math.PI) / 3;
      glow(ctx, cx + Math.cos(a) * 60, y - 10 + Math.sin(a) * 22, 6, i % 2 ? "#b48aff" : "#fff0b0", 0.9, 1);
    }
  });
  stars(ctx, [[cx - W * 0.44, y - H * 0.2], [cx - 26, y - H * 0.3], [cx, y - H * 0.6], [cx + 26, y - H * 0.3], [cx + W * 0.44, y - H * 0.2]], "#ffffff", t);
}

/** 실베스타: 사슴뿔 같은 가지를 인 숲의 수호자 · 덩굴 옷자락 · 떨어지는 잎 */
export function drawSylvester(ctx: Ctx, cx: number, cy: number, W: number, t: number): void {
  const y = cy + 6;
  const H = 84;
  body(ctx, () => figure(ctx, cx, y, H, W * 0.3), y - H * 0.5, y + H * 0.5, "#8ad87a", "#0e2a10", 0.6);
  body(ctx, () => ctx.ellipse(cx, y - H * 0.6, 10, 12, 0, 0, Math.PI * 2), y - H * 0.75, y - H * 0.45, "#c8f0a0", "#2a5a1a", 0.8);
  // 뿔 가지: 갈라지며 위로
  ctx.strokeStyle = alpha("#c8a070", 0.85);
  ctx.lineCap = "round";
  const branch = (x: number, yy: number, a: number, len: number, d: number): void => {
    if (d === 0) return;
    const x2 = x + Math.cos(a) * len;
    const y2 = yy + Math.sin(a) * len;
    ctx.lineWidth = d;
    ctx.beginPath();
    ctx.moveTo(x, yy);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    branch(x2, y2, a - 0.45, len * 0.72, d - 1);
    branch(x2, y2, a + 0.35, len * 0.72, d - 1);
  };
  for (const side of [-1, 1]) branch(cx + side * 6, y - H * 0.7, -Math.PI / 2 + side * 0.6, 20, 4);
  ctx.lineCap = "butt";
  // 떨어지는 잎
  for (let i = 0; i < 14; i++) {
    const f = ((t * 0.5 + i * 37) % 200) / 200;
    const lx = cx + (rnd(i, 3) - 0.5) * W * 0.8 + Math.sin(t / 20 + i) * 8;
    const ly = y - H * 0.8 + f * H * 1.6;
    ctx.fillStyle = alpha(i % 3 ? "#6ad85a" : "#e8ffb0", 1 - f * 0.6);
    ctx.fillRect(Math.round(lx), Math.round(ly), 3, 2);
  }
  additive(ctx, () => glow(ctx, cx, y, W * 0.35, "#6ad85a", 0.2));
  stars(ctx, [[cx - 40, y - H * 1.05], [cx - 6, y - H * 0.7], [cx, y - H * 0.6], [cx + 6, y - H * 0.7], [cx + 40, y - H * 1.05]], "#e8ffb0", t);
}

/** 세티아: 넓은 모자를 쓴 마녀 · 등 뒤로 일곱 갈래 빛줄기(색이 다름)가 꿈틀 · 떠도는 마법 문자 */
export function drawWitch(ctx: Ctx, cx: number, cy: number, W: number, t: number): void {
  const y = cy + 8 + Math.sin(t / 44) * 3;
  const H = 80;
  const cols = ["#ff5a5a", "#ffa03a", "#ffe04a", "#6ad85a", "#3ab8ff", "#5a6aff", "#c05aff"];
  ctx.lineCap = "round";
  cols.forEach((c, i) => {
    const a = Math.PI * (1.08 + (i / 6) * 0.84);
    ctx.strokeStyle = alpha(c, 0.6);
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx, y - H * 0.3);
    for (let k = 1; k <= 8; k++) {
      const r = k * (W * 0.055);
      ctx.lineTo(cx + Math.cos(a) * r + Math.sin(t / 14 + k + i) * 5, y - H * 0.3 + Math.sin(a) * r * 0.75 + Math.cos(t / 16 + k) * 4);
    }
    ctx.stroke();
  });
  ctx.lineCap = "butt";
  body(ctx, () => figure(ctx, cx, y, H, 46), y - H * 0.5, y + H * 0.5, "#8a3aba", "#200a2e", 0.7);
  body(ctx, () => {
    ctx.moveTo(cx - 34, y - H * 0.58);
    ctx.quadraticCurveTo(cx, y - H * 0.7, cx + 34, y - H * 0.58);
    ctx.lineTo(cx + 10, y - H * 0.66);
    ctx.lineTo(cx + 18, y - H * 1.05);
    ctx.lineTo(cx - 10, y - H * 0.66);
  }, y - H * 1.05, y - H * 0.55, "#5a2a7a", "#1a0628", 0.85);
  additive(ctx, () => {
    glow(ctx, cx - 4, y - H * 0.52, 3, "#ff8ae0", 1, 1);
    glow(ctx, cx + 4, y - H * 0.52, 3, "#ff8ae0", 1, 1);
  });
  stars(ctx, [[cx - 34, y - H * 0.58], [cx + 18, y - H * 1.05], [cx + 34, y - H * 0.58], [cx + 46, y + H * 0.5], [cx - 46, y + H * 0.5], [cx - 34, y - H * 0.58]], "#ff8ae0", t);
}

/** ???: 형체 없는 검은 덩어리 · 여기저기서 뜨고 감는 붉은 눈 · 지지직 끊기는 테두리 · 떠도는 물음표 */
export function drawUnknown(ctx: Ctx, cx: number, cy: number, W: number, t: number): void {
  const y = cy;
  const R = W * 0.36;
  const glitch = t % 90 < 5;
  ctx.save();
  if (glitch) ctx.translate(Math.round((rnd(t, 1) - 0.5) * 10), 0);
  body(ctx, () => {
    for (let k = 0; k <= 24; k++) {
      const a = (k / 24) * Math.PI * 2;
      const r = R * (0.75 + 0.25 * Math.sin(a * 5 + t / 20)) * (k % 2 ? 1 : 0.9);
      ctx.lineTo(cx + Math.cos(a) * r, y + Math.sin(a) * r * 0.55);
    }
  }, y - R * 0.55, y + R * 0.55, "#2a2a34", "#000000", 0.85);
  ctx.restore();
  for (let i = 0; i < 9; i++) {
    const open = Math.max(0, Math.sin(t / 25 + i * 2.3));
    if (open < 0.1) continue;
    const ex = cx + (rnd(i, 7) - 0.5) * R * 1.4;
    const ey = y + (rnd(7, i) - 0.5) * R * 0.7;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(ex, ey, 7, 3.5 * open, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ff3a5a";
    ctx.beginPath();
    ctx.arc(ex + Math.sin(t / 30 + i) * 2, ey, 2.2 * open, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.font = "bold 14px monospace";
  ctx.textAlign = "center";
  for (let i = 0; i < 5; i++) {
    const a = t / 70 + i * 1.3;
    ctx.fillStyle = alpha(i % 2 ? "#ff3a5a" : "#8a8a9a", 0.5 + 0.3 * Math.sin(t / 10 + i));
    ctx.fillText("?", cx + Math.cos(a) * R * 1.1, y + Math.sin(a) * R * 0.5);
  }
  ctx.textAlign = "start";
  stars(ctx, [[cx - R * 0.8, y], [cx - R * 0.2, y - R * 0.4], [cx + R * 0.5, y - R * 0.3], [cx + R * 0.8, y + R * 0.1]], "#ff3a5a", t);
}
