// 켈베로스 페이즈 2: 세 사람 (체력 각각, 따로 움직이며 자기 공격 셋을 차례로 돎 · 하나가 쓰러질 때마다 남은 사람이 분노)
// 권귀(주먹): 내려치기 3 → 넓은 쓸기 2 → 전역 바위 1 · 염희(불): 불기둥 30 → 둘레 화염 브레스 → 지옥불새 30줄 · 검귀(대검): 돌진 베기 3 → 부채꼴 검기 3 → 점프 내려찍기(무적)
// 무너지는 바닥 중에는 셋이 모여 떠 있음 (무적) · 염희 빨아들이기: 10초 동안 끌려감(걸어서 못 버팀, 기둥에 막히면 버팀) · 염희 둘레 불에 닿으면 큰 피해
import { CERB_TRIO, ENEMIES } from "../content";
import { ROOM_CX } from "../constants";
import { createRng, deriveSeed } from "../rng";
import { throughDash } from "./bossGrip";
import { fan, hitDamage, ring } from "./bossKit";
import { cerbDirector, floorBusy } from "./cerbKit";
import { damagePlayer } from "./combat";
import { addShape } from "./hazards";
import { eachSeat } from "./party";
import type { EnemyState, RunState } from "./types";
import { addEffect, DIR16, keepInRoom, normalize, roomGrid, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 공격 셋을 다 돈 뒤 쉬는 틱 · 하나가 쓰러지면 쉬는 시간 배율 · 둘 쓰러지면 · 이동 배율 (하나 · 둘) */
  REST: 60,
  RAGE1: 0.8,
  RAGE2: 0.65,
  RUSH1: 1.15,
  RUSH2: 1.25,
  /** 권귀 내려치기: 간격 · 예고 · 반경 */
  SLAM_GAP: 40,
  SLAM_WARN: 36,
  SLAM_R: 34,
  /** 권귀 넓은 쓸기 (반원): 간격 · 예고 · 반경 */
  SWEEP_GAP: 56,
  SWEEP_WARN: 44,
  SWEEP_R: 95,
  /** 권귀 전역 바위: 수 · 예고 · 반경 */
  FALL: 20,
  FALL_WARN: 70,
  FALL_R: 16,
  /** 염희 불기둥 (3곳씩 10번, 셋째마다 내 자리): 간격 · 예고 · 반경 */
  PILLAR_GAP: 12,
  PILLAR_WARN: 30,
  PILLAR_R: 16,
  /** 염희 둘레 화염 브레스: 예고 · 반경 */
  BREATH_WARN: 48,
  BREATH_R: 110,
  /** 지옥불새 (방 끝에서 끝까지 선, 셋째마다 나를 지남): 줄 수 · 간격 · 예고 · 굵기(반) */
  BIRDS: 30,
  BIRD_GAP: 14,
  BIRD_WARN: 54,
  BIRD_W: 7,
  /** 검귀 돌진 베기: 간격 · 예고 · 굵기(반) · 내 자리 너머로 더 나가는 거리 */
  DASH_GAP: 44,
  DASH_WARN: 30,
  DASH_W: 12,
  DASH_OVER: 30,
  /** 검귀 부채꼴 검기: 간격 · 빠르기 */
  QI_GAP: 26,
  QI_SPEED: 2.2,
  /** 검귀 점프 내려찍기: 그림자가 따라오는 틱 · 따라오는 빠르기 · 멈춘 뒤 떨어지기까지 · 반경 */
  JUMP_FOLLOW: 90,
  JUMP_SPEED: 2.4,
  JUMP_LAND: 30,
  JUMP_R: 50,
  /** 염희 빨아들이기: 예고 · 끌려가는 틱 · 끄는 빠르기(걷기의 몇 배, 걷는 입력 대신) · 둘레 불 반경 · 닿으면 피해 · 튕겨 나가는 거리 */
  PULL_WARN: 60,
  PULL: 600,
  PULL_SPEED: 0.75,
  PULL_FIRE_R: 14,
  PULL_HIT: 50,
  PULL_PUSH: 90,
};
export { R as BOSS_CERB_TRIO_RULES };

