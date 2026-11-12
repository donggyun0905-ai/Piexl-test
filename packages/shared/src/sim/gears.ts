// 기어스(실베르, 은빛 쌍방패 기사 메이드): 누르면 앞을 두 방패로 강타 (피해는 약하지만 여러 번) · 대시는 구체 (sim/geBall)
// 공격·확률 기술은 sim/geProcs · 나눠 때리기·한 대 기록은 sim/geHit · 받는 피해·공격력 아이템 반만은 sim/geKit
// 맞은 뒤 (classTaken.afterHurt): 거울 반격 · 마법 보호막 돔 · 육각 방벽 · 반격 태세 · 육각 결정
import { GE_PERKS as K } from "../itemsGears";
import { GE_ATTACK as A } from "../weaponsGears";
import { ballTick } from "./geBall";
import { geArea, nearest, seqTick } from "./geHit";
import { geRoll, geSize, hasGe, isGears } from "./geKit";
import { guardTick, orbitTick, slam, throwTick } from "./geProcs";
import { srcRun } from "./dmgSrc";
import { roomKey } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, normalize } from "./util";

type P = RunState["player"];

export { gearsDash } from "./geBall";
export { gearsHalf, gearsHurtMul, gearsMoveMul, isGears } from "./geKit";
export { orbitAt as geOrbitAt } from "./geProcs";

/** 틱마다 (쌍방패를 들었을 때 player에서) */
export function gearsTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  const key = roomKey(s);
  if (p.geRoom !== key) {
    p.geRoom = key;
    p.geSeqs = [];
    p.geThrows = [];
  }
  if ((p.geToggle ?? 0) > 0) p.geToggle!--;
  if ((p.geRage ?? 0) > 0) p.geRage!--;
  const spd = speed * ((p.geRage ?? 0) > 0 ? K.geCounter.speed : 1);
  if ((p.geCd ?? 0) > 0) p.geCd!--;
  if (want && (p.geCd ?? 0) <= 0) {
    p.attackCount++;
    p.geAtkAt = s.tick;
    p.geHits = (p.geHits ?? 0) + 1;
    p.geCd = Math.max(6, Math.round(A.cd / Math.max(0.3, spd)));
    slam(s);
  }
  ballTick(s);
  guardTick(s);
  seqTick(s);
  throwTick(s);
  orbitTick(s);
  p.geShieldPrev = p.shieldPts ?? 0;
}

/** 맞은 뒤 (afterHurt): 거울 반격 · 보호막 돔 · 육각 방벽 · 반격 태세 · 육각 결정 */
export function gearsHurt(s: RunState): void {
  const p = s.player;
  if (!isGears(p)) return;
  const k = geSize(p);
  if (hasGe(p, "geCounter")) p.geRage = K.geCounter.ticks;
  if (hasGe(p, "geCrystal") && (p.geShieldPrev ?? 0) > 0 && (p.shieldPts ?? 0) <= 0) srcRun(s, "geCrystal", () => {
    const r = K.geCrystal.r * k;
    geArea(s, p.x, p.y, r, p.stats.damage * K.geCrystal.mul);
    addEffect(s, { kind: "geCrystal", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r, maxTicks: 18 });
  });
  p.geShieldPrev = p.shieldPts ?? 0;
  if (hasGe(p, "geMirror") && geRoll(s, "geMirror") < K.geMirror.chance) srcRun(s, "geMirror", () => {
    const M = K.geMirror;
    const e = nearest(s, p.x, p.y, M.dist * k);
    const d = (e && normalize(e.x - p.x, e.y - p.y)) || [p.faceX, p.faceY];
    if (e) geArea(s, e.x, e.y, e.r + 4, p.stats.damage * M.mul);
    addEffect(s, { kind: "geMirror", x: p.x + d[0] * 18, y: p.y + d[1] * 18, dirX: d[0], dirY: d[1], size: 34 * k, maxTicks: 20 });
  });
  if (hasGe(p, "geDome") && geRoll(s, "geDome") < K.geDome.chance) {
    p.shieldTicks = Math.max(p.shieldTicks, K.geDome.ticks);
    addEffect(s, { kind: "geDome", x: p.x, y: p.y, dirX: 0, dirY: 0, size: p.r + 22, maxTicks: 24 });
  }
  if (hasGe(p, "geHex") && (p.shieldPts ?? 0) < K.geHex.pts && geRoll(s, "geHex") < K.geHex.chance) {
    p.shieldPts = K.geHex.pts;
    p.geShieldPrev = p.shieldPts;
    addEffect(s, { kind: "geHex", x: p.x, y: p.y, dirX: 0, dirY: 0, size: p.r + 20, maxTicks: 30 });
  }
}

/** 연습장 등에서 다시 시작할 때 */
export function resetGears(p: P): void {
  for (const k of ["geCd", "geRoom", "geAtkAt", "geHits", "geRolls", "geBall", "geBallDx", "geBallDy", "geBallAt", "geToggle", "geDashKey", "geSpin", "geBumpAt", "geWaveCd", "geSeqs", "geThrows", "geGuard", "geGuardAt", "geRage", "geShieldPrev", "geLog", "geLogT"] as const) delete p[k];
}
