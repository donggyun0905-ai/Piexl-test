// 시련의 방 그림 (비석·상자는 사용자 그림 render/propArt, 없으면 코드 그림): 새빨간 방 꾸밈(바닥 의식 원·핏빛 금·양옆 붉은 화로) · 가운데 거대한 비석(검은 현무암·붉게 빛나는 문자·떠도는 조각·어두운 기운) · 보상 상자
// 바닥·벽 색은 render/floorThemes의 TRIAL 테마 · 비석이 깨어나는·보상이 쏟아지는 효과는 render/trialFx
import { STONE_Y, type Pickup, type RunState } from "@pixel-rogue/shared";
import { additive, alpha, glow, rnd, rune } from "./pwFxBits";
import { drawProp } from "./propArt";

type Ctx = CanvasRenderingContext2D;
const RED = "#ff2a3a";
const EMBER = "#ff7a3a";
const BASALT = "#1a1016";

/** 방 바닥: 비석 아래 큰 의식 원 · 바닥의 핏빛 금(맥박) · 양옆 화로 둘 */
export function drawTrialRoom(ctx: Ctx, s: RunState, cx: number, cy: number): void {
  const t = s.tick;
  const busy = !!s.trialRun;
  additive(ctx, () => {
    rune(ctx, cx, STONE_Y + 18, 64, RED, busy ? 0.9 : 0.5, t * (busy ? 0.02 : 0.006));
    rune(ctx, cx, STONE_Y + 18, 40, EMBER, 0.35, -t * 0.01);
  });
  // 핏빛 금: 비석에서 바닥으로 뻗은 갈라짐 (천천히 맥박)
  const pulse = 0.35 + 0.25 * Math.sin(t / 20) + (busy ? 0.3 : 0);
  ctx.strokeStyle = alpha(RED, Math.min(1, pulse));
  ctx.lineWidth = 1;
  for (let k = 0; k < 7; k++) {
    let x = cx;
    let y = STONE_Y + 18;
    const a = (k / 7) * Math.PI * 2 + 0.3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let j = 0; j < 6; j++) {
      x += Math.cos(a) * 12 + (rnd(k, j) - 0.5) * 10;
      y += Math.sin(a) * 7 + (rnd(j, k) - 0.5) * 6;
      ctx.lineTo(Math.round(x), Math.round(y));
    }
    ctx.stroke();
  }
  for (const side of [-1, 1]) brazier(ctx, cx + side * 120, cy - 30, t, side < 0 ? 1 : 7);
}

/** 붉은 불꽃 화로 */
function brazier(ctx: Ctx, x: number, y: number, t: number, seed: number): void {
  ctx.fillStyle = "#2a1a1e";
  ctx.fillRect(x - 6, y, 12, 4);
  ctx.fillRect(x - 2, y + 4, 4, 14);
  ctx.fillRect(x - 6, y + 18, 12, 3);
  additive(ctx, () => {
    glow(ctx, x, y - 4, 22, RED, 0.6 + 0.15 * Math.sin(t / 5 + seed), 0.6);
    for (let i = 0; i < 5; i++) {
      const f = ((t * 0.7 + i * 13 + seed * 7) % 30) / 30;
      ctx.fillStyle = alpha(i % 2 ? EMBER : RED, 1 - f);
      ctx.fillRect(Math.round(x - 3 + rnd(i, seed) * 6 + Math.sin(t / 6 + i) * 2), Math.round(y - 2 - f * 18), 2, 2);
    }
  });
}

