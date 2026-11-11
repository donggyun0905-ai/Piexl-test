// 조커(실베르): 누르고 있으면 카드를 한 장씩 조준한 쪽으로 던짐. 카드는 벽에 끝없이 튕기고 적을 뚫고 지나감 (같은 적은 잠깐 뒤 다시 맞음)
// 피해 = 처음 고정 피해(4, 공격력과 상관없음) + 튕긴 횟수 × 4 · 판 위 카드가 한도(15)를 넘으면 가장 먼저 던진 카드가 사라짐 · 빠르기는 투사체 속도
// 무기 셋(카드·낫·장난감 총)은 크기·다시 맞히는 간격·튕길 때 느는 피해만 다름 (weaponsJoker.JOKER_STYLE). 전용 아이템 효과도 여기 · 카드뽑기는 sim/jokerDraw
import { TICK_RATE } from "../constants";
import { JOKER_PERKS as K } from "../itemsJoker";
import { deriveSeed, createRng } from "../rng";
import { JOKER_CARD as J, JOKER_STYLE, type JokerWeaponId } from "../weaponsJoker";
import { blastAt as blastAt_, damageEnemy as damageEnemy_, healPlayer } from "./combat";
import { cardBase, cardMul, drawGain, drawTick } from "./jokerDraw";
import type { JokerCard } from "./jkTypes";
import { bounceOff } from "./projectiles";
import { ignite } from "./status";
import type { EnemyState, RunState } from "./types";
import { addEffect, dist2, hasPerk, normalize, roomGrid } from "./util";
import { srcFn } from "./dmgSrc";
const blastAt = srcFn("joker", () => blastAt_), damageEnemy = srcFn("joker", () => damageEnemy_);

type P = RunState["player"];
const WEAPON_IDS: readonly JokerWeaponId[] = ["jkCards", "jkScythe", "jkToyGun"];
const styleOf = (p: P) => JOKER_STYLE[(p.weaponId in JOKER_STYLE ? p.weaponId : "jkCards") as JokerWeaponId];

/** 판 위 카드 한도 (마술사의 소매로 늘어남) */
export const cardCap = (p: P) => J.max + (hasPerk(p, "jkSleeve") ? K.jkSleeve.more : 0);
/** 튕길 때 느는 피해 */
const gainOf = (p: P) => styleOf(p).gain + (hasPerk(p, "jkEdge") ? K.jkEdge.more : 0);
/** 피해가 더는 늘지 않는 카드인지 (튕긴 횟수 상한에 닿음) */
export const cardMaxed = (c: JokerCard) => c.n >= J.maxBounce;
/** 카드 한 장의 지금 피해 (처음 피해 + 튕긴 횟수(상한까지) × 느는 양, 붉은 일식이면 처음 피해가 커짐) */
export const cardDamage = (p: P, c: JokerCard) => cardBase(p, c.b) + gainOf(p) * Math.min(c.n, J.maxBounce);

/** 방이 바뀌면 카드를 모두 거둠 */
const roomKey = (s: RunState) => s.floor * 1000 + s.roomId;

function newCard(p: P, x: number, y: number, vx: number, vy: number, b: number, r: number, ace = false): JokerCard {
  const id = (p.jkNext ?? 0) + 1;
  p.jkNext = id;
  const w = Math.max(0, WEAPON_IDS.indexOf(p.weaponId as JokerWeaponId));
  return { id, x, y, vx, vy, n: 0, b, w, r, h: [], ...(ace ? { ace } : {}) };
}

