// 루주(아슈바르): 누르면 지금 단계의 기본 공격 (1 적장미 쌍검격 · 2 혈염 난무 · 3 광란의 회전참 · 4 장미 가시 찌르기)
// 기본 공격마다 확률로 지금 단계의 추가 공격 (1 혈화 개화 · 2 장미꽃잎 폭풍 · 3 선혈 가시숲 · 4 업화의 장미) · 숫자 키 스킬(sim/rgSkills)
// 공용 틱·적응력·제약은 느아르와 같음 (sim/noir.ashTick·nrAdapt) · 혈장미·출혈(sim/rgRose·rgBleed)
import { srcRun } from "./dmgSrc";
import { RG_BASE as B, RG_EXTRA as X } from "../itemsRouge";
import { ashTick, type AshKit } from "./noir";
import { nrArea, nrNearest } from "./nrKit";
import { nrVolley } from "./nrVolley";
import { rgBleedTick } from "./rgBleed";
import { rgMaybePlant, rgPlant, rgRoseTick } from "./rgRose";
import { rgRushTrail, rgSkill, rgSkillSrc } from "./rgSkills";
import type { RunState } from "./types";
import { addEffect, reachOf } from "./util";

type P = RunState["player"];

export const isRouge = (p: P) => p.characterId === "rouge";
export { rgSkills } from "./rgSkills";

const BLEED = { bleed: 1 };

/** 기본 공격 한 번 (지금 단계) · 다시 누르기까지 틱 · 확률로 혈장미 */
function attack(s: RunState): number {
  const p = s.player;
  const k = reachOf(p);
  const [dx, dy] = [p.faceX, p.faceY];
  const D = p.stats.damage;
  const st = p.nrBase ?? 1;
  const R = st === 1 ? B.s1 : st === 2 ? B.s2 : st === 3 ? B.s3 : B.s4;
  const reach = "reach" in R ? R.reach * k : 0;
  const [x, y, r] = [p.x + dx * reach, p.y + dy * reach, R.r * k];
  const id = `k:rgBase${st}`;
  if (st === 1) srcRun(s, id, () => nrVolley(s, { kind: "rgX", x, y, r, dmg: D * B.s1.mul, n: B.s1.hits, every: B.s1.every }));
  else if (st === 2) srcRun(s, id, () => nrVolley(s, { kind: "rgFlame", x, y, r, dmg: D * B.s2.mul, n: B.s2.hits, every: B.s2.every, on: BLEED }));
  else if (st === 3) srcRun(s, id, () => nrVolley(s, { kind: "rgSpin", x, y, r, dmg: D * B.s3.mul, n: B.s3.hits, every: B.s3.every, follow: true, on: BLEED }));
  else {
    const m = B.s4.muls;
    srcRun(s, id, () => nrVolley(s, { kind: "rgThorn", x, y, r, dmg: 0, dmgs: m.map((v) => D * v), n: m.length, every: B.s4.every, fin: D * B.s4.fin, on: BLEED }));
  }
  const n = st === 4 ? B.s4.muls.length : (R as { hits: number }).hits;
  const kind = (["rgX", "rgFlame", "rgSpin", "rgThorn"] as const)[st - 1]!;
  addEffect(s, { kind, x, y, dirX: dx, dirY: dy, size: r, maxTicks: n * R.every + 12 });
  rgMaybePlant(s, x, y);
  return R.cd;
}

/** 추가 공격 (지금 단계): 가까운 적 자리에 */
function extra(s: RunState): void {
  const p = s.player;
  const k = reachOf(p);
  const e = nrNearest(s, p.x, p.y, X.dist * k, p.faceX, p.faceY);
  if (!e) return;
  const D = p.stats.damage;
  const st = p.nrExtra ?? 1;
  srcRun(s, `k:rgExtra${st}`, () => {
    if (st === 1) {
      const r = X.s1.r * k;
      nrArea(s, e.x, e.y, r, D * X.s1.mul, undefined, BLEED);
      rgPlant(s, e.x, e.y, X.s1.roses, r);
      addEffect(s, { kind: "rgBloom", x: e.x, y: e.y, dirX: 0, dirY: 0, size: r, maxTicks: 28 });
      return;
    }
    if (st === 2 || st === 3) {
      const R = st === 2 ? X.s2 : X.s3;
      const r = R.r * k;
      nrVolley(s, { kind: st === 2 ? "rgPetal" : "rgForest", x: e.x, y: e.y, r, dmg: D * R.mul, n: R.hits, every: R.every, on: BLEED });
      addEffect(s, { kind: st === 2 ? "rgPetal" : "rgForest", x: e.x, y: e.y, dirX: 0, dirY: 0, size: r, maxTicks: R.hits * R.every + 10 });
      return;
    }
    const r = X.s4.r * k;
    nrArea(s, e.x, e.y, r, D * X.s4.mul, undefined, { bleed: 1, burn: true });
    addEffect(s, { kind: "rgBlaze", x: e.x, y: e.y, dirX: 0, dirY: 0, size: r, maxTicks: 34 });
  });
}

/** 틱마다 더: 돌진 꽃잎 · 혈장미 · 출혈 */
function more(s: RunState): void {
  rgRushTrail(s);
  srcRun(s, "k:rgRose", () => rgRoseTick(s));
  rgBleedTick(s);
}

const KIT: AshKit = { attack, extra, chance: () => X.chance, skill: rgSkill, skillSrc: rgSkillSrc, more };

/** 틱마다 (장미쌍검을 들었을 때 player에서) */
export function rougeTick(s: RunState, want: boolean, speed: number): void {
  ashTick(s, want, speed, KIT);
  // 몸을 따라다니는 효과 (회전참 · 혈검무)
  for (const f of s.effects) if (f.kind === "rgSpin" || f.kind === "rgDance") [f.x, f.y] = [s.player.x, s.player.y];
}
