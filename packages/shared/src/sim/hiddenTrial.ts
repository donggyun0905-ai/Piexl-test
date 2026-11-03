// 숨은 시련: 4층부터 층마다 보통 전투방 하나가 몰래 시련이 됨 (지도에는 보통 방처럼 보임, 들어가면 방이 잠기고 다섯 중 하나가 시작)
// 1 우거진 하이오크 부락: 체력·공격력이 오른 하이오크 3라운드, 마지막 라운드는 공격 주기가 빠른 정예
// 2 어둠의 세계: 사거리가 단검만큼 짧아지고 깜깜함(가끔 1.5초 풀림), 그림자 3라운드, 마지막 라운드 그림자는 한 방이 아주 셈(체력은 그대로)
// 3 공성전 · 4 안개숲 (sim/hiddenForts) · 5 죽음의 바다 (sim/hiddenSea). 깨면 보통 방 정리 보상 + 패시브 셋 중 하나
import { ROOM_CX, ROOM_CY } from "../constants";
import { ENEMIES } from "../enemyDefs";
import { createRng, deriveSeed } from "../rng";
import { depth, lastFloorOf } from "./hero";
import { fogTick, siegeTick, startFog, startSiege } from "./hiddenForts";
import { hiddenOn, hNote, hSpawn } from "./hiddenKit";
import { seaTick, startSea } from "./hiddenSea";
import type { HiddenKind, HiddenTrialState } from "./hiddenTrialTypes";
import { recalcStats } from "./items";
import { PLAIN_SHAPE } from "./layout";
import { addPickup, passivePool, pickDistinct } from "./loot";
import { pilgrimRoom } from "./pilgrim";
import { spot } from "./trialRun";
import type { EnemyState, RunState } from "./types";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 이 층부터 숨은 시련이 나옴 (층마다 하나) */
  FROM_FLOOR: 4,
  /** 다음 라운드까지 틱 */
  ROUND_GAP: 60,
  /** 하이오크: 한 라운드 수(+깊이 절반) · 체력 배율 · 마지막 라운드 정예 수 · 정예 몸 크기 (주는 피해는 hiddenFoes) */
  ORC_N: 5,
  ORC_HP: 1.5,
  ORC_ELITE: 5,
  ORC_ELITE_SIZE: 1.25,
  /** 어둠: 그림자 수(+깊이 절반) · 암흑이 풀리는 주기(틱) · 풀린 동안(1.5초) (사거리 상한·마지막 라운드 피해는 hiddenFoes) */
  DARK_N: 7,
  FLICK_EVERY: 360,
  FLICK_LIFT: 90,
};
export { R as HIDDEN_RULES };

/** 층 시작 (rooms.startFloor): 이 층의 숨은 시련 방·종류 (보통 던전·무한·일일, 혼자 할 때만) */
export function pickHidden(s: RunState): void {
  s.hidden = undefined;
  if (s.floor < R.FROM_FLOOR || s.arenaLv || s.hero || s.pvp || s.swarm || s.party || (s.lastBoss && s.floor >= lastFloorOf(s))) return;
  const pil = pilgrimRoom(s);
  const free = s.map.rooms.filter((r) => r.type === "combat" && r.id !== s.map.startId && r.id !== pil);
  if (!free.length) return;
  const rng = createRng(deriveSeed(s.seed, "hidden", s.floor));
  const room = rng.pick(free);
  // 구조물·물·안개가 들어가게 기둥 없는 방
  room.shape = PLAIN_SHAPE;
  s.hidden = { floor: s.floor, room: room.id, kind: rng.int(1, 5) as HiddenKind, round: 0, t: 0, at: 0 };
}

/** 이 방이 아직 시작하지 않은 숨은 시련 방인지 (rooms.enterRoom) */
export const hiddenAt = (s: RunState, roomId: number) => !!s.hidden && !s.hidden.on && s.hidden.room === roomId && s.hidden.floor === s.floor;

/** 하이오크·그림자 한 라운드 */
function roundFoes(s: RunState, h: HiddenTrialState, into: EnemyState[]): void {
  const d = depth(s);
  const rng = createRng(deriveSeed(s.seed, "hiddenFoes", s.floor, h.round));
  const orc = h.kind === 1;
  const last = h.round >= 3;
  const kind = orc ? "highorc" : "lurker";
  const n = orc ? (last ? R.ORC_ELITE : R.ORC_N + Math.floor(d / 2)) : R.DARK_N + Math.floor(d / 2);
  for (let i = 0; i < n; i++) {
    const e = hSpawn(s, kind, ...spot(s, rng, ENEMIES[kind].radius), orc ? R.ORC_HP : 1, into);
    // 정예 하이오크: 크고 공격 준비가 빨리 참 (sim/elite.champMove, 체력은 그대로)
    if (orc && last) Object.assign(e, { champ: true, champK: 1, r: Math.round(e.r * R.ORC_ELITE_SIZE) });
  }
}

/** 방에 처음 들어감 (rooms.enterRoom): 시련 시작, 처음 적 */
export function startHidden(s: RunState): EnemyState[] {
  const h = s.hidden!;
  Object.assign(h, { on: true, round: 1, t: 0, at: s.tick });
  hNote(s, h, "start");
  s.terrain = undefined;
  const out: EnemyState[] = [];
  if (h.kind === 3) startSiege(s, h, out);
  else if (h.kind === 4) startFog(s, h, out);
  else if (h.kind === 5) startSea(s, h, out);
  else roundFoes(s, h, out);
  // 어둠: 사거리가 짧아짐
  if (h.kind === 2) recalcStats(s);
  return out;
}

/** 어둠의 세계: 지금 암흑이 잠깐 풀려 있는지 */
export const darkLifted = (s: RunState, h: HiddenTrialState) => (s.tick - h.at) % R.FLICK_EVERY >= R.FLICK_EVERY - R.FLICK_LIFT;

function finish(s: RunState, h: HiddenTrialState): void {
  h.done = true;
  hNote(s, h, "clear");
  if (h.kind === 2) recalcStats(s);
  s.player.invulnTicks = Math.max(s.player.invulnTicks, 60);
  const rng = createRng(deriveSeed(s.seed, "hiddenReward", s.floor));
  const ids = pickDistinct(rng, passivePool(s), 3);
  ids.forEach((id, i) => addPickup(s, s.roomId, "passive", id, ROOM_CX - 14 * (ids.length - 1) + i * 28, ROOM_CY - 34, s.floor));
}

/** 틱마다 (stepWorld 끝, 쓰러짐 판정 전) */
export function hiddenTick(s: RunState): void {
  const h = hiddenOn(s);
  if (!h) return;
  if (h.kind === 2 && !darkLifted(s, h)) s.player.blindTicks = Math.max(s.player.blindTicks ?? 0, 2);
  const busy = h.kind === 3 ? siegeTick(s, h) : h.kind === 4 ? fogTick(s, h) : h.kind === 5 ? seaTick(s, h) : h.round < 3;
  if (s.enemies.length > 0) return;
  if (h.kind <= 2 && busy) {
    if (++h.t < R.ROUND_GAP) return;
    h.t = 0;
    h.round++;
    hNote(s, h, `round${h.round}`);
    roundFoes(s, h, s.enemies);
    return;
  }
  if (!busy) finish(s, h);
}
