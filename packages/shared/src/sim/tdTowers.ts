// 타워 디펜스 타워: 세우기·레벨 올리기(무기 → 패시브 → 두 번째 무기)·팔기, 틱마다 공격.
// 타워는 제자리에 선 캐릭터. 공격자(무기 하나)마다 run.player·탄·장치·효과를 꺼내 놓고 기존 계산(updatePlayer 등)을 그대로 돌림
import { TILE_SIZE } from "../constants";
import type { CharacterId, WeaponId } from "../content";
import type { PassiveId } from "../items";
import { createRng, deriveSeed } from "../rng";
import { TD_RULES, TD_TOWERS, tdLevelCost, tdPassivePool } from "../tdDefs";
import { TD_GROUND, tdMapDef, tdTiles, type TdMapDef, type TdMapId } from "../tdMaps";
import { removeDead, updatePending } from "./combat";
import { equipWeapon, recalcStats } from "./items";
import { updateLaserGear } from "./laserGear";
import { characterWeapons, pickDistinct } from "./loot";
import { updateMedicGear } from "./medicGear";
import { updateOrbit } from "./orbit";
import { updatePlayer } from "./player";
import { recallChakram } from "./bedouin";
import { updateProjectiles } from "./projectiles";
import { newPlayer } from "./run";
import { updateCharms } from "./talisman";
import { charFree, towerMaxHp } from "./tdHealth";
import type { TdAttacker, TdState, TdTower, TdUpgrade } from "./tdTypes";
import { AIM_DIST_MAX, AIM_DIST_STEP, EMPTY_INPUT, type EnemyState, type RunState, type TickInput } from "./types";
import { dist2 } from "./util";

/**
 * 타워 조준: 사거리 안에서 길을 가장 많이 간 적을 겨누고 공격 (없으면 쉼).
 * 거리도 같이 넣어 던지는 무기(수류탄·지뢰·위성 포 등)가 그 적 자리에 떨어지게
 */
function towerInput(s: RunState): TickInput {
  const p = s.player;
  let best: EnemyState | null = null;
  for (const e of s.enemies) {
    if (e.immune || e.hp <= 0) continue;
    const reach = p.stats.range + e.r;
    if (dist2(e, p) > reach * reach) continue;
    if (!best || (e.tdDist ?? 0) > (best.tdDist ?? 0)) best = e;
  }
  if (!best) return EMPTY_INPUT;
  const dx = best.x - p.x;
  const dy = best.y - p.y;
  const d = Math.sqrt(dx * dx + dy * dy) || 1;
  const steps = Math.min(AIM_DIST_MAX, Math.max(1, Math.round(d / AIM_DIST_STEP)));
  return { ...EMPTY_INPUT, aimX: (dx / d) * 100 * steps, aimY: (dy / d) * 100 * steps, attack: true };
}

const tilesCache = new WeakMap<TdMapDef, number[][]>();
/** 맵의 칸 배열 (한 번 만들어 둠) */
export function mapTiles(mapId: string): number[][] {
  const def = tdMapDef(mapId as TdMapId);
  let t = tilesCache.get(def);
  if (!t) {
    t = tdTiles(def);
    tilesCache.set(def, t);
  }
  return t;
}

export const tileCenter = (v: number) => (v + 0.5) * TILE_SIZE;

export const towerCost = (td: TdState) => TD_RULES.towerCost + TD_RULES.towerCostStep * td.towers.length;

export const towerAt = (td: TdState, col: number, row: number) => td.towers.find((t) => t.col === col && t.row === row);

export function canBuild(td: TdState, col: number, row: number): boolean {
  return mapTiles(td.mapId)[row]?.[col] === TD_GROUND && !towerAt(td, col, row);
}

function attacker(character: CharacterId, col: number, row: number): TdAttacker {
  const p = newPlayer(character, tileCenter(col), tileCenter(row));
  // 버려진 자들 타워는 조합대로 스스로 교대
  if (character === "abandoned") p.abAuto = true;
  return { p, shots: [], devices: [], effects: [], blasts: [] };
}

/** 타워 세우기 (돈이 모자라거나 자리가 안 되면 false) */
export function placeTower(td: TdState, character: CharacterId, col: number, row: number): boolean {
  const cost = towerCost(td);
  // 캐릭터마다 하나만 · 부서진 캐릭터는 재건축이 끝나야 (tdHealth)
  if (td.run.gold < cost || !canBuild(td, col, row) || !charFree(td, character) || td.phase === "won" || td.phase === "lost") return false;
  td.run.gold -= cost;
  const hp = towerMaxHp(1);
  const t: TdTower = { id: td.nextTowerId++, character, col, row, level: 1, spent: cost, atk: [attacker(character, col, row)], dmg: 0, kills: 0, stunTicks: 0, hp, maxHp: hp };
  td.towers.push(t);
  refreshStats(td, t);
  return true;
}

