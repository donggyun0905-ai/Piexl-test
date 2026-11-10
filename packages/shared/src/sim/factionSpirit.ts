// 비르디아 공생 정령 (sim/faction이 부름): 시작할 때 카드 3장(시드) 중 1장 고름(창, menu 기능 SPIRIT_OP.pick) → 그 정령이 한 판 동안 함께 · 처치 수로 자람(유년기·성장기·성숙기·궁극체)
// 버프형(햇살·꽃·가시)은 여기: 20초마다 10초 켜짐 · 동행형 sim/spiritAllies · 구미호·꾸러미형 sim/spiritPack · 코인 정령 sim/spiritCoin (수치 spiritDefs) · 도박형·꾸러미형은 처음부터 궁극체
import { createRng, deriveSeed } from "../rng";
import { SPIRIT_BUFF as B, SPIRIT_GROW as G, SPIRIT_IDS, SPIRIT_KIND, type SpiritId } from "../spiritDefs";
import { blastAt, healPlayer } from "./combat";
import { pickDistinct } from "./loot";
import { allyTick } from "./spiritAllies";
import { packMenu, packRoomClear, packTick } from "./spiritPack";
import { coinMenu } from "./spiritCoin";
import type { PlayerState, RunState } from "./types";
import { addEffect } from "./util";

/** 창 버튼 기능 번호 (station.stationMenu): 정령 고르기 · 꾸러미 꺼내기/닫기 · 상자 고르기 · 구미호 바꾸기(5번 키) · 코인 상자 받기(5번 키) */
export const SPIRIT_OP = { pick: 20, bag: 21, chest: 22, fox: 23, coin: 24 } as const;

/** 정령 단계 0 유년기 · 1 성장기 · 2 성숙기 · 3 궁극체 (도박형·꾸러미형은 늘 궁극체) */
export function spiritStage(p: PlayerState): number {
  const k = p.fcSpKills ?? 0;
  if (p.fcSp && (SPIRIT_KIND[p.fcSp] === "gamble" || SPIRIT_KIND[p.fcSp] === "pack")) return 3;
  return k >= G.grow3 ? 3 : k >= G.grow2 ? 2 : k >= G.grow1 ? 1 : 0;
}
const has = (p: PlayerState, id: SpiritId) => p.fcSp === id;
/** 버프형: 켜져 있는지 (고른 순간부터 cycle 틱마다 active 틱 동안 · 유년기는 효과 없음) */
export const buffOn = (p: PlayerState) => SPIRIT_KIND[p.fcSp ?? "fox"] === "buff" && spiritStage(p) > 0 && (p.fcSpCyc ?? 0) % B.cycle < B.active;
const on = (p: PlayerState, id: SpiritId) => has(p, id) && buffOn(p);

export function spiritKill(s: RunState): void {
  const p = s.player;
  if (!p.fcSp) return;
  const before = spiritStage(p);
  p.fcSpKills = (p.fcSpKills ?? 0) + 1;
  if (spiritStage(p) > before) addEffect(s, { kind: "fcSpGrow", x: p.fcSpX ?? p.x, y: p.fcSpY ?? p.y, dirX: 0, dirY: 0, size: 20 + spiritStage(p) * 6, maxTicks: 40, follow: true });
  if (on(p, "sun") && spiritStage(p) >= 3) p.fcSpBuffT = B.sunTicks;
}

/** 맞은 뒤: 가시 정령 궁극체 둘레 가시 폭발 (켜져 있을 때) */
export function spiritHurt(s: RunState): void {
  const p = s.player;
  if (!on(p, "thorn") || spiritStage(p) < 3) return;
  blastAt(s, p.x, p.y, B.thornR, p.stats.damage * B.thornMul, { push: 8 });
  addEffect(s, { kind: "fcSpThorn", x: p.x, y: p.y, dirX: 0, dirY: 0, size: B.thornR, maxTicks: 20 });
}

/** 방을 끝냄 (loot.onRoomCleared) */
export function spiritRoomClear(s: RunState): void {
  const p = s.player;
  if (!p.fcSp) return;
  p.fcSpRooms = (p.fcSpRooms ?? 0) + 1;
  if (has(p, "bloom") && spiritStage(p) >= 3) healPlayer(s, p.stats.maxHp * B.bloomRoom);
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
  const was = buffOn(p);
  p.fcSpCyc = ((p.fcSpCyc ?? 0) + 1) % B.cycle;
  if (!was && buffOn(p)) addEffect(s, { kind: "fcSpGrow", x: p.fcSpX ?? p.x, y: p.fcSpY ?? p.y, dirX: 0, dirY: 0, size: 18, maxTicks: 30, follow: true });
  const st = spiritStage(p);
  if (on(p, "bloom") && (p.fcSpHealT = (p.fcSpHealT ?? 0) + 1) >= (st >= 2 ? B.bloomEvery2 : B.bloomEvery1)) {
    p.fcSpHealT = 0;
    healPlayer(s, p.stats.maxHp * (st >= 2 ? B.bloomHeal2 : B.bloomHeal1));
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
    p.fcSpCyc = 0;
    delete p.fcSpPick;
    addEffect(s, { kind: "fcSpGrow", x: p.x, y: p.y - 14, dirX: 0, dirY: 0, size: 26, maxTicks: 40, follow: true });
    return;
  }
  if (op === SPIRIT_OP.coin) coinMenu(s);
  else packMenu(s, op, a);
}

/** 주는 피해 배율 · 받는 피해 배율 · 공격 속도 배율 (sim/faction) */
export const spiritDmgMul = (p: PlayerState) => (on(p, "sun") ? 1 + (spiritStage(p) >= 2 ? B.sunDmg2 : B.sunDmg1) : 1);
export const spiritTaken = (p: PlayerState) => (on(p, "thorn") ? 1 - (spiritStage(p) >= 2 ? B.thornTaken2 : B.thornTaken1) : 1);
export const spiritSpeedMul = (p: PlayerState) => (has(p, "sun") && (p.fcSpBuffT ?? 0) > 0 ? 1 + B.sunSpeed : 1);
