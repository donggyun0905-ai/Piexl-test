// 레비아탄 공용 (sim/bossLeviathan·bossLevWhale·bossLevKing): 물속 방(숨 · 비눗방울) · 토네이도(휘감아 떠밀기, 피해 없음) · 물감옥
// · 계속 나오는 바다 몬스터 · 좌우에서 번갈아 나오는 유령선 선장 · 방 전체 물(느려짐)
import { ROOM_HEIGHT, ROOM_WIDTH } from "../constants";
import { ENEMIES } from "../content";
import { createRng, deriveSeed } from "../rng";
import { envDamage } from "./combat";
import { minionKinds } from "./critters";
import { depth } from "./hero";
import { SEA_BUBBLE_R } from "./hiddenFoes";
import { hSpawn } from "./hiddenKit";
import { eachSeat, seatNo } from "./party";
import type { EnemyState, RunState } from "./types";
import { addEffect, keepInRoom, makeEnemy, roomGrid, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 숨 최대(틱, 10초) · 비눗방울 안에서 틱마다 차는 숨 · 숨이 없을 때 피해 간격(틱) · 그때 피해(최대 체력 비율) · 물감옥 안에서 숨이 닳는 배수 */
  AIR: 600,
  REFILL: 12,
  DROWN_EVERY: 60,
  DROWN: 0.05,
  PRISON_AIR: 2,
  /** 몬스터를 잡으면 생기는 비눗방울이 남는 틱 · 유령 선장은 더 오래 */
  BUBBLE: 180,
  BUBBLE_BIG: 300,
  /** 바다 몬스터: 처음 수 · 다시 나오는 간격 · 한꺼번에 최대 */
  FOES: 4,
  FOE_EVERY: 90,
  FOE_MAX: 6,
  /** 유령 선장: 간격 · 처음 · 체력(선장 체력 × 레비아탄 배율의 몇 배) · 한꺼번에 최대 */
  SHIP_EVERY: 1200,
  SHIP_FIRST: 600,
  GHOST_HP: 0.6,
  GHOSTS: 2,
  /** 토네이도: 간격 · 한꺼번에 최대 · 남는 틱 · 반경 · 떠미는 힘(틱마다) · 떠도는 빠르기 */
  TORN_EVERY: 360,
  TORN_MAX: 3,
  TORN_LIFE: 540,
  TORN_R: 34,
  TORN_PUSH: 1.4,
  TORN_SPEED: 0.45,
  /** 물감옥: 예고 · 반경(예고 원) · 저절로 깨지는 틱 (못 깨도 4초 뒤 풀림) */
  PRISON_WARN: 60,
  PRISON_R: 24,
  PRISON_MAX: 240,
};
export { R as BOSS_LEV_KIT_RULES };

/** 레비아탄 (페이즈 1 심해룡 · 그 뒤 지휘자) */
export const levDirector = (s: RunState) => s.enemies.find((o) => o.kind === "leviathan" && o.hp > 0);

/** 방 전체를 물로 (느려짐, terrain) · off면 물을 뺌 */
export function setWater(s: RunState, on: boolean): void {
  const t = s.terrain && s.terrain.room === s.roomId ? s.terrain : { room: s.roomId, mud: [], lava: [], water: [], spikes: [] };
  t.water = on ? [[0, 0, ROOM_WIDTH, ROOM_HEIGHT]] : [];
  s.terrain = t;
}

/** 물속에 들어감: 숨을 채우고 비눗방울을 비움 */
export function dive(e: EnemyState, air: number): void {
  e.lhWet = true;
  e.lhAirMax = air;
  e.lhAir = [];
  e.lhBubbles ??= [];
}

/** 자리 seat의 숨 비율 (화면 게이지) */
export function airLeft(e: EnemyState, seat: number): number {
  if (!e.lhWet) return 1;
  return Math.max(0, (e.lhAir?.[seat] ?? e.lhAirMax ?? R.AIR) / (e.lhAirMax ?? R.AIR));
}

/** 이 자리 사람을 가둔 물감옥 */
export const prisonOf = (s: RunState, seat: number) => s.enemies.find((o) => o.kind === "levprison" && o.hp > 0 && o.aux === seat);

