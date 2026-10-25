// 소환수 움직임·공격: 달려가 치기(해골·늑대·박쥐·골렘) · 거리를 두고 쏘기(임프·궁수·용) · 자폭(불꽃 정령) · 제자리(독버섯) · 내 둘레(요정)
import { ENEMIES } from "../content";
import { SUMMON_PERKS } from "../itemsSummon";
import { SUMMON_STATS, type SummonStat } from "../weaponsSummon";
import { blastAt, damageEnemy } from "./combat";
import { chargeSummon } from "./summon";
import type { Summoned } from "./summonTypes";
import type { EnemyState, ProjectileState, RunState } from "./types";
import { addEffect, dist2, DIR16, hasPerk, keepInRoom, normalize, roomGrid } from "./util";

/** 나와 너무 멀어지지 않게 (이 밖의 적은 쫓지 않음) · 적이 없으면 따라오는 거리 */
const LEASH = 130;
const FOLLOW = 22;
/** 소환수끼리 띄우는 거리 (몸 크기에 더함) */
const GAP = 2;

function nearestTo(s: RunState, x: number, y: number, range: number): EnemyState | null {
  let best: EnemyState | null = null;
  let bestD = Infinity;
  for (const e of s.enemies) {
    if (e.hp <= 0 || e.immune) continue;
    const d = (e.x - x) * (e.x - x) + (e.y - y) * (e.y - y);
    if (d > (range + e.r) * (range + e.r) || d >= bestD) continue;
    best = e;
    bestD = d;
  }
  return best;
}

function moveToward(m: Summoned, x: number, y: number, speed: number, stop: number): void {
  const dx = x - m.x;
  const dy = y - m.y;
  const d = Math.sqrt(dx * dx + dy * dy);
  if (d <= stop || d === 0) return;
  const step = Math.min(speed, d - stop);
  m.x += (dx / d) * step;
  m.y += (dy / d) * step;
  if (Math.abs(dx) > 0.5) m.face = dx > 0 ? 1 : -1;
}

/** 소환수 피해 (강화 소환·지휘 반영). 소환수가 쓰러뜨리면 영혼 수확 */
function hitBy(s: RunState, m: Summoned, e: EnemyState, dmg: number): void {
  const p = s.player;
  let d = dmg;
  if (hasPerk(p, "command") && dist2(m, p) <= SUMMON_PERKS.command.radius ** 2) d *= SUMMON_PERKS.command.damage;
  const dir = normalize(e.x - m.x, e.y - m.y) ?? [1, 0];
  damageEnemy(s, e, d, dir[0], dir[1], false);
  if (e.hp <= 0 && hasPerk(p, "soulHarvest")) chargeSummon(s, 1);
}

function shoot(s: RunState, m: Summoned, e: EnemyState, dmg: number, extra: Partial<ProjectileState>): void {
  const dir = normalize(e.x - m.x, e.y - m.y) ?? [1, 0];
  const speed = 2.8;
  s.projectiles.push({ id: s.nextId++, fromPlayer: true, x: m.x, y: m.y, prevX: m.x, prevY: m.y, r: 2, vx: dir[0] * speed, vy: dir[1] * speed, damage: dmg, ticksLeft: 50, ...extra });
}

/** 틱마다 소환수 움직이고 때리기 */
export function updateSummons(s: RunState): void {
  const p = s.player;
  if (!p.summons?.length) return;
  const base = p.stats.damage * (hasPerk(p, "empower") ? SUMMON_PERKS.empower.damage : 1);
  const fast = (p.lashTicks ?? 0) > 0 ? 1 + SUMMON_PERKS.lash.speed : 1;
  const gone: Summoned[] = [];
  for (const m of p.summons) {
    m.prevX = m.x;
    m.prevY = m.y;
    const st = SUMMON_STATS[m.kind];
    const dmg = base * st.dmg;
    if (m.cd > 0) m.cd -= fast;
    if (--m.life <= 0) {
      gone.push(m);
      continue;
    }
    if (m.kind === "fairy") {
      // 내 둘레를 돌며 유도 별
      const [ox, oy] = DIR16[(m.slot * 5 + (s.tick >> 3)) % 16]!;
      moveToward(m, p.x + ox * 14, p.y + oy * 14, st.speed * 2, 0);
    }
    const e = m.kind === "shroom" || m.kind === "fairy" ? nearestTo(s, m.x, m.y, st.reach) : nearestTo(s, p.x, p.y, LEASH);
    if (!e) {
      if (m.kind !== "shroom" && m.kind !== "fairy") moveToward(m, p.x - p.faceX * 12, p.y - p.faceY * 12, st.speed, FOLLOW);
      continue;
    }
    act(s, m, e, st, dmg, gone);
  }
  spread(s, p.summons.filter((m) => !gone.includes(m)));
  if (gone.length) {
    for (const m of gone) if (hasPerk(p, "sacrifice") && m.kind !== "flame" && m.life <= 0) blastAt(s, m.x, m.y, SUMMON_PERKS.sacrifice.radius, p.stats.damage * SUMMON_PERKS.sacrifice.damage, { still: true });
    p.summons = p.summons.filter((m) => !gone.includes(m));
  }
}

