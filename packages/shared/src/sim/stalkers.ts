// 시즌 2 새 몬스터 넷 (enemies에서 부름)
// 도플갱어(나와 같은 모습: 내 무기가 멀리 쏘는 것이면 거리를 두고 쏘고, 아니면 다가와 벰 · 능력치·무기는 따라 하지 않음)
// 베놈(독잠자리: 이리저리 날며 방 곳곳에 독가스 · 가스 안에 있으면 부식독 = 모든 회복·재생 40% 감소, sim/terrain)
// 땅 물고기(땅속에서 나를 따라오는 원 → 멈춰 깜빡이다 솟구침 → 다른 자리로 뛰어 들어가며 그 자리도 터짐)
// 그림자(희미하게 비치며 내 등 뒤로 돌아가 큰 한 방)
import { ENEMIES } from "../content";
import { roomTerrain } from "./bossToad";
import { depth } from "./hero";
import { addShape } from "./hazards";
import type { EnemyState, RunState } from "./types";
import { DIR16, dist2, enemyShot, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, weaponOf } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 도플갱어: 멀리 쏘는 무기로 치는 사거리 · 거리 두기 · 쏘는 간격 · 탄 빠르기·피해 · 베기 범위·예고·피해 · 쉬는 틱 */
  DOP_RANGED: 90,
  DOP_KEEP: 75,
  DOP_SHOT_GAP: 75,
  DOP_SHOT_SPEED: 2,
  DOP_SHOT_DMG: 9,
  DOP_SLASH_R: 26,
  DOP_SLASH_WARN: 18,
  DOP_SLASH_DMG: 11,
  DOP_REST: 60,
  /** 베놈: 흔들림 · 가스 간격 · 가스 반경 · 가스가 남는 틱 · 방에 가스 최대 */
  VEN_WOBBLE: 0.9,
  GAS_GAP: 120,
  GAS_R: 22,
  GAS_TICKS: 420,
  GAS_MAX: 6,
  /** 땅 물고기: 땅속 따라오는 틱 · 따라오는 빠르기 · 솟구치는 예고 · 범위 · 피해 · 뛰는 틱 · 뛰는 거리 */
  FISH_UNDER: 130,
  FISH_SPEED: 0.75,
  FISH_WARN: 34,
  FISH_R: 20,
  FISH_DMG: 10,
  FISH_JUMP: 100,
  FISH_LEAP: 70,
  /** 그림자: 등 뒤 거리 · 그 자리에 가까우면 공격 · 예고 · 범위 · 피해(층 세기에 더함) · 쉬는 틱 */
  LURK_BEHIND: 26,
  LURK_NEAR: 12,
  LURK_WARN: 24,
  LURK_R: 30,
  LURK_DMG: 20,
  LURK_REST: 140,
};
export { R as STALKERS_RULES };

type Vec = readonly [number, number];

/** 도플갱어가 멀리서 쏘는지 (따라 한 사람의 무기 사거리로) */
export const dopRanged = (s: RunState): boolean => weaponOf(s.player).range >= R.DOP_RANGED;

const clampX = (x: number) => Math.max(ROOM_MIN_X + 10, Math.min(ROOM_MAX_X - 10, x));
const clampY = (y: number) => Math.max(ROOM_MIN_Y + 10, Math.min(ROOM_MAX_Y - 10, y));

function doppel(s: RunState, e: EnemyState, toP: Vec, go: Vec): void {
  const sp = ENEMIES.doppel.speed;
  e.dirX = toP[0];
  e.dirY = toP[1];
  if (e.phase === "windup") {
    if (--e.timer > 0) return;
    e.phase = "walk";
    e.timer = R.DOP_REST;
    return;
  }
  e.timer--;
  const d2 = dist2(e, s.player);
  if (dopRanged(s)) {
    // 거리를 두고 내 쪽으로 쏨
    const dir = d2 > R.DOP_KEEP * R.DOP_KEEP ? 1 : d2 < (R.DOP_KEEP - 20) ** 2 ? -1 : 0;
    const m = dir > 0 ? go : toP;
    e.x += m[0] * sp * dir;
    e.y += m[1] * sp * dir;
    if (e.timer <= 0) {
      e.timer = R.DOP_SHOT_GAP;
      enemyShot(s, e.x, e.y, toP[0], toP[1], R.DOP_SHOT_SPEED, R.DOP_SHOT_DMG + depth(s));
    }
    return;
  }
  // 다가와 앞을 벰
  e.x += go[0] * sp;
  e.y += go[1] * sp;
  if (e.timer <= 0 && d2 < (R.DOP_SLASH_R + 6) ** 2) {
    addShape(s, R.DOP_SLASH_WARN, { x: e.x, y: e.y, radius: R.DOP_SLASH_R, damage: R.DOP_SLASH_DMG + depth(s), dirX: toP[0], dirY: toP[1], arc: 0.3, fx: "bslash" });
    e.phase = "windup";
    e.timer = R.DOP_SLASH_WARN;
  }
}

