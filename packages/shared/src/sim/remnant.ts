// 잔영(아스칼론, 시즌 2): 그림자 속 암살자. 짧은 단검 내려찍기 · 모든 상태이상 면역 · 치명타 45%/250%(characters)
// 대시(무적) 중에 적 공격이 닿으면(대시가 아니었으면 맞았을 공격) 회피 성공 → 슬로우모션(적·적 탄만 느려짐)
// 슬로우모션 안에 직접 클릭하면(자동 공격과 따로, 입력 skill) 확정 치명타 연속 베기(큰 검격, 여러 적) → 끝나면 슬로우모션 끝
// 수치는 weaponsRemnant.REMNANT, 아이템은 itemsRemnant
import { srcRun } from "./dmgSrc";
import { TICK_RATE } from "../constants";
import { REMNANT_PERKS as K } from "../itemsRemnant";
import { REMNANT as R, type PhantomStyle } from "../weaponsRemnant";
import { nearest } from "./brawlMoves";
import { healPlayer } from "./combat";
import { applyBleed, updateBleed } from "./gunExtras";
import { inCircle, inCone, poison, shoot, strike, stun } from "./s2Kit";
import { restoreShots, slowShots } from "./slowShots";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, hasPerk, keepInRoom, normalize, roomGrid, weaponOf } from "./util";

const styleOf = (p: PlayerState): PhantomStyle => weaponOf(p).phantom ?? { reach: 20, arc: 0.4, slow: 90, flurryMul: 1.6, flurryReach: 46 };
const isRemnant = (p: PlayerState) => p.characterId === "remnant";

/** 상태이상 면역 (앞으로 나올 상태이상도 이것으로 막음) */
export const statusImmune = (p: PlayerState) => isRemnant(p) || !!p.boonImmune;

/** 몸에 걸린 상태이상을 바로 걷어냄: 어둠 · 거울(이동 반대) · 깜깜함 */
function cleanse(p: PlayerState): void {
  p.darkStacks = 0;
  p.darkTicks = 0;
  p.mirrorTicks = 0;
  p.blindTicks = 0;
}

/** 슬로우모션 중: 적이 이번 틱을 쉬는지 (punk.timeSlowed가 같이 봄) */
export function remnantSlowed(s: RunState, boss: boolean): boolean {
  if (!isRemnant(s.player) || (s.player.rmSlow ?? 0) <= 0) return false;
  return s.tick % (boss ? R.bossEvery : R.slowEvery) !== 0;
}

/** 대시 중에 적 공격이 닿음 (combat.damagePlayer가 부름, 지형·상태이상 피해는 빼고): 회피 성공 → 슬로우모션 */
export function remnantDodge(s: RunState): void {
  const p = s.player;
  if (!isRemnant(p) || s.pvp || s.pw || (p.rmSlow ?? 0) > 0 || p.rmFlurry) return;
  p.rmSlow = styleOf(p).slow + (hasPerk(p, "rmStep") ? K.rmStep.ticks : 0);
  p.rmDodges = (p.rmDodges ?? 0) + 1;
  if (hasPerk(p, "rmVanish")) healPlayer(s, K.rmVanish.heal);
  if (hasPerk(p, "rmShroud")) for (const e of inCircle(s, p.x, p.y, K.rmShroud.reach)) stun(e, K.rmShroud.ticks);
  addEffect(s, { kind: "rmDodge", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: 30, maxTicks: 24, follow: true });
}

/** 대시로 적 공격을 피했으면 true (잔영이면 회피 슬로우모션). 탄·휘두르기·보스 기술 모두 여기로 */
export function dashDodged(s: RunState): boolean {
  if (s.player.dashTicks <= 0) return false;
  remnantDodge(s);
  return true;
}

/** 슬로우모션 끝: 적 탄을 원래 빠르기로 */
function endSlow(s: RunState): void {
  const p = s.player;
  restoreShots(s, p.rmFrozen, R.shotSlow);
  p.rmSlow = 0;
  delete p.rmFrozen;
  delete p.rmFlurry;
}

function cut(s: RunState, e: EnemyState, dmg: number, sure: boolean): void {
  const p = s.player;
  const st = styleOf(p);
  let d = dmg;
  if (hasPerk(p, "rmExecute") && e.hp <= e.maxHp * K.rmExecute.hp) d *= K.rmExecute.mul;
  if (sure) p.rmSure = true;
  strike(s, e, d);
  delete p.rmSure;
  if (st.venom) poison(e, dmg * st.venom, R.venomTicks);
  if (hasPerk(p, "rmBlood") && e.hp > 0) applyBleed(e);
}

/** 노리는 적 쪽으로 돌기 */
function faceTarget(s: RunState, range: number): EnemyState | null {
  const p = s.player;
  const e = nearest(s, range);
  const d = e && normalize(e.x - p.x, e.y - p.y);
  if (d) [p.faceX, p.faceY] = d;
  return e;
}

