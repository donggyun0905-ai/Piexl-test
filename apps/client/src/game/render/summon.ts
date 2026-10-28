// 소환술사 그리기: 소환수 10종(작은 픽셀 그림) · 남은 시간이 적으면 깜빡임 · 불덩이·뼈 화살·포자·요정 별 · 채찍 자국
import { SUMMON_STATS, type EffectState, type ProjectileState, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, beam, glow, shock } from "./pwFxBits";

type Ctx = CanvasRenderingContext2D;
type Px = (c: string, x: number, y: number, w: number, h: number) => void;

/** 종류마다 그림 (가운데 기준, 오른쪽을 봄). step = 걷는 장면 */
const LOOK: Record<string, (px: Px, step: number, tick: number) => void> = {
  skeleton: (px, st) => {
    px("#ece4d0", -2, -5, 4, 3);
    px("#2a2430", -1, -4, 1, 1);
    px("#ece4d0", -1, -2, 2, 4);
    px("#ece4d0", -2 + st, 2, 1, 2);
    px("#ece4d0", 1 - st, 2, 1, 2);
    px("#c8d0e0", 2, -3, 1, 5);
  },
  imp: (px, st) => {
    px("#c8483a", -2, -3, 4, 5);
    px("#ffd040", 0, -2, 1, 1);
    px("#c8483a", -2, -4, 1, 1);
    px("#c8483a", 1, -4, 1, 1);
    px("#8a2a2a", -3, -1 - st, 1, 2);
  },
  golem: (px, st) => {
    px("#5a564c", -5, -5, 10, 10);
    px("#8a8478", -4, -5, 8, 8);
    px("#ff9a3c", -2, -3, 1, 1);
    px("#ff9a3c", 2, -3, 1, 1);
    px("#5a564c", -4 + st, 4, 3, 1);
    px("#5a564c", 1 - st, 4, 3, 1);
  },
  archer: (px, st) => {
    px("#ece4d0", -2, -5, 4, 3);
    px("#2a2430", 0, -4, 1, 1);
    px("#ece4d0", -1, -2, 2, 4);
    px("#ece4d0", -2 + st, 2, 1, 2);
    px("#8a6a3a", 2, -4, 1, 7);
  },
  flame: (px, _st, tick) => {
    const f = (tick >> 2) % 2;
    px("#c83a1a", -2, -2, 4, 4);
    px("#ff9a3c", -1, -3 - f, 2, 4);
    px("#ffe060", 0, -1, 1, 1);
  },
  shroom: (px) => {
    px("#e8dcc0", -1, 0, 2, 3);
    px("#c84a6a", -3, -3, 6, 3);
    px("#fff", -2, -3, 1, 1);
    px("#fff", 1, -2, 1, 1);
  },
  wolf: (px, st) => {
    px("#6a6a7a", -4, -2, 6, 3);
    px("#6a6a7a", 1, -4, 3, 3);
    px("#6a6a7a", 1, -5, 1, 1);
    px("#ffd040", 3, -3, 1, 1);
    px("#6a6a7a", -5, -3, 1, 2);
    px("#4a4a5a", -3 + st, 1, 1, 1);
    px("#4a4a5a", 0 - st, 1, 1, 1);
  },
  fairy: (px, _st, tick) => {
    const w = (tick >> 2) % 2;
    px("rgba(200,240,255,0.8)", -3, -2 - w, 2, 2);
    px("rgba(200,240,255,0.8)", 1, -2 - w, 2, 2);
    px("#ff9ad8", -1, -1, 2, 2);
    px("#fff", -1, -2, 1, 1);
  },
  bat: (px, _st, tick) => {
    const up = (tick >> 2) % 2 ? -1 : 1;
    px("#3a2650", -3, up - 1, 2, 1);
    px("#3a2650", 1, up - 1, 2, 1);
    px("#5a3a7a", -1, -1, 2, 2);
  },
  drake: (px, st, tick) => {
    const w = (tick >> 3) % 2;
    px("#c83a3a", -4, -2, 7, 4);
    px("#c83a3a", 2, -4, 3, 3);
    px("#ffd040", 4, -3, 1, 1);
    px("#e88a3a", -2, -5 - w, 3, 2);
    px("#c83a3a", -6, -1 + st, 2, 1);
  },
};

/** 소환수들 (플레이어 다음) */
export function drawSummons(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  for (const m of s.player.summons ?? []) {
    // 곧 사라지면 깜빡임
    if (m.life < 90 && (s.tick >> 2) % 2 === 0) continue;
    const x = snap(lerp(m.prevX, m.x, alpha));
    const y = snap(lerp(m.prevY, m.y, alpha));
    const moving = m.x !== m.prevX || m.y !== m.prevY;
    const step = moving && (s.tick >> 3) % 2 === 0 ? 1 : 0;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(m.face, 1);
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    const r = SUMMON_STATS[m.kind].r;
    if (m.kind !== "fairy" && m.kind !== "bat" && m.kind !== "drake") ctx.fillRect(-r, r - 1, r * 2, 1);
    LOOK[m.kind]?.((c, px, py, w, h) => {
      ctx.fillStyle = c;
      ctx.fillRect(px, py, w, h);
    }, step, s.tick);
    ctx.restore();
  }
}