/** 틱마다: 숨 (비눗방울 안이면 참, 물감옥 안이면 두 배로 닳음, 다 떨어지면 다침) */
export function airTick(s: RunState, e: EnemyState): void {
  e.lhBubbles = (e.lhBubbles ?? []).filter((b) => b[2] > s.tick);
  if (!e.lhWet) return;
  const max = e.lhAirMax ?? R.AIR;
  const air = (e.lhAir ??= []);
  const br = SEA_BUBBLE_R();
  eachSeat(
    s,
    () => {
      const p = s.player;
      const seat = seatNo(s);
      const now = air[seat] ?? max;
      const inside = e.lhBubbles!.some(([x, y]) => (p.x - x) ** 2 + (p.y - y) ** 2 < br * br);
      air[seat] = inside ? Math.min(max, now + R.REFILL) : Math.max(0, now - (prisonOf(s, seat) ? R.PRISON_AIR : 1));
      if (air[seat] <= 0 && s.tick % R.DROWN_EVERY === 0) envDamage(s, Math.max(1, Math.round(p.stats.maxHp * R.DROWN)));
    },
    true,
  );
}

/** 몬스터가 쓰러지면 (combat → trialKill): 물속이면 그 자리에 비눗방울 */
export function levKill(s: RunState, dead: EnemyState): void {
  const e = levDirector(s);
  if (!e?.lhWet || dead.kind === "levprison") return;
  (e.lhBubbles ??= []).push([Math.round(dead.x), Math.round(dead.y), s.tick + (dead.lhGhost ? R.BUBBLE_BIG : R.BUBBLE)]);
}

/** 비눗방울 하나를 그 자리에 (궁극기) */
export const addBubble = (s: RunState, e: EnemyState, x: number, y: number, ticks: number) => (e.lhBubbles ??= []).push([Math.round(x), Math.round(y), s.tick + ticks]);

/** 바다 몬스터 (땅에서만 사는 것·떼로 다니는 것 빼고), 양옆·아래 가장자리에서 */
export function seaFoe(s: RunState, salt: number, into: EnemyState[]): void {
  const rng = createRng(deriveSeed(s.seed, "levFoe", s.floor, salt));
  const kinds = minionKinds(depth(s)).filter((k) => k !== "gnat" && k !== "bat" && k !== "golem" && k !== "guardian");
  const side = rng.int(0, 2);
  const x = side === 0 ? ROOM_MIN_X + 8 : side === 1 ? ROOM_MAX_X - 8 : rng.int(ROOM_MIN_X + 20, ROOM_MAX_X - 20);
  const y = side === 2 ? ROOM_MAX_Y - 8 : rng.int(ROOM_MIN_Y + 60, ROOM_MAX_Y - 20);
  hSpawn(s, rng.pick(kinds), x, y, 1, into);
}

/** 틱마다 (페이즈 1): 바다 몬스터가 계속 나옴 · 유령선 선장이 좌우 번갈아 */
export function foeTick(s: RunState, e: EnemyState, into: EnemyState[]): void {
  if (e.lhNextFoe === undefined) {
    for (let i = 0; i < R.FOES; i++) seaFoe(s, i, into);
    e.lhNextFoe = s.tick + R.FOE_EVERY;
    e.lhNextShip = s.tick + R.SHIP_FIRST;
  }
  const foes = s.enemies.filter((o) => o.hp > 0 && !ENEMIES[o.kind].boss && o.kind !== "levprison").length;
  if (s.tick >= e.lhNextFoe) {
    e.lhNextFoe = s.tick + R.FOE_EVERY;
    if (foes < R.FOE_MAX) seaFoe(s, s.tick, into);
  }
  if (s.tick >= (e.lhNextShip ?? Infinity)) {
    e.lhNextShip = s.tick + R.SHIP_EVERY;
    ghostShip(s, e, into);
  }
}

/** 유령선 선장 하나 (왼쪽·오른쪽 번갈아, 한꺼번에 최대 GHOSTS) */
export function ghostShip(s: RunState, e: EnemyState, into: EnemyState[]): void {
  if (s.enemies.filter((o) => o.lhGhost && o.hp > 0).length >= R.GHOSTS) return;
  const left = (e.lhShips ?? 0) % 2 === 0;
  e.lhShips = (e.lhShips ?? 0) + 1;
  const mul = (e.maxHp / ENEMIES.leviathan.hp) * R.GHOST_HP;
  const g = makeEnemy(s, "captain", left ? ROOM_MIN_X + 20 : ROOM_MAX_X - 20, (ROOM_MIN_Y + ROOM_MAX_Y) / 2, mul, 60);
  g.lhGhost = true;
  g.noGold = true;
  into.push(g);
  addEffect(s, { kind: "trSpawn", x: g.x, y: g.y, dirX: 0, dirY: 0, size: 26, maxTicks: 30 });
}

