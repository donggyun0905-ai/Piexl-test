// 풍류사 공용 도우미 (sim/pungryu·pungryuVerse·pungryuPerks가 같이 씀): 지금 공격력 · 글자탄 쏘기
import { PUNGRYU_PERKS as K } from "../itemsPungryu";
import { PUNGRYU as U } from "../weaponsPungryu";
import type { PlayerState, RunState } from "./types";
import { hasPerk } from "./util";

export const isPungryu = (p: PlayerState) => p.characterId === "pungryu";

/** 서당 개 삼 년(구절마다) · 의적 주머니(가진 돈 100G마다) 공격력 배율 */
export function verseBonus(s: RunState): number {
  const p = s.player;
  const dog = hasPerk(p, "puDog") ? Math.min(K.puDog.max, K.puDog.per * (p.puVerses ?? 0)) : 0;
  const thief = hasPerk(p, "puThief") ? Math.min(K.puThief.max, K.puThief.per * Math.floor(s.gold / 100)) : 0;
  return (1 + dog) * (1 + thief);
}

/** 지금 공격력 */
export const puPower = (s: RunState) => s.player.stats.damage * verseBonus(s);

/** (x, y)에서 (dx, dy) 쪽으로 글자탄 하나 (tint = "무기 id:몇 번째 글자") */
export function letterFrom(s: RunState, x: number, y: number, dx: number, dy: number, dmg: number, idx: number, pierce = 0): void {
  const p = s.player;
  const sp = p.stats.projectileSpeed;
  s.projectiles.push({
    id: s.nextId++,
    fromPlayer: true,
    x: x + dx * 6,
    y: y + dy * 6 - 3,
    prevX: x,
    prevY: y - 3,
    r: U.letterR,
    vx: dx * sp,
    vy: dy * sp,
    damage: dmg,
    ticksLeft: Math.ceil(p.stats.range / sp),
    spirit: "puLetter",
    tint: `${p.weaponId}:${idx}`,
    ...(pierce ? { pierce, hitIds: [] } : {}),
  });
}
