// 2단계(3·4층) 새 보스: 세이렌 · 켄타우로스 · 하드플랜트. 체력 절반 아래면 더 빠르고 공격이 늘어남
import { BOSS_CERB_TRIO_RULES } from "./bossCerbTrio";
import { ENEMIES } from "../content";
import { fan, half, hitDamage, keepAway, ring, shotDamage, turn } from "./bossKit";
import { addShape } from "./hazards";
import type { EnemyState, RunState } from "./types";
import { DIR16, enemyShot, normalize } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 세이렌 음표: 빠르기 · 크기 · 맞으면 끌려가는 틱(1.5초)·끌려가는 빠르기 */
  NOTE_SPEED: 1.2,
  NOTE_R: 4,
  LURE_SPEED: 0.45,
  /** 켄타우로스: 돌진 빠르기·틱 · 찌르기 길이 · 휘두르기 반경 · 함께 찌르는 길이 */
  DASH_SPEED: 3.4,
  DASH_TICKS: 18,
  STAB_LEN: 36,
  SWING_R: 44,
  LANCE_LEN: 100,
  /** 하드플랜트: 바닥 범위 반경 · 덩굴 길이·굵기 · 덩굴이 솟기까지 틱 */
  GROUND_R: 20,
  VINE_LEN: 150,
  VINE_W: 8,
  VINE_WARN: 32,
};
export { R as BOSSES_TWO_RULES };

type Vec = readonly [number, number];

export const LURE_TICKS = 90;

/** 세이렌: 거리를 두고 떠다님 · 벽에 튕기며 계속 도는 음표(절반 아래면 2개) · 노래 고리 탄·부채꼴 탄 */
export function updateSiren(s: RunState, e: EnemyState, toP: Vec, go: Vec): void {
  const h = half(e);
  keepAway(s, e, toP, go, 80, ENEMIES.siren.speed);
  e.dirX = toP[0];
  const notes = s.projectiles.filter((pr) => pr.lure).length;
  if (notes < (h ? 2 : 1)) {
    const d = DIR16[(e.count * 5 + notes * 7 + 3) % 16]!;
    Object.assign(enemyShot(s, e.x, e.y, d[0], d[1], R.NOTE_SPEED, shotDamage(s)), { r: R.NOTE_R, ticksLeft: 1e9, bounces: 1e9, lure: true, look: "note" as const });
  }
  if (e.timer > 0) return;
  e.count++;
  if (e.count % 2 === 0) ring(s, e, h ? 1 : 2, e.count, 1.1, { look: "note" });
  else fan(s, e, toP, h ? [-2, -1, 0, 1, 2] : [-1, 0, 1], 1.5, { look: "note" });
  e.timer = h ? 70 : 95;
}

/** 음표에 맞음: 1.5초 동안 세이렌 쪽으로 천천히 끌려감 */
export function lure(s: RunState): void {
  s.player.lureTicks = LURE_TICKS;
  s.player.lureId = undefined;
}

/** 세이렌 노래에 홀린 중: 공격·사용 아이템을 못 씀 (태초의 어둠 구멍에 끌려가는 것은 해당 없음) */
export const charmed = (p: RunState["player"]) => (p.lureTicks ?? 0) > 0 && p.lureId === undefined;

/** 끌려가는 중이면 이동 입력 대신 세이렌 쪽 (대시는 됨) */
export function lureMove(s: RunState, mx: number, my: number): [number, number] {
  const p = s.player;
  if ((p.lureTicks ?? 0) <= 0) return [mx, my];
  p.lureTicks = (p.lureTicks ?? 0) - 1;
  const siren = s.enemies.find((e) => (p.lureId ? e.id === p.lureId : e.kind === "siren") && e.hp > 0);
  const d = siren ? normalize(siren.x - p.x, siren.y - p.y) : null;
  // 염희(켈베로스) 빨아들이기는 더 셈 (걸어서 못 버팀, 기둥에 막히면 버팀)
  const k = siren?.kind === "cerbflame" ? BOSS_CERB_TRIO_RULES.PULL_SPEED : R.LURE_SPEED;
  return d ? [d[0] * k, d[1] * k] : [mx, my];
}

