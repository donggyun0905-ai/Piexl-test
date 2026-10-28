// 제천대성 공용 도우미: 위험 표시(늘 넓고, 강해진 뒤면 더 넓고 깜박임) · 피해 · 범위 배율 · 무작위 · 늦게 터지는 것(바위 파편·파동·기 주먹)
import { createRng, deriveSeed } from "../rng";
import { hitDamage, shotDamage } from "./bossKit";
import { addWave } from "./bossWaves";
import { rot } from "./orbit";
import { enemyShot } from "./util";
import type { Hazard } from "./fxTypes";
import { addShape } from "./hazards";
import type { EnemyState, RunState } from "./types";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 모든 공격 범위 배율 (여의봉은 크게도 작게도 되니 늘 넓게) · 근두운에서 내려선 뒤 더하는 범위 배율 · 피해 배율 */
  RANGE: 1.5,
  FOOT_RANGE: 1.3,
  FOOT_DMG: 1.25,
  /** 바위 파편 빠르기 · 크기 */
  ROCK_SPEED: 1.7,
  ROCK_R: 3,
};
export { R as SAGE_KIT_RULES };

/** 강해진 뒤면 범위를 키우고 터지기 직전 깜박임 (피해는 sageDmg가 키움) */
export function hz(s: RunState, e: EnemyState, warn: number, h: Omit<Hazard, "tick" | "start">, appear = 0): void {
  const foot = !!e.sage?.foot;
  const k = R.RANGE * (foot ? R.FOOT_RANGE : 1);
  addShape(s, warn, { ...h, radius: h.radius * k, ...(h.width !== undefined ? { width: h.width * k } : {}), cue: foot || h.cue }, appear);
}

/** 피해 (강해지면 더) */
export const sageDmg = (s: RunState, e: EnemyState, mul = 1) => hitDamage(s) * mul * (e.sage?.foot ? R.FOOT_DMG : 1);
export const sageRange = (e: EnemyState) => R.RANGE * (e.sage?.foot ? R.FOOT_RANGE : 1);

export const sageRng = (s: RunState, e: EnemyState, tag: string) => createRng(deriveSeed(s.seed, "sage", tag, e.id, s.tick));


/** 늦게 터지는 것: delay틱 뒤 (x, y)에서 rocks = 사방 바위 파편 n개 · wave = 원형 파동 · fist = 플레이어 쪽 기 주먹 부채꼴 n개 */
export function later(s: RunState, e: EnemyState, delay: number, kind: "rocks" | "wave" | "fist", x: number, y: number, n = 10): void {
  (e.sage!.later ??= []).push({ at: s.tick + delay, kind, x, y, n });
}

/** 때가 된 것 터뜨리기 (bossSage 틱마다) */
export function fireLater(s: RunState, e: EnemyState): void {
  const g = e.sage!;
  if (!g.later?.length) return;
  for (const l of g.later) {
    if (l.at !== s.tick) continue;
    if (l.kind === "rocks") {
      for (let i = 0; i < l.n; i++) {
        const d = rot(((i + 0.5 * (s.tick % 2)) * Math.PI * 2) / l.n - Math.PI);
        Object.assign(enemyShot(s, l.x + d[0] * 6, l.y + d[1] * 6, d[0], d[1], R.ROCK_SPEED, shotDamage(s)), { look: "rock" as const, r: R.ROCK_R });
      }
    } else if (l.kind === "wave") addWave(e, l.x, l.y, 0, 2, 240 * sageRange(e), sageDmg(s, e, 0.8));
    else {
      const p = s.player;
      const a = Math.atan2(p.y - l.y, p.x - l.x);
      for (let i = 0; i < l.n; i++) {
        const d = rot(((a + (i - (l.n - 1) / 2) * 0.22 + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
        Object.assign(enemyShot(s, l.x, l.y, d[0], d[1], 2.4, shotDamage(s)), { look: "kifist" as const, r: 4 });
      }
    }
  }
  g.later = g.later.filter((l) => l.at > s.tick);
}
