// 루시퍼 즉사 패턴 그리기 (sim/lucDeadly): 바닥(빛 그림자 안전 칸 · 사슬 · 품 안전 원) · 위(거대한 눈 · 쏟아지는 빛 · 붉은 화면) · 효과(시작·끝·쓰러짐)
import { allPlayers, deadlySafe, LUC_DEADLY_RULES as D, COVER_RADIUS, lucCovers, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, type EffectState, type RunState } from "@pixel-rogue/shared";
import { additive, glow, shock } from "./pwFxBits";
import type { Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;

const bossOf = (s: RunState) => s.enemies.find((e) => e.kind === "lucifer" && e.hp > 0);
/** 남은 비율 1 → 0 */
const leftOf = (s: RunState) => {
  const d = s.raidBoss?.fight?.dk;
  return d ? Math.max(0, (d.at - s.tick) / Math.max(1, d.at - d.start)) : 0;
};

/** 바닥 (사람보다 아래): 안전한 곳을 밝게 */
export function drawDeadlyGround(ctx: Ctx, s: RunState, snap: Snap): void {
  const d = s.raidBoss?.fight?.dk;
  const boss = bossOf(s);
  if (!d || !boss) return;
  const t = s.tick;
  const pulse = 0.5 + 0.5 * Math.sin(t * 0.3);
  if (d.kind === 1) {
    // 돌기둥 그림자: 빛 반대쪽으로 길게 뻗은 안전 칸
    const [lx, ly] = [d.data[0]!, d.data[1]!];
    const w = COVER_RADIUS() + 4;
    for (const c of lucCovers(s)) {
      if (c[2]! <= 0) continue;
      ctx.save();
      ctx.translate(snap(c[0]!), snap(c[1]!));
      ctx.rotate(Math.atan2(ly, lx));
      ctx.fillStyle = "rgba(10, 6, 30, 0.75)";
      ctx.fillRect(0, -w, D.SHADOW, w * 2);
      ctx.strokeStyle = `rgba(120, 255, 160, ${0.5 + 0.4 * pulse})`;
      ctx.lineWidth = 2;
      ctx.strokeRect(0, -w, D.SHADOW, w * 2);
      ctx.restore();
    }
  } else if (d.kind === 2) {
    // 영혼의 사슬: 짝끼리 선 (가까우면 초록 · 멀면 붉게 깜빡)
    const ps = allPlayers(s);
    for (let k = 0; k + 1 < d.data.length; k += 2) {
      const a = ps[d.data[k]!];
      const b = ps[d.data[k + 1]!];
      if (!a || !b || a.hp <= 0 || b.hp <= 0) continue;
      const ok = (a.x - b.x) ** 2 + (a.y - b.y) ** 2 <= D.LINK_R ** 2;
      ctx.strokeStyle = ok ? "rgba(120, 255, 160, 0.9)" : t % 8 < 4 ? "rgba(255, 60, 90, 0.95)" : "rgba(255, 200, 220, 0.8)";
      ctx.lineWidth = 4;
      ctx.setLineDash([8, 5]);
      ctx.lineDashOffset = -t;
      ctx.beginPath();
      ctx.moveTo(snap(a.x), snap(a.y));
      ctx.lineTo(snap(b.x), snap(b.y));
      ctx.stroke();
      ctx.setLineDash([]);
      for (const q of [a, b]) {
        ctx.strokeStyle = "rgba(200, 160, 255, 0.6)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(snap(q.x), snap(q.y), D.LINK_R, 0, TAU);
        ctx.stroke();
      }
    }
  } else if (d.kind === 3) {
    // 왕좌의 품: 루시퍼 둘레만 안전 (초록 원)
    ctx.fillStyle = `rgba(80, 255, 140, ${0.12 + 0.1 * pulse})`;
    ctx.beginPath();
    ctx.arc(snap(boss.x), snap(boss.y), D.HUG_R, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "rgba(120, 255, 160, 0.95)";
    ctx.lineWidth = 4;
    ctx.stroke();
  }
}

/** 위 (사람·적 위): 패턴마다 화면 연출 */
export function drawDeadlyOver(ctx: Ctx, s: RunState, snap: Snap): void {
  const d = s.raidBoss?.fight?.dk;
  const boss = bossOf(s);
  if (!d || !boss) return;
  const t = s.tick;
  const left = leftOf(s);
  const W = ROOM_MAX_X - ROOM_MIN_X;
  const H = ROOM_MAX_Y - ROOM_MIN_Y;
  if (d.kind === 0) {
    // 석화의 시선: 루시퍼 머리 위 거대한 눈 (점점 뜸) · 화면이 회색으로 굳어 감 · 바라보는 사람은 붉은 선
    ctx.fillStyle = `rgba(120, 120, 140, ${0.25 * (1 - left)})`;
    ctx.fillRect(ROOM_MIN_X, ROOM_MIN_Y, W, H);
    const ex = snap(boss.x);
    const ey = snap(boss.y - 230);
    const open = 1 - left;
    additive(ctx, () => glow(ctx, ex, ey, 120, "#ff3050", 0.4 + 0.3 * open, 0.5));
    ctx.fillStyle = "#f4e8ff";
    ctx.beginPath();
    ctx.ellipse(ex, ey, 90, 6 + 40 * open, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#c01030";
    ctx.beginPath();
    ctx.arc(ex, ey, 6 + 26 * open, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#100008";
    ctx.beginPath();
    ctx.ellipse(ex, ey, 4 + 4 * open, 4 + 22 * open, 0, 0, TAU);
    ctx.fill();
    allPlayers(s).forEach((p, i) => {
      if (p.hp <= 0 || deadlySafe(s, d, i, boss)) return;
      ctx.strokeStyle = t % 6 < 3 ? "rgba(255, 40, 80, 0.8)" : "rgba(255, 200, 200, 0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(snap(p.x), snap(p.y));
      ctx.lineTo(ex, ey);
      ctx.stroke();
    });
  } else if (d.kind === 1) {
    // 심판의 빛: 빛이 오는 쪽 가장자리에서 점점 밝아지는 띠 + 날아가는 빛살
    const [lx, ly] = [d.data[0]!, d.data[1]!];
    const k = 1 - left;
    additive(ctx, () => {
      for (let n = 0; n < 14; n++) {
        const f = ((t * 4 + n * 53) % 400) / 400;
        const across = ((n * 97) % 100) / 100;
        const x = lx ? (lx > 0 ? ROOM_MIN_X + W * f : ROOM_MAX_X - W * f) : ROOM_MIN_X + W * across;
        const y = ly ? (ly > 0 ? ROOM_MIN_Y + H * f : ROOM_MAX_Y - H * f) : ROOM_MIN_Y + H * across;
        glow(ctx, x, y, 14, "#fff4c0", 0.3 * k, 0.6);
      }
      const ox = lx > 0 ? ROOM_MIN_X : lx < 0 ? ROOM_MAX_X : (ROOM_MIN_X + ROOM_MAX_X) / 2;
      const oy = ly > 0 ? ROOM_MIN_Y : ly < 0 ? ROOM_MAX_Y : (ROOM_MIN_Y + ROOM_MAX_Y) / 2;
      glow(ctx, ox, oy, Math.max(W, H) * 0.5, "#fff0b0", 0.25 + 0.4 * k, 0.4);
    });
  } else if (d.kind === 3) {
    // 왕좌의 품: 품 밖은 붉게 (끝이 다가올수록 진하게)
    ctx.save();
    ctx.fillStyle = `rgba(200, 0, 30, ${0.15 + 0.3 * (1 - left) * (0.6 + 0.4 * Math.sin(t * 0.4))})`;
    ctx.beginPath();
    ctx.rect(ROOM_MIN_X, ROOM_MIN_Y, W, H);
    ctx.arc(snap(boss.x), snap(boss.y), D.HUG_R, 0, TAU, true);
    ctx.fill("evenodd");
    ctx.restore();
  }
}

/** 효과: 시작 · 끝(터짐) · 쓰러짐 · 그렸으면 true */
export function drawDeadlyFx(ctx: Ctx, fx: EffectState, x: number, y: number, t: number, a: number): boolean {
  const from = fx.from ?? "";
  if (!from.startsWith("dk")) return false;
  if (from === "dkDie") {
    additive(ctx, () => glow(ctx, x, y, 30, "#ff2040", a, 0.8));
    shock(ctx, x, y, 10 + 30 * t, "#ffffff", a, 4);
  } else if (from.endsWith("End")) {
    // 맵 전체 섬광 (패턴 색)
    const col = from === "dkGazeEnd" ? "#d0d0e0" : from === "dkLightEnd" ? "#fff4c0" : from === "dkLinkEnd" ? "#c080ff" : "#ff3040";
    additive(ctx, () => glow(ctx, x, y, fx.size * (0.4 + t), col, a * 0.7, 0.3));
  } else {
    shock(ctx, x, y - 60, 40 + 160 * t, "#ff4070", a, 8);
  }
  return true;
}
