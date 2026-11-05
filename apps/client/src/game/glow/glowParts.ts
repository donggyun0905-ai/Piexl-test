// 빛 효과 조각 (PixiJS): 빛 점·불티·충격파 고리를 모아 두고 다시 씀. 게임 좌표로 움직이고 그릴 때 화면 좌표로 바꿈
// 화면 꾸밈일 뿐이라 게임 결과에 영향 없음 (Math.random 써도 됨)
import type { Container, Sprite, Texture } from "pixi.js";

type Pixi = typeof import("pixi.js");

/** 한 번에 화면에 있는 조각 최대 수 (폰에서도 가볍게) */
const MAX_PARTS = 900;

/** "#rrggbb"·"#rgb" 글자 → 숫자 색 (아니면 fallback) */
export function hexColor(c: string | undefined, fallback: number): number {
  if (!c) return fallback;
  if (/^#[0-9a-f]{6}$/i.test(c)) return parseInt(c.slice(1), 16);
  if (/^#[0-9a-f]{3}$/i.test(c)) return parseInt(c.slice(1).replace(/./g, (h) => h + h), 16);
  return fallback;
}

export type PartKind = "dot" | "spark" | "ring";

interface Part {
  sp: Sprite;
  kind: PartKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** 남은 시간·전체 시간 (초) */
  life: number;
  max: number;
  /** 처음·끝 크기 (게임 픽셀) */
  s0: number;
  s1: number;
  /** 1초에 줄어드는 속도 비율 */
  drag: number;
  alpha: number;
}

export interface SpawnOpt {
  kind?: PartKind;
  vx?: number;
  vy?: number;
  life: number;
  s0: number;
  s1?: number;
  drag?: number;
  color: number;
  alpha?: number;
}

/** 부드러운 빛 점·고리 그림 (캔버스로 한 번 만들어 둠) */
function makeTextures(P: Pixi): { dot: Texture; ring: Texture } {
  const dot = document.createElement("canvas");
  dot.width = dot.height = 64;
  const d = dot.getContext("2d")!;
  const g = d.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.75)");
  g.addColorStop(0.6, "rgba(255,255,255,0.2)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  d.fillStyle = g;
  d.fillRect(0, 0, 64, 64);
  const ring = document.createElement("canvas");
  ring.width = ring.height = 128;
  const r = ring.getContext("2d")!;
  const rg = r.createRadialGradient(64, 64, 40, 64, 64, 64);
  rg.addColorStop(0, "rgba(255,255,255,0)");
  rg.addColorStop(0.7, "rgba(255,255,255,0.9)");
  rg.addColorStop(0.85, "rgba(255,255,255,0.5)");
  rg.addColorStop(1, "rgba(255,255,255,0)");
  r.fillStyle = rg;
  r.fillRect(0, 0, 128, 128);
  return { dot: P.Texture.from(dot), ring: P.Texture.from(ring) };
}

/** 화면 가장자리 붉은 테두리 (맞았을 때) */
export function makeVignette(P: Pixi): Texture {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 144;
  const x = c.getContext("2d")!;
  const g = x.createRadialGradient(128, 72, 40, 128, 72, 150);
  g.addColorStop(0, "rgba(255,255,255,0)");
  g.addColorStop(0.6, "rgba(255,255,255,0.15)");
  g.addColorStop(1, "rgba(255,255,255,0.85)");
  x.fillStyle = g;
  x.fillRect(0, 0, 256, 144);
  return P.Texture.from(c);
}

export class GlowParts {
  private live: Part[] = [];
  private free: Sprite[] = [];
  private tex: { dot: Texture; ring: Texture };

  constructor(
    private P: Pixi,
    private layer: Container,
  ) {
    this.tex = makeTextures(P);
  }

  /** 지금 조각 수 */
  get count(): number {
    return this.live.length;
  }

  spawn(x: number, y: number, o: SpawnOpt): void {
    if (this.live.length >= MAX_PARTS) return;
    const kind = o.kind ?? "dot";
    const sp = this.free.pop() ?? this.newSprite();
    sp.texture = kind === "ring" ? this.tex.ring : this.tex.dot;
    sp.tint = o.color;
    sp.visible = true;
    sp.rotation = 0;
    this.live.push({ sp, kind, x, y, vx: o.vx ?? 0, vy: o.vy ?? 0, life: o.life, max: o.life, s0: o.s0, s1: o.s1 ?? o.s0, drag: o.drag ?? 0, alpha: o.alpha ?? 1 });
  }

  /** 한 점에서 사방으로 튀는 불티 */
  burst(x: number, y: number, n: number, speed: number, color: number, life = 0.45, size = 2.2): void {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = speed * (0.35 + Math.random() * 0.65);
      this.spawn(x, y, { kind: "spark", vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: life * (0.6 + Math.random() * 0.6), s0: size, s1: size * 0.3, drag: 4, color });
    }
  }

  private newSprite(): Sprite {
    const sp = new this.P.Sprite(this.tex.dot);
    sp.anchor.set(0.5);
    sp.blendMode = "add";
    this.layer.addChild(sp);
    return sp;
  }

  /** dt초 진행 후 화면 좌표로 놓기. f = 게임 1픽셀의 화면 크기, (cx, cy) = 보이는 영역 왼쪽 위 */
  update(dt: number, f: number, cx: number, cy: number): void {
    const out: Part[] = [];
    for (const p of this.live) {
      p.life -= dt;
      if (p.life <= 0) {
        p.sp.visible = false;
        this.free.push(p.sp);
        continue;
      }
      const k = Math.max(0, 1 - p.drag * dt);
      p.vx *= k;
      p.vy *= k;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      const t = 1 - p.life / p.max;
      const size = (p.s0 + (p.s1 - p.s0) * t) * f;
      const sp = p.sp;
      sp.position.set((p.x - cx) * f, (p.y - cy) * f);
      // 그림 한 장 = 64픽셀 (고리는 128이지만 크기 = 지름으로 맞춤)
      const base = p.kind === "ring" ? 128 : 64;
      if (p.kind === "spark") {
        // 날아가는 방향으로 길쭉하게
        const v = Math.hypot(p.vx, p.vy);
        sp.rotation = Math.atan2(p.vy, p.vx);
        sp.scale.set((size + v * 0.04 * f) / base, size / base);
      } else sp.scale.set(size / base);
      sp.alpha = p.alpha * (p.kind === "ring" ? 1 - t : Math.min(1, (1 - t) * 1.6));
      out.push(p);
    }
    this.live = out;
  }

  clear(): void {
    for (const p of this.live) {
      p.sp.visible = false;
      this.free.push(p.sp);
    }
    this.live = [];
  }
}
