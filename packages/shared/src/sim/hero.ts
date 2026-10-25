// 영웅의 길 (혼자 하기): 13단계. 1~4단계는 1단계 보스 · 5~8은 2단계 · 9~12는 3단계 보스
// (네 단계 묶음마다 앞 두 단계는 보스 1마리, 뒤 두 단계는 서로 다른 보스 2마리가 함께) · 13단계는 랜덤 라스트 보스.
// 층(s.floor)은 1~13 그대로 쓰고 (시드가 겹치지 않게), 적·보스 세기는 depth로 보통 판 1~6층(+라스트 보스 층)에 맞춤
import { BOSS_TIERS, LAST_BOSSES, type BossKind } from "../content";
import { createRng, deriveSeed } from "../rng";
import { LAST_FLOOR } from "./floor";
import type { EnemyState, RunState } from "./types";

/** 전체 단계 수 · 보스 단계 하나에 묶인 단계 수 · 보스 2마리 단계의 체력 배율 (한 마리마다) */
export const HERO_FLOORS = 13;
const GROUP = 4;
const PAIR_HP = 0.8;

/** 라스트 보스 층 번호 (보통 판 7층 · 영웅의 길 13단계) */
export const lastFloorOf = (s: RunState) => (s.hero ? HERO_FLOORS : LAST_FLOOR);

/** 적·보스 세기에 쓰는 층: 보통 판은 층 그대로, 영웅의 길은 1→1 · 12→6.5 · 13→라스트 보스 층 */
export function depth(s: RunState): number {
  if (!s.hero) return s.floor;
  return s.floor >= HERO_FLOORS ? LAST_FLOOR : (s.floor + 1) / 2;
}

/** 이 단계의 보스들 (시드로 섞어 앞에서 1마리 또는 2마리) */
export function heroBosses(s: RunState): BossKind[] {
  const tier = [...BOSS_TIERS[Math.min(BOSS_TIERS.length - 1, Math.floor((s.floor - 1) / GROUP))]!];
  const rng = createRng(deriveSeed(s.seed, "hero", s.floor));
  for (let i = tier.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [tier[i], tier[j]] = [tier[j]!, tier[i]!];
  }
  return tier.slice(0, (s.floor - 1) % GROUP < 2 ? 1 : 2);
}

/** 보스 2마리 단계면 한 마리마다 체력을 조금 줄임 */
export function heroPair(list: EnemyState[]): EnemyState[] {
  if (list.length < 2) return list;
  for (const e of list) e.hp = e.maxHp = Math.round(e.maxHp * PAIR_HP);
  return list;
}

/** 계단: 12단계까지는 다음 단계, 12단계 다음은 랜덤 라스트 보스 (13단계), 13단계를 깨면 완료 */
export function heroNext(s: RunState, startFloor: (s: RunState, floor: number) => void): void {
  if (s.floor >= HERO_FLOORS) {
    s.won = true;
    s.over = true;
    return;
  }
  if (s.floor === HERO_FLOORS - 1) s.lastBoss = createRng(deriveSeed(s.seed, "hero", "last")).pick(LAST_BOSSES);
  startFloor(s, s.floor + 1);
}
