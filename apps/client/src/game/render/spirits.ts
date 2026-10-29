// 렌·정령사 그리기: 렌 둘레를 도는 수호 토목 · 떨어지는 거대 토목 · 정령사 곁의 작은 정령 · 어깨 뒤에 크게 떠 있는 대정령(그림 sprites/spirit-*.png) · 정령 공격 줄 · 대정령 기술
import { greatSpot, guardSpots, SPIRIT_TINT, spiritSpot, WEAPONS, type EffectState, type GreatSpirit, type RunState, type WeaponDef } from "@pixel-rogue/shared";
import { additive, beam, glow, shock } from "./pwFxBits";
import { lerp, type Snap } from "./palette";
import { drawGreatFx } from "./greatFx";
import { drawRenEarth, drawRenEarthFx } from "./renEarth";

type Ctx = CanvasRenderingContext2D;

/** 대정령 순번 → 이름 (sim/spiritGreat.GREAT_INDEX 순서) · 빛 색 */
export const GREATS: GreatSpirit[] = ["titanCore", "ironHide", "chronoSpire", "nightWeaver", "umbra", "venomHide", "idra", "briarHeart", "sylvanGuard", "abyssRuin"];
export const GREAT_GLOW: Record<GreatSpirit, string> = {
  titanCore: "#ff9a3a", ironHide: "#c8d0e0", chronoSpire: "#6ad8ff", nightWeaver: "#c8a8ff", umbra: "#ff3a6a",
  venomHide: "#9aff5a", idra: "#ffd040", briarHeart: "#ff6a8a", sylvanGuard: "#7ae05a", abyssRuin: "#a86aff",
};

const images = new Map<string, HTMLImageElement>();
function spiritImage(g: GreatSpirit): HTMLImageElement | undefined {
  const name = `spirit-${g}`;
  let img = images.get(name);
  if (!img) {
    img = new Image();
    img.src = `${import.meta.env.BASE_URL}sprites/${name}.png`;
    images.set(name, img);
  }
  return img.complete && img.naturalWidth > 0 ? img : undefined;
}

/** 흙과 나무가 엉킨 작은 덩어리 */
export function clod(ctx: Ctx, x: number, y: number, r: number, seed: number): void {
  ctx.fillStyle = "#7a7268";
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#a8a090";
  ctx.fillRect(Math.round(x - r * 0.6), Math.round(y - r * 0.7), Math.ceil(r), Math.ceil(r * 0.7));
  ctx.fillStyle = "#8a6a3a";
  ctx.fillRect(Math.round(x - r), Math.round(y + (seed % 2 ? -1 : 0)), Math.ceil(r * 2), 1);
  ctx.fillStyle = "#5ac84a";
  ctx.fillRect(Math.round(x + (seed % 3) - 1), Math.round(y - r), 1, 1);
}

