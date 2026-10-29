// 패왕전 기간토마키아 (docs/PW_MODES.md 5): 나 + AI 29명 · 큰 맵 · 뿔 거인(붉은·푸른·흰 뿔)·도깨비·상자로 성장 · 자기장 · 마지막 1명 승리
// 배낭 10칸(한 칸은 금고: 죽어도 안 잃음) · 상자에서 돈·조합 장비·사용 아이템(u:)·드물게 상점 물건(g:) · 제작은 재료 + 돈, 3초 가만히
// 죽으면 배낭을 떨굼(금고만 남음) · 임시 출구 둘로 나가면 배낭을 가져감. 수치는 pwRules.PW_GIGA. 무작위는 판 시드로만
import { TILE_SIZE } from "../constants";
import type { UseItemId } from "../items";
import { PW_MODE } from "../paewangDefs";
import { PW_GIGA } from "../pwRules";
import { PW_BASIC, PW_LEGEND, PW_SHOP_USES, pwGearDef } from "../pwShop";
import { createRng, deriveSeed } from "../rng";
import { recalcStats } from "./items";
import { tileAt, TILE_FLOOR } from "./layout";
import { pwGrid } from "./paewangGrid";
import { eachSeat, seatNo } from "./party";
import { inPlay } from "./pvpWorld";
import { pvpZone } from "./pvpZone";
import { makeUnit } from "./pwLane";
import type { PwLoot } from "./pwGrowTypes";
import type { RunState, TickInput } from "./types";
import { addEffect } from "./util";

export const isGiga = (s: RunState): boolean => !!s.pvp && PW_MODE[s.pvp.mode].rule === "giganto";
/** 입력 menu: 제작(전설 목록 자리) · 금고와 배낭 칸 바꾸기 */
export const GIGA_MENU = { craft: 1_400_000, vault: 1_500_000, take: 1_700_000, drop: 1_710_000, close: 1_720_000 };
export const isGear = (id: string): boolean => !!pwGearDef(id);

const USES = Object.keys(PW_SHOP_USES);
const BASICS = Object.keys(PW_BASIC);
const LEGENDS = Object.keys(PW_LEGEND);

/** 맵의 빈 바닥 한 곳 (픽셀) */
function freeSpot(s: RunState, rng: ReturnType<typeof createRng>): [number, number] {
  const g = pwGrid(s.pvp!.arena);
  for (let k = 0; k < 200; k++) {
    const c = rng.int(3, PW_GIGA.cols - 4);
    const r = rng.int(3, PW_GIGA.rows - 4);
    if (tileAt(g, c, r) === TILE_FLOOR) return [(c + 0.5) * TILE_SIZE, (r + 0.5) * TILE_SIZE];
  }
  return [PW_GIGA.cols * 8, PW_GIGA.rows * 8];
}

function chestItems(rng: ReturnType<typeof createRng>): string[] {
  const c = PW_GIGA.chest;
  const out: string[] = [];
  if (rng.nextFloat() < c.gear) out.push(rng.pick(BASICS));
  if (rng.nextFloat() < c.use) out.push(`u:${rng.pick(USES)}`);
  if (rng.nextFloat() < c.goods) out.push(rng.pick(PW_GIGA.goods));
  return out;
}

export function gigaInit(s: RunState): void {
  const g = s.pvp!.grow!;
  const rng = createRng(deriveSeed(s.seed, "giga"));
  g.loot = [];
  g.exits = [];
  g.out = [];
  for (const [kind, n] of Object.entries(PW_GIGA.giants) as [keyof typeof PW_GIGA.giants, number][]) for (let k = 0; k < n; k++) g.units.push(makeUnit(s, kind, 2, ...freeSpot(s, rng)));
  for (let k = 0; k < PW_GIGA.goblins; k++) g.units.push(makeUnit(s, "goblin", 2, ...freeSpot(s, rng)));
  for (let k = 0; k < PW_GIGA.chests; k++) {
    const [x, y] = freeSpot(s, rng);
    g.loot.push({ id: s.nextId++, x, y, chest: true, gold: rng.int(PW_GIGA.chest.gold[0]!, PW_GIGA.chest.gold[1]!), items: chestItems(rng) });
  }
  eachSeat(s, () => {
    s.gold = 0;
    s.player.pwBag = [];
  });
}

/** 배낭의 장비를 능력치에 (금고 칸 포함) */
function syncGear(s: RunState): void {
  const p = s.player;
  p.pwGear = [...(p.pwBag ?? []), ...(p.pwVault ? [p.pwVault] : [])].filter(isGear);
  recalcStats(s);
}

/** 배낭에 넣기 (사용 아이템은 빈 Q·E 칸 먼저) · 못 넣으면 false */
function bagAdd(s: RunState, id: string): boolean {
  const p = s.player;
  if (id.startsWith("u:") && p.useSlots.includes(null)) {
    p.useSlots[p.useSlots.indexOf(null)] = id.slice(2) as UseItemId;
    return true;
  }
  const bag = (p.pwBag ??= []);
  if (bag.length >= PW_GIGA.bag - 1) return false;
  bag.push(id);
  return true;
}