function venom(s: RunState, e: EnemyState, go: Vec): void {
  const sp = ENEMIES.venom.speed;
  const w = DIR16[(Math.floor(s.tick / 14) + e.id * 5) % 16]!;
  e.x += (go[0] + w[0] * R.VEN_WOBBLE) * sp;
  e.y += (go[1] + w[1] * R.VEN_WOBBLE) * sp;
  e.dirX = go[0];
  if (--e.timer > 0) return;
  e.timer = R.GAS_GAP;
  // 날아다닌 자리에 독가스 (오래된 것부터 사라짐)
  const t = roomTerrain(s);
  const gas = (t.gas ??= []);
  gas.push({ x: Math.round(e.x), y: Math.round(e.y), r: R.GAS_R, until: s.tick + R.GAS_TICKS });
  if (gas.length > R.GAS_MAX) gas.shift();
}

/** 땅 물고기: step 0 땅속에서 따라옴 · 1 멈춰 깜빡임(솟구칠 예고) · 2 뛰어오름(맞출 수 있음) */
function landfish(s: RunState, e: EnemyState): void {
  const st = e.step ?? 0;
  if (e.phase !== "act") {
    e.phase = "act";
    e.step = 0;
    e.air = e.immune = true;
    e.timer = R.FISH_UNDER;
    return;
  }
  e.timer--;
  if (st === 0) {
    const dx = s.player.x - e.x;
    const dy = s.player.y - e.y;
    const d = Math.hypot(dx, dy);
    if (d > 1) {
      const v = Math.min(d, R.FISH_SPEED);
      e.x += (dx / d) * v;
      e.y += (dy / d) * v;
    }
    if (e.timer > 0) return;
    e.step = 1;
    e.timer = R.FISH_WARN;
    addShape(s, R.FISH_WARN, { x: e.x, y: e.y, radius: R.FISH_R, damage: R.FISH_DMG + depth(s), fx: "pillar" });
  } else if (st === 1) {
    if (e.timer > 0) return;
    // 솟구침 → 다른 자리로 뛰어 듦 (그 자리도 표시되고 떨어지면 터짐)
    const k = DIR16[(e.count * 7 + e.id * 3) % 16]!;
    e.count++;
    e.auxX = clampX(s.player.x + k[0] * R.FISH_LEAP);
    e.auxY = clampY(s.player.y + k[1] * R.FISH_LEAP);
    e.dirX = Math.sign(e.auxX - e.x) || 1;
    e.step = 2;
    e.timer = R.FISH_JUMP;
    e.air = e.immune = false;
    addShape(s, R.FISH_JUMP, { x: e.auxX, y: e.auxY, radius: R.FISH_R, damage: R.FISH_DMG + depth(s), fx: "pillar" });
  } else {
    const left = Math.max(1, e.timer + 1);
    e.x += ((e.auxX ?? e.x) - e.x) / left;
    e.y += ((e.auxY ?? e.y) - e.y) / left;
    if (e.timer > 0) return;
    e.step = 0;
    e.air = e.immune = true;
    e.timer = R.FISH_UNDER;
  }
}

/** 그림자: 내 등 뒤 자리로 돌아가 큰 한 방 → 물러나 쉼 */
function lurker(s: RunState, e: EnemyState, toP: Vec, go: Vec): void {
  const p = s.player;
  const sp = ENEMIES.lurker.speed;
  if (e.phase === "windup") {
    if (--e.timer > 0) return;
    e.phase = "walk";
    e.timer = R.LURK_REST;
    return;
  }
  e.timer--;
  if (e.timer > R.LURK_REST / 2) {
    // 친 뒤에는 잠깐 물러남
    e.x -= toP[0] * sp;
    e.y -= toP[1] * sp;
    return;
  }
  const bx = clampX(p.x - p.faceX * R.LURK_BEHIND);
  const by = clampY(p.y - p.faceY * R.LURK_BEHIND);
  const dx = bx - e.x;
  const dy = by - e.y;
  const d = Math.hypot(dx, dy);
  if (d > R.LURK_NEAR) {
    // 멀면 길 따라, 가까우면 등 뒤 자리로 곧장
    const m: Vec = d > 60 ? go : [dx / d, dy / d];
    e.x += m[0] * sp;
    e.y += m[1] * sp;
    e.dirX = m[0];
    return;
  }
  if (e.timer > 0) return;
  addShape(s, R.LURK_WARN, { x: e.x, y: e.y, radius: R.LURK_R, damage: R.LURK_DMG + 3 * depth(s), dirX: toP[0], dirY: toP[1], arc: 0.2, fx: "bslash" });
  e.phase = "windup";
  e.timer = R.LURK_WARN;
}

/** 새 몬스터면 움직이고 true */
export function updateStalker(s: RunState, e: EnemyState, toP: Vec, go: Vec): boolean {
  if (e.kind === "doppel") doppel(s, e, toP, go);
  else if (e.kind === "venom") venom(s, e, go);
  else if (e.kind === "landfish") landfish(s, e);
  else if (e.kind === "lurker") lurker(s, e, toP, go);
  else return false;
  return true;
}

/** 이 층(세기 depth)에 더 나오는 새 몬스터 (던전 방만, 광야·타워 디펜스 제외) */
export function stalkerKinds(d: number): ("doppel" | "venom" | "landfish" | "lurker")[] {
  if (d < 2) return [];
  if (d < 3) return ["venom", "landfish"];
  return ["venom", "landfish", "doppel", "lurker"];
}

/** 한 방에 최대 몇 마리 */
export const STALKER_MAX: Record<string, number> = { doppel: 1, lurker: 2, venom: 2, landfish: 2 };
