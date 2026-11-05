// 게임 상태가 바뀐 것을 보고 빛 효과를 만듦: 적 맞음 불티 · 치명타 별빛 · 처치 폭발·충격파 · 보스 처치 큰 빛 · 탄 꼬리 빛 · 큰 공격 빛 · 내가 맞으면 붉은 테두리
import { ENEMIES, type EffectState, type RunState } from "@pixel-rogue/shared";
import type { GlowCues } from "./glowCanvas";
import { hexColor, type GlowParts } from "./glowParts";

/** 처치 폭발 색 (적 종류마다 하나로 정해짐) */
const DEATH_COLORS = [0xff7a3c, 0xffc53c, 0x7cf0ff, 0xc77dff, 0x7dff9a, 0xff5c8a];
const HIT = 0xffe2a8;
const CRIT = 0xfff3c4;
const MY_SHOT = 0x8fe9ff;
const FOE_SHOT = 0xff4d6d;
/** 크게 빛나는 공격 효과 종류 */
const BIG_FX = new Set<string>(["blast", "burst", "meteor", "slam", "bolt", "pillar", "holy", "bmBoom", "afBlast", "hdMeteor", "titanSmash", "renCrush", "tagMeteor", "vyMeteor", "mnBoom", "elBang", "oPillar", "imBoom", "stBurst", "plBurst", "smBurst"]);
/** 한 화면에 그리는 탄 꼬리 최대 수 */
const MAX_TRAILS = 70;

function hashColor(kind: string): number {
  let h = 0;
  for (let i = 0; i < kind.length; i++) h = (h * 31 + kind.charCodeAt(i)) | 0;
  return DEATH_COLORS[Math.abs(h) % DEATH_COLORS.length]!;
}


export class GlowWatch {
  private hp = new Map<number, number>();
  private crit = new Map<number, number>();
  private last = new Map<number, { x: number; y: number; r: number; kind: string; boss: boolean }>();
  private seenFx = new WeakSet<EffectState>();
  private kills = -1;
  private room = -1;
  private myHp = -1;

  /** noPlayer: 내 체력을 보지 않음 (타워 디펜스는 run.player가 공격자마다 바뀜) */
  constructor(private noPlayer = false) {}

  /** 이번 화면에서 바뀐 것을 효과로 */
  observe(s: RunState, parts: GlowParts, cues: GlowCues): void {
    // 방이 바뀌면 지난 방 기록은 버림 (적이 한꺼번에 사라져도 터지지 않게)
    if (s.roomId !== this.room) {
      this.room = s.roomId;
      this.hp.clear();
      this.crit.clear();
      this.last.clear();
      this.kills = s.kills;
      parts.clear();
    }
    this.enemies(s, parts, cues);
    this.trails(s, parts);
    this.bigFx(s, parts);
    if (this.noPlayer) return;
    const hp = s.player.hp;
    if (this.myHp >= 0 && hp < this.myHp - 0.01) cues.hurt = Math.min(1, cues.hurt + 0.35 + ((this.myHp - hp) / Math.max(1, s.player.stats.maxHp)) * 2);
    this.myHp = hp;
  }

