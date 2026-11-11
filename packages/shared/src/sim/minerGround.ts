// 에테르 광부 땅 위의 것들: 원석 모으기 · 광산 붕괴 바위 · 에테르 결정(깨면 파편) · 땅 갈라짐 · 다이너마이트 · 구덩이
// 수치는 weaponsMiner.MINER, 아이템은 itemsMiner
import { srcRun, srcFn } from "./dmgSrc";
import { MINER_PERKS as K } from "../itemsMiner";
import { MINER as M } from "../weaponsMiner";
import { createRng, deriveSeed } from "../rng";
import { addGold, blastAt as blastAt_ } from "./combat";
import { rot } from "./orbit";
import { alive, inCircle, isBoss, onSegment, strike as strike_ } from "./s2Kit";
import type { GroundMark } from "./secretTypes";
import type { EnemyState, RunState } from "./types";
import { addEffect, hasPerk, weaponOf } from "./util";
const blastAt = srcFn("minerGround", () => blastAt_), strike = srcFn("minerGround", () => strike_);

const rng = (s: RunState, ...tags: (string | number)[]) => createRng(deriveSeed(s.seed, "miner", s.tick, ...tags));

/** 광산 붕괴에 필요한 원석 */
export const caveNeed = (s: RunState) => M.caveNeed * (hasPerk(s.player, "mnExpert") ? K.mnExpert.mul : 1);

/** 원석 캐기 (광맥 감지·드릴은 두 배 · 금맥은 돈) · 다 모이면 광산 붕괴 */
export function gainOre(s: RunState, n: number): void {
  const p = s.player;
  if (n <= 0 || p.characterId !== "miner") return;
  n *= (hasPerk(p, "mnVein") ? K.mnVein.mul : 1) * (weaponOf(p).pick?.mode === "drill" ? 2 : 1);
  p.mnOre = (p.mnOre ?? 0) + n;
  p.mnTotal = (p.mnTotal ?? 0) + n;
  if (hasPerk(p, "mnGold")) srcRun(s, "mnGold", () => addGold(s, n * K.mnGold.gold));
  const need = caveNeed(s);
  if (p.mnOre < need) return;
  p.mnOre -= need;
  caveIn(s);
}

/** 광산 붕괴: 적 머리 위(모자라면 아무 데나)로 바위가 떨어짐 */
function caveIn(s: RunState): void {
  const p = s.player;
  const foes = alive(s);
  const n = M.rocks * (hasPerk(p, "mnChain") ? K.mnChain.rocks : 1);
  const r = rng(s, "cave");
  const rocks = (p.mnRocks ??= []);
  for (let i = 0; i < n; i++) {
    const e = foes[i % Math.max(1, foes.length)];
    const [dx, dy] = rot(r.nextFloat() * Math.PI * 2);
    const far = 20 + r.nextFloat() * 90;
    const x = e && i < foes.length * 2 ? e.x + dx * (i < foes.length ? 0 : 14) : p.x + dx * far;
    const y = e && i < foes.length * 2 ? e.y + dy * (i < foes.length ? 0 : 14) : p.y + dy * far;
    rocks.push({ x, y, t: M.rockDelay + (i % 6) * 4, dmg: p.stats.damage * M.rockMul });
  }
  addEffect(s, { kind: "mnCave", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 200, maxTicks: 40 });
}

/** 보통 적을 그대로 끝냄 (구덩이·대박 원석) */
export function finish(s: RunState, e: EnemyState): void {
  if (e.immune || e.hp <= 0) return;
  e.hp = 0;
  e.hitFlash = 6;
}

/** 쓰러진 보통 적은 에테르 결정이 됨 (combat 처치에서) */
export function minerKill(s: RunState, e: EnemyState): void {
  const p = s.player;
  if (p.characterId !== "miner" || isBoss(e) || e.noGold || e.kind === "dummy") return;
  const nodes = (p.mnNodes ??= []);
  nodes.push({ x: e.x, y: e.y, t: M.nodeTicks });
  if (nodes.length > M.nodeMax) nodes.shift();
}

/** 결정 깨기: 파편이 사방으로 튀고 원석 (연쇄 발파: 폭발) */
export function shatter(s: RunState, n: GroundMark): void {
  const p = s.player;
  const k = M.shards;
  for (let i = 0; i < k; i++) {
    const [dx, dy] = rot((i * Math.PI * 2) / k + s.tick * 0.1);
    s.projectiles.push({ id: s.nextId++, fromPlayer: true, x: n.x, y: n.y, prevX: n.x, prevY: n.y, r: 3, vx: dx * 3.2, vy: dy * 3.2, damage: p.stats.damage * M.shardMul, ticksLeft: 30, spirit: "mnShard", pierce: 2, hitIds: [] });
  }
  if (hasPerk(p, "mnChain")) srcRun(s, "mnChain", () => blastAt(s, n.x, n.y, K.mnChain.r, p.stats.damage * K.mnChain.mul));
  addEffect(s, { kind: "mnShatter", x: n.x, y: n.y, dirX: 0, dirY: 0, size: 14, maxTicks: 18 });
  gainOre(s, M.nodeOre);
}

