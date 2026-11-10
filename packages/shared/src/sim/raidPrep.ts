// 레이드 준비·사용 아이템 (2026-11-09 사용자 요청)
// 사용 아이템: 써도 사라지지 않고 쿨타임 (회복약 10초 · 영약 1분 · 보호막 15초 · 얼음 세계 1분 · 폭탄 10초, 폭탄은 레이드용 큰 피해)
// 준비: 단련 포인트 되돌리기 · 대장간 처음부터 다시(999원, 3번, 암흑 강화로 부서진 무기도 돌려받음) · 단련의 방 샌드백(딜 시험, 쓰러지지 않음)
import { ROOM_CX as CX, ROOM_CY as CY } from "../constants";
import type { UseItemId } from "../items";
import { damageEnemy, removeDead } from "./combat";
import { GYM_STATS, gymPassives, PASSIVE_AT } from "./gym";
import { equipWeapon, recalcStats } from "./items";
import { EMPTY_HANDS } from "./shop";
import { RAID_ROOM } from "./raidTypes";
import type { RunState } from "./types";
import { accItemReset } from "./accStats";
import { addEffect, makeEnemy } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 쿨타임 (틱): 회복약 · 영약 · 보호막 · 얼음 세계 · 폭탄 · 그 밖 */
  CD_POTION: 600,
  CD_ELIXIR: 3600,
  CD_WARD: 900,
  CD_FROST: 3600,
  CD_BOMB: 600,
  CD_OTHER: 900,
  /** 레이드 폭탄: 피해 · 반지름 */
  BOMB_DMG: 1200,
  BOMB_R: 120,
  /** 대장간 처음부터 다시: 횟수 · 돌려받는 돈 */
  FORGE_RESETS: 3,
  FORGE_GOLD: 999,
};
export { R as RAID_PREP_RULES };

/** 입력 menu 기능 번호: 단련 포인트 되돌리기 (a = 단련 항목) · 대장간 처음부터 다시 */
export const RAID_OP = { gymDown: 25, forgeReset: 26 } as const;

/** 사용 아이템 쿨타임 (틱) */
export function raidCdOf(item: UseItemId): number {
  if (item === "potion") return R.CD_POTION;
  if (item === "elixir") return R.CD_ELIXIR;
  if (item === "ward") return R.CD_WARD;
  if (item === "frost") return R.CD_FROST;
  return item === "bomb" ? R.CD_BOMB : R.CD_OTHER;
}

/** 사용 아이템을 씀 (items.useSlot): 레이드가 아니면 칸을 비움 · 레이드면 쿨타임(아직이면 true = 쓰지 않음) · 레이드 폭탄은 여기서 터뜨림(true) */
export function spendUse(s: RunState, slot: number, item: UseItemId): boolean {
  const p = s.player;
  if (!s.raidBoss) {
    p.useSlots[slot] = null;
    return false;
  }
  const cd = (p.raidCd ??= []);
  if (s.tick < (cd[slot] ?? 0)) return true;
  // 장신구: 확률로 쿨타임 바로 끝 (얼음 세계 빼고)
  cd[slot] = accItemReset(s, item) ? s.tick : s.tick + raidCdOf(item);
  if (item !== "bomb") return false;
  for (const e of s.enemies) {
    const dx = e.x - p.x;
    const dy = e.y - p.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d <= R.BOMB_R + e.r) damageEnemy(s, e, R.BOMB_DMG, d === 0 ? 1 : dx / d, d === 0 ? 0 : dy / d);
  }
  removeDead(s);
  addEffect(s, { kind: "burst", x: p.x, y: p.y, dirX: 0, dirY: 0, size: R.BOMB_R, maxTicks: 20 });
  return true;
}

/** 칸마다 남은 쿨타임 비율 0~1 (화면) */
export function raidCdLeft(s: RunState, slot: number): number {
  const p = s.player;
  const item = p.useSlots[slot];
  const end = p.raidCd?.[slot] ?? 0;
  if (!s.raidBoss || !item || s.tick >= end) return 0;
  return (end - s.tick) / raidCdOf(item);
}

/** 창에서 누름: 단련 포인트 되돌리기 · 대장간 처음부터 다시 (레이드 준비 방에서만) */
export function raidPrepMenu(s: RunState, op: number, a: number): void {
  const p = s.player;
  if (!s.raidBoss) return;
  if (op === RAID_OP.gymDown && s.roomId === RAID_ROOM.gym && p.gym) {
    const key = a < PASSIVE_AT ? GYM_STATS[a] : (() => {
      const id = gymPassives(p)[a - PASSIVE_AT];
      return id ? `p:${id}` : undefined;
    })();
    if (!key || (p.gym.lv[key] ?? 0) <= 0) return;
    p.gym.lv[key]!--;
    if (!p.gym.lv[key]) delete p.gym.lv[key];
    p.gym.pts++;
    recalcStats(s);
  } else if (op === RAID_OP.forgeReset && s.roomId === RAID_ROOM.forge && (p.raidResets ?? 0) < R.FORGE_RESETS) {
    p.raidResets = (p.raidResets ?? 0) + 1;
    p.forge = undefined;
    p.retag = undefined;
    p.forgeFree = undefined;
    p.forgePaid = undefined;
    // 암흑 강화로 부서진 무기를 돌려받음 (대장간에 처음 들어온 것처럼, 그 뒤 다른 무기를 들었으면 그대로)
    if (p.raidLostWeapon && p.weaponId === EMPTY_HANDS) equipWeapon(s, p.raidLostWeapon);
    p.raidLostWeapon = undefined;
    s.gold = R.FORGE_GOLD;
    recalcStats(s);
    addEffect(s, { kind: "burst", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 20, maxTicks: 20 });
  }
}

/** 대장간 처음부터 다시 남은 횟수 (화면) */
export const raidResetsLeft = (s: RunState) => (s.raidBoss ? R.FORGE_RESETS - (s.player.raidResets ?? 0) : 0);

/** 샌드백 자리 (단련의 방 오른쪽) */
const BAG_AT = () => [CX + 90, CY + 10] as const;

/** 틱마다 (sim/raidLife): 단련의 방 샌드백 (방을 정리한 뒤 놓음, 체력이 반 아래면 다시 채움) */
export function raidPrepTick(s: RunState): void {
  if (s.roomId !== RAID_ROOM.gym || !s.rooms[s.roomId]?.cleared) return;
  const bag = s.enemies.find((e) => e.kind === "dummy");
  if (bag) {
    if (bag.hp < bag.maxHp / 2) bag.hp = bag.maxHp;
    return;
  }
  const [x, y] = BAG_AT();
  const e = makeEnemy(s, "dummy", x, y, 1, 0);
  e.anchor = [x, y];
  s.enemies.push(e);
}
