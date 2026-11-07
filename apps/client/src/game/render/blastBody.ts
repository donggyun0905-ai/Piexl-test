// 블래스트 그리기 (몸 둘레): 체력 줄 위 탄약 · 달빛 각성 중 몸을 감싸는 흰 달빛 · 머리 위 초승달 (각성이 끝나 갈수록 흐려짐)
import { BLAST, isBlast, type RunState } from "@pixel-rogue/shared";
import { hpBarTop } from "./hpTop";
import { lerp, type Snap } from "./palette";
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

/** 체력 줄 위 탄약: 붉은 탄피 (남은 발은 밝게 · 쏜 발은 어둡게) · 펌프질 중엔 아래 금빛 줄이 깜빡임 */
export function drawBlastAmmo(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isBlast(p) || s.over) return;
  const x = snap(lerp(p.prevX, p.x, a0));
  const top = hpBarTop(p, snap(lerp(p.prevY, p.y, a0))) - 9;
  const max = BLAST.stepTime.length;
  const step = p.blStep ?? 0;
  const pumping = step === 0 && p.attackCooldown > 0 && (p.blGap ?? 0) === 0 && p.attackCount > 0;
  const left = pumping ? 0 : max - step;
  for (let k = 0; k < max; k++) {
    const sx = x - max * 3 + k * 6 + 1;
    const on = k < left;
    ctx.fillStyle = "#1a1014";
    ctx.fillRect(sx - 1, top - 1, 5, 8);
    ctx.fillStyle = on ? "#d82a2a" : "#4a2a2a";
    ctx.fillRect(sx, top, 3, 4);
    ctx.fillStyle = on ? "#f0c050" : "#5a4a30";
    ctx.fillRect(sx, top + 4, 3, 2);
    if (on) {
      ctx.fillStyle = "#ff8a7a";
      ctx.fillRect(sx, top, 1, 3);
    }
  }
  if (pumping && (s.tick >> 2) % 2) {
    ctx.fillStyle = "#f0c050";
    ctx.fillRect(x - max * 3, top + 7, max * 6, 1);
  }
}
