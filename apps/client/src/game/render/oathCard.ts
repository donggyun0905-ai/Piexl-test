// 아스칼론 맹세 카드 연출 (화면에 붙음 · roomNotice가 부름): 적이 있는 방에 들어서면 길쭉한 맹세 카드가 화면 가운데 크게 → 아래 진영 게이지(영광 오른쪽)로 빨려 들어감 (그동안 방이 멈춤, sim/factionOath)
// 방을 끝내면 카드가 내 머리 위에 다시 나타나 · 지켰으면 금빛으로 산화해 몸속으로 · 어겼으면 픽셀 단위 검은 모래로 부서져 날아감
import { FACTION_OATH, type OathKind, type RunState } from "@pixel-rogue/shared";
import type { Ctx } from "./pwFxBits";

const INTRO = FACTION_OATH.introTicks;
const OUT = 70;
const GOLD = "#ffd86a";
let cache: { key: string; img: HTMLCanvasElement } | null = null;

const ease = (f: number) => 1 - (1 - f) ** 3;
const hash = (i: number, k: number) => {
  const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return v - Math.floor(v);
};

/** 카드 한 장을 미리 그림 (맹세 · 보상 · 벌칙) */
function cardImage(w: number, h: number, kind: OathKind, text: (k: string) => string): HTMLCanvasElement {
  const key = `${w}|${h}|${kind}|${text(`oath_${kind}`)}`;
  if (cache?.key === key) return cache.img;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  const u = Math.max(2, Math.round(w / 60));
  g.fillStyle = "#0e1430";
  g.fillRect(0, 0, w, h);
  const bg = g.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#22305e");
  bg.addColorStop(1, "#101830");
  g.fillStyle = bg;
  g.fillRect(u * 2, u * 2, w - u * 4, h - u * 4);
  g.strokeStyle = GOLD;
  g.lineWidth = u;
  g.strokeRect(u * 1.5, u * 1.5, w - u * 3, h - u * 3);
  g.strokeStyle = "rgba(255,216,106,0.45)";
  g.lineWidth = Math.max(1, u / 2);
  g.strokeRect(u * 4, u * 4, w - u * 8, h - u * 8);
  // 문장: 방패 + 검
  const cx = w / 2;
  const cy = h * 0.24;
  const s = w * 0.16;
  g.fillStyle = "#3a6ad8";
  g.beginPath();
  g.moveTo(cx - s, cy - s);
  g.lineTo(cx + s, cy - s);
  g.lineTo(cx + s, cy);
  g.quadraticCurveTo(cx + s, cy + s * 0.9, cx, cy + s * 1.3);
  g.quadraticCurveTo(cx - s, cy + s * 0.9, cx - s, cy);
  g.closePath();
  g.fill();
  g.strokeStyle = GOLD;
  g.lineWidth = u;
  g.stroke();
  g.fillStyle = "#f0f4ff";
  g.fillRect(cx - u / 2, cy - s * 1.25, u, s * 2.2);
  g.fillRect(cx - s * 0.45, cy - s * 0.35, s * 0.9, u);
  // 글자: 제목 · 맹세 · 보상 · 벌칙
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = GOLD;
  g.font = `bold ${Math.round(w * 0.11)}px sans-serif`;
  g.fillText(text("oathCardTitle"), cx, h * 0.47);
  g.fillStyle = "#ffffff";
  const line = text(`oath_${kind}`).split(/[:：]\s*/).pop() ?? "";
  let fs = Math.round(w * 0.09);
  g.font = `bold ${fs}px sans-serif`;
  while (g.measureText(line).width > w * 0.84 && fs > 8) g.font = `bold ${--fs}px sans-serif`;
  g.fillText(line, cx, h * 0.6);
  g.font = `${Math.round(w * 0.065)}px sans-serif`;
  g.fillStyle = "#8aff9a";
  g.fillText(text("oathCardReward"), cx, h * 0.76);
  g.fillStyle = "#ff8a8a";
  g.fillText(text("oathCardPenalty"), cx, h * 0.85);
  cache = { key, img: c };
  return c;
}

export function drawOathCard(ctx: Ctx, s: RunState, scale: number, text: (k: string) => string): void {
  const p = s.player;
  const o = p.fcOath;
  if (!o || s.pvp || s.over) return;
  const intro = (o.intro ?? 0) > 0;
  const out = o.end !== undefined && s.tick - o.end < OUT;
  if (!intro && !out) return;
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  const head = ctx.getTransform().transformPoint(new DOMPoint(p.x, p.y - 30));
  const ch = Math.round(Math.min(H * 0.62, 180 * scale));
  const cw = Math.round(ch * 0.56);
  const img = cardImage(cw, ch, o.kind, text);
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (intro) introCard(ctx, img, INTRO - o.intro!, W, H);
  else if (o.kept) keptCard(ctx, img, (s.tick - o.end!) / OUT, head.x, head.y);
  else sandCard(ctx, img, (s.tick - o.end!) / OUT, head.x, head.y, Math.max(3, Math.round(scale * 2)));
  ctx.restore();
}

