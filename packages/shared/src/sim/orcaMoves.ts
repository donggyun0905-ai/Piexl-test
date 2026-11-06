// 오르카 기술 하나하나 (sim/orca가 부름): 물보라 잽 · 소용돌이 훅 · 물기둥 어퍼 · 상어 기공파(스스로 사냥) · 소용돌이 장판 · 범고래 돌파·큰 파도
// 공용 도우미: 권갑 종류 · 맞히기 · 해방 게이지 · 받는 피해
import { ORCA_PERKS as K } from "../itemsOrca";
import { ORCA as O, type OrcaStyle } from "../weaponsOrca";
import { damageEnemy, healPlayer } from "./combat";
import { blocksShot } from "./layout";
import { rot } from "./orbit";
import { isFree, startFree, tint, wide, zap } from "./orcaFree";
import type { OcShark } from "./orcaTypes";
import { alive, isBoss, stun } from "./s2Kit";
import { statusHit } from "./statusHit";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, dist2, hasPerk, keepInRoom, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, roomGrid, weaponOf } from "./util";

export const isOrca = (p: PlayerState) => p.characterId === "orca";
export const orcaOf = (p: PlayerState): OrcaStyle => weaponOf(p).orca ?? { orca: "tide" };
/** 움직일 수 없는 적 (보스·허수아비): 끌려오지도 밀리지도 않음 */
const anchored = (e: EnemyState) => isBoss(e) || e.kind === "dummy";

/** 해방 게이지 채우기 (가득 차는 순간 알림 효과) */
export function gain(s: RunState, n: number): void {
  const p = s.player;
  if (p.ocBreach || isFree(p)) return;
  const before = p.ocTide ?? 0;
  p.ocTide = Math.min(O.tideMax, before + n * (hasPerk(p, "ocBreath") ? K.ocBreath.gain : 1));
  if (before < O.tideMax && p.ocTide >= O.tideMax) addEffect(s, { kind: "ocReady", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 26, maxTicks: 30 });
}

/** 오르카 공격 한 번 (fx, fy에서 밀어내는 쪽 · push 밀어냄 · tide: 물빛 피해 숫자) */
export function ocHit(s: RunState, e: EnemyState, dmg: number, fx: number, fy: number, push = 0, tide = false): void {
  const [dx, dy] = normalize(e.x - fx, e.y - fy) ?? [s.player.faceX, s.player.faceY];
  if (tide) statusHit(s, e, "tide", dmg, dx, dy, false);
  else damageEnemy(s, e, dmg, dx, dy, false);
  zap(s, e, dmg);
  if (push !== 0 && !anchored(e) && e.hp > 0) {
    e.x += dx * push;
    e.y += dy * push;
    keepInRoom(e, roomGrid(s));
  }
  gain(s, O.tideHit);
}

/** 1타 물보라 잽: 앞쪽 넓은 부채꼴 */
export function spray(s: RunState, mul: number): void {
  const p = s.player;
  const up = hasPerk(p, "ocSpray");
  const reach = O.sprayReach * (up ? K.ocSpray.reach : 1) * wide(p);
  const dmg = p.stats.damage * O.sprayMul * mul * (up ? K.ocSpray.mul : 1);
  for (const e of alive(s)) {
    const ox = e.x - p.x;
    const oy = e.y - p.y;
    const d = Math.hypot(ox, oy);
    if (d > reach + e.r || (d > e.r + p.r && (ox * p.faceX + oy * p.faceY) / d < O.sprayArc)) continue;
    ocHit(s, e, dmg, p.x, p.y, O.sprayPush);
  }
  addEffect(s, { kind: "ocSpray", x: p.x, y: p.y - 3, dirX: p.faceX, dirY: p.faceY, size: reach, maxTicks: 18, ...tint(s) });
}

/** 2타 소용돌이 훅: 나를 둘러싼 물회오리가 적을 끌어당김 */
export function whirl(s: RunState, mul: number): void {
  const p = s.player;
  const st = orcaOf(p);
  const up = hasPerk(p, "ocUndertow");
  const r = O.whirlR * (st.whirl ?? 1) * (up ? K.ocUndertow.r : 1) * wide(p);
  const pull = O.whirlPull * (st.pull ?? 1) * (up ? K.ocUndertow.pull : 1);
  for (const e of alive(s)) {
    if (dist2(e, p) > (r + e.r) ** 2) continue;
    const d = Math.sqrt(dist2(e, p));
    ocHit(s, e, p.stats.damage * O.whirlMul * mul, p.x, p.y, -Math.min(pull, Math.max(0, d - p.r - e.r - 2)));
  }
  addEffect(s, { kind: "ocWhirl", x: p.x, y: p.y - 3, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: 20, ...tint(s) });
}

