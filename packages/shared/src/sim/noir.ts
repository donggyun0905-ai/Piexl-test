// 느아르(아슈바르): 누르면 지금 단계의 기본 공격 (1 칠흑 횡베기 · 2 무형의 난무 · 3 공허의 회전참 · 4 절대 단절)
// 기본 공격마다 확률로 지금 단계의 추가 공격 (1 심연의 손아귀 · 2 공간 압축 · 3 마력 소멸 · 4 공허 포식) · 숫자 키 스킬(sim/nrSkills)
// 나눠 때리기·충격파(sim/nrVolley) · 적응력·제약(sim/nrAdapt)
import { srcRun } from "./dmgSrc";
import { NR_BASE as B, NR_EXTRA as X } from "../itemsNoir";
import { ASH_REACH, nrArea, nrHit, nrNearest, nrRoll } from "./nrKit";
import { nrRushTick, nrSkill, nrSkillSrc } from "./nrSkills";
import { nrVolley, nrVolleyTick } from "./nrVolley";
import type { RunState } from "./types";
import { addEffect } from "./util";

type P = RunState["player"];

export { isNoir } from "./nrKit";
export { nrSkills } from "./nrSkills";

const roomKey = (s: RunState) => s.floor * 1000 + s.roomId;

/** 기본 공격 한 번 (지금 단계) · 다시 누르기까지 틱 */
function attack(s: RunState): number {
  const p = s.player;
  const k = ASH_REACH;
  const [dx, dy] = [p.faceX, p.faceY];
  const D = p.stats.damage;
  const st = p.nrBase ?? 1;
  if (st === 1) {
    const [x, y, r] = [p.x + dx * B.s1.reach * k, p.y + dy * B.s1.reach * k, B.s1.r * k];
    srcRun(s, "k:nrBase1", () => nrArea(s, x, y, r, D * B.s1.mul, { at: B.s1.arc, dx, dy }));
    addEffect(s, { kind: "nrSlash", x, y, dirX: dx, dirY: dy, size: r, maxTicks: 16 });
    return B.s1.cd;
  }
  if (st === 2) {
    const [x, y, r] = [p.x + dx * B.s2.reach * k, p.y + dy * B.s2.reach * k, B.s2.r * k];
    // 1 → (쉼) → 3 → (쉼) → 5타, 그다음 큰 한방 (nrVolley.once가 쉼 칸을 건너뜀)
    srcRun(s, "k:nrBase2", () => nrVolley(s, { kind: "flurry", x, y, r, dmg: D * B.s2.mul, n: 11, every: B.s2.every, fin: D * B.s2.fin }));
    addEffect(s, { kind: "nrFlurry", x, y, dirX: dx, dirY: dy, size: r, maxTicks: 11 * B.s2.every + 10 });
    return B.s2.cd;
  }
  if (st === 3) {
    const r = B.s3.r * k;
    srcRun(s, "k:nrBase3", () => nrVolley(s, { kind: "spin", x: p.x, y: p.y, r, dmg: D * B.s3.mul, ramp: D * B.s3.ramp, n: B.s3.hits, every: B.s3.every, follow: true }));
    addEffect(s, { kind: "nrSpin", x: p.x, y: p.y, dirX: dx, dirY: dy, size: r, maxTicks: B.s3.hits * B.s3.every + 6 });
    return B.s3.cd;
  }
  const R = B.s4;
  const [x, y, r] = [p.x + dx * R.reach * k, p.y + dy * R.reach * k, R.r * k];
  srcRun(s, "k:nrBase4", () => nrVolley(s, { kind: "sever", x, y, r, dmg: D * R.mul, ramp: D * R.ramp, n: R.hits, every: R.every, pull: R.pull, fin: D * R.fin }));
  addEffect(s, { kind: "nrSever", x, y, dirX: dx, dirY: dy, size: r, maxTicks: R.hits * R.every + 14 });
  return R.cd;
}