/** 켄타우로스: 1) 돌진 → 찌르기 3번 2) 사방으로 창 던지기 3) 크게 휘두르며 동시에 길게 찌르기, 차례로 반복 */
export function updateCentaur(s: RunState, e: EnemyState, toP: Vec, go: Vec): void {
  const h = half(e);
  if (e.phase === "walk") {
    e.x += go[0] * ENEMIES.centaur.speed;
    e.y += go[1] * ENEMIES.centaur.speed;
    e.dirX = toP[0];
    e.dirY = toP[1];
    if (e.timer > 0) return;
    const pattern = e.count % 3;
    e.count++;
    e.step = 0;
    if (pattern === 0) {
      e.phase = "windup";
      e.timer = h ? 16 : 22;
    } else if (pattern === 1) {
      e.phase = "volley";
      e.timer = 30;
    } else {
      const warn = h ? 26 : 34;
      addShape(s, warn, { x: e.x, y: e.y, radius: R.SWING_R, damage: hitDamage(s), dirX: toP[0], dirY: toP[1], arc: 0, fx: "bslash" });
      addShape(s, warn, { x: e.x, y: e.y, radius: 0, damage: hitDamage(s), toX: e.x + toP[0] * R.LANCE_LEN, toY: e.y + toP[1] * R.LANCE_LEN, width: 5, fx: "stab" });
      e.phase = "swing";
      e.timer = warn + 12;
    }
  } else if (e.phase === "windup") {
    // 돌진 방향을 정하고 (예고선) 돌진
    if (e.timer > 0) return;
    e.dirX = toP[0];
    e.dirY = toP[1];
    e.phase = "charge";
    e.timer = R.DASH_TICKS;
  } else if (e.phase === "charge") {
    e.x += e.dirX * R.DASH_SPEED;
    e.y += e.dirY * R.DASH_SPEED;
    if (e.timer > 0) return;
    const d = normalize(s.player.x - e.x, s.player.y - e.y) ?? [e.dirX, e.dirY];
    addShape(s, 12, { x: e.x, y: e.y, radius: 0, damage: hitDamage(s), toX: e.x + d[0] * R.STAB_LEN, toY: e.y + d[1] * R.STAB_LEN, width: 5, fx: "stab" });
    e.step = (e.step ?? 0) + 1;
    e.phase = (e.step ?? 0) >= 3 ? "swing" : "windup";
    e.timer = (e.step ?? 0) >= 3 ? 30 : h ? 22 : 30;
  } else if (e.phase === "volley") {
    if (e.timer > 0) return;
    ring(s, e, h ? 1 : 2, e.count, 1.8, { look: "spear" });
    if (h) fan(s, e, toP, [0], 2.4, { look: "spear" });
    e.phase = "swing";
    e.timer = 30;
  } else if (e.timer <= 0) {
    e.phase = "walk";
    e.timer = h ? 45 : 70;
  }
}

/** 하드플랜트: 거의 서 있음 · 바닥 범위 공격(절반 아래면 5곳) → 덩굴이 사방 8줄로 솟아 내려찍기(절반 아래면 어긋나게 한 번 더) → 씨앗 고리 탄 */
export function updatePlant(s: RunState, e: EnemyState, toP: Vec, go: Vec): void {
  const h = half(e);
  const p = s.player;
  e.x += go[0] * ENEMIES.plant.speed;
  e.y += go[1] * ENEMIES.plant.speed;
  e.dirX = toP[0];
  if (e.timer > 0) return;
  const pattern = e.count % 3;
  e.count++;
  if (pattern === 0) {
    const n = h ? 5 : 3;
    for (let i = 0; i < n; i++) {
      const d = DIR16[(i * 5 + e.count) % 16]!;
      const k = i === 0 ? 0 : 30;
      addShape(s, 55, { x: p.x + d[0] * k, y: p.y + d[1] * k, radius: R.GROUND_R, damage: hitDamage(s) });
    }
  } else if (pattern === 1) {
    // 플레이어 쪽부터 사방 8줄, 절반 아래면 그 사이 8줄이 조금 뒤에 한 번 더
    for (const [k, warn] of (h ? [[0, R.VINE_WARN - 6], [1, R.VINE_WARN + 14]] : [[0, R.VINE_WARN]]) as [number, number][]) {
      for (let i = 0; i < 16; i += 2) {
        const d = turn(toP, i + k);
        addShape(s, warn, { x: e.x, y: e.y, radius: 0, damage: hitDamage(s), toX: e.x + d[0] * R.VINE_LEN, toY: e.y + d[1] * R.VINE_LEN, width: R.VINE_W, fx: "vine" });
      }
    }
  } else ring(s, e, h ? 1 : 2, e.count, 1.2, { look: "seed" });
  e.timer = h ? 65 : 85;
}
