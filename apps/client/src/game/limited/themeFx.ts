// 이벤트 상점 테마 효과: 범 풍류(tigerFx)와 같은 때(맞힘·처치·걸음·가만히·강해짐·쏘기·휘두르기)에 테마 조각을 만듦.
// 칸마다 다른 테마 (타격 · 대기 · 걸음). 화면 전용이라 꾸밈에 Math.random을 씀. 그리기는 themeDraw
import type { FxTheme, ThemeShape } from "../../shop/fxThemes";
import { rand, TigerFx, type Part, type TigerHooks } from "./tigerFx";

export interface ThemeSlots {
  hit?: FxTheme;
  idle?: FxTheme;
  walk?: FxTheme;
}

/** 모양마다 움직임: 떨어짐(꽃잎·잎) · 오름(불씨·안개·반딧불·음표) · 그대로 */
const RISE: readonly ThemeShape[] = ["ember", "mist", "firefly", "note", "heart", "sparkle"];
const FALL: readonly ThemeShape[] = ["petal", "leaf", "flake"];

export class ThemeFx extends TigerFx {
  constructor(
    hooks: TigerHooks,
    readonly themes: ThemeSlots,
  ) {
    super(hooks);
    this.ringColor = themes.hit?.colors[0] ?? "#ffffff";
    this.accent = themes.hit?.colors[1] ?? "#ffffff";
  }

  protected override accentOf(): string {
    return this.themes.hit?.colors[1] ?? "#ffffff";
  }

  private bit(t: FxTheme, shape: ThemeShape, x: number, y: number, vx: number, vy: number, life: number, size = 1, extra: Partial<Part> = {}): void {
    const c = t.colors[Math.floor(Math.random() * 3)]!;
    this.add({ kind: "theme", shape, x, y, vx, vy, life, size, rot: rand(0, Math.PI * 2), color: c, ...extra });
  }

  /** 사방으로 튀는 조각 n개 */
  private burst(t: FxTheme, shape: ThemeShape, x: number, y: number, n: number, speed: number, life: number): void {
    for (let i = 0; i < n; i++) {
      const a = rand(0, Math.PI * 2);
      const v = rand(0.4, 1) * speed;
      const up = RISE.includes(shape) ? -0.3 : 0;
      this.bit(t, shape, x, y, Math.cos(a) * v, Math.sin(a) * v + up, Math.floor(rand(life * 0.7, life)), rand(0.8, 1.3));
    }
  }

  protected override stepAt(x: number, y: number, a: number): void {
    const t = this.themes.walk;
    if (!t) return;
    this.add({ kind: "theme", shape: t.walk.print, x, y, vx: 0, vy: 0, life: 60, size: 1.4, rot: a, color: t.colors[0], ground: true });
    if (t.walk.puff && Math.random() < 0.5) this.bit(t, t.walk.puff, x + rand(-2, 2), y, rand(-0.2, 0.2), rand(-0.4, -0.1), 16, 0.8);
  }

  protected override hitAt(x: number, y: number, r: number): void {
    const t = this.themes.hit;
    if (!t) return;
    this.burst(t, t.hit.bits, x, y, 5, 1.6, 16);
    this.hits++;
    const size = Math.max(0.9, Math.min(1.8, r / 7));
    this.add({ kind: "theme", shape: t.hit.mark, x: x + rand(-r, r) * 0.3, y: y + rand(-r, r) * 0.3, vx: 0, vy: -0.05, life: 14, size: size * 1.6, rot: rand(-0.6, 0.6), color: t.colors[0], flip: this.hits % 2 === 0 });
  }

  protected override ko(x: number, y: number, r: number, boss: boolean): void {
    const t = this.themes.hit;
    if (!t) return;
    this.burst(t, t.hit.bits, x, y, boss ? 40 : 14, boss ? 2.4 : 1.6, boss ? 60 : 34);
    this.ringAt(x, y, r + 8, t.colors[0]);
    if (boss) {
      this.ringAt(x, y, r + 20, t.colors[1]);
      this.add({ kind: "theme", shape: t.hit.mark, x, y: y - r - 8, vx: 0, vy: -0.08, life: 70, size: 3, rot: 0, color: t.colors[0] });
    }
  }

  protected override idleAura(x: number, y: number): void {
    const t = this.themes.idle;
    if (!t) return;
    const shape = t.idle.bits;
    if (Math.random() < 0.35) {
      const fall = FALL.includes(shape);
      const rise = RISE.includes(shape);
      this.bit(t, shape, x + rand(-30, 30), fall ? y - rand(30, 46) : y + rand(-14, 8), fall ? rand(-0.15, 0.15) : 0, fall ? rand(0.2, 0.45) : rise ? rand(-0.6, -0.25) : 0, fall ? 90 : 40, rand(0.8, 1.2));
    }
  }

  protected override powerUp(x: number, y: number): void {
    const t = this.themes.hit;
    if (!t) return;
    for (const [i, c] of t.colors.entries()) this.ringAt(x, y, 22 + i * 10, c);
    this.burst(t, t.hit.bits, x, y, 26, 2.4, 30);
    this.add({ kind: "text", x, y: y - 18, vx: 0, vy: -0.25, life: 60, size: 1, rot: 0, color: t.colors[0], text: this.hooks.powerText });
  }

  protected override muzzle(x: number, y: number, a: number): void {
    const t = this.themes.hit;
    if (!t) return;
    for (let i = 0; i < 3; i++) {
      const b = a + rand(-0.5, 0.5);
      this.bit(t, t.hit.bits, x + Math.cos(a) * 6, y + Math.sin(a) * 6, Math.cos(b) * rand(0.8, 1.5), Math.sin(b) * rand(0.8, 1.5), 9, 0.8);
    }
  }

  protected override clawAt(x: number, y: number, a: number): void {
    const t = this.themes.hit;
    if (!t) return;
    this.add({ kind: "theme", shape: t.hit.mark, x: x + Math.cos(a) * 10, y: y + Math.sin(a) * 10, vx: 0, vy: 0, life: 12, size: 2, rot: a, color: t.colors[1] });
  }

  /** 상점 미리 보기: 그 칸 효과를 흉내 내어 조각을 만듦 (cx·cy 가운데) */
  preview(slot: "hit" | "idle" | "walk", tick: number, cx: number, cy: number): void {
    if (slot === "hit" && tick % 14 === 0) this.hitAt(cx + rand(-6, 6), cy + rand(-4, 4), 7);
    if (slot === "hit" && tick % 70 === 35) this.ko(cx, cy, 8, false);
    if (slot === "idle") this.idleAura(cx, cy + 8);
    if (slot === "walk" && tick % 8 === 0) {
      const k = (tick / 8) % 6;
      this.stepAt(cx - 22 + k * 9, cy + 8 + (k % 2 ? -3 : 3), 0);
    }
    for (const x of this.parts) {
      x.x += x.vx;
      x.y += x.vy;
      x.life--;
    }
    this.parts = this.parts.filter((x) => x.life > 0);
  }
}
