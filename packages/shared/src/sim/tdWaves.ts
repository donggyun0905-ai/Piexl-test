// 타워 디펜스 적: 라운드마다 나올 적 목록 · 길 따라 걷기 · 적·보스마다 기술 · 빠져나가기
import { TILE_SIZE } from "../constants";
import { BOSS_TIERS, ENEMIES, LAST_BOSSES, type EnemyKind } from "../content";
import { createRng, deriveSeed } from "../rng";
import { TD_BOSSES, TD_RULES, TD_WAVES, tdHpMul, tdUnit } from "../tdDefs";
import { TD_MAPS } from "../tdMaps";
import { tileCenter } from "./tdTowers";
import type { TdSpawn, TdState } from "./tdTypes";
import type { EnemyState } from "./types";
import { addEffect, dist2, hasPerk, makeEnemy } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 묶여 있을 수 있는 최대 틱 (넘으면 잠깐 기절·속박·도망이 듣지 않음): 일반 · 보스 · 풀린 뒤 면역 */
  HOLD_MAX: 90,
  HOLD_MAX_BOSS: 40,
  HOLD_FREE: 120,
};
export { R as TD_WAVES_RULES };

/** 길 하나: 꺾이는 점(픽셀)과 처음부터 그 점까지 거리 */
interface PathLine {
  pts: [number, number][];
  cum: number[];
  len: number;
}

const pathCache = new Map<string, PathLine[]>();
export function mapPaths(mapId: string): PathLine[] {
  let list = pathCache.get(mapId);
  if (list) return list;
  const def = TD_MAPS.find((m) => m.id === mapId) ?? TD_MAPS[0]!;
  list = def.paths.map((path) => {
    const pts = path.map(([c, r]): [number, number] => [tileCenter(c), tileCenter(r)]);
    // 들어오는 곳은 지도 바깥 끝에서 시작
    const [x0, y0] = pts[0]!;
    const [x1, y1] = pts[1]!;
    pts[0] = [x0 - Math.sign(x1 - x0) * TILE_SIZE * 0.5, y0 - Math.sign(y1 - y0) * TILE_SIZE * 0.5];
    const cum = [0];
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1]! + Math.abs(pts[i]![0] - pts[i - 1]![0]) + Math.abs(pts[i]![1] - pts[i - 1]![1]));
    return { pts, cum, len: cum[cum.length - 1]! };
  });
  pathCache.set(mapId, list);
  return list;
}

/** 길에서 d만큼 간 자리와 걷는 방향 */
export function pathPoint(line: PathLine, d: number): [number, number, number, number] {
  let i = 1;
  while (i < line.pts.length - 1 && line.cum[i]! < d) i++;
  const [ax, ay] = line.pts[i - 1]!;
  const [bx, by] = line.pts[i]!;
  const seg = line.cum[i]! - line.cum[i - 1]!;
  const f = seg > 0 ? Math.min(1, Math.max(0, (d - line.cum[i - 1]!) / seg)) : 1;
  const dx = Math.sign(bx - ax);
  const dy = Math.sign(by - ay);
  return [ax + (bx - ax) * f, ay + (by - ay) * f, dx, dy];
}

/** 라운드 시작: 이번 라운드에 나올 적 목록 */
export function buildSpawns(td: TdState): TdSpawn[] {
  const wave = TD_WAVES[td.round - 1]!;
  const map = TD_MAPS.find((m) => m.id === td.mapId) ?? TD_MAPS[0]!;
  const paths = map.paths.length;
  const mul = tdHpMul(td.round) * map.hpMul;
  const list: TdSpawn[] = [];
  let k = 0;
  for (const g of wave.groups) {
    // 일반 적 수 배율 (간격은 같은 시간 안에 들어가게 줄임)
    const n = Math.max(1, Math.round(g.n * TD_RULES.minionCount));
    const gap = (g.gap * g.n) / n;
    for (let i = 0; i < n; i++) list.push({ at: Math.round(g.at + i * gap), kind: g.kind, path: k++ % paths, hpMul: mul });
  }
  if (wave.bosses) {
    const b = wave.bosses;
    shuffled(td, BOSS_TIERS[b.tier]!, "tdBoss").forEach((kind, i) => list.push({ at: b.at + i * b.gap, kind, path: i % paths, hpMul: b.hpMul * map.hpMul, boss: true }));
  }
  td.finals = wave.final ? shuffled(td, LAST_BOSSES, "tdFinal") : [];
  // 같은 틱이면 넣은 순서 (정렬이 늘 같게)
  return list.map((sp, i) => ({ sp, i })).sort((a, b) => a.sp.at - b.sp.at || a.i - b.i).map((x) => x.sp);
}

