// 태초의 어둠: 거대한 두 손이 아주 천천히 따라오다 내려찍기 · 바닥에서 솟는 바늘 · 박쥐 5연발
// 기억력(흰 선이 차례로 깔리고 거꾸로 터짐) · 혼자 남으면(step 2) 어둠(공격 범위 밖이 어두워지고 유령 4마리, 한 번 깔리면 계속) · 다크 오라(방을 가로지르는 선 2줄) · 손아귀 연타 · 블랙홀이 더해짐
import { ENEMIES } from "../content";
import { createRng, deriveSeed } from "../rng";
import { hitDamage, keepAway, ring, shotDamage } from "./bossKit";
import { memoryLines, primevalMerge, primevalTick } from "./bossPrimeval";
import { addShape } from "./hazards";
import { summonHost, ultReady, updateHost } from "./bossUlts";
import type { EnemyState, RunState } from "./types";
import { enemyShot, makeEnemy, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 손: 따라오는 빠르기 · 플레이어 양옆 거리 · 내려찍기 반경 · 바늘 수·반경 · 박쥐 수·간격·빠르기 · 어둠 시간 · 유령 수 · 블랙홀 틱 */
  HAND_SPEED: 0.5,
  HAND_SIDE: 34,
  SLAM_R: 52,
  SPIKES: 16,
  SPIKE_R: 18,
  BATS: 5,
  BAT_GAP: 8,
  BAT_SPEED: 2.8,
  VEIL_TICKS: 600,
  GHOSTS: 4,
  HOLE_TICKS: 120,
};
export { R as BOSS_DARK_RULES };

type Vec = readonly [number, number];
type Pattern = "slam" | "spikes" | "bats" | "darkness" | "aura" | "grip" | "hole" | "memory";

const EARLY: readonly Pattern[] = ["slam", "spikes", "memory", "bats"];
const LATE: readonly Pattern[] = ["slam", "darkness", "spikes", "aura", "memory", "bats", "grip", "hole"];

/** 두 손이 플레이어 양옆으로 아주 천천히 따라감 */
function moveHands(s: RunState, e: EnemyState): void {
  const p = s.player;
  const h = e.hands ?? [e.x - 30, e.y, e.x + 30, e.y];
  for (let i = 0; i < 2; i++) {
    const tx = p.x + (i === 0 ? -R.HAND_SIDE : R.HAND_SIDE);
    const d = normalize(tx - h[i * 2]!, p.y - h[i * 2 + 1]!);
    if (d && Math.hypot(tx - h[i * 2]!, p.y - h[i * 2 + 1]!) > 2) {
      h[i * 2] = h[i * 2]! + d[0] * R.HAND_SPEED;
      h[i * 2 + 1] = h[i * 2 + 1]! + d[1] * R.HAND_SPEED;
    }
  }
  e.hands = h;
}

function slam(s: RunState, e: EnemyState, warn: number): void {
  const h = e.hands ?? [];
  for (let i = 0; i + 1 < h.length; i += 2) addShape(s, warn, { x: h[i]!, y: h[i + 1]!, radius: R.SLAM_R, damage: hitDamage(s), fx: "dark" });
}

export function updateDark(s: RunState, e: EnemyState, toP: Vec, go: Vec, spawned: EnemyState[]): void {
  primevalMerge(s, e);
  if (e.step === 2 && ultReady(e)) summonHost(s, e, spawned);
  updateHost(s, e);
  primevalTick(s, e);
  moveHands(s, e);
  const p = s.player;
  // 혼자 남으면 어둠이 걷히지 않음 (한 번 깔리면 계속), 둘일 때는 시간이 지나면 걷히고 유령도 사라짐
  if (e.step === 2 && (e.veil ?? 0) > 0) e.veil = R.VEIL_TICKS;
  else if ((e.veil ?? 0) > 0 && --e.veil! === 0) for (const g of s.enemies.filter((o) => o.kind === "ghost")) s.enemies.splice(s.enemies.indexOf(g), 1);
  if (e.phase === "act") {
    // 박쥐 5연발 · 손아귀 연타
    const t = (e.aux = (e.aux ?? 0) + 1);
    if (e.auxX === 1) {
      if (t % 20 === 1) slam(s, e, 28);
      if (t >= 60) e.phase = "walk";
    } else {
      if (t % R.BAT_GAP === 1) {
        const d = normalize(p.x - e.x, p.y - e.y) ?? [0, 1];
        Object.assign(enemyShot(s, e.x, e.y, d[0], d[1], R.BAT_SPEED, shotDamage(s)), { look: "bat" as const });
      }
      if (t >= R.BATS * R.BAT_GAP) e.phase = "walk";
    }
    return;
  }
  keepAway(s, e, toP, go, 85, ENEMIES.pdark.speed);
  e.dirX = toP[0];
  if (e.timer > 0) return;
  const list = e.step === 2 ? LATE : EARLY;
  const pat = list[e.count % list.length]!;
  e.count++;
  e.timer = e.step === 2 ? 75 : 95;
  const rng = createRng(deriveSeed(s.seed, "pdark", e.count, s.tick));
  if (pat === "slam") slam(s, e, 35);
  else if (pat === "memory") {
    memoryLines(s, e);
    e.timer = 260;
  }
  else if (pat === "spikes") {
    for (let i = 0; i < R.SPIKES; i++) {
      addShape(s, 35, { x: rng.int(ROOM_MIN_X + 8, ROOM_MAX_X - 8), y: rng.int(ROOM_MIN_Y + 8, ROOM_MAX_Y - 8), radius: R.SPIKE_R, damage: hitDamage(s), fx: "spike" });
    }
    addShape(s, 35, { x: p.x, y: p.y, radius: R.SPIKE_R, damage: hitDamage(s), fx: "spike" });
  } else if (pat === "bats" || pat === "grip") {
    e.phase = "act";
    e.aux = 0;
    e.auxX = pat === "grip" ? 1 : 0;
  } else if (pat === "darkness") {
    // 어둠: 공격 범위 밖이 어두워지고 유령 4마리가 떠돎 (그리기·유령은 bossPrimeval)
    e.veil = R.VEIL_TICKS;
    const alive = s.enemies.filter((o) => o.kind === "ghost").length;
    for (let i = alive; i < R.GHOSTS; i++) {
      const g = makeEnemy(s, "ghost", rng.int(ROOM_MIN_X + 20, ROOM_MAX_X - 20), rng.int(ROOM_MIN_Y + 20, ROOM_MAX_Y - 20), 1, 0);
      g.noGold = true;
      spawned.push(g);
    }
  } else if (pat === "aura") {
    // 다크 오라: 무작위 두 방향에서 방을 끝까지 가로지르는 선 (예고 0.67초)
    const sides = [0, 1, 2, 3];
    const pick = [sides.splice(rng.int(0, 3), 1)[0]!, sides.splice(rng.int(0, 2), 1)[0]!];
    e.sweeps = pick.map((side) => ({ x: side >= 2, dir: side % 2 === 0 ? 1 : -1, pos: side === 0 ? ROOM_MIN_Y : side === 1 ? ROOM_MAX_Y : side === 2 ? ROOM_MIN_X : ROOM_MAX_X, wait: 40 }));
  } else {
    // 블랙홀: 2초 동안 어둠 쪽으로 끌려가며 고리 탄
    p.lureTicks = R.HOLE_TICKS;
    p.lureId = e.id;
    ring(s, e, 2, e.count, 1.1, { look: "bat" });
  }
}
