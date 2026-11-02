// 광야의 새벽 그리기: 나무 상자 · 경험치 보석 · 바닥 아이템(고기·자석·폭탄·돈·황금 상자) · 두 번째~ 무기(그림자 공격자)의 탄·효과·장치 · 각성 기운
import { bladeSpots, evoSkill, type EnemyState, type PlayerState, type RunState, type SwarmDrop, type TdAttacker } from "@pixel-rogue/shared";
import { drawDevices, drawEngineerGear } from "./beams";
import { drawBrawl } from "./brawl";
import { drawChrono } from "./chrono";
import { drawGunner } from "./guns";
import { drawMedicAir, drawMedicGround } from "./medic";
import { drawNinja } from "./ninja";
import { drawOrbitField, drawOrbs } from "./orbs";
import type { Snap } from "./palette";
import { drawPets } from "./pets";
import { drawEffects, drawProjectiles } from "./shots";
import { drawSummons } from "./summon";
import { drawSwarmEvent } from "./swarmMap";

type Ctx = CanvasRenderingContext2D;

/** 나무 상자 (갈색 + 띠) */
export function drawCrate(ctx: Ctx, x: number, y: number, e: EnemyState): void {
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.fillRect(x - 5, y + 3, 10, 2);
  ctx.fillStyle = e.hitFlash > 0 ? "#fff" : "#8a5a2a";
  ctx.fillRect(x - 5, y - 4.5, 10, 9);
  ctx.fillStyle = "#c08a4a";
  ctx.fillRect(x - 5, y - 4.5, 10, 2);
  ctx.fillStyle = "#5a3a1a";
  ctx.fillRect(x - 1, y - 4.5, 2, 9);
  ctx.fillRect(x - 5, y, 10, 1);
}

/** 도트 한 장: 글자 하나가 한 칸 (. 은 빈칸) */
function dots(ctx: Ctx, x: number, y: number, rows: readonly string[], colors: Record<string, string>): void {
  const h = rows.length;
  const w = rows[0]!.length;
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      const col = colors[rows[r]![c]!];
      if (!col) continue;
      ctx.fillStyle = col;
      ctx.fillRect(x - w / 2 + c, y - h / 2 + r, 1, 1);
    }
  }
}

/** 바닥 아이템 생김새: 회복약(빨간 병) · 자석(빨강·파랑 말굽) · 폭탄(검은 공 + 불꽃 심지) · 돈(금화) · 황금 상자 */
const DROP_ART: Record<SwarmDrop["kind"], { rows: readonly string[]; colors: Record<string, string> }> = {
  heal: {
    rows: ["..ww..", "..cc..", ".rrrr.", "rrhrrr", "rrrrrr", "rrrrrr", ".rrrr."],
    colors: { w: "#e8e0d0", c: "#8a5a2a", r: "#e0303a", h: "#ffc0c0" },
  },
  magnet: {
    rows: ["rr..bb", "rr..bb", "rr..bb", "rr..bb", "rrggbb", ".rggb."],
    colors: { r: "#e03a3a", b: "#3a6aff", g: "#c8c8d0" },
  },
  bomb: {
    rows: ["....s.", "...f..", ".kkf..", "kkkkk.", "khkkk.", "kkkkk.", ".kkk.."],
    colors: { k: "#26242c", h: "#6a6a78", f: "#c8a060", s: "#ffb03a" },
  },
  gold: {
    rows: [".yyyy.", "yyllyy", "yylyyy", "yylyyy", "yyllyy", ".yyyy."],
    colors: { y: "#f0b828", l: "#fff0a0" },
  },
  chest: {
    rows: [".gggggggg.", "gyyyyyyyyg", "gggggggggg", "gyyykkyyyg", "gyyykkyyyg", "gggggggggg"],
    colors: { g: "#8a5a00", y: "#e8b830", k: "#fff0a0" },
  },
};

