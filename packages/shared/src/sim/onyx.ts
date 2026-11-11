// 오닉스(테라코어, 영물): 일곱 보석의 광석 영물. 높은 체력·방어력 · 느린 걸음 · 맞아도 무적이 거의 없음 (묵인처럼)
// 공격: 칠보 광륜 — 가운데 자수정에서 방 안 모든 적에게 빛줄기 (쏘는 동안 몸을 못 움직임)
// 대시: 하늘을 나는 부스트. 한 번 누르면 비행(빠르게 계속 이동, 무적 아님) · 다시 누르면 내려앉음
// 날아오를 때·내려앉을 때·비행 중 일정 간격마다 보석 7개가 저마다 확률로 반응해 공격 (sim/onyxGems). 수치는 weaponsOnyx, 아이템은 itemsOnyx
import { srcRun, srcFn } from "./dmgSrc";
import { TICK_RATE } from "../constants";
import { ONYX_PERKS as K } from "../itemsOnyx";
import { createRng, deriveSeed } from "../rng";
import { ONYX as O, ONYX_GEM_IDS } from "../weaponsOnyx";
import { fireGem, rollGems } from "./onyxGems";
import { alive, inCircle, strike as strike_, stun } from "./s2Kit";
import type { PlayerState, RunState } from "./types";
import { addEffect, dist2, hasPerk, keepInRoom, normalize, roomGrid } from "./util";
const strike = srcFn("onyx", () => strike_);

export const isOnyx = (p: PlayerState) => p.characterId === "onyx";

/** 이동 속도 배율: 광륜을 쏘는 동안 0 · 비행 중 빠름 */
export function onyxMoveMul(p: PlayerState): number {
  if (!isOnyx(p)) return 1;
  if ((p.oxCast ?? 0) > 0) return 0;
  return p.oxFly ? O.flySpeed * (hasPerk(p, "oxWings") ? K.oxWings.speed : 1) : 1;
}

/** 대시 키: 오닉스는 비행을 켜고 끔 (보통 대시는 하지 않음 → false). 다른 캐릭터는 그대로 */
export function onyxDash(s: RunState, pressed: boolean): boolean {
  const p = s.player;
  if (!isOnyx(p)) return pressed;
  if (!pressed || (p.oxToggle ?? 0) > 0) return false;
  p.oxToggle = O.toggleGap;
  if (p.oxFly) land(s);
  else takeOff(s);
  return false;
}

function takeOff(s: RunState): void {
  const p = s.player;
  p.oxFly = true;
  [p.dashDirX, p.dashDirY] = [p.faceX, p.faceY];
  p.oxPulse = pulseGap(p);
  addEffect(s, { kind: "oxLift", x: p.x, y: p.y + p.r, dirX: 0, dirY: 0, size: 26, maxTicks: 24 });
  rollGems(s, "up");
}

function land(s: RunState): void {
  const p = s.player;
  p.oxFly = false;
  addEffect(s, { kind: "oxLand", x: p.x, y: p.y + p.r, dirX: 0, dirY: 0, size: hasPerk(p, "oxLanding") ? K.oxLanding.r : 24, maxTicks: 30, width: hasPerk(p, "oxLanding") ? 1 : 0 });
  if (hasPerk(p, "oxLanding")) srcRun(s, "oxLanding", () => {
    for (const e of inCircle(s, p.x, p.y, K.oxLanding.r)) {
      strike(s, e, p.stats.damage * K.oxLanding.mul, 12);
      stun(e, K.oxLanding.stun);
    }
  });
  rollGems(s, "down");
}

const pulseGap = (p: PlayerState) => Math.round(O.pulse * (hasPerk(p, "oxWings") ? K.oxWings.pulse : 1));

/** 받는 피해 배율 (광물 갑피: 땅에 있을 때 -) */
export function onyxTaken(p: PlayerState): number {
  return isOnyx(p) && !p.oxFly && hasPerk(p, "oxBulwark") ? K.oxBulwark.taken : 1;
}

