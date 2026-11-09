// 레비아탄 페이즈 3 해왕: 물이 빠진 평범한 바닥에서 걸어 다님. 공격 차례로 물 채찍 2연 → 소용돌이 구슬 → 물의 용
// 패턴: 썰물·밀물(방 반쪽이 잠김, 다음은 반대쪽) · 바다의 메아리(66%·33%, 유령 선장 + 물 탄환) · 삼지창 빛(차례로 꽂힘, 마지막은 기절)
// 궁극기 해일 승천 (체력 10% 아래 한 번): 무적으로 떠올라 방에 물이 다시 참 (숨 6초 · 비눗방울 · 물의 용 4 · 토네이도) → 끝나면 지쳐 받는 피해 증가
import { ROOM_CX } from "../constants";
import { createRng, deriveSeed } from "../rng";
import { hitDamage, turn } from "./bossKit";
import { levPose } from "./bossLeviathan";
import { envDamage } from "./combat";
import { addShape } from "./hazards";
import { addBubble, addTornado, dive, ghostShip, levDirector, setWater } from "./levKit";
import { eachSeat } from "./party";
import type { EnemyState, RunState } from "./types";
import { enemyShot, keepInRoom, normalize, roomGrid, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 공격 사이 틱 · 한 바퀴 뒤 쉬는 틱 · 이만큼 가까우면 멈춰 섬 */
  GAP: 46,
  REST: 50,
  NEAR: 48,
  /** 물 채찍 (반원, 두 번째는 반대쪽): 예고 · 반경 · 피해 배율 */
  WHIP_WARN: 30,
  WHIP_R: 72,
  WHIP_MUL: 1,
  /** 소용돌이 구슬 3개: 예고 · 반경 · 피해 배율 · 소용돌이가 남는 틱 · 반경 · 끌어당기는 힘 · 틱 피해 · 그 간격 */
  ORB_WARN: 40,
  ORB_R: 14,
  ORB_MUL: 0.8,
  VORTEX: 120,
  VORTEX_R: 40,
  VORTEX_PULL: 0.6,
  VORTEX_DMG: 3,
  VORTEX_EVERY: 20,
  /** 물의 용 (방을 가로지르는 구불구불한 길): 예고 · 굵기(반) · 피해 배율 · 두 마리 사이 틱 */
  DRAGON_WARN: 60,
  DRAGON_W: 10,
  DRAGON_MUL: 1.1,
  DRAGON_GAP: 70,
  /** 썰물·밀물: 처음 · 간격 · 예고 · 잠기는 틱 · 틱 피해 · 그 간격 · 잠긴 곳 이동 배율 */
  TIDE_FIRST: 600,
  TIDE_EVERY: 1500,
  TIDE_WARN: 90,
  TIDE: 150,
  TIDE_DMG: 4,
  TIDE_HIT_EVERY: 15,
  TIDE_SLOW: 0.6,
  /** 삼지창 빛: 간격 · 수 · 사이 틱 · 예고 · 반경 · 피해 배율 (마지막은 기절 0.5초 foeStatus) */
  SPEAR_EVERY: 720,
  SPEARS: 5,
  SPEAR_GAP: 20,
  SPEAR_WARN: 36,
  SPEAR_R: 16,
  SPEAR_MUL: 0.7,
  /** 바다의 메아리 물 탄환 수 · 빠르기 */
  ECHO_SHOTS: 20,
  ECHO_SPEED: 1.5,
  /** 궁극기: 체력 비율 · 길이 · 숨(틱) · 비눗방울 간격 · 한 번에 · 남는 틱 · 물의 용 간격 · 지친 틱 · 지쳤을 때 받는 피해 배율 */
  ULT_AT: 0.1,
  ULT: 720,
  ULT_AIR: 360,
  ULT_BUBBLE_EVERY: 240,
  ULT_BUBBLES: 3,
  ULT_BUBBLE: 200,
  ULT_DRAGON_EVERY: 180,
  TIRED: 300,
  TIRED_TAKEN: 1.5,
};
export { R as BOSS_LEV_KING_RULES };

