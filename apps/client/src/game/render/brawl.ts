// 격투가 그리기: 파동탄 · 기 모으기(파동탄 공·킥 모으기 고리) · 버티기 기운 · 차력쇼 기운 · 바위 · 도망가는 적 표시 · 콤보 단계 점
import { COMBOS, WEAPONS, type ProjectileState, type RunState, type WeaponDef } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, glow, shock } from "./pwFxBits";

/** 파동탄이면 그리고 true: 푸른 빛 + 흰 가운데 */
export function drawKiShot(ctx: CanvasRenderingContext2D, pr: ProjectileState, x: number, y: number): boolean {
  if (pr.spirit !== "ki") return false;
  // 기의 꼬리 · 푸른 빛 번짐 · 흰 가운데
  const v = Math.hypot(pr.vx, pr.vy) || 1;
  additive(ctx, () => {
    for (let i = 1; i <= 4; i++) glow(ctx, x - (pr.vx / v) * i * pr.r * 0.9, y - (pr.vy / v) * i * pr.r * 0.9, pr.r * (2 - i * 0.3), "#4ac0ff", 0.5 - i * 0.1);
    glow(ctx, x, y, pr.r * 2.8, "#4ac0ff", 0.9, 1.2);
  });
  ctx.fillStyle = "rgba(74, 192, 255, 0.6)";
  ctx.beginPath();
  ctx.arc(x, y, pr.r + 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e8faff";
  ctx.beginPath();
  ctx.arc(x, y, pr.r * 0.6, 0, Math.PI * 2);
  ctx.fill();
  return true;
}

/** 플레이어 둘레 (플레이어 다음) */
export function drawBrawl(ctx: CanvasRenderingContext2D, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  const w: WeaponDef = WEAPONS[p.weaponId];
  // 도망가는 적(공포) 표시는 모든 적 공통으로 render/statusMarks
  if (w.kind !== "combo" || s.over) return;
  const x = snap(lerp(p.prevX, p.x, alpha));
  const y = snap(lerp(p.prevY, p.y, alpha));
  if ((p.guardTicks ?? 0) > 0 || (p.buffTicks ?? 0) > 0) {
    // 버티기(금빛)·차력쇼(붉은빛) 기운
    const c = (p.guardTicks ?? 0) > 0 ? "#ffd25a" : "#ff5a5a";
    additive(ctx, () => {
      glow(ctx, x, y, p.r + 10, c, 0.45);
      shock(ctx, x, y, p.r + 5 + Math.sin(s.tick * 0.25) * 1.2, c, 0.8, 3);
    });
  }
  if (p.rock) {
    // 보스 앞에서 만든 바위: 머리 위에 듦
    ctx.fillStyle = "#6a6070";
    ctx.fillRect(x - 5, y - p.r - 10, 10, 7);
    ctx.fillStyle = "#9a90a0";
    ctx.fillRect(x - 3, y - p.r - 10, 5, 2);
  }
  const style = w.combo ? COMBOS[w.combo] : [];
  if ((p.chargeTicks ?? 0) > 0 && style[p.chargeMove ?? 0]?.kind === "shot") {
    // 파동탄 모으기: 손앞에서 커지는 푸른 공
    const k = 1 - (p.chargeTicks ?? 0) / (style[p.chargeMove ?? 0]?.charge ?? 1);
    const r = p.r + 2 + 6 * k + Math.sin(s.tick * 0.6) * 0.6;
    additive(ctx, () => {
      glow(ctx, x, y, r * 1.6, "#4ac0ff", 0.5 + 0.4 * k, k);
      // 모여드는 기 (안쪽으로 조여 드는 고리)
      shock(ctx, x, y, r * (2.2 - ((s.tick % 20) / 20) * 1.2), "#a8e8ff", 0.5, 2);
    });
  } else if ((p.chargeTicks ?? 0) > 0) {
    // 킥 모으기: 줄어드는 고리
    const m = style[p.chargeMove ?? 0];
    const k = (p.chargeTicks ?? 0) / (m?.charge ?? 1);
    ctx.strokeStyle = "rgba(255, 180, 90, 0.9)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, Math.max(1, (m?.range ?? 30) * k), 0, Math.PI * 2);
    ctx.stroke();
  }
  // 콤보 단계 점 (발 아래)
  if (style.length > 1) {
    const step = p.comboStep ?? 0;
    const left = x - (style.length - 1) * 1.5;
    for (let i = 0; i < style.length; i++) {
      ctx.fillStyle = i < step ? "#ffe070" : "rgba(255, 255, 255, 0.3)";
      ctx.fillRect(Math.round(left + i * 3), Math.round(y + p.r + 3), 2, 1);
    }
  }
}
