// 시즌 3 새 몬스터 (enemies → stalkers.updateStalker에서 부름)
// 폭발풍뎅이: 들어오자마자 빠르게 달려와 몸에 달라붙음(닿아도 피해 없음) → 1.5초 뒤 폭발. 대시하면 떨어져 나가 그 자리에서 터짐
//   (못 피하면 큰 피해 + 화상, foeStatus) · 터지기 전에 잡으면 안 터짐
// 스켈레톤 궁병: 멀리서 얇은 일직선으로 나를 겨눔(따라옴) → 선이 굳어 깜빡임 → 매우 빠른 화살이 그 선을 따라 (큰 피해)
import { ENEMIES } from "../content";
import { depth } from "./hero";
import { addShape } from "./hazards";
import type { EnemyState, RunState } from "./types";
import { dist2 } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 폭발풍뎅이: 달라붙고 터지기까지 틱 (1.5초) · 폭발 반경 · 피해(+층 세기 × 3) */
  BUG_FUSE: 90,
  BUG_BLAST_R: 26,
  BUG_DMG: 24,
  /** 스켈레톤 궁병: 거리 두기 · 쉬는 틱 · 겨누는 틱(선이 나를 따라옴) · 깜빡이는 틱(선이 굳음) · 선 길이 · 선 굵기(반) · 피해(+층 세기 × 3) */
  ARCH_KEEP: 110,
  ARCH_REST: 150,
  ARCH_AIM: 60,
  ARCH_LOCK: 30,
  ARCH_LEN: 320,
  ARCH_WIDTH: 3,
  ARCH_DMG: 22,
};
export { R as NEW_FOES_RULES };

type Vec = readonly [number, number];

/** 폭발풍뎅이: phase walk 달려옴 · act 달라붙음(step 0) / 떨어져 나감(step 1) */
function bombbug(s: RunState, e: EnemyState, go: Vec): void {
  const p = s.player;
  if (e.phase !== "act") {
    const sp = ENEMIES.bombbug.speed;
    e.x += go[0] * sp;
    e.y += go[1] * sp;
    e.dirX = go[0];
    if (dist2(e, p) > (e.r + p.r + 1) ** 2) return;
    e.phase = "act";
    e.step = 0;
    e.timer = R.BUG_FUSE;
    e.auxX = e.x - p.x;
    e.auxY = e.y - p.y;
    return;
  }
  // 대시하면 떨어져 나가 그 자리에 남음
  if (e.step === 0 && p.dashTicks > 0) e.step = 1;
  if (e.step === 0) {
    e.x = p.x + (e.auxX ?? 0);
    e.y = p.y + (e.auxY ?? 0);
  }
  if (--e.timer > 0) return;
  addShape(s, 0, { x: e.x, y: e.y, radius: R.BUG_BLAST_R, damage: R.BUG_DMG + 3 * depth(s), by: "bombbug" });
  // 스스로 터진 것은 처치가 아님 (돈 없음 · 시련 점수에도 넣지 않게 combat.removeDead가 더할 1을 미리 뺌)
  e.hp = 0;
  e.noGold = true;
  if (s.trialRun) s.trialRun.got = (s.trialRun.got ?? 0) - 1;
}

/** 폭발풍뎅이가 터지기까지 남은 몫 (0~1, 화면 깜빡임) · 달라붙지 않았으면 undefined */
export const bugFuse = (e: EnemyState): number | undefined => (e.kind === "bombbug" && e.phase === "act" ? e.timer / R.BUG_FUSE : undefined);

/** 스켈레톤 궁병: phase walk 거리 두기 · windup step 0 겨눔(따라옴) · step 1 굳어 깜빡임 → 화살 */
function skelarcher(s: RunState, e: EnemyState, toP: Vec, go: Vec): void {
  e.timer--;
  if (e.phase === "windup") {
    if (e.step === 0) {
      e.dirX = toP[0];
      e.dirY = toP[1];
      if (e.timer > 0) return;
      e.step = 1;
      e.timer = R.ARCH_LOCK;
      const dmg = R.ARCH_DMG + 3 * depth(s);
      addShape(s, R.ARCH_LOCK, { x: e.x, y: e.y, toX: e.x + e.dirX * R.ARCH_LEN, toY: e.y + e.dirY * R.ARCH_LEN, width: R.ARCH_WIDTH, radius: 0, damage: dmg, fx: "rgleam", from: "skelarcher", by: "skelarcher", owner: e.id });
      return;
    }
    if (e.timer > 0) return;
    e.phase = "walk";
    e.timer = R.ARCH_REST;
    return;
  }
  // 거리를 두고 섬
  const sp = ENEMIES.skelarcher.speed;
  const d2 = dist2(e, s.player);
  const dir = d2 > R.ARCH_KEEP ** 2 ? 1 : d2 < (R.ARCH_KEEP - 25) ** 2 ? -1 : 0;
  const m = dir > 0 ? go : toP;
  e.x += m[0] * sp * dir;
  e.y += m[1] * sp * dir;
  e.dirX = toP[0];
  e.dirY = toP[1];
  if (e.timer > 0) return;
  e.phase = "windup";
  e.step = 0;
  e.timer = R.ARCH_AIM;
}

/** 궁병이 겨누는 중: 0 따라옴 · 1 굳어 깜빡임 (화면 선) · 아니면 undefined */
export const archerAim = (e: EnemyState): 0 | 1 | undefined => (e.kind === "skelarcher" && e.phase === "windup" ? (e.step === 1 ? 1 : 0) : undefined);
export const ARCHER_LEN = () => R.ARCH_LEN;

/** 새 몬스터면 움직이고 true */
export function updateNewFoe(s: RunState, e: EnemyState, toP: Vec, go: Vec): boolean {
  if (e.kind === "bombbug") bombbug(s, e, go);
  else if (e.kind === "skelarcher") skelarcher(s, e, toP, go);
  else return false;
  return true;
}