type Vec = readonly [number, number];
/** 공격 차례: 물 채찍 · 물 채찍 · 소용돌이 구슬 · 물의 용 */
const ORDER = [0, 0, 1, 2];

/** 지친 해왕은 더 아픔 (combat → classTaken) */
export const levTaken = (s: RunState, e: EnemyState) => ((e.lhTired ?? 0) > s.tick ? R.TIRED_TAKEN : 1);
/** 궁극기 중 */
export const levUlting = (s: RunState, e: EnemyState) => e.lhUlt !== undefined && s.tick < e.lhUlt + R.ULT;

export function updateLevKing(s: RunState, e: EnemyState, toP: Vec, spawned: EnemyState[]): void {
  e.stunTicks = 0;
  if (e.lhNextTide === undefined) {
    e.lhNextTide = s.tick + R.TIDE_FIRST;
    e.lhNextSpear = s.tick + R.SPEAR_EVERY / 2;
    e.lhEcho = 0;
  }
  if ((e.lhPoseEnd ?? 0) <= s.tick) e.lhPose = 0;
  e.dirX = toP[0];
  vortexTick(s, e);
  tideTick(s, e);
  spearTick(s, e);
  if (ultTick(s, e) || (e.lhTired ?? 0) > s.tick) return;
  // 바다의 메아리 (66%·33%에서 한 번씩)
  const echo = e.lhEcho ?? 0;
  if ((echo === 0 && e.hp < e.maxHp * 0.66) || (echo === 1 && e.hp < e.maxHp * 0.33)) {
    e.lhEcho = echo + 1;
    echoes(s, e, spawned);
  }
  if (s.tick >= (e.lhNextTide ?? 0) && !e.lhTide) {
    e.lhNextTide = s.tick + R.TIDE_EVERY;
    e.lhTide = { side: tideSide(s, e, -1), at: s.tick + R.TIDE_WARN, end: s.tick + R.TIDE_WARN + R.TIDE };
  }
  if (s.tick >= (e.lhNextSpear ?? 0)) {
    e.lhNextSpear = s.tick + R.SPEAR_EVERY;
    e.lhSpear = R.SPEARS;
    levPose(s, e, 4, 40);
  }
  const far = Math.hypot(s.player.x - e.x, s.player.y - e.y) > R.NEAR;
  if (far) {
    e.x += toP[0] * 0.55;
    e.y += toP[1] * 0.55;
  }
  if (e.timer > 0) return;
  const k = ORDER[e.count % ORDER.length]!;
  e.count++;
  e.timer = R.GAP + (e.count % ORDER.length === 0 ? R.REST : 0);
  const p = s.player;
  const dmg = hitDamage(s);
  if (k === 0) {
    const flip = e.count % 2 === 0 ? -1 : 1;
    addShape(s, R.WHIP_WARN, { x: e.x, y: e.y, radius: R.WHIP_R, damage: dmg * R.WHIP_MUL, dirX: toP[0] * flip, dirY: toP[1] * flip, arc: 0, fx: "bslash", from: "levsweep" });
    levPose(s, e, 1, 30);
  } else if (k === 1) {
    for (const [ox, oy] of [[0, 0], [-30, 18], [30, 18]] as const) {
      const x = p.x + ox;
      const y = p.y + oy;
      addShape(s, R.ORB_WARN, { x, y, radius: R.ORB_R, damage: dmg * R.ORB_MUL, fx: "pillar", from: "levorbs" });
      (e.lhVortex ??= []).push([x, y, s.tick + R.ORB_WARN, s.tick + R.ORB_WARN + R.VORTEX]);
    }
    levPose(s, e, 2, 40);
  } else {
    waterDragon(s, e, 0);
    waterDragon(s, e, R.DRAGON_GAP);
    levPose(s, e, 3, R.DRAGON_WARN + R.DRAGON_GAP);
    e.timer += R.DRAGON_GAP;
  }
}