/** 렌 · 정령사 (플레이어 다음에) */
export function drawSpiritKin(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (p.hp <= 0) return;
  const at = { ...p, x: lerp(p.prevX, p.x, alpha), y: lerp(p.prevY, p.y, alpha) };
  if (p.characterId === "ren") {
    guardSpots(at, s.tick).forEach((g, i) => clod(ctx, snap(g.x), snap(g.y), 2.5, i));
    drawRenEarth(ctx, s, at, snap);
    return;
  }
  if (p.characterId !== "spiritist") return;
  // 작은 정령: 빛나는 구슬 + 꼬리
  const list = p.spirits ?? [];
  list.forEach((sp, i) => {
    const o = spiritSpot(at, i, list.length, s.tick);
    const c = SPIRIT_TINT[sp.kind];
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(o.x, o.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillRect(Math.round(o.x) - 1, Math.round(o.y) - 1, 3, 3);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(Math.round(o.x) - 1, Math.round(o.y) - 1, 1, 1);
  });
}

/** 정령사의 대정령 (플레이어보다 먼저 = 몸 뒤에) */
export function drawGreatSpirit(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (p.hp <= 0) return;
  const at = { ...p, x: lerp(p.prevX, p.x, alpha), y: lerp(p.prevY, p.y, alpha) };
  // 큐피트의 정령 (히든 아이템): 반대쪽 어깨 위
  if (p.cupid) drawGreat(ctx, s, { ...at, faceX: -at.faceX }, p.cupid, snap);
  if (p.characterId !== "spiritist") return;
  const great = (WEAPONS[p.weaponId] as WeaponDef).great;
  if (great) drawGreat(ctx, s, at, great, snap);
}

/** 대정령 하나: 어깨 뒤 위에서 천천히 떠오르내림, 발밑 빛 */
function drawGreat(ctx: Ctx, s: RunState, at: { x: number; y: number; faceX: number }, great: GreatSpirit, snap: Snap): void {
  const g = greatSpot(at);
  const bob = Math.sin(s.tick * 0.06) * 2;
  const glow = ctx.createRadialGradient(g.x, g.y + 6, 2, g.x, g.y + 6, 22);
  glow.addColorStop(0, `${GREAT_GLOW[great]}66`);
  glow.addColorStop(1, `${GREAT_GLOW[great]}00`);
  ctx.fillStyle = glow;
  ctx.fillRect(g.x - 24, g.y - 18, 48, 48);
  const img = spiritImage(great);
  if (!img) return;
  const frame = Math.floor(s.tick / 20) % 2;
  ctx.save();
  ctx.globalAlpha = 0.92;
  ctx.translate(snap(g.x), snap(g.y + bob));
  if (at.faceX < 0) ctx.scale(-1, 1);
  ctx.drawImage(img, frame * 48, 0, 48, 48, -24, -32, 48, 48);
  ctx.restore();
}

/** 효과: 거대 토목 · 정령 공격 줄 · 대정령 기술 */
export function drawSpiritFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (drawRenEarthFx(ctx, fx, snap)) return true;
  const t = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  if (fx.kind === "renSlam") {
    // 위에서 떨어져 내려찍는 흙·나무 덩어리, 땅에 닿으면 갈라지는 고리 (차례마다 빛 색)
    const r = fx.size;
    const tint = ["#c8a060", "#5ac84a", "#e8e0c8", "#a87a4a", "#8a6a3a"][fx.dirX] ?? "#c8a060";
    const fall = Math.min(1, t * 3);
    if (fall < 1) {
      for (let i = 0; i < 5; i++) clod(ctx, x + Math.cos(i * 1.3) * r * 0.4, y - 40 * (1 - fall) - 4 + Math.sin(i * 1.7) * r * 0.3, r * 0.35, i);
      return true;
    }
    // 땅에 닿으면 차례 색 충격파
    additive(ctx, () => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(1, 0.58);
      if (t < 0.5) glow(ctx, 0, 0, r, tint, (0.5 - t) * 2, 1);
      shock(ctx, 0, 0, r * (0.6 + t * 0.5), tint, 1 - t, 6);
      ctx.restore();
    });
    ctx.globalAlpha = 1 - t;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      clod(ctx, x + Math.cos(a) * r * (0.3 + t * 0.6), y + Math.sin(a) * r * 0.4 * (0.3 + t * 0.6), r * 0.18, i);
    }
    ctx.globalAlpha = 1;
    return true;
  }
  if (fx.kind === "spBeam") {
    // 정령 빛줄기 + 맞은 곳 빛
    const tx = snap(fx.toX ?? fx.x);
    const ty = snap(fx.toY ?? fx.y);
    additive(ctx, () => {
      beam(ctx, x, y, tx, ty, 2, fx.tint ?? "#ffffff", 1 - t);
      glow(ctx, tx, ty, 6, fx.tint ?? "#ffffff", 1 - t, 1.3);
    });
    return true;
  }
  if (drawGreatFx(ctx, fx, snap)) return true;
  if (fx.kind === "gsCast") {
    const g = GREATS[fx.dirX] ?? "titanCore";
    const c = GREAT_GLOW[g];
    // 대정령 시전: 내려오는 빛줄기 + 빛 덩이 + 충격파
    additive(ctx, () => {
      beam(ctx, snap(fx.toX ?? fx.x), snap(fx.toY ?? fx.y), x, y, 2.5, c, 1 - t);
      glow(ctx, x, y, fx.size * (0.5 + t * 0.6), c, 1 - t, 0.8);
      shock(ctx, x, y, fx.size * (0.4 + t * 0.6), c, 1 - t, 5);
    });
    return true;
  }
  return false;
}
