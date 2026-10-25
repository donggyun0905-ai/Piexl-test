// 범 풍류(한정 스킨) 효과: 게임 상태 변화를 보고 화면 전용 조각을 만듦 (게임 계산·결과와 상관없음, 꾸밈이라 Math.random을 씀)
// 맞힘 → 금빛 불꽃·호랑이 발톱 자국 · 처치 → 먹·금가루로 흩어짐(보스는 K.O 도장) · 걸음 → 발자국 · 가만히 → 백호 기운
// 무기·패시브 얻음 → 금빛 기둥·파동·글자 · 휘두르기 → 큰 발톱 · 쏘기 → 불꽃 고리. 그리기는 tigerDraw
import { ENEMIES, type RunState } from "@pixel-rogue/shared";
import { ACCENT, FUR, GOLD, INK } from "./tigerArt";

/** 여름 파도(summerFx)가 더 씀: drop 물방울 · bubble 거품 · wave 물결 자국 · foot 맨발 자국 · glint 햇빛 반짝임 */
export type PartKind = "spark" | "dust" | "petal" | "paw" | "claw" | "ring" | "pillar" | "text" | "seal" | "drop" | "bubble" | "wave" | "foot" | "glint";

export interface Part {
  kind: PartKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** 남은 틱 · 처음 틱 */
  life: number;
  max: number;
  size: number;
  /** 방향(라디안) */
  rot: number;
  color: string;
  text?: string;
  /** 발톱 자국: 줄 수(1~3) · 좌우 뒤집기 */
  claws?: number;
  flip?: boolean;
}

const MAX_PARTS = 420;
/** 같은 적은 이만큼(틱) 안에 다시 맞아도 불꽃을 또 만들지 않음 */
const HIT_GAP = 5;
/** 발자국 사이 거리 */
const STEP = 7;
/** 이만큼 가만히 있으면 백호 기운이 차오르기 시작 · 다 차는 틱 */
export const IDLE_START = 30;
export const IDLE_FULL = 70;

export const rand = (a: number, b: number) => a + Math.random() * (b - a);

export interface TigerHooks {
  /** 강해졌을 때 글자 */
  powerText: string;
  roar: (big: boolean) => void;
  /** 켠 효과 (한정 스킨이면 전부, 아니면 이벤트 상점에서 장착한 것): 타격 · 대기 · 걸음 · 자는 백호 장면 */
  on: { hit: boolean; idle: boolean; walk: boolean; rest: boolean };
}

export class TigerFx {
  parts: Part[] = [];
  idle = 0;
  /** 대기 효과가 다 찬 뒤 지난 틱 (울음은 한 번만) */
  private roared = false;
  private hp = new Map<number, { hp: number; x: number; y: number; r: number; boss: boolean }>();
  private lastHit = new Map<number, number>();
  private where = "";
  private stepX = 0;
  private stepY = 0;
  private stepSide = 1;
  private items = "";
  private weapon = "";
  private shotId = 0;
  private swings = 0;
  accent = GOLD;
  /** 누워 자는 백호 그림을 그렸는지 (그렸을 때만 서 있는 몸을 숨김) */
  sleepReady = false;

  constructor(protected hooks: TigerHooks) {}

  get on() {
    return this.hooks.on;
  }

  /** 맞힐 때마다 바뀌는 발톱 자국 (방향 번갈아 · 각도 · 크기 · 가끔 살짝 한두 줄만) */
  protected hits = 0;

  protected add(p: Omit<Part, "max">): void {
    this.parts.push({ ...p, max: p.life });
    if (this.parts.length > MAX_PARTS) this.parts.shift();
  }

