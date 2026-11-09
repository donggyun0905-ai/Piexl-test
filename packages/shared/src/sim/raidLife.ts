// 레이드 방 생사: 데스 카운트 10 (쓰러지면 잠시 뒤 다시 살아남, 10번이면 그 사람은 끝 → 관전) · 모두 끝나면 실패
// 컷신 동안은 모두 멈추고 맞지 않음 · 루시퍼가 쓰러지면 승리 (보상 방은 4단계)
import { ROOM_CX as CX, ROOM_MAX_Y } from "../constants";
import { recalcStats } from "./items";
import { darkReturn } from "./lucDark";
import { lucCutting } from "./lucifer";
import { allPlayers, eachSeat } from "./party";
import { RAID_ROOM } from "./raidTypes";
import type { PlayerState, RunState } from "./types";
import { addEffect } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 데스 카운트 · 다시 살아나기까지 틱 · 살아난 뒤 무적 틱 */
  LIVES: 10,
  RESPAWN: 180,
  INVULN: 120,
};
export { R as RAID_LIFE_RULES };

/** 레이드 방 싸움 중인지 */
export const raidFighting = (s: RunState) => !!s.raidBoss && s.roomId === RAID_ROOM.boss;
/** 이 사람은 데스 카운트를 다 써서 끝 (관전) */
export const raidOut = (p: PlayerState) => (p.raidDeaths ?? 0) >= R.LIVES;
/** 아직 다시 살아날 사람이 있는지 (모두 쓰러져도 판이 끝나지 않게) */
export const raidLivesLeft = (s: RunState) => raidFighting(s) && allPlayers(s).some((p) => !raidOut(p));
export const RAID_LIVES = R.LIVES;

/** 한 틱 뒤 (sim/partyRun): 쓰러짐·다시 살아남 · 어둠의 세계에서 돌아옴 · 컷신 무적 · 승패 */
export function raidAfter(s: RunState): void {
  if (!raidFighting(s)) return;
  const cut = lucCutting(s);
  eachSeat(s, () => {
    const p = s.player;
    if (cut) p.invulnTicks = Math.max(p.invulnTicks, 2);
    if (p.hp > 0) return;
    if (p.raidDownAt === undefined) {
      p.raidDownAt = s.tick;
      p.raidDeaths = (p.raidDeaths ?? 0) + 1;
      p.raidDark = false;
      recalcStats(s);
    }
    if (raidOut(p) || s.tick - p.raidDownAt < R.RESPAWN) return;
    p.raidDownAt = undefined;
    p.hp = p.stats.maxHp;
    p.x = p.prevX = CX;
    p.y = p.prevY = ROOM_MAX_Y - 30;
    p.invulnTicks = R.INVULN;
    addEffect(s, { kind: "burst", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 20, maxTicks: 20 });
  });
  darkReturn(s);
  // 루시퍼가 쓰러짐 → 승리 · 모두 데스 카운트를 다 씀 → 실패
  if (!s.enemies.some((e) => e.kind === "lucifer" && e.hp > 0)) {
    s.won = true;
    s.over = true;
  } else if (!allPlayers(s).some((p) => p.hp > 0 || !raidOut(p))) s.over = true;
}