/** 물기둥 하나 (x, y): 띄워 올림(기절) */
export function geyserAt(s: RunState, x: number, y: number, r: number, dmg: number): void {
  for (const e of alive(s)) {
    if (dist2(e, { x, y }) > (r + e.r) ** 2) continue;
    ocHit(s, e, dmg, x, y, 0, true);
    stun(e, O.geyserStun);
  }
  addEffect(s, { kind: "ocGeyser", x, y, dirX: 0, dirY: -1, size: r, maxTicks: 26, ...tint(s) });
}

/** 3타 물기둥 어퍼: 바라보는 쪽 앞에 물기둥 (간헐천은 셋 줄지어) */
export function geysers(s: RunState, mul: number): void {
  const p = s.player;
  const n = orcaOf(p).geysers ?? 1;
  const g = roomGrid(s);
  for (let i = 0; i < n; i++) {
    const at = (O.geyserAt + i * O.geyserGap) * wide(p);
    const x = p.x + p.faceX * at;
    const y = p.y + p.faceY * at;
    if (i > 0 && g !== null && blocksShot(g, x, y)) break;
    geyserAt(s, x, y, O.geyserR * wide(p), p.stats.damage * O.geyserMul * mul);
  }
}

/** 4타 상어 기공파: 바라보는 쪽으로 (범고래 무리는 셋으로 갈라짐) */
export function sharkWave(s: RunState, mul: number): void {
  const p = s.player;
  const st = orcaOf(p);
  const n = st.sharks ?? 1;
  const big = (st.shark ?? 1) > 1;
  const size = (big ? 1.7 : n > 1 ? 0.8 : 1) * wide(p);
  const hunts = Math.max(1, O.hunts + (st.hunts ?? 0) + (hasPerk(p, "ocFin") ? K.ocFin.hunts : 0));
  const list = (p.ocSharks ??= []);
  for (let i = 0; i < n; i++) {
    const [c, sn] = rot((i - (n - 1) / 2) * O.podSpread);
    const dx = p.faceX * c - p.faceY * sn;
    const dy = p.faceX * sn + p.faceY * c;
    list.push({ x: p.x + dx * 10, y: p.y + dy * 10 - 3, dx, dy, t: O.sharkLife, left: hunts, bit: [], size, mul: (st.shark ?? 1) * mul });
  }
}

/** 상어가 터짐: 둘레 물보라 피해 (반향정위: 넓게 + 물기둥 · 대소용돌이: 장판) */
function burst(s: RunState, k: OcShark): void {
  const p = s.player;
  const echo = hasPerk(p, "ocEcho");
  const r = O.burstR * k.size * (echo ? K.ocEcho.r : 1);
  for (const e of alive(s)) if (dist2(e, k) <= (r + e.r) ** 2) ocHit(s, e, p.stats.damage * O.burstMul * k.mul, k.x, k.y, 8, true);
  if (echo) geyserAt(s, k.x, k.y, O.geyserR, p.stats.damage * O.geyserMul * 0.6 * k.mul);
  if (orcaOf(p).pool) (p.ocPools ??= []).push({ x: k.x, y: k.y, t: O.poolTicks });
  addEffect(s, { kind: "ocBurst", x: k.x, y: k.y, dirX: k.dx, dirY: k.dy, size: r, maxTicks: 22, ...tint(s) });
}

/** 가장 가까운 아직 안 문 적 (찾는 거리 안) */
function nearestPrey(s: RunState, k: OcShark): EnemyState | undefined {
  let best: EnemyState | undefined;
  for (const e of alive(s)) {
    if (k.bit.includes(e.id) || dist2(e, k) > O.huntR ** 2) continue;
    if (!best || dist2(e, k) < dist2(best, k)) best = e;
  }
  return best;
}

/** 상어 한 마리 한 틱: 먹잇감 쪽으로 꺾어 헤엄 → 닿으면 물어뜯고 다음 먹잇감 · 다 물거나 벽·시간 끝이면 터짐. 끝나면 false */
function sharkStep(s: RunState, k: OcShark): boolean {
  const p = s.player;
  const prey = (k.prey !== undefined ? s.enemies.find((e) => e.id === k.prey && e.hp > 0) : undefined) ?? nearestPrey(s, k);
  k.prey = prey?.id;
  if (prey) {
    const to = normalize(prey.x - k.x, prey.y - k.y);
    const nd = to && normalize(k.dx + to[0] * O.turn * 2, k.dy + to[1] * O.turn * 2);
    if (nd) [k.dx, k.dy] = nd;
  }
  k.x += k.dx * O.sharkSpeed;
  k.y += k.dy * O.sharkSpeed;
  const reach = O.sharkR * k.size;
  for (const e of alive(s)) {
    if (k.bit.includes(e.id) || dist2(e, k) > (reach + e.r) ** 2) continue;
    k.bit.push(e.id);
    ocHit(s, e, p.stats.damage * O.biteMul * k.mul, k.x - k.dx * 6, k.y - k.dy * 6, 10, true);
    gain(s, O.tideBite);
    if (hasPerk(p, "ocFrenzy")) k.mul *= 1 + K.ocFrenzy.up;
    addEffect(s, { kind: "ocBite", x: e.x, y: e.y, dirX: k.dx, dirY: k.dy, size: reach + 6, maxTicks: 16, ...tint(s) });
    k.prey = undefined;
    if (--k.left <= 0) break;
  }
  const g = roomGrid(s);
  const wall = k.x < ROOM_MIN_X || k.x > ROOM_MAX_X || k.y < ROOM_MIN_Y || k.y > ROOM_MAX_Y || (g !== null && blocksShot(g, k.x, k.y));
  if (k.left <= 0 || wall || --k.t <= 0) {
    burst(s, k);
    return false;
  }
  return true;
}

