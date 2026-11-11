// 시즌 3 3단계 보스 달을 삼키는 자: 방이 어두워지고(화면에서 내 둘레만 밝음) 천장의 달이 시간마다 차오름 (초승달 → 보름달)
// 방 곳곳에 달 조각(맞힐 수 있는 적) → 깨면 그 자리에 달빛 기둥 (달 게이지 줄어듦) · 보름달이면 월식 강타: 기둥 안이 아니면 큰 피해
// 차례로 ① 그림자 손(바닥 여러 곳 원 예고 · 맞으면 속박) ② 달 삼키기(가까운 기둥으로 선 예고 → 기둥 안에 아무도 없으면 기둥을 먹고 회복)
// 새벽의 성흔: 이 방에서는 성흔이 천천히 줄고, 달 조각을 깨면 성흔이 참 · 달빛이 걸린 동안 삼키기 회복 절반
// 체력 절반 아래: 달 조각 더 많이 · 달이 더 빨리 참 · 월식 뒤 그림자 둘
import { ENEMIES } from "../enemyDefs";
import { createRng, deriveSeed } from "../rng";
import { half, hitDamage } from "./bossKit";
import { throughDash } from "./bossGrip";
import { damagePlayer as damagePlayer_ } from "./combat";
import { addShape } from "./hazards";
import { moonfallTick, startMoonfall, startReap } from "./bossMoonKit";
import { eachSeat } from "./party";
import { addStigma, stigmaGauge } from "./stigma";
import type { EnemyState, RunState } from "./types";
import { addEffect, keepInRoom, makeEnemy, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, roomGrid } from "./util";
import { srcFn } from "./dmgSrc";
const damagePlayer = srcFn("bossMoonEater", () => damagePlayer_);

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 보름달까지 틱 (11초) · 체력 절반 아래 (8초) */
  MOON_TICKS: 660,
  MOON_TICKS_HALF: 480,
  /** 달 조각: 한 번에 떨어지는 수 · 체력 절반 아래 · 체력 배율 · 보스에서 떨어진 최소 거리 */
  SHARDS: 3,
  SHARDS_HALF: 4,
  SHARD_HP: 1,
  SHARD_AWAY: 50,
  /** 달 조각을 깨면: 달 게이지 줄어듦 · 기둥이 남는 틱 · 기둥 반지름 */
  SHARD_CUT: 0.1,
  PILLAR_TICKS: 300,
  PILLAR_R: 22,
  /** 월식 강타: 예고 틱 · 기둥 밖이면 최대 체력의 몇 % 피해 (대시로도 못 피함) */
  ECLIPSE_WARN: 90,
  ECLIPSE_PCT: 0.5,
  /** 월식 뒤 그림자 수 (체력 절반 아래) */
  CLONES: 2,
  /** 그림자 손: 개수 · 체력 절반 아래 · 예고 틱 · 범위 · 피해 배율 · 퍼짐 */
  HANDS: 5,
  HANDS_HALF: 8,
  HAND_WARN: 42,
  HAND_R: 20,
  HAND_MUL: 1.1,
  HAND_SPREAD: 64,
  /** 달 삼키기: 예고 틱 · 회복 (최대 체력의 몇 %) · 달빛이 걸려 있으면 회복 배율 */
  DEVOUR_WARN: 54,
  DEVOUR_HEAL: 0.05,
  DEVOUR_MOON: 0.5,
  /** 공격 사이 쉬는 틱 · 달이 가득할수록 줄어드는 비율 */
  REST: 70,
  REST_MOON: 0.3,
  /** 새벽의 성흔: 이 방에서 1초마다 주는 성흔 · 달 조각을 깨면 더하는 성흔 */
  DRAIN: 1,
  SHARD_STIGMA: 10,
  /** 지키는 거리 (이만큼 떨어져 맴돎) */
  KEEP: 70,
  /** 붙으면 빠져나가기: 이 거리 안이면 · 다시 쓰기까지 틱 · 떨어져 나타나는 거리 · 떠난 자리 그림자 폭발 예고 틱·범위·피해 배율 */
  BLINK_NEAR: 36,
  BLINK_GAP: 150,
  BLINK_DIST: 95,
  BLINK_WARN: 20,
  BLINK_R: 30,
  BLINK_MUL: 1,
};
export { R as BOSS_MOON_EATER_RULES };

type Vec = readonly [number, number];

