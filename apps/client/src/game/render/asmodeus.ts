// 아스모데우스의 화신체 몸·체력 막대 그리기 (sim/bossAsmo·bossAsmoLust·bossAsmoVoid·bossAsmoLord·asmoUlts, 그림 scripts/art/asmodeus)
// 몸: 모습마다 그림(욕망 · 검은 해 · 강철 군주) · 궁극기 중 변신 · 다섯 구슬 · 욕망의 구슬 · 미니 블랙홀 · 강철의 몸 등 뒤 약점
// 체력 막대: 한 줄 = 1%, 줄마다 색이 바뀌고 뒤에 다음 줄 색이 비침 · 오른쪽 ×N · 막대 위 모습 이름
import { armored, asmoLines, BOSS_ASMO_LUST_RULES as LU, asmoUltT, eating, eatSpot, fiveBlink, fiveSpot, lineHp, type EnemyState, type RunState } from "@pixel-rogue/shared";
import { detectLang } from "../../i18n";
import { TEXT } from "../../i18n/text";
import { drawEnemySprite } from "../enemySprites";
import { additive, glow, shock } from "./pwFxBits";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
/** 줄 색 돌림 (보라 → 남색 → 파랑 → 청록 → 초록 → 노랑 → 주황 → 빨강) */
const LINE_COLORS = ["#a040ff", "#4a4ae8", "#2a8aff", "#20c8c8", "#40c850", "#e8d030", "#ff8a20", "#ff2a40"];
const SHEET = ["asmodeus", "asmovoid", "asmolord"] as const;
const LIFT = [22, 26, 28];
const GLOW = ["#b040ff", "#8a30ff", "#ff2a4a"];
/** n번째 줄 색 (100줄 = 보라부터) */
const lineColor = (n: number) => LINE_COLORS[(((100 - n) % LINE_COLORS.length) + LINE_COLORS.length) % LINE_COLORS.length]!;

/** 몸 대신 그림 (그렸으면 true) */
export function drawAsmoActor(ctx: Ctx, s: RunState, e: EnemyState, x: number, y: number): boolean {
  if (e.kind !== "asmodeus") return false;
  const tint: readonly [string, number] | undefined = e.hitFlash > 0 ? ["#ffffff", 0.7] : undefined;
  const ultT = asmoUltT(s, e);
  const f = (e.amForm ?? 1) - 1;
  const tired = (e.amTired ?? 0) > s.tick;
  const bob = ultT >= 0 ? 8 + 3 * Math.sin(s.tick * 0.08) : f === 1 ? 4 + 2 * Math.sin(s.tick * 0.06) : 0;
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.beginPath();
  ctx.ellipse(x, y + e.r * 0.7, e.r * 1.3, e.r * 0.45, 0, 0, TAU);
  ctx.fill();
  if (ultT >= 0) {
    // 궁극기: 다음 모습으로 바뀌어 떠오름 (마지막은 세 모습이 겹쳐 보임)
    const k = e.amUlt === 1 ? 1 : 2;
    additive(ctx, () => glow(ctx, x, y - 26 - bob, 70, GLOW[k]!, 0.55, 0.3));
    if (e.amUlt === 3) {
      ctx.save();
      ctx.globalAlpha = 0.4;
      drawEnemySprite(ctx, "asmodeus", x - 34, y - 20 - bob, 4, false, ["#c070ff", 0.3]);
      drawEnemySprite(ctx, "asmovoid", x + 34, y - 22 - bob, 3, true, ["#8a60ff", 0.3]);
      ctx.restore();
    }
    const swap = e.amUlt === 3 || ultT > 60;
    drawEnemySprite(ctx, swap ? SHEET[k]! : SHEET[f]!, x, y - LIFT[k]! - bob, swap ? 4 : 0, false, ultT < 60 && e.amUlt !== 3 ? ["#ffffff", 1 - ultT / 60] : tint);
    return true;
  }
  additive(ctx, () => glow(ctx, x, y - 20, 34, GLOW[f]!, 0.35));
  if (armored(s, e)) {
    // 강철의 몸: 붉게 굳은 몸 + 등 뒤에 빛나는 금(약점)
    additive(ctx, () => glow(ctx, x, y - 20, 44, "#ff3a2a", 0.45));
    const bx = x - (e.amFaceX ?? 0) * (e.r + 6);
    const by = y - 14 - (e.amFaceY ?? 1) * (e.r + 6);
    additive(ctx, () => glow(ctx, bx, by, 10 + 2 * Math.sin(s.tick * 0.3), "#ffe070", 0.9, 0.6));
  }
  ctx.save();
  if (tired) ctx.globalAlpha = 0.8;
  drawEnemySprite(ctx, SHEET[f]!, x, y - LIFT[f]! - bob + (tired ? 4 : 0), e.amPose ?? 0, e.dirX < 0, armored(s, e) ? ["#ff4a3a", 0.25] : tint);
  ctx.restore();
  // 매혹의 눈 예고: 눈이 분홍으로 빛남
  if (e.amCharmAt !== undefined) additive(ctx, () => glow(ctx, x, y - LIFT[f]! - 14, 12 + 4 * Math.sin(s.tick * 0.4), "#ff5ac8", 0.9, 0.5));
  drawFive(ctx, s, e);
  drawOrbs(ctx, s, e);
  return true;
}

