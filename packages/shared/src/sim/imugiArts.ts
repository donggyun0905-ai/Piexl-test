// 이무기 무기별 추가 공격 (찌르기·휘두르기에 맞은 적마다) · 틱마다 이어지는 번개·폭풍·독 · 여의주 번개
import { ENEMIES } from "../enemyDefs";
import { IMUGI_PERKS as K } from "../itemsImugi";
import { IMUGI, DRAGON_COLORS, type DragonArt } from "../weaponsImugi";
import { blastAt, damageEnemy, dotDamage } from "./combat";
import type { EnemyState, RunState } from "./types";
import { statusHit } from "./statusHit";
import { addEffect, hasPerk, keepInRoom, normalize, roomGrid } from "./util";
import { createRng, deriveSeed } from "../rng";
import { raiseShield } from "./imugiMods";

const roll = (s: RunState, e: EnemyState) => createRng(deriveSeed(s.seed, "skyDragon", s.tick, e.id)).nextFloat();

/** 맞은 적 하나에 무기별 추가 공격 (dmg = 이번 공격 피해) */
export function dragonArt(s: RunState, e: EnemyState, art: DragonArt, dmg: number): void {
  const p = s.player;
  const tint = DRAGON_COLORS[art];
  switch (art) {
    case "azure":
      (p.imBolts ??= []).push({ id: e.id, left: IMUGI.azure.bolts, wait: 1 });
      return;
    case "crimson":
      blastAt(s, e.x, e.y, IMUGI.crimson.radius, dmg * IMUGI.crimson.mul);
      addEffect(s, { kind: "imBoom", x: e.x, y: e.y, dirX: 0, dirY: 0, size: IMUGI.crimson.radius, maxTicks: 16, tint });
      return;
    case "gale":
      e.imStorm = IMUGI.gale.ticks;
      return;
    case "earth": {
      e.sluggish = Math.max(e.sluggish ?? 0, IMUGI.earth.slow);
      // 토룡 보호막은 10까지 (다른 보호막 위에 더 쌓지 않음)
      const add = Math.min(IMUGI.earth.shieldMax - (p.imEarth ?? 0), dmg * IMUGI.earth.shield);
      if (add > 0) {
        p.imEarth = (p.imEarth ?? 0) + add;
        raiseShield(p, add, IMUGI.earth.shieldMax);
      }
      return;
    }
    case "holy": {
      for (const o of s.enemies) {
        if (o.hp <= 0) continue;
        const rr = IMUGI.holy.radius + o.r;
        if ((o.x - e.x) ** 2 + (o.y - e.y) ** 2 > rr * rr) continue;
        const d = normalize(o.x - p.x, o.y - p.y) ?? [p.faceX, p.faceY];
        statusHit(s, o, "radiance", dmg * IMUGI.holy.mul, d[0], d[1]);
        if (!ENEMIES[o.kind].boss) {
          o.x += d[0] * IMUGI.holy.push;
          o.y += d[1] * IMUGI.holy.push;
          keepInRoom(o, roomGrid(s));
        }
      }
      addEffect(s, { kind: "imLight", x: e.x, y: e.y, dirX: 0, dirY: 0, size: IMUGI.holy.radius, maxTicks: 18, tint });
      return;
    }
    case "shadow": {
      const muls = IMUGI.shadow.muls;
      const i = (p.imHits ?? 0) % muls.length;
      damageEnemy(s, e, dmg * muls[i]!, 0, 0);
      addEffect(s, { kind: "imBite", x: e.x, y: e.y + e.r * 0.4, dirX: i, dirY: 0, size: e.r + 4, maxTicks: 18, tint });
      return;
    }
    case "silver":
      for (let k = 0; k < IMUGI.silver.shards; k++) {
        const a = (k / IMUGI.silver.shards) * Math.PI * 2 + s.tick * 0.37;
        const vx = Math.cos(a) * IMUGI.silver.speed;
        const vy = Math.sin(a) * IMUGI.silver.speed;
        s.projectiles.push({ id: s.nextId++, fromPlayer: true, x: e.x, y: e.y, prevX: e.x, prevY: e.y, r: 2, vx, vy, damage: dmg * IMUGI.silver.mul, ticksLeft: Math.ceil(IMUGI.silver.range / IMUGI.silver.speed), pierce: 0, hitIds: [e.id], spirit: "shard", tint });
      }
      return;
    case "venom":
      e.imVenom = IMUGI.venom.ticks;
      e.imVenomStacks = Math.min(IMUGI.venom.stacks, (e.imVenomStacks ?? 0) + 1);
      return;
    case "sky":
      if (roll(s, e) >= IMUGI.sky.chance) return;
      blastAt(s, e.x, e.y, IMUGI.sky.radius, dmg * IMUGI.sky.mul);
      addEffect(s, { kind: "imSky", x: e.x, y: e.y, dirX: 0, dirY: 0, size: IMUGI.sky.radius, maxTicks: 26, tint });
      return;
    default:
      return;
  }
}