/** 한도를 넘은 카드 거두기 (가장 먼저 던진 것부터 · 폭죽 카드면 그 자리에서 터짐) */
function trim(s: RunState): void {
  const p = s.player;
  const list = p.jkCards ?? [];
  const cap = cardCap(p);
  while (list.length > cap) {
    const c = list.shift()!;
    if (hasPerk(p, "jkFirework")) {
      const r = K.jkFirework.r;
      blastAt(s, c.x, c.y, r, cardDamage(p, c) * K.jkFirework.mul * cardMul(s), { still: true });
      addEffect(s, { kind: "jkFirework", x: c.x, y: c.y, dirX: 0, dirY: 0, size: r, maxTicks: 24 });
    } else addEffect(s, { kind: "jkPop", x: c.x, y: c.y, dirX: 0, dirY: 0, size: c.r, style: c.w, maxTicks: 12 });
  }
}

/** 한 번 던지기: 조준한 쪽으로 한 장 (더블 덱이면 몇 번째마다 두 장 갈라서 · 에이스면 크고 셈) */
function throwCards(s: RunState): void {
  const p = s.player;
  const st = styleOf(p);
  const n = (p.jkThrown ?? 0) + 1;
  p.jkThrown = n;
  const sp = p.stats.projectileSpeed;
  const fx = p.faceX;
  const fy = p.faceY;
  const ace = hasPerk(p, "jkAce") && n % K.jkAce.every === 0;
  const b = ace ? K.jkAce.base : J.base;
  const r = st.r * (ace ? K.jkAce.size : 1);
  const sx = p.x + fx * (p.r + 2);
  const sy = p.y + fy * (p.r + 2);
  const list = (p.jkCards ??= []);
  if (hasPerk(p, "jkDouble") && n % K.jkDouble.every === 0) {
    const { cos, sin } = K.jkDouble;
    for (const sg of [1, -1]) {
      const dx = fx * cos - fy * sin * sg;
      const dy = fy * cos + fx * sin * sg;
      list.push(newCard(p, sx, sy, dx * sp, dy * sp, b, r, ace));
    }
  } else list.push(newCard(p, sx, sy, fx * sp, fy * sp, b, r, ace));
  trim(s);
}

/** 지휘봉: 대시를 시작하면 모든 카드가 조준한 쪽으로 (빠르기는 그대로) */
function recall(s: RunState): void {
  const p = s.player;
  const dashing = p.dashTicks > 0;
  const start = dashing && !p.jkDash;
  p.jkDash = dashing;
  if ((p.jkRecallCd ?? 0) > 0) p.jkRecallCd = (p.jkRecallCd ?? 0) - 1;
  if (!start || !hasPerk(p, "jkRecall") || (p.jkRecallCd ?? 0) > 0) return;
  p.jkRecallCd = K.jkRecall.cool;
  for (const c of p.jkCards ?? []) {
    const sp = Math.sqrt(c.vx * c.vx + c.vy * c.vy);
    c.vx = p.faceX * sp;
    c.vy = p.faceY * sp;
  }
}

/** 벽에 튕긴 뒤: 피해 증가 · 가속 카드 · 분신 카드 */
function onBounce(s: RunState, c: JokerCard, born: JokerCard[]): void {
  const p = s.player;
  c.n++;
  if (hasPerk(p, "jkAccel")) {
    const sp = Math.sqrt(c.vx * c.vx + c.vy * c.vy);
    if (sp * K.jkAccel.per <= p.stats.projectileSpeed * K.jkAccel.max) {
      c.vx *= K.jkAccel.per;
      c.vy *= K.jkAccel.per;
    }
  }
  if (hasPerk(p, "jkSplit") && c.n % K.jkSplit.every === 0) {
    const b = Math.max(J.base, Math.round(cardDamage(p, c) * K.jkSplit.mul));
    born.push({ ...newCard(p, c.x, c.y, -c.vy, c.vx, b, c.r), w: c.w });
  }
  addEffect(s, { kind: "jkBounce", x: c.x, y: c.y, dirX: 0, dirY: 0, size: cardDamage(p, c), style: c.w, maxTicks: 10 });
}

