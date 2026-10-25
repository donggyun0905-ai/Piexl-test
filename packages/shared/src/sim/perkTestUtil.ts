// 아이템 효과 테스트 도우미 (perks-*.test.ts가 같이 씀)
import { PASSIVES, type PassiveDef, type PassiveId } from "../items";
import { createRun, EMPTY_INPUT, stepSim, type EnemyState, type RunState } from "./index";

export const def = (id: string): PassiveDef => PASSIVES[id as PassiveId];
export const FIRE = { ...EMPTY_INPUT, aimX: 1000, attack: true };

export function enemy(id: number, x: number, y: number, hp = 9999): EnemyState {
  return { id, kind: "crawler", x, y, prevX: x, prevY: y, r: 5, hp, maxHp: hp, timer: 0, phase: "walk", dirX: 0, dirY: 0, hitFlash: 0, count: 0, noGold: false };
}

/** 떠돌이로 시작해 아이템을 가진 채, 적 없는 방 */
export function drifter(...perks: PassiveId[]): RunState {
  const run = createRun(3, "drifter");
  run.player.passives.push(...perks);
  run.enemies = [];
  return run;
}

export const run = (s: RunState, n: number, input = EMPTY_INPUT) => {
  for (let i = 0; i < n; i++) stepSim(s, input);
};

/** 파수꾼(근접)·마법사(마법탄)·음양사(부적)로 시작해 아이템을 가진 채, 적 없는 방 */
export function hero(c: "warden" | "mage" | "mystic", ...perks: PassiveId[]): RunState {
  const s = createRun(3, c);
  s.player.passives.push(...perks);
  s.enemies = [];
  // 방 가운데에서 (시작 자리는 아래쪽 벽 옆)
  s.player.y = s.player.prevY = 72;
  return s;
}
