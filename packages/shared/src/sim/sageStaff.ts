// 제천대성 몸 갈래 ② 여의봉 10가지 (꼬리·주먹 10가지와 같은 갈래에서 무작위)
// 길게 찌르기 · 한 바퀴 휘두르기 · 내려찍기 · 세 갈래 찌르기 · 쏟아지는 여의봉 · 던져 튕기기 · X자 · 땅 울림 파동
// 크게 키워 맵 전체 휘두르기 (맵이 금빛으로 세 번 깜박인 다음 박자에 대시) · "여의봉을 크기를 최대한 늘립니다!" 즉사기 (제천대성 몸 가까이 붙어야 삶)
import { shotDamage } from "./bossKit";
import { throughDash } from "./bossGrip";
import { addWave } from "./bossWaves";
import { damagePlayer } from "./combat";
import { rot } from "./orbit";
import { hz, sageDmg, sageRange, sageRng } from "./sageKit";
import type { EnemyState, RunState } from "./types";
import { addEffect, enemyShot, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  THRUST_LEN: 280,
  SLAM_LEN: 220,
  SLAM_W: 16,
  SPIN_R: 95,
  PILLARS: 6,
  CROSS_LEN: 160,
  /** 맵 전체 휘두르기: 첫 깜박임 · 깜박임 사이 (세 번 깜박인 다음 박자) · 피한 것으로 치는 대시 남은 틱 · 피해 배율 */
  SWEEP_FIRST: 30,
  SWEEP_BLINK: 20,
  SWEEP_DODGE: 4,
  SWEEP_MUL: 2,
  /** 즉사기: 문구가 뜨고 터지기까지 · 살 수 있는 거리(몸 반경에 더함) */
  MAX_WARN: 200,
  MAX_SAFE: 34,
};
export { R as SAGE_STAFF_RULES };

/** 화면용: 맵 전체 휘두르기 박자 · 즉사기 예고 · 살 수 있는 거리 */
export const SAGE_SWEEP = { first: R.SWEEP_FIRST, blink: R.SWEEP_BLINK };
export const SAGE_MAX_WARN = R.MAX_WARN;
export const SAGE_MAX_SAFE = R.MAX_SAFE;
const sweepHit = () => R.SWEEP_FIRST + 3 * R.SWEEP_BLINK;

type Vec = readonly [number, number];
const toward = (s: RunState, e: EnemyState): Vec => normalize(s.player.x - e.x, s.player.y - e.y) ?? [1, 0];
const turned = (d: Vec, a: number): Vec => {
  const r = rot(a);
  return [d[0] * r[0] - d[1] * r[1], d[0] * r[1] + d[1] * r[0]];
};

function staffLine(s: RunState, e: EnemyState, d: Vec, len: number, width: number, warn: number, mul = 1): void {
  const l = len * sageRange(e);
  hz(s, e, warn, { x: e.x, y: e.y, radius: 0, toX: e.x + d[0] * l, toY: e.y + d[1] * l, width, damage: sageDmg(s, e, mul), fx: "stab" });
}

