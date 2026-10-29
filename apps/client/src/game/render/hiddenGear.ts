// 히든 아이템 둘째 묶음 그림: 등 뒤에 떠 있는 블리자드 랜스 다섯 · 날아가는 얼음 창 · 몸 좌우에 떠 있는 떨어진 신의 날개
// · 운명의/저주받은 주사위(머리 위에서 굴러가다 멈춤) · 화려한 보물 상자 · 저주 · 빙결
import type { EffectState, ProjectileState, RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, alpha, beam, glow, shock, sparks } from "./pwFxBits";

type Ctx = CanvasRenderingContext2D;
const ICE = "#9ad8ff";
const ICE_L = "#e8f8ff";

/** 얼음 창 하나 (끝 x, y · 방향 dx, dy · 길이) */
function lance(ctx: Ctx, x: number, y: number, dx: number, dy: number, len: number, a = 1): void {
  additive(ctx, () => {
    beam(ctx, x - dx * len, y - dy * len, x, y, 2.5, ICE, 0.55 * a);
    beam(ctx, x - dx * len * 0.8, y - dy * len * 0.8, x, y, 1, ICE_L, 0.9 * a);
    glow(ctx, x, y, 4, ICE, 0.7 * a, 1.2);
  });
}

/** 몸 둘레 (플레이어 다음): 블리자드 랜스 · 떨어진 신의 날개 */
export function drawHiddenGear(ctx: Ctx, s: RunState, a: number, snap: Snap): void {
  const p = s.player;
  if (p.hp <= 0) return;
  const x = snap(lerp(p.prevX, p.x, a));
  const y = snap(lerp(p.prevY, p.y, a));
  if (p.passives.includes("fallenWings")) {
    // 몸에 붙지 않고 좌우로 조금 떨어져 떠 있는 커다란 반투명 날개 (천천히 펄럭임)
    const flap = Math.sin(s.tick * 0.06) * 3;
    for (const side of [-1, 1]) {
      const bx = x + side * 9;
      const by = y - 10;
      ctx.save();
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = "#fff6d8";
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.quadraticCurveTo(bx + side * 18, by - 18 - flap, bx + side * 30, by - 10 - flap);
      ctx.quadraticCurveTo(bx + side * 22, by + 2, bx + side * 26, by + 10 + flap * 0.5);
      ctx.quadraticCurveTo(bx + side * 12, by + 6, bx, by + 6);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 0.6;
      ctx.strokeStyle = "#ffe08a";
      ctx.lineWidth = 0.8;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(bx + side * 2, by + 1 + i);
        ctx.lineTo(bx + side * (12 + i * 4), by - 6 + i * 4 - flap * (1 - i / 4));
        ctx.stroke();
      }
      ctx.restore();
    }
    additive(ctx, () => glow(ctx, x, y - 8, 16, "#fff0b0", 0.2));
  }
  if (p.passives.includes("blizzardLance") && s.tick >= (p.lanceOut ?? 0)) {
    // 등 뒤 부채꼴로 떠 있는 얼음 창 다섯 (끝이 위를 봄)
    for (let i = 0; i < 5; i++) {
      const ang = -Math.PI / 2 + (i - 2) * 0.32;
      const bob = Math.sin(s.tick * 0.08 + i) * 1.2;
      const tx = x + Math.cos(ang) * 14;
      const ty = y - 6 + Math.sin(ang) * 14 + bob;
      lance(ctx, tx, ty, Math.cos(ang), Math.sin(ang), 8, 0.85);
    }
  }
}

/** 날아가는 얼음 창. 그렸으면 true */
export function drawLanceShot(ctx: Ctx, pr: ProjectileState, x: number, y: number): boolean {
  if (!pr.lance) return false;
  const sp = Math.hypot(pr.vx, pr.vy) || 1;
  lance(ctx, x, y, pr.vx / sp, pr.vy / sp, 12);
  return true;
}

/** 주사위 한 면 (n 점, cursed = 검붉은 주사위) */
function die(ctx: Ctx, x: number, y: number, n: number, cursed: boolean, size = 12): void {
  const h = size / 2;
  // 입체 주사위: 윗면 · 오른쪽 옆면 (깊이 3) · 앞면 · 테두리
  const [front, top, side, edge] = cursed ? ["#2a1a30", "#4a2a5a", "#140a18", "#8a3aa8"] : ["#f2ecdc", "#fffaf0", "#c8c0a8", "#6a5a48"];
  ctx.fillStyle = top;
  ctx.beginPath();
  ctx.moveTo(x - h, y - h);
  ctx.lineTo(x - h + 3, y - h - 3);
  ctx.lineTo(x + h + 3, y - h - 3);
  ctx.lineTo(x + h, y - h);
  ctx.fill();
  ctx.fillStyle = side;
  ctx.beginPath();
  ctx.moveTo(x + h, y - h);
  ctx.lineTo(x + h + 3, y - h - 3);
  ctx.lineTo(x + h + 3, y + h - 3);
  ctx.lineTo(x + h, y + h);
  ctx.fill();
  ctx.fillStyle = front;
  ctx.fillRect(x - h, y - h, size, size);
  ctx.strokeStyle = edge;
  ctx.lineWidth = 1;
  ctx.strokeRect(x - h + 0.5, y - h + 0.5, size - 1, size - 1);
  if (cursed) {
    // 저주받은 주사위: 위로 솟은 뿔 둘
    ctx.fillStyle = "#c8c0a8";
    ctx.fillRect(x - h + 1, y - h - 5, 2, 3);
    ctx.fillRect(x + h - 1, y - h - 6, 2, 3);
  }
  const q = size / 4;
  const pips: Record<number, [number, number][]> = {
    1: [[0, 0]],
    2: [[-1, -1], [1, 1]],
    3: [[-1, -1], [0, 0], [1, 1]],
    4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
    5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
    6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]],
  };
  ctx.fillStyle = cursed ? "#ff3a5a" : "#e03a3a";
  for (const [dx, dy] of pips[n] ?? []) ctx.fillRect(Math.round(x + dx * q - 1), Math.round(y + dy * q - 1), 2, 2);
}

