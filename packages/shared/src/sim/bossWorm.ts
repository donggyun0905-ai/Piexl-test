// 검은 잔영의 첫 짐승 데스웜: 땅속에서는 예고 없이 다가옴 → 갑자기 플레이어 자리에 위험 표시가 뜨고 솟아오름(사방으로 바위)
// 솟는 데 1초 · 위에서 2초(이때 때리기) → 순식간에 땅속으로 (사방으로 바위). 체력 절반 아래면 더 자주·더 많이
import { half, hitDamage, shotDamage, turn } from "./bossKit";
import { addShape } from "./hazards";
import type { EnemyState, RunState } from "./types";
import { DIR16, enemyShot } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 땅속에서 다니는 틱 (절반 아래) · 땅속 빠르기 */
  UNDER: 170,
  UNDER_HALF: 120,
  UNDER_SPEED: 1.1,
  /** 갑자기 뜨는 표시가 터지기까지 · 솟는 범위(몸 반경에 더함) · 솟는 데 · 위에 있는 틱 */
  WARN: 34,
  RISE_PAD: 8,
  RISE: 60,
  TOP: 120,
  /** 솟을 때·들어갈 때 바위 빠르기 */
  ROCK_SPEED: 1.5,
};
export { R as BOSS_WORM_RULES };

/** 땅속 (몸이 안 보이고 맞지 않음) */
export const wormHidden = (e: EnemyState) => e.phase === "walk" || e.phase === "windup";

/** 몸 둘레에서 사방으로 바위 (절반 아래면 16발, 아니면 8발) */
function rocks(s: RunState, e: EnemyState): void {
  const step = half(e) ? 1 : 2;
  for (let i = e.count % step; i < 16; i += step) {
    const d = DIR16[i]!;
    Object.assign(enemyShot(s, e.x + d[0] * e.r, e.y + d[1] * e.r, d[0], d[1], R.ROCK_SPEED, shotDamage(s)), { look: "rock" as const, r: 3 });
  }
}

export function updateWorm(s: RunState, e: EnemyState, toP: readonly [number, number]): void {
  const p = s.player;
  if (wormHidden(e)) {
    e.air = true;
    e.immune = true;
  }
  if (e.phase === "walk") {
    // 땅속: 표시 없이 플레이어 쪽으로
    e.x += toP[0] * R.UNDER_SPEED;
    e.y += toP[1] * R.UNDER_SPEED;
    if (e.timer > 0) return;
    e.phase = "windup";
    e.timer = R.WARN;
    e.x = p.x;
    e.y = p.y;
    addShape(s, R.WARN, { x: e.x, y: e.y, radius: e.r + R.RISE_PAD, damage: hitDamage(s) * 1.3, fx: "meteor" });
    return;
  }
  if (e.phase === "windup") {
    if (e.timer > 0) return;
    // 솟아오름: 이제 맞음
    e.phase = "act";
    e.aux = 0;
    e.air = false;
    e.immune = false;
    e.dirX = toP[0] >= 0 ? 1 : -1;
    rocks(s, e);
    e.count++;
    return;
  }
  e.aux = (e.aux ?? 0) + 1;
  // 위에 있는 동안 (절반 아래): 플레이어 쪽으로 침 부채꼴 한 번
  if (half(e) && e.aux === R.RISE + R.TOP / 2) {
    for (const k of [-1, 0, 1]) {
      const d = turn(toP, k);
      Object.assign(enemyShot(s, e.x, e.y, d[0], d[1], 1.8, shotDamage(s)), { look: "rock" as const, r: 3 });
    }
  }
  if (e.aux < R.RISE + R.TOP) return;
  // 순식간에 땅속으로
  rocks(s, e);
  e.count++;
  e.phase = "walk";
  e.timer = half(e) ? R.UNDER_HALF : R.UNDER;
  e.air = true;
  e.immune = true;
}
