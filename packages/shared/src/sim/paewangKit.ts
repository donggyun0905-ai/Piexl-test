// 패왕전 장비: 준비방에서 고른 무기·캐릭터 전용 패시브 5개·사용 아이템 2개 + 공용 패시브 5개는 무작위 · AI는 모두 무작위 · 데스매치는 레벨마다 캐릭터를 바꾸고 모두 무작위
import { type CharacterId, type WeaponId } from "../content";
import { PASSIVE_IDS, PASSIVES, USE_ITEM_IDS, type PassiveDef, type PassiveId } from "../items";
import { PW } from "../paewangDefs";
import { createRng, deriveSeed, type Rng } from "../rng";
import { recalcStats } from "./items";
import { characterWeapons, pickDistinct } from "./loot";
import { xpOnly } from "./morphXp";
import { newPlayer } from "./run";
import { seatNo } from "./party";
import type { PwLoadout } from "./paewangTypes";
import type { RunState } from "./types";

/** 이 캐릭터가 가질 수 있는 패시브: 공용 + 이 캐릭터 전용 (무기 전용은 그 무기를 골랐을 때만) */
function usablePassives(c: CharacterId, weapon: WeaponId): PassiveId[] {
  return PASSIVE_IDS.filter((id) => {
    const def: PassiveDef = PASSIVES[id];
    if (def.special || xpOnly(def) || (def.exclusive !== undefined && def.exclusive !== c)) return false;
    return def.forWeapon === undefined || def.forWeapon === weapon;
  });
}

/** 준비방에서 고를 수 있는 패시브: 이 캐릭터 전용만 */
export function pwPassiveChoices(c: CharacterId, weapon: WeaponId): PassiveId[] {
  return usablePassives(c, weapon).filter((id) => (PASSIVES[id] as PassiveDef).exclusive === c);
}

/** 전투에 나가면 무작위로 받는 공용 패시브 후보 */
const commonPassives = (c: CharacterId, weapon: WeaponId) => usablePassives(c, weapon).filter((id) => (PASSIVES[id] as PassiveDef).exclusive === undefined);

/** pool에서 규칙대로(같은 것 3개 · 효과 아이템 하나) n개 */
function pickPassives(rng: Rng, pool: PassiveId[], n: number, have: PassiveId[] = []): PassiveId[] {
  const out: PassiveId[] = [];
  for (let k = 0; k < 40 && out.length < n && pool.length > 0; k++) {
    const id = rng.pick(pool);
    if ([...have, ...out].filter((x) => x === id).length < pwStackMax(id)) out.push(id);
  }
  return out;
}

/** 여러 개 가질 수 있는지 (공격 방식을 바꾸는 효과 아이템은 하나만) */
export const pwCanStack = (id: PassiveId): boolean => !(PASSIVES[id] as PassiveDef).effect;

/** 이 패시브를 몇 개까지 가질 수 있는지 (효과 아이템 1 · 나머지 3) */
export const pwStackMax = (id: PassiveId): number => (pwCanStack(id) ? PW.stackMax : 1);

/** 패왕전에서 쓸 수 없는 무기: 오니 히든 무기 (최대 체력·재생력에 비례해 한 방에 끝남) */
const PW_NO_WEAPONS: readonly WeaponId[] = ["blackThunder", "azureThunder"];

/** 패왕전에서 이 캐릭터가 쓸 수 있는 무기 */
export const pwWeapons = (c: CharacterId): WeaponId[] => characterWeapons(c).filter((id) => !PW_NO_WEAPONS.includes(id));

/** 고른 것이 규칙에 맞는지: 이 캐릭터 무기 · 전용 패시브 5개 이하(같은 것은 3개까지, 효과 아이템은 하나) · 서로 다른 사용 아이템 2개 이하 */
export function pwLoadoutOk(c: CharacterId, lo: PwLoadout): boolean {
  if (!pwWeapons(c).includes(lo.weapon)) return false;
  const ok = pwPassiveChoices(c, lo.weapon);
  if (lo.passives.length > PW.passives || lo.passives.some((id) => !ok.includes(id))) return false;
  if (lo.passives.some((id) => lo.passives.filter((x) => x === id).length > pwStackMax(id))) return false;
  if (new Set(lo.uses).size !== lo.uses.length) return false;
  return lo.uses.length <= PW.uses && lo.uses.every((id) => USE_ITEM_IDS.includes(id));
}

/** AI 장비: 이 캐릭터가 쓸 수 있는 무기 하나 · 전용 패시브 5개(규칙대로) · 서로 다른 사용 아이템 2개 (판 시드로) */
export function randomLoadout(c: CharacterId, rng: Rng): PwLoadout {
  const weapon = rng.pick(pwWeapons(c));
  return { weapon, passives: pickPassives(rng, pwPassiveChoices(c, weapon), PW.passives), uses: pickDistinct(rng, USE_ITEM_IDS, PW.uses) };
}

/** 준비방에서 고른 것 넣기 (규칙에 맞지 않으면 처음 무기만) + 공용 패시브 5개는 무작위 (자리마다 판 시드로) */
export function applyLoadout(s: RunState, lo: PwLoadout): void {
  const p = s.player;
  if (pwLoadoutOk(p.characterId, lo)) {
    p.weaponId = lo.weapon;
    p.passives.push(...lo.passives);
    lo.uses.forEach((id, i) => (p.useSlots[i] = id));
  }
  const rng = createRng(deriveSeed(s.seed, "pwCommon", seatNo(s), s.tick));
  p.passives.push(...pickPassives(rng, commonPassives(p.characterId, p.weaponId), PW.randomPassives, p.passives));
  recalcStats(s);
  p.hp = p.stats.maxHp;
}

/** 데스매치: 지금 자리 캐릭터를 바꾸고 무기·패시브·사용 아이템을 모두 무작위로 (자리는 그대로) · salt: 자리·레벨 */
export function gunSwap(s: RunState, c: CharacterId, salt: number): void {
  const old = s.player;
  const p = newPlayer(c, old.x, old.y);
  p.prevX = old.prevX;
  p.prevY = old.prevY;
  p.invulnTicks = Math.max(old.invulnTicks, 30);
  s.player = p;
  s.devices = [];
  // 앞 캐릭터가 쏜 탄은 정리 (직업마다 탄 모양이 달라서)
  s.projectiles = s.projectiles.filter((pr) => !pr.fromPlayer || pr.shooter !== seatNo(s));
  applyLoadout(s, randomLoadout(c, createRng(deriveSeed(s.seed, "pwKit", salt, s.tick))));
}
