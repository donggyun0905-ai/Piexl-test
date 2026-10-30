// 핑 표시 (같은 편 것만): 찍힌 곳에 퍼지는 고리 셋 + 가운데 표시 (모여 ➜ 파랑 · 공격 ⚔ 파랑 · 위험 ! 주황 · 큰 보스 ★ 금빛)
import { PW_PING, type RunState } from "@pixel-rogue/shared";

type Ctx = CanvasRenderingContext2D;
const COLOR = { go: "120, 200, 255", attack: "120, 200, 255", danger: "255, 150, 70", boss: "255, 216, 96" } as const;
const MARK = { go: "➜", attack: "⚔", danger: "!", boss: "★" } as const;

export function drawPings(ctx: Ctx, s: RunState): void {
  const pv = s.pvp;
  if (!pv?.grow?.pings) return;
  const mine = pv.seats[s.seat ?? 0]!.team;
  ctx.save();
  for (const p of pv.grow.pings) {
    const age = s.tick - p.at;
    if (p.team !== mine || age >= PW_PING.show) continue;
    const c = COLOR[p.kind];
    const fade = 1 - age / PW_PING.show;
    // 퍼지는 고리 (처음 1초에 세 번)
    for (let n = 0; n < 3; n++) {
      const k = ((age + n * 20) % 60) / 60;
      ctx.strokeStyle = `rgba(${c}, ${(1 - k) * fade})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6 + k * 22, 0, Math.PI * 2);
      ctx.stroke();
    }
    // 가운데 표시 (위아래로 살짝 뜀)
    const y = p.y - 16 - Math.abs(Math.sin(age / 8)) * 4;
    ctx.fillStyle = `rgba(10, 8, 16, ${0.7 * fade})`;
    ctx.beginPath();
    ctx.arc(p.x, y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(${c}, ${fade})`;
    ctx.font = "bold 9px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(MARK[p.kind], p.x, y + 0.5);
  }
  ctx.restore();
}
