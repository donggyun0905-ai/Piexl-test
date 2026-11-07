// 비르디아 공생 정령 (sim/faction이 부름): 시작할 때 카드 3장(시드) 중 1장 고름(창, menu 기능 SPIRIT_OP.pick) → 그 정령이 한 판 동안 함께 · 처치 수로 자람(싹·꽃·나무, 세기 배율)
// 버프형(햇살·꽃·가시)은 여기 · 동행형 sim/spiritAllies · 여우·꾸러미형 sim/spiritPack (수치 spiritDefs)
import { createRng, deriveSeed } from "../rng";
import { SPIRIT_BUFF as B, SPIRIT_GROW as G, SPIRIT_IDS, type SpiritId } from "../spiritDefs";
import { blastAt, healPlayer } from "./combat";
import { pickDistinct } from "./loot";
import { allyTick } from "./spiritAllies";
import { packMenu, packRoomClear, packTick } from "./spiritPack";
import type { PlayerState, RunState } from "./types";
import { addEffect } from "./util";

/** 창 버튼 기능 번호 (station.stationMenu): 정령 고르기 · 꾸러미 꺼내기/닫기 · 상자 고르기 · 여우 바꾸기 */
export const SPIRIT_OP = { pick: 20, bag: 21, chest: 22, fox: 23 } as const;

/** 정령 단계 0 싹 · 1 꽃 · 2 나무 · 세기 배율 */
export const spiritStage = (p: PlayerState) => ((p.fcSpKills ?? 0) >= G.grow2 ? 2 : (p.fcSpKills ?? 0) >= G.grow1 ? 1 : 0);
export const spiritPower = (p: PlayerState) => G.power[spiritStage(p)] ?? 1;
const has = (p: PlayerState, id: SpiritId) => p.fcSp === id;

export function spiritKill(s: RunState): void {
  const p = s.player;
  if (!p.fcSp) return;
  const before = spiritStage(p);
  p.fcSpKills = (p.fcSpKills ?? 0) + 1;
  if (spiritStage(p) > before) addEffect(s, { kind: "fcSpGrow", x: p.fcSpX ?? p.x, y: p.fcSpY ?? p.y, dirX: 0, dirY: 0, size: 20 + spiritStage(p) * 6, maxTicks: 40, follow: true });
  if (has(p, "sun")) p.fcSpBuffT = B.sunTicks;
}

/** 맞은 뒤: 가시 정령 둘레 가시 폭발 */
export function spiritHurt(s: RunState): void {
  const p = s.player;
  if (!has(p, "thorn")) return;
  blastAt(s, p.x, p.y, B.thornR, p.stats.damage * B.thornMul * spiritPower(p), { push: 8 });
  addEffect(s, { kind: "fcSpThorn", x: p.x, y: p.y, dirX: 0, dirY: 0, size: B.thornR, maxTicks: 20 });
}

/** 방을 끝냄 (loot.onRoomCleared) */
export function spiritRoomClear(s: RunState): void {
  const p = s.player;
  if (!p.fcSp) return;
  p.fcSpRooms = (p.fcSpRooms ?? 0) + 1;
  if (has(p, "bloom")) healPlayer(s, p.stats.maxHp * B.bloomRoom * spiritPower(p));
  packRoomClear(s);
}

/** 틱마다: 처음이면 카드 3장 · 어깨 위로 따라옴 · 정령마다 */
export function spiritTick(s: RunState): void {
  const p = s.player;
  if (!p.fcSp) {
    if (!p.fcSpPick) p.fcSpPick = pickDistinct(createRng(deriveSeed(s.seed, "spiritPick")), SPIRIT_IDS, 3);
    return;
  }
  const tx = p.x - p.faceX * 14 - p.faceY * 8;
  const ty = p.y - 14 - p.faceY * 6;
  p.fcSpX = p.fcSpX === undefined ? tx : p.fcSpX + (tx - p.fcSpX) * 0.12;
  p.fcSpY = p.fcSpY === undefined ? ty : p.fcSpY + (ty - p.fcSpY) * 0.12;
  if ((p.fcSpBuffT ?? 0) > 0) p.fcSpBuffT!--;
  if (has(p, "bloom") && (p.fcSpHealT = (p.fcSpHealT ?? 0) + 1) >= B.bloomEvery) {
    p.fcSpHealT = 0;
    healPlayer(s, p.stats.maxHp * B.bloomHeal * spiritPower(p));
  }
  allyTick(s);
  packTick(s);
}

/** 창에서 고름 (station.stationMenu): 정령 카드 a번째 · 꾸러미·상자·여우는 spiritPack */
export function spiritMenu(s: RunState, op: number, a: number): void {
  const p = s.player;
  if (op === SPIRIT_OP.pick) {
    const id = p.fcSpPick?.[a];
    if (p.fcSp || !id) return;
    p.fcSp = id;
    p.fcSpHealT = 0;
    delete p.fcSpPick;
    addEffect(s, { kind: "fcSpGrow", x: p.x, y: p.y - 14, dirX: 0, dirY: 0, size: 26, maxTicks: 40, follow: true });
    return;
  }
  packMenu(s, op, a);
}

/** 주는 피해 배율 · 받는 피해 배율 · 공격 속도 배율 (sim/faction) */
export const spiritDmgMul = (p: PlayerState) => (has(p, "sun") ? 1 + B.sunDmg * spiritPower(p) : 1);
export const spiritTaken = (p: PlayerState) => (has(p, "thorn") ? 1 - B.thornTaken * spiritPower(p) : 1);
export const spiritSpeedMul = (p: PlayerState) => (has(p, "sun") && (p.fcSpBuffT ?? 0) > 0 ? 1 + B.sunSpeed : 1);
