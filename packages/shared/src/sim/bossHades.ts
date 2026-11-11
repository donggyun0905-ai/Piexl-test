// 라스트 보스 갓이터: 대검 두 자루(파괴·혼돈)를 먼저 부숴야 맞음. 그동안은 방 전체 심판(검정 = 가만히 · 붉은색 = 움직여야 안 맞음)
// 두 자루를 다 부수면 심판에 더해 느긋하게 떠다니는 거대한 파괴·혼돈 구슬 · 바닥에서 솟는 대낫 · 4분할 구역 닫기(bossZones) · 벽에서 날아오는 거대한 검기 · 대낫 한 바퀴 · 벽에 튕기는 거대한 낫 3개 · 망령 소환
// 체력 절반 아래면 날려 버리기 · 봉인의 사슬(W·A·S·D 순서) · 10% 아래면 궁극기 패링(bossCage)
import { dashDodged } from "./remnant";
import { ENEMIES } from "../content";
import { createRng, deriveSeed } from "../rng";
import { half, hitDamage, keepAway, shotDamage } from "./bossKit";
import { addShape } from "./hazards";
import type { EnemyState, RunState } from "./types";
import { depth } from "./hero";
import { DIR16, enemyShot, keepInRoom, makeEnemy, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, roomGrid } from "./util";
import { damagePlayer as damagePlayer_ } from "./combat";
import { chainPlayer } from "./bossBinds";
import { closeZones, updateZones } from "./bossZones";
import { ultReady } from "./bossUlts";
import { startCage, updateCage } from "./bossCage";
import { ROOM_CX, ROOM_CY } from "../constants";
import { srcFn } from "./dmgSrc";
const damagePlayer = srcFn("bossHades", () => damagePlayer_);

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 날려 버리기: 반경 · 예고 · 밀려나는 거리 */
  REPEL_R: 120,
  REPEL_WARN: 40,
  REPEL_PUSH: 90,
  /** 심판이 터지기까지 · 거대한 구슬 크기·빠르기 · 대낫 반경 · 한 바퀴 반경 · 벽 검기 수 · 망령 최대 수 */
  JUDGE_WARN: 75,
  ORB_R: 33,
  ORB_SPEED: 0.55,
  SCYTHE_R: 32,
  SPIN_R: 100,
  WALL_WAVES: 12,
  WRAITH_MAX: 6,
  /** 벽에 튕기며 떠도는 거대한 낫: 수 · 크기 · 빠르기 (한 번 나오면 갓이터가 쓰러질 때까지 계속) */
  REAPERS: 3,
  REAPER_R: 24,
  REAPER_SPEED: 1.3,
};
export { R as BOSS_HADES_RULES };

type Vec = readonly [number, number];
type Pattern = "judge" | "orbs" | "scythes" | "walls" | "spin" | "wraiths" | "repel" | "chains" | "zones" | "reapers";

/** 대검이 있을 때는 심판만, 다 부수면 차례대로 */
const LATE: readonly Pattern[] = ["judge", "orbs", "scythes", "zones", "walls", "spin", "reapers", "judge", "wraiths", "scythes"];
/** 체력 절반 아래: 날려 버리기 · 봉인의 사슬이 더해짐 */
const LATE_HALF: readonly Pattern[] = ["judge", "repel", "orbs", "zones", "walls", "chains", "spin", "reapers", "judge", "scythes", "repel", "wraiths"];

const blades = (s: RunState) => s.enemies.filter((o) => (o.kind === "ruinblade" || o.kind === "chaosblade") && o.hp > 0).length;

/** 갓이터 곁에 대검 두 자루 */
function raiseBlades(s: RunState, e: EnemyState, spawned: EnemyState[]): void {
  for (const kind of ["ruinblade", "chaosblade"] as const) {
    const b = makeEnemy(s, kind, e.x + (kind === "ruinblade" ? -34 : 34), e.y, 1 + 0.25 * (depth(s) - 1), 90);
    b.noGold = true;
    spawned.push(b);
  }
  e.step = 1;
}

