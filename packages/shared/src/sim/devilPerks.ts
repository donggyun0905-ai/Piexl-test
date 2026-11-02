// 악마의 거래 패시브 효과 (itemsDevil): 방어력(악마의 피·붉은 반점) · 맞힐 때(절규 범위·리퍼 낫) · 주는 피해 배율(십자가 보스·리퍼) · 틱마다(사탄의 가면 오라)
import type { ExtraStats } from "../characters";
import { ENEMIES } from "../enemyDefs";
import { DEVIL_PERKS as K } from "../itemsDevil";
import { BEDOUIN_PERKS } from "../itemsBedouin";
import { PASSIVES, type PassiveDef } from "../items";
import { createRng, deriveSeed } from "../rng";
import { APOSTLE, SIN_COLORS } from "../weaponsApostle";
import { doomTick } from "./apostle";
import { blastAt } from "./combat";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, dist2, hasPerk, weaponOf } from "./util";

/** 공격력을 올리는 패시브 수 (붉은 반점) */
const damageItems = (p: PlayerState) => p.passives.filter((id) => (PASSIVES[id] as PassiveDef).mods.some((m) => m.stat === "damage")).length;

/** 추가 기본 스탯 (baseStats.extraOf): 방어력 */
export function devilExtras(p: PlayerState): Partial<ExtraStats> | null {
  const blood = hasPerk(p, "devilBlood") ? K.devilBlood.defense : 0;
  const spots = hasPerk(p, "devilSpots") ? K.devilSpots.defense + K.devilSpots.per * damageItems(p) : 0;
  return blood || spots ? { defense: blood + spots } : null;
}

/** 주는 피해 배율 (combat.damageEnemy): 풍뎅이 부적(베두인, 보스 +30%) · 뒤집어진 십자가(보스) · 그림 리퍼(방어력 깎기) */
export function devilMul(s: RunState, e: EnemyState): number {
  const p = s.player;
  let m = ENEMIES[e.kind].boss && hasPerk(p, "scarabCharm") ? BEDOUIN_PERKS.scarabCharm.boss : 1;
  if (hasPerk(p, "devilCross") && (ENEMIES[e.kind].boss || e.kind === "dummy")) m *= K.devilCross.boss;
  if (hasPerk(p, "devilReaper")) m *= 1 + K.devilReaper.taken;
  return m;
}

/** 맞힐 때 (hiddenPerks.hiddenOnHit 안, 거기서 난 피해로는 다시 안 터짐): 절규 범위 · 리퍼 낫 */
export function devilOnHit(s: RunState, e: EnemyState, dmg: number): void {
  const p = s.player;
  if (hasPerk(p, "devilScream") && e.hp > 0) {
    blastAt(s, e.x, e.y, K.devilScream.r, dmg * K.devilScream.mul, { exclude: e });
    addEffect(s, { kind: "srScream", x: e.x, y: e.y, dirX: 0, dirY: 0, size: K.devilScream.r, maxTicks: 12 });
  }
  if (hasPerk(p, "devilReaper") && createRng(deriveSeed(s.seed, "reaper", s.tick, e.id)).nextFloat() < K.devilReaper.fx) {
    addEffect(s, { kind: "srScythe", x: e.x, y: e.y, dirX: p.faceX, dirY: p.faceY, size: e.r + 10, maxTicks: 16 });
  }
}

/** 틱마다 (사람마다): 사탄의 가면 — 주기마다 가까운 적에게 죽음의 오라 (오라가 다 오르면 피해, 악의 사도 사탄의 가면과 같은 계산) */
export function devilTick(s: RunState): void {
  const p = s.player;
  if (!hasPerk(p, "devilMask") || p.hp <= 0) return;
  // 악의 사도 무기를 든 동안은 그 무기가 오라를 처리함 (두 번 터지지 않게)
  if (weaponOf(p).kind !== "cross") doomTick(s);
  if (s.tick % K.devilMask.every !== 0) return;
  const m = APOSTLE.mask;
  const near = s.enemies.filter((e) => e.hp > 0 && dist2(e, p) <= (m.radius + e.r) ** 2).sort((a, b) => dist2(a, p) - dist2(b, p) || a.id - b.id);
  for (const e of near.slice(0, m.max)) {
    (p.apDooms ??= []).push({ id: e.id, left: m.rise, dmg: p.stats.damage });
    addEffect(s, { kind: "apAura", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 4, maxTicks: m.rise + 8, tint: SIN_COLORS.mask });
  }
}
