// 무한 모드 보스방 단계 (1~6층은 보통 판 그대로):
// 7~10층 보스 2마리 · 11~13층 랜덤 라스트 보스 · 14~16층 라스트 보스 + 보스 2마리 · 17~19층 라스트 보스 3종(라스트 보스방의 2배 방)
// · 20층부터 내 능력치를 그대로 가진 랜덤 캐릭터 AI와 대결 이벤트(1대1·3대3·5대5·난투전, 패왕전 규칙)
// 7층부터 보스방을 깰 때마다 적 체력·주는 피해가 오름 (endlessPow)
import { CHARACTER_IDS, BOSS_TIERS, LAST_BOSSES, type BossKind } from "../content";
import { PW_MODE, type PwMode } from "../paewangDefs";
import { PW_ARENAS } from "../paewangMaps";
import { createRng, deriveSeed } from "../rng";
import { spawnBoss } from "./bosses";
import { applyRoom, BIG_COLS, BIG_ROWS } from "./rooms";
import { thinkAll } from "./paewangAi";
import { spotXY } from "./paewangGrid";
import { spawnAlly, spawnFoe } from "./paewangUnits";
import type { PwState } from "./paewangTypes";
import type { EnemyState, RunState } from "./types";
import { keepInRoom, roomGrid } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 보스 2마리부터 · 라스트 보스부터 · 라스트 보스 + 보스부터 · 라스트 보스 3종부터 · AI 대결부터 (층) */
  PAIR: 7,
  LAST: 11,
  MIXED: 14,
  TRIPLE: 17,
  DUEL: 20,
  /** 7층부터 보스방을 깰 때마다 적 체력·주는 피해 +12% */
  POW: 0.12,
  /** 여럿이 나올 때 한 마리 체력 배율 (2마리 · 3마리 이상) */
  PAIR_HP: 0.85,
  GROUP_HP: 0.75,
  /** AI 대결: 내 능력치 배율 · 난투전 인원 */
  SAME: 1,
  BRAWL_FOES: 9,
};
export { R as ENDLESS_RULES };

const EVENT_MODES: readonly PwMode[] = ["duel", "trio", "squad", "brawl"];

const on = (s: RunState, from: number) => !!s.endless && !s.hero && !s.arenaLv && s.floor >= from;

/** 7층부터 보스방을 깬 수만큼 적이 세짐 (체력·주는 피해 배율) */
export function endlessPow(s: RunState): number {
  return on(s, R.PAIR) ? 1 + R.POW * (s.floor - R.PAIR) : 1;
}

/** 이 층 보스방이 AI 대결 이벤트인지 */
export const endlessDuel = (s: RunState): boolean => on(s, R.DUEL);

/** 보스방 크기: 라스트 보스가 나오면 큰 방, 라스트 보스 3종은 그 2배. 보통이면 null */
export function endlessSize(s: RunState): { cols: number; rows: number } | null {
  if (!on(s, R.LAST) || endlessDuel(s)) return null;
  return on(s, R.TRIPLE) ? { cols: BIG_COLS * 2, rows: BIG_ROWS * 2 } : { cols: BIG_COLS, rows: BIG_ROWS };
}

/** 태초의 빛과 어둠이 나오는 큰 방은 상자 벽 (라스트 보스 3종 방은 넓어서 없음) */
export const endlessPrimeval = (s: RunState): boolean => on(s, R.LAST) && !on(s, R.TRIPLE) && endlessLast(s) === "plight";

function endlessLast(s: RunState): BossKind {
  return createRng(deriveSeed(s.seed, "endlessLast", s.floor)).pick(LAST_BOSSES);
}

