// 백령 (진)대태도: 유령팔이 벨 때 확률로 푸른 불꽃의 큰 대태도가 하늘에서 떨어져 아래 둘레에 피해
// (진)대태도-랑: 떨어진 곳 뒤로(바라보는 쪽) 맵 끝까지 대태도가 하나씩 이어 떨어짐
// (진)대태도-백: 유령팔이 벨 때 확률로 범위 끝에 대태도가 꽂혀 가만히 있고, 둘레 범위 안 적에게 몇 틱마다 번개
import { srcCb, srcRun } from "./dmgSrc";
import { BAEK_PERKS as K } from "../itemsBaekryeong";
import { BAEK_BLADE as B } from "../weaponsBaekryeong";
import { armScale, hauntMul, soulFire } from "./baekKit";
import { alive, damageEnemyLite } from "./shadowingSpirits";
import type { BaekSword } from "./byTypes";
import type { EnemyState, RunState } from "./types";
import { addEffect, hasPerk, normalize, reachOf, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

const inRoom = (x: number, y: number) => x >= ROOM_MIN_X && x <= ROOM_MAX_X && y >= ROOM_MIN_Y && y <= ROOM_MAX_Y;

/** 앞쪽에서 가장 가까운 적 (없으면 null) */
function frontFoe(s: RunState, dist: number): EnemyState | null {
  const p = s.player;
  let best: EnemyState | null = null;
  let bd = dist ** 2;
  for (const e of s.enemies) {
    const dx = e.x - p.x;
    const dy = e.y - p.y;
    const d = dx * dx + dy * dy;
    if (alive(e) && d < bd && dx * p.faceX + dy * p.faceY > 0) {
      bd = d;
      best = e;
    }
  }
  return best;
}

/** 유령팔이 벨 때: (진)대태도 · (진)대태도-백 (r1·r2 = 확률 굴림) */
export function armSwords(s: RunState, r1: number, r2: number): void {
  const p = s.player;
  const size = Math.max(1, armScale(p)) * reachOf(p);
  if (hasPerk(p, "byGreat") && r1 < K.byGreat.chance) srcRun(s, "byGreat", () => {
    const e = frontFoe(s, 180 * size);
    const x = e ? e.x : p.x + p.faceX * 70 * size;
    const y = e ? e.y : p.y + p.faceY * 70 * size;
    const dmg = p.stats.damage * K.byGreat.mul * hauntMul(p);
    const list = (p.bySwords ??= []);
    list.push({ x, y, kind: 0, age: 0, life: K.byGreat.delay, r: K.byGreat.r * size, dmg });
    // (진)대태도-랑: 뒤로 맵 끝까지 하나씩 이어 떨어짐
    if (hasPerk(p, "byGreatWolf")) srcRun(s, "byGreatWolf", () => {
      for (let i = 1; i <= K.byGreatWolf.max; i++) {
        const wx = x + p.faceX * K.byGreatWolf.gap * size * i;
        const wy = y + p.faceY * K.byGreatWolf.gap * size * i;
        if (!inRoom(wx, wy)) break;
        list.push({ x: wx, y: wy, kind: 0, age: 0, life: K.byGreat.delay + K.byGreatWolf.every * i, r: K.byGreat.r * size * K.byGreatWolf.size, dmg: dmg * K.byGreatWolf.mul });
      }
    });
  });
  // (진)대태도-백: 맵에 하나만 (꽂힌 대태도가 사라져야 다시 확률로 생김)
  const list = (p.bySwords ??= []);
  if (hasPerk(p, "byGreatWhite") && !list.some((w) => w.kind === 1) && r2 < K.byGreatWhite.chance) srcRun(s, "byGreatWhite", () => {
    const d = B.reach * reachOf(p) * 1.6;
    const x = Math.min(ROOM_MAX_X, Math.max(ROOM_MIN_X, p.x + p.faceX * d));
    const y = Math.min(ROOM_MAX_Y, Math.max(ROOM_MIN_Y, p.y + p.faceY * d));
    list.push({ x, y, kind: 1, age: 0, life: K.byGreatWhite.life, r: K.byGreatWhite.r * size, dmg: p.stats.damage * K.byGreatWhite.mul * hauntMul(p) });
    addEffect(s, { kind: "byGreat", x, y, dirX: 0, dirY: 0, size: K.byGreatWhite.r * size * 0.6, style: 1, maxTicks: 24 });
  });
}

/** 틱마다: 떨어지는 대태도 쾅 · 꽂힌 대태도 번개 */
export function swordsTick(s: RunState): void {
  const p = s.player;
  if (p.bySwords?.length) p.bySwords = p.bySwords.filter(srcCb((w) => swordStep(s, w)));
}

function swordStep(s: RunState, w: BaekSword): boolean {
  w.age++;
  if (w.kind === 0) {
    if (w.age < w.life) return true;
    for (const e of s.enemies) {
      if (!alive(e) || (e.x - w.x) ** 2 + (e.y - w.y) ** 2 > (w.r + e.r) ** 2) continue;
      const d = normalize(e.x - w.x, e.y - w.y) ?? [0, 0];
      damageEnemyLite(s, e, w.dmg, d[0], d[1]);
      soulFire(s.player, e);
    }
    addEffect(s, { kind: "byGreat", x: w.x, y: w.y, dirX: 0, dirY: 0, size: w.r, style: 0, maxTicks: 30 });
    return false;
  }
  if (w.age % K.byGreatWhite.every === 0) {
    for (const e of s.enemies) {
      if (!alive(e) || (e.x - w.x) ** 2 + (e.y - w.y) ** 2 > (w.r + e.r) ** 2) continue;
      damageEnemyLite(s, e, w.dmg, 0, 0);
      soulFire(s.player, e);
      addEffect(s, { kind: "byBolt", x: w.x, y: w.y - 20, toX: e.x, toY: e.y, dirX: 0, dirY: 0, size: 3, maxTicks: 12 });
    }
  }
  return w.age < w.life;
}
