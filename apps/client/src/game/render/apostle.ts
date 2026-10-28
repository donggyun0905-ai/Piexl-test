// 악의 사도 그리기: 일곱 죄의 장판(바닥) · 영혼 · 업화 걸린 적 · 떨어지는 뒤집힌 십자가 · 가면의 검은 오라 · 색욕 광선 · 황금 · 중력 · 잠 · 영혼 먹기 · 하늘색 불꽃
import { hudScale } from "./imugiAura";
import { APOSTLE, SIN_COLORS, soulAttack, type EffectState, type RunState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";
import { additive, beam, glow, shock, sparks } from "./pwFxBits";

type Ctx = CanvasRenderingContext2D;

/** 뒤집힌 십자가 (가운데 x, 아래쪽 끝 y, 높이 h): 세로 막대 + 아래쪽 가로 막대 */
function cross(ctx: Ctx, x: number, y: number, h: number, c: string): void {
  const w = Math.max(2, h * 0.16);
  ctx.fillStyle = "#1a1622";
  ctx.fillRect(x - w / 2 - 1, y - h - 1, w + 2, h + 2);
  ctx.fillRect(x - h * 0.32 - 1, y - h * 0.32 - w / 2 - 1, h * 0.64 + 2, w + 2);
  ctx.fillStyle = c;
  ctx.fillRect(x - w / 2, y - h, w, h);
  ctx.fillRect(x - h * 0.32, y - h * 0.32 - w / 2, h * 0.64, w);
  ctx.fillStyle = "#fff";
  ctx.fillRect(x - w / 2, y - h, 1, h * 0.6);
}

/** 바닥: 장판 · 영혼 · 업화 (적 아래) */
export function drawApostleGround(ctx: Ctx, s: RunState, snap: Snap): void {
  const p = s.player;
  for (const f of p.apFields ?? []) {
    const c = SIN_COLORS[f.sin];
    const fade = Math.min(1, f.left / 30, f.t / 8);
    const x = snap(f.x);
    const y = snap(f.y);
    ctx.globalAlpha = 0.28 * fade;
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.ellipse(x, y, f.r, f.r * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.8 * fade;
    ctx.strokeStyle = c;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 2]);
    ctx.lineDashOffset = -s.tick * 0.3;
    ctx.stroke();
    ctx.setLineDash([]);
    // 장판 가운데 꽂힌 작은 십자가 + 죄마다 떠오르는 조각
    cross(ctx, x, y + 2, 10, c);
    for (let i = 0; i < 5; i++) {
      const a = i * 1.26 + f.t * 0.03;
      const k = ((f.t + i * 13) % 40) / 40;
      ctx.globalAlpha = (1 - k) * fade * 0.8;
      ctx.fillStyle = f.sin === "greed" ? "#ffd040" : c;
      ctx.fillRect(x + Math.cos(a) * f.r * 0.6, y + Math.sin(a) * f.r * 0.4 - k * 10, 2, 2);
    }
  }
  ctx.globalAlpha = 1;
  for (const o of p.apSouls ?? []) {
    if (o.where !== `${s.floor}/${s.roomId}`) continue;
    const bob = Math.sin(s.tick * 0.12 + o.x) * 2;
    const x = snap(o.x);
    const y = snap(o.y + bob);
    ctx.globalAlpha = Math.min(1, o.left / 60) * 0.9;
    ctx.fillStyle = "#5ab8d8";
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#b8f0ff";
    ctx.fillRect(x - 1, y - 7, 2, 4);
    ctx.fillRect(x - 2, y - 2, 3, 3);
    ctx.fillStyle = "#fff";
    ctx.fillRect(x - 1, y - 1, 1, 1);
  }
  ctx.globalAlpha = 1;
  for (const e of s.enemies) {
    if ((e.apHell ?? 0) <= 0) continue;
    for (let i = 0; i < 3; i++) {
      const k = ((s.tick + i * 9) % 24) / 24;
      ctx.globalAlpha = 1 - k;
      ctx.fillStyle = i % 2 ? "#2a8aff" : "#6ad8ff";
      ctx.fillRect(snap(e.x) - 4 + i * 4, snap(e.y) - e.r - k * 8, 2, 3);
    }
  }
  ctx.globalAlpha = 1;
}

