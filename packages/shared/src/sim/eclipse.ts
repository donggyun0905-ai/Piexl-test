// 이클립스(헬리오스): 태양(여자) ↔ 일식(남자). 한 번 누르면 그 모습의 콤보가 저절로 이어짐
// 태양 5연격: 작은 불의 도끼로 직각으로 꺾인 검격을 아주 빠르게 날림 (5타는 여러 갈래)
// 일식 6연 콤보: 내려베기 → 올려베기 → 흑월 회전 → 그림자 돌진 → 초승달 참격 → 일식 낙하(뛰어오른 동안 무적, 거대한 내려찍기 + 블랙홀)
// 게이지가 다 차면 오라에 감싸여(무적) 다른 모습으로 바뀜. 수치는 weaponsEclipse.ECLIPSE, 아이템은 itemsEclipse
import { TICK_RATE } from "../constants";
import { ECLIPSE_PERKS as K } from "../itemsEclipse";
import { ECLIPSE as E } from "../weaponsEclipse";
import { rot } from "./orbit";
import { alive, inCircle, inCone } from "./s2Kit";
import { nightReach } from "./eclipseStats";
import { eclipsePower, eclipseWorld, ecHit, totality, turn } from "./eclipseZone";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, dist2, hasPerk, normalize } from "./util";

export { isEclipse, isNight } from "./eclipseStats";

/** 가까운 적 쪽을 봄 (거리 reach 안) */
function faceNear(s: RunState, reach: number): EnemyState | undefined {
  const p = s.player;
  const e = alive(s)
    .filter((o) => dist2(o, p) <= (reach + o.r) ** 2)
    .sort((a, b) => dist2(a, p) - dist2(b, p) || a.id - b.id)[0];
  const d = e && normalize(e.x - p.x, e.y - p.y);
  if (d) [p.faceX, p.faceY] = d;
  return e;
}

/** 검격 하나 날림 */
function fly(p: PlayerState, dx: number, dy: number, sun: boolean, dmg: number, k: number, size = 1): void {
  const t = sun ? E.cutTicks : E.moonTicks;
  (p.ecCuts ??= []).push({ x: p.x + dx * 4, y: p.y + dy * 4, dx, dy, t, max: t, sp: sun ? E.cutSpeed : E.moonSpeed, w: (sun ? E.cutW : E.moonW) * size, dmg, sun, k, size, hit: [] });
}

/** 태양 연격 하나 (i: 0~4): 직각 검격을 날림 · 5타는 여러 갈래 */
function sunMove(s: RunState, i: number): void {
  const p = s.player;
  faceNear(s, p.stats.range + 50);
  const dmg = eclipsePower(p);
  if (i < 4) {
    fly(p, p.faceX, p.faceY, true, dmg * E.cutMul, i);
    addEffect(s, { kind: "ecSlash", x: p.x, y: p.y - 3, dirX: p.faceX, dirY: p.faceY, size: p.stats.range, maxTicks: 8, width: i });
    return;
  }
  const flare = hasPerk(p, "ecFlare");
  const n = flare ? K.ecFlare.n : E.sunFinN;
  const size = E.sunFinSize * (flare ? K.ecFlare.size : 1);
  for (let j = 0; j < n; j++) {
    const [c, sn] = rot((j - (n - 1) / 2) * E.sunFinSpread);
    const [dx, dy] = turn(p, c, sn);
    fly(p, dx, dy, true, dmg * E.sunFinMul, 4, size);
  }
  addEffect(s, { kind: "ecCross", x: p.x, y: p.y - 3, dirX: p.faceX, dirY: p.faceY, size: p.stats.range * 1.4, maxTicks: 14 });
}

/** 일식 콤보 하나 (i: 0~5) */
function nightMove(s: RunState, i: number): void {
  const p = s.player;
  const reach = nightReach(p);
  faceNear(s, reach + 40);
  const dmg = eclipsePower(p);
  if (i <= 1) {
    for (const e of inCone(s, reach, i ? E.riseArc : E.hewArc)) ecHit(s, e, dmg * E.hewMul, E.push);
    addEffect(s, { kind: "ecHew", x: p.x, y: p.y - 4, dirX: p.faceX, dirY: p.faceY, size: reach, maxTicks: 18, width: i });
  } else if (i === 2) {
    const r = reach * E.spinR;
    for (const e of inCircle(s, p.x, p.y, r)) ecHit(s, e, dmg * E.spinMul, E.push);
    addEffect(s, { kind: "ecSpin", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: 20, follow: true });
  } else if (i === 3) {
    p.ecRush = { t: E.rushTicks, dx: p.faceX, dy: p.faceY, dmg: dmg * E.rushMul, hit: [] };
  } else if (i === 4) {
    fly(p, p.faceX, p.faceY, false, dmg * E.moonMul, 0);
    addEffect(s, { kind: "ecHew", x: p.x, y: p.y - 4, dirX: p.faceX, dirY: p.faceY, size: reach, maxTicks: 16, width: 2 });
  } else {
    p.ecAir = E.jumpTicks;
    addEffect(s, { kind: "ecJump", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 22, maxTicks: 24 });
  }
}

