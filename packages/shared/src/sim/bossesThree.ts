// 3단계(5·6층) 새 보스: 데스 · 검신 (천사장은 bossAngel). 체력 절반 아래면 더 빠르고 공격이 늘어남
import { ENEMIES } from "../content";
import { createRng, deriveSeed } from "../rng";
import { fan, half, hitDamage, ring, distTo } from "./bossKit";
import { addShape } from "./hazards";
import type { EnemyState, RunState } from "./types";
import { addEffect, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

type Vec = readonly [number, number];

/** 데스: 낫 반경·부채꼴 cos(약 200도) · 등 뒤 순간이동 거리 · 한 바퀴 베기 반경 */
const SCYTHE_R = 75;
const SCYTHE_ARC = -0.2;
const BEHIND = 30;
const SPIN_R = 66;

/** 데스: 다가오며 큰 낫 휘두르기(절반 아래면 앞뒤 두 번) · 세 번째마다 등 뒤로 순간이동해 한 바퀴 베기 · 멀면 영혼 탄 */
export function updateReaper(s: RunState, e: EnemyState, toP: Vec, go: Vec): void {
  const h = half(e);
  const p = s.player;
  if (e.phase === "act") {
    if (e.timer <= 0) {
      e.phase = "walk";
      e.timer = h ? 40 : 60;
    }
    return;
  }
  e.x += go[0] * ENEMIES.reaper.speed;
  e.y += go[1] * ENEMIES.reaper.speed;
  e.dirX = toP[0];
  e.dirY = toP[1];
  if (e.timer > 0) return;
  e.count++;
  e.phase = "act";
  if (e.count % 3 === 0) {
    addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 10, maxTicks: 12 });
    e.x = e.prevX = p.x - p.faceX * BEHIND;
    e.y = e.prevY = p.y - p.faceY * BEHIND;
    addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 10, maxTicks: 12 });
    addShape(s, 42, { x: e.x, y: e.y, radius: SPIN_R, damage: hitDamage(s), arc: -1, fx: "bslash" });
    e.timer = 55;
  } else if (distTo(s, e) < 75) {
    const warn = h ? 30 : 38;
    addShape(s, warn, { x: e.x, y: e.y, radius: SCYTHE_R, damage: hitDamage(s), dirX: toP[0], dirY: toP[1], arc: SCYTHE_ARC, fx: "bslash" });
    if (h) addShape(s, warn + 24, { x: e.x, y: e.y, radius: SCYTHE_R, damage: hitDamage(s), dirX: -toP[0], dirY: -toP[1], arc: SCYTHE_ARC, fx: "bslash" });
    e.timer = warn + (h ? 34 : 12);
  } else {
    fan(s, e, toP, [-1, 0, 1], 1.4, { look: "soul" });
    if (h) ring(s, e, 2, e.count, 1.1, { look: "soul" });
    e.timer = 20;
  }
}

/** 검신: 검기 격자 간격·굵기 · 일섬 길이·굵기 */
const GRID = 32;
const LINE_W = 3;
const SLASH_LEN = 170;

/** 방 전체에 가로세로 검기를 그어 빛나게 함 (빛나지 않는 칸이 안전). red = 먼저 터지는 붉은 검기 */
function bladeGrid(s: RunState, warn: number, ox: number, oy: number, red = false): void {
  const fx = red ? "rgleam" : "gleam";
  const dmg = hitDamage(s);
  for (let x = ROOM_MIN_X + ox; x < ROOM_MAX_X; x += GRID) addShape(s, warn, { x, y: ROOM_MIN_Y, radius: 0, damage: dmg, toX: x, toY: ROOM_MAX_Y, width: LINE_W, fx });
  for (let y = ROOM_MIN_Y + oy; y < ROOM_MAX_Y; y += GRID) addShape(s, warn, { x: ROOM_MIN_X, y, radius: 0, damage: dmg, toX: ROOM_MAX_X, toY: y, width: LINE_W, fx });
}

/** 검신: 검기 격자(절반 아래면 어긋난 격자가 한 번 더) · 플레이어를 꿰뚫는 일섬 뒤 그 끝으로 순간이동 */
export function updateSwordGod(s: RunState, e: EnemyState, toP: Vec, go: Vec): void {
  const h = half(e);
  if (e.phase === "charge") {
    // 일섬이 터지는 순간 선 끝으로
    if (e.timer > 0) return;
    e.x = e.prevX = e.auxX ?? e.x;
    e.y = e.prevY = e.auxY ?? e.y;
    e.phase = "walk";
    e.timer = h ? 40 : 60;
    return;
  }
  if (e.phase === "act") {
    if (e.timer <= 0) {
      e.phase = "walk";
      e.timer = h ? 40 : 60;
    }
    return;
  }
  e.x += go[0] * ENEMIES.swordgod.speed;
  e.y += go[1] * ENEMIES.swordgod.speed;
  e.dirX = toP[0];
  e.dirY = toP[1];
  if (e.timer > 0) return;
  e.count++;
  if (e.count % 2 === 1) {
    const rng = createRng(deriveSeed(s.seed, "bladeGrid", s.floor, e.count));
    const ox = rng.int(4, GRID - 4);
    const oy = rng.int(4, GRID - 4);
    const warn = h ? 50 : 60;
    // 절반 아래면 붉은 검기가 먼저 터지고, 어긋난 흰 검기가 뒤따름
    bladeGrid(s, warn, ox, oy, h);
    if (h) bladeGrid(s, warn + 40, (ox + GRID / 2) % GRID, (oy + GRID / 2) % GRID);
    e.phase = "act";
    e.timer = warn + (h ? 50 : 10);
  } else {
    const warn = h ? 18 : 22;
    const d = normalize(s.player.x - e.x, s.player.y - e.y) ?? [1, 0];
    const tx = Math.max(ROOM_MIN_X + 10, Math.min(ROOM_MAX_X - 10, e.x + d[0] * SLASH_LEN));
    const ty = Math.max(ROOM_MIN_Y + 10, Math.min(ROOM_MAX_Y - 10, e.y + d[1] * SLASH_LEN));
    addShape(s, warn, { x: e.x, y: e.y, radius: 0, damage: hitDamage(s), toX: tx, toY: ty, width: 6, fx: "gleam" });
    e.auxX = tx;
    e.auxY = ty;
    e.phase = "charge";
    e.timer = warn;
  }
}