/** 여의주: 방 안 모든 적에게 번개 */
export function pearlStrike(s: RunState, dmg: number): void {
  // 화룡점정: 번개마다 적 최대 체력의 2% (보스는 1/5 기준, 연습장 허수아비는 체력 1000인 보스처럼)
  const eye = hasPerk(s.player, "dragonEye");
  for (const e of [...s.enemies]) {
    if (e.hp <= 0) continue;
    const base = e.kind === "dummy" ? 1000 / K.dragonEye.bossDiv : ENEMIES[e.kind].boss ? e.maxHp / K.dragonEye.bossDiv : e.maxHp;
    const total = dmg * IMUGI.pearl.mul + (eye ? base * K.dragonEye.hp : 0);
    if (!eye) damageEnemy(s, e, total, 0, 0);
    else {
      // 화룡점정: 남은 것과 합쳐 여러 번으로 나눠 빠르게 (총 피해는 같음)
      const left = (e.imZap ?? 0) * (e.imZapDmg ?? 0) + total;
      e.imZap = IMUGI.pearl.hits;
      e.imZapDmg = left / IMUGI.pearl.hits;
    }
    addEffect(s, { kind: "imBolt", x: e.x, y: e.y, dirX: eye ? 1 : 0, dirY: 0, size: 3, maxTicks: 14, tint: DRAGON_COLORS.pearl });
  }
}

/** 틱마다: 청룡 번개 · 풍룡 폭풍 · 사룡 독 · 느려짐 줄이기 */
export function dragonDots(s: RunState, dmg: number): void {
  const p = s.player;
  if (p.imBolts?.length) {
    for (const b of p.imBolts) {
      if (--b.wait > 0) continue;
      const e = s.enemies.find((x) => x.id === b.id && x.hp > 0);
      b.left = e ? b.left - 1 : 0;
      b.wait = IMUGI.azure.gap;
      if (!e) continue;
      damageEnemy(s, e, dmg * IMUGI.azure.mul, 0, 0);
      addEffect(s, { kind: "imBolt", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 2, maxTicks: 8, tint: DRAGON_COLORS.azure });
    }
    p.imBolts = p.imBolts.filter((b) => b.left > 0);
  }
  for (const e of s.enemies) {
    if (e.hp <= 0) continue;
    if ((e.imZap ?? 0) > 0 && s.tick % IMUGI.pearl.every === 0) {
      e.imZap = (e.imZap ?? 0) - 1;
      damageEnemy(s, e, e.imZapDmg ?? 0, 0, 0);
    }
    if ((e.imStorm ?? 0) > 0) {
      e.imStorm = (e.imStorm ?? 0) - 1;
      if (e.imStorm % IMUGI.gale.every === 0) dotDamage(s, e, "storm", dmg * IMUGI.gale.mul);
    }
    if ((e.imVenom ?? 0) > 0) {
      e.imVenom = (e.imVenom ?? 0) - 1;
      // 1초마다 (계속 맞아 남은 시간이 다시 차도 피해 간격은 그대로)
      e.imVenomT = (e.imVenomT ?? 0) + 1;
      if (e.imVenomT % 60 === 0) {
        // 보스는 최대 체력의 1/5 기준 (연습장 허수아비는 체력 1000인 보스처럼)
        const base = e.kind === "dummy" ? 1000 / IMUGI.venom.bossDiv : ENEMIES[e.kind].boss ? e.maxHp / IMUGI.venom.bossDiv : e.maxHp;
        dotDamage(s, e, "poison", base * IMUGI.venom.pct * (e.imVenomStacks ?? 1));
      }
      if (e.imVenom === 0) e.imVenomStacks = e.imVenomT = 0;
    }
  }
}
