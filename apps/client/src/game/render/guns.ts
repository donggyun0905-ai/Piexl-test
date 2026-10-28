// 거너 그리기: 총알(치명타는 주황) · 드론 · 탄창·장전 막대 · 미니건 예열 · 특수용병 보호막 타이밍(NOW!) · 고장 표시 · 수류탄 날아가기 · 건 마스터 유령 총
import { dronePositions, mercGuardOpen, reloadTicksOf, SPIN_FULL, WEAPONS, type EffectState, type ProjectileState, type RunState, type WeaponDef } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, alpha as fade, glow, shock } from "./pwFxBits";

/** 특수용병 NOW! 색 (다음 콤보 단계 0~3: 마무리 뒤 파랑 · 1콤보 뒤 빨강 · 2 노랑 · 3 초록) */
const NOW_COLORS = ["#5a9aff", "#ff4a4a", "#ffe04a", "#5aef6a"];

/** 총알이면 그리고 true: 예광탄 (가늘어지는 빛 꼬리 + 밝은 탄두, 치명타는 주황 불꽃) */
export function drawBullet(ctx: CanvasRenderingContext2D, pr: ProjectileState, x: number, y: number): boolean {
  if (pr.spirit !== "bullet") return false;
  const c = pr.crit ? "#ff8a30" : "#ffe890";
  const tx = x - pr.vx * (pr.crit ? 2.6 : 2);
  const ty = y - pr.vy * (pr.crit ? 2.6 : 2);
  additive(ctx, () => {
    const g = ctx.createLinearGradient(x, y, tx, ty);
    g.addColorStop(0, fade(c, 0.9));
    g.addColorStop(1, fade(c, 0));
    ctx.strokeStyle = g;
    ctx.lineWidth = pr.crit ? 3 : 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(tx, ty);
    ctx.stroke();
    ctx.lineCap = "butt";
    glow(ctx, x, y, pr.crit ? 6 : 4, c, 0.9, 1.2);
  });
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
  return true;
}

