// 테라코어 시즌 2 그리기: 오토마타 레이저(빛 줄기·끝 섬광)·자매 인형(똑같은 오토마타)·연기를 뿜는 유도 미사일·궤도 포격
// 라이더 펄스 고리·망치·찌르기·회전·불꽃·에너지탄·톱날·달린 자리 불꽃 · 옆의 달린 거리 게이지
import { riderGauge, type EffectState, type ProjectileState, type RunState } from "@pixel-rogue/shared";
import { drawCharacter } from "../sprites";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const LZ = "#8ae8ff";
const LZW = "#ffffff";
const FIRE = "#ff8a3a";
const HOT = "#ffd040";
const PULSE = "#6ae8ff";

/** 탄: 유도 미사일(뒤로 연기) · 에너지탄 · 톱날 */
export function drawTerraShot(ctx: Ctx, pr: ProjectileState, x: number, y: number, tick: number): boolean {
  const len = Math.hypot(pr.vx, pr.vy) || 1;
  const dx = pr.vx / len;
  const dy = pr.vy / len;
  if (pr.spirit === "adMissile") {
    // 연기 꼬리 (뒤로 갈수록 크고 옅게) · 불꽃 · 몸통 · 빨간 머리
    for (let i = 1; i <= 5; i++) {
      ctx.globalAlpha = 0.5 - i * 0.08;
      ctx.fillStyle = i < 2 ? HOT : "#b8bcc4";
      const s = i < 2 ? 2 : 1 + Math.ceil(i / 2);
      ctx.fillRect(Math.round(x - dx * (3 + i * 3) - s / 2 + Math.sin(tick * 0.5 + i) * 0.6), Math.round(y - dy * (3 + i * 3) - s / 2), s, s);
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#e8e8f0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - dx * 3, y - dy * 3);
    ctx.lineTo(x + dx * 2, y + dy * 2);
    ctx.stroke();
    ctx.fillStyle = "#e84a4a";
    ctx.fillRect(Math.round(x + dx * 2), Math.round(y + dy * 2), 1, 1);
    return true;
  }
  if (pr.spirit === "rdBolt") {
    ctx.strokeStyle = PULSE;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - dx * 5, y - dy * 5);
    ctx.lineTo(x + dx, y + dy);
    ctx.stroke();
    ctx.fillStyle = LZW;
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    return true;
  }
  if (pr.spirit === "rdWheel") {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tick * 0.6);
    ctx.strokeStyle = "#c8ccd8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 6; i++) ctx.fillRect(Math.round(Math.cos((i / 6) * Math.PI * 2) * 6), Math.round(Math.sin((i / 6) * Math.PI * 2) * 6), 1, 1);
    ctx.restore();
    return true;
  }
  return false;
}

/** 원 테두리 */
function ring(ctx: Ctx, x: number, y: number, r: number, c: string, w: number): void {
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.5, r), 0, Math.PI * 2);
  ctx.stroke();
}

