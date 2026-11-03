// 방 적 배치 (rooms.enterRoom이 부름): 층·방 번호로 정해지는 졸개 무리 · 엘리트 방(주황) 2라운드 (첫 무리를 다 잡으면 잠깐 뒤 두 번째 무리)
import { ENEMIES } from "../content";
import { createRng, deriveSeed } from "../rng";
import { eliteRoomHp, makeChamps } from "./elite";
import { lateHp } from "./foeScale";
import { depth } from "./hero";
import { SWARM } from "./minions";
import { BAT_FLOCK, minionKinds } from "./critters";
import { STALKER_MAX, stalkerKinds } from "./stalkers";
import { bodyFits, shapeGrid } from "./layout";
import { partyExtraEnemies, partyHpMul } from "./party";
import { tabooSum, tabooUp } from "./taboo";
import type { EnemyState, RunState } from "./types";
import { addEffect, keepInRoom, makeEnemy, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 한 방 졸개: 기본 수 + 층 × 값 · 최대 수 · 층마다 체력 비율 */
  BASE_ENEMIES: 5,
  PER_FLOOR: 1,
  MAX_ENEMIES: 18,
  HP_PER_FLOOR: 0.2,
  /** 엘리트 방 라운드 수 · 다음 무리까지 틱 · 두 번째 무리 수 배율 */
  ELITE_ROUNDS: 2,
  WAVE_DELAY: 45,
  WAVE2_MUL: 0.7,
};
export { R as ROOM_SPAWN_RULES };

/** 층·방 번호로 정해지는 적 배치 (들어가는 순서와 상관없이 항상 같음). 강한 적 방은 더 많고 단단함 · wave: 엘리트 방 두 번째 무리 (조금 적게) */
export function spawnEnemies(s: RunState, roomId: number, elite: boolean, wave = 0): EnemyState[] {
  const rng = createRng(deriveSeed(s.seed, "floor", s.floor, "room", roomId, "enemies", ...(wave ? [wave] : [])));
  const d = depth(s);
  const base = Math.min(R.MAX_ENEMIES, R.BASE_ENEMIES + Math.floor(d * R.PER_FLOOR) + rng.int(0, 2) + (elite ? 4 : 0));
  // 협동: 사람이 많으면 적·체력 조금 더 · 금기: 무리 지어 (전투방 +1) · 정예 (강한 적 방 +2)
  const all = base + partyExtraEnemies(s, base) + tabooSum(s, "horde") + (elite ? tabooSum(s, "eliteMore") : 0);
  const count = wave ? Math.max(1, Math.round(all * R.WAVE2_MUL)) : all;
  // 층마다 나오는 졸개 (타워 디펜스 적 8종 포함, critters.minionKinds)
  const kinds = [...minionKinds(d), ...stalkerKinds(d)];
  const hpMul = (1 + R.HP_PER_FLOOR * (d - 1)) * lateHp(d) * (elite ? eliteRoomHp() : 1) * partyHpMul(s) * tabooUp(s, "fleshHp");
  const out: EnemyState[] = [];
  const g = shapeGrid(s.map.rooms[roomId]!.shape);
  for (let i = 0; i < count; i++) {
    let kind = rng.pick(kinds);
    // 바위 골렘은 한 방에 한 마리만
    if (kind === "golem" && out.some((e) => e.kind === "golem")) kind = "crawler";
    // 새 몬스터도 한 방에 정해진 수까지만
    if (out.filter((e) => e.kind === kind).length >= (STALKER_MAX[kind] ?? 99)) kind = "crawler";
    const r = ENEMIES[kind].radius;
    let x = 0;
    let y = 0;
    // 들어온 자리 가까이·벽·기둥·구덩이 위는 피함 (정해진 횟수만 시도)
    for (let tries = 0; tries < 40; tries++) {
      x = rng.int(ROOM_MIN_X + 10, ROOM_MAX_X - 10);
      y = rng.int(ROOM_MIN_Y + 10, ROOM_MAX_Y - 10);
      const dx = x - s.player.x;
      const dy = y - s.player.y;
      if (dx * dx + dy * dy > 64 * 64 && (!g || bodyFits(g, x, y, r))) break;
    }
    const timer = rng.int(30, 90);
    const flock = kind === "gnat" || kind === "bat" ? s.nextId : undefined;
    for (const [ox, oy] of kind === "gnat" ? SWARM : kind === "bat" ? BAT_FLOCK : [[0, 0] as const]) {
      // 퍼진 자리가 벽·기둥·구덩이·방 밖이면 무리 가운데에서 나옴
      const ok = x + ox > ROOM_MIN_X + r && x + ox < ROOM_MAX_X - r && y + oy > ROOM_MIN_Y + r && y + oy < ROOM_MAX_Y - r && (!g || bodyFits(g, x + ox, y + oy, r));
      const e = Object.assign(makeEnemy(s, kind, ok ? x + ox : x, ok ? y + oy : y, hpMul, timer), flock ? { flock } : {});
      keepInRoom(e, g);
      out.push(e);
      if (wave) addEffect(s, { kind: "trSpawn", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 10, maxTicks: 20 });
    }
  }
  if (elite) makeChamps(out, d); // 강한 적 방: 가장 센 몇 마리가 정예 (sim/elite)
  return out;
}

/** 엘리트 방 다음 라운드 (rooms.checkCleared, 적을 다 잡았을 때): 아직 라운드가 남았으면 잠깐 뒤 새 무리를 부르고 true (방은 아직 안 끝남) */
export function eliteWave(s: RunState): boolean {
  if (s.map.rooms[s.roomId]?.type !== "elite" || s.arenaLv) return false;
  let w = s.eliteWave;
  if (!w || w.floor !== s.floor || w.room !== s.roomId) w = s.eliteWave = { floor: s.floor, room: s.roomId, n: 1, t: R.WAVE_DELAY };
  if (w.n >= R.ELITE_ROUNDS) return false;
  if (w.t-- > 0) return true;
  s.enemies = spawnEnemies(s, s.roomId, true, w.n);
  w.n++;
  w.t = R.WAVE_DELAY;
  return true;
}
