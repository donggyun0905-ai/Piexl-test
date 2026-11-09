// 레이드 보상 방 (루시퍼를 쓰러뜨린 뒤): 모두 살아나 화려한 방으로 · 가운데 큰 상자를 때려서 열면 모두에게 "축하합니다!" (보상은 아직 준비 중)
// 상자가 열리고 잠시 뒤 레이드 승리로 끝남
import { ROOM_CX as CX, ROOM_CY as CY } from "../constants";
import { recalcStats } from "./items";
import { lucFight } from "./lucKit";
import { eachSeat } from "./party";
import { RAID_ROOM } from "./raidTypes";
import { warpRoom } from "./rooms";
import type { EnemyState, RunState } from "./types";
import { addEffect, makeEnemy } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 상자가 열리고 끝날 때까지 틱 (축하 창을 보는 시간) */
  END: 480,
};
export { R as RAID_REWARD_RULES };

/** 보상 방에 처음 들어갈 때: 가운데 큰 상자 */
export function spawnChest(s: RunState): EnemyState[] {
  return [makeEnemy(s, "lucchest", CX, CY - 6, 1, 0)];
}

/** 루시퍼가 쓰러짐: 모두 살아나고 상태이상을 풀고 보상 방으로 */
export function goReward(s: RunState): void {
  eachSeat(s, () => {
    const p = s.player;
    p.raidDark = false;
    p.raidDownAt = undefined;
    p.raidWing = false;
    p.chains = [];
    p.chainTicks = 0;
    p.dbStun = p.dbSlow = p.dbBurn = 0;
    p.poison = 0;
    p.raidCut = 0;
    recalcStats(s);
    p.hp = p.stats.maxHp;
  });
  // 싸움 효과·장판·날개·돌기둥을 모두 치움 (보상 방에 남지 않게)
  s.hazards = [];
  s.projectiles = [];
  s.effects = [];
  const f = lucFight(s);
  Object.assign(f, { waves: [], mines: [], crowns: [], xs: [], orbs: [], vines: [], wings: undefined, dark: undefined, dome: undefined, safe: undefined, slashAt: undefined, covers: undefined, p2: undefined });
  warpRoom(s, RAID_ROOM.reward);
}

/** 보상 방 틱: 상자가 부서지면 열림 → 잠시 뒤 승리 */
export function rewardTick(s: RunState): void {
  const f = lucFight(s);
  if (f.opened === undefined && !s.enemies.some((e) => e.kind === "lucchest" && e.hp > 0)) {
    f.opened = s.tick;
    addEffect(s, { kind: "lucFx", from: "chestOpen", x: CX, y: CY - 6, dirX: 0, dirY: 0, size: 120, maxTicks: 90, foe: true });
  }
  if (f.opened !== undefined && s.tick >= f.opened + R.END) {
    s.won = true;
    s.over = true;
  }
}
