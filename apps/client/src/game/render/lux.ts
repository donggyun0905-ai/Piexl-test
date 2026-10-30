// 빛의 사도 그리기: 빛의 칼날 탄 · '+' 빛의 검(주황 굵은 테두리 → 노랑 → 흰 가운데, 주황이 더 많게) · 칼날 휘두름 · 빛의 조각 · 성장 빛 · 빛의 적 등장
// 몸 둘레 빛(성장 단계마다 진해짐) · 은총의 옷자락 머리 위 빛의 검 날개 · 빛의 적 둘레 금빛 기운 · 왼쪽 위 빛의 조각 창 (조각 수 · 다음 성장까지)
import { LUX, luxShards, luxStage, type EffectState, type EnemyState, type ProjectileState, type RunState } from "@pixel-rogue/shared";
import { customImage } from "../customArt";
import { hudScale } from "./imugiAura";
import { lerp, type Snap } from "./palette";
import { additive, glow } from "./pwFxBits";

type Ctx = CanvasRenderingContext2D;
const OR = "#ff8a1a";
const YE = "#ffe060";
const WH = "#fffbe8";
const RD = "#e0283a";

/** '+' 빛 한 개 (rot = 45° 돌림 '×'): 굵은 주황 테두리 · 노란 속 · 흰 가운데 · 끝이 뾰족한 네 갈래 */
export function lightStar(ctx: Ctx, x: number, y: number, arm: number, rot: boolean, a: number): void {
  ctx.save();
  ctx.translate(x, y);
  if (rot) ctx.rotate(Math.PI / 4);
  ctx.globalAlpha = a;
  const w = Math.max(2, arm * 0.28);
  const path = (k: number) => {
    const L = arm * k;
    const W = w * k;
    ctx.beginPath();
    ctx.moveTo(0, -L);
    ctx.lineTo(W * 0.5, -W * 0.5);
    ctx.lineTo(L, 0);
    ctx.lineTo(W * 0.5, W * 0.5);
    ctx.lineTo(0, L);
    ctx.lineTo(-W * 0.5, W * 0.5);
    ctx.lineTo(-L, 0);
    ctx.lineTo(-W * 0.5, -W * 0.5);
    ctx.closePath();
  };
  path(1.18);
  ctx.fillStyle = OR;
  ctx.fill();
  path(0.82);
  ctx.fillStyle = "#ffb030";
  ctx.fill();
  path(0.5);
  ctx.fillStyle = YE;
  ctx.fill();
  path(0.22);
  ctx.fillStyle = WH;
  ctx.fill();
  ctx.restore();
}

/** 그려 주신 빛의 검 그림 (sprites/custom/fx_luxCross·붉은 것 fx_luxCrossRed, 64칸 · 가운데에서 끝까지 약 26칸). 못 불러오면 코드 그림 */
export function lightSword(ctx: Ctx, x: number, y: number, arm: number, ang: number, a: number, red = false): void {
  const img = customImage(red ? "fx:luxCrossRed" : "fx:luxCross");
  if (!img) return lightStar(ctx, x, y, arm, ang !== 0, a);
  const k = (arm * 1.18) / 26;
  ctx.save();
  ctx.translate(x, y);
  if (ang) ctx.rotate(ang);
  ctx.globalAlpha = a;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, -32 * k, -32 * k, 64 * k, 64 * k);
  ctx.restore();
}

/** 빛의 칼날 탄 (날아가는 쪽으로 가늘고 긴 빛) */
export function drawLuxShot(ctx: Ctx, pr: ProjectileState, x: number, y: number): boolean {
  if (!pr.lx) return false;
  const len = Math.hypot(pr.vx, pr.vy) || 1;
  const ux = pr.vx / len;
  const uy = pr.vy / len;
  const L = 7 + pr.lx * 2;
  additive(ctx, () => {
    glow(ctx, x, y, 6 + pr.lx! * 1.5, OR, 0.5);
    ctx.lineCap = "round";
    for (const [c, w] of [[OR, 4], [YE, 2.2], [WH, 1]] as const) {
      ctx.strokeStyle = c;
      ctx.lineWidth = w;
      ctx.beginPath();
      ctx.moveTo(x - ux * L, y - uy * L);
      ctx.lineTo(x + ux * 3, y + uy * 3);
      ctx.stroke();
    }
  });
  return true;
}

