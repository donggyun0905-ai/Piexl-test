// 숨은 시련 5 죽음의 바다: 방 전체가 물(조금 느려짐). '숨' 10초 · 다 떨어지면 계속 다침.
// 몬스터를 잡으면 그 자리에 3초 동안 비눗방울 (hiddenFoes.hiddenKill, 안에 들어가면 숨이 다시 참). 몬스터는 계속 다시 나옴.
// 10초 뒤 해적선(보스만 한 체력)이 위쪽에 나타남 (갑판에 쇠사슬 간수와 해적 선장) → 배를 부수면 선장·간수가 내려와 싸움, 몬스터는 더 안 나옴
import { ROOM_CX, ROOM_HEIGHT, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, ROOM_WIDTH } from "../constants";
import { ENEMIES } from "../enemyDefs";
import { createRng, deriveSeed } from "../rng";
import { spawnBoss } from "./bosses";
import { envDamage as envDamage_ } from "./combat";
import { minionKinds } from "./critters";
import { depth } from "./hero";
import { SEA_BUBBLE_R } from "./hiddenFoes";
import { fortTick, hNote, hSpawn, makeFort } from "./hiddenKit";
import type { HiddenTrialState } from "./hiddenTrialTypes";
import type { EnemyState, RunState } from "./types";
import { addEffect } from "./util";
import { srcFn } from "./dmgSrc";
const envDamage = srcFn("hiddenSea", () => envDamage_);

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 숨 최대(틱, 10초) · 비눗방울 안에서 틱마다 차는 숨 · 숨이 없을 때 피해 간격(틱) · 그때 피해(최대 체력 비율) */
  BREATH: 600,
  REFILL: 12,
  DROWN_EVERY: 30,
  DROWN: 0.05,
  /** 처음 몬스터 수 · 다시 나오는 간격(틱) · 한꺼번에 최대 */
  FOES: 6,
  FOE_EVERY: 75,
  FOE_MAX: 8,
  /** 해적선이 나오기까지 틱(10초) · 배 체력(그 층 보스 체력 배율) · 배 조각 수·간격·반경 · 배 높이(방 위 끝에서) */
  SHIP_AT: 600,
  SHIP_HP: 1,
  SHIP_SEGS: 5,
  SHIP_GAP: 22,
  SHIP_R: 12,
  SHIP_Y: 28,
  /** 배가 부서진 뒤: 해적 선장 체력 배율 · 쇠사슬 간수 수 */
  CAPTAIN_HP: 0.7,
  CHAINS: 3,
};
export { R as HIDDEN_SEA_RULES };

/** 바다에서 다시 나오는 몬스터 (땅에서만 사는 것·떼로 다니는 것 빼고) */
const seaKinds = (d: number) => minionKinds(d).filter((k) => k !== "gnat" && k !== "bat" && k !== "golem" && k !== "guardian");

/** 양옆·아래 가장자리에서 하나 */
function edgeFoe(s: RunState, salt: number, into: EnemyState[]): void {
  const rng = createRng(deriveSeed(s.seed, "hiddenSea", s.floor, salt));
  const kind = rng.pick(seaKinds(depth(s)));
  const side = rng.int(0, 2);
  const x = side === 0 ? ROOM_MIN_X + 8 : side === 1 ? ROOM_MAX_X - 8 : rng.int(ROOM_MIN_X + 20, ROOM_MAX_X - 20);
  const y = side === 2 ? ROOM_MAX_Y - 8 : rng.int(ROOM_MIN_Y + 60, ROOM_MAX_Y - 20);
  hSpawn(s, kind, x, y, 1, into);
}

export function startSea(s: RunState, h: HiddenTrialState, into: EnemyState[]): void {
  s.terrain = { room: s.roomId, mud: [], lava: [], water: [[0, 0, ROOM_WIDTH, ROOM_HEIGHT]], spikes: [] };
  h.breath = R.BREATH;
  h.bubbles = [];
  h.shipAt = s.tick + R.SHIP_AT;
  for (let i = 0; i < R.FOES; i++) edgeFoe(s, i, into);
}

/** 숨 비율 (화면 게이지) */
export const breathRatio = (h: HiddenTrialState) => Math.max(0, (h.breath ?? 0) / R.BREATH);

/** 바다 틱: 배가 아직 안 부서졌으면 true */
export function seaTick(s: RunState, h: HiddenTrialState): boolean {
  const p = s.player;
  h.bubbles = (h.bubbles ?? []).filter((b) => b[2] > s.tick);
  const inBubble = h.bubbles.some(([x, y]) => (p.x - x) ** 2 + (p.y - y) ** 2 < SEA_BUBBLE_R() ** 2);
  h.breath = inBubble ? Math.min(R.BREATH, (h.breath ?? 0) + R.REFILL) : Math.max(0, (h.breath ?? 0) - 1);
  if (h.breath <= 0 && s.tick % R.DROWN_EVERY === 0) envDamage(s, Math.max(1, Math.round(p.stats.maxHp * R.DROWN)));
  const ship = h.forts?.[0];
  // 10초 뒤 해적선
  if (!ship && s.tick >= (h.shipAt ?? 0)) {
    const pts = Array.from({ length: R.SHIP_SEGS }, (_, i): [number, number] => [ROOM_CX + (i - (R.SHIP_SEGS - 1) / 2) * R.SHIP_GAP, ROOM_MIN_Y + R.SHIP_Y]);
    h.forts = [makeFort(s, "ship", pts, R.SHIP_R, R.SHIP_HP, s.enemies)];
    for (const [x, y] of pts) addEffect(s, { kind: "trSpawn", x, y, dirX: 0, dirY: 0, size: 24, maxTicks: 30 });
    hNote(s, h, "ship");
  } else if (ship && fortTick(s, ship)) {
    // 배가 부서지면 선장·쇠사슬 간수가 내려옴
    const b = spawnBoss(s, "captain");
    b.x = b.prevX = ROOM_CX;
    b.y = b.prevY = ROOM_MIN_Y + R.SHIP_Y;
    b.hp = b.maxHp = Math.round(b.maxHp * R.CAPTAIN_HP);
    b.noGold = true;
    s.enemies.push(b);
    for (let i = 0; i < R.CHAINS; i++) hSpawn(s, "chainward", ROOM_CX + (i - (R.CHAINS - 1) / 2) * 40, ROOM_MIN_Y + R.SHIP_Y + 16, 1, s.enemies);
    h.round = 2;
    hNote(s, h, "shipDown");
  }
  // 배가 부서지기 전까지 몬스터가 계속 나옴
  const foes = s.enemies.filter((e) => e.kind !== "fort" && !ENEMIES[e.kind].boss).length;
  if (h.round < 2 && (s.tick - h.at) % R.FOE_EVERY === R.FOE_EVERY - 1 && foes < R.FOE_MAX) edgeFoe(s, s.tick, s.enemies);
  return h.round < 2;
}
