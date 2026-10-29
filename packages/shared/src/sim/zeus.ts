// 제우스(히든, 시즌 2): 신들의 왕. 번개 무기 10 (번개창 · 하늘의 벼락 · 연쇄 번개 · 폭풍 구름 · 아이기스 · 독수리 · 천둥소리 · 신의 벼락창 · 구전 · 거인 사냥)
// 맞힐 때마다 감전이 쌓여 더 아프고, 천벌 게이지가 차면 제우스 강림(8초 무적 · 공격 두 배 · 방 곳곳에 벼락). 대시는 번개 걸음
// 수치는 weaponsZeus.ZEUS, 아이템은 itemsZeus, 신의 힘은 zeusPower
import { ROOM_WIDTH, TICK_RATE } from "../constants";
import { ZEUS as Z, type ThunderStyle } from "../weaponsZeus";
import { nearest } from "./brawlMoves";
import { alive, inCircle, inCone, inLine, isBoss, shoot, stun } from "./s2Kit";
import type { PlayerState, RunState } from "./types";
import { addEffect, normalize, weaponOf } from "./util";
import { chainFrom, powerTick, skyBolt, zap } from "./zeusPower";

const styleOf = (p: PlayerState): ThunderStyle => weaponOf(p).zeus ?? { mode: "javelin", chains: 2, radius: 0 };

export { zeusWrath } from "./zeusPower";

/** 번개 한 번 */
function attack(s: RunState): void {
  const p = s.player;
  const st = styleOf(p);
  const target = nearest(s, p.stats.range + 20);
  const d = target && normalize(target.x - p.x, target.y - p.y);
  if (d) [p.faceX, p.faceY] = d;
  const dmg = p.stats.damage;
  switch (st.mode) {
    case "javelin":
      shoot(s, 0, { damage: dmg, spirit: "zsJavelin", r: 3, range: p.stats.range, speed: 6 });
      break;
    case "sky":
      if (target) skyBolt(s, target, dmg, st.radius);
      break;
    case "chain":
      if (!target) break;
      zap(s, target, dmg);
      addEffect(s, { kind: "zsArc", x: p.x, y: p.y - 6, dirX: 0, dirY: 0, size: 2, toX: target.x, toY: target.y, maxTicks: 12 });
      chainFrom(s, target, st.chains, dmg);
      break;
    case "storm":
      if (target) (p.zsClouds ??= []).push({ x: target.x, y: target.y, t: Z.stormTicks, r: st.radius, dmg: dmg * Z.stormMul });
      break;
    case "aegis":
      for (const e of inCone(s, st.radius, 0)) {
        zap(s, e, dmg);
        stun(e, Z.aegisStun);
        if (!isBoss(e)) {
          e.x += p.faceX * Z.aegisPush;
          e.y += p.faceY * Z.aegisPush;
        }
      }
      addEffect(s, { kind: "zsAegis", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: st.radius, maxTicks: 14 });
      break;
    case "eagle":
      shoot(s, 0, { damage: dmg, spirit: "zsEagle", r: 5, range: p.stats.range * 2, speed: 3.5, pierce: 99 });
      Object.assign(s.projectiles[s.projectiles.length - 1] ?? {}, { seek: true, homing: true });
      break;
    case "clap":
      for (const e of inCircle(s, p.x, p.y, st.radius)) {
        zap(s, e, dmg);
        stun(e, 30);
      }
      addEffect(s, { kind: "zsClap", x: p.x, y: p.y, dirX: 0, dirY: 0, size: st.radius, maxTicks: 18 });
      break;
    case "spear":
      for (const e of inLine(s, ROOM_WIDTH, st.radius)) zap(s, e, dmg);
      addEffect(s, { kind: "zsSpear", x: p.x, y: p.y - 4, dirX: p.faceX, dirY: p.faceY, size: st.radius, toX: p.x + p.faceX * ROOM_WIDTH, toY: p.y - 4 + p.faceY * ROOM_WIDTH, maxTicks: 22 });
      break;
    case "orb":
      shoot(s, 0, { damage: dmg, spirit: "zsOrb", r: 6, range: p.stats.range * 1.5, speed: Z.orbSpeed, pierce: 99 });
      break;
    case "titan":
      if (!target) break;
      skyBolt(s, target, dmg * (isBoss(target) ? Z.titanBoss : 1), 12);
      for (let i = 0; i < Z.titanBolts; i++) {
        const near = alive(s).filter((e) => e !== target && Math.hypot(e.x - target.x, e.y - target.y) < st.radius + 30);
        const e = near[i % Math.max(1, near.length)];
        if (e) skyBolt(s, e, dmg * 0.8);
        else addEffect(s, { kind: "zsSky", x: target.x + (i - 1) * 16, y: target.y + 10, dirX: 0, dirY: 0, size: 8, maxTicks: 16 });
      }
      break;
  }
}

/** 틱마다 (번개 무기를 들었을 때 player에서) */
export function zeusTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  if (p.characterId !== "zeus") return;
  powerTick(s);
  if (!want || p.attackCooldown > 0) return;
  // 제우스 강림 중에는 공격 두 배로 빠름
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  attack(s);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetZeus(p: PlayerState): void {
  for (const k of ["zsWrath", "zsGod", "zsClouds", "zsDash"] as const) delete p[k];
}