/** 등장(커지며) → 머묾(살짝 떠다님) → 아래 게이지 쪽으로 빨려 들어감 (작아지며 금빛 꼬리) */
function introCard(ctx: Ctx, img: HTMLCanvasElement, e: number, W: number, H: number): void {
  let x = W / 2;
  let y = H * 0.45;
  let k = 1;
  let a = 1;
  if (e < 14) {
    k = 0.6 + 0.4 * ease(e / 14);
    a = e / 14;
  } else if (e < 72) y += Math.sin(e * 0.1) * 4;
  else {
    const f = ease((e - 72) / (INTRO - 72));
    const tx = W * 0.4;
    const ty = H - 24;
    x += (tx - x) * f;
    y += (ty - y) * f;
    k = 1 - 0.9 * f;
    ctx.globalCompositeOperation = "lighter";
    for (let i = 1; i <= 5; i++) {
      ctx.fillStyle = `rgba(255,216,106,${0.25 * (1 - i / 6)})`;
      const b = 6 * (1 - f) + 2;
      ctx.fillRect(x - (tx - W / 2) * 0.05 * i - b / 2, y - (ty - H * 0.45) * 0.05 * i - b / 2, b, b);
    }
    ctx.globalCompositeOperation = "source-over";
  }
  ctx.fillStyle = `rgba(0,0,0,${0.35 * a * (e < 72 ? 1 : 1 - (e - 72) / (INTRO - 72))})`;
  ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = a;
  ctx.shadowColor = GOLD;
  ctx.shadowBlur = 18 * k;
  const w = img.width * k;
  const h = img.height * k;
  ctx.drawImage(img, Math.round(x - w / 2), Math.round(y - h / 2), Math.round(w), Math.round(h));
}

/** 지킴: 머리 위에 작게 나타나 금빛 빛가루로 흩어지며 몸속으로 */
function keptCard(ctx: Ctx, img: HTMLCanvasElement, f: number, px: number, py: number): void {
  const k = 0.45;
  const w = img.width * k;
  const h = img.height * k;
  const cx = px;
  const cy = py - h * 0.6;
  const appear = Math.min(1, f / 0.25);
  const melt = Math.max(0, (f - 0.25) / 0.75);
  ctx.globalAlpha = appear * (1 - melt);
  ctx.drawImage(img, Math.round(cx - w / 2), Math.round(cy - h / 2), Math.round(w), Math.round(h));
  ctx.globalAlpha = 1;
  if (melt <= 0) return;
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 60; i++) {
    const sx = cx + (hash(i, 1) - 0.5) * w;
    const sy = cy + (hash(i, 2) - 0.5) * h;
    const t = Math.min(1, Math.max(0, melt * 1.4 - hash(i, 3) * 0.4));
    const q = ease(t);
    const x = sx + (px - sx) * q + Math.sin(i + t * 6) * 6 * (1 - q);
    const y = sy + (py + 10 - sy) * q;
    const b = 3 + 3 * (1 - q);
    ctx.fillStyle = `rgba(255,${200 + Math.round(hash(i, 4) * 55)},120,${(1 - q * 0.7) * (t < 1 ? 1 : 0)})`;
    ctx.fillRect(x - b / 2, y - b / 2, b, b);
  }
  ctx.fillStyle = `rgba(255,230,150,${0.5 * Math.sin(Math.PI * melt)})`;
  ctx.beginPath();
  ctx.arc(px, py + 10, 26 * melt + 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
}

/** 어김: 머리 위에 나타났다가 픽셀 조각마다 검게 변하며 바람에 날리는 모래처럼 흩어짐 */
function sandCard(ctx: Ctx, img: HTMLCanvasElement, f: number, px: number, py: number, bs: number): void {
  const k = 0.45;
  const w = img.width * k;
  const h = img.height * k;
  const x0 = px - w / 2;
  const y0 = py - h * 1.1;
  const appear = Math.min(1, f / 0.2);
  const go = Math.max(0, (f - 0.2) / 0.8);
  if (go <= 0) {
    ctx.globalAlpha = appear;
    ctx.drawImage(img, Math.round(x0), Math.round(y0), Math.round(w), Math.round(h));
    ctx.globalAlpha = 1;
    return;
  }
  const cols = Math.ceil(w / bs);
  const rows = Math.ceil(h / bs);
  const sw = img.width / cols;
  const sh = img.height / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      // 왼쪽 위부터 차례로 부서져 오른쪽 위로 날림
      const start = (c / cols) * 0.45 + hash(i, 1) * 0.2;
      const t = Math.max(0, (go - start) / (1 - start));
      if (t >= 1) continue;
      const dx = t * t * (80 + hash(i, 2) * 120);
      const dy = -t * (30 + hash(i, 3) * 70) + Math.sin(t * 8 + i) * 3;
      const x = x0 + c * bs + dx;
      const y = y0 + r * bs + dy;
      ctx.globalAlpha = 1 - t;
      ctx.drawImage(img, c * sw, r * sh, sw, sh, x, y, bs, bs);
      ctx.fillStyle = `rgba(8,6,10,${Math.min(1, t * 2.5)})`;
      ctx.fillRect(x, y, bs, bs);
    }
  }
  ctx.globalAlpha = 1;
}
