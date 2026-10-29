// 패왕전 점령전 그리기: 낭떠러지(검은 구덩이 + 가장자리) · 점령 구역(앞선 편 색) · 점프대(화살표) · 버프 자리(노랑, 다시 생기기까지 초) · 버프 버티기 막대
import { capCenter, isCapture, PW_ARENAS, PW_CAP, TICK_RATE, TILE_SIZE, type RunState } from "@pixel-rogue/shared";

type Ctx = CanvasRenderingContext2D;
const T = TILE_SIZE;

export function drawCapGround(ctx: Ctx, s: RunState): void {
  if (!isCapture(s)) return;
  const pv = s.pvp!;
  const a = PW_ARENAS[pv.arena];
  const mine = pv.seats[s.seat ?? 0]!.team;
  for (const [c, r, w, h] of a.cliffs ?? []) {
    ctx.fillStyle = "#07060a";
    ctx.fillRect(c * T, r * T, w * T, h * T);
    ctx.strokeStyle = "#5a5260";
    ctx.strokeRect(c * T + 0.5, r * T + 0.5, w * T - 1, h * T - 1);
  }
  // 점령 구역: 앞선 편 색으로 옅게 칠하고 테두리
  const prog = pv.cap?.prog ?? {};
  const ours = prog[mine] ?? 0;
  const theirs = Math.max(0, ...Object.entries(prog).filter(([k]) => Number(k) !== mine).map(([, v]) => v));
  const tint = ours > theirs ? "90, 176, 255" : theirs > ours ? "255, 90, 90" : "200, 200, 220";
  ctx.save();
  ctx.beginPath();
  const z = a.zone;
  if (z?.rect) ctx.rect(z.rect[0] * T, z.rect[1] * T, z.rect[2] * T, z.rect[3] * T);
  else if (z?.circle) ctx.arc(...capCenter(a), z.circle[2] * T, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${tint}, ${0.12 + 0.04 * Math.sin(s.tick / 20)})`;
  ctx.fill();
  ctx.setLineDash([6, 4]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = `rgba(${tint}, 0.85)`;
  ctx.stroke();
  ctx.restore();
  // 점프대: 뛰어갈 쪽 화살표
  for (const j of a.jumps ?? []) {
    const [c, r, w, h] = j.pad;
    ctx.fillStyle = "#6a5aa0";
    ctx.fillRect(c * T, r * T, w * T, h * T);
    const up = j.to[1] < r ? -1 : 1;
    ctx.fillStyle = s.tick % 40 < 20 ? "#e8e0ff" : "#b8a8f0";
    for (let k = 0; k < w; k++) {
      const x = (c + k + 0.5) * T;
      const y = (r + 0.5) * T;
      ctx.beginPath();
      ctx.moveTo(x - 4, y - 2 * up);
      ctx.lineTo(x, y + 3 * up);
      ctx.lineTo(x + 4, y - 2 * up);
      ctx.fill();
    }
  }
  // 버프 자리: 있으면 노랑 빛, 먹힌 뒤엔 어둡게 + 남은 초
  (a.buffs ?? []).forEach(([c, r], k) => {
    const left = (pv.cap?.buffAt[k] ?? 0) - s.tick;
    const x = c * T;
    const y = r * T;
    ctx.fillStyle = left > 0 ? "#4a4430" : "#f2d040";
    ctx.fillRect(x + 2, y + 2, T - 4, T - 4);
    if (left > 0) {
      ctx.font = "bold 7px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "#d8d0b0";
      ctx.fillText(String(Math.ceil(left / TICK_RATE)), x + T / 2, y + T / 2 + 3);
      ctx.textAlign = "start";
    } else {
      ctx.strokeStyle = `rgba(255, 240, 140, ${0.5 + 0.4 * Math.sin(s.tick / 8)})`;
      ctx.strokeRect(x - 1.5, y - 1.5, T + 3, T + 3);
    }
  });
}

/** 버프 자리에서 버티는 중: 머리 위 노랑 막대 */
export function drawCapChan(ctx: Ctx, s: RunState, i: number, x: number, top: number): void {
  const ch = s.pvp?.seats[i]?.chan;
  if (!ch) return;
  const k = 1 - Math.max(0, ch.end - s.tick) / PW_CAP.buffHold;
  ctx.fillStyle = "#0a0810";
  ctx.fillRect(x - 11, top - 9, 22, 4);
  ctx.fillStyle = "#f2d040";
  ctx.fillRect(x - 10, top - 8, Math.round(20 * k), 2);
}
