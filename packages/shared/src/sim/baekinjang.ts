// 백인장(실베르): 누르면 앞을 X자로 벰 (혈월 쌍검격) · 전용 패시브가 있으면 이어 누를 때 적색 난무 → 선혈 회전참 → 섬광 돌진베기
// 늘 미니 창 드론(sim/bjDrones) · 공격마다 확률 기술(sim/bjProcs) · 숫자 키 스킬(sim/bjSkills) · 나눠 때리기·상태이상(sim/bjVolley)
import { BJ_PERKS as K } from "../itemsBaekinjang";
import { BJ_BLADES as F } from "../weaponsBaekinjang";
import { dronesTick, resetDrones } from "./bjDrones";
import { hasBj } from "./bjKit";
import { bjProcs } from "./bjProcs";
import { bjSkill } from "./bjSkills";
import { bjArea, bjHit, bjVolley, volleyTick } from "./bjVolley";
import { onSegment } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, keepInRoom, reachOf, roomGrid } from "./util";

type P = RunState["player"];

export { bjMarked, isBaekinjang } from "./bjKit";
export { bjHasSkill, bjSkills } from "./bjSkills";

const roomKey = (s: RunState) => s.floor * 1000 + s.roomId;
/** 콤보 차례의 전용 패시브 (0 = 기본 공격) */
const STEPS = [null, "bjFlurry", "bjSpin", "bjDash"] as const;

/** 공격 한 번: 콤보 차례의 기술 · 다시 누르기까지 틱 */
function attack(s: RunState): number {
  const p = s.player;
  const k = reachOf(p);
  const [dx, dy] = [p.faceX, p.faceY];
  const dmg = p.stats.damage;
  // 콤보가 끊겼으면 처음부터 · 없는 기술은 건너뜀
  let st = s.tick - (p.bjAtkAt ?? -999) > F.chain ? 0 : (p.bjStep ?? 0);
  while (st > 0 && !hasBj(p, STEPS[st]!)) st = (st + 1) % 4;
  p.bjStep = (st + 1) % 4;
  p.bjAtkAt = s.tick;
  if (st === 0) {
    const [x, y, r] = [p.x + dx * F.reach * k, p.y + dy * F.reach * k, F.r * k];
    // 초승달 검격 둘이 교차 (2번 맞음)
    bjArea(s, x, y, r, dmg * F.mul);
    bjArea(s, x, y, r, dmg * F.mul);
    addEffect(s, { kind: "bjSlash", x, y, dirX: dx, dirY: dy, size: r, maxTicks: 14 });
    if (hasBj(p, "bjWane")) {
      // 잔월: 검격이 앞으로 날아가 줄 위의 적을 한 번 더
      const W = K.bjWane;
      const [tx, ty] = [x + dx * W.len * k, y + dy * W.len * k];
      for (const e of onSegment(s, x, y, tx, ty, W.w * k)) bjHit(s, e, dmg * W.mul);
      addEffect(s, { kind: "bjWane", x, y, dirX: dx, dirY: dy, size: r * 0.8, toX: tx, toY: ty, maxTicks: 14 });
    }
    return F.cd;
  }
  if (st === 1) {
    const R = K.bjFlurry;
    const [x, y, r] = [p.x + dx * R.reach * k, p.y + dy * R.reach * k, R.r * k];
    bjVolley(s, { kind: "flurry", x, y, dx, dy, r, dmg: dmg * R.mul, n: R.hits, every: R.every });
    addEffect(s, { kind: "bjFlurry", x, y, dirX: dx, dirY: dy, size: r, maxTicks: 16 });
    return R.cd;
  }
  if (st === 2) {
    const R = K.bjSpin;
    bjVolley(s, { kind: "spin", x: p.x, y: p.y, dx, dy, r: R.r * k, dmg: dmg * R.mul, n: R.hits, every: R.every });
    addEffect(s, { kind: "bjSpin", x: p.x, y: p.y, dirX: dx, dirY: dy, size: R.r * k, maxTicks: R.hits * R.every + 4 });
    return R.cd;
  }
  const R = K.bjDash;
  p.bjRush = { dx, dy, t: R.ticks, step: R.step * k, dmg: dmg * R.mul, hit: [], sx: p.x, sy: p.y };
  return R.cd;
}

/** 섬광 돌진베기: 나아가며 닿은 적을 한 번씩 크게 벰 */
function rushTick(s: RunState): void {
  const p = s.player;
  const r = p.bjRush;
  if (!r) return;
  const [ax, ay] = [p.x, p.y];
  p.x += r.dx * r.step;
  p.y += r.dy * r.step;
  keepInRoom(p, roomGrid(s));
  p.invulnTicks = Math.max(p.invulnTicks, 2);
  for (const e of onSegment(s, ax, ay, p.x, p.y, p.r + K.bjDash.w)) {
    if (r.hit.includes(e.id)) continue;
    r.hit.push(e.id);
    bjHit(s, e, r.dmg, true);
  }
  if (--r.t > 0) return;
  if (hasBj(p, "bjSteel")) p.invulnTicks = Math.max(p.invulnTicks, K.bjSteel.invuln);
  if (hasBj(p, "bjChain")) p.bjHaste = s.tick + K.bjChain.ticks;
  addEffect(s, { kind: "bjDash", x: r.sx, y: r.sy, dirX: r.dx, dirY: r.dy, size: 22, toX: p.x, toY: p.y, maxTicks: 18 });
  delete p.bjRush;
}

/** 틱마다 (혈월 쌍검을 들었을 때 player에서) */
export function baekinjangTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  const key = roomKey(s);
  if (p.bjRoom !== key) {
    p.bjRoom = key;
    p.bjVolleys = [];
    delete p.bjRush;
    resetDrones(s);
  }
  const cd = (p.bjSkillCd ??= [0, 0, 0, 0]);
  for (let i = 0; i < cd.length; i++) if (cd[i]! > 0) cd[i]!--;
  if (p.trKey && p.trKey >= 1 && p.trKey <= 4 && !s.pvp && !s.pw) bjSkill(s, p.trKey - 1);
  if ((p.bjCd ?? 0) > 0) p.bjCd = (p.bjCd ?? 0) - 1;
  if (want && (p.bjCd ?? 0) <= 0 && !p.bjRush) {
    p.attackCount++;
    p.bjCd = Math.max(6, Math.round(attack(s) / Math.max(0.3, speed * ((p.bjHaste ?? 0) > s.tick ? K.bjChain.speed : 1))));
    bjProcs(s);
  }
  rushTick(s);
  dronesTick(s);
  volleyTick(s);
  // 몸을 따라다니는 효과 (회전참 · 종언의 날개)
  for (const f of s.effects) if (f.kind === "bjSpin" || f.kind === "bjEnd") [f.x, f.y] = [p.x, f.kind === "bjEnd" ? p.y - 6 : p.y];
}

/** 연습장 등에서 다시 시작할 때 */
export function resetBaekinjang(p: P): void {
  for (const k of ["bjCd", "bjRoom", "bjAtkAt", "bjStep", "bjDrones", "bjVolleys", "bjRush", "bjSkillCd", "bjRolls", "bjHaste"] as const) delete p[k];
}
