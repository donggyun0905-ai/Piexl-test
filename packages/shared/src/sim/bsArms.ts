// 빙설 전용 아이템 기술: 공격할 때(궁극기·활·창·얼음가루·빙격·영역강화 얼음가루) · 틱마다(얼음가루 닿기·모여 유도/급속 얼음·활 화살·영역강화 결정)
import { srcRun } from "./dmgSrc";
import { ENEMIES } from "../enemyDefs";
import { BINGSEOL_PERKS as K } from "../itemsBingseol";
import { createRng, deriveSeed } from "../rng";
import { addDust, fieldR } from "./bsKit";
import { iceHit } from "./bsHit";
import { pushShot } from "./bsShots";
import { startUlt } from "./bsUlt";
import { rot } from "./orbit";
import { alive, damageEnemyLite, nearestFoe } from "./shadowingSpirits";
import type { RunState } from "./types";
import { addEffect, hasPerk, normalize, reachOf } from "./util";

type P = RunState["player"];

/** 공격 한 번마다 (확률은 판 시드·틱·공격 수로) */
export function onAttack(s: RunState): void {
  const p = s.player;
  const rng = createRng(deriveSeed(s.seed, "bsAtk", s.tick, p.attackCount));
  if (hasPerk(p, "bsUlt") && !p.bsUlt && rng.nextFloat() < K.bsUlt.chance) srcRun(s, "bsUlt", () => startUlt(s));
  if (hasPerk(p, "bsBow") && rng.nextFloat() < K.bsBow.chance && (p.bsBows ?? []).length < K.bsBow.max) setBow(s);
  if (hasPerk(p, "bsLance") && rng.nextFloat() < K.bsLance.chance) lances(p, rng.int(K.bsLance.min, K.bsLance.max));
  if (hasPerk(p, "bsDust")) addDust(p, rng.int(K.bsDust.min, K.bsDust.max), rng);
  if (hasPerk(p, "bsSpike") && rng.nextFloat() < K.bsSpike.chance) srcRun(s, "bsSpike", () => spike(s));
  if (hasPerk(p, "bsWall") && rng.nextFloat() < K.bsWall.dustChance) addDust(p, rng.int(K.bsWall.dustMin, K.bsWall.dustMax), rng);
}

/** 빙설무장-활: 몸 왼쪽(처음)·오른쪽(둘째)에 세움 */
function setBow(s: RunState): void {
  const p = s.player;
  const bows = (p.bsBows ??= []);
  const side = bows.length === 0 ? -1 : -bows[0]!.side;
  const x = p.x + side * K.bsBow.side;
  bows.push({ x, y: p.y, side, left: K.bsBow.life, cd: 10, ax: side, ay: 0 });
  addEffect(s, { kind: "bsBowSet", x, y: p.y, dirX: side, dirY: 0, size: 20, maxTicks: 20 });
}

/** 빙설무장-창: 머리 위에 넓게 벌어져 n개가 차례로 생긴 뒤 한 개씩 연발로 날아감 */
function lances(p: P, n: number): void {
  const ready = (n - 1) * K.bsLance.every + K.bsLance.wait;
  for (let i = 0; i < n; i++) {
    const u = i - (n - 1) / 2;
    const ox = u * K.bsLance.space;
    const oy = -22 + Math.abs(u) * 3;
    const t0 = -(ready + i * K.bsLance.gap);
    const speed = K.bsLance.speed * Math.max(0.5, p.stats.projectileSpeed / 4);
    pushShot(p, { x: p.x + ox, y: p.y + oy, dx: p.faceX, dy: p.faceY, r: K.bsLance.r, dmg: p.stats.damage * K.bsLance.mul, kind: 1, age: t0, life: Math.round((p.stats.range * 1.4) / speed) + 10, speed, pierce: 0, hit: [], ox, oy, t0, at: i * K.bsLance.every });
  }
}

