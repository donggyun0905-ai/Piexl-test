// 래빗 내리찍은 뒤 효과와 바닥 것: 땅울림 파동(맵 끝까지, 세 갈래)·여진 · 토끼인장 · 유령 망치 · 갈라진 땅 · 별사탕
// 파동은 내리찍은 자리에서 땅울림이 다 커진 뒤(그림 1~3번째 칸) 4번째 칸 크기로 바라보는 쪽 맵 끝까지 나아감
import { RABBIT_PERKS as K } from "../itemsRabbit";
import { createRng, deriveSeed } from "../rng";
import { RABBIT_HAMMER as H } from "../weaponsRabbit";
import { rot } from "./orbit";
import { hammerSize, luckMul, megaMul, rbArea } from "./rabbitKit";
import { alive, damageEnemyLite } from "./shadowingSpirits";
import type { EnemyState, RunState } from "./types";
import { addEffect, hasPerk, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

/** 내리찍기를 마쳤을 때 (망치로 직접 찍은 곳만): 파동 · 토끼인장 · 갈라진 땅 · 유령 망치 · 별사탕 */
export function slamExtras(s: RunState, x: number, y: number, hit: EnemyState[]): void {
  const p = s.player;
  const size = hammerSize(p);
  const rng = createRng(deriveSeed(s.seed, "rbExtra", s.tick, p.attackCount));
  if (hasPerk(p, "rbQuake") || hasPerk(p, "rbTriple")) sendWaves(s, x, y);
  const marks = (p.rbMarks ??= []);
  if (hasPerk(p, "rbSeal")) marks.push({ x, y, kind: 0, age: 0, life: K.rbSeal.delay, r: K.rbSeal.r * size, dmg: p.stats.damage * K.rbSeal.mul });
  if (hasPerk(p, "rbCrack")) marks.push({ x, y, kind: 2, age: 0, life: K.rbCrack.ticks, r: H.slamR * size * K.rbCrack.size, dmg: p.stats.damage * K.rbCrack.mul });
  if (hasPerk(p, "rbGhost") && rng.nextFloat() < K.rbGhost.chance * luckMul(p)) {
    const e = farFoe(s, x, y, hit.map((h) => h.id));
    if (e) marks.push({ x: e.x, y: e.y, kind: 1, age: 0, life: K.rbGhost.delay, r: K.rbGhost.r * size, dmg: p.stats.damage * H.mul * K.rbGhost.mul * megaMul(p) });
  }
  if (hasPerk(p, "rbStar") && rng.nextFloat() < K.rbStar.chance * luckMul(p)) stars(s, x, y);
}

/** 찍은 자리에서 가까운 (이미 맞은 적 빼고) 적 */
function farFoe(s: RunState, x: number, y: number, skip: number[]): EnemyState | null {
  let best: EnemyState | null = null;
  let bd = K.rbGhost.dist ** 2;
  for (const e of s.enemies) {
    const d = (e.x - x) ** 2 + (e.y - y) ** 2;
    if (alive(e) && !skip.includes(e.id) && d < bd) {
      bd = d;
      best = e;
    }
  }
  return best;
}

/** 별사탕: 가까운 적 몇에게 별이 날아가 맞음 */
function stars(s: RunState, x: number, y: number): void {
  const p = s.player;
  const near = s.enemies.filter((e) => alive(e) && (e.x - x) ** 2 + (e.y - y) ** 2 < K.rbStar.dist ** 2);
  near.sort((a, b) => (a.x - x) ** 2 + (a.y - y) ** 2 - ((b.x - x) ** 2 + (b.y - y) ** 2) || a.id - b.id);
  for (const e of near.slice(0, K.rbStar.n)) {
    const d = normalize(e.x - x, e.y - y) ?? [0, 0];
    damageEnemyLite(s, e, p.stats.damage * K.rbStar.mul, d[0], d[1]);
    addEffect(s, { kind: "rbStar", x, y, toX: e.x, toY: e.y, dirX: d[0], dirY: d[1], size: 6, maxTicks: 18 });
  }
}

/** 땅울림 파동 내보내기 (세 갈래면 바라보는 쪽 ± 각도) */
function sendWaves(s: RunState, x: number, y: number): void {
  const p = s.player;
  const list = (p.rbWaves ??= []);
  const angles = hasPerk(p, "rbTriple") ? [-H.waveSpread, 0, H.waveSpread] : [0];
  for (const a of angles) {
    if (list.length >= H.waveMax) return;
    const [c, n] = rot(a);
    const dx = p.faceX * c - p.faceY * n;
    const dy = p.faceX * n + p.faceY * c;
    list.push({ x, y, dx, dy, r: H.waveR * hammerSize(p), dmg: p.stats.damage * H.waveMul * megaMul(p), age: -H.grow, hit: [] });
  }
}

/** 틱마다: 파동이 쿵·쿵·쿵 한 칸씩 찍으며 나아가 때림 (맵 끝에 닿으면 여진) · 바닥 것 */
export function marksTick(s: RunState): void {
  const p = s.player;
  if (p.rbWaves?.length) p.rbWaves = p.rbWaves.filter((w) => waveStep(s, w));
  if (p.rbMarks?.length) p.rbMarks = p.rbMarks.filter((m) => markStep(s, m));
}

function waveStep(s: RunState, w: NonNullable<RunState["player"]["rbWaves"]>[number]): boolean {
  w.age++;
  // 다 커진 뒤(그림 1~4칸)부터 waveEvery 틱마다 한 번씩 앞으로 쿵 (그 사이에는 그 자리에 머묾)
  if (w.age < 0 || w.age % H.waveEvery !== 0) return true;
  if (w.end) return false;
  w.x += w.dx * H.waveStep * w.r;
  w.y += w.dy * H.waveStep * w.r;
  const out = w.x < ROOM_MIN_X || w.x > ROOM_MAX_X || w.y < ROOM_MIN_Y || w.y > ROOM_MAX_Y;
  // 맵 끝을 넘으면 끝에서 마지막으로 찍음
  w.x = Math.min(ROOM_MAX_X, Math.max(ROOM_MIN_X, w.x));
  w.y = Math.min(ROOM_MAX_Y, Math.max(ROOM_MIN_Y, w.y));
  for (const e of s.enemies) {
    if (!alive(e) || w.hit.includes(e.id) || (e.x - w.x) ** 2 + (e.y - w.y) ** 2 > (w.r + e.r) ** 2) continue;
    w.hit.push(e.id);
    damageEnemyLite(s, e, w.dmg, w.dx, w.dy);
  }
  if (!out) return true;
  w.end = true;
  if (hasPerk(s.player, "rbAfter")) rbArea(s, w.x, w.y, K.rbAfter.r * hammerSize(s.player), s.player.stats.damage * K.rbAfter.mul, "rbAfter");
  return true;
}

function markStep(s: RunState, m: NonNullable<RunState["player"]["rbMarks"]>[number]): boolean {
  m.age++;
  if (m.kind === 2) {
    // 갈라진 땅: 느리게 · 몇 틱마다 조금씩 피해
    for (const e of s.enemies) {
      if (!alive(e) || (e.x - m.x) ** 2 + (e.y - m.y) ** 2 > (m.r + e.r) ** 2) continue;
      e.slowTicks = Math.max(e.slowTicks ?? 0, K.rbCrack.slow);
      if (m.age % K.rbCrack.every === 0) damageEnemyLite(s, e, m.dmg, 0, 0);
    }
    return m.age < m.life;
  }
  if (m.age < m.life) return true;
  if (m.kind === 0) rbArea(s, m.x, m.y, m.r, m.dmg, "rbBunny");
  else rbArea(s, m.x, m.y, m.r, m.dmg, "rbSlam", { style: 3 });
  return false;
}
