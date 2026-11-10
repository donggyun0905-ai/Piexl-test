// 켈베로스 몸 그리기 (sim/bossCerberus·bossCerbTrio, 그림 scripts/art/cerberus): 사슬 넷 · 붉은 쉴드 막(깎일수록 금) · 머리 눈빛 · 브레스 예고 빛 깜박임
// 세 사람(권귀·염희·검귀): 그림 칸 = cbPose · 바닥이 무너지는 동안 떠 있음 · 검귀 점프(그림자) · 체력 막대(페이즈 1 흰 쉴드 / 페이즈 2 셋)
import { BOSS_CERB_TRIO_RULES as T, CERB_HEADS, CERB_TRIO, ENEMIES, shieldLeft, type EnemyState, type RunState } from "@pixel-rogue/shared";
import { drawEnemySprite } from "../enemySprites";
import { additive, glow } from "./pwFxBits";
import { C } from "./palette";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
const TRIO = CERB_TRIO as readonly string[];

/** 사슬 한 줄 (고리 모양) · cut이면 끊겨 늘어진 짧은 토막 */
function chain(ctx: Ctx, ax: number, ay: number, bx: number, by: number, cut: boolean): void {
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy);
  const n = Math.floor((cut ? len * 0.3 : len) / 5);
  for (let i = 0; i < n; i++) {
    const k = (i * 5) / len;
    const x = ax + dx * k;
    const y = ay + dy * k + (cut ? i * i * 0.08 : 0);
    ctx.strokeStyle = i % 2 === 0 ? "#6a5a50" : "#9a8a78";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(x, y, i % 2 === 0 ? 3 : 1.5, i % 2 === 0 ? 1.5 : 3, Math.atan2(dy, dx), 0, TAU);
    ctx.stroke();
  }
}

