// 기간토마키아 AI 이동: 제작 · 도망 · 쓸 수 있는 상자·배낭 줍기 · 건물 털기(pwGigaRooms) · 할 일이 없으면 돌아다님 · 벽은 비켜 감(botAvoid)
import { PW_GIGA } from "../pwRules";
import { PW_LEGEND } from "../pwShop";
import { createRng, deriveSeed } from "../rng";
import { avoidWalls } from "./botAvoid";
import { pwGrid } from "./paewangGrid";
import { seatNo } from "./party";
import { pvpZone } from "./pvpZone";
import { canCraft, GIGA_MENU, gigaMenu, isGiga } from "./pwGiga";
import { buildingAt, gigaFlee, roomSteer } from "./pwGigaRooms";
import type { PwLoot } from "./pwGrowTypes";
import type { RunState, TickInput } from "./types";

const LEGENDS = Object.keys(PW_LEGEND);

/** 할 일이 없는 AI: 자기장 가운데 둘레의 자리마다 다른 곳으로 (10초마다 바뀜) */
function roam(s: RunState, input: TickInput): TickInput {
  const p = s.player;
  const z = pvpZone(s);
  const rng = createRng(deriveSeed(s.seed, "gigaRoam", seatNo(s), Math.floor(s.tick / 600)));
  const [cx, cy] = z ? [z.tx, z.ty] : [PW_GIGA.cols * 8, PW_GIGA.rows * 8];
  const r = z ? z.tr * 0.6 : 600;
  const tx = cx + (rng.nextFloat() * 2 - 1) * r;
  const ty = cy + (rng.nextFloat() * 2 - 1) * r;
  const len = Math.hypot(tx - p.x, ty - p.y);
  if (len < 24) return input;
  return { ...input, moveX: Math.round(((tx - p.x) / len) * 100), moveY: Math.round(((ty - p.y) / len) * 100) };
}

/** AI 이동 (벽은 비켜 감, sim/botAvoid) */
export function gigaSteer(s: RunState, input: TickInput): TickInput {
  if (!isGiga(s)) return input;
  return avoidWalls(pwGrid(s.pvp!.arena), s.player, s.tick, steer(s, input), seatNo(s) % 2 ? 1 : -1);
}

/** AI: 제작 중이면 가만히 · 약하면 도망 · 싸우는 중이 아니면 가까운 상자·배낭으로 가서 F (건물 안·가까운 건물은 pwGigaRooms) · 할 일이 없으면 먼 상자로 (다섯에 하나는 버팀) · 재료가 모이면 제작 */
function steer(s: RunState, input: TickInput): TickInput {
  const p = s.player;
  if (p.pwCraft) return { ...input, moveX: 0, moveY: 0, attack: false };
  const craft = LEGENDS.findIndex((id) => canCraft(s, id));
  if (craft >= 0 && !input.attack) gigaMenu(s, GIGA_MENU.craft + craft);
  const flee = gigaFlee(s, input);
  if (flee) return flee;
  if (input.attack) return input;
  // 담을 수 없는 물건(배낭 가득)은 지나침 · 돈은 늘 주움
  const full = (p.pwBag?.length ?? 0) >= PW_GIGA.bag - 1;
  const slot = p.useSlots.includes(null);
  const useful = (l: PwLoot) => l.gold > 0 || (!full && l.items.length > 0) || (slot && l.items.some((id) => id.startsWith("u:")));
  const reach = PW_GIGA.reach ** 2;
  const near = s.pvp!.grow!.loot!.find((l) => (l.x - p.x) ** 2 + (l.y - p.y) ** 2 <= reach && useful(l));
  if (near) return { ...input, moveX: 0, moveY: 0, interact: s.tick % 10 === seatNo(s) % 10 };
  const room = roomSteer(s, input, s.pvp!.grow!.loot!.some((l) => (l.x - p.x) ** 2 + (l.y - p.y) ** 2 < 160 ** 2 && buildingAt(s, l.x, l.y) < 0 && useful(l)), full);
  if (room) return room;
  let best: PwLoot | undefined;
  const idle = !input.moveX && !input.moveY && seatNo(s) % 5 !== 0;
  let bd = idle ? Infinity : 320 ** 2;
  for (const l of s.pvp!.grow!.loot!) {
    if (buildingAt(s, l.x, l.y) >= 0 || !useful(l)) continue; // 건물 안 것은 문으로 (roomSteer)
    const d = (l.x - p.x) ** 2 + (l.y - p.y) ** 2;
    if (d < bd) [bd, best] = [d, l];
  }
  if (!best && idle) return roam(s, input);
  if (!best) return input;
  const dx = best.x - p.x;
  const dy = best.y - p.y;
  const len = Math.hypot(dx, dy) || 1;
  return { ...input, moveX: Math.round((dx / len) * 100), moveY: Math.round((dy / len) * 100) };
}
