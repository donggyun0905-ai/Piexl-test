// 타워 디펜스 한 프레임: 맵 → 움직이는 꾸밈 → 타워 받침·사거리 → 바닥 장치 → 적 → 타워(캐릭터)·무기·타워 체력 → 탄·효과 → 공격·맞음 빛(tdFx) → 보스 체력 줄 → 세울 자리 미리 보기
// 공격자(무기)마다 run.player 등을 그 공격자로 바꾼 '보기'를 만들어 기존 그리기 함수를 그대로 씀
import { applyRoom, ENEMIES, TILE_SIZE, type CharacterId, type RunState, type TdAttacker, type TdState } from "@pixel-rogue/shared";
import { drawBody, drawEnemies } from "../game/render/actors";
import { sheetFor } from "../game/sprites";
import { drawDevices, drawEngineerGear } from "../game/render/beams";
import { drawBrawl } from "../game/render/brawl";
import { drawGunner } from "../game/render/guns";
import { drawMedicAir, drawMedicGround } from "../game/render/medic";
import { drawOrbitField, drawOrbs } from "../game/render/orbs";
import { lerp, type Snap } from "../game/render/palette";
import { drawPets } from "../game/render/pets";
import { drawNinja } from "../game/render/ninja";
import { drawChrono } from "../game/render/chrono";
import { drawSummons } from "../game/render/summon";
import { drawEffects, drawProjectiles } from "../game/render/shots";
import { drawMapFx, mapCanvas, MAP_H, MAP_W } from "./tdArt";
import { drawTdFx } from "./tdFx";

export interface TdView {
  alpha: number;
  /** 화면 픽셀 / 게임 픽셀 */
  scale: number;
  /** 고른 타워 id (사거리 원) */
  selected: number | null;
  /** 세울 자리 미리 보기 */
  hover: { col: number; row: number; ok: boolean; character: CharacterId; range: number } | null;
  /** 초 (움직이는 꾸밈) */
  time: number;
}

const view = (s: RunState, a: TdAttacker): RunState => ({ ...s, player: a.p, projectiles: a.shots, devices: a.devices, effects: a.effects, pendingBlasts: a.blasts, autoTargetId: 0 });

export function drawTd(ctx: CanvasRenderingContext2D, td: TdState, v: TdView): void {
  const s = td.run;
  applyRoom(s);
  const k = v.scale;
  const snap: Snap = (n) => Math.round(n * k) / k;
  const { alpha } = v;
  ctx.setTransform(k, 0, 0, k, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(mapCanvas(td.mapId), 0, 0);
  drawMapFx(ctx, td.mapId, v.time);

  const views = td.towers.map((t) => t.atk.map((a) => view(s, a)));
  for (const t of td.towers) drawPedestal(ctx, (t.col + 0.5) * TILE_SIZE, (t.row + 0.5) * TILE_SIZE, t.level, t.atk.length > 1);
  const sel = td.towers.find((t) => t.id === v.selected);
  if (sel) ring(ctx, (sel.col + 0.5) * TILE_SIZE, (sel.row + 0.5) * TILE_SIZE, sel.atk[0]!.p.stats.range, "rgba(255, 230, 140, 0.9)");

  for (const list of views) for (const w of list) {
    drawDevices(ctx, w, snap);
    drawMedicGround(ctx, w, snap);
    drawOrbitField(ctx, w, alpha, snap);
  }
  drawEnemies(ctx, s, alpha, snap);
  td.towers.forEach((t, i) => {
    const first = views[i]![0]!;
    const p = first.player;
    drawBody(ctx, t.character, snap(p.x), snap(p.y), p.r, { faceX: p.faceX, faceY: p.faceY, moving: false, casting: false, step: 0 }, 0, sheetFor(t.character, 1, p.abM));
    for (const w of views[i]!) {
      drawEngineerGear(ctx, w, alpha, snap);
      drawOrbs(ctx, w, alpha, snap);
      drawBrawl(ctx, w, alpha, snap);
      drawGunner(ctx, w, alpha, snap);
      drawPets(ctx, w, alpha, snap);
      drawNinja(ctx, w, alpha, snap);
      drawChrono(ctx, w, snap);
      drawSummons(ctx, w, alpha, snap);
      drawMedicAir(ctx, w, snap);
      drawProjectiles(ctx, w, alpha, snap);
      drawEffects(ctx, w, alpha, snap);
    }
    if (t.stunTicks > 0) drawDizzy(ctx, p.x, p.y - 9, s.tick);
    if (t.hp < t.maxHp) drawTowerHp(ctx, p.x, p.y - 12, t.hp / t.maxHp);
  });
  drawEffects(ctx, s, alpha, snap);
  drawTdFx(ctx, td);
  drawBossBars(ctx, s, alpha, snap);
  if (v.hover) drawHover(ctx, v.hover);
}

/** 타워 받침: 돌 받침 + 레벨 점 (만렙은 금색 테두리) */
function drawPedestal(ctx: CanvasRenderingContext2D, x: number, y: number, level: number, max: boolean): void {
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(x - 7, y + 3, 14, 4);
  ctx.fillStyle = max ? "#d8a83a" : "#4a4458";
  ctx.fillRect(x - 7, y + 1, 14, 5);
  ctx.fillStyle = max ? "#ffe08a" : "#7a7290";
  ctx.fillRect(x - 6, y + 1, 12, 3);
  // 레벨: 5레벨마다 큰 점
  const big = Math.floor(level / 5);
  const small = level % 5;
  let px = x - 6;
  for (let i = 0; i < big; i++, px += 3) {
    ctx.fillStyle = "#ffd84a";
    ctx.fillRect(px, y + 7, 2, 2);
  }
  for (let i = 0; i < small; i++, px += 2) {
    ctx.fillStyle = "#f4f0ff";
    ctx.fillRect(px, y + 7, 1, 1);
  }
}

function ring(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string): void {
  ctx.fillStyle = color.replace(/[\d.]+\)$/, "0.08)");
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 2]);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawHover(ctx: CanvasRenderingContext2D, h: NonNullable<TdView["hover"]>): void {
  const x = h.col * TILE_SIZE;
  const y = h.row * TILE_SIZE;
  ctx.fillStyle = h.ok ? "rgba(120, 255, 140, 0.25)" : "rgba(255, 90, 90, 0.3)";
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  ctx.strokeStyle = h.ok ? "#8aff9a" : "#ff6a6a";
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);
  if (!h.ok) return;
  ring(ctx, x + TILE_SIZE / 2, y + TILE_SIZE / 2, h.range, "rgba(140, 255, 160, 0.8)");
  ctx.globalAlpha = 0.7;
  drawBody(ctx, h.character, x + TILE_SIZE / 2, y + TILE_SIZE / 2, 5, { faceX: 0, faceY: 1, moving: false, casting: false, step: 0 }, 0);
  ctx.globalAlpha = 1;
}