/** 추가 공격 (지금 단계): 가까운 적 자리에 */
function extra(s: RunState): void {
  const p = s.player;
  const k = ASH_REACH;
  const e = nrNearest(s, p.x, p.y, X.dist * k, p.faceX, p.faceY);
  if (!e) return;
  const D = p.stats.damage;
  const st = p.nrExtra ?? 1;
  const id = `k:nrExtra${st}`;
  srcRun(s, id, () => {
    if (st === 1) {
      const r = X.s1.r * k;
      for (const f of s.enemies) {
        if ((f.x - e.x) ** 2 + (f.y - e.y) ** 2 > (r + f.r) ** 2) continue;
        f.slowTicks = Math.max(f.slowTicks ?? 0, X.s1.slow);
        nrHit(s, f, D * X.s1.mul);
      }
      addEffect(s, { kind: "nrGrasp", x: e.x, y: e.y, dirX: 0, dirY: 0, size: r, maxTicks: 30 });
      return;
    }
    if (st === 2 || st === 3) {
      const R = st === 2 ? X.s2 : X.s3;
      const r = R.r * k;
      nrVolley(s, { kind: st === 2 ? "squeeze" : "drain", x: e.x, y: e.y, r, dmg: 0, n: 1, every: 1, pull: R.pull, fin: D * R.mul }, R.ticks);
      addEffect(s, { kind: st === 2 ? "nrSqueeze" : "nrDrain", x: e.x, y: e.y, dirX: 0, dirY: 0, size: r, maxTicks: R.ticks + 4 });
      return;
    }
    const R = X.s4;
    const r = R.r * k;
    nrVolley(s, { kind: "devour", x: e.x, y: e.y, r, dmg: D * R.mul, n: R.hits, every: R.every, pull: R.pull });
    addEffect(s, { kind: "nrDevour", x: e.x, y: e.y, dirX: 0, dirY: 0, size: r, maxTicks: R.hits * R.every + 10 });
  });
}

/** 아슈바르 캐릭터마다 다른 것: 기본 공격(다시 누르기까지 틱) · 추가 공격과 확률 · 스킬 · 스킬 피해 출처 · 틱마다 더 할 것 */
export interface AshKit {
  attack: (s: RunState) => number;
  extra: (s: RunState) => void;
  chance: () => number;
  skill: (s: RunState, i: number) => void;
  skillSrc: (p: P, i: number) => string;
  more?: (s: RunState) => void;
}

/** 아슈바르 공용 틱 (느아르·루주): 방 바뀌면 정리 · 스킬 대기 · 숫자 키 스킬 · 기본 공격 + 확률 추가 공격 · 돌진 · 나눠 때리기 */
export function ashTick(s: RunState, want: boolean, speed: number, kit: AshKit): void {
  const p = s.player;
  const key = roomKey(s);
  if (p.nrRoom !== key) {
    p.nrRoom = key;
    p.nrVolleys = [];
    p.nrLaters = [];
    p.nrWaves = [];
    p.rgRoses = [];
    p.buFlakes = [];
    p.buBolts = [];
    delete p.buEndAt;
    p.jnZaps = [];
    p.jnBolts = [];
    p.mzScents = [];
    p.mzBrands = [];
    delete p.mzEndAt;
    p.vtPlants = [];
    p.vtThralls = [];
    p.vtCorpses = [];
    p.vtSeen = [];
    delete p.nrRush;
  }
  const cd = (p.nrSkillCd ??= [0, 0, 0, 0]);
  for (let i = 0; i < cd.length; i++) if (cd[i]! > 0) cd[i]!--;
  const sk = p.trKey;
  if (sk && sk >= 1 && sk <= 4 && !s.pvp && !s.pw) srcRun(s, kit.skillSrc(p, sk - 1), () => kit.skill(s, sk - 1));
  if ((p.nrCd ?? 0) > 0) p.nrCd = (p.nrCd ?? 0) - 1;
  if (want && (p.nrCd ?? 0) <= 0 && !p.nrRush) {
    p.attackCount++;
    p.nrAtkAt = s.tick;
    p.nrCd = Math.max(6, Math.round(kit.attack(s) / Math.max(0.3, speed)));
    if (nrRoll(s, "nrExtra") < kit.chance()) kit.extra(s);
  }
  srcRun(s, kit.skillSrc(p, 0), () => nrRushTick(s));
  nrVolleyTick(s);
  kit.more?.(s);
}

const KIT: AshKit = { attack, extra, chance: () => X.chance, skill: nrSkill, skillSrc: nrSkillSrc };

/** 틱마다 (공허의 손톱을 들었을 때 player에서) */
export function noirTick(s: RunState, want: boolean, speed: number): void {
  ashTick(s, want, speed, KIT);
  // 몸을 따라다니는 효과 (회전참 · 시초의 공허)
  for (const f of s.effects) if (f.kind === "nrSpin" || f.kind === "nrOrigin") [f.x, f.y] = [s.player.x, s.player.y];
}

/** 연습장 등에서 다시 시작할 때 (적응력 단계는 연습장 도구가 따로 정함) */
export function resetNoir(p: P): void {
  for (const k of ["nrCd", "nrRoom", "nrAtkAt", "nrVolleys", "nrLaters", "nrWaves", "nrRush", "nrSkillCd", "nrRolls", "rgRoses", "buFlakes", "buBolts", "buEndAt", "jnZaps", "jnBolts", "mzScents", "mzBrands", "mzEndAt", "vtPlants", "vtThralls", "vtCorpses", "vtSeen"] as const) delete p[k];
}
