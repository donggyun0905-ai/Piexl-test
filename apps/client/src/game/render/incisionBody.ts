// 인시전 그리기 (몸 위): 콤보 단계가 오를수록 몸 둘레 붉은 기운이 짙어짐 · 광란 각성 중 붉은 기운·올라가는 핏빛 불티
// 도살 도약 착지 자리 (조여드는 붉은 고리) · 날아가는 초승달 · 곧 터질 피의 길 (가는 붉은 선) · 갈라진 땅 (붉은 균열) · 피의 소용돌이 (도는 칼빛)
// 화면 왼쪽 위 "35 COMBO" + 다음 도살 도약까지 막대 (render/index에서 부름) · 이펙트는 render/incisionFx
import { comboTier, INCISION, INCISION_PERKS, isIncision, type RunState } from "@pixel-rogue/shared";
import { hudScale } from "./imugiAura";
import { IC } from "./incisionFx";
import { lerp, type Snap } from "./palette";
import { additive, alpha, crescent, glow, ring, type Ctx } from "./pwFxBits";

/** 갈라진 땅: 둘레 원 + 가운데에서 뻗은 균열 몇 줄 (자리마다 정해진 모양) */
function cracks(ctx: Ctx, x: number, y: number, r: number, al: number): void {
  additive(ctx, () => {
    glow(ctx, x, y, r, IC.deep, 0.3 * al, 0);
    ring(ctx, x, y, r, alpha(IC.red, 0.6 * al), 1);
    ctx.strokeStyle = alpha(IC.red, 0.8 * al);
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2 + ((x * 7 + y) % 5) * 0.3;
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(a + 0.2) * r * 0.5, y + Math.sin(a + 0.2) * r * 0.5);
      ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    }
    ctx.stroke();
  });
}

export function drawIncisionAura(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isIncision(p) || s.over) return;
  const x = snap(lerp(p.prevX, p.x, a0));
  const y = snap(lerp(p.prevY, p.y, a0));
  const tier = comboTier(p);
  const awake = (p.sgAwake ?? 0) > 0;
  additive(ctx, () => {
    if (tier > 0 || awake) glow(ctx, x, y - 8, 14 + tier * 2, IC.red, (awake ? 0.3 : 0.06 * tier) + 0.05 * Math.sin(s.tick * 0.25));
    for (const w of p.icWaves ?? []) {
      glow(ctx, snap(w.x), snap(w.y), 10, IC.red, 0.45);
      crescent(ctx, snap(w.x), snap(w.y), 9, Math.atan2(w.vy, w.vx), 1.2, 4, IC.red, 0.95);
    }
    if (p.icVortex) {
      const r = INCISION.whirlR * 0.9;
      for (let i = 0; i < 3; i++) crescent(ctx, x, y - 4, r, s.tick * 0.3 + (i * Math.PI * 2) / 3, 0.9, 3, IC.red, 0.7);
    }
    const l = p.icLeap;
    if (l) ring(ctx, snap(l.x), snap(l.y), 6 + 20 * (l.t / l.max), alpha(IC.red, 0.9), 1.5);
  });
  for (const z of p.icZones ?? []) {
    if (z.k === 1) cracks(ctx, snap(z.x), snap(z.y), z.r, Math.min(1, z.t / 30));
    else additive(ctx, () => {
      ctx.strokeStyle = alpha(IC.red, 0.4 + 0.4 * Math.sin(s.tick * 0.6));
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(snap(z.x0), snap(z.y0) - 4);
      ctx.lineTo(snap(z.x), snap(z.y) - 4);
      ctx.stroke();
    });
  }
  if (!awake) return;
  for (let i = 0; i < 4; i++) {
    const t = ((s.tick + i * 11) % 36) / 36;
    ctx.fillStyle = i % 2 ? IC.red : IC.hot;
    ctx.fillRect(Math.round(x - 8 + i * 5), Math.round(y - 4 - t * 24), 1, 2);
  }
}

/** 화면 왼쪽 위 "35 COMBO" (단계가 오를수록 붉게) · 다음 도살 도약까지 막대 · 각성 중 FRENZY 남은 초 */
export function drawIncisionHud(ctx: Ctx, s: RunState, scale: number): void {
  const p = s.player;
  if (!isIncision(p) || s.over) return;
  const combo = p.icCombo ?? 0;
  const awake = (p.sgAwake ?? 0) > 0;
  if (combo <= 0 && !awake) return;
  const k = hudScale(scale);
  ctx.setTransform(k, 0, 0, k, 0, 0);
  ctx.save();
  ctx.globalAlpha = 0.9;
  ctx.translate(6, s.party ? ((30 + 5 * s.party.length) * scale) / k : 16);
  const tier = comboTier(p);
  const color = tier >= 6 ? "#ff2020" : tier >= 3 ? "#ff6a4a" : "#ffd0c0";
  ctx.font = "bold 11px monospace";
  ctx.textBaseline = "alphabetic";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#1a0a0e";
  const num = String(combo);
  ctx.strokeText(num, 0, 0);
  ctx.fillStyle = color;
  ctx.fillText(num, 0, 0);
  const nw = ctx.measureText(num).width;
  ctx.font = "bold 6px monospace";
  ctx.strokeText("COMBO", nw + 3, 0);
  ctx.fillText("COMBO", nw + 3, 0);
  // 다음 도살 도약까지 (준비됐으면 꽉 차서 깜빡임)
  const every = p.passives.includes("icLeapOften") ? INCISION_PERKS.icLeapOften.every : INCISION.leapEvery;
  const next = p.icNextLeap ?? every;
  const v = p.icLeapReady ? 1 : 1 - (next - combo) / Math.max(1, every);
  ctx.fillStyle = "rgba(30,10,14,0.85)";
  ctx.fillRect(0, 4, 60, 3);
  ctx.fillStyle = p.icLeapReady && (s.tick >> 3) % 2 ? "#ffffff" : "#ff3030";
  ctx.fillRect(0, 4, 60 * Math.max(0, Math.min(1, v)), 3);
  if (awake) {
    ctx.fillStyle = "#ff4040";
    ctx.strokeText(`FRENZY ${Math.ceil(p.sgAwake! / 60)}s`, 0, 16);
    ctx.fillText(`FRENZY ${Math.ceil(p.sgAwake! / 60)}s`, 0, 16);
  }
  ctx.restore();
}
