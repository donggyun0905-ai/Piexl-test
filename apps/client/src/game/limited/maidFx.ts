// 벨벳 티타임(시즌 5 메이드·바니 한정 스킨) 효과: 범 풍류(tigerFx)와 같은 때에 다른 조각을 만듦 (화면 전용, 꾸밈이라 Math.random을 씀)
// 맞힘 → 장미 꽃잎·하트·금빛 반짝 · 처치 → 하트가 솟고 꽃잎이 흩날림(보스는 SERVED! 도장) · 걸음 → 구두 굽 자국
// 가만히 → 장미 꽃잎이 내림 · 무기·패시브 얻음 → 금빛 기둥·레이스 고리·글자 · 휘두르기 → 장미·크림 두 겹 베기 · 쏘기 → 금빛 반짝. 그리기는 maidDraw
import { rand, TigerFx } from "./tigerFx";
import { BLUSH, CREAM, GILT, ROSE } from "./maidArt";

/** 캐릭터마다 빛 (느아르 보라 · 루주 진홍 · 블뢰 하늘 · 존 노랑 · 마젠타 분홍 · 베르 초록 · 블랑 은빛) */
const TINT: Record<string, string> = { noir: "#9a6aff", rouge: "#ff3a4a", bleu: "#6ac8ff", jaune: "#ffe04a", magenta: "#ff5ad0", vert: "#5ae08a", blanc: "#e8ecff" };

export class MaidFx extends TigerFx {
  protected override ringColor = GILT;

  protected override accentOf(c: string): string {
    return TINT[c] ?? ROSE;
  }

  protected override stepAt(x: number, y: number, a: number): void {
    this.add({ kind: "foot", x, y, vx: 0, vy: 0, life: 60, size: 1, rot: a, color: this.accent });
    if (Math.random() < 0.15) this.add({ kind: "petal", x, y: y - 2, vx: 0, vy: 0.1, life: 30, size: Math.random(), rot: 0, color: BLUSH });
  }

  /** 하트 n개가 떠오름 */
  private hearts(x: number, y: number, n: number, speed: number): void {
    for (let i = 0; i < n; i++) {
      this.add({ kind: "glint", x: x + rand(-6, 6), y: y + rand(-4, 4), vx: rand(-0.3, 0.3) * speed, vy: -rand(0.3, 0.7) * speed, life: Math.floor(rand(18, 30)), size: Math.random() < 0.3 ? 1 : 0, rot: 0, color: i % 2 ? ROSE : this.accent });
    }
  }

  /** 금빛 반짝 n개 */
  private gleams(x: number, y: number, n: number, speed: number): void {
    for (let i = 0; i < n; i++) {
      const a = rand(0, Math.PI * 2);
      const v = rand(0.5, 1.3) * speed;
      this.add({ kind: "spark", x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: Math.floor(rand(9, 15)), size: 1, rot: a, color: i % 3 ? GILT : CREAM });
    }
  }

  /** 꽃잎 n개가 둘레에서 흩날려 내림 */
  private petals(x: number, y: number, n: number, r: number): void {
    for (let i = 0; i < n; i++) this.add({ kind: "petal", x: x + rand(-r, r), y: y + rand(-r, r * 0.5), vx: 0, vy: rand(0.15, 0.4), life: Math.floor(rand(30, 60)), size: Math.random(), rot: 0, color: i % 3 ? ROSE : BLUSH });
  }

  protected override hitAt(x: number, y: number, r: number): void {
    this.hits++;
    this.petals(x, y, 2, r * 0.6);
    this.gleams(x, y, 3, 1);
    if (this.hits % 3 === 0) this.hearts(x, y - 2, 1, 1);
    this.add({ kind: "flash", x, y, vx: 0, vy: 0, life: 7, size: Math.max(9, r + 6), rot: 0, color: this.hits % 2 ? ROSE : GILT });
  }

  protected override ko(x: number, y: number, r: number, boss: boolean): void {
    this.hearts(x, y, boss ? 12 : 4, boss ? 1.6 : 1.1);
    this.petals(x, y, boss ? 30 : 10, r + 6);
    this.gleams(x, y, boss ? 14 : 6, 2);
    this.ringAt(x, y, r + 10, GILT);
    this.add({ kind: "flash", x, y, vx: 0, vy: 0, life: boss ? 24 : 12, size: r + (boss ? 30 : 14), rot: 0, color: BLUSH });
    if (boss) this.add({ kind: "seal", x, y: y - r - 10, vx: 0, vy: -0.05, life: 90, size: 1, rot: 0, color: GILT, text: "SERVED!" });
  }

  protected override idleAura(x: number, y: number): void {
    if (Math.random() < 0.25) this.add({ kind: "petal", x: x + rand(-40, 40), y: y - rand(30, 50), vx: 0, vy: rand(0.2, 0.4), life: 100, size: Math.random(), rot: 0, color: Math.random() < 0.6 ? ROSE : BLUSH });
    if (Math.random() < 0.25) this.add({ kind: "spark", x: x + rand(-14, 14), y: y + rand(0, 6), vx: 0, vy: rand(-0.6, -0.2), life: 24, size: 1, rot: 0, color: Math.random() < 0.6 ? GILT : this.accent });
  }

  protected override powerUp(x: number, y: number): void {
    this.add({ kind: "pillar", x, y, vx: 0, vy: 0, life: 44, size: 16, rot: 0, color: GILT });
    for (const [size, c] of [[22, GILT], [32, ROSE], [42, CREAM], [52, this.accent]] as const) this.ringAt(x, y, size, c);
    this.hearts(x, y - 10, 6, 1.6);
    this.gleams(x, y - 16, 14, 2.4);
    this.add({ kind: "text", x, y: y - 20, vx: 0, vy: -0.25, life: 60, size: 1, rot: 0, color: GILT, text: this.hooks.powerText });
    this.hooks.roar(true);
  }

  protected override muzzle(x: number, y: number, a: number): void {
    const mx = x + Math.cos(a) * 6;
    const my = y + Math.sin(a) * 6;
    this.add({ kind: "flash", x: mx, y: my, vx: 0, vy: 0, life: 5, size: 7, rot: 0, color: GILT });
    this.gleams(mx, my, 2, 1.2);
    this.hooks.roar(false);
  }

  protected override clawAt(x: number, y: number, a: number): void {
    this.add({ kind: "slash", x, y, vx: 0, vy: 0, life: 9, size: 15, rot: a, color: ROSE });
    this.add({ kind: "slash", x: x + Math.cos(a) * 2, y: y + Math.sin(a) * 2 + 1, vx: 0, vy: 0, life: 9, size: 15, rot: a, color: CREAM });
    this.petals(x + Math.cos(a) * 10, y + Math.sin(a) * 10, 2, 4);
    this.hooks.roar(false);
  }
}
