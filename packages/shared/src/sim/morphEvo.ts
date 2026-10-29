// 변희 각성: 든 동물의 전용 아이템 셋을 모두 가지면 그 동물이 각성 (하이울프·폭군 곰·폭풍 독수리·바실리스크·철갑 멧돼지 왕·사막의 제왕·흡혈 박쥐왕·매머드 왕·여왕 거미·태양 불사조)
// 크고 멋진 갑옷 모습 · 최대 체력 +20 · 사거리 +25% · 공격력 +3 · 방어력 +20 · 공격 속도 +25% · 공격할 때 20% 확률로 각성 기술
// 한 번 각성한 동물의 기술은 다른 동물을 들어도 계속 나옴 (여럿이면 그중 하나). 독수리는 공중으로 날아 방 끝에서 끝까지 세 번 내리긋고,
// 불사조는 둘레에 큰 열기를 피워 안의 적에게 불꽃을 겹겹이 (x1~x5, 겹칠수록 센 화상)
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";
import { WEAPONS, type WeaponDef } from "../content";
import { PASSIVE_IDS, PASSIVES, type PassiveDef } from "../items";
import { createRng, deriveSeed } from "../rng";
import type { StatMod } from "../stats";
import type { AnimalKind } from "../weaponsMorph";
import { healPlayer, ignite } from "./combat";
import { alive, inCircle, inCone, inLine, poison, root, stun, strike } from "./s2Kit";
import type { PlayerState, RunState } from "./types";
import { addEffect, dist2, weaponOf } from "./util";
import { addFlame } from "./flames";

/** 각성 수치: 능력치 · 기술 확률 · 공중 습격(내리긋기 수·한 번 틱·폭·피해 배율) */
/** 방어력은 묵인과 같은 방식 (받는 피해 × (1 - 방어력/100)) · 불사조 열기: 지속 틱 · 반경 · 불꽃이 겹치는 간격 · 화상 배율 */
export const MORPH_EVO = { hp: 20, range: 1.25, damage: 3, def: 20, speed: 1.25, chance: 0.2, passes: 3, passTicks: 18, raidWidth: 12, raidMul: 1.5, heatTicks: 300, heatR: 64, heatEvery: 30, heatMul: 0.6 } as const;

/** 동물(무기 id) 전용 아이템 셋을 모두 가졌는지 */
function owns(p: PlayerState, weaponId: string): boolean {
  const own = PASSIVE_IDS.filter((id) => (PASSIVES[id] as PassiveDef).forWeapon === weaponId);
  return own.length > 0 && own.every((id) => p.passives.includes(id));
}

/** 지금 든 동물이 각성했는지 (그 동물 전용 아이템 셋을 모두 가짐) */
export function morphEvolved(p: PlayerState): boolean {
  if (p.characterId !== "byeonhui") return false;
  const w = weaponOf(p);
  return !!w.animal && owns(p, w.id);
}

/** 한 번이라도 각성한 동물들 (지금 든 동물이 아니어도) */
export function evolvedAnimals(p: PlayerState): AnimalKind[] {
  if (p.characterId !== "byeonhui") return [];
  return (Object.values(WEAPONS) as WeaponDef[]).filter((w) => w.animal && owns(p, w.id)).map((w) => w.animal!);
}

/** 각성 능력치 (sim/items.recalcStats) */
export function morphMods(p: PlayerState): StatMod[] {
  if (!morphEvolved(p)) return [];
  return [{ stat: "maxHp", add: MORPH_EVO.hp }, { stat: "range", mul: MORPH_EVO.range }, { stat: "damage", add: MORPH_EVO.damage }, { stat: "attackSpeed", mul: MORPH_EVO.speed }];
}

/** 각성 방어력: 받는 피해 배율 */
export const evoTaken = (p: PlayerState) => (morphEvolved(p) ? 1 - MORPH_EVO.def / 100 : 1);
/** 패왕전 각성 방어력은 절반만 (각성하면 혼자 무쌍이 되지 않게) */
export const evoTakenPvp = (p: PlayerState) => (morphEvolved(p) ? 1 - MORPH_EVO.def / 200 : 1);

/** 불사조 열기 한 틱: 둘레 적에게 불꽃 겹치기 + 센 화상 */
export function heatTick(s: RunState): void {
  const p = s.player;
  if ((p.mHeat ?? 0) <= 0) return;
  p.mHeat!--;
  if (p.mHeat! % MORPH_EVO.heatEvery !== 0) return;
  for (const e of inCircle(s, p.x, p.y, MORPH_EVO.heatR)) ignite(e, p.stats.damage * MORPH_EVO.heatMul * addFlame(s, e));
  addEffect(s, { kind: "mEvo", x: p.x, y: p.y, dirX: 9, dirY: 1, size: MORPH_EVO.heatR, maxTicks: MORPH_EVO.heatEvery });
}

/** 공중 습격 시작 (변희 독수리·불사조 · 플라이 하늘 습격). n: 내리긋기 수 · mul: 한 번 피해 배율 · gap: 한 번 사이 틱 */
export function startRaid(s: RunState, dmg: number, n: number = MORPH_EVO.passes, mul: number = MORPH_EVO.raidMul, gap: number = MORPH_EVO.passTicks): void {
  const p = s.player;
  p.mRaid = { n, t: gap, dmg, x: p.x, y: p.y, mul, gap };
  addEffect(s, { kind: "ring", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 18, maxTicks: 14, width: 2 });
}

