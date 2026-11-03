// 테라코어 시즌 2 그리기: 오토마타 레이저(빛 줄기·끝 섬광)·자매 인형(똑같은 오토마타)·연기를 뿜는 유도 미사일·궤도 포격
// 라이더는 render/rider
import { DOLL_TINTS, type EffectState, type ProjectileState, type RunState } from "@pixel-rogue/shared";
import { glowEdge } from "./pwFxBits";
import { drawCharacter } from "../sprites";
import { type Snap } from "./palette";
import { drawRiderAura, drawRiderFx, drawRiderGround, drawRiderShot } from "./rider";

type Ctx = CanvasRenderingContext2D;
const LZ = "#8ae8ff";
const LZW = "#ffffff";
/** 자매 인형 옷 (스킨 그림을 빌려 색으로 구분: 분홍 · 연두 · 보라 · 금빛, DOLL_TINTS와 같은 차례) */
const DOLL_SKINS = ["automata_newyear", "automata_xmas", "automata_halloween", "automata_china"] as const;
const HOT = "#ffd040";

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
  return drawRiderShot(ctx, pr, x, y, tick);
}

/** 원 테두리 */
function ring(ctx: Ctx, x: number, y: number, r: number, c: string, w: number): void {
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.5, r), 0, Math.PI * 2);
  glowEdge(ctx, c, w);
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
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
    case "adSword": {
      // 양손 대검의 푸른 반발 베기: 두 번째는 반대쪽에서 휘두름 · 끝을 따라 흰 칼날 자국
      const a = Math.atan2(fx.dirY, fx.dirX);
      const side = fx.width ? -1 : 1;
      const sweep = a + side * (-1.1 + t * 2.2);
      ctx.globalAlpha = 1 - t * 0.7;
      for (const [r, w, c] of [[fx.size, 6, "rgba(138,232,255,0.35)"], [fx.size * 0.92, 3, LZ], [fx.size * 0.92, 1, LZW]] as const) {
        ctx.strokeStyle = c;
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.arc(x, y - 4, r, side > 0 ? a - 1.1 : sweep, side > 0 ? sweep : a + 1.1);
        ctx.stroke();
      }
      // 칼끝 섬광
      ctx.fillStyle = LZW;
      ctx.fillRect(Math.round(x + Math.cos(sweep) * fx.size) - 1, Math.round(y - 4 + Math.sin(sweep) * fx.size) - 1, 3, 3);
      break;
    }
    default:
      return drawRiderFx(ctx, fx, snap);
  }
  ctx.globalAlpha = 1;
  return true;
}

/** 바닥: 라이더가 달린 자리의 불꽃 자국 */
export function drawTerraGround(ctx: Ctx, s: RunState, snap: Snap): void {
  drawRiderGround(ctx, s, snap);
}

/** 몸 곁: 자매 인형 (똑같은 오토마타, 조금 투명한 하늘빛 테두리) · 라이더 게이지 */
export function drawTerraAura(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  for (const [i, d] of (p.adDolls ?? []).entries()) {
    // 인형마다 다른 옷 색 (레이저 색과 같은 발밑 빛)
    const x = snap(d.x);
    const y = snap(d.y);
    const tint = DOLL_TINTS[i % DOLL_TINTS.length]!;
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = tint;
    ctx.beginPath();
    ctx.ellipse(x, y + 6, 5, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    if (!drawCharacter(ctx, DOLL_SKINS[i % DOLL_SKINS.length]!, x, y, 6, { faceX: p.faceX, faceY: p.faceY, moving: true, casting: d.cd > 40, step: Math.floor(s.tick / 8 + i) })) {
      ctx.fillStyle = tint;
      ctx.fillRect(x - 2, y - 8, 4, 8);
    }
  }
  drawRiderAura(ctx, s, alpha, snap);
}