/** 다섯 구슬 (깜빡이는 중엔 순서대로 하나씩 밝게, 날아간 것은 사라짐) */
function drawFive(ctx: Ctx, s: RunState, e: EnemyState): void {
  if (!e.amFive) return;
  const b = fiveBlink(s, e);
  const fired = b >= 5 ? Math.floor((s.tick - (e.amFiveAt ?? 0) - LU.FIVE_BLINK * 5) / LU.FIVE_GAP) + 1 : 0;
  e.amFive.forEach((k, i) => {
    if (i < fired) return;
    const [ox, oy] = fiveSpot(e, k);
    const lit = b === i;
    additive(ctx, () => glow(ctx, ox, oy, lit ? 16 : 8, lit ? "#ffffff" : "#b050ff", lit ? 1 : 0.6, lit ? 0.8 : 0.2));
    ctx.fillStyle = "#2a0a3a";
    ctx.beginPath();
    ctx.arc(ox, oy, 3, 0, TAU);
    ctx.fill();
  });
}

/** 욕망의 구슬 · 굶주린 미니 블랙홀 */
function drawOrbs(ctx: Ctx, s: RunState, e: EnemyState): void {
  const o = e.amOrb;
  if (o) {
    const r = 11 + Math.sin(s.tick * 0.2);
    additive(ctx, () => glow(ctx, o[0], o[1], r * 2.4, "#c050ff", 0.7, 0.3));
    ctx.strokeStyle = "rgba(240, 200, 255, 0.9)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(o[0], o[1], r, s.tick * 0.1, s.tick * 0.1 + 4);
    ctx.stroke();
  }
  if (!eating(s, e)) return;
  const full = Math.min(1, (e.amEaten ?? 0) / (lineHp(e) * 4));
  for (let k = 0; k < 3; k++) {
    const [hx, hy] = eatSpot(s, e, k);
    const r = 5 + 7 * full;
    additive(ctx, () => glow(ctx, hx, hy, r * 2.2, "#9a40ff", 0.6));
    ctx.fillStyle = "#06000c";
    ctx.beginPath();
    ctx.arc(hx, hy, r, 0, TAU);
    ctx.fill();
    additive(ctx, () => shock(ctx, hx, hy, r + 2, "#d090ff", 0.8, 2));
  }
}

let lang = detectLang();
let langAt = 0;
/** 화면 글자 (가끔 언어를 다시 읽음) */
function say(tick: number, key: keyof typeof TEXT): string {
  if (tick - langAt > 120 || tick < langAt) {
    lang = detectLang();
    langAt = tick;
  }
  return TEXT[key][lang];
}

/** 체력 막대 (그렸으면 true): 한 줄씩 색이 바뀌는 ×100 막대 */
export function drawAsmoBar(ctx: Ctx, s: RunState, boss: EnemyState, bx: number, by: number, bw: number, bh: number): boolean {
  if (boss.kind !== "asmodeus") return false;
  const lines = asmoLines(boss);
  const line = lineHp(boss);
  const left = lines <= 0 ? 0 : (boss.hp - (lines - 1) * line) / line;
  ctx.fillStyle = "rgba(0,0,0,0.75)";
  ctx.fillRect(bx - 2, by - 2, bw + 4, bh + 4);
  // 뒤에 다음 줄 색 (마지막 줄이면 검정)
  ctx.fillStyle = lines > 1 ? lineColor(lines - 1) : "#100816";
  ctx.fillRect(bx, by, bw, bh);
  if (lines > 1) {
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(bx, by, bw, bh);
  }
  ctx.fillStyle = boss.immune ? "#e8e0f0" : lineColor(lines);
  ctx.fillRect(bx, by, Math.round(bw * Math.max(0, Math.min(1, left))), bh);
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.fillRect(bx, by, Math.round(bw * Math.max(0, Math.min(1, left))), 1);
  const size = Math.max(9, Math.round(bh * 1.8));
  ctx.font = `bold ${size}px monospace`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#000";
  const n = `×${lines}`;
  ctx.strokeText(n, bx + bw + 6, by + bh / 2);
  ctx.fillStyle = lineColor(lines);
  ctx.fillText(n, bx + bw + 6, by + bh / 2);
  // 모습 이름 · 미니 블랙홀이 먹는 중이면 경고
  const form = boss.amForm === 3 ? "asmoLord" : boss.amForm === 2 ? "asmoVoid" : "asmoLust";
  const warn = eating(s, boss);
  const label = warn ? say(s.tick, "asmoStopHit") : say(s.tick, form);
  ctx.font = `bold ${Math.max(8, Math.round(bh * 1.4))}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.strokeText(label, bx + bw / 2, by + bh + 4);
  ctx.fillStyle = warn ? (Math.floor(s.tick / 8) % 2 ? "#ff5a5a" : "#ffffff") : "#e0c8ff";
  ctx.fillText(label, bx + bw / 2, by + bh + 4);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  return true;
}
