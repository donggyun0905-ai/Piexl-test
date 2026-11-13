// 블뢰 스킬(숫자 키 1~4, 처음부터 열림 · 적응력 강화에 성공하면 강화판)
// 1 빙시계의 태엽 / 영원의 설원 · 2 절대 영도 / 월광 백랑의 포효 · 3 시간 동결 / 영겁의 시간감옥 · 4 빙창의 폭우 / 종언의 영구동토
import { BU_SKILLS as K } from "../itemsBleu";
import { USE_ITEMS } from "../items";
import { buFreeze } from "./buFrost";
import { buAim, buFlakeCount } from "./buSnow";
import { nrAlive, nrArea } from "./nrKit";
import type { HitOn } from "./nrTypes";
import { nrVolley } from "./nrVolley";
import type { RunState } from "./types";
import { addEffect } from "./util";

type P = RunState["player"];

/** 스킬 칸 차례의 수치 이름 (보통 · 강화) · 피해 출처 (화면 글자 키) */
export const BU_SKILL_IDS = [["clock", "field"], ["zero", "howl"], ["stop", "prison"], ["rain", "end"]] as const;
export const buSkillSrc = (p: P, i: number) => (p.nrSkillUp?.[i] ? `k:buSkillUp${i + 1}` : `k:buSkill${i + 1}`);

/** 스킬 칸 넷의 남은 대기 (0~1) */
export const buSkills = (p: P): number[] => BU_SKILL_IDS.map((ids, i) => Math.min(1, (p.nrSkillCd?.[i] ?? 0) / K[ids[p.nrSkillUp?.[i] ? 1 : 0]].cd));

/** 방 전체 (아주 큰 반지름) */
const ALL = 4000;
const ice = (freeze: number): HitOn => ({ frost: true, freeze });

/** 얼음 시계 (사용 아이템과 같은 길이) */
const iceClock = (s: RunState) => void (s.freezeTicks = Math.max(s.freezeTicks, USE_ITEMS.frost.ticks));

/** 스킬 i(0~3) 쓰기 */
export function buSkill(s: RunState, i: number): void {
  const p = s.player;
  const cd = (p.nrSkillCd ??= [0, 0, 0, 0]);
  const ids = BU_SKILL_IDS[i];
  if (!ids || (cd[i] ?? 0) > 0) return;
  const id = ids[p.nrSkillUp?.[i] ? 1 : 0];
  cd[i] = K[id].cd;
  const D = p.stats.damage;
  const [fx, fy] = [p.faceX, p.faceY];
  if (id === "clock") {
    const R = K.clock;
    nrVolley(s, { kind: "buClock", x: p.x, y: p.y, r: R.r, dmg: D * R.mul, n: R.hits, every: R.every, follow: true, on: ice(R.freeze) });
    addEffect(s, { kind: "buClock", x: p.x, y: p.y, dirX: 0, dirY: 0, size: R.r, maxTicks: R.hits * R.every + 14 });
  } else if (id === "field") {
    // 범위 안 적에게만 얼음 시계: 멈춤 (보스는 못 멈춤, 그림만)
    const R = K.field;
    for (const e of s.enemies) {
      if (!nrAlive(e) || (e.x - p.x) ** 2 + (e.y - p.y) ** 2 > (R.r + e.r) ** 2) continue;
      delete e.buIceOk;
      buFreeze(s, e, R.ticks);
    }
    addEffect(s, { kind: "buField", x: p.x, y: p.y, dirX: 0, dirY: 0, size: R.r, maxTicks: 50 });
  } else if (id === "zero") {
    // 냉기 구체: 둘레 적을 느리게 → 터질 때 강한 빙결 1타
    const R = K.zero;
    for (const e of s.enemies) if (nrAlive(e) && (e.x - p.x) ** 2 + (e.y - p.y) ** 2 <= (R.r + e.r) ** 2) e.slowTicks = Math.max(e.slowTicks ?? 0, R.delay);
    nrVolley(s, { kind: "buZero", x: p.x, y: p.y, r: R.r, dmg: 0, n: 1, every: 1, fin: D * R.mul, on: ice(R.freeze) }, R.delay);
    addEffect(s, { kind: "buZero", x: p.x, y: p.y, dirX: 0, dirY: 0, size: R.r, maxTicks: R.delay + 16 });
  } else if (id === "howl") {
    const R = K.howl;
    nrArea(s, p.x, p.y, R.r, D * R.mul, { at: R.arc, dx: fx, dy: fy }, ice(R.freeze));
    addEffect(s, { kind: "buHowl", x: p.x + fx * R.r * 0.45, y: p.y + fy * R.r * 0.45, dirX: fx, dirY: fy, size: R.r * 0.55, maxTicks: 36 });
  } else if (id === "stop") {
    // 얼음 시계 + 방 전체 매우 약한 빙결 15타
    const R = K.stop;
    iceClock(s);
    nrVolley(s, { kind: "buStop", x: p.x, y: p.y, r: ALL, dmg: D * R.mul, n: R.hits, every: R.every, on: ice(R.freeze) });
    addEffect(s, { kind: "buStop", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 110, maxTicks: USE_ITEMS.frost.ticks });
  } else if (id === "prison" || id === "rain") {
    const R = K[id];
    const [x, y] = buAim(s);
    const kind = id === "prison" ? "buPrison" : "buRain";
    nrVolley(s, { kind, x, y, r: R.r, dmg: D * R.mul, n: R.hits, every: R.every, on: ice(R.freeze) });
    addEffect(s, { kind, x, y, dirX: 0, dirY: 0, size: R.r, maxTicks: R.hits * R.every + 14 });
  } else {
    // 종언의 영구동토: 방 전체 얼음 시계 + 영혼 군단(빙결 1타 + 강한 빙결 1타 + 얼림 + 보호막) → 얼음 시계가 끝나면 눈결정 수만큼
    const R = K.end;
    iceClock(s);
    nrArea(s, p.x, p.y, ALL, D * R.mul, undefined, { frost: true });
    nrArea(s, p.x, p.y, ALL, D * R.mul2, undefined, ice(R.freeze));
    p.shieldPts = Math.max(p.shieldPts ?? 0, R.shield);
    p.buEndAt = s.tick + s.freezeTicks;
    addEffect(s, { kind: "buEnd", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 130, maxTicks: s.freezeTicks });
  }
}

/** 종언의 영구동토: 얼음 시계가 끝난 순간 방 전체에 눈결정 수만큼 매우 약한 빙결 */
export function buEndTick(s: RunState): void {
  const p = s.player;
  if (p.buEndAt === undefined || p.buEndAt > s.tick) return;
  delete p.buEndAt;
  const R = K.end;
  const n = Math.min(R.maxFlake, buFlakeCount(s));
  if (n <= 0) return;
  nrVolley(s, { kind: "buEnd", x: p.x, y: p.y, r: ALL, dmg: p.stats.damage * R.flakeMul, n, every: R.every, on: { frost: true } });
  addEffect(s, { kind: "buPop", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 160, style: n, maxTicks: 30 });
}