/** 맞은 뒤: 무적은 아주 짧게 · 수정 반격 */
export function onyxHurt(s: RunState): void {
  const p = s.player;
  if (!isOnyx(p)) return;
  p.invulnTicks = Math.min(p.invulnTicks, O.hurtTicks);
  if (!hasPerk(p, "oxShard") || (p.oxShardCd ?? 0) > 0) return;
  p.oxShardCd = K.oxShard.gap;
  addEffect(s, { kind: "oxShard", x: p.x, y: p.y - 8, dirX: 0, dirY: 0, size: 30, maxTicks: 22 });
  rollGems(s, "shard", K.oxShard.chance);
}

/** 칠보 광륜: 방 안 모든 적에게 빛줄기 (가까운 적부터 상한까지) · 프리즘 광륜이면 보석 하나 같이 */
function halo(s: RunState): void {
  const p = s.player;
  const list = alive(s)
    .sort((a, b) => dist2(a, p) - dist2(b, p) || a.id - b.id)
    .slice(0, O.maxTargets);
  if (!list.length) return;
  const d = normalize(list[0]!.x - p.x, list[0]!.y - p.y);
  if (d) [p.faceX, p.faceY] = d;
  p.oxCast = Math.round(O.castTicks * (hasPerk(p, "oxQuick") ? K.oxQuick.cast : 1));
  for (const e of list) {
    strike(s, e, p.stats.damage, 2, "radiance");
    addEffect(s, { kind: "oxBeam", x: p.x, y: p.y - 10, dirX: 0, dirY: 0, size: 3, toX: e.x, toY: e.y, maxTicks: 20 });
  }
  addEffect(s, { kind: "oxHalo", x: p.x, y: p.y - 10, dirX: 0, dirY: 0, size: 22, maxTicks: 26 });
  if (hasPerk(p, "oxPrism")) srcRun(s, "oxPrism", () => {
    const g = ONYX_GEM_IDS[Math.floor(createRng(deriveSeed(s.seed, "oxPrism", s.tick)).nextFloat() * ONYX_GEM_IDS.length)]!;
    fireGem(s, g);
    p.oxLit = 1 << ONYX_GEM_IDS.indexOf(g);
    p.oxLitAt = s.tick;
  });
}

/** 보석 꼬리: 날아가는 동안 몸 둘레 적에게 보석 가루 */
function trail(s: RunState): void {
  const p = s.player;
  if (!p.oxFly || !hasPerk(p, "oxTrail")) return; return srcRun(s, "oxTrail", () => {
  p.oxTrail = (p.oxTrail ?? K.oxTrail.gap) - 1;
  if (p.oxTrail > 0) return;
  p.oxTrail = K.oxTrail.gap;
  for (const e of inCircle(s, p.x, p.y, K.oxTrail.r)) strike(s, e, p.stats.damage * K.oxTrail.mul, 2);
  addEffect(s, { kind: "oxDust", x: p.x, y: p.y, dirX: p.dashDirX, dirY: p.dashDirY, size: K.oxTrail.r, maxTicks: 30 });
}); }

/** 틱마다 (칠보 광륜을 들었을 때 player에서) */
export function onyxTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  if (p.oxToggle) p.oxToggle--;
  if (p.oxShardCd) p.oxShardCd--;
  if (p.oxCast) p.oxCast--;
  // 비행 방향 = 움직이는 쪽 (보석 빛줄기 방향)
  const mv = normalize(p.x - p.prevX, p.y - p.prevY);
  if (mv) [p.dashDirX, p.dashDirY] = mv;
  if (p.oxFly) {
    // 부스트: 손을 떼도 날던 쪽으로 계속 날아감 (광륜을 쏘는 동안은 멈춤)
    if (!mv && !p.oxCast) {
      const sp = p.stats.moveSpeed * onyxMoveMul(p);
      p.x += p.dashDirX * sp;
      p.y += p.dashDirY * sp;
      keepInRoom(p, roomGrid(s));
    }
    trail(s);
    p.oxPulse = (p.oxPulse ?? pulseGap(p)) - 1;
    if (p.oxPulse <= 0) {
      p.oxPulse = pulseGap(p);
      rollGems(s, "fly");
    }
  }
  if (!want || p.attackCooldown > 0) return;
  if (!alive(s).length) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  halo(s);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetOnyx(p: PlayerState): void {
  for (const k of ["oxFly", "oxToggle", "oxPulse", "oxCast", "oxTrail", "oxShardCd", "oxGems", "oxResons", "oxLit", "oxLitAt"] as const) delete p[k];
}
