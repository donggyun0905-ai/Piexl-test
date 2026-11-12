// 혼령 공용 도우미 (sim/honryeong·hrBeasts·hrSpirits가 같이 씀): 무기 모양·시드 확률·은신·피해·범위 피해·구름 놓기·적이 쫓을 자리
import { srcEach } from "./dmgSrc";
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";
import { HONRYEONG_PERKS as K } from "../itemsHonryeong";
import { createRng, deriveSeed } from "../rng";
import { HONRYEONG_WEAPONS, HR_CLOUD as C, HR_STYLE, type HonryeongWeaponId } from "../weaponsHonryeong";
import type { HonryeongFx } from "./hrTypes";
import { rot } from "./orbit";
import { alive, damageEnemyLite } from "./shadowingSpirits";
import type { EnemyState, RunState } from "./types";
import { addEffect, clamp, normalize } from "./util";

type P = RunState["player"];

export const isHonryeong = (p: P) => p.characterId === "honryeong";
export const hasHr = (p: P, id: string) => p.passives.includes(id as never);

/** 지금 무기의 연기용 모양 (혼령 무기가 아니면 곰방대) */
export const styleOf = (p: P) => HR_STYLE[(p.weaponId in HONRYEONG_WEAPONS ? p.weaponId : "hrPipe") as HonryeongWeaponId];

/** 시드 확률 (굴릴 때마다 다른 값) */
export function hrRng(s: RunState, tag: string) {
  const p = s.player;
  p.hrRolls = (p.hrRolls ?? 0) + 1;
  return createRng(deriveSeed(s.seed, tag, s.tick, p.hrRolls));
}
export const hrRoll = (s: RunState, tag: string) => hrRng(s, tag).nextFloat();

/** (x, y)가 구름 안인지 */
export const inCloud = (p: P, x: number, y: number, pad = 0) => (p.hrClouds ?? []).some((c) => (c.x - x) ** 2 + (c.y - y) ** 2 <= (c.r + pad) ** 2);

/** 소환수도 은신 중인지 (혼령사냥: 내가 은신하면 같이) */
export const huntOn = (p: P) => !!p.hrHidden && hasHr(p, "hrHunt");

/** 혼령 피해 배율 (짙은 연기: 은신 동안) · 소환수 피해·체력 배율 (혼의 계약) */
export const hrMul = (p: P) => (p.hrHidden && hasHr(p, "hrThick") ? K.hrThick.mul : 1);
export const petMul = (p: P) => (hasHr(p, "hrPact") ? K.hrPact.mul : 1);
export const petHp = (p: P) => (hasHr(p, "hrPact") ? K.hrPact.hp : 1);

/** 혼령 공격 한 번 맞힘 */
export function hrHit(s: RunState, e: EnemyState, dmg: number, dx: number, dy: number): void {
  damageEnemyLite(s, e, dmg * hrMul(s.player), dx, dy);
}

/** 범위 피해 + 그림 · 맞힌 적 */
export function hrArea(s: RunState, x: number, y: number, r: number, dmg: number, fx: HonryeongFx, style = 0): EnemyState[] {
  const hit: EnemyState[] = [];
  for (const e of s.enemies) {
    if (!alive(e) || (e.x - x) ** 2 + (e.y - y) ** 2 > (r + e.r) ** 2) continue;
    const d = normalize(e.x - x, e.y - y) ?? [0, 0];
    hrHit(s, e, dmg, d[0], d[1]);
    hit.push(e);
  }
  addEffect(s, { kind: fx, x, y, dirX: 0, dirY: 0, size: r, style, maxTicks: 24 });
  return hit;
}

/** 구름 반지름: 다 차면(cap개) 방을 덮을 만큼 */
export const cloudR = () => Math.sqrt(((ROOM_MAX_X - ROOM_MIN_X) * (ROOM_MAX_Y - ROOM_MIN_Y)) / (C.cap * Math.PI)) * C.cover;

/** 구름 하나를 방 어딘가에: 여러 자리를 뽑아 다른 구름과 가장 먼 자리 (같은 곳에 겹쳐 생기지 않음) · 다 찼으면 가장 오래된 것이 사라짐 */
export function addCloud(s: RunState): void {
  const p = s.player;
  const list = (p.hrClouds ??= []);
  const rng = hrRng(s, "hrCloud");
  const r = cloudR();
  const pad = r * 0.6;
  let best: [number, number] = [0, 0];
  let far = -1;
  for (let i = 0; i < C.tries; i++) {
    const x = ROOM_MIN_X + pad + rng.nextFloat() * Math.max(1, ROOM_MAX_X - ROOM_MIN_X - pad * 2);
    const y = ROOM_MIN_Y + pad + rng.nextFloat() * Math.max(1, ROOM_MAX_Y - ROOM_MIN_Y - pad * 2);
    let near = Infinity;
    for (const c of list) near = Math.min(near, (c.x - x) ** 2 + (c.y - y) ** 2);
    if (near > far) {
      far = near;
      best = [x, y];
    }
  }
  list.push({ x: best[0], y: best[1], r, age: 0, pic: Math.floor(rng.nextFloat() * 8) });
  if (list.length > C.cap) list.shift();
  addEffect(s, { kind: "hrPuff", x: best[0], y: best[1], dirX: 0, dirY: 0, size: r, maxTicks: 20 });
}

/**
 * 적이 쫓을 자리 (sim/enemies): 분신이 있으면 가장 가까운 분신 · 은신 중이면 내 둘레 어긋난 자리(적마다 다른 쪽, 천천히 돎)
 * → 적이 쫓아오지만 원거리 공격이 내 몸을 정확히 겨누지 못함. 협동은 없음
 */
export function hrLure(s: RunState, e: EnemyState): { x: number; y: number } | null {
  const p = s.player;
  if (!isHonryeong(p) || s.party) return null;
  let best: { x: number; y: number } | null = null;
  let bd = Infinity;
  for (const d of srcEach(p.hrDecoys ?? [])) {
    const dd = (d.x - e.x) ** 2 + (d.y - e.y) ** 2;
    if (dd < bd) {
      bd = dd;
      best = d;
    }
  }
  if (best) return best;
  if (!p.hrHidden) return null;
  const v = rot(((e.id * 97 + s.tick) % 628) / 100);
  return { x: clamp(p.x + v[0] * C.lure, ROOM_MIN_X, ROOM_MAX_X), y: clamp(p.y + v[1] * C.lure, ROOM_MIN_Y, ROOM_MAX_Y) };
}