type Vec = readonly [number, number];
/** 사람마다 공격 셋의 반복 수 · 한 번 사이 틱 */
const REPS: Record<string, readonly number[]> = { cerbfist: [3, 2, 1], cerbflame: [10, 1, R.BIRDS], cerbblade: [3, 3, 1] };
const gapOf = (kind: string, move: number): number =>
  kind === "cerbfist" ? [R.SLAM_GAP, R.SWEEP_GAP, R.FALL_WARN + 30][move]! : kind === "cerbflame" ? [R.PILLAR_GAP, R.BREATH_WARN + 22, R.BIRD_GAP][move]! : [R.DASH_GAP, R.QI_GAP, 0][move]!;

/** 빨아들이기 시작 (지휘자가 부름) */
export function startPull(s: RunState, e: EnemyState): void {
  e.cbPullEnd = s.tick + R.PULL_WARN + R.PULL;
}
/** 빨아들이는 중 (예고 뒤) */
export const pulling = (s: RunState, e: EnemyState) => e.cbPullEnd !== undefined && s.tick >= e.cbPullEnd - R.PULL && s.tick < e.cbPullEnd;

const pose = (s: RunState, e: EnemyState, f: number, ticks: number) => {
  e.cbPose = f;
  e.cbPoseEnd = s.tick + ticks;
};

export function updateCerbTrio(s: RunState, e: EnemyState, toP: Vec): void {
  const boss = cerbDirector(s);
  if ((e.cbPoseEnd ?? 0) <= s.tick) e.cbPose = 0;
  e.dirX = toP[0];
  e.dirY = toP[1];
  // 무너지는 바닥: 셋이 위쪽 가운데로 모여 떠 있음 (무적)
  if (floorBusy(s, boss)) {
    const i = CERB_TRIO.indexOf(e.kind as never);
    const gx = ROOM_CX + (i - 1) * 34;
    const gy = ROOM_MIN_Y + 36;
    e.x += (gx - e.x) * 0.08;
    e.y += (gy - e.y) * 0.08;
    e.immune = e.air = true;
    e.phase = "walk";
    if (s.tick === boss!.cbFloor!.at) pose(s, e, 3, 40);
    e.timer = Math.max(e.timer, 60);
    return;
  }
  e.air = false;
  e.immune = false;
  const alive = s.enemies.filter((o) => (CERB_TRIO as readonly string[]).includes(o.kind) && o.hp > 0).length;
  const rage = alive >= 3 ? 1 : alive === 2 ? R.RAGE1 : R.RAGE2;
  const rush = alive >= 3 ? 1 : alive === 2 ? R.RUSH1 : R.RUSH2;
  const flame = s.enemies.find((o) => o.kind === "cerbflame" && o.hp > 0);
  // 빨아들이는 동안 다른 둘은 조금 느리게
  const slow = flame && pulling(s, flame) && e !== flame ? 1.3 : 1;
  if (e.kind === "cerbflame" && e.cbPullEnd !== undefined && s.tick < e.cbPullEnd) return pullTick(s, e);
  if (e.kind === "cerbblade" && bladeBusy(s, e, toP)) return;
  // 움직임: 권귀는 다가옴 · 염희는 위쪽에서 옆으로 · 검귀는 거리를 둠
  const sp = ENEMIES[e.kind].speed * rush;
  if (e.kind === "cerbfist") {
    e.x += toP[0] * sp;
    e.y += toP[1] * sp;
  } else if (e.kind === "cerbflame") {
    e.x += Math.sign(s.player.x - e.x) * sp;
    e.y += (ROOM_MIN_Y + 40 - e.y) * 0.05;
  } else {
    const d = Math.hypot(s.player.x - e.x, s.player.y - e.y);
    const k = d > 90 ? 1 : d < 60 ? -1 : 0;
    e.x += toP[0] * sp * k;
    e.y += toP[1] * sp * k;
  }
  if (e.timer > 0) return;
  const move = e.cbMove ?? 0;
  const rep = e.cbRep ?? 0;
  act(s, e, toP, move, rep);
  const reps = REPS[e.kind]![move]!;
  e.timer = Math.round(gapOf(e.kind, move) * rage * slow);
  if (rep + 1 >= reps) {
    e.cbMove = (move + 1) % 3;
    e.cbRep = 0;
    e.timer += Math.round(R.REST * rage);
  } else e.cbRep = rep + 1;
}