/** 물의 용 한 마리: 방 끝에서 끝까지 구불구불한 길 (가로·세로 번갈아) */
function waterDragon(s: RunState, e: EnemyState, delay: number): void {
  const rng = createRng(deriveSeed(s.seed, "levDragon", e.id, s.tick, delay));
  const across = rng.int(0, 1) === 0;
  const n = 7;
  const amp = rng.int(28, 46);
  const base = across ? rng.int(ROOM_MIN_Y + 50, ROOM_MAX_Y - 50) : rng.int(ROOM_MIN_X + 60, ROOM_MAX_X - 60);
  // 셋째 마디는 내 자리를 지남
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const wob = (i % 2 === 0 ? -1 : 1) * amp;
    pts.push(across ? [ROOM_MIN_X + t * (ROOM_MAX_X - ROOM_MIN_X), base + wob] : [base + wob, ROOM_MIN_Y + t * (ROOM_MAX_Y - ROOM_MIN_Y)]);
  }
  const mid = Math.floor(n / 2);
  pts[mid] = across ? [pts[mid]![0], s.player.y] : [s.player.x, pts[mid]![1]];
  for (let i = 0; i + 1 < n; i++) {
    const [x, y] = pts[i]!;
    const [tx, ty] = pts[i + 1]!;
    addShape(s, R.DRAGON_WARN + delay + i * 5, { x, y, radius: 0, toX: tx, toY: ty, width: R.DRAGON_W, damage: hitDamage(s) * R.DRAGON_MUL, fx: "gleam", from: "levdragon" }, delay);
  }
}

/** 소용돌이: 떨어진 뒤 남아 조금씩 끌어당기고 틱 피해 */
function vortexTick(s: RunState, e: EnemyState): void {
  e.lhVortex = (e.lhVortex ?? []).filter((v) => v[3] > s.tick);
  for (const [x, y, from] of e.lhVortex) {
    if (s.tick < from) continue;
    eachSeat(
      s,
      () => {
        const p = s.player;
        const d = Math.hypot(x - p.x, y - p.y);
        if (p.dashTicks > 0 || d > R.VORTEX_R || d < 1) return;
        p.x += ((x - p.x) / d) * R.VORTEX_PULL;
        p.y += ((y - p.y) / d) * R.VORTEX_PULL;
        if ((s.tick - from) % R.VORTEX_EVERY === 0) envDamage(s, R.VORTEX_DMG);
      },
      true,
    );
  }
}

/** 썰물·밀물 쪽 고르기 (체력 절반 아래면 위·아래도) · 반대쪽 */
function tideSide(s: RunState, e: EnemyState, prev: number): number {
  if (prev >= 0) return prev ^ 1;
  const rng = createRng(deriveSeed(s.seed, "levTide", e.id, s.tick));
  return rng.int(0, e.hp * 2 < e.maxHp ? 3 : 1);
}

/** 이 자리가 잠기는 쪽인지 */
export function inTide(side: number, x: number, y: number): boolean {
  const cy = (ROOM_MIN_Y + ROOM_MAX_Y) / 2;
  return side === 0 ? x < ROOM_CX : side === 1 ? x >= ROOM_CX : side === 2 ? y < cy : y >= cy;
}

/** 틱마다: 잠긴 쪽에 있으면 느려지고 계속 다침 · 끝나면 반대쪽이 한 번 더 */
function tideTick(s: RunState, e: EnemyState): void {
  const t = e.lhTide;
  if (!t) return;
  if (s.tick >= t.end) {
    e.lhTide = t.second ? undefined : { side: tideSide(s, e, t.side), at: s.tick + R.TIDE_WARN / 2, end: s.tick + R.TIDE_WARN / 2 + R.TIDE, second: true };
    return;
  }
  if (s.tick < t.at) return;
  eachSeat(
    s,
    () => {
      const p = s.player;
      if (p.dashTicks > 0 || !inTide(t.side, p.x, p.y)) return;
      p.x = p.prevX + (p.x - p.prevX) * R.TIDE_SLOW;
      p.y = p.prevY + (p.y - p.prevY) * R.TIDE_SLOW;
      if ((s.tick - t.at) % R.TIDE_HIT_EVERY === 0) envDamage(s, R.TIDE_DMG);
    },
    true,
  );
}

