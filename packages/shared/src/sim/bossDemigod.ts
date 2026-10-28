// 시즌 2 라스트 보스 괴력난신: 거인만 한 반신이 맨주먹으로 사람처럼 싸움 (거리를 재며 옆으로 돌고, 붙으면 콤보)
// 거대한 부채꼴 주먹 파동 · 연달아 터지는 폭발 · 바닥을 쳐 퍼지는 원형 파동 · 돌진 콤보 · 이따금 2초 무적으로 사방에 기 주먹 100발
// 근접 콤보는 앞으로만 (뒤로 대시해도 끝날 때까지 앞으로 나아감, 끝나면 다시 플레이어 쪽) · 체력이 적을수록 공격 주기가 빨라짐 · 필살기 셋(demigodUlts)
import { ENEMIES } from "../content";
import { half, hitDamage, keepAway, shotDamage } from "./bossKit";
import { addWave, updateWaves } from "./bossWaves";
import { addShape } from "./hazards";
import { rot } from "./orbit";
import type { EnemyState, RunState } from "./types";
import { addEffect, enemyShot } from "./util";
import { demigodUlt } from "./demigodUlts";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 거리 두기 · 옆으로 도는 빠르기 · 패턴 사이 틱 · 체력이 0에 가까울 때 줄어드는 비율 */
  WANT: 70,
  STRAFE: 0.6,
  GAP: 80,
  FAST: 0.55,
  /** 부채꼴 주먹 파동: 반경 · 폭(cos) · 예고 · 피해 배율 */
  FAN_R: 170,
  FAN_ARC: 0.45,
  FAN_WARN: 40,
  FAN_MUL: 1.3,
  /** 연달아 터지는 폭발: 수 · 간격 · 예고 · 반경 */
  BLASTS: 6,
  BLAST_GAP: 12,
  BLAST_WARN: 30,
  BLAST_R: 34,
  /** 바닥 치기 원형 파동: 수 · 간격 · 빠르기 · 최대 반경 */
  WAVES: 3,
  WAVE_GAP: 30,
  WAVE_SPEED: 1.8,
  WAVE_MAX: 320,
  /** 기 주먹 난사(무적): 틱 · 간격 · 갈래 (120 ÷ 6 × 5 = 100발) · 빠르기 */
  VOLLEY: 120,
  VOLLEY_GAP: 6,
  VOLLEY_ARMS: 5,
  VOLLEY_SPEED: 1.6,
  /** 돌진: 틱 · 빠르기 */
  LUNGE: 24,
  LUNGE_SPEED: 3.2,
  /** 근접 콤보: 붙었다고 보는 거리 · 타 수 · 타 사이 · 반경 · 폭(cos) · 한 타마다 나아가는 거리 · 예고 · 피해 배율 */
  NEAR: 55,
  HITS: 4,
  HIT_GAP: 16,
  HIT_R: 40,
  HIT_ARC: 0.3,
  HIT_STEP: 10,
  HIT_WARN: 10,
  HIT_MUL: 0.8,
};
export { R as BOSS_DEMIGOD_RULES };

type Vec = readonly [number, number];
type Pattern = "fan" | "blasts" | "volley" | "lunge" | "waves";
/** 차례: 사이사이 기 주먹 난사 */
const ORDER: readonly Pattern[] = ["fan", "blasts", "volley", "lunge", "waves", "volley", "fan", "lunge", "blasts", "volley", "waves", "fan"];

/** 근접 콤보 시작 (앞으로만, reach = 범위 배율) */
export function startCombo(e: EnemyState, d: Vec, reach: number, hits = R.HITS, delay = 6): void {
  e.combo = { left: hits, t: delay, dx: d[0], dy: d[1], reach };
  e.dirX = d[0];
  e.dirY = d[1];
}

/** 콤보 한 틱: 정해진 방향으로 한 타씩 나아가며 앞을 침 (마지막 타는 크게). 끝나면 true */
export function comboTick(s: RunState, e: EnemyState): boolean {
  const c = e.combo!;
  if (--c.t > 0) return false;
  if (c.left <= 0) {
    delete e.combo;
    return true;
  }
  const last = c.left === 1;
  e.x += c.dx * R.HIT_STEP;
  e.y += c.dy * R.HIT_STEP;
  e.dirX = c.dx;
  e.dirY = c.dy;
  const r = R.HIT_R * c.reach * (last ? 1.4 : 1);
  addShape(s, R.HIT_WARN, { x: e.x, y: e.y, radius: r, damage: hitDamage(s) * R.HIT_MUL * (last ? 1.5 : 1), dirX: c.dx, dirY: c.dy, arc: last ? 0 : R.HIT_ARC, fx: "bslash" });
  c.left--;
  c.t = R.HIT_GAP;
  return false;
}

