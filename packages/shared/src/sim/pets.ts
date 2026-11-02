// 야수의 고양이: 가까운 적에게 달려가 할퀴고, 적이 없으면 주인 곁을 따라다님. 사자는 크고 느리지만 둘레까지 물어뜯고, 그림자 고양이는 적 옆으로 순간이동
import type { PetKind } from "../content";
import type { Pet } from "./beastTypes";
import { blastAt, damageEnemy, healPlayer } from "./combat";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, dist2, DIR16, hasPerk, keepInRoom, normalize, roomGrid, weaponOf } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 적을 찾는 거리 (주인 기준) · 너무 멀어지면 주인 곁으로 · 사자 둘레 범위 */
  SEEK: 130,
  LEASH: 170,
  LION_AREA: 16,
  /** 샤프 클로·포효·사냥 본능·골골송·생선 간식 */
  SHARP_MUL: 1.3,
  ROAR_MUL: 1.5,
  INSTINCT_MUL: 1.3,
  PURR_HEAL: 0.3,
  /** 무리의 우두머리: 고양이 한 마리당 공격 속도 */
  LEADER_SPEED: 0.05,
};
export { R as PETS_RULES };

/** 고양이 종류마다: 빠르기 · 할퀴기 간격(틱) · 공격력 배율 · 몸 크기 */
export const PET_STATS: Record<PetKind, { speed: number; every: number; mul: number; r: number }> = {
  cat: { speed: 1.7, every: 40, mul: 0.6, r: 3 },
  lion: { speed: 1.2, every: 70, mul: 2.2, r: 5 },
  shadow: { speed: 1.5, every: 45, mul: 0.7, r: 3 },
};

/** 이 무기·아이템으로 데리고 다닐 고양이 (무기 고양이 + 한 마리 더마다 고양이) */
export function petKinds(p: PlayerState): PetKind[] {
  const w = weaponOf(p);
  if (w.kind !== "beast") return [];
  const extra = p.passives.filter((id) => id === "extraCat").length;
  return [...(w.pets ?? []), ...Array<PetKind>(extra).fill("cat")];
}

/** 사냥 본능: 체력 절반 이하 적에게 피해 증가 */
export function instinct(p: PlayerState, e: EnemyState): number {
  return hasPerk(p, "hunterInstinct") && e.hp <= e.maxHp * 0.5 ? R.INSTINCT_MUL : 1;
}

/** 무리의 우두머리: 공격 속도 배율 */
export function beastSpeedMul(p: PlayerState): number {
  return hasPerk(p, "packLeader") ? 1 + R.LEADER_SPEED * (p.pets?.length ?? 0) : 1;
}

function nearest(s: RunState, x: number, y: number): EnemyState | null {
  const p = s.player;
  let best: EnemyState | null = null;
  let bestD = Infinity;
  for (const e of s.enemies) {
    if (e.hp <= 0 || e.immune || e.pwHid || dist2(e, p) > R.SEEK * R.SEEK) continue;
    const d = (e.x - x) * (e.x - x) + (e.y - y) * (e.y - y);
    if (d < bestD) {
      bestD = d;
      best = e;
    }
  }
  return best;
}

