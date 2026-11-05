// 펜리르(비르디아, 영물): 선왕의 대검을 문 늙은 백랑. 고정 5연 콤보
// 누를 때마다 한 기술씩 (누르고 있으면 이어짐) · 1 물어 베기(앞 부채꼴) → 2 되베기(넓은 부채꼴) → 3 지면 검기(바닥을 그으며 나아가 뚫음) → 4 난도(한 자리를 사방에서 빠르게 벰)
// → 5 천랑 낙인(뛰어오른 동안 무적, 내려찍는 순간 풀리고 사방으로 검기). 수치는 weaponsFenrir.FENRIR, 아이템은 itemsFenrir·fenrirStats
import { TICK_RATE } from "../constants";
import { FENRIR_PERKS as K } from "../itemsFenrir";
import { FENRIR as F } from "../weaponsFenrir";
import { rot } from "./orbit";
import { comboStep } from "./comboStep";
import { alive, inCircle, inCone, onSegment, strike, stun } from "./s2Kit";
import type { FenrirWave } from "./fenrirTypes";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, dist2, hasPerk, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

export { isFenrir } from "./fenrirStats";
const TAU = 6.283185307179586;

/** 지금 공격력 (늙은 늑대의 지혜: 피한 뒤 잠시 +) */
export const fenrirPower = (p: PlayerState) => p.stats.damage * ((p.fnWise ?? 0) > 0 ? 1 + K.fnWisdom.dmg : 1);

/** 맞힘: 벼린 송곳니(예리함이 걸린 적 +) · 쓰러뜨리면 사냥 본능 */
function hit(s: RunState, e: EnemyState, dmg: number, push = 0): void {
  const p = s.player;
  const was = e.hp > 0;
  const fang = hasPerk(p, "fnFang") && (e.sharpT ?? 0) > s.tick ? 1 + K.fnFang.dmg : 1;
  strike(s, e, dmg * fang, push);
  if (!was || e.hp > 0 || !hasPerk(p, "fnHunt")) return;
  p.fnHuntT = K.fnHunt.ticks;
  if (!p.fnCombo) p.attackCooldown = 0;
  addEffect(s, { kind: "fnHunt", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: 16, maxTicks: 20 });
}

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

/** 검기 하나 내보냄 */
function launch(p: PlayerState, dx: number, dy: number, big: boolean, dmg: number): void {
  const reach = !big && hasPerk(p, "fnStar") ? K.fnStar.reach : 1;
  // 착지 검기는 방 끝까지 날아감 (끝에 닿으면 사라짐)
  const t = big ? Math.round(F.waveTicks * reach) : F.starTicks;
  const w: FenrirWave = { x: p.x, y: p.y, dx, dy, t, max: t, sp: big ? F.waveSpeed : F.starSpeed, w: big ? F.waveW : F.starW, dmg, big, hit: [] };
  (p.fnWaves ??= []).push(w);
}

/** 1·2타: 앞 부채꼴 베기 (back: 반대로 휘둘러 더 넓게) */
function slash(s: RunState, back: boolean): void {
  const p = s.player;
  faceNear(s, p.stats.range + 30);
  const reach = p.stats.range * (back ? F.backReach : 1);
  for (const e of inCone(s, reach, back ? F.backArc : F.biteArc)) hit(s, e, fenrirPower(p) * (back ? F.backMul : F.biteMul), F.push);
  addEffect(s, { kind: "fnBite", x: p.x, y: p.y - 3, dirX: p.faceX, dirY: p.faceY, size: reach, maxTicks: 14, width: back ? 1 : 0 });
}

/** 4타 난도: 가까운 적 자리(없으면 앞쪽)에 베기 예약 */
function flurry(s: RunState): void {
  const p = s.player;
  const e = faceNear(s, F.cutReach);
  const x = e ? e.x : p.x + p.faceX * F.cutAhead;
  const y = e ? e.y : p.y + p.faceY * F.cutAhead;
  const moon = hasPerk(p, "fnMoon");
  const r = F.cutR * (moon ? K.fnMoon.r : 1);
  p.fnFlurry = { x, y, left: moon ? K.fnMoon.n : F.cutN, t: 0, dmg: fenrirPower(p) * F.cutMul, r, i: 0 };
  addEffect(s, { kind: "fnRing", x, y, dirX: 0, dirY: 0, size: r, maxTicks: 30 });
}

/** 난도 한 틱: 사이마다 한 번 벰 (각도는 황금각으로 돌려 사방에서) */
function flurryTick(s: RunState): void {
  const fl = s.player.fnFlurry;
  if (!fl) return;
  if (fl.t-- > 0) return;
  fl.t = F.cutEvery - 1;
  for (const e of inCircle(s, fl.x, fl.y, fl.r)) hit(s, e, fl.dmg);
  const [dx, dy] = rot(fl.i * 2.399963);
  addEffect(s, { kind: "fnCut", x: fl.x, y: fl.y, dirX: dx, dirY: dy, size: fl.r * 1.3, maxTicks: 12, width: fl.i % 2 });
  fl.i++;
  if (--fl.left <= 0) delete s.player.fnFlurry;
}

