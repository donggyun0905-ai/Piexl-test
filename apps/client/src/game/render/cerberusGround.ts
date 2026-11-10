// 켈베로스 바닥·하늘 (sim/bossCerberus·cerbKit): 용암 지대(부풀어 오름·지옥불 기둥) · 무너지는 바닥(금·구멍·남은 구역) · 브레스 예고 기둥 그림자 · 지옥불 브레스(빨강·초록 불길, 그림자는 비움) · 염희 빨아들이기
import { BOSS_CERB_KIT_RULES as K, BOSS_CERB_TRIO_RULES as T, breathing, cellRect, CERB_HEADS, erupting, fallTick, FLOOR_COLS, FLOOR_ROWS, pulling, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, swelling, TILE_SIZE, type EnemyState, type RunState } from "@pixel-rogue/shared";
import { additive, glow } from "./pwFxBits";
import type { Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
const cerb = (s: RunState) => s.enemies.find((e) => e.kind === "cerberus" && e.hp > 0);
/** 가운데 머리 자리 (브레스가 나오는 곳) */
const headOf = (e: EnemyState): [number, number] => [e.x + CERB_HEADS[1]![0], e.y + CERB_HEADS[1]![1]];

/** 바닥: 용암 지대 · 무너지는 바닥 · 브레스 예고 그림자 · 염희 둘레 불 */
export function drawCerbGround(ctx: Ctx, s: RunState, snap: Snap): void {
  const e = cerb(s);
  if (!e) return;
  const lava = e.cbLava ?? [];
  const hot = erupting(s, e);
  const swell = swelling(s, e);
  for (let i = 0; i < lava.length; i += 4) {
    const x = lava[i]! * TILE_SIZE;
    const y = lava[i + 1]! * TILE_SIZE;
    const w = lava[i + 2]! * TILE_SIZE;
    const h = lava[i + 3]! * TILE_SIZE;
    const pulse = 0.5 + 0.5 * Math.sin(s.tick * (swell ? 0.5 : 0.07) + i);
    ctx.fillStyle = "#3a0804";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = `rgba(255, ${90 + 60 * pulse}, 20, ${hot ? 0.95 : swell ? 0.6 + 0.4 * pulse : 0.55 + 0.15 * pulse})`;
    ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
    additive(ctx, () => glow(ctx, x + w / 2, y + h / 2, Math.max(w, h) * (hot ? 1.3 : 0.8), "#ff5a10", hot ? 0.8 : 0.35));
    // 지옥불 기둥 (빨강·초록 불이 솟음)
    if (hot)
      additive(ctx, () => {
        for (let k = 0; k < 3; k++) {
          const fx = x + ((k + 0.5) * w) / 3;
          const top = y - 18 - 8 * Math.sin(s.tick * 0.3 + k + i);
          const g = ctx.createLinearGradient(fx, y + h, fx, top);
          g.addColorStop(0, "rgba(255, 80, 20, 0.9)");
          g.addColorStop(0.6, k === 1 ? "rgba(120, 255, 80, 0.7)" : "rgba(255, 40, 30, 0.7)");
          g.addColorStop(1, "rgba(255, 200, 80, 0)");
          ctx.fillStyle = g;
          ctx.fillRect(fx - w / 6, top, w / 3, y + h - top);
        }
      });
  }
  drawFloor(ctx, s, e);
  if (e.cbBreathWarn !== undefined && s.tick >= e.cbBreathWarn && s.tick < (e.cbBreath ?? 0)) drawShadows(ctx, s, e, 0.45);
  const flame = s.enemies.find((o) => o.kind === "cerbflame" && o.hp > 0);
  if (flame && flame.cbPullEnd !== undefined && s.tick < flame.cbPullEnd) {
    const x = snap(flame.x);
    const y = snap(flame.y);
    const r = flame.r + T.PULL_FIRE_R;
    additive(ctx, () => glow(ctx, x, y, r * 2, "#ff4a10", 0.8, 0.5));
    ctx.strokeStyle = "rgba(255, 210, 120, 0.9)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.stroke();
    if (pulling(s, flame)) {
      // 빨려 드는 불씨 줄기
      ctx.strokeStyle = "rgba(255, 120, 40, 0.5)";
      ctx.lineWidth = 1;
      for (let k = 0; k < 12; k++) {
        const a = (k / 12) * TAU + s.tick * 0.02;
        const d = 160 - ((s.tick * 3 + k * 37) % 150);
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * d, y + Math.sin(a) * d);
        ctx.lineTo(x + Math.cos(a + 0.2) * (d - 18), y + Math.sin(a + 0.2) * (d - 18));
        ctx.stroke();
      }
    }
  }
}