export function sellTower(td: TdState, id: number): void {
  const t = td.towers.find((x) => x.id === id);
  if (!t) return;
  td.run.gold += Math.floor(t.spent * TD_RULES.sellRate);
  td.towers = td.towers.filter((x) => x !== t);
}

/** 다음 레벨에 고를 것 (같은 타워·레벨이면 늘 같은 후보) */
export function nextUpgrade(td: TdState, t: TdTower): TdUpgrade {
  const main = t.atk[0]!.p;
  if (t.level === 1) return { kind: "weapon", options: characterWeapons(t.character) };
  const left = tdPassivePool(t.character).filter((id) => !main.passives.includes(id));
  if (left.length > 0) {
    const rng = createRng(deriveSeed(td.run.seed, "tdPerk", t.id, t.level));
    return { kind: "passive", options: pickDistinct(rng, left, 3) };
  }
  if (t.atk.length < 2) return { kind: "second", options: characterWeapons(t.character).filter((id) => id !== main.weaponId) };
  return { kind: "max" };
}

export const upgradeCost = (t: TdTower) => tdLevelCost(t.level);

/** 레벨 올리기: 후보 중 choice를 골라 돈을 내고 바로 적용 */
export function upgradeTower(td: TdState, id: number, choice: string): boolean {
  const t = td.towers.find((x) => x.id === id);
  if (!t) return false;
  const up = nextUpgrade(td, t);
  const cost = upgradeCost(t);
  if (up.kind === "max" || td.run.gold < cost || !(up.options as string[]).includes(choice)) return false;
  td.run.gold -= cost;
  t.spent += cost;
  t.level++;
  // 레벨이 오르면 최대 체력도 (늘어난 만큼 채움)
  t.hp += towerMaxHp(t.level) - t.maxHp;
  t.maxHp = towerMaxHp(t.level);
  if (up.kind === "weapon") withAttacker(td, t.atk[0]!, () => equipWeapon(td.run, choice as WeaponId));
  else if (up.kind === "second") {
    const a = attacker(t.character, t.col, t.row);
    a.p.passives = [...t.atk[0]!.p.passives];
    t.atk.push(a);
    withAttacker(td, a, () => equipWeapon(td.run, choice as WeaponId));
  } else for (const a of t.atk) a.p.passives.push(choice as PassiveId);
  refreshStats(td, t);
  return true;
}

/** 패시브·무기에서 능력치 다시 계산 + 타워 레벨 공격력 */
export function refreshStats(td: TdState, t: TdTower): void {
  for (const a of t.atk) {
    withAttacker(td, a, () => recalcStats(td.run));
    const tune = TD_TOWERS[t.character];
    a.p.stats.damage *= (1 + TD_RULES.levelDamage * (t.level - 1)) * (tune?.damage ?? 1);
    a.p.stats.attackSpeed *= tune?.attackSpeed ?? 1;
    a.p.stats.range *= tune?.range ?? 1;
    a.p.hp = a.p.stats.maxHp;
  }
}

/** 공격자 하나를 run에 꺼내 놓고 fn (끝나면 탄·장치·효과를 공격자에게 돌려놓음) */
export function withAttacker(td: TdState, a: TdAttacker, fn: () => void): void {
  const s = td.run;
  s.player = a.p;
  s.projectiles = a.shots;
  s.devices = a.devices;
  s.effects = a.effects;
  s.pendingBlasts = a.blasts;
  fn();
  a.shots = s.projectiles;
  a.devices = s.devices ?? [];
  a.effects = s.effects;
  a.blasts = s.pendingBlasts;
  s.player = td.idle;
  s.projectiles = [];
  s.devices = [];
  s.effects = td.worldFx;
  s.pendingBlasts = [];
}

/** 틱마다 모든 타워 공격. 준 피해·처치 수는 타워마다 셈 */
export function updateTowers(td: TdState): void {
  const s = td.run;
  for (const t of td.towers) {
    if (t.stunTicks > 0) t.stunTicks--;
    for (const a of t.atk) {
      const before = new Map(s.enemies.map((e) => [e.id, Math.max(0, e.hp)]));
      const kills = s.kills;
      withAttacker(td, a, () => {
        const p = s.player;
        const hx = tileCenter(t.col);
        const hy = tileCenter(t.row);
        p.prevX = hx;
        p.prevY = hy;
        if (t.stunTicks === 0) updatePlayer(s, towerInput(s));
        recallChakram(p);
        // 제자리 (돌진·반동 기술도 타워는 움직이지 않음)
        p.x = hx;
        p.y = hy;
        p.dashTicks = 0;
        updateLaserGear(s);
        updateOrbit(s);
        updateMedicGear(s);
        updateProjectiles(s);
        updateCharms(s);
        updatePending(s);
        removeDead(s);
      });
      let dmg = 0;
      const now = new Map(s.enemies.map((e) => [e.id, Math.max(0, e.hp)]));
      for (const [id, hp] of before) dmg += hp - (now.get(id) ?? 0);
      t.dmg += Math.max(0, dmg);
      t.kills += s.kills - kills;
    }
  }
}
