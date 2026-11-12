// 기어스 그리기: 몸 위 (대시 구체 · 구체 앞 방패 충격파 · 천상의 수호자 방패 · 위성 방패 · 던진 방패 · 보호막 돔 · 육각 방벽)
// 그림 sprites/gearsFx.png (192칸 4×11, 줄 차례는 ROW) · gearsShield.png · gearsOrb.png — scripts/art/gears.py
import { GE_PERKS, geOrbitAt, type RunState } from "@pixel-rogue/shared";
import { img } from "./lunaticFx";
import { lerp, type Snap } from "./palette";
import { additive, glow, type Ctx } from "./pwFxBits";

export const GE = { blue: "#3a8aff", light: "#a8d8ff", white: "#f0f8ff", deep: "#1a3a9a" };
/** 효과 시트의 줄 */
export const ROW = { geSlam: 0, geTwin: 1, geBarrage: 2, geMirror: 3, geDome: 4, geQuake: 5, geWave: 6, geHex: 7, geBoom: 8, geGuard: 9, geStorm: 10 } as const;
const FX = img("gearsFx");
const SHIELD = img("gearsShield");
const ORB = img("gearsOrb");
const C = 192;
const ok = (i: HTMLImageElement) => i.complete && i.naturalWidth > 0;

/** 빛 그림 한 칸 (row 줄, col 칸) → (x, y) 가운데, 너비 w, 각도 (더해 그림) · flip = 좌우 뒤집기 */
export function gePic(ctx: Ctx, row: number, col: number, x: number, y: number, w: number, a = 1, angle = 0, flip = false): void {
  if (!ok(FX) || a <= 0) return;
  additive(ctx, () => {
    ctx.save();
    ctx.globalAlpha *= Math.min(1, a);
    ctx.translate(x, y);
    if (angle) ctx.rotate(angle);
    if (flip) ctx.scale(-1, 1);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(FX, col * C, row * C, C, C, -w / 2, -w / 2, w, w);
    ctx.restore();
  });
}

/** 한 장 그림 (방패·구체) 가운데 (x, y) · 너비 w · 돌기 */
export function geOne(ctx: Ctx, im: "shield" | "orb", x: number, y: number, w: number, angle = 0, a = 1): void {
  const pic = im === "shield" ? SHIELD : ORB;
  if (!ok(pic)) return;
  ctx.save();
  ctx.globalAlpha *= a;
  ctx.translate(x, y);
  if (angle) ctx.rotate(angle);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(pic, -w / 2, -w / 2, w, (w * pic.naturalHeight) / pic.naturalWidth);
  ctx.restore();
}

/** 몸 위 */
export function drawGearsAir(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "gears") return;
  const x = snap(lerp(p.prevX, p.x, alpha));
  const y = snap(lerp(p.prevY, p.y, alpha));
  const t = s.tick + alpha;
  const ang = Math.atan2(p.faceY, p.faceX);
  const left = p.faceX < 0;
  // 보호막 돔 (막는 동안) · 육각 방벽 (보호막이 있는 동안)
  if (p.shieldTicks > 0) gePic(ctx, ROW.geDome, 3, x, y - 6, p.r * 4.4, 0.55 + 0.1 * Math.sin(t * 0.2));
  if ((p.shieldPts ?? 0) > 0) gePic(ctx, ROW.geHex, 3, x, y - 4, p.r * 3.6, 0.35 + 0.1 * Math.sin(t * 0.15));
  // 대시 구체: 굴러가는 쪽으로 빙글 · 앞에 방패 충격파
  if (p.geBall) {
    additive(ctx, () => glow(ctx, x, y, p.r * 2, GE.blue, 0.45, 0.3));
    geOne(ctx, "orb", x, y, p.r * 2.6, (t - (p.geBallAt ?? 0)) * 0.25 * (left ? -1 : 1));
    if (p.passives.includes("geWave" as never)) gePic(ctx, ROW.geWave, Math.floor(t / 5) % 2, x + p.faceX * p.r * 1.6, y + p.faceY * p.r * 1.6, p.r * 2.6, 0.7, left ? ang + Math.PI : ang, left);
  }
  // 천상의 수호자: 앞에 든 거대한 방패 (마지막 칸)
  if ((p.geGuard ?? 0) > 0) {
    const G = GE_PERKS.geGuardian;
    const k = p.stats.range / 40;
    const fx = x + p.faceX * G.reach * k;
    const fy = y + p.faceY * G.reach * k;
    const born = t - (p.geGuardAt ?? 0);
    gePic(ctx, ROW.geGuard, born < 20 ? Math.min(3, Math.floor(born / 5)) : 3, fx, fy - 4, G.r * k * 3.2, 0.9 + 0.1 * Math.sin(t * 0.3));
  }
  // 위성 방패
  if (p.passives.includes("geOrbit" as never)) {
    for (let i = 0; i < GE_PERKS.geOrbit.n; i++) {
      const [ox, oy] = geOrbitAt(s, i);
      const sx = snap(ox + (x - p.x));
      const sy = snap(oy + (y - p.y));
      additive(ctx, () => glow(ctx, sx, sy, 8, GE.blue, 0.4, 0.3));
      geOne(ctx, "shield", sx, sy, GE_PERKS.geOrbit.size * 2.2, t * 0.1);
    }
  }
  // 던진 방패
  for (const th of p.geThrows ?? []) {
    const tx = snap(th.x - th.dx * GE_PERKS.geThrow.speed * (1 - alpha));
    const ty = snap(th.y - th.dy * GE_PERKS.geThrow.speed * (1 - alpha));
    gePic(ctx, ROW.geBoom, 1 + (Math.floor(t / 4) % 2), tx, ty, GE_PERKS.geThrow.r * 4, 0.9, Math.atan2(th.dy, th.dx));
    geOne(ctx, "shield", tx, ty, GE_PERKS.geThrow.r * 1.8, t * 0.4);
  }
}