/** 소환수 탄이면 그리고 true: 불덩이(불꼬리) · 뼈(돌며 날아감) · 포자(초록 빛) · 요정(반짝이는 빛) */
export function drawSummonShot(ctx: Ctx, pr: ProjectileState, x: number, y: number, tick: number): boolean {
  const sp = pr.spirit;
  const v = Math.hypot(pr.vx, pr.vy) || 1;
  const ux = pr.vx / v;
  const uy = pr.vy / v;
  if (sp === "fireball") {
    const r = pr.r + 1;
    additive(ctx, () => {
      beam(ctx, x - ux * r * 4, y - uy * r * 4, x, y, r * 1.6, "#ff6a1a", 0.7);
      glow(ctx, x, y, r * 3, "#ff8a2a", 0.9, 1);
    });
    ctx.fillStyle = "#c83a1a";
    ctx.beginPath();
    ctx.arc(x, y, r * (1 + Math.sin(tick / 2 + pr.id) * 0.1), 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffd060";
    ctx.beginPath();
    ctx.arc(x, y, r * 0.55, 0, Math.PI * 2);
    ctx.fill();
    return true;
  }
  if (sp === "bone") {
    // 빙글 도는 뼈 (양 끝 둥근 마디)
    additive(ctx, () => glow(ctx, x, y, 6, "#c8b8ff", 0.35));
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tick / 2 + pr.id);
    ctx.fillStyle = "#ece4d0";
    ctx.fillRect(-3, -0.5, 6, 1);
    for (const e of [-3, 3]) {
      ctx.fillRect(e - 1, -1.5, 2, 1);
      ctx.fillRect(e - 1, 0.5, 2, 1);
    }
    ctx.restore();
    return true;
  }
  if (sp === "spore") {
    additive(ctx, () => glow(ctx, x, y, 5, "#b8e070", 0.7));
    ctx.fillStyle = "#b8e070";
    ctx.beginPath();
    ctx.arc(x, y, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(184, 224, 112, 0.5)";
    ctx.fillRect(x - 3 + ((tick >> 2) % 3), y - 3, 1, 1);
    ctx.fillRect(x + 2 - ((tick >> 2) % 3), y + 2, 1, 1);
    return true;
  }
  if (sp === "fairy") {
    // 요정 빛: 분홍 빛 + 십자 반짝임 + 반짝이 꼬리
    additive(ctx, () => {
      glow(ctx, x, y, 7, "#ff9ad8", 0.9, 1.2);
      for (let i = 1; i <= 3; i++) glow(ctx, x - ux * i * 3, y - uy * i * 3, 2.5 - i * 0.5, "#ffd0f0", 0.6 - i * 0.15);
    });
    const k = 2 + ((tick >> 1) % 2);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x - k, y - 0.5, k * 2, 1);
    ctx.fillRect(x - 0.5, y - k, 1, k * 2);
    return true;
  }
  return false;
}

/** 채찍 자국 (swing 효과 width 2): 몸에서 앞으로 출렁이는 가죽 채찍 + 끝에서 탁 튀는 빛 */
export function drawWhip(ctx: Ctx, fx: EffectState, px: number, py: number, t: number): void {
  const len = fx.size;
  const nx = -fx.dirY;
  const ny = fx.dirX;
  const pts: [number, number][] = [[px, py]];
  for (let i = 1; i <= 10; i++) {
    const f = i / 10;
    const wave = Math.sin(f * Math.PI * 2 + (1 - t) * 6) * 4 * f * t;
    pts.push([px + fx.dirX * len * f + nx * wave, py + fx.dirY * len * f + ny * wave]);
  }
  ctx.lineCap = "round";
  for (const [c, w] of [["rgba(60, 30, 10, " + t + ")", 3], ["rgba(200, 150, 90, " + t + ")", 1.6]] as const) {
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.beginPath();
    pts.forEach(([a, b], i) => (i ? ctx.lineTo(a, b) : ctx.moveTo(a, b)));
    ctx.stroke();
  }
  ctx.lineCap = "butt";
  // 끝이 탁 터지는 소리 빛
  const [ex, ey] = pts[pts.length - 1]!;
  if (t > 0.35) {
    const k = (t - 0.35) / 0.65;
    additive(ctx, () => {
      glow(ctx, ex, ey, 8, "#fff0c8", k, 1.4);
      shock(ctx, ex, ey, 3 + (1 - k) * 8, "#ffe8b0", k, 2);
    });
  }
}
