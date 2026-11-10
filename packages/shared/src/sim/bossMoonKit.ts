// 달을 삼키는 자 새 패턴 둘 (sim/bossMoonEater에서 부름):
// ① 초승달 낫: 사람 쪽 부채꼴 세 번 (좌·우·가운데 차례로, 조금씩 늦게 터짐)
// ② 월광 낙하 (대시로 못 피함): 짧은 간격으로 사람이 선 자리에 달빛이 연달아 떨어짐 → 대시 무적으로는 못 버티고 계속 움직여야 함
import { half, hitDamage } from "./bossKit";
import { addShape } from "./hazards";
import { rot } from "./orbit";
import { eachSeat } from "./party";
import type { EnemyState, RunState } from "./types";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 초승달 낫: 범위 · 부채꼴 cos · 첫 예고 틱 · 다음 낫까지 틱 · 옆으로 트는 각도(라디안) · 피해 배율 */
  REAP_R: 104,
  REAP_ARC: 0.55,
  REAP_WARN: 30,
  REAP_GAP: 16,
  REAP_TURN: 0.55,
  REAP_MUL: 1.1,
  /** 월광 낙하: 떨어지는 수 (체력 절반 아래) · 간격 틱 · 예고 틱 · 범위 · 피해 배율 */
  FALLS: 8,
  FALLS_HALF: 11,
  FALL_GAP: 11,
  FALL_WARN: 30,
  FALL_R: 22,
  FALL_MUL: 0.75,
};
export { R as BOSS_MOON_KIT_RULES };

type Vec = readonly [number, number];
const turn = (d: Vec, a: number): Vec => {
  const [c, s] = rot(a);
  return [d[0] * c - d[1] * s, d[0] * s + d[1] * c];
};

/** 초승달 낫 시작 (세 번을 한꺼번에 예고, 차례로 터짐) · 끝나는 틱 */
export function startReap(s: RunState, e: EnemyState, toP: Vec): number {
  const dmg = Math.round(hitDamage(s) * R.REAP_MUL);
  [-R.REAP_TURN, R.REAP_TURN, 0].forEach((a, i) => {
    const d = turn(toP, a);
    addShape(s, R.REAP_WARN + i * R.REAP_GAP, { x: e.x, y: e.y, radius: R.REAP_R, damage: dmg, dirX: d[0], dirY: d[1], arc: R.REAP_ARC, fx: "scythe", owner: e.id }, i * R.REAP_GAP);
  });
  e.phase = "charge";
  e.timer = R.REAP_WARN + R.REAP_GAP * 2 + 6;
  return e.timer;
}

/** 월광 낙하 시작 */
export function startMoonfall(e: EnemyState): void {
  e.phase = "volley";
  e.step = half(e) ? R.FALLS_HALF : R.FALLS;
  e.timer = 0;
}

/** 월광 낙하 진행 (끝나면 false): 간격마다 사람마다 지금 선 자리에 하나씩 (대시 무적으로도 맞음) */
export function moonfallTick(s: RunState, e: EnemyState): boolean {
  if (e.timer > 0) return true;
  if ((e.step ?? 0) <= 0) return false;
  e.step = (e.step ?? 0) - 1;
  e.timer = R.FALL_GAP;
  const dmg = Math.round(hitDamage(s) * R.FALL_MUL);
  eachSeat(s, () => addShape(s, R.FALL_WARN, { x: s.player.x, y: s.player.y, radius: R.FALL_R, damage: dmg, noDodge: true, fx: "pillar", owner: e.id }), true);
  return true;
}
