// 블랑 스킬(숫자 키 1~4, 처음부터 열림 · 적응력 강화에 성공하면 강화판 · 몸속에 있으면 못 씀)
// 1 고해의 속삭임 / 반전된 구원 · 2 정화의 역설 / 백색 성역의 기만 · 3 천사의 거짓 날개 / 천개의 거짓 눈 · 4 영혼 전이 / 종언의 무구한 지배
import { BC_BASE as B, BC_LV as L, BC_SKILLS as K } from "../itemsBlanc";
import { bc, bcZone, reps } from "./blanc";
import { bcChainStart } from "./bcPossess";
import { nrAim, nrAlive, nrRoll } from "./nrKit";
import { ashFxLen } from "./nrVolley";
import { root } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect } from "./util";

type P = RunState["player"];

/** 스킬 칸 차례의 수치 이름 (보통 · 강화) · 피해 출처 (화면 글자 키) */
export const BC_SKILL_IDS = [["whisper", "redeem"], ["paradox", "sanctum"], ["wings", "eyes"], ["transfer", "dominion"]] as const;
export const bcSkillSrc = (p: P, i: number) => (p.nrSkillUp?.[i] ? `k:bcSkillUp${i + 1}` : `k:bcSkill${i + 1}`);

/** 스킬 칸 넷의 남은 대기 (0~1) */
export const bcSkills = (p: P): number[] => BC_SKILL_IDS.map((ids, i) => Math.min(1, (p.nrSkillCd?.[i] ?? 0) / K[ids[p.nrSkillUp?.[i] ? 1 : 0]].cd));

/** (x, y) 둘레 r 안 살아 있는 적 */
const inside = (s: RunState, x: number, y: number, r: number) => s.enemies.filter((e) => nrAlive(e) && (e.x - x) ** 2 + (e.y - y) ** 2 <= (r + e.r) ** 2);

/** 스킬 i(0~3) 쓰기 */
export function bcSkill(s: RunState, i: number): void {
  const p = s.player;
  const cd = (p.nrSkillCd ??= [0, 0, 0, 0]);
  const ids = BC_SKILL_IDS[i];
  if (!ids || (cd[i] ?? 0) > 0) return;
  const id = ids[p.nrSkillUp?.[i] ? 1 : 0];
  cd[i] = K[id].cd;
  const D = p.stats.damage;
  if (id === "whisper") {
    // 고해의 속삭임: 못 움직임 + 매우매우 약한 15타
    const R = K.whisper;
    const [x, y] = nrAim(s, B.aim);
    for (const e of inside(s, x, y, R.r)) root(e, R.root);
    bcZone(s, "bcWhisper", x, y, R.r, R.every, reps(R.hits, D * L.vvweak));
  } else if (id === "redeem") {
    const R = K.redeem;
    const [x, y] = nrAim(s, B.aim);
    bcZone(s, "bcRedeem", x, y, R.r, R.every, reps(R.hits, D * L.weak), bc({ puppet: R.puppet }));
  } else if (id === "paradox") {
    const R = K.paradox;
    const [x, y] = nrAim(s, B.aim);
    bcZone(s, "bcParadox", x, y, R.r, R.every, reps(R.hits, D * L.weak), bc({ weak: R.weak }));
  } else if (id === "sanctum") {
    const R = K.sanctum;
    const [x, y] = nrAim(s, B.aim);
    bcZone(s, "bcSanctum", x, y, R.r, R.every, reps(R.hits, D * L.vvweak), bc({ stun: R.stun }));
  } else if (id === "wings") {
    // 천사의 거짓 날개: 범위 안 적들에게 아무렇게나 32타 · 맞은 적 방향키 -1
    const R = K.wings;
    const foes = inside(s, p.x, p.y, B.aim);
    addEffect(s, { kind: "bcWings", x: p.x, y: p.y, dirX: 0, dirY: 0, size: B.aim * 0.6, maxTicks: ashFxLen(R.hits, R.every) + 10 });
    if (!foes.length) return;
    const hit = new Set<number>();
    for (let n = 0; n < R.hits; n++) {
      const e = foes[Math.floor(nrRoll(s, "bcWings") * foes.length)]!;
      hit.add(e.id);
      (p.bcLaters ??= []).push({ id: e.id, at: s.tick + 6 + n * R.every, dmg: D * L.weak });
    }
    for (const e of foes) if (hit.has(e.id)) e.bcCut = (e.bcCut ?? 0) + 1;
  } else if (id === "eyes") {
    // 천개의 거짓 눈: 내 자리에 눈이 떠서 레이저 100발 (sim/bcMinds)
    const R = K.eyes;
    p.bcEyes = { x: p.x, y: p.y, left: R.n, next: s.tick + 24 };
    addEffect(s, { kind: "bcEyes", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 110, maxTicks: 24 + R.n * R.every });
  } else if (id === "transfer") {
    // 영혼 전이: 맞은 적들에게 차례로 빙의
    const R = K.transfer;
    const [x, y] = nrAim(s, B.aim);
    const foes = inside(s, x, y, R.r);
    bcZone(s, "bcTransfer", x, y, R.r, R.every, reps(R.hits, D * L.weak));
    bcChainStart(s, foes.map((e) => e.id), R.stay);
  } else {
    // 종언의 무구한 지배: 방의 모든 적에게 차례로 빙의 · 살아남은 적은 3초 뒤 한 번 더
    const R = K.dominion;
    addEffect(s, { kind: "bcEnd", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 150, maxTicks: 70 });
    bcChainStart(s, s.enemies.filter((e) => nrAlive(e)).map((e) => e.id), R.stay, R.later);
  }
}
