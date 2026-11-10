// 시즌 3 라스트 보스 레비아탄: 페이즈 1 심해룡 (방 위쪽 가운데, 물속 방 · 숨 10초 · 몬스터를 잡으면 비눗방울)
// 기본 공격 휩쓸기 · 물기둥(기절·감속) · 물감옥(숨 2배로 닳음, 깨고 나옴) + 토네이도(피해 없이 떠밈) · 유령선 선장(좌우 번갈아) · 거대 물구슬(대시 박자)
// 흰 막대(용 체력)를 다 깎으면 가라앉고 수면 위로 → 페이즈 2 심연고래 (sim/bossLevWhale) → 페이즈 3 해왕 (sim/bossLevKing)
// 그 뒤 레비아탄은 보이지 않는 지휘자 (체력 = 고래 + 해왕 남은 체력)
import { ROOM_CX } from "../constants";
import { ENEMIES } from "../content";
import { createRng, deriveSeed } from "../rng";
import { hitDamage } from "./bossKit";
import { addShape } from "./hazards";
import { airTick, dive, foeTick, prisonTick, setWater, startPrison, tornTick } from "./levKit";
import type { EnemyState, RunState } from "./types";
import { addEffect, DIR16, makeEnemy, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 심해룡 체력 (흰 막대, 레비아탄 배율을 곱함) · 고래 · 해왕 체력은 적 수치 levwhale·levking (합 9600 = 멸망의 용) */
  DRAGON: 3500,
  /** 기본 공격 사이 틱 (용 체력 40% 아래면 GAP_FAST) */
  GAP: 80,
  GAP_FAST: 62,
  /** 휩쓸기: 예고 · 반경 · 부채꼴 (cos, -0.2 ≒ 200°) · 피해 배율 */
  SWEEP_WARN: 42,
  SWEEP_R: 130,
  SWEEP_ARC: -0.2,
  SWEEP_MUL: 1,
  /** 물기둥 (기절 0.8초 + 감속): 수 · 예고 · 반경 · 내 둘레 퍼짐 · 피해 배율 */
  PILLARS: 4,
  PILLAR_WARN: 48,
  PILLAR_R: 18,
  PILLAR_SPREAD: 50,
  PILLAR_MUL: 0.75,
  /** 거대 물구슬: 처음 · 그 뒤 간격 · 커지는 틱 · 떨어지는 수 · 낙하 예고(박자) · 마지막 예고 · 낙하 사이 · 반경 · 피해 배율 */
  ORB_FIRST: 900,
  ORB_EVERY: 2100,
  ORB_GROW: 120,
  DROPS: 4,
  DROP_WARN: 60,
  DROP_LAST: 42,
  DROP_GAP: 70,
  DROP_R: 46,
  DROP_MUL: 1.6,
  /** 모습이 바뀌는 틱 (가라앉음 → 수면 위 · 물이 빠짐 → 해왕이 내려섬) */
  SHIFT: 150,
};
export { R as BOSS_LEVIATHAN_RULES };

type Vec = readonly [number, number];
/** 기본 공격 차례: 휩쓸기 · 물기둥 · 휩쓸기 · 물감옥 · 물기둥 */
const ORDER = [0, 1, 0, 2, 1];

/** 남은 용 체력 비율 */
export const dragonLeft = (e: EnemyState) => (e.ward ?? 0) / Math.max(1, Math.round(R.DRAGON * mulOf(e)));
/** 레비아탄 체력 배율 (층·인원) */
export const mulOf = (e: EnemyState) => e.maxHp / ENEMIES.leviathan.hp;
export const levPose = (s: RunState, e: EnemyState, f: number, ticks: number) => {
  e.lhPose = f;
  e.lhPoseEnd = s.tick + ticks;
};

export function updateLeviathan(s: RunState, e: EnemyState, _toP: Vec, _go: Vec, spawned: EnemyState[]): void {
  e.stunTicks = 0;
  if (e.lhForm === undefined) {
    e.lhForm = 1;
    e.ward = Math.round(R.DRAGON * mulOf(e));
    dive(e, 600);
    setWater(s, true);
    e.lhNextOrb = s.tick + R.ORB_FIRST;
    e.lhNextTorn = s.tick + 120;
    e.timer = 90;
  }
  if ((e.lhPoseEnd ?? 0) <= s.tick) e.lhPose = 0;
  airTick(s, e);
  prisonTick(s, e, spawned);
  if (e.lhForm !== 1) return director(s, e, spawned);
  e.x = e.prevX = ROOM_CX;
  e.y = e.prevY = ROOM_MIN_Y + 50;
  // 용 체력(흰 막대)만 깎임
  e.hp = e.maxHp;
  if (e.lhShift !== undefined) return sinkTick(s, e, spawned);
  if ((e.ward ?? 0) <= 0) return sink(s, e);
  tornTick(s, e, 360);
  foeTick(s, e, spawned);
  orbTick(s, e);
  if (e.lhOrb !== undefined || e.timer > 0) return;
  const left = dragonLeft(e);
  const k = ORDER[e.count % ORDER.length]!;
  e.count++;
  e.timer = left < 0.4 ? R.GAP_FAST : R.GAP;
  const p = s.player;
  const dmg = hitDamage(s);
  if (k === 0) {
    // 휩쓸기: 꼬리 물살이 넓은 부채꼴
    const d = Math.hypot(p.x - e.x, p.y - e.y) || 1;
    addShape(s, R.SWEEP_WARN, { x: e.x, y: e.y, radius: R.SWEEP_R, damage: dmg * R.SWEEP_MUL, dirX: (p.x - e.x) / d, dirY: (p.y - e.y) / d, arc: R.SWEEP_ARC, fx: "bslash", from: "levsweep" });
    levPose(s, e, 1, 50);
  } else if (k === 1) {
    pillars(s, e, R.PILLARS);
    levPose(s, e, 2, 50);
  } else {
    startPrison(s, e);
    levPose(s, e, 2, 60);
  }
}

