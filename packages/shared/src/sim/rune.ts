// 마법사 마법 문양: 지금 무기 공격은 매직 미사일 같은 일반 공격(약하게), 공격할 때마다 발밑 마법진에 한 획씩 새겨지고
// 다 새겨지면 무기에 맞는 큰 마법이 가까운 적에게 떨어짐 (불꽃 폭발·번개·얼음·혜성·별비·그림자·공허 등)
import { ENEMIES, type WeaponId } from "../content";
import { blastAt, dotDamage, ignite } from "./combat";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, dist2, normalize, weaponOf } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 마법진이 완성되는 획 수 · 일반 공격 피해 배율 · 마법을 찾는 거리(사거리 배율) */
  STROKES: 6,
  NORMAL_MUL: 0.75,
  SEEK: 1.4,
  /** 마법: 반경 · 공격력 배율 (무기에 따라 아래 SPELLS가 덮어씀) */
  RADIUS: 40,
  MUL: 3.6,
  /** 불꽃: 불태움 배율 · 얼음: 둔화 틱 · 번개: 기절 틱(보스 절반) · 번개 수 · 공허: 빨아들이는 거리 */
  BURN: 1,
  CHILL: 120,
  STUN: 40,
  BOLTS: 3,
  PULL: 18,
  /** 서리 주문: 맞은 적에게 서리 피해 (공격력 배율) */
  CHILL_DMG: 0.3,
};
export { R as RUNE_RULES };

/** 마법 종류: nova 불꽃 폭발 · storm 번개 여러 줄기 · frost 얼음 · comet 혜성 · stars 별비 · void 공허(빨아들임) */
export type SpellKind = "nova" | "storm" | "frost" | "comet" | "stars" | "void";
interface Spell {
  kind: SpellKind;
  r: number;
  mul: number;
}

/** 무기마다 마법 (없는 무기는 불꽃 폭발) */
const SPELLS: Partial<Record<WeaponId, Spell>> = {
  emberstaff: { kind: "nova", r: 40, mul: 3.6 },
  flameglove: { kind: "nova", r: 34, mul: 3 },
  stormstaff: { kind: "storm", r: 22, mul: 2 },
  lightningrod: { kind: "storm", r: 18, mul: 1.8 },
  frostwand: { kind: "frost", r: 44, mul: 3 },
  cometstaff: { kind: "comet", r: 56, mul: 5 },
  starfall: { kind: "stars", r: 18, mul: 1.4 },
  triorb: { kind: "stars", r: 20, mul: 1.5 },
  shadowstaff: { kind: "void", r: 40, mul: 3.6 },
  voidorb: { kind: "void", r: 48, mul: 4 },
};
export { SPELLS as RUNE_SPELLS };

const isMage = (p: PlayerState) => p.characterId === "mage" && weaponOf(p).kind === "ranged";


/** 마법진에 새겨진 획 0~1 (화면용) */
export const runeFill = (p: PlayerState) => (p.characterId === "mage" ? (p.mgRune ?? 0) / R.STROKES : 0);

/** 지금 무기의 마법 */
export const spellOf = (p: PlayerState): Spell => SPELLS[p.weaponId] ?? { kind: "nova", r: R.RADIUS, mul: R.MUL };

/** 공격 한 번: 한 획 새김, 다 새기면 마법 (dmg = 약해지기 전 공격력). 돌려주는 값 = 일반 공격 피해 배율 (마법사만 약하게) */
export function runeStroke(s: RunState, dmg: number): number {
  const p = s.player;
  if (!isMage(p)) return 1;
  p.mgRune = (p.mgRune ?? 0) + 1;
  if (p.mgRune >= R.STROKES) {
    p.mgRune = 0;
    cast(s, dmg);
  }
  return R.NORMAL_MUL;
}

/** 가까운 적 (없으면 바라보는 쪽 앞) */
function target(s: RunState): { x: number; y: number } {
  const p = s.player;
  const reach = p.stats.range * R.SEEK;
  let best: EnemyState | null = null;
  for (const e of s.enemies) {
    if (e.hp <= 0 || e.immune || dist2(e, p) > (reach + e.r) ** 2) continue;
    if (!best || dist2(e, p) < dist2(best, p)) best = e;
  }
  return best ?? { x: p.x + p.faceX * p.stats.range * 0.6, y: p.y + p.faceY * p.stats.range * 0.6 };
}

/** 원 안의 산 적 */
const inside = (s: RunState, x: number, y: number, r: number) => s.enemies.filter((e) => e.hp > 0 && (e.x - x) ** 2 + (e.y - y) ** 2 <= (r + e.r) ** 2);

function cast(s: RunState, dmg: number): void {
  const p = s.player;
  const sp = spellOf(p);
  const at = target(s);
  const fx = (x: number, y: number, size: number) => addEffect(s, { kind: "mgSpell", x, y, dirX: 0, dirY: 0, size, maxTicks: 30, tint: sp.kind });
  addEffect(s, { kind: "mgSpell", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 18, maxTicks: 20, tint: "cast" });
  switch (sp.kind) {
    case "storm":
    case "stars": {
      // 여러 줄기가 적들 자리에 (모자라면 처음 자리 둘레에)
      const n = R.BOLTS + (sp.kind === "stars" ? 2 : 0);
      const list = inside(s, at.x, at.y, sp.r * 4).slice(0, n);
      for (let i = 0; i < n; i++) {
        const e = list[i];
        const x = e ? e.x : at.x + Math.cos(i * 2.1) * sp.r;
        const y = e ? e.y : at.y + Math.sin(i * 2.1) * sp.r;
        if (sp.kind === "storm") for (const t of inside(s, x, y, sp.r)) if (t.kind !== "dummy") t.stunTicks = Math.max(t.stunTicks ?? 0, ENEMIES[t.kind].boss ? R.STUN / 2 : R.STUN);
        blastAt(s, x, y, sp.r, dmg * sp.mul, { still: true });
        fx(x, y, sp.r);
      }
      return;
    }
    case "void":
      // 공허: 빨아들인 뒤 터짐
      for (const e of inside(s, at.x, at.y, sp.r * 1.6)) {
        if (ENEMIES[e.kind].boss) continue;
        const d = normalize(at.x - e.x, at.y - e.y);
        if (!d) continue;
        const step = Math.min(R.PULL, Math.sqrt(dist2(e, { x: at.x, y: at.y })));
        e.x += d[0] * step;
        e.y += d[1] * step;
      }
      break;
    default:
  }
  const hit = inside(s, at.x, at.y, sp.r);
  blastAt(s, at.x, at.y, sp.r, dmg * sp.mul, { still: true });
  for (const e of hit) {
    if (sp.kind === "nova" || sp.kind === "comet") ignite(e, dmg * R.BURN);
    if (sp.kind === "frost") dotDamage(s, e, "frost", dmg * R.CHILL_DMG);
    if (sp.kind === "frost" && !ENEMIES[e.kind].boss) e.slowTicks = Math.max(e.slowTicks ?? 0, R.CHILL);
  }
  fx(at.x, at.y, sp.r);
}