/** 기본 공격: 단검 내려찍기 (짧음) */
function stab(s: RunState): void {
  const p = s.player;
  const st = styleOf(p);
  faceTarget(s, p.stats.range);
  const hits = st.hits ?? 1;
  for (let h = 0; h < hits; h++) for (const e of inCone(s, st.reach, st.arc)) cut(s, e, p.stats.damage, false);
  addEffect(s, { kind: "rmStab", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: st.reach, maxTicks: 10, width: hits });
  if (st.throws) for (let i = 0; i < st.throws; i++) shoot(s, (i - (st.throws - 1) / 2) * R.throwSpread, { damage: p.stats.damage * R.throwMul, spirit: "rmKnife", r: R.throwR, range: p.stats.range });
}

/** 연속 베기 한 번: 큰 검격 (확정 치명타, 마지막은 몸 둘레 모두) · 베기마다 노리는 적 쪽으로 조금 내디딤 */
function flurryCut(s: RunState, i: number, n: number): void {
  const p = s.player;
  const st = styleOf(p);
  const e = faceTarget(s, st.flurryReach * 2);
  if (e && Math.hypot(e.x - p.x, e.y - p.y) > e.r + p.r + R.cutStep) {
    p.x += p.faceX * R.cutStep;
    p.y += p.faceY * R.cutStep;
    keepInRoom(p, roomGrid(s));
    p.prevX = p.x;
    p.prevY = p.y;
  }
  const last = i === n - 1;
  const round = st.spin || last;
  const reach = st.flurryReach * (last ? 1.15 : 1);
  const mul = st.flurryMul + (hasPerk(p, "rmBackstab") ? K.rmBackstab.add : 0);
  const kills = s.kills;
  for (const t of round ? inCircle(s, p.x, p.y, reach) : inCone(s, reach, -0.3)) cut(s, t, p.stats.damage * mul, true);
  if (hasPerk(p, "rmFrenzy") && s.kills > kills) p.dashCooldown = 0;
  addEffect(s, { kind: "rmFlurry", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: reach, maxTicks: 14, width: round ? 0 : i % 2 ? -1 : 1 });
  if (last && st.burst) {
    const r = st.flurryReach * st.burst;
    for (const t of inCircle(s, p.x, p.y, r)) cut(s, t, p.stats.damage * st.flurryMul, true);
    addEffect(s, { kind: "rmEclipse", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r, maxTicks: 22 });
  }
}

/** 틱마다: 상태이상 걷기 · 슬로우모션(적 탄 느리게, 클릭하면 연속 베기) */
function update(s: RunState): void {
  const p = s.player;
  cleanse(p);
  if (hasPerk(p, "rmBlood")) srcRun(s, "rmBlood", () => updateBleed(s));
  const click = (p.trKey ?? 0) > 0 && !s.pvp && !s.pw;
  if (p.rmFlurry) {
    p.invulnTicks = Math.max(p.invulnTicks, 2);
    p.rmFrozen = slowShots(s, p.rmFrozen, R.shotSlow);
    if (--p.rmFlurry.t > 0) return;
    flurryCut(s, p.rmFlurry.i, p.rmFlurry.n);
    p.rmFlurry.i++;
    p.rmFlurry.t = R.cutGap;
    if (p.rmFlurry.i >= p.rmFlurry.n) endSlow(s);
    return;
  }
  if ((p.rmSlow ?? 0) <= 0) return;
  p.rmFrozen = slowShots(s, p.rmFrozen, R.shotSlow);
  if (click) {
    const n = (styleOf(p).cuts ?? 3) + (hasPerk(p, "rmEcho") ? K.rmEcho.n : 0);
    p.rmFlurry = { i: 0, n, t: 1 };
    p.invulnTicks = Math.max(p.invulnTicks, n * R.cutGap + R.cutGuard);
    return;
  }
  if (--p.rmSlow! <= 0) endSlow(s);
}

/** 틱마다 (그림자 단검을 들었을 때 player에서) */
export function remnantTick(s: RunState, want: boolean, _speed: number): void {
  const p = s.player;
  if (!isRemnant(p)) return;
  // 대시를 시작한 틱: 더 멀리 (대시 틱이 늘어난 만큼 무적도 딱 맞게 길어짐)
  if (p.dashTicks > 0 && !p.rmDashing) p.dashTicks += R.dashMore;
  p.rmDashing = p.dashTicks > 0;
  update(s);
  if (!want || p.attackCooldown > 0 || p.rmFlurry) return;
  // 공격 속도는 무기 그대로 (아이템·버프로 오르지 않음)
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / weaponOf(p).attackSpeed));
  p.attackCount++;
  stab(s);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetRemnant(p: PlayerState): void {
  for (const k of ["rmSlow", "rmFrozen", "rmFlurry", "rmDodges", "rmDashing"] as const) delete p[k];
}
