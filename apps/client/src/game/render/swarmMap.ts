// 광야의 새벽 맵 땅·이벤트 그리기: 진흙·용암(바닥 위) · 돕는 미사일 타워 · 구출할 아이와 화살표 · 포위 표시
import { SWARM_MAPS, TILE_SIZE, type RunState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
type Rect = readonly [number, number, number, number];

function patches(ctx: Ctx, list: readonly Rect[], base: string, dot: string, tick: number, glow: boolean): void {
  for (const [c, r, w, h] of list) {
    const x = c * TILE_SIZE;
    const y = r * TILE_SIZE;
    ctx.fillStyle = base;
    ctx.fillRect(x, y, w * TILE_SIZE, h * TILE_SIZE);
    // 거품·불씨: 칸마다 자리를 정해 깜박이기
    ctx.fillStyle = dot;
    for (let i = 0; i < w * h; i++) {
      const cx = c + (i % w);
      const cy = r + Math.floor(i / w);
      const k = (cx * 7 + cy * 13) % 11;
      if (((tick >> (glow ? 3 : 5)) + k) % 6 > 1) continue;
      ctx.fillRect(cx * TILE_SIZE + (k % 4) * 3 + 2, cy * TILE_SIZE + ((k * 5) % 4) * 3 + 2, 2, 2);
    }
  }
}

/** 바닥 위·적 아래 (render/index가 방 다음에 부름) */
export function drawSwarmGround(ctx: Ctx, s: RunState, snap: Snap): void {
  const sw = s.swarm;
  if (!sw) return;
  const def = SWARM_MAPS[sw.map ?? "plains"];
  patches(ctx, def.mud, "rgba(90, 64, 34, 0.75)", "rgba(150, 120, 70, 0.8)", s.tick, false);
  patches(ctx, def.lava, "rgba(200, 70, 20, 0.85)", "#ffd060", s.tick, true);
  for (const tw of sw.towers ?? []) {
    const x = snap(tw.x);
    const y = snap(tw.y);
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    ctx.fillRect(x - 7, y + 4, 14, 3);
    ctx.fillStyle = "#6a6070";
    ctx.fillRect(x - 6, y - 10, 12, 15);
    ctx.fillStyle = "#8a8094";
    ctx.fillRect(x - 6, y - 10, 12, 2);
    ctx.fillRect(x - 7, y - 13, 3, 3);
    ctx.fillRect(x + 4, y - 13, 3, 3);
    // 발사가 가까우면 꼭대기가 밝아짐
    ctx.fillStyle = tw.cd < 10 ? "#ffd060" : "#ff8a3a";
    ctx.fillRect(x - 2, y - 8, 4, 4);
  }
}

/** 맨 위: 구출할 아이(손 흔들기 + 말풍선) · 화면 밖이면 내 둘레에 화살표 · 포위 시작 자리 원 */
export function drawSwarmEvent(ctx: Ctx, s: RunState, snap: Snap): void {
  const ev = s.swarm?.event;
  if (!ev) return;
  const p = s.player;
  if (ev.kind === "ring") {
    ctx.strokeStyle = "rgba(255, 90, 90, 0.35)";
    ctx.beginPath();
    ctx.arc(snap(ev.x), snap(ev.y), 30 + ((s.tick >> 1) % 20), 0, Math.PI * 2);
    ctx.stroke();
    return;
  }
  if (ev.kind !== "rescue") return;
  const x = snap(ev.x);
  const y = snap(ev.y);
  const wave = (s.tick >> 4) % 2;
  // 빛 기둥 (멀리서도 보이게)
  ctx.fillStyle = "rgba(255, 240, 160, 0.18)";
  ctx.fillRect(x - 5, y - 60, 10, 60);
  // 아이: 머리·몸·흔드는 팔
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.fillRect(x - 4, y + 5, 8, 2);
  ctx.fillStyle = "#4a8ae0";
  ctx.fillRect(x - 3, y - 1, 6, 6);
  ctx.fillStyle = "#f0c8a0";
  ctx.fillRect(x - 3, y - 7, 6, 6);
  ctx.fillStyle = "#3a2a1a";
  ctx.fillRect(x - 3, y - 8, 6, 2);
  ctx.fillStyle = "#f0c8a0";
  ctx.fillRect(x + 3, y - (wave ? 6 : 3), 2, 4);
  ctx.fillRect(x - 5, y - (wave ? 3 : 6), 2, 4);
  // 말풍선 "!"
  ctx.fillStyle = "#fff";
  ctx.fillRect(x - 4, y - 20, 8, 9);
  ctx.fillStyle = "#e04a4a";
  ctx.fillRect(x - 1, y - 19, 2, 5);
  ctx.fillRect(x - 1, y - 13, 2, 1);
  // 화살표: 아이 쪽으로 내 둘레 24px
  const dx = ev.x - p.x;
  const dy = ev.y - p.y;
  const d = Math.hypot(dx, dy);
  if (d < 60) return;
  const ux = dx / d;
  const uy = dy / d;
  const ax = p.x + ux * 24;
  const ay = p.y + uy * 24;
  ctx.fillStyle = (s.tick >> 3) % 2 ? "#ffe060" : "#fff4c0";
  ctx.beginPath();
  ctx.moveTo(snap(ax + ux * 6), snap(ay + uy * 6));
  ctx.lineTo(snap(ax - uy * 4), snap(ay + ux * 4));
  ctx.lineTo(snap(ax + uy * 4), snap(ay - ux * 4));
  ctx.closePath();
  ctx.fill();
}
