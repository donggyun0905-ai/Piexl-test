// 연습장 방 시험 (누를 때마다 새 무작위): 지금 방을 상점·천상의 상점·여신의 선물·보물방·단련의 방·시련의 방·제단의 방·비밀의 방 셋(악마·도박꾼·경매장)·금 간 벽·쉼터로 바꿔 봄 (다시 누르면 새로 놓음, 기록·업적 없음)
import { LOOT_RULES, spawnTreasure } from "./loot";
import { spawnGolden } from "./golden";
import { spawnGym } from "./gym";
import { spawnTrial } from "./trial";
import { spawnAltar } from "./altar";
import { spawnShop } from "./shop";
import { healPlayer } from "./combat";
import { spawnVault } from "./vault";
import { SECRET_KINDS } from "../secretDefs";
import { ROOM_CY } from "../constants";
import { deriveSeed } from "../rng";
import type { RunState } from "./types";
import { spawnForge } from "./forge";
import { startHidden } from "./hiddenTrial";
import type { HiddenKind } from "./hiddenTrialTypes";
import { recalcStats } from "./items";
import { PLAIN_SHAPE } from "./layout";

/** 시험할 수 있는 방 (heaven = 천상의 상점 · golden = 여신의 선물) */
export const PRACTICE_ROOMS = ["shop", "heaven", "golden", "treasure", "gym", "trial", "altar", "devil", "gamble", "auction", "crack", "rest", "forge"] as const;
export type PracticeRoom = (typeof PRACTICE_ROOMS)[number];

/** 지금 방을 그 방으로: 바닥 물건을 새로 놓음 (상점은 돈을 한도까지 채워 줌 · 단련의 방은 기구를 다시 쓸 수 있음) */
export function practiceRoom(s: RunState, kind: PracticeRoom): void {
  const info = s.map.rooms[s.roomId];
  const st = s.rooms[s.roomId];
  if (!info || !st) return;
  practiceRoomOff(s);
  // 누를 때마다 새 시드: 성좌·악마의 거래·경매 상품·야바위·시련이 매번 무작위 (실제 판은 층·방마다 따로 시드라 원래 방마다 다름)
  s.seed = deriveSeed(s.seed, "practiceRoom", kind);
  info.type = kind === "heaven" ? "shop" : kind === "crack" ? "start" : kind;
  if (kind === "heaven") info.heaven = true;
  if (kind === "shop" || kind === "heaven") {
    s.gold = LOOT_RULES.MAX_GOLD;
    spawnShop(s, s.roomId);
  } else if (kind === "golden") spawnGolden(s, s.roomId);
  else if (kind === "treasure") spawnTreasure(s, s.roomId);
  else if (kind === "gym") {
    if (s.player.gym) s.player.gym.rooms = [];
    spawnGym(s, s.roomId);
  } else if (kind === "forge") {
    s.player.forgeFree = [];
    s.gold = Math.max(s.gold, LOOT_RULES.MAX_GOLD);
    spawnForge(s, s.roomId);
  } else if (kind === "altar") {
    // 제단을 다시 쓸 수 있게 (성좌는 방 번호 시드)
    if (s.player.altar) s.player.altar.rooms = [];
    spawnAltar(s, s.roomId);
  } else if (kind === "devil" || kind === "gamble" || kind === "auction") {
    // 다시 할 수 있게 (야바위는 방마다 한 번)
    if (s.player.gamble) s.player.gamble.rooms = [];
    spawnVault(s, kind, s.roomId);
  } else if (kind === "crack") {
    // 왼쪽 벽 가운데에 금 간 벽 (누를 때마다 악마 → 도박꾼 → 경매장 차례)
    const n = (SECRET_KINDS.indexOf(s.crack?.kind ?? "auction") + 1) % SECRET_KINDS.length;
    s.crack = { floor: s.floor, room: s.roomId, side: 0, pos: ROOM_CY, kind: SECRET_KINDS[n]! };
  } else if (kind === "trial") {
    // 비석을 다시 쓸 수 있게 (진행 중인 시련도 치움)
    if (s.player.trial) {
      s.player.trial.rooms = [];
      // 연습장은 한 판 합계 1000점 제한도 다시
      delete s.player.trial.total;
    }
    s.trialRun = undefined;
    s.enemies = [];
    spawnTrial(s, s.roomId);
  } else healPlayer(s, s.player.stats.maxHp);
}

/** 연습장 숨은 시련 (1 하이오크 부락 · 2 어둠의 세계 · 3 공성전 · 4 안개숲 · 5 죽음의 바다): 지금 방을 기둥 없는 방으로 바꾸고 바로 시작 */
export const PRACTICE_HIDDEN: readonly HiddenKind[] = [1, 2, 3, 4, 5];
export function practiceHidden(s: RunState, kind: HiddenKind): void {
  const info = s.map.rooms[s.roomId];
  if (!info) return;
  practiceRoomOff(s);
  s.seed = deriveSeed(s.seed, "practiceHidden", kind);
  info.type = "combat";
  info.shape = PLAIN_SHAPE;
  s.hidden = { floor: s.floor, room: s.roomId, kind, round: 0, t: 0, at: 0 };
  s.enemies = startHidden(s);
}

/** 보통 연습장 방으로 되돌림 (바닥 물건 치움 · 숨은 시련도 끝냄) */
export function practiceRoomOff(s: RunState): void {
  const info = s.map.rooms[s.roomId];
  const st = s.rooms[s.roomId];
  if (!info || !st) return;
  info.type = "start";
  delete info.heaven;
  s.trialRun = undefined;
  delete s.crack;
  st.pickups = [];
  if (s.hidden) {
    s.hidden = undefined;
    s.enemies = [];
    s.terrain = undefined;
    // 어둠의 세계가 줄인 사거리를 되돌림
    recalcStats(s);
  }
  s.prompt = { kind: "none" };
}