/** 효과: lxCross · lxSwing · lxShard · lxGrow · lxFoe */
export function drawLuxFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!fx.kind.startsWith("lx")) return false;
  const t = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  if (fx.kind === "lxCross") {
    // 빠르게 생겨(처음 15%) 반짝이다 사라짐 · 바닥 빛 · 흩어지는 불티
    const grow = Math.min(1, t / 0.15);
    const fade = t < 0.55 ? 1 : 1 - (t - 0.55) / 0.45;
    const red = fx.dirX >= 2;
    additive(ctx, () => glow(ctx, x, y, fx.size * 1.6, red ? RD : OR, 0.55 * fade, 0.3));
    lightSword(ctx, x, y, fx.size * (0.5 + 0.5 * grow) * (1 + 0.08 * Math.sin(t * 20)), fx.dirX % 2 ? Math.PI / 4 : 0, fade, red);
    additive(ctx, () => {
      for (let i = 0; i < 6; i++) {
        const a = i * 1.047 + fx.x;
        const r = fx.size * (0.6 + t * 1.2);
        glow(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r, 2, i % 2 ? (red ? WH : YE) : red ? RD : OR, fade * 0.9);
      }
    });
    return true;
  }
  if (fx.kind === "lxSwing") {
    additive(ctx, () => {
      ctx.strokeStyle = `rgba(255, 200, 80, ${1 - t})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      const a = Math.atan2(fx.dirY, fx.dirX);
      ctx.arc(x, y, fx.size, a - 0.8, a + 0.8);
      ctx.stroke();
    });
    return true;
  }
  if (fx.kind === "lxShard") {
    // 빛의 조각이 떨어짐: 금빛 기둥 + 오르는 반짝임
    additive(ctx, () => {
      glow(ctx, x, y, fx.size * (1 - t * 0.5), YE, 0.8 * (1 - t), 0.5);
      for (let i = 0; i < 5; i++) glow(ctx, x + Math.sin(i * 2 + t * 6) * 6, y - t * 30 - i * 5, 2, i % 2 ? WH : OR, 1 - t);
    });
    lightStar(ctx, x, y - 6 - t * 10, 5 + 3 * (1 - t), false, 1 - t);
    return true;
  }
  if (fx.kind === "lxGrow") {
    // 성장: 커지는 금빛 고리 · 사방 빛살 · 큰 '+' 빛
    additive(ctx, () => {
      glow(ctx, x, y - 10, fx.size * (0.6 + t), YE, 0.9 * (1 - t), 0.6);
      ctx.strokeStyle = `rgba(255, 200, 80, ${1 - t})`;
      ctx.lineWidth = 3 * (1 - t) + 1;
      ctx.beginPath();
      ctx.arc(x, y - 6, fx.size * t * 1.4, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const r0 = fx.size * 0.3 * t;
        const r1 = fx.size * (0.4 + t);
        ctx.strokeStyle = `rgba(255, 240, 180, ${0.8 * (1 - t)})`;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * r0, y - 6 + Math.sin(a) * r0);
        ctx.lineTo(x + Math.cos(a) * r1, y - 6 + Math.sin(a) * r1);
        ctx.stroke();
      }
    });
    lightStar(ctx, x, y - 26, 10 + fx.dirY * 3, t > 0.5, 1 - t);
    return true;
  }
  if (fx.kind === "lxFoe") {
    // 빛의 적 등장: 하늘에서 내리꽂히는 빛
    additive(ctx, () => {
      ctx.fillStyle = `rgba(255, 210, 100, ${0.5 * (1 - t)})`;
      ctx.fillRect(x - 6 * (1 - t) - 2, y - 120, 12 * (1 - t) + 4, 120);
      glow(ctx, x, y, fx.size * (1 + t), YE, 0.7 * (1 - t), 0.4);
    });
    return true;
  }
  return false;
}

/** 몸 둘레 (플레이어 다음): 성장 단계마다 진해지는 금빛 · 떠다니는 작은 빛 · 배의 문신 빛 */
export function drawLuxAura(ctx: Ctx, s: RunState, a: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "lux" || p.hp <= 0) return;
  const st = luxStage(p);
  const x = snap(lerp(p.prevX, p.x, a));
  const y = snap(lerp(p.prevY, p.y, a));
  const f = 0.8 + 0.2 * Math.sin(s.tick * 0.12);
  const top = 22 + st * 6;
  additive(ctx, () => {
    glow(ctx, x, y - 8, 12 + st * 6, OR, (0.12 + st * 0.08) * f);
    glow(ctx, x, y - top * 0.42, 2.5 + st, YE, 0.6 * f, 0.5);
    for (let i = 0; i < 2 + st * 2; i++) {
      const k = ((s.tick + i * 29) % 120) / 120;
      const ang = i * 2.4 + s.tick * 0.02;
      glow(ctx, x + Math.cos(ang) * (10 + st * 3), y - 4 - k * (top + 8), 1.6, i % 2 ? WH : YE, 1 - k);
    }
  });
  // 은총의 옷자락: 머리 위 양쪽에 빛의 검 두 개가 날개처럼 (천천히 오르내림)
  if (p.passives.includes("lxGrace")) for (const side of [-1, 1]) {
    const bob = Math.sin(s.tick * 0.08 + side) * 1.5;
    additive(ctx, () => glow(ctx, x + side * (10 + st * 2), y - top - 4 + bob, 7 + st, OR, 0.35 * f));
    lightSword(ctx, x + side * (10 + st * 2), y - top - 4 + bob, 6 + st * 1.5, side * 0.45, 0.95);
  }
  if (st >= 2) for (let i = 0; i < st - 1; i++) {
    const ang = s.tick * 0.04 + (i * Math.PI * 2) / (st - 1);
    lightStar(ctx, x + Math.cos(ang) * (14 + st * 2), y - top * 0.6 + Math.sin(ang) * 5, 3, i % 2 === 1, 0.85);
  }
}

/** 빛의 적 둘레 금빛 기운 · 그림자(1대1)는 금빛 테 (적 그리기 다음) */
export function drawLuxFoe(ctx: Ctx, e: EnemyState, x: number, y: number, tick: number): void {
  if (!e.lux) return;
  const f = 0.75 + 0.25 * Math.sin(tick * 0.15 + e.id);
  additive(ctx, () => {
    glow(ctx, x, y, e.r * 2.4, OR, 0.35 * f, 0.2);
    for (let i = 0; i < 4; i++) {
      const k = ((tick + i * 17 + e.id) % 60) / 60;
      glow(ctx, x + Math.sin(i * 1.7 + e.id) * e.r, y - k * e.r * 2.5, 1.6, YE, 1 - k);
    }
  });
  lightStar(ctx, x, y - e.r - 8, 3.5, (Math.floor(tick / 20) + e.id) % 2 === 0, 0.9);
}

/** 왼쪽 위 빛의 조각 창 ("7 LIGHT · 다음 성장까지 5"), scale = 게임 1픽셀의 화면 픽셀 */
export function drawLuxHud(ctx: Ctx, s: RunState, scale: number): void {
  const p = s.player;
  if (p.characterId !== "lux") return;
  const n = luxShards(p);
  const st = luxStage(p);
  const k = hudScale(scale);
  ctx.setTransform(k, 0, 0, k, 0, 0);
  ctx.save();
  ctx.globalAlpha = 0.9;
  ctx.translate(6, s.party ? ((30 + 5 * s.party.length) * scale) / k : 16);
  ctx.fillStyle = "#1a1408";
  ctx.fillRect(-2, -12, 12, 13);
  lightStar(ctx, 4, -6, 5, Math.floor(s.tick / 30) % 2 === 1, 1);
  ctx.font = "bold 11px monospace";
  ctx.textBaseline = "alphabetic";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#1a1408";
  const num = String(n);
  ctx.strokeText(num, 13, 0);
  ctx.fillStyle = YE;
  ctx.fillText(num, 13, 0);
  const nw = ctx.measureText(num).width;
  ctx.font = "bold 6px monospace";
  const left = st >= LUX.maxStage ? "MAX" : `NEXT ${LUX.perStage - (n % LUX.perStage)}`;
  const add = `LIGHT  STAGE ${st}  ${left}`;
  ctx.strokeText(add, 16 + nw, 0);
  ctx.fillText(add, 16 + nw, 0);
  ctx.restore();
}
