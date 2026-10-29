// 정령사의 대정령(무기) 공격: 대정령마다 몇 초마다 큰 기술 하나. 수치는 weaponsSpirit.GREAT_SPIRITS
import { SPIRIT_PERKS as K } from "../itemsSpirit";
import { createRng, deriveSeed } from "../rng";
import { GREAT_SPIRITS, SPIRIT as P, type GreatSpirit } from "../weaponsSpirit";
import { blastAt, healPlayer } from "./combat";
import { alive, inCircle, inLine, onSegment, poison, root, stun, strike } from "./s2Kit";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, dist2, hasPerk, normalize, weaponOf } from "./util";

/** 대정령 순번 (그리기: 효과 dirX) */
export const GREAT_INDEX: Record<GreatSpirit, number> = { titanCore: 0, ironHide: 1, chronoSpire: 2, nightWeaver: 3, umbra: 4, venomHide: 5, idra: 6, briarHeart: 7, sylvanGuard: 8, abyssRuin: 9 };

/** 조화: 곁의 작은 정령 종류 수만큼 정령 피해 증가 */
export function harmonyMul(p: PlayerState): number {
  if (!hasPerk(p, "spHarmony")) return 1;
  return 1 + K.spHarmony.per * new Set((p.spirits ?? []).map((x) => x.kind)).size;
}

/** 아이언하이드를 들면 받는 피해 감소 (classTaken) */
export const spiritTaken = (p: PlayerState) => (p.characterId === "spiritist" && weaponOf(p).great === "ironHide" ? P.ironTaken : 1);

/** 대정령이 떠 있는 자리 (어깨 뒤 위) */
export function greatSpot(p: { x: number; y: number; faceX: number }): { x: number; y: number } {
  return { x: p.x - (p.faceX < 0 ? -1 : 1) * 16, y: p.y - 20 };
}

function inRange(s: RunState, r: number): EnemyState[] {
  const p = s.player;
  // 패왕전: 수풀·투명으로 안 보이는 상대는 노리지 않음 (markHidden)
  return alive(s)
    .filter((e) => !e.pwHid && dist2(e, p) <= r * r)
    .sort((a, b) => dist2(a, p) - dist2(b, p) || a.id - b.id);
}

/** 내리찍기 예약 (돌주먹 0 · 입방체 1) */
function drop(s: RunState, x: number, y: number, r: number, dmg: number, kind: 0 | 1, wait: number): void {
  (s.player.spDrops ??= []).push({ tick: s.tick + wait, x, y, r, dmg, kind });
  addEffect(s, { kind: kind ? "gsCube" : "gsFist", x, y, dirX: 0, dirY: wait, size: r, maxTicks: wait + 14 });
}

/** 떨어진 돌주먹·입방체 · 독가스 · 실반가드 화살 (틱마다) */
function pendingTick(s: RunState): void {
  const p = s.player;
  if (p.spDrops?.length) {
    for (const d of p.spDrops.filter((x) => x.tick <= s.tick)) {
      if (d.kind === 0)
        for (const t of inCircle(s, d.x, d.y, d.r)) {
          strike(s, t, d.dmg, 6);
          stun(t, 40);
        }
      else blastAt(s, d.x, d.y, d.r, d.dmg, { still: true });
    }
    p.spDrops = p.spDrops.filter((x) => x.tick > s.tick);
    if (!p.spDrops.length) delete p.spDrops;
  }
  if (p.spGas?.length) {
    for (const g of p.spGas) {
      g.t--;
      if (g.t % P.gasEvery !== 0) continue;
      for (const t of inCircle(s, g.x, g.y, g.r)) {
        strike(s, t, g.dmg * 0.2);
        poison(t, g.dmg * 0.15, 120);
      }
    }
    p.spGas = p.spGas.filter((g) => g.t > 0);
    if (!p.spGas.length) delete p.spGas;
  }
  const c = p.spCharge;
  if (c && --c.t <= 0) {
    const from = greatSpot(p);
    const len = p.stats.range * 2.4;
    for (const t of onSegment(s, from.x, from.y, from.x + c.dx * len, from.y + c.dy * len, GREAT_SPIRITS.sylvanGuard.r)) strike(s, t, c.dmg, 10);
    addEffect(s, { kind: "gsArrow", x: from.x, y: from.y, dirX: c.dx, dirY: c.dy, size: GREAT_SPIRITS.sylvanGuard.r, toX: from.x + c.dx * len, toY: from.y + c.dy * len, maxTicks: 18 });
    delete p.spCharge;
  }
}

