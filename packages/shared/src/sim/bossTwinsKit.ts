// 피로 이어진 쌍둥이 새 패턴 둘 (sim/bossTwins에서 부름, 루가 정하고 레는 따라 움직임):
// ① 교차 돌진: 둘이 사람 양옆으로 순간이동 → 같은 선을 예고 → 서로를 향해 꿰뚫고 지나감 (체력 절반 아래면 십자로 두 번)
// ② 핏줄 감옥 (대시로 못 피함): 사람 자리를 가운데로 둘이 원 위에 서서 핏줄을 빙빙 돌림 → 원 안은 핏줄이 지날 때마다 맞음 (대시 무적도 소용없음) · 예고 동안 원 밖으로 나가야 함
import { half, hitDamage } from "./bossKit";
import { throughDash } from "./bossGrip";
import { damagePlayer } from "./combat";
import { addShape, inHazard } from "./hazards";
import { rot } from "./orbit";
import { eachSeat, seatNo } from "./party";
import type { EnemyState, RunState } from "./types";
import { addEffect, keepInRoom, normalize, roomGrid } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 교차 돌진: 사람에게서 떨어져 서는 거리 · 예고 틱 · 꿰뚫는 틱 · 선 굵기 · 피해 배율 */
  CROSS_DIST: 70,
  CROSS_WARN: 34,
  CROSS_TICKS: 10,
  CROSS_W: 7,
  CROSS_MUL: 0.9,
  /** 핏줄 감옥: 반지름 · 예고 틱 · 도는 틱 · 한 틱에 도는 각도(라디안) · 맞는 굵기 · 피해 배율 · 같은 사람 다시 맞는 간격 */
  CAGE_R: 66,
  CAGE_WARN: 54,
  CAGE_TICKS: 150,
  CAGE_SPIN: 0.08,
  CAGE_W: 4,
  CAGE_MUL: 0.5,
  CAGE_GAP: 24,
  /** 공격 사이 쉬는 틱 */
  REST: 70,
};
export { R as BOSS_TWINS_KIT_RULES };

type Vec = readonly [number, number];

/** 교차 돌진 시작 (루가 부름): 사람을 사이에 두고 양옆으로 · 같은 선 예고 */
export function startCross(s: RunState, lu: EnemyState, re: EnemyState, second = false): void {
  const p = s.player;
  const d = normalize(p.x - lu.x, p.y - lu.y) ?? [1, 0];
  const ax: Vec = second ? [-d[1], d[0]] : d;
  const a: Vec = [p.x - ax[0] * R.CROSS_DIST, p.y - ax[1] * R.CROSS_DIST];
  const b: Vec = [p.x + ax[0] * R.CROSS_DIST, p.y + ax[1] * R.CROSS_DIST];
  for (const [t, from, to] of [
    [lu, a, b],
    [re, b, a],
  ] as const) {
    addEffect(s, { kind: "burst", x: t.x, y: t.y, dirX: 0, dirY: 0, size: 10, maxTicks: 12, foe: true });
    t.x = t.prevX = from[0];
    t.y = t.prevY = from[1];
    keepInRoom(t, roomGrid(s));
    t.auxX = to[0];
    t.auxY = to[1];
    t.phase = "windup";
    t.timer = R.CROSS_WARN;
    t.step = second ? 0 : 1;
  }
  addShape(s, R.CROSS_WARN + Math.round(R.CROSS_TICKS / 2), { x: lu.x, y: lu.y, radius: 0, damage: Math.round(hitDamage(s) * R.CROSS_MUL), toX: re.x, toY: re.y, width: R.CROSS_W, by: "twinlu", fx: "bslash" });
}

/** 핏줄 감옥 시작 (루가 부름): 지금 사람 자리가 가운데 · 원 예고 */
export function startCage(s: RunState, lu: EnemyState, re: EnemyState): void {
  const p = s.player;
  lu.auxX = p.x;
  lu.auxY = p.y;
  lu.aux = 0;
  for (const t of [lu, re]) {
    t.phase = "act";
    t.timer = R.CAGE_WARN + R.CAGE_TICKS;
  }
  lu.twHit = [];
  addShape(s, R.CAGE_WARN, { x: p.x, y: p.y, radius: R.CAGE_R, damage: 0 });
}

/** 루·레 패턴 진행 (진행 중이면 true · 레는 루가 움직임) */
export function twinKitTick(s: RunState, e: EnemyState, m: EnemyState | undefined): boolean {
  if (e.phase === "windup" || e.phase === "swing") return cross(s, e, m);
  if (e.phase !== "act") return false;
  if (e.kind === "twinlu" && m) cage(s, e, m);
  if (e.timer > 0) return true;
  e.phase = "walk";
  e.timer = R.REST;
  return true;
}

function cross(s: RunState, e: EnemyState, m: EnemyState | undefined): boolean {
  if (e.phase === "windup") {
    if (e.timer > 0) return true;
    e.phase = "swing";
    e.timer = R.CROSS_TICKS;
    return true;
  }
  // 꿰뚫고 지나감
  const k = 1 / Math.max(1, e.timer);
  e.x += ((e.auxX ?? e.x) - e.x) * k;
  e.y += ((e.auxY ?? e.y) - e.y) * k;
  if (e.timer > 0) return true;
  // 체력 절반 아래: 루가 한 번 더 (십자로)
  if (e.kind === "twinlu" && e.step === 1 && m && !(m.twDown ?? 0) && half(e)) {
    startCross(s, e, m, true);
    return true;
  }
  e.step = -1;
  e.phase = "walk";
  e.timer = R.REST;
  return true;
}

function cage(s: RunState, lu: EnemyState, re: EnemyState): void {
  const c: Vec = [lu.auxX ?? lu.x, lu.auxY ?? lu.y];
  const spinning = lu.timer <= R.CAGE_TICKS;
  if (spinning) lu.aux = (lu.aux ?? 0) + R.CAGE_SPIN;
  const [cx, cy] = rot(lu.aux ?? 0);
  const spots: Vec[] = [
    [c[0] + cx * R.CAGE_R, c[1] + cy * R.CAGE_R],
    [c[0] - cx * R.CAGE_R, c[1] - cy * R.CAGE_R],
  ];
  // 예고 동안 자리로 걸어감 · 돌 때는 원 위에 붙음
  [lu, re].forEach((t, i) => {
    const [tx, ty] = spots[i]!;
    const k = spinning ? 1 : 0.15;
    t.x += (tx - t.x) * k;
    t.y += (ty - t.y) * k;
  });
  if (!spinning) return;
  const line = { tick: 0, start: 0, x: lu.x, y: lu.y, radius: 0, damage: 0, toX: re.x, toY: re.y, width: R.CAGE_W };
  eachSeat(
    s,
    () => {
      const p = s.player;
      const i = seatNo(s);
      if (!inHazard(line, p.x, p.y, p.r) || s.tick - (lu.twHit?.[i] ?? -999) < R.CAGE_GAP) return;
      (lu.twHit ??= [])[i] = s.tick;
      throughDash(s, () => damagePlayer(s, Math.round(hitDamage(s) * R.CAGE_MUL), "twinlu"));
    },
    !!s.party,
  );
}
