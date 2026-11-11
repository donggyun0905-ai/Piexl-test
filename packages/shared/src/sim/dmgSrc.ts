// 피해 출처 기록 (결과 창 '피해 출처'): 적 체력을 깎을 때마다 "지금 무엇이 때리는 중인지"로 나눠 사람마다 더해 둠 (p.dmgBy)
// 출처 = 패시브 id (그 패시브를 가졌을 때만 도는 코드 구간을 srcRun으로 감쌈) · 상태이상은 "d:종류" · 감싸지 않은 곳은 ""(무기·기본 기술)
// 구간 안에서 쏜 내 탄·잠시 뒤 폭발은 출처를 달고 가서(src) 맞을 때 그 출처로 셈 · 게임 결과에는 영향 없음 (기록만)
import type { DotKind, EnemyState, RunState } from "./types";

export interface DmgSrcPlayerState {
  /** 출처마다 준 피해 합 (허수아비·패왕전 제외) */
  dmgBy?: Record<string, number>;
}

/** 지금 때리는 출처 (틱 안에서만 잠깐 쓰는 값이라 상태에 넣지 않음) */
let cur: string | undefined;
let dotMuted = false;

/** 이 구간에서 준 피해는 id(패시브)의 것 · 구간 안에서 새로 생긴 내 탄·잠시 뒤 폭발에도 출처를 답 (안쪽 구간이 먼저) */
export function srcRun<T>(s: RunState, id: string, fn: () => T): T {
  const was = cur;
  const shots = s.projectiles;
  const blasts = s.pendingBlasts;
  const n = shots.length;
  const m = blasts.length;
  cur = id;
  try {
    return fn();
  } finally {
    if (s.projectiles === shots) for (let i = n; i < shots.length; i++) if (shots[i]!.fromPlayer) shots[i]!.src ??= id;
    if (s.pendingBlasts === blasts) for (let i = m; i < blasts.length; i++) blasts[i]!.src ??= id;
    cur = was;
  }
}

/** 탄·잠시 뒤 폭발이 맞을 차례: 달고 온 출처로 (없으면 기본) */
export function srcAs<T>(id: string | undefined, fn: () => T): T {
  const was = cur;
  cur = id;
  try {
    return fn();
  } finally {
    cur = was;
  }
}
export const setSrc = (id?: string) => void (cur = id);

/** 적이 잃은 체력 적기 (key가 없으면 지금 출처) */
export function logDmg(s: RunState, e: EnemyState, amt: number, key?: string): void {
  if (!(amt > 0) || s.pvp || e.kind === "dummy") return;
  const by = (s.player.dmgBy ??= {});
  const k = key ?? cur ?? "";
  by[k] = (by[k] ?? 0) + amt;
}

/** 상태이상 피해 (util.markDot이 부름) · 직접 때리며 색만 입히는 타격(statusHit)은 이미 적었으니 건너뜀 */
export function logDot(s: RunState, e: EnemyState, kind: DotKind, amt: number): void {
  if (!dotMuted) logDmg(s, e, amt, `d:${kind}`);
}
export function muteDot(fn: () => void): void {
  dotMuted = true;
  try {
    fn();
  } finally {
    dotMuted = false;
  }
}
