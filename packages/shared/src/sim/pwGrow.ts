// 패왕전 성장 대결 (쟁탈전 · 전쟁의 서막, docs/PW_MODES.md 공통 규칙): 레벨 최대 18(오를 때 모든 능력치 함께) · 막타 경험치·돈(가까이 있으면 경험치 조금)
// 1초마다 1원 · 집(빠른 회복 · 상점 · 부활, 기다리는 시간은 레벨에 따라) · 장비(pwShop)·증강(pwRules.PW_AUGS) 고르기는 입력 menu로 (기록·협동에서도 같은 결과)
import { TICK_RATE } from "../constants";
import { PW_MODE } from "../paewangDefs";
import { PW_ARENAS } from "../paewangMaps";
import { PW_AUGS, PW_CAP, PW_GROW, PW_UNIT, type PwAugId } from "../pwRules";
import { PW_BASIC, PW_LEGEND, PW_SHOP_IDS, PW_SHOP_USES, pwGearDef } from "../pwShop";
import type { UseItemId } from "../items";
import { createRng, deriveSeed } from "../rng";
import { recalcStats } from "./items";
import { spotXY } from "./paewangGrid";
import { allPlayers, eachSeat, seatNo, useSeat } from "./party";
import { inPlay } from "./pvpWorld";
import { gearSum } from "./pwGearStat";
import { laneMinutes, makeUnit } from "./pwLane";
import type { RunState } from "./types";
import { addEffect } from "./util";

/** 성장 대결 판인지 */
export const isGrow = (s: RunState): boolean => {
  const r = s.pvp && PW_MODE[s.pvp.mode].rule;
  return r === "contest" || r === "war";
};

/** 상점 입력 번호: 사기(목록 자리) · 팔기(장비 칸) · 증강 고르기(셋 중) */
export const GROW_MENU = { buy: 1_000_000, sell: 1_100_000, aug: 1_200_000, tp: 1_300_000 };

/** 편의 집 (픽셀) */
export function homeOf(s: RunState, team: number): [number, number] {
  const h = PW_ARENAS[s.pvp!.arena].homes;
  return h ? spotXY(h[team === 1 ? 1 : 0]) : [0, 0];
}

export function atHome(s: RunState, i: number): boolean {
  const p = allPlayers(s)[i]!;
  const [x, y] = homeOf(s, s.pvp!.seats[i]!.team);
  return (p.x - x) ** 2 + (p.y - y) ** 2 <= PW_GROW.homeR ** 2;
}

/** 판 시작: 포탑·집 보스 · 모두 1레벨·처음 돈 */
export function growInit(s: RunState): void {
  const pv = s.pvp!;
  const a = PW_ARENAS[pv.arena];
  pv.grow = { units: [], waveAt: 0, center: {}, base: {}, bossDown: {} };
  for (const t of a.towers ?? []) {
    const u = makeUnit(s, "tower", t.team, ...spotXY(t.at));
    u.order = t.order;
    u.lane = t.lane;
    pv.grow.units.push(u);
  }
  if (PW_MODE[pv.mode].rule === "contest") for (const team of [0, 1]) pv.grow.units.push(makeUnit(s, "boss", team, ...homeOf(s, team)));
  eachSeat(s, () => {
    const p = s.player;
    p.pwLv = 1;
    p.pwXp = 0;
    p.pwGear = [];
    p.pwAug = [];
    s.gold = PW_GROW.goldStart;
    recalcStats(s);
    p.hp = p.stats.maxHp;
  });
}

/** 능력치 (pvp.pvpStats 끝에서): 레벨마다 · 장비 · 증강 */
export function growStats(s: RunState): void {
  const p = s.player;
  if (p.pwLv === undefined) return;
  const st = p.stats;
  const g = gearSum(p);
  const k = p.pwLv - 1;
  const L = PW_GROW.perLv;
  st.maxHp = (st.maxHp * (1 + L.hp * k) + g.hp) * g.hpMul;
  st.damage = (st.damage * (1 + L.dmg * k) + g.dmg) * (1 + g.dmgMul);
  st.attackSpeed *= (1 + L.rate * k) * (1 + g.rate);
  st.range = (st.range + g.range) * (1 + g.rangeMul);
  st.moveSpeed = Math.max(0.5, st.moveSpeed + g.move);
  st.projectileSpeed *= 1 + g.shot;
  p.pwDashCut = g.dashCut;
}

