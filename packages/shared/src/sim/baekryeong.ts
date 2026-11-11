// 백령(실베르): 누르면 바라보는 쪽 앞을 대태도로 부채꼴 베기 · 적을 처치하면 영혼이 저절로 쌓임(sim/baekSoul)
// 게이지 3칸부터 머리 위 유령팔이 벨 때마다 에너지 참격(sim/baekSlash) · (진)대태도(sim/baekSword)
import { BAEK_PERKS as K } from "../itemsBaekryeong";
import { BAEK_BLADE as B } from "../weaponsBaekryeong";
import { hauntMul, isBaek } from "./baekKit";
import { armSwing, shotsTick } from "./baekSlash";
import { soulTick } from "./baekKills";
import { swordsTick } from "./baekSword";
import { alive, damageEnemyLite } from "./shadowingSpirits";
import { ignite } from "./status";
import type { RunState } from "./types";
import { addEffect, hasPerk, normalize, reachOf } from "./util";

type P = RunState["player"];

export { armScale, isBaek, maxLv, soulNeed } from "./baekKit";
export { slashSize } from "./baekSlash";

const roomKey = (s: RunState) => s.floor * 1000 + s.roomId;
/** 베는 거리·넓이 배율 (사거리 증가·오니의 뿔) */
export const bladeSize = (p: P) => reachOf(p) * (hasPerk(p, "byHorn") ? K.byHorn.size : 1);

/** 대태도 베기: 앞 부채꼴 안 적 모두 (저승 베기·청혼불) */
function cut(s: RunState): void {
  const p = s.player;
  const reach = B.reach * bladeSize(p);
  const dmg = p.stats.damage * B.mul * hauntMul(p);
  for (const e of s.enemies) {
    if (!alive(e)) continue;
    const dx = e.x - p.x;
    const dy = e.y - p.y;
    const dist = Math.hypot(dx, dy);
    if (dist > reach + e.r) continue;
    if (dist > e.r && (dx * p.faceX + dy * p.faceY) / dist < B.arcCos) continue;
    const d = normalize(dx, dy) ?? [p.faceX, p.faceY];
    const low = hasPerk(p, "byReaper") && e.hp < e.maxHp * K.byReaper.below;
    damageEnemyLite(s, e, dmg * (low ? K.byReaper.mul : 1), d[0], d[1]);
    if (hasPerk(p, "byFlame") && e.hp > 0) ignite(e, p.stats.damage * K.byFlame.burn);
  }
  addEffect(s, { kind: "bySlash", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: reach, maxTicks: 14 });
}

/** 한 번 베기 (공격 버튼): 대태도 · 유령팔 */
function swing(s: RunState, speed: number): void {
  const p = s.player;
  const possess = hasPerk(p, "byPossess") && p.hp < p.stats.maxHp * K.byPossess.below ? K.byPossess.speed : 1;
  p.byCd = Math.max(6, Math.round(B.cd / Math.max(0.3, speed * possess)));
  p.attackCount++;
  cut(s);
  armSwing(s);
}

/** 틱마다 (대태도를 들었을 때 player에서) */
export function baekTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  const key = roomKey(s);
  if (p.byRoom !== key) {
    p.byRoom = key;
    p.byShots = [];
    p.byWhirls = [];
    p.bySwords = [];
  }
  if ((p.byCd ?? 0) > 0) p.byCd = (p.byCd ?? 0) - 1;
  if (want && (p.byCd ?? 0) <= 0) swing(s, speed);
  // 유령 걸음: 대시가 끝난 자리에 혼불이 터짐
  const dashing = p.dashTicks > 0;
  if (p.byDash && !dashing && hasPerk(p, "byStep")) {
    const r = K.byStep.r * bladeSize(p);
    for (const e of s.enemies) {
      if (!alive(e) || (e.x - p.x) ** 2 + (e.y - p.y) ** 2 > (r + e.r) ** 2) continue;
      const d = normalize(e.x - p.x, e.y - p.y) ?? [0, 0];
      damageEnemyLite(s, e, p.stats.damage * K.byStep.mul * hauntMul(p), d[0], d[1]);
    }
    addEffect(s, { kind: "byStep", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r, maxTicks: 22 });
  }
  p.byDash = dashing;
  soulTick(s);
  shotsTick(s);
  swordsTick(s);
}

/** 받는 피해 배율 (혼의 가호) */
export const baekTaken = (p: P) => (isBaek(p) && hasPerk(p, "byGuard") ? K.byGuard.taken : 1);

/** 연습장 등에서 다시 시작할 때 */
export function resetBaek(p: P): void {
  for (const k of ["byCd", "byDash", "byRoom", "byArmAt", "bySouls", "byLv", "byShots", "byWhirls", "bySwords", "byKills"] as const) delete p[k];
}
