// 베두인: 대형 차크람 하나. 처음엔 한 바퀴 돌려 베고(회전 베기), 다음 공격에 아주 멀리 던짐.
// 던진 차크람은 떨어진 자리에 남고 손이 비면 공격하지 못함. 닿으면 주우며 모래와 함께 크게 한 바퀴 베고, 다음 공격에 다시 던짐.
// 대시 모아 쓰기(신기루 걸음·축적)와 전용 아이템 효과도 여기서. 그리기는 화면 쪽(render/bedouin)
import { TICK_RATE } from "../constants";
import { BEDOUIN_PERKS as K } from "../itemsBedouin";
import { createRng, deriveSeed } from "../rng";
import { BEDOUIN } from "../weaponsBedouin";
import { damageEnemy as damageEnemy_, healPlayer, ignite } from "./combat";
import { blocksShot } from "./layout";
import type { ThrownChakram } from "./bedouinTypes";
import { ghostTick } from "./bedouinGhosts";
import type { PlayerState, RunState } from "./types";
import { addEffect, dist2, hasPerk, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, roomGrid } from "./util";
import { setDashMul } from "./buildSets";
import { fenrirDashMul } from "./fenrirStats";
import { accDash } from "./accStats";
import { srcFn, srcRun } from "./dmgSrc";
const damageEnemy = srcFn("bedouin", () => damageEnemy_);

const where = (s: RunState) => `${s.floor}/${s.roomId}`;
const roll = (s: RunState, label: string) => createRng(deriveSeed(s.seed, label, s.tick)).nextFloat();
const count = (p: PlayerState, id: string) => p.passives.filter((x) => x === id).length;

/** 모아 둘 수 있는 대시 수 (기본 1, 신기루 걸음 3, 축적 하나마다 +1) */
export function dashMax(p: PlayerState): number {
  return (hasPerk(p, "mirageStep") ? K.mirageStep.charges : 1) + count(p, "accumulate");
}

/** 지금 대시할 수 있는지 (모아 쓰기면 남은 수, 아니면 대기 시간) */
export function canDash(p: PlayerState): boolean {
  return dashMax(p) > 1 ? (p.dashCharges ?? dashMax(p)) > 0 : p.dashCooldown === 0;
}

/** 대시를 씀: 모아 쓰기면 하나 줄이고 대기 시간은 이미 돌고 있으면 그대로 */
export function spendDash(p: PlayerState, cooldown: number): void {
  const max = dashMax(p);
  if (max <= 1) {
    p.dashCooldown = cooldown;
    return;
  }
  p.dashCharges = Math.min(max, p.dashCharges ?? max) - 1;
  if (p.dashCooldown === 0) p.dashCooldown = cooldown;
}

/** 틱마다: 대기 시간이 끝나면 대시가 하나 참 (모자라면 다시 돌림) */
export function rechargeDash(p: PlayerState, cooldown: number): void {
  const max = dashMax(p);
  if (max <= 1) return;
  const have = Math.min(max, p.dashCharges ?? max);
  if (have >= max) {
    p.dashCharges = max;
    return;
  }
  if (p.dashCooldown === 0) {
    p.dashCharges = have + 1;
    if (have + 1 < max) p.dashCooldown = cooldown;
  }
}

/** 신기루 걸음: 대시 대기 시간 배율 */
export const dashCooldownMul = (p: PlayerState) => (hasPerk(p, "mirageStep") ? K.mirageStep.cooldown : 1) * (1 - (p.pwDashCut ?? 0)) * setDashMul(p) * fenrirDashMul(p) * accDash(p);

/** 피해 배율: 태양 전사는 모아 둔 대시 하나마다 +5% */
function power(p: PlayerState): number {
  return p.stats.damage * (hasPerk(p, "sunWarrior") ? 1 + K.sunWarrior.perDash * (dashMax(p) > 1 ? (p.dashCharges ?? dashMax(p)) : p.dashCooldown === 0 ? 1 : 0) : 1);
}

