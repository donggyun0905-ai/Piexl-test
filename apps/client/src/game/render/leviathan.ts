// 레비아탄 몸 그리기 (sim/bossLeviathan·bossLevWhale·bossLevKing, 그림 scripts/art/leviathan): 심해룡(물구슬 · 가라앉기) · 심연고래(물 아래 그림자 → 떠오르면 머리만 선명)
// 해왕(떠오름 · 지쳐 무릎) · 유령 선장(반투명) · 체력 막대(용 흰 막대 / 고래 · 해왕)
import { BOSS_LEVIATHAN_RULES as L, BOSS_LEV_WHALE_RULES as W, dragonLeft, ENEMIES, levUlting, whaleUp, type EnemyState, type RunState } from "@pixel-rogue/shared";
import { drawEnemySprite } from "../enemySprites";
import { additive, glow } from "./pwFxBits";
import { C } from "./palette";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;

/** 몸 대신 그림 (그렸으면 true) */
export function drawLevActor(ctx: Ctx, s: RunState, e: EnemyState, x: number, y: number): boolean {
  if (e.lhGhost) {
    // 유령 선장: 푸르게 비치는 반투명
    ctx.save();
    ctx.globalAlpha = 0.5 + 0.15 * Math.sin(s.tick * 0.1 + e.id);
    additive(ctx, () => glow(ctx, x, y - 6, 18, "#6ad8ff", 0.4));
    drawEnemySprite(ctx, "captain", x, y - 8, Math.floor(s.tick / 12) % 2, s.player.x < x, ["#9ae8ff", e.hitFlash > 0 ? 0.9 : 0.45]);
    ctx.restore();
    return true;
  }
  if (e.kind === "levprison") return true; // 물방울 감옥은 사람 위에 (render/leviathanGround)
  const tint: readonly [string, number] | undefined = e.hitFlash > 0 ? ["#ffffff", 0.7] : undefined;
  if (e.kind === "leviathan") {
    if (e.lhForm !== 1) return true;
    // 가라앉는 중: 흐려지며 아래로
    const sink = e.lhShift !== undefined ? Math.min(1, (s.tick - e.lhShift) / L.SHIFT) : 0;
    ctx.save();
    ctx.globalAlpha = 1 - sink * 0.9;
    additive(ctx, () => glow(ctx, x, y - 20, 70, "#1a6aff", 0.3));
    drawEnemySprite(ctx, "leviathan", x, y - 30 + sink * 40, e.lhPose ?? 0, false, tint);
    ctx.restore();
    // 거대 물구슬: 머리 위에서 커짐
    if (e.lhOrb !== undefined) {
      const k = Math.min(1, (s.tick - e.lhOrb) / L.ORB_GROW);
      const r = 8 + 26 * k;
      const oy = y - 92;
      additive(ctx, () => glow(ctx, x, oy, r * 1.8, "#3aa0ff", 0.6, 0.3));
      ctx.fillStyle = "rgba(120, 200, 255, 0.45)";
      ctx.strokeStyle = "rgba(220, 245, 255, 0.9)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, oy, r, 0, TAU);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.fillRect(Math.round(x - r * 0.45), Math.round(oy - r * 0.55), 4, 3);
    }
    return true;
  }
  if (e.kind === "levwhale") return drawWhale(ctx, s, e, x, y, tint);
  if (e.kind !== "levking") return false;
  const ult = levUlting(s, e);
  const tired = (e.lhTired ?? 0) > s.tick;
  const bob = ult ? 10 + 3 * Math.sin(s.tick * 0.08) : tired ? -4 : 0;
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.beginPath();
  ctx.ellipse(x, y + e.r * 0.7, e.r * 1.2, e.r * 0.45, 0, 0, TAU);
  ctx.fill();
  if (ult) additive(ctx, () => glow(ctx, x, y - 20 - bob, 60, "#3a9aff", 0.6, 0.4));
  else additive(ctx, () => glow(ctx, x, y - 14, 22, "#2a7aff", 0.35));
  ctx.save();
  if (tired) ctx.globalAlpha = 0.8;
  drawEnemySprite(ctx, "levking", x, y - 20 - bob, e.lhPose ?? 0, e.dirX < 0, tint);
  ctx.restore();
  return true;
}

