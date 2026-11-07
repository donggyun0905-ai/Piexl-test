// 블래스트 그리기 (몸 둘레): 체력 줄 위 탄약(파란 탄·치명타 탄) · 대시 슬로우모션 잿빛 화면 · 달빛 각성 중 몸을 감싸는 흰 달빛 · 머리 위 초승달 (각성이 끝나 갈수록 흐려짐)
import { BLAST, isBlast, type RunState } from "@pixel-rogue/shared";
import { hpBarTop } from "./hpTop";
import { lerp, type Snap } from "./palette";
import { drawDawnSky } from "./dawnSky";
import { drawFactionScreen } from "./factionFx";
import { additive, crescent, glow, type Ctx } from "./pwFxBits";

export function drawBlastAura(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isBlast(p) || s.over || !(p.sgAwake ?? 0)) return;
  const x = snap(lerp(p.prevX, p.x, a0));
  const y = snap(lerp(p.prevY, p.y, a0));
  const left = Math.min(1, p.sgAwake! / 60);
  const pulse = 0.8 + 0.2 * Math.sin(s.tick * 0.25);
  additive(ctx, () => {
    glow(ctx, x, y - 8, 22, "#c8d8ff", 0.45 * left * pulse, 0.6);
    crescent(ctx, x, y - 34, 7, -Math.PI / 2 + Math.sin(s.tick * 0.05) * 0.2, 2.2, 3, "#ffffff", 0.9 * left);
  });
}

/** 탄피 하나 (x,y 위 끝 · 몸통색 · 밝은 줄 · 바닥 놋쇠) */
function shell(ctx: Ctx, x: number, y: number, body: string, hi: string, base: string): void {
  ctx.fillStyle = "#1a1014";
  ctx.fillRect(x - 1, y - 1, 5, 8);
  ctx.fillStyle = body;
  ctx.fillRect(x, y, 3, 4);
  ctx.fillStyle = hi;
  ctx.fillRect(x, y, 1, 3);
  ctx.fillStyle = base;
  ctx.fillRect(x, y + 4, 3, 2);
}

/** 체력 줄 위 탄약: 슬로우모션 중엔 파란 탄 4칸만 · 아니면 탄창 5칸 (치명타로 나갈 발은 새빨갛게 빛남 · 빈 칸은 어둡게) · 장전 중이면 아래 금빛 줄이 참 */
export function drawBlastAmmo(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isBlast(p) || s.over) return;
  const x = snap(lerp(p.prevX, p.x, a0));
  const top = hpBarTop(p, snap(lerp(p.prevY, p.y, a0))) - 9;
  // 슬로우모션 중: 탄창 대신 파란 탄 4칸 (쏜 칸은 어둡게)
  if ((p.blSlow ?? 0) > 0) {
    const x1 = x - BLAST.blueN * 3 + 1;
    for (let k = 0; k < BLAST.blueN; k++) {
      if (k < (p.blBlue ?? 0)) shell(ctx, x1 + k * 6, top, "#2a8aff", "#aae8ff", "#c8e8ff");
      else shell(ctx, x1 + k * 6, top, "#1a2a3a", "#1a2a3a", "#2a3a4a");
    }
    return;
  }
  const ammo = p.blAmmo ?? BLAST.mag;
  const shots = p.blShots ?? 0;
  const n = BLAST.mag;
  const x0 = x - n * 3 + 1;
  for (let k = 0; k < BLAST.mag; k++) {
    const sx = x0 + k * 6;
    if (k >= ammo) {
      shell(ctx, sx, top, "#3a2a2a", "#3a2a2a", "#4a4030");
      continue;
    }
    const crit = (shots + k) % BLAST.critEvery === BLAST.critEvery - 1;
    shell(ctx, sx, top, crit ? "#ff1a1a" : "#c87a2a", crit ? "#ffd0c0" : "#f0c080", "#f0c050");
    if (crit) additive(ctx, () => glow(ctx, sx + 1, top + 2, 6, "#ff2a1a", 0.5 + 0.3 * Math.sin(s.tick * 0.3)));
  }
  const load = p.blLoad ?? 0;
  if (load > 0) {
    ctx.fillStyle = "#f0c050";
    ctx.fillRect(x0 - 1, top + 7, Math.round(n * 6 * Math.min(1, load / BLAST.loadTicks)), 1);
  }
}

/** 대시 슬로우모션 화면: 온 화면이 잿빛으로 (색을 빼고 가장자리 어둡게) · 위쪽 가운데 남은 시간 막대 (파란색) */
export function drawBlastSlowmo(ctx: Ctx, s: RunState, scale: number): void {
  // 새벽의 성흔: 성흔 각성 중 하얀 달·달빛·깃털 (진영 특징)
  drawDawnSky(ctx, s, scale);
  // 헬리오스 타락 폭주: 화면 테두리 붉은 빛
  drawFactionScreen(ctx, s);
  const p = s.player;
  if (!isBlast(p) || !(p.blSlow ?? 0)) return;
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  const k = Math.min(1, (BLAST.slowTicks - p.blSlow!) / 8, p.blSlow! / 10);
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = "saturation";
  ctx.fillStyle = `rgba(128,128,128,${0.85 * k})`;
  ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = "source-over";
  const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.7);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, `rgba(10,10,16,${0.5 * k})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  const u = Math.max(2, scale * 2);
  const bw = u * 50;
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(W / 2 - bw / 2, u * 14, bw, u * 2);
  ctx.fillStyle = "#6ad8ff";
  ctx.fillRect(W / 2 - bw / 2, u * 14, bw * (p.blSlow! / BLAST.slowTicks), u * 2);
  ctx.restore();
}
