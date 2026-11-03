// 수집가 그리기 (sim/collector): 등 뒤 위 공중에 줄지어 뜬 수집 무기(사용자가 준 무기 그림 sprites/collector_arms) · 방에 박힌 무기(빛나는 고리)
// · 콤보 기술 이펙트(무기 색: 베기 초승달·내달림 잔상·폭발 충격파·구체·화살·빛줄기·별·회전) · 날아가 박히는/돌아오는 무기
import { armsOnBack, CL_ARM_IDS, CL_ARMS, type ClArmId, type EffectState, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, beam, crescent, easeOut, glow, rune, shock, sparks } from "./pwFxBits";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
const CELL = 48;
const BASE = "#bfe0ff";

const sheet = new Image();
sheet.src = `${import.meta.env.BASE_URL}sprites/collector_arms.png`;

const colorOf = (id?: string) => (id && id in CL_ARMS ? CL_ARMS[id as ClArmId].color : BASE);

/** 수집 무기 그림 하나 (가운데 x,y · 크기 size · 기울기 rot) */
function armSprite(ctx: Ctx, id: string, x: number, y: number, size: number, rot = 0): void {
  const i = CL_ARM_IDS.indexOf(id as ClArmId);
  if (i < 0 || !sheet.complete || sheet.naturalWidth === 0) return;
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.translate(x, y);
  if (rot) ctx.rotate(rot);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(sheet, i * CELL, 0, CELL, CELL, -size / 2, -size / 2, size, size);
  ctx.restore();
}

/** 등 뒤 위 공중: 얻은 차례로 부채처럼 늘어선 수집 무기 (10개마다 한 줄 위로) · 다음 콤보 무기는 살짝 빛남 */
export function drawCollectorBack(ctx: Ctx, s: RunState, alphaT: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "collector" || p.hp <= 0) return;
  const list = armsOnBack(p);
  const px = snap(lerp(p.prevX, p.x, alphaT));
  const py = snap(lerp(p.prevY, p.y, alphaT));
  const next = list[((p.clStep ?? 0) % (list.length + 1)) - 1];
  list.forEach((id, i) => {
    const row = Math.floor(i / 10);
    const inRow = Math.min(10, list.length - row * 10);
    const k = i % 10;
    const off = (k - (inRow - 1) / 2) * 7;
    const x = px + off - p.faceX * 4;
    const y = py - 31 - row * 10 - Math.abs(off) * 0.12 + Math.sin(s.tick / 14 + i) * 1.2;
    const tilt = (off / 40) * 0.6;
    if (id === next) additive(ctx, () => glow(ctx, x, y, 7, colorOf(id), 0.6));
    armSprite(ctx, id, x, y, 14, tilt);
  });
}

/** 방에 박힌 수집 무기: 비스듬히 꽂혀 무기 색으로 맥박치는 빛 · 바닥 고리 (닿으면 발동) */
export function drawCollectorStuck(ctx: Ctx, s: RunState, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "collector") return;
  const room = s.floor * 1000 + s.roomId;
  for (const w of p.clStuck ?? []) {
    if (w.room !== room) continue;
    const x = snap(w.x);
    const y = snap(w.y);
    const c = colorOf(w.id);
    const pulse = 0.5 + 0.5 * Math.sin(s.tick / 8 + w.at);
    additive(ctx, () => {
      glow(ctx, x, y, 12 + pulse * 3, c, 0.35 + 0.25 * pulse);
      rune(ctx, x, y + 2, 9, c, 0.5 + 0.3 * pulse, s.tick / 30);
    });
    armSprite(ctx, w.id, x, y - 7, 18, 0.5);
  }
}