/** 쓰러진 거인·도깨비가 떨군 것 */
export function gigaDrop(s: RunState, kind: string, x: number, y: number, id: number): void {
  const d = PW_GIGA.drop[kind];
  if (!d) return;
  const rng = createRng(deriveSeed(s.seed, "gigaDrop", id));
  const items: string[] = [];
  for (let k = 0; k < d.gear; k++) items.push(rng.nextFloat() < d.legend ? rng.pick(LEGENDS) : rng.pick(BASICS));
  if (rng.nextFloat() < d.goods) items.push(rng.pick(PW_GIGA.goods));
  s.pvp!.grow!.loot!.push({ id: s.nextId++, x, y, chest: false, gold: d.gold, items });
}

/** 가까운 바닥 물건·출구 */
export function nearLoot(s: RunState, x: number, y: number): PwLoot | undefined {
  return s.pvp?.grow?.loot?.find((l) => (l.x - x) ** 2 + (l.y - y) ** 2 <= PW_GIGA.reach ** 2);
}
export const nearExit = (s: RunState, x: number, y: number): boolean => !!s.pvp?.grow?.exits?.some((e) => (e.x - x) ** 2 + (e.y - y) ** 2 <= PW_GIGA.reach ** 2);

/** 자리마다 움직이기 전: 제작 버티기 · F로 출구 나가기·상자 열기·배낭 줍기 */
export function gigaInput(s: RunState, input: TickInput): TickInput {
  if (!isGiga(s)) return input;
  const p = s.player;
  const i = seatNo(s);
  const g = s.pvp!.grow!;
  if (p.pwCraft) {
    if (input.moveX || input.moveY || input.attack || input.dash || input.skill) p.pwCraft = undefined;
    else if (s.tick >= p.pwCraft.end) finishCraft(s);
    return input;
  }
  if (!input.interact) return input;
  if (nearExit(s, p.x, p.y)) {
    g.out!.push(i);
    s.pvp!.seats[i]!.on = false;
    addEffect(s, { kind: "burst", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 30, maxTicks: 30 });
    return input;
  }
  const l = nearLoot(s, p.x, p.y);
  if (!l) return input;
  // 열면 돈은 바로 · 물건은 창에서 골라 가져감 (사람) · AI는 넣을 수 있는 만큼 다
  if (l.gold > 0) addEffect(s, { kind: "coinGet", x: l.x, y: l.y, dirX: 0, dirY: 0, size: l.gold, maxTicks: 30 });
  s.gold += l.gold;
  l.gold = 0;
  l.chest = false;
  if (s.pvp!.seats[i]!.human) p.pwOpen = l.id;
  else {
    l.items = l.items.filter((id) => !bagAdd(s, id));
    syncGear(s);
  }
  if (!l.items.length) g.loot = g.loot!.filter((x) => x !== l);
  return input;
}

/** 열어 둔 상자 (닿는 거리 안일 때만) */
export function openLoot(s: RunState): PwLoot | undefined {
  const p = s.player;
  const l = p.pwOpen === undefined ? undefined : s.pvp?.grow?.loot?.find((x) => x.id === p.pwOpen);
  return l && (l.x - p.x) ** 2 + (l.y - p.y) ** 2 <= (PW_GIGA.reach * 2) ** 2 ? l : undefined;
}

/** 제작할 수 있는지 (재료가 배낭에 다 있고 돈이 됨) */
export function canCraft(s: RunState, id: string): boolean {
  const leg = PW_LEGEND[id];
  const bag = [...(s.player.pwBag ?? [])];
  if (!leg || s.gold < leg.cost) return false;
  for (const [m, n] of Object.entries(leg.need ?? {})) {
    for (let k = 0; k < n; k++) {
      const at = bag.indexOf(m);
      if (at < 0) return false;
      bag.splice(at, 1);
    }
  }
  return true;
}

function finishCraft(s: RunState): void {
  const p = s.player;
  const id = p.pwCraft!.id;
  p.pwCraft = undefined;
  if (!canCraft(s, id)) return;
  const leg = PW_LEGEND[id]!;
  for (const [m, n] of Object.entries(leg.need ?? {})) for (let k = 0; k < n; k++) p.pwBag!.splice(p.pwBag!.indexOf(m), 1);
  s.gold -= leg.cost;
  p.pwBag!.push(id);
  addEffect(s, { kind: "afCraft", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 20, maxTicks: 30 });
  syncGear(s);
}

