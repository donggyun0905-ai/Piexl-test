// 시즌 2 층 보스 공격 효과 (두꺼비 왕·불도롱뇽·번개 해파리·유령선 선장): 보스가 방에 있으면 공용 효과 종류를 그 보스 모양으로 그림
// 두꺼비: 혀(stab)·진흙 튐(burst)·진흙 덩이 탄 · 도롱뇽: 용암 분출(meteor)·불 터짐·용암 탄 · 해파리: 번개 줄(gleam)·전기 촉수(vine)·물 튐
// 선장: 대포 포격 줄·닻(stab)·밀물 파도(dark)·해적 칼(bslash)·포탄 터짐. 위험 표시 색은 bossFx가 s2HazardTint로 바꿈
import type { EffectState, RunState } from "@pixel-rogue/shared";
import { additive, alpha, beam, crescent, glow, shock, sparks } from "./pwFxBits";
import type { Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
type S2Boss = "toad" | "salamander" | "jelly" | "captain";
const TAU = Math.PI * 2;
const KINDS: readonly S2Boss[] = ["toad", "salamander", "jelly", "captain"];

/** 지금 방의 시즌 2 층 보스 (없으면 null) */
export function bossOf(s: RunState): S2Boss | null {
  for (const e of s.enemies) if (e.hp > 0 && (KINDS as readonly string[]).includes(e.kind)) return e.kind as S2Boss;
  return null;
}

/** 위험 표시 색 (r, g, b): 진흙 · 불 · 전기 · 바다 */
const TINT: Record<S2Boss, string> = { toad: "150, 110, 60", salamander: "255, 110, 30", jelly: "90, 200, 255", captain: "80, 150, 230" };
export const s2HazardTint = (s: RunState): string | null => {
  const b = bossOf(s);
  return b ? TINT[b] : null;
};

/** 갈라지는 번개 줄 (틱마다 모양이 바뀜) */
function zap(ctx: Ctx, x: number, y: number, tx: number, ty: number, seed: number, w: number, a: number): void {
  const n = Math.max(3, Math.round(Math.hypot(tx - x, ty - y) / 10));
  const nx = -(ty - y);
  const ny = tx - x;
  const l = Math.hypot(nx, ny) || 1;
  const pts: [number, number][] = [[x, y]];
  for (let k = 1; k < n; k++) {
    const off = (((Math.sin(seed * 12.9 + k * 78.2) * 43758.5) % 1) * 2 - 1) * 6;
    pts.push([x + ((tx - x) * k) / n + (nx / l) * off, y + ((ty - y) * k) / n + (ny / l) * off]);
  }
  pts.push([tx, ty]);
  for (const [c, ww] of [[alpha("#5ac8ff", a * 0.35), w * 3], [alpha("#8ae8ff", a), w], [`rgba(255,255,255,${a})`, Math.max(1, w * 0.4)]] as const) {
    ctx.strokeStyle = c;
    ctx.lineWidth = ww;
    ctx.lineJoin = "round";
    ctx.beginPath();
    pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
    ctx.stroke();
  }
}

/** 튀는 물방울·진흙 (포물선) */
function droplets(ctx: Ctx, x: number, y: number, r: number, u: number, n: number, colors: readonly string[], seed: number): void {
  for (let i = 0; i < n; i++) {
    const a = seed + i * 2.399;
    const d = r * (0.5 + ((i * 37) % 10) / 14) * u;
    ctx.fillStyle = colors[i % colors.length]!;
    const sz = i % 3 ? 2 : 3;
    ctx.fillRect(Math.round(x + Math.cos(a) * d), Math.round(y + Math.sin(a) * d * 0.6 - Math.sin(u * Math.PI) * 8), sz, sz);
  }
}

function toad(ctx: Ctx, fx: EffectState, x: number, y: number, tx: number, ty: number, t: number, u: number): boolean {
  if (fx.kind === "stab") {
    // 혀: 분홍 혀가 쭉 뻗었다 감겨 들어감 (끝이 동글고 침이 반짝)
    const k = u < 0.4 ? u / 0.4 : 1 - (u - 0.4) / 0.6;
    const ex = x + (tx - x) * k;
    const ey = y + (ty - y) * k;
    const w = (fx.width ?? 6) * 1.1;
    ctx.lineCap = "round";
    for (const [c, ww] of [["#5a1a2a", w + 2], ["#e86a8a", w], ["#ffb0c0", w * 0.35]] as const) {
      ctx.strokeStyle = c;
      ctx.lineWidth = ww;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo((x + ex) / 2 + (ey - y) * 0.08, (y + ey) / 2 - (ex - x) * 0.08, ex, ey);
      ctx.stroke();
    }
    ctx.lineCap = "butt";
    ctx.fillStyle = "#e86a8a";
    ctx.beginPath();
    ctx.arc(ex, ey, w * 0.9, 0, TAU);
    ctx.fill();
    additive(ctx, () => glow(ctx, ex - 1, ey - 1, 4, "#ffffff", 0.7));
    return true;
  }
  if (fx.kind === "burst") {
    // 진흙 철퍽: 갈색 덩이가 튀고 진흙 물결이 퍼짐
    ctx.fillStyle = `rgba(90, 60, 30, ${0.5 * t})`;
    ctx.beginPath();
    ctx.ellipse(x, y, fx.size * (1 + u * 0.8), fx.size * 0.5 * (1 + u * 0.8), 0, 0, TAU);
    ctx.fill();
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, 0.5);
    additive(ctx, () => shock(ctx, 0, 0, fx.size * (1 + u * 1.2), "#c8a070", t, 5));
    ctx.restore();
    droplets(ctx, x, y, fx.size * 2, u, 12, ["#6a4a24", "#9a7040", "#3a2810"], fx.x);
    return true;
  }
  return false;
}

