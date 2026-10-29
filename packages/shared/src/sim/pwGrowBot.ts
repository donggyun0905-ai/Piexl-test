// 패왕전 성장 대결 AI: 집에서 장보기(자리마다 정한 전설 장비 하나씩, 재료부터) · 체력이 낮으면 집으로 · 상대가 안 보이면 길을 따라 앞쪽 목표로
// (상대 포탑 앞 것 → 쟁탈전 가운데 → 상대 집) · 무작위는 판 시드로만
import { TILE_SIZE } from "../constants";
import { PW_MODE } from "../paewangDefs";
import { PW_ARENAS } from "../paewangMaps";
import { PW_BASIC, PW_LEGEND, PW_SHOP_IDS } from "../pwShop";
import { distanceField, walkToward } from "./layout";
import { pwGrid } from "./paewangGrid";
import { eachSeat, seatNo } from "./party";
import { inPlay } from "./pvpWorld";
import { capCenter } from "./pwCapture";
import { atHome, buyPlan, GROW_MENU, growMenu, homeOf, isGrow } from "./pwGrow";
import type { RunState, TickInput } from "./types";

/** 자리마다 차례로 사는 전설 장비 */
const BUILDS = [
  ["relicRed", "godShard", "fateDice"],
  ["relicBlue", "cupidSpirit", "ifritClaw"],
  ["relicSilver", "gnomeHammer", "blizzardLance"],
  ["relicGold", "crumblingCrown", "sylphQuiver"],
  ["relicWhite", "aphroditeMirror", "dryadOrb"],
  ["relicPrism", "forbiddenScroll", "dimensionGate"],
];

/** 다음에 살 것: 사용 아이템 칸이 비면 회복약 · 목표 전설의 모자란 재료 → 전설 */
function nextBuy(s: RunState, i: number): string | undefined {
  const p = s.player;
  if (p.useSlots.includes(null) && s.gold >= 300) return "potion";
  const build = BUILDS[i % BUILDS.length]!;
  const goal = build.find((id) => !p.pwGear?.includes(id));
  if (!goal) return undefined;
  const need = Object.entries(PW_LEGEND[goal]!.need ?? {});
  const have = [...(p.pwGear ?? [])];
  for (const [m, n] of need) {
    for (let k = 0; k < n; k++) {
      const at = have.indexOf(m);
      if (at >= 0) have.splice(at, 1);
      else return PW_BASIC[m] && s.gold >= PW_BASIC[m].cost ? m : undefined;
    }
  }
  return goal;
}

/** AI 장보기 (집에 있을 때 0.5초마다, 살 수 있는 만큼) */
export function botShop(s: RunState): void {
  if (s.tick % 30 !== 0) return;
  eachSeat(s, (i) => {
    if (s.pvp!.seats[i]!.human || !inPlay(s, i) || !atHome(s, i)) return;
    for (let n = 0; n < 6; n++) {
      const id = nextBuy(s, i);
      const plan = id && buyPlan(s, id);
      if (!id || !plan || s.gold < plan.cost) return;
      growMenu(s, GROW_MENU.buy + PW_SHOP_IDS.indexOf(id));
    }
  });
}

const fields = new Map<string, Int16Array>();

function walk(s: RunState, input: TickInput, x: number, y: number): TickInput {
  const id = s.pvp!.arena;
  const key = `${id}:${Math.floor(x / TILE_SIZE)},${Math.floor(y / TILE_SIZE)}`;
  let f = fields.get(key);
  if (!f) fields.set(key, (f = distanceField(pwGrid(id), x, y)));
  const d = walkToward(pwGrid(id), f, s.player, x, y);
  return d ? { ...input, moveX: Math.round(d[0] * 100), moveY: Math.round(d[1] * 100) } : input;
}

/** 지금 갈 목표: 상대 포탑(앞 것부터) → 가운데(쟁탈전, 아직 안 가졌으면) → 상대 집 */
function objective(s: RunState, team: number): [number, number] {
  const pv = s.pvp!;
  const g = pv.grow!;
  const tower = g.units.filter((u) => u.kind === "tower" && u.team !== team && u.body.hp > 0).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0];
  if (tower) return [tower.body.x, tower.body.y];
  if (PW_MODE[pv.mode].rule === "contest" && g.owner !== team) return capCenter(PW_ARENAS[pv.arena]);
  return homeOf(s, 1 - team);
}

/** AI 입력 다듬기 (성장 대결) */
export function growSteer(s: RunState, input: TickInput): TickInput {
  if (!isGrow(s)) return input;
  const i = seatNo(s);
  const p = s.player;
  const team = s.pvp!.seats[i]!.team;
  const home = homeOf(s, team);
  const low = p.hp < p.stats.maxHp * 0.3;
  // 집에서 회복 중이면 거의 다 찰 때까지 머묾
  if (atHome(s, i) && p.hp < p.stats.maxHp * 0.9) return { ...input, moveX: 0, moveY: 0 };
  if (low) return walk(s, input, ...home);
  if (input.attack) return input;
  return walk(s, input, ...objective(s, team));
}