function shuffled<T>(td: TdState, list: readonly T[], tag: string): T[] {
  const out = [...list];
  const rng = createRng(deriveSeed(td.run.seed, tag, td.round));
  for (let i = out.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/** 적 하나 내보내기 (길 처음에서) */
export function spawnTd(td: TdState, kind: EnemyKind, path: number, hpMul: number, dist = 0, noGold = false, into = td.run.enemies): EnemyState {
  const s = td.run;
  const line = mapPaths(td.mapId)[path]!;
  const [x, y] = pathPoint(line, dist);
  const e = makeEnemy(s, kind, x, y, hpMul, 0);
  const boss = !!ENEMIES[kind].boss;
  // 타워 디펜스 수치 (던전 표와 따로): 체력·크기·방패·주는 돈
  const u = tdUnit(kind);
  if (u) {
    e.hp = e.maxHp = Math.max(1, Math.round(u.hp * hpMul));
    e.r = u.radius;
    e.shield = u.shield || undefined;
    e.bounty = u.gold;
  }
  e.tdPath = path;
  e.tdDist = dist;
  e.tdSide = boss ? 0 : ((e.id * 5) % 7) - 3;
  // 검은 기사는 처음부터 갑옷(방패)을 두름
  e.tdCd = kind === "knight" ? 1 : (TRAIT_GAP[kind] ?? 0);
  e.noGold = noGold;
  // 라스트 보스 궁극기(쓰러지기 전 버팀)는 쓰지 않음
  if (boss) e.ultDone = true;
  into.push(e);
  return e;
}

/** 다음 최종 보스 (태초의 빛은 어둠과 함께, 체력 반씩) */
export function spawnFinal(td: TdState): void {
  const kind = td.finals.shift();
  if (!kind) return;
  const map = TD_MAPS.find((m) => m.id === td.mapId) ?? TD_MAPS[0]!;
  const kinds: EnemyKind[] = kind === "plight" ? ["plight", "pdark"] : [kind as EnemyKind];
  kinds.forEach((k, i) => spawnTd(td, k, i % map.paths.length, map.hpMul, -i * 20));
}

export const isFinal = (e: EnemyState) => (LAST_BOSSES as readonly string[]).includes(e.kind) || e.kind === "pdark";

/** 적·보스 기술 간격 (틱) */
const TRAIT_GAP: Partial<Record<EnemyKind, number>> = {
  shaman: 180, wisp: 150, hulk: 300, centaur: 200, knight: 360, brood: 240, plant: 60, seer: 240,
  swordgod: 300, archangel: 300, dragon: 420, plight: 300, pdark: 400,
};

/** 틱마다 적이 길을 따라 걸음 (기절·둔화·위압 반영), 끝에 닿으면 목숨을 잃음 */
export function updateTdEnemies(td: TdState): void {
  const s = td.run;
  const lines = mapPaths(td.mapId);
  // 결계(음양사): 사거리 안 적이 느려짐
  const domains = td.towers.flatMap((t) => t.atk.map((a) => a.p)).filter((p) => hasPerk(p, "domain") || hasPerk(p, "warpField"));
  const sirens = s.enemies.filter((e) => e.kind === "siren");
  const spawned: EnemyState[] = [];
  const keep: EnemyState[] = [];
  for (const e of s.enemies) {
    e.prevX = e.x;
    e.prevY = e.y;
    if (e.hitFlash > 0) e.hitFlash--;
    const def = ENEMIES[e.kind];
    const boss = !!def.boss;
    let sp = tdUnit(e.kind)?.speed ?? def.speed;
    breakHold(e, boss);
    if ((e.stunTicks ?? 0) > 0) {
      e.stunTicks = (e.stunTicks ?? 0) - 1;
      sp = 0;
    } else if ((e.fearTicks ?? 0) > 0) {
      e.fearTicks = (e.fearTicks ?? 0) - 1;
      sp = boss ? 0 : -sp * 0.6;
    }
    if ((e.rootTicks ?? 0) > 0) {
      e.rootTicks = (e.rootTicks ?? 0) - 1;
      sp = 0;
    }
    if ((e.slowTicks ?? 0) > 0) sp *= boss ? 0.8 : 0.6;
    if (!boss && domains.some((p) => dist2(p, e) <= (p.stats.range + e.r) ** 2)) sp *= 0.7;
    if (!boss && sirens.some((b) => dist2(b, e) <= 48 * 48)) sp *= 1.3;
    if ((e.tdRush ?? 0) > 0) {
      e.tdRush = (e.tdRush ?? 0) - 1;
      sp *= 2.6;
    }
    if (e.kind === "reaper" && e.hp < e.maxHp * 0.5) sp *= 1.5;
    if (isFinal(e)) sp *= TD_RULES.finalSpeed;
    if (sp > 0 || (e.fearTicks ?? 0) > 0) e.tdDist = Math.max(0, (e.tdDist ?? 0) + sp);
    trait(td, e, spawned);
    const line = lines[e.tdPath ?? 0]!;
    if ((e.tdDist ?? 0) >= line.len) {
      leak(td, e);
      continue;
    }
    place(e, line);
    keep.push(e);
  }
  s.enemies = keep.concat(spawned);
}

/** 기절·속박·도망이 너무 오래 이어지면 풀어 줌 (계속 묶어 두기만 해서 라운드가 끝나지 않는 일 없게) */
function breakHold(e: EnemyState, boss: boolean): void {
  if ((e.tdFree ?? 0) > 0) {
    e.tdFree = (e.tdFree ?? 0) - 1;
    e.stunTicks = e.rootTicks = e.fearTicks = 0;
    return;
  }
  const held = (e.stunTicks ?? 0) > 0 || (e.rootTicks ?? 0) > 0 || (e.fearTicks ?? 0) > 0;
  e.tdHeld = held ? (e.tdHeld ?? 0) + 1 : Math.max(0, (e.tdHeld ?? 0) - 1);
  if (e.tdHeld > (boss ? R.HOLD_MAX_BOSS : R.HOLD_MAX)) {
    e.tdHeld = 0;
    e.tdFree = R.HOLD_FREE;
    e.stunTicks = e.rootTicks = e.fearTicks = 0;
  }
}

function place(e: EnemyState, line: PathLine): void {
  const [x, y, dx, dy] = pathPoint(line, e.tdDist ?? 0);
  const side = e.tdSide ?? 0;
  e.x = x - dy * side;
  e.y = y + dx * side;
  if (dx !== 0) e.dirX = dx;
}

function leak(td: TdState, e: EnemyState): void {
  td.leaked++;
  const cost = isFinal(e) ? td.lives : ENEMIES[e.kind].boss ? TD_RULES.leakBoss : e.kind === "golem" ? TD_RULES.leakGolem : TD_RULES.leakMinion;
  td.lives = Math.max(0, td.lives - cost);
}

/** 주변 적 체력 채우기 (비율) */
function healAround(td: TdState, e: EnemyState, radius: number, ratio: number): void {
  for (const o of td.run.enemies) {
    if (o.hp > 0 && dist2(o, e) <= radius * radius) o.hp = Math.min(o.maxHp, o.hp + o.maxHp * ratio);
  }
  addEffect(td.run, { kind: "plus", x: e.x, y: e.y, dirX: 0, dirY: 0, size: radius, maxTicks: 20 });
}

/** 가까운 타워가 잠깐 공격을 못 함 (용의 불길·어둠) */
function scorch(td: TdState, e: EnemyState, radius: number, ticks: number): void {
  for (const t of td.towers) {
    const dx = tileCenter(t.col) - e.x;
    const dy = tileCenter(t.row) - e.y;
    if (dx * dx + dy * dy <= radius * radius) t.stunTicks = Math.max(t.stunTicks, ticks);
  }
  addEffect(td.run, { kind: "ring", x: e.x, y: e.y, dirX: 0, dirY: 0, size: radius, maxTicks: 24 });
}

function blink(td: TdState, e: EnemyState, by: number): void {
  addEffect(td.run, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r * 2, maxTicks: 12 });
  e.tdDist = (e.tdDist ?? 0) + by;
}

/** 적·보스마다 기술 (기술 대기 tdCd가 0이 될 때마다) */
function trait(td: TdState, e: EnemyState, spawned: EnemyState[]): void {
  if (e.kind === "swordgod" && e.immune && (e.tdCd ?? 0) < TRAIT_GAP.swordgod! - 60) e.immune = false;
  const gap = TRAIT_GAP[e.kind];
  if (!gap || (e.stunTicks ?? 0) > 0 || --e.tdCd! > 0) return;
  e.tdCd = gap;
  switch (e.kind) {
    case "shaman":
      return healAround(td, e, 40, 0.15);
    case "archangel": {
      healAround(td, e, 60, 0.06);
      spawnTd(td, "paladin", e.tdPath ?? 0, e.maxHp / TD_BOSSES.archangel.hp / 6, Math.max(0, (e.tdDist ?? 0) - 12), true, spawned);
      return;
    }
    case "wisp":
      return blink(td, e, 40);
    case "seer":
    case "plight":
      return blink(td, e, 48);
    case "hulk":
    case "centaur":
      e.tdRush = 40;
      return;
    case "knight":
      e.shield = 5;
      return;
    case "plant":
      e.hp = Math.min(e.maxHp, e.hp + e.maxHp * 0.01);
      return;
    case "swordgod":
      e.immune = true;
      return;
    case "dragon":
      return scorch(td, e, 56, 120);
    case "pdark":
      return scorch(td, e, 48, 90);
    case "brood":
      for (let i = 0; i < 2; i++) {
        spawnTd(td, "slime", e.tdPath ?? 0, e.maxHp / TD_BOSSES.brood.hp / 8, Math.max(0, (e.tdDist ?? 0) - 10 - i * 8), true, spawned);
      }
      return;
  }
}

/** 알주머니가 터지면 그 자리에서 작은 슬라임 셋 */
export function hatch(td: TdState, e: EnemyState): void {
  for (let i = 0; i < 3; i++) {
    const kid = spawnTd(td, "slime", e.tdPath ?? 0, (e.maxHp / (tdUnit("eggsac")?.hp ?? 1)) * 0.4, Math.max(0, (e.tdDist ?? 0) - i * 6));
    kid.r = 4;
  }
}
