// 이클립스(헬리오스): 태양(여자) ↔ 일식(남자). 한 번 누르면 그 모습의 콤보가 저절로 이어짐
// 태양 5연격: 작은 불의 도끼로 휘두르는 불꽃 궤적 3번(위→아래·아래→위·옆으로 크게) → X자 엇베기 → 내리찍어 태양 낙인
// 일식 6연 콤보: 내려베기 → 올려베기 → 흑월 회전 → 그림자 돌진 → 초승달 참격 → 일식 낙하(뛰어오른 동안 무적, 거대한 내려찍기 + 블랙홀)
// 게이지가 다 차면 오라에 감싸여(무적) 다른 모습으로 바뀜. 수치는 weaponsEclipse.ECLIPSE, 아이템은 itemsEclipse
import { TICK_RATE } from "../constants";
import { ECLIPSE_PERKS as K } from "../itemsEclipse";
import { ECLIPSE as E } from "../weaponsEclipse";
import { alive, inCircle, inCone, onSegment } from "./s2Kit";
import { SUN_BURST, sunCutPaths } from "./eclipseCuts";
import { nightReach, sunReach } from "./eclipseStats";
import { comboStep } from "./comboStep";
import { eclipsePower, eclipseWorld, ecHit, totality } from "./eclipseZone";
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

/** 일식 초승달 참격 하나 날림 */
function fly(p: PlayerState, dx: number, dy: number, dmg: number): void {
  const t = E.moonTicks;
  (p.ecCuts ??= []).push({ x: p.x + dx * 4, y: p.y + dy * 4, dx, dy, t, max: t, sp: E.moonSpeed, w: E.moonW, dmg, sun: false, k: 0, size: 1, hit: [] });
}

/** 태양 연격 하나 (i: 0~4): 불꽃 도끼 궤적(1 위→아래 · 2 아래→위 · 3 옆으로 크게) · 4 X자 엇베기 · 5 내리찍어 태양 낙인 (더 아픔) */
function sunMove(s: RunState, i: number): void {
  const p = s.player;
  faceNear(s, sunReach(p) + 30);
  const dmg = eclipsePower(p);
  const reach = sunReach(p);
  // 그려진 날(불꽃 도끼 궤적 · 4·5타는 찌르기)을 따라 맞힘 · 5타는 더 길게 깊게 찌름 (더 아픔)
  const fin = i >= 4;
  const r = reach * (fin ? E.sunFinSize * (hasPerk(p, "ecFlare") ? K.ecFlare.size : 1) : 1);
  const paths = sunCutPaths(p.x, p.y, p.faceX, p.faceY, r, i);
  const w = r * E.cutW;
  const hit = new Set<number>();
  // 몸 바로 앞 반원(도끼를 휘두른 자리)도 같이 벰: 날 사이에 붙은 적이 빠지지 않게 · 5타는 내리찍은 자리에 태양 낙인이 터짐
  const path = paths[0]!;
  const tip = path[path.length - 1]!;
  const targets = [...inCone(s, reach * E.sunNear, 0), ...(SUN_BURST[i] ? inCircle(s, tip[0], tip[1], r * SUN_BURST[i]!) : [])];
  for (const q of paths) for (let k = 1; k < q.length; k++) targets.push(...onSegment(s, q[k - 1]![0], q[k - 1]![1], q[k]![0], q[k]![1], w));
  for (const e of targets) {
    if (hit.has(e.id)) continue;
    hit.add(e.id);
    ecHit(s, e, dmg * (fin ? E.sunFinMul : E.cutMul), fin ? 3 : 1);
  }
  addEffect(s, { kind: "ecSlash", x: p.x, y: p.y - 3, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: fin ? 15 : 13, width: i });
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
    p.ecRush = { t: E.rushTicks, dx: p.faceX, dy: p.faceY, dmg: dmg * E.rushMul, hit: [], sx: p.x, sy: p.y };
  } else if (i === 4) {
    fly(p, p.faceX, p.faceY, dmg * E.moonMul);
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

/** 게이지가 다 찼으면 바뀌기 시작 (동작 중·돌진·공중이 아닐 때) */
function startShift(s: RunState): boolean {
  const p = s.player;
  if ((p.ecGauge ?? 0) < E.gaugeMax || (p.ecCombo?.t ?? 0) > 0 || p.ecRush || p.ecAir) return false;
  delete p.ecCombo;
  p.ecShift = E.shiftTicks;
  p.invulnTicks = Math.max(p.invulnTicks, 2);
  addEffect(s, { kind: "ecShift", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 26, maxTicks: E.shiftTicks, width: p.ecNight ? 0 : 1 });
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
  addEffect(s, { kind: "ecShiftEnd", x: p.x, y: p.y, dirX: 0, dirY: p.ecNight ? 1 : -1, size: 26, maxTicks: 26, width: p.ecNight ? 1 : 0 });
  totality(s);
  p.attackCooldown = 0;
}

/** 콤보 끝: 공격 속도만큼 쉼 */
function endCombo(p: PlayerState, speed: number, rest: boolean): void {
  delete p.ecCombo;
  if (rest) p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
}

/** 틱마다 (태양의 도끼를 들었을 때 player에서). 누를 때마다 한 동작 (누르고 있으면 이어짐) */
export function eclipseTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  const press = want && !p.ecHeld;
  p.ecHeld = want;
  if (p.ecCrownT) p.ecCrownT--;
  eclipseWorld(s);
  if (p.ecShift) return shiftTick(s);
  if (p.ecAir) {
    if (--p.ecAir > 0) {
      p.invulnTicks = Math.max(p.invulnTicks, 2);
      return;
    }
    delete p.ecAir;
    slam(s);
    return endCombo(p, speed, true);
  }
  if (p.ecRush || startShift(s)) return;
  const night = !!p.ecNight;
  const run = (c: { i: number; t: number }) => {
    (night ? nightMove : sunMove)(s, c.i++);
    c.t = night ? E.nightGap : E.sunGap;
  };
  const c = p.ecCombo;
  if (c) {
    const step = comboStep(c, want, press, E.idle);
    if (step === "drop") endCombo(p, speed, false);
    else if (step === "go") {
      run(c);
      if (c.i >= (night ? 6 : 5) && !p.ecAir) endCombo(p, speed, true);
    }
    return;
  }
  if (!want || p.attackCooldown > 0) return;
  p.attackCount++;
  p.ecCombo = { i: 0, t: 0, idle: 0 };
  run(p.ecCombo);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetEclipse(p: PlayerState): void {
  for (const k of ["ecNight", "ecGauge", "ecShift", "ecCombo", "ecAir", "ecCuts", "ecHoles", "ecRush", "ecCrownT", "ecSlams", "ecShifts", "ecHeld"] as const) delete p[k];
}