/** 빙격: 앞에 얼음 빙각이 솟음 · 구속(보스는 오래 느려짐) */
function spike(s: RunState): void {
  const p = s.player;
  const k = reachOf(p);
  const x = p.x + p.faceX * K.bsSpike.dist * k;
  const y = p.y + p.faceY * K.bsSpike.dist * k;
  const r = K.bsSpike.r * k;
  for (const e of s.enemies) {
    if (!alive(e) || (e.x - x) ** 2 + (e.y - y) ** 2 > (r + e.r) ** 2) continue;
    iceHit(s, e, p.stats.damage * K.bsSpike.mul, p.faceX, p.faceY);
    if (ENEMIES[e.kind].boss) e.sluggish = Math.max(e.sluggish ?? 0, K.bsSpike.bossSlow);
    else e.stunTicks = Math.max(e.stunTicks ?? 0, K.bsSpike.stun);
  }
  addEffect(s, { kind: "bsSpike", x, y, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: 30 });
}

/** 얼음가루: 닿은 적에게 고정 피해 (쇄빙이면 더) 주고 사라짐 · 오래되면 녹음 */
function dustTick(s: RunState): void {
  const p = s.player;
  if (!p.bsDust?.length) return;
  const dmg = K.bsDust.dmg * (hasPerk(p, "bsShatter") ? K.bsShatter.dust : 1);
  p.bsDust = p.bsDust.filter((d) => {
    d.age++;
    if (d.age > K.bsDust.life) return false;
    for (const e of s.enemies) {
      if (!alive(e) || (e.x - d.x) ** 2 + (e.y - d.y) ** 2 > (K.bsDust.r + e.r) ** 2) continue;
      damageEnemyLite(s, e, dmg, 0, 0);
      return false;
    }
    return true;
  });
}

/** 얼음가루 need개를 모음 (오래된 것부터) → 모인 자리 · 없으면 null */
function gather(s: RunState, need: number, ticks: number): [number, number] | null {
  const p = s.player;
  const list = p.bsDust ?? [];
  if (list.length < need) return null;
  const used = list.splice(0, need);
  const x = used.reduce((a, d) => a + d.x, 0) / need;
  const y = used.reduce((a, d) => a + d.y, 0) / need;
  for (const d of used) addEffect(s, { kind: "bsGather", x: d.x, y: d.y, dirX: 0, dirY: 0, size: 3, toX: x, toY: y, maxTicks: ticks });
  return [x, y];
}

/** 얼음가루(속)·(강): 생긴 수가 차면 모여 유도 얼음·급속 얼음 */
function fuseTick(s: RunState): void {
  const p = s.player;
  if ((p.bsRest10 ?? 0) > 0) p.bsRest10 = (p.bsRest10 ?? 0) - 1;
  else if (hasPerk(p, "bsRapid") && (p.bsMade10 ?? 0) >= K.bsRapid.need) {
    const at = gather(s, K.bsRapid.need, K.bsRapid.gather);
    if (at) {
      p.bsMade10 = (p.bsMade10 ?? 0) - K.bsRapid.need;
      const t = nearestFoe(s, at[0], at[1]);
      const d = (t && normalize(t.x - at[0], t.y - at[1])) || [p.faceX, p.faceY];
      pushShot(p, { x: at[0], y: at[1], dx: d[0], dy: d[1], r: K.bsRapid.r, dmg: p.stats.damage * K.bsRapid.mul, kind: 4, age: -K.bsRapid.gather, life: K.bsRapid.life, speed: K.bsRapid.speed, pierce: 999, hit: [] });
      if ((p.bsChain10 = (p.bsChain10 ?? 0) + 1) >= K.bsRapid.chain) {
        p.bsChain10 = 0;
        p.bsMade10 = 0;
        p.bsRest10 = K.bsRapid.cd;
      }
    }
  }
  if ((p.bsRest5 ?? 0) > 0) p.bsRest5 = (p.bsRest5 ?? 0) - 1;
  else if (hasPerk(p, "bsHoming") && (p.bsMade5 ?? 0) >= K.bsHoming.need) {
    const at = gather(s, K.bsHoming.need, K.bsHoming.gather);
    if (at) {
      p.bsMade5 = (p.bsMade5 ?? 0) - K.bsHoming.need;
      pushShot(p, { x: at[0], y: at[1], dx: p.faceX, dy: p.faceY, r: 6, dmg: p.stats.damage * K.bsHoming.mul, kind: 3, age: -K.bsHoming.gather, life: 150, speed: K.bsHoming.speed, pierce: 0, hit: [] });
      if ((p.bsChain5 = (p.bsChain5 ?? 0) + 1) >= K.bsHoming.chain) {
        p.bsChain5 = 0;
        p.bsMade5 = 0;
        p.bsRest5 = K.bsHoming.cd;
      }
    }
  }
}