  observe(s: RunState): void {
    const p = s.player;
    this.accent = this.accentOf(p.characterId);
    const where = `${s.floor}/${s.roomId}`;
    const fresh = where !== this.where;
    if (fresh) {
      this.where = where;
      this.hp.clear();
      this.parts = this.parts.filter((x) => x.kind === "text");
      this.stepX = p.x;
      this.stepY = p.y;
    }
    // 맞힘 · 처치 (싸우는 중이면 대기 기운을 끔)
    let busy = false;
    const seen = new Set<number>();
    for (const e of s.enemies) {
      seen.add(e.id);
      const before = this.hp.get(e.id);
      if (before && e.hp < before.hp) busy = true;
      if (before && e.hp < before.hp && this.on.hit && s.tick - (this.lastHit.get(e.id) ?? -99) >= HIT_GAP) {
        this.lastHit.set(e.id, s.tick);
        this.hitAt(e.x, e.y, e.r);
      }
      this.hp.set(e.id, { hp: e.hp, x: e.x, y: e.y, r: e.r, boss: !!ENEMIES[e.kind].boss });
    }
    for (const [id, e] of this.hp) {
      if (seen.has(id)) continue;
      this.hp.delete(id);
      this.lastHit.delete(id);
      if (!fresh && this.on.hit) this.ko(e.x, e.y, e.r, e.boss);
    }
    // 걸음 · 가만히
    const moved = Math.hypot(p.x - p.prevX, p.y - p.prevY);
    const shot = s.projectiles.reduce((m, x) => (x.fromPlayer ? Math.max(m, x.id) : m), 0);
    const swings = s.effects.filter((e) => e.kind === "swing" || e.kind === "scratch" || e.kind === "cleave");
    if (shot > this.shotId || swings.length > this.swings) busy = true;
    this.idle = moved < 0.05 && !busy && !s.over ? this.idle + 1 : 0;
    if (Math.hypot(p.x - this.stepX, p.y - this.stepY) >= STEP) {
      const a = Math.atan2(p.y - this.stepY, p.x - this.stepX);
      this.stepSide = -this.stepSide;
      if (this.on.walk) this.stepAt(p.x - Math.sin(a) * 2 * this.stepSide, p.y + p.r - 1 + Math.cos(a) * 2 * this.stepSide, a);
      this.stepX = p.x;
      this.stepY = p.y;
    }
    if (this.idle >= IDLE_START && this.on.idle) this.idleAura(p.x, p.y);
    if (this.idle >= IDLE_FULL && !this.roared && this.on.idle) {
      this.roared = true;
      this.hooks.roar(true);
      this.ringAt(p.x, p.y, 34, this.ringColor);
    }
    if (this.idle === 0) this.roared = false;
    // 무기·패시브를 얻음
    const items = `${p.passives.length}`;
    if (this.on.hit && ((this.items && Number(items) > Number(this.items)) || (this.weapon && this.weapon !== p.weaponId))) this.powerUp(p.x, p.y);
    this.items = items;
    this.weapon = p.weaponId;
    // 쏘기 · 휘두르기
    if (shot > this.shotId && !fresh && this.on.hit) this.muzzle(p.x, p.y, Math.atan2(p.faceY, p.faceX));
    this.shotId = Math.max(this.shotId, shot);
    if (swings.length > this.swings && this.on.hit) {
      const e = swings[swings.length - 1]!;
      // 휘두른 자국은 내 바로 앞에 (맞힌 적 위에는 맞힘 자국이 따로 생김)
      this.clawAt(p.x, p.y, Math.atan2(e.dirY, e.dirX));
    }
    this.swings = swings.length;
    // 조각 움직이기
    for (const x of this.parts) {
      x.x += x.vx;
      x.y += x.vy;
      x.life--;
      if (x.kind === "dust" || x.kind === "bubble") x.vy -= 0.02;
      if (x.kind === "drop") x.vy += 0.09;
      if (x.kind === "petal") x.vx = Math.sin((x.life + x.size * 10) / 8) * 0.25;
      if (x.kind === "spark") {
        x.vx *= 0.9;
        x.vy *= 0.9;
      }
    }
    this.parts = this.parts.filter((x) => x.life > 0);
  }

  /** 테마마다 바꿔 씀 (summerFx) */
  protected ringColor = GOLD;
  protected accentOf(c: string): string {
    return ACCENT[c as keyof typeof ACCENT] ?? GOLD;
  }
  protected stepAt(x: number, y: number, a: number): void {
    this.add({ kind: "paw", x, y, vx: 0, vy: 0, life: 70, size: 1, rot: a, color: GOLD });
  }