/** 플레이어 둘레 (플레이어 다음): 드론 · 탄창·장전 · 예열 · 고장 */
export function drawGunner(ctx: CanvasRenderingContext2D, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  const w: WeaponDef = WEAPONS[p.weaponId];
  if (w.kind !== "gun" || s.over) return;
  const x = lerp(p.prevX, p.x, alpha);
  const y = lerp(p.prevY, p.y, alpha);
  for (const d of dronePositions(s, x, y)) {
    const dx = snap(d.x);
    const dy = snap(d.y);
    ctx.fillStyle = d.support ? "#8ab8ff" : "#5a6070";
    ctx.fillRect(dx - 2, dy - 1, 5, 3);
    ctx.fillStyle = "#c8ccd8";
    ctx.fillRect(dx - 4, dy - 2 + (s.tick % 4 < 2 ? 0 : 1), 2, 1);
    ctx.fillRect(dx + 3, dy - 2 + (s.tick % 4 < 2 ? 1 : 0), 2, 1);
    ctx.fillStyle = "#ff5a48";
    ctx.fillRect(dx, dy + 1, 1, 1);
  }
  const bx = snap(x) - 7;
  const by = snap(y) + p.r + 6;
  if (w.mag) {
    // 탄창: 남은 탄 비율 · 장전 중이면 주황 막대가 차오름
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(bx - 1, by - 1, 16, 3);
    const reloading = (p.reloadLeft ?? 0) > 0 && w.gun !== "shotgun";
    const k = reloading ? 1 - (p.reloadLeft ?? 0) / reloadTicksOf(p, w) : (p.ammo ?? w.mag) / w.mag;
    ctx.fillStyle = reloading ? "#ff9a3c" : "#fff3b0";
    ctx.fillRect(bx, by, Math.max(0, Math.round(14 * k)), 1);
  }
  if (w.gun === "minigun" && (p.spin ?? 0) > 0 && (p.spin ?? 0) < SPIN_FULL) {
    ctx.strokeStyle = "rgba(255, 200, 90, 0.85)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(snap(x), snap(y), p.r + 4, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * (p.spin ?? 0)) / SPIN_FULL);
    ctx.stroke();
  }
  if (mercGuardOpen(s)) {
    // 특수용병: 지금 스페이스를 누르면 보호막 → 머리 위에 통통 튀는 NOW! (1콤보 뒤 빨강 · 2 노랑 · 3 초록 · 마무리 뒤 파랑, 막 뜰 때 크게)
    const bob = (s.tick >> 2) % 2;
    const pop = p.attackCooldown > 12;
    ctx.font = `bold ${pop ? 11 : 8}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillText("NOW!", snap(x) + 1, snap(y) - p.r - 7 - bob + 1);
    ctx.fillStyle = NOW_COLORS[p.gunStep ?? 0]!;
    ctx.fillText("NOW!", snap(x), snap(y) - p.r - 7 - bob);
  }
  if ((p.jamTicks ?? 0) > 0) {
    // 고장: 머리 위 회색 연기
    ctx.fillStyle = "rgba(160, 160, 170, 0.8)";
    ctx.fillRect(snap(x) + 3, snap(y) - p.r - 7 - ((s.tick >> 3) % 3), 3, 3);
    ctx.fillRect(snap(x) - 4, snap(y) - p.r - 5 - ((s.tick >> 3) % 2), 2, 2);
  }
}

/** 수류탄·유령 총 효과면 그리고 true */
export function drawGunFx(ctx: CanvasRenderingContext2D, fx: EffectState, snap: Snap): boolean {
  const t = fx.ticks / fx.maxTicks;
  if (fx.kind === "lob") {
    // 포물선으로 도는 수류탄 (바닥 그림자) + 떨어질 자리: 조여 드는 붉은 고리·십자
    const k = 1 - t;
    const tx = snap(fx.toX ?? fx.x);
    const ty = snap(fx.toY ?? fx.y);
    const r = fx.size * (0.4 + 0.6 * k);
    additive(ctx, () => {
      glow(ctx, tx, ty, fx.size * 0.8, "#ff5a5a", 0.25 + 0.25 * k);
      shock(ctx, tx, ty, fx.size, "#ff5a5a", 0.5, 2);
      shock(ctx, tx, ty, Math.max(2, fx.size * t), "#ffb0a0", 0.7, 2);
    });
    ctx.strokeStyle = "rgba(255, 120, 120, 0.8)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(tx - r * 0.4, ty);
    ctx.lineTo(tx + r * 0.4, ty);
    ctx.moveTo(tx, ty - r * 0.4);
    ctx.lineTo(tx, ty + r * 0.4);
    ctx.stroke();
    const gx = lerp(fx.x, tx, k);
    const gy0 = lerp(fx.y, ty, k);
    const gy = gy0 - Math.sin(Math.PI * k) * 18;
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.ellipse(gx, gy0 + 2, 3, 1.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.translate(snap(gx), snap(gy));
    ctx.rotate(k * 9);
    ctx.fillStyle = "#3a5a2a";
    ctx.fillRect(-2.5, -2.5, 5, 5);
    ctx.fillStyle = "#6a8a4a";
    ctx.fillRect(-1.5, -2.5, 2, 2);
    ctx.fillStyle = "#c8ccd8";
    ctx.fillRect(-0.5, -3.5, 1, 1);
    ctx.restore();
    // 심지 불꽃
    additive(ctx, () => glow(ctx, gx, gy - 3, 3, "#ffb040", 0.9, 1));
    return true;
  }
  if (fx.kind === "ghostgun") {
    // 건 마스터 유령 총: 푸른 빛으로 떠올랐다 총구가 번쩍이고 흩어짐
    const x = snap(fx.x);
    const y = snap(fx.y);
    additive(ctx, () => {
      glow(ctx, x, y, 9, "#8ac8ff", t * 0.7);
      if (t < 0.5) glow(ctx, x + 6, y, 5, "#ffffff", (0.5 - t) * 2, 1.5);
    });
    ctx.globalAlpha = t * 0.9;
    ctx.fillStyle = "#1a2a4a";
    ctx.fillRect(x - 4, y - 2, 9, 4);
    ctx.fillRect(x - 4, y + 1, 3, 4);
    ctx.fillStyle = "#c8e0ff";
    ctx.fillRect(x - 3, y - 1, 7, 2);
    ctx.fillRect(x - 3, y + 1, 2, 3);
    ctx.globalAlpha = 1;
    return true;
  }
  return false;
}
