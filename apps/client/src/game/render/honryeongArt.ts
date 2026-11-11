// 혼령 그리기: 바닥(분신·늑대·범·앉은 부엉이) · 몸 위(나는 부엉이·연기 구름·혼-룡·은신 표시)
// 그림 sprites/honryeongFx.png (256칸 4×4: 0줄 연기용 4 · 1줄 혼-룡 4 · 2·3줄 구름 8)
// sprites/honryeongPets.png (128칸 4×10, 칸 순서 앞·뒤·왼·오: 0·1 늑대 걷기 · 2 늑대 공격 · 3·4 범 걷기 · 5 범 공격 · 6 부엉이 앉음 · 7 낙하 · 8·9 날기) — scripts/art/honryeong.py
import { dragonTicks, HONRYEONG_PERKS, HR_CLOUD, huntOn, ROOM_HEIGHT, ROOM_WIDTH, type HrBeast, type HrOwl, type RunState } from "@pixel-rogue/shared";
import { drawCharacter } from "../sprites";
import { img } from "./lunaticFx";
import { lerp, type Snap } from "./palette";
import { additive, alpha as fade, glow, ring, type Ctx } from "./pwFxBits";

export const HR = { smoke: "#b48aff", deep: "#5a3aa8", pale: "#e8dcff", white: "#f8f4ff" };
const FX = img("honryeongFx");
const PETS = img("honryeongPets");
const ok = (im: HTMLImageElement) => im.complete && im.naturalWidth > 0;

/** 효과 그림 한 칸 (row 줄, col 칸) → (x, y) 가운데, 너비 w, 각도(그림은 오른쪽을 봄) */
export function hrPic(ctx: Ctx, row: number, col: number, x: number, y: number, w: number, a = 1, angle = 0): void {
  if (!ok(FX) || a <= 0) return;
  ctx.save();
  ctx.globalAlpha *= Math.min(1, a);
  ctx.translate(x, y);
  // 왼쪽을 볼 때는 위아래가 뒤집히지 않게
  if (Math.cos(angle) < 0) {
    ctx.rotate(angle + Math.PI);
    ctx.scale(-1, 1);
  } else if (angle) ctx.rotate(angle);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(FX, col * 256, row * 256, 256, 256, -w / 2, -w / 2, w, w);
  ctx.restore();
}

function petPic(ctx: Ctx, row: number, col: number, x: number, y: number, w: number, a = 1): void {
  if (!ok(PETS)) return;
  ctx.save();
  ctx.globalAlpha *= a;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(PETS, col * 128, row * 128, 128, 128, x - w / 2, y - w * 0.62, w, w);
  ctx.restore();
}

/** 움직이는 쪽 → 칸 (앞 0 · 뒤 1 · 왼 2 · 오 3) */
const dirCol = (dx: number, dy: number, face: number) => (Math.abs(dy) > Math.abs(dx) * 1.3 ? (dy > 0 ? 0 : 1) : face < 0 ? 2 : 3);

function hpBar(ctx: Ctx, x: number, top: number, b: { hp: number; maxHp: number }): void {
  const w = 16;
  ctx.fillStyle = "#1a0e22";
  ctx.fillRect(x - w / 2 - 1, top - 1, w + 2, 3);
  ctx.fillStyle = HR.smoke;
  ctx.fillRect(x - w / 2, top, Math.max(1, Math.round((w * Math.max(0, b.hp)) / b.maxHp)), 1);
}

function drawBeast(ctx: Ctx, b: HrBeast, x: number, y: number, s: RunState, hidden: boolean): void {
  const tiger = b.kind === 1;
  const w = (tiger ? 44 : 32) * (b.big ? HONRYEONG_PERKS.hrHunt.size : 1);
  const moving = Math.abs(b.x - b.prevX) + Math.abs(b.y - b.prevY) > 0.05;
  const base = tiger ? 3 : 0;
  const row = b.swing > 0 ? base + 2 : base + (moving ? Math.floor((s.tick + b.id * 5) / 8) % 2 : 0);
  additive(ctx, () => glow(ctx, x, y, w * 0.4, HR.smoke, hidden ? 0.12 : 0.22));
  petPic(ctx, row, dirCol(b.x - b.prevX, b.y - b.prevY, b.face), x, y, w, hidden ? 0.55 : 1);
  if (!hidden) hpBar(ctx, x, y - w * 0.62 - 3, b);
}