/** 대정령 기술 한 번 (했으면 true) */
function cast(s: RunState, g: GreatSpirit): boolean {
  const p = s.player;
  const def = GREAT_SPIRITS[g];
  const dmg = p.stats.damage * def.mul * (hasPerk(p, "spGreatPower") ? K.spGreatPower.mul : 1) * harmonyMul(p);
  const list = inRange(s, p.stats.range * 1.2);
  const from = greatSpot(p);
  const fx = (x: number, y: number, size: number) => addEffect(s, { kind: "gsCast", x, y, dirX: GREAT_INDEX[g], dirY: 0, size, toX: from.x, toY: from.y, maxTicks: 22 });
  switch (g) {
    case "titanCore": {
      // 적 머리 위에 거대한 돌주먹이 나타나 내려찍음
      const e = list[0];
      if (!e) return false;
      drop(s, e.x, e.y, def.r, dmg, 0, P.fistDrop);
      return true;
    }
    case "ironHide": {
      const near = inCircle(s, p.x, p.y, def.r);
      if (!near.length) return false;
      for (const t of near) strike(s, t, dmg, 12);
      fx(p.x, p.y, def.r);
      return true;
    }
    case "chronoSpire":
      if (!list.length) return false;
      for (const t of list) {
        strike(s, t, dmg);
        if (t.kind !== "dummy") t.slowTicks = Math.max(t.slowTicks ?? 0, 90);
      }
      fx(p.x, p.y, p.stats.range * 1.2);
      return true;
    case "nightWeaver":
      if (!list.length) return false;
      for (const t of list.slice(0, 4)) {
        strike(s, t, dmg);
        root(t, 60);
        addEffect(s, { kind: "spBeam", x: from.x, y: from.y, dirX: 0, dirY: 0, size: 1, toX: t.x, toY: t.y, maxTicks: 30, tint: "#c8a8ff" });
      }
      fx(from.x, from.y, 16);
      return true;
    case "umbra": {
      // 가장 강한 적 쪽으로 채찍만큼 굵은 그림자 레이저: 줄 위 적 모두
      const e = [...list].sort((a, b) => b.hp - a.hp || a.id - b.id)[0];
      if (!e) return false;
      const d = normalize(e.x - from.x, e.y - from.y) ?? [p.faceX, p.faceY];
      const len = p.stats.range * 1.8;
      for (const t of onSegment(s, from.x, from.y, from.x + d[0] * len, from.y + d[1] * len, def.r)) strike(s, t, dmg);
      addEffect(s, { kind: "gsBeam", x: from.x, y: from.y, dirX: 0, dirY: 0, size: def.r, toX: from.x + d[0] * len, toY: from.y + d[1] * len, maxTicks: 20 });
      return true;
    }
    case "venomHide": {
      // 앞쪽에 연막탄처럼 독가스 구름 넷을 부채꼴로 뿌림
      const e = list[0];
      if (!e) return false;
      const a0 = Math.atan2(e.y - p.y, e.x - p.x);
      const dist = Math.min(Math.sqrt(dist2(e, p)), p.stats.range * 0.8);
      for (let i = 0; i < P.gasClouds; i++) {
        const a = a0 + (i - (P.gasClouds - 1) / 2) * P.gasSpread;
        const x = p.x + Math.cos(a) * dist;
        const y = p.y + Math.sin(a) * dist;
        (p.spGas ??= []).push({ x, y, r: def.r, t: P.gasTicks, dmg });
        addEffect(s, { kind: "gsGas", x, y, dirX: i, dirY: 0, size: def.r, toX: p.x, toY: p.y, maxTicks: P.gasTicks });
      }
      return true;
    }
    case "idra":
      healPlayer(s, P.idraHeal);
      blastAt(s, p.x, p.y, def.r, dmg, { bloom: true });
      fx(p.x, p.y, def.r);
      return true;
    case "briarHeart": {
      const e = list[0];
      if (!e) return false;
      const d = normalize(e.x - p.x, e.y - p.y) ?? [p.faceX, p.faceY];
      const len = p.stats.range * 1.2;
      for (const t of inLine(s, len, def.r, d[0], d[1])) {
        strike(s, t, dmg);
        root(t, 40);
      }
      addEffect(s, { kind: "vine", x: p.x, y: p.y, dirX: d[0], dirY: d[1], size: def.r, toX: p.x + d[0] * len, toY: p.y + d[1] * len, maxTicks: 18 });
      fx(from.x, from.y, 14);
      return true;
    }
    case "sylvanGuard": {
      // 주문을 외며 모았다가 (sylvanTick) 거대한 마법 화살
      const e = list[0];
      if (!e) return false;
      const d = normalize(e.x - from.x, e.y - from.y) ?? [p.faceX, p.faceY];
      p.spCharge = { t: P.chantTicks, dx: d[0], dy: d[1], dmg };
      addEffect(s, { kind: "gsChant", x: from.x, y: from.y, dirX: d[0], dirY: d[1], size: 18, maxTicks: P.chantTicks });
      return true;
    }
    case "abyssRuin": {
      // 알 수 없는 입방체가 적 셋 머리 위에 나타났다가 내리찍고 터짐
      if (!list.length) return false;
      const rng = createRng(deriveSeed(s.seed, "abyss", s.tick));
      for (let i = 0; i < 3; i++) {
        const e = list[rng.int(0, list.length - 1)]!;
        drop(s, e.x, e.y, def.r, dmg, 1, P.cubeDrop + i * 4);
      }
      return true;
    }
  }
}

