// 라이더(테라코어, 시즌 2): 오토바이를 탄 폭주족. 빠를수록 피해가 커지고, 달린 거리만큼 게이지가 차서 가득 차면 둘레 펄스
// 무기는 기계 망치·펄스건·암살 단검 등 10가지 모양. 수치는 weaponsRider.RIDER, 아이템은 itemsRider
import { TICK_RATE } from "../constants";
import { RIDER_PERKS as K } from "../itemsRider";
import { RIDER as R, type RideStyle } from "../weaponsRider";
import { blastAt, damageEnemy, healPlayer, ignite } from "./combat";
import { fan, inCircle, inCone, inLine, shoot, startRush, rushTick, stun, strike } from "./s2Kit";
import type { PlayerState, RunState } from "./types";
import { addEffect, hasPerk, weaponOf } from "./util";

const styleOf = (p: PlayerState): RideStyle => weaponOf(p).ride ?? { move: "smash", reach: 30 };
/** 이번 틱에 움직인 거리 */
const moved = (p: PlayerState) => Math.hypot(p.x - p.prevX, p.y - p.prevY);

/** 빠를수록 붙는 피해 배율 (지금 움직인 거리 + 이동 속도 능력치) */
export function riderSpeedMul(p: PlayerState): number {
  if (p.characterId !== "rider") return 1;
  const gear = hasPerk(p, "rdGear") ? K.rdGear.mul : 1;
  return 1 + (moved(p) * R.speedMul + Math.max(0, p.stats.moveSpeed - 1) * R.statMul) * gear;
}

/** 슬립스트림: 달리는 동안 받는 피해 (classTaken) */
export const riderTaken = (p: PlayerState) => (p.characterId === "rider" && hasPerk(p, "rdSlip") && moved(p) > 0.3 ? K.rdSlip.taken : 1);

/** 펄스: 둘레를 크게 터뜨림 (mul: 피해 배율) */
function pulse(s: RunState, mul: number): void {
  const p = s.player;
  const r = R.pulseR * (hasPerk(p, "rdShock") ? K.rdShock.r : 1);
  blastAt(s, p.x, p.y, r, p.stats.damage * R.pulseMul * mul * riderSpeedMul(p), { push: R.pulsePush, still: true });
  addEffect(s, { kind: "rdPulse", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r, maxTicks: 22 });
  if (hasPerk(p, "rdRepair")) healPlayer(s, K.rdRepair.heal);
}

/** 달린 거리 → 게이지 · 들이받기 · 불꽃 자국 */
function drive(s: RunState): void {
  const p = s.player;
  const d = moved(p);
  p.rdGauge = (p.rdGauge ?? 0) + d * (hasPerk(p, "rdTank") ? K.rdTank.mul : 1);
  if (p.rdGauge >= R.gaugeMax) {
    p.rdGauge = 0;
    pulse(s, 1);
    if (hasPerk(p, "rdDouble")) p.rdEcho = K.rdDouble.delay;
  }
  if ((p.rdEcho ?? 0) > 0 && --p.rdEcho! === 0) pulse(s, K.rdDouble.mul);
  if (p.dashTicks > 0 && hasPerk(p, "rdDrift")) p.rdDrift = true;
  // 들이받기: 달리며 닿은 적
  if (hasPerk(p, "rdRam") && d > 0.3 && (p.rdRamCd = (p.rdRamCd ?? 0) - 1) <= 0) {
    const hit = inCircle(s, p.x, p.y, p.r + 3);
    for (const e of hit) strike(s, e, p.stats.damage * K.rdRam.mul * riderSpeedMul(p), 6);
    if (hit.length) p.rdRamCd = K.rdRam.every;
  }
  // 불꽃 자국 (불꽃 바퀴 아이템 · 화염 배기)
  const burn = hasPerk(p, "rdBurn") || styleOf(p).move === "flame";
  if (burn && d > 0.3 && (p.rdTrail = (p.rdTrail ?? 0) + d) >= K.rdBurn.every) {
    p.rdTrail = 0;
    (p.rdFire ??= []).push({ x: p.x, y: p.y + 3, t: R.fireTicks, dmg: p.stats.damage * R.fireMul });
  }
  if (p.rdFire?.length) {
    for (const f of p.rdFire) {
      if (--f.t % 30 !== 0) continue;
      // 점화는 0.5초마다 넣은 값의 25% → 불꽃 자국 피해가 그대로 들어가게 4배로
      for (const e of inCircle(s, f.x, f.y, R.fireR)) ignite(e, f.dmg * 4);
    }
    p.rdFire = p.rdFire.filter((f) => f.t > 0).slice(-40);
  }
}

