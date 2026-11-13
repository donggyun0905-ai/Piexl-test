// 존(아슈바르): 누르면 지금 단계의 기본 공격 (1 황뢰 할퀴기 · 2 벽력일섬 · 3 뇌광 연속격 · 4 황금 번개 주먹)
// 기본 공격마다 확률로 지금 단계의 추가 공격 (1 지그재그 뇌격 · 2 황뢰 낙하 · 3 번개 분신 · 4 뇌전 구속) · 숫자 키 스킬(sim/jnSkills)
// 공용 틱·적응력·제약은 느아르와 같음 (sim/noir.ashTick·nrAdapt) · 번개·황금 번개 추가 타격(sim/jnZap)
import { srcRun } from "./dmgSrc";
import { JN_BASE as B, JN_EXTRA as X, JN_LV as L } from "../itemsJaune";
import { ashTick, type AshKit } from "./noir";
import { nrAim, nrAlive, nrArea } from "./nrKit";
import type { HitOn } from "./nrTypes";
import { ashFxLen, nrVolley } from "./nrVolley";
import { jnBoltTick, jnSkill, jnSkillSrc } from "./jnSkills";
import { jnZapTick } from "./jnZap";
import { root } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect } from "./util";

type P = RunState["player"];

export const isJaune = (p: P) => p.characterId === "jaune";
export { jnSkills } from "./jnSkills";

export const ZAP: HitOn = { zap: true };

/** 앞으로 직선 관통 (n타): 몸 앞에서 바라보는 쪽으로 */
export function jnLine(s: RunState, kind: "jnFlash" | "jnFist" | "jnZig" | "jnBeam", R: { len: number; w: number; every: number }, dmgs: number[], fin = 0): void {
  const p = s.player;
  const [dx, dy] = [p.faceX, p.faceY];
  nrVolley(s, { kind, x: p.x, y: p.y, r: R.w, dmg: 0, dmgs, n: dmgs.length, every: R.every, fin, on: ZAP, line: { dx, dy, len: R.len, w: R.w } });
  addEffect(s, { kind, x: p.x + dx * R.len * 0.5, y: p.y + dy * R.len * 0.5, dirX: dx, dirY: dy, size: R.len * 0.5, maxTicks: ashFxLen(dmgs.length, R.every) });
}

/** 몸 바로 앞 원 (n타 + 끝 한 방) · 원 자리 */
export function jnAhead(s: RunState, kind: "jnRapid" | "jnClone" | "jnHand" | "jnThousand", ahead: number, r: number, every: number, dmgs: number[], fin = 0, pull = 0): void {
  const p = s.player;
  const [x, y] = [p.x + p.faceX * ahead, p.y + p.faceY * ahead];
  nrVolley(s, { kind, x, y, r, dmg: 0, dmgs, n: dmgs.length, every, fin, pull, on: ZAP });
  addEffect(s, { kind, x, y, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: ashFxLen(dmgs.length, every) });
}

/** 같은 피해 n번 */
export const reps = (n: number, d: number) => Array.from({ length: n }, () => d);

/** 기본 공격 한 번 (지금 단계) · 다시 누르기까지 틱 */
function attack(s: RunState): number {
  const p = s.player;
  const D = p.stats.damage;
  const st = p.nrBase ?? 1;
  srcRun(s, `k:jnBase${st}`, () => {
    if (st === 1) {
      const R = B.s1;
      nrArea(s, p.x, p.y, R.r, D * L.weak, { at: R.arc, dx: p.faceX, dy: p.faceY }, ZAP);
      addEffect(s, { kind: "jnClaw", x: p.x + p.faceX * R.r * 0.5, y: p.y + p.faceY * R.r * 0.5, dirX: p.faceX, dirY: p.faceY, size: R.r * 0.6, maxTicks: 18 });
    } else if (st === 2) jnLine(s, "jnFlash", B.s2, reps(B.s2.hits, D * L.weak));
    else if (st === 3) jnAhead(s, "jnRapid", B.s3.ahead, B.s3.r, B.s3.every, reps(B.s3.hits, D * L.weak));
    else jnLine(s, "jnFist", B.s4, reps(B.s4.hits, D * L.strong));
  });
  return [B.s1, B.s2, B.s3, B.s4][st - 1]!.cd;
}

/** 추가 공격 (지금 단계) */
function extra(s: RunState): void {
  const p = s.player;
  const D = p.stats.damage;
  const st = p.nrExtra ?? 1;
  srcRun(s, `k:jnExtra${st}`, () => {
    if (st === 1) return jnLine(s, "jnZig", X.zig, reps(X.zig.hits, D * L.weak));
    if (st === 3) return jnAhead(s, "jnClone", X.clone.ahead, X.clone.r, X.clone.every, reps(X.clone.hits, D * L.weak));
    const [x, y] = nrAim(s, B.aim);
    if (st === 2) {
      nrArea(s, x, y, X.fall.r, D * L.strong, undefined, ZAP);
      addEffect(s, { kind: "jnFall", x, y, dirX: 0, dirY: 0, size: X.fall.r, maxTicks: 24 });
      return;
    }
    // 뇌전 구속: 묶고 약한 3타 → 강한 1타
    const R = X.bind;
    for (const e of s.enemies) if (nrAlive(e) && (e.x - x) ** 2 + (e.y - y) ** 2 <= (R.r + e.r) ** 2) root(e, R.root);
    nrVolley(s, { kind: "jnBind", x, y, r: R.r, dmg: 0, dmgs: reps(R.hits, D * L.weak), n: R.hits, every: R.every, fin: D * L.strong, on: ZAP });
    addEffect(s, { kind: "jnBind", x, y, dirX: 0, dirY: 0, size: R.r, maxTicks: ashFxLen(R.hits + 1, R.every) });
  });
}

/** 틱마다 더: 황금 번개 추가 타격 · 종언의 구체 */
function more(s: RunState): void {
  jnZapTick(s);
  srcRun(s, "k:jnSkillUp4", () => jnBoltTick(s));
}

const KIT: AshKit = { attack, extra, chance: () => X.chance, skill: jnSkill, skillSrc: jnSkillSrc, more };

/** 틱마다 (금빛 손아귀를 들었을 때 player에서) */
export function jauneTick(s: RunState, want: boolean, speed: number): void {
  ashTick(s, want, speed, KIT);
  const p = s.player;
  for (const f of s.effects) {
    // 날아가는 구체를 따라가는 효과 (황금 뇌구 · 광란의 천뢰)
    if (f.kind === "jnOrb" || f.kind === "jnFrenzy") {
      const v = p.nrVolleys?.find((o) => o.kind === f.kind);
      if (v) [f.x, f.y] = [v.x, v.y];
    }
  }
}
