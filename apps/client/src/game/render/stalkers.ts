// 시즌 2 새 몬스터 그리기 (sim/stalkers): 도플갱어(내 캐릭터 모습을 어둡게 · 붉은 눈) · 그림자(거의 투명, 치기 직전에만 짙어짐)
// 땅 물고기(땅속이면 나를 따라오는 깜빡이는 원과 흙 · 뛰어오르면 그림) · 독가스 구름과 부식독 표시 (지형 층)
import { type EnemyState, type RunState } from "@pixel-rogue/shared";
import { drawCharacter, drawEnemySprite, sheetFor } from "../sprites";
import { C, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;

function tintOf(s: RunState, e: EnemyState): readonly [string, number] | undefined {
  if (e.hitFlash > 0) return [C.hit, 1];
  if (s.freezeTicks > 0 || (e.stunTicks ?? 0) > 0) return [C.frozen, 0.5];
  return undefined;
}

function hpBar(ctx: Ctx, e: EnemyState, x: number, y: number): void {
  if (e.hp >= e.maxHp) return;
  const w = e.r * 2;
  ctx.fillStyle = "#000";
  ctx.fillRect(x - e.r, y - e.r - 4, w, 2);
  ctx.fillStyle = "#e0606a";
  ctx.fillRect(x - e.r, y - e.r - 4, Math.max(1, Math.round((w * e.hp) / e.maxHp)), 2);
}

function drawDoppel(ctx: Ctx, s: RunState, e: EnemyState, x: number, y: number): boolean {
  const p = s.player;
  const moving = e.x !== e.prevX || e.y !== e.prevY;
  const pose = { faceX: e.dirX, faceY: e.dirY, moving, casting: false, step: Math.floor(s.tick / 8) };
  // 발밑 검붉은 그림자
  ctx.fillStyle = "rgba(90, 20, 60, 0.45)";
  ctx.beginPath();
  ctx.ellipse(x, y + e.r - 1, e.r + 2, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.filter = e.hitFlash > 0 ? "brightness(2.2)" : "brightness(0.35) saturate(0.4) sepia(0.6) hue-rotate(250deg)";
  const ok = drawCharacter(ctx, sheetFor(p.characterId, p.lv, p.abM), x, y, p.r, pose) || drawCharacter(ctx, p.characterId, x, y, p.r, pose);
  ctx.filter = "none";
  if (!ok) return false;
  // 붉은 눈
  ctx.fillStyle = "#ff3a4a";
  const ex = e.dirX < 0 ? -2 : 1;
  ctx.fillRect(x + ex, y - p.r + 2, 1, 1);
  ctx.fillRect(x + ex + 2, y - p.r + 2, 1, 1);
  hpBar(ctx, e, x, y);
  return true;
}

function drawLurker(ctx: Ctx, s: RunState, e: EnemyState, x: number, y: number): boolean {
  // 칠 때만 짙어짐 (그 전엔 거의 안 보임)
  ctx.globalAlpha = e.phase === "windup" ? 0.8 : e.hitFlash > 0 ? 0.6 : 0.2;
  const ok = drawEnemySprite(ctx, "lurker", x, y, Math.floor(s.tick / 12), e.dirX < 0, tintOf(s, e));
  ctx.globalAlpha = 1;
  return ok;
}

/** 땅속 땅 물고기: 따라오는 원 (멈추면 빨리 깜빡) + 들썩이는 흙 */
function drawBurrow(ctx: Ctx, s: RunState, e: EnemyState, x: number, y: number): void {
  const warn = e.step === 1;
  const on = Math.floor(s.tick / (warn ? 3 : 8)) % 2 === 0;
  const r = 20;
  ctx.strokeStyle = warn ? (on ? "#ff4a3a" : "#ffb03a") : on ? "rgba(255, 120, 60, 0.75)" : "rgba(255, 120, 60, 0.35)";
  ctx.lineWidth = warn ? 2 : 1;
  ctx.setLineDash(warn ? [] : [3, 3]);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  // 등지느러미가 흙을 가름
  ctx.fillStyle = "#5a4024";
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + s.tick * 0.05;
    ctx.fillRect(Math.round(x + Math.cos(a) * 5), Math.round(y + Math.sin(a) * 3), 2, 2);
  }
  ctx.fillStyle = "#c8a070";
  ctx.beginPath();
  ctx.moveTo(x - 3, y + 1);
  ctx.lineTo(x, y - 5 - (Math.floor(s.tick / 6) % 2));
  ctx.lineTo(x + 3, y + 1);
  ctx.fill();
}

/** 새 몬스터면 그리고 true (뛰어오른 땅 물고기·베놈은 보통 그림) */
export function drawStalker(ctx: Ctx, s: RunState, e: EnemyState, x: number, y: number): boolean {
  if (e.kind === "doppel") return drawDoppel(ctx, s, e, x, y);
  if (e.kind === "lurker") return drawLurker(ctx, s, e, x, y);
  if (e.kind === "landfish" && e.air) {
    drawBurrow(ctx, s, e, x, y);
    return true;
  }
  return false;
}

/** 독가스 구름 (지형 층, 일렁이는 녹보라 안개) · 부식독에 걸린 사람 발밑 거품 */
export function drawGas(ctx: Ctx, s: RunState, snap: Snap): void {
  const gas = s.terrain?.room === s.roomId ? s.terrain.gas : undefined;
  for (const g of gas ?? []) {
    const fade = Math.min(1, (g.until - s.tick) / 60);
    for (let i = 0; i < 5; i++) {
      const a = i * 1.26 + s.tick * 0.012;
      const ox = Math.cos(a) * g.r * 0.45;
      const oy = Math.sin(a) * g.r * 0.35;
      ctx.fillStyle = i % 2 ? `rgba(120, 200, 70, ${0.18 * fade})` : `rgba(150, 80, 190, ${0.16 * fade})`;
      ctx.beginPath();
      ctx.arc(snap(g.x + ox), snap(g.y + oy), g.r * 0.65, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const p = s.player;
  if ((p.corrode ?? 0) > 0 && p.hp > 0) {
    for (let i = 0; i < 3; i++) {
      const k = (s.tick + i * 13) % 40;
      ctx.fillStyle = i % 2 ? "rgba(140, 220, 80, 0.85)" : "rgba(170, 90, 210, 0.85)";
      ctx.fillRect(snap(p.x - 4 + i * 4), snap(p.y + p.r - k / 3), 2, 2);
    }
  }
  // 독: 머리 위로 초록 방울이 떠오름
  if ((p.poison ?? 0) > 0 && p.hp > 0) {
    for (let i = 0; i < 2; i++) {
      const k = (s.tick + i * 20) % 40;
      ctx.fillStyle = `rgba(110, 230, 80, ${0.9 - k / 50})`;
      ctx.fillRect(snap(p.x - 3 + i * 5), snap(p.y - p.r - 4 - k / 4), 2, 2);
    }
  }
}
