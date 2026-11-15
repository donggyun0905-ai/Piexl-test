// 네온 펄스(시즌 3 사이버펑크 한정 스킨) 효과: 범 풍류(tigerFx)와 같은 때에 다른 조각을 만듦 (화면 전용, 꾸밈이라 Math.random을 씀)
// 맞힘 → 글리치 막대(색이 갈라진 가로 줄)·네온 섬광·전기 불꽃 · 처치 → 픽셀로 흩어져 위로 사라짐·육각 파동(보스는 DELETED 도장)
// 걸음 → 청록·분홍 번갈아 네온 발자국 · 가만히 → 코드 조각이 떠오름 · 무기·패시브 얻음 → 데이터 기둥·육각 파동·글자 · 휘두르기 → 네온 베기 · 쏘기 → 전기 불꽃. 그리기는 cyberDraw
import { rand, TigerFx } from "./tigerFx";

export const CYAN = "#3cf0ff";
export const PINK = "#ff3ce0";
export const VIOLET = "#9a5cff";
export const VOLT = "#e8ff4a";
export const CHROME = "#e8f0ff";
export const NIGHT = "#0a0618";
/** 캐릭터마다 네온 빛 (영사 분홍 · 풍류사 옥빛 · 레오 금빛 · 오닉스 보라 · 펜리르 얼음 · 이클립스 주황 · 토르켄 번개 · 리바이어 얼음 · 테일 청록 · 매드퀸 자홍) */
const TINT: Record<string, string> = { silk: PINK, pungryu: "#4affb0", leo: "#ffd040", onyx: VIOLET, fenrir: "#8ad8ff", eclipse: "#ff8a3c", thorken: "#4a8aff", levia: "#9af0ff", tail: "#3cffd8", madQueen: "#ff3c8a" };

export class CyberFx extends TigerFx {
  protected override ringColor = CYAN;
  private side = 0;

  protected override accentOf(c: string): string {
    return TINT[c] ?? CYAN;
  }

  protected override stepAt(x: number, y: number, a: number): void {
    this.side++;
    this.add({ kind: "foot", x, y, vx: 0, vy: 0, life: 70, size: 1, rot: a, color: this.side % 2 ? CYAN : PINK });
    if (Math.random() < 0.4) this.add({ kind: "dust", x: x + rand(-2, 2), y: y + rand(-1, 1), vx: rand(-0.2, 0.2), vy: rand(-0.3, -0.1), life: 14, size: 1, rot: 0, color: this.accent });
  }

  /** 전기 불꽃 n개 (짧은 선) */
  private sparks(x: number, y: number, n: number, speed: number, color = VOLT): void {
    for (let i = 0; i < n; i++) {
      const a = rand(0, Math.PI * 2);
      const v = rand(0.6, 1.5) * speed;
      this.add({ kind: "spark", x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: Math.floor(rand(8, 14)), size: 1, rot: a, color: i % 3 ? color : CHROME });
    }
  }

  /** 글리치 막대 (가로 줄이 색 갈라짐으로 번쩍) */
  private glitch(x: number, y: number, w: number, life: number): void {
    this.add({ kind: "wave", x, y, vx: 0, vy: 0, life, size: w, rot: 0, color: this.accent, flip: Math.random() < 0.5 });
  }

  protected override hitAt(x: number, y: number, r: number): void {
    this.hits++;
    this.sparks(x, y, 4, 1.4);
    this.add({ kind: "flash", x, y, vx: 0, vy: 0, life: 7, size: Math.max(9, r + 6), rot: 0, color: this.hits % 2 ? CYAN : PINK });
    const n = Math.random() < 0.3 ? 1 : 2;
    for (let i = 0; i < n; i++) this.glitch(x + rand(-r, r) * 0.4, y + rand(-r, r) * 0.6, Math.max(10, Math.min(26, r * 2.2)) * rand(0.7, 1.1), 8 + i * 2);
  }

  protected override ko(x: number, y: number, r: number, boss: boolean): void {
    // 몸이 픽셀로 흩어져 위로 사라짐
    for (let i = 0; i < (boss ? 60 : 22); i++) {
      const a = rand(0, Math.PI * 2);
      const d = rand(0, r);
      this.add({ kind: "dust", x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, vx: rand(-0.15, 0.15), vy: rand(-0.7, -0.2), life: Math.floor(rand(24, boss ? 80 : 46)), size: rand(1, 2.5), rot: 0, color: [CYAN, PINK, VIOLET, this.accent][i % 4]! });
    }
    for (let i = 0; i < (boss ? 5 : 2); i++) this.glitch(x + rand(-r, r), y + rand(-r, r), r * 2 + 8, 10 + i * 3);
    this.sparks(x, y, boss ? 14 : 6, 2.2);
    this.ringAt(x, y, r + 10, CYAN);
    this.add({ kind: "flash", x, y, vx: 0, vy: 0, life: boss ? 24 : 12, size: r + (boss ? 30 : 14), rot: 0, color: PINK });
    if (boss) this.add({ kind: "seal", x, y: y - r - 10, vx: 0, vy: -0.05, life: 90, size: 1, rot: 0, color: PINK, text: "DELETED" });
  }

  protected override idleAura(x: number, y: number): void {
    // 0·1 코드 조각이 떠오름 · 바닥에서 네온 불티
    if (Math.random() < 0.3) this.add({ kind: "glint", x: x + rand(-30, 30), y: y + rand(-10, 10), vx: 0, vy: rand(-0.5, -0.25), life: 40, size: Math.random() < 0.5 ? 0 : 1, rot: 0, color: Math.random() < 0.6 ? CYAN : this.accent });
    if (Math.random() < 0.35) this.add({ kind: "dust", x: x + rand(-14, 14), y: y + rand(2, 8), vx: 0, vy: rand(-0.7, -0.3), life: 26, size: 1, rot: 0, color: Math.random() < 0.5 ? PINK : CYAN });
  }

  protected override powerUp(x: number, y: number): void {
    this.add({ kind: "pillar", x, y, vx: 0, vy: 0, life: 44, size: 18, rot: 0, color: CYAN });
    for (const [size, c] of [[22, CYAN], [32, PINK], [42, VIOLET], [52, this.accent]] as const) this.ringAt(x, y, size, c);
    this.sparks(x, y - 16, 18, 2.6);
    this.add({ kind: "text", x, y: y - 20, vx: 0, vy: -0.25, life: 60, size: 1, rot: 0, color: CYAN, text: this.hooks.powerText });
    this.hooks.roar(true);
  }

  protected override muzzle(x: number, y: number, a: number): void {
    this.add({ kind: "flash", x: x + Math.cos(a) * 6, y: y + Math.sin(a) * 6, vx: 0, vy: 0, life: 5, size: 7, rot: 0, color: CYAN });
    this.sparks(x + Math.cos(a) * 6, y + Math.sin(a) * 6, 3, 1.2, this.accent);
    this.hooks.roar(false);
  }

  protected override clawAt(x: number, y: number, a: number): void {
    this.add({ kind: "slash", x, y, vx: 0, vy: 0, life: 9, size: 15, rot: a, color: PINK });
    this.add({ kind: "slash", x: x + Math.cos(a) * 2, y: y + Math.sin(a) * 2 + 1, vx: 0, vy: 0, life: 9, size: 15, rot: a, color: CYAN });
    this.glitch(x + Math.cos(a) * 10, y + Math.sin(a) * 10, 18, 9);
    this.hooks.roar(false);
  }
}
