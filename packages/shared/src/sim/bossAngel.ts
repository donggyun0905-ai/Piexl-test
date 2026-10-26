// 천사장: 네 모서리의 탑 4개 (차례로 하나씩만 맞을 수 있음) · 소환 (나를 쫓는 성기사 + 천사장 곁을 지키는 가디언) · 빛기둥 · 깃털
// 탑을 부술수록 소환이 줄고, 다 부수면 빛 구슬 공격이 더해짐
import { ENEMIES } from "../content";
import { fan, half, hitDamage, keepAway, ring } from "./bossKit";
import { addShape } from "./hazards";
import type { EnemyState, RunState } from "./types";
import { depth } from "./hero";
import { addEffect, DIR16, makeEnemy, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 탑 수 · 모서리에서 띄운 거리 · 성기사 동시 최대 수 · 방패 가디언 수 · 빛기둥 반경·떨어지는 틱 · 빛 구슬 크기·빠르기 */
  TOWERS: 4,
  TOWER_INSET: 14,
  PALADIN_MAX: 6,
  GUARDS: 3,
  HOLY_R: 24,
  HOLY_WARN: 34,
  ORB_R: 4,
  ORB_SPEED: 1.8,
};
export { R as BOSS_ANGEL_RULES };

type Vec = readonly [number, number];

/** 모서리 탑 4개 (시계 방향, aux = 순서) */
function raiseTowers(s: RunState, e: EnemyState, spawned: EnemyState[]): void {
  const corners: Vec[] = [
    [ROOM_MIN_X + R.TOWER_INSET, ROOM_MIN_Y + R.TOWER_INSET],
    [ROOM_MAX_X - R.TOWER_INSET, ROOM_MIN_Y + R.TOWER_INSET],
    [ROOM_MAX_X - R.TOWER_INSET, ROOM_MAX_Y - R.TOWER_INSET],
    [ROOM_MIN_X + R.TOWER_INSET, ROOM_MAX_Y - R.TOWER_INSET],
  ];
  corners.forEach(([x, y], i) => {
    const t = makeEnemy(s, "tower", x, y, 1 + 0.15 * (depth(s) - 1), 0);
    t.noGold = true;
    t.aux = i;
    t.auxX = x;
    t.auxY = y;
    spawned.push(t);
  });
  e.step = 1;
}

/** 탑: 제자리에 서 있고, 남은 탑 중 순서가 가장 앞선 것만 맞을 수 있음 */
export function updateTower(s: RunState, e: EnemyState): void {
  e.x = e.auxX ?? e.x;
  e.y = e.auxY ?? e.y;
  const first = Math.min(...s.enemies.filter((o) => o.kind === "tower" && o.hp > 0).map((o) => o.aux ?? 0));
  e.immune = (e.aux ?? 0) !== first;
}

/** 천사장: 거리를 두고 소환 → 빛기둥 → 깃털 (탑을 다 부수면 빛 구슬 차례가 더해짐) */
export function updateAngel(s: RunState, e: EnemyState, toP: Vec, go: Vec, spawned: EnemyState[]): void {
  const h = half(e);
  const p = s.player;
  if (e.step === undefined) raiseTowers(s, e, spawned);
  keepAway(s, e, toP, go, 90, ENEMIES.archangel.speed);
  e.dirX = toP[0];
  if (e.timer > 0) return;
  const broken = R.TOWERS - s.enemies.filter((o) => o.kind === "tower" && o.hp > 0).length;
  const pattern = e.count % (broken >= R.TOWERS ? 4 : 3);
  e.count++;
  if (pattern === 0) {
    // 탑 1개: 성기사 절반 · 2개: 가디언 절반 · 3개: 성기사 멈춤 · 4개: 가디언 멈춤
    const paladins = broken >= 3 ? 0 : (h ? 4 : 2) / (broken >= 1 ? 2 : 1);
    const guards = broken >= 4 ? 0 : broken >= 2 ? Math.ceil(R.GUARDS / 2) : R.GUARDS;
    summon(s, e, spawned, "paladin", paladins, R.PALADIN_MAX * (h ? 2 : 1));
    summon(s, e, spawned, "guardian", guards, guards);
  } else if (pattern === 1) {
    const n = h ? 5 : 3;
    for (let i = 0; i < n; i++) {
      const d = DIR16[(i * 5 + e.count) % 16]!;
      const k = i === 0 ? 0 : 36;
      addShape(s, R.HOLY_WARN, { x: p.x + d[0] * k, y: p.y + d[1] * k, radius: R.HOLY_R, damage: hitDamage(s), fx: "holy" });
    }
  } else if (pattern === 2) {
    fan(s, e, toP, [-2, -1, 0, 1, 2], 1.6, { look: "feather" });
    if (h) ring(s, e, 2, e.count, 1.2, { look: "feather" });
  } else {
    // 탑을 다 부순 뒤: 앞으로 큰 빛 구슬
    fan(s, e, toP, h ? [-1, 0, 1] : [0], R.ORB_SPEED, { look: "light" });
    for (const pr of s.projectiles.slice(-(h ? 3 : 1))) pr.r = R.ORB_R;
  }
  e.timer = h ? 80 : 100;
}

/** 소환: n마리까지 (같은 종류가 max마리 넘게 있으면 그만) */
function summon(s: RunState, e: EnemyState, spawned: EnemyState[], kind: "paladin" | "guardian", n: number, max: number): void {
  const hpMul = 1 + 0.15 * (depth(s) - 1);
  const alive = s.enemies.filter((m) => m.kind === kind && m.noGold && m.hp > 0).length;
  for (let i = 0; i < n && alive + i < max; i++) {
    const d = DIR16[(Math.floor((i * 16) / n) + (kind === "guardian" ? 3 : 0)) % 16]!;
    const m = makeEnemy(s, kind, e.x + d[0] * 20, e.y + d[1] * 20, hpMul, 20);
    m.noGold = true;
    // 가디언은 천사장 곁을 지킴 (aux = 지키는 천사장 id)
    if (kind === "guardian") m.aux = e.id;
    spawned.push(m);
    addEffect(s, { kind: "holy", x: m.x, y: m.y, dirX: 0, dirY: 0, size: 8, maxTicks: 16 });
  }
}