/** 모드 맨 위 그리기 (GameScreen overlay): 보석·바닥 아이템·그림자 공격자·각성 기운 */
export function drawSwarm(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const sw = s.swarm;
  if (!sw) return;
  for (const g of sw.gems) {
    const big = g.v >= 10;
    ctx.fillStyle = big ? "#ff6ad8" : g.v >= 3 ? "#5ad8ff" : "#6ae88a";
    const x = snap(g.x);
    const y = snap(g.y);
    ctx.fillRect(x - 1, y - (big ? 3 : 2), 2, big ? 6 : 4);
    ctx.fillRect(x - (big ? 2 : 1.5), y - 1, big ? 4 : 3, 2);
  }
  for (const d of sw.drops) {
    const art = DROP_ART[d.kind];
    const x = snap(d.x);
    const y = snap(d.y) - ((s.tick >> 4) % 2);
    // 반짝이는 테두리 빛 (어떤 아이템인지 멀리서도 보이게)
    ctx.fillStyle = d.kind === "chest" ? "rgba(255, 216, 90, 0.35)" : "rgba(255, 255, 255, 0.18)";
    ctx.fillRect(x - 5, y - 5, 10, 10);
    dots(ctx, x, y, art.rows, art.colors);
    if (d.kind === "bomb" && (s.tick >> 2) % 2) {
      ctx.fillStyle = "#fff4a0";
      ctx.fillRect(x + 1, y - 4, 1, 1);
    }
  }
  for (const w of sw.weapons) if (w.ghost) drawGhost(ctx, s, w.ghost, alpha, snap);
  drawEvoAura(ctx, s, snap);
  drawSwarmEvent(ctx, s, snap);
}

const ghostView = (s: RunState, a: TdAttacker): RunState => ({ ...s, player: a.p, projectiles: a.shots, devices: a.devices, effects: a.effects, pendingBlasts: a.blasts, autoTargetId: 0 });

function drawGhost(ctx: Ctx, s: RunState, a: TdAttacker, alpha: number, snap: Snap): void {
  const v = ghostView(s, a);
  drawDevices(ctx, v, snap);
  drawMedicGround(ctx, v, snap);
  drawOrbitField(ctx, v, alpha, snap);
  drawEngineerGear(ctx, v, alpha, snap);
  drawOrbs(ctx, v, alpha, snap);
  drawBrawl(ctx, v, alpha, snap);
  drawGunner(ctx, v, alpha, snap);
  drawPets(ctx, v, alpha, snap);
  drawNinja(ctx, v, alpha, snap);
  drawChrono(ctx, v, snap);
  drawSummons(ctx, v, alpha, snap);
  drawMedicAir(ctx, v, snap);
  if (a.p.svEvo) glowShots(ctx, v, snap);
  drawProjectiles(ctx, v, alpha, snap);
  drawEffects(ctx, v, alpha, snap);
}

/** 각성한 무기의 탄 뒤에 금빛 기운 */
function glowShots(ctx: Ctx, s: RunState, snap: Snap): void {
  ctx.fillStyle = "rgba(255, 216, 90, 0.35)";
  for (const pr of s.projectiles) {
    if (!pr.fromPlayer) continue;
    ctx.beginPath();
    ctx.arc(snap(pr.x), snap(pr.y), pr.r + 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** 각성한 무기 수만큼 몸 둘레를 도는 금빛 별 (본인 무기가 각성이면 본인 탄도 빛남) */
function drawEvoAura(ctx: Ctx, s: RunState, snap: Snap): void {
  const sw = s.swarm!;
  const p = s.player;
  if (p.svEvo) glowShots(ctx, s, snap);
  for (const f of [p, ...sw.weapons.map((w) => w.ghost?.p)]) if (f?.svEvo && evoSkill(f.weaponId, f.characterId) === "blades") drawBlades(ctx, s.tick, p, snap);
  const n = (p.svEvo ? 1 : 0) + sw.weapons.filter((w) => w.ghost?.p.svEvo).length;
  for (let i = 0; i < n; i++) {
    const a = s.tick * 0.06 + (i * Math.PI * 2) / n;
    ctx.fillStyle = i % 2 ? "#fff4c0" : "#ffd84a";
    ctx.fillRect(snap(p.x + Math.cos(a) * 11) - 1, snap(p.y + Math.sin(a) * 6) - 1, 2, 2);
  }
}

/** 각성 기술 '회전 칼날': 몸 둘레를 도는 칼날 셋 (sim/swarmEvo.bladeSpots와 같은 자리) */
export function drawBlades(ctx: Ctx, tick: number, p: PlayerState, snap: Snap): void {
  for (const b of bladeSpots(tick, p.x, p.y)) {
    const a = tick * 0.4;
    const dx = Math.cos(a) * 4;
    const dy = Math.sin(a) * 4;
    ctx.strokeStyle = "#e8f0ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(snap(b.x - dx), snap(b.y - dy));
    ctx.lineTo(snap(b.x + dx), snap(b.y + dy));
    ctx.stroke();
    ctx.fillStyle = "#ffd84a";
    ctx.fillRect(snap(b.x) - 1, snap(b.y) - 1, 2, 2);
  }
}