function act(s: RunState, e: EnemyState, toP: Vec, move: number, rep: number): void {
  const p = s.player;
  const dmg = hitDamage(s);
  if (e.kind === "cerbfist") {
    if (move === 0) {
      addShape(s, R.SLAM_WARN, { x: p.x, y: p.y, radius: R.SLAM_R, damage: dmg, fx: "meteor" });
      pose(s, e, 2, 30);
    } else if (move === 1) {
      // 두 번째 쓸기는 반대쪽 (뒤로 돈 사람을 노림)
      const k = rep === 0 ? 1 : -1;
      addShape(s, R.SWEEP_WARN, { x: e.x, y: e.y, radius: R.SWEEP_R, damage: dmg * 1.1, dirX: toP[0] * k, dirY: toP[1] * k, arc: 0, fx: "bslash" });
      pose(s, e, 2, 40);
    } else {
      const rng = createRng(deriveSeed(s.seed, "cerbFall", e.id, s.tick));
      for (let i = 0; i < R.FALL; i++) {
        const x = i === 0 ? p.x : rng.int(ROOM_MIN_X + 10, ROOM_MAX_X - 10);
        const y = i === 0 ? p.y : rng.int(ROOM_MIN_Y + 10, ROOM_MAX_Y - 10);
        addShape(s, R.FALL_WARN, { x, y, radius: R.FALL_R, damage: dmg * 0.7, fx: "meteor" });
      }
      pose(s, e, 3, 70);
    }
  } else if (e.kind === "cerbflame") {
    if (move === 0) {
      const rng = createRng(deriveSeed(s.seed, "cerbPillar", e.id, s.tick));
      for (let i = 0; i < 3; i++) {
        const mine = i === 0 && rep % 3 === 0;
        const x = mine ? p.x : rng.int(ROOM_MIN_X + 10, ROOM_MAX_X - 10);
        const y = mine ? p.y : rng.int(ROOM_MIN_Y + 10, ROOM_MAX_Y - 10);
        addShape(s, R.PILLAR_WARN, { x, y, radius: R.PILLAR_R, damage: dmg * 0.5, by: "cerbflame", fx: "pillar" });
      }
      pose(s, e, 1, 20);
    } else if (move === 1) {
      addShape(s, R.BREATH_WARN, { x: e.x, y: e.y, radius: R.BREATH_R, damage: dmg, by: "cerbflame", fx: "meteor" });
      pose(s, e, 2, 60);
    } else {
      bird(s, e, rep);
      pose(s, e, 2, 16);
    }
  } else if (move === 0) {
    // 돌진 베기: 선 예고 → 그 끝으로 단숨에
    const len = Math.hypot(p.x - e.x, p.y - e.y) + R.DASH_OVER;
    const tx = Math.max(ROOM_MIN_X + e.r, Math.min(ROOM_MAX_X - e.r, e.x + toP[0] * len));
    const ty = Math.max(ROOM_MIN_Y + e.r, Math.min(ROOM_MAX_Y - e.r, e.y + toP[1] * len));
    addShape(s, R.DASH_WARN, { x: e.x, y: e.y, radius: 0, toX: tx, toY: ty, width: R.DASH_W, damage: dmg, fx: "bslash", owner: e.id });
    e.phase = "charge";
    e.aux = s.tick + R.DASH_WARN;
    e.auxX = tx;
    e.auxY = ty;
    pose(s, e, 1, R.DASH_WARN);
  } else if (move === 1) {
    fan(s, e, toP, rep === 1 ? [-3, -1, 1, 3] : [-2, -1, 0, 1, 2], R.QI_SPEED, { look: "wave", from: "cerbblade" });
    pose(s, e, 2, 20);
  } else {
    // 점프 내려찍기: 하늘로 사라져 그림자가 따라옴 (무적)
    e.phase = "blink";
    e.aux = s.tick;
    pose(s, e, 3, R.JUMP_FOLLOW);
  }
}

