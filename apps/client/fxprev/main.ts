// 효과 미리보기 (개발용, 게임에 안 들어감): 효과 하나를 시간대별로 나란히 그려 스크린샷으로 확인 — docs/FX_FRAMES.md
// 주소: /fxprev/?rows=[{"kind":"jnOrb","max":96,"size":70}]&cols=[0.1,0.3,0.5] (cols = 지난 비율 0~1, 또는 ticks=[0,2,4] 지난 틱)
// 행 값: kind · max(maxTicks) · size · dir([x,y]) · style · zig(존 천둥의 발자취 길을 초록 선으로)
import { zigPath, type EffectState } from "@pixel-rogue/shared";
import { drawNoirFx } from "../src/game/render/noirFx";
import { drawRougeFx } from "../src/game/render/rougeFx";
import { drawBleuFx } from "../src/game/render/bleuFx";
import { drawJauneFx } from "../src/game/render/jauneFx";
import { drawMagentaFx } from "../src/game/render/magentaFx";
import { drawVertFx } from "../src/game/render/vertFx";

type Row = { kind: string; max: number; size: number; dir?: [number, number]; style?: number; zig?: boolean };
const q = new URLSearchParams(location.search);
const rows: Row[] = JSON.parse(q.get("rows") ?? "[]");
const byTick: number[] | null = q.get("ticks") ? JSON.parse(q.get("ticks")!) : null;
const cols: number[] = byTick ?? JSON.parse(q.get("cols") ?? "[0.1,0.3,0.5,0.7,0.9]");
const CW = Number(q.get("w") ?? 260);
const CH = Number(q.get("h") ?? 220);
const DRAW = [drawNoirFx, drawRougeFx, drawBleuFx, drawJauneFx, drawMagentaFx, drawVertFx];
const cv = document.getElementById("c") as HTMLCanvasElement;
cv.width = CW * cols.length;
cv.height = CH * rows.length;
const ctx = cv.getContext("2d")!;

function draw(): void {
  ctx.fillStyle = "#15151c";
  ctx.fillRect(0, 0, cv.width, cv.height);
  rows.forEach((r, i) =>
    cols.forEach((c, j) => {
      const [cx, cy] = [CW * j + CW / 2, CH * i + CH / 2];
      ctx.strokeStyle = "#333";
      ctx.strokeRect(CW * j, CH * i, CW, CH);
      const ticks = byTick ? r.max - c : Math.round(r.max * (1 - c));
      const [dx, dy] = r.dir ?? [1, 0];
      const fx = { kind: r.kind, x: cx, y: cy, dirX: dx, dirY: dy, size: r.size, ticks, maxTicks: r.max, style: r.style } as unknown as EffectState;
      DRAW.some((d) => d(ctx, fx, Math.round));
      if (r.zig) zigLine(cx, cy, dx, dy, r.size);
      ctx.fillStyle = "#fff";
      ctx.font = "12px sans-serif";
      ctx.fillText(`${r.kind} ${r.max - ticks}/${r.max}`, CW * j + 4, CH * i + 14);
    }),
  );
}

/** 존 천둥의 발자취: 캐릭터가 지나갈 길 (방 밖으로 눌리지 않게 첫 칸 근처만) */
function zigLine(cx: number, cy: number, dx: number, dy: number, size: number): void {
  const n = Math.sqrt(dx * dx + dy * dy);
  const [ax, ay] = zigPath(0, 0, dx / n, dy / n, size);
  const [, , path] = zigPath(cx - ax, cy - ay, dx / n, dy / n, size);
  ctx.strokeStyle = "#0f0";
  ctx.beginPath();
  ctx.moveTo(cx - ax, cy - ay);
  for (const [x, y] of path) ctx.lineTo(x, y);
  ctx.stroke();
}

// 그림은 처음 그릴 때 받기 시작 → 한 번 그리고 잠시 뒤 다시
draw();
setTimeout(() => {
  draw();
  document.title = "ready";
}, 2500);
