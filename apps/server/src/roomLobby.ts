// 협동 방: 끝난 판에서 모두 대기실로 (roomLogic이 부름). 나간 사람은 빠지고, 관전하던 사람은 자리가 있으면 같이
import type { RoomData } from "./roomLogic";

export function backToLobby(d: RoomData, max: number): void {
  d.phase = "lobby";
  d.players = d.players.filter((p) => p.connected);
  d.players.forEach((p, i) => {
    p.state = i < max ? "alive" : "watch";
    p.finishedAt = 0;
  });
  if (!d.players.some((p) => p.pid === d.hostPid)) d.hostPid = d.players[0]?.pid ?? "";
}
