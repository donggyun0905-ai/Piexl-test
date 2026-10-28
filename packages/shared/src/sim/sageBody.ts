// 제천대성 몸 갈래 ① 꼬리·주먹 10가지 (무작위로 하나씩, 여의봉 10가지와 같은 갈래)
// 세 번 지르기 · 꼬리 한 바퀴 · 꼬리 채찍 · 뛰어올라 내려찍기 · 장풍 부채꼴 · 여의봉 벽 + 꼬리로 감아 붙잡고 주먹 · 주먹 난타 · 분신 셋 · 둘러싸는 꼬리 · 돌진 올려치기
import { pinchPlayer } from "./bossGrip";
import { shotDamage } from "./bossKit";
import { damagePlayer } from "./combat";
import { inHazard } from "./hazards";
import { rot } from "./orbit";
import { hz, later, sageDmg, sageRange } from "./sageKit";
import type { EnemyState, RunState } from "./types";
import { addEffect, enemyShot, normalize } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  JAB_R: 34,
  TAIL_SPIN_R: 75,
  LASH_LEN: 140,
  LASH_W: 9,
  LEAP_AIR: 45,
  LEAP_R: 55,
  PALM_R: 150,
  PALM_ARC: 0.5,
  FLURRY: 11,
  CLONE_R: 40,
  CAGE_R: 60,
  CAGE_N: 8,
  RUSH: 20,
  RUSH_SPEED: 3.4,
  UPPER_R: 48,
  /** 붙잡기: 여의봉 벽 길이·남는 틱 · 꼬리가 감기까지 · 꼬리 길이 · 붙잡는 틱 · 주먹 반경·예고 */
  WALL_LEN: 220,
  WALL_TICKS: 260,
  GRAB_AT: 40,
  GRAB_WARN: 24,
  GRAB_LEN: 130,
  GRAB_HOLD: 70,
  FIST_R: 50,
  FIST_WARN: 45,
};
export { R as SAGE_BODY_RULES };

type Vec = readonly [number, number];
const toward = (s: RunState, e: EnemyState): Vec => normalize(s.player.x - e.x, s.player.y - e.y) ?? [1, 0];

/** 몸으로 하는 공격 10가지: 시작하고 걸리는 틱을 돌려줌 */
export const BODY_MOVES: readonly ((s: RunState, e: EnemyState) => number)[] = [
  // 세 번 지르기: 앞으로 한 걸음씩
  (s, e) => {
    const d = toward(s, e);
    for (let i = 0; i < 3; i++) hz(s, e, 22 + i * 10, { x: e.x + d[0] * (20 + i * 22), y: e.y + d[1] * (20 + i * 22), radius: R.JAB_R, damage: sageDmg(s, e, 0.8) });
    // 마지막 지르기에서 기 주먹이 앞으로 뻗어 나감
    later(s, e, 42, "fist", e.x + d[0] * 60, e.y + d[1] * 60, 3);
    return 50;
  },
  // 꼬리 한 바퀴
  (s, e) => {
    hz(s, e, 36, { x: e.x, y: e.y, radius: R.TAIL_SPIN_R, damage: sageDmg(s, e), arc: -1, fx: "bslash" });
    // 꼬리가 바닥을 쓸어 흙더미가 사방으로
    later(s, e, 36, "rocks", e.x, e.y, 10);
    return 40;
  },
  // 꼬리 채찍: 길게 한 줄
  (s, e) => {
    const d = toward(s, e);
    const len = R.LASH_LEN * sageRange(e);
    hz(s, e, 26, { x: e.x, y: e.y, radius: 0, toX: e.x + d[0] * len, toY: e.y + d[1] * len, width: R.LASH_W, damage: sageDmg(s, e), fx: "stab" });
    // 꼬리 끝이 땅을 때려 터짐
    hz(s, e, 38, { x: e.x + d[0] * len, y: e.y + d[1] * len, radius: 26, damage: sageDmg(s, e), fx: "meteor" });
    return 40;
  },
  // 뛰어올라 플레이어 자리에 내려찍기
  (s, e) => {
    const g = e.sage!;
    g.bAct = "leap";
    g.bAt = s.tick;
    g.bX = s.player.x;
    g.bY = s.player.y;
    e.air = e.immune = true;
    hz(s, e, R.LEAP_AIR, { x: g.bX, y: g.bY, radius: R.LEAP_R, damage: sageDmg(s, e, 1.3), fx: "meteor" });
    // 내려찍은 자리에서 바위 파편 · 파동
    later(s, e, R.LEAP_AIR, "rocks", g.bX, g.bY, 12);
    later(s, e, R.LEAP_AIR, "wave", g.bX, g.bY);
    return R.LEAP_AIR + 10;
  },
  // 장풍: 큰 부채꼴
  (s, e) => {
    const d = toward(s, e);
    hz(s, e, 38, { x: e.x, y: e.y, radius: R.PALM_R, damage: sageDmg(s, e, 1.2), dirX: d[0], dirY: d[1], arc: R.PALM_ARC, fx: "bslash" });
    later(s, e, 38, "fist", e.x, e.y, 5);
    return 42;
  },
  // 여의봉을 키워 뒤를 막고, 꼬리로 감아 붙잡은 뒤 주먹
  (s, e) => {
    const g = e.sage!;
    g.bAct = "grab";
    g.bAt = s.tick;
    const d = toward(s, e);
    const p = s.player;
    const bx = p.x + d[0] * 40;
    const by = p.y + d[1] * 40;
    const h = (R.WALL_LEN / 2) * sageRange(e);
    g.walls.push([bx - d[1] * h, by + d[0] * h, bx + d[1] * h, by - d[0] * h, s.tick + R.WALL_TICKS]);
    return R.GRAB_AT + R.GRAB_WARN + R.FIST_WARN + 10;
  },
  // 주먹 난타: 기 주먹 부채꼴
  (s, e) => {
    const d = toward(s, e);
    for (let i = 0; i < R.FLURRY; i++) {
      const r = rot(-0.6 + (1.2 * i) / (R.FLURRY - 1));
      Object.assign(enemyShot(s, e.x, e.y, d[0] * r[0] - d[1] * r[1], d[0] * r[1] + d[1] * r[0], 2.4, shotDamage(s)), { look: "kifist" as const, r: 4 });
    }
    // 한 번 더 (그때 플레이어 쪽으로)
    later(s, e, 22, "fist", e.x, e.y, 7);
    return 30;
  },
  // 털로 만든 분신 셋이 둘레에서 차례로 내려찍고, 마지막에 그 자리
  (s, e) => {
    const p = s.player;
    for (let i = 0; i < 3; i++) {
      const r = rot((i * Math.PI * 2) / 3 - Math.PI + 0.4);
      hz(s, e, 30 + i * 15, { x: p.x + r[0] * 50, y: p.y + r[1] * 50, radius: R.CLONE_R, damage: sageDmg(s, e), fx: "meteor" });
      later(s, e, 30 + i * 15, "rocks", p.x + r[0] * 50, p.y + r[1] * 50, 5);
    }
    hz(s, e, 80, { x: p.x, y: p.y, radius: R.CLONE_R, damage: sageDmg(s, e), fx: "meteor" });
    return 80;
  },
  // 꼬리로 둘러싸기: 둘레가 먼저, 가운데가 나중 (빠져나와야 함)
  (s, e) => {
    const p = s.player;
    for (let i = 0; i < R.CAGE_N; i++) {
      const r = rot((i * Math.PI * 2) / R.CAGE_N - Math.PI);
      hz(s, e, 40, { x: p.x + r[0] * R.CAGE_R, y: p.y + r[1] * R.CAGE_R, radius: 22, damage: sageDmg(s, e, 0.8) });
    }
    hz(s, e, 72, { x: p.x, y: p.y, radius: 30, damage: sageDmg(s, e, 1.2), fx: "meteor" });
    later(s, e, 72, "wave", p.x, p.y);
    return 76;
  },
  // 돌진해 올려치기
  (s, e) => {
    const g = e.sage!;
    g.bAct = "rush";
    g.bAt = s.tick;
    const d = toward(s, e);
    e.dirX = d[0];
    e.dirY = d[1];
    return R.RUSH + 12;
  },
];

