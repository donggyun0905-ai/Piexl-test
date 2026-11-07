// 비르디아 공생 정령 (sim/faction이 부름): 어깨 뒤를 따라다니며 가까운 적을 쏨 (맞지 않음) · 처치 수로 자람 싹 → 꽃(처치 회복) → 나무 정령(가끔 뿌리 속박) (수치 factionDefs.FACTION_SPIRIT)
import { ENEMIES } from "../content";
import { FACTION_SPIRIT as F } from "../factionDefs";
import { createRng, deriveSeed } from "../rng";
import { damageEnemy, healPlayer } from "./combat";
import type { PlayerState, RunState } from "./types";
import { addEffect, normalize } from "./util";

/** 정령 단계 0 싹 · 1 꽃 · 2 나무 정령 */
export const spiritStage = (p: PlayerState) => ((p.fcSpKills ?? 0) >= F.grow2 ? 2 : (p.fcSpKills ?? 0) >= F.grow1 ? 1 : 0);

export function spiritKill(s: RunState): void {
  const p = s.player;
  const before = spiritStage(p);
  p.fcSpKills = (p.fcSpKills ?? 0) + 1;
  if (spiritStage(p) > before) addEffect(s, { kind: "fcSpGrow", x: p.fcSpX ?? p.x, y: p.fcSpY ?? p.y, dirX: 0, dirY: 0, size: 20 + spiritStage(p) * 6, maxTicks: 40, follow: true });
  if (spiritStage(p) >= 1) healPlayer(s, p.stats.maxHp * F.heal);
}

/** 틱마다: 바라보는 반대쪽 어깨 뒤로 따라옴 · 간격마다 가까운 적을 쏨 */
export function spiritTick(s: RunState): void {
  const p = s.player;
  const tx = p.x - p.faceX * 14 - p.faceY * 8;
  const ty = p.y - 14 - p.faceY * 6;
  p.fcSpX = p.fcSpX === undefined ? tx : p.fcSpX + (tx - p.fcSpX) * 0.12;
  p.fcSpY = p.fcSpY === undefined ? ty : p.fcSpY + (ty - p.fcSpY) * 0.12;
  if ((p.fcSpCd ?? 0) > 0) {
    p.fcSpCd!--;
    return;
  }
  const x = p.fcSpX;
  const y = p.fcSpY;
  let best = null;
  let bd = F.range * F.range;
  for (const e of s.enemies) {
    const d = (e.x - x) ** 2 + (e.y - y) ** 2;
    if (e.hp > 0 && !e.immune && d < bd) [best, bd] = [e, d];
  }
  if (!best) return;
  const st = spiritStage(p);
  p.fcSpCd = F.every[st] ?? F.every[0]!;
  const [dx, dy] = normalize(best.x - x, best.y - y) ?? [p.faceX, p.faceY];
  damageEnemy(s, best, p.stats.damage * (F.mul[st] ?? F.mul[0]!), dx, dy, false);
  if (st >= 2 && best.hp > 0 && !ENEMIES[best.kind].boss && createRng(deriveSeed(s.seed, "fcRoot", best.id, s.tick)).nextFloat() < F.rootChance) best.rootTicks = Math.max(best.rootTicks ?? 0, F.rootTicks);
  addEffect(s, { kind: "fcSpHit", x, y, toX: best.x, toY: best.y, dirX: dx, dirY: dy, size: st, maxTicks: 14 });
}