/** 달 조각 떨어뜨리기 (방 안 시드 자리, 보스와 떨어진 곳) */
function dropShards(s: RunState, e: EnemyState, spawned: EnemyState[]): void {
  const rng = createRng(deriveSeed(s.seed, "meShard", s.floor, e.count));
  const n = half(e) ? R.SHARDS_HALF : R.SHARDS;
  const mul = (e.maxHp / ENEMIES.mooneater.hp) * R.SHARD_HP;
  for (let i = 0; i < n; i++) {
    let x = 0;
    let y = 0;
    for (let k = 0; k < 12; k++) {
      x = rng.int(ROOM_MIN_X + 24, ROOM_MAX_X - 24);
      y = rng.int(ROOM_MIN_Y + 24, ROOM_MAX_Y - 24);
      if ((x - e.x) ** 2 + (y - e.y) ** 2 > R.SHARD_AWAY ** 2) break;
    }
    const m = makeEnemy(s, "moonshard", x, y, mul, 0);
    keepInRoom(m, roomGrid(s));
    m.noGold = true;
    m.fixAt = [m.x, m.y];
    spawned.push(m);
    (e.meShards ??= []).push({ id: m.id, x: m.x, y: m.y });
  }
}

/** 깨진 달 조각 → 달빛 기둥 · 달 줄이기 · 성흔 · 기둥 시간 줄이기 */
function shardTick(s: RunState, e: EnemyState): void {
  e.mePillars = (e.mePillars ?? []).filter((c) => --c.t > 0);
  const left: NonNullable<EnemyState["meShards"]> = [];
  for (const sh of e.meShards ?? []) {
    if (s.enemies.some((x) => x.id === sh.id && x.hp > 0)) {
      left.push(sh);
      continue;
    }
    e.mePillars.push({ x: sh.x, y: sh.y, t: R.PILLAR_TICKS });
    e.meMoon = Math.max(0, (e.meMoon ?? 0) - R.SHARD_CUT);
    eachSeat(s, () => void (stigmaGauge(s.player) && addStigma(s.player, R.SHARD_STIGMA)), true);
    addEffect(s, { kind: "burst", x: sh.x, y: sh.y, dirX: 0, dirY: 0, size: R.PILLAR_R, maxTicks: 20 });
  }
  e.meShards = left;
}

const inPillar = (e: EnemyState, x: number, y: number) => (e.mePillars ?? []).some((c) => (c.x - x) ** 2 + (c.y - y) ** 2 <= R.PILLAR_R ** 2);

/** 달 조각 (bosses BOSS_AI): 제자리 */
export function updateMoonShard(e: EnemyState): void {
  if (e.fixAt) [e.x, e.y] = e.fixAt;
}

