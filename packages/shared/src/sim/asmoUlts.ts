// 아스모데우스의 화신체 궁극기 (끝날 때까지 무적, 12초 버티기)
// 1 검은 해의 탄생 (75줄, 변신): 방 가운데 큰 블랙홀이 빨아들이며 보라 탄이 나선 두 갈래 → 닫히며 보라 파동 3번 (대시)
// 2 군주의 강림 (50줄, 변신): 결정 창이 방 절반 칸에 격자로 떨어져 잠깐 벽 → 톱니 날 고리가 조여 듦 (대시 박자)
// 3 욕망의 끝 (10줄): 세 모습의 기술 (불꽃 담 · 빨아들이기 · 결정 창 격자) → 지쳐 무릎 꿇음 (받는 피해 증가)
import { ROOM_CX } from "../constants";
import { createRng, deriveSeed } from "../rng";
import { addBlock, addWall, pullTo } from "./asmoKit";
import { hitDamage, shotDamage } from "./bossKit";
import { HELL_COLS, HELL_ROWS, hellCell } from "./bossUlts";
import { addWave } from "./bossWaves";
import { envDamage } from "./combat";
import { addShape } from "./hazards";
import { rot } from "./orbit";
import { eachSeat } from "./party";
import type { EnemyState, RunState } from "./types";
import { enemyShot, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 궁극기 길이 · 지친 틱 (마지막 궁극기 뒤) */
  ULT: 720,
  TIRED: 300,
  /** 검은 해: 빨아들이는 힘 · 핵 반경 · 핵 피해 · 나선 탄 간격 · 빠르기 · 파동 시작 · 파동 빠르기 · 파동 사이 */
  HOLE_PULL: 0.6,
  CORE_R: 34,
  CORE_DMG: 8,
  SPIRAL_EVERY: 6,
  SPIRAL_SPEED: 1.1,
  WAVE_AT: 600,
  WAVE_SPEED: 2.2,
  WAVE_GAP: 45,
  /** 결정 창 격자: 간격 · 예고 · 떨어지는 칸 수(24칸 중) · 벽으로 남는 틱 · 피해 배율 */
  GRID_EVERY: 120,
  GRID_WARN: 60,
  GRID_CELLS: 12,
  GRID_BLOCK: 180,
  GRID_MUL: 1,
  /** 톱니 날 고리 (대시 박자): 시작 · 예고 · 피해 배율 */
  SAW_AT: 600,
  SAW_WARN: 100,
  SAW_MUL: 1.4,
};
export { R as BOSS_ASMO_ULTS_RULES };

/** 방 가운데 (방 크기가 바뀌므로 그때그때) */
const cy = () => (ROOM_MIN_Y + ROOM_MAX_Y) / 2;

/** 궁극기 중 (화면) · 지금 몇 틱째 */
export const asmoUltT = (s: RunState, e: EnemyState) => (e.amUlt === undefined ? -1 : s.tick - (e.amUltAt ?? s.tick));

/** 궁극기 시작: 체력은 그 줄에서 멈추고, 하던 공격은 모두 거둠 */
export function startAsmoUlt(s: RunState, e: EnemyState, k: 1 | 2 | 3, hp: number): void {
  e.hp = Math.max(1, Math.round(hp));
  e.amUlt = k;
  e.amUltAt = s.tick;
  e.amUlts = (e.amUlts ?? 0) + 1;
  e.immune = true;
  s.hazards = [];
  s.projectiles = s.projectiles.filter((p) => p.fromPlayer);
  e.waves = [];
  e.amWalls = [];
  e.amBlocks = [];
  e.amOrb = e.amFive = e.amCharmAt = e.amTrailEnd = e.amTrail = e.amChessEnd = e.amSuckEnd = e.amHoles = e.amSafe = e.amEatEnd = e.amLasers = e.amArmor = e.amSawAt = e.amPetalEnd = e.amCharge = e.amBladeAt = undefined;
}

export function asmoUltTick(s: RunState, e: EnemyState): void {
  const t = asmoUltT(s, e);
  e.immune = true;
  e.amPose = 4;
  e.amPoseEnd = s.tick + 2;
  e.x += (ROOM_CX - e.x) * 0.05;
  e.y += (ROOM_MIN_Y + 80 - e.y) * 0.05;
  if (t >= R.ULT) return endUlt(s, e);
  if (e.amUlt === 1) blackSun(s, e, t);
  else if (e.amUlt === 2) lordFall(s, e, t);
  else desireEnd(s, e, t);
}

function endUlt(s: RunState, e: EnemyState): void {
  const k = e.amUlt;
  e.amUlt = e.amUltAt = undefined;
  e.immune = false;
  e.timer = 60;
  e.amBlocks = [];
  if (k === 1) e.amForm = 2;
  else if (k === 2) e.amForm = 3;
  else e.amTired = s.tick + R.TIRED;
}

