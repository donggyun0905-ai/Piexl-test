// 패왕전 버프 그림 (모두에게 보임): 발밑 빛 고리 + 몸 둘레로 피어오르는 기운(작은 빛 알갱이가 위로) · 버프마다 색
// 공격력 빨강 불꽃 · 받는 피해 감소 파랑 방패 막 · 빠름 노랑 바람 줄 · 재생 초록 잎. 남은 시간이 1초 아래면 깜빡임
import type { PlayerState, RunState } from "@pixel-rogue/shared";

type Ctx = CanvasRenderingContext2D;
type Buff = NonNullable<PlayerState["pwBuffs"]>[number];

const colorOf = (b: Buff): string => (b.dmg ? "#ff5a3a" : b.taken ? "#6ab8ff" : b.rate || b.move ? "#ffe070" : b.regen ? "#7aff8a" : "");

/** 위로 피어오르는 기운 (알갱이 n개, 몸 둘레에서 머리 위까지) */
function rise(ctx: Ctx, s: RunState, x: number, y: number, r: number, color: string, seed: number): void {
  const n = 10;
  for (let k = 0; k < n; k++) {
    const life = 36;
    const t = ((s.tick + k * 11 + seed * 7) % life) / life;
    const c = Math.cos((k / n) * Math.PI * 2 + seed);
    const px = x + c * (r + 3) * (1 - t * 0.4);
    const py = y + r - t * (r * 2 + 14);
    ctx.globalAlpha = (1 - t) * 0.9;
    ctx.fillStyle = color;
    const sz = t < 0.5 ? 3 : 2;
    ctx.fillRect(Math.round(px), Math.round(py), sz, sz + 1);
    if (t < 0.3) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(Math.round(px), Math.round(py), 1, 1);
    }
  }
}

export function drawPwBuffs(ctx: Ctx, s: RunState, p: PlayerState, x: number, y: number): void {
  // 파멸의 용 영구 강화(keep)는 몸 둘레 빛을 그리지 않음 (끝나지 않아 늘 켜져 있게 됨)
  const list = (p.pwBuffs ?? []).filter((b) => !b.keep && colorOf(b));
  list.forEach((b, i) => {
    const color = colorOf(b);
    // 끝나 가면 깜빡임
    if (b.t < 60 && Math.floor(s.tick / 4) % 2 === 0) return;
    const pulse = (Math.sin(s.tick / 5 + i) + 1) / 2;
    // 발밑 빛 (부드러운 원)
    const g = ctx.createRadialGradient(x, y + p.r - 1, 1, x, y + p.r - 1, p.r + 10);
    g.addColorStop(0, `${color}88`);
    g.addColorStop(1, `${color}00`);
    ctx.globalAlpha = 0.6 + pulse * 0.3;
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, y + p.r - 1, p.r + 10, (p.r + 10) / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    // 빛 고리
    ctx.globalAlpha = 0.5 + pulse * 0.4;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(x, y + p.r - 1, p.r + 6 + pulse * 2, (p.r + 6) / 2 + pulse, 0, 0, Math.PI * 2);
    ctx.stroke();
    // 받는 피해 감소: 몸을 감싸는 얇은 방패 막
    if (b.taken) {
      ctx.globalAlpha = 0.25 + pulse * 0.2;
      ctx.beginPath();
      ctx.ellipse(x, y - 2, p.r + 5, p.r + 9, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    // 빠름: 뒤로 흐르는 바람 줄
    if (b.rate || b.move) {
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = color;
      for (let k = 0; k < 3; k++) {
        const off = (s.tick * 1.5 + k * 5) % 12;
        ctx.fillRect(Math.round(x - p.faceX * (p.r + 4 + off)) - 2, Math.round(y - 6 + k * 4), 4, 1);
      }
    }
    rise(ctx, s, x, y, p.r, color, i);
  });
  ctx.globalAlpha = 1;
  ctx.lineWidth = 1;
}
