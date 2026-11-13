// 루주 스킬(숫자 키 1~4, 처음부터 열림 · 적응력 강화에 성공하면 강화판)
// 1 혈영 돌진 / 혈화 만개 · 2 장미 낙인 / 광란의 혈검무 · 3 쌍검 혈월참 / 붉은 장미의 장례 · 4 진홍의 폭우 / 종언의 혈장미
import { RG_ROSE, RG_SKILLS as K } from "../itemsRouge";
import { nrAlive, nrNearest } from "./nrKit";
import { nrLater, nrVolley } from "./nrVolley";
import { rgGather, rgPlant } from "./rgRose";
import type { RunState } from "./types";
import { addEffect, reachOf } from "./util";

type P = RunState["player"];

/** 스킬 칸 차례의 수치 이름 (보통 · 강화) · 피해 출처 (화면 글자 키) */
export const RG_SKILL_IDS = [["dash", "bloom"], ["mark", "dance"], ["moon", "funeral"], ["rain", "end"]] as const;
export const rgSkillSrc = (p: P, i: number) => (p.nrSkillUp?.[i] ? `k:rgSkillUp${i + 1}` : `k:rgSkill${i + 1}`);

/** 스킬 칸 넷의 남은 대기 (0~1) */
export const rgSkills = (p: P): number[] => RG_SKILL_IDS.map((ids, i) => Math.min(1, (p.nrSkillCd?.[i] ?? 0) / K[ids[p.nrSkillUp?.[i] ? 1 : 0]].cd));

const BLEED = { bleed: 1 };
const HOT = { bleed: 1, burn: true };

/** 스킬 i(0~3) 쓰기 */
export function rgSkill(s: RunState, i: number): void {
  const p = s.player;
  const cd = (p.nrSkillCd ??= [0, 0, 0, 0]);
  const ids = RG_SKILL_IDS[i];
  if (!ids || (cd[i] ?? 0) > 0) return;
  const id = ids[p.nrSkillUp?.[i] ? 1 : 0];
  const k = reachOf(p);
  const D = p.stats.damage;
  const [fx, fy] = [p.faceX, p.faceY];
  // 겨눌 적이 있어야 나가는 스킬 (없으면 대기 시간도 안 씀)
  if (id === "mark" || id === "funeral") {
    const e = nrNearest(s, p.x, p.y, K[id].dist * k, fx, fy);
    if (!e) return;
    cd[i] = K[id].cd;
    if (id === "mark") {
      e.rgMark = s.tick + K.mark.delay;
      addEffect(s, { kind: "rgMark", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 20, maxTicks: K.mark.delay });
      nrLater(s, { kind: "rgMark", x: e.x, y: e.y, r: 0, dmg: D * K.mark.mul, at: s.tick + K.mark.delay, id: e.id, on: BLEED });
      return;
    }
    // 장례: 둘레 적을 느리게 + 출혈 빨라짐 → 끝날 때 그 적 자리에서 터짐
    const R = K.funeral;
    const r = R.r * k;
    for (const f of s.enemies) {
      if (!nrAlive(f) || (f.x - e.x) ** 2 + (f.y - e.y) ** 2 > (r + f.r) ** 2) continue;
      f.slowTicks = Math.max(f.slowTicks ?? 0, R.slow);
      f.rgFast = s.tick + R.fast;
    }
    addEffect(s, { kind: "rgFuneral", x: e.x, y: e.y, dirX: 0, dirY: 0, size: r, maxTicks: R.fast });
    nrLater(s, { kind: "rgFuneral", x: e.x, y: e.y, r, dmg: D * R.mul, at: s.tick + R.fast, id: e.id, on: HOT });
    return;
  }
  cd[i] = K[id].cd;
  if (id === "dash") {
    const R = K.dash;
    p.nrRush = { dx: fx, dy: fy, t: R.ticks, step: R.step * k, dmg: D * R.mul, hit: [], sx: p.x, sy: p.y, fx: "rgRush" };
  } else if (id === "bloom") {
    const R = K.bloom;
    const r = R.r * k;
    rgPlant(s, p.x, p.y, R.roses, R.spread * k);
    nrVolley(s, { kind: "rgBloom", x: p.x, y: p.y, r, dmg: 0, n: 1, every: 1, fin: D * R.mul, finBurn: true, on: BLEED }, R.delay);
    addEffect(s, { kind: "rgBloomBig", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r, maxTicks: R.delay + 20 });
  } else if (id === "dance") {
    const R = K.dance;
    const r = R.r * k;
    nrVolley(s, { kind: "rgDance", x: p.x, y: p.y, r, dmg: D * R.mul, n: R.hits, every: R.every, fin: D * R.fin, follow: true, on: BLEED });
    addEffect(s, { kind: "rgDance", x: p.x, y: p.y, dirX: fx, dirY: fy, size: r, maxTicks: R.hits * R.every + 10 });
  } else if (id === "moon") {
    const R = K.moon;
    const [x, y, r] = [p.x + fx * R.reach * k, p.y + fy * R.reach * k, R.r * k];
    nrVolley(s, { kind: "rgMoon", x, y, r, dmg: D * R.mul, n: R.hits, every: R.every, on: BLEED });
    addEffect(s, { kind: "rgMoon", x, y, dirX: fx, dirY: fy, size: r, maxTicks: R.hits * R.every + 12 });
  } else if (id === "rain") {
    // 궁극기: 장미를 모아 16타 · 모인 장미 하나마다 한 대 피해 더함 · 출혈 4스택
    const R = K.rain;
    const r = R.r * k;
    const n = rgGather(s, p.x, p.y);
    nrVolley(s, { kind: "rgRain", x: p.x, y: p.y, r, dmg: D * (R.mul + R.perRose * n), n: R.hits, every: R.every, on: { bleed: R.bleed } }, 12);
    addEffect(s, { kind: "rgRain", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r, style: n, maxTicks: R.hits * R.every + 24 });
  } else {
    // 강화 궁극기: 장미를 모으고 적을 끌어당김 → 터질 때 강한 1타 + 장미 수만큼 타수 + 출혈·화상
    const R = K.end;
    const r = R.r * k;
    const n = Math.min(R.maxRose, rgGather(s, p.x, p.y));
    nrVolley(s, { kind: "rgEnd", x: p.x, y: p.y, r, dmg: n ? D * R.roseMul : 0, n: Math.max(1, n), every: R.every, pull: R.pull, fin: D * R.mul, finBurn: true, on: BLEED }, R.gather);
    addEffect(s, { kind: "rgEnd", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r, style: n, maxTicks: R.gather + Math.max(1, n) * R.every + 24 });
  }
}

/** 혈영 돌진이 지나가는 동안 몇 틱마다 꽃잎(혈장미)을 남김 */
export function rgRushTrail(s: RunState): void {
  const r = s.player.nrRush;
  if (r?.fx === "rgRush" && r.t % K.dash.roseEvery === 0) rgPlant(s, s.player.x, s.player.y, 1, RG_ROSE.r);
}