/** 곡괭이가 닿은 결정을 깸 (x, y 둘레 r) */
export function hitNodes(s: RunState, x: number, y: number, r: number): void {
  const p = s.player;
  if (!p.mnNodes?.length) return;
  const keep: GroundMark[] = [];
  const broke: GroundMark[] = [];
  for (const n of p.mnNodes) (Math.hypot(n.x - x, n.y - y) <= r + 6 ? broke : keep).push(n);
  p.mnNodes = keep;
  for (const n of broke) shatter(s, n);
}

/** 땅 갈라짐 놓기 (나에게서 바라보는 쪽으로) */
export function addCrack(s: RunState, len: number, dmg: number): void {
  const p = s.player;
  const c = { x: p.x, y: p.y, tx: p.x + p.faceX * len, ty: p.y + p.faceY * len, t: M.crackDelay, dmg };
  (p.mnCracks ??= []).push(c);
  addEffect(s, { kind: "mnCrack", x: c.x, y: c.y, dirX: p.faceX, dirY: p.faceY, size: M.crackWidth, toX: c.tx, toY: c.ty, maxTicks: M.crackDelay + 14 });
}

/** 틱마다 하나씩 줄이고, 다 된 것만 돌려줌 */
function due(list: GroundMark[] | undefined): [GroundMark[], GroundMark[]] {
  const done: GroundMark[] = [];
  const keep: GroundMark[] = [];
  for (const m of list ?? []) (--m.t <= 0 ? done : keep).push(m);
  return [done, keep];
}

/** 틱마다: 결정이 사라짐 · 갈라짐이 터짐 · 바위가 떨어짐 · 다이너마이트 · 구덩이에 빠짐 */
export function groundTick(s: RunState): void {
  const p = s.player;
  if (p.mnNodes?.length) p.mnNodes = due(p.mnNodes)[1];
  const [cracks, c2] = due(p.mnCracks);
  p.mnCracks = c2;
  for (const c of cracks) {
    for (const e of onSegment(s, c.x, c.y, c.tx ?? c.x, c.ty ?? c.y, M.crackWidth)) strike(s, e, c.dmg ?? 0);
    addEffect(s, { kind: "mnErupt", x: c.x, y: c.y, dirX: 0, dirY: 0, size: M.crackWidth, toX: c.tx, toY: c.ty, maxTicks: 16 });
    hitNodesOnLine(s, c);
  }
  const [rocks, r2] = due(p.mnRocks);
  p.mnRocks = r2;
  for (const r of rocks) {
    blastAt(s, r.x, r.y, M.rockR, r.dmg ?? 0);
    addEffect(s, { kind: "mnRock", x: r.x, y: r.y, dirX: 0, dirY: 0, size: M.rockR, maxTicks: 16 });
  }
  const [bombs, b2] = due(p.mnBombs);
  p.mnBombs = b2;
  for (const b of bombs) {
    blastAt(s, b.x, b.y, M.tntR, b.dmg ?? 0, { push: 10 });
    addEffect(s, { kind: "mnBoom", x: b.x, y: b.y, dirX: 0, dirY: 0, size: M.tntR, maxTicks: 18 });
    hitNodes(s, b.x, b.y, M.tntR);
  }
  pits(s);
}

/** 갈라짐이 지나간 결정도 깨짐 */
function hitNodesOnLine(s: RunState, c: GroundMark): void {
  const p = s.player;
  const keep: GroundMark[] = [];
  const broke: GroundMark[] = [];
  const vx = (c.tx ?? c.x) - c.x;
  const vy = (c.ty ?? c.y) - c.y;
  const l2 = vx * vx + vy * vy || 1;
  for (const n of p.mnNodes ?? []) {
    const t = Math.max(0, Math.min(1, ((n.x - c.x) * vx + (n.y - c.y) * vy) / l2));
    (Math.hypot(n.x - c.x - vx * t, n.y - c.y - vy * t) <= M.crackWidth + 6 ? broke : keep).push(n);
  }
  p.mnNodes = keep;
  for (const n of broke) shatter(s, n);
}

/** 구덩이: 빠진 보통 적은 그대로 끝 · 보스는 한 번 크게 다침 */
function pits(s: RunState): void {
  const p = s.player;
  if (!p.mnPits?.length) return;
  p.mnPits = due(p.mnPits)[1];
  for (const pit of p.mnPits) {
    for (const e of inCircle(s, pit.x, pit.y, M.pitR - 4)) {
      if (!isBoss(e)) {
        finish(s, e);
        addEffect(s, { kind: "mnFall", x: pit.x, y: pit.y, dirX: 0, dirY: 0, size: e.r, maxTicks: 20 });
        gainOre(s, 2);
        continue;
      }
      if ((pit.hit ??= []).includes(e.id)) continue;
      pit.hit.push(e.id);
      strike(s, e, p.stats.damage * M.pitBossMul);
      addEffect(s, { kind: "mnFall", x: pit.x, y: pit.y, dirX: 0, dirY: 0, size: e.r, maxTicks: 20 });
    }
  }
}