/** 삼지창 빛: 내 자리에 차례로 꽂힘 (마지막은 기절) */
function spearTick(s: RunState, e: EnemyState): void {
  if ((e.lhSpear ?? 0) <= 0 || s.tick % R.SPEAR_GAP !== 0) return;
  const last = e.lhSpear === 1;
  e.lhSpear = e.lhSpear! - 1;
  addShape(s, R.SPEAR_WARN, { x: s.player.x, y: s.player.y, radius: R.SPEAR_R, damage: hitDamage(s) * R.SPEAR_MUL, by: last ? "levking" : undefined, fx: "holy", from: "levspear" });
}

/** 바다의 메아리: 유령 선장 둘 + 방 아래에서 고래가 물 탄환 */
function echoes(s: RunState, e: EnemyState, spawned: EnemyState[]): void {
  const boss = levDirector(s);
  if (boss) {
    ghostShip(s, boss, spawned);
    ghostShip(s, boss, spawned);
  }
  const x = ROOM_CX;
  const y = ROOM_MAX_Y - 12;
  const aim = normalize(s.player.x - x, s.player.y - y) ?? [0, -1];
  for (let i = 0; i < R.ECHO_SHOTS; i++) {
    const d = turn(aim, (i % 7) - 3);
    Object.assign(enemyShot(s, x, y, d[0], d[1], R.ECHO_SPEED * (1 + (i % 3) * 0.15), hitDamage(s) * 0.45), { from: "levwhale", look: "wave", r: 4 });
  }
  levPose(s, e, 4, 60);
}

/** 해일 승천 (true면 이번 틱은 궁극기 중) */
function ultTick(s: RunState, e: EnemyState): boolean {
  const boss = levDirector(s);
  if (e.lhUlt === undefined && e.hp < e.maxHp * R.ULT_AT) {
    e.lhUlt = s.tick;
    s.hazards = [];
    if (boss) {
      dive(boss, R.ULT_AIR);
      addTornado(s, boss, s.tick);
      addTornado(s, boss, s.tick + 1);
    }
    setWater(s, true);
  }
  if (e.lhUlt === undefined) return false;
  const t = s.tick - e.lhUlt;
  if (t > R.ULT) return false;
  if (t === R.ULT) {
    // 물이 빠지고 지쳐 무릎 꿇음
    if (boss) boss.lhWet = false;
    setWater(s, false);
    e.immune = e.air = false;
    e.lhTired = s.tick + R.TIRED;
    levPose(s, e, 0, R.TIRED);
    return true;
  }
  e.immune = e.air = true;
  levPose(s, e, 4, 2);
  e.x += (ROOM_CX - e.x) * 0.05;
  e.y += (ROOM_MIN_Y + 50 - e.y) * 0.05;
  keepInRoom(e, roomGrid(s));
  if (boss && t % R.ULT_BUBBLE_EVERY === 0) {
    const rng = createRng(deriveSeed(s.seed, "levUltBubble", e.id, t));
    for (let i = 0; i < R.ULT_BUBBLES; i++) addBubble(s, boss, rng.int(ROOM_MIN_X + 20, ROOM_MAX_X - 20), rng.int(ROOM_MIN_Y + 40, ROOM_MAX_Y - 20), R.ULT_BUBBLE);
  }
  if (t % R.ULT_DRAGON_EVERY === 30) waterDragon(s, e, 0);
  return true;
}