/** 효과 */
export function drawApostleFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!fx.kind.startsWith("ap")) return false;
  const t = fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const c = fx.tint ?? "#c8c0d8";
  const seed = fx.x + fx.y * 3;
  if (fx.kind === "apCross") {
    // 하늘에서 떨어지는 큰 뒤집힌 십자가: 붉은 기운을 두르고 떨어져 땅에 박히면 검붉은 충격파
    const fallT = Math.max(0, fx.ticks - 12) / APOSTLE.drop;
    const h = 14 + fx.size;
    const cy = y - fallT * 90;
    ctx.globalAlpha = 0.35 * (1 - fallT);
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.ellipse(x, y + 2, fx.size * (1 - fallT * 0.6), fx.size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    additive(ctx, () => {
      glow(ctx, x, cy - h / 2, h * 0.9, c, fx.ticks > 12 ? 0.6 : fx.ticks / 20);
      if (fallT <= 0.05 && fx.ticks <= 12) {
        const k = fx.ticks / 12;
        shock(ctx, x, y, fx.size * (1.6 - k), "#ff3a4a", k, 6);
        sparks(ctx, x, y, 10, fx.size * 1.5, 1 - k, c, seed);
      }
    });
    ctx.globalAlpha = fx.ticks > 12 ? 1 : fx.ticks / 12;
    cross(ctx, x, cy, h, c);
  } else if (fx.kind === "apAura") {
    // 발밑에서 솟는 검은 불길 + 붉은 테두리 빛
    const up = 1 - t;
    additive(ctx, () => {
      ctx.save();
      ctx.translate(x, y + fx.size * 0.5);
      ctx.scale(1, 0.35);
      shock(ctx, 0, 0, fx.size, "#d8283a", 0.8, 6);
      ctx.restore();
    });
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = "#120c16";
    for (let i = -3; i <= 3; i++) {
      const h = (9 + (i % 2 ? 5 : 0)) * up + 2;
      const bx = x + i * (fx.size / 3.5);
      ctx.beginPath();
      ctx.moveTo(bx - 2, y + fx.size * 0.5);
      ctx.lineTo(bx, y + fx.size * 0.5 - h);
      ctx.lineTo(bx + 2, y + fx.size * 0.5);
      ctx.fill();
    }
  } else if (fx.kind === "apBeam") {
    // 색욕 광선: 분홍빛 굵은 빛줄기 + 끝 빛
    const tx = snap(fx.toX ?? fx.x);
    const ty = snap(fx.toY ?? fx.y);
    additive(ctx, () => {
      beam(ctx, x, y, tx, ty, 3 + 2 * t, c, t);
      glow(ctx, tx, ty, 8, c, t, 1.4);
    });
  } else if (fx.kind === "apCoin") {
    // 탐욕: 반짝이며 튀어 오르는 금화
    for (let i = 0; i < 3; i++) {
      const cx = x - 5 + i * 5;
      const cy = y - 14 + (1 - t) * 14 - i * 3;
      additive(ctx, () => glow(ctx, cx, cy, 4, "#ffd040", t));
      ctx.globalAlpha = t;
      ctx.fillStyle = "#b8860b";
      ctx.beginPath();
      ctx.ellipse(cx, cy, 2, 2 * Math.abs(Math.cos(fx.ticks / 3 + i)) + 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff0a0";
      ctx.fillRect(cx - 0.5, cy - 1, 1, 1);
    }
  } else if (fx.kind === "apGrav") {
    // 교만 중력: 조여 드는 고리 셋 + 가운데 어둠
    additive(ctx, () => {
      for (let k = 0; k < 3; k++) shock(ctx, x, y, Math.max(2, fx.size * (t + k * 0.3) * 0.9), c, t, 3);
    });
    ctx.globalAlpha = 0.4 * t;
    ctx.fillStyle = "#0c0814";
    ctx.beginPath();
    ctx.arc(x, y, fx.size * 0.35, 0, Math.PI * 2);
    ctx.fill();
  } else if (fx.kind === "apSleep") {
    // 나태 잠: 떠오르는 Z + 보랏빛 졸음 안개
    additive(ctx, () => glow(ctx, x, y - 4, 8, c, t * 0.6));
    ctx.globalAlpha = t;
    ctx.fillStyle = c;
    ctx.font = "bold 6px monospace";
    ctx.fillText("Z", x, y - (1 - t) * 8);
    ctx.font = "bold 4px monospace";
    ctx.fillText("z", x + 4, y - 4 - (1 - t) * 10);
  } else if (fx.kind === "apSoul") {
    // 영혼 먹기: 푸른 영혼 빛이 빨려 들며 고리
    additive(ctx, () => {
      shock(ctx, x, y, fx.size * (1.6 - t), "#b8f0ff", t, 3);
      glow(ctx, x, y, fx.size * 0.8 * t, "#b8f0ff", t, 1);
    });
  } else if (fx.kind === "apFlame") {
    // 역천 하늘색 불꽃: 앞쪽으로 확 퍼지는 푸른 불길
    const a0 = Math.atan2(fx.dirY, fx.dirX);
    additive(ctx, () => {
      for (let i = 0; i < 9; i++) {
        const k = (i * 37) % 9;
        const d = fx.size * (0.3 + (k / 9) * 0.9) * (1.2 - t * 0.4);
        const a = a0 + (i - 4) * 0.18;
        glow(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d - 3 * (1 - t), 5 + k * 0.4, i % 3 === 0 ? "#e0fbff" : i % 2 ? "#2a8aff" : "#6ad8ff", t * 0.9);
      }
    });
  }
  ctx.globalAlpha = 1;
  return true;
}

/** 화면 왼쪽 위 먹은 영혼 수와 쌓인 공격력 ("12 SOUL ATK +0.12", 사탄의 가면은 하나마다 0.1) · scale = 게임 1픽셀의 화면 픽셀 */
export function drawSoulHud(ctx: Ctx, s: RunState, scale: number): void {
  const p = s.player;
  if (p.characterId !== "apostle") return;
  const n = p.apEaten ?? 0;
  // 화면이 커도 글자는 작게 (게임 배율의 절반쯤) · 살짝 투명하게
  const k = hudScale(scale);
  ctx.setTransform(k, 0, 0, k, 0, 0);
  ctx.save();
  ctx.globalAlpha = 0.85;
  // 협동이면 왼쪽 위 인원 표 아래로
  ctx.translate(6, s.party ? ((30 + 5 * s.party.length) * scale) / k : 16);
  // 작은 영혼 (하늘색 불꽃)
  ctx.fillStyle = "#1a1622";
  ctx.fillRect(-1, -11, 9, 12);
  ctx.fillStyle = "#7ad8ff";
  ctx.fillRect(1, -7, 5, 6);
  ctx.fillRect(2, -10, 3, 3);
  ctx.fillStyle = "#e8faff";
  ctx.fillRect(2, -5, 3, 3);
  ctx.font = "bold 11px monospace";
  ctx.textBaseline = "alphabetic";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#1a1622";
  const num = String(n);
  ctx.strokeText(num, 11, 0);
  ctx.fillStyle = "#bfeaff";
  ctx.fillText(num, 11, 0);
  const nw = ctx.measureText(num).width;
  ctx.font = "bold 6px monospace";
  const add = `SOUL  ATK +${soulAttack(p).toFixed(2)}`;
  ctx.strokeText(add, 14 + nw, 0);
  ctx.fillText(add, 14 + nw, 0);
  ctx.restore();
}