/** 둘레 원 안 적 모두에게 피해. 맞힌 수 */
function ringHit(s: RunState, x: number, y: number, radius: number, dmg: number): number {
  let n = 0;
  for (const e of [...s.enemies]) {
    if (e.hp <= 0) continue;
    const rr = radius + e.r;
    if ((e.x - x) ** 2 + (e.y - y) ** 2 > rr * rr) continue;
    const d = normalize(e.x - x, e.y - y) ?? [0, 0];
    damageEnemy(s, e, dmg, d[0], d[1]);
    n++;
  }
  return n;
}

/** 틱마다 (차크람을 들었을 때 player에서). want = 공격 키(자동 공격이면 사거리 안에 적) */
export function bedouinTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  // 다른 방으로 가면 차크람은 손으로 돌아옴 (다시 회전 베기부터)
  if (p.ck && p.ck.where !== where(s)) {
    p.ck = undefined;
    p.ckHeld = true;
    p.ckSpun = false;
    p.ghosts = undefined;
  }
  if (p.ck) moveChakram(s, p.ck);
  ghostTick(s, p.ck, (x, y, r) => ringHit(s, x, y, r, power(p) * K.whirlRing.damage));
  dashCut(s);
  danceTick(s);
  srcRun(s, "sandstorm", () => vortexTick(s));
  if (!want || p.attackCooldown > 0 || p.ckHeld === false) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  if (!p.ckSpun) spinSlash(s);
  else throwChakram(s);
}

/** 회전 베기: 몸을 한 바퀴 돌려 둘레를 벰 */
function spinSlash(s: RunState): void {
  const p = s.player;
  const master = hasPerk(p, "spinMaster");
  const radius = BEDOUIN.spinR * (master ? K.spinMaster.area : 1);
  ringHit(s, p.x, p.y, radius, power(p) * BEDOUIN.spinMul * (master ? K.spinMaster.damage : 1));
  addEffect(s, { kind: "swing", x: p.x, y: p.y, dirX: 0, dirY: 0, size: radius, maxTicks: 10 });
  p.ckSpun = true;
}

/** 던지기: 바라보는 쪽으로 멀리 (사막 환영이면 환영 둘, 사막의 왕이면 세 번째마다 거대) */
function throwChakram(s: RunState): void {
  const p = s.player;
  const speed = p.stats.projectileSpeed;
  const left = Math.ceil(p.stats.range / speed);
  p.ckThrows = (p.ckThrows ?? 0) + 1;
  const giant = hasPerk(p, "desertKing") && p.ckThrows % K.desertKing.every === 0;
  const x = p.x + p.faceX * (p.r + 2);
  const y = p.y + p.faceY * (p.r + 2);
  p.ck = {
    x,
    y,
    prevX: x,
    prevY: y,
    vx: p.faceX * speed,
    vy: p.faceY * speed,
    left,
    mode: "fly",
    hit: [],
    r: BEDOUIN.ckR * (giant ? K.desertKing.size : 1),
    mul: BEDOUIN.throwMul * (hasPerk(p, "farThrow") ? K.farThrow.damage : 1) * (giant ? K.desertKing.damage : 1),
    bounces: hasPerk(p, "reboundRing") ? K.reboundRing.bounces : 0,
    where: where(s),
    spin: 0,
  };
  p.ckHeld = false;
  p.ckSpun = false;
  // 사막 환영: 양옆으로 환영 차크람 (끝에서 사라짐)
  if (hasPerk(p, "desertMirage")) srcRun(s, "desertMirage", () => {
    const a = K.desertMirage.angle;
    for (const side of [-1, 1]) {
      const c = Math.cos(a);
      const sn = Math.sin(a) * side;
      const dx = p.faceX * c - p.faceY * sn;
      const dy = p.faceX * sn + p.faceY * c;
      s.projectiles.push({ id: s.nextId++, fromPlayer: true, x, y, prevX: x, prevY: y, r: 5, vx: dx * speed, vy: dy * speed, damage: power(p) * K.desertMirage.damage, ticksLeft: left, pierce: 99, hitIds: [], spirit: "chakram" });
    }
  });
}