/** 효과: 레이저 · 미사일 발사 · 궤도 포격 · 펄스 · 라이더 공격 */
export function drawTerraFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  const t = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  switch (fx.kind) {
    case "adBeam": {
      // 바깥 빛 → 안쪽 흰 심 (점점 가늘어지며 사라짐) · 끝에 섬광
      const tx = fx.toX ?? x;
      const ty = fx.toY ?? y;
      const k = 1 - t;
      for (const [w, c, a] of [[fx.size * 2 + 2, fx.tint ?? LZ, 0.35], [fx.size, fx.tint ?? LZ, 0.9], [Math.max(1, fx.size * 0.4), LZW, 1]] as const) {
        ctx.globalAlpha = a * k;
        ctx.strokeStyle = c;
        ctx.lineWidth = Math.max(1, w * k);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
      }
      ctx.globalAlpha = k;
      ctx.fillStyle = LZW;
      ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 3, 3);
      break;
    }
    case "adLaunch":
      // 등 뒤 발사구에서 피어오르는 연기
      for (let i = 0; i < 6; i++) {
        ctx.globalAlpha = (1 - t) * 0.6;
        ctx.fillStyle = i % 2 ? "#c8ccd4" : "#9aa0aa";
        ctx.beginPath();
        ctx.arc(x + Math.sin(i * 1.7) * 6 * t, y - t * 10 - i, 2 + t * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    case "adSat":
      // 하늘에서 내리꽂히는 빛기둥 + 바닥 고리
      ctx.globalAlpha = 1 - t;
      ctx.fillStyle = LZ;
      ctx.fillRect(x - fx.size * 0.4, y - 80, fx.size * 0.8, 80);
      ctx.fillStyle = LZW;
      ctx.fillRect(x - fx.size * 0.15, y - 80, fx.size * 0.3, 80);
      ring(ctx, x, y, fx.size * (0.5 + t * 0.6), LZ, 2);
      break;
    case "rdPulse":
      ctx.globalAlpha = 1 - t;
      ring(ctx, x, y, fx.size * t, PULSE, 3);
      ring(ctx, x, y, fx.size * t * 0.7, LZW, 1);
      break;
    case "rdSmash":
    case "rdSpin":
    case "rdStab":
    case "rdFlame": {
      const a = Math.atan2(fx.dirY, fx.dirX);
      ctx.globalAlpha = 1 - t;
      if (fx.kind === "rdSpin") ring(ctx, x, y, fx.size * (0.6 + t * 0.4), "#d8dce8", 2);
      else if (fx.kind === "rdStab") {
        ctx.strokeStyle = LZW;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + fx.dirX * fx.size, y + fx.dirY * fx.size);
        ctx.stroke();
      } else {
        ctx.fillStyle = fx.kind === "rdFlame" ? FIRE : "#d8dce8";
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, fx.size * (0.5 + t * 0.5), a - 0.7, a + 0.7);
        ctx.fill();
        if (fx.kind === "rdFlame") {
          ctx.fillStyle = HOT;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.arc(x, y, fx.size * 0.5, a - 0.4, a + 0.4);
          ctx.fill();
        }
      }
      break;
    }
    default:
      return false;
  }
  ctx.globalAlpha = 1;
  return true;
}

/** 바닥: 라이더가 달린 자리의 불꽃 자국 */
export function drawTerraGround(ctx: Ctx, s: RunState, snap: Snap): void {
  for (const f of s.player.rdFire ?? []) {
    const k = Math.min(1, f.t / 30);
    ctx.globalAlpha = 0.8 * k;
    ctx.fillStyle = (s.tick + f.x) % 6 < 3 ? FIRE : HOT;
    ctx.fillRect(snap(f.x) - 1, snap(f.y) - 2 - ((s.tick + f.y) % 3), 2, 3);
  }
  ctx.globalAlpha = 1;
}

/** 몸 곁: 자매 인형 (똑같은 오토마타, 조금 투명한 하늘빛 테두리) · 라이더 게이지 */
export function drawTerraAura(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  for (const [i, d] of (p.adDolls ?? []).entries()) {
    const x = snap(d.x);
    const y = snap(d.y);
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = LZ;
    ctx.beginPath();
    ctx.ellipse(x, y + 6, 5, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    if (!drawCharacter(ctx, "automata", x, y, 6, { faceX: p.faceX, faceY: p.faceY, moving: true, casting: d.cd > 40, step: Math.floor(s.tick / 8 + i) })) {
      ctx.fillStyle = "#e8e0f0";
      ctx.fillRect(x - 2, y - 8, 4, 8);
    }
  }
  if (p.characterId !== "rider") return;
  // 오른쪽 옆 세로 게이지 (가득이면 반짝)
  const x = snap(lerp(p.prevX, p.x, alpha)) + 14;
  const y = snap(lerp(p.prevY, p.y, alpha)) - 14;
  const g = riderGauge(p);
  ctx.fillStyle = "rgba(10,10,20,0.7)";
  ctx.fillRect(x, y, 3, 18);
  ctx.fillStyle = g > 0.9 && s.tick % 10 < 5 ? LZW : PULSE;
  const h = Math.round(16 * g);
  ctx.fillRect(x + 1, y + 17 - h, 1, h);
}
