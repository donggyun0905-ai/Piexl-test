// 오토마타(테라코어, 시즌 2): 처음으로 자아를 가진 기계 인형. 손에서 레이저를 쏘고 · 다시 쏘고 (모든 무기의 기본 공격)
// 자매 인형(똑같은 오토마타)이 곁에서 함께 쏘거나, 등 뒤에서 유도 미사일이 7발 넘게 솟음. 수치는 weaponsAutomata.AUTOMATA, 아이템은 itemsAutomata
import { TICK_RATE } from "../constants";
import { AUTOMATA_PERKS as K } from "../itemsAutomata";
import { createRng, deriveSeed } from "../rng";
import type { StatMod } from "../stats";
import { AUTOMATA as A, type AutoStyle } from "../weaponsAutomata";
import { nearest } from "./brawlMoves";
import { recalcStats } from "./items";
import { alive, onSegment, root, strike } from "./s2Kit";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, dist2, hasPerk, weaponOf } from "./util";

const styleOf = (p: PlayerState): AutoStyle => weaponOf(p).auto ?? { beams: 1, spread: 0, width: 3 };
const roll = (s: RunState, tag: string, n: number) => createRng(deriveSeed(s.seed, tag, s.tick, n)).nextFloat();

/** 방어 필드: 받는 피해 (classTaken) */
export const automataTaken = (p: PlayerState) => (p.characterId === "automata" && hasPerk(p, "adShield") ? K.adShield.taken : 1);

/** 깨어난 자아: 쓰러뜨린 적 수만큼 공격력 (items.recalcStats) */
export function automataMods(p: PlayerState): StatMod[] {
  if (p.characterId !== "automata" || !hasPerk(p, "adSoul")) return [];
  const n = Math.min(K.adSoul.max, Math.floor((p.adKills ?? 0) / K.adSoul.every));
  return n > 0 ? [{ stat: "damage", add: n }] : [];
}

/** 맞힌 적이 쓰러졌는지 세기 (자아가 한 칸 오르면 능력치 다시 계산) */
function count(s: RunState, e: EnemyState): void {
  const p = s.player;
  if (e.hp > 0) return;
  const before = Math.floor((p.adKills ?? 0) / K.adSoul.every);
  p.adKills = (p.adKills ?? 0) + 1;
  if (hasPerk(p, "adSoul") && Math.floor(p.adKills / K.adSoul.every) !== before) recalcStats(s);
}

/** (x,y)에서 방향 (dx,dy)로 len만큼 레이저 한 줄: 닿는 적 모두 (반환: 맞힌 적) */
function beam(s: RunState, x: number, y: number, dx: number, dy: number, len: number, w: number, dmg: number, tint?: string): EnemyState[] {
  const bx = x + dx * len;
  const by = y + dy * len;
  const hit = onSegment(s, x, y, bx, by, w);
  for (const e of hit) {
    strike(s, e, dmg);
    count(s, e);
  }
  addEffect(s, { kind: "adBeam", x, y, dirX: dx, dirY: dy, size: w, toX: bx, toY: by, maxTicks: 10, tint });
  return hit;
}

/** 쏠 방향 (가까운 적, 없으면 바라보는 쪽) */
function aim(s: RunState, x: number, y: number, range: number): [number, number] {
  const p = s.player;
  const e = alive(s)
    .filter((o) => dist2(o, { x, y }) <= (range + o.r) ** 2)
    .sort((a, b) => dist2(a, { x, y }) - dist2(b, { x, y }) || a.id - b.id)[0];
  if (!e) return [p.faceX, p.faceY];
  const d = Math.hypot(e.x - x, e.y - y) || 1;
  return [(e.x - x) / d, (e.y - y) / d];
}

/** 등 뒤에서 유도 미사일 n발 (연기를 뿜으며 솟았다가 적에게) */
function missiles(s: RunState, n: number): void {
  const p = s.player;
  const dmg = p.stats.damage * A.missileMul;
  const blast = A.missileBlast * (hasPerk(p, "adWarhead") ? K.adWarhead.r : 1);
  const [ax, ay] = aim(s, p.x, p.y, p.stats.range * 1.5);
  const base = Math.atan2(ay, ax);
  for (let i = 0; i < n; i++) {
    // 등 뒤 양쪽으로 펼쳐 나갔다가 휘어 들어감
    const a = base + Math.PI + (i - (n - 1) / 2) * (2.4 / Math.max(1, n - 1)) * 0.9;
    const sp = A.missileSpeed * (0.85 + roll(s, "msp", i) * 0.3);
    s.projectiles.push({ id: s.nextId++, fromPlayer: true, x: p.x - p.faceX * 4, y: p.y - 6, prevX: p.x, prevY: p.y - 6, r: 2.5, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 0.8, damage: dmg, ticksLeft: A.missileTicks, homing: true, blast, splash: 0.8, spirit: "adMissile" });
  }
  addEffect(s, { kind: "adLaunch", x: p.x, y: p.y - 8, dirX: -p.faceX, dirY: -1, size: n, maxTicks: 18 });
}

