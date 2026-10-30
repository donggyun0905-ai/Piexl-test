// 기간토마키아 건물 (paewangMapsGigaRooms): 문·계단에서 F로 옮겨 감 · 실내 상자(더 좋음) · AI가 건물에 들어가 파밍하고, 다 털었거나 자기장이 오면 나옴 · AI 도망
import { TILE_SIZE } from "../constants";
import { PW_ARENAS } from "../paewangMaps";
import { PW_GIGA } from "../pwRules";
import { PW_BASIC, PW_LEGEND, PW_SHOP_USES } from "../pwShop";
import { createRng, deriveSeed } from "../rng";
import { spotXY } from "./paewangGrid";
import { allPlayers, seatNo } from "./party";
import { pvpZone, zonePos } from "./pvpZone";
import { growWalk } from "./pwGrowBot";
import type { PwLoot } from "./pwGrowTypes";
import type { RunState, TickInput } from "./types";
import { addEffect } from "./util";

type Portal = NonNullable<(typeof PW_ARENAS)["gGiga"]["portals"]>[number];

/** (x, y)가 몇 번 건물 안인지 (들판이면 -1) */
export function buildingAt(s: RunState, x: number, y: number): number {
  const a = PW_ARENAS[s.pvp!.arena];
  if (!a.outCols || x < a.outCols * TILE_SIZE) return -1;
  const [c, r] = [x / TILE_SIZE, y / TILE_SIZE];
  return (a.buildings ?? []).findIndex((b) => b.inside.some(([x0, y0, w, h]) => c >= x0 && c < x0 + w && r >= y0 && r < y0 + h));
}

/** 닿는 거리 안의 문·계단 */
export function nearDoor(s: RunState, x: number, y: number): Portal | undefined {
  return PW_ARENAS[s.pvp!.arena].portals?.find((d) => {
    const [dx, dy] = spotXY(d.at);
    return (dx - x) ** 2 + (dy - y) ** 2 <= PW_GIGA.reach ** 2;
  });
}

/** F: 문·계단이면 그쪽으로 옮겨 감 (처리했으면 true) */
export function useDoor(s: RunState): boolean {
  const p = s.player;
  const d = nearDoor(s, p.x, p.y);
  if (!d) return false;
  [p.x, p.y] = spotXY(d.to);
  [p.prevX, p.prevY] = [p.x, p.y];
  p.pwOpen = undefined;
  addEffect(s, { kind: "burst", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 18, maxTicks: 14 });
  return true;
}

/** 실내 상자 (건물마다 자리, 더 좋은 것) */
export function roomChests(s: RunState): PwLoot[] {
  const c = PW_GIGA.inChest;
  const uses = Object.keys(PW_SHOP_USES);
  const basics = Object.keys(PW_BASIC);
  const legends = Object.keys(PW_LEGEND);
  return (PW_ARENAS[s.pvp!.arena].buildings ?? []).flatMap((b, k) =>
    b.chests.map((at, n) => {
      const rng = createRng(deriveSeed(s.seed, "gigaRoom", k, n));
      const items: string[] = [];
      if (rng.nextFloat() < c.gear) items.push(rng.nextFloat() < c.legend ? rng.pick(legends) : rng.pick(basics));
      if (rng.nextFloat() < c.use) items.push(`u:${rng.pick(uses)}`);
      if (rng.nextFloat() < c.goods) items.push(rng.pick(PW_GIGA.goods));
      const [x, y] = spotXY(at);
      return { id: s.nextId++, x, y, chest: true, gold: rng.int(c.gold[0]!, c.gold[1]!), items };
    }),
  );
}

/** 건물 k 안에 남은 상자·배낭 수 */
const lootIn = (s: RunState, k: number) => (s.pvp!.grow!.loot ?? []).filter((l) => buildingAt(s, l.x, l.y) === k).length;

/** 자기장 밖이거나 곧 밖이 될 자리인지 */
function zoneBad(s: RunState, x: number, y: number): boolean {
  const z = pvpZone(s);
  if (!z) return false;
  const [px, py] = zonePos(s, x, y);
  return Math.hypot(px - z.x, py - z.y) > z.r - 12 || (z.r - z.tr > 1 && Math.hypot(px - z.tx, py - z.ty) > z.tr - 12);
}

const press = (s: RunState, input: TickInput): TickInput => ({ ...input, moveX: 0, moveY: 0, interact: s.tick % 10 === seatNo(s) % 10 });

