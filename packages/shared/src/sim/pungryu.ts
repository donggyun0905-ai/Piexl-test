// 풍류사(아스칼론, 시즌 3): 구름을 타고 다니며 붓으로 천자문 글자를 써서 날림
// 공격 한 번 = 글자 하나(글자탄). 구절 글자 수(4, 천자문 책 3)를 다 쓰면 구절 완성 → 무기마다 큰 마법 (sim/pungryuVerse)
// 2초 동안 쓰지 않으면 처음부터. 아이템은 sim/pungryuPerks, 다른 파일에 거는 작은 갈고리는 sim/pungHooks
import { TICK_RATE } from "../constants";
import { PUNGRYU_PERKS as K } from "../itemsPungryu";
import { PUNGRYU as U, type ScriptStyle } from "../weaponsPungryu";
import { nearest } from "./brawlMoves";
import { rot } from "./orbit";
import { isPungryu, letterFrom, puPower } from "./pungryuKit";
import { addClone, cloneTick, cloneWrite, flute, inkAt, perkTick, puDash } from "./pungryuPerks";
import { castVerse, puHit, verseTick } from "./pungryuVerse";
import type { EnemyState, PlayerState, ProjectileState, RunState } from "./types";
import { addEffect, hasPerk, weaponOf } from "./util";

const styleOf = (p: PlayerState): ScriptStyle => weaponOf(p).script ?? { verse: "heaven", n: 1, power: 3 };

/** 구절 하나에 쓰는 글자 수 */
export const verseNeed = (p: PlayerState) => (hasPerk(p, "puBook") ? K.puBook.letters : U.letters);
/** 화면용: 지금 구절에 쓴 글자 수 · 모두 몇 글자 */
export const pungryuStep = (p: PlayerState): [number, number] => [p.puStep ?? 0, verseNeed(p)];

/** 한 번 공격: 글자 하나 (무기마다 여러 갈래) */
function write(s: RunState): void {
  const p = s.player;
  const st = styleOf(p);
  const idx = p.puStep ?? 0;
  // 축지법: 순간이동 뒤 첫 글자 2배
  const quick = (p.puQuick ?? 0) > 0 ? K.puShrink.mul : 1;
  p.puQuick = 0;
  const dmg = puPower(s) * quick;
  for (let i = 0; i < st.n; i++) {
    const [c, sn] = rot((i - (st.n - 1) / 2) * (st.spread ?? 0));
    letterFrom(s, p.x, p.y, p.faceX * c - p.faceY * sn, p.faceX * sn + p.faceY * c, dmg, idx, st.pierce);
  }
  cloneWrite(s, idx);
  p.puStep = idx + 1;
  p.puLast = s.tick;
  if (p.puStep < verseNeed(p)) return;
  // 구절 완성
  p.puStep = 0;
  p.puVerses = (p.puVerses ?? 0) + 1;
  const e = nearest(s, p.stats.range * U.aim);
  castVerse(s, st, e);
  addClone(s);
  addEffect(s, { kind: "puVerse", x: p.x, y: p.y - 6, dirX: p.faceX, dirY: p.faceY, size: 24, maxTicks: 30, tint: p.weaponId });
}

/** 글자탄이 맞았을 때 (s2Hits): 별 표식 · 이슬 · 곳간 · 먹물 · 서리 맞은 적은 더 아픔 */
export function letterHit(s: RunState, pr: ProjectileState, e: EnemyState): void {
  const p = s.player;
  if (!isPungryu(p)) return;
  const v = styleOf(p).verse;
  if (v === "stars") e.puStar = U.starTicks;
  if (v === "frost") e.puDew = (e.puDew ?? 0) + 1;
  if (v === "harvest") p.puStore = (p.puStore ?? 0) + pr.damage * U.store;
  // 서리: 글자탄도 더 아픔 (덧붙는 몫만)
  if ((e.puFrost ?? 0) > 0 && e.hp > 0) puHit(s, e, pr.damage * (U.frostTaken - 1) / U.frostTaken);
  inkAt(s, pr.x, pr.y);
}

/** 틱마다 (붓을 들었을 때 player에서) */
export function pungryuTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  puDash(s);
  verseTick(s);
  perkTick(s);
  cloneTick(s);
  flute(s);
  if (p.puQuick) p.puQuick--;
  for (const e of s.enemies) {
    if (e.puStar) e.puStar--;
    if (e.puFrost) e.puFrost--;
  }
  // 2초 동안 쓰지 않으면 구절을 처음부터
  if ((p.puStep ?? 0) > 0 && s.tick - (p.puLast ?? 0) > U.idle) p.puStep = 0;
  if (!want || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  write(s);
}

export { isPungryu } from "./pungryuKit";

/** 연습장 등에서 다시 시작할 때 */
export function resetPungryu(p: PlayerState): void {
  for (const k of ["puStep", "puLast", "puVerses", "puFalls", "puHot", "puOrbs", "puRain", "puStore", "puPow", "puDashing", "puQuick", "puClones", "puDisguised", "puTrail", "puInks", "puFlute"] as const) delete p[k];
}
