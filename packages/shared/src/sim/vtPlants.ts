// 베르 방에 남는 것 (p.vtPlants): 체내 개화 꽃(주기적으로 독가스) · 시든 육신 덩굴(씨앗을 뿌림, 씨앗이 이미 있으면 바로 발아 → 새 덩굴)
// 만개의 포식자 꽃(적이 다가오면 물기 + 독) · 대지 부식 땅(안 적 고정 + 간격마다 피해·상태이상)
// 사령화 조종 덩굴 인형 (p.vtThralls): 쓰러진 적(p.vtCorpses, 지난 틱과 비교해 찾음)을 되살려 10초 동안 함께 싸움 (맞지 않음)
import { ENEMIES } from "../enemyDefs";
import { VT_EXTRA as X, VT_LV as L, VT_SKILLS as K } from "../itemsVert";
import { srcEach } from "./dmgSrc";
import { nrAlive, nrArea, nrBoss } from "./nrKit";
import { vt } from "./vert";
import { vtAfflict, vtPlantSeed, vtRoll, vtSprout } from "./vtRot";
import { root } from "./s2Kit";
import type { EnemyState, RunState } from "./types";
import type { VtPlant, VtThrall } from "./vtTypes";
import { addEffect, keepInRoom, normalize, roomGrid } from "./util";

const near = (s: RunState, x: number, y: number, r: number) => s.enemies.filter((e) => nrAlive(e) && (e.x - x) ** 2 + (e.y - y) ** 2 <= (r + e.r) ** 2);

/** 남는 것 하나 한 틱 · 남아 있으면 true */
function plantTick(s: RunState, f: VtPlant): boolean {
  if (f.until <= s.tick) return false;
  const D = s.player.stats.damage;
  if (f.kind === "erode") {
    const R = K.erode;
    for (const e of near(s, f.x, f.y, R.r)) root(e, 2);
    if ((f.until - s.tick) % R.every === 0) nrArea(s, f.x, f.y, R.r, D * L.vvweak, undefined, vt({ poi: true, bleed: true, burn: true, rot: true }));
    return true;
  }
  if (f.next > s.tick) return true;
  if (f.kind === "gas") {
    f.next = s.tick + X.gas.every;
    for (const e of near(s, f.x, f.y, X.gas.r)) vtAfflict(s, e, { poi: true });
    addEffect(s, { kind: "vtGas", x: f.x, y: f.y, dirX: 0, dirY: 0, size: X.gas.r, maxTicks: 30 });
  } else if (f.kind === "vine") {
    f.next = s.tick + X.vine.every;
    for (const e of near(s, f.x, f.y, X.vine.r)) {
      if (e.vtSeed) vtSprout(s, e, 1, { fx: "vtWither", vine: true });
      else if (vtRoll(s, "vtVine") < X.vine.seed) vtPlantSeed(s, e);
    }
  } else {
    const R = K.maw;
    if (!near(s, f.x, f.y, R.r).length) return true;
    f.next = s.tick + R.rest;
    f.bite = s.tick + 30;
    nrArea(s, f.x, f.y, R.r, D * L.strong, undefined, vt({ poi: true }));
    addEffect(s, { kind: "vtGas", x: f.x, y: f.y, dirX: 0, dirY: 0, size: R.r * 1.2, maxTicks: 30 });
  }
  return true;
}

/** 쓰러진 적 찾기: 지난 틱 살아 있던 보스 아닌 적이 사라졌거나 체력이 0이면 (방마다 최대 12) */
function corpseTick(s: RunState): void {
  const p = s.player;
  const now = new Map<number, EnemyState>();
  for (const e of s.enemies) if (nrAlive(e) && !nrBoss(e) && e.kind !== "dummy") now.set(e.id, e);
  for (const [id, x, y, kind, r] of p.vtSeen ?? []) {
    if (now.has(id)) continue;
    (p.vtCorpses ??= []).push({ kind, x, y, r });
    if (p.vtCorpses.length > 12) p.vtCorpses.shift();
  }
  p.vtSeen = [...now.values()].map((e) => [e.id, e.x, e.y, e.kind, e.r]);
}

