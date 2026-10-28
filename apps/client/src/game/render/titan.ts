// 거인 그리기: 기계팔 주먹 불빛(에너지만큼, 강타 때 불꽃 줄기) · 발밑 에너지 막대 · 내려침·강타 충격파
import { TITAN, WEAPONS, type EffectState, type PlayerState, type RunState } from "@pixel-rogue/shared";
import { additive, glow, shock, sparks } from "./pwFxBits";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;

/** 기계팔 불빛과 에너지 막대 (플레이어 다음, 팔은 그림에 있음) */
export function drawTitanArm(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "titan" || s.over || WEAPONS[p.weaponId].kind !== "titan") return;
  const x = snap(lerp(p.prevX, p.x, alpha));
  const y = snap(lerp(p.prevY, p.y, alpha));
  const need = TITAN.energyMax * (p.passives.includes("bigCapacitor") ? 0.7 : 1);
  const k = Math.min(1, (p.tEnergy ?? 0) / need);
  const full = k >= 1 && (s.tick >> 3) % 2 === 0;
  // 그림 속 주먹 자리: 앞은 오른쪽, 뒤는 왼쪽, 옆은 바라보는 쪽 앞
  const side = Math.abs(p.faceX) > Math.abs(p.faceY);
  const fx = side ? x + Math.sign(p.faceX) * 5 : x + (p.faceY < 0 ? -12 : 12);
  const fy = y - 1;
  if (k > 0) {
    ctx.globalAlpha = (full ? 0.55 : 0.18 + 0.3 * k) * (0.85 + 0.15 * Math.sin(s.tick * 0.3));
    ctx.fillStyle = full ? "#fff4c0" : "#ffb040";
    ctx.beginPath();
    ctx.arc(fx, fy, 3 + 3 * k, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  // 강타로 뻗는 동안 주먹 앞 불꽃 줄기
  const sw = (p.tSwing ?? 0) / 20;
  if (sw > 0) {
    ctx.globalAlpha = sw;
    ctx.strokeStyle = "#ffcf70";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(fx + p.faceX * 14 * (1 - sw * 0.5), fy + p.faceY * 14 * (1 - sw * 0.5));
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 패링 자세: 앞에 강철 방패 빛
  if ((p.tParry ?? 0) > 0) {
    const a = Math.atan2(p.faceY, p.faceX);
    ctx.globalAlpha = 0.5 + 0.5 * ((p.tParry ?? 0) / TITAN.parryTicks);
    ctx.strokeStyle = "#ffe0a0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y - 4, 14, a - 1.1, a + 1.1);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 드릴 강타 돌진: 몸 앞에 커다란 드릴
  if ((p.tDrill ?? 0) > 0) drawDrill(ctx, x + p.faceX * 8, y - 4 + p.faceY * 8, p.faceX, p.faceY, 30, s.tick, 1);
  // 발밑 에너지 막대
  const bx = x - 9;
  const by = y + p.r + 5;
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(bx - 1, by - 1, 20, 3);
  ctx.fillStyle = k >= 1 ? (full ? "#fff4c0" : "#ff9a3c") : "#c87a3a";
  ctx.fillRect(bx, by, Math.round(18 * k), 1);
}

/** 회전하는 드릴 (밑동 (x, y)에서 (dx, dy) 쪽으로 len 길이, k = 진하기) */
function drawDrill(ctx: Ctx, x: number, y: number, dx: number, dy: number, len: number, tick: number, k: number): void {
  const w = len * 0.26;
  const nx = -dy;
  const ny = dx;
  const at = (t: number, side: number) => [x + dx * len * t + nx * w * (1 - t) * side, y + dy * len * t + ny * w * (1 - t) * side] as const;
  ctx.save();
  ctx.globalAlpha = k;
  // 척(물림쇠): 짙은 쇠 고리 둘
  ctx.fillStyle = "#23262e";
  ctx.beginPath();
  ctx.moveTo(x - dx * 5 + nx * (w + 2), y - dy * 5 + ny * (w + 2));
  ctx.lineTo(x + nx * (w + 2), y + ny * (w + 2));
  ctx.lineTo(x - nx * (w + 2), y - ny * (w + 2));
  ctx.lineTo(x - dx * 5 - nx * (w + 2), y - dy * 5 - ny * (w + 2));
  ctx.fill();
  ctx.fillStyle = "#5a606c";
  ctx.fillRect(Math.round(x - dx * 3 + nx * (w + 2)) - 0.5, Math.round(y - dy * 3 + ny * (w + 2)) - 0.5, 1, 1);
  // 날 몸통: 가장자리는 어둡고 가운데는 밝은 쇠 (원뿔)
  const g = ctx.createLinearGradient(x + nx * w, y + ny * w, x - nx * w, y - ny * w);
  g.addColorStop(0, "#4a515c");
  g.addColorStop(0.45, "#e8eef4");
  g.addColorStop(0.6, "#b8c2cc");
  g.addColorStop(1, "#3a404a");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(...at(0, 1));
  ctx.lineTo(x + dx * len, y + dy * len);
  ctx.lineTo(...at(0, -1));
  ctx.closePath();
  ctx.fill();
  // 나선 홈: 비스듬한 짙은 줄이 끝 쪽으로 흘러감 (돌아가는 모습) + 바로 옆 밝은 날
  const phase = (tick % 6) / 6;
  for (let i = 0; i < 6; i++) {
    const t0 = ((i + phase) / 6) * 0.92;
    const t1 = Math.min(0.97, t0 + 0.16);
    const [ax, ay] = at(t0, 1);
    const [bx, by] = at(t1, -1);
    ctx.strokeStyle = "#1e2128";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(ax + dx * 1.2, ay + dy * 1.2);
    ctx.lineTo(bx + dx * 1.2, by + dy * 1.2);
    ctx.stroke();
  }
  const tx = x + dx * len;
  const ty = y + dy * len;
  // 끝을 감싸며 도는 검격 고리 둘 (갈아 내는 날)
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 2; i++) {
    const a = tick * 0.7 + i * Math.PI;
    ctx.strokeStyle = i ? "rgba(255,240,200,0.8)" : "rgba(200,230,255,0.75)";
    ctx.beginPath();
    ctx.ellipse(tx - dx * 3, ty - dy * 3, w * 0.9 + 2, w * 0.45 + 1, Math.atan2(dy, dx) + Math.PI / 2, a, a + 2.2);
    ctx.stroke();
  }
  // 갈리며 뒤로 튀는 불꽃 줄기
  for (let i = 0; i < 7; i++) {
    const seed = (tick * 7 + i * 13) % 17;
    const spread = ((seed / 17) * 2 - 1) * 1.3;
    const bx = -dx * Math.cos(spread) - nx * Math.sin(spread);
    const by = -dy * Math.cos(spread) - ny * Math.sin(spread);
    const r0 = 2 + (seed % 4);
    const r1 = r0 + 3 + (seed % 3);
    ctx.strokeStyle = seed % 3 ? "#ffb040" : "#fff4c0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(tx + bx * r0, ty + by * r0);
    ctx.lineTo(tx + bx * r1, ty + by * r1);
    ctx.stroke();
  }
  ctx.restore();
}

/** 내려침(갈색 충격파) · 강타(주황 큰 충격파 + 파편)면 그리고 true */
export function drawTitanFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (fx.kind === "titanDrill") {
    const t = fx.ticks / fx.maxTicks;
    const out = 0.5 + 0.5 * Math.sin((1 - t) * Math.PI);
    drawDrill(ctx, snap(fx.x + fx.dirX * 6), snap(fx.y - 4 + fx.dirY * 6), fx.dirX, fx.dirY, fx.size * out, fx.ticks * 2, Math.min(1, t * 2));
    return true;
  }
  if (fx.kind === "titanParry") {
    const t = fx.ticks / fx.maxTicks;
    const x = snap(fx.x);
    const y = snap(fx.y - 4);
    // 패링: 금빛 섬광 + 충격파 + 튀는 불똥
    additive(ctx, () => {
      glow(ctx, x, y, fx.size * 1.3, "#ffcf70", t, t > 0.7 ? 1.6 : 0.5);
      shock(ctx, x, y, fx.size * (1.6 - t), "#fff4c0", t, 5);
      sparks(ctx, x, y, 10, fx.size * 2, 1 - t, "#ffe08a", fx.x + fx.y);
    });
    ctx.globalAlpha = t;
    ctx.fillStyle = "#ffcf70";
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const r = fx.size * (1.9 - t);
      ctx.fillRect(Math.round(x + Math.cos(a) * r), Math.round(y + Math.sin(a) * r), 2, 2);
    }
    ctx.font = "bold 7px monospace";
    ctx.textAlign = "center";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#1a1622";
    ctx.strokeText("PARRY", x, y - 20 - (1 - t) * 6);
    ctx.fillStyle = "#ffe08a";
    ctx.fillText("PARRY", x, y - 20 - (1 - t) * 6);
    ctx.textAlign = "left";
    ctx.globalAlpha = 1;
    return true;
  }
  if (fx.kind !== "titanSlam" && fx.kind !== "titanSmash") return false;
  const t = fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const big = fx.kind === "titanSmash";
  // 내려침·강타: 땅에 눕힌 충격파 + 먼지 (강타는 주황 빛과 불똥)
  additive(ctx, () => {
    ctx.save();
    ctx.translate(x, y + 2);
    ctx.scale(1, 0.6);
    if (big) glow(ctx, 0, 0, fx.size, "#ff9a3c", t * 0.7, t > 0.8 ? 1.4 : 0.3);
    shock(ctx, 0, 0, fx.size * (1.1 - t * 0.6), big ? "#ffb060" : "#c8a888", t, big ? 8 : 5);
    ctx.restore();
    if (big) sparks(ctx, x, y, 10, fx.size * 1.2, 1 - t, "#ffd060", fx.x + fx.y);
  });
  ctx.fillStyle = `rgba(90, 70, 50, ${0.35 * t})`;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.4;
    const r = fx.size * (1 - t) * 0.8;
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * r, y + 2 + Math.sin(a) * r * 0.5 - (1 - t) * 3, 3 + (1 - t) * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = t * (big ? 0.9 : 0.7);
  ctx.strokeStyle = big ? "#ff9a3c" : "#a88a6a";
  ctx.lineWidth = big ? 3 : 2;
  ctx.beginPath();
  ctx.ellipse(x, y + 2, fx.size * (1.1 - t * 0.6), fx.size * (1.1 - t * 0.6) * 0.6, 0, 0, Math.PI * 2);
  ctx.stroke();
  if (big) {
    ctx.fillStyle = "#c8a070";
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      const r = fx.size * (1 - t) * 0.9;
      ctx.fillRect(snap(x + Math.cos(a) * r), snap(y + Math.sin(a) * r * 0.6 - (1 - t) * 6), 2, 2);
    }
  }
  ctx.globalAlpha = 1;
  return true;
}

/** 체력 줄 오른쪽: 패링 다시 쓰기까지 (원이 차오르고, 다 차면 금빛) */
export function drawParryCd(ctx: Ctx, p: PlayerState, x: number, y: number): void {
  const left = Math.min(1, p.dashCooldown / TITAN.parryCd);
  ctx.fillStyle = "rgba(10,8,16,0.85)";
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = left > 0 ? "#8a93a4" : "#ffcf70";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x, y, 2.5, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - left));
  ctx.fill();
}
