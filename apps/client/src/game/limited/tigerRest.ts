// 범 풍류 대기 장면: 몸을 둥글게 말고 자는 큰 백호 · 배에 기대어 앉아 자는 내 캐릭터 · 앞을 감싼 꼬리
// · 둘레를 둥실둥실 도는 풍악 악기(장구·꽹과리·북·소고·태평소·청사초롱) · 음표 · 오방색 꽃가루 (화면 전용)
import type { RunState } from "@pixel-rogue/shared";
import { drawBody } from "../render/actors";
import { sheetFor } from "../sprites";
import { drawTigerSprite, TIGER_SPRITES } from "./tigerSprites";

type Ctx = CanvasRenderingContext2D;
const OBANG = ["#3a6ad0", "#d83a3a", "#ffd860", "#f4f4f8", "#2a2a30"];
const N = TIGER_SPRITES.band.rows;

/** 악기 자리 (둘레 타원을 천천히 돎, 둥실 위아래) */
function spot(i: number, px: number, py: number, tick: number) {
  const a = (i / N) * Math.PI * 2 + tick * 0.0025;
  return { x: px + Math.cos(a) * 62, y: py - 6 + Math.sin(a) * 32 + Math.sin(tick * 0.05 + i * 1.7) * 3, front: Math.sin(a) > 0 };
}

function drawInstruments(ctx: Ctx, px: number, py: number, k: number, tick: number, front: boolean): boolean {
  let ok = true;
  for (let i = 0; i < N; i++) {
    const p = spot(i, px, py, tick);
    if (p.front !== front) continue;
    const x = Math.round(p.x);
    const y = Math.round(p.y);
    // 은은한 금빛 둘레 (기울이지 않아 픽셀이 깔끔하게)
    ctx.globalAlpha = k * (front ? 0.22 : 0.12);
    ctx.fillStyle = "#ffd860";
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = k * (front ? 0.8 : 0.45);
    ctx.save();
    ctx.translate(x, y);
    ok = drawTigerSprite(ctx, "band", ((tick >> 4) + i) % 2, i, 0.8) && ok;
    ctx.restore();
    // 음표(♪)가 천천히 피어오름
    const up = (tick * 0.25 + i * 17) % 30;
    ctx.globalAlpha = k * (front ? 0.9 : 0.5) * (1 - up / 30);
    ctx.fillStyle = i % 2 ? "#ffd860" : "#fff4e0";
    const nx = Math.round(x + 7 + Math.sin(up * 0.25 + i) * 2);
    const ny = Math.round(y - 6 - up);
    ctx.fillRect(nx, ny, 2, 2);
    ctx.fillRect(nx + 1, ny - 4, 1, 4);
    ctx.fillRect(nx + 2, ny - 3, 1, 1);
    ctx.fillRect(nx + 3, ny - 2, 1, 1);
  }
  return ok;
}

/** 대기 장면을 그림. 그림이 다 있으면 true (k: 기운 0~1, 다 차면 캐릭터가 앉아 잠) */
export function drawTigerRest(ctx: Ctx, s: RunState, px: number, py: number, k: number, tick: number): boolean {
  // 오방색 꽃가루가 천천히 내려옴
  for (let i = 0; i < 10; i++) {
    const t = (tick * 0.3 + i * 37) % 90;
    ctx.globalAlpha = k * Math.min(1, (90 - t) / 30);
    ctx.fillStyle = OBANG[i % OBANG.length]!;
    ctx.fillRect(Math.round(px - 54 + ((i * 29) % 108) + Math.sin(t * 0.08 + i) * 4), Math.round(py - 60 + t), 2, 1);
  }
  const back = drawInstruments(ctx, px, py, k, tick, false);
  // 바닥 그림자 (백호가 땅에 붙어 보이게)
  ctx.globalAlpha = 0.35 * k;
  ctx.fillStyle = "#0a0810";
  ctx.beginPath();
  ctx.ellipse(px + 2, py + 18, 36, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = k;
  ctx.save();
  ctx.translate(px - 2, py - 2);
  // 나타날 때 살짝 커지며 내려앉음
  ctx.scale(0.9 + 0.1 * k, 0.9 + 0.1 * k);
  const body = drawTigerSprite(ctx, "sleep", (tick >> 5) % 2);
  ctx.restore();
  if (!back || !body) return false;
  if (k >= 1) {
    // 백호 배에 기대어 앉아 잠 (살짝 기울고 천천히 숨 쉼)
    const p = s.player;
    ctx.globalAlpha = 1;
    ctx.save();
    ctx.translate(px, py + 4);
    ctx.rotate(-0.12 + Math.sin(tick * 0.04) * 0.02);
    drawBody(ctx, p.characterId, 0, 0, p.r, { faceX: 0, faceY: 1, moving: false, casting: false, step: 0 }, 0, sheetFor(p.characterId, p.lv));
    ctx.restore();
    // 캐릭터 머리 위 Zz
    const z = (tick >> 5) % 3;
    ctx.fillStyle = "#c8e0ff";
    for (let i = 0; i <= z; i++) ctx.fillRect(px + 6 + i * 4, py - 14 - i * 4, 3, 1);
  }
  ctx.globalAlpha = k;
  ctx.save();
  ctx.translate(px - 2, py - 2);
  const tail = drawTigerSprite(ctx, "tail", (tick >> 5) % 2);
  ctx.restore();
  drawInstruments(ctx, px, py, k, tick, true);
  return tail;
}
