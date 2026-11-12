// 래빗(실베르): 누르면 바라보는 쪽 앞에 토끼 망치를 내리찍어 땅울림(원) 피해 · 밀침
// 전용 패시브: 땅울림 파동·토끼인장·유령 망치·갈라진 땅은 sim/rabbitMarks · 슈퍼 럭키(초거대 망치)는 sim/rabbitUlt
import { srcFn, srcOpt, srcRun } from "./dmgSrc";
import { ENEMIES } from "../enemyDefs";
import { RABBIT_PASSIVES, RABBIT_PERKS as K } from "../itemsRabbit";
import { createRng, deriveSeed } from "../rng";
import { RABBIT_HAMMER as H, RABBIT_ULT as U } from "../weaponsRabbit";
import { KNOCK_RULES as KB } from "./knock";
import { hammerReach, hammerSize, luckMul, megaMul, rbArea as rbArea_ } from "./rabbitKit";
import { marksTick, slamExtras } from "./rabbitMarks";
import { startUlt, ultTick } from "./rabbitUlt";
import { alive, damageEnemyLite } from "./shadowingSpirits";
import type { EnemyState, RunState } from "./types";
import { addEffect, hasPerk, normalize } from "./util";
const rbArea = srcFn("rabbit", () => rbArea_);

type P = RunState["player"];

export { hammerReach, hammerSize, isRabbit } from "./rabbitKit";
/** 망치 피해 배율 (왕망치·쿵쿵쿵) */
const dmgMul = (p: P) => megaMul(p) * (1 + (hasPerk(p, "rbStomp") ? (p.rbStack ?? 0) * K.rbStomp.add : 0));
/** 가진 래빗 전용 아이템 수 (슈퍼 럭키 조건) */
export const rabbitOwned = (p: P) => p.passives.filter((id) => id in RABBIT_PASSIVES).length;
const roomKey = (s: RunState) => s.floor * 1000 + s.roomId;
const roll = (s: RunState, tag: string) => createRng(deriveSeed(s.seed, tag, s.tick, s.player.attackCount)).nextFloat();

/** 맵 밖으로 날려 보낼 수 있는 적 (보스·허수아비·구조물·패왕전 빼고) */
function flyable(e: EnemyState): boolean {
  const d = ENEMIES[e.kind];
  return !d.boss && d.speed > 0 && e.kind !== "dummy" && !e.pw && !e.svBox && !e.noGold;
}

/** 내리찍기: 둘레 적 모두에게 피해 · 밀침 (홈런이면 크게·3배로 밀고 확률로 맵 밖으로) */
export function slam(s: RunState, x: number, y: number, opt: { size?: number; homer?: boolean; origin?: boolean } = {}): EnemyState[] {
  const p = s.player;
  const r = H.slamR * hammerSize(p) * (opt.size ?? 1) * (opt.homer ? K.rbHomerun.size : 1);
  const dmg = p.stats.damage * H.mul * dmgMul(p) * (opt.homer ? K.rbHomerun.mul : 1);
  const hit: EnemyState[] = [];
  for (const e of s.enemies) {
    if (!alive(e) || (e.x - x) ** 2 + (e.y - y) ** 2 > (r + e.r) ** 2) continue;
    const d = normalize(e.x - x, e.y - y) ?? [p.faceX, p.faceY];
    const hp = e.hp;
    damageEnemyLite(s, e, dmg, d[0], d[1]);
    if (e.hp < hp) knockBy(e, d, opt.homer ? K.rbHomerun.knock : 1);
    if (hasPerk(p, "rbHeavy") && createRng(deriveSeed(s.seed, "rbHeavy", s.tick, e.id)).nextFloat() < K.rbHeavy.chance * luckMul(p)) e.stunTicks = Math.max(e.stunTicks ?? 0, K.rbHeavy.stun);
    if (opt.homer && e.hp > 0 && flyable(e) && !s.pvp && !s.pw && createRng(deriveSeed(s.seed, "rbFly", s.tick, e.id)).nextFloat() < K.rbHomerun.fly) {
      e.hp = 0;
      addEffect(s, { kind: "rbFly", x: e.x, y: e.y, dirX: d[0], dirY: d[1], size: e.r, from: e.kind, maxTicks: 48 });
    }
    hit.push(e);
  }
  addEffect(s, { kind: "rbSlam", x, y, dirX: p.faceX, dirY: p.faceY, size: r, style: opt.homer ? 1 : opt.origin ? 0 : 2, maxTicks: 24 });
  return hit;
}

/** 망치 밀침 (보스는 안 밀림): 보통 밀림의 n배 */
function knockBy(e: EnemyState, d: readonly number[], n: number): void {
  if (ENEMIES[e.kind].boss || (e.kind === "charger" && e.phase === "charge")) return;
  const dist = KB.DIST * n * (e.champ ? KB.CHAMP : 1);
  e.kbX = (d[0]! * dist) / KB.TICKS;
  e.kbY = (d[1]! * dist) / KB.TICKS;
  e.kbT = KB.TICKS;
  e.kbCd = KB.GAP;
}

