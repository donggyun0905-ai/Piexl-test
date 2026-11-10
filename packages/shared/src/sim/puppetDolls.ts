// 인형술사 실 내리치기 뒤 효과와 바닥 것: 미니 인형 8종(때릴 때 확률로 내 쪽에서 나와 적에게 달려가 터짐) · 금사슬 · 거미줄 · 검은 실 · 시체 인형
// 미니 인형 종류(doll)는 itemsPuppet.PP_DOLLS 차례 = 그림 칸 (render/puppetArt)
import { ENEMIES } from "../enemyDefs";
import { PP_DOLLS, PUPPET_PERKS as K } from "../itemsPuppet";
import { createRng, deriveSeed } from "../rng";
import { PUPPET_HAND as H } from "../weaponsPuppet";
import { healPlayer } from "./combat";
import { rot } from "./orbit";
import type { PuppetDoll } from "./ppTypes";
import { foeNear, ppArea } from "./puppetAllies";
import { alive, damageEnemyLite } from "./shadowingSpirits";
import type { EnemyState, RunState } from "./types";
import { addEffect, hasPerk, keepInRoom, normalize, roomGrid } from "./util";

const DOLL = { ribbon: 0, spiral: 1, jester: 2, hat: 3, princess: 4, dancer: 5, hood: 6, cat: 7 } as const;

/** 미니 인형 하나 내보내기 (내 쪽에서 적을 향해) */
function sendDoll(s: RunState, doll: number, x: number, y: number, bounce: number): void {
  const p = s.player;
  const list = (p.ppDolls ??= []);
  if (list.length >= H.dollMax) return;
  const e = foeNear(s, x, y, 400);
  const d = (e ? normalize(e.x - x, e.y - y) : null) ?? [p.faceX, p.faceY];
  list.push({ x, y, vx: d[0] * H.dollSpeed, vy: d[1] * H.dollSpeed, doll, t: H.dollTicks, target: e?.id ?? -1, bounce });
}

/** 실 내리치기를 마쳤을 때: 검은 실 · 미니 인형 · 금사슬 · 거미줄 */
export function afterStrike(s: RunState, x: number, y: number, hit: EnemyState[]): void {
  const p = s.player;
  if (hasPerk(p, "ppBlack")) for (const e of hit) e.ppThreads = (e.ppThreads ?? 0) + 1;
  const own = PP_DOLLS.map((id, i) => (hasPerk(p, id) ? i : -1)).filter((i) => i >= 0);
  if (own.length && hit.length) {
    const rng = createRng(deriveSeed(s.seed, "ppDoll", s.tick, hit[0]!.id));
    if (rng.nextFloat() < H.dollChance * own.length) sendDoll(s, rng.pick(own), p.x, p.y, hasPerk(p, "ppDollDancer") ? K.ppDollDancer.bounce : 0);
  }
  if (hasPerk(p, "ppChain") && hit.length) chain(s, hit);
  if (hasPerk(p, "ppWeb")) (p.ppSpots ??= []).push({ x, y, kind: 1, age: 0, life: K.ppWeb.ticks, r: 18 });
}

/** 금사슬: 맞힌 적에서 가까운 다른 적 둘에게 이어서 튐 */
function chain(s: RunState, hit: EnemyState[]): void {
  const done = new Set(hit.map((e) => e.id));
  let from = hit[0]!;
  for (let i = 0; i < K.ppChain.n; i++) {
    let next: EnemyState | null = null;
    let bd = K.ppChain.dist ** 2;
    for (const e of s.enemies) {
      const d = (e.x - from.x) ** 2 + (e.y - from.y) ** 2;
      if (alive(e) && !done.has(e.id) && d < bd) {
        bd = d;
        next = e;
      }
    }
    if (!next) return;
    done.add(next.id);
    const d = normalize(next.x - from.x, next.y - from.y) ?? [0, 0];
    damageEnemyLite(s, next, s.player.stats.damage * H.strikeMul * K.ppChain.mul, d[0], d[1]);
    addEffect(s, { kind: "ppChain", x: from.x, y: from.y, toX: next.x, toY: next.y, dirX: d[0], dirY: d[1], size: 2, maxTicks: 14 });
    from = next;
  }
}

/** 미니 인형이 터짐: 인형마다 다른 효과 */
function popDoll(s: RunState, dl: PuppetDoll): void {
  const p = s.player;
  const dmg = p.stats.damage * H.dollMul;
  const big = dl.doll === DOLL.hat;
  const r = H.dollR * (big ? K.ppDollHat.size : 1);
  ppArea(s, dl.x, dl.y, r, dmg * (big ? K.ppDollHat.mul : 1), "ppDollPop", dl.doll, {
    stun: dl.doll === DOLL.ribbon ? K.ppDollRibbon.stun : undefined,
    burn: dl.doll === DOLL.hood ? K.ppDollHood.burn : undefined,
    slow: dl.doll === DOLL.cat ? K.ppDollCat.slow : undefined,
  });
  if (dl.doll === DOLL.spiral) pull(s, dl.x, dl.y);
  if (dl.doll === DOLL.princess) healPlayer(s, K.ppDollPrincess.heal);
  if (dl.doll === DOLL.jester) {
    const j = K.ppDollJester;
    for (let i = 0; i < j.n; i++) {
      const v = rot((i / j.n) * Math.PI * 2);
      (p.ppDolls ??= []).push({ x: dl.x, y: dl.y, vx: v[0] * j.speed, vy: v[1] * j.speed, doll: DOLL.jester, t: j.ticks, target: -1, bounce: 0, shard: dmg * j.mul });
    }
  }
  // 춤꾼: 다른 적에게 한 번 더
  if (dl.bounce > 0) sendDoll(s, dl.doll, dl.x, dl.y, dl.bounce - 1);
}

