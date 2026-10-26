// 라이더 그리기: 펄스 고리 · 기계 망치 휘두르기(머리가 호를 그리며 내리찍고 바닥이 갈라짐) · 찌르기 · 목 베기
// 전기 랜스(번개가 감긴 창끝) · 체인 휘두르기 · 푸른 화염 배기 · 에너지탄 · 톱날(불티를 튀기며 도는 날)
// 달린 자리 불꽃 자국(화염 배기는 푸른 불) · 불꽃 스택 x1~x5 · 옆의 게이지·빠르기 막대
import { flameStacks, riderGauge, riderHeat, type EffectState, type ProjectileState, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const PULSE = "#6ae8ff";
const WHITE = "#ffffff";
const STEEL = "#d8dce8";
const BLUE = ["#1a3aff", "#3a8aff", "#8ad8ff", "#e8f8ff"];
const ORANGE = ["#ff4a1a", "#ff8a3a", "#ffd040", "#fff0b0"];

function ring(ctx: Ctx, x: number, y: number, r: number, c: string, w: number): void {
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.5, r), 0, Math.PI * 2);
  ctx.stroke();
}

function line(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, c: string, w: number): void {
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

/** 탄: 에너지탄 · 톱날 */
export function drawRiderShot(ctx: Ctx, pr: ProjectileState, x: number, y: number, tick: number): boolean {
  const len = Math.hypot(pr.vx, pr.vy) || 1;
  const dx = pr.vx / len;
  const dy = pr.vy / len;
  if (pr.spirit === "rdBolt") {
    line(ctx, x - dx * 5, y - dy * 5, x + dx, y + dy, PULSE, 2);
    ctx.fillStyle = WHITE;
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    return true;
  }
  if (pr.spirit !== "rdWheel") return false;
  // 빠르게 도는 톱날: 어두운 원판 · 톱니 · 가운데 볼트 · 뒤로 튀는 불티
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tick * 0.7);
  ctx.fillStyle = "#4a4e5a";
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = STEEL;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * 4, Math.sin(a) * 4);
    ctx.lineTo(Math.cos(a + 0.35) * 7, Math.sin(a + 0.35) * 7);
    ctx.lineTo(Math.cos(a + 0.5) * 4, Math.sin(a + 0.5) * 4);
    ctx.fill();
  }
  ring(ctx, 0, 0, 3, "#9aa0b0", 1);
  ctx.fillStyle = PULSE;
  ctx.fillRect(-1, -1, 2, 2);
  ctx.restore();
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = (tick + i) % 3 ? ORANGE[2]! : WHITE;
    ctx.fillRect(Math.round(x - dx * (6 + i * 3) + Math.sin(tick + i) * 3), Math.round(y - dy * (6 + i * 3) + Math.cos(tick * 1.3 + i) * 3), 1, 1);
  }
  return true;
}

/** 푸른 불꽃 혀 (부채꼴로 겹겹이, 끝으로 갈수록 밝게 흩어짐) */
function blueFlame(ctx: Ctx, x: number, y: number, a: number, reach: number, t: number): void {
  for (let i = 0; i < 4; i++) {
    const r = reach * (0.45 + t * 0.55) * (1 - i * 0.18);
    ctx.globalAlpha = (1 - t * 0.7) * (0.7 + i * 0.1);
    ctx.fillStyle = BLUE[i]!;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, r, a - 0.62 + i * 0.12, a + 0.62 - i * 0.12);
    ctx.fill();
  }
  for (let i = 0; i < 10; i++) {
    const k = ((i * 37) % 10) / 10;
    const d = reach * (0.3 + k * 0.8) * (0.6 + t * 0.6);
    const b = a + (((i * 53) % 9) / 9 - 0.5) * 1.1;
    ctx.globalAlpha = 1 - t;
    ctx.fillStyle = i % 3 ? BLUE[2]! : WHITE;
    ctx.fillRect(Math.round(x + Math.cos(b) * d), Math.round(y + Math.sin(b) * d - t * 6), 1, 2);
  }
}