function salamander(ctx: Ctx, fx: EffectState, x: number, y: number, t: number, u: number): boolean {
  if (fx.kind !== "meteor" && fx.kind !== "burst") return false;
  // 용암 분출: 땅이 붉게 갈라지고 불기둥과 검은 돌이 솟음
  const r = fx.size;
  ctx.fillStyle = `rgba(40, 10, 5, ${0.45 * t})`;
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * 0.5, 0, 0, TAU);
  ctx.fill();
  additive(ctx, () => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, 0.5);
    glow(ctx, 0, 0, r * 1.2, "#ff5a14", t, u < 0.2 ? 1.2 : 0.4);
    shock(ctx, 0, 0, r * (0.6 + u * 0.8), "#ffb040", t, 6);
    ctx.restore();
    const h = r * 2.2 * Math.sin(Math.min(1, u * 1.6) * Math.PI);
    const g = ctx.createLinearGradient(0, y - h, 0, y);
    g.addColorStop(0, "rgba(255,200,80,0)");
    g.addColorStop(1, `rgba(255,120,30,${0.8 * t})`);
    ctx.fillStyle = g;
    ctx.fillRect(x - r * 0.35, y - h, r * 0.7, h);
    sparks(ctx, x, y - h * 0.5, 10, r * 1.6, u, "#ffd060", fx.x + fx.y);
  });
  droplets(ctx, x, y, r * 1.5, u, 8, ["#2a1a14", "#ff6a1a", "#4a2a1a"], fx.y);
  return true;
}

function jelly(ctx: Ctx, fx: EffectState, x: number, y: number, tx: number, ty: number, t: number, u: number): boolean {
  if (fx.kind === "gleam") {
    // 번개 줄: 갈라지며 번쩍이는 하늘빛 번개 + 끝의 빛
    additive(ctx, () => {
      zap(ctx, x, y, tx, ty, fx.ticks + fx.x, (fx.width ?? 4) * 0.8 + 1, t);
      glow(ctx, tx, ty, 10, "#8ae8ff", t, 1.4);
    });
    return true;
  }
  if (fx.kind === "vine") {
    // 전기 촉수 휘두르기: 둘레로 뻗는 번개 촉수 여섯 + 전기 고리
    const r = fx.size;
    additive(ctx, () => {
      shock(ctx, x, y, r * (0.7 + u * 0.4), "#5ac8ff", t, 7);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * TAU + u * 2;
        zap(ctx, x, y, x + Math.cos(a) * r, y + Math.sin(a) * r, fx.ticks + i * 7, 1.5, t);
      }
      glow(ctx, x, y, r * 0.6, "#c8f4ff", t * 0.6);
    });
    return true;
  }
  if (fx.kind === "burst") {
    // 전기 물방울 튐
    additive(ctx, () => {
      glow(ctx, x, y, fx.size * 1.6, "#5ac8ff", t, 1);
      sparks(ctx, x, y, 10, fx.size * 2, u, "#c8f4ff", fx.x);
    });
    return true;
  }
  return false;
}

