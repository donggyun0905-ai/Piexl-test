// 패왕전 스킬 그림 (사람·소환): 소환한 것(포탑·드론·고양이·해골·새끼 용·정령·인형) · 상태이상 표시(기절 별·침묵·속박 사슬·둔화) · 버프는 pwBuffFx
import { allPlayers, kitOf, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;

/** 작은 도트 모양 (글자 지도: 1 = 색, 2 = 흰색, 3 = 검정) */
const LOOKS: Record<string, string[]> = {
  turret: ["..333..", ".31113.", "3111113", "3112113", "3111113", ".33333.", "3.3.3.3"],
  drone: ["3.....3", ".3...3.", "..111..", ".11211.", "..111..", ".3...3.", "3.....3"],
  cat: ["1.....1", "11...11", "1111111", "1212121", "1111111", ".11111.", ".1...1."],
  skeleton: ["..222..", ".23232.", "..222..", ".22222.", "2.222.2", "..2.2..", ".2...2."],
  dragon: ["1.....1", "11.1.11", "1111111", ".12121.", ".11111.", "..111..", "...1..."],
  spirit: ["...2...", "..121..", ".11211.", "1122211", ".11211.", "..121..", "...1..."],
  doll: ["..111..", ".11111.", ".12121.", "..111..", ".11111.", "1.111.1", "..1.1.."],
};

function pixels(ctx: Ctx, rows: string[], x: number, y: number, color: string): void {
  const h = rows.length;
  rows.forEach((row, ry) => {
    [...row].forEach((ch, rx) => {
      if (ch === ".") return;
      ctx.fillStyle = ch === "1" ? color : ch === "2" ? "#ffffff" : "#1a1424";
      ctx.fillRect(Math.round(x - row.length / 2 + rx), Math.round(y - h + ry), 1, 1);
    });
  });
}

/** 소환한 것들 (편 색 테두리 고리 + 체력·남은 시간 + 때릴 때 빛줄기) */
export function drawPwMinions(ctx: Ctx, s: RunState, alpha: number, snap: Snap, tint: (i: number) => string): void {
  const players = allPlayers(s);
  for (const m of s.pvp?.mins ?? []) {
    const def = kitOf(players[m.seat]!.characterId)?.skills[m.k];
    const sm = def?.summon;
    if (!sm) continue;
    const x = snap(lerp(m.prevX, m.x, alpha));
    const y = snap(lerp(m.prevY, m.y, alpha));
    const team = tint(m.seat);
    ctx.strokeStyle = team;
    ctx.beginPath();
    ctx.ellipse(x, y + 1, 5, 2.5, 0, 0, Math.PI * 2);
    ctx.stroke();
    const bob = sm.still ? 0 : Math.sin((s.tick + m.id * 9) / 6);
    // 2배 크기로 그림
    ctx.save();
    ctx.translate(x, y + 1 + bob);
    ctx.scale(2, 2);
    pixels(ctx, LOOKS[sm.look] ?? LOOKS.spirit!, 0, 0, def.tint);
    ctx.restore();
    // 체력 (편 색, 부술 수 있음) · 그 아래 남은 시간 (흰 얇은 줄)
    const hp = m.body ? Math.max(0, m.body.hp / m.body.maxHp) : 1;
    const f = Math.max(0, m.t / sm.ticks);
    ctx.fillStyle = "#0a0810";
    ctx.fillRect(x - 7, y - 19, 14, 4);
    ctx.fillStyle = team;
    ctx.fillRect(x - 6, y - 18, Math.round(12 * hp), 2);
    ctx.fillStyle = "#e8e4f0";
    ctx.fillRect(x - 6, y - 16, Math.round(12 * f), 1);
    if (m.shot && s.tick - m.shot.at < 8) {
      const a = 1 - (s.tick - m.shot.at) / 8;
      ctx.globalAlpha = a;
      ctx.strokeStyle = def.tint;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y - 6);
      ctx.lineTo(m.shot.x, m.shot.y);
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.globalAlpha = 1;
    }
  }
}

/** 상태이상 표시 (체력 줄 위): 기절 도는 별 · 침묵 ✕ · 속박 사슬 · 둔화 달팽이 줄 */
export function drawPwStatus(ctx: Ctx, s: RunState, i: number, x: number, top: number, feet: number): void {
  const seat = s.pvp!.seats[i]!;
  const y = top - 6;
  if (seat.stun > 0) {
    for (let k = 0; k < 3; k++) {
      const a = s.tick / 8 + (k / 3) * Math.PI * 2;
      ctx.fillStyle = "#ffe070";
      ctx.fillRect(Math.round(x + Math.cos(a) * 8) - 1, Math.round(y + Math.sin(a) * 2.5) - 1, 3, 3);
    }
  }
  if ((seat.silence ?? 0) > 0) {
    ctx.strokeStyle = "#c88aff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 3, y - 6);
    ctx.lineTo(x + 3, y);
    ctx.moveTo(x + 3, y - 6);
    ctx.lineTo(x - 3, y);
    ctx.stroke();
    ctx.lineWidth = 1;
  }
  if (seat.root > 0) {
    ctx.strokeStyle = "#c8c8d0";
    for (let k = -1; k <= 1; k++) {
      ctx.beginPath();
      ctx.arc(x + k * 5, feet, 2, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  if (seat.slow > 0 && seat.stun <= 0) {
    ctx.fillStyle = "#8ad8ff";
    ctx.fillRect(x - 9, top + 1, 2, 2);
    ctx.fillRect(x + 8, top + 1, 2, 2);
  }
}