/** 깎인 타워 머리 위 체력 줄 (반 아래면 노랑, 1/4 아래면 빨강) */
function drawTowerHp(ctx: CanvasRenderingContext2D, x: number, y: number, f: number): void {
  ctx.fillStyle = "#000";
  ctx.fillRect(Math.round(x) - 7, Math.round(y) - 1, 14, 3);
  ctx.fillStyle = f < 0.25 ? "#ff4a4a" : f < 0.5 ? "#ffd04a" : "#7aff8a";
  ctx.fillRect(Math.round(x) - 6, Math.round(y), Math.max(1, Math.round(12 * f)), 1);
}

/** 기절한 타워 머리 위 도는 별 */
function drawDizzy(ctx: CanvasRenderingContext2D, x: number, y: number, tick: number): void {
  for (let i = 0; i < 3; i++) {
    const a = tick / 8 + (i * Math.PI * 2) / 3;
    ctx.fillStyle = "#ffe060";
    ctx.fillRect(Math.round(x + Math.cos(a) * 5), Math.round(y + Math.sin(a) * 2), 1, 1);
  }
}

/** 보스마다 머리 위 체력 줄 (여러 마리가 같이 오므로 위쪽 큰 막대 대신) */
function drawBossBars(ctx: CanvasRenderingContext2D, s: RunState, alpha: number, snap: Snap): void {
  for (const e of s.enemies) {
    if (!ENEMIES[e.kind].boss) continue;
    const x = snap(lerp(e.prevX, e.x, alpha));
    const y = snap(lerp(e.prevY, e.y, alpha));
    const w = Math.max(18, e.r * 2 + 4);
    const top = Math.max(1, y - e.r - 6);
    ctx.fillStyle = "#000";
    ctx.fillRect(x - w / 2 - 1, top - 1, w + 2, 4);
    ctx.fillStyle = e.immune ? "#9aa0b0" : "#e04a5a";
    ctx.fillRect(x - w / 2, top, Math.max(1, (w * Math.max(0, e.hp)) / e.maxHp), 2);
    if ((e.shield ?? 0) > 0) {
      ctx.fillStyle = "#8ac0ff";
      ctx.fillRect(x - w / 2, top + 2, Math.min(w, (e.shield ?? 0) * 3), 1);
    }
  }
}

export { MAP_W, MAP_H };