/** AI 건물: 안에서는 상자를 찾아 걷고(칸막이를 돌아감), 다 털었거나 자기장이 오면 나감 · 밖에서는 가까운 털 것 남은 건물 문으로 (null = 다른 할 일) */
export function roomSteer(s: RunState, input: TickInput, nearLootFar: boolean): TickInput | null {
  const p = s.player;
  const a = PW_ARENAS[s.pvp!.arena];
  const k = buildingAt(s, p.x, p.y);
  const door = nearDoor(s, p.x, p.y);
  if (k >= 0) {
    const out = lootIn(s, k) === 0 || zoneBad(s, p.x, p.y);
    if (!out) {
      const l = (s.pvp!.grow!.loot ?? []).filter((x) => buildingAt(s, x.x, x.y) === k).sort((x, y) => (x.x - p.x) ** 2 + (x.y - p.y) ** 2 - ((y.x - p.x) ** 2 + (y.y - p.y) ** 2))[0]!;
      return growWalk(s, input, l.x, l.y);
    }
    // 나가는 쪽 문: 위층이면 그 층의 내려가는 계단, 1층이면 나가는 문
    if (door && (door.kind === "out" || door.kind === "down")) return press(s, input);
    const floor = floorOf(a, k, p);
    const go = (a.portals ?? []).find((d) => d.b === k && (floor > 0 ? d.kind === "down" && floorOf(a, k, { x: spotXY(d.at)[0], y: spotXY(d.at)[1] }) === floor : d.kind === "out"));
    return go ? growWalk(s, input, ...spotXY(go.at)) : input;
  }
  if (nearLootFar) return null;
  // 밖: 털 것 남은 가까운 건물 (자기장 안, 300px 안)
  let best: Portal | undefined;
  let bd = 300 ** 2;
  for (const d of a.portals ?? []) {
    if (d.kind !== "in") continue;
    const [dx, dy] = spotXY(d.at);
    const dd = (dx - p.x) ** 2 + (dy - p.y) ** 2;
    if (dd < bd && lootIn(s, d.b) > 0 && !zoneBad(s, dx, dy)) [best, bd] = [d, dd];
  }
  if (!best) return null;
  if (door === best) return press(s, input);
  // 들판은 거의 트여 있어 곧장 걸어감
  const [tx, ty] = spotXY(best.at);
  const len = Math.hypot(tx - p.x, ty - p.y) || 1;
  return { ...input, moveX: Math.round(((tx - p.x) / len) * 100), moveY: Math.round(((ty - p.y) / len) * 100) };
}

/** 건물 k에서 (x, y)가 있는 층 번호 */
function floorOf(a: (typeof PW_ARENAS)["gGiga"], k: number, q: { x: number; y: number }): number {
  const [c, r] = [q.x / TILE_SIZE, q.y / TILE_SIZE];
  return a.buildings![k]!.inside.findIndex(([x0, y0, w, h]) => c >= x0 && c < x0 + w && r >= y0 && r < y0 + h);
}

/** AI 도망: 내 체력이 낮으면 가까운 적(상대 캐릭터·거인·도깨비 모두), 아니면 레벨이 꽤 높은 상대 캐릭터에게서 반대쪽으로 (대시도) · 없으면 null */
export function gigaFlee(s: RunState, input: TickInput): TickInput | null {
  const p = s.player;
  const pv = s.pvp!;
  const players = allPlayers(s);
  const low = p.hp < p.stats.maxHp * PW_GIGA.botFlee;
  let foe: { x: number; y: number } | undefined;
  let fd = PW_GIGA.botSight ** 2;
  for (const e of s.enemies) {
    const j = pv.proxies.indexOf(e);
    if (e.hp <= 0 || e.pwHid) continue;
    const d = (e.x - p.x) ** 2 + (e.y - p.y) ** 2;
    const strong = j >= 0 && (players[j]!.pwLv ?? 1) >= (p.pwLv ?? 1) + PW_GIGA.botFleeLv;
    if (d < fd && (low || strong)) [foe, fd] = [e, d];
  }
  if (!foe) return null;
  const len = Math.hypot(p.x - foe.x, p.y - foe.y) || 1;
  return { ...input, moveX: Math.round(((p.x - foe.x) / len) * 100), moveY: Math.round(((p.y - foe.y) / len) * 100), attack: false, dash: s.tick % 45 === seatNo(s) % 45 };
}
