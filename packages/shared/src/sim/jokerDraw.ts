// 조커 카드뽑기 (전용 아이템 jkDraw): 카드가 적을 맞힐 때마다 게이지 → 가득이면 머리 위에 카드 셋(뒷면)이 나타나 섞이다 한 장이 뒤집힘
// 달: 히든 캐릭터 아홉 중 하나의 힘을 10초 · 붉은 일식: 10초 동안 받는 피해 +30%, 카드 처음 고정 피해 16 · 세계수: 체력 20 회복
// 결과는 시드로만 정함 (화면·서버 같게). 수치 weaponsJoker.JOKER_DRAW·JOKER_MOON
import { createRng, deriveSeed } from "../rng";
import { JOKER_DRAW as D, JOKER_MOON as M, MOON_HEROES } from "../weaponsJoker";
import { blastAt, damageEnemy, healPlayer } from "./combat";
import type { EnemyState, RunState } from "./types";
import { addEffect, dist2, hasPerk, normalize } from "./util";

type P = RunState["player"];
const MOON = 0;
const ECLIPSE = 1;
const TREE = 2;

const buffOf = (p: P, card: number) => (p.jkBuff && p.jkBuff.card === card ? p.jkBuff : undefined);
/** 달 카드로 지금 쓰는 히든 캐릭터 (없으면 undefined) */
export const moonHero = (p: P) => {
  const b = buffOf(p, MOON);
  return b ? MOON_HEROES[b.hero] : undefined;
};
export const eclipseOn = (p: P) => !!buffOf(p, ECLIPSE);

/** 카드 처음 고정 피해 (붉은 일식이면 16부터) */
export const cardBase = (p: P, b: number) => (eclipseOn(p) ? Math.max(b, D.eclipseBase) : b);
/** 카드 피해 배율 (달 · 운명의 여행자) */
export const cardMul = (s: RunState) => (moonHero(s.player) === "voyager" ? M.voyager.mul : 1);
/** 받는 피해 배율 (붉은 일식 +30% · 달 · 몰락한 왕 -50%, classTaken) */
export function jokerTaken(p: P): number {
  if (p.characterId !== "joker") return 1;
  return (eclipseOn(p) ? D.eclipseTaken : 1) * (moonHero(p) === "fallenKing" ? M.fallenKing.taken : 1);
}

/** 카드가 적을 맞힐 때마다 (섞는 중·효과 중에는 차지 않음) */
export function drawGain(s: RunState): void {
  const p = s.player;
  if (!hasPerk(p, "jkDraw") || p.jkFlip || p.jkBuff) return;
  p.jkGauge = (p.jkGauge ?? 0) + 1;
  if (p.jkGauge >= D.max) drawNow(s);
}

/** 바로 한 장 뽑기 (게이지 가득 · 연습장 진영 게이지 채우기) */
export function drawNow(s: RunState): void {
  const p = s.player;
  p.jkGauge = 0;
  delete p.jkBuff;
  const n = (p.jkDraws ?? 0) + 1;
  p.jkDraws = n;
  const rng = createRng(deriveSeed(s.seed, "jkDraw", n));
  const card = rng.int(0, 2);
  p.jkFlip = { t: D.flipTicks, card, hero: card === MOON ? rng.int(0, MOON_HEROES.length - 1) : 0 };
}

/** 뒤집힌 카드 효과 시작 */
function reveal(s: RunState, card: number, hero: number): void {
  const p = s.player;
  addEffect(s, { kind: "jkReveal", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 30, style: card, maxTicks: 50, follow: true });
  if (card === TREE) {
    healPlayer(s, D.treeHeal);
    addEffect(s, { kind: "jkTree", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 34, maxTicks: 40, follow: true });
    return;
  }
  p.jkBuff = { card, t: D.buffTicks, hero };
}

/** 틱마다: 섞는 연출 → 뒤집힘 → 효과 시간 · 달의 힘 */
export function drawTick(s: RunState): void {
  const p = s.player;
  if (p.jkFlip) {
    p.jkFlip.t--;
    if (p.jkFlip.t <= 0) {
      const { card, hero } = p.jkFlip;
      delete p.jkFlip;
      reveal(s, card, hero);
    }
  }
  if (!p.jkBuff) return;
  p.jkBuff.t--;
  if (p.jkBuff.card === MOON) moonTick(s, p.jkBuff.hero, D.buffTicks - p.jkBuff.t);
  if (p.jkBuff.t <= 0) delete p.jkBuff;
}