export function updateMoonEater(s: RunState, e: EnemyState, toP: Vec, go: Vec, spawned: EnemyState[]): void {
  const h = half(e);
  // 조각은 다음 틱에야 방에 들어가므로 깨졌는지 먼저 보고 새로 떨어뜨림
  shardTick(s, e);
  if (!e.meDark) {
    e.meDark = true;
    e.meMoon = 0;
    dropShards(s, e, spawned);
  }
  // 새벽의 성흔: 달빛을 먹혀 성흔이 줆
  if (s.tick % 60 === 0) eachSeat(s, () => void (stigmaGauge(s.player) && (s.player.sgGauge = Math.max(0, (s.player.sgGauge ?? 0) - R.DRAIN))), true);
  // 달이 차오름 · 보름달이면 월식 (하던 공격이 끝난 뒤)
  if (e.phase !== "act") e.meMoon = Math.min(1, (e.meMoon ?? 0) + 1 / (h ? R.MOON_TICKS_HALF : R.MOON_TICKS));
  const rest = Math.round(R.REST * (1 - R.REST_MOON * (e.meMoon ?? 0)));
  if (e.phase === "walk") {
    const p = s.player;
    const d = Math.hypot(p.x - e.x, p.y - e.y);
    const dir = d > R.KEEP + 10 ? 1 : d < R.KEEP - 20 ? -0.6 : 0;
    e.x += go[0] * ENEMIES.mooneater.speed * dir;
    e.y += go[1] * ENEMIES.mooneater.speed * dir;
    e.dirX = toP[0];
    e.dirY = toP[1];
    // 붙어서 때리면: 떠난 자리에 그림자가 터지고 멀리 나타남
    if (d < R.BLINK_NEAR && s.tick >= (e.aux ?? 0)) {
      e.aux = s.tick + R.BLINK_GAP;
      addShape(s, R.BLINK_WARN, { x: e.x, y: e.y, radius: R.BLINK_R, damage: Math.round(hitDamage(s) * R.BLINK_MUL), by: "mooneater", fx: "shadowHand" });
      addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 16, maxTicks: 14, foe: true });
      e.x = e.prevX = p.x - toP[0] * R.BLINK_DIST;
      e.y = e.prevY = p.y - toP[1] * R.BLINK_DIST;
      keepInRoom(e, roomGrid(s));
      e.prevX = e.x;
      e.prevY = e.y;
    }
    if ((e.meMoon ?? 0) >= 1) {
      e.phase = "act";
      e.timer = R.ECLIPSE_WARN;
      return;
    }
    if (e.timer > 0) return;
    e.count++;
    const pillar = nearestPillar(e);
    // 차례: 그림자 손 → 초승달 낫 → 그림자 손 → 월광 낙하 · 기둥이 있으면 넷째마다 삼키기 (sim/bossMoonKit)
    const pick = e.count % 4;
    if (pick === 1) return void startReap(s, e, toP);
    if (pick === 3) return startMoonfall(e);
    if (pick === 0 && pillar) {
      e.phase = "swing";
      e.timer = R.DEVOUR_WARN;
      e.auxX = pillar.x;
      e.auxY = pillar.y;
      addShape(s, R.DEVOUR_WARN, { x: e.x, y: e.y, radius: 0, damage: 0, toX: pillar.x, toY: pillar.y, width: 3 });
      return;
    }
    hands(s, e, h);
    e.phase = "summon";
    e.timer = R.HAND_WARN;
    return;
  }
  if (e.phase === "act") {
    // 월식 강타: 기둥 안이 아니면 큰 피해 (대시로도 못 피함)
    if (e.timer > 0) return;
    eachSeat(
      s,
      () => {
        const p = s.player;
        if (!inPillar(e, p.x, p.y)) throughDash(s, () => damagePlayer(s, Math.round(p.stats.maxHp * R.ECLIPSE_PCT), "mooneater"));
      },
      !!s.party,
    );
    addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 60, maxTicks: 24, foe: true });
    e.meMoon = 0;
    e.count++;
    dropShards(s, e, spawned);
    if (h)
      for (let i = 0; i < R.CLONES; i++) {
        const c = makeEnemy(s, "lurker", e.x + (i ? 16 : -16), e.y, e.maxHp / ENEMIES.mooneater.hp, 30);
        c.noGold = true;
        spawned.push(c);
      }
    e.phase = "walk";
    e.timer = rest;
    return;
  }
  if (e.phase === "swing") {
    // 달 삼키기: 기둥 안에 아무도 없으면 기둥을 먹고 회복
    if (e.timer > 0) return;
    const at = (e.mePillars ?? []).findIndex((c) => c.x === e.auxX && c.y === e.auxY);
    const c = e.mePillars?.[at];
    let guarded = false;
    eachSeat(s, () => void (guarded ||= !!c && (c.x - s.player.x) ** 2 + (c.y - s.player.y) ** 2 <= R.PILLAR_R ** 2), true);
    if (at >= 0 && !guarded) {
      e.mePillars!.splice(at, 1);
      e.hp = Math.min(e.maxHp, e.hp + e.maxHp * R.DEVOUR_HEAL * ((e.moon ?? 0) > 0 ? R.DEVOUR_MOON : 1));
      addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 20, maxTicks: 16, foe: true });
    }
    e.phase = "walk";
    e.timer = rest;
    return;
  }
  if (e.phase === "volley" && moonfallTick(s, e)) return;
  if ((e.phase === "summon" || e.phase === "charge" || e.phase === "volley") && e.timer <= 0) {
    e.phase = "walk";
    e.timer = rest;
  }
}

function nearestPillar(e: EnemyState): { x: number; y: number } | undefined {
  let best: { x: number; y: number } | undefined;
  let bd = Infinity;
  for (const c of e.mePillars ?? []) {
    const d = (c.x - e.x) ** 2 + (c.y - e.y) ** 2;
    if (d < bd) [best, bd] = [c, d];
  }
  return best;
}

/** 그림자 손: 사람 자리 + 둘레 (시드로 흩어짐) · 맞으면 속박 (foeStatus) */
function hands(s: RunState, e: EnemyState, h: boolean): void {
  const rng = createRng(deriveSeed(s.seed, "meHand", e.id, e.count));
  const n = h ? R.HANDS_HALF : R.HANDS;
  const dmg = Math.round(hitDamage(s) * R.HAND_MUL);
  eachSeat(
    s,
    () => {
      const p = s.player;
      for (let i = 0; i < n; i++) {
        const x = i === 0 ? p.x : p.x + rng.int(-R.HAND_SPREAD, R.HAND_SPREAD);
        const y = i === 0 ? p.y : p.y + rng.int(-R.HAND_SPREAD, R.HAND_SPREAD);
        addShape(s, R.HAND_WARN + i * 3, { x, y, radius: R.HAND_R, damage: dmg, by: "mooneater", fx: "shadowHand" });
      }
    },
    true,
  );
}
