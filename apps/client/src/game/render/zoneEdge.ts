// 위험한 곳에 들어가면 화면 테두리 안쪽으로 그 색이 번지며 깜박임 (화면 정보, 계산과 상관없음)
// 독가스 연두 · 용암 주황 · 솟은 가시 붉은빛 · 감전된 물 노란빛 · 패왕전 자기장 밖 보라 · 진흙·물(느려짐)은 옅게
import { pvpZone, spikeState, terrainIdle, zonePos, type RunState } from "@pixel-rogue/shared";

type Zone = "gas" | "lava" | "spike" | "shock" | "zone" | "mud" | "water";
const COLOR: Record<Zone, [number, number, number]> = {
  gas: [150, 255, 70],
  lava: [255, 120, 30],
  spike: [255, 60, 80],
  shock: [255, 230, 80],
  zone: [190, 90, 255],
  mud: [150, 110, 60],
  water: [80, 170, 255],
};
/** 가장 진할 때 세기 (느려지기만 하는 곳은 옅게) */
const STRONG: Record<Zone, number> = { gas: 0.55, lava: 0.6, spike: 0.55, shock: 0.55, zone: 0.6, mud: 0.25, water: 0.2 };

const inRect = (x: number, y: number, r: readonly number[]) => x >= r[0]! && x < r[0]! + r[2]! && y >= r[1]! && y < r[1]! + r[3]!;

/** 내가 지금 서 있는 위험한 곳 (먼저 걸리는 하나) */
function zoneOf(s: RunState): Zone | null {
  const p = s.player;
  if (p.hp <= 0) return null;
  const z = s.pvp ? pvpZone(s) : undefined;
  if (z) {
    const [px, py] = zonePos(s, p.x, p.y);
    if (Math.hypot(px - z.x, py - z.y) > z.r) return "zone";
  }
  const t = s.terrain;
  if (!t || (!s.pvp && (t.room !== s.roomId || terrainIdle(s)))) return null;
  const at = (list: readonly (readonly number[])[]) => list.some((r) => inRect(p.x, p.y, r));
  if (t.gas?.some((g) => (p.x - g.x) ** 2 + (p.y - g.y) ** 2 < g.r * g.r)) return "gas";
  if (at(t.lava)) return "lava";
  if (t.spikes.some((r, i) => spikeState(s.tick, i) === 2 && inRect(p.x, p.y, r))) return "spike";
  if ((t.shock ?? 0) > 0 && s.tick >= (t.shockAt ?? 0) && at(t.water)) return "shock";
  if (at(t.mud)) return "mud";
  if (at(t.water)) return "water";
  return null;
}

/** 서서히 켜지고 꺼지게 (마지막 색·세기) */
let last: Zone = "gas";
let level = 0;

export function drawZoneEdge(ctx: CanvasRenderingContext2D, s: RunState): void {
  const now = zoneOf(s);
  if (now) last = now;
  level = Math.max(0, Math.min(1, level + (now ? 0.12 : -0.06)));
  if (level <= 0) return;
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  const [r, g, b] = COLOR[last];
  // 깜박임: 위험한 곳은 맥박처럼 밝아졌다 어두워짐 (느려지기만 하는 곳은 잔잔하게)
  const pulse = STRONG[last] >= 0.5 ? 0.7 + 0.3 * Math.sin(s.tick * 0.2) : 1;
  const a = STRONG[last] * level * pulse;
  const w = Math.round(Math.min(W, H) * 0.14);
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  for (const [x, y, gw, gh, dx, dy] of [
    [0, 0, W, w, 0, 1],
    [0, H - w, W, w, 0, -1],
    [0, 0, w, H, 1, 0],
    [W - w, 0, w, H, -1, 0],
  ] as const) {
    const gr = ctx.createLinearGradient(dx < 0 ? x + gw : x, dy < 0 ? y + gh : y, dx > 0 ? x + gw : x, dy > 0 ? y + gh : y);
    gr.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a})`);
    gr.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    ctx.fillStyle = gr;
    ctx.fillRect(x, y, gw, gh);
  }
  ctx.restore();
}
