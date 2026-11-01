// 여신의 선물 (라스트 보스 층, 방 종류 golden): 아이템 9개를 공짜로 늘어놓고 그중 3개만 가질 수 있음 (다 고르면 나머지는 사라짐)
import { PASSIVES, type PassiveDef } from "../items";
import { createRng, deriveSeed } from "../rng";
import { addPickup, CX, CY, goldClubBonus, passivePool, seatSalt, usePool } from "./loot";
import type { RunState } from "./types";

/** 고르는 아이템 묶음 번호 · 고를 수 있는 수 */
export const GOLDEN_GROUP = 900;
export const GOLDEN_PICKS = 3;

export function spawnGolden(s: RunState, roomId: number): void {
  const rng = createRng(deriveSeed(s.seed, "floor", s.floor, "room", roomId, "golden", ...seatSalt(s)));
  const all = [...passivePool(s)];
  let pool = all;
  // 금봉: 여신의 선물에 들어오면 체력 가득 + 돈, 진열은 패시브 6개 + 사용 아이템 3개 (사용 아이템은 따로 가짐)
  const gold = goldClubBonus(s);
  for (let i = 0; i < 9 && all.length > 0; i++) {
    const at: [number, number] = [CX - 40 + (i % 3) * 40, CY - 36 + Math.floor(i / 3) * 24];
    if (gold && i >= 6) {
      addPickup(s, roomId, "use", rng.pick(usePool(s)), at[0], at[1], 0);
      continue;
    }
    // 얻을 수 있는 종류가 9개보다 적으면 (해금이 적거나 풋내기·변희) 겹쳐 가질 수 있는 것으로 다시 채워 늘 9칸
    if (!pool.length) pool = all.filter((x) => !(PASSIVES[x] as PassiveDef).effect);
    if (!pool.length) pool = all;
    const id = pool[rng.int(0, pool.length - 1)]!;
    pool = pool.filter((x) => x !== id);
    addPickup(s, roomId, "passive", id, at[0], at[1], GOLDEN_GROUP);
  }
  s.goldenPicks = 0;
}
