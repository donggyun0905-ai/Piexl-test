// 패왕전 성장 대결 병사·포탑·보스 (pwRules.PW_UNIT). 병사 무리는 집에서 나와 길을 따라 걷다가 상대(병사·캐릭터·포탑)를 만나면 싸움
// 포탑은 가까운 상대 병사부터, 없으면 캐릭터를 쏨 (뒤 포탑은 앞 포탑이 부서져야 맞음) · 보스·정글 몬스터는 자리를 지키고 멀리 쫓지 않음
// 병사끼리·포탑의 피해는 막타로 치지 않음 (막타는 사람만, pwGrow.growDeaths)
import { TICK_RATE } from "../constants";
import { PW_ARENAS } from "../paewangMaps";
import { PW_UNIT } from "../pwRules";
import { damagePlayer as damagePlayer_ } from "./combat";
import { spotXY } from "./paewangGrid";
import { allPlayers, seatNo, useSeat } from "./party";
import { inPlay } from "./pvpWorld";
import { recapEnv } from "./pvpRecap";
import type { PwUnit, PwUnitKind } from "./pwGrowTypes";
import type { RunState } from "./types";
import { addEffect, makeEnemy } from "./util";
import { srcFn } from "./dmgSrc";
const damagePlayer = srcFn("pwLane", () => damagePlayer_);

/** 그림 (던전 몬스터 그림을 씀) */
const LOOK: Record<PwUnitKind, string> = { minion: "paladin", archer: "spitter", tower: "tower", boss: "hulk", jungle: "charger", elite: "knight", dragon: "dragon", godeater: "godeater" };

export function makeUnit(s: RunState, kind: PwUnitKind, team: number, x: number, y: number, mul = 1, lane = 0, wp = 0): PwUnit {
  const d = PW_UNIT[kind];
  const body = makeEnemy(s, "dummy", x, y, 1, 0);
  body.hp = body.maxHp = Math.round(d.hp * mul);
  body.r = d.r;
  return { id: body.id, kind, team, body, lane, wp, cd: 0, hx: x, hy: y, mul, look: LOOK[kind] };
}

type Target = { x: number; y: number; r: number; unit?: PwUnit; seat?: number };

/** 가장 가까운 상대 (병사·포탑·보스 · 경기장의 캐릭터) · within 안만 · 병사 먼저(포탑) */
function nearest(s: RunState, u: PwUnit, within: number, unitsFirst: boolean): Target | null {
  const g = s.pvp!.grow!;
  let best: Target | null = null;
  let bd = within * within;
  const consider = (t: Target) => {
    const d = (t.x - u.body.x) ** 2 + (t.y - u.body.y) ** 2;
    if (d < bd) [bd, best] = [d, t];
  };
  for (const v of g.units) if (v.team !== u.team && v.team !== 2 && v.body.hp > 0 && !v.body.immune) consider({ x: v.body.x, y: v.body.y, r: v.body.r, unit: v });
  if (unitsFirst && best) return best;
  const pv = s.pvp!;
  allPlayers(s).forEach((p, i) => {
    if (inPlay(s, i) && pv.seats[i]!.team !== u.team && !pv.seats[i]!.jump) consider({ x: p.x, y: p.y, r: p.r, seat: i });
  });
  return best;
}

/** 중립(정글) 몬스터: 때린 사람을 잠시 쫓음 (자리에서 너무 멀어지면 포기) */
function jungleFoe(s: RunState, u: PwUnit, home: number): Target | null {
  const b = u.body;
  if (u.lastHp !== undefined && b.hp < u.lastHp && b.lastHit !== undefined) [u.foe, u.foeUntil, u.hurtAt] = [b.lastHit, s.tick + 300, s.tick];
  u.lastHp = b.hp;
  if (u.foe === undefined || (u.foeUntil ?? 0) < s.tick || home > PW_UNIT.leash * 1.5 || !inPlay(s, u.foe)) {
    u.foe = undefined;
    return null;
  }
  const p = allPlayers(s)[u.foe]!;
  return { x: p.x, y: p.y, r: p.r, seat: u.foe };
}

/** 정글·거인: 움직이는 범위 안에 캐릭터가 없으면 안 맞음 (멀리서 쏘아 잡지 못하게) · 3초 동안 안 맞으면 체력이 참 */
function neutralGuard(s: RunState, u: PwUnit): void {
  const b = u.body;
  const r = PW_UNIT.leash * 1.5;
  b.immune = !allPlayers(s).some((p, i) => inPlay(s, i) && (p.x - u.hx) ** 2 + (p.y - u.hy) ** 2 <= r * r);
  if (s.tick - (u.hurtAt ?? -1e9) > PW_UNIT.calm && b.hp < b.maxHp) b.hp = Math.min(b.maxHp, b.hp + (b.maxHp * PW_UNIT.calmHeal) / 60);
}

/** 캐릭터 하나를 때림 (맞은 뒤 무적을 남기지 않음) */
function hitSeat(s: RunState, i: number, dmg: number): void {
  const back = seatNo(s);
  useSeat(s, i);
  const p = s.player;
  const keep = p.invulnTicks;
  const before = p.hp;
  damagePlayer(s, dmg);
  p.invulnTicks = keep;
  recapEnv(s, before);
  useSeat(s, back);
}

