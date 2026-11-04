// 풍류사 전용 아이템 효과: 축지법(순간이동 대시) · 분신술 · 오색 구름 자국 · 먹물 웅덩이 · 풍류 피리
// 둔갑술·의적 주머니 돈·활빈당 깃발·구름 지형 피해는 sim/pungHooks (다른 파일에 거는 갈고리)
import { PUNGRYU_PERKS as K } from "../itemsPungryu";
import { nearest } from "./brawlMoves";
import { damageEnemy } from "./combat";
import { letterFrom, puPower } from "./pungryuKit";
import { inCircle, isBoss } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, DASH_SPEED_MUL, DASH_TICKS, hasPerk, keepInRoom, normalize, roomGrid } from "./util";

/** 축지법: 대시를 시작한 틱에 그 쪽으로 한 번에 옮겨 감 (벽에 막히면 거기까지), 다음 글자 2배 */
export function puDash(s: RunState): void {
  const p = s.player;
  const dashing = p.dashTicks > 0;
  const start = dashing && !p.puDashing;
  p.puDashing = dashing;
  if (!start || !hasPerk(p, "puShrink")) return;
  const fromX = p.x;
  const fromY = p.y;
  const reach = p.stats.moveSpeed * DASH_SPEED_MUL * DASH_TICKS * K.puShrink.reach;
  const g = roomGrid(s);
  for (let d = 0; d < reach; d += 4) {
    const bx = p.x;
    const by = p.y;
    p.x += p.dashDirX * 4;
    p.y += p.dashDirY * 4;
    keepInRoom(p, g);
    if (Math.abs(p.x - bx - p.dashDirX * 4) + Math.abs(p.y - by - p.dashDirY * 4) > 2) break;
  }
  // 대시는 짧게 끝내고 (무적은 남은 틱만큼) 다음 글자를 세게
  p.invulnTicks = Math.max(p.invulnTicks, p.dashTicks);
  p.dashTicks = 1;
  p.puQuick = K.puShrink.ticks;
  addEffect(s, { kind: "puTeleport", x: fromX, y: fromY, dirX: p.dashDirX, dirY: p.dashDirY, size: 14, toX: p.x, toY: p.y, maxTicks: 20 });
}

/** 분신 자리 (화면에서도 씀): 내 옆, 바라보는 쪽에 수직으로 */
export function cloneSpots(s: RunState): { x: number; y: number; t: number }[] {
  const p = s.player;
  return (p.puClones ?? []).map((c) => ({ x: p.x - p.faceY * K.puClone.side * c.side, y: p.y + p.faceX * K.puClone.side * c.side, t: c.t }));
}

/** 분신술: 구절을 완성하면 분신 하나 (최대 수, 넘치면 가장 오래된 것을 새로) */
export function addClone(s: RunState): void {
  const p = s.player;
  if (!hasPerk(p, "puClone")) return;
  const list = (p.puClones ??= []);
  if (list.length >= K.puClone.max) list.sort((a, b) => a.t - b.t).shift();
  const side = list.some((c) => c.side === 1) ? -1 : 1;
  list.push({ t: K.puClone.ticks, side });
  const at = cloneSpots(s).at(-1)!;
  addEffect(s, { kind: "puClone", x: at.x, y: at.y, dirX: 0, dirY: 0, size: 12, maxTicks: 24 });
}

/** 분신이 같은 글자를 따라 씀 (가까운 적 쪽, 없으면 내가 보는 쪽) */
export function cloneWrite(s: RunState, idx: number): void {
  const p = s.player;
  const e = nearest(s, p.stats.range * 1.2);
  for (const c of cloneSpots(s)) {
    const d = (e && normalize(e.x - c.x, e.y - c.y)) || [p.faceX, p.faceY];
    letterFrom(s, c.x, c.y, d[0], d[1], puPower(s) * K.puClone.mul, idx);
  }
}

export function cloneTick(s: RunState): void {
  const p = s.player;
  if (!p.puClones?.length) return;
  for (const c of p.puClones) c.t--;
  p.puClones = p.puClones.filter((c) => c.t > 0);
}

/** 먹물 붓: 글자가 맞은 자리에 웅덩이 (최대 수) */
export function inkAt(s: RunState, x: number, y: number): void {
  const p = s.player;
  if (!hasPerk(p, "puInk")) return;
  const list = (p.puInks ??= []);
  list.push({ x, y, t: K.puInk.ticks });
  if (list.length > K.puInk.max) list.shift();
}

/** 틱마다: 구름 자국(오색 구름) · 먹물 웅덩이 */
export function perkTick(s: RunState): void {
  const p = s.player;
  if (hasPerk(p, "puCloud")) {
    const trail = (p.puTrail ??= []);
    if (p.stillTicks === 0 && s.tick % K.puCloud.gap === 0) trail.push({ x: p.x, y: p.y + 4, t: K.puCloud.ticks });
    for (const c of trail) {
      c.t--;
      for (const e of inCircle(s, c.x, c.y, K.puCloud.r)) e.slowTicks = Math.max(e.slowTicks ?? 0, K.puCloud.slow);
    }
    p.puTrail = trail.filter((c) => c.t > 0);
  }
  if (p.puInks?.length) {
    const per = (puPower(s) * K.puInk.mul * K.puInk.gap) / 60;
    for (const ink of p.puInks) {
      ink.t--;
      if (ink.t % K.puInk.gap === 0) for (const e of inCircle(s, ink.x, ink.y, K.puInk.r)) damageEnemy(s, e, per, 0, 0, false);
    }
    p.puInks = p.puInks.filter((i) => i.t > 0);
  }
}

/** 풍류 피리: 몇 초마다 둘레 적을 밀치고 적 탄을 지움 */
export function flute(s: RunState): void {
  const p = s.player;
  if (!hasPerk(p, "puFlute")) return;
  p.puFlute = (p.puFlute ?? K.puFlute.gap) - 1;
  if (p.puFlute > 0) return;
  p.puFlute = K.puFlute.gap;
  for (const e of inCircle(s, p.x, p.y, K.puFlute.r)) {
    if (isBoss(e)) continue;
    const d = normalize(e.x - p.x, e.y - p.y) ?? [p.faceX, p.faceY];
    e.x += d[0] * K.puFlute.push;
    e.y += d[1] * K.puFlute.push;
    keepInRoom(e, roomGrid(s));
  }
  const rr = K.puFlute.r * K.puFlute.r;
  s.projectiles = s.projectiles.filter((pr) => pr.fromPlayer || (pr.x - p.x) ** 2 + (pr.y - p.y) ** 2 > rr);
  addEffect(s, { kind: "puFlute", x: p.x, y: p.y, dirX: 0, dirY: 0, size: K.puFlute.r, maxTicks: 30 });
}
