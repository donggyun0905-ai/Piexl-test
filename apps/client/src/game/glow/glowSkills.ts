// 게임 화면 빛 (2): 각성·필살기·궁극기 · 보스 궁극기 기 모음 · 회복·보호막 · 돈 줍기 · 바닥 아이템 빛 · 아이템 주움 · 용암 불티
// 상태를 읽기만 함 (glowWatch와 같은 방식). 꾸밈이라 Math.random을 씀
import type { RunState } from "@pixel-rogue/shared";
import type { GlowCues } from "./glowCanvas";
import { FxSeen } from "./fxSeen";
import { ULT_FX } from "./glowKinds";
import type { GlowParts } from "./glowParts";

/** 각성 꼬리표(motif) → 빛 색 (글자 안에 이 말이 있으면) */
const MOTIF: [string, number][] = [
  ["ice", 0x9fe8ff], ["frost", 0x9fe8ff], ["fire", 0xff7a3c], ["flame", 0xff7a3c], ["poison", 0x8dff6a], ["light", 0xfff1a8],
  ["holy", 0xfff1a8], ["thunder", 0xffe84a], ["bolt", 0xffe84a], ["spirit", 0x9dffd8], ["dark", 0xb07dff], ["death", 0xc77dff],
  ["earth", 0xe0a85a], ["water", 0x5ac8ff], ["sharp", 0xffffff], ["hard", 0xd8d8e8], ["wind", 0xb8ffe0], ["luck", 0xffd84a],
  ["summon", 0xc0a0ff], ["blood", 0xff3b5c],
];
const GOLD = 0xffd84a;

const motifColor = (m: string | undefined): number => {
  const k = (m ?? "").toLowerCase();
  for (const [w, c] of MOTIF) if (k.includes(w)) return c;
  return 0xfff1c1;
};

export class GlowSkills {
  private seen = new FxSeen();
  private ult = new Map<number, number>();
  private picks = new Map<number, { x: number; y: number; kind: string }>();
  private room = -1;
  private hp = -1;
  private shield = 0;
  private gold = -1;
  private n = 0;

  /** noPlayer: 회복·보호막·돈 빛을 끔 (타워 디펜스) */
  constructor(private noPlayer = false) {}

  observe(s: RunState, parts: GlowParts, cues: GlowCues): void {
    this.n++;
    if (s.roomId !== this.room) {
      this.room = s.roomId;
      this.picks.clear();
      this.ult.clear();
    }
    this.effects(s, parts, cues);
    this.bossUlts(s, parts, cues);
    if (!this.noPlayer) this.player(s, parts);
    this.pickups(s, parts);
    this.lava(s, parts);
  }

  /** 각성·필살기: 꼬리표 색 빛기둥 + 고리 + 위로 솟는 불티 */
  private effects(s: RunState, parts: GlowParts, cues: GlowCues): void {
    for (const fx of this.seen.fresh(s)) {
      if (fx.kind === "coinGet") {
        parts.burst(fx.x, fx.y, 6, 70, GOLD, 0.4, 1.6);
        continue;
      }
      if (!ULT_FX.has(fx.kind)) continue;
      const color = fx.kind === "awaken" ? motifColor(fx.motif) : 0xfff1c1;
      const size = Math.max(14, Math.min(70, fx.size || 20));
      parts.spawn(fx.x, fx.y, { life: 0.7, s0: size * 1.5, s1: size * 3, color, alpha: 0.9 });
      parts.spawn(fx.x, fx.y, { kind: "ring", life: 0.6, s0: size * 0.5, s1: size * 3.5, color });
      parts.spawn(fx.x, fx.y, { kind: "ring", life: 0.9, s0: size, s1: size * 5, color: 0xffffff, alpha: 0.6 });
      for (let i = 0; i < 18; i++) {
        const ox = (Math.random() - 0.5) * size;
        parts.spawn(fx.x + ox, fx.y, { kind: "spark", vx: ox * 0.5, vy: -120 - Math.random() * 160, life: 0.6 + Math.random() * 0.4, s0: 2.6, s1: 0.6, drag: 1.5, color });
      }
      cues.flash = Math.max(cues.flash, fx.kind === "awaken" ? 0.35 : 0.5);
    }
  }