/** 거대한 비석: 아래가 넓은 검은 기둥 · 붉게 빛나는 문자(깨어나면 밝게) · 둘레를 도는 조각 · 아래 어두운 기운. (x, y) = 밑동 가운데 */
export function drawTrialStone(ctx: Ctx, x: number, y: number, t: number, awake: boolean, asleep: boolean): void {
  const H = 64;
  const top = y - H;
  const breath = asleep ? 0.25 : 0.6 + 0.4 * Math.sin(t / 14);
  // 발밑 어두운 기운
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.beginPath();
  ctx.ellipse(x, y, 30, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  additive(ctx, () => glow(ctx, x, y - H * 0.45, 46, RED, (awake ? 0.7 : 0.35) * breath, awake ? 0.8 : 0.3));
  // 몸: 그림(sprites/props/trialStone, 잠듦 · 빛나는 룬)이 있으면 그것을 (깨어난 모습은 숨 쉬듯 겹침), 없으면 코드 그림
  const art = drawProp(ctx, "trialStone", 0, x, y + 2, { h: H + 4 });
  if (art && !asleep) drawProp(ctx, "trialStone", 1, x, y + 2, { h: H + 4, alpha: Math.min(1, 0.35 + 0.65 * breath) });
  if (!art) stoneBody(ctx, x, y, top, breath);
  // 빛나는 문자 (세로 줄, 오르내리며 깜빡임 · 붉은 돌 그림 위에서는 더하기로 빛남)
  const glyphs = () => {
    for (let i = 0; i < 7; i++) {
      const gy = top + 14 + i * 6.5;
      const on = asleep ? 0.2 : Math.max(0.25, Math.sin(t / 9 - i * 0.7)) * breath;
      ctx.fillStyle = alpha(i % 3 === 0 ? EMBER : RED, on);
      const w = 3 + Math.round(rnd(i, 3) * 4);
      ctx.fillRect(Math.round(x - w / 2), Math.round(gy), w, 2);
      if (i % 2) ctx.fillRect(Math.round(x - 1), Math.round(gy - 2), 2, 6);
    }
  };
  if (art) additive(ctx, glyphs);
  else glyphs();
  // 갈라진 금 (빛이 새어 나옴)
  ctx.strokeStyle = alpha(EMBER, 0.7 * breath);
  ctx.beginPath();
  ctx.moveTo(x - 9, y - 6);
  ctx.lineTo(x - 5, y - 18);
  ctx.lineTo(x - 8, y - 26);
  ctx.stroke();
  // 둘레를 도는 검은 조각
  if (!asleep) {
    for (let i = 0; i < 5; i++) {
      const a = t * 0.02 + (i / 5) * Math.PI * 2;
      const px = x + Math.cos(a) * 26;
      const py = top + 24 + Math.sin(a) * 8 - Math.sin(t / 10 + i) * 3;
      ctx.fillStyle = Math.sin(a) > 0 ? "#3a2028" : "#140a0e";
      ctx.fillRect(Math.round(px - 2), Math.round(py - 3), 4, 6);
      ctx.fillStyle = alpha(RED, 0.8);
      ctx.fillRect(Math.round(px - 1), Math.round(py - 1), 1, 1);
    }
  }
}

/** 보상 상자: 바로 받는 능력치는 붉은 · 고르는 것은 금빛 · 되살아남은 하얀 상자 (반짝이며 둥실) */
export function drawTrialChest(ctx: Ctx, pk: Pickup, x: number, y: number, t: number): void {
  const c = pk.itemId === "rv" ? "#f4f0ff" : pk.itemId.startsWith("rs:") ? RED : "#ffcc3a";
  const bob = Math.round(Math.sin(t / 10 + pk.id) * 1.5);
  additive(ctx, () => glow(ctx, x, y - 4 + bob, 16, c, 0.55 + 0.2 * Math.sin(t / 8 + pk.id), 0.5));
  // 그림(sprites/props/trialChest 닫힌 상자)이 있으면 그것을
  if (drawProp(ctx, "trialChest", 0, x, y + 3 + bob, { h: 15 })) {
    if ((t + pk.id * 5) % 40 < 6) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x + 5, y - 12 + bob, 1, 1);
    }
    return;
  }
  ctx.fillStyle = "#3a2410";
  ctx.fillRect(x - 7, y - 8 + bob, 14, 10);
  ctx.fillStyle = c;
  ctx.fillRect(x - 7, y - 8 + bob, 14, 3);
  ctx.fillRect(x - 1, y - 8 + bob, 2, 10);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x - 1, y - 4 + bob, 2, 2);
  if ((t + pk.id * 5) % 40 < 6) ctx.fillRect(x + 4, y - 11 + bob, 1, 1);
}

/** 그림이 아직 없을 때: 검은 현무암 비석 (위가 좁은 사다리꼴 + 뾰족한 머리) */
function stoneBody(ctx: Ctx, x: number, y: number, top: number, breath: number): void {
  ctx.beginPath();
  ctx.moveTo(x - 16, y);
  ctx.lineTo(x - 11, top + 10);
  ctx.lineTo(x, top);
  ctx.lineTo(x + 11, top + 10);
  ctx.lineTo(x + 16, y);
  ctx.closePath();
  const g = ctx.createLinearGradient(x - 16, 0, x + 16, 0);
  g.addColorStop(0, "#2e1c24");
  g.addColorStop(0.45, BASALT);
  g.addColorStop(1, "#0a0608");
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = alpha(RED, 0.5 * breath + 0.2);
  ctx.lineWidth = 1;
  ctx.stroke();
}
