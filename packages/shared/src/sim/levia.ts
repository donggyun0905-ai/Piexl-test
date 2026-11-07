// 리바이어(탈라시아): 바다의 창 4단 콤보 + 확률로 같이 나오는 고래 (sim/leviaWhale)
// 1타 앞 휘두르기(고래: 날개로 더 넓게 쓸기) → 2타 찌르기(고래: 꼬리로 앞을 크게 휩쓸기) → 3타 한 바퀴 + 고래 대돌격(고래: 몸을 감아 한 바퀴 더 넓게)
// → (0.5초 만에 바로) 4타 앞으로 돌진 + 부채꼴 충격파(고래: 같이 돌진). 멈추면 1타부터 · 고래가 안 나올수록 다음엔 잘 나옴
import { TICK_RATE } from "../constants";
import { LEVIA_PERKS as K } from "../itemsLevia";
import { LEVIA as L } from "../weaponsLevia";
import { healPlayer } from "./combat";
import { gemOf, lvHit, rollWhale, whaleDmg, whaleSize } from "./leviaKit";
import { breach, launchWhale, onWhale, whaleCharge, whaleTick } from "./leviaWhale";
import { fan, inCircle, inCone, roomKey, rushTick, startRush, stun } from "./s2Kit";
import type { PlayerState, RunState } from "./types";
import { addEffect, hasPerk, reachOf } from "./util";

/** 1타: 창으로 앞을 크게 휘두름 · 고래가 날개로 더 넓게 같이 쓸어 줌 */
function sweep(s: RunState, whale: boolean): void {
  const p = s.player;
  const reach = L.sweepReach * reachOf(p) * (hasPerk(p, "lvCrest") ? K.lvCrest.reach : 1);
  for (const e of inCone(s, reach, L.sweepArc)) lvHit(s, e, p.stats.damage * L.sweepMul, L.sweepPush);
  addEffect(s, { kind: "lvSwing", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: reach, maxTicks: 14, follow: true });
  if (hasPerk(p, "lvSpray")) {
    const k = K.lvSpray;
    fan(s, k.n, k.spread, { damage: p.stats.damage * k.mul, spirit: "lvJet", r: 4, range: k.range, pierce: 2 });
  }
  if (!whale) return;
  const fin = L.finReach * reachOf(p) * whaleSize(p);
  for (const e of inCone(s, fin, L.finArc)) lvHit(s, e, whaleDmg(p, L.finMul), L.finPush, "tide", true);
  addEffect(s, { kind: "lvFin", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: fin, maxTicks: 22, follow: true });
}

/** 2타: 창으로 앞을 길게 찌름 · 고래가 꼬리로 앞을 크게 휩쓸어 줌 */
function thrust(s: RunState, whale: boolean): void {
  const p = s.player;
  const reach = L.thrustReach * reachOf(p);
  for (const e of inCone(s, reach, L.thrustArc)) lvHit(s, e, p.stats.damage * L.thrustMul, L.thrustPush);
  addEffect(s, { kind: "lvThrust", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: reach, maxTicks: 12, follow: true });
  if (!whale) return;
  const r = L.tailReach * reachOf(p) * whaleSize(p);
  for (const e of inCone(s, r, L.tailArc)) lvHit(s, e, whaleDmg(p, L.tailMul), L.tailPush, "tide", true);
  addEffect(s, { kind: "lvTailSweep", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: 22, follow: true, tint: String(s.tick % 2 ? 1 : -1) });
}

/** 3타: 한 바퀴 휘두르고 앞으로 고래 대돌격 · 고래가 몸을 감아 더 넓게 한 바퀴 */
function spin(s: RunState, whale: boolean): void {
  const p = s.player;
  const sp = hasPerk(p, "lvSpiral");
  const reach = L.spinReach * reachOf(p) * (sp ? K.lvSpiral.reach : 1);
  for (const e of inCone(s, reach, -1)) lvHit(s, e, p.stats.damage * L.spinMul * (sp ? K.lvSpiral.mul : 1), 6);
  addEffect(s, { kind: "lvSpin", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: reach, maxTicks: 14, follow: true });
  whaleCharge(s);
  if (!whale) return;
  const r = L.orbitReach * reachOf(p) * whaleSize(p);
  for (const e of inCircle(s, p.x, p.y, r)) lvHit(s, e, whaleDmg(p, L.orbitMul), 10, "tide", true);
  addEffect(s, { kind: "lvOrbit", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: 24, follow: true });
}

