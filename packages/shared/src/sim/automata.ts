// 오토마타(테라코어, 시즌 2): 처음으로 자아를 가진 기계 인형. 손에서 레이저를 쏘고 · 다시 쏘고 (모든 무기의 기본 공격)
// 자매 인형(똑같은 오토마타)이 곁에서 함께 쏘거나, 등 뒤에서 유도 미사일이 7발 넘게 솟음. 수치는 weaponsAutomata.AUTOMATA, 아이템은 itemsAutomata
import { TICK_RATE } from "../constants";
import { AUTOMATA_PERKS as K } from "../itemsAutomata";
import { createRng, deriveSeed } from "../rng";
import type { StatMod } from "../stats";
import { AUTOMATA as A, type AutoStyle } from "../weaponsAutomata";
import { nearest } from "./brawlMoves";
import { recalcStats } from "./items";
import { backMissiles } from "./missiles";
import { alive, inCone, onSegment, root, strike } from "./s2Kit";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, dist2, hasPerk, keepInRoom, markCrit, roomGrid, weaponOf } from "./util";

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
function beam(s: RunState, x: number, y: number, dx: number, dy: number, len: number, w: number, dmg: number, tint?: string, crit = 0): EnemyState[] {
  const bx = x + dx * len;
  const by = y + dy * len;
  const hit = onSegment(s, x, y, bx, by, w);
  for (const e of hit) {
    const c = crit > 0 && roll(s, "adCrit", e.id) < crit;
    if (c) markCrit(s, e);
    strike(s, e, c ? dmg * A.critMul : dmg);
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

/** 등 뒤에서 유도 미사일: 기본 능력(확률·수) 또는 무기의 미사일 값 (탄약 증설이면 확률·수 +) */
function missiles(s: RunState, spec: { chance: number; n: number }, from?: { x: number; y: number }, salt = 0, mul = A.missileMul): void {
  const p = s.player;
  const salvo = hasPerk(p, "adSalvo");
  if (roll(s, "missile", salt) >= spec.chance + (salvo ? K.adSalvo.chance : 0)) return;
  const n = spec.n + Math.floor(roll(s, "mn", salt) * (A.missileExtra + 1)) + (salvo ? K.adSalvo.n : 0);
  backMissiles(s, n, p.stats.damage * mul, A.missileBlast * (hasPerk(p, "adWarhead") ? K.adWarhead.r : 1), false, from);
}

/** 한 번 쏘기: 레이저(여러 갈래) · 갈라짐 · 묶음 · 궤도 포격 · 미사일 */
function fire(s: RunState): void {
  const p = s.player;
  const st = styleOf(p);
  // 기본 능력: 확률로 등 뒤에서 유도 미사일 (전탄 발사는 늘)
  missiles(s, st.missiles ?? A.baseMissiles);
  if (st.sword) {
    swing(s, 0);
    p.adSwing = A.swordGap;
    return;
  }
  const dmg = p.stats.damage * (hasPerk(p, "adFocus") ? K.adFocus.mul : 1);
  const crit = st.crits ? st.crits[(p.adShots ?? 0) % st.crits.length]! : 0;
  const w = st.width + (hasPerk(p, "adWide") ? K.adWide.add : 0);
  const [dx, dy] = aim(s, p.x, p.y, p.stats.range);
  const times = hasPerk(p, "adEcho") && roll(s, "echo", 0) < K.adEcho.chance ? 2 : 1;
  for (let k = 0; k < times; k++) {
    for (let i = 0; i < st.beams; i++) {
      const a = (i - (st.beams - 1) / 2) * st.spread;
      const bx = dx * Math.cos(a) - dy * Math.sin(a);
      const by = dx * Math.sin(a) + dy * Math.cos(a);
      const hit = beam(s, p.x + bx * 4, p.y - 4 + by * 4, bx, by, p.stats.range, w, dmg, st.tint, crit);
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

/** 리펄서 소드: 바라보는 쪽(가까운 적) 부채꼴을 양손 대검으로 벰 (k = 몇 번째 베기) */
function swing(s: RunState, k: number): void {
  const p = s.player;
  const [dx, dy] = aim(s, p.x, p.y, p.stats.range + 20);
  p.faceX = dx;
  p.faceY = dy;
  for (const e of inCone(s, p.stats.range, A.swordArc)) {
    strike(s, e, p.stats.damage * (hasPerk(p, "adFocus") ? K.adFocus.mul : 1), A.swordPush);
    count(s, e);
  }
  addEffect(s, { kind: "adSword", x: p.x, y: p.y, dirX: dx, dirY: dy, size: p.stats.range, maxTicks: 10, width: k });
}

/** 자매 인형마다 레이저 색 (화면의 인형 색과 맞춤: 분홍 · 연두 · 보라 · 금빛) */
export const DOLL_TINTS = ["#ff8ad8", "#8aff9a", "#b08aff", "#ffd04a"] as const;

/** 자매 인형: 저마다 다른 적을 찾아 돌아다니며 따로 레이저를 쏨 (나에게서 너무 멀어지면 돌아옴) */
function dolls(s: RunState): void {
  const p = s.player;
  // 무기의 인형 수 + 아이템마다 더함 (자매 인형 무기 셋에 자매 부르기를 먹으면 넷)
  const n = (styleOf(p).dolls ?? 0) + (hasPerk(p, "adCall") ? K.adCall.n : 0) + (hasPerk(p, "adFourth") ? K.adFourth.n : 0);
  if (n <= 0) {
    delete p.adDolls;
    return;
  }
  const list = (p.adDolls ?? []).slice(0, n);
  while (list.length < n) list.push({ x: p.x, y: p.y, cd: A.dollEvery / 2 + list.length * 7 });
  const taken = new Set<number>();
  const grid = roomGrid(s);
  list.forEach((d, i) => {
    // 가까운 적 중 다른 인형이 고르지 않은 적 (없으면 아무 적)
    const near = alive(s)
      .filter((e) => dist2(e, p) <= A.dollLeash ** 2)
      .sort((a, b) => dist2(a, d) - dist2(b, d) || a.id - b.id);
    const e = near.find((o) => !taken.has(o.id)) ?? near[0];
    let tx: number;
    let ty: number;
    if (e) {
      taken.add(e.id);
      // 적에게서 사거리 반쯤 떨어진 자리로 (인형마다 다른 쪽에서)
      const a = Math.atan2(d.y - e.y, d.x - e.x) + (i - (n - 1) / 2) * 0.3;
      tx = e.x + Math.cos(a) * A.dollRange * 0.45;
      ty = e.y + Math.sin(a) * A.dollRange * 0.45;
    } else {
      // 적이 없으면 내 둘레를 저마다 다른 자리에서 천천히 돔
      const a = (i / n) * Math.PI * 2 + s.tick * 0.012;
      tx = p.x + Math.cos(a) * A.dollGap;
      ty = p.y + Math.sin(a) * A.dollGap;
    }
    const dd = Math.hypot(tx - d.x, ty - d.y);
    if (dd > 1) {
      const step = Math.min(dd, A.dollSpeed * (dd > A.dollLeash ? 3 : 1));
      d.x += ((tx - d.x) / dd) * step;
      d.y += ((ty - d.y) / dd) * step;
    }
    // 방 밖·벽 안으로 나가지 않게
    const body = { x: d.x, y: d.y, prevX: d.x, prevY: d.y, r: 4 };
    keepInRoom(body, grid);
    d.x = body.x;
    d.y = body.y;
    if (--d.cd > 0 || !e || dist2(e, d) > (A.dollRange + e.r) ** 2) return;
    d.cd = A.dollEvery;
    const dl = Math.hypot(e.x - d.x, e.y - d.y) || 1;
    beam(s, d.x, d.y - 4, (e.x - d.x) / dl, (e.y - d.y) / dl, A.dollRange, 2, p.stats.damage * A.dollMul, DOLL_TINTS[i % DOLL_TINTS.length]);
    // 분신도 확률로 등 뒤에서 유도 미사일
    missiles(s, { ...A.baseMissiles, chance: A.dollMissile }, d, i + 1, A.dollMissileMul);
  });
  p.adDolls = list;
}

/** 틱마다 (오토마타 무기를 들었을 때 player에서) */
export function automataTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  dolls(s);
  // 리펄서 소드: 두 번째 베기
  if (p.adSwing && --p.adSwing <= 0) {
    delete p.adSwing;
    swing(s, 1);
  }
  if (!want || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  fire(s);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetAutomata(p: PlayerState): void {
  for (const k of ["adDolls", "adShots", "adSwing"] as const) delete p[k];
}
