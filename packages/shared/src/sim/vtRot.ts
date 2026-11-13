// 베르 한 대 (nrKit.nrHit가 on.vt일 때 부름 · nrKit을 불러오지 않음, 서로 불러오는 순환을 피함)
// 녹독: 독이 2배 빨리 들어가고 들어갈수록 세짐 · 출혈 · 부식(받는 피해 증가) · 화상 · 맞을 때마다 확률로 씨앗 → 씨앗이 독을 45번 받으면 발아
import { VT_DOTS as T, VT_EXTRA as X, VT_POISON as PO, VT_SEED as SD } from "../itemsVert";
import { createRng, deriveSeed } from "../rng";
import { ashDot } from "./ashDot";
import { bjAlive } from "./bjKit";
import { damageEnemy as damageEnemy_, healPlayer } from "./combat";
import { srcFn, srcRun } from "./dmgSrc";
import { ignite } from "./status";
import type { EnemyState, RunState } from "./types";
import type { VtOn, VtPlant } from "./vtTypes";
import { addEffect, normalize } from "./util";

const damageEnemy = srcFn("vert", () => damageEnemy_);

/** 시드 확률 (nrKit.nrRoll과 같은 칸을 씀) */
export function vtRoll(s: RunState, tag: string): number {
  const p = s.player;
  p.nrRolls = (p.nrRolls ?? 0) + 1;
  return createRng(deriveSeed(s.seed, tag, s.tick, p.nrRolls)).nextFloat();
}

/** 받는 피해 배율: 부식 겹마다 +2% */
export const vtTaken = (e: EnemyState) => 1 + (e.vtRot ?? 0) * T.rotTaken;

/** 녹독의 독 걸기 (다시 걸면 시간만 새로, 세진 몫은 그대로) */
export function vtPoison(s: RunState, e: EnemyState): void {
  if (!bjAlive(e) || e.immune) return;
  if ((e.vtPoi ?? 0) <= s.tick) e.vtPoiN = 0;
  e.vtPoi = s.tick + PO.ticks;
  e.vtPoiDmg = Math.max(e.vtPoiDmg ?? 0, s.player.stats.damage * PO.per);
}

/** 상태이상 묶음 걸기: 독 · 출혈 · 화상 · 부식 · 느려짐 */
export function vtAfflict(s: RunState, e: EnemyState, on: VtOn): void {
  if (!bjAlive(e) || e.immune) return;
  const D = s.player.stats.damage;
  if (on.poi) vtPoison(s, e);
  if (on.bleed) {
    e.vtBleed = s.tick + T.bleedTicks;
    e.vtBleedDmg = Math.max(e.vtBleedDmg ?? 0, D * T.bleedPer);
  }
  if (on.burn) ignite(e, D);
  if (on.rot) {
    e.vtRot = Math.min(T.rotMax, (e.vtRot ?? 0) + 1);
    e.vtRotEnd = s.tick + T.rotTicks;
  }
  if (on.slow) e.slowTicks = Math.max(e.slowTicks ?? 0, on.slow);
}

/** 씨앗 n겹 심기 (최대 겹) */
export function vtPlantSeed(s: RunState, e: EnemyState, n = 1): void {
  if (!bjAlive(e)) return;
  const was = e.vtSeed ?? 0;
  e.vtSeed = Math.min(SD.max, was + n);
  e.vtSeedN ??= 0;
  if (!was) addEffect(s, { kind: "vtSprout", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 4, style: 1, maxTicks: 14 });
}

/** 방에 남는 것 하나 (같은 종류가 최대 수를 넘으면 오래된 것부터 사라짐) */
export function vtAddPlant(s: RunState, kind: VtPlant["kind"], x: number, y: number, life: number, max: number): void {
  const list = (s.player.vtPlants ??= []);
  list.push({ kind, x, y, until: s.tick + life, next: s.tick + 20 });
  const mine = list.filter((f) => f.kind === kind);
  if (mine.length > max) s.player.vtPlants = list.filter((f) => f !== mine[0]);
}

