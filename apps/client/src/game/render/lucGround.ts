// 레이드 보스 루시퍼 바닥·위 그리기 (sim/lucifer·lucAttacks·lucPillars·lucDark): 사슬 · 지진파 · 별 고리 · 가시 고리 · 어둠의 기둥 · 흰색 돔
// · 검기 경고(맵을 덮는 붉은 빛 + 빛나는 빈칸) · X자(점점 그려짐) · 보라 구(끌어당김) · 어둠의 세계(내 화면이 어두워짐) · 효과(lucFx)
import { allPlayers, LUC_ATTACK_RULES as A, LUC_DARK_RULES as D, LUC_DOME_R, LUC_PILLAR_RULES as P, RAID_ROOM, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, type EffectState, type RunState } from "@pixel-rogue/shared";
import { lucFx } from "./lucArt";
import { drawLucSky, drawLucSkyFx, drawLucSkyOver } from "./lucSky";
import { drawRaidReward } from "./raidReward";
import { drawCoverTop } from "./lucArena";
import { drawDeadlyFx, drawDeadlyGround, drawDeadlyOver } from "./lucDeadly";
import { additive, glow, shock } from "./pwFxBits";
import type { Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;

/** 바닥 (적보다 아래) */
export function drawLucGround(ctx: Ctx, s: RunState, snap: Snap): void {
  drawRaidReward(ctx, s, snap);
  drawLucSky(ctx, s, snap);
  const f = s.raidBoss?.fight;
  const boss = s.enemies.find((e) => e.kind === "lucifer" && e.hp > 0);
  if (!f || !boss) return;
  drawDeadlyGround(ctx, s, snap);
  const t = s.tick;
  // 루시퍼와 기둥을 잇는 사슬
  for (const e of s.enemies) {
    if (e.kind !== "lucpillar" || e.hp <= 0) continue;
    chain(ctx, snap(boss.x), snap(boss.y - 30), snap(e.x), snap(e.y - 110), t);
  }
  // 석화의 빔 지진파 (돌빛 고리)
  for (const w of f.waves) {
    if (w[3]! > 0) continue;
    ctx.strokeStyle = `rgba(210, 190, 255, ${Math.max(0.2, 1 - w[2]! / P.WAVE_MAX)})`;
    ctx.lineWidth = P.WAVE_W * 2;
    ctx.beginPath();
    ctx.arc(snap(w[0]!), snap(w[1]!), w[2]!, 0, TAU);
    ctx.stroke();
  }
  // 별 고리 (닿으면 터짐)
  for (const m of f.mines) lucFx(ctx, 0, 2, 1 + (Math.floor(t / 8 + m[0]!) % 3), snap(m[0]!), snap(m[1]!), A.MINE_TOUCH * 2.8, m[2]! - t < 30 ? (t % 6 < 3 ? 1 : 0.4) : 1);
  // 어둠의 기둥: 따라다니는 원 · 내리치기 1초 전 멈추고 붉게
  if (f.dark) {
    allPlayers(s).forEach((p, i) => {
      const d = f.dark![i];
      if (!d || p.hp <= 0 || p.raidDark) return;
      const lock = d[2]! - t < 60;
      ctx.strokeStyle = lock ? (t % 8 < 4 ? "#ff3a6a" : "#ffffff") : "rgba(150, 60, 255, 0.7)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(snap(d[0]!), snap(d[1]!), D.DARK_R, 0, TAU);
      ctx.stroke();
      lucFx(ctx, 1, 6, lock ? 2 : 0, snap(d[0]!), snap(d[1]!) - D.DARK_R, D.DARK_R * 2.2, lock ? 0.9 : 0.55);
    });
  }
  // 흰색 돔
  if (f.dome) {
    const [x, y] = f.dome;
    additive(ctx, () => glow(ctx, snap(x!), snap(y!), LUC_DOME_R * 1.4, "#ffffff", 0.5 + 0.2 * Math.sin(t * 0.2), 0.9));
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(snap(x!), snap(y!), LUC_DOME_R, 0, TAU);
    ctx.stroke();
  }
}

/** 위 (적·사람 위) */
export function drawLucOver(ctx: Ctx, s: RunState, snap: Snap): void {
  const f = s.raidBoss?.fight;
  if (!f || s.roomId !== RAID_ROOM.boss) return;
  drawCoverTop(ctx, s, snap);
  drawDeadlyOver(ctx, s, snap);
  drawLucSkyOver(ctx, s);
  const t = s.tick;
  const players = allPlayers(s);
  // 가시 고리: 머리 위 · 멈추면 두 번 깜빡임
  for (const c of f.crowns) {
    const lock = !!c[4];
    const blink = lock && Math.floor((c[1]! - t) / 11) % 2 === 0;
    if (lock) {
      ctx.strokeStyle = "rgba(255, 60, 120, 0.7)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(snap(c[2]!), snap(c[3]! + 20), A.CROWN_R, 0, TAU);
      ctx.stroke();
    }
    lucFx(ctx, 1, 3, 3, snap(c[2]!), snap(c[3]! - 8), A.CROWN_R * 1.8, blink ? 1 : lock ? 0.35 : 0.85);
  }
  // X자 (위험 표시 없이 점점 그려짐)
  for (const x of f.xs) {
    const k = Math.max(0, Math.min(1, 1 - (x[2]! - t) / A.X_DRAW));
    const L = A.X_LEN * k;
    ctx.strokeStyle = `rgba(220, 120, 255, ${0.5 + 0.5 * k})`;
    ctx.lineWidth = 3 + 4 * k;
    ctx.beginPath();
    ctx.moveTo(snap(x[0]! - L), snap(x[1]! - L));
    ctx.lineTo(snap(x[0]! + L), snap(x[1]! + L));
    ctx.moveTo(snap(x[0]! + L), snap(x[1]! - L));
    ctx.lineTo(snap(x[0]! - L), snap(x[1]! + L));
    ctx.stroke();
  }
  // 보라 구: 끌어당기는 줄무늬
  for (const o of f.orbs) {
    lucFx(ctx, 0, 5, 1 + (Math.floor(t / 10) % 2), snap(o[0]!), snap(o[1]!), A.ORB_R * 1.4);
    for (const p of players) {
      if (p.hp <= 0 || p.raidDark) continue;
      ctx.strokeStyle = "rgba(190, 90, 255, 0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(snap(p.x), snap(p.y));
      ctx.lineTo(snap(o[0]!), snap(o[1]!));
      ctx.stroke();
    }
  }
  // 검기 경고: 맵 전체 붉은 빛 + 빛나는 빈칸 (쳐 오는 쪽 화살표)
  if (f.safe && f.slashAt !== undefined) {
    const left = f.slashAt - t;
    ctx.fillStyle = `rgba(160, 0, 60, ${0.18 + 0.12 * Math.sin(t * 0.3)})`;
    ctx.fillRect(ROOM_MIN_X, ROOM_MIN_Y, ROOM_MAX_X - ROOM_MIN_X, ROOM_MAX_Y - ROOM_MIN_Y);
    for (let i = 0; i < f.safe.length; i += 2) {
      const x = snap(f.safe[i]!);
      const y = snap(f.safe[i + 1]!);
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.fillRect(x - P.SAFE_HALF, y - P.SAFE_HALF, P.SAFE_HALF * 2, P.SAFE_HALF * 2);
      ctx.strokeStyle = left < 30 && t % 6 < 3 ? "#ffef80" : "#ffffff";
      ctx.lineWidth = 2;
      ctx.strokeRect(x - P.SAFE_HALF, y - P.SAFE_HALF, P.SAFE_HALF * 2, P.SAFE_HALF * 2);
    }
  }
  // 어둠의 세계: 내 화면이 어두워짐 (내 둘레만 보임)
  if (s.player.raidDark && s.player.hp > 0) {
    const g = ctx.createRadialGradient(s.player.x, s.player.y, 30, s.player.x, s.player.y, 150);
    g.addColorStop(0, "rgba(10, 0, 20, 0.2)");
    g.addColorStop(1, "rgba(10, 0, 20, 0.92)");
    ctx.fillStyle = g;
    ctx.fillRect(ROOM_MIN_X - 40, ROOM_MIN_Y - 40, ROOM_MAX_X - ROOM_MIN_X + 80, ROOM_MAX_Y - ROOM_MIN_Y + 80);
  }
}

/** 사슬: 고리 줄 */
function chain(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, t: number): void {
  const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / 10));
  for (let i = 0; i <= n; i++) {
    const k = i / n;
    const sag = Math.sin(k * Math.PI) * 10;
    const x = x0 + (x1 - x0) * k;
    const y = y0 + (y1 - y0) * k + sag;
    ctx.strokeStyle = i % 2 ? "#6a5a80" : "#a890c8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x, y, 4, 2.5, (i % 2) * 1.2 + t * 0, 0, TAU);
    ctx.stroke();
  }
}