/** 물기둥: 내 자리 + 둘레 (맞으면 기절·감속, foeStatus) */
export function pillars(s: RunState, e: EnemyState, n: number): void {
  const rng = createRng(deriveSeed(s.seed, "levPillar", e.id, s.tick));
  const p = s.player;
  for (let i = 0; i < n; i++) {
    const v = DIR16[rng.int(0, 15)]!;
    const k = i === 0 ? 0 : rng.int(16, R.PILLAR_SPREAD);
    const x = Math.max(ROOM_MIN_X + 8, Math.min(ROOM_MAX_X - 8, p.x + v[0] * k));
    const y = Math.max(ROOM_MIN_Y + 8, Math.min(ROOM_MAX_Y - 8, p.y + v[1] * k));
    addShape(s, R.PILLAR_WARN + i * 4, { x, y, radius: R.PILLAR_R, damage: hitDamage(s) * R.PILLAR_MUL, by: "leviathan", fx: "pillar", from: "levpillar" });
  }
}

/** 거대 물구슬: 용 체력 70%·40%에서 한 번씩, 그 뒤 ORB_EVERY마다 → 커짐 → 내 자리에 4번 떨어짐 (큰 원이라 걸어서는 못 빠짐, 대시 박자) */
function orbTick(s: RunState, e: EnemyState): void {
  const left = dragonLeft(e);
  const n = e.lhOrbs ?? 0;
  if (e.lhOrb === undefined && ((n === 0 && left < 0.7) || (n === 1 && left < 0.4) || s.tick >= (e.lhNextOrb ?? Infinity))) {
    e.lhOrb = s.tick;
    e.lhOrbs = n + 1;
    e.lhDrops = R.DROPS;
    e.lhDropAt = s.tick + R.ORB_GROW;
    e.lhNextOrb = s.tick + R.ORB_EVERY;
    levPose(s, e, 4, R.ORB_GROW + R.DROP_GAP * R.DROPS);
  }
  if (e.lhOrb === undefined || s.tick < (e.lhDropAt ?? 0)) return;
  const last = e.lhDrops === 1;
  addShape(s, last ? R.DROP_LAST : R.DROP_WARN, { x: s.player.x, y: s.player.y, radius: R.DROP_R, damage: hitDamage(s) * R.DROP_MUL, cue: true, fx: "meteor", from: "levorb" });
  e.lhDrops = (e.lhDrops ?? 1) - 1;
  e.lhDropAt = s.tick + R.DROP_GAP;
  if (e.lhDrops <= 0) {
    e.lhOrb = undefined;
    e.timer = R.DROP_WARN + 30;
  }
}

/** 용 체력 0: 가라앉기 시작 (탄·위험·토네이도가 사라지고 몬스터도 물러감) */
function sink(s: RunState, e: EnemyState): void {
  e.lhShift = s.tick;
  e.immune = true;
  s.hazards = [];
  s.projectiles = s.projectiles.filter((p) => p.fromPlayer);
  e.lhTorn = [];
  e.lhOrb = e.lhPrisonAt = undefined;
  for (const o of s.enemies)
    if (o !== e && (!ENEMIES[o.kind].boss || o.lhGhost)) {
      o.noGold = true;
      o.hp = 0;
    }
  addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 60, maxTicks: 30 });
  levPose(s, e, 0, R.SHIFT);
}

/** 가라앉는 중 → 수면 위로 (숨 막대 사라짐) → 고래 */
function sinkTick(s: RunState, e: EnemyState, spawned: EnemyState[]): void {
  if (s.tick - e.lhShift! < R.SHIFT) return;
  e.lhShift = undefined;
  e.lhWet = false;
  e.lhForm = 2;
  e.air = true;
  const w = makeEnemy(s, "levwhale", ROOM_CX, (ROOM_MIN_Y + ROOM_MAX_Y) / 2, mulOf(e), 120);
  spawned.push(w);
}

/** 페이즈 2·3 지휘자: 체력 = 고래 + 해왕 남은 체력 · 고래가 쓰러지면 물이 빠지고 해왕이 내려섬 */
function director(s: RunState, e: EnemyState, spawned: EnemyState[]): void {
  e.immune = true;
  e.air = true;
  tornTick(s, e, 0);
  const mul = mulOf(e);
  const whale = s.enemies.find((o) => o.kind === "levwhale" && o.hp > 0);
  const king = s.enemies.find((o) => o.kind === "levking" && o.hp > 0);
  if (e.lhForm === 2) {
    if (whale) {
      e.hp = Math.max(1, whale.hp + Math.round(ENEMIES.levking.hp * mul));
      return;
    }
    // 고래가 흩어짐 → 물이 빠짐 → 해왕
    e.lhShift ??= s.tick;
    e.hp = Math.round(ENEMIES.levking.hp * mul);
    if (s.tick - e.lhShift === 1) {
      setWater(s, false);
      s.hazards = [];
      s.projectiles = s.projectiles.filter((p) => p.fromPlayer);
    }
    if (s.tick - e.lhShift < R.SHIFT) return;
    e.lhShift = undefined;
    e.lhForm = 3;
    const k = makeEnemy(s, "levking", ROOM_CX, ROOM_MIN_Y + 60, mul, 90);
    spawned.push(k);
    addEffect(s, { kind: "burst", x: k.x, y: k.y, dirX: 0, dirY: 0, size: 40, maxTicks: 30 });
    return;
  }
  if (!king) {
    e.immune = false;
    e.hp = 0;
    return;
  }
  e.hp = Math.max(1, king.hp);
}
