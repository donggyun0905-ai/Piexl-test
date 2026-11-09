// 협동 화면 위 그리기 (게임 좌표): 친구 이름표 · 출구 앞에 선 사람 점 · 빠른 신호 말풍선
import { allPlayers, EXIT_X, isAlive, TILE_SIZE, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "../game/render/palette";
import { drawRaidMe } from "../game/render/raidMarks";
import { playersAtExits, seatColor, SIGNAL_MS, SIGNALS, type CoopExtras } from "./extras";

export function drawCoopOverlay(
  ctx: CanvasRenderingContext2D,
  s: RunState,
  alpha: number,
  snap: Snap,
  names: readonly string[],
  extras: CoopExtras,
  t: (key: (typeof SIGNALS)[number]) => string,
): void {
  if (!s.party) return;
  const me = s.seat ?? 0;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";

  // 출구 위: 그 앞에 선 사람 색 점
  playersAtExits(s).forEach((seats, lane) => {
    seats.forEach((seat, j) => {
      const x = snap(EXIT_X[lane]! - (seats.length - 1) * 2 + j * 4);
      ctx.fillStyle = "#141018";
      ctx.fillRect(x - 2, 1, 4, 4);
      ctx.fillStyle = seatColor(seat);
      ctx.fillRect(x - 1.5, 1.5, 3, 3);
    });
  });

  const players = allPlayers(s);
  const signals = new Map(extras.live());
  const now = performance.now();
  players.forEach((p, i) => {
    const x = snap(lerp(p.prevX, p.x, alpha));
    const y = snap(lerp(p.prevY, p.y, alpha));
    let top = y - p.r - 3;
    // 레이드: 내 위치 (머리 위 화살표 · 발밑 고리)
    if (i === me && isAlive(p)) drawRaidMe(ctx, s, x, y, p.r, top - 8);
    // 이름표 (나는 빼고)
    if (i !== me && names[i]) {
      ctx.font = "5px sans-serif";
      ctx.globalAlpha = isAlive(p) ? 1 : 0.6;
      ctx.fillStyle = "rgba(10, 8, 16, 0.6)";
      const w = Math.min(60, ctx.measureText(names[i]!).width + 3);
      ctx.fillRect(x - w / 2, top - 6, w, 6);
      ctx.fillStyle = seatColor(i);
      ctx.fillText(names[i]!, x, top - 0.5, 58);
      ctx.globalAlpha = 1;
      top -= 7;
    }
    // 신호 말풍선 (끝날 때쯤 흐려짐)
    const sig = signals.get(i);
    if (!sig) return;
    const fade = Math.min(1, (SIGNAL_MS - (now - sig.at)) / 500);
    const text = t(SIGNALS[sig.k]!);
    ctx.globalAlpha = fade;
    ctx.font = "bold 7px sans-serif";
    const w = ctx.measureText(text).width + 6;
    ctx.fillStyle = "#f4efe0";
    ctx.fillRect(x - w / 2, top - 10, w, 9);
    ctx.fillRect(x - 1, top - 1, 2, 2);
    ctx.fillStyle = seatColor(i);
    ctx.fillRect(x - w / 2, top - 10, w, 1);
    ctx.fillStyle = "#1a1622";
    ctx.fillText(text, x, top - 1.5);
    // 여기!: 발밑에 퍼지는 고리
    if (sig.k === 0) {
      const f = ((now - sig.at) % 1000) / 1000;
      ctx.strokeStyle = seatColor(i);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, p.r + 2 + f * TILE_SIZE, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  });
  ctx.textAlign = "start";
  ctx.textBaseline = "alphabetic";
}
