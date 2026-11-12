// 적 쪽 소리: 적이 탄을 쏠 때 · 보스가 큰 기술을 예고할 때(위험 표시가 새로 뜰 때) — 너무 잦지 않게 간격을 둠
import { ENEMIES, type RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

interface Seen { shot: number; hazards: number; shotAt: number; warnAt: number }
const seenOf = new WeakMap<RunState, Seen>();
/** 같은 소리 사이 최소 틱 */
const SHOT_GAP = 10;
const WARN_GAP = 24;

export function foeSounds(run: RunState, fx: Sfx[]): void {
  const shot = run.projectiles.reduce((m, p) => (p.fromPlayer ? m : Math.max(m, p.id)), 0);
  const hazards = run.hazards?.length ?? 0;
  const was = seenOf.get(run);
  const now: Seen = { shot, hazards, shotAt: was?.shotAt ?? -999, warnAt: was?.warnAt ?? -999 };
  seenOf.set(run, now);
  if (!was || run.over) return;
  if (shot > was.shot && Math.abs(run.tick - now.shotAt) >= SHOT_GAP) {
    now.shotAt = run.tick;
    fx.push("foeShot");
  }
  if (hazards > was.hazards && Math.abs(run.tick - now.warnAt) >= WARN_GAP) {
    now.warnAt = run.tick;
    fx.push(run.enemies.some((e) => ENEMIES[e.kind].boss) ? "bossWarn" : "foeWarn");
  }
}
