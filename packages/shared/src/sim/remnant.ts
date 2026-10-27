// 잔영(아스칼론, 시즌 2): 그림자 속 암살자. 아주 빠른 단검 공격 · 모든 상태이상 면역 · 치명타 25%/250%(characters)
// 노리는 적이 칼끝에서 멀면 그 적 뒤로 순간이동해 등 뒤를 벰 (뒤에서 친 피해 배율). 떠난 자리에는 잔영이 남아 잠시 뒤 한 번 더 벰
// 수치는 weaponsRemnant.REMNANT, 아이템은 itemsRemnant
import { TICK_RATE } from "../constants";
import { REMNANT_PERKS as K } from "../itemsRemnant";
import { REMNANT as R, type PhantomStyle } from "../weaponsRemnant";
import { nearest } from "./brawlMoves";
import { applyBleed, updateBleed } from "./gunExtras";
import { inCircle, inCone, poison, shoot, strike } from "./s2Kit";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, hasPerk, keepInRoom, normalize, roomGrid, weaponOf } from "./util";

const styleOf = (p: PlayerState): PhantomStyle => weaponOf(p).phantom ?? { reach: 26, arc: 0.3, hits: 1, blinkGap: 45, backMul: 1.5 };
const isRemnant = (p: PlayerState) => p.characterId === "remnant";

/** 상태이상 면역 (앞으로 나올 상태이상도 이것으로 막음) */
export const statusImmune = (p: PlayerState) => isRemnant(p);

/** 몸에 걸린 상태이상을 바로 걷어냄: 어둠 · 거울(이동 반대) · 깜깜함 */
function cleanse(p: PlayerState): void {
  p.darkStacks = 0;
  p.darkTicks = 0;
  p.mirrorTicks = 0;
  p.blindTicks = 0;
}

/** 순간이동 대기 */
const blinkGap = (p: PlayerState) => Math.round(styleOf(p).blinkGap * (hasPerk(p, "rmStep") ? K.rmStep.cd : 1));

/** 적 뒤로 순간이동 (떠난 자리에 잔영) */
function blink(s: RunState, e: EnemyState): void {
  const p = s.player;
  const d = normalize(e.x - p.x, e.y - p.y) ?? [p.faceX, p.faceY];
  leaveEcho(s, p.x, p.y);
  addEffect(s, { kind: "rmVanish", x: p.x, y: p.y, dirX: d[0], dirY: d[1], size: 8, maxTicks: 14 });
  p.x = e.x + d[0] * (e.r + p.r + 4);
  p.y = e.y + d[1] * (e.r + p.r + 4);
  keepInRoom(p, roomGrid(s));
  p.prevX = p.x;
  p.prevY = p.y;
  p.faceX = -d[0];
  p.faceY = -d[1];
  p.rmBlink = blinkGap(p);
  p.rmBack = R.backWindow;
  if (hasPerk(p, "rmVanish")) p.invulnTicks = Math.max(p.invulnTicks, K.rmVanish.ticks);
  addEffect(s, { kind: "rmAppear", x: p.x, y: p.y, dirX: -d[0], dirY: -d[1], size: 10, maxTicks: 14 });
}

function leaveEcho(s: RunState, x: number, y: number): void {
  const p = s.player;
  (p.rmEchoes ??= []).push({ x, y, t: R.echoDelay, dmg: p.stats.damage * R.echoMul });
}

/** 등 뒤에서 쳤는지: 순간이동 바로 뒤이거나, 적이 가는 쪽의 반대편에서 침 */
function fromBehind(p: PlayerState, e: EnemyState): boolean {
  if ((p.rmBack ?? 0) > 0) return true;
  return e.dirX * (p.x - e.x) + e.dirY * (p.y - e.y) < 0;
}

function cut(s: RunState, e: EnemyState, dmg: number): void {
  const p = s.player;
  const st = styleOf(p);
  let d = dmg;
  if (fromBehind(p, e)) d *= st.backMul + (hasPerk(p, "rmBackstab") ? K.rmBackstab.add : 0);
  if (hasPerk(p, "rmExecute") && e.hp <= e.maxHp * K.rmExecute.hp) d *= K.rmExecute.mul;
  strike(s, e, d);
  if (st.venom) poison(e, dmg * st.venom, R.venomTicks);
  if (hasPerk(p, "rmBlood") && e.hp > 0) applyBleed(e);
}

/** 한 번 공격: 노리는 적 쪽으로 돌아 베기 (멀면 그 적 뒤로 순간이동) */
function slash(s: RunState): void {
  const p = s.player;
  const st = styleOf(p);
  const target = nearest(s, p.stats.range);
  if (target) {
    const far = Math.hypot(target.x - p.x, target.y - p.y) > st.reach + target.r;
    if (far && (p.rmBlink ?? 0) <= 0) blink(s, target);
    const d = normalize(target.x - p.x, target.y - p.y);
    if (d) [p.faceX, p.faceY] = d;
  }
  for (let h = 0; h < st.hits; h++) for (const e of inCone(s, st.reach, st.arc)) cut(s, e, p.stats.damage);
  addEffect(s, { kind: "rmSlash", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: st.reach, maxTicks: 8, width: st.arc <= -1 ? 0 : st.hits });
  if (st.throws) for (let i = 0; i < st.throws; i++) shoot(s, (i - (st.throws - 1) / 2) * R.throwSpread, { damage: p.stats.damage * 0.6, spirit: "rmKnife", r: R.throwR, range: p.stats.range });
}

/** 틱마다: 상태이상 걷기 · 대기 · 잔영 · 대시 순간이동 · 연쇄 암살 */
function update(s: RunState): void {
  const p = s.player;
  cleanse(p);
  if (hasPerk(p, "rmBlood")) updateBleed(s);
  if ((p.rmBlink ?? 0) > 0) p.rmBlink = (p.rmBlink ?? 0) - 1;
  if ((p.rmBack ?? 0) > 0) p.rmBack = (p.rmBack ?? 0) - 1;
  const fresh = s.kills - (p.rmSeen ?? s.kills);
  p.rmSeen = s.kills;
  if (fresh > 0 && hasPerk(p, "rmFrenzy")) p.rmBlink = 0;
  if (p.dashTicks > 0 && !p.rmDash && hasPerk(p, "rmShroud")) {
    const e = nearest(s, K.rmShroud.reach);
    if (e) blink(s, e);
  }
  p.rmDash = p.dashTicks > 0;
  if (p.rmEchoes?.length) {
    const st = styleOf(p);
    for (const echo of p.rmEchoes) {
      if (--echo.t > 0) continue;
      const r = R.echoR * (st.burst ?? 1);
      const times = hasPerk(p, "rmEcho") ? K.rmEcho.n : 1;
      for (let i = 0; i < times; i++) for (const e of inCircle(s, echo.x, echo.y, r)) strike(s, e, echo.dmg * (st.burst ? st.burst * 1.5 : 1));
      addEffect(s, { kind: "rmEcho", x: echo.x, y: echo.y, dirX: 0, dirY: 0, size: r, maxTicks: 14, width: st.burst ? 1 : 0 });
    }
    p.rmEchoes = p.rmEchoes.filter((e) => e.t > 0);
  }
}

/** 틱마다 (그림자 단검을 들었을 때 player에서) */
export function remnantTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  if (!isRemnant(p)) return;
  update(s);
  if (!want || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  slash(s);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetRemnant(p: PlayerState): void {
  for (const k of ["rmBlink", "rmBack", "rmEchoes", "rmDash", "rmSeen"] as const) delete p[k];
}