/** 몸 대신 그림 (그렸으면 true) */
export function drawCerbActor(ctx: Ctx, s: RunState, e: EnemyState, x: number, y: number): boolean {
  if (e.kind === "cerberus") {
    if (e.cbPhase === 2) return true;
    const tint: readonly [string, number] | undefined = e.hitFlash > 0 || (e.cbSplit !== undefined && Math.floor(s.tick / 4) % 2 === 0) ? ["#ffffff", 0.7] : undefined;
    // 사슬 넷 (갈라지는 동안 하나씩 끊김)
    const anchors = [[x - 150, y - 30], [x + 150, y - 30], [x - 90, y + 70], [x + 90, y + 70]] as const;
    const cut = e.cbCut ?? 0;
    anchors.forEach(([ax, ay], i) => chain(ctx, x + (i % 2 === 0 ? -18 : 18), y + 4, ax, ay, i < cut));
    // 붉은 쉴드 막 (남은 쉴드만큼 진하게, 70·40·10% 아래마다 금 하나)
    const left = shieldLeft(e);
    if (left > 0 && e.cbSplit === undefined) {
      const wob = 1 + 0.03 * Math.sin(s.tick * 0.1);
      additive(ctx, () => glow(ctx, x, y - 10, 58 * wob, "#ff2a1a", 0.25 + 0.35 * left));
      ctx.strokeStyle = `rgba(255, 90, 70, ${0.4 + 0.4 * left})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(x, y - 10, 52 * wob, 40 * wob, 0, 0, TAU);
      ctx.stroke();
      const cracks = [0.7, 0.4, 0.1].filter((v) => left < v).length;
      ctx.strokeStyle = "rgba(255, 240, 230, 0.8)";
      for (let i = 0; i < cracks; i++) {
        const a = -1.2 + i * 1.3;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * 52, y - 10 + Math.sin(a) * 40);
        ctx.lineTo(x + Math.cos(a + 0.15) * 38, y - 10 + Math.sin(a + 0.15) * 30);
        ctx.lineTo(x + Math.cos(a - 0.1) * 28, y - 10 + Math.sin(a - 0.1) * 22);
        ctx.stroke();
      }
    }
    drawEnemySprite(ctx, "cerberus", x, y - 22, e.cbPose ?? 0, false, tint);
    // 머리 눈빛: 공격하는 머리 (셋 다면 모두)
    const head = e.cbHead ?? -1;
    CERB_HEADS.forEach(([ox, oy], i) => {
      if (head !== i && head !== 3) return;
      additive(ctx, () => glow(ctx, x + ox, y + oy - 14, 10, "#ff3020", 0.8, 0.6));
    });
    // 브레스 예고: 가운데 머리 위 빛이 세 번 깜박임
    if (e.cbBreathWarn !== undefined && s.tick >= e.cbBreathWarn && s.tick < (e.cbBreath ?? 0)) {
      const t = s.tick - e.cbBreathWarn;
      if (t % 40 < 22) additive(ctx, () => glow(ctx, x + CERB_HEADS[1]![0], y - 46, 22, "#c8ff8a", 1, 1));
    }
    return true;
  }
  if (!TRIO.includes(e.kind)) return false;
  const tint: readonly [string, number] | undefined = e.hitFlash > 0 ? ["#ffffff", 0.8] : undefined;
  const flip = e.dirX < 0;
  // 검귀 점프: 그림자가 따라오고 몸은 하늘에서 내려옴
  if (e.kind === "cerbblade" && e.phase === "blink") {
    const t = s.tick - (e.aux ?? s.tick);
    const up = t < T.JUMP_FOLLOW ? 80 : 80 * Math.max(0, 1 - (t - T.JUMP_FOLLOW) / T.JUMP_LAND);
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.ellipse(x, y + 4, 14, 6, 0, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = t < T.JUMP_FOLLOW ? 0.35 : 1;
    drawEnemySprite(ctx, e.kind, x, y - 16 - up, 3, flip, tint);
    ctx.globalAlpha = 1;
    return true;
  }
  // 떠 있음 (무너지는 바닥): 위아래로 흔들리며 그림자
  const bob = e.air ? 8 + 3 * Math.sin(s.tick * 0.08 + e.id) : 0;
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.beginPath();
  ctx.ellipse(x, y + e.r * 0.7, e.r * 1.1, e.r * 0.45, 0, 0, TAU);
  ctx.fill();
  if (e.kind === "cerbflame") additive(ctx, () => glow(ctx, x, y - 10 - bob, 22, "#ff5a1a", 0.4));
  drawEnemySprite(ctx, e.kind, x, y - 16 - bob, e.cbPose ?? 0, flip, tint);
  return true;
}

/** 체력 막대 (그렸으면 true): 페이즈 1 흰 쉴드 · 페이즈 2 세 사람 따로 */
export function drawCerbBar(ctx: Ctx, s: RunState, boss: EnemyState, bx: number, by: number, bw: number, bh: number): boolean {
  if (boss.kind !== "cerberus") return false;
  if (boss.cbPhase !== 2) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(bx - 2, by - 2, bw + 4, bh + 4);
    // 쉴드 아래 잠긴 진짜 체력 (어두운 붉은색)
    ctx.fillStyle = "#4a1010";
    ctx.fillRect(bx, by, bw, bh);
    ctx.fillStyle = "#f4f4f4";
    ctx.fillRect(bx, by, Math.round(bw * Math.max(0, shieldLeft(boss))), bh);
    return true;
  }
  const mul = boss.maxHp / ENEMIES.cerberus.hp;
  const gap = Math.round(bw * 0.05);
  const w = Math.floor((bw - gap * (TRIO.length - 1)) / TRIO.length);
  CERB_TRIO.forEach((kind, i) => {
    const x = bx + i * (w + gap);
    const b = s.enemies.find((o) => o.kind === kind && o.hp > 0);
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(x - 2, by - 2, w + 4, bh + 4);
    ctx.fillStyle = C.bossCore;
    ctx.fillRect(x, by, Math.round((w * (b?.hp ?? 0)) / (ENEMIES[kind].hp * mul)), bh);
  });
  return true;
}
