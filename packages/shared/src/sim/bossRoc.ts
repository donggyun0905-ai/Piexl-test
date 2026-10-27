// 검은 잔영의 셋째 짐승 거대 매: 늘 하늘에 있어 보이지 않음 (맞지 않음)
// 내려찍기: 갑자기 플레이어 자리에 범위가 뜨고 찍어 내림 → 피하면 매가 3초 경직(이때 때리기), 맞으면 곧바로 하늘로
// 세 줄 활강: 방을 가로지르는 선 세 개가 차례로 → 매가 선을 따라 활강한 뒤 어지러워 마지막 선 끝에 떨어져 3초 경직
import { createRng, deriveSeed } from "../rng";
import { half, hitDamage } from "./bossKit";
import { damagePlayer } from "./combat";
import { addShape } from "./hazards";
import type { EnemyState, RunState } from "./types";
import { addEffect, DIR16, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 하늘에서 맴도는 틱 (절반 아래) */
  SKY: 160,
  SKY_HALF: 120,
  /** 내려찍기: 예고 (절반 아래) · 반경 · 피해 배율 */
  DIVE_WARN: 48,
  DIVE_WARN_HALF: 38,
  DIVE_R: 34,
  DIVE_MUL: 1.3,
  /** 세 줄 활강: 첫 선이 터지기까지 · 선 사이 (절반 아래) · 굵기(반) */
  SWEEP_WARN: 55,
  SWEEP_GAP: 32,
  SWEEP_GAP_HALF: 24,
  SWEEP_W: 12,
  /** 경직 · 날아오르는 틱 */
  DAZE: 180,
  RISE: 24,
};
export { R as BOSS_ROC_RULES };

/** 하늘 (몸이 안 보이고 맞지 않음) */
export const rocHidden = (e: EnemyState) => e.phase === "walk" || e.phase === "windup";

/** (x, y)를 지나 방향 d인 선이 방 안에 걸친 두 끝 */
function across(x: number, y: number, d: readonly [number, number]): [number, number, number, number] {
  let lo = -Infinity;
  let hi = Infinity;
  for (const [p, v, min, max] of [[x, d[0], ROOM_MIN_X + 4, ROOM_MAX_X - 4], [y, d[1], ROOM_MIN_Y + 4, ROOM_MAX_Y - 4]] as const) {
    if (Math.abs(v) < 1e-6) continue;
    const a = (min - p) / v;
    const b = (max - p) / v;
    lo = Math.max(lo, Math.min(a, b));
    hi = Math.min(hi, Math.max(a, b));
  }
  return [x + d[0] * lo, y + d[1] * lo, x + d[0] * hi, y + d[1] * hi];
}

function toSky(e: EnemyState): void {
  e.phase = "walk";
  e.timer = half(e) ? R.SKY_HALF : R.SKY;
  e.air = true;
  e.immune = true;
}

function daze(e: EnemyState, x: number, y: number): void {
  e.phase = "act";
  e.timer = R.DAZE;
  e.x = x;
  e.y = y;
  e.air = false;
  e.immune = false;
}

export function updateRoc(s: RunState, e: EnemyState): void {
  const p = s.player;
  if (rocHidden(e)) {
    e.air = true;
    e.immune = true;
  }
  if (e.phase === "walk") {
    // 하늘에서 플레이어 위를 맴돎 (보이지 않음)
    e.x = p.x;
    e.y = p.y;
    if (e.timer > 0) return;
    e.phase = "windup";
    e.step = e.count % 2 === 0 ? 1 : 2;
    e.count++;
    if (e.step === 1) {
      e.timer = half(e) ? R.DIVE_WARN_HALF : R.DIVE_WARN;
      e.auxX = p.x;
      e.auxY = p.y;
      addShape(s, e.timer, { x: p.x, y: p.y, radius: R.DIVE_R, damage: 0, fx: "meteor" });
    } else sweep(s, e);
    return;
  }
  if (e.phase === "windup") {
    e.x = e.auxX ?? e.x;
    e.y = e.auxY ?? e.y;
    if (e.timer > 0) return;
    e.dirX = p.x >= e.x ? 1 : -1;
    if (e.step === 2) return daze(e, e.x, e.y);
    // 찍어 내림: 범위 안이면 맞고 매는 곧바로 하늘로, 피했으면 땅에 박혀 경직
    const dx = p.x - e.x;
    const dy = p.y - e.y;
    const rr = R.DIVE_R + p.r;
    if (dx * dx + dy * dy <= rr * rr && p.dashTicks <= 0) {
      damagePlayer(s, hitDamage(s) * R.DIVE_MUL);
      e.phase = "blink";
      e.timer = R.RISE;
      e.air = false;
      e.immune = true;
    } else daze(e, e.x, e.y);
    addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: R.DIVE_R, maxTicks: 16 });
    return;
  }
  if (e.phase === "act") {
    if (e.timer > 0) return;
    // 정신을 차리고 날아오름
    e.phase = "blink";
    e.timer = R.RISE;
    e.immune = true;
    return;
  }
  if (e.timer <= 0) toSky(e);
}

/** 세 줄 활강: 플레이어를 지나는 선 셋 (서로 다른 방향), 차례로 터짐. 마지막 선 끝에서 경직 */
function sweep(s: RunState, e: EnemyState): void {
  const p = s.player;
  const rng = createRng(deriveSeed(s.seed, "roc", e.count, s.tick));
  // 가로·세로·두 대각선 중 셋 (빠지는 하나와 시작을 무작위로)
  const skip = rng.int(0, 3);
  const dirs = [0, 2, 4, 6].filter((_, i) => i !== skip);
  if (rng.nextFloat() < 0.5) dirs.reverse();
  const gap = half(e) ? R.SWEEP_GAP_HALF : R.SWEEP_GAP;
  let end: [number, number] = [p.x, p.y];
  for (let i = 0; i < 3; i++) {
    const d = DIR16[dirs[i]!]!;
    // 선마다 플레이어 둘레 조금 다른 자리를 지남
    const ox = rng.int(-24, 24);
    const oy = rng.int(-24, 24);
    const [x0, y0, x1, y1] = across(p.x + ox, p.y + oy, i % 2 === 0 ? d : [-d[0], -d[1]]);
    addShape(s, R.SWEEP_WARN + gap * i, { x: x0, y: y0, radius: 0, damage: hitDamage(s), toX: x1, toY: y1, width: R.SWEEP_W, fx: "gleam" }, gap * i);
    end = [x1, y1];
  }
  e.timer = R.SWEEP_WARN + gap * 2;
  e.auxX = end[0];
  e.auxY = end[1];
}