/** 던진 차크람 움직이기: 날아가며 지나간 적을 벰 · 벽이나 끝에서 떨어짐 · 돌아오는 중이면 나에게 */
function moveChakram(s: RunState, c: ThrownChakram): void {
  const p = s.player;
  c.prevX = c.x;
  c.prevY = c.y;
  if (c.mode === "ground") {
    c.spin++;
  } else if (c.mode === "back") {
    const d = normalize(p.x - c.x, p.y - c.y);
    const sp = p.stats.projectileSpeed * 1.2;
    if (!d || dist2(c, p) <= (p.r + c.r + sp) ** 2) {
      // 손으로 돌아옴 (다음 공격은 던지기)
      p.ck = undefined;
      p.ckHeld = true;
      p.ckSpun = true;
      return;
    }
    c.x += d[0] * sp;
    c.y += d[1] * sp;
    cut(s, c);
  } else {
    const g = roomGrid(s);
    const blocked = (x: number, y: number) => x < ROOM_MIN_X || x > ROOM_MAX_X || y < ROOM_MIN_Y || y > ROOM_MAX_Y || (g !== null && blocksShot(g, x, y));
    let nx = c.x + c.vx;
    let ny = c.y + c.vy;
    if (blocked(nx, ny)) {
      // 첫 벽은 늘 튕김 (되튕김이면 그 뒤에도 벽마다 튕김)
      if (!c.bounced || c.bounces > 0) {
        if (c.bounced) c.bounces--;
        c.bounced = true;
        // 튕긴 뒤에는 같은 적도 다시 벰
        c.hit = [];
        if (blocked(nx, c.y)) c.vx = -c.vx;
        if (blocked(c.x, ny)) c.vy = -c.vy;
        if (!blocked(nx, c.y) && !blocked(c.x, ny)) {
          c.vx = -c.vx;
          c.vy = -c.vy;
        }
        nx = c.x;
        ny = c.y;
      } else {
        land(s, c);
        return;
      }
    }
    c.x = nx;
    c.y = ny;
    cut(s, c);
    // 벽에 한 번 튕기기 전까지는 멈추지 않고, 튕긴 뒤에 사거리만큼 더 날아감
    if (c.bounced && --c.left <= 0) land(s, c);
  }
  // 닿으면 주움 (바닥에 떨어진 것, 또는 벽에 튕긴 뒤 날아가는 것. 던지자마자 잡히지 않게)
  if ((c.mode === "ground" || (c.mode === "fly" && c.bounced)) && dist2(c, p) <= (p.r + c.r + BEDOUIN.pickR) ** 2) pickUp(s, c);
}

/** 날아가다 멈춤: 회귀 바람이면 확률로 돌아옴, 아니면 바닥에 떨어짐 */
function land(s: RunState, c: ThrownChakram): void {
  if (hasPerk(s.player, "returnWind") && roll(s, "returnWind") < K.returnWind.chance) {
    c.mode = "back";
    c.hit = [];
  } else c.mode = "ground";
}

/** 지나가는 자리의 적을 벰 (한 번 던질 때 같은 적은 한 번) */
function cut(s: RunState, c: ThrownChakram): void {
  const p = s.player;
  for (const e of [...s.enemies]) {
    if (e.hp <= 0 || c.hit.includes(e.id)) continue;
    const rr = e.r + c.r;
    if (dist2(e, c) > rr * rr) continue;
    c.hit.push(e.id);
    const d = normalize(c.vx, c.vy) ?? [p.faceX, p.faceY];
    damageEnemy(s, e, power(p) * c.mul, d[0], d[1]);
    if (hasPerk(p, "scorchBlade")) srcRun(s, "scorchBlade", () => { ignite(e, power(p) * K.scorchBlade.damage); });
  }
}