/** 일식 낙하 착지: 거대한 내려찍기 · 가운데 블랙홀 */
function slam(s: RunState): void {
  const p = s.player;
  p.ecSlams = (p.ecSlams ?? 0) + 1;
  const big = hasPerk(p, "ecMoonAxe") ? K.ecMoonAxe.slam : 1;
  const r = E.slamR * big;
  const dmg = eclipsePower(p);
  for (const e of inCircle(s, p.x, p.y, r)) ecHit(s, e, dmg * E.slamMul, E.slamPush);
  const hz = hasPerk(p, "ecHorizon") ? K.ecHorizon.size : 1;
  const t = Math.round(E.holeTicks * hz);
  (p.ecHoles ??= []).push({ x: p.x, y: p.y, t, max: t, r: E.holeR * hz, pull: E.holePull * hz, dmg: dmg * E.holeMul });
  addEffect(s, { kind: "ecSlam", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: 40 });
}

/** 게이지가 다 찼으면 바뀌기 시작 (콤보·돌진·공중이 아닐 때) */
function startShift(s: RunState): boolean {
  const p = s.player;
  if ((p.ecGauge ?? 0) < E.gaugeMax || p.ecCombo || p.ecRush || p.ecAir) return false;
  p.ecShift = E.shiftTicks;
  p.invulnTicks = Math.max(p.invulnTicks, 2);
  addEffect(s, { kind: "ecShift", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 26, maxTicks: E.shiftTicks, follow: true, width: p.ecNight ? 0 : 1 });
  return true;
}

/** 바뀌는 중: 무적 · 끝나면 다른 모습 · 게이지 0 */
function shiftTick(s: RunState): void {
  const p = s.player;
  p.invulnTicks = Math.max(p.invulnTicks, 2);
  if (--p.ecShift! > 0) return;
  delete p.ecShift;
  p.ecNight = !p.ecNight;
  p.ecGauge = 0;
  p.ecShifts = (p.ecShifts ?? 0) + 1;
  if (hasPerk(p, "ecCrown")) p.ecCrownT = K.ecCrown.ticks;
  // 일식이 되면 보라 빛이 아래로 꺼지고, 태양이 되면 노란 빛이 위로 꺼짐
  addEffect(s, { kind: "ecShiftEnd", x: p.x, y: p.y, dirX: 0, dirY: p.ecNight ? 1 : -1, size: 26, maxTicks: 26, follow: true, width: p.ecNight ? 1 : 0 });
  totality(s);
  p.attackCooldown = 0;
}

/** 틱마다 (태양의 도끼를 들었을 때 player에서) */
export function eclipseTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  if (p.ecCrownT) p.ecCrownT--;
  eclipseWorld(s);
  if (p.ecShift) return shiftTick(s);
  if (startShift(s)) return;
  const c = p.ecCombo;
  const night = !!p.ecNight;
  if (c) {
    if (p.ecAir) {
      if (--p.ecAir > 0) {
        p.invulnTicks = Math.max(p.invulnTicks, 2);
        return;
      }
      delete p.ecAir;
      slam(s);
    } else if (p.ecRush || --c.t > 0) return;
    const last = night ? 6 : 5;
    if (c.i >= last) {
      delete p.ecCombo;
      p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
      return;
    }
    (night ? nightMove : sunMove)(s, c.i++);
    c.t = night ? E.nightGap : E.sunGap;
    return;
  }
  if (!want || p.attackCooldown > 0) return;
  p.attackCount++;
  p.ecCombo = { i: 1, t: night ? E.nightGap : E.sunGap };
  (night ? nightMove : sunMove)(s, 0);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetEclipse(p: PlayerState): void {
  for (const k of ["ecNight", "ecGauge", "ecShift", "ecCombo", "ecAir", "ecCuts", "ecHoles", "ecRush", "ecCrownT", "ecSlams", "ecShifts"] as const) delete p[k];
}