/** 보스방 적 (7층부터). 보통 판 그대로면 null */
export function endlessBosses(s: RunState): EnemyState[] | null {
  if (!on(s, R.PAIR) || endlessDuel(s)) return null;
  const rng = createRng(deriveSeed(s.seed, "endlessBoss", s.floor));
  const pool = [...BOSS_TIERS.flat()];
  const boss = (): BossKind => pool.splice(rng.int(0, pool.length - 1), 1)[0]!;
  // 태초의 빛과 어둠은 늘 둘이 함께
  const last = (k: BossKind): BossKind[] => (k === "plight" ? ["plight", "pdark"] : [k]);
  let kinds: BossKind[];
  if (on(s, R.TRIPLE)) kinds = LAST_BOSSES.flatMap(last);
  else if (on(s, R.MIXED)) kinds = [...last(endlessLast(s)), boss(), ...(endlessLast(s) === "plight" ? [] : [boss()])];
  else if (on(s, R.LAST)) kinds = last(endlessLast(s));
  else kinds = [boss(), boss()];
  const list = kinds.map((k) => spawnBoss(s, k));
  const mul = (list.length >= 3 ? R.GROUP_HP : list.length === 2 && !kinds.includes("pdark") ? R.PAIR_HP : 1) * endlessPow(s);
  for (const e of list) e.hp = e.maxHp = Math.round(e.maxHp * mul);
  return list;
}

/** AI 대결 방에 들어감: 처음이면 대결을 정함 (방을 나갔다 오면 그대로). 이미 깼으면 undefined */
export function endlessEvent(s: RunState, cleared: boolean): PwState | undefined {
  if (!endlessDuel(s) || cleared) return undefined;
  if (s.pwRoom?.lv === s.floor) return s.pwRoom;
  const mode = createRng(deriveSeed(s.seed, "endlessDuel", s.floor)).pick(EVENT_MODES);
  // lv에 층을 적어 둠 (다른 층의 이벤트와 구분)
  s.pwRoom = { mode, arena: PW_MODE[mode].maps[0]!, allies: [], benchA: [], benchB: [], waiting: [], down: false, lv: s.floor, kills: 0, tags: 1, same: R.SAME * endlessPow(s) };
  return s.pwRoom;
}

/** AI 대결 시작: 경기장 자리에 나·내 편·상대를 놓음 (상대 목록을 돌려줌) */
export function endlessFighters(s: RunState): EnemyState[] {
  const pw = s.pw!;
  const def = PW_MODE[pw.mode];
  const arena = PW_ARENAS[pw.arena];
  const rng = createRng(deriveSeed(s.seed, "endlessRoster", s.floor));
  const pick = () => rng.pick(CHARACTER_IDS);
  const before = s.enemies;
  s.enemies = [];
  const me = spotXY(def.ffa ? arena.spots[0]! : arena.teamA[0]!);
  s.player.x = s.player.prevX = me[0];
  s.player.y = s.player.prevY = me[1];
  if (def.ffa) {
    for (let i = 0; i < Math.min(def.foes, R.BRAWL_FOES); i++) {
      const at = spotXY(arena.spots[(i + 1) % arena.spots.length]!);
      spawnFoe(s, pick(), 100 + i, at[0], at[1], pw.tags++);
    }
  } else {
    for (let i = 0; i < def.allies; i++) {
      const at = spotXY(arena.teamA[(i + 1) % arena.teamA.length]!);
      spawnAlly(s, pick(), at[0], at[1], pw.tags++);
    }
    for (let i = 0; i < def.foes; i++) {
      const at = spotXY(arena.teamB[i % arena.teamB.length]!);
      spawnFoe(s, pick(), 1, at[0], at[1], pw.tags++);
    }
  }
  const list = s.enemies;
  s.enemies = before;
  return list;
}

/** 틱마다 (보통 판 계산 끝에): AI가 움직이고 싸움 · 상대가 모두 쓰러지면 대결 끝, 보통 크기 방으로 (가운데 계단) */
export function endlessTick(s: RunState): void {
  const pw = s.pw;
  if (!pw || !s.endless || s.over) return;
  thinkAll(s);
  pw.allies = pw.allies.filter((a) => a.hp > 0);
  if (s.enemies.some((e) => e.pw && e.hp > 0)) return;
  s.pw = s.pwRoom = undefined;
  s.roomCols = s.roomRows = undefined;
  applyRoom(s);
  keepInRoom(s.player, roomGrid(s));
}
