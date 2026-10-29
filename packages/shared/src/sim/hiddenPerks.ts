// 히든 패시브 효과 (itemsHidden): 금기된 아티팩트 7색(처치마다 쌓임) · 이프리트의 발톱 · 실피드의 화살통 · 노움의 망치 · 드라이어드의 수정구 · 아프로디테의 거울 · 떨어진 신의 파편
// 맞힐 때(onHitExtra) · 처치할 때(removeDead) · 맞을 때(origin.readyCounter) · 틱마다(origin.tickOrigin)
import type { ExtraStats } from "../characters";
import { HIDDEN_PERKS as K } from "../itemsHidden";
import { createRng, deriveSeed } from "../rng";
import type { StatMod } from "../stats";
import { blastAt, damageEnemy, healPlayer } from "./combat";
import { recalcStats } from "./items";
import { addAlly, alliesTick } from "./allies";
import { kingFormTick } from "./kingForm";
import { cupidTick } from "./spiritGreat";
import { storms } from "./oni";
import { stun } from "./s2Kit";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, hasPerk } from "./util";

/** 아티팩트 색 (스택 창 차례) */
export const RELICS = ["relicRed", "relicBlue", "relicSilver", "relicGold", "relicPrism", "relicWhite", "relicGreen"] as const;
export type RelicId = (typeof RELICS)[number];

const stacks = (p: PlayerState, id: RelicId) => (hasPerk(p, id) ? (p.relics?.[id] ?? 0) : 0);
const roll = (s: RunState, tag: string, n: number) => createRng(deriveSeed(s.seed, tag, s.tick, n)).nextFloat();

/** 떨어진 신의 파편으로 얻은 힘 (처음 계산할 때 시드로 정함) */
function shard(s: RunState): number {
  const p = s.player;
  if (!hasPerk(p, "godShard")) return -1;
  p.shardPick ??= createRng(deriveSeed(s.seed, "godShard", s.tick)).int(0, 9);
  return p.shardPick;
}

/** 능력치로 바뀌는 것 (recalcStats): 적색 공격력 · 청색 공격 속도 · 백색 체력 · 신의 파편 */
export function hiddenMods(s: RunState): StatMod[] {
  const p = s.player;
  const out: StatMod[] = [];
  if (stacks(p, "relicRed")) out.push({ stat: "damage", add: stacks(p, "relicRed") * K.relicRed.per });
  if (stacks(p, "relicBlue")) out.push({ stat: "attackSpeed", mul: 1 + stacks(p, "relicBlue") * K.relicBlue.per });
  if (stacks(p, "relicWhite")) out.push({ stat: "maxHp", add: stacks(p, "relicWhite") * K.relicWhite.per });
  const g = K.godShard;
  const mods: (StatMod | null)[] = [{ stat: "damage", mul: g.damage }, { stat: "attackSpeed", mul: g.speed }, null, null, { stat: "moveSpeed", add: g.move }, null, null, null, { stat: "luck", add: g.luck }, { stat: "range", add: g.range }];
  const m = mods[shard(s)];
  if (m) out.push(m);
  // 운명의 주사위 6 · 저주받은 주사위 보물
  const six = p.fateSix ?? 0;
  if (six) out.push({ stat: "damage", add: K.fateSix.damage * six }, { stat: "attackSpeed", mul: 1 + K.fateSix.speed * six }, { stat: "maxHp", add: K.fateSix.hp * six });
  const w = K.curseWin;
  if (p.curseWin) out.push({ stat: "damage", add: w.damage }, { stat: "attackSpeed", mul: 1 + w.speed }, { stat: "maxHp", add: w.hp });
  return out;
}

/** 추가 기본 스탯으로 더해지는 것 (baseStats.extraOf): 은색 방어력 · 금색 치명타 · 화려한 치명타 피해 · 녹색 재생력 · 신의 파편 */
export function hiddenExtras(p: PlayerState): Partial<ExtraStats> | null {
  if (!p.relics && p.shardPick === undefined && !p.fateSix && !p.curseWin) return null;
  const g = K.godShard;
  const six = p.fateSix ?? 0;
  const w = p.curseWin ? K.curseWin : null;
  const f = K.fateSix;
  const pick = hasPerk(p, "godShard") ? (p.shardPick ?? -1) : -1;
  return {
    defense: stacks(p, "relicSilver") * K.relicSilver.per + (pick === 2 ? g.defense : 0) + f.defense * six + (w?.defense ?? 0),
    regen: stacks(p, "relicGreen") * K.relicGreen.per + (pick === 3 ? g.regen : 0) + f.regen * six + (w?.regen ?? 0),
    critChance: stacks(p, "relicGold") * K.relicGold.per + (pick === 5 ? g.crit : 0) + f.crit * six + (w?.crit ?? 0),
    critDamage: stacks(p, "relicPrism") * K.relicPrism.per + (pick === 6 ? g.critDmg : 0) + (w?.critDmg ?? 0),
    sharpness: pick === 7 ? g.sharp : 0,
  };
}

/** 처치할 때: 가진 아티팩트마다 한 칸 */
export function relicKill(s: RunState): void {
  const p = s.player;
  let recalc = false;
  for (const id of RELICS) {
    if (!hasPerk(p, id)) continue;
    (p.relics ??= {})[id] = (p.relics[id] ?? 0) + 1;
    if (id === "relicRed" || id === "relicBlue" || id === "relicWhite") recalc = true;
  }
  if (recalc) recalcStats(s);
}

let busy = false;

