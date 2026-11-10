// 미류 공용 도우미: 대태도 종류 · 해류 게이지 · 맞히기 · 물길 놓기 · 받는 피해 · 이동 배율
import { MIRYU_PERKS as K } from "../itemsMiryu";
import { MIRYU as M, type MiryuStyle } from "../weaponsMiryu";
import { damageEnemy } from "./combat";
import { rot } from "./orbit";
import type { MrStream } from "./miryuTypes";
import { isBoss } from "./s2Kit";
import { statusHit } from "./statusHit";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, hasPerk, keepInRoom, normalize, roomGrid, weaponOf, reachOf as rangeMul } from "./util";

export const isMiryu = (p: PlayerState) => p.characterId === "miryu";
export const mrOf = (p: PlayerState): MiryuStyle => weaponOf(p).miryu ?? { miryu: "seiran" };
/** 움직일 수 없는 적 (보스·허수아비): 실려 가지도 밀리지도 않음 */
export const anchored = (e: EnemyState) => isBoss(e) || e.kind === "dummy";
/** 베기 거리 */
/** 대태도 닿는 거리 (사거리 증가만큼 늘어남) */
export const reachOf = (p: PlayerState) => M.reach * (mrOf(p).reach ?? 1) * rangeMul(p);
export { rangeMul };

/** 바라보는 쪽(fx, fy)을 a만큼 돌린 방향 */
export function turn(fx: number, fy: number, a: number): [number, number] {
  const [c, sn] = rot(a);
  return [fx * c - fy * sn, fx * sn + fy * c];
}

/** 해류 게이지 채우기 (해룡이 나와 있으면 안 참 · 가득 차는 순간 알림 효과) */
export function gain(s: RunState, n: number): void {
  const p = s.player;
  if (p.mrDragon) return;
  const before = p.mrFlow ?? 0;
  const mul = (mrOf(p).gain ?? 1) * (hasPerk(p, "mrBreath") ? K.mrBreath.gain : 1);
  p.mrFlow = Math.min(M.flowMax, before + n * mul);
  if (before < M.flowMax && p.mrFlow >= M.flowMax) addEffect(s, { kind: "mrReady", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 28, maxTicks: 34 });
}

/** 미류 공격 한 번 (fx, fy에서 밀어내는 쪽 · push 밀어냄 · water: 물빛 피해 숫자) */
export function mrHit(s: RunState, e: EnemyState, dmg: number, fx: number, fy: number, push = 0, water = false): void {
  const [dx, dy] = normalize(e.x - fx, e.y - fy) ?? [s.player.faceX, s.player.faceY];
  if (water) statusHit(s, e, "tide", dmg, dx, dy, false);
  else damageEnemy(s, e, dmg, dx, dy, false);
  if (push !== 0 && !anchored(e) && e.hp > 0) {
    e.x += dx * push;
    e.y += dy * push;
    keepInRoom(e, roomGrid(s));
  }
}

/** 물길 하나 놓기 (pts는 흐르는 차례) · 많으면 오래된 것부터 지움 */
export function addStream(s: RunState, pts: [number, number][], ring?: [number, number]): void {
  const p = s.player;
  if (pts.length < 2) return;
  const st = mrOf(p);
  const life = Math.round(M.streamTicks * (st.life ?? 1) * (hasPerk(p, "mrRipple") ? K.mrRipple.life : 1));
  const list = (p.mrStreams ??= []);
  list.push({ pts, t: life, t0: life, w: M.streamW * (st.width ?? 1), ring });
  const max = M.streamMax + (hasPerk(p, "mrRipple") ? K.mrRipple.more : 0);
  while (list.length > max) list.shift();
}

/** 내가 물길 위에 있는지 */
export function onStream(p: PlayerState): boolean {
  for (const w of p.mrStreams ?? []) if (nearStream(w, p.x, p.y, w.w + p.r)) return true;
  return false;
}

/** 물길에서 (x, y)에 가장 가까운 마디의 흐르는 방향 (r 안에 없으면 null) */
export function nearStream(w: MrStream, x: number, y: number, r: number): [number, number] | null {
  let best: [number, number] | null = null;
  let bd = r * r;
  for (let i = 1; i < w.pts.length; i++) {
    const [ax, ay] = w.pts[i - 1]!;
    const [bx, by] = w.pts[i]!;
    const vx = bx - ax;
    const vy = by - ay;
    const l2 = vx * vx + vy * vy || 1;
    const t = Math.max(0, Math.min(1, ((x - ax) * vx + (y - ay) * vy) / l2));
    const d = (x - ax - vx * t) ** 2 + (y - ay - vy * t) ** 2;
    if (d > bd) continue;
    bd = d;
    best = normalize(vx, vy) ?? [1, 0];
  }
  return best;
}

/** 해룡 비늘 (classTaken) */
export const miryuTaken = (p: PlayerState) => (hasPerk(p, "mrScale") && (p.mrFlow ?? 0) >= M.flowMax * K.mrScale.at ? K.mrScale.taken : 1);
/** 물길 위 이동 (classMoveMul) */
export const miryuMoveMul = (p: PlayerState) => (isMiryu(p) && p.mrStreams && onStream(p) ? (hasPerk(p, "mrSurf") ? K.mrSurf.move : M.surf) : 1);
/** 물길 타기: 물길 위 공격 속도 (classSpeed) */
export const miryuSpeedMul = (p: PlayerState) => (hasPerk(p, "mrSurf") && onStream(p) ? K.mrSurf.speed : 1);