/** 다시 태어나기까지 틱 */
export const respawnTicks = (s: RunState): number => (isGrow(s) ? PW_GROW.respawn + PW_GROW.respawnPerLv * ((s.player.pwLv ?? 1) - 1) : PW_CAP.respawn);

const roll = (s: RunState, tag: string, ...n: number[]) => createRng(deriveSeed(s.seed, "pwGrow", tag, ...n));

/** i번 자리에 경험치 (레벨이 오르면 체력도 그만큼 · 증강 레벨이면 셋 중 고르기, AI는 바로) */
export function addXp(s: RunState, i: number, n: number): void {
  const back = seatNo(s);
  useSeat(s, i);
  const p = s.player;
  const max = PW_GROW.maxLv + gearSum(p).maxLv;
  p.pwXp = (p.pwXp ?? 0) + n;
  let up = false;
  while ((p.pwLv ?? 1) < max && p.pwXp >= PW_GROW.xpBase + PW_GROW.xpPer * ((p.pwLv ?? 1) - 1)) {
    p.pwXp -= PW_GROW.xpBase + PW_GROW.xpPer * ((p.pwLv ?? 1) - 1);
    p.pwLv = (p.pwLv ?? 1) + 1;
    up = true;
    if (PW_GROW.augLv.includes(p.pwLv)) offerAug(s, i);
  }
  if (up) {
    const old = p.stats.maxHp;
    recalcStats(s);
    p.hp = Math.min(p.stats.maxHp, p.hp + Math.max(0, p.stats.maxHp - old));
    addEffect(s, { kind: "ring", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 18, maxTicks: 20, width: 1, follow: true });
  }
  useSeat(s, back);
}

function offerAug(s: RunState, i: number): void {
  const p = s.player;
  const pool = (Object.keys(PW_AUGS) as PwAugId[]).filter((id) => !p.pwAug?.includes(id));
  const rng = roll(s, "aug", i, p.pwLv ?? 1);
  const offer: string[] = [];
  while (offer.length < 3 && pool.length) offer.push(pool.splice(rng.int(0, pool.length - 1), 1)[0]!);
  p.pwOffer = offer;
  // AI는 바로 고름
  if (!s.pvp!.seats[i]!.human) pickAug(s, rng.int(0, offer.length - 1));
}

function pickAug(s: RunState, k: number): void {
  const p = s.player;
  const id = p.pwOffer?.[k];
  if (!id) return;
  p.pwAug = [...(p.pwAug ?? []), id];
  p.pwOffer = undefined;
  recalcStats(s);
}

/** 쓰러뜨린 것의 보상: 막타 친 자리는 돈·경험치, 그 근처 같은 편은 경험치 조금 (foeTeam = 쓰러진 쪽 편) */
export function reward(s: RunState, killer: number | undefined, kind: keyof typeof PW_GROW.gold, x: number, y: number, foeTeam: number, victimLv = 1): void {
  const pv = s.pvp!;
  const [last, near] = PW_GROW.xp[kind]!;
  const extra = kind === "hero" ? PW_GROW.heroPerLv * (victimLv - 1) : 0;
  const ok = (i: number) => pv.seats[i]!.team !== foeTeam;
  if (killer !== undefined && ok(killer)) {
    const back = seatNo(s);
    useSeat(s, killer);
    s.gold += PW_GROW.gold[kind];
    s.goldEarned += PW_GROW.gold[kind];
    addEffect(s, { kind: "coinGet", x, y, dirX: 0, dirY: 0, size: PW_GROW.gold[kind], maxTicks: 30 });
    useSeat(s, back);
    addXp(s, killer, last + extra);
  }
  allPlayers(s).forEach((p, i) => {
    if (i !== killer && ok(i) && inPlay(s, i) && (p.x - x) ** 2 + (p.y - y) ** 2 <= PW_GROW.near ** 2) addXp(s, i, near + extra / 3);
  });
}