  protected hitAt(x: number, y: number, r: number): void {
    // 불씨 몇 개 + 발톱 자국
    for (let i = 0; i < 4; i++) {
      const a = rand(0, Math.PI * 2);
      const v = rand(0.6, 1.6);
      this.add({ kind: "spark", x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 10, size: 1, rot: a, color: i % 2 ? "#ff6a2a" : "#ffb040" });
    }
    this.hits++;
    const light = Math.random() < 0.3;
    const size = Math.max(10, Math.min(22, r * 2)) * (light ? rand(0.55, 0.75) : rand(0.85, 1.15));
    this.add({
      kind: "claw",
      x: x + rand(-r, r) * 0.4,
      y: y + rand(-r, r) * 0.4,
      vx: 0,
      vy: 0,
      life: light ? 9 : 12,
      size,
      rot: rand(-1.3, -0.3) + (Math.random() < 0.2 ? Math.PI / 2 : 0),
      color: GOLD,
      claws: light ? (Math.random() < 0.5 ? 1 : 2) : 3,
      flip: this.hits % 2 === 0,
    });
  }

  protected ko(x: number, y: number, r: number, boss: boolean): void {
    const n = boss ? 70 : 28;
    for (let i = 0; i < n; i++) {
      const a = rand(0, Math.PI * 2);
      const d = rand(0, r);
      this.add({ kind: "dust", x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, vx: Math.cos(a) * rand(0.1, 0.6), vy: rand(-0.6, -0.1), life: Math.floor(rand(24, boss ? 80 : 46)), size: rand(1, 3), rot: 0, color: [INK, GOLD, FUR, this.accent][i % 4]! });
    }
    this.ringAt(x, y, r + 8, INK);
    this.add({ kind: "paw", x, y: y + r * 0.3, vx: 0, vy: 0, life: 40, size: boss ? 3 : 2, rot: -Math.PI / 2, color: GOLD });
    if (boss) this.add({ kind: "seal", x, y: y - r - 8, vx: 0, vy: -0.05, life: 90, size: 1, rot: 0, color: "#d8283a", text: "K.O" });
  }

  protected ringAt(x: number, y: number, size: number, color: string): void {
    this.add({ kind: "ring", x, y, vx: 0, vy: 0, life: 18, size, rot: 0, color });
  }

  protected idleAura(x: number, y: number): void {
    // 매화 꽃잎이 흩날림
    if (Math.random() < 0.25) this.add({ kind: "petal", x: x + rand(-40, 40), y: y - rand(30, 50), vx: 0, vy: rand(0.25, 0.5), life: 90, size: Math.random(), rot: 0, color: Math.random() < 0.5 ? "#ffb0c8" : "#fff0f4" });
    // 금빛 기운이 솟음
    if (Math.random() < 0.5) this.add({ kind: "spark", x: x + rand(-14, 14), y: y + rand(0, 6), vx: 0, vy: rand(-0.8, -0.3), life: 30, size: 1, rot: 0, color: Math.random() < 0.6 ? GOLD : this.accent });
  }

  protected powerUp(x: number, y: number): void {
    this.add({ kind: "pillar", x, y, vx: 0, vy: 0, life: 40, size: 16, rot: 0, color: GOLD });
    this.ringAt(x, y, 26, GOLD);
    this.ringAt(x, y, 40, this.accent);
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      this.add({ kind: "spark", x, y, vx: Math.cos(a) * 2.2, vy: Math.sin(a) * 2.2, life: 22, size: 1, rot: a, color: i % 2 ? GOLD : FUR });
    }
    this.add({ kind: "text", x, y: y - 18, vx: 0, vy: -0.25, life: 60, size: 1, rot: 0, color: GOLD, text: this.hooks.powerText });
    this.hooks.roar(true);
  }

  protected muzzle(x: number, y: number, a: number): void {
    for (let i = 0; i < 4; i++) {
      const b = a + rand(-0.6, 0.6);
      this.add({ kind: "spark", x: x + Math.cos(a) * 6, y: y + Math.sin(a) * 6, vx: Math.cos(b) * rand(0.8, 1.6), vy: Math.sin(b) * rand(0.8, 1.6), life: 9, size: 1, rot: b, color: i % 2 ? GOLD : this.accent });
    }
    this.hooks.roar(false);
  }

  protected clawAt(x: number, y: number, a: number): void {
    this.add({ kind: "claw", x: x + Math.cos(a) * 9, y: y + Math.sin(a) * 9, vx: 0, vy: 0, life: 12, size: 16, rot: a - Math.PI / 2 - 0.5, color: this.accent });
    this.hooks.roar(false);
  }
}