/** 주움: 모래와 함께 크게 한 바퀴 벰 · 전용 아이템 효과 */
function pickUp(s: RunState, c: ThrownChakram): void {
  const p = s.player;
  p.ck = undefined;
  p.ckHeld = true;
  p.ckSpun = true;
  const storm = hasPerk(p, "sandstorm");
  const radius = BEDOUIN.pickR2 * (storm ? K.sandstorm.area : 1);
  ringHit(s, c.x, c.y, radius, power(p) * BEDOUIN.pickMul * (hasPerk(p, "mirageDouble") ? K.mirageDouble.damage : 1));
  addEffect(s, { kind: "sandspin", x: c.x, y: c.y, dirX: p.dashDirX, dirY: p.dashDirY, size: radius, maxTicks: 22 });
  if (hasPerk(p, "oasis")) healPlayer(s, p.stats.maxHp * K.oasis.heal);
  if (hasPerk(p, "heatHaze")) p.invulnTicks = Math.max(p.invulnTicks, K.heatHaze.ticks);
  if (hasPerk(p, "quickCatch")) srcRun(s, "quickCatch", () => {
    if (dashMax(p) > 1) p.dashCharges = Math.min(dashMax(p), (p.dashCharges ?? 0) + 1);
    else p.dashCooldown = 0;
  });
  if (storm) p.vortex = { x: c.x, y: c.y, left: K.sandstorm.ticks };
}

/** 대시 공격: 대시로 지나간 적에게 공격력 30% (한 대시에 한 번씩). 무희의 춤이면 20%씩 연달아 세 번 */
function dashCut(s: RunState): void {
  const p = s.player;
  if (p.dashTicks <= 0) return;
  const dance = hasPerk(p, "duneRush");
  for (const e of [...s.enemies]) {
    if (e.hp <= 0 || p.dashHitIds.includes(e.id)) continue;
    const rr = p.r + e.r + 3;
    if (dist2(e, p) > rr * rr) continue;
    p.dashHitIds.push(e.id);
    damageEnemy(s, e, power(p) * (dance ? K.duneRush.damage : BEDOUIN.dashMul), p.dashDirX, p.dashDirY);
    if (dance) (p.dance ??= []).push({ id: e.id, left: K.duneRush.hits - 1, wait: K.duneRush.gap });
  }
}

/** 무희의 춤: 대시로 벤 적을 조금씩 사이를 두고 이어서 벰 (따다당) */
function danceTick(s: RunState): void {
  const p = s.player;
  if (!p.dance?.length) return;
  for (const d of p.dance) {
    if (--d.wait > 0) continue;
    const e = s.enemies.find((x) => x.id === d.id && x.hp > 0);
    d.left = e ? d.left - 1 : 0;
    d.wait = K.duneRush.gap;
    if (!e) continue;
    damageEnemy(s, e, power(p) * K.duneRush.damage, 0, 0);
    addEffect(s, { kind: "hit", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 5, maxTicks: 8 });
  }
  p.dance = p.dance.filter((d) => d.left > 0);
  if (!p.dance.length) p.dance = undefined;
}

/** 모래 회오리: 0.5초마다 둘레 피해 */
function vortexTick(s: RunState): void {
  const p = s.player;
  const v = p.vortex;
  if (!v) return;
  if (--v.left <= 0) {
    p.vortex = undefined;
    return;
  }
  if (v.left % 30 === 0) ringHit(s, v.x, v.y, K.sandstorm.radius, power(p) * K.sandstorm.damage);
}

/** 타워 디펜스: 대시가 없으니 떨어진 차크람이 혼자 날아 돌아옴 (돌아오며 지나가는 적도 벰) */
export function recallChakram(p: PlayerState): void {
  if (p.ck?.mode !== "ground") return;
  p.ck.mode = "back";
  p.ck.hit = [];
}
