// 라스트 보스 궁극기 (체력 10% 아래에서 한 번, 궁극기가 끝날 때까지 보스는 무적 — bosses.updateBoss)
// 용 염옥: 하던 패턴을 멈추고, 입에서 방 절반만 한 불덩이가 커지다 터지고, 방 전체 칸에 분화구가 차례로 보였다 사라짐 → 예고 없이 거꾸로 터짐 (안전한 칸 하나를 기억해서 따라감). 그동안 방 전체에 느린 화염 가루
// 갓이터 패링: bossCage
// 태초의 빛·어둠: 보스 다섯을 한꺼번에 부름 (다 쓰러뜨려야 끝)
import { ENEMIES } from "../content";
import { createRng, deriveSeed } from "../rng";
import { hitDamage } from "./bossKit";
import { damagePlayer } from "./combat";
import type { EnemyState, RunState } from "./types";
import { addEffect, enemyShot, makeEnemy, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

/** 궁극기를 쓰는 체력 비율 */
const ULT_HP = 0.1;
/** 염옥: 칸 나누기 · 불덩이가 커지는 틱 · 한 장면 보이는 틱 · 다 보인 뒤 쉬는 틱 · 터지는 간격 · 장면 수 */
export const HELL_COLS = 6;
export const HELL_ROWS = 4;
export const HELL_CHARGE = 120;
export const HELL_SHOW = 40;
const HELL_PAUSE = 50;
const HELL_GAP = 60;
export const HELL_WAVES = 7;
/** 화염 가루 (틱마다 생기는 수는 EMBERS_PER_TICK): 가장 느린 빠르기(벚꽃처럼 느림, 최대 2배) · 아래로 흘러내리는 정도 · 남는 틱 · 플레이어 둘레에 안 생기는 거리 */
const EMBER_SPEED = 0.15;
const EMBER_FALL = 0.4;
const EMBER_LIFE = 360;
const EMBER_CLEAR = 30;
const EMBERS_PER_TICK = 2;
const EMBER_DAMAGE = 2;
/** 체력 10% 아래로 처음 내려갔으면 true (한 번만) */
export function ultReady(e: EnemyState): boolean {
  if (e.ultDone || e.hp <= 0 || e.hp >= e.maxHp * ULT_HP) return false;
  e.ultDone = true;
  e.ultAt = undefined;
  return true;
}

/** 염옥 칸 q의 [왼, 위, 오른, 아래] */
export function hellCell(q: number): [number, number, number, number] {
  const w = (ROOM_MAX_X - ROOM_MIN_X) / HELL_COLS;
  const h = (ROOM_MAX_Y - ROOM_MIN_Y) / HELL_ROWS;
  const cx = q % HELL_COLS;
  const cy = Math.floor(q / HELL_COLS);
  return [ROOM_MIN_X + cx * w, ROOM_MIN_Y + cy * h, ROOM_MIN_X + (cx + 1) * w, ROOM_MIN_Y + (cy + 1) * h];
}

/** 장면 i가 터지는 때 (시작부터 틱). 마지막에 보인 장면부터 거꾸로 */
export function hellFireAt(i: number): number {
  return HELL_CHARGE + HELL_WAVES * HELL_SHOW + HELL_PAUSE + (HELL_WAVES - 1 - i) * HELL_GAP;
}

/** 용 염옥 시작: 장면마다 안전한 칸 하나 (이웃 칸으로만 옮겨 가서 따라갈 수 있게) */
export function startHellfire(s: RunState, e: EnemyState): void {
  const rng = createRng(deriveSeed(s.seed, "hellfire", e.id, s.tick));
  let q = rng.int(0, HELL_COLS * HELL_ROWS - 1);
  const safe = [q];
  while (safe.length < HELL_WAVES) {
    const x = q % HELL_COLS;
    const y = Math.floor(q / HELL_COLS);
    const next = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].filter(([a, b]) => a! >= 0 && a! < HELL_COLS && b! >= 0 && b! < HELL_ROWS);
    const [a, b] = next[rng.int(0, next.length - 1)]!;
    q = b! * HELL_COLS + a!;
    safe.push(q);
  }
  e.ultAt = s.tick;
  e.ultSafe = safe;
  // 하던 공격은 모두 거두고, 용은 그 자리에서 염옥에만 집중
  s.hazards = [];
  s.projectiles = s.projectiles.filter((pr) => pr.fromPlayer);
  e.waves = [];
  e.air = false;
  e.phase = "walk";
  e.aux = 0;
}

