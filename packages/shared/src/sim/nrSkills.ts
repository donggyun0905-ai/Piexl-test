// 느아르 스킬(숫자 키 1~4, 처음부터 열림 · 적응력 강화에 성공하면 강화판)
// 1 흑영 돌진 / 시초의 공허 · 2 공허의 낙인 / 차원 절멸 · 3 결계 붕괴 / 무한 심연 · 4 흑월 강림 / 태초의 종언
import { NR_SKILLS as K } from "../itemsNoir";
import { nrBoss, nrHit, nrNearest } from "./nrKit";
import { nrLater, nrVolley, nrWaves } from "./nrVolley";
import { pctHp } from "./pctHp";
import { dotDamage } from "./status";
import type { RunState } from "./types";
import { addEffect, keepInRoom, reachOf, roomGrid } from "./util";
import { onSegment } from "./s2Kit";

type P = RunState["player"];

/** 스킬 칸 차례의 수치 이름 (보통 · 강화) · 피해 출처 (화면 글자 키) */
export const NR_SKILL_IDS = [["dash", "origin"], ["brand", "rift"], ["barrier", "abyss"], ["moon", "end"]] as const;
export const nrSkillSrc = (p: P, i: number) => (p.nrSkillUp?.[i] ? `k:nrSkillUp${i + 1}` : `k:nrSkill${i + 1}`);

/** 스킬 칸 넷의 남은 대기 (0~1) */
export const nrSkills = (p: P): number[] => NR_SKILL_IDS.map((ids, i) => Math.min(1, (p.nrSkillCd?.[i] ?? 0) / K[ids[p.nrSkillUp?.[i] ? 1 : 0]].cd));

/** 스킬 i(0~3) 쓰기 */
export function nrSkill(s: RunState, i: number): void {
  const p = s.player;
  const cd = (p.nrSkillCd ??= [0, 0, 0, 0]);
  const ids = NR_SKILL_IDS[i];
  if (!ids || (cd[i] ?? 0) > 0) return;
  const id = ids[p.nrSkillUp?.[i] ? 1 : 0];
  const k = reachOf(p);
  const D = p.stats.damage;
  const [fx, fy] = [p.faceX, p.faceY];
  // 겨눌 적이 있어야 나가는 스킬 (없으면 대기 시간도 안 씀)
  if (id === "brand" || id === "barrier" || id === "abyss") {
    const e = nrNearest(s, p.x, p.y, K[id].dist * k, fx, fy);
    if (!e) return;
    cd[i] = K[id].cd;
    if (id === "brand") {
      e.nrBrand = s.tick + K.brand.delay;
      addEffect(s, { kind: "nrBrand", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 20, maxTicks: K.brand.delay });
      nrLater(s, { kind: "brand", x: e.x, y: e.y, r: 0, dmg: D * K.brand.mul, at: s.tick + K.brand.delay, id: e.id });
      return;
    }
    const R = K[id];
    const r = R.r * k;
    nrVolley(s, { kind: id, x: e.x, y: e.y, r, dmg: D * R.mul, n: R.hits, every: R.every, pull: R.pull, fin: id === "abyss" ? D * K.abyss.fin : 0 });
    addEffect(s, { kind: id === "abyss" ? "nrAbyss" : "nrBarrier", x: e.x, y: e.y, dirX: 0, dirY: 0, size: r, maxTicks: R.hits * R.every + 10 });
    return;
  }
  cd[i] = K[id].cd;
  if (id === "dash") {
    const R = K.dash;
    p.nrRush = { dx: fx, dy: fy, t: R.ticks, step: R.step * k, dmg: D * R.mul, hit: [], sx: p.x, sy: p.y };
  } else if (id === "origin") {
    const R = K.origin;
    const r = R.r * k;
    nrVolley(s, { kind: "origin", x: p.x, y: p.y, r, dmg: D * R.mul, n: R.hits, every: R.every, pull: R.pull, follow: true });
    addEffect(s, { kind: "nrOrigin", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r, maxTicks: R.hits * R.every + 10 });
  } else if (id === "rift") {
    const R = K.rift;
    const r = R.r * k;
    nrVolley(s, { kind: "rift", x: p.x, y: p.y, r, dmg: D * R.mul, n: R.hits, every: R.every });
    addEffect(s, { kind: "nrRift", x: p.x, y: p.y, dirX: fx, dirY: fy, size: r, maxTicks: R.hits * R.every + 8 });
  } else {
    // 궁극기: 발밑 강한 한 방 → 충격파 (태초의 종언은 '죽음' 피해 + 충격파 3번)
    const R = id === "end" ? K.end : K.moon;
    const r = R.r * k;
    addEffect(s, { kind: id === "end" ? "nrEnd" : "nrMoon", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r, maxTicks: 50 });
    for (const e of s.enemies) {
      if ((e.x - p.x) ** 2 + (e.y - p.y) ** 2 > (r + e.r) ** 2) continue;
      if (id === "end") dotDamage(s, e, "death", D * K.end.mul + ((e.kind === "dummy" ? 1000 : pctHp(e)) * K.end.pct) / (nrBoss(e) ? K.end.bossDiv : 1));
      else nrHit(s, e, D * K.moon.mul);
    }
    nrWaves(s, p.x, p.y, R.waves, D * R.waveMul, R.waveSpeed, R.waveGap);
  }
}

/** 흑영 돌진: 나아가며 닿은 적을 한 번씩 · 그동안 무적 */
export function nrRushTick(s: RunState): void {
  const p = s.player;
  const r = p.nrRush;
  if (!r) return;
  const [ax, ay] = [p.x, p.y];
  p.x += r.dx * r.step;
  p.y += r.dy * r.step;
  keepInRoom(p, roomGrid(s));
  p.invulnTicks = Math.max(p.invulnTicks, 2);
  for (const e of onSegment(s, ax, ay, p.x, p.y, p.r + K.dash.w)) {
    if (r.hit.includes(e.id)) continue;
    r.hit.push(e.id);
    nrHit(s, e, r.dmg);
  }
  if (--r.t > 0) return;
  addEffect(s, { kind: r.fx ?? "nrRush", x: r.sx, y: r.sy, dirX: r.dx, dirY: r.dy, size: 22, toX: p.x, toY: p.y, maxTicks: 20 });
  delete p.nrRush;
}