export function updateHades(s: RunState, e: EnemyState, toP: Vec, go: Vec, spawned: EnemyState[]): void {
  if (e.step === undefined) raiseBlades(s, e, spawned);
  const h = half(e);
  const armed = blades(s) > 0;
  e.immune = armed;
  if (!armed && ultReady(e)) startCage(s, e);
  updateCage(s, e);
  // 패링 궁극기 동안은 다른 패턴 없음
  if (e.ultAt !== undefined) return;
  if (e.repelAt === s.tick) repel(s, e);
  updateZones(s, e);
  keepAway(s, e, toP, go, 80, ENEMIES.godeater.speed);
  e.dirX = toP[0];
  if (e.timer > 0) return;
  const late = h ? LATE_HALF : LATE;
  const pat: Pattern = armed ? "judge" : late[e.count % late.length]!;
  e.count++;
  e.timer = armed ? 200 : h ? 75 : 95;
  const p = s.player;
  const rng = createRng(deriveSeed(s.seed, "hades", e.count, s.tick));
  if (pat === "judge") {
    // 방 전체: 검정이면 가만히, 붉은색이면 움직여야 안 맞음
    addShape(s, R.JUDGE_WARN, { x: ROOM_CX, y: ROOM_CY, radius: 0, damage: hitDamage(s), still: e.count % 2 === 0 ? "black" : "red", fx: "dark" });
  } else if (pat === "orbs") {
    if (!s.projectiles.some((pr) => pr.owner === e.id)) {
      for (const [k, look] of [[2, "orbRuin"], [10, "orbChaos"]] as const) {
        const d = DIR16[k]!;
        Object.assign(enemyShot(s, e.x, e.y, d[0], d[1], R.ORB_SPEED, hitDamage(s)), { r: R.ORB_R, ticksLeft: 1e9, bounces: 1e9, stay: true, owner: e.id, look });
      }
    }
  } else if (pat === "scythes") {
    for (let i = 0; i < 3; i++) {
      const d = DIR16[(i * 5 + e.count) % 16]!;
      const k = i === 0 ? 0 : 34;
      addShape(s, 40 + i * 8, { x: p.x + d[0] * k, y: p.y + d[1] * k, radius: R.SCYTHE_R, damage: hitDamage(s), fx: "scythe" });
    }
  } else if (pat === "walls") {
    // 벽 곳곳에서 플레이어 쪽으로 검기
    for (let i = 0; i < R.WALL_WAVES; i++) {
      const side = i % 4;
      const along = rng.nextFloat();
      const x = side < 2 ? ROOM_MIN_X + 4 + along * (ROOM_MAX_X - ROOM_MIN_X - 8) : side === 2 ? ROOM_MIN_X + 4 : ROOM_MAX_X - 4;
      const y = side >= 2 ? ROOM_MIN_Y + 4 + along * (ROOM_MAX_Y - ROOM_MIN_Y - 8) : side === 0 ? ROOM_MIN_Y + 4 : ROOM_MAX_Y - 4;
      const d = normalize(p.x - x, p.y - y) ?? [0, 1];
      Object.assign(enemyShot(s, x, y, d[0], d[1], 1.4, shotDamage(s)), { look: "bigwave" as const, r: 9 });
    }
  } else if (pat === "zones") {
    // 4분할 구역을 하나씩 닫음 (그동안 다른 공격도 이어짐)
    if (closeZones(s, e)) e.timer = 120;
  } else if (pat === "reapers") {
    if (!s.projectiles.some((pr) => pr.look === "reaper")) {
      for (let i = 0; i < R.REAPERS; i++) {
        const d = DIR16[(i * 5 + e.count) % 16]!;
        Object.assign(enemyShot(s, e.x, e.y, d[0], d[1], R.REAPER_SPEED, hitDamage(s)), { r: R.REAPER_R, ticksLeft: 1e9, bounces: 1e9, stay: true, owner: e.id, look: "reaper" as const });
      }
    }
  } else if (pat === "repel") {
    addShape(s, R.REPEL_WARN, { x: e.x, y: e.y, radius: R.REPEL_R, damage: 0, arc: -1, fx: "bslash" });
    e.repelAt = s.tick + R.REPEL_WARN;
  } else if (pat === "chains") {
    chainPlayer(s);
  } else if (pat === "spin") {
    addShape(s, 40, { x: e.x, y: e.y, radius: R.SPIN_R, damage: hitDamage(s), arc: -1, fx: "bslash" });
  } else {
    const alive = s.enemies.filter((o) => o.kind === "soul" && o.hp > 0).length;
    for (let i = 0; i < 3 && alive + i < R.WRAITH_MAX; i++) {
      const d = DIR16[(i * 5 + 3) % 16]!;
      const m = makeEnemy(s, "soul", e.x + d[0] * 24, e.y + d[1] * 24, 1 + 0.15 * (depth(s) - 1), 20);
      m.noGold = true;
      spawned.push(m);
    }
  }
}

/** 날려 버리기: 둘레 플레이어를 크게 밀쳐 내며 피해 (대시 중이면 피함) */
function repel(s: RunState, e: EnemyState): void {
  const p = s.player;
  const d = normalize(p.x - e.x, p.y - e.y) ?? [0, 1];
  if (Math.hypot(p.x - e.x, p.y - e.y) > R.REPEL_R + p.r || dashDodged(s)) return;
  damagePlayer(s, hitDamage(s));
  p.x += d[0] * R.REPEL_PUSH;
  p.y += d[1] * R.REPEL_PUSH;
  keepInRoom(p, roomGrid(s));
}