/** 심연고래: 잠수 중엔 바닥 아래 흐린 그림자 · 떠오르면 머리는 선명하고 아래는 물에 잠긴 그림자 */
function drawWhale(ctx: Ctx, s: RunState, e: EnemyState, x: number, y: number, tint: readonly [string, number] | undefined): boolean {
  const flip = (e.dirX ?? 0) < 0;
  const t = s.tick - (e.lhAt ?? s.tick);
  // 바닥 아래로 비치는 큰 그림자 (늘)
  ctx.fillStyle = "rgba(2, 16, 40, 0.45)";
  ctx.beginPath();
  ctx.ellipse(x, y + 8, 46, 18, 0, 0, TAU);
  ctx.fill();
  if (!whaleUp(e)) {
    // 물 아래: 어둡고 흐린 고래 (잠기는 중엔 점점 흐려짐)
    const fade = e.lhUp === 3 ? 1 - Math.min(1, t / W.DIVE) : 1;
    ctx.save();
    ctx.globalAlpha = 0.18 + 0.45 * (e.lhUp === 3 ? fade : 0);
    drawEnemySprite(ctx, "levwhale", x, y - 6, e.lhUp === 3 ? 3 : 0, flip, ["#021a3a", 0.75]);
    ctx.restore();
    return true;
  }
  // 떠오르는 중: 물보라 고리가 커지고 몸이 차오름
  const rise = e.lhUp === 1 ? Math.min(1, t / W.RISE) : 1;
  additive(ctx, () => glow(ctx, x, y - 10, 40 + 20 * rise, "#4ab0ff", 0.4 * rise));
  ctx.save();
  ctx.globalAlpha = 0.35 + 0.65 * rise;
  drawEnemySprite(ctx, "levwhale", x, y - 20 - 10 * rise, e.lhPose ?? 1, flip, tint);
  ctx.restore();
  // 수면 아래 몸: 아래쪽을 물빛으로 덮어 잠긴 느낌
  const g = ctx.createLinearGradient(0, y - 10, 0, y + 30);
  g.addColorStop(0, "rgba(20, 90, 170, 0)");
  g.addColorStop(1, "rgba(10, 50, 110, 0.85)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(x, y + 10, 52, 22, 0, 0, TAU);
  ctx.fill();
  // 물보라 고리
  ctx.strokeStyle = `rgba(220, 245, 255, ${0.8 - 0.3 * Math.sin(s.tick * 0.2)})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(x, y + 2, 40 + 4 * Math.sin(s.tick * 0.15), 12, 0, 0, TAU);
  ctx.stroke();
  return true;
}

/** 막대 하나 (바탕 · 채움) */
function bar(ctx: Ctx, bx: number, by: number, bw: number, bh: number, k: number, fill: string, back = "#0a1a30"): void {
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(bx - 2, by - 2, bw + 4, bh + 4);
  ctx.fillStyle = back;
  ctx.fillRect(bx, by, bw, bh);
  ctx.fillStyle = fill;
  ctx.fillRect(bx, by, Math.round(bw * Math.max(0, Math.min(1, k))), bh);
}

/** 체력 막대 (그렸으면 true): 페이즈 1 용 흰 막대 · 2 고래 (잠수 중엔 흐림) · 3 해왕 */
export function drawLevBar(ctx: Ctx, s: RunState, boss: EnemyState, bx: number, by: number, bw: number, bh: number): boolean {
  if (boss.kind !== "leviathan") return false;
  const mul = boss.maxHp / ENEMIES.leviathan.hp;
  if (boss.lhForm === 1 || boss.lhForm === undefined) {
    bar(ctx, bx, by, bw, bh, dragonLeft(boss), "#f4f8ff");
    return true;
  }
  const whale = s.enemies.find((o) => o.kind === "levwhale" && o.hp > 0);
  const king = s.enemies.find((o) => o.kind === "levking" && o.hp > 0);
  if (boss.lhForm === 2) {
    const k = (whale?.hp ?? 0) / (ENEMIES.levwhale.hp * mul);
    bar(ctx, bx, by, bw, bh, k, whale?.immune ? "#2a5a90" : "#4ab0ff");
    // 잠수 중: 물결 무늬
    if (whale?.immune) {
      ctx.fillStyle = "rgba(200, 240, 255, 0.5)";
      for (let i = (s.tick >> 2) % 8; i < bw * k; i += 8) ctx.fillRect(bx + i, by + (i % 16 < 8 ? 0 : bh - 1), 4, 1);
    }
    return true;
  }
  bar(ctx, bx, by, bw, bh, (king?.hp ?? 0) / (ENEMIES.levking.hp * mul), C.bossCore);
  return true;
}