/** 토네이도 하나 (방 안 아무 곳, 천천히 떠돎) */
export function addTornado(s: RunState, e: EnemyState, salt: number): void {
  const list = (e.lhTorn ??= []);
  if (list.length >= R.TORN_MAX) return;
  const rng = createRng(deriveSeed(s.seed, "levTorn", s.floor, salt));
  const a = rng.int(0, 15);
  const v = [
    [1, 0],
    [0.7, 0.7],
    [0, 1],
    [-0.7, 0.7],
    [-1, 0],
    [-0.7, -0.7],
    [0, -1],
    [0.7, -0.7],
  ][a % 8]!;
  list.push({ x: rng.int(ROOM_MIN_X + 40, ROOM_MAX_X - 40), y: rng.int(ROOM_MIN_Y + 60, ROOM_MAX_Y - 30), vx: v[0]! * R.TORN_SPEED, vy: v[1]! * R.TORN_SPEED, until: s.tick + R.TORN_LIFE });
}

/** 틱마다: 토네이도가 떠돌며 (벽에서 튕김) 가까운 사람을 휘감아 떠밈 (피해 없음, 대시 중이면 안 밀림) */
export function tornTick(s: RunState, e: EnemyState, every: number): void {
  if (every > 0 && s.tick >= (e.lhNextTorn ?? 0)) {
    e.lhNextTorn = s.tick + every;
    addTornado(s, e, s.tick);
  }
  e.lhTorn = (e.lhTorn ?? []).filter((t) => t.until > s.tick);
  for (const t of e.lhTorn) {
    t.x += t.vx;
    t.y += t.vy;
    if (t.x < ROOM_MIN_X + 20 || t.x > ROOM_MAX_X - 20) t.vx = -t.vx;
    if (t.y < ROOM_MIN_Y + 20 || t.y > ROOM_MAX_Y - 20) t.vy = -t.vy;
    eachSeat(
      s,
      () => {
        const p = s.player;
        const dx = p.x - t.x;
        const dy = p.y - t.y;
        const d = Math.hypot(dx, dy);
        if (p.dashTicks > 0 || d > R.TORN_R + p.r || d < 0.01) return;
        // 소용돌이 방향(옆으로) + 바깥쪽으로 조금
        const k = R.TORN_PUSH * (1 - (d / (R.TORN_R + p.r)) * 0.5);
        p.x += (-dy / d + (dx / d) * 0.4) * k;
        p.y += (dx / d + (dy / d) * 0.4) * k;
        keepInRoom(p, roomGrid(s));
      },
      true,
    );
  }
}

/** 물감옥 예고 (내 둘레에 물방울이 모임 → 대시로 원 밖에 나가면 피함) */
export function startPrison(s: RunState, e: EnemyState): void {
  e.lhPrisonAt = s.tick + R.PRISON_WARN;
  e.lhPrisonX = s.player.x;
  e.lhPrisonY = s.player.y;
}

/** 틱마다: 물감옥 (예고가 끝나면 원 안 사람을 가둠 · 갇힌 사람은 못 움직임 · 깨거나 시간이 지나면 풀림) */
export function prisonTick(s: RunState, e: EnemyState, into: EnemyState[]): void {
  if (e.lhPrisonAt !== undefined && s.tick >= e.lhPrisonAt) {
    const x = e.lhPrisonX ?? 0;
    const y = e.lhPrisonY ?? 0;
    e.lhPrisonAt = undefined;
    eachSeat(
      s,
      () => {
        const p = s.player;
        const seat = seatNo(s);
        if (p.dashTicks > 0 || p.invulnTicks > 0 || prisonOf(s, seat) || (p.x - x) ** 2 + (p.y - y) ** 2 > (R.PRISON_R + p.r) ** 2) return;
        const c = makeEnemy(s, "levprison", p.x, p.y, e.maxHp / ENEMIES.leviathan.hp, 0);
        c.aux = seat;
        c.count = s.tick + R.PRISON_MAX;
        into.push(c);
        addEffect(s, { kind: "burst", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 18, maxTicks: 16, foe: true });
      },
      true,
    );
  }
  for (const c of s.enemies) {
    if (c.kind !== "levprison" || c.hp <= 0) continue;
    if (s.tick >= c.count) {
      c.hp = 0;
      continue;
    }
    eachSeat(s, () => {
      if (seatNo(s) !== c.aux) return;
      const p = s.player;
      p.x = p.prevX = c.x;
      p.y = p.prevY = c.y;
      p.dbRoot = Math.max(p.dbRoot ?? 0, 2);
    });
  }
}
