// 풍류사 구절 마법 10 (구절을 완성하면 sim/pungryu가 부름) · 이어지는 것(기둥·뜨거운 바람·해달 구슬·비구름)은 verseTick
import { PUNGRYU as U, type ScriptStyle } from "../weaponsPungryu";
import { addGold } from "./loot";
import { rot } from "./orbit";
import { puPower } from "./pungryuKit";
import { alive, inCircle, inCone, inLine, stun } from "./s2Kit";
import { ignite } from "./status";
import { damageEnemy } from "./combat";
import type { EnemyState, RunState } from "./types";
import { addEffect, dist2, normalize } from "./util";

/** 풍류사 공격 한 번 (서리 맞은 적은 더 아픔) */
export function puHit(s: RunState, e: EnemyState, dmg: number, push = 0): void {
  const p = s.player;
  const d = normalize(e.x - p.x, e.y - p.y) ?? [p.faceX, p.faceY];
  damageEnemy(s, e, dmg * ((e.puFrost ?? 0) > 0 ? U.frostTaken : 1), d[0], d[1], push > 0);
}

/** 쓰러뜨리면 금화 (추수동장·금생여수) */
function hitForGold(s: RunState, e: EnemyState, dmg: number, gold: number): void {
  puHit(s, e, dmg);
  if (e.hp <= 0) {
    addGold(s, gold);
    addEffect(s, { kind: "coinGet", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 6, maxTicks: 24 });
  }
}

/** 노릴 자리: 가까운 적, 없으면 앞쪽 */
function spot(s: RunState, e: EnemyState | null): { x: number; y: number } {
  const p = s.player;
  return e ?? { x: p.x + p.faceX * p.stats.range * 0.6, y: p.y + p.faceY * p.stats.range * 0.6 };
}

/** 앞으로 뻗는 줄 (물결·물줄기·명검) */
function line(s: RunState, len: number, w: number, dmg: number, kind: "puWave" | "puGoldStream" | "puSword", push = 0, gold = 0): void {
  const p = s.player;
  for (const e of inLine(s, len, w)) {
    if (gold) hitForGold(s, e, dmg, gold);
    else puHit(s, e, dmg, push);
    if (push > 0 && e.hp > 0) {
      e.x += p.faceX * push;
      e.y += p.faceY * push;
    }
  }
  addEffect(s, { kind, x: p.x, y: p.y - 3, dirX: p.faceX, dirY: p.faceY, size: w, toX: p.x + p.faceX * len, toY: p.y - 3 + p.faceY * len, maxTicks: 22 });
}

/** 구절 완성: 무기마다 큰 마법 (e = 가까운 적) */
export function castVerse(s: RunState, st: ScriptStyle, e: EnemyState | null): void {
  const p = s.player;
  const dmg = puPower(s) * st.power;
  switch (st.verse) {
    case "heaven": {
      const at = spot(s, e);
      (p.puFalls ??= []).push({ x: at.x, y: at.y, t: 1, r: U.heavenR, dmg }, { x: at.x, y: at.y, t: U.heavenGap, r: U.heavenR, dmg: dmg * U.earthMul, earth: true });
      break;
    }
    case "flood":
      line(s, U.floodLen, U.floodW, dmg, "puWave", U.floodPush);
      break;
    case "sunmoon":
      p.puOrbs = U.orbTicks;
      p.puPow = dmg;
      break;
    case "stars":
      stars(s, dmg);
      break;
    case "seasons":
      for (const f of inCone(s, U.windR, U.windCos)) {
        puHit(s, f, dmg);
        stun(f, U.freeze);
      }
      addEffect(s, { kind: "puWind", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: U.windR, maxTicks: 18, tint: "cold" });
      p.puHot = { t: U.windGap, dx: p.faceX, dy: p.faceY, dmg };
      break;
    case "harvest": {
      const reach = (p.stats.range * 1.5) ** 2;
      const big = alive(s).filter((f) => dist2(f, p) <= reach).sort((a, b) => b.hp - a.hp || a.id - b.id)[0];
      if (big) {
        hitForGold(s, big, dmg + (p.puStore ?? 0), U.reapGold);
        addEffect(s, { kind: "puReap", x: big.x, y: big.y, dirX: 0, dirY: 0, size: 22, maxTicks: 20 });
      }
      p.puStore = 0;
      break;
    }
    case "rain":
      p.puRain = U.rainTicks;
      p.puPow = dmg;
      break;
    case "frost":
      for (const f of alive(s)) {
        if (!f.puDew || dist2(f, p) > (p.stats.range * 2) ** 2) continue;
        f.puFrost = U.frostTicks;
        stun(f, U.freeze);
        puHit(s, f, dmg * (1 + U.dewPer * f.puDew));
        f.puDew = 0;
        addEffect(s, { kind: "puFrost", x: f.x, y: f.y, dirX: 0, dirY: 0, size: f.r + 6, maxTicks: 30 });
      }
      break;
    case "gold":
      line(s, U.goldLen, U.goldW, dmg, "puGoldStream", 0, U.goldCoin);
      break;
    case "sword":
      line(s, U.swordLen, U.swordW, dmg, "puSword", 6);
      break;
  }
}

