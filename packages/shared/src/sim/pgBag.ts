// 차원의 순례자 배낭: 수집 도감(들어 본 순례자 무기 → 공격력) · 맞히기(열쇠고리·처치 효과: 기념품·차원 도장) · 땅에 놓인 것(깃발·태엽 폭탄·별·차원의 문)
// · 탄이 맞았을 때(씨앗 회복·별 가루) · 받는 피해(우산·그림엽서) · 맞은 뒤(텐트). 수치는 weaponsPilgrim.PILGRIM, 아이템은 itemsPilgrim
import { srcRun, srcFn } from "./dmgSrc";
import { WEAPONS, type WeaponId } from "../content";
import { PILGRIM_PERKS as K } from "../itemsPilgrim";
import { createRng, deriveSeed } from "../rng";
import type { StatMod } from "../stats";
import { PILGRIM as P } from "../weaponsPilgrim";
import { healPlayer } from "./combat";
import { addPickup } from "./loot";
import { inCircle, isBoss, strike as strike_ } from "./s2Kit";
import type { GroundMark } from "./secretTypes";
import type { EnemyState, PlayerState, ProjectileState, RunState } from "./types";
import { addEffect, hasPerk, weaponOf } from "./util";
const strike = srcFn("pgBag", () => strike_);

/** 순례자 무기 (도감 순서) */
export const PG_IDS = (Object.keys(WEAPONS) as WeaponId[]).filter((id) => (WEAPONS[id] as { curio?: unknown }).curio);

export const pgRnd = (s: RunState, ...tags: (string | number)[]) => createRng(deriveSeed(s.seed, "pg", s.tick, ...tags)).nextFloat();

/** 화면용: 도감 칸 수 */
export const pilgrimBook = (p: PlayerState) => p.pgBook?.length ?? 0;

/** 지금 든 순례자 무기를 도감에 적음 */
/** 든 무기를 도감에 남김 (새로 남기면 true → 능력치 다시 계산) */
export function recordBook(p: PlayerState): boolean {
  const id = p.weaponId;
  if (!weaponOf(p).curio) return false;
  p.pgBook ??= [];
  if (p.pgBook.includes(id)) return false;
  p.pgBook.push(id);
  return true;
}

/** 도감 공격력 배율 (수집 일지: 두 배로 오름) */
export const bookMul = (p: PlayerState) => 1 + pilgrimBook(p) * P.bookDmg * (hasPerk(p, "pgJournal") ? K.pgJournal.mul : 1);

/** 도감 공격 범위 배율 (모든 수집품의 사거리·범위) */
export const areaMul = (p: PlayerState) => (p.characterId === "pilgrim" ? 1 + pilgrimBook(p) * P.bookArea : 1);

/** 도감 공격력·사거리는 능력치에 바로 반영 (능력치 창에서 보이게, recalcStats) */
export const pilgrimMods = (p: PlayerState): StatMod[] =>
  p.characterId === "pilgrim" && pilgrimBook(p) ? [{ stat: "damage", mul: bookMul(p) }, { stat: "range", mul: areaMul(p) }] : [];

/** 순례자가 맞힘: 보스(열쇠고리) · 처치하면 기념품·도장 */
export function hitE(s: RunState, e: EnemyState, dmg: number, push = 0): void {
  if (e.hp <= 0) return;
  strike(s, e, dmg * (isBoss(e) && hasPerk(s.player, "pgKeyring") ? K.pgKeyring.mul : 1), push);
  if (e.hp <= 0) onKill(s, e);
}

/** 처치: 여행 기념품(확률로 체력) · 차원 도장(다 모으면 아직 없는 순례자 무기가 떨어짐) */
function onKill(s: RunState, e: EnemyState): void {
  const p = s.player;
  if (hasPerk(p, "pgSouvenir") && pgRnd(s, "sv", e.id) < K.pgSouvenir.chance) {
    healPlayer(s, K.pgSouvenir.heal);
    addEffect(s, { kind: "pgHeal", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 10, maxTicks: 20 });
  }
  if (!hasPerk(p, "pgStamp")) return; return srcRun(s, "pgStamp", () => {
  p.pgStamps = (p.pgStamps ?? 0) + 1;
  if (p.pgStamps < K.pgStamp.need) return;
  p.pgStamps = 0;
  const left = PG_IDS.filter((id) => !p.pgBook?.includes(id) && id !== p.weaponId);
  const id = left[Math.floor(pgRnd(s, "stamp") * left.length)];
  if (id) addPickup(s, s.roomId, "weapon", id, e.x, e.y);
}); }

