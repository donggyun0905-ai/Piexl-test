// 성탄 눈꽃(시즌 4 크리스마스 한정 스킨) 효과: 범 풍류(tigerFx)와 같은 때에 다른 조각을 만듦 (화면 전용, 꾸밈이라 Math.random을 씀)
// 맞힘 → 눈꽃이 튀고 빨강·초록 섬광·반짝 별 · 처치 → 색종이·눈꽃이 터짐(보스는 MERRY! 리본 도장) · 걸음 → 눈 위 장화 발자국
// 가만히 → 함박눈 · 무기·패시브 얻음 → 금빛 별 기둥·눈꽃 고리·글자 · 휘두르기 → 지팡이 사탕 베기 · 쏘기 → 금빛 반짝. 그리기는 xmasDraw
import { rand, TigerFx } from "./tigerFx";
import { ICE, PINE, RED, SNOW, STAR } from "./xmasArt";

/** 캐릭터마다 빛 (블루 플레임 푸른 불 · 빙설·래빗 얼음 · 혼령 보라 · 아수라 주황 · 아리아 금) */
const TINT: Record<string, string> = { blueFlame: "#6aa8ff", bingseol: ICE, rabbit: ICE, honryeong: "#c8a0ff", asura: "#ff8a3c", aria: STAR, hellfist: "#ff5a3a" };
const CONFETTI = [RED, PINE, STAR, SNOW];

export class XmasFx extends TigerFx {
  protected override ringColor = ICE;

  protected override accentOf(c: string): string {
    return TINT[c] ?? RED;
  }

  protected override stepAt(x: number, y: number, a: number): void {
    this.add({ kind: "foot", x, y, vx: 0, vy: 0, life: 80, size: 1, rot: a, color: SNOW });
    if (Math.random() < 0.5) this.add({ kind: "dust", x: x + rand(-2, 2), y, vx: rand(-0.3, 0.3), vy: rand(-0.3, -0.1), life: 12, size: 1, rot: 0, color: SNOW });
  }

  /** 눈꽃 n개가 사방으로 */
  private flakes(x: number, y: number, n: number, speed: number): void {
    for (let i = 0; i < n; i++) {
      const a = rand(0, Math.PI * 2);
      const v = rand(0.4, 1.2) * speed;
      this.add({ kind: "glint", x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 0.3, life: Math.floor(rand(14, 24)), size: Math.random() < 0.3 ? 1 : 0, rot: 0, color: i % 2 ? SNOW : ICE });
    }
  }

  /** 반짝 별 n개 (네 갈래) */
  private twinkles(x: number, y: number, n: number, speed: number, color = STAR): void {
    for (let i = 0; i < n; i++) {
      const a = rand(0, Math.PI * 2);
      const v = rand(0.5, 1.4) * speed;
      this.add({ kind: "spark", x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: Math.floor(rand(9, 16)), size: 1, rot: a, color: i % 3 ? color : SNOW });
    }
  }

  protected override hitAt(x: number, y: number, r: number): void {
    this.hits++;
    this.flakes(x, y, 3, 1.2);
    this.twinkles(x, y, 2, 1);
    this.add({ kind: "flash", x, y, vx: 0, vy: 0, life: 7, size: Math.max(9, r + 6), rot: 0, color: this.hits % 2 ? RED : PINE });
  }

  protected override ko(x: number, y: number, r: number, boss: boolean): void {
    // 선물 상자가 터지듯 색종이가 솟았다가 떨어짐 (drop: 무게가 있음)
    for (let i = 0; i < (boss ? 46 : 18); i++) {
      const a = rand(-Math.PI, 0);
      const v = rand(0.6, boss ? 2.6 : 1.8);
      this.add({ kind: "drop", x, y, vx: Math.cos(a) * v * 0.6, vy: Math.sin(a) * v - 0.4, life: Math.floor(rand(22, boss ? 50 : 34)), size: Math.random(), rot: rand(0, 3), color: CONFETTI[i % 4]! });
    }
    this.flakes(x, y, boss ? 16 : 6, 1.8);
    this.twinkles(x, y, boss ? 12 : 5, 2);
    this.ringAt(x, y, r + 10, ICE);
    this.add({ kind: "flash", x, y, vx: 0, vy: 0, life: boss ? 24 : 12, size: r + (boss ? 30 : 14), rot: 0, color: STAR });
    if (boss) this.add({ kind: "seal", x, y: y - r - 10, vx: 0, vy: -0.05, life: 90, size: 1, rot: 0, color: RED, text: "MERRY!" });
  }

  protected override idleAura(x: number, y: number): void {
    // 함박눈이 천천히 내림 · 발밑에 금빛 반짝
    if (Math.random() < 0.35) this.add({ kind: "petal", x: x + rand(-44, 44), y: y - rand(30, 52), vx: 0, vy: rand(0.2, 0.4), life: 110, size: Math.random(), rot: 0, color: SNOW });
    if (Math.random() < 0.25) this.add({ kind: "spark", x: x + rand(-14, 14), y: y + rand(0, 6), vx: 0, vy: rand(-0.6, -0.2), life: 24, size: 1, rot: 0, color: Math.random() < 0.6 ? STAR : this.accent });
  }

  protected override powerUp(x: number, y: number): void {
    this.add({ kind: "pillar", x, y, vx: 0, vy: 0, life: 44, size: 16, rot: 0, color: STAR });
    for (const [size, c] of [[22, ICE], [32, RED], [42, PINE], [52, this.accent]] as const) this.ringAt(x, y, size, c);
    this.flakes(x, y - 12, 14, 2.2);
    this.twinkles(x, y - 16, 10, 2.4);
    this.add({ kind: "text", x, y: y - 20, vx: 0, vy: -0.25, life: 60, size: 1, rot: 0, color: STAR, text: this.hooks.powerText });
    this.hooks.roar(true);
  }

  protected override muzzle(x: number, y: number, a: number): void {
    const mx = x + Math.cos(a) * 6;
    const my = y + Math.sin(a) * 6;
    this.add({ kind: "flash", x: mx, y: my, vx: 0, vy: 0, life: 5, size: 7, rot: 0, color: STAR });
    this.twinkles(mx, my, 2, 1.2, this.accent);
    this.hooks.roar(false);
  }

  protected override clawAt(x: number, y: number, a: number): void {
    // 지팡이 사탕처럼 빨강·흰 두 겹 베기
    this.add({ kind: "slash", x, y, vx: 0, vy: 0, life: 9, size: 15, rot: a, color: RED });
    this.add({ kind: "slash", x: x + Math.cos(a) * 2, y: y + Math.sin(a) * 2 + 1, vx: 0, vy: 0, life: 9, size: 15, rot: a, color: SNOW });
    this.flakes(x + Math.cos(a) * 10, y + Math.sin(a) * 10, 2, 0.8);
    this.hooks.roar(false);
  }
}
