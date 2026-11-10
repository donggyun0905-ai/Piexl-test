// 블루 플레임 공용 도우미: 세 겹 범위 · 청염 상태이상(걸기·틱 피해) · 맞힘(청염 색 숫자 · 성흔) · 성흔 → 열화상 각성 · 곧 들어갈 공격(감옥·기둥·화살·화살비·거대한 화살) 떨어뜨리기
import { BLUE_FLAME_PERKS as K } from "../itemsBlueFlame";
import { BLUE_FLAME as F } from "../weaponsBlueFlame";
import { STIGMA } from "../weaponsDawn";
import { alive, inCircle, root, strike, stun } from "./s2Kit";
import { dotDamage } from "./status";
import { addStigma, awaken } from "./stigma";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, hasPerk, reachOf } from "./util";
import type { BzStrike } from "./bzTypes";

export const isBlueFlame = (p: PlayerState) => p.characterId === "blueFlame";

/** 세 겹 범위 반지름 (안쪽 · 가운데 · 바깥 = 사거리, 사거리 증가 따름) */
export function bzRings(p: PlayerState): [number, number, number] {
  const r3 = p.stats.range * (hasPerk(p, "bzWide") ? K.bzWide.r : 1);
  return [r3 * (hasPerk(p, "bzInner") ? K.bzInner.ring : F.ring1), r3 * F.ring2, r3];
}

/** 청염 걸기: 지속 다시 · 한 번 피해는 센 쪽 */
function ignite(p: PlayerState, e: EnemyState): void {
  if (e.hp <= 0) return;
  e.bzFlameT = Math.round(F.flameTicks * (hasPerk(p, "bzLinger") ? K.bzLinger.ticks : 1));
  e.bzFlameDmg = Math.max(e.bzFlameDmg ?? 0, p.stats.damage * F.flameMul * (hasPerk(p, "bzSoul") ? K.bzSoul.mul : 1));
}

/** 틱마다: 청염 걸린 적 0.5초마다 피해 · 시간이 다 되면 꺼짐 */
export function flameTick(s: RunState): void {
  for (const e of s.enemies) {
    if (!(e.bzFlameT ?? 0)) continue;
    if (s.tick % F.flameEvery === 0) dotDamage(s, e, "blueflame", e.bzFlameDmg ?? 0);
    if (--e.bzFlameT! > 0) continue;
    delete e.bzFlameT;
    delete e.bzFlameDmg;
  }
}

/** 성흔 채움 → 가득 차면 열화상 각성 (몸이 사라지고 무적 · 화면 아래 거대한 활) */
export function bzGain(s: RunState, n: number): void {
  const p = s.player;
  if (n <= 0 || p.bzUlt || !addStigma(p, n * (hasPerk(p, "bzSense") ? K.bzSense.gain : 1))) return;
  awaken(p, STIGMA.awakeTicks + (hasPerk(p, "bzEndless") ? K.bzEndless.more : 0));
  p.bzUlt = true;
  addEffect(s, { kind: "bzAwakeFx", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 60, maxTicks: 40, follow: true });
}

/** 청염 맞힘: 청염 색 피해 숫자 · 청염 걸기 · 성흔 */
export function bzHit(s: RunState, e: EnemyState, mul: number, push = 0): void {
  const p = s.player;
  strike(s, e, p.stats.damage * mul, push, "blueflame");
  ignite(p, e);
  bzGain(s, F.gainHit + (e.hp > 0 ? 0 : F.gainKill));
}

/** 곧 들어갈 공격 하나 */
export function addStrike(p: PlayerState, b: Omit<BzStrike, "T">): void {
  (p.bzStrikes ??= []).push({ ...b, T: b.t });
}

/** 떨어짐: 종류마다 둘레 적에게 청염 피해 (감옥은 가둠 · 기둥은 밀침 · 화살은 노린 적) */
function land(s: RunState, b: BzStrike): void {
  const p = s.player;
  if (b.k === 2) {
    const e = alive(s).find((f) => f.id === b.tg && (f.x - b.x) ** 2 + (f.y - b.y) ** 2 <= (f.r + b.r) ** 2) ?? inCircle(s, b.x, b.y, b.r)[0];
    if (e) bzHit(s, e, b.mul);
    if (hasPerk(p, "bzEmber")) for (const f of inCircle(s, b.x, b.y, K.bzEmber.r * reachOf(p))) if (f !== e) bzHit(s, f, b.mul * K.bzEmber.mul);
    addEffect(s, { kind: "bzArrowFx", x: b.x, y: b.y, dirX: Math.sign(b.x - b.x0), dirY: Math.sign(b.y - b.y0), size: 10, maxTicks: 18 });
    return;
  }
  const push = b.k === 1 && hasPerk(p, "bzKnock") ? K.bzKnock.push : b.k === 4 ? 8 : 0;
  for (const e of inCircle(s, b.x, b.y, b.r)) {
    bzHit(s, e, b.mul, push);
    if (b.k !== 0) continue;
    root(e, F.prisonRoot + (hasPerk(p, "bzCage") ? K.bzCage.more : 0));
    if (hasPerk(p, "bzSeal")) stun(e, K.bzSeal.stun);
  }
  if (b.k === 3) addEffect(s, { kind: "bzRainFx", x: b.x, y: b.y, dirX: Math.sign(b.x - b.x0), dirY: 0, size: b.r, maxTicks: 16 });
  if (b.k === 4) addEffect(s, { kind: "bzBombFx", x: b.x, y: b.y, dirX: 0, dirY: 0, size: b.r, maxTicks: 32 });
}

/** 곧 들어갈 공격 한 틱: 화살은 노린 적을 따라감 · 시간이 되면 떨어짐 */
export function strikesTick(s: RunState): void {
  const p = s.player;
  const list = p.bzStrikes;
  if (!list) return;
  for (const b of list) {
    if (b.k === 2 && b.tg !== undefined) {
      const e = alive(s).find((f) => f.id === b.tg);
      if (e) [b.x, b.y] = [e.x, e.y];
    }
    if (--b.t <= 0) land(s, b);
  }
  p.bzStrikes = list.filter((b) => b.t > 0);
  if (p.bzStrikes.length === 0) delete p.bzStrikes;
}