/** 체력이 적을수록 짧아지는 배율 */
const tempo = (e: EnemyState) => 1 - R.FAST * (1 - Math.max(0, e.hp) / e.maxHp);

export function updateDemigod(s: RunState, e: EnemyState, toP: Vec, go: Vec): void {
  updateWaves(s, e);
  e.immune = e.phase === "volley";
  if (demigodUlt(s, e, toP)) return;
  if (e.phase === "volley") return volley(s, e);
  if (e.combo) {
    comboTick(s, e);
    return;
  }
  if (e.phase === "charge") {
    // 돌진: 끝나면 그 방향으로 콤보
    e.x += e.dirX * R.LUNGE_SPEED;
    e.y += e.dirY * R.LUNGE_SPEED;
    if (--e.aux! <= 0) {
      e.phase = "walk";
      startCombo(e, [e.dirX, e.dirY], 1);
    }
    return;
  }
  // 사람처럼: 거리를 재며 옆으로 돎 (패턴마다 도는 쪽이 바뀜)
  const def = ENEMIES.demigod;
  keepAway(s, e, toP, go, R.WANT, def.speed);
  const side = e.count % 2 === 0 ? 1 : -1;
  e.x += -toP[1] * R.STRAFE * side;
  e.y += toP[0] * R.STRAFE * side;
  e.dirX = toP[0];
  e.dirY = toP[1];
  if (e.timer > 0) return;
  const pat = ORDER[e.count % ORDER.length]!;
  e.count++;
  e.timer = Math.round(R.GAP * tempo(e));
  const p = s.player;
  const near = Math.hypot(p.x - e.x, p.y - e.y) < R.NEAR;
  if (pat === "fan") {
    addShape(s, Math.round(R.FAN_WARN * tempo(e)), { x: e.x, y: e.y, radius: R.FAN_R, damage: hitDamage(s) * R.FAN_MUL, dirX: toP[0], dirY: toP[1], arc: R.FAN_ARC, fx: "bslash" });
  } else if (pat === "blasts") {
    // 플레이어 자리에 차례로 (절반 아래면 더 많이)
    const n = R.BLASTS + (half(e) ? 3 : 0);
    for (let i = 0; i < n; i++) addShape(s, R.BLAST_WARN + i * R.BLAST_GAP, { x: p.x + toP[0] * i * 6, y: p.y + toP[1] * i * 6, radius: R.BLAST_R, damage: hitDamage(s), fx: "meteor" }, i * R.BLAST_GAP);
  } else if (pat === "waves") {
    for (let i = 0; i < R.WAVES; i++) addWave(e, e.x, e.y, 14 + i * R.WAVE_GAP, R.WAVE_SPEED, R.WAVE_MAX, hitDamage(s));
    addShape(s, 14, { x: e.x, y: e.y, radius: e.r * 2, damage: hitDamage(s), fx: "meteor" });
  } else if (pat === "volley") {
    e.phase = "volley";
    e.aux = R.VOLLEY;
    e.immune = true;
    addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 30, maxTicks: 18 });
    return;
  } else {
    e.phase = "charge";
    e.aux = R.LUNGE;
    return;
  }
  // 넓은 공격을 쓰는 동안 붙어 있으면 앞으로 콤보도 같이
  if (near) startCombo(e, toP, 1);
}

/** 2초 무적: 사방으로 기 주먹 (돌아가는 다섯 갈래) */
function volley(s: RunState, e: EnemyState): void {
  e.immune = true;
  const t = R.VOLLEY - e.aux!;
  if (t % R.VOLLEY_GAP === 0) {
    for (let i = 0; i < R.VOLLEY_ARMS; i++) {
      const d = rot(((t * 0.06) % (Math.PI * 2)) + (i * Math.PI * 2) / R.VOLLEY_ARMS - Math.PI);
      Object.assign(enemyShot(s, e.x + d[0] * 10, e.y + d[1] * 10, d[0], d[1], R.VOLLEY_SPEED, shotDamage(s)), { look: "kifist" as const, r: 4 });
    }
  }
  if (--e.aux! > 0) return;
  e.phase = "walk";
  e.immune = false;
}