/** 발아에 더 붙는 것: 효과 그림 · 체내 개화 꽃 · 생명 착취 회복 · 시든 육신 덩굴 */
export interface Sprout {
  fx?: "vtSeed" | "vtBloom" | "vtDrain" | "vtWither";
  gas?: boolean;
  heal?: boolean;
  vine?: boolean;
  /** 쓰러지면 시든 육신 (종언의 생명수확) */
  vineOnKill?: boolean;
}

/** 발아: 씨앗 겹마다 큰 한 방 → 출혈·독·화상 · 씨앗이 사라짐 · 준 피해 */
export function vtSprout(s: RunState, e: EnemyState, mul = 1, o: Sprout = {}): number {
  const n = e.vtSeed ?? 0;
  if (n <= 0 || !bjAlive(e)) return 0;
  delete e.vtSeed;
  delete e.vtSeedN;
  const p = s.player;
  const [x, y] = [e.x, e.y];
  const hp = e.hp;
  const d = normalize(e.x - p.x, e.y - p.y) ?? [p.faceX, p.faceY];
  damageEnemy(s, e, p.stats.damage * SD.burst * n * mul * vtTaken(e), d[0], d[1], false);
  const dealt = hp - Math.max(0, e.hp);
  vtAfflict(s, e, { poi: true, bleed: true, burn: true });
  addEffect(s, { kind: o.fx ?? "vtSprout", x, y, dirX: 0, dirY: 0, size: e.r + 26, maxTicks: o.fx ? 30 : 20 });
  if (o.heal && dealt > 0) healPlayer(s, dealt * X.heal);
  if (o.gas) vtAddPlant(s, "gas", x, y, X.gas.life, X.gas.max);
  if (o.vine || (o.vineOnKill && e.hp <= 0)) vtAddPlant(s, "vine", x, y, X.vine.life, X.vine.max);
  return dealt;
}

/** 베르 한 대: 부식만큼 더 · 상태이상 · 확률로 씨앗 · 준 피해 */
export function vtHit(s: RunState, e: EnemyState, dmg: number, on: VtOn): number {
  const p = s.player;
  const d = normalize(e.x - p.x, e.y - p.y) ?? [p.faceX, p.faceY];
  const hp = e.hp;
  damageEnemy(s, e, dmg * vtTaken(e), d[0], d[1], false);
  if (!bjAlive(e)) return hp - Math.max(0, e.hp);
  vtAfflict(s, e, on);
  if (vtRoll(s, "vtSeed") < SD.chance) vtPlantSeed(s, e);
  return hp - Math.max(0, e.hp);
}

/** 틱마다: 독(빠르고 점점 셈) → 씨앗이 받은 독 수 · 다 차면 발아 · 출혈 · 부식 */
export function vtRotTick(s: RunState): void {
  const D = s.player.stats.damage;
  for (const e of s.enemies) {
    if (!bjAlive(e)) continue;
    if ((e.vtPoi ?? 0) > s.tick && (e.vtPoi! - s.tick) % PO.every === 0) {
      const n = (e.vtPoiN = (e.vtPoiN ?? 0) + 1);
      ashDot(s, e, "poison", (e.vtPoiDmg ?? 0) * (1 + Math.min(PO.rampMax, PO.ramp * n)) * vtTaken(e));
      if (e.vtSeed && (e.vtSeedN = (e.vtSeedN ?? 0) + 1) >= SD.need) srcRun(s, "k:vtSeed", () => vtSprout(s, e));
    }
    if ((e.vtBleed ?? 0) > s.tick && (e.vtBleed! - s.tick) % T.bleedEvery === 0) ashDot(s, e, "bleed", (e.vtBleedDmg ?? 0) * vtTaken(e));
    if (e.vtRot) {
      if ((e.vtRotEnd ?? 0) <= s.tick) delete e.vtRot;
      else if ((e.vtRotEnd! - s.tick) % 30 === 0) ashDot(s, e, "rot", D * T.rotPer * e.vtRot);
    }
  }
}
