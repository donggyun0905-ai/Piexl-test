// 여름 파도(시즌 2 한정 스킨) 효과: 범 풍류(tigerFx)와 같은 때에 다른 조각을 만듦 (화면 전용, 꾸밈이라 Math.random을 씀)
// 맞힘 → 물보라·물결 자국 · 처치 → 거품이 피어오름(보스는 구명튜브 K.O 도장) · 걸음 → 푸른 물 발자국과 살짝 이는 물거품 · 가만히 → 햇빛 반짝임·거품
// 무기·패시브 얻음 → 물기둥·무지개 파동·글자 · 휘두르기 → 큰 물결 · 쏘기 → 물방울. 그리기는 summerDraw
import { rand, TigerFx } from "./tigerFx";

export const SEA = "#4ad8ff";
export const FOAM = "#e8fcff";
export const SUN = "#ffd860";
export const CORAL = "#ff7a8a";
export const SAND = "#e8c890";
/** 캐릭터마다 물빛 (이드라 연두 · 변희 산호 · 플라이 하늘 · 장로 옥빛 · 렌 모래 · 정령사 보라) */
const TINT: Record<string, string> = { idra: "#9aff8a", byeonhui: "#ff8a6a", fly: "#6ae8ff", elder: "#6ae8c8", ren: "#ffd08a", spiritist: "#c8a8ff", plague: "#9aff6a", slayer: "#ff6a7a", eater: "#8ac8f0", mukin: "#ffd040", samyeol: "#c87aff" };

export class SummerFx extends TigerFx {
  protected override ringColor = SEA;

  protected override accentOf(c: string): string {
    return TINT[c] ?? SEA;
  }

  protected override stepAt(x: number, y: number, a: number): void {
    this.add({ kind: "foot", x, y, vx: 0, vy: 0, life: 80, size: 1, rot: a, color: SEA });
    // 발자국 둘레에 살짝 이는 물거품
    if (Math.random() < 0.6) this.add({ kind: "dust", x: x + rand(-2, 2), y: y + rand(-1, 1), vx: rand(-0.15, 0.15), vy: rand(-0.15, 0), life: 18, size: 1, rot: 0, color: FOAM });
  }

  /** 물방울 n개 (위로 튀었다가 떨어짐) */
  private drops(x: number, y: number, n: number, speed: number): void {
    for (let i = 0; i < n; i++) {
      const a = rand(-Math.PI * 0.95, -Math.PI * 0.05);
      const v = rand(0.6, 1.4) * speed;
      this.add({ kind: "drop", x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: Math.floor(rand(14, 22)), size: rand(1, 2), rot: 0, color: i % 3 ? SEA : FOAM });
    }
  }

  protected override hitAt(x: number, y: number, r: number): void {
    this.drops(x, y - r * 0.3, 5, 1.6);
    this.hits++;
    this.add({ kind: "flash", x, y, vx: 0, vy: 0, life: 8, size: Math.max(9, r + 6), rot: 0, color: SEA });
    const light = Math.random() < 0.3;
    this.add({ kind: "wave", x: x + rand(-r, r) * 0.3, y: y + rand(-r, r) * 0.3, vx: 0, vy: 0, life: light ? 10 : 13, size: Math.max(10, Math.min(22, r * 2)) * (light ? 0.7 : 1), rot: rand(-0.6, 0.6), color: this.accent, flip: this.hits % 2 === 0 });
  }

  protected override ko(x: number, y: number, r: number, boss: boolean): void {
    for (let i = 0; i < (boss ? 40 : 16); i++) {
      const a = rand(0, Math.PI * 2);
      const d = rand(0, r);
      this.add({ kind: "bubble", x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, vx: rand(-0.2, 0.2), vy: rand(-0.5, -0.1), life: Math.floor(rand(30, boss ? 80 : 50)), size: rand(1.5, 3.5), rot: 0, color: i % 3 ? SEA : FOAM });
    }
    this.drops(x, y, boss ? 14 : 7, 2);
    this.ringAt(x, y, r + 8, FOAM);
    this.add({ kind: "flash", x, y, vx: 0, vy: 0, life: boss ? 24 : 14, size: r + (boss ? 30 : 14), rot: 0, color: SEA });
    if (boss) this.add({ kind: "seal", x, y: y - r - 10, vx: 0, vy: -0.05, life: 90, size: 1, rot: 0, color: CORAL, text: "K.O" });
  }

  protected override idleAura(x: number, y: number): void {
    // 햇빛 반짝임과 위로 오르는 거품
    if (Math.random() < 0.3) this.add({ kind: "glint", x: x + rand(-36, 36), y: y + rand(-30, 10), vx: 0, vy: 0, life: 24, size: rand(1, 2), rot: 0, color: Math.random() < 0.6 ? "#ffffff" : SUN });
    if (Math.random() < 0.35) this.add({ kind: "bubble", x: x + rand(-16, 16), y: y + rand(0, 8), vx: 0, vy: rand(-0.6, -0.3), life: 36, size: rand(1, 2.2), rot: 0, color: Math.random() < 0.6 ? FOAM : this.accent });
  }

  protected override powerUp(x: number, y: number): void {
    this.add({ kind: "pillar", x, y, vx: 0, vy: 0, life: 40, size: 16, rot: 0, color: SEA });
    for (const [size, c] of [[24, "#ff6a6a"], [32, SUN], [40, "#6ae86a"], [48, SEA]] as const) this.ringAt(x, y, size, c);
    this.drops(x, y - 20, 16, 2.4);
    this.add({ kind: "text", x, y: y - 18, vx: 0, vy: -0.25, life: 60, size: 1, rot: 0, color: SEA, text: this.hooks.powerText });
    this.hooks.roar(true);
  }

  protected override muzzle(x: number, y: number, a: number): void {
    for (let i = 0; i < 4; i++) {
      const b = a + rand(-0.5, 0.5);
      this.add({ kind: "drop", x: x + Math.cos(a) * 6, y: y + Math.sin(a) * 6, vx: Math.cos(b) * rand(0.8, 1.6), vy: Math.sin(b) * rand(0.8, 1.6) - 0.4, life: 10, size: 1, rot: b, color: i % 2 ? SEA : FOAM });
    }
    this.hooks.roar(false);
  }

  protected override clawAt(x: number, y: number, a: number): void {
    this.add({ kind: "slash", x, y, vx: 0, vy: 0, life: 10, size: 15, rot: a, color: FOAM });
    this.add({ kind: "wave", x: x + Math.cos(a) * 10, y: y + Math.sin(a) * 10, vx: 0, vy: 0, life: 13, size: 18, rot: a, color: this.accent });
    this.hooks.roar(false);
  }
}