/** 효과: 펄스 · 망치 · 찌르기 · 목 베기 · 랜스 · 체인 · 화염 */
export function drawRiderFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  const t = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a = Math.atan2(fx.dirY, fx.dirX);
  switch (fx.kind) {
    case "rdPulse":
      ctx.globalAlpha = 1 - t;
      ring(ctx, x, y, fx.size * t, PULSE, 3);
      ring(ctx, x, y, fx.size * t * 0.7, WHITE, 1);
      break;
    case "rdSmash": {
      // 망치가 머리 위에서 앞쪽 바닥으로 크게 내리찍힘 → 찍힌 자리 충격파와 갈라짐
      const swing = Math.min(1, t * 2.2);
      const ang = a - 1.9 + swing * 1.9;
      const hx = x + Math.cos(ang) * fx.size * 0.85;
      const hy = y - 6 + Math.sin(ang) * fx.size * 0.85;
      ctx.globalAlpha = 1;
      if (swing < 1) {
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = STEEL;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(x, y - 6, fx.size * 0.85, a - 1.9, ang);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      line(ctx, x, y - 6, hx, hy, "#6a4a2a", 2);
      ctx.save();
      ctx.translate(hx, hy);
      ctx.rotate(ang);
      ctx.fillStyle = "#8a90a0";
      ctx.fillRect(-4, -5, 8, 10);
      ctx.fillStyle = STEEL;
      ctx.fillRect(-3, -4, 6, 8);
      ctx.fillStyle = PULSE;
      ctx.fillRect(-1, -4, 2, 8);
      ctx.restore();
      if (swing >= 1) {
        const k = (t - 0.45) / 0.55;
        const gx = x + fx.dirX * fx.size * 0.85;
        const gy = y + fx.dirY * fx.size * 0.85;
        ctx.globalAlpha = 1 - k;
        ring(ctx, gx, gy, 4 + k * fx.size * 0.6, WHITE, 2);
        for (let i = 0; i < 5; i++) {
          const b = i * 1.26 + 0.3;
          line(ctx, gx, gy, gx + Math.cos(b) * fx.size * 0.4, gy + Math.sin(b) * fx.size * 0.25, "#3a3440", 1);
        }
        for (let i = 0; i < 8; i++) {
          const b = i * 0.8;
          ctx.fillStyle = i % 2 ? "#b8a890" : WHITE;
          ctx.fillRect(Math.round(gx + Math.cos(b) * k * 14), Math.round(gy + Math.sin(b) * k * 8 - Math.sin(k * Math.PI) * 6), 2, 2);
        }
      }
      break;
    }
    case "rdStab":
      // 단검 찌르기: 하얀 섬광 줄 (대시 목 베기는 보랏빛 긴 자국)
      ctx.globalAlpha = 1 - t;
      line(ctx, x, y - 4, x + fx.dirX * fx.size, y - 4 + fx.dirY * fx.size, fx.width ? "#c87aff" : WHITE, fx.width ? 3 : 1);
      if (fx.width) line(ctx, x, y - 4, x + fx.dirX * fx.size, y - 4 + fx.dirY * fx.size, WHITE, 1);
      break;
    case "rdCut": {
      // 목 베기: 적의 목에 그어지는 날카로운 한 줄 + 튀는 핏방울
      const k = Math.min(1, t * 3);
      const nx = -fx.dirY;
      const ny = fx.dirX;
      ctx.globalAlpha = 1 - t * 0.8;
      line(ctx, x - nx * fx.size * k, y - 8 - ny * fx.size * k * 0.3, x + nx * fx.size * k, y - 8 + ny * fx.size * k * 0.3, "#ff2a4a", 3);
      line(ctx, x - nx * fx.size * k, y - 8 - ny * fx.size * k * 0.3, x + nx * fx.size * k, y - 8 + ny * fx.size * k * 0.3, WHITE, 1);
      for (let i = 0; i < 6; i++) {
        ctx.fillStyle = "#c81a3a";
        ctx.fillRect(Math.round(x + (i - 2.5) * 2 + fx.dirX * t * 8), Math.round(y - 8 + t * t * 14 + (i % 2) * 2), 1, 1);
      }
      break;
    }
    case "rdLance": {
      // 전기 랜스: 창이 쭉 뻗고 창끝을 따라 번개가 감김 · 끝에 푸른 섬광
      const k = Math.min(1, t * 3);
      const ex = x + fx.dirX * fx.size * k;
      const ey = y - 4 + fx.dirY * fx.size * k;
      ctx.globalAlpha = 1 - t * 0.6;
      line(ctx, x, y - 4, ex, ey, "#8a90a0", 3);
      line(ctx, x, y - 4, ex, ey, STEEL, 1);
      ctx.strokeStyle = (fx.ticks % 4) < 2 ? PULSE : WHITE;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i <= 10; i++) {
        const q = i / 10;
        const off = Math.sin(i * 2.1 + fx.ticks) * 3;
        ctx.lineTo(lerp(x, ex, q) - fx.dirY * off, lerp(y - 4, ey, q) + fx.dirX * off);
      }
      ctx.stroke();
      ctx.fillStyle = WHITE;
      ctx.beginPath();
      ctx.arc(ex, ey, 2 + (1 - t) * 3, 0, Math.PI * 2);
      ctx.fill();
      ring(ctx, ex, ey, 3 + t * 8, PULSE, 1);
      break;
    }
    case "rdSpin":
      // 체인 휘두르기: 둘레를 도는 사슬 고리 줄 + 끝의 쇠뭉치 + 바람 고리
      ctx.globalAlpha = 1 - t;
      ring(ctx, x, y - 2, fx.size * (0.8 + t * 0.2), "rgba(216,220,232,0.35)", 3);
      for (let i = 0; i < 12; i++) {
        const b = t * 7 + (i / 12) * 0.9;
        const r = fx.size * (i / 12);
        ctx.fillStyle = i % 2 ? STEEL : "#8a90a0";
        ctx.fillRect(Math.round(x + Math.cos(b) * r) - 1, Math.round(y - 2 + Math.sin(b) * r) - 1, 2, 2);
      }
      ctx.fillStyle = "#4a4e5a";
      ctx.beginPath();
      ctx.arc(x + Math.cos(t * 7 + 0.9) * fx.size, y - 2 + Math.sin(t * 7 + 0.9) * fx.size, 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "rdFlame":
      blueFlame(ctx, x, y - 3, a, fx.size, t);
      break;
    default:
      return false;
  }
  ctx.globalAlpha = 1;
  return true;
}