/** 부엉이: 앉음 · 날아오름(날갯짓, 포물선) · 끝에 낙하 그림 */
function drawOwl(ctx: Ctx, o: HrOwl, x: number, y: number, s: RunState): void {
  const col = o.face < 0 ? 2 : 3;
  if (o.t <= 0) {
    additive(ctx, () => glow(ctx, x, y, 12, HR.smoke, 0.2));
    petPic(ctx, 6, col, x, y, 30);
    return;
  }
  const f = 1 - o.t / HONRYEONG_PERKS.hrOwl.fly;
  const lift = Math.sin(f * Math.PI) * 26;
  ctx.fillStyle = "rgba(20, 10, 40, 0.3)";
  ctx.beginPath();
  ctx.ellipse(x, y + 2, 8, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  petPic(ctx, f > 0.65 ? 7 : 8 + (Math.floor(s.tick / 5) % 2), col, x, y - lift, 36);
}

/** 바닥: 분신 · 늑대·범 · 앉은 부엉이 */
export function drawHonryeongGround(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "honryeong") return;
  for (const d of p.hrDecoys ?? []) {
    const x = snap(d.x);
    const y = snap(d.y);
    ctx.save();
    ctx.globalAlpha = 0.6 + 0.12 * Math.sin((s.tick + d.id * 9) * 0.15);
    drawCharacter(ctx, "honryeong", x, y, p.r, { faceX: d.face, faceY: 0, moving: false, casting: false, step: 0 });
    ctx.restore();
    additive(ctx, () => glow(ctx, x, y, 16, HR.smoke, 0.3));
    hpBar(ctx, x, y - 28, d);
  }
  const hidden = huntOn(p);
  for (const b of p.hrBeasts ?? []) drawBeast(ctx, b, snap(lerp(b.prevX, b.x, alpha)), snap(lerp(b.prevY, b.y, alpha)), s, hidden);
  for (const o of p.hrOwls ?? []) if (o.t <= 0) drawOwl(ctx, o, snap(o.x), snap(o.y), s);
}

/** 몸 위: 나는 부엉이 · 구름(다 차면 방을 덮음, 내가 든 구름은 옅게) · 혼-룡 · 은신 표시 */
export function drawHonryeongAir(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "honryeong") return;
  const px = snap(lerp(p.prevX, p.x, alpha));
  const py = snap(lerp(p.prevY, p.y, alpha));
  for (const o of p.hrOwls ?? []) if (o.t > 0) drawOwl(ctx, o, snap(lerp(o.prevX, o.x, alpha)), snap(lerp(o.prevY, o.y, alpha)), s);
  for (const c of p.hrClouds ?? []) {
    const born = Math.min(1, c.age / 20);
    const gone = Math.min(1, (HR_CLOUD.life - c.age) / 60);
    const mine = (c.x - p.x) ** 2 + (c.y - p.y) ** 2 <= c.r * c.r;
    const bob = Math.sin((s.tick + c.x * 3) * 0.03) * 1.5;
    hrPic(ctx, 2 + (c.pic >> 2), c.pic & 3, snap(c.x), snap(c.y) + bob, c.r * 3 * (0.7 + 0.3 * born), (mine ? 0.4 : 0.66) * born * gone);
  }
  const d = p.hrDragon;
  if (d) {
    // 방을 덮는 용: 왼쪽 끝 → 오른쪽 끝 (4칸 그림을 차례로 이어 그림)
    const f = d.t / dragonTicks();
    const w = Math.max(ROOM_WIDTH * 1.1, ROOM_HEIGHT * 2);
    const x = -w * 0.45 + (ROOM_WIDTH + w * 0.9) * f;
    additive(ctx, () => glow(ctx, x, ROOM_HEIGHT / 2, w * 0.4, HR.smoke, 0.25));
    hrPic(ctx, 1, Math.floor(d.t / 8) % 4, x, ROOM_HEIGHT / 2 + Math.sin(d.t * 0.12) * 6, w, 0.9);
  }
  if (p.hrHidden) {
    ring(ctx, px, py, 9 + Math.sin(s.tick * 0.1) * 1.5, fade(HR.pale, 0.7), 1);
    additive(ctx, () => glow(ctx, px, py, 12, HR.smoke, 0.3));
  }
}