function captain(ctx: Ctx, fx: EffectState, x: number, y: number, tx: number, ty: number, t: number, u: number): boolean {
  if (fx.kind === "stab" && Math.abs(tx - x) > 200 && Math.abs(ty - y) < 2) {
    // 대포 포격 줄: 포탄이 가로질러 지나가며 줄을 따라 연달아 터짐 (화약 연기)
    const k = Math.min(1, u * 2.5);
    const bx = x + (tx - x) * k;
    for (let i = 0; i < 8; i++) {
      const px = x + ((tx - x) * (i + 0.5)) / 8;
      if (px > bx) continue;
      ctx.fillStyle = `rgba(70, 70, 80, ${0.45 * t})`;
      ctx.beginPath();
      ctx.arc(px, y - 2 - u * 6, 6 + u * 6, 0, TAU);
      ctx.fill();
    }
    additive(ctx, () => {
      beam(ctx, x, y, bx, y, (fx.width ?? 9) * 0.8, "#ffb040", t * 0.6);
      for (let i = 0; i < 8; i++) {
        const px = x + ((tx - x) * (i + 0.5)) / 8;
        if (px <= bx) glow(ctx, px, y, 12, "#ff8a3a", t * 0.8, 0.8);
      }
    });
    ctx.fillStyle = "#1a1a22";
    ctx.beginPath();
    ctx.arc(bx, y, 3, 0, TAU);
    ctx.fill();
    return true;
  }
  if (fx.kind === "stab") {
    // 닻: 쇠사슬 끝에 매달린 닻이 날아가 꽂힘
    const k = u < 0.5 ? u / 0.5 : 1;
    const ex = x + (tx - x) * k;
    const ey = y + (ty - y) * k;
    const n = Math.floor(Math.hypot(ex - x, ey - y) / 4);
    for (let i = 1; i < n; i++) {
      ctx.strokeStyle = i % 2 ? "#a8a8b8" : "#6a6a7a";
      ctx.lineWidth = 1;
      ctx.strokeRect(Math.round(x + ((ex - x) * i) / n) - 1, Math.round(y + ((ey - y) * i) / n) - 1, 2, 2);
    }
    const a = Math.atan2(ey - y, ex - x);
    ctx.save();
    ctx.translate(ex, ey);
    ctx.rotate(a + Math.PI / 2);
    ctx.strokeStyle = "#c8ccd8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.lineTo(0, 5);
    ctx.moveTo(-4, -4);
    ctx.lineTo(4, -4);
    ctx.arc(0, 0, 6, 0.2, Math.PI - 0.2);
    ctx.stroke();
    ctx.restore();
    if (u >= 0.5) additive(ctx, () => shock(ctx, ex, ey, 4 + (u - 0.5) * 24, "#8ac8ff", t, 3));
    return true;
  }
  if (fx.kind === "dark") {
    // 밀물: 방 절반을 쓸고 지나가는 파도 벽 (거품 머리)
    const w = (fx.width ?? 80) * 2;
    const top = Math.min(y, ty);
    const h = Math.abs(ty - y);
    const g = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
    g.addColorStop(0, `rgba(30, 80, 160, ${0.1 * t})`);
    g.addColorStop(0.5, `rgba(50, 130, 220, ${0.45 * t})`);
    g.addColorStop(1, `rgba(30, 80, 160, ${0.1 * t})`);
    ctx.fillStyle = g;
    ctx.fillRect(x - w / 2, top, w, h);
    additive(ctx, () => {
      for (let i = 0; i < 10; i++) {
        const py = top + (h * (i + 0.5)) / 10;
        const px = x + Math.sin(i * 1.7 + u * 6) * w * 0.3;
        glow(ctx, px, py, 10, "#c8e8ff", t * 0.7, 0.8);
      }
    });
    return true;
  }
  if (fx.kind === "bslash") {
    // 해적 칼: 푸른 유령빛 초승달 베기
    const a = Math.atan2(fx.dirY, fx.dirX);
    const half = Math.acos(Math.max(-1, Math.min(1, fx.width ?? 0.2)));
    additive(ctx, () => {
      crescent(ctx, x, y, fx.size * (1.05 - 0.15 * t), a, half, 7 * t + 1, "#5aa8ff", t);
      crescent(ctx, x, y, fx.size * 0.85, a, half * 0.85, 3 * t, "#e8f4ff", t * 0.8);
    });
    return true;
  }
  if (fx.kind === "burst") {
    // 물보라
    droplets(ctx, x, y, fx.size * 2, u, 12, ["#5aa8ff", "#c8e8ff", "#2a6ab8"], fx.x);
    additive(ctx, () => shock(ctx, x, y, fx.size * (1 + u), "#8ac8ff", t, 4));
    return true;
  }
  return false;
}

/** 시즌 2 층 보스 방이면 그 보스 모양으로 그리고 true */
export function drawS2BossFx(ctx: Ctx, s: RunState, fx: EffectState, snap: Snap): boolean {
  const b = fx.foe ? bossOf(s) : null;
  if (!b) return false;
  const t = fx.ticks / fx.maxTicks;
  const u = 1 - t;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const tx = snap(fx.toX ?? fx.x);
  const ty = snap(fx.toY ?? fx.y);
  if (b === "toad") return toad(ctx, fx, x, y, tx, ty, t, u);
  if (b === "salamander") return salamander(ctx, fx, x, y, t, u);
  if (b === "jelly") return jelly(ctx, fx, x, y, tx, ty, t, u);
  return captain(ctx, fx, x, y, tx, ty, t, u);
}
