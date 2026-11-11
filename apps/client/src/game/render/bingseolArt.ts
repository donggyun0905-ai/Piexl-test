// 빙설 그리기: 바닥(눈 내리는 얼음 영역·얼음가루·날아가는 칼날/창/화살/유도·급속 얼음·눈덩이·얼음 활·영역강화 눈 결정)
// 몸 위(궁극기 빙설창: 머리 위에서 기 모으기 → 날아감)
// 그림 sprites/bingseolFx.png (256칸 4×3: 0줄 얼음 창 4 · 1줄 얼음가루·유도·급속·빙각 · 2줄 궁극기 창·활·화살·눈 결정) — scripts/art/bingseol.py
import { BINGSEOL_PERKS, fieldR, ULT_LIFT, wallSpots, type BsShot, type RunState } from "@pixel-rogue/shared";
import { img } from "./lunaticFx";
import { lerp, type Snap } from "./palette";
import { additive, alpha as fade, glow, ring, sparks, type Ctx } from "./pwFxBits";

export const BS = { ice: "#8ad8ff", deep: "#2a6ad8", pale: "#dff4ff", white: "#f6fbff" };
const FX = img("bingseolFx");
const C = 256;
const ready = () => FX.complete && FX.naturalWidth > 0;

/** 그림 한 칸 (row 줄, col 칸) → (x, y) 가운데, 너비 w, 각도(그림은 오른쪽을 봄) · flip = 좌우 뒤집기 */
export function bsPic(ctx: Ctx, row: number, col: number, x: number, y: number, w: number, a = 1, angle = 0, flip = false): void {
  if (!ready() || a <= 0) return;
  ctx.save();
  ctx.globalAlpha *= Math.min(1, a);
  ctx.translate(x, y);
  if (angle) ctx.rotate(angle);
  if (flip) ctx.scale(-1, 1);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(FX, col * C, row * C, C, C, -w / 2, -w / 2, w, w);
  ctx.restore();
}

/** 빛 그림 한 칸 (더해 그림) */
export const bsGlowPic = (ctx: Ctx, row: number, col: number, x: number, y: number, w: number, a = 1, angle = 0) =>
  additive(ctx, () => bsPic(ctx, row, col, x, y, w, a, angle));

/** 눈 내리는 얼음 영역 (눈송이는 화면만의 움직임) */
function drawField(ctx: Ctx, s: RunState, x: number, y: number): void {
  const r = fieldR(s.player);
  ctx.fillStyle = fade(BS.ice, 0.07);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ring(ctx, x, y, r, fade(BS.pale, 0.28), 1);
  ctx.fillStyle = fade(BS.white, 0.8);
  for (let i = 0; i < 18; i++) {
    const ang = i * 2.39996;
    const d = r * Math.sqrt(((i * 37) % 18) / 18 + 0.02);
    const fall = ((s.tick * (0.25 + (i % 4) * 0.08) + i * 11) % 24) - 12;
    const sx = x + Math.cos(ang) * d + Math.sin((s.tick + i * 20) * 0.03) * 2;
    const sy = y + Math.sin(ang) * d * 0.9 + fall;
    if ((sx - x) ** 2 + (sy - y) ** 2 > r * r) continue;
    ctx.fillRect(Math.round(sx), Math.round(sy), i % 3 === 0 ? 2 : 1, i % 3 === 0 ? 2 : 1);
  }
}