/** 4타: 앞으로 돌진 (끝나면 충격파) · 고래가 옆에서 같이 돌진 */
function rush(s: RunState, whale: boolean): void {
  const p = s.player;
  const far = (gemOf(p).gem === "gale" ? L.galeRush : 1) * (hasPerk(p, "lvSurf") ? K.lvSurf.rush : 1);
  const step = L.rushStep * far;
  startRush(p, { t: L.rushTicks, dx: p.faceX, dy: p.faceY, step, dmg: p.stats.damage * L.rushMul, push: 6, invuln: hasPerk(p, "lvSurf"), tint: "#6ae8ff", w: L.rushW });
  p.lvRush = whale ? 2 : 1;
  if (whale) launchWhale(s, p.faceX, p.faceY, { t: L.rushTicks + 3, sp: step, r: L.rushWhaleR * whaleSize(p), dmg: whaleDmg(p, L.rushWhaleMul) });
}

/** 돌진이 끝난 자리: 앞으로 부채꼴 충격파 (심해석: 더 세고 기절 · 쇄파: 넓고 셈) · 리바이어던의 눈: 고래 도약 */
function quake(s: RunState): void {
  const p = s.player;
  const abyss = gemOf(p).gem === "abyss";
  const br = hasPerk(p, "lvBreaker");
  const arc = br ? K.lvBreaker.arc : L.quakeArc;
  const mul = L.quakeMul * (abyss ? L.abyssMul : 1) * (br ? K.lvBreaker.mul : 1);
  const reach = L.quakeReach * reachOf(p);
  for (const e of inCone(s, reach, arc)) {
    lvHit(s, e, p.stats.damage * mul, L.quakePush);
    if (abyss) stun(e, L.abyssStun);
  }
  addEffect(s, { kind: "lvQuake", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: reach, maxTicks: 22, arc, tint: abyss ? "abyss" : undefined });
  if (gemOf(p).gem === "king") breach(s, p.x + p.faceX * 34 * reachOf(p), p.y + p.faceY * 34 * reachOf(p));
  if (hasPerk(p, "lvSalt")) healPlayer(s, p.stats.maxHp * K.lvSalt.heal);
}

/** 방이 바뀌면 콤보·고래·웅덩이를 비움 */
function roomCheck(s: RunState): void {
  const p = s.player;
  const key = roomKey(s);
  if (p.lvRoom === key) return;
  p.lvRoom = key;
  resetLevia(p, true);
}

/** 대시가 끝나면 닻 없는 배: 다음 공격이 곧바로 4타 */
function dashCheck(p: PlayerState): void {
  const dashing = p.dashTicks > 0;
  if (!dashing && p.lvDashing && hasPerk(p, "lvAnchorless")) p.lvFree = K.lvAnchorless.ticks;
  p.lvDashing = dashing;
  if (p.lvFree) p.lvFree--;
}

/** 틱마다 (바다의 창을 들었을 때 player에서) */
export function leviaTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  roomCheck(s);
  dashCheck(p);
  whaleTick(s);
  if (p.lvGap) p.lvGap--;
  if (p.s2Rush) {
    if (rushTick(s) && p.lvRush) {
      delete p.lvRush;
      quake(s);
    }
    return;
  }
  if (!want || p.attackCooldown > 0) return;
  let step = (p.lvGap ?? 0) > 0 ? (p.lvStep ?? 0) : 0;
  if ((p.lvFree ?? 0) > 0) {
    step = 3;
    p.lvFree = 0;
  }
  // 4타 뒤는 조금 쉼 · 3타(회전) 뒤 4타(돌진)는 0.5초 만에 바로 이어짐
  const base = Math.max(1, Math.round((TICK_RATE / speed) * (step === 3 ? L.restMul : 1)));
  const cd = step === 2 ? Math.min(base, Math.round(TICK_RATE * L.spinToRush)) : base;
  p.attackCooldown = cd;
  p.attackCount++;
  const whale = rollWhale(s);
  if (step === 0) sweep(s, whale);
  else if (step === 1) thrust(s, whale);
  else if (step === 2) spin(s, whale);
  else rush(s, whale);
  if (whale) onWhale(s);
  p.lvStep = (step + 1) % 4;
  p.lvGap = L.comboGap + cd;
}

/** 연습장 등에서 다시 시작할 때 (keepRoom: 방 이름·흰 고래는 남김) */
export function resetLevia(p: PlayerState, keepRoom = false): void {
  for (const k of ["lvStep", "lvGap", "lvMiss", "lvRush", "lvWhales", "lvPools", "lvHaste", "lvDashing", "lvFree"] as const) delete p[k];
  if (p.s2Rush && p.characterId === "levia") delete p.s2Rush;
  if (!keepRoom) {
    delete p.lvRoom;
    delete p.lvWhite;
  }
}

export { isLevia, leviaStep } from "./leviaKit";
