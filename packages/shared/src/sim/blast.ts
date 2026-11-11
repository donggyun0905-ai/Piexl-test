// 블래스트(새벽의 성흔, 폭멸의 탄환): 누르고 있으면 산탄총 (탄창 5발 · 5발마다 확정 치명타 · 한 발씩 장전 · 대시 슬로우모션·파란 탄은 sim/blastMag). 초근접일수록 세고 크게 밀침 · 초근접 처치는 폭멸(몸이 터져 둘레 피해)
// 맞힐수록 성흔(달빛의 힘)이 차고 가득 차면 달빛 각성(sim/stigma): 둘레 달빛 폭발 · 더 멀리·넓게·세게·빠르게 + 모든 공격에 달빛 상태이상(sim/moonlight). 수치 weaponsBlast.BLAST · 아이템 itemsBlast
import { srcRun } from "./dmgSrc";
import { TICK_RATE } from "../constants";
import { BLAST_PERKS as K } from "../itemsBlast";
import { BLAST as B } from "../weaponsBlast";
import { STIGMA } from "../weaponsDawn";
import { healPlayer } from "./combat";
import { inCircle, inCone, isBoss, strike, stun } from "./s2Kit";
import { addStigma, awaken, isAwake, stigmaTick } from "./stigma";
import { hasShell, reload, slowTick, useShell } from "./blastMag";
import { ignite } from "./status";
import type { EnemyState, RunState } from "./types";
import { addEffect, hasPerk } from "./util";

/** 성흔 채움 → 가득 차면 달빛 각성 (둘레 달빛 폭발 · 잠깐 무적) */
function gain(s: RunState, n: number): void {
  const p = s.player;
  if (!addStigma(p, n * (hasPerk(p, "blMoonlight") ? K.blMoonlight.gain : 1))) return;
  awaken(p, STIGMA.awakeTicks + (hasPerk(p, "blFull") ? K.blFull.more : 0));
  const h = hasPerk(p, "blHalo");
  const r = B.awakeBurstR * (h ? K.blHalo.r : 1);
  for (const e of inCircle(s, p.x, p.y, r)) strike(s, e, p.stats.damage * B.awakeBurstMul * (h ? K.blHalo.mul : 1), 12, "radiance");
  p.invulnTicks = Math.max(p.invulnTicks, B.awakeInv);
  addEffect(s, { kind: "blAwakeFx", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r, maxTicks: 40, follow: true });
}

/** 폭멸: 초근접으로 처치한 적이 터짐 (연쇄 폭멸: 터져 처치한 적도 한 번 더) */
function burst(s: RunState, x: number, y: number, depth: number): void {
  const p = s.player;
  const r = B.burstR * (hasPerk(p, "blChain") ? K.blChain.r : 1);
  const dmg = p.stats.damage * B.burstMul * (hasPerk(p, "blGore") ? K.blGore.mul : 1);
  addEffect(s, { kind: "blBurstFx", x, y, dirX: 0, dirY: 0, size: r, maxTicks: 22 });
  for (const e of inCircle(s, x, y, r)) {
    strike(s, e, dmg, 8);
    if (e.hp <= 0 && depth < 1 && hasPerk(p, "blChain")) srcRun(s, "blChain", () => burst(s, e.x, e.y, depth + 1));
  }
}