/** 무너지는 바닥: 금이 가는 구역(깜박이는 붉은 금) · 무너진 구역(검은 구멍, 아래 용암 빛) · 남은 구역 테두리 */
function drawFloor(ctx: Ctx, s: RunState, e: EnemyState): void {
  const f = e.cbFloor;
  if (!f || s.tick < f.at) return;
  const back = s.tick > f.end - 60 ? (f.end - s.tick) / 60 : 1;
  for (let i = 0; i < FLOOR_COLS * FLOOR_ROWS; i++) {
    const [l, t, r, b] = cellRect(i);
    const at = fallTick(e, i);
    if (at === Infinity) continue;
    if (s.tick >= at) {
      ctx.fillStyle = `rgba(6, 0, 0, ${0.92 * back})`;
      ctx.fillRect(l, t, r - l, b - t);
      ctx.fillStyle = `rgba(255, 60, 10, ${0.18 * back})`;
      ctx.fillRect(l + 6, t + 6, r - l - 12, b - t - 12);
    } else if (s.tick >= at - K.CRACK) {
      const k = 1 - (at - s.tick) / K.CRACK;
      ctx.fillStyle = `rgba(255, 40, 20, ${0.1 + 0.25 * k})`;
      ctx.fillRect(l, t, r - l, b - t);
      if (Math.floor(s.tick / 5) % 2 === 0) {
        ctx.strokeStyle = "rgba(255, 90, 40, 0.85)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(l + 4, t + (b - t) * 0.3);
        ctx.lineTo((l + r) / 2, (t + b) / 2);
        ctx.lineTo(r - 6, b - 4);
        ctx.moveTo((l + r) / 2, (t + b) / 2);
        ctx.lineTo((l + r) / 2 + 8, t + 3);
        ctx.stroke();
      }
    }
  }
  if (s.tick >= f.end - K.FLOOR_HOLD) {
    const [l, t, r, b] = cellRect(f.safe);
    ctx.strokeStyle = "rgba(255, 220, 140, 0.8)";
    ctx.lineWidth = 2;
    ctx.strokeRect(l + 1, t + 1, r - l - 2, b - t - 2);
  }
}

/** 기둥 그림자 (브레스 머리에서 기둥 너머로 뻗은 어두운 부채꼴) */
function shadowPath(s: RunState, e: EnemyState): Path2D {
  const [hx, hy] = headOf(e);
  const path = new Path2D();
  const a = s.arena ?? [];
  for (let k = 0; k < a.length; k += 2) {
    const x = a[k]! * TILE_SIZE;
    const y = a[k + 1]! * TILE_SIZE;
    const pts = [[x, y], [x + 32, y], [x + 32, y + 32], [x, y + 32]] as const;
    const ang = pts.map(([px, py]) => Math.atan2(py - hy, px - hx));
    const mid = Math.atan2(y + 16 - hy, x + 16 - hx);
    const rel = ang.map((v) => Math.atan2(Math.sin(v - mid), Math.cos(v - mid)));
    const lo = rel.indexOf(Math.min(...rel));
    const hi = rel.indexOf(Math.max(...rel));
    const far = 900;
    const [ax, ay] = pts[lo]!;
    const [bx, by] = pts[hi]!;
    path.moveTo(ax, ay);
    path.lineTo(ax + Math.cos(ang[lo]!) * far, ay + Math.sin(ang[lo]!) * far);
    path.lineTo(bx + Math.cos(ang[hi]!) * far, by + Math.sin(ang[hi]!) * far);
    path.lineTo(bx, by);
    path.lineTo(x + 16, y + 16);
    path.closePath();
  }
  return path;
}

function drawShadows(ctx: Ctx, s: RunState, e: EnemyState, a: number): void {
  ctx.save();
  ctx.beginPath();
  ctx.rect(ROOM_MIN_X, ROOM_MIN_Y, ROOM_MAX_X - ROOM_MIN_X, ROOM_MAX_Y - ROOM_MIN_Y);
  ctx.clip();
  ctx.fillStyle = `rgba(10, 6, 30, ${a})`;
  ctx.fill(shadowPath(s, e));
  ctx.restore();
}

/** 하늘: 지옥불 브레스 (방 전체가 빨강·초록 불길, 기둥 그림자만 비움) */
export function drawCerbOver(ctx: Ctx, s: RunState): void {
  const e = cerb(s);
  if (!e || !breathing(s, e)) return;
  const [hx, hy] = headOf(e);
  const t = (s.tick - e.cbBreath!) / K.BREATH_TICKS;
  const fade = Math.min(1, t * 6, (1 - t) * 4);
  const room = new Path2D();
  room.rect(ROOM_MIN_X, ROOM_MIN_Y, ROOM_MAX_X - ROOM_MIN_X, ROOM_MAX_Y - ROOM_MIN_Y);
  room.addPath(shadowPath(s, e));
  ctx.save();
  ctx.clip(room, "evenodd");
  const g = ctx.createRadialGradient(hx, hy, 4, hx, hy, 520);
  g.addColorStop(0, `rgba(255, 250, 200, ${0.9 * fade})`);
  g.addColorStop(0.15, `rgba(140, 255, 70, ${0.7 * fade})`);
  g.addColorStop(0.45, `rgba(255, 50, 20, ${0.6 * fade})`);
  g.addColorStop(1, `rgba(120, 10, 0, ${0.45 * fade})`);
  ctx.fillStyle = g;
  ctx.fillRect(ROOM_MIN_X, ROOM_MIN_Y, ROOM_MAX_X - ROOM_MIN_X, ROOM_MAX_Y - ROOM_MIN_Y);
  // 일렁이는 불 혀
  additive(ctx, () => {
    for (let k = 0; k < 14; k++) {
      const a = Math.PI * (0.1 + (0.8 * k) / 13) + Math.sin(s.tick * 0.2 + k) * 0.05;
      glow(ctx, hx + Math.cos(a) * (60 + ((s.tick * 4 + k * 40) % 300)), hy + Math.sin(a) * (60 + ((s.tick * 4 + k * 40) % 300)), 30, k % 3 === 0 ? "#8aff4a" : "#ff5a1a", 0.6 * fade);
    }
  });
  ctx.restore();
}
