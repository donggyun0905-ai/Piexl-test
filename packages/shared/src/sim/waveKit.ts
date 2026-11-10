// 웨이브 공용 도우미 (sim/wave·waveSkills*): 도구 · 맞히기(잠든 적 2배) · 적 고르기(가까운·몰린·센) · 벽 · 물로 빚은 것 넣기
import { WAVE_PERKS as K } from "../itemsWave";
import { type WaveStyle } from "../weaponsWave";
import { blocksShot } from "./layout";
import { alive, isBoss } from "./s2Kit";
import { statusHit } from "./statusHit";
import type { WvBit } from "./waveTypes";
import type { EnemyState, PlayerState, RunState } from "./types";
import { dist2, keepInRoom, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, roomGrid, weaponOf } from "./util";

export const isWave = (p: PlayerState) => p.characterId === "wave";
export const waveOf = (p: PlayerState): WaveStyle => weaponOf(p).wave ?? { wave: "board" };
/** 기술 크기 배율 (만조의 왕관) */
export const big = (p: PlayerState) => waveOf(p).big ?? 1;
/** 움직일 수 없는 적 (보스·허수아비) */
export const anchored = (e: EnemyState) => isBoss(e) || e.kind === "dummy";
export const dmgOf = (s: RunState, mul: number) => s.player.stats.damage * mul;

/** 웨이브 공격 한 번: 물빛 피해 숫자 · 잠든 적은 2배 (깨어남) · (fx, fy)에서 밀어냄 (push < 0이면 끌어당김) */
export function wvHit(s: RunState, e: EnemyState, dmg: number, fx: number, fy: number, push = 0): void {
  const p = s.player;
  const sleep = p.wvSleep?.indexOf(e.id) ?? -1;
  if (sleep >= 0) {
    dmg *= K.wvSiren.wake;
    p.wvSleep!.splice(sleep, 1);
    e.stunTicks = 0;
  }
  const [dx, dy] = normalize(e.x - fx, e.y - fy) ?? [p.faceX, p.faceY];
  statusHit(s, e, "tide", dmg, dx, dy, false);
  if (push !== 0 && !anchored(e) && e.hp > 0) moveFoe(s, e, dx * push, dy * push);
}

/** 적을 옮김 (방 밖·벽 안으로 안 들어가게) */
export function moveFoe(s: RunState, e: EnemyState, dx: number, dy: number): void {
  e.x += dx;
  e.y += dy;
  keepInRoom(e, roomGrid(s));
}

/** (x, y)에서 reach 안 가장 가까운 적 (skip에 든 적 빼고) */
export function nearest(s: RunState, x: number, y: number, reach = 9999, skip?: readonly number[]): EnemyState | undefined {
  let best: EnemyState | undefined;
  let bd = reach * reach;
  for (const e of alive(s)) {
    if (skip?.includes(e.id)) continue;
    const d = dist2(e, { x, y });
    if (d < bd) [best, bd] = [e, d];
  }
  return best;
}

/** 적이 가장 몰린 곳 (둘레 50 안에 가장 많은 적의 자리) · 없으면 바라보는 쪽 앞 */
export function densest(s: RunState, ahead = 60): { x: number; y: number } {
  const p = s.player;
  const list = alive(s);
  let best: EnemyState | undefined;
  let bn = -1;
  for (const e of list) {
    let n = 0;
    for (const o of list) if (dist2(e, o) <= 2500) n++;
    if (n > bn || (n === bn && best && dist2(e, p) < dist2(best, p))) [best, bn] = [e, n];
  }
  return best ? { x: best.x, y: best.y } : clampIn(s, p.x + p.faceX * ahead, p.y + p.faceY * ahead);
}

/** 가장 센 적 (보스 먼저, 그다음 남은 체력) */
export function strongest(s: RunState): EnemyState | undefined {
  let best: EnemyState | undefined;
  for (const e of alive(s)) {
    if (!best || Number(isBoss(e)) * 1e9 + e.hp > Number(isBoss(best)) * 1e9 + best.hp) best = e;
  }
  return best;
}

/** 방 안으로 자리 맞춤 */
export function clampIn(_s: RunState, x: number, y: number): { x: number; y: number } {
  return { x: Math.max(ROOM_MIN_X, Math.min(ROOM_MAX_X, x)), y: Math.max(ROOM_MIN_Y, Math.min(ROOM_MAX_Y, y)) };
}

/** 벽(방 끝·기둥)인지 */
export function isWall(s: RunState, x: number, y: number): boolean {
  if (x < ROOM_MIN_X || x > ROOM_MAX_X || y < ROOM_MIN_Y || y > ROOM_MAX_Y) return true;
  const g = roomGrid(s);
  return g !== null && blocksShot(g, x, y);
}

/** 물로 빚은 것 하나 넣기 */
export function addBit(s: RunState, b: Omit<WvBit, "t0">): WvBit {
  const bit = { ...b, t0: b.t };
  (s.player.wvBits ??= []).push(bit);
  return bit;
}

/** 바라보는 쪽을 a(라디안이 아닌 [cos, sin])만큼 돌린 방향 */
export function turnDir(dx: number, dy: number, c: number, sn: number): [number, number] {
  return [dx * c - dy * sn, dx * sn + dy * c];
}

/** 쫓기: 지금 방향을 목표 쪽으로 rate만큼 꺾음 (길이 1) */
export function steer(b: { x: number; y: number; dx: number; dy: number }, tx: number, ty: number, rate: number): void {
  const to = normalize(tx - b.x, ty - b.y);
  const nd = to && normalize(b.dx + to[0] * rate, b.dy + to[1] * rate);
  if (nd) [b.dx, b.dy] = nd;
}

/** 원 안 적 모두 맞힘 (hit 목록이 있으면 한 번씩만) */
export function burstAt(s: RunState, x: number, y: number, r: number, dmg: number, push = 0, hit?: number[]): EnemyState[] {
  const got: EnemyState[] = [];
  for (const e of alive(s)) {
    if (hit?.includes(e.id) || dist2(e, { x, y }) > (r + e.r) ** 2) continue;
    hit?.push(e.id);
    wvHit(s, e, dmg, x, y, push);
    got.push(e);
  }
  return got;
}

/** 적 찾기 (id로, 살아 있을 때만) */
export const foeById = (s: RunState, id: number | undefined) => (id === undefined ? undefined : s.enemies.find((e) => e.id === id && e.hp > 0));