/** 망치 한 번 휘두르기 (공격 버튼) */
function swing(s: RunState, speed: number): void {
  const p = s.player;
  const fever = (p.rbFever ?? 0) > 0 ? K.rbFever.speed : 1;
  const moon = hasPerk(p, "rbMoon") && p.hp < p.stats.maxHp * K.rbMoon.below ? K.rbMoon.speed : 1;
  p.rbCd = Math.max(6, Math.round(H.cd / Math.max(0.3, speed * fever * moon)));
  if (hasPerk(p, "rbStomp") && s.tick - (p.rbLast ?? -9999) > K.rbStomp.keep) p.rbStack = 0;
  p.rbLast = s.tick;
  p.attackCount++;
  p.rbSwings = (p.rbSwings ?? 0) + 1;
  const reach = hammerReach(p);
  const x = p.x + p.faceX * reach;
  const y = p.y + p.faceY * reach;
  const homer = hasPerk(p, "rbHomerun") && roll(s, "rbHomer") < K.rbHomerun.chance * luckMul(p);
  if (homer) {
    p.rbHomers = (p.rbHomers ?? 0) + 1;
    if (hasPerk(p, "rbFever")) p.rbFever = K.rbFever.ticks;
  }
  const hit = srcOpt(s, homer && "rbHomerun", () => slam(s, x, y, { homer, origin: true }));
  if (hasPerk(p, "rbStomp")) p.rbStack = Math.min(K.rbStomp.max, (p.rbStack ?? 0) + 1);
  slamExtras(s, x, y, hit);
  if (hasPerk(p, "rbBell") && roll(s, "rbBell") < K.rbBell.chance * luckMul(p)) srcRun(s, "rbBell", () => {
    rbArea(s, p.x, p.y, K.rbBell.r * hammerSize(p), p.stats.damage * K.rbBell.mul, "rbBell", { stun: K.rbBell.stun });
  });
  if (canUlt(s) && roll(s, "rbLucky") < K.rbLucky.chance * luckMul(p)) srcRun(s, "rbLucky", () => startUlt(s));
}

/** 슈퍼 럭키를 쓸 수 있는지 (전용 아이템 7개 · 쿨타임 · 패왕전·대결 빼고) */
export function canUlt(s: RunState): boolean {
  const p = s.player;
  return hasPerk(p, "rbLucky") && rabbitOwned(p) >= K.rbLucky.need && (p.rbUltCd ?? 0) <= 0 && !p.rbUlt && !s.pvp && !s.pw;
}

/** 틱마다 (래빗 망치를 들었을 때 player에서) */
export function rabbitTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  const key = roomKey(s);
  if (p.rbRoom !== key) {
    p.rbRoom = key;
    p.rbWaves = [];
    p.rbMarks = [];
  }
  if ((p.rbCd ?? 0) > 0) p.rbCd = (p.rbCd ?? 0) - 1;
  if ((p.rbFever ?? 0) > 0) p.rbFever = (p.rbFever ?? 0) - 1;
  if ((p.rbUltCd ?? 0) > 0) p.rbUltCd = (p.rbUltCd ?? 0) - 1;
  if (want && (p.rbCd ?? 0) <= 0) swing(s, speed);
  // 깡총 뛰기: 대시가 끝난 자리에 땅울림
  const dashing = p.dashTicks > 0;
  if (p.rbDash && !dashing && hasPerk(p, "rbHop")) srcRun(s, "rbHop", () => slam(s, p.x, p.y, { size: K.rbHop.size }));
  p.rbDash = dashing;
  marksTick(s);
  srcRun(s, "rbLucky", () => ultTick(s));
}

/** 받는 피해 배율 (폭신한 솜털) */
export const rabbitTaken = (p: P) => (hasPerk(p, "rbFluff") ? K.rbFluff.taken : 1);

/** 슈퍼 럭키 느린 동안: 적이 이번 틱을 쉬는지 (보스는 네 틱 중 한 틱만 움직임) */
export function rabbitSlowed(s: RunState, boss: boolean): boolean {
  const u = s.player.rbUlt;
  if (!u || u.t < U.enter || u.t >= U.enter + U.slow) return false;
  return !boss || s.tick % 4 !== 0;
}

/** 연습장 등에서 다시 시작할 때 */
export function resetRabbit(p: P): void {
  for (const k of ["rbCd", "rbSwings", "rbStack", "rbLast", "rbDash", "rbWaves", "rbMarks", "rbRoom", "rbFever", "rbUltCd", "rbUlt", "rbFrozen", "rbHomers"] as const) delete p[k];
}