/** 사령화 조종: 범위 안 쓰러진 적을 덩굴 인형으로 (최대 수) */
export function vtRaise(s: RunState): void {
  const p = s.player;
  const R = K.thrall;
  const left = [];
  for (const c of p.vtCorpses ?? []) {
    if ((p.vtThralls?.length ?? 0) >= R.max || (c.x - p.x) ** 2 + (c.y - p.y) ** 2 > R.r ** 2) {
      left.push(c);
      continue;
    }
    const id = (p.vtNext = (p.vtNext ?? 0) + 1);
    (p.vtThralls ??= []).push({ id, kind: c.kind, x: c.x, y: c.y, prevX: c.x, prevY: c.y, r: c.r, until: s.tick + R.life, cd: 20, face: 1, swing: 0 });
    addEffect(s, { kind: "vtSprout", x: c.x, y: c.y, dirX: 0, dirY: 0, size: c.r + 16, maxTicks: 24 });
  }
  p.vtCorpses = left;
}

/** 덩굴 인형 한 틱: 가까운 적에게 걸어가 때림 (독) · 남아 있으면 true */
function thrallTick(s: RunState, t: VtThrall): boolean {
  const R = K.thrall;
  [t.prevX, t.prevY] = [t.x, t.y];
  if (t.until <= s.tick) {
    addEffect(s, { kind: "vtPop", x: t.x, y: t.y, dirX: 0, dirY: 0, size: t.r + 10, maxTicks: 16 });
    return false;
  }
  if (t.cd > 0) t.cd--;
  if (t.swing > 0) t.swing--;
  let e: EnemyState | undefined;
  let bd = 260 ** 2;
  for (const f of s.enemies) {
    const d = (f.x - t.x) ** 2 + (f.y - t.y) ** 2;
    if (nrAlive(f) && d < bd) [e, bd] = [f, d];
  }
  if (!e) return true;
  const reach = t.r + e.r + 3;
  if (bd > reach * reach) {
    const d = normalize(e.x - t.x, e.y - t.y) ?? [0, 0];
    const sp = Math.max(R.speed, ENEMIES[t.kind].speed * 1.1);
    [t.x, t.y] = [t.x + d[0] * sp, t.y + d[1] * sp];
    if (Math.abs(d[0]) > 0.2) t.face = d[0] < 0 ? -1 : 1;
    keepInRoom(t, roomGrid(s));
  } else if (t.cd <= 0) {
    t.cd = R.rate;
    t.swing = 10;
    nrArea(s, e.x, e.y, 0, s.player.stats.damage * R.mul, undefined, vt({ poi: true }));
  }
  return true;
}

/** 틱마다: 남는 것 · 쓰러진 적 · 덩굴 인형 */
export function vtPlantsTick(s: RunState): void {
  const p = s.player;
  if (p.vtPlants?.length) {
    // 도는 동안 새로 생긴 것(시든 육신 덩굴)은 뒤에 붙임 · 덩굴은 최대 수만 (오래된 것부터 사라짐)
    const list = p.vtPlants;
    p.vtPlants = [];
    const keep = [];
    for (const f of srcEach(list)) if (plantTick(s, f)) keep.push(f);
    const all = [...keep, ...p.vtPlants];
    const vines = all.filter((f) => f.kind === "vine");
    p.vtPlants = vines.length > X.vine.max ? all.filter((f) => !vines.slice(0, vines.length - X.vine.max).includes(f)) : all;
  }
  corpseTick(s);
  if (p.vtThralls?.length) {
    const keep = [];
    for (const t of srcEach(p.vtThralls)) if (thrallTick(s, t)) keep.push(t);
    p.vtThralls = keep;
  }
}
