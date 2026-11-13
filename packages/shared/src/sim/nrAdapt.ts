// 아슈바르(느아르·루주) 적응력(진영 특징): 적을 쓰러뜨리면 흑이 참(풋내기 경험치와 같은 양) → 가득 차면 레벨업(공격력·체력·방어력·재생력) + 강화 한 번
// 강화(입력 statPick): 1 기본 공격 · 2 추가 공격 · 3 승격 · 4~7 스킬 1~4 · 확률로 성공, 실패하면 다음 확률 +5% (성공하면 처음 확률)
// 제약(기본 패시브): 일반 방에서는 아이템·패시브를 못 얻음 (비밀방·시련의 방은 됨) · 대장장이·성좌·쉼터 회복 못 씀 · 재생 가속
import { NR_ADAPT as A, NR_LIMIT, NR_RANKS } from "../itemsNoir";
import { SWARM } from "../swarmDefs";
import type { ExtraStats } from "../characters";
import type { StatMod } from "../stats";
import type { RoomType } from "./floor";
import { recalcStats } from "./items";
import { expOf, expToNext } from "./novice";
import { isAshvar, nrRoll } from "./nrKit";
import { pilgrimRoom } from "./pilgrim";
import type { EnemyState, PickupKind, RunState } from "./types";
import { addEffect } from "./util";

type P = RunState["player"];

/** 강화 칸 (statPick 번호) */
export const NR_UP = { base: 1, extra: 2, rank: 3, skill: 4 } as const;

/** 쓰러뜨린 적의 흑 받기 (느아르만 · 패왕전 빼고) */
export function nrGain(s: RunState, e: EnemyState): void {
  const p = s.player;
  if (!isAshvar(p) || s.pvp) return;
  p.nrLv ??= 1;
  p.nrExp = (p.nrExp ?? 0) + expOf(e) * (s.swarm ? SWARM.limits.noviceExp : 1);
  let up = false;
  while (p.nrExp >= expToNext(p.nrLv)) {
    p.nrExp -= expToNext(p.nrLv);
    p.nrLv++;
    p.nrPts = (p.nrPts ?? 0) + 1;
    up = true;
  }
  if (!up) return;
  recalcStats(s);
  addEffect(s, { kind: "nrLevel", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 26, maxTicks: 30, follow: true });
}

/** 지금 성공 확률 (못 누르면 null: 다 올렸거나 · 대악마 조건이 안 됨) */
export function nrChance(p: P, what: number): number | null {
  const fail = (i: number) => (p.nrFail?.[i] ?? 0) * A.failAdd;
  if (what === NR_UP.base || what === NR_UP.extra) {
    const st = (what === NR_UP.base ? p.nrBase : p.nrExtra) ?? 1;
    return st >= 4 ? null : Math.min(1, A.stage[st - 1]! + fail(what - 1));
  }
  if (what === NR_UP.rank) {
    const rk = p.nrRank ?? 0;
    if (rk >= 3) return null;
    if (rk === 2 && ((p.nrBase ?? 1) < A.archNeed || (p.nrExtra ?? 1) < A.archNeed)) return null;
    return Math.min(1, A.rank[rk]! + fail(6));
  }
  const i = what - NR_UP.skill;
  if (i < 0 || i > 3 || p.nrSkillUp?.[i]) return null;
  return Math.min(1, A.skill + fail(2 + i));
}