/** 제작 시작 · 금고 바꾸기 (처리했으면 true) */
export function gigaMenu(s: RunState, code: number): boolean {
  if (!isGiga(s) || code < GIGA_MENU.craft) return false;
  const p = s.player;
  const g = s.pvp!.grow!;
  if (code >= GIGA_MENU.close) p.pwOpen = undefined;
  else if (code >= GIGA_MENU.drop) {
    // 버리기: 발밑에 떨어진 배낭으로 (다른 사람도 주울 수 있음)
    const k = code - GIGA_MENU.drop;
    const id = k === 99 ? p.pwVault : p.pwBag?.[k];
    if (!id) return true;
    if (k === 99) p.pwVault = undefined;
    else p.pwBag!.splice(k, 1);
    g.loot!.push({ id: s.nextId++, x: p.x, y: p.y + 6, chest: false, gold: 0, items: [id] });
    syncGear(s);
  } else if (code >= GIGA_MENU.take) {
    // 상자에서 하나 가져가기 (배낭이 가득이면 그대로)
    const l = openLoot(s);
    const id = l?.items[code - GIGA_MENU.take];
    if (!l || !id || !bagAdd(s, id)) return true;
    l.items.splice(code - GIGA_MENU.take, 1);
    if (!l.items.length) g.loot = g.loot!.filter((x) => x !== l);
    syncGear(s);
  } else if (code >= GIGA_MENU.vault) {
    const k = code - GIGA_MENU.vault;
    const bag = (p.pwBag ??= []);
    const take = bag[k];
    if (take === undefined && !p.pwVault) return true;
    if (take !== undefined) bag.splice(k, 1);
    if (p.pwVault) bag.push(p.pwVault);
    p.pwVault = take;
    syncGear(s);
  } else {
    const id = LEGENDS[code - GIGA_MENU.craft];
    if (id && canCraft(s, id)) p.pwCraft = { id, end: s.tick + PW_GIGA.craftHold };
  }
  return true;
}

/** 쓰러질 때: 배낭(금고 빼고)과 돈 절반을 그 자리에 떨굼 */
export function gigaDeath(s: RunState): void {
  const p = s.player;
  const items = p.pwBag ?? [];
  const gold = Math.floor(s.gold / 2);
  if (items.length || gold) s.pvp!.grow!.loot!.push({ id: s.nextId++, x: p.x, y: p.y, chest: false, gold, items });
  p.pwBag = [];
  s.gold -= gold;
  syncGear(s);
}

/** 틱마다: 도깨비가 다시 나옴 (자기장 안) · 때가 되면 임시 출구 (지금 자기장 안 빈 바닥) */
export function gigaTick(s: RunState): void {
  const g = s.pvp!.grow!;
  if (s.tick % PW_GIGA.goblinEvery === 0 && g.units.filter((u) => u.kind === "goblin").length < PW_GIGA.goblins) {
    const rng = createRng(deriveSeed(s.seed, "gigaGoblin", s.tick));
    const z = pvpZone(s);
    for (let n = 0; n < PW_GIGA.goblinWave; n++) {
      let spot = freeSpot(s, rng);
      for (let k = 0; k < 20 && z && (spot[0] - z.tx) ** 2 + (spot[1] - z.ty) ** 2 > z.tr ** 2; k++) spot = freeSpot(s, rng);
      g.units.push(makeUnit(s, "goblin", 2, ...spot));
    }
  }
  const k = g.exits!.length;
  const at = PW_GIGA.exitAt[k];
  if (at === undefined || s.tick < at) return;
  const rng = createRng(deriveSeed(s.seed, "gigaExit", k));
  const z = pvpZone(s);
  let spot = freeSpot(s, rng);
  for (let n = 0; n < 50 && z && (spot[0] - z.tx) ** 2 + (spot[1] - z.ty) ** 2 > (z.tr * 0.8) ** 2; n++) spot = freeSpot(s, rng);
  g.exits!.push({ x: spot[0], y: spot[1] });
}

/** 이긴 자리 (남은 사람 하나, 나간 사람 빼고) · 아직이면 undefined */
export function gigaWinner(s: RunState): number | undefined {
  const pv = s.pvp!;
  const alive = pv.seats.flatMap((x, i) => (inPlay(s, i) ? [x.team] : []));
  if (alive.length > 1) return undefined;
  return alive[0] ?? -1;
}

/** AI: 제작 중이면 가만히 · 싸우는 중이 아니면 가까운 상자·배낭으로 가서 F · 재료가 모이면 제작 */
export function gigaSteer(s: RunState, input: TickInput): TickInput {
  if (!isGiga(s)) return input;
  const p = s.player;
  if (p.pwCraft) return { ...input, moveX: 0, moveY: 0, attack: false };
  const craft = LEGENDS.findIndex((id) => canCraft(s, id));
  if (craft >= 0 && !input.attack) gigaMenu(s, GIGA_MENU.craft + craft);
  if (input.attack) return input;
  const near = nearLoot(s, p.x, p.y);
  if (near) return { ...input, moveX: 0, moveY: 0, interact: s.tick % 10 === seatNo(s) % 10 };
  let best: PwLoot | undefined;
  let bd = 320 ** 2;
  for (const l of s.pvp!.grow!.loot!) {
    const d = (l.x - p.x) ** 2 + (l.y - p.y) ** 2;
    if (d < bd) [bd, best] = [d, l];
  }
  if (!best) return input;
  const dx = best.x - p.x;
  const dy = best.y - p.y;
  const len = Math.hypot(dx, dy) || 1;
  return { ...input, moveX: Math.round((dx / len) * 100), moveY: Math.round((dy / len) * 100) };
}
