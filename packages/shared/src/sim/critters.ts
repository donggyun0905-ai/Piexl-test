// 타워 디펜스에서 처음 나온 적 8종의 던전 행동 (enemies에서 부름) · 층마다 나오는 졸개 목록
// 슬라임(통통 뛰어옴) · 도마뱀(빠름) · 박쥐(셋이 떼로, 흔들리며) · 딱정벌레(등껍질 방패) · 바위 골렘(느리고 땅 찍기)
// 주술사(거리를 두고 주변 적 회복) · 알주머니(터지면 작은 슬라임 셋) · 도깨비불(가끔 플레이어 쪽으로 순간이동)
import { golemSlamMul } from "./elite";
import { ENEMIES, type MinionKind } from "../content";
import { addShape } from "./hazards";
import type { EnemyState, RunState } from "./types";
import { addEffect, DIR16, dist2, makeEnemy } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 슬라임: 한 번 뛰는 주기 · 뛰는 틱 · 뛸 때 빠르기 배율 */
  HOP_EVERY: 50,
  HOP_TICKS: 16,
  HOP_MUL: 2.6,
  /** 골렘: 땅 찍기 간격 · 예고 · 반경 · 피해 */
  SLAM_GAP: 200,
  SLAM_WARN: 45,
  SLAM_R: 26,
  SLAM_DMG: 16,
  /** 주술사: 지키는 거리 · 회복 간격 · 회복 범위 · 회복 양(최대 체력 비율) */
  SHAMAN_KEEP: 80,
  HEAL_GAP: 180,
  HEAL_R: 50,
  HEAL_PART: 0.15,
  /** 도깨비불: 순간이동 간격 · 거리 · 플레이어와 최소 거리 */
  BLINK_GAP: 150,
  BLINK_BY: 40,
  BLINK_NEAR: 24,
  /** 알주머니가 터져 나오는 작은 슬라임 수 · 체력 배율 */
  HATCH: 3,
  HATCH_HP: 0.4,
};
export { R as CRITTERS_RULES };

type Vec = readonly [number, number];

/** 이 층(세기 기준 depth)에 나오는 졸개 (골렘은 5층부터, 한 방에 한 마리만) */
export function minionKinds(d: number): MinionKind[] {
  if (d < 2) return ["crawler", "crawler", "spitter", "gnat", "guardian", "slime"];
  if (d <= 2) return ["crawler", "spitter", "charger", "gnat", "guardian", "slime", "runner", "bat"];
  const kinds: MinionKind[] = ["crawler", "spitter", "charger", "mortar", "gnat", "guardian", "paladin", "runner", "bat", "beetle", "wisp"];
  if (d >= 4) kinds.push("shaman", "eggsac");
  if (d >= 5) kinds.push("golem");
  return kinds;
}

/** 박쥐 떼: 한 자리에 셋 */
export const BAT_FLOCK: readonly Vec[] = [[0, 0], [14, 6], [-12, 8]];

/** 타워 디펜스 적이면 던전 행동을 하고 true */
export function updateCritter(s: RunState, e: EnemyState, toP: Vec, go: Vec): boolean {
  const def = ENEMIES[e.kind];
  const step = (v: Vec, mul = 1) => {
    e.x += v[0] * def.speed * mul;
    e.y += v[1] * def.speed * mul;
  };
  switch (e.kind) {
    case "slime":
      // 통통: 잠깐 뛰고 쉼
      if ((s.tick + e.id * 7) % R.HOP_EVERY < R.HOP_TICKS) step(go, R.HOP_MUL);
      return true;
    case "runner":
    case "beetle":
    case "eggsac":
      step(go);
      return true;
    case "bat": {
      // 이리저리 흔들리며 다가옴
      const w = DIR16[(Math.floor(s.tick / 10) + e.id * 3) % 16]!;
      step([go[0] + w[0] * 0.6, go[1] + w[1] * 0.6]);
      return true;
    }
    case "golem":
      step(go);
      if (--e.timer <= 0) {
        e.timer = R.SLAM_GAP;
        addShape(s, R.SLAM_WARN, { x: e.x, y: e.y, radius: R.SLAM_R * golemSlamMul(e), damage: R.SLAM_DMG, fx: "pillar" });
      }
      return true;
    case "shaman": {
      const d2 = dist2(e, s.player);
      const dir = d2 > R.SHAMAN_KEEP * R.SHAMAN_KEEP ? 1 : d2 < (R.SHAMAN_KEEP - 20) * (R.SHAMAN_KEEP - 20) ? -1 : 0;
      step(dir > 0 ? go : toP, dir);
      if (--e.timer <= 0) {
        e.timer = R.HEAL_GAP;
        for (const o of s.enemies) {
          if (o === e || o.hp <= 0 || ENEMIES[o.kind].boss || dist2(o, e) > R.HEAL_R * R.HEAL_R) continue;
          o.hp = Math.min(o.maxHp, o.hp + o.maxHp * R.HEAL_PART);
        }
        addEffect(s, { kind: "ring", x: e.x, y: e.y, dirX: 0, dirY: 0, size: R.HEAL_R, maxTicks: 18, width: 1 });
      }
      return true;
    }
    case "wisp":
      step(go);
      if (--e.timer <= 0) {
        e.timer = R.BLINK_GAP;
        const d = Math.sqrt(dist2(e, s.player));
        const by = Math.min(R.BLINK_BY, Math.max(0, d - R.BLINK_NEAR));
        addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r * 2, maxTicks: 12 });
        e.x += toP[0] * by;
        e.y += toP[1] * by;
      }
      return true;
    default:
      return false;
  }
}

/** 던전에서 알주머니가 터지면 그 자리에서 작은 슬라임 셋 (돈·경험치 없음. 타워 디펜스는 tdWaves.hatch) */
export function hatchSlimes(s: RunState, e: EnemyState, into: EnemyState[]): void {
  if (e.kind !== "eggsac" || e.tdPath !== undefined) return;
  for (let i = 0; i < R.HATCH; i++) {
    const d = DIR16[Math.floor((i * 16) / R.HATCH)]!;
    const kid = makeEnemy(s, "slime", e.x + d[0] * 6, e.y + d[1] * 6, (e.maxHp / ENEMIES.eggsac.hp) * R.HATCH_HP, 0);
    kid.r = 4;
    kid.noGold = true;
    into.push(kid);
  }
}