/** 한 적에게 산탄 (거리 d: 초근접일수록 셈 · crit: 확정 치명타 · blue: 파란 탄은 약함) → 차는 성흔 */
function pellet(s: RunState, e: EnemyState, reach: number, crit: boolean, blue: boolean): number {
  const p = s.player;
  const aw = isAwake(p);
  const d = Math.max(0, Math.hypot(e.x - p.x, e.y - p.y) - e.r);
  const near = d <= B.nearR;
  const t = near ? 0 : Math.min(1, (d - B.nearR) / Math.max(1, reach - B.nearR));
  const m = B.shotMul * (1 - t * (1 - B.farMul)) * (hasPerk(p, "blBuckshot") ? K.blBuckshot.mul : 1) * (near && hasPerk(p, "blSlug") ? K.blSlug.mul : 1) *
    (aw ? B.awakeMul + (hasPerk(p, "blLunar") ? K.blLunar.mul : 0) : 1) * (isBoss(e) && hasPerk(p, "blSilver") ? K.blSilver.mul : 1) * (blue ? B.blueMul : 1);
  const dmg = p.stats.damage * m;
  const rc = hasPerk(p, "blRecoil");
  if (crit) p.rmSure = true;
  strike(s, e, dmg, near ? B.nearPush * (rc ? K.blRecoil.push : 1) : B.farPush);
  delete p.rmSure;
  let n = B.gainHit + (near ? B.gainNear : 0);
  if (hasPerk(p, "blDragon")) ignite(e, p.stats.damage * K.blDragon.burn);
  if (near && e.hp > 0) {
    if (hasPerk(p, "blShred")) srcRun(s, "blShred", () => strike(s, e, dmg * K.blShred.mul, 0, "bleed"));
    if (hasPerk(p, "blFlare") && !isBoss(e)) e.slowTicks = Math.max(e.slowTicks ?? 0, K.blFlare.slow);
    if (rc) stun(e, K.blRecoil.stun);
  }
  if (e.hp > 0) return n;
  n += B.gainKill * (hasPerk(p, "blHunter") ? K.blHunter.kill : 1);
  if (aw && hasPerk(p, "blNight")) p.sgAwake = Math.min(p.sgAwakeMax ?? 0, (p.sgAwake ?? 0) + K.blNight.more);
  if (!near) return n;
  burst(s, e.x, e.y, 0);
  if (hasPerk(p, "blBlood")) healPlayer(s, p.stats.maxHp * K.blBlood.heal);
  return n;
}

/** 한 발: 앞 부채꼴 산탄 (각성 중: 더 멀리·넓게·세게, 맞힌 적에게 달빛 상태이상은 sim/moonlight) · 탄창 마지막(critEvery번째) 발은 확정 치명타 · 파란 탄 */
function fire(s: RunState): boolean {
  const p = s.player;
  const { blue, crit } = useShell(p);
  const aw = isAwake(p);
  const reach = B.reach * (aw ? B.awakeReach : 1) * (hasPerk(p, "blChoke") ? K.blChoke.reach : 1);
  const arc = Math.min(aw ? B.awakeArc : B.arcCos, hasPerk(p, "blSpread") ? K.blSpread.arc : 1);
  let n = 0;
  for (const e of inCone(s, reach, arc)) n += pellet(s, e, reach, crit, blue);
  addEffect(s, { kind: "blShotFx", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: reach, arc, style: (aw ? 1 : 0) + (crit ? 2 : 0) + (blue ? 4 : 0), maxTicks: 16, follow: true });
  if (n > 0) gain(s, n);
  return blue;
}

/** 틱마다 (산탄총을 들었을 때 player에서) */
export function blastTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  stigmaTick(p, hasPerk(p, "blRemain") ? K.blRemain.keep : 0);
  const aw = isAwake(p);
  if (aw && s.tick % 20 === 0) addEffect(s, { kind: "blMoonAura", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 26, maxTicks: 20, follow: true });
  slowTick(s);
  reload(s, want);
  if (!want || p.attackCooldown > 0 || p.s2Rush || !hasShell(p)) return;
  const blue = fire(s);
  p.attackCooldown = Math.max(1, Math.round((TICK_RATE / (speed * (aw ? B.awakeSpeed : 1))) * (blue ? B.blueTime : B.shotTime)));
  p.attackCount++;
}

/** 연습장 등에서 다시 시작할 때 */
export function resetBlast(p: RunState["player"]): void {
  for (const k of ["sgGauge", "sgAwake", "sgAwakeMax", "blAmmo", "blShots", "blLoad", "blBlue", "blSlow", "blSlowCd", "blFrozen", "blDash"] as const) delete p[k];
}

export const isBlast = (p: RunState["player"]) => p.characterId === "blast";