/** 강화 한 번 (남은 횟수를 하나 씀) */
export function nrUpgrade(s: RunState, what: number): void {
  const p = s.player;
  if (!isAshvar(p) || (p.nrPts ?? 0) <= 0) return;
  const c = nrChance(p, what);
  if (c === null) return;
  p.nrPts = (p.nrPts ?? 0) - 1;
  const fails = (p.nrFail ??= [0, 0, 0, 0, 0, 0, 0]);
  const slot = what === NR_UP.rank ? 6 : what >= NR_UP.skill ? 2 + what - NR_UP.skill : what - 1;
  const ok = nrRoll(s, "nrUp") < c;
  p.nrLast = { t: s.tick, what, ok };
  if (!ok) {
    fails[slot] = (fails[slot] ?? 0) + 1;
    addEffect(s, { kind: "nrUpFail", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 20, maxTicks: 24, follow: true });
    return;
  }
  fails[slot] = 0;
  if (what === NR_UP.base) p.nrBase = (p.nrBase ?? 1) + 1;
  else if (what === NR_UP.extra) p.nrExtra = (p.nrExtra ?? 1) + 1;
  else if (what === NR_UP.rank) p.nrRank = (p.nrRank ?? 0) + 1;
  else (p.nrSkillUp ??= [false, false, false, false])[what - NR_UP.skill] = true;
  addEffect(s, { kind: what === NR_UP.rank ? "nrRankUp" : "nrUpOk", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 30, maxTicks: 36, follow: true });
  recalcStats(s);
}

type RankRow = (typeof NR_RANKS)["mid"];
/** 지금 계급까지 쌓인 승격 능력치 (중위 · 고위 · 대악마 차례) */
const rankRows = (p: P): RankRow[] => Object.values(NR_RANKS).slice(0, p.nrRank ?? 0);

/** 레벨·승격으로 오른 공격력·최대 체력 (능력치 계산 items.recalcStats) */
export function noirMods(p: P): StatMod[] {
  if (!isAshvar(p)) return [];
  const lv = (p.nrLv ?? 1) - 1;
  const ranks = rankRows(p);
  const sum = (f: (r: RankRow) => number) => ranks.reduce((a, r) => a + f(r), 0);
  const out: StatMod[] = [];
  const dmg = A.lvDmg * lv + sum((r) => r.dmg);
  const hp = A.lvHp * lv + sum((r) => r.hp);
  if (dmg) out.push({ stat: "damage", add: dmg });
  if (hp) out.push({ stat: "maxHp", add: hp });
  if (sum((r) => r.dmgMul)) out.push({ stat: "damage", mul: 1 + sum((r) => r.dmgMul) });
  if (sum((r) => r.hpMul)) out.push({ stat: "maxHp", mul: 1 + sum((r) => r.hpMul) });
  return out;
}

/** 레벨·승격으로 오른 방어력·재생력 (sim/baseStats.extraOf) */
export function noirExtras(p: P): Partial<ExtraStats> | null {
  if (!isAshvar(p) || ((p.nrLv ?? 1) <= 1 && !p.nrRank)) return null;
  const lv = (p.nrLv ?? 1) - 1;
  const ranks = rankRows(p);
  return { defense: A.lvDef * lv + ranks.reduce((a, r) => a + r.def, 0), regen: A.lvRegen * lv + ranks.reduce((a, r) => a + r.regen, 0) };
}

/** 재생 가속: 재생력 회복 배율 */
export const noirRegenMul = (p: P) => (isAshvar(p) ? NR_LIMIT.regenMul : 1);

/** 제약: 아이템·패시브를 얻을 수 있는 방 (비밀방·히든 상점·시련의 방) */
const OPEN: readonly RoomType[] = ["trial", "devil", "gamble", "auction", "hidden"];

/** 제약: 이 방에 무기·사용 아이템·패시브를 놓지 않음 */
export function noirBlocksPickup(s: RunState, roomId: number, kind: PickupKind): boolean {
  if (!isAshvar(s.player) || (kind !== "weapon" && kind !== "use" && kind !== "passive")) return false;
  const type = s.map.rooms[roomId]?.type;
  return !(type && OPEN.includes(type)) && roomId !== pilgrimRoom(s);
}

/** 제약: 대장장이·성좌의 방은 비어 있음 · 쉼터(보스 앞 회복의 방) 회복 없음 */
export const noirBlocksRoom = (s: RunState, type: RoomType) => isAshvar(s.player) && (type === "forge" || type === "altar" || type === "rest");
