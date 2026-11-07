// 테일 공용 도우미 (sim/tail·tailSea가 같이 씀): 바다 종류 · 영역 크기 · 상어 피해 · 맞히기 · 다른 파일 갈고리
import { TAIL_PERKS as K } from "../itemsTail";
import { TAIL as T, type SeaStyle } from "../weaponsTail";
import { damageEnemy } from "./combat";
import { alive, isBoss } from "./s2Kit";
import { statusHit } from "./statusHit";
import type { DotKind, EnemyState, PlayerState, RunState } from "./types";
import { dist2, hasPerk, normalize, reachOf, weaponOf } from "./util";

export const isTail = (p: PlayerState) => p.characterId === "tail";

export const seaOf = (p: PlayerState): SeaStyle => weaponOf(p).shark ?? { sea: "tide" };

/** 영역 바다 반지름 (바다 종류 · 깊은 바다) */
/** 발밑 바다 영역 반지름 (사거리 증가만큼 넓어짐 · 꼬리 공격은 그대로) */
export const seaR = (p: PlayerState) => T.seaR * (seaOf(p).r ?? 1) * (hasPerk(p, "tlDeep") ? K.tlDeep.r : 1) * reachOf(p);

/** 상어 크기 배율 (바다 종류) */
export const sharkSize = (p: PlayerState) => seaOf(p).size ?? 1;

/** 상어 피해 (공격력 × 배율 × 바다) */
export const sharkDmg = (p: PlayerState, mul: number) => p.stats.damage * mul * (seaOf(p).power ?? 1);

/** 영역 바다 안의 적 */
export function inSea(s: RunState): EnemyState[] {
  const p = s.player;
  const r = seaR(p);
  return alive(s).filter((e) => dist2(e, p) <= (r + e.r) ** 2);
}

/** 테일 공격 한 번 (knock: 맞아 밀림 · 삼키기·물기는 밀지 않음) · 빙해 바다: 상어에 맞은 적이 더 느려짐 */
export function tlHit(s: RunState, e: EnemyState, dmg: number, push = 0, kind?: DotKind, knock = true): void {
  const p = s.player;
  const [dx, dy] = normalize(e.x - p.x, e.y - p.y) ?? [p.faceX, p.faceY];
  if (kind) statusHit(s, e, kind, dmg, dx, dy, knock);
  else damageEnemy(s, e, dmg, dx, dy, knock);
  if (push > 0 && !isBoss(e)) {
    e.x += dx * push;
    e.y += dy * push;
  }
  if (kind === "tide" && seaOf(p).sea === "frost") e.slowTicks = Math.max(e.slowTicks ?? 0, T.frostSlow * 2);
}

/** 마무리 물기 피해 (피 냄새) */
export const biteDmg = (p: PlayerState) => p.stats.damage * T.biteMul * (hasPerk(p, "tlBlood") ? K.tlBlood.mul : 1);

/** 해방의 물결 (classTaken) */
export const tailTaken = (p: PlayerState) => (hasPerk(p, "tlFreedom") ? K.tlFreedom.taken : 1);
/** 화면용: 다음 타 (0~2) · 물 상어로 변해 있는지 */
export const tailStep = (p: PlayerState) => ((p.tlGap ?? 0) > 0 ? (p.tlStep ?? 0) : 0);
export const tailShark = (p: PlayerState) => isTail(p) && !!p.tlBite;