/** 한 번 공격 */
function attack(s: RunState): void {
  const p = s.player;
  const st = styleOf(p);
  let dmg = p.stats.damage * riderSpeedMul(p);
  if (p.rdDrift) {
    dmg *= K.rdDrift.mul;
    p.rdDrift = false;
  }
  const fx = (kind: "rdSmash" | "rdStab" | "rdSpin" | "rdFlame", size: number) => addEffect(s, { kind, x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size, maxTicks: 12 });
  switch (st.move) {
    case "smash":
      for (const e of inCone(s, st.reach, 0.3)) strike(s, e, dmg, st.push ?? 0);
      fx("rdSmash", st.reach);
      break;
    case "stab":
      for (const e of inLine(s, st.reach, 5).slice(0, 2)) strike(s, e, dmg);
      fx("rdStab", st.reach);
      break;
    case "lance":
      for (const e of inLine(s, st.reach, 5)) {
        strike(s, e, dmg, 4);
        stun(e, st.stun ?? 0);
      }
      fx("rdStab", st.reach);
      break;
    case "spin":
      for (const e of inCircle(s, p.x, p.y, st.reach)) strike(s, e, dmg, st.push ?? 0);
      fx("rdSpin", st.reach);
      break;
    case "flame":
      for (const e of inCone(s, st.reach, 0.6)) {
        damageEnemy(s, e, dmg, p.faceX, p.faceY, false);
        ignite(e, dmg);
      }
      fx("rdFlame", st.reach);
      break;
    case "shot":
      shoot(s, 0, { damage: dmg, spirit: "rdBolt", range: st.reach });
      break;
    case "spread":
      fan(s, st.n ?? 5, 0.14, { damage: dmg, spirit: "rdBolt", range: st.reach });
      break;
    case "rail":
      for (const e of inLine(s, st.reach, 4)) strike(s, e, dmg);
      addEffect(s, { kind: "adBeam", x: p.x, y: p.y - 3, dirX: p.faceX, dirY: p.faceY, size: 3, toX: p.x + p.faceX * st.reach, toY: p.y - 3 + p.faceY * st.reach, maxTicks: 12, tint: "#6ae8ff" });
      break;
    case "wheel":
      s.projectiles.push({ id: s.nextId++, fromPlayer: true, x: p.x, y: p.y, prevX: p.x, prevY: p.y, r: 5, vx: p.faceX * 3.4, vy: p.faceY * 3.4, damage: dmg, ticksLeft: Math.ceil(st.reach / 3.4), pierce: 99, hitIds: [], back: true, span: Math.ceil(st.reach / 3.4), spirit: "rdWheel" });
      break;
    case "nitro":
      startRush(p, { t: R.nitroTicks, dx: p.faceX, dy: p.faceY, step: R.nitroStep, dmg, push: st.push ?? 0, invuln: true, tint: "#3a6aff" });
      break;
  }
}

/** 틱마다 (라이더 무기를 들었을 때 player에서) */
export function riderTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  drive(s);
  if (p.s2Rush) rushTick(s);
  if (!want || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  attack(s);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetRider(p: PlayerState): void {
  for (const k of ["rdGauge", "rdEcho", "rdFire", "rdTrail", "rdDrift"] as const) delete p[k];
}

/** 게이지 0~1 (화면용) */
export const riderGauge = (p: PlayerState) => Math.min(1, (p.rdGauge ?? 0) / R.gaugeMax);