/** 5타 착지: 무적이 풀리고 둘레를 내려찍음 · 사방으로 검기 · (울부짖음) 기절 */
function land(s: RunState): void {
  const p = s.player;
  p.fnFalls = (p.fnFalls ?? 0) + 1;
  const howl = hasPerk(p, "fnHowl");
  const dmg = fenrirPower(p);
  for (const e of inCircle(s, p.x, p.y, F.landR)) hit(s, e, dmg * F.landMul, F.landPush);
  if (howl) for (const e of inCircle(s, p.x, p.y, K.fnHowl.r)) stun(e, K.fnHowl.stun);
  const n = hasPerk(p, "fnStar") ? K.fnStar.n : F.starN;
  for (let i = 0; i < n; i++) {
    const [c, sn] = rot((i / n) * TAU);
    launch(p, p.faceX * c - p.faceY * sn, p.faceX * sn + p.faceY * c, false, dmg * F.starMul);
  }
  addEffect(s, { kind: "fnLand", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: F.landR, maxTicks: 34, width: howl ? 1 : 0 });
}

/** 검기들이 나아감: 지나온 줄의 적을 한 번씩 맞힘 · 바닥 자국 · (대지 가르기) 균열 */
function waveTick(s: RunState): void {
  const p = s.player;
  if (!p.fnWaves?.length) return;
  const rift = hasPerk(p, "fnRift");
  for (const w of p.fnWaves) {
    const ax = w.x;
    const ay = w.y;
    w.x += w.dx * w.sp;
    w.y += w.dy * w.sp;
    w.t--;
    for (const e of onSegment(s, ax, ay, w.x, w.y, w.w)) {
      if (w.hit.includes(e.id)) continue;
      w.hit.push(e.id);
      hit(s, e, w.dmg, w.big ? 5 : 2);
    }
    const age = w.max - w.t;
    if (age % F.scarEvery === 0) addEffect(s, { kind: "fnScar", x: w.x, y: w.y, dirX: w.dx, dirY: w.dy, size: w.w, maxTicks: w.big ? 26 : 16, width: w.big ? 1 : 0 });
    if (rift && w.big && age % K.fnRift.every === 0) (p.fnCracks ??= []).push({ x: w.x, y: w.y, t: K.fnRift.ticks });
  }
  p.fnWaves = p.fnWaves.filter((w) => w.t > 0 && w.x > ROOM_MIN_X && w.x < ROOM_MAX_X && w.y > ROOM_MIN_Y && w.y < ROOM_MAX_Y);
}

/** 대지 가르기 균열: 사이마다 위에 선 적을 벰 */
function crackTick(s: RunState): void {
  const p = s.player;
  if (!p.fnCracks?.length) return;
  for (const c of p.fnCracks) {
    if (--c.t % K.fnRift.gap !== 0) continue;
    for (const e of inCircle(s, c.x, c.y, K.fnRift.r)) hit(s, e, fenrirPower(p) * K.fnRift.mul);
  }
  p.fnCracks = p.fnCracks.filter((c) => c.t > 0);
}

/** 콤보 다음 기술 (i: 0~4) */
function move(s: RunState, i: number): number {
  const p = s.player;
  if (i === 0) slash(s, false);
  else if (i === 1) slash(s, true);
  else if (i === 2) {
    faceNear(s, 160);
    launch(p, p.faceX, p.faceY, true, fenrirPower(p) * F.waveMul);
    addEffect(s, { kind: "fnWaveGo", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: F.waveW * 2, maxTicks: 16 });
  } else if (i === 3) flurry(s);
  else {
    p.fnAir = F.jumpTicks;
    addEffect(s, { kind: "fnJump", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 20, maxTicks: 22 });
  }
  return [F.gap1, F.gap2, F.gap3, F.gap4, 0][i]!;
}

/** 틱마다 (선왕의 대검을 들었을 때 player에서). 누를 때마다 한 기술 (누르고 있으면 이어짐) */
export function fenrirTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  const press = want && !p.fnHeld;
  p.fnHeld = want;
  if (p.fnWise) p.fnWise--;
  if (p.fnHuntT) p.fnHuntT--;
  waveTick(s);
  crackTick(s);
  flurryTick(s);
  const rest = () => {
    delete p.fnCombo;
    p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  };
  // 천랑 낙인: 뛰어오른 동안 무적, 내려찍는 틱에 풀리고 콤보 끝
  if (p.fnAir) {
    if (--p.fnAir > 0) {
      p.invulnTicks = Math.max(p.invulnTicks, 2);
      return;
    }
    delete p.fnAir;
    land(s);
    return rest();
  }
  const c = p.fnCombo;
  if (c) {
    if (p.fnFlurry) {
      if (press) c.q = true;
      return;
    }
    const step = comboStep(c, want, press, F.idle);
    if (step === "drop") delete p.fnCombo;
    else if (step === "go") c.t = move(s, c.i++);
    return;
  }
  if (!want || p.attackCooldown > 0) return;
  p.attackCount++;
  p.fnCombo = { i: 1, t: move(s, 0), idle: 0 };
}

/** 연습장 등에서 다시 시작할 때 */
export function resetFenrir(p: PlayerState): void {
  for (const k of ["fnCombo", "fnAir", "fnWaves", "fnFlurry", "fnCracks", "fnWise", "fnHuntT", "fnHaloFloor", "fnFalls", "fnHeld"] as const) delete p[k];
}