/** 진수열장: 별 표식 난 적들을 가까운 차례로 이어 선 위의 적 모두 벰 (표식이 많을수록 셈) */
function stars(s: RunState, dmg: number): void {
  const p = s.player;
  const marked = alive(s).filter((e) => (e.puStar ?? 0) > 0);
  if (!marked.length) return;
  const mul = 1 + Math.min(U.starMax, U.starPer * (marked.length - 1));
  const path: EnemyState[] = [];
  let from: { x: number; y: number } = p;
  const left = [...marked];
  while (left.length) {
    left.sort((a, b) => dist2(a, from) - dist2(b, from) || a.id - b.id);
    const next = left.shift()!;
    path.push(next);
    from = next;
  }
  const hit = new Set<number>();
  for (let i = 0; i < path.length; i++) {
    const a = i === 0 ? { x: p.x, y: p.y } : path[i - 1]!;
    const b = path[i]!;
    for (const e of onSeg(s, a.x, a.y, b.x, b.y)) hit.add(e.id);
    hit.add(b.id);
    addEffect(s, { kind: "puStarLine", x: a.x, y: a.y, dirX: 0, dirY: 0, size: U.starW, toX: b.x, toY: b.y, maxTicks: 26 });
  }
  for (const e of alive(s)) {
    if (!hit.has(e.id)) continue;
    puHit(s, e, dmg * mul);
    e.puStar = 0;
  }
}

/** 선분 (ax, ay) → (bx, by) 위의 적 */
function onSeg(s: RunState, ax: number, ay: number, bx: number, by: number): EnemyState[] {
  const len = Math.hypot(bx - ax, by - ay) || 1;
  const dx = (bx - ax) / len;
  const dy = (by - ay) / len;
  return alive(s).filter((e) => {
    const t = (e.x - ax) * dx + (e.y - ay) * dy;
    return t > -e.r && t < len + e.r && Math.abs((e.x - ax) * dy - (e.y - ay) * dx) < U.starW + e.r;
  });
}

/** 해·달 구슬 자리 (화면에서도 씀): 0 = 해, 1 = 달 */
export function orbSpots(s: RunState): { x: number; y: number; r: number }[] {
  const p = s.player;
  const left = p.puOrbs ?? 0;
  if (left <= 0) return [];
  const k = 1 - left / U.orbTicks;
  const r = U.orbR0 + (U.orbR1 - U.orbR0) * k;
  const [c, sn] = rot(s.tick * 0.06);
  return [
    { x: p.x + c * U.orbRing, y: p.y + sn * U.orbRing, r },
    { x: p.x - c * U.orbRing, y: p.y - sn * U.orbRing, r },
  ];
}

/** 틱마다: 기둥 · 뜨거운 바람 · 해·달 구슬 · 비구름 */
export function verseTick(s: RunState): void {
  const p = s.player;
  if (p.puFalls?.length) {
    for (const f of p.puFalls) {
      if (--f.t > 0) continue;
      for (const e of inCircle(s, f.x, f.y, f.r)) puHit(s, e, f.dmg);
      addEffect(s, { kind: "puPillar", x: f.x, y: f.y, dirX: 0, dirY: 0, size: f.r, maxTicks: 18, tint: f.earth ? "earth" : "sky" });
    }
    p.puFalls = p.puFalls.filter((f) => f.t > 0);
  }
  if (p.puHot && --p.puHot.t <= 0) {
    const h = p.puHot;
    delete p.puHot;
    for (const e of inCone(s, U.windR, U.windCos)) {
      puHit(s, e, h.dmg);
      ignite(e, puPower(s) * U.sunBurn);
    }
    addEffect(s, { kind: "puWind", x: p.x, y: p.y, dirX: h.dx, dirY: h.dy, size: U.windR, maxTicks: 18, tint: "hot" });
  }
  if ((p.puOrbs ?? 0) > 0) {
    if (p.puOrbs! % U.orbGap === 0) {
      orbSpots(s).forEach((o, i) => {
        for (const e of inCircle(s, o.x, o.y, o.r)) {
          puHit(s, e, (p.puPow ?? 0) * (i === 0 ? 1 : 0.6));
          if (i === 0) ignite(e, puPower(s) * U.sunBurn);
          else e.slowTicks = Math.max(e.slowTicks ?? 0, U.moonSlow);
        }
      });
    }
    p.puOrbs!--;
  }
  if ((p.puRain ?? 0) > 0) {
    if (p.puRain! % U.rainGap === 0) {
      for (const e of inCircle(s, p.x, p.y, U.rainR)) {
        puHit(s, e, p.puPow ?? 0);
        e.slowTicks = Math.max(e.slowTicks ?? 0, U.rainSlow);
      }
    }
    p.puRain!--;
  }
}