/** 한 번 쏘기: 레이저(여러 갈래) · 갈라짐 · 묶음 · 궤도 포격 · 미사일 */
function fire(s: RunState): void {
  const p = s.player;
  const st = styleOf(p);
  const dmg = p.stats.damage * (hasPerk(p, "adFocus") ? K.adFocus.mul : 1);
  const w = st.width + (hasPerk(p, "adWide") ? K.adWide.add : 0);
  const [dx, dy] = aim(s, p.x, p.y, p.stats.range);
  const times = hasPerk(p, "adEcho") && roll(s, "echo", 0) < K.adEcho.chance ? 2 : 1;
  for (let k = 0; k < times; k++) {
    for (let i = 0; i < st.beams; i++) {
      const a = (i - (st.beams - 1) / 2) * st.spread;
      const bx = dx * Math.cos(a) - dy * Math.sin(a);
      const by = dx * Math.sin(a) + dy * Math.cos(a);
      const hit = beam(s, p.x + bx * 4, p.y - 4 + by * 4, bx, by, p.stats.range, w, dmg);
      for (const e of hit) if (st.bind) root(e, st.bind);
      if (st.split && hit[0]) prism(s, hit[0], st.split, dmg * A.splitMul, w);
    }
  }
  p.adShots = (p.adShots ?? 0) + 1;
  if (st.sat && p.adShots % st.sat === 0) {
    const t = nearest(s, p.stats.range * 1.4) ?? { x: p.x + dx * 50, y: p.y + dy * 50 };
    for (const e of alive(s)) if (dist2(e, t) <= (A.satR + e.r) ** 2) {
      strike(s, e, p.stats.damage * A.satMul);
      count(s, e);
    }
    addEffect(s, { kind: "adSat", x: t.x, y: t.y, dirX: 0, dirY: 0, size: A.satR, maxTicks: 20 });
  }
  if (st.missiles) {
    const chance = st.missiles.chance + (hasPerk(p, "adSalvo") ? K.adSalvo.chance : 0);
    if (roll(s, "missile", 0) < chance) missiles(s, st.missiles.n + Math.floor(roll(s, "mn", 0) * (A.missileExtra + 1)) + (hasPerk(p, "adSalvo") ? K.adSalvo.n : 0));
  }
}

/** 프리즘: 맞힌 적에서 가까운 다른 적들에게 갈라짐 */
function prism(s: RunState, from: EnemyState, n: number, dmg: number, w: number): void {
  const others = alive(s)
    .filter((e) => e !== from && dist2(e, from) <= A.splitReach ** 2)
    .sort((a, b) => dist2(a, from) - dist2(b, from) || a.id - b.id)
    .slice(0, n);
  for (const e of others) {
    const d = Math.hypot(e.x - from.x, e.y - from.y) || 1;
    beam(s, from.x, from.y, (e.x - from.x) / d, (e.y - from.y) / d, d, Math.max(2, w - 1), dmg, "#c8a8ff");
  }
}

/** 자매 인형: 내 뒤 양옆에 줄지어 따라오며 따로 레이저를 쏨 */
function dolls(s: RunState): void {
  const p = s.player;
  const n = Math.max(styleOf(p).dolls ?? 0, hasPerk(p, "adCall") ? K.adCall.n : 0) + (hasPerk(p, "adFourth") ? K.adFourth.n : 0);
  if (n <= 0) {
    delete p.adDolls;
    return;
  }
  const list = (p.adDolls ?? []).slice(0, n);
  while (list.length < n) list.push({ x: p.x, y: p.y, cd: A.dollEvery / 2 + list.length * 7 });
  list.forEach((d, i) => {
    const a = Math.atan2(-p.faceY, -p.faceX) + (i - (n - 1) / 2) * 0.9;
    const tx = p.x + Math.cos(a) * A.dollGap;
    const ty = p.y + Math.sin(a) * A.dollGap;
    d.x += (tx - d.x) * 0.2;
    d.y += (ty - d.y) * 0.2;
    if (--d.cd > 0) return;
    const target = alive(s).some((e) => dist2(e, d) <= (A.dollRange + e.r) ** 2);
    if (!target) return;
    d.cd = A.dollEvery;
    const [dx, dy] = aim(s, d.x, d.y, A.dollRange);
    beam(s, d.x + dx * 3, d.y - 4 + dy * 3, dx, dy, A.dollRange, 2, p.stats.damage * A.dollMul, "#8ae8ff");
  });
  p.adDolls = list;
}

/** 틱마다 (오토마타 무기를 들었을 때 player에서) */
export function automataTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  dolls(s);
  if (!want || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  fire(s);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetAutomata(p: PlayerState): void {
  for (const k of ["adDolls", "adShots"] as const) delete p[k];
}
