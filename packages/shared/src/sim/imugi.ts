// 이무기: 찌르기 + 휘두르기를 한 번에 · 맞힐 때마다 콤보 (72 오라, 108 용이 됨: 용이 맵을 지나가고 8초 동안 몸이 더 강해짐, 20부터 다시) · 여의주는 방 안 모든 적에게 번개
import { TICK_RATE } from "../constants";
import { ENEMIES } from "../enemyDefs";
import { IMUGI_PERKS as K } from "../itemsImugi";
import { DRAGON_COLORS, IMUGI, type DragonArt } from "../weaponsImugi";
import { damageEnemy, healPlayer } from "./combat";
import { dragonArt, dragonDots, pearlStrike } from "./imugiArts";
import { recalcStats } from "./items";
import { raiseShield } from "./imugiMods";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, hasPerk, ROOM_MAX_Y, ROOM_MIN_Y, weaponOf } from "./util";
import { pctHp } from "./pctHp";

/** 이번 공격 피해: 공격력 + 토룡이면 토룡으로 채운 보호막의 50% (오라·용 보호막은 빼고) */
function power(p: PlayerState): number {
  return p.stats.damage + (weaponOf(p).dragon === "earth" ? (p.imEarth ?? 0) * IMUGI.earth.perShield : 0);
}

/** 틱마다 (이무기 무기를 들었을 때 player에서). want = 공격 키 */
export function imugiTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  // 보호막이 깎이면 토룡·비늘 방패로 다시 채울 수 있는 만큼도 줄어듦
  if (p.imEarth) p.imEarth = Math.min(p.imEarth, p.shieldPts ?? 0);
  if (p.imGuard) p.imGuard = Math.min(p.imGuard, p.shieldPts ?? 0);
  const dmg = power(p);
  dragonDots(s, dmg);
  ultTick(s);
  if ((p.imForm ?? 0) > 0 && --p.imForm! === 0) recalcStats(s);
  if (hasPerk(p, "dragonBlood") && ((p.imCombo ?? 0) >= IMUGI.aura || (p.imForm ?? 0) > 0) && s.tick % K.dragonBlood.every === 0) healPlayer(s, K.dragonBlood.heal);
  if (!want || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  const art = weaponOf(p).dragon ?? "plain";
  if (art === "pearl") return pearlStrike(s, dmg);
  const hit = stabAndSwing(s, dmg, art);
  if (hit.length === 0) return;
  p.imHits = (p.imHits ?? 0) + 1;
  for (const e of hit) dragonArt(s, e, art, dmg);
  addCombo(s, 1 + (hasPerk(p, "ascension") && p.imHits % 2 === 0 ? 1 : 0));
}

/** 찌르기(앞으로 긴 선) + 휘두르기(앞쪽 부채꼴)를 한 번에. 둘 다에 맞아도 한 번만 맞음. 맞은 적 */
function stabAndSwing(s: RunState, dmg: number, art: DragonArt): EnemyState[] {
  const p = s.player;
  const lance = hasPerk(p, "dragonLance");
  const len = p.stats.range * (lance ? K.dragonLance.thrust : 1);
  const radius = p.stats.range * IMUGI.swingReach * (lance ? K.dragonLance.swing : 1);
  const arc = weaponOf(p).arcCos ?? 0.3;
  const hit: EnemyState[] = [];
  for (const e of [...s.enemies]) {
    if (e.hp <= 0) continue;
    const dx = e.x - p.x;
    const dy = e.y - p.y;
    const t = dx * p.faceX + dy * p.faceY;
    const side = Math.abs(dx * p.faceY - dy * p.faceX);
    const d = Math.hypot(dx, dy);
    const stab = t >= -e.r && t <= len + e.r && side <= IMUGI.width + e.r;
    const swing = d <= radius + e.r && (d < 1 || t / d >= arc);
    if (!stab && !swing) continue;
    damageEnemy(s, e, dmg, p.faceX, p.faceY);
    hit.push(e);
  }
  const tint = DRAGON_COLORS[art];
  addEffect(s, { kind: "thrust", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: len, toX: p.x + p.faceX * len, toY: p.y + p.faceY * len, width: IMUGI.width, maxTicks: 9, tint });
  addEffect(s, { kind: "swing", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: radius, maxTicks: 9, width: 3, tint });
  return hit;
}

