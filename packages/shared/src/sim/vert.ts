// 베르(아슈바르): 누르면 지금 단계의 기본 공격 (1 녹식 쌍낫격 · 2 가시 회전무 · 3 부패의 난무 · 4 맹독 덩굴채찍)
// 기본 공격마다 확률로 지금 단계의 추가 공격 = 씨앗이 있는 적을 바로 발아 (1 기생 씨앗 · 2 체내 개화 · 3 생명 착취 · 4 시든 육신) · 숫자 키 스킬(sim/vtSkills)
// 공용 틱·적응력·제약은 느아르와 같음 (sim/noir.ashTick·nrAdapt) · 녹독·씨앗(sim/vtRot) · 남는 꽃·덩굴·인형(sim/vtPlants)
import { srcRun } from "./dmgSrc";
import { VT_BASE as B, VT_EXTRA as X, VT_LV as L } from "../itemsVert";
import { ashTick, type AshKit } from "./noir";
import { nrAlive, nrNearest } from "./nrKit";
import type { HitOn, VtVolleyKind } from "./nrTypes";
import { ashFxLen, nrVolley } from "./nrVolley";
import { vtPlantsTick } from "./vtPlants";
import { vtPlantSeed, vtRotTick, vtSprout, type Sprout } from "./vtRot";
import { vtSkill, vtSkillSrc } from "./vtSkills";
import type { VtOn } from "./vtTypes";
import type { RunState } from "./types";
import { addEffect } from "./util";

type P = RunState["player"];

export const isVert = (p: P) => p.characterId === "vert";
export { vtSkills } from "./vtSkills";

/** 베르 한 대에 붙는 것 (nrHit가 vtHit로 보냄) */
export const vt = (on: VtOn = { poi: true }): HitOn => ({ vt: on });
/** 독 · 독+출혈 · 독+출혈+부식 · 모두(독·출혈·화상·부식) */
export const POI = vt({ poi: true });
export const PB = vt({ poi: true, bleed: true });
export const PBR = vt({ poi: true, bleed: true, rot: true });
export const ALL = vt({ poi: true, bleed: true, burn: true, rot: true });

/** 같은 피해 n번 */
export const reps = (n: number, d: number) => Array.from({ length: n }, () => d);

/** (x, y)에 나눠 때리기 + 효과 */
export function vtZone(s: RunState, kind: VtVolleyKind, x: number, y: number, r: number, every: number, dmgs: number[], on: HitOn, fx: Partial<{ dirX: number; dirY: number; follow: boolean; size: number }> = {}): void {
  nrVolley(s, { kind, x, y, r, dmg: 0, dmgs, n: dmgs.length, every, on, ...(fx.follow ? { follow: true } : {}) });
  addEffect(s, { kind, x, y, dirX: fx.dirX ?? 0, dirY: fx.dirY ?? 0, size: fx.size ?? r, maxTicks: ashFxLen(dmgs.length, every) });
}

/** 기본 공격 한 번 (지금 단계) · 다시 누르기까지 틱 */
function attack(s: RunState): number {
  const p = s.player;
  const D = p.stats.damage;
  const [dx, dy] = [p.faceX, p.faceY];
  const st = p.nrBase ?? 1;
  srcRun(s, `k:vtBase${st}`, () => {
    if (st === 1) {
      const R = B.s1;
      const [x, y] = [p.x + dx * R.reach, p.y + dy * R.reach];
      nrVolley(s, { kind: "vtSlash", x: p.x, y: p.y, r: R.reach + R.r, dmg: 0, dmgs: reps(R.hits, D * L.weak), n: R.hits, every: R.every, on: POI, arc: { at: R.arc, dx, dy } });
      addEffect(s, { kind: "vtSlash", x, y, dirX: dx, dirY: dy, size: R.r, maxTicks: ashFxLen(R.hits, R.every) + 4 });
    } else if (st === 2) {
      vtZone(s, "vtSpin", p.x, p.y, B.s2.r, B.s2.every, reps(B.s2.hits, D * L.vweak), PB, { follow: true });
    } else if (st === 3) {
      const R = B.s3;
      vtZone(s, "vtFrenzy", p.x + dx * R.reach, p.y + dy * R.reach, R.r, R.every, reps(R.hits, D * L.vweak), PB, { dirX: dx, dirY: dy });
    } else {
      const R = B.s4;
      nrVolley(s, { kind: "vtWhip", x: p.x, y: p.y, r: R.w, dmg: 0, dmgs: reps(R.hits, D * L.mid), n: R.hits, every: R.every, on: PBR, line: { dx, dy, len: R.len, w: R.w } });
      addEffect(s, { kind: "vtWhip", x: p.x + dx * R.len * 0.5, y: p.y + dy * R.len * 0.5, dirX: dx, dirY: dy, size: R.len * 0.5, maxTicks: ashFxLen(R.hits, R.every) + 6 });
    }
  });
  return [B.s1, B.s2, B.s3, B.s4][st - 1]!.cd;
}

/** 추가 공격 단계마다 발아에 붙는 것 */
const SPROUT: Record<number, Sprout> = {
  1: { fx: "vtSeed" },
  2: { fx: "vtBloom", gas: true },
  3: { fx: "vtDrain", heal: true },
  4: { fx: "vtWither", vine: true },
};

/** 추가 공격 (지금 단계): 씨앗이 있는 가장 가까운 적 바로 발아 (없으면 가까운 적에게 씨앗) */
function extra(s: RunState): void {
  const p = s.player;
  const st = p.nrExtra ?? 1;
  srcRun(s, `k:vtExtra${st}`, () => {
    let best: (typeof s.enemies)[number] | undefined;
    let bd = (B.aim + 20) ** 2;
    for (const e of s.enemies) {
      if (!nrAlive(e) || !e.vtSeed) continue;
      const d = (e.x - p.x) ** 2 + (e.y - p.y) ** 2;
      if (d < bd) [best, bd] = [e, d];
    }
    if (best) return void vtSprout(s, best, 1, SPROUT[st]);
    const e = nrNearest(s, p.x, p.y, B.aim, p.faceX, p.faceY);
    if (e) vtPlantSeed(s, e);
  });
}

const KIT: AshKit = { attack, extra, chance: () => X.chance, skill: vtSkill, skillSrc: vtSkillSrc, more: (s) => {
  srcRun(s, "k:vtSeed", () => vtRotTick(s));
  vtPlantsTick(s);
} };

/** 틱마다 (덩굴 쌍낫을 들었을 때 player에서) */
export function vertTick(s: RunState, want: boolean, speed: number): void {
  ashTick(s, want, speed, KIT);
  // 몸을 따라다니는 효과 (가시 회전무 · 천륜 가시무)
  for (const f of s.effects) if (f.kind === "vtSpin" || f.kind === "vtDance") [f.x, f.y] = [s.player.x, s.player.y];
}
