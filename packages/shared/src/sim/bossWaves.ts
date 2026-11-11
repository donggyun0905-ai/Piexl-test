// 보스가 바닥을 쳐서 퍼지는 원형 파동: 원이 바깥으로 커지며 지나가고, 고리에 닿으면 피해 (대시 무적으로 넘어감)
import { dashDodged } from "./remnant";
import { damagePlayer as damagePlayer_ } from "./combat";
import type { EnemyState, RunState } from "./types";
import { srcFn } from "./dmgSrc";
const damagePlayer = srcFn("bossWaves", () => damagePlayer_);

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 파동 굵기(반) */
  WAVE_W: 4,
};
export { R as BOSS_WAVES_RULES };

/** 파동 하나: wait틱 뒤부터 speed로 max까지 커짐 */
export function addWave(e: EnemyState, x: number, y: number, wait: number, speed: number, max: number, damage: number): void {
  (e.waves ??= []).push({ x, y, r: 0, max, wait, speed, damage });
}

/** 틱마다: 파동을 키우고 고리에 닿으면 피해 (한 파동에 한 번) */
export function updateWaves(s: RunState, e: EnemyState): void {
  const p = s.player;
  const keep: NonNullable<EnemyState["waves"]> = [];
  for (const w of e.waves ?? []) {
    if (w.wait > 0) {
      w.wait--;
      keep.push(w);
      continue;
    }
    w.r += w.speed;
    const d = Math.hypot(p.x - w.x, p.y - w.y);
    if (!w.hit && Math.abs(d - w.r) < R.WAVE_W + p.r && !dashDodged(s)) {
      w.hit = true;
      damagePlayer(s, w.damage);
    }
    if (w.r < w.max) keep.push(w);
  }
  e.waves = keep;
}
