// 빛 층 미리보기 (개발용): 효과 + 그 위 빛 층(PixiJS)을 같이 그려 빛 색·세기를 스크린샷으로 확인 — docs/FX_FRAMES.md
// 주소: /fxprev/glow.html?char=jaune&kinds=["jnFist","jnEnd"]&size=60&at=0.12 (at = 효과가 생기고 지난 초) · 캐릭터는 계급 3·늘 켜진 빛 시험값
import type { EffectState, RunState } from "@pixel-rogue/shared";
import "../src/styles/glow.css";
import { GlowCanvas } from "../src/game/glow/glowCanvas";
import { GlowSilber } from "../src/game/glow/glowSilber";
import { drawNoirFx } from "../src/game/render/noirFx";
import { drawRougeFx } from "../src/game/render/rougeFx";
import { drawBleuFx } from "../src/game/render/bleuFx";
import { drawJauneFx } from "../src/game/render/jauneFx";
import { drawMagentaFx } from "../src/game/render/magentaFx";
import { drawVertFx } from "../src/game/render/vertFx";

const q = new URLSearchParams(location.search);
const kinds: string[] = JSON.parse(q.get("kinds") ?? "[]");
const size = Number(q.get("size") ?? 50);
const at = Number(q.get("at") ?? 0.12);
const CW = 200;
const H = 240;
const cv = document.getElementById("c") as HTMLCanvasElement;
cv.width = CW * (kinds.length + 1);
cv.height = H;
cv.style.width = `${cv.width}px`;
cv.style.height = `${H}px`;
const ctx = cv.getContext("2d")!;
const DRAW = [drawNoirFx, drawRougeFx, drawBleuFx, drawJauneFx, drawMagentaFx, drawVertFx];
const MAX = 40;
const fx = kinds.map((kind, i) => ({ kind, x: CW * (i + 1.5), y: H / 2, dirX: 1, dirY: 0, size, ticks: MAX * 0.6, maxTicks: MAX }) as unknown as EffectState);
// 첫 칸: 늘 켜진 빛 (계급 3 · 구체·장미·눈결정)
const player = { characterId: q.get("char") ?? "jaune", x: CW / 2, y: H / 2, faceX: 1, faceY: 0, nrRank: 3, passives: [], rgRoses: [{ x: 60, y: 60, until: 1e9 }], buFlakes: [{ x: 140, y: 60, until: 1e9 }], jnBolts: [{ x: 100, y: 190, dx: 1, dy: 0, left: 100 }] };
const run = { tick: 1, effects: fx, enemies: [], player, roomId: 0 } as unknown as RunState;
const glow = new GlowCanvas(cv);
const silber = new GlowSilber();
let t0 = 0;

function frame(now: number): void {
  const dt = glow.tick();
  ctx.fillStyle = "#15151c";
  ctx.fillRect(0, 0, cv.width, H);
  for (const f of fx) DRAW.some((d) => d(ctx, f, Math.round));
  if (glow.ready() && glow.parts) {
    if (!t0) t0 = now;
    silber.observe(run, glow.parts, glow.cues);
    glow.render(dt, 1, 0, 0);
    if ((now - t0) / 1000 >= at) return void (document.title = "ready");
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