/** 상점·증강 입력 (집에서만 삼). 처리했으면 true */
export function growMenu(s: RunState, code: number): boolean {
  if (!isGrow(s) || code < GROW_MENU.buy) return false;
  const p = s.player;
  const i = seatNo(s);
  if (code >= GROW_MENU.tp) teleport(s, code - GROW_MENU.tp);
  else if (code >= GROW_MENU.aug) pickAug(s, code - GROW_MENU.aug);
  else if (code >= GROW_MENU.sell) sell(s, code - GROW_MENU.sell);
  else if (atHome(s, i)) buy(s, PW_SHOP_IDS[code - GROW_MENU.buy] ?? "");
  recalcStats(s);
  p.hp = Math.min(p.hp, p.stats.maxHp);
  return true;
}

/** 전쟁의 서막: 집에서 우리 편이 가진 체크포인트로 순간이동 */
function teleport(s: RunState, k: number): void {
  const pv = s.pvp!;
  const i = seatNo(s);
  const pt = PW_ARENAS[pv.arena].points?.[k];
  if (!pt || pv.grow?.points?.[k]?.owner !== pv.seats[i]!.team || !atHome(s, i)) return;
  const p = s.player;
  addEffect(s, { kind: "burst", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 20, maxTicks: 16 });
  [p.x, p.y] = spotXY(pt.at);
  [p.prevX, p.prevY] = [p.x, p.y];
  addEffect(s, { kind: "burst", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 20, maxTicks: 16 });
}

/** 장비 하나의 모든 값 (전설은 재료 값까지) */
export const fullCost = (id: string): number => {
  const d = pwGearDef(id);
  return (d?.cost ?? 0) + Object.entries(d?.need ?? {}).reduce((a, [m, n]) => a + (PW_BASIC[m]?.cost ?? 0) * n, 0);
};

/** 사기: 사용 아이템은 빈 칸에 · 기본 장비 · 전설은 가진 재료를 쓰고 모자란 재료 값은 더 냄 · 금기된 아티팩트는 하나만 */
export function buyPlan(s: RunState, id: string): { cost: number; gear: string[] } | null {
  const p = s.player;
  const gear = [...(p.pwGear ?? [])];
  const use = PW_SHOP_USES[id as UseItemId];
  if (use !== undefined) return p.useSlots.includes(null) ? { cost: use, gear } : null;
  const basic = PW_BASIC[id];
  if (basic) return gear.length < PW_GROW.slots ? { cost: basic.cost, gear: [...gear, id] } : null;
  const leg = PW_LEGEND[id];
  if (!leg || (leg.relic && gear.some((g) => PW_LEGEND[g]?.relic))) return null;
  let cost = leg.cost;
  for (const [m, n] of Object.entries(leg.need ?? {})) {
    for (let k = 0; k < n; k++) {
      const at = gear.indexOf(m);
      if (at >= 0) gear.splice(at, 1);
      else cost += PW_BASIC[m]?.cost ?? 0;
    }
  }
  return gear.length < PW_GROW.slots ? { cost, gear: [...gear, id] } : null;
}

function buy(s: RunState, id: string): void {
  const plan = buyPlan(s, id);
  const p = s.player;
  if (!plan || s.gold < plan.cost) return;
  s.gold -= plan.cost;
  s.goldSpent += plan.cost;
  if (PW_SHOP_USES[id as UseItemId] !== undefined) p.useSlots[p.useSlots.indexOf(null)] = id as UseItemId;
  else p.pwGear = plan.gear;
}

function sell(s: RunState, k: number): void {
  const p = s.player;
  const id = p.pwGear?.[k];
  if (!id || !atHome(s, seatNo(s))) return;
  p.pwGear = p.pwGear!.filter((_, j) => j !== k);
  s.gold += Math.floor(fullCost(id) / 2);
}

/** 틱마다: 1초마다 1원 · 집에서 빠른 회복 */
export function growEconomy(s: RunState): void {
  eachSeat(s, (i) => {
    const p = s.player;
    if (s.tick % TICK_RATE === 0) s.gold += 1;
    if (inPlay(s, i) && atHome(s, i) && p.hp < p.stats.maxHp) p.hp = Math.min(p.stats.maxHp, p.hp + (p.stats.maxHp * PW_GROW.homeHeal) / TICK_RATE);
  });
}

/** 병사 무리 배율: 시간이 갈수록 · 가운데를 점령한 편 */
export const waveMul = (s: RunState) => 1 + PW_UNIT.wave.grow * Math.floor(laneMinutes(s));
