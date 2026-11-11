// 에테르 광부(히든, 시즌 2): 곡괭이로 적을 "캐서" 에테르 원석을 모음. 원석 100이면 광산 붕괴(방 전체 바위)
// 쓰러진 보통 적은 에테르 결정이 되고, 곡괭이로 깨면 파편이 튐 · 대시는 땅굴(무적, 나오며 둘레를 터뜨림)
// 무기마다: 땅 갈라짐 · 드릴 · 다이너마이트 · 광차 · 구덩이(빠지면 끝) · 자석 · 보석 · 던지는 곡괭이 · 에테르 기둥
// 수치는 weaponsMiner.MINER, 아이템은 itemsMiner, 땅 위의 것은 minerGround
import { TICK_RATE } from "../constants";
import { createRng, deriveSeed } from "../rng";
import { MINER_PERKS as K } from "../itemsMiner";
import { MINER as M, type PickStyle } from "../weaponsMiner";
import { blastAt as blastAt_ } from "./combat";
import { nearest } from "./brawlMoves";
import { addCrack, finish, gainOre, groundTick, hitNodes } from "./minerGround";
import { alive, inCircle, inCone, isBoss, shoot, strike as strike_, stun } from "./s2Kit";
import type { EnemyState, PlayerState, ProjectileState, RunState } from "./types";
import { addEffect, hasPerk, keepInRoom, normalize, roomGrid, weaponOf } from "./util";
import { srcFn } from "./dmgSrc";
const blastAt = srcFn("miner", () => blastAt_), strike = srcFn("miner", () => strike_);

const styleOf = (p: PlayerState): PickStyle => weaponOf(p).pick ?? { mode: "swing", reach: 30, arc: 0.1, crack: 3 };
const roll = (s: RunState, tag: string, n: number) => createRng(deriveSeed(s.seed, "mn", tag, s.tick, n)).nextFloat();

/** 화면용: 광산 붕괴에 필요한 원석 · 모인 원석 */
export { caveNeed } from "./minerGround";
export const minerOre = (p: PlayerState) => p.mnOre ?? 0;

/** 맞힌 적마다: 원석 · 대박 원석 · 보석 · 에테르 기둥 */
function onHit(s: RunState, e: EnemyState, dmg: number): void {
  const p = s.player;
  const st = styleOf(p);
  gainOre(s, 1);
  if (hasPerk(p, "mnJackpot") && !isBoss(e) && roll(s, "jack", e.id) < K.mnJackpot.chance) {
    finish(s, e);
    addEffect(s, { kind: "mnGem", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 4, maxTicks: 20, tint: "#ffd040" });
    return;
  }
  if (st.mode === "gem") {
    if ((e.mnGemT ?? 0) > s.tick) {
      delete e.mnGemT;
      strike(s, e, dmg * (M.gemMul - 1));
      addEffect(s, { kind: "mnShatter", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 8, maxTicks: 18 });
      gainOre(s, 3);
    } else if (e.hp > 0 && roll(s, "gem", e.id) < M.gemChance) {
      e.mnGemT = s.tick + M.gemTicks;
      stun(e, M.gemTicks);
      addEffect(s, { kind: "mnGem", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 4, maxTicks: 20 });
    }
  }
  if (st.mode === "pillar") {
    const foes = alive(s).filter((f) => f.id !== e.id);
    const f = foes[Math.floor(roll(s, "pil", e.id) * foes.length)] ?? e;
    strike(s, f, p.stats.damage * M.pillarMul);
    addEffect(s, { kind: "mnPillar", x: f.x, y: f.y, dirX: 0, dirY: 0, size: f.r + 6, maxTicks: 18 });
  }
}

/** 탄(파편·광차·던진 곡괭이)이 맞았을 때 (s2Hits) */
export function minerShotHit(s: RunState, pr: ProjectileState, e: EnemyState): void {
  if (pr.spirit === "mnShard" || pr.spirit === "mnCart" || pr.spirit === "mnPickaxe") onHit(s, e, pr.damage);
}

/** 노리는 적 쪽으로 돌아섬 */
function faceTarget(s: RunState): EnemyState | null {
  const p = s.player;
  const e = nearest(s, p.stats.range + 40);
  const d = e && normalize(e.x - p.x, e.y - p.y);
  if (d) [p.faceX, p.faceY] = d;
  return e;
}

