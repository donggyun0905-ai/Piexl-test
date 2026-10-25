// 거인(기계팔 탱커): 평소 공격은 무기마다 아주 느린 범위(heavy) · 빠르지만 아주 약한 연타(jab) · 약한 리벳(rivet)
// 맞은 피해가 기계팔 에너지로 쌓이고, 다 차면 다음 공격이 무기마다 다른 강타. 받는 피해는 기본으로 조금 덜 받음. 무기 표는 weaponsTitan
import { TICK_RATE } from "../constants";
import { ENEMIES } from "../enemyDefs";
import { TITAN_PERKS as K } from "../itemsTitan";
import { TITAN, type SmashKind } from "../weaponsTitan";
import { bullet } from "./abandonedMoves";
import { blastAt, healPlayer } from "./combat";
import { burst, sweep, thrustLine } from "./generalMoves";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, dist2, hasPerk, keepInRoom, normalize, roomGrid, weaponOf } from "./util";

/** 강타에 필요한 에너지 */
export const energyNeed = (p: PlayerState) => TITAN.energyMax * (hasPerk(p, "bigCapacitor") ? K.bigCapacitor.need : 1);

/** 에너지 더하기 (최대까지) */
function charge(p: PlayerState, v: number): void {
  p.tEnergy = Math.min(energyNeed(p), (p.tEnergy ?? 0) + v);
}

/** 맞은 뒤 (combat.damagePlayer): 에너지 쌓기 · 반격 코일 */
export function titanHurt(s: RunState, taken: number): void {
  const p = s.player;
  if (p.characterId !== "titan" || taken <= 0) return;
  charge(p, taken * TITAN.gain * (weaponOf(p).smash === "overload" ? TITAN.coreGain : 1));
  if (hasPerk(p, "counterCoil") && (p.tCoil ?? 0) <= 0) {
    p.tCoil = K.counterCoil.cd;
    blastAt(s, p.x, p.y, K.counterCoil.radius, p.stats.damage * K.counterCoil.mul, { still: true });
  }
}

/** 대시 버튼 = 패링 (짧게 막는 자세). 대시 시간(틱)을 돌려줌 (움직이지 않으니 0) */
export function titanParry(s: RunState): number {
  const p = s.player;
  p.tParry = TITAN.parryTicks;
  return 0;
}

/** 패링 중에 맞으면 피해 없이 그 피해를 그대로 에너지로 (combat.damagePlayer 처음). 막았으면 true */
export function titanParried(s: RunState, dmg: number): boolean {
  const p = s.player;
  if (p.characterId !== "titan" || (p.tParry ?? 0) <= 0) return false;
  charge(p, dmg * TITAN.gain * (weaponOf(p).smash === "overload" ? TITAN.coreGain : 1));
  p.invulnTicks = Math.max(p.invulnTicks, TITAN.parryInvuln);
  p.tParry = 0;
  // 패링 소리 (갓이터 패링과 같은 '챙!')
  p.parryHits = (p.parryHits ?? 0) + 1;
  addEffect(s, { kind: "titanParry", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: 14, maxTicks: 16 });
  return true;
}

/** 받는 피해 배율: 기본 탱커 · 강화 장갑판 · 방벽 팔 막기 · 자이로 안정기 */
export function titanTaken(p: PlayerState): number {
  if (p.characterId !== "titan") return 1;
  return TITAN.taken * (hasPerk(p, "armorPlate") ? K.armorPlate.taken : 1) * ((p.tBrace ?? 0) > 0 ? TITAN.braceTaken : 1) * ((p.tGyro ?? 0) > 0 ? K.gyroStabilizer.taken : 1);
}

/** 맞힌 적 수를 세며 범위 공격 (arc -1 = 둘레) */
function area(s: RunState, dmg: number, radius: number, arc: number, stun = 0, show = true): number {
  const p = s.player;
  const hit = s.enemies.filter((e) => {
    const dx = e.x - p.x;
    const dy = e.y - p.y;
    const d = Math.hypot(dx, dy);
    return e.hp > 0 && d <= radius + e.r && (arc <= -1 || d <= p.r + e.r || (dx * p.faceX + dy * p.faceY) / d >= arc);
  });
  sweep(s, dmg, radius, arc, show);
  if (stun > 0) for (const e of hit) stunOf(e, stun);
  return hit.length;
}

function stunOf(e: EnemyState, ticks: number): void {
  if (e.kind === "dummy") return;
  e.stunTicks = Math.max(e.stunTicks ?? 0, ENEMIES[e.kind].boss ? ticks / 2 : ticks);
}

/** 둘레 적을 (x,y) 쪽으로 끌어옴 (보스 빼고) */
function pull(s: RunState, x: number, y: number, radius: number, dist: number): void {
  for (const e of s.enemies) {
    if (e.hp <= 0 || ENEMIES[e.kind].boss || e.kind === "dummy" || dist2(e, { x, y }) > radius * radius) continue;
    const d = normalize(x - e.x, y - e.y);
    if (!d) continue;
    const step = Math.min(dist, Math.sqrt(dist2(e, { x, y })) - e.r - 4);
    if (step <= 0) continue;
    e.x += d[0] * step;
    e.y += d[1] * step;
    keepInRoom(e, roomGrid(s));
  }
}

