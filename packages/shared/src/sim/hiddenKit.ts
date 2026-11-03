// 숨은 시련 공용: 지금 진행 중인 시련 · 알림 · 시련 몬스터 부르기 · 부서지는 구조물(조각들이 체력 하나를 나눠 씀)
import type { EnemyKind } from "../enemyDefs";
import { bossHpMul } from "./bosses";
import { lateBossHp } from "./foeScale";
import { depth } from "./hero";
import type { HiddenFort, HiddenTrialState } from "./hiddenTrialTypes";
import { foeHpMul } from "./roomSpawn";
export { hiddenOn } from "./hiddenFoes";
import { tabooUp } from "./taboo";
import type { EnemyState, RunState } from "./types";
import { addEffect, keepInRoom, makeEnemy, roomGrid } from "./util";

/** 화면 알림 */
export const hNote = (s: RunState, h: HiddenTrialState, code: string) => void (h.note = { code, tick: s.tick });

/** 시련 몬스터 하나 (돈·처치 수 없음, 체력 = 그 층 졸개 체력 × k) */
export function hSpawn(s: RunState, kind: EnemyKind, x: number, y: number, k: number, into: EnemyState[]): EnemyState {
  const e = makeEnemy(s, kind, x, y, foeHpMul(depth(s)) * k, 30 + ((s.nextId * 7) % 40));
  e.noGold = true;
  keepInRoom(e, roomGrid(s));
  into.push(e);
  addEffect(s, { kind: "trSpawn", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 10, maxTicks: 20 });
  return e;
}

/** 구조물 하나: 자리마다 조각(fort)을 놓고, 체력은 그 층 보스 체력 × k */
export function makeFort(s: RunState, look: HiddenFort["look"], pts: [number, number][], r: number, k: number, into: EnemyState[]): HiddenFort {
  const d = depth(s);
  const f: HiddenFort = { look, pool: 0, max: 0, ids: [], xy: pts };
  for (const [x, y] of pts) {
    const e = makeEnemy(s, "fort", x, y, bossHpMul(d) * lateBossHp(d) * tabooUp(s, "bossHp") * k, 0);
    e.noGold = true;
    e.r = r;
    f.pool = f.max = e.maxHp;
    f.ids.push(e.id);
    into.push(e);
  }
  return f;
}

/** 틱마다: 조각이 받은 피해 중 가장 큰 것만 체력에서 깎고(범위 공격이 여러 조각을 맞혀도 한 번), 조각을 제자리·같은 체력으로. 이번 틱에 부서졌으면 true */
export function fortTick(s: RunState, f: HiddenFort): boolean {
  if (f.down) return false;
  const segs = f.ids.map((id) => s.enemies.find((o) => o.id === id));
  let lost = 0;
  for (const e of segs) lost = Math.max(lost, !e || e.hp <= 0 ? f.pool : f.pool - e.hp);
  f.pool = Math.max(0, f.pool - lost);
  if (f.pool > 0) {
    segs.forEach((e, i) => {
      if (!e) return;
      [e.x, e.y] = f.xy[i]!;
      [e.prevX, e.prevY] = [e.x, e.y];
      e.hp = f.pool;
      e.maxHp = f.max;
    });
    return false;
  }
  f.down = true;
  s.enemies = s.enemies.filter((o) => !f.ids.includes(o.id));
  for (const [x, y] of f.xy) addEffect(s, { kind: "burst", x, y, dirX: 0, dirY: 0, size: 18, maxTicks: 22 });
  return true;
}

/** 이 종류 적을 모두 없앰 (구조물이 부서져 함께 무너짐) */
export function wipe(s: RunState, kind: EnemyKind): void {
  for (const e of s.enemies) if (e.kind === kind) addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 12, maxTicks: 16 });
  s.enemies = s.enemies.filter((e) => e.kind !== kind);
}
