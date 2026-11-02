// 특별한 방 공용: 층 지도에 놓기 · 처음 들어갈 때 물건 놓기 (단련의 방 sim/gym · 시련의 방 sim/trial)
import type { Rng } from "../rng";
import type { RoomInfo, RoomType } from "./floor";
import { spawnGym } from "./gym";
import { spawnTrial, TRIAL_RULES } from "./trial";
export { trialBusy } from "./trial";
import type { RunState } from "./types";

export const trialFloor = (floor: number) => floor >= TRIAL_RULES.FROM_FLOOR;

/** 시련의 방: 가운데 칸(2칸째 ~ 쉼터 앞) 중 아무 칸의 전투방 하나 (그 칸에 전투방이 없으면 다른 칸) */
export function setTrial(byLayer: RoomInfo[][], rng: Rng, middle: number): void {
  const layers = Array.from({ length: Math.max(1, middle - 2) }, (_, i) => i + 2);
  const start = rng.int(0, layers.length - 1);
  for (let k = 0; k < layers.length; k++) {
    const free = byLayer[layers[(start + k) % layers.length]!]!.filter((r) => r.type === "combat");
    if (free.length > 0) {
      rng.pick(free).type = "trial";
      return;
    }
  }
}

/** 처음 들어간 방에 물건 놓기 (협동은 사람마다) */
export function spawnSpecialRoom(s: RunState, type: RoomType, roomId: number): void {
  if (type === "gym") spawnGym(s, roomId);
  else if (type === "trial") spawnTrial(s, roomId);
}
