// 빙설 공용 도우미 (sim/bingseol·bsShots·bsArms·bsUlt가 같이 씀): 무기 모양·얼음 영역 크기·피해 배율·얼음가루 놓기·방어력
// 가벼운 것만 불러옴 (baseStats가 bsExtras를 부름)
import { BINGSEOL_PERKS as K } from "../itemsBingseol";
import { BINGSEOL_WEAPONS, BS_FIELD as F, BS_STYLE, type BingseolWeaponId } from "../weaponsBingseol";
import type { Rng } from "../rng";
import type { ExtraStats } from "../characters";
import type { EnemyState, RunState } from "./types";
import { reachOf } from "./util";

type P = RunState["player"];

export const isBingseol = (p: P) => p.characterId === "bingseol";
const has = (p: P, id: string) => p.passives.includes(id as never);

/** 지금 무기의 공격 모양 (빙설 무기가 아니면 얼음칼) */
export const styleOf = (p: P) => BS_STYLE[(p.weaponId in BINGSEOL_WEAPONS ? p.weaponId : "bsBlade") as BingseolWeaponId];

/** 얼음 영역 반지름 (사거리 증가 · 지팡이 · 눈보라 확장) */
export const fieldR = (p: P) => F.r * styleOf(p).field * reachOf(p) * (has(p, "bsStorm") ? K.bsStorm.size : 1);

/** 적이 얼음 영역 안인지 */
export const inField = (p: P, e: EnemyState) => (e.x - p.x) ** 2 + (e.y - p.y) ** 2 <= (fieldR(p) + e.r) ** 2;

/** 빙설 피해 배율 (쇄빙: 영역 안 적) */
export const iceMul = (p: P, e: EnemyState) => (has(p, "bsShatter") && inField(p, e) ? K.bsShatter.mul : 1);

/** 얼음가루 n개를 영역 안 아무 데나 (맵에 cap개까지, 넘으면 오래된 것부터 사라짐) · 생긴 수를 셈 */
export function addDust(p: P, n: number, rng: Rng): void {
  const list = (p.bsDust ??= []);
  const r = fieldR(p);
  for (let i = 0; i < n; i++) {
    // 둘레 고르게: 네모 안에서 뽑아 원 밖이면 안쪽으로 당김
    let x = (rng.nextFloat() * 2 - 1) * r;
    let y = (rng.nextFloat() * 2 - 1) * r;
    const d = Math.hypot(x, y);
    if (d > r) {
      x *= r / d;
      y *= r / d;
    }
    list.push({ x: p.x + x, y: p.y + y, age: 0 });
    if (list.length > K.bsDust.cap) list.shift();
  }
  p.bsMade5 = (p.bsMade5 ?? 0) + n;
  p.bsMade10 = (p.bsMade10 ?? 0) + n;
}

/** 추가 기본 스탯 (baseStats.extraOf): 영역강화 방어력 */
export function bsExtras(p: P): Partial<ExtraStats> | null {
  return isBingseol(p) && has(p, "bsWall") ? { defense: K.bsWall.defense } : null;
}