  /** 보스 궁극기 시작: 붉은 기 모음(안으로 빨려 드는 불티) + 고리 */
  private bossUlts(s: RunState, parts: GlowParts, cues: GlowCues): void {
    for (const e of s.enemies) {
      const at = e.ultAt;
      if (at === undefined || this.ult.get(e.id) === at) continue;
      this.ult.set(e.id, at);
      parts.spawn(e.x, e.y, { life: 1, s0: e.r * 10, s1: e.r * 3, color: 0xff3b3b, alpha: 0.7 });
      parts.spawn(e.x, e.y, { kind: "ring", life: 0.8, s0: e.r * 14, s1: e.r * 2, color: 0xff5c3c });
      for (let i = 0; i < 28; i++) {
        const a = Math.random() * Math.PI * 2;
        const d = e.r * (5 + Math.random() * 6);
        parts.spawn(e.x + Math.cos(a) * d, e.y + Math.sin(a) * d, { kind: "spark", vx: -Math.cos(a) * d * 1.6, vy: -Math.sin(a) * d * 1.6, life: 0.6, s0: 2.4, s1: 0.8, color: 0xff8a5c });
      }
      cues.flash = Math.max(cues.flash, 0.3);
    }
  }

  /** 회복: 초록 빛이 위로 · 보호막 켜짐: 하늘색 고리 · 돈이 늘면 금빛 반짝 */
  private player(s: RunState, parts: GlowParts): void {
    const p = s.player;
    if (this.hp >= 0 && p.hp > this.hp + 0.5 && p.hp > 0) {
      const n = Math.min(10, 3 + Math.round(((p.hp - this.hp) / Math.max(1, p.stats.maxHp)) * 30));
      for (let i = 0; i < n; i++) parts.spawn(p.x + (Math.random() - 0.5) * 12, p.y + Math.random() * 6, { vy: -30 - Math.random() * 30, life: 0.7, s0: 3, s1: 1, color: 0x6dff8a, alpha: 0.8 });
    }
    this.hp = p.hp;
    if (p.shieldTicks > 0 && this.shield <= 0) parts.spawn(p.x, p.y, { kind: "ring", life: 0.5, s0: 28, s1: 10, color: 0x7cd8ff });
    this.shield = p.shieldTicks;
    if (this.gold >= 0 && s.gold > this.gold) parts.burst(p.x, p.y - 4, 5, 60, GOLD, 0.35, 1.5);
    this.gold = s.gold;
    // 어두운 장면(태초의 어둠 유령에 닿음 · 추적자 암습): 내 둘레만 작은 등불 빛 (깜깜한 갓이터 구역은 그대로 깜깜하게)
    if ((p.darkTicks ?? 0) > 0 || p.trAmbush) parts.steady(p.x, p.y, 34, 0xffd9a0, 0.3);
  }

  /** 바닥 무기·패시브 빛은 아이템 테두리에서 (drawPickup) · 여기서는 사라지면(주움) 반짝 터짐만 */
  private pickups(s: RunState, parts: GlowParts): void {
    const now = new Set<number>();
    for (const pk of s.rooms[s.roomId]?.pickups ?? []) {
      now.add(pk.id);
      if (!this.picks.has(pk.id)) this.picks.set(pk.id, { x: pk.x, y: pk.y, kind: pk.kind });
    }
    for (const [id, pk] of this.picks) {
      if (now.has(id)) continue;
      this.picks.delete(id);
      if (pk.kind === "coin" || pk.kind === "trash") continue;
      parts.spawn(pk.x, pk.y, { kind: "ring", life: 0.35, s0: 4, s1: 22, color: 0xfff1c1 });
      parts.burst(pk.x, pk.y, 10, 120, 0xffe08a, 0.45, 2);
    }
  }

  /** 용암: 가끔 불티가 피어오름 */
  private lava(s: RunState, parts: GlowParts): void {
    const t = s.terrain;
    if (!t || t.room !== s.roomId || this.n % 3 !== 0) return;
    for (const [x, y, w, h] of t.lava) {
      if (Math.random() > Math.min(0.9, (w * h) / 900)) continue;
      parts.spawn(x + Math.random() * w, y + Math.random() * h, { vx: (Math.random() - 0.5) * 10, vy: -12 - Math.random() * 18, life: 0.9, s0: 2.2, s1: 0.5, color: Math.random() < 0.5 ? 0xff7a2a : 0xffc04a, alpha: 0.9 });
    }
  }
}