/** 소환수끼리 겹치지 않게 밀어냄 (순서가 정해져 있어 결과가 항상 같음, 독버섯은 제자리) */
function spread(s: RunState, list: Summoned[]): void {
  const g = roomGrid(s);
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const a = list[i]!;
      const b = list[j]!;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const rr = a.r + b.r + GAP;
      const d2 = dx * dx + dy * dy;
      if (d2 >= rr * rr) continue;
      const d = Math.sqrt(d2);
      // 딱 같은 자리면 번호마다 다른 쪽으로
      const [nx, ny] = d === 0 ? DIR16[(a.slot * 5 + b.slot * 3) % 16]! : [dx / d, dy / d];
      const fixA = a.kind === "shroom";
      const fixB = b.kind === "shroom";
      if (fixA && fixB) continue;
      const push = (rr - d) / (fixA || fixB ? 1 : 2);
      if (!fixA) {
        a.x -= nx * push;
        a.y -= ny * push;
        keepInRoom(a, g);
      }
      if (!fixB) {
        b.x += nx * push;
        b.y += ny * push;
        keepInRoom(b, g);
      }
    }
  }
}

/** 종류마다 다가가서 공격 */
function act(s: RunState, m: Summoned, e: EnemyState, st: SummonStat, dmg: number, gone: Summoned[]): void {
  const reach = st.reach + e.r + st.r;
  const close = dist2(m, e) <= reach * reach;
  const ranged = m.kind === "imp" || m.kind === "archer" || m.kind === "drake" || m.kind === "shroom" || m.kind === "fairy";
  if (!close && m.kind !== "shroom" && m.kind !== "fairy") moveToward(m, e.x, e.y, st.speed, ranged ? st.reach * 0.7 : 0);
  else if (m.kind !== "fairy" && m.kind !== "shroom") m.face = e.x >= m.x ? 1 : -1;
  if (!close || m.cd > 0) return;
  m.cd = st.every;
  switch (m.kind) {
    case "flame":
      blastAt(s, m.x, m.y, 14, dmg, { still: true });
      gone.push(m);
      m.life = 1;
      return;
    case "golem":
      for (const t of s.enemies) if (t.hp > 0 && dist2(t, m) <= (st.reach + 8 + t.r) ** 2) hitBy(s, m, t, dmg);
      addEffect(s, { kind: "slam", x: m.x, y: m.y, dirX: 0, dirY: 0, size: st.reach + 8, maxTicks: 12 });
      return;
    case "imp":
      return shoot(s, m, e, dmg, { spirit: "fireball" });
    case "archer":
      return shoot(s, m, e, dmg, { spirit: "bone", pierce: 1, hitIds: [], r: 1.5 });
    case "drake":
      return shoot(s, m, e, dmg, { spirit: "fireball", blast: 16, splash: 0.7, r: 3 });
    case "shroom":
      return shoot(s, m, e, dmg, { spirit: "spore", slow: ENEMIES[e.kind].boss ? 0 : 40 });
    case "fairy":
      return shoot(s, m, e, dmg, { spirit: "fairy", homing: true });
    default:
      hitBy(s, m, e, dmg);
      addEffect(s, { kind: "scratch", x: e.x, y: e.y, dirX: m.face, dirY: 0, size: 4, maxTicks: 6 });
  }
}
