// 특별한 방 공용: 층 지도에 놓기 · 처음 들어갈 때 물건 놓기 · 나갈 수 없는 방 (단련의 방 sim/gym · 시련의 방 sim/trial · 제단의 방 sim/altar)
import { noirBlocksRoom } from "./nrAdapt";
import type { Rng } from "../rng";
import type { RoomInfo, RoomType } from "./floor";
import { spawnGym } from "./gym";
import { spawnTrial, trialBusy, TRIAL_RULES } from "./trial";
import { altarPending, spawnAltar } from "./altar";
import { spawnVault } from "./vault";
import { spawnForge } from "./forge";
import { hiddenBusy } from "./hiddenFoes";
import type { RunState } from "./types";

export const trialFloor = (floor: number) => floor >= TRIAL_RULES.FROM_FLOOR;

/** 시련 중 · 아직 카드를 고르지 않은 제단: 방이 잠기고 잠긴 출구로도 못 나감 (rooms.checkCleared·updateRoom) */
export const roomLocked = (s: RunState) => trialBusy(s) || altarPending(s) || hiddenBusy(s);

/** 특별한 방 하나: 가운데 칸(2칸째 ~ 쉼터 앞) 중 아무 칸의 전투방 하나 (그 칸에 전투방이 없으면 다른 칸) */
export function setSpecial(byLayer: RoomInfo[][], rng: Rng, middle: number, type: RoomType): void {
  const layers = Array.from({ length: Math.max(1, middle - 2) }, (_, i) => i + 2);
  const start = rng.int(0, layers.length - 1);
  for (let k = 0; k < layers.length; k++) {
    const free = byLayer[layers[(start + k) % layers.length]!]!.filter((r) => r.type === "combat");
    if (free.length > 0) {
      rng.pick(free).type = type;
      return;
    }
  }
}

/** 처음 들어간 방에 물건 놓기 (협동은 사람마다) */
export function spawnSpecialRoom(s: RunState, type: RoomType, roomId: number): void {
  // 느아르 제약: 대장장이·성좌의 방은 쓸 수 없음 (빈 방)
  if (noirBlocksRoom(s, type)) return;
  if (type === "gym") spawnGym(s, roomId);
  else if (type === "trial") spawnTrial(s, roomId);
  else if (type === "altar") spawnAltar(s, roomId);
  else if (type === "forge") spawnForge(s, roomId);
  // 비밀의 방·전투방 금 간 벽 (sim/vault)
  else spawnVault(s, type, roomId);
}