/** 여의봉 공격 10가지 (마지막이 즉사기): 시작하고 걸리는 틱을 돌려줌 */
export const STAFF_MOVES: readonly ((s: RunState, e: EnemyState) => number)[] = [
  // 길게 찌르기
  (s, e) => (staffLine(s, e, toward(s, e), R.THRUST_LEN, 8, 28), 30),
  // 한 바퀴 휘두르기
  (s, e) => (hz(s, e, 40, { x: e.x, y: e.y, radius: R.SPIN_R, damage: sageDmg(s, e, 1.1), arc: -1, fx: "bslash" }), 44),
  // 내려찍기: 굵은 한 줄
  (s, e) => (staffLine(s, e, toward(s, e), R.SLAM_LEN, R.SLAM_W, 34, 1.3), 38),
  // 세 갈래 찌르기 (차례로)
  (s, e) => {
    const d = toward(s, e);
    [-0.35, 0, 0.35].forEach((a, i) => staffLine(s, e, turned(d, a), R.THRUST_LEN, 8, 24 + i * 12));
    return 50;
  },
  // 쏟아지는 여의봉: 방을 세로로 가르는 줄이 차례로
  (s, e) => {
    const rng = sageRng(s, e, "pillar");
    for (let i = 0; i < R.PILLARS; i++) {
      const x = ROOM_MIN_X + 10 + rng.nextFloat() * (ROOM_MAX_X - ROOM_MIN_X - 20);
      hz(s, e, 30 + i * 10, { x, y: ROOM_MIN_Y, radius: 0, toX: x, toY: ROOM_MAX_Y, width: 10, damage: sageDmg(s, e), fx: "stab" }, i * 10);
    }
    return 90;
  },
  // 던진 여의봉: 빙글빙글 돌며 벽에 튕김
  (s, e) => {
    const d = toward(s, e);
    Object.assign(enemyShot(s, e.x, e.y, d[0], d[1], 2.6, shotDamage(s) * 1.5), { look: "staff" as const, r: 8, bounces: 2, ticksLeft: 150, stay: true, owner: e.id });
    return 40;
  },
  // X자: 플레이어를 지나는 두 대각선
  (s, e) => {
    const p = s.player;
    for (const [a, b] of [[1, 1], [1, -1]] as const) {
      const l = R.CROSS_LEN * sageRange(e);
      hz(s, e, 34, { x: p.x - a * l * 0.7, y: p.y - b * l * 0.7, radius: 0, toX: p.x + a * l * 0.7, toY: p.y + b * l * 0.7, width: 9, damage: sageDmg(s, e), fx: "stab" });
    }
    return 38;
  },
  // 땅 울림: 원형 파동 셋 (대시로 넘음)
  (s, e) => {
    for (let i = 0; i < 3; i++) addWave(e, e.x, e.y, 14 + i * 26, 1.9, 320 * sageRange(e), sageDmg(s, e));
    hz(s, e, 14, { x: e.x, y: e.y, radius: e.r * 2, damage: sageDmg(s, e), fx: "meteor" });
    return 70;
  },
  // 맵 전체 휘두르기
  (s, e) => {
    e.sage!.bAct = "sweep";
    e.sage!.bAt = s.tick;
    return sweepHit() + 10;
  },
  // 즉사기: 여의봉을 최대로 늘림 (가만히 서서)
  (s, e) => {
    e.sage!.bAct = "max";
    e.sage!.bAt = s.tick;
    addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 30, maxTicks: 20 });
    return R.MAX_WARN + 20;
  },
];

/** 여의봉 갈래의 이어지는 공격 (맵 전체 휘두르기 · 즉사기). 맡았으면 true */
export function staffTick(s: RunState, e: EnemyState): boolean {
  const g = e.sage!;
  const t = s.tick - g.bAt!;
  const p = s.player;
  if (g.bAct === "sweep") {
    if (t === sweepHit()) {
      // 박자에 맞춰 대시하면 피함 (대시 무적만으로는 안 됨)
      if (p.dashTicks < R.SWEEP_DODGE) throughDash(s, () => damagePlayer(s, sageDmg(s, e, R.SWEEP_MUL)));
      addEffect(s, { kind: "burst", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 90, maxTicks: 18 });
    }
    if (t >= sweepHit()) delete g.bAct;
    return true;
  }
  if (g.bAct === "max") {
    if (t === R.MAX_WARN) {
      // 제천대성 몸 가까이 있지 않으면 즉사
      if (Math.hypot(p.x - e.x, p.y - e.y) > e.r + R.MAX_SAFE) p.hp = 0;
      addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 160, maxTicks: 24 });
    }
    if (t >= R.MAX_WARN) delete g.bAct;
    return true;
  }
  return false;
}
