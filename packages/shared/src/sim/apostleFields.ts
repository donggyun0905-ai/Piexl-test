// 악의 사도 일곱 죄의 장판: 틱마다 안에 있는 적에게 화상·잠·부패·독·빠른 피해(색욕)·묶기·중력
import { ENEMIES } from "../enemyDefs";
import { APOSTLE, SIN_COLORS } from "../weaponsApostle";
import type { SinField } from "./apostleTypes";
import { damageEnemy, dotDamage, healPlayer, ignite } from "./combat";
import type { EnemyState, RunState } from "./types";
import { addEffect, dist2, keepInRoom, roomGrid } from "./util";
import { createRng, deriveSeed } from "../rng";

const inside = (f: SinField, e: EnemyState) => e.hp > 0 && dist2(e, f) <= (f.r + e.r) ** 2;
/** 장판마다 몇 틱에 한 번 (탐식은 빠르게, 탐욕은 느리게, 색욕은 매우 빠르게) */
const EVERY: Partial<Record<SinField["sin"], number>> = { gluttony: APOSTLE.gluttony.every, greed: APOSTLE.greed.every, lust: APOSTLE.lust.every };

/** 틱마다 모든 장판 */
export function fieldTick(s: RunState): void {
  const p = s.player;
  if (!p.apFields?.length) return;
  for (const f of p.apFields) {
    f.left--;
    f.t++;
    if (f.t % (EVERY[f.sin] ?? APOSTLE.fieldEvery) === 0) for (const e of [...s.enemies]) if (inside(f, e)) sinHit(s, f, e);
    if (f.sin === "pride" && f.t % APOSTLE.pride.every === 0) gravity(s, f);
  }
  p.apFields = p.apFields.filter((f) => f.left > 0);
}

function sinHit(s: RunState, f: SinField, e: EnemyState): void {
  const boss = ENEMIES[e.kind].boss;
  switch (f.sin) {
    case "wrath":
      ignite(e, f.dmg * APOSTLE.wrath.burn);
      // 장판 위에서는 불 피해가 2배 빨리 (0.5초마다 들어가는 불 사이에 한 번 더)
      if (f.t % 30 === 15) dotDamage(s, e, "burn", e.burnDmg ?? 0);
      return;
    case "sloth": {
      e.slowTicks = Math.max(e.slowTicks ?? 0, APOSTLE.sloth.slow);
      e.apSloth = (e.apSloth ?? 0) + 1;
      if (e.apSloth < APOSTLE.sloth.stacks) return;
      // 깊은 잠: 오래 멈추고 큰 피해, 다시 쌓기
      e.apSloth = 0;
      e.stunTicks = Math.max(e.stunTicks ?? 0, boss ? APOSTLE.sloth.bossSleep : APOSTLE.sloth.sleep);
      damageEnemy(s, e, f.dmg * APOSTLE.sloth.mul, 0, 0);
      addEffect(s, { kind: "apSleep", x: e.x, y: e.y - e.r - 4, dirX: 0, dirY: 0, size: 6, maxTicks: 40, tint: SIN_COLORS.sloth });
      return;
    }
    case "gluttony":
      e.apDef = Math.min(APOSTLE.gluttony.maxDef, (e.apDef ?? 0) + APOSTLE.gluttony.def);
      dotDamage(s, e, "rot", f.dmg * APOSTLE.gluttony.rot);
      return;
    case "envy":
      e.poisonTicks = Math.max(e.poisonTicks ?? 0, APOSTLE.envy.ticks);
      e.poisonDmg = Math.max(e.poisonDmg ?? 0, f.dmg * APOSTLE.envy.mul);
      // 장판 위에서는 독 피해가 2배 빨리
      if (f.t % 30 === 15) dotDamage(s, e, "poison", e.poisonDmg);
      return;
    case "lust": {
      // 장판 위 적이 아주 빠르게 피해를 받음 (혼자여도), 준 피해의 일부만큼 회복
      const amt = f.dmg * APOSTLE.lust.mul;
      damageEnemy(s, e, amt, 0, 0);
      healPlayer(s, amt * APOSTLE.lust.heal);
      return;
    }
    case "greed":
      e.slowTicks = Math.max(e.slowTicks ?? 0, APOSTLE.greed.slow);
      if (!boss && createRng(deriveSeed(s.seed, "greed", s.tick, e.id)).nextFloat() < APOSTLE.greed.root) e.rootTicks = Math.max(e.rootTicks ?? 0, APOSTLE.greed.rootTicks);
      damageEnemy(s, e, f.dmg * APOSTLE.greed.mul, 0, 0);
      addEffect(s, { kind: "apCoin", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 4, maxTicks: 24, tint: SIN_COLORS.greed });
      return;
    case "pride":
      e.sluggish = Math.max(e.sluggish ?? 0, APOSTLE.pride.sluggish);
      return;
    default:
      return;
  }
}

/** 교만: 장판 가운데로 끌어당기며 짓누름 */
function gravity(s: RunState, f: SinField): void {
  for (const e of [...s.enemies]) {
    if (!inside(f, e)) continue;
    if (!ENEMIES[e.kind].boss) {
      const d = Math.sqrt(dist2(e, f)) || 1;
      const k = Math.min(d, APOSTLE.pride.pull) / d;
      e.x += (f.x - e.x) * k;
      e.y += (f.y - e.y) * k;
      keepInRoom(e, roomGrid(s));
    }
    damageEnemy(s, e, f.dmg * APOSTLE.pride.mul, 0, 0);
  }
  addEffect(s, { kind: "apGrav", x: f.x, y: f.y, dirX: 0, dirY: 0, size: f.r, maxTicks: 20, tint: SIN_COLORS.pride });
}
