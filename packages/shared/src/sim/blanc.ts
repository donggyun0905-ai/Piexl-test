// 블랑(아슈바르): 누르면 지금 단계의 기본 공격 (1 순백의 부채무 · 2 거짓된 축복 · 3 성흔 인형극 · 4 백색 거울궁)
// 기본 공격마다 확률로 지금 단계의 추가 공격 (1 영혼의 틈 · 2 백령 빙의 · 3 강제 성전 · 4 허수의 분신) · 숫자 키 스킬(sim/bcSkills)
// 백무(대시 → 빙의, sim/bcPossess): 몸속에 있으면 기본 공격 대신 그 몬스터 공격 · 스킬 못 씀 · 추가 공격은 나감 · 정신 지배·분신(sim/bcMinds)
// 공용 틱·적응력·제약은 느아르와 같음 (sim/noir.ashTick·nrAdapt)
import { srcRun } from "./dmgSrc";
import { BC_BASE as B, BC_EXTRA as X, BC_LV as L } from "../itemsBlanc";
import { bcAddClone, bcMindsTick } from "./bcMinds";
import { bcEnter, bcHostAttack, bcHostOf, bcPossessTick, canHost } from "./bcPossess";
import { bcSkill, bcSkillSrc } from "./bcSkills";
import type { BcOn } from "./bcTypes";
import { ashTick, type AshKit } from "./noir";
import { nrAim, nrAlive, nrRoll } from "./nrKit";
import type { BcVolleyKind, HitOn } from "./nrTypes";
import { ashFxLen, nrVolley } from "./nrVolley";
import type { EnemyState, RunState } from "./types";
import { addEffect } from "./util";

export { isBlanc } from "./bcPossess";
export { bcSkills } from "./bcSkills";

/** 블랑 한 대에 붙는 것 (nrHit가 bcHit로 보냄) */
export const bc = (on: BcOn): HitOn => ({ bc: on });
/** 같은 피해 n번 (+ 끝 한 방) */
export const reps = (n: number, d: number, fin?: number) => [...Array.from({ length: n }, () => d), ...(fin ? [fin] : [])];

/** (x, y)에 나눠 때리기 + 효과 */
export function bcZone(s: RunState, kind: BcVolleyKind, x: number, y: number, r: number, every: number, dmgs: number[], on?: HitOn, size = r): void {
  nrVolley(s, { kind, x, y, r, dmg: 0, dmgs, n: dmgs.length, every, ...(on ? { on } : {}) });
  addEffect(s, { kind, x, y, dirX: s.player.faceX, dirY: s.player.faceY, size, maxTicks: ashFxLen(dmgs.length, every) + 4 });
}

/** 기본 공격 한 번 (지금 단계 · 몸속이면 그 몬스터 공격) · 다시 누르기까지 틱 */
function attack(s: RunState): number {
  const p = s.player;
  const host = bcHostOf(s);
  if (host) return bcHostAttack(s, host);
  const D = p.stats.damage;
  const [dx, dy] = [p.faceX, p.faceY];
  const st = p.nrBase ?? 1;
  srcRun(s, `k:bcBase${st}`, () => {
    if (st === 1) {
      const R = B.s1;
      nrVolley(s, { kind: "bcFan", x: p.x, y: p.y, r: R.reach + R.r, dmg: 0, dmgs: reps(R.hits, D * L.weak), n: R.hits, every: R.every, arc: { at: R.arc, dx, dy } });
      addEffect(s, { kind: "bcFan", x: p.x + dx * R.reach, y: p.y + dy * R.reach, dirX: dx, dirY: dy, size: R.r, maxTicks: ashFxLen(R.hits, R.every) + 6 });
      return;
    }
    const [x, y] = nrAim(s, B.aim);
    if (st === 2) bcZone(s, "bcBless", x, y, B.s2.r, B.s2.every, reps(B.s2.hits, D * L.weak));
    else if (st === 3) bcZone(s, "bcPuppet", x, y, B.s3.r, B.s3.every, reps(B.s3.hits, D * L.weak), bc({ puppet: B.s3.puppet, same: true }));
    else {
      bcZone(s, "bcMirror", x, y, B.s4.r, B.s4.every, reps(B.s4.hits, D * L.weak));
      p.bcMirror = s.tick + B.s4.mirror;
    }
  });
  return [B.s1, B.s2, B.s3, B.s4][st - 1]!.cd;
}

/** 공격 범위 안 가장 가까운 적 (몸속에 있는 적은 빼고) */
function target(s: RunState): EnemyState | undefined {
  const p = s.player;
  let best: EnemyState | undefined;
  let bd = (B.aim + 20) ** 2;
  for (const e of s.enemies) {
    if (!nrAlive(e) || e.id === p.bcHost) continue;
    const d = (e.x - p.x) ** 2 + (e.y - p.y) ** 2;
    if (d < bd) [best, bd] = [e, d];
  }
  return best;
}

/** 추가 공격 (지금 단계): 가까운 적 */
function extra(s: RunState): void {
  const p = s.player;
  const st = p.nrExtra ?? 1;
  const e = target(s);
  if (!e) return;
  const D = p.stats.damage;
  srcRun(s, `k:bcExtra${st}`, () => {
    if (st === 1) return bcZone(s, "bcRift", e.x, e.y, X.rift.r, X.rift.every, reps(X.rift.hits, D * L.vvweak), bc({ rift: true }));
    if (st === 2) {
      bcZone(s, "bcSeize", e.x, e.y, X.seize.r, X.seize.every, reps(X.seize.hits, D * L.weak));
      if (canHost(e) && !p.bcChain && nrRoll(s, "bcSeize") < X.seize.chance) bcEnter(s, e);
      return;
    }
    const R = st === 3 ? X.crusade : X.phantom;
    const dmgs = reps(R.hits, D * L.weak, D * L.strong);
    if (st === 3) {
      bcZone(s, "bcCrusade", e.x, e.y, R.r, R.every, dmgs, bc({ puppet: X.crusade.puppet, same: true }));
      // 쓰러지면 그 자리에 분신 (나눠 때리기가 끝날 때 확인)
      (p.bcLaters ??= []).push({ id: e.id, at: s.tick + ashFxLen(dmgs.length, R.every) + 1, dmg: 0, clone: [e.x, e.y] });
    } else {
      bcZone(s, "bcPhantom", e.x, e.y, R.r, R.every, dmgs);
      bcAddClone(s, p.x - p.faceX * 20, p.y - p.faceY * 20);
    }
  });
}

/** 스킬: 몸속에 있으면 못 씀 */
const skill = (s: RunState, i: number) => {
  if (s.player.bcHost === undefined) bcSkill(s, i);
};

const KIT: AshKit = { attack, extra, chance: () => X.chance, skill, skillSrc: bcSkillSrc, more: (s) => {
  srcRun(s, "k:bcPossess", () => bcPossessTick(s));
  bcMindsTick(s);
} };

/** 틱마다 (순백의 부채를 들었을 때 player에서) · 방이 바뀌면 빙의·분신·눈을 지움 */
export function blancTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  const key = s.floor * 1000 + s.roomId;
  if (p.bcRoom !== key) {
    p.bcRoom = key;
    for (const k of ["bcPick", "bcHost", "bcHostAt", "bcHostUntil", "bcHops", "bcChain", "bcClones", "bcLaters", "bcEyes", "bcMirror"] as const) delete p[k];
  }
  ashTick(s, want, speed, KIT);
}