/** 틱마다: 고양이 수 맞추기 · 움직이기 · 할퀴기 */
export function updatePets(s: RunState): void {
  const p = s.player;
  const kinds = petKinds(p);
  // 무기를 바꿔도 같은 종류 고양이는 그대로 이어 받음 (자리 번호로 맞추면 섞인 무리에서 매 틱 사라졌다 생김)
  const left = [...(p.pets ?? [])];
  const pets = kinds.map((kind, i) => {
    const k = left.findIndex((pet) => pet.kind === kind);
    return k >= 0 ? left.splice(k, 1)[0]! : { kind, x: p.x, y: p.y, prevX: p.x, prevY: p.y, cd: 20 + i * 7, face: 1 };
  });
  p.pets = pets;
  if ((p.frenzyTicks ?? 0) > 0) p.frenzyTicks = (p.frenzyTicks ?? 0) - 1;
  if ((p.roarTicks ?? 0) > 0) p.roarTicks = (p.roarTicks ?? 0) - 1;
  const g = roomGrid(s);
  const fast = (p.frenzyTicks ?? 0) > 0 || weaponOf(p).beast === "catnip";
  pets.forEach((pet, i) => {
    pet.prevX = pet.x;
    pet.prevY = pet.y;
    const st = PET_STATS[pet.kind];
    // 방을 옮기는 등 너무 멀어지면 주인 곁으로
    if ((pet.x - p.x) * (pet.x - p.x) + (pet.y - p.y) * (pet.y - p.y) > R.LEASH * R.LEASH) {
      pet.x = pet.prevX = p.x;
      pet.y = pet.prevY = p.y;
    }
    if (pet.cd > 0) pet.cd -= fast ? 2 : 1;
    const e = nearest(s, pet.x, pet.y);
    let tx: number;
    let ty: number;
    if (e) {
      // 여러 마리면 적의 서로 다른 쪽에 붙음
      const side = DIR16[(i * 5 + (e.x < p.x ? 0 : 8)) % 16]!;
      tx = e.x + side[0] * (e.r + st.r);
      ty = e.y + side[1] * (e.r + st.r);
      // 그림자 고양이: 할퀼 수 있을 때 적 옆으로 순간이동
      if (pet.kind === "shadow" && pet.cd <= 0) {
        addEffect(s, { kind: "burst", x: pet.x, y: pet.y, dirX: 0, dirY: 0, size: 4, maxTicks: 8 });
        pet.x = pet.prevX = e.x - (e.r + 4) * Math.sign(e.x - p.x || 1);
        pet.y = pet.prevY = e.y;
      }
    } else {
      // 적이 없으면 주인 둘레 자리로
      const d = DIR16[(i * 5 + 8) % 16]!;
      tx = p.x + d[0] * 12;
      ty = p.y + d[1] * 10;
    }
    const to = normalize(tx - pet.x, ty - pet.y);
    const far = (tx - pet.x) * (tx - pet.x) + (ty - pet.y) * (ty - pet.y);
    const stop = e ? 1 : 9;
    if (to && far > stop) {
      const step = Math.min(st.speed, Math.sqrt(far));
      pet.x += to[0] * step;
      pet.y += to[1] * step;
      if (Math.abs(to[0]) > 0.2) pet.face = to[0] < 0 ? -1 : 1;
    }
    const body = { x: pet.x, y: pet.y, prevX: pet.x, prevY: pet.y, r: st.r };
    keepInRoom(body, g);
    pet.x = body.x;
    pet.y = body.y;
    if (!e || pet.cd > 0) return;
    const reach = st.r + e.r + 3;
    if ((e.x - pet.x) * (e.x - pet.x) + (e.y - pet.y) * (e.y - pet.y) > reach * reach) return;
    scratch(s, pet, e);
    pet.cd = st.every;
  });
}

/** 고양이 할퀴기 (사자는 둘레까지) */
function scratch(s: RunState, pet: Pet, e: EnemyState): void {
  const p = s.player;
  const st = PET_STATS[pet.kind];
  let dmg = p.stats.damage * st.mul * instinct(p, e);
  if (hasPerk(p, "sharpClaws")) dmg *= R.SHARP_MUL;
  if ((p.roarTicks ?? 0) > 0) dmg *= R.ROAR_MUL;
  const dir = normalize(e.x - pet.x, e.y - pet.y) ?? [1, 0];
  damageEnemy(s, e, dmg, dir[0], dir[1]);
  if (pet.kind === "lion") blastAt(s, e.x, e.y, R.LION_AREA, dmg * 0.5, { exclude: e });
  addEffect(s, { kind: "scratch", x: e.x, y: e.y, dirX: dir[0], dirY: dir[1], size: pet.kind === "lion" ? 7 : 4, maxTicks: 8 });
  if (hasPerk(p, "purr")) healPlayer(s, R.PURR_HEAL);
}
