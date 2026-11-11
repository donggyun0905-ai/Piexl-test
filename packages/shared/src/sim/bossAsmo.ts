// 시즌 3 라스트 보스 아스모데우스의 화신체: 체력 줄 ×100 (한 줄 = 최대 체력 1%, 화면은 줄마다 색이 바뀜)
// 남은 줄 100~76 욕망의 화신 (sim/bossAsmoLust) → 75~51 검은 해의 화신 (bossAsmoVoid) → 50~0 강철 군주의 화신 (bossAsmoLord)
// 변신할 때(75줄·50줄)마다 궁극기, 10줄에서 마지막 궁극기 (sim/asmoUlts, 끝날 때까지 무적 · 넘친 피해는 버림)
import { ENEMIES } from "../content";
import { chessTick as chessTick_, trailTick as trailTick_, wallTick as wallTick_ } from "./asmoKit";
import { asmoUltTick, startAsmoUlt } from "./asmoUlts";
import { extraTick } from "./bossAsmoExtra";
import { hitDamage } from "./bossKit";
import { lustTick } from "./bossAsmoLust";
import { eatTick, voidTick } from "./bossAsmoVoid";
import { lordTick } from "./bossAsmoLord";
import { updateWaves } from "./bossWaves";
import type { EnemyState, RunState } from "./types";
import { srcFn } from "./dmgSrc";
const chessTick = srcFn("bossAsmo", () => chessTick_), trailTick = srcFn("bossAsmo", () => trailTick_), wallTick = srcFn("bossAsmo", () => wallTick_);

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 체력 줄 수 · 모습이 바뀌는 줄 (검은 해 · 강철 군주) · 마지막 궁극기 줄 */
  LINES: 100,
  VOID_AT: 75,
  LORD_AT: 50,
  LAST_AT: 10,
  /** 몸 반지름 (욕망 · 검은 해 · 강철 군주) */
  BODY_1: 14,
  BODY_2: 16,
  BODY_3: 18,
  /** 지쳤을 때 받는 피해 배율 (마지막 궁극기 뒤) */
  TIRED_TAKEN: 1.5,
};
export { R as BOSS_ASMO_RULES };

type Vec = readonly [number, number];

/** 한 줄 체력 */
export const lineHp = (e: EnemyState) => e.maxHp / R.LINES;
/** 남은 줄 수 (화면 ×N) */
export const asmoLines = (e: EnemyState) => Math.max(0, Math.ceil(e.hp / lineHp(e) - 1e-6));
/** 화신체 체력 배율 (층·인원) */
export const asmoMul = (e: EnemyState) => e.maxHp / ENEMIES.asmodeus.hp;
export const asmoPose = (s: RunState, e: EnemyState, f: number, ticks: number) => {
  e.amPose = f;
  e.amPoseEnd = s.tick + ticks;
};
/** 지친 화신체는 더 아픔 (classTaken) */
export const asmoTired = (s: RunState, e: EnemyState) => ((e.amTired ?? 0) > s.tick ? R.TIRED_TAKEN : 1);

export function updateAsmo(s: RunState, e: EnemyState, toP: Vec): void {
  e.stunTicks = 0;
  if (e.amForm === undefined) {
    e.amForm = 1;
    e.amUlts = 0;
    e.amHpWas = e.hp;
    e.timer = 90;
  }
  if ((e.amPoseEnd ?? 0) <= s.tick) e.amPose = 0;
  e.r = e.amForm === 1 ? R.BODY_1 : e.amForm === 2 ? R.BODY_2 : R.BODY_3;
  eatTick(s, e);
  wallTick(s, e);
  trailTick(s, e);
  chessTick(s, e, hitDamage(s));
  updateWaves(s, e);
  // 변신·마지막 궁극기: 그 줄에서 멈추고 (넘친 피해 버림) 궁극기
  const line = lineHp(e);
  const ults = e.amUlts ?? 0;
  if (e.amUlt === undefined) {
    if (ults === 0 && e.hp <= line * R.VOID_AT) startAsmoUlt(s, e, 1, line * R.VOID_AT);
    else if (ults === 1 && e.hp <= line * R.LORD_AT) startAsmoUlt(s, e, 2, line * R.LORD_AT);
    else if (ults === 2 && e.hp <= line * R.LAST_AT) startAsmoUlt(s, e, 3, line * R.LAST_AT);
  }
  if (e.amUlt !== undefined) asmoUltTick(s, e);
  else if ((e.amTired ?? 0) <= s.tick) {
    e.immune = false;
    if (e.amForm === 1) lustTick(s, e, toP);
    else if (e.amForm === 2) voidTick(s, e, toP);
    else lordTick(s, e, toP);
    extraTick(s, e);
  }
  e.amHpWas = e.hp;
}