/** 평소 공격 */
function normal(s: RunState, dmg: number): void {
  const p = s.player;
  const w = weaponOf(p);
  const r = p.stats.range * (w.titan === "heavy" && hasPerk(p, "hydraulicJoint") ? K.hydraulicJoint.area : 1);
  let hits = 0;
  if (w.titan === "rivet") {
    bullet(s, p.x, p.y, p.faceX, p.faceY, dmg);
    hits = 1;
  } else if (w.smash === "drill") {
    // 드릴 팔: 앞으로 짧게 뚫는 드릴 (휘두르기 자국 대신 회전하는 드릴)
    hits = area(s, dmg, r, w.arcCos ?? 0.4, 0, false);
    addEffect(s, { kind: "titanDrill", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: 10 });
  } else if (w.titan === "jab") hits = area(s, dmg, r, w.arcCos ?? 0.4);
  else {
    if (w.smash === "magnet") pull(s, p.x, p.y, r * 1.6, TITAN.pull);
    if (w.smash === "bulwark") p.tBrace = TITAN.braceTicks;
    area(s, dmg, r, w.arcCos ?? -1, hasPerk(p, "aftershock") ? K.aftershock.stun : 0);
    addEffect(s, { kind: "titanSlam", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: 16 });
  }
  if (w.titan !== "heavy" && hasPerk(p, "chargeKnuckle") && hits > 0) charge(p, K.chargeKnuckle.energy);
}

/** 기계팔 강타 */
function smash(s: RunState, kind: SmashKind, dmg: number): void {
  const p = s.player;
  const r = p.stats.range;
  const f: [number, number] = [p.faceX, p.faceY];
  switch (kind) {
    case "quake":
      area(s, dmg, r * 1.8, -1, TITAN.stun / 2);
      break;
    case "piston":
      thrustLine(s, dmg, r * 5, 10);
      break;
    case "ball":
      area(s, dmg, r * 1.5, -1);
      blastAt(s, p.x, p.y, r * 1.5, 0, { push: 24, still: false });
      break;
    case "drill":
      // 커다란 드릴과 함께 앞으로 크게 돌진하며 여러 번 깎음 (돌진 중 무적)
      p.tDrill = TITAN.drillTicks;
      p.tDrillDmg = dmg / (TITAN.drillTicks / TITAN.drillEvery);
      p.dashDirX = f[0];
      p.dashDirY = f[1];
      p.dashTicks = TITAN.drillTicks;
      p.dashHitIds = [];
      break;
    case "anvil":
      area(s, dmg, r * 2, -1, TITAN.stun * 2);
      break;
    case "rivets":
      for (let i = 0; i < 24; i++) bullet(s, p.x, p.y, Math.cos((i / 24) * Math.PI * 2), Math.sin((i / 24) * Math.PI * 2), dmg / 8, 0, { pierce: 2 });
      break;
    case "magnet":
      pull(s, p.x, p.y, r * 3.5, r * 3);
      area(s, dmg, r * 1.4, -1, TITAN.stun / 2);
      break;
    case "bulwark":
      for (let i = 1; i <= 3; i++) burst(s, p.x + f[0] * r * i * 0.8, p.y + f[1] * r * i * 0.8, r * 0.7, dmg / 2);
      break;
    case "steam":
      for (let i = 0; i < TITAN.steamPulses; i++) s.pendingBlasts.push({ tick: s.tick + 6 + i * TITAN.steamEvery, x: p.x, y: p.y, radius: r * 2.6, damage: dmg / 4 });
      addEffect(s, { kind: "catnip", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r * 2.6, maxTicks: 6 + TITAN.steamPulses * TITAN.steamEvery });
      break;
    case "overload":
      for (let i = 0; i < 3; i++) s.pendingBlasts.push({ tick: s.tick + 1 + i * 18, x: p.x, y: p.y, radius: r * (1.2 + i * 0.6), damage: dmg });
      break;
  }
  addEffect(s, { kind: "titanSmash", x: p.x, y: p.y, dirX: f[0], dirY: f[1], size: r * 1.8, maxTicks: 24 });
  p.tSwing = 20;
  if (hasPerk(p, "scrapRepair")) healPlayer(s, p.stats.maxHp * K.scrapRepair.heal);
  if (hasPerk(p, "gyroStabilizer")) p.tGyro = K.gyroStabilizer.ticks;
}

/** 틱마다 (거인 무기를 들었을 때 player에서) */
export function titanTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  for (const k of ["tBrace", "tGyro", "tCoil", "tSwing", "tParry"] as const) if ((p[k] ?? 0) > 0) p[k] = (p[k] ?? 0) - 1;
  if ((p.tDrill ?? 0) > 0) {
    p.tDrill = (p.tDrill ?? 0) - 1;
    if (p.tDrill % TITAN.drillEvery === 0) thrustLine(s, p.tDrillDmg ?? 0, p.stats.range * 2.2, 14);
  }
  if (!want || p.attackCooldown > 0) return;
  const w = weaponOf(p);
  p.attackCount++;
  if ((p.tEnergy ?? 0) >= energyNeed(p) && w.smash) {
    p.tEnergy = 0;
    smash(s, w.smash, p.stats.damage * (w.smashMul ?? 6) * (hasPerk(p, "overdriveCircuit") ? K.overdriveCircuit.damage : 1));
    p.attackCooldown = Math.max(1, Math.round(TICK_RATE / Math.min(speed, 1)));
    return;
  }
  normal(s, p.stats.damage);
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
}

/** 처음으로 (연습장 초기화) */
export function resetTitan(p: PlayerState): void {
  p.tEnergy = p.tBrace = p.tGyro = p.tCoil = p.tSwing = p.tParry = p.tDrill = p.tDrillDmg = undefined;
}