/** 몸 갈래의 이어지는 공격 (뛰어오르기 · 붙잡기 · 돌진). 맡았으면 true */
export function bodyTick(s: RunState, e: EnemyState): boolean {
  const g = e.sage!;
  const t = s.tick - g.bAt!;
  const p = s.player;
  if (g.bAct === "leap") {
    const left = R.LEAP_AIR - t;
    if (left > 0) {
      e.x += (g.bX! - e.x) / left;
      e.y += (g.bY! - e.y) / left;
      return true;
    }
    e.air = e.immune = false;
    delete g.bAct;
    return true;
  }
  if (g.bAct === "rush") {
    if (t < R.RUSH) {
      e.x += e.dirX * R.RUSH_SPEED;
      e.y += e.dirY * R.RUSH_SPEED;
    } else {
      hz(s, e, 10, { x: e.x + e.dirX * 10, y: e.y + e.dirY * 10, radius: R.UPPER_R, damage: sageDmg(s, e, 1.2), fx: "meteor" });
      later(s, e, 10, "rocks", e.x + e.dirX * 10, e.y + e.dirY * 10, 10);
      delete g.bAct;
    }
    return true;
  }
  if (g.bAct !== "grab") return false;
  const d = normalize(p.x - e.x, p.y - e.y) ?? [1, 0];
  if (t === R.GRAB_AT) {
    e.dirX = d[0];
    e.dirY = d[1];
    g.bX = e.x + d[0] * R.GRAB_LEN;
    g.bY = e.y + d[1] * R.GRAB_LEN;
    hz(s, e, R.GRAB_WARN, { x: e.x, y: e.y, radius: 0, toX: g.bX, toY: g.bY, width: 10, damage: 0, fx: "vine" });
  } else if (t === R.GRAB_AT + R.GRAB_WARN) {
    // 꼬리에 감기면 붙잡혀 못 움직임 → 주먹
    const line = { x: e.x, y: e.y, toX: g.bX, toY: g.bY, width: 10 * sageRange(e), radius: 0, damage: 0, tick: 0, start: 0 };
    if (inHazard(line, p.x, p.y, p.r) && p.dashTicks <= 0) {
      pinchPlayer(s, e, R.GRAB_HOLD);
      damagePlayer(s, sageDmg(s, e, 0.5));
      addEffect(s, { kind: "burst", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 14, maxTicks: 14 });
    }
    hz(s, e, R.FIST_WARN, { x: p.x, y: p.y, radius: R.FIST_R, damage: sageDmg(s, e, 1.5), fx: "meteor" });
  } else if (t >= R.GRAB_AT + R.GRAB_WARN + R.FIST_WARN) delete g.bAct;
  return true;
}