/** 카드가 적 하나를 맞힘 */
function hit(s: RunState, c: JokerCard, e: EnemyState, mul: number): void {
  const p = s.player;
  let dmg = cardDamage(p, c) * mul;
  if (hasPerk(p, "jkSeven") && createRng(deriveSeed(s.seed, "jk7", s.tick, c.id, e.id)).nextFloat() < K.jkSeven.chance) dmg *= K.jkSeven.mul;
  const d = normalize(c.vx, c.vy) ?? [p.faceX, p.faceY];
  damageEnemy(s, e, dmg, d[0], d[1], c.w !== 2);
  if (hasPerk(p, "jkFlame")) ignite(e, dmg * K.jkFlame.burn);
  if (hasPerk(p, "jkFrost")) e.slowTicks = Math.max(e.slowTicks ?? 0, K.jkFrost.slow);
  if (e.hp <= 0 && hasPerk(p, "jkHeart")) healPlayer(s, K.jkHeart.heal);
  drawGain(s);
}

/** 카드 방패: 카드에 닿은 적 탄을 지움 */
function guard(s: RunState, list: readonly JokerCard[]): void {
  if (!hasPerk(s.player, "jkGuard") || list.length === 0) return;
  s.projectiles = s.projectiles.filter((pr) => pr.fromPlayer || !list.some((c) => dist2(c, pr) < (c.r + pr.r + K.jkGuard.reach) ** 2));
}

/** 카드 움직이기 (빠르면 나눠 움직여 벽을 뚫지 않게) · 맞히기 */
function moveCards(s: RunState): void {
  const p = s.player;
  const list = p.jkCards;
  if (!list || list.length === 0) return;
  const g = roomGrid(s);
  const hitCd = styleOf(p).hitCd;
  // 풀 하우스: 판 위 카드가 한도만큼 가득이면 모든 카드가 셈
  const mul = cardMul(s) * (hasPerk(p, "jkFullHouse") && list.length >= cardCap(p) ? K.jkFullHouse.mul : 1);
  const born: JokerCard[] = [];
  for (const c of list) {
    const sp = Math.sqrt(c.vx * c.vx + c.vy * c.vy);
    const steps = Math.max(1, Math.ceil(sp / J.step));
    // 오래 지난 맞힘 기록은 지움
    const h: number[] = [];
    for (let i = 0; i < c.h.length; i += 2) if (s.tick - c.h[i + 1]! < hitCd) h.push(c.h[i]!, c.h[i + 1]!);
    c.h = h;
    for (let k = 0; k < steps; k++) {
      c.x += c.vx / steps;
      c.y += c.vy / steps;
      if (bounceOff(c, g)) onBounce(s, c, born);
      for (const e of s.enemies) {
        if (e.hp <= 0 || e.immune || e.pwHid || dist2(e, c) >= (e.r + c.r) ** 2 || hitBefore(c, e.id)) continue;
        c.h.push(e.id, s.tick);
        hit(s, c, e, mul);
      }
    }
  }
  if (born.length > 0) {
    list.push(...born);
    trim(s);
  }
  guard(s, list);
}

const hitBefore = (c: JokerCard, id: number) => {
  for (let i = 0; i < c.h.length; i += 2) if (c.h[i] === id) return true;
  return false;
};

/** 틱마다 (조커 무기를 들었을 때 player에서) */
export function jokerTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  const key = roomKey(s);
  if (p.jkRoom !== key) {
    p.jkRoom = key;
    p.jkCards = [];
  }
  drawTick(s);
  recall(s);
  moveCards(s);
  if (!want || p.attackCooldown > 0) return;
  throwCards(s);
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
}

/** 연습장 등에서 다시 시작할 때 */
export function resetJoker(p: P): void {
  for (const k of ["jkCards", "jkNext", "jkThrown", "jkRoom", "jkDash", "jkRecallCd", "jkGauge", "jkDraws", "jkFlip", "jkBuff"] as const) delete p[k];
}

export const isJoker = (p: P) => p.characterId === "joker";