/** 날아가는 것 하나 */
function drawShot(ctx: Ctx, sh: BsShot, x: number, y: number, s: RunState): void {
  const ang = Math.atan2(sh.dy, sh.dx);
  switch (sh.kind) {
    case 0:
      bsGlowPic(ctx, 0, 1, x, y, sh.r * 5, 1, ang);
      return;
    case 1: {
      // 얼음 창: 머리 위에서 차례로 생기며 1→4칸으로 자람 · 나가면 4칸
      const since = sh.age - (sh.t0 ?? 0) - (sh.at ?? 0);
      if (sh.age <= 0 && since < 0) return;
      const frame = sh.age > 0 ? 3 : Math.min(3, Math.floor(since / 3));
      const face = sh.age > 0 ? ang : Math.atan2(s.player.faceY, s.player.faceX);
      bsGlowPic(ctx, 0, frame, x, y, 30, 1, face);
      return;
    }
    case 2:
      bsGlowPic(ctx, 2, 2, x, y, 26, 1, ang);
      return;
    case 3:
      if (sh.age <= 0) bsGlowPic(ctx, 1, 0, x, y, 10 + (1 + sh.age / 14) * 10, 1, s.tick * 0.1);
      else bsGlowPic(ctx, 1, 1, x, y, 26, 1, ang);
      return;
    case 4:
      if (sh.age <= 0) bsGlowPic(ctx, 1, 0, x, y, 12 + (1 + sh.age / 16) * 14, 1, s.tick * 0.15);
      else bsGlowPic(ctx, 1, 2, x, y, 46, 1, ang);
      return;
    default:
      // 눈덩이
      additive(ctx, () => glow(ctx, x, y, 7, BS.pale, 0.8, 0.6));
      ctx.fillStyle = BS.white;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
  }
}

/** 바닥: 영역 · 얼음가루 · 활 · 날아가는 것 · 영역강화 결정 */
export function drawBingseolGround(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "bingseol") return;
  const px = snap(lerp(p.prevX, p.x, alpha));
  const py = snap(lerp(p.prevY, p.y, alpha));
  drawField(ctx, s, px, py);
  for (const d of p.bsDust ?? []) {
    const tw = 0.6 + 0.4 * Math.sin((s.tick + d.x) * 0.2);
    const melt = d.age > BINGSEOL_PERKS.bsDust.life - 60 ? (BINGSEOL_PERKS.bsDust.life - d.age) / 60 : 1;
    bsGlowPic(ctx, 1, 0, snap(d.x), snap(d.y), 9, tw * melt);
  }
  for (const b of p.bsBows ?? []) {
    const a = Math.min(1, b.left / 30);
    additive(ctx, () => glow(ctx, snap(b.x), snap(b.y), 16, BS.ice, 0.25 * a));
    bsPic(ctx, 2, 1, snap(b.x), snap(b.y), 40, a, Math.atan2(b.ay, b.ax));
  }
  for (const sh of p.bsShots ?? []) drawShot(ctx, sh, snap(sh.x), snap(sh.y), s);
  if (p.passives.includes("bsWall" as never)) {
    for (const [x, y] of wallSpots(p)) {
      additive(ctx, () => glow(ctx, snap(x), snap(y), 12, BS.ice, 0.35));
      bsGlowPic(ctx, 2, 3, snap(x), snap(y), 22, 0.95, s.tick * 0.02);
    }
  }
}

/** 몸 위: 궁극기 빙설창 */
export function drawBingseolAir(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  const u = p.bsUlt;
  if (p.characterId !== "bingseol" || !u) return;
  const charge = BINGSEOL_PERKS.bsUlt.charge;
  if (u.t < charge) {
    // 기 모으기: 위를 가리킨 창 둘레로 빛이 모여듦 (끝날수록 밝게)
    const x = snap(lerp(p.prevX, p.x, alpha));
    const y = snap(lerp(p.prevY, p.y, alpha)) - ULT_LIFT;
    const f = u.t / charge;
    additive(ctx, () => glow(ctx, x, y, 16 + f * 18, BS.ice, 0.3 + f * 0.5, f * 0.6));
    ring(ctx, x, y, 34 * (1 - ((u.t % 30) / 30)), fade(BS.pale, 0.6 * f), 1.5);
    sparks(ctx, x, y, 10, 30 * (1 - ((u.t % 24) / 24)), (u.t % 24) / 24, BS.pale, u.t, 0.8);
    bsGlowPic(ctx, 2, 0, x, y - 4, 70 + f * 20, 0.6 + f * 0.4, -Math.PI / 2);
    return;
  }
  const x = snap(u.x);
  const y = snap(u.y);
  const ang = Math.atan2(u.dy, u.dx);
  const hold = u.pause > 0;
  additive(ctx, () => glow(ctx, x, y, hold ? 30 : 20, BS.ice, hold ? 0.7 : 0.45, 0.5));
  bsGlowPic(ctx, 2, 0, x - u.dx * 20, y - u.dy * 20, 110, 1, ang);
}
