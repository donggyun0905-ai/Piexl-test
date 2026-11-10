// 레이드 보스 루시퍼 2페이즈 그리기 (sim/lucSwords·lucPhase2): 가시 덩굴 장판 · 맵 전체 기절 경고 · 낙하 검 어둠 · 날개(바닥·등) · 꺼진 바닥(하늘)
// 효과: 절망의 검 패턴(레이드용 맵 잔패턴 그림) · 떨어지는 검 · 바닥이 꺼짐
import { allPlayers, RAID_ROOM, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, stunWarn, type EffectState, type RunState } from "@pixel-rogue/shared";
import { lucFx, lucMapFx, lucProp } from "./lucArt";
import { SWORD_COLORS } from "./lucifer";
import { additive, glow, shock } from "./pwFxBits";
import type { Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const W = () => ROOM_MAX_X - ROOM_MIN_X;
const H = () => ROOM_MAX_Y - ROOM_MIN_Y;

/** 바닥 (적·사람보다 아래) */
export function drawLucSky(ctx: Ctx, s: RunState, snap: Snap): void {
  const f = s.raidBoss?.fight;
  if (!f || f.phase !== 2 || s.roomId !== RAID_ROOM.boss) return;
  const t = s.tick;
  // 하늘: 바닥이 꺼져 끝없는 어둠 + 흐르는 별
  if (f.p2 === "sky") {
    ctx.fillStyle = "#06020c";
    ctx.fillRect(ROOM_MIN_X, ROOM_MIN_Y, W(), H());
    for (let i = 0; i < 70; i++) {
      const x = ROOM_MIN_X + ((i * 137) % W());
      const y = ROOM_MIN_Y + ((i * 61 + t * (0.6 + (i % 3) * 0.4)) % H());
      ctx.fillStyle = i % 4 ? "rgba(170, 120, 255, 0.5)" : "rgba(255, 255, 255, 0.8)";
      ctx.fillRect(x, y, 2, 2 + (i % 3) * 3);
    }
  }
  // 낙하 검: 보스가 사라지고 어두워짐
  if (f.p2 === "rain") {
    ctx.fillStyle = "rgba(4, 0, 10, 0.55)";
    ctx.fillRect(ROOM_MIN_X, ROOM_MIN_Y, W(), H());
  }
  // 가시 덩굴 장판
  for (const v of f.vines ?? []) {
    ctx.fillStyle = "rgba(30, 90, 30, 0.35)";
    ctx.beginPath();
    ctx.arc(snap(v[0]!), snap(v[1]!), v[2]!, 0, Math.PI * 2);
    ctx.fill();
    for (let k = 0; k < 3; k++) lucMapFx(ctx, 2, 6, 3, snap(v[0]! + (k - 1) * v[2]! * 0.5), snap(v[1]! + ((k % 2) - 0.5) * 20), v[2]! * 1.1, 0.85);
  }
  // 바닥의 날개 (몸으로 닿으면 장착)
  for (const w of f.wings ?? []) {
    additive(ctx, () => glow(ctx, snap(w[0]!), snap(w[1]!), 34, "#d0a0ff", 0.5 + 0.25 * Math.sin(t * 0.15), 0.7));
    lucFx(ctx, 1, 2, 3, snap(w[0]!), snap(w[1]! - 6 + Math.sin(t * 0.1) * 3), 64);
  }
  // 날개를 단 사람: 등 뒤 날개
  for (const p of allPlayers(s)) if (p.raidWing && p.hp > 0) lucFx(ctx, 1, 2, 2 + (Math.floor(t / 8) % 2), snap(p.x), snap(p.y - 8), 54, 0.9);
}

/** 위 (맵 전체 기절 경고) */
export function drawLucSkyOver(ctx: Ctx, s: RunState): void {
  const f = s.raidBoss?.fight;
  if (!f || f.phase !== 2 || !stunWarn(s, f)) return;
  ctx.fillStyle = `rgba(255, 230, 120, ${s.tick % 10 < 5 ? 0.22 : 0.08})`;
  ctx.fillRect(ROOM_MIN_X, ROOM_MIN_Y, W(), H());
}

/** 2페이즈 효과 · 그렸으면 true */
export function drawLucSkyFx(ctx: Ctx, fx: EffectState, x: number, y: number, t: number, a: number): boolean {
  const fr = Math.min(3, Math.floor(t * 4));
  switch (fx.from) {
    case "chainx":
      ctx.strokeStyle = `rgba(255, 50, 70, ${a})`;
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(fx.toX ?? x, fx.toY ?? y);
      ctx.stroke();
      lucMapFx(ctx, 0, 1, 3, ((fx.toX ?? x) + x) / 2, ((fx.toY ?? y) + y) / 2, 90, a);
      return true;
    case "ice":
      lucMapFx(ctx, 1, 0, fr, x, y - fx.size * 0.6, fx.size * 3, a);
      return true;
    case "gold":
      lucMapFx(ctx, 0, 2, 3, x, y - fx.size, fx.size * 3, a);
      return true;
    case "meteor":
      lucMapFx(ctx, 0, 5, fr, x, y - fx.size * 0.5, fx.size * 2.6, a);
      return true;
    case "hand":
      lucMapFx(ctx, 1, 1, 3, x, y, fx.size * 2.6, a);
      return true;
    case "swordfall":
      lucProp(ctx, "sword.png", x, y + 10 - (1 - t) * 160, 110, a);
      shock(ctx, x, y, fx.size * (0.5 + t * 0.6), "#c080ff", a, 8);
      return true;
    case "swordCast":
      additive(ctx, () => glow(ctx, x, y - 50, 90 * (0.5 + t), SWORD_COLORS[fx.dirX] ?? "#fff", a, 0.7));
      return true;
    case "stunAll":
      ctx.fillStyle = `rgba(255, 240, 160, ${0.35 * a})`;
      ctx.fillRect(ROOM_MIN_X, ROOM_MIN_Y, W(), H());
      return true;
    case "wingOn":
    case "fall":
      lucFx(ctx, 1, 2, 3, x, y - 10, 80 * (fx.from === "fall" ? 1 - t * 0.8 : 1 + t), a);
      return true;
    case "chestOpen":
      additive(ctx, () => glow(ctx, x, y, fx.size * (1 + t), "#ffd060", a * 0.6, 0.3));
      return true;
    case "collapse":
      ctx.fillStyle = `rgba(0, 0, 0, ${0.7 * a})`;
      ctx.fillRect(ROOM_MIN_X, ROOM_MIN_Y, W(), H());
      shock(ctx, x, y, fx.size * t, "#a050ff", a, 20);
      return true;
  }
  return false;
}