/** 수집가 이펙트면 그리고 true */
export function drawCollectorFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (fx.kind !== "clArm" && fx.kind !== "clFly") return false;
  const t = fx.ticks / fx.maxTicks;
  const f = easeOut(t);
  const x = snap(fx.x);
  const y = snap(fx.y);
  const c = colorOf(fx.from);
  if (fx.kind === "clFly") {
    // 무기가 포물선을 그리며 날아감 · 뒤에 빛 꼬리
    const tx = snap(fx.toX ?? fx.x);
    const ty = snap(fx.toY ?? fx.y);
    const cx = lerp(x, tx, f);
    const cy = lerp(y, ty, f) - Math.sin(f * Math.PI) * 26;
    additive(ctx, () => {
      beam(ctx, lerp(x, tx, Math.max(0, f - 0.25)), lerp(y, ty, Math.max(0, f - 0.25)) - Math.sin(Math.max(0, f - 0.25) * Math.PI) * 26, cx, cy, 2, c, 0.6 * (1 - t));
      glow(ctx, cx, cy, 8, c, 0.7);
      if (t > 0.85) shock(ctx, tx, ty, 6 + 16 * (t - 0.85) / 0.15, c, 0.8, 4);
    });
    if (fx.from) armSprite(ctx, fx.from, cx, cy, 16, f * TAU * 1.5);
    return true;
  }
  const arm = fx.from && fx.from in CL_ARMS ? CL_ARMS[fx.from as ClArmId] : undefined;
  const a = Math.atan2(fx.dirY, fx.dirX);
  const r = fx.size;
  const fade = 1 - t;
  const seed = Math.round(fx.x * 7 + fx.y * 13);
  additive(ctx, () => {
    switch (arm?.style ?? "slash") {
      case "slash": {
        // 겹친 초승달 두 겹 (잔상) + 흰 칼끝 + 불똥
        const arc = arm ? Math.acos(Math.max(-0.95, Math.min(0.95, arm.arc ?? 0))) : 1.3;
        crescent(ctx, x, y, r * (0.75 + 0.3 * f), a - 0.25 + 0.5 * f, arc, r * 0.45, c, 0.9 * fade);
        crescent(ctx, x, y, r * (0.55 + 0.3 * f), a + 0.2 - 0.4 * f, arc * 0.8, r * 0.3, "#ffffff", 0.6 * fade);
        sparks(ctx, x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7, 8, r * 0.7, t, c, seed);
        break;
      }
      case "dash": {
        // 지나간 길: 굵은 빛줄기 + 잔상 베기 셋
        const tx = snap(fx.toX ?? x);
        const ty = snap(fx.toY ?? y);
        beam(ctx, x, y, tx, ty, 6 * fade + 1, c, fade);
        for (let k = 1; k <= 3; k++) crescent(ctx, lerp(x, tx, k / 4), lerp(y, ty, k / 4), 14, a + (k % 2 ? 1.2 : -1.2), 1, 6, c, 0.8 * fade);
        sparks(ctx, tx, ty, 10, 24, t, c, seed);
        break;
      }
      case "nova":
      case "spin": {
        // 충격파 두 겹 + 회전 칼날 (spin) + 가운데 빛
        shock(ctx, x, y, r * f, c, 0.9 * fade, 8);
        shock(ctx, x, y, r * 0.6 * f, "#ffffff", 0.5 * fade, 4);
        glow(ctx, x, y, r * 0.5, c, 0.5 * fade, 1);
        if (arm?.style === "spin") for (let k = 0; k < 3; k++) crescent(ctx, x, y, r * 0.85, f * TAU * 2 + (k * TAU) / 3, 0.6, 7, c, 0.9 * fade);
        sparks(ctx, x, y, 12, r, t, c, seed);
        break;
      }
      case "orb": {
        // 노린 자리에 구체가 부풀었다 터짐 + 바닥 문양
        rune(ctx, x, y, r, c, fade, t * 3);
        glow(ctx, x, y, r * (0.4 + 0.6 * Math.sin(Math.min(1, t * 1.6) * Math.PI)), c, 0.9 * fade, 1.2);
        shock(ctx, x, y, r * f * 1.1, c, 0.8 * fade, 6);
        break;
      }
      case "rain": {
        // 위에서 별빛이 내리꽂힘 + 터짐
        const drop = Math.min(1, t * 2.5);
        beam(ctx, x, y - 90 * (1 - drop), x, y - 90 * (1 - drop) - 30, 3, c, 1 - drop * 0.3);
        if (drop >= 1) {
          shock(ctx, x, y, r * 1.6 * f, c, fade, 6);
          sparks(ctx, x, y, 8, r * 1.5, t, c, seed);
        }
        break;
      }
      default: {
        // 화살·석궁·총·빛줄기·창: 앞으로 뻗는 빛 (화살은 부채꼴 여러 줄)
        const n = arm?.style === "arrows" ? (arm.n ?? 3) : 1;
        const w = (arm?.width ?? 4) * (arm?.style === "beam" ? 1.2 : 0.7);
        for (let i = 0; i < n; i++) {
          const ang = a + (i - (n - 1) / 2) * 0.16;
          const len = r * Math.min(1, t * 3);
          const ex = x + Math.cos(ang) * len;
          const ey = y + Math.sin(ang) * len;
          beam(ctx, x, y, ex, ey, w * fade + 1, c, fade);
          glow(ctx, ex, ey, 6, c, fade, 1);
        }
        glow(ctx, x, y, 10, c, 0.8 * fade, 1);
      }
    }
  });
  ctx.globalAlpha = 1;
  return true;
}