/** 검은 해의 탄생 */
function blackSun(s: RunState, e: EnemyState, t: number): void {
  if (t < R.WAVE_AT) {
    hole(s, t);
    if (t % R.SPIRAL_EVERY === 0) spiral(s, e, t, 2);
    // 가장자리에서 빨려 들어오는 불꽃 줄기
    if (t % 180 === 90) {
      const rng = createRng(deriveSeed(s.seed, "asmoSunLine", e.id, t));
      for (let i = 0; i < 2; i++) {
        const v = rot(rng.int(0, 359) * (Math.PI / 180));
        addShape(s, 60, { x: ROOM_CX + v[0] * 260, y: cy() + v[1] * 160, radius: 0, toX: ROOM_CX, toY: cy(), width: 11, damage: hitDamage(s) * 0.8, fx: "fake", from: "asmoline" });
      }
    }
    return;
  }
  if (t === R.WAVE_AT) for (let i = 0; i < 3; i++) addWave(e, ROOM_CX, cy(), i * R.WAVE_GAP, R.WAVE_SPEED, Math.hypot(ROOM_MAX_X - ROOM_MIN_X, ROOM_MAX_Y - ROOM_MIN_Y) * 0.6, hitDamage(s));
}

/** 방 가운데 블랙홀: 빨아들임 + 핵에 닿으면 피해 */
function hole(s: RunState, t: number): void {
  pullTo(s, ROOM_CX, cy(), R.HOLE_PULL);
  if (t % 20 !== 0) return;
  eachSeat(
    s,
    () => {
      const p = s.player;
      if (Math.hypot(p.x - ROOM_CX, p.y - cy()) < R.CORE_R + p.r) envDamage(s, R.CORE_DMG);
    },
    true,
  );
}

/** 나선 탄 n갈래 (점점 빨리 돎) */
function spiral(s: RunState, e: EnemyState, t: number, n: number): void {
  const a = t * 0.04 + t * t * 0.00004;
  for (let i = 0; i < n; i++) {
    const v = rot(a + (i * Math.PI * 2) / n);
    Object.assign(enemyShot(s, ROOM_CX + v[0] * R.CORE_R, cy() + v[1] * R.CORE_R, v[0], v[1], R.SPIRAL_SPEED, shotDamage(s)), { from: e.kind, look: "orbChaos", r: 6 });
  }
}

/** 결정 창 격자 (cycle마다 다른 절반 칸): 예고 → 꽂히면 잠깐 벽 */
export function crystalGrid(s: RunState, e: EnemyState, cycle: number, phase: number): void {
  const rng = createRng(deriveSeed(s.seed, "asmoGrid", e.id, e.amUltAt ?? 0, cycle));
  const cells = Array.from({ length: HELL_COLS * HELL_ROWS }, (_, i) => i);
  for (let i = cells.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [cells[i], cells[j]] = [cells[j]!, cells[i]!];
  }
  for (const q of cells.slice(0, R.GRID_CELLS)) {
    const [l, top, r, b] = hellCell(q);
    const x = (l + r) / 2;
    const y = (top + b) / 2;
    if (phase === 0) addShape(s, R.GRID_WARN, { x, y, radius: Math.min(r - l, b - top) / 2, damage: hitDamage(s) * R.GRID_MUL, fx: "spike", from: "asmospear" });
    else addBlock(s, e, x, y, R.GRID_BLOCK);
  }
}

/** 군주의 강림 */
function lordFall(s: RunState, e: EnemyState, t: number): void {
  if (t < R.SAW_AT) {
    const c = Math.floor(t / R.GRID_EVERY);
    if (t % R.GRID_EVERY === 0) crystalGrid(s, e, c, 0);
    else if (t % R.GRID_EVERY === R.GRID_WARN) crystalGrid(s, e, c, 1);
    return;
  }
  // 톱니 날 고리가 가장자리에서 조여 듦: 다 조이는 순간 대시
  if (t === R.SAW_AT) addShape(s, R.SAW_WARN, { x: ROOM_CX, y: cy(), radius: 999, damage: hitDamage(s) * R.SAW_MUL, cue: true, fx: "spike", from: "asmosaw" });
}

/** 욕망의 끝: 4초마다 불꽃 담 → 빨아들이기 → 결정 창 격자 */
function desireEnd(s: RunState, e: EnemyState, t: number): void {
  const k = t % 240;
  const c = Math.floor(t / 240);
  if (k === 0) {
    const rng = createRng(deriveSeed(s.seed, "asmoEndWall", e.id, t));
    for (let i = 0; i < 3; i++) {
      const y = rng.int(ROOM_MIN_Y + 30, ROOM_MAX_Y - 30);
      const gap = rng.int(ROOM_MIN_X + 60, ROOM_MAX_X - 60);
      // 가로 담 (가운데 한 곳에 틈)
      addWall(s, e, ROOM_MIN_X, y, gap - 22, y, 30, 200);
      addWall(s, e, gap + 22, y, ROOM_MAX_X, y, 30, 200);
    }
  }
  if (k >= 80 && k < 200) pullTo(s, ROOM_CX, cy(), R.HOLE_PULL);
  if (k === 120) crystalGrid(s, e, c, 0);
  if (k === 120 + R.GRID_WARN) crystalGrid(s, e, c, 1);
  if (t % (R.SPIRAL_EVERY * 2) === 0) spiral(s, e, t, 1);
}