/** 곡괭이질 한 번 */
function attack(s: RunState): void {
  const p = s.player;
  const st = styleOf(p);
  const target = faceTarget(s);
  const dmg = p.stats.damage;
  const n = p.attackCount;
  if (st.mode === "magnet") {
    for (const e of inCircle(s, p.x, p.y, M.magnetR)) {
      if (isBoss(e)) continue;
      const d = normalize(p.x - e.x, p.y - e.y);
      if (!d) continue;
      const step = Math.min(M.magnetPull, Math.hypot(p.x - e.x, p.y - e.y) - e.r - p.r);
      e.x += d[0] * Math.max(0, step);
      e.y += d[1] * Math.max(0, step);
      keepInRoom(e, roomGrid(s));
    }
    addEffect(s, { kind: "mnPull", x: p.x, y: p.y, dirX: 0, dirY: 0, size: M.magnetR, maxTicks: 16 });
  }
  if (st.mode === "throw") {
    shoot(s, 0, { damage: dmg, spirit: "mnPickaxe", r: M.throwR, range: p.stats.range, speed: 3.5, pierce: 99 });
    const pr = s.projectiles[s.projectiles.length - 1];
    if (pr) {
      pr.back = true;
      pr.span = pr.ticksLeft;
    }
    return;
  }
  const foes = inCone(s, st.reach, st.arc);
  for (const e of foes) {
    strike(s, e, dmg, st.mode === "drill" ? 0 : 3);
    onHit(s, e, dmg);
  }
  hitNodes(s, p.x + p.faceX * st.reach * 0.6, p.y + p.faceY * st.reach * 0.6, st.reach);
  addEffect(s, { kind: "mnSwing", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: st.reach, maxTicks: st.mode === "drill" ? 6 : 12, ...(st.mode === "drill" ? { width: 1 } : {}) });
  if (st.crack > 0 && n % st.crack === 0) addCrack(s, M.crackLen * (st.crack === 1 ? 1.3 : 1), dmg * M.crackMul);
  if (st.mode === "tnt" && target) (p.mnBombs ??= []).push({ x: target.x, y: target.y, t: M.tntDelay, dmg: dmg * M.tntMul });
  if (st.mode === "cart" && n % M.cartEvery === 0) shoot(s, 0, { damage: dmg * M.cartMul, spirit: "mnCart", r: M.cartR, range: p.stats.range * 1.5, speed: M.cartSpeed, pierce: 99 });
  if (st.mode === "pit" && target && n % M.pitEvery === 0) {
    const pits = (p.mnPits ??= []);
    pits.push({ x: target.x, y: target.y, t: M.pitTicks });
    if (pits.length > M.pitMax) pits.shift();
    addEffect(s, { kind: "mnDig", x: target.x, y: target.y, dirX: 0, dirY: 0, size: M.pitR, maxTicks: 14 });
  }
}

/** 땅굴: 대시하는 동안 땅속(무적), 나오며 둘레를 터뜨리고 기절 (두더지: 더 넓고 셈) */
function burrow(s: RunState): void {
  const p = s.player;
  if (p.dashTicks > 0) {
    p.invulnTicks = Math.max(p.invulnTicks, 2);
    if (!p.mnBurrow) addEffect(s, { kind: "mnDig", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 10, maxTicks: 14 });
    p.mnBurrow = true;
    return;
  }
  if (!p.mnBurrow) return;
  p.mnBurrow = false;
  const mole = hasPerk(p, "mnMole");
  const r = M.burrowR * (mole ? K.mnMole.r : 1);
  for (const e of inCircle(s, p.x, p.y, r)) stun(e, M.burrowStun);
  const hits = blastAt(s, p.x, p.y, r, p.stats.damage * M.burrowMul * (mole ? K.mnMole.mul : 1), { push: 12 });
  gainOre(s, hits);
  hitNodes(s, p.x, p.y, r);
  addEffect(s, { kind: "mnBurst", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r, maxTicks: 20 });
}

/** 카나리아: 체력이 낮을 때 맞으면 울어서 보통 적이 모두 기절 */
function canary(s: RunState): void {
  const p = s.player;
  const was = p.mnHp ?? p.hp;
  p.mnHp = p.hp;
  if (!hasPerk(p, "mnCanary") || p.hp >= was || p.hp > p.stats.maxHp * K.mnCanary.hp || s.tick < (p.mnCanaryT ?? 0)) return;
  p.mnCanaryT = s.tick + K.mnCanary.cool;
  for (const e of alive(s)) stun(e, K.mnCanary.stun);
  addEffect(s, { kind: "mnCanary", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 160, maxTicks: 40 });
}

/** 틱마다 (곡괭이를 들었을 때 player에서) */
export function minerTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  if (p.characterId !== "miner") return;
  groundTick(s);
  burrow(s);
  canary(s);
  if (!want || p.attackCooldown > 0 || p.dashTicks > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  attack(s);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetMiner(p: PlayerState): void {
  for (const k of ["mnOre", "mnTotal", "mnNodes", "mnCracks", "mnRocks", "mnBombs", "mnPits", "mnBurrow", "mnCanaryT", "mnHp"] as const) delete p[k];
}