/** 효과 lucFx (from으로 모양을 고름) · 그렸으면 true */
export function drawLucFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (fx.kind !== "lucFx") return false;
  const t = 1 - fx.ticks / fx.maxTicks;
  const fr = Math.min(3, Math.floor(t * 4));
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a = t < 0.75 ? 1 : (1 - t) * 4;
  switch (fx.from) {
    case "fire":
      lucFx(ctx, 0, 1, fr, x, y - fx.size * 0.9, fx.size * 2.6, a);
      break;
    case "mine":
    case "orb":
      lucFx(ctx, 0, 5, 3, x, y, fx.size * 2.4, a);
      shock(ctx, x, y, fx.size * (0.6 + t * 0.6), "#c060ff", a, 6);
      break;
    case "crown":
      lucFx(ctx, 1, 3, 3, x, y, fx.size * 2.4, a);
      shock(ctx, x, y, fx.size, "#ff60a0", a, 5);
      break;
    case "x":
      lucFx(ctx, 0, 4, 3, x, y, fx.size * 2.2, a);
      break;
    case "beam":
      lucFx(ctx, 1, 6, fr, x, y - 40, 110, a);
      break;
    case "slash": {
      // 왼쪽·오른쪽·위에서 맵을 가로지르는 거대한 검기
      const side = fx.dirX;
      const w = fx.size;
      const px = side === 0 ? ROOM_MIN_X + w * t : side === 1 ? ROOM_MAX_X - w * t : x;
      const py = side === 2 ? ROOM_MIN_Y + (ROOM_MAX_Y - ROOM_MIN_Y) * t : y;
      lucFx(ctx, 1, 0, 3, px, py, w * 0.7, a, side === 0 ? 0 : side === 1 ? Math.PI : Math.PI / 2);
      break;
    }
    case "dark":
      lucFx(ctx, 1, 6, 3, x, y - fx.size, fx.size * 3, a);
      break;
    case "toDark":
    case "fromDark":
      lucFx(ctx, 0, 6, fr, x, y, 90, a);
      break;
    case "flameIn":
      lucFx(ctx, 1, 4, fr, x, y - 14, 70, a);
      break;
    case "rain":
      lucFx(ctx, 1, 1, 3, x, y - 20, 50, a);
      break;
    case "spin":
      // 회전 베기: 몸 둘레를 도는 검기 넷
      for (let k = 0; k < 4; k++) {
        const ang = t * Math.PI * 2 + (k * Math.PI) / 2;
        lucFx(ctx, 1, 0, 3, x + Math.cos(ang) * fx.size * 0.6, y + Math.sin(ang) * fx.size * 0.6, fx.size * 0.9, a, ang + Math.PI / 2);
      }
      shock(ctx, x, y, fx.size * (0.7 + 0.3 * t), "#d080ff", a, 10);
      break;
    case "sweep": {
      // 앞뒤 휘두르기: 그쪽으로 크게 휘두른 검기
      const ang = Math.atan2(fx.dirY, fx.dirX);
      lucFx(ctx, 1, 0, 3, x + fx.dirX * fx.size * 0.55, y + fx.dirY * fx.size * 0.55, fx.size * 1.2, a, ang);
      break;
    }
    case "quake":
      shock(ctx, x, y, fx.size * (0.5 + t * 2), "#d0b0ff", a * 0.7, 8);
      break;
    // 돌기둥 (sim/lucCover): 막음 · 부서짐(돌 조각이 튐) · 다시 생김
    case "coverHit":
      shock(ctx, x, y - 22, fx.size * (0.4 + t * 0.7), "#e8e0ff", a, 4);
      break;
    case "coverBreak":
      shock(ctx, x, y - 20, fx.size * (0.6 + t * 1.6), "#b0a8d0", a, 7);
      ctx.fillStyle = `rgba(110, 104, 134, ${a})`;
      for (let k = 0; k < 8; k++) ctx.fillRect(x + Math.cos(k * 0.8) * fx.size * t * 1.6 - 3, y - 24 + Math.sin(k * 0.8) * fx.size * t * 1.2 + t * t * 30 - 3, 6, 6);
      break;
    case "coverUp":
      shock(ctx, x, y - 20, fx.size * (1.4 - t), "#c080ff", a, 5);
      break;
    default:
      if (!drawDeadlyFx(ctx, fx, x, y, t, a) && !drawLucSkyFx(ctx, fx, x, y, t, a)) additive(ctx, () => glow(ctx, x, y, fx.size, "#c070ff", a, 0.6));
  }
  return true;
}