/** 콤보 더하기: 10마다 비늘 방패 · 72 오라(보호막 한 번, 기운이 차오름) · 108 용이 됨 */
export function addCombo(s: RunState, n: number): void {
  const p = s.player;
  if (p.characterId !== "imugi" || weaponOf(p).dragon === "pearl") return;
  const before = p.imCombo ?? 0;
  const after = before + n;
  p.imCombo = after;
  if (hasPerk(p, "scaleGuard") && Math.floor(after / K.scaleGuard.every) > Math.floor(before / K.scaleGuard.every)) {
    p.imGuard = (p.imGuard ?? 0) + raiseShield(p, K.scaleGuard.shield, K.scaleGuard.max);
  }
  // 패왕전은 맵을 지나가는 용 없음 (용의 기운 오라까지만)
  if (after >= IMUGI.ult && !s.pvp) return callDragon(s);
  if (before < IMUGI.aura && after >= IMUGI.aura) {
    // 오라 보호막은 20으로 채움 (쌓이지 않음)
    if (!p.imAura) raiseShield(p, IMUGI.auraShield, IMUGI.auraShield);
    p.imAura = true;
    recalcStats(s);
    addEffect(s, { kind: "imRise", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 24, maxTicks: 40, tint: DRAGON_COLORS[weaponOf(p).dragon ?? "plain"] });
  }
}

/** 콤보 108: 용이 됨 — 용이 맵을 지나가고 8초 동안 몸이 강해짐(보호막), 콤보는 20(여운이면 40)부터 */
function callDragon(s: RunState): void {
  const p = s.player;
  const art = weaponOf(p).dragon ?? "plain";
  const mul = IMUGI.ultMul * (hasPerk(p, "thunderCry") ? K.thunderCry.damage : 1);
  p.imUlt = { y: ROOM_MAX_Y + IMUGI.ultMargin, color: DRAGON_COLORS[art], hit: [], passes: hasPerk(p, "longBreath") ? 1 : 0, mul };
  p.imCombo = hasPerk(p, "lingering") ? K.lingering.restart : IMUGI.restart;
  if (p.imCombo < IMUGI.aura) p.imAura = false;
  p.imForm = IMUGI.form.ticks;
  p.imWakes = (p.imWakes ?? 0) + 1;
  // 용이 된 몸 보호막은 40으로 채움 (쌓이지 않음)
  raiseShield(p, IMUGI.form.shield, IMUGI.form.shield);
  recalcStats(s);
  addEffect(s, { kind: "imAwaken", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 60, maxTicks: 50, tint: p.imUlt.color });
}

/** 부른 용: 맵 아래에서 위로 지나가며 머리가 지나간 적을 공격력 450% + 적 최대 체력 20%(보스 1/5)로 (쌍룡이면 한 번 더, 두 번째는 절반) */
function ultTick(s: RunState): void {
  const p = s.player;
  const u = p.imUlt;
  if (!u) return;
  // 예전 저장(브레스 용)이면 그냥 끝냄
  if (u.y === undefined) return void (p.imUlt = undefined);
  u.y -= IMUGI.ultSpeed;
  for (const e of [...s.enemies]) {
    if (e.hp <= 0 || u.hit.includes(e.id) || e.y < u.y) continue;
    u.hit.push(e.id);
    // 공격력 450% + 적 최대 체력의 20% (보스는 1/5 기준, 연습장 허수아비는 체력 1000인 보스처럼) · 천둥 울음·쌍룡 두 번째는 둘 다 같은 배율
    const base = e.kind === "dummy" ? 1000 / IMUGI.ultBossDiv : ENEMIES[e.kind].boss ? pctHp(e) / IMUGI.ultBossDiv : pctHp(e);
    damageEnemy(s, e, (p.stats.damage * IMUGI.ultMul + base * IMUGI.ultHp) * (u.mul / IMUGI.ultMul), 0, -1);
  }
  if (u.y > ROOM_MIN_Y - IMUGI.ultMargin) return;
  if (u.passes > 0) p.imUlt = { ...u, y: ROOM_MAX_Y + IMUGI.ultMargin, hit: [], passes: u.passes - 1, mul: u.mul * K.longBreath.second };
  else p.imUlt = undefined;
}

/** 운룡: 대시하면 콤보 (player에서 대시를 시작할 때) */
export function imugiDash(s: RunState): void {
  if (hasPerk(s.player, "cloudRide")) addCombo(s, K.cloudRide.combo);
}

/** 연습장 초기화 */
export function resetImugi(p: PlayerState): void {
  p.imCombo = p.imAura = p.imUlt = p.imForm = p.imWakes = p.imHits = p.imBolts = p.imEarth = p.imGuard = undefined;
}