/** 활: 둘레 가까운 적에게 화살 */
function bowTick(s: RunState): void {
  const p = s.player;
  if (!p.bsBows?.length) return;
  p.bsBows = p.bsBows.filter((b) => {
    if (--b.left <= 0) return false;
    if (--b.cd > 0) return true;
    const t = nearestFoe(s, b.x, b.y);
    if (!t || (t.x - b.x) ** 2 + (t.y - b.y) ** 2 > K.bsBow.dist ** 2) return true;
    const d = normalize(t.x - b.x, t.y - b.y) ?? [b.side, 0];
    b.cd = K.bsBow.every;
    b.ax = d[0];
    b.ay = d[1];
    pushShot(p, { x: b.x, y: b.y, dx: d[0], dy: d[1], r: 5, dmg: p.stats.damage * K.bsBow.mul, kind: 2, age: 0, life: Math.round((K.bsBow.dist * 1.3) / K.bsBow.speed), speed: K.bsBow.speed, pierce: 0, hit: [] });
    return true;
  });
}

/** 영역강화 결정 자리 (영역 테두리를 천천히 돎) */
export function wallSpots(p: P): [number, number][] {
  const r = fieldR(p);
  const out: [number, number][] = [];
  for (let i = 0; i < K.bsWall.n; i++) {
    const [c, n] = rot((p.bsSpin ?? 0) + (i * Math.PI * 2) / K.bsWall.n);
    out.push([p.x + c * r, p.y + n * r]);
  }
  return out;
}

/** 영역강화: 결정이 돌며 닿은 적 탄을 막고 주기적으로 둘레 적에게 피해 */
function wallTick(s: RunState): void {
  const p = s.player;
  if (!hasPerk(p, "bsWall")) return; return srcRun(s, "bsWall", () => {
  p.bsSpin = ((p.bsSpin ?? 0) + K.bsWall.spin) % (Math.PI * 2);
  const spots = wallSpots(p);
  const r = K.bsWall.r;
  for (const pr of s.projectiles) {
    if (pr.fromPlayer || pr.ticksLeft <= 0) continue;
    const at = spots.find(([x, y]) => (pr.x - x) ** 2 + (pr.y - y) ** 2 <= (pr.r + r) ** 2);
    if (!at) continue;
    pr.ticksLeft = 0;
    addEffect(s, { kind: "bsBlock", x: pr.x, y: pr.y, dirX: 0, dirY: 0, size: 6, maxTicks: 12 });
  }
  if (s.tick % K.bsWall.every !== 0) return;
  for (const [x, y] of spots) {
    let hit = false;
    for (const e of s.enemies) {
      if (!alive(e) || (e.x - x) ** 2 + (e.y - y) ** 2 > (r * 1.6 + e.r) ** 2) continue;
      iceHit(s, e, p.stats.damage * K.bsWall.mul, 0, 0);
      hit = true;
    }
    if (hit) addEffect(s, { kind: "bsWallHit", x, y, dirX: 0, dirY: 0, size: r * 1.6, maxTicks: 14 });
  }
}); }

/** 틱마다 */
export function armsTick(s: RunState): void {
  dustTick(s);
  fuseTick(s);
  bowTick(s);
  wallTick(s);
}
