// 갓이터의 대검 두 자루: 파괴의 검(사방 검기 · 빠른 돌진 뒤 회전 돌진 · 연속 그림자 대검 찍기) · 혼돈의 검(플레이어 순간이동 · 영혼 4개 · 보라색 거짓 공격 · 큰 베기 3번 + 찌르기)
// 혼돈의 검은 영혼 4개를 다 부숴야 맞고, 영혼이 남아 있는 동안 플레이어 몸이 거의 보이지 않음 (그리기). 두 자루 모두 베기·찌르기 중에는 맞지 않음
import { createRng, deriveSeed } from "../rng";
import { hitDamage, ring } from "./bossKit";
import { addShape } from "./hazards";
import { damagePlayer } from "./combat";
import type { EnemyState, RunState } from "./types";
import { depth } from "./hero";
import { addEffect, DIR16, makeEnemy, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

type Vec = readonly [number, number];

/** 갓이터 곁에 떠 있는 자리 (갓이터 기준) · 떠다니는 빠르기 */
const SIDE_X = 46;
const FLOAT_SPEED = 1.2;
/** 파괴: 돌진 길이·빠르기 · 그림자 대검 찍기 횟수·간격·반경 */
const DASH_LEN = 150;
const DASH_SPEED = 5;
const SLAMS = 4;
const SLAM_GAP = 16;
const SLAM_R = 36;
/** 혼돈: 영혼 수 · 거짓 공격 수 · 범위 반경 */
const SOULS = 4;
const FAKES = 6;
const CHAOS_R = 32;
/** 혼돈의 연속 베기: 반경 · 부채꼴 cos(약 200도) · 횟수 · 간격 · 쫓아가는 빠르기 · 마지막 찌르기 길이 */
const COMBO_R = 75;
const COMBO_ARC = -0.2;
const COMBO_SLASHES = 3;
const COMBO_GAP = 26;
const COMBO_SPEED = 1.6;
const THRUST_LEN = 160;
/** 파괴의 회전 돌진: 예고 · 베는 반경 */
const SPIN_WIND = 22;
const SPIN_R = 22;

const souls = (s: RunState) => s.enemies.filter((o) => o.kind === "soul" && o.aux === 1 && o.hp > 0).length;

/** 혼돈의 영혼이 남아 있음 (그동안 혼돈의 검은 맞지 않고 플레이어 몸은 거의 보이지 않음) */
export function chaosVeil(s: RunState): boolean {
  return souls(s) > 0;
}

function rand(s: RunState, e: EnemyState, label: string) {
  return createRng(deriveSeed(s.seed, "blade", label, e.id, e.count, s.tick));
}

/** 방 안 무작위 자리 (벽에서 띄워서) */
function spot(rng: ReturnType<typeof createRng>, pad: number): [number, number] {
  return [rng.int(ROOM_MIN_X + pad, ROOM_MAX_X - pad), rng.int(ROOM_MIN_Y + pad, ROOM_MAX_Y - pad)];
}

export function updateBlade(s: RunState, e: EnemyState, toP: Vec): void {
  const hades = s.enemies.find((o) => o.kind === "godeater" && o.hp > 0);
  const ruin = e.kind === "ruinblade";
  // 베기·찌르기 공격 중에는 맞지 않음 (파괴: 찌르기·회전 돌진 · 혼돈: 연속 베기), 혼돈의 검은 영혼이 남아 있어도
  e.immune = ruin ? e.phase === "windup" || e.phase === "charge" : chaosVeil(s) || e.phase === "act";
  if (e.phase === "charge") {
    e.x += e.dirX * DASH_SPEED;
    e.y += e.dirY * DASH_SPEED;
    // 두 번째 돌진: 빙글빙글 돌며 닿는 둘레를 벰
    if (e.step === 1) spinHit(s, e);
    if (--e.timer <= 0) {
      if (ruin && e.step !== 1) {
        // 찌르기 뒤 한 번 더: 플레이어 쪽으로 회전하며 돌진
        e.step = 1;
        e.phase = "windup";
        e.timer = SPIN_WIND;
        addShape(s, SPIN_WIND, { x: e.x, y: e.y, radius: 0, damage: 0, toX: e.x + toP[0] * DASH_LEN, toY: e.y + toP[1] * DASH_LEN, width: SPIN_R, fx: "stab" });
        return;
      }
      e.step = 0;
      e.phase = "walk";
      e.timer = 90;
    }
    return;
  }
  if (e.phase === "act" && !ruin) {
    combo(s, e, toP);
    return;
  }
  if (e.phase === "act") {
    // 연속 그림자 대검 찍기
    e.aux = (e.aux ?? 0) + 1;
    if (e.aux % SLAM_GAP === 1) addShape(s, 28, { x: s.player.x, y: s.player.y, radius: SLAM_R, damage: hitDamage(s), fx: "dark" });
    if (e.aux >= SLAMS * SLAM_GAP) {
      e.phase = "walk";
      e.timer = 90;
    }
    return;
  }
  // 갓이터 곁에 떠 있음
  if (hades) {
    const tx = hades.x + (ruin ? -SIDE_X : SIDE_X);
    const ty = hades.y - 6 + (s.tick % 120 < 60 ? -2 : 2);
    const d = normalize(tx - e.x, ty - e.y);
    if (d && (tx - e.x) ** 2 + (ty - e.y) ** 2 > 4) {
      e.x += d[0] * FLOAT_SPEED;
      e.y += d[1] * FLOAT_SPEED;
    }
  }
  e.dirX = toP[0];
  e.dirY = toP[1];
  if (e.phase === "windup") {
    if (--e.timer <= 0) {
      e.phase = "charge";
      e.timer = Math.round(DASH_LEN / DASH_SPEED);
    }
    return;
  }
  if (--e.timer > 0) return;
  const pattern = e.count % (ruin ? 3 : 4);
  e.count++;
  if (ruin) ruinAttack(s, e, toP, pattern);
  else if (pattern === 3) {
    e.phase = "act";
    e.aux = 0;
  } else chaosAttack(s, e, pattern);
}

/** 회전 돌진: 둘레에 닿으면 피해 + 도는 칼 자국 */
function spinHit(s: RunState, e: EnemyState): void {
  const p = s.player;
  if (e.timer % 5 === 0) addEffect(s, { kind: "bslash", x: e.x, y: e.y, dirX: 0, dirY: 0, size: SPIN_R, maxTicks: 8, width: -1 });
  if (Math.hypot(p.x - e.x, p.y - e.y) < SPIN_R + p.r) damagePlayer(s, hitDamage(s));
}

/** 혼돈의 연속 베기: 플레이어를 쫓으며 큰 부채꼴 베기 3번 → 긴 찌르기 1번 */
function combo(s: RunState, e: EnemyState, toP: Vec): void {
  const t = (e.aux = (e.aux ?? 0) + 1);
  if (t < COMBO_SLASHES * COMBO_GAP) {
    e.x += toP[0] * COMBO_SPEED;
    e.y += toP[1] * COMBO_SPEED;
  }
  if (t % COMBO_GAP === 1 && t < COMBO_SLASHES * COMBO_GAP) addShape(s, 22, { x: e.x, y: e.y, radius: COMBO_R, damage: hitDamage(s), dirX: toP[0], dirY: toP[1], arc: COMBO_ARC, fx: "bslash" });
  if (t === COMBO_SLASHES * COMBO_GAP + 1) addShape(s, 26, { x: e.x, y: e.y, radius: 0, damage: hitDamage(s), toX: e.x + toP[0] * THRUST_LEN, toY: e.y + toP[1] * THRUST_LEN, width: 8, fx: "stab" });
  if (t >= COMBO_SLASHES * COMBO_GAP + 40) {
    e.phase = "walk";
    e.timer = 90;
  }
}

/** 파괴의 검: 사방 검기 → 빠른 돌진(찌르기) 뒤 회전 돌진 → 연속 그림자 대검 찍기 */
function ruinAttack(s: RunState, e: EnemyState, toP: Vec, pattern: number): void {
  if (pattern === 0) {
    ring(s, e, 1, e.count, 1.6, { look: "bigwave" });
    for (const pr of s.projectiles.slice(-16)) pr.r = 7;
    e.timer = 110;
  } else if (pattern === 1) {
    e.phase = "windup";
    e.timer = 30;
    e.dirX = toP[0];
    e.dirY = toP[1];
    addShape(s, 30, { x: e.x, y: e.y, radius: 0, damage: hitDamage(s), toX: e.x + toP[0] * DASH_LEN, toY: e.y + toP[1] * DASH_LEN, width: 6, fx: "stab" });
  } else {
    e.phase = "act";
    e.aux = 0;
  }
}

/** 혼돈의 검: 플레이어 순간이동 → 영혼 4개 → 보라색 거짓 공격 사이에 진짜 공격 */
function chaosAttack(s: RunState, e: EnemyState, pattern: number): void {
  const p = s.player;
  const rng = rand(s, e, "chaos");
  if (pattern === 0) {
    addEffect(s, { kind: "burst", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 10, maxTicks: 14 });
    [p.x, p.y] = spot(rng, 30);
    p.prevX = p.x;
    p.prevY = p.y;
    addEffect(s, { kind: "burst", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 10, maxTicks: 14 });
    for (let i = 0; i < 2; i++) {
      const d = DIR16[rng.int(0, 15)]!;
      addShape(s, 45, { x: p.x + d[0] * 30, y: p.y + d[1] * 30, radius: CHAOS_R, damage: hitDamage(s) });
    }
    e.timer = 110;
  } else if (pattern === 1) {
    if (souls(s) === 0) {
      for (let i = 0; i < SOULS; i++) {
        const d = DIR16[i * 4]!;
        const m = makeEnemy(s, "soul", e.x + d[0] * 20, e.y + d[1] * 20, 1 + 0.15 * (depth(s) - 1), 20);
        m.noGold = true;
        m.aux = 1;
        s.enemies.push(m);
      }
    }
    e.timer = 140;
  } else {
    for (let i = 0; i < FAKES; i++) {
      const [x, y] = spot(rng, CHAOS_R);
      addShape(s, 50, { x, y, radius: CHAOS_R, damage: 0, fx: "fake" });
    }
    addShape(s, 50, { x: p.x, y: p.y, radius: CHAOS_R, damage: hitDamage(s) });
    e.timer = 110;
  }
}
