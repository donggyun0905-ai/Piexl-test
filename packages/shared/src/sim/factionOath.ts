// 아스칼론 맹세 (sim/faction이 부름): 적이 남은 방에 들어서면 맹세 하나(시드로) → 방을 끝낼 때 지켰으면 영광 +1(한 판 동안 피해 증가) · 어기면 그 방에서만 약해짐 (수치 factionDefs.FACTION_OATH)
import { FACTION_OATH as O } from "../factionDefs";
import { createRng, deriveSeed } from "../rng";
import type { OathKind } from "./factionTypes";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect } from "./util";

const KINDS: readonly OathKind[] = ["unhit", "swift", "still", "noItem", "elite", "hold"];
const filled = (p: PlayerState) => p.useSlots.filter((x) => x).length;

function broke(s: RunState): void {
  const o = s.player.fcOath!;
  if (o.broken || o.kept) return;
  o.broken = true;
  addEffect(s, { kind: "fcOathBroken", x: s.player.x, y: s.player.y, dirX: 0, dirY: 0, size: 24, maxTicks: 30, follow: true });
}

/** 틱마다: 새 방이면 맹세 시작 · 지키는지 살핌 · 방을 끝내면 영광 */
export function oathTick(s: RunState): void {
  const p = s.player;
  const at = `${s.floor}/${s.roomId}`;
  const cleared = s.rooms[s.roomId]?.cleared ?? true;
  let o = p.fcOath;
  if (o?.at !== at) {
    if (cleared || !s.enemies.length) return;
    const kind = createRng(deriveSeed(s.seed, "oath", s.floor, s.roomId)).pick(KINDS);
    const top = s.enemies.reduce((a, e) => (e.maxHp > a.maxHp ? e : a), s.enemies[0]!);
    o = p.fcOath = { kind, at, t: s.tick, x: p.x, y: p.y, n: 0, u: filled(p), ...(kind === "elite" ? { elite: top.id } : {}) };
  }
  if (o.kept || o.done) return;
  const dashing = p.dashTicks > 0;
  if (o.kind === "still" && dashing && !o.dash && ++o.n > O.dashes) broke(s);
  o.dash = dashing;
  if (o.kind === "swift" && s.tick - o.t > O.swiftTicks) broke(s);
  if (o.kind === "hold" && (p.x - o.x) ** 2 + (p.y - o.y) ** 2 > O.holdR ** 2) broke(s);
  if (o.kind === "noItem") {
    if (filled(p) < (o.u ?? 0)) broke(s);
    o.u = filled(p);
  }
  if (!cleared) return;
  o.done = true;
  if (o.broken) return;
  o.kept = true;
  p.fcGlory = Math.min(O.gloryMax, (p.fcGlory ?? 0) + 1);
  addEffect(s, { kind: "fcOathKept", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 30, maxTicks: 40, follow: true });
}

/** 맞음: 맞지 않기 맹세 */
export function oathHurt(s: RunState): void {
  const o = s.player.fcOath;
  if (o?.kind === "unhit" && !o.done && ++o.n > O.hits) broke(s);
}

/** 처치: 강한 적 먼저 (다른 적을 먼저 쓰러뜨리면 깨짐) */
export function oathKill(s: RunState, e: EnemyState): void {
  const o = s.player.fcOath;
  if (o?.kind !== "elite" || o.done || o.elite === undefined) return;
  if (e.id === o.elite) delete o.elite;
  else broke(s);
}

/** 주는 피해 배율: 영광 · 이번 방 맹세를 어겼으면 약해짐 */
export const oathDmgMul = (p: PlayerState) => (1 + (p.fcGlory ?? 0) * O.gloryDmg) * (p.fcOath?.broken && !p.fcOath.done ? O.brokenDmg : 1);