/** 맞힐 때 (damageEnemy → onHitExtra): 화상 · 회오리 · 범위 공격. 거기서 난 피해로는 다시 안 터짐 */
export function hiddenOnHit(s: RunState, e: EnemyState, dmg: number): void {
  const p = s.player;
  if (busy || dmg <= 0) return;
  busy = true;
  if (hasPerk(p, "ifritClaw")) {
    const k = K.ifritClaw;
    e.ifrit = Math.min(k.stacks, (e.ifrit ?? 0) + 1);
    e.burnTicks = k.ticks;
    e.burnDmg = Math.max(e.burnDmg ?? 0, p.stats.damage * k.burn * e.ifrit);
  }
  if (hasPerk(p, "sylphQuiver") && (p.oStorms?.length ?? 0) < 4 && roll(s, "sylph", e.id) < K.sylphQuiver.chance) {
    (p.oStorms ??= []).push({ x: e.x, y: e.y, prevX: e.x, prevY: e.y, ticks: K.sylphQuiver.ticks, dmg: p.stats.damage * K.sylphQuiver.mul, cd: 0 });
  }
  if (hasPerk(p, "blizzardLance") && s.tick >= (p.lanceAt ?? 0) && roll(s, "lance", e.id) < K.blizzardLance.chance) launchLances(s, e);
  if (hasPerk(p, "gnomeHammer") && e.hp > 0) {
    blastAt(s, e.x, e.y, K.gnomeHammer.r, dmg * K.gnomeHammer.mul, { exclude: e });
    addEffect(s, { kind: "hdQuake", x: e.x, y: e.y, dirX: 0, dirY: 0, size: K.gnomeHammer.r, maxTicks: 12 });
  }
  busy = false;
}

/** 블리자드 랜스: 다섯 창이 한 줄로 적에게 돌진했다가 돌아옴 */
function launchLances(s: RunState, e: EnemyState): void {
  const p = s.player;
  const k = K.blizzardLance;
  const d = Math.hypot(e.x - p.x, e.y - p.y) || 1;
  const dx = (e.x - p.x) / d;
  const dy = (e.y - p.y) / d;
  const ticks = Math.ceil(Math.max(60, d + 20) / k.speed);
  p.lanceAt = s.tick + k.cd;
  p.lanceOut = s.tick + ticks * 2;
  for (let i = 0; i < 5; i++) {
    const x = p.x - dx * i * 7;
    const y = p.y - 8 - dy * i * 7;
    s.projectiles.push({ id: s.nextId++, fromPlayer: true, x, y, prevX: x, prevY: y, r: 3, vx: dx * k.speed, vy: dy * k.speed, damage: p.stats.damage * k.mul, ticksLeft: ticks, pierce: 99, hitIds: [], back: true, span: ticks, lance: true });
  }
}

/** 얼음 창이 맞았을 때: 20%로 빙결 (작은 피해 + 경직) */
export function lanceHit(s: RunState, e: EnemyState): void {
  const k = K.blizzardLance;
  if (e.hp <= 0 || roll(s, "freeze", e.id) >= k.freeze) return;
  stun(e, k.freezeTicks);
  e.hp -= s.player.stats.damage * k.freezeMul;
  addEffect(s, { kind: "hdFreeze", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 6, maxTicks: k.freezeTicks });
}

/** 맞을 때: 아프로디테의 거울 (앞쪽으로 받은 피해 2배 빛 레이저) */
export function hiddenHurt(s: RunState, taken: number): void {
  const p = s.player;
  if (!hasPerk(p, "aphroditeMirror") || taken <= 0 || roll(s, "mirror", 0) >= K.aphroditeMirror.chance) return;
  const { len, width, mul } = K.aphroditeMirror;
  for (const e of s.enemies) {
    if (e.hp <= 0) continue;
    const dx = e.x - p.x;
    const dy = e.y - p.y;
    const along = dx * p.faceX + dy * p.faceY;
    const side = Math.abs(dx * -p.faceY + dy * p.faceX);
    if (along > 0 && along < len && side < width + e.r) damageEnemy(s, e, taken * mul, p.faceX, p.faceY);
  }
  addEffect(s, { kind: "hdMirror", x: p.x + p.faceX * 10, y: p.y - 4 + p.faceY * 10, dirX: p.faceX, dirY: p.faceY, size: len, maxTicks: 24, width });
}

/** 틱마다: 드라이어드의 수정구 · 오니가 아닐 때 실피드 회오리 */
export function hiddenTick(s: RunState): void {
  const p = s.player;
  const d = K.dryadOrb;
  if (hasPerk(p, "dryadOrb") && s.tick % d.every === 0 && p.hp > 0 && p.hp < p.stats.maxHp && roll(s, "dryad", 0) < d.chance) {
    healPlayer(s, p.stats.maxHp * d.heal);
    addEffect(s, { kind: "hdLeaf", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 12, maxTicks: 30 });
  }
  if (p.characterId !== "oni" && p.oStorms) storms(s);
  // 거짓된 용사: 풋내기 동료가 없으면 (처음 얻음 · 쓰러진 뒤 다음 층) 부름
  if (hasPerk(p, "falseHero") && p.heroFloor !== s.floor && !p.allies?.some((a) => a.kind === "hero")) {
    p.heroFloor = s.floor;
    addAlly(s, "hero");
  }
  alliesTick(s);
  cupidTick(s);
  kingFormTick(s);
}

/** 스택 창 (화면): 가진 아티팩트와 쌓인 수 */
export function relicStacks(p: PlayerState): { id: RelicId; n: number }[] {
  return RELICS.filter((id) => hasPerk(p, id)).map((id) => ({ id, n: p.relics?.[id] ?? 0 }));
}