/** 큐피트의 정령 (히든 사용 아이템): 대정령 열 중 하나가 곁에 옴 (이미 있으면 다른 대정령으로) */
export function cupidStart(s: RunState): void {
  const p = s.player;
  const all = Object.keys(GREAT_INDEX) as GreatSpirit[];
  const pool = all.filter((g) => g !== p.cupid);
  p.cupid = createRng(deriveSeed(s.seed, "cupid", s.tick)).pick(pool);
  p.cpGreat = 60;
  const at = greatSpot(p);
  addEffect(s, { kind: "gsRune", x: at.x, y: at.y - 14, dirX: GREAT_INDEX[p.cupid], dirY: 0, size: 1, maxTicks: 40 });
}

/** 큐피트의 대정령 한 틱 (hiddenTick): 정령사처럼 몇 초마다 기술 (정령사는 자기 대정령과 따로 셈) */
export function cupidTick(s: RunState): void {
  const p = s.player;
  if (!p.cupid) return;
  if (!weaponOf(p).great) pendingTick(s);
  if ((p.cpGreat ?? 0) > 0) {
    p.cpGreat = (p.cpGreat ?? 0) - 1;
    return;
  }
  if (!cast(s, p.cupid)) return;
  const at = greatSpot(p);
  addEffect(s, { kind: "gsRune", x: at.x, y: at.y - 14, dirX: GREAT_INDEX[p.cupid], dirY: 0, size: 1, maxTicks: 30 });
  p.cpGreat = GREAT_SPIRITS[p.cupid].every;
}

/** 대정령 한 틱 (기다렸다가 적이 있으면 기술) */
export function greatTick(s: RunState): void {
  const p = s.player;
  const g = weaponOf(p).great;
  if (!g) return;
  pendingTick(s);
  if ((p.spGreat ?? 0) > 0) {
    p.spGreat = (p.spGreat ?? 0) - 1;
    return;
  }
  if (!cast(s, g)) return;
  // 대정령 머리 위에 마법 문자
  const at = greatSpot(p);
  addEffect(s, { kind: "gsRune", x: at.x, y: at.y - 14, dirX: GREAT_INDEX[g], dirY: 0, size: 1, maxTicks: 30 });
  p.spGreat = Math.round(GREAT_SPIRITS[g].every * (hasPerk(p, "spAwaken") ? K.spAwaken.every : 1));
}