/** 땅에 놓기 (kind: flag 깃발 · gate 차원의 문 · gear 태엽 폭탄 · meteor 별) */
export function placeMark(s: RunState, kind: string, x: number, y: number, r: number, dmg: number, t: number): void {
  (s.player.pgMarks ??= []).push({ x, y, t, r, dmg, kind });
  addEffect(s, { kind: "pgPlant", x, y, dirX: 0, dirY: 0, size: r, maxTicks: 14 });
}

/** 틱마다: 깃발·문은 간격마다 지짐(문은 끌어당김) · 폭탄·별은 다 되면 터짐 */
export function marksTick(s: RunState): void {
  const p = s.player;
  if (!p.pgMarks?.length) return;
  for (const m of p.pgMarks) {
    m.t--;
    const r = m.r ?? 30;
    if (m.kind === "gate") {
      for (const e of inCircle(s, m.x, m.y, r)) {
        if (isBoss(e)) continue;
        const d = Math.hypot(m.x - e.x, m.y - e.y) || 1;
        e.x += ((m.x - e.x) / d) * Math.min(d, P.gatePull);
        e.y += ((m.y - e.y) / d) * Math.min(d, P.gatePull);
      }
    }
    if ((m.kind === "flag" || m.kind === "gate") && m.t % P.zoneGap === 0) for (const e of inCircle(s, m.x, m.y, r)) hitE(s, e, m.dmg ?? 0);
    if ((m.kind === "gear" || m.kind === "meteor") && m.t <= 0) {
      for (const e of inCircle(s, m.x, m.y, r)) hitE(s, e, m.dmg ?? 0);
      addEffect(s, { kind: m.kind === "gear" ? "pgBlast" : "pgFall", x: m.x, y: m.y, dirX: 0, dirY: 0, size: r, maxTicks: 20 });
    }
  }
  p.pgMarks = p.pgMarks.filter((m: GroundMark) => m.t > 0);
}

/** 순례자 탄이 맞았을 때 (s2Hits, 피해는 이미 들어감): 씨앗 회복 · 별 가루 · 보스(열쇠고리) · 처치 효과 */
export function pilgrimShotHit(s: RunState, pr: ProjectileState, e: EnemyState): void {
  const p = s.player;
  if (pr.spirit === "pgSeed") healPlayer(s, p.stats.maxHp * P.seedHeal);
  if (isBoss(e) && hasPerk(p, "pgKeyring")) srcRun(s, "pgKeyring", () => strike(s, e, pr.damage * (K.pgKeyring.mul - 1)));
  if (hasPerk(p, "pgStarDust")) srcRun(s, "pgStarDust", () => {
    for (const f of inCircle(s, e.x, e.y, K.pgStarDust.r)) if (f !== e) hitE(s, f, pr.damage * K.pgStarDust.mul);
    addEffect(s, { kind: "pgRing", x: e.x, y: e.y, dirX: 0, dirY: 0, size: K.pgStarDust.r, maxTicks: 10, tint: "#ffe8a0" });
  });
  if (e.hp <= 0) onKill(s, e);
}

/** 받는 피해 (우산을 들면 · 그림엽서는 도감 다섯 칸마다) · combat classTaken */
export function pilgrimTaken(p: PlayerState): number {
  if (p.characterId !== "pilgrim") return 1;
  const card = hasPerk(p, "pgPostcard") ? 1 - Math.floor(pilgrimBook(p) / K.pgPostcard.per) * K.pgPostcard.cut : 1;
  return Math.max(0.5, card) * (weaponOf(p).curio?.mode === "umbrella" ? P.umbrellaTaken : 1);
}

/** 맞은 뒤: 접이식 텐트 (확률로 잠깐 무적) · combat afterHurt */
export function pilgrimHurt(s: RunState): void {
  const p = s.player;
  if (!hasPerk(p, "pgTent") || pgRnd(s, "tent") >= K.pgTent.chance) return;
  p.invulnTicks = Math.max(p.invulnTicks, K.pgTent.ticks);
  addEffect(s, { kind: "pgHeal", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 14, maxTicks: 24, tint: "#c8a8ff" });
}
