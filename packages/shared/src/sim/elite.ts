// 강한 적 방(주황 방)의 정예 몬스터: 가장 센 몇 마리가 정예 (크고 단단함 · 조금 빠르고 공격 주기 빠름)
// 방에 정예만 남으면(주변 졸개를 다 잡으면) 정예가 풀려 보통 몬스터로 돌아감 (체력 비율은 그대로) · 땅 물고기 정예는 체력은 조금, 공격력은 많이
// 방패 가디언 정예는 체력 조금·공격 주기 더 빠름 · 바위 골렘 정예는 체력 그대로·내려치기 범위 큼
import { ENEMIES } from "../content";
import type { EnemyState, RunState } from "./types";
import { addEffect } from "./util";
import { hiddenOn } from "./hiddenFoes";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 강한 적 방의 모든 몬스터 체력 배율 */
  ROOM_HP: 1.6,
  /** 정예 수: 기본 + 층(4층마다 1) */
  CHAMPS: 2,
  /** 정예 체력 배율 · 층마다 정예만 더 붙는 체력 비율 (보통 몬스터의 층 증가와 따로, 낮게) */
  CHAMP_HP: 2.2,
  CHAMP_HP_PER_FLOOR: 0.06,
  /** 정예 몸 크기 배율 */
  CHAMP_SIZE: 1.25,
  /** 정예 이동 속도 배율 */
  CHAMP_SPEED: 1.2,
  /** 정예 공격 주기: 이 틱마다 한 번씩 공격 준비가 한 칸 더 빨리 참 (3 = 약 33% 빠름) */
  CHAMP_FAST_EVERY: 3,
  /** 땅 물고기 정예: 체력 배율(조금만) · 솟구침·착지 피해 배율(많이) */
  FISH_HP: 1.3,
  FISH_DMG: 2.2,
  /** 방패 가디언 정예: 체력 배율(조금만) · 공격 준비가 이 틱마다 한 칸 더 빨리 참 (2 = 약 50% 빠름) */
  GUARD_HP: 1.3,
  GUARD_FAST_EVERY: 2,
  /** 바위 골렘 정예: 체력 배율(그대로) · 내려치기 범위 배율 */
  GOLEM_HP: 1,
  GOLEM_SLAM: 1.5,
};
export { R as ELITE_RULES };

/** 강한 적 방의 몬스터 체력 배율 (rooms.spawnEnemies) */
export const eliteRoomHp = () => R.ROOM_HP;

/** 방에 나온 몬스터 중 가장 센 몇 마리를 정예로 (d = 깊이) */
export function makeChamps(out: EnemyState[], d: number): void {
  const n = R.CHAMPS + Math.floor(d / 4);
  for (const e of [...out].sort((a, b) => b.maxHp - a.maxHp || a.id - b.id).slice(0, n)) {
    const k = e.kind === "landfish" ? R.FISH_HP : e.kind === "guardian" ? R.GUARD_HP : e.kind === "golem" ? R.GOLEM_HP : R.CHAMP_HP * (1 + R.CHAMP_HP_PER_FLOOR * (d - 1));
    Object.assign(e, { hp: Math.round(e.maxHp * k), maxHp: Math.round(e.maxHp * k), r: Math.round(e.r * R.CHAMP_SIZE), champ: true, champK: k });
  }
}

/** 바위 골렘 정예 내려치기 범위 배율 (critters) */
export const golemSlamMul = (e: EnemyState) => (e.champ ? R.GOLEM_SLAM : 1);
/** 땅 물고기 정예 피해 배율 (stalkers.fishHit) */
export const fishDmgMul = (e: EnemyState) => (e.champ ? R.FISH_DMG : 1);

/** 틱마다 적 움직인 뒤 (enemies): 정예는 조금 더 멀리 · 공격 준비가 더 빨리 참 */
export function champMove(s: RunState, e: EnemyState, x0: number, y0: number): void {
  if (!e.champ) return;
  e.x = x0 + (e.x - x0) * R.CHAMP_SPEED;
  e.y = y0 + (e.y - y0) * R.CHAMP_SPEED;
  if (e.timer > 1 && s.tick % (e.kind === "guardian" ? R.GUARD_FAST_EVERY : R.CHAMP_FAST_EVERY) === 0) e.timer--;
}

/** 틱마다: 방에 정예만 남으면 정예가 풀림 (체력·크기를 보통으로, 남은 체력 비율은 그대로) */
export function champFade(s: RunState): void {
  const champs = s.enemies.filter((e) => e.champ && e.hp > 0);
  if (!champs.length || hiddenOn(s) || s.enemies.some((e) => !e.champ && e.hp > 0 && !e.noGold)) return;
  for (const e of champs) {
    const k = e.champK ?? R.CHAMP_HP;
    const ratio = e.hp / e.maxHp;
    e.maxHp = Math.max(1, Math.round(e.maxHp / k));
    e.hp = Math.max(1, Math.round(e.maxHp * ratio));
    e.r = ENEMIES[e.kind].radius;
    e.champ = false;
    addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 12, maxTicks: 18 });
  }
}