/** 둘째 묶음 효과. 그렸으면 true */
export function drawHiddenFx2(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  const t = fx.ticks / fx.maxTicks;
  const f = 1 - t;
  const x = snap(fx.x);
  const y = snap(fx.y);
  if (fx.kind === "hdDice") {
    // 처음 60%는 굴러가며 면이 바뀌고, 그 뒤 나온 숫자에서 멈춰 빛남
    const cursed = fx.width === 1;
    const rolling = f < 0.6;
    const face = rolling ? (Math.floor(fx.ticks / 4) % 6) + 1 : fx.size;
    const hop = rolling ? -Math.abs(Math.sin(f * 14)) * 6 : 0;
    if (!rolling) additive(ctx, () => glow(ctx, x, y, 14, cursed ? "#ff3a5a" : "#ffe08a", Math.min(1, t * 2), 1.2));
    die(ctx, x, y + hop, face, cursed, 12);
    return true;
  }
  if (fx.kind === "hdChest") {
    // 화려한 보물 상자: 금빛 상자 · 뚜껑이 열리며 무지개 빛기둥과 별빛
    const open = Math.min(1, f * 3);
    additive(ctx, () => {
      glow(ctx, x, y - 6, 26 + f * 10, "#ffd040", t, 1.6);
      for (let i = 0; i < 6; i++) beam(ctx, x, y - 4, x + (i - 2.5) * 8, y - 40 - f * 20, 2, ["#ff6a6a", "#ffd040", "#6aff8a", "#6ac8ff", "#c86aff", "#ffffff"][i]!, t * open);
      sparks(ctx, x, y - 8, 18, 40, f, "#fff6c0", fx.x);
    });
    // 상자: 나무 몸통 · 금 테두리 띠 셋 · 자물쇠 · 보석, 뚜껑은 위로 열림
    ctx.fillStyle = "#5a3412";
    ctx.fillRect(x - 10, y - 5, 20, 11);
    ctx.fillStyle = "#8a5a22";
    ctx.fillRect(x - 9, y - 4, 18, 9);
    ctx.fillStyle = "#a87030";
    for (let i = 0; i < 3; i++) ctx.fillRect(x - 8, y - 2 + i * 3, 16, 1);
    ctx.fillStyle = "#ffd040";
    ctx.fillRect(x - 10, y - 5, 20, 2);
    ctx.fillRect(x - 10, y - 5, 2, 11);
    ctx.fillRect(x + 8, y - 5, 2, 11);
    ctx.fillRect(x - 2, y - 2, 4, 5);
    ctx.fillStyle = "#6a4a10";
    ctx.fillRect(x - 1, y, 2, 2);
    ctx.fillStyle = "#ff4a8a";
    ctx.fillRect(x - 6, y + 2, 2, 2);
    ctx.fillStyle = "#4ad0ff";
    ctx.fillRect(x + 4, y + 2, 2, 2);
    const ly = y - 5 - 7 * open;
    ctx.fillStyle = "#5a3412";
    ctx.fillRect(x - 10, ly - 4, 20, 5);
    ctx.fillStyle = "#c88a2a";
    ctx.fillRect(x - 9, ly - 3, 18, 3);
    ctx.fillStyle = "#ffd040";
    ctx.fillRect(x - 10, ly - 4, 20, 1);
    ctx.fillRect(x - 2, ly - 3, 4, 3);
    return true;
  }
  if (fx.kind === "hdCurse") {
    additive(ctx, () => {
      glow(ctx, x, y, fx.size * (0.4 + f), "#8a1a4a", t, 0.6);
      shock(ctx, x, y, fx.size * (0.3 + f), "#ff3a5a", t, 5);
    });
    ctx.fillStyle = alpha("#1a0a14", 0.35 * t);
    ctx.beginPath();
    ctx.arc(x, y, fx.size * 0.8, 0, Math.PI * 2);
    ctx.fill();
    return true;
  }
  if (fx.kind === "hdFreeze") {
    // 빙결: 몸 둘레 얼음 결정
    ctx.strokeStyle = alpha(ICE_L, 0.5 + 0.4 * t);
    ctx.fillStyle = alpha(ICE, 0.25 * t + 0.1);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      const r = fx.size * (i % 2 ? 0.7 : 1);
      const px = x + Math.cos(ang) * r;
      const py = y + Math.sin(ang) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    return true;
  }
  return false;
}
