// 레이븐(실베르): 몸 왼쪽 퀸·오른쪽 킹 · 누르면 킹이 앞으로 나와 바닥을 내려찍음(체크 붙임) → 다음은 퀸이 앞으로 나와 빛기둥(체크 터뜨림) → 다시 킹부터
// 공격마다 확률 기물 공격(sim/rvProcs) · 숫자 키 스킬(sim/rvSkills) · 움직이는 기물·예약 공격(sim/rvUnits) · 갬빗(처치하면 회복·금빛 폰)
import { RV_PERKS as K } from "../itemsRaven";
import { RV_ATTACK as A } from "../weaponsRaven";
import { srcRun } from "./dmgSrc";
import { heal } from "./heal";
import { hasRv, rvNearest, rvReach } from "./rvKit";
import { rvProcs } from "./rvProcs";
import { rvSkill } from "./rvSkills";
import { rvArea, rvSchedule } from "./rvStrike";
import { rvUnit, rvUnitsTick } from "./rvUnits";
import type { RunState } from "./types";
import { addEffect, normalize } from "./util";

type P = RunState["player"];

export { isRaven, rvChecked } from "./rvKit";
export { rvHasSkill, rvSkills } from "./rvSkills";

const roomKey = (s: RunState) => s.floor * 1000 + s.roomId;

/** 공격 한 번: 차례에 따라 킹 내려찍기 또는 퀸 빛기둥 */
function attack(s: RunState): void {
  const p = s.player;
  const k = rvReach(p);
  const [dx, dy] = [p.faceX, p.faceY];
  const dmg = p.stats.damage;
  const st = p.rvStep ?? 0;
  p.rvStep = st ? 0 : 1;
  p.rvAtkAt = s.tick;
  if (st === 0) {
    // 킹: 앞 바닥을 내려찍어 둘레를 침 · 맞은 적에게 체크 (왕의 철퇴면 더 넓고 기절)
    const iron = hasRv(p, "rvIron");
    const r = A.slamR * k * (iron ? K.rvIron.r : 1);
    const [x, y] = [p.x + dx * A.slamReach * k, p.y + dy * A.slamReach * k];
    rvArea(s, x, y, r, dmg * A.slamMul, { check: true, stun: iron ? K.rvIron.stun : 0 });
    addEffect(s, { kind: "rvSlam", x, y, dirX: dx, dirY: dy, size: r, maxTicks: 18 });
    return;
  }
  // 퀸: 앞쪽 바닥에서 빛기둥 · 체크된 적은 체크메이트
  const [x, y] = [p.x + dx * A.pillarReach * k, p.y + dy * A.pillarReach * k];
  const r = A.pillarR * k;
  rvArea(s, x, y, r, dmg * A.pillarMul, { pop: true });
  addEffect(s, { kind: "rvPillar", x, y, dirX: dx, dirY: dy, size: r, maxTicks: 22 });
  if (hasRv(p, "rvRadiance"))
    srcRun(s, "rvRadiance", () => {
      const R = K.rvRadiance;
      for (let i = 1; i <= R.n; i++)
        rvSchedule(s, { at: s.tick + i * R.every, kind: "pillar", x: x + dx * R.gap * i * k, y: y + dy * R.gap * i * k, dx, dy, r: r * 0.7, dmg: dmg * R.mul, fx: "rvPillar", style: 1 });
    });
}

/** 갬빗: 이번 틱에 처치한 수만큼 회복 · 그 자리 근처에서 금빛 폰이 가까운 적에게 */
function gambit(s: RunState): void {
  const p = s.player;
  const n = s.kills - (p.rvKills ?? s.kills);
  p.rvKills = s.kills;
  if (n <= 0 || !hasRv(p, "rvGambit")) return;
  srcRun(s, "rvGambit", () => {
    const G = K.rvGambit;
    heal(s, G.heal * n);
    const e = rvNearest(s, p.x, p.y, 260);
    const d = (e && normalize(e.x - p.x, e.y - p.y)) || [p.faceX, p.faceY];
    rvUnit(s, "gold", p.x + d[0] * 12, p.y + d[1] * 12, d[0], d[1], G.speed, G.ticks, 9 * rvReach(p), p.stats.damage * G.mul);
  });
}

/** 틱마다 (왕국의 창을 들었을 때 player에서) */
export function ravenTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  const key = roomKey(s);
  if (p.rvRoom !== key) {
    p.rvRoom = key;
    p.rvUnits = [];
    p.rvEvents = [];
    delete p.rvGrandEnd;
  }
  const cd = (p.rvSkillCd ??= [0, 0, 0, 0]);
  for (let i = 0; i < cd.length; i++) if (cd[i]! > 0) cd[i]!--;
  if (p.trKey && p.trKey >= 1 && p.trKey <= 4 && !s.pvp && !s.pw) rvSkill(s, p.trKey - 1);
  if ((p.rvCd ?? 0) > 0) p.rvCd = (p.rvCd ?? 0) - 1;
  if (want && (p.rvCd ?? 0) <= 0) {
    p.attackCount++;
    p.rvCd = Math.max(6, Math.round(A.cd / Math.max(0.3, speed)));
    attack(s);
    rvProcs(s);
  }
  rvUnitsTick(s);
  gambit(s);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetRaven(p: P): void {
  for (const k of ["rvCd", "rvRoom", "rvAtkAt", "rvStep", "rvUnits", "rvEvents", "rvSkillCd", "rvGrandEnd", "rvCastleAt", "rvKills", "rvRolls"] as const) delete p[k];
}