/** 태엽: 둘레 적을 가운데로 끌어당김 (보스 빼고) */
function pull(s: RunState, x: number, y: number): void {
  const g = roomGrid(s);
  for (const e of s.enemies) {
    if (!alive(e) || ENEMIES[e.kind].boss || (e.x - x) ** 2 + (e.y - y) ** 2 > K.ppDollSpiral.r ** 2) continue;
    const d = normalize(x - e.x, y - e.y);
    if (!d) continue;
    const k = Math.min(K.ppDollSpiral.pull, Math.hypot(x - e.x, y - e.y));
    e.x += d[0] * k;
    e.y += d[1] * k;
    keepInRoom(e, g);
  }
}

/** 미니 인형 움직임 (쫓는 적 쪽으로 · 닿으면 터짐) · 광대 파편은 곧게 날아가 맞히면 사라짐 */
function moveDoll(s: RunState, dl: PuppetDoll): boolean {
  dl.t--;
  if (dl.shard === undefined) {
    let e = s.enemies.find((f) => f.id === dl.target && alive(f)) ?? null;
    if (!e) {
      e = foeNear(s, dl.x, dl.y, 400);
      dl.target = e?.id ?? -1;
    }
    const d = e ? normalize(e.x - dl.x, e.y - dl.y) : null;
    if (d) {
      dl.vx = d[0] * H.dollSpeed;
      dl.vy = d[1] * H.dollSpeed;
    }
  }
  dl.x += dl.vx;
  dl.y += dl.vy;
  for (const e of s.enemies) {
    if (!alive(e) || (e.x - dl.x) ** 2 + (e.y - dl.y) ** 2 > (e.r + 4) ** 2) continue;
    if (dl.shard !== undefined) {
      damageEnemyLite(s, e, dl.shard, dl.vx, dl.vy);
      return false;
    }
    popDoll(s, dl);
    return false;
  }
  if (dl.t > 0) return true;
  if (dl.shard === undefined) popDoll(s, dl);
  return false;
}

/** 검은 실: 20개면 크게 느려짐 · 30개면 검게 터지고 처음부터 */
function blackTick(s: RunState): void {
  const p = s.player;
  for (const e of s.enemies) {
    const n = e.ppThreads ?? 0;
    if (n < K.ppBlack.slow || !alive(e)) continue;
    e.sluggish = Math.max(e.sluggish ?? 0, 2);
    if (!ENEMIES[e.kind].boss) e.slowTicks = Math.max(e.slowTicks ?? 0, 2);
    if (n < K.ppBlack.burst) continue;
    e.ppThreads = 0;
    damageEnemyLite(s, e, p.stats.damage * K.ppBlack.mul, 0, 0);
    ppArea(s, e.x, e.y, K.ppBlack.r, p.stats.damage * K.ppBlack.area, "ppBlackPop", 0);
  }
}

/** 바닥 것: 시체 인형은 때가 되면 터짐 · 거미줄은 올라선 적을 느리게 */
function spotTick(s: RunState, o: { x: number; y: number; kind: number; age: number; life: number; r: number }): boolean {
  o.age++;
  if (o.kind === 1) {
    for (const e of s.enemies) {
      if (!alive(e) || (e.x - o.x) ** 2 + (e.y - o.y) ** 2 > (o.r + e.r) ** 2) continue;
      if (ENEMIES[e.kind].boss) e.sluggish = Math.max(e.sluggish ?? 0, 2);
      else e.slowTicks = Math.max(e.slowTicks ?? 0, K.ppWeb.slow);
    }
    return o.age < o.life;
  }
  if (o.age < o.life) return true;
  ppArea(s, o.x, o.y, o.r, s.player.stats.damage * K.ppCorpse.mul, "ppCorpsePop", 0, { push: 10 });
  return false;
}

/** 틱마다: 미니 인형 · 바닥 것 · 검은 실 */
export function dollsTick(s: RunState): void {
  const p = s.player;
  if (p.ppDolls?.length) p.ppDolls = p.ppDolls.filter((dl) => moveDoll(s, dl));
  if (p.ppSpots?.length) p.ppSpots = p.ppSpots.filter((o) => spotTick(s, o));
  if (hasPerk(p, "ppBlack")) blackTick(s);
}
