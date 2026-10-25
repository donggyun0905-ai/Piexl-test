// 로비 펫 능력 (한 판에 한 마리, RunState.pet): 같이 싸움(고양이·강아지) · 받는 피해 · 이동 속도 · 치명타 · 사거리 · 돈 · 목숨 +1
import { LOBBY_PETS as L } from "../petDefs";
import type { StatMod } from "../stats";
import { alive, strike } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, dist2 } from "./util";

/** 능력치 (sim/items.recalcStats) */
export function petMods(s: RunState): StatMod[] {
  if (s.pet === "bunny") return [{ stat: "moveSpeed", mul: L.bunny.move }];
  if (s.pet === "dragon") return [{ stat: "range", mul: L.dragon.range }];
  return [];
}

/** 받는 피해 배율 (classTaken) */
export const petTaken = (s: RunState) => (s.pet === "slime" ? L.slime.taken : 1);

/** 얻는 돈 배율 (combat.addGold) */
export const petGold = (s: RunState) => (s.pet === "turtle" ? L.turtle.gold : 1);

/** 치명타 확률·배율 (novice.rollCrit) */
export const petCrit = (s: RunState) => (s.pet === "chick" ? L.chick.crit : 0);

/** 불사조: 한 판에 한 번 되살아남 (run.checkDeath). 되살렸으면 true */
export function petRevive(s: RunState): boolean {
  const p = s.player;
  if (s.pet !== "phoenix" || s.petRevived || s.sudden) return false;
  s.petRevived = true;
  p.hp = Math.ceil(p.stats.maxHp * L.phoenix.hp);
  p.invulnTicks = 120;
  addEffect(s, { kind: "oFlame", x: p.x, y: p.y, dirX: 0, dirY: -1, size: 30, width: -1, maxTicks: 30 });
  return true;
}

/** 틱마다: 고양이·강아지가 가까운 적을 같이 공격 */
export function petTick(s: RunState): void {
  if (s.pet !== "cat" && s.pet !== "dog") return;
  const d = L[s.pet];
  if (s.tick % d.every !== 0) return;
  const p = s.player;
  const e = alive(s)
    .filter((t) => dist2(t, p) <= d.reach ** 2)
    .sort((a, b) => dist2(a, p) - dist2(b, p) || a.id - b.id)[0];
  if (!e) return;
  strike(s, e, p.stats.damage * d.mul);
  addEffect(s, { kind: s.pet === "cat" ? "scratch" : "imBite", x: e.x, y: e.y, dirX: p.faceX, dirY: p.faceY, size: 7, maxTicks: 10 });
}