/** 검귀 돌진·점프 중이면 true */
function bladeBusy(s: RunState, e: EnemyState, toP: Vec): boolean {
  if (e.phase === "charge") {
    if (s.tick < (e.aux ?? 0)) return true;
    e.x = e.auxX ?? e.x;
    e.y = e.auxY ?? e.y;
    e.phase = "walk";
    pose(s, e, 2, 16);
    addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 14, maxTicks: 12 });
    return true;
  }
  if (e.phase !== "blink") return false;
  const t = s.tick - (e.aux ?? s.tick);
  e.immune = e.air = true;
  if (t < R.JUMP_FOLLOW) {
    e.x += toP[0] * R.JUMP_SPEED;
    e.y += toP[1] * R.JUMP_SPEED;
  } else if (t === R.JUMP_FOLLOW) addShape(s, R.JUMP_LAND, { x: e.x, y: e.y, radius: R.JUMP_R, damage: hitDamage(s) * 1.3, fx: "meteor" });
  else if (t >= R.JUMP_FOLLOW + R.JUMP_LAND) {
    e.immune = e.air = false;
    e.phase = "walk";
    ring(s, e, 1, 0, 1.4, { look: "wave", from: "cerbblade" });
    pose(s, e, 2, 30);
  }
  return true;
}

/** 지옥불새 한 줄: 방 끝에서 끝까지 (가로·세로·대각선, 셋째마다 내 자리를 지남) */
function bird(s: RunState, e: EnemyState, n: number): void {
  const rng = createRng(deriveSeed(s.seed, "cerbBird", e.id, s.tick));
  const d = [DIR16[0]!, DIR16[4]!, DIR16[2]!, DIR16[6]!][rng.int(0, 3)]!;
  const px = n % 3 === 0 ? s.player.x : rng.int(ROOM_MIN_X + 10, ROOM_MAX_X - 10);
  const py = n % 3 === 0 ? s.player.y : rng.int(ROOM_MIN_Y + 10, ROOM_MAX_Y - 10);
  // 선을 방 안으로 자름
  let lo = -1e4;
  let hi = 1e4;
  for (const [p0, v, a, b] of [[px, d[0], ROOM_MIN_X, ROOM_MAX_X], [py, d[1], ROOM_MIN_Y, ROOM_MAX_Y]] as const) {
    if (Math.abs(v) < 1e-6) continue;
    const t1 = (a - p0) / v;
    const t2 = (b - p0) / v;
    lo = Math.max(lo, Math.min(t1, t2));
    hi = Math.min(hi, Math.max(t1, t2));
  }
  addShape(s, R.BIRD_WARN, { x: px + d[0] * lo, y: py + d[1] * lo, radius: 0, toX: px + d[0] * hi, toY: py + d[1] * hi, width: R.BIRD_W, damage: hitDamage(s) * 0.55, by: "cerbflame", fx: "holy", from: "hellbird" });
}

/** 염희 빨아들이기: 예고(거대 불 악마) → 10초 동안 사람마다 끌려감 · 둘레 불에 닿으면 큰 피해 + 튕겨 나감 */
function pullTick(s: RunState, e: EnemyState): void {
  pose(s, e, 3, 2);
  if (!pulling(s, e)) return;
  eachSeat(
    s,
    () => {
      const p = s.player;
      p.lureTicks = 2;
      p.lureId = e.id;
      const dx = p.x - e.x;
      const dy = p.y - e.y;
      if (dx * dx + dy * dy > (e.r + p.r + R.PULL_FIRE_R) ** 2) return;
      throughDash(s, () => damagePlayer(s, R.PULL_HIT, "cerbflame"));
      const v = normalize(dx, dy) ?? [0, 1];
      p.x += v[0] * R.PULL_PUSH;
      p.y += v[1] * R.PULL_PUSH;
      keepInRoom(p, roomGrid(s));
      addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 26, maxTicks: 16, foe: true });
    },
    true,
  );
}
