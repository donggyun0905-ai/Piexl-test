// 블래스트 탄창·장전·대시 슬로우모션 (sim/blast가 부름): 탄 5발 · critEvery 발마다 확정 치명타 · 쏘지 않을 때(탄이 없으면 누르고 있어도) 한 발씩 장전
// 대시하면 (로그, 다시 쓰기 대기) 나를 포함한 모두가 느려지고 파란 탄 4발이 바로 장전 · 그동안 내 공격 속도와 탄은 그대로. 수치 weaponsBlast.BLAST
import { BLAST_PERKS as K } from "../itemsBlast";
import { BLAST as B } from "../weaponsBlast";
import { restoreShots, slowShots } from "./slowShots";
import type { PlayerState, RunState } from "./types";
import { addEffect, hasPerk } from "./util";

export const blAmmo = (p: PlayerState) => p.blAmmo ?? B.mag;
/** 쏠 탄이 있는지 (파란 탄 먼저) */
export const hasShell = (p: PlayerState) => (p.blBlue ?? 0) > 0 || blAmmo(p) > 0;

/** 한 발 씀 → 어떤 탄인지 (blue: 파란 탄 · crit: 확정 치명타) */
export function useShell(p: PlayerState): { blue: boolean; crit: boolean } {
  delete p.blLoad;
  if ((p.blBlue ?? 0) > 0) {
    p.blBlue!--;
    return { blue: true, crit: false };
  }
  p.blAmmo = blAmmo(p) - 1;
  const n = p.blShots ?? 0;
  p.blShots = (n + 1) % B.critEvery;
  return { blue: false, crit: n === B.critEvery - 1 };
}

/** 한 발씩 장전 (쏘지 않을 때 · 탄이 없으면 누르고 있어도) */
export function reload(s: RunState, want: boolean): void {
  const p = s.player;
  if (blAmmo(p) >= B.mag || p.attackCooldown > 0 || (want && hasShell(p))) {
    delete p.blLoad;
    return;
  }
  p.blLoad = (p.blLoad ?? 0) + 1;
  if (p.blLoad < Math.round(B.loadTicks * (hasPerk(p, "blPump") ? K.blPump.load : 1))) return;
  p.blAmmo = blAmmo(p) + 1;
  delete p.blLoad;
  addEffect(s, { kind: "blLoadFx", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 8, maxTicks: 10, follow: true });
}

/** 대시 시작 → 슬로우모션 (로그만, 대기 중이면 없음) · 파란 탄 · 끝나면 적 탄을 원래 빠르기로 */
export function slowTick(s: RunState): void {
  const p = s.player;
  const dashing = p.dashTicks > 0;
  if (dashing && !p.blDash && !(p.blSlowCd ?? 0) && !s.pvp && !s.pw) {
    p.blSlow = B.slowTicks;
    p.blSlowCd = B.slowCd;
    p.blBlue = B.blueN;
    addEffect(s, { kind: "blSlowFx", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 60, maxTicks: 30, follow: true });
  }
  p.blDash = dashing;
  if ((p.blSlowCd ?? 0) > 0 && --p.blSlowCd! <= 0) delete p.blSlowCd;
  if (!(p.blSlow ?? 0)) return;
  p.blFrozen = slowShots(s, p.blFrozen, B.shotSlow);
  if (--p.blSlow! > 0) return;
  restoreShots(s, p.blFrozen, B.shotSlow);
  delete p.blSlow;
  delete p.blFrozen;
}

/** 슬로우모션 중: 적이 이번 틱을 쉬는지 (punk.timeSlowed가 같이 봄) */
export function blastSlowed(s: RunState, boss: boolean): boolean {
  if (s.player.characterId !== "blast" || !(s.player.blSlow ?? 0)) return false;
  return s.tick % (boss ? B.bossEvery : B.slowEvery) !== 0;
}

/** 이동 배율 (슬로우모션 중 나도 느려짐) */
export const blastMoveMul = (p: PlayerState) => (p.characterId === "blast" && (p.blSlow ?? 0) > 0 ? B.slowMove : 1);