function attack(s: RunState, u: PwUnit, t: Target): void {
  const d = PW_UNIT[u.kind];
  u.cd = d.every;
  u.shot = { x: t.x, y: t.y, at: s.tick };
  const minion = u.kind === "minion" || u.kind === "archer";
  const dmg = d.dmg * u.mul * (minion && t.unit?.kind === "tower" ? PW_UNIT.vsTower : minion && t.seat !== undefined ? PW_UNIT.vsHero : 1);
  if (t.unit) {
    t.unit.body.hp -= dmg;
    t.unit.body.hitFlash = 6;
    t.unit.body.lastHit = undefined;
  } else if (t.seat !== undefined) hitSeat(s, t.seat, dmg);
  // 보스: 내려찍어 주변 캐릭터도
  if (u.kind === "boss" || u.kind === "dragon" || u.kind === "godeater") {
    addEffect(s, { kind: "slam", x: t.x, y: t.y, dirX: 0, dirY: 0, size: 26, maxTicks: 16 });
    allPlayers(s).forEach((p, i) => {
      if (i !== t.seat && inPlay(s, i) && (u.team === 2 || s.pvp!.seats[i]!.team !== u.team) && (p.x - t.x) ** 2 + (p.y - t.y) ** 2 < 26 * 26) hitSeat(s, i, dmg * 0.6);
    });
  }
}

function step(u: PwUnit, tx: number, ty: number, speed: number): void {
  const dx = tx - u.body.x;
  const dy = ty - u.body.y;
  const len = Math.hypot(dx, dy);
  if (len < 0.5) return;
  const k = Math.min(speed, len) / len;
  u.body.x += dx * k;
  u.body.y += dy * k;
  u.body.dirX = dx;
}

/** 병사 무리 내보내기 (길마다 편마다) */
export function spawnWave(s: RunState, mul: number, centerMul: (team: number) => number): void {
  const a = PW_ARENAS[s.pvp!.arena];
  const g = s.pvp!.grow!;
  (a.lanes ?? []).forEach((lane, li) => {
    for (const team of [0, 1]) {
      const first = team === 0 ? 0 : lane.length - 1;
      const [x, y] = spotXY(lane[first]!);
      // 길이 여럿이면 무리를 줄임 (전체 병사 수를 비슷하게)
      const w = PW_UNIT.wave;
      const [melee, ranged] = (a.lanes ?? []).length > 1 ? [w.melee - 1, w.ranged - 1] : [w.melee, w.ranged];
      for (let k = 0; k < melee + ranged; k++) {
        const u = makeUnit(s, k < melee ? "minion" : "archer", team, x + (k % 3) * 8 - 8, y + Math.floor(k / 3) * 8, mul * centerMul(team), li, team === 0 ? 1 : lane.length - 2);
        g.units.push(u);
      }
    }
  });
}

/** 틱마다: 병사·포탑·보스 움직이고 때림 */
export function laneTick(s: RunState): void {
  const g = s.pvp!.grow!;
  const a = PW_ARENAS[s.pvp!.arena];
  for (const u of g.units) {
    const b = u.body;
    if (b.hp <= 0) continue;
    // 포탑은 맞아 밀려도 늘 제자리
    if (u.kind === "tower") [b.x, b.y] = [u.hx, u.hy];
    b.prevX = b.x;
    b.prevY = b.y;
    if (b.hitFlash > 0) b.hitFlash--;
    if (u.cd > 0) u.cd--;
    const d = PW_UNIT[u.kind];
    const home = Math.hypot(b.x - u.hx, b.y - u.hy);
    if (u.team === 2) neutralGuard(s, u);
    const leash = PW_UNIT.leash;
    const t = u.team === 2 ? jungleFoe(s, u, home) : u.kind === "tower" ? nearest(s, u, d.range, true) : nearest(s, u, Math.max(PW_UNIT.aggro, d.range), u.kind !== "boss");
    const reach = t ? Math.hypot(t.x - b.x, t.y - b.y) - t.r - b.r : Infinity;
    if (t && reach <= d.range) {
      if (u.cd === 0) attack(s, u, t);
    } else if (t && d.speed > 0 && (u.kind === "minion" || u.kind === "archer" || home < leash)) step(u, t.x, t.y, d.speed);
    else if (u.kind === "minion" || u.kind === "archer") {
      const lane = a.lanes?.[u.lane];
      const spot = lane?.[u.wp];
      if (!lane || !spot) continue;
      const [tx, ty] = spotXY(spot);
      step(u, tx, ty, d.speed);
      if (Math.hypot(tx - b.x, ty - b.y) < 6) u.wp += u.team === 0 ? 1 : -1;
      u.wp = Math.max(0, Math.min(lane.length - 1, u.wp));
    } else if (d.speed > 0 && home > 2) step(u, u.hx, u.hy, d.speed * 1.5);
    // 정글: 집에 돌아와 쉬면 체력이 참

  }
  // 같은 편 병사끼리 겹치지 않게 살짝 밀어냄
  const walkers = g.units.filter((u) => u.body.hp > 0 && (u.kind === "minion" || u.kind === "archer"));
  for (let i = 0; i < walkers.length; i++) {
    for (let j = i + 1; j < walkers.length; j++) {
      const p = walkers[i]!.body;
      const q = walkers[j]!.body;
      const dx = q.x - p.x;
      const dy = q.y - p.y;
      const d2 = dx * dx + dy * dy;
      if (d2 >= 100 || d2 === 0) continue;
      const k = (10 - Math.sqrt(d2)) / 20 / Math.sqrt(d2);
      p.x -= dx * k;
      p.y -= dy * k;
      q.x += dx * k;
      q.y += dy * k;
    }
  }
}

/** 지금 몇 분째 (병사가 강해짐) */
export const laneMinutes = (s: RunState): number => Math.max(0, s.tick - (s.pvp!.readyAt ?? 0)) / (60 * TICK_RATE);
