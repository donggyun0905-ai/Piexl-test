// 블뢰(아슈바르): 누르면 지금 단계의 기본 공격 (1 서리 결정탄 · 2 빙결의 파동 · 3 빙정 폭발 · 4 영구빙벽, 2~4는 공격 범위 안 마우스 자리)
// 기본 공격마다 확률로 지금 단계의 추가 공격 (1 영혼 늑대 · 2 영혼 매 · 3 영혼 사슴 · 4 영혼 군단) · 숫자 키 스킬(sim/buSkills)
// 공용 틱·적응력·제약은 느아르와 같음 (sim/noir.ashTick·nrAdapt) · 빙결(sim/buFrost) · 눈결정·결정탄(sim/buSnow)
import { srcRun } from "./dmgSrc";
import { BU_BASE as B, BU_EXTRA as X } from "../itemsBleu";
import { ashTick, type AshKit } from "./noir";
import { nrArea, nrNearest } from "./nrKit";
import type { HitOn } from "./nrTypes";
import { ashFxLen, nrVolley } from "./nrVolley";
import { buEndTick, buSkill, buSkillSrc } from "./buSkills";
import { buAim, buBoltTick, buFlakeTick, buMaybeFlake, buShoot } from "./buSnow";
import type { EnemyState, RunState } from "./types";
import { addEffect } from "./util";

type P = RunState["player"];

export const isBleu = (p: P) => p.characterId === "bleu";
export { buSkills } from "./buSkills";

const ice = (freeze: number): HitOn => ({ frost: true, freeze });

/** 기본 공격 한 번 (지금 단계) · 다시 누르기까지 틱 · 확률로 눈결정 */
function attack(s: RunState): number {
  const p = s.player;
  const D = p.stats.damage;
  const st = p.nrBase ?? 1;
  const id = `k:buBase${st}`;
  buMaybeFlake(s);
  if (st === 1) {
    srcRun(s, id, () => buShoot(s, D * B.s1.mul));
    return B.s1.cd;
  }
  const [x, y] = buAim(s);
  if (st === 2) {
    const R = B.s2;
    srcRun(s, id, () => nrVolley(s, { kind: "buWave", x, y, r: R.r, dmg: 0, dmgs: R.muls.map((m) => D * m), n: R.muls.length, every: R.every, on: ice(R.freeze) }));
    addEffect(s, { kind: "buWave", x, y, dirX: 0, dirY: 0, size: R.r, maxTicks: ashFxLen(R.muls.length, R.every) });
    return R.cd;
  }
  if (st === 3) {
    const R = B.s3;
    srcRun(s, id, () => nrVolley(s, { kind: "buBurst", x, y, r: R.r, dmg: 0, dmgs: [D * R.mul, 0], n: 2, every: R.delay, fin: D * R.fin, on: ice(R.freeze) }));
    addEffect(s, { kind: "buBurst", x, y, dirX: 0, dirY: 0, size: R.r, maxTicks: ashFxLen(2, R.delay) });
    return R.cd;
  }
  const R = B.s4;
  srcRun(s, id, () => nrVolley(s, { kind: "buWall", x, y, r: R.r, dmg: D * R.mul, n: R.hits, every: R.every, on: ice(R.freeze) }));
  addEffect(s, { kind: "buWall", x, y, dirX: 0, dirY: 0, size: R.r, maxTicks: ashFxLen(R.hits, R.every) });
  return R.cd;
}

/** 영혼 늑대(돌진)·매(급강하): 블뢰 곁에서 나타나 적에게 닿으면 빙결 1타 */
export function buBeast(s: RunState, e: EnemyState, kind: "buWolf" | "buHawk"): void {
  const p = s.player;
  const R = kind === "buWolf" ? X.wolf : X.hawk;
  const [sx, sy] = kind === "buWolf" ? [p.x - p.faceX * 16, p.y + 10] : [p.x, p.y - 40];
  nrVolley(s, { kind, x: e.x, y: e.y, r: R.r, dmg: p.stats.damage * R.mul, n: 1, every: 1, on: ice(R.freeze) }, R.ticks);
  addEffect(s, { kind, x: sx, y: sy, dirX: e.x - sx, dirY: e.y - sy, size: R.r, toX: e.x, toY: e.y, maxTicks: R.ticks + 12 });
}

/** 영혼 사슴: 블뢰 둘레 적을 빙결 1타 + 보호막 (겹치지 않음) · 몸 둘레 범위 r 배율 */
export function buDeer(s: RunState, mul = 1): void {
  const p = s.player;
  const R = X.deer;
  nrArea(s, p.x, p.y, R.r * mul, p.stats.damage * R.mul, undefined, ice(R.freeze));
  p.shieldPts = Math.max(p.shieldPts ?? 0, R.shield);
  addEffect(s, { kind: "buDeer", x: p.x, y: p.y, dirX: 0, dirY: 0, size: R.r * mul, maxTicks: 34 });
}

/** 추가 공격 (지금 단계): 가까운 적에게 */
function extra(s: RunState): void {
  const p = s.player;
  const e = nrNearest(s, p.x, p.y, X.dist, p.faceX, p.faceY);
  const st = p.nrExtra ?? 1;
  if (!e && st !== 3) return;
  srcRun(s, `k:buExtra${st}`, () => {
    if (st === 3) return buDeer(s);
    if (st === 1 || st === 4) buBeast(s, e!, "buWolf");
    if (st === 2 || st === 4) buBeast(s, e!, "buHawk");
    if (st === 4) {
      buDeer(s);
      addEffect(s, { kind: "buLegion", x: p.x, y: p.y, dirX: 0, dirY: 0, size: X.deer.r, maxTicks: 40 });
    }
  });
}

/** 틱마다 더: 결정탄 · 눈결정 · 종언의 영구동토 마무리 */
function more(s: RunState): void {
  srcRun(s, "k:buBase1", () => buBoltTick(s));
  buFlakeTick(s);
  srcRun(s, "k:buSkillUp4", () => buEndTick(s));
}

const KIT: AshKit = { attack, extra, chance: () => X.chance, skill: buSkill, skillSrc: buSkillSrc, more };

/** 틱마다 (하얀 마도서를 들었을 때 player에서) */
export function bleuTick(s: RunState, want: boolean, speed: number): void {
  ashTick(s, want, speed, KIT);
  // 몸을 따라다니는 효과 (사슴 · 군단 · 빙시계)
  for (const f of s.effects) if (f.kind === "buDeer" || f.kind === "buLegion" || f.kind === "buClock") [f.x, f.y] = [s.player.x, s.player.y];
}