/** 바닥: 달린 자리 불꽃 자국 (화염 배기는 푸른 불) */
export function drawRiderGround(ctx: Ctx, s: RunState, snap: Snap): void {
  const p = s.player;
  const pal = p.weaponId === "rdExhaust" ? BLUE.slice(1) : ORANGE.slice(1);
  for (const f of p.rdFire ?? []) {
    const k = Math.min(1, f.t / 30);
    for (let i = 0; i < 3; i++) {
      ctx.globalAlpha = 0.8 * k * (1 - i * 0.2);
      ctx.fillStyle = pal[(Math.floor(s.tick / 3) + i + Math.round(f.x)) % 3]!;
      ctx.fillRect(snap(f.x) - 2 + i * 2, snap(f.y) - 2 - ((s.tick + f.y + i * 2) % 4), 2, 3 + (i % 2));
    }
  }
  ctx.globalAlpha = 1;
}

/** 적 머리 위 불꽃 스택 x1~x5 (라이더 화염 배기 · 붐버 네이팜) */
function drawFlameStacks(ctx: Ctx, s: RunState, snap: Snap): void {
  ctx.font = "bold 6px monospace";
  ctx.textAlign = "center";
  for (const e of s.enemies) {
    const n = flameStacks(s, e);
    if (!n || e.hp <= 0) continue;
    // 적 오른쪽 아래 (위쪽은 피해 숫자 자리)
    const x = snap(e.x) + e.r + 9;
    const y = snap(e.y) + 2;
    const blue = s.player.characterId === "rider";
    ctx.fillStyle = "rgba(10,10,20,0.6)";
    ctx.fillRect(x - 7, y - 5, 14, 7);
    ctx.fillStyle = (blue ? BLUE : ORANGE)[Math.min(3, n - 1)]!;
    ctx.fillText(`x${n}`, x, y + 1);
  }
  ctx.textAlign = "left";
}

/** 몸 곁: 불꽃 스택 · 오른쪽 옆 게이지 (가득이면 반짝) · 아래 빠르기 막대 */
export function drawRiderAura(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "rider" && p.characterId !== "bomber") return;
  drawFlameStacks(ctx, s, snap);
  if (p.characterId !== "rider") return;
  const x = snap(lerp(p.prevX, p.x, alpha)) + 14;
  const y = snap(lerp(p.prevY, p.y, alpha)) - 14;
  const g = riderGauge(p);
  ctx.fillStyle = "rgba(10,10,20,0.7)";
  ctx.fillRect(x, y, 3, 18);
  ctx.fillStyle = g > 0.9 && s.tick % 10 < 5 ? WHITE : PULSE;
  const h = Math.round(16 * g);
  ctx.fillRect(x + 1, y + 17 - h, 1, h);
  const heat = riderHeat(p);
  if (heat > 0) {
    ctx.fillStyle = "rgba(10,10,20,0.7)";
    ctx.fillRect(x - 26, y + 26, 26, 3);
    ctx.fillStyle = heat >= 1 && s.tick % 8 < 4 ? WHITE : "#ffb04a";
    ctx.fillRect(x - 25, y + 27, Math.round(24 * heat), 1);
  }
}