  private enemies(s: RunState, parts: GlowParts, cues: GlowCues): void {
    const now = new Set<number>();
    for (const e of s.enemies) {
      now.add(e.id);
      const before = this.hp.get(e.id);
      this.hp.set(e.id, e.hp);
      const boss = ENEMIES[e.kind]?.boss === true;
      this.last.set(e.id, { x: e.x, y: e.y, r: e.r, kind: e.kind, boss });
      const critNew = e.critTick !== undefined && e.critTick !== this.crit.get(e.id);
      if (e.critTick !== undefined) this.crit.set(e.id, e.critTick);
      if (before === undefined || e.hp >= before - 0.001) continue;
      // 독·불 같은 지속 피해는 불티를 내지 않음 (너무 많아짐)
      if (!critNew && e.dotTick === s.tick) continue;
      const share = (before - e.hp) / Math.max(1, e.maxHp);
      if (critNew) {
        parts.spawn(e.x, e.y, { life: 0.22, s0: e.r * 3, s1: e.r * 5, color: CRIT, alpha: 0.9 });
        parts.burst(e.x, e.y, 10, 170, CRIT, 0.4, 2.6);
      } else parts.burst(e.x, e.y, Math.min(8, 3 + Math.round(share * 20)), 120, HIT, 0.3, 1.8);
    }
    // 사라진 적: 처치 수가 늘었을 때만 처치로 봄 (방 이동·보스가 데려간 졸개는 조용히)
    let killed = this.kills >= 0 ? Math.max(0, s.kills - this.kills) : 0;
    this.kills = s.kills;
    for (const [id, e] of this.last) {
      if (now.has(id)) continue;
      this.last.delete(id);
      this.hp.delete(id);
      this.crit.delete(id);
      if (killed <= 0 && !e.boss) continue;
      killed--;
      if (e.boss) this.bossDeath(e.x, e.y, e.r, parts, cues);
      else this.death(e.x, e.y, e.r, hashColor(e.kind), parts);
    }
  }

  private death(x: number, y: number, r: number, color: number, parts: GlowParts): void {
    parts.spawn(x, y, { life: 0.3, s0: r * 4, s1: r * 7, color, alpha: 0.8 });
    parts.spawn(x, y, { kind: "ring", life: 0.4, s0: r * 2, s1: r * 9, color, alpha: 0.9 });
    parts.burst(x, y, 16, 220, color, 0.55, 2.4);
    parts.burst(x, y, 6, 90, 0xffffff, 0.35, 1.6);
  }

  private bossDeath(x: number, y: number, r: number, parts: GlowParts, cues: GlowCues): void {
    cues.flash = 1;
    parts.spawn(x, y, { life: 0.9, s0: r * 6, s1: r * 16, color: 0xfff1c1, alpha: 1 });
    for (let i = 0; i < 3; i++) parts.spawn(x, y, { kind: "ring", life: 0.6 + i * 0.25, s0: r * 2, s1: r * (16 + i * 8), color: i === 1 ? 0xffb347 : 0xfff1c1 });
    parts.burst(x, y, 60, 360, 0xffc53c, 1.1, 3.2);
    parts.burst(x, y, 30, 180, 0xffffff, 0.8, 2.2);
  }

  private trails(s: RunState, parts: GlowParts): void {
    let n = 0;
    for (const p of s.projectiles) {
      if (n++ >= MAX_TRAILS) break;
      // 내 편(패왕전 편 0 포함)은 하늘색, 적은 붉게 · 보스 탄은 더 크게
      const mine = p.fromPlayer || p.pwTeam === 0;
      const big = !mine && p.by !== undefined && ENEMIES[p.by]?.boss === true ? 1.6 : 1;
      parts.spawn(p.x, p.y, { life: 0.14, s0: Math.max(3, p.r * 3.2) * big, s1: 1, color: mine ? MY_SHOT : FOE_SHOT, alpha: mine ? 0.55 : 0.7 });
    }
  }

  private bigFx(s: RunState, parts: GlowParts): void {
    for (const fx of s.effects) {
      if (this.seenFx.has(fx)) continue;
      this.seenFx.add(fx);
      if (!BIG_FX.has(fx.kind)) continue;
      const size = Math.max(6, Math.min(80, fx.size || 10));
      const color = hexColor(fx.tint, 0xffb347);
      parts.spawn(fx.x, fx.y, { life: 0.35, s0: size * 1.6, s1: size * 2.6, color, alpha: 0.85 });
      parts.spawn(fx.x, fx.y, { kind: "ring", life: 0.4, s0: size * 0.6, s1: size * 2.4, color, alpha: 0.8 });
      parts.burst(fx.x, fx.y, 10, 160 + size * 2, color, 0.5, 2.2);
    }
  }
}
