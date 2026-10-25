// 레이드 아레나: 최종 보스 레벨 보상 방의 출구마다 그 너머 최종 보스 이름
import { EXIT_X, LAST_BOSSES, ROOM_MIN_Y, type LastBossKind, type RunState } from "@pixel-rogue/shared";

export function drawArenaLabels(ctx: CanvasRenderingContext2D, s: RunState, bossName: (kind: string) => string): void {
  if (!s.arenaLv || s.roomId !== s.map.startId) return;
  const exits = s.map.rooms[s.roomId]?.exits ?? [];
  ctx.font = "bold 7px sans-serif";
  ctx.textAlign = "center";
  exits.forEach((to, lane) => {
    const kind = s.arenaRooms?.[to]?.[0];
    if (to < 0 || !kind || !LAST_BOSSES.includes(kind as LastBossKind)) return;
    const x = EXIT_X[lane]!;
    const y = ROOM_MIN_Y + 12;
    const name = bossName(kind);
    const w = ctx.measureText(name).width + 6;
    ctx.fillStyle = "rgba(20, 10, 30, 0.8)";
    ctx.fillRect(x - w / 2, y - 7, w, 10);
    ctx.fillStyle = "#ffd76a";
    ctx.fillText(name, x, y);
  });
}
