// 제천대성 몸 갈래 ② 여의봉 10가지 (꼬리·주먹 10가지와 같은 갈래에서 무작위)
// 길게 찌르기(끝 폭발) · 두 바퀴 휘두르기 · 수직 내려찍기(바위 파편·파동·갈라지는 땅) · 세 갈래 찌르기 · 쏟아지는 여의봉 · 셋 던져 튕기기 · X자(가운데 폭발) · 땅 울림(솟는 땅)
// 크게 키워 맵 전체 휘두르기 (맵이 금빛으로 세 번 깜박인 다음 박자에 대시) · "여의봉을 크기를 최대한 늘립니다!" 즉사기 (제천대성 몸 가까이 붙어야 삶)
import { shotDamage } from "./bossKit";
import { throughDash } from "./bossGrip";
import { addWave } from "./bossWaves";
import { damagePlayer } from "./combat";
import { rot } from "./orbit";
import { hz, later, sageDmg, sageRange, sageRng } from "./sageKit";
import type { EnemyState, RunState } from "./types";
import { addEffect, enemyShot, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  THRUST_LEN: 280,
  SLAM_R: 50,
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

/** 여의봉이 뻗어 나가는 한 줄 (화면은 진짜 여의봉으로 그림) · 끝에서 바위 파편 */
function staffLine(s: RunState, e: EnemyState, d: Vec, len: number, width: number, warn: number, mul = 1, rocks = 0): void {
  const l = len * sageRange(e);
  const tx = clampX(e.x + d[0] * l);
  const ty = clampY(e.y + d[1] * l);
  hz(s, e, warn, { x: e.x, y: e.y, radius: 0, toX: tx, toY: ty, width, damage: sageDmg(s, e, mul), fx: "staff" });
  if (rocks) later(s, e, warn, "rocks", tx, ty, rocks);
}

const clampX = (x: number) => Math.max(ROOM_MIN_X, Math.min(ROOM_MAX_X, x));
const clampY = (y: number) => Math.max(ROOM_MIN_Y, Math.min(ROOM_MAX_Y, y));

/** 여의봉 공격 10가지 (마지막이 즉사기): 시작하고 걸리는 틱을 돌려줌 */
export const STAFF_MOVES: readonly ((s: RunState, e: EnemyState) => number)[] = [
  // 길게 찌르기 → 끝에서 터지며 바위 파편
  (s, e) => {
    const d = toward(s, e);
    staffLine(s, e, d, R.THRUST_LEN, 8, 28, 1, 8);
    const l = R.THRUST_LEN * sageRange(e);
    hz(s, e, 38, { x: clampX(e.x + d[0] * l), y: clampY(e.y + d[1] * l), radius: 30, damage: sageDmg(s, e), fx: "meteor" });
    return 42;
  },
  // 두 바퀴 휘두르기 (바퀴마다 흙더미가 사방으로)
  (s, e) => {
    for (const w of [40, 66]) {
      hz(s, e, w, { x: e.x, y: e.y, radius: R.SPIN_R, damage: sageDmg(s, e, 1.1), arc: -1, fx: "staffSpin" });
      later(s, e, w, "rocks", e.x, e.y, 12);
    }
    return 70;
  },
  // 수직 내려찍기: 하늘에서 거대한 여의봉이 플레이어 자리에 꽂힘 → 바위 파편 · 파동 · 양옆으로 갈라지는 땅
  (s, e) => {
    const p = s.player;
    const r = R.SLAM_R;
    hz(s, e, 40, { x: p.x, y: p.y - 70, radius: 0, toX: p.x, toY: p.y, width: R.SLAM_W, damage: sageDmg(s, e, 1.3), fx: "staff" });
    hz(s, e, 40, { x: p.x, y: p.y, radius: r, damage: sageDmg(s, e, 1.3), fx: "meteor" });
    later(s, e, 40, "rocks", p.x, p.y, 14);
    later(s, e, 40, "wave", p.x, p.y);
    for (const sx of [-1, 1]) hz(s, e, 56, { x: p.x, y: p.y, radius: 0, toX: p.x + sx * 140, toY: p.y + (sx * 10), width: 7, damage: sageDmg(s, e), fx: "stab" }, 40);
    return 62;
  },
  // 세 갈래 찌르기 (차례로, 끝마다 파편)
  (s, e) => {
    const d = toward(s, e);
    [-0.35, 0, 0.35].forEach((a, i) => staffLine(s, e, turned(d, a), R.THRUST_LEN, 8, 24 + i * 12, 1, 5));
    return 50;
  },
  // 쏟아지는 여의봉: 하늘에서 세로로 꽂히고, 꽂힌 자리마다 파편
  (s, e) => {
    const rng = sageRng(s, e, "pillar");
    for (let i = 0; i < R.PILLARS; i++) {
      const x = ROOM_MIN_X + 10 + rng.nextFloat() * (ROOM_MAX_X - ROOM_MIN_X - 20);
      hz(s, e, 30 + i * 10, { x, y: ROOM_MIN_Y, radius: 0, toX: x, toY: ROOM_MAX_Y, width: 10, damage: sageDmg(s, e), fx: "staff" }, i * 10);
      later(s, e, 30 + i * 10, "rocks", x, s.player.y, 6);
    }
    return 90;
  },
  // 던진 여의봉 셋: 빙글빙글 돌며 벽에 튕김
  (s, e) => {
    const d = toward(s, e);
    for (const a of [-0.3, 0, 0.3]) {
      const v = turned(d, a);
      Object.assign(enemyShot(s, e.x, e.y, v[0], v[1], 2.6, shotDamage(s) * 1.5), { look: "staff" as const, r: 10, bounces: 2, ticksLeft: 150, stay: true, owner: e.id });
    }
    return 40;
  },
  // X자 → 가운데 폭발
  (s, e) => {
    const p = s.player;
    const l = R.CROSS_LEN * sageRange(e);
    for (const [a, b] of [[1, 1], [1, -1]] as const) {
      hz(s, e, 34, { x: p.x - a * l * 0.7, y: p.y - b * l * 0.7, radius: 0, toX: p.x + a * l * 0.7, toY: p.y + b * l * 0.7, width: 9, damage: sageDmg(s, e), fx: "staff" });
    }
    hz(s, e, 50, { x: p.x, y: p.y, radius: 40, damage: sageDmg(s, e, 1.2), fx: "meteor" });
    later(s, e, 50, "rocks", p.x, p.y, 10);
    return 54;
  },
  // 땅 울림: 원형 파동 셋 + 둘레 땅이 차례로 솟음
  (s, e) => {
    for (let i = 0; i < 3; i++) addWave(e, e.x, e.y, 14 + i * 26, 1.9, 320 * sageRange(e), sageDmg(s, e));
    hz(s, e, 14, { x: e.x, y: e.y, radius: e.r * 2, damage: sageDmg(s, e), fx: "meteor" });
    const rng = sageRng(s, e, "quake");
    const p = s.player;
    for (let i = 0; i < 6; i++) {
      const x = p.x + rng.int(-90, 90);
      const y = p.y + rng.int(-60, 60);
      hz(s, e, 30 + i * 8, { x, y, radius: 22, damage: sageDmg(s, e), fx: "meteor" }, i * 8);
      later(s, e, 30 + i * 8, "rocks", x, y, 4);
    }
    return 80;
  },
  // 맵 전체 휘두르기 (휘두른 뒤 바위 파편)
  (s, e) => {
    e.sage!.bAct = "sweep";
    e.sage!.bAt = s.tick;
    later(s, e, sweepHit(), "rocks", s.player.x, s.player.y, 16);
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
