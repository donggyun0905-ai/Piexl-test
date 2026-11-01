// 연습장 방 시험: 지금 방을 상점·천상의 상점·여신의 선물·보물방·단련의 방·쉼터로 바꿔 봄 (다시 누르면 새로 놓음, 기록·업적 없음)
import { LOOT_RULES, spawnGolden, spawnTreasure } from "./loot";
import { spawnGym } from "./gym";
import { spawnShop } from "./shop";
import { healPlayer } from "./combat";
import type { RunState } from "./types";

/** 시험할 수 있는 방 (heaven = 천상의 상점 · golden = 여신의 선물) */
export const PRACTICE_ROOMS = ["shop", "heaven", "golden", "treasure", "gym", "rest"] as const;
export type PracticeRoom = (typeof PRACTICE_ROOMS)[number];

/** 지금 방을 그 방으로: 바닥 물건을 새로 놓음 (상점은 돈을 한도까지 채워 줌 · 단련의 방은 기구를 다시 쓸 수 있음) */
export function practiceRoom(s: RunState, kind: PracticeRoom): void {
  const info = s.map.rooms[s.roomId];
  const st = s.rooms[s.roomId];
  if (!info || !st) return;
  practiceRoomOff(s);
  info.type = kind === "heaven" ? "shop" : kind;
  if (kind === "heaven") info.heaven = true;
  if (kind === "shop" || kind === "heaven") {
    s.gold = LOOT_RULES.MAX_GOLD;
    spawnShop(s, s.roomId);
  } else if (kind === "golden") spawnGolden(s, s.roomId);
  else if (kind === "treasure") spawnTreasure(s, s.roomId);
  else if (kind === "gym") {
    if (s.player.gym) s.player.gym.rooms = [];
    spawnGym(s, s.roomId);
  } else healPlayer(s, s.player.stats.maxHp);
}

/** 보통 연습장 방으로 되돌림 (바닥 물건 치움) */
export function practiceRoomOff(s: RunState): void {
  const info = s.map.rooms[s.roomId];
  const st = s.rooms[s.roomId];
  if (!info || !st) return;
  info.type = "start";
  delete info.heaven;
  st.pickups = [];
  s.prompt = { kind: "none" };
}