/** 공중 습격 한 틱: 숨어 있다가 한 번 내리그을 때마다 방을 가로지르는 선 위 적을 꿰뚫음. 끝나면 true */
export function raidTick(s: RunState): boolean {
  const p = s.player;
  const r = p.mRaid;
  if (!r) return true;
  p.invulnTicks = Math.max(p.invulnTicks, 2);
  r.t--;
  if (r.t > 0) return false;
  // 한 번 내리긋기: 방의 한쪽 끝에서 반대쪽 끝까지 (적이 있으면 그 적을 지나가게)
  const rng = createRng(deriveSeed(s.seed, "raid", s.tick, r.n));
  const list = alive(s);
  const via = list.length ? list[rng.int(0, list.length - 1)]! : { x: (ROOM_MIN_X + ROOM_MAX_X) / 2, y: (ROOM_MIN_Y + ROOM_MAX_Y) / 2 };
  const a = rng.nextFloat() * Math.PI;
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  const span = Math.hypot(ROOM_MAX_X - ROOM_MIN_X, ROOM_MAX_Y - ROOM_MIN_Y);
  const from = { x: via.x - dx * span, y: via.y - dy * span };
  const fire = weaponOf(p).animal === "phoenix";
  const save = { x: p.x, y: p.y };
  p.x = from.x;
  p.y = from.y;
  for (const e of inLine(s, span * 2, MORPH_EVO.raidWidth, dx, dy)) {
    strike(s, e, r.dmg * (r.mul ?? MORPH_EVO.raidMul));
    if (fire) ignite(e, r.dmg);
  }
  p.x = save.x;
  p.y = save.y;
  addEffect(s, { kind: "mRaid", x: from.x, y: from.y, dirX: fire ? 1 : 0, dirY: 0, size: MORPH_EVO.raidWidth, toX: from.x + dx * span * 2, toY: from.y + dy * span * 2, maxTicks: Math.max(12, Math.min(16, (r.gap ?? 16) + 4)) });
  r.n--;
  r.t = r.gap ?? MORPH_EVO.passTicks;
  if (r.n > 0) return false;
  delete p.mRaid;
  addEffect(s, { kind: "slam", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 24, maxTicks: 14 });
  return true;
}

/** 각성 기술: 각성한 동물들 중 하나 (지금 동물이 아니어도). 쓰면 true */
export function evoSkill(s: RunState, dmg: number): boolean {
  const p = s.player;
  const list = evolvedAnimals(p);
  if (!list.length) return false;
  const rng = createRng(deriveSeed(s.seed, "morphEvo", s.tick, p.attackCount));
  if (rng.nextFloat() >= MORPH_EVO.chance) return false;
  const animal = list[rng.int(0, list.length - 1)]!;
  const near = alive(s)
    .filter((e) => dist2(e, p) <= (p.stats.range * 3) ** 2)
    .sort((a, b) => dist2(a, p) - dist2(b, p) || a.id - b.id);
  const fx = (x: number, y: number, size: number) => addEffect(s, { kind: "mEvo", x, y, dirX: ["wolf", "bear", "eagle", "snake", "boar", "scorpion", "bat", "elephant", "spider", "phoenix"].indexOf(animal), dirY: 0, size, maxTicks: 22 });
  switch (animal) {
    case "eagle":
      startRaid(s, dmg);
      return true;
    case "phoenix":
      // 태양의 열기: 둘레에 큰 열기 (heatTick)
      p.mHeat = MORPH_EVO.heatTicks;
      fx(p.x, p.y, MORPH_EVO.heatR);
      return true;
    case "wolf":
      // 그림자 늑대 셋이 가까운 적에게 덮침
      for (const e of near.slice(0, 3)) {
        strike(s, e, dmg * 2);
        fx(e.x, e.y, 10);
      }
      return near.length > 0;
    case "bear":
      for (const e of inCircle(s, p.x, p.y, 60)) {
        strike(s, e, dmg * 2.5, 14);
        stun(e, 40);
      }
      fx(p.x, p.y, 60);
      return true;
    case "snake":
      // 석화의 눈: 앞쪽 넓게 굳힘 + 독
      for (const e of inCone(s, p.stats.range * 2, 0.3)) {
        stun(e, 60);
        poison(e, dmg * 0.6, 180);
      }
      fx(p.x + p.faceX * 30, p.y + p.faceY * 30, 30);
      return true;
    case "boar":
      // 땅을 울리는 돌진: 앞으로 긴 줄 전부
      for (const e of inLine(s, p.stats.range * 3, 14)) strike(s, e, dmg * 2.5, 20);
      fx(p.x + p.faceX * 40, p.y + p.faceY * 40, 20);
      return true;
    case "scorpion":
      for (const e of near.slice(0, 6)) {
        strike(s, e, dmg * 1.2);
        stun(e, 30);
        poison(e, dmg * 0.3, 150);
        fx(e.x, e.y, 8);
      }
      return near.length > 0;
    case "bat": {
      let dealt = 0;
      for (const e of inCircle(s, p.x, p.y, 70)) {
        strike(s, e, dmg * 1.2);
        dealt += dmg * 1.2;
      }
      healPlayer(s, dealt * 0.1);
      fx(p.x, p.y, 70);
      return true;
    }
    case "elephant":
      // 대지진: 세 겹 충격파
      for (const [i, r] of [40, 70, 100].entries()) s.pendingBlasts.push({ tick: s.tick + i * 12, x: p.x, y: p.y, radius: r, damage: dmg * 1.5 });
      fx(p.x, p.y, 100);
      return true;
    case "spider":
      for (const e of near.slice(0, 8)) {
        root(e, 90);
        strike(s, e, dmg);
      }
      fx(p.x, p.y, p.stats.range * 1.5);
      return near.length > 0;
  }
}