/** 틱마다: 상어들 · 소용돌이 장판 */
export function sharksTick(s: RunState): void {
  const p = s.player;
  if (p.ocSharks) {
    p.ocSharks = p.ocSharks.filter((k) => sharkStep(s, k));
    if (p.ocSharks.length === 0) delete p.ocSharks;
  }
  if (!p.ocPools) return;
  for (const w of p.ocPools) {
    w.t--;
    for (const e of alive(s)) {
      if (dist2(e, w) > (O.poolR + e.r) ** 2) continue;
      if (w.t % O.poolEvery === 0) ocHit(s, e, p.stats.damage * O.poolMul, w.x, w.y, 0, true);
      const to = normalize(w.x - e.x, w.y - e.y);
      if (to && !anchored(e) && dist2(e, w) > 16) {
        e.x += to[0] * O.poolPull;
        e.y += to[1] * O.poolPull;
      }
    }
  }
  p.ocPools = p.ocPools.filter((w) => w.t > 0);
  if (p.ocPools.length === 0) delete p.ocPools;
}

/** 해방: 범고래 돌파 시작 (대시 방향으로) */
export function startBreach(s: RunState): void {
  const p = s.player;
  const [dx, dy] = normalize(p.dashDirX, p.dashDirY) ?? [p.faceX, p.faceY];
  p.dashTicks = 0;
  p.ocTide = 0;
  p.ocBreach = { dx, dy, t: O.breachTicks, hit: [] };
  addEffect(s, { kind: "ocBreach", x: p.x, y: p.y, dirX: dx, dirY: dy, size: 30, maxTicks: O.breachTicks + 6 });
}

/** 범고래 돌파 한 틱: 앞으로 뚫고 나가며 부딪힌 적을 양옆으로 · 끝나면 큰 파도. 끝나면 false */
export function breachTick(s: RunState): boolean {
  const p = s.player;
  const b = p.ocBreach;
  if (!b) return false;
  p.invulnTicks = Math.max(p.invulnTicks, 3);
  const ox = p.x;
  const oy = p.y;
  p.x += b.dx * O.breachStep;
  p.y += b.dy * O.breachStep;
  keepInRoom(p, roomGrid(s));
  p.faceX = b.dx;
  p.faceY = b.dy;
  for (const e of alive(s)) {
    if (b.hit.includes(e.id) || dist2(e, p) > (p.r + e.r + 12) ** 2) continue;
    b.hit.push(e.id);
    // 옆으로 갈라 밀어냄 (물살이 갈라지듯)
    const side = (e.x - p.x) * -b.dy + (e.y - p.y) * b.dx >= 0 ? 1 : -1;
    damageEnemy(s, e, p.stats.damage * O.breachMul, -b.dy * side, b.dx * side, false);
    if (!anchored(e) && e.hp > 0) {
      e.x += -b.dy * side * O.breachPush;
      e.y += b.dx * side * O.breachPush;
      keepInRoom(e, roomGrid(s));
    }
    stun(e, O.breachStun);
  }
  const stuck = Math.hypot(p.x - ox, p.y - oy) < O.breachStep * 0.3;
  if (--b.t > 0 && !stuck) return true;
  // 내려앉으며 큰 파도
  for (const e of alive(s)) {
    if (dist2(e, p) > (O.waveR + e.r) ** 2) continue;
    ocHit(s, e, p.stats.damage * O.waveMul, p.x, p.y, O.wavePush, true);
    stun(e, O.waveStun);
  }
  if (hasPerk(p, "ocFoam")) healPlayer(s, p.stats.maxHp * K.ocFoam.heal);
  startFree(s);
  p.ocTide = 0;
  addEffect(s, { kind: "ocWave", x: p.x, y: p.y, dirX: b.dx, dirY: b.dy, size: O.waveR, maxTicks: 34 });
  delete p.ocBreach;
  return false;
}

/** 바닷바람 · 해방 중 (classTaken) */
export const orcaTaken = (p: PlayerState) => (hasPerk(p, "ocSeaWind") ? K.ocSeaWind.taken : 1) * (isFree(p) ? O.freeTaken : 1);