const alive = (s: RunState) => s.enemies.filter((e) => e.hp > 0 && !e.immune && !e.pwHid);
function nearest(s: RunState): EnemyState | undefined {
  let best: EnemyState | undefined;
  let bd = Infinity;
  for (const e of alive(s)) {
    const d = dist2(e, s.player);
    if (d < bd) {
      bd = d;
      best = e;
    }
  }
  return best;
}
const pick = (s: RunState, salt: string) => {
  const list = alive(s);
  return list.length > 0 ? list[createRng(deriveSeed(s.seed, salt, s.tick)).int(0, list.length - 1)] : undefined;
};
const moonFx = (s: RunState, hero: number, x: number, y: number, size: number) => addEffect(s, { kind: "jkMoon", x, y, dirX: 0, dirY: 0, size, style: hero, maxTicks: 22 });
/** 한 자리에 달의 힘 (둘레 피해 + 효과) */
function moonHit(s: RunState, hero: number, at: { x: number; y: number } | undefined, r: number, dmg: number, push = 0): void {
  if (!at) return;
  blastAt(s, at.x, at.y, r, dmg, push > 0 ? { push } : { still: true });
  moonFx(s, hero, at.x, at.y, r);
}

/** 달의 힘: 히든 캐릭터마다 다른 공격 (t = 효과가 시작되고 지난 틱) */
function moonTick(s: RunState, hero: number, t: number): void {
  const p = s.player;
  const id = MOON_HEROES[hero];
  const every = (n: number) => t % n === 0;
  switch (id) {
    case "stargazer": {
      const e = every(M.stargazer.every) ? pick(s, "jkStar") : undefined;
      moonHit(s, hero, e, M.stargazer.r, M.stargazer.dmg);
      return;
    }
    case "duck":
      if (every(M.duck.every)) moonHit(s, hero, p, M.duck.r, M.duck.dmg, M.duck.push);
      return;
    case "scribe": {
      const e = every(M.scribe.every) ? nearest(s) : undefined;
      moonHit(s, hero, e, M.scribe.r, M.scribe.dmg);
      return;
    }
    case "miner": {
      const e = every(M.miner.every) ? nearest(s) : undefined;
      moonHit(s, hero, e, M.miner.r, M.miner.dmg);
      return;
    }
    case "zeus":
      if (!every(M.zeus.every)) return;
      for (let i = 0; i < M.zeus.n; i++) {
        const e = pick(s, `jkZeus${i}`);
        moonHit(s, hero, e, M.zeus.r, M.zeus.dmg);
      }
      return;
    case "pilgrim":
      if (every(M.pilgrim.every)) rift(s, hero);
      return;
    case "fallenKing":
      if (every(M.fallenKing.every)) moonHit(s, hero, p, M.fallenKing.r, M.fallenKing.dmg);
      return;
    case "lux":
      if (!every(M.lux.every)) return;
      healPlayer(s, M.lux.heal);
      moonHit(s, hero, p, M.lux.r, M.lux.dmg);
      return;
    default:
      // 운명의 여행자: 카드 피해 배율 (cardMul) · 가끔 반짝임만
      if (every(60)) moonFx(s, hero, p.x, p.y, 24);
  }
}

/** 차원 균열: 조준한 쪽으로 길게 갈라져 줄 위 적 모두 */
function rift(s: RunState, hero: number): void {
  const p = s.player;
  const { len, w, dmg } = M.pilgrim;
  const tx = p.x + p.faceX * len;
  const ty = p.y + p.faceY * len;
  for (const e of alive(s)) {
    const along = (e.x - p.x) * p.faceX + (e.y - p.y) * p.faceY;
    if (along < 0 || along > len) continue;
    const side = Math.abs((e.x - p.x) * p.faceY - (e.y - p.y) * p.faceX);
    if (side > w + e.r) continue;
    const d = normalize(e.x - p.x, e.y - p.y) ?? [p.faceX, p.faceY];
    damageEnemy(s, e, dmg, d[0], d[1], false);
  }
  addEffect(s, { kind: "jkRift", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: len, width: w, toX: tx, toY: ty, style: hero, maxTicks: 24 });
}