/** 염옥 동안 방 전체에 천천히 떠도는 화염 가루 (시선을 빼앗음, 닿으면 피해). 플레이어 바로 곁에는 생기지 않음 */
function ember(s: RunState, k: number): void {
  const p = s.player;
  const rng = createRng(deriveSeed(s.seed, "ember", s.tick, k));
  const x = ROOM_MIN_X + rng.nextFloat() * (ROOM_MAX_X - ROOM_MIN_X);
  const y = ROOM_MIN_Y + rng.nextFloat() * (ROOM_MAX_Y - ROOM_MIN_Y);
  if (Math.hypot(x - p.x, y - p.y) < EMBER_CLEAR) return;
  const d = normalize(rng.nextFloat() * 2 - 1, rng.nextFloat() * 2 - 1 + EMBER_FALL) ?? [0, 1];
  const speed = EMBER_SPEED + rng.nextFloat() * EMBER_SPEED;
  Object.assign(enemyShot(s, x, y, d[0], d[1], speed, EMBER_DAMAGE), { look: "ember" as const, r: 1, ticksLeft: EMBER_LIFE });
}

/** 분화구에 휩쓸림: 화염 가루에 맞은 뒤 무적·대시 중이어도 맞음 (기억으로만 피함) */
function eruption(s: RunState): void {
  const p = s.player;
  const dash = p.dashTicks;
  p.invulnTicks = 0;
  p.dashTicks = 0;
  damagePlayer(s, hitDamage(s) * 1.5);
  p.dashTicks = dash;
}

/** 틱마다: 불덩이가 터지면 분화구 장면 → 거꾸로 터짐 (안전한 칸 밖이면 피해) */
export function updateHellfire(s: RunState, e: EnemyState): void {
  const safeCells = e.ultSafe;
  if (e.ultAt === undefined || !safeCells) return;
  const t = s.tick - e.ultAt;
  if (t >= HELL_CHARGE && t < hellFireAt(0)) for (let k = 0; k < EMBERS_PER_TICK; k++) ember(s, k);
  if (t === HELL_CHARGE) addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 110, maxTicks: 24 });
  for (let i = 0; i < HELL_WAVES; i++) {
    if (t !== hellFireAt(i)) continue;
    const safe = safeCells[i]!;
    for (let q = 0; q < HELL_COLS * HELL_ROWS; q++) {
      if (q === safe) continue;
      const [l, top, r, b] = hellCell(q);
      addEffect(s, { kind: "burst", x: (l + r) / 2, y: (top + b) / 2, dirX: 0, dirY: 0, size: (r - l) / 2, maxTicks: 16 });
    }
    const [l, top, r, b] = hellCell(safe);
    const p = s.player;
    if (p.x < l || p.x > r || p.y < top || p.y > b) eruption(s);
    if (i === 0) {
      e.ultAt = undefined;
      e.ultSafe = undefined;
      e.immune = false;
    }
  }
}

/** 태초의 빛·어둠 마지막: 보스 다섯을 방 곳곳에 부름 (부른 보스가 쓰러져도 다른 보스는 남음) */
const LIGHT_HOST = ["hulk", "brood", "siren", "plant", "swordgod"] as const;
const DARK_HOST = ["seer", "knight", "archer", "centaur", "reaper"] as const;

export function summonHost(s: RunState, e: EnemyState, spawned: EnemyState[]): void {
  const kinds = e.kind === "plight" ? LIGHT_HOST : DARK_HOST;
  const spots: [number, number][] = [[0.2, 0.25], [0.8, 0.25], [0.2, 0.75], [0.8, 0.75], [0.5, 0.2]];
  kinds.forEach((kind, i) => {
    if (s.enemies.some((o) => o.kind === kind && o.hp > 0)) return;
    const [fx, fy] = spots[i]!;
    const m = makeEnemy(s, kind, ROOM_MIN_X + fx * (ROOM_MAX_X - ROOM_MIN_X), ROOM_MIN_Y + fy * (ROOM_MAX_Y - ROOM_MIN_Y), 1, 60 + i * 20);
    m.noGold = true;
    spawned.push(m);
    addEffect(s, { kind: "burst", x: m.x, y: m.y, dirX: 0, dirY: 0, size: 16, maxTicks: 20 });
  });
  e.ultAt = s.tick;
}

/** 틱마다: 불러낸 보스가 다 쓰러지면 궁극기 끝 (그때까지 무적) */
export function updateHost(s: RunState, e: EnemyState): void {
  if (e.ultAt === undefined || s.tick === e.ultAt) return;
  if (s.enemies.some((o) => o.noGold && ENEMIES[o.kind].boss && o.hp > 0)) return;
  e.ultAt = undefined;
  e.immune = false;
}
