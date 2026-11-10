// 미류 흐름 (틱마다): 물길(적을 실어 나르며 벰 · 빙류는 느리게·사라질 때 얼음 · 폭포 아이템은 무너져 내림)
// 흘리기(벤 직후·대시 중 적 탄을 물방울로 받음) · 되돌린 물칼날 · 천류 해방 해룡(모든 물길을 따라 흐르고 폭포로 내리꽂힘)
import { MIRYU_PERKS as K } from "../itemsMiryu";
import { MIRYU as M } from "../weaponsMiryu";
import { healPlayer } from "./combat";
import { dropMax } from "./miryuCuts";
import { anchored, gain, mrHit, mrOf, nearStream, reachOf, turn } from "./miryuKit";
import type { MrStream } from "./miryuTypes";
import { blocksShot } from "./layout";
import { alive, stun } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, dist2, hasPerk, keepInRoom, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, roomGrid } from "./util";

/** 물길이 사라질 때: 빙류는 얼음으로 깨지고, 폭포 아이템은 무너져 내림 (적마다 한 번) */
function streamEnd(s: RunState, w: MrStream): void {
  const p = s.player;
  const frost = mrOf(p).miryu === "frost";
  const fall = hasPerk(p, "mrCascade");
  if (!frost && !fall) return;
  const mul = (frost ? M.shatterMul : 0) + (fall ? K.mrCascade.mul : 0);
  const r = Math.max(frost ? M.shatterR : 0, fall ? K.mrCascade.r : 0);
  const hit: number[] = [];
  w.pts.forEach(([x, y], i) => {
    for (const e of alive(s)) {
      if (hit.includes(e.id) || dist2(e, { x, y }) > (r + e.r) ** 2) continue;
      hit.push(e.id);
      mrHit(s, e, p.stats.damage * mul, x, y, 0, true);
    }
    if (i % 2 === 0) addEffect(s, { kind: frost ? "mrShatter" : "mrBurst", x, y, dirX: 0, dirY: -1, size: r, maxTicks: 22 });
  });
}

/** 물길 한 틱: 닿은 적을 흐르는 쪽으로 실어 나르고 (와류는 안으로) 때때로 벰 · 물길이 겹쳐도 적마다 가장 새 물길 하나만 */
function streamsTick(s: RunState): void {
  const p = s.player;
  if (!p.mrStreams) return;
  const st = mrOf(p);
  const bite = s.tick % Math.max(1, Math.round(M.streamEvery * (st.every ?? 1))) === 0;
  const push = M.carry * (st.carry ?? 1);
  for (const w of p.mrStreams) w.t--;
  for (const e of alive(s)) {
    let dir: [number, number] | null = null;
    let w: MrStream | undefined;
    for (let i = p.mrStreams.length - 1; i >= 0 && !dir; i--) {
      w = p.mrStreams[i]!;
      dir = nearStream(w, e.x, e.y, w.w + e.r);
    }
    if (!dir || !w) continue;
    if (!anchored(e)) {
      e.x += dir[0] * push;
      e.y += dir[1] * push;
      const c = w.ring;
      const to = c && normalize(c[0] - e.x, c[1] - e.y);
      if (to && dist2(e, { x: c[0], y: c[1] }) > 64) {
        e.x += to[0] * M.whirlPull;
        e.y += to[1] * M.whirlPull;
      }
      keepInRoom(e, roomGrid(s));
    }
    if (st.miryu === "frost") e.slowTicks = Math.max(e.slowTicks ?? 0, M.frostSlow);
    if (!bite) continue;
    mrHit(s, e, p.stats.damage * M.streamMul, e.x - dir[0] * 4, e.y - dir[1] * 4, 0, true);
    gain(s, M.gainStream);
  }
  for (const w of p.mrStreams) if (w.t <= 0) streamEnd(s, w);
  p.mrStreams = p.mrStreams.filter((w) => w.t > 0);
  if (p.mrStreams.length === 0) delete p.mrStreams;
}

/** 흘리기: 벤 직후엔 칼 앞쪽에서, 대시 중엔 몸 둘레에서 적 탄을 받아 물방울로 (가득이면 못 받음) */
function catchShots(s: RunState): void {
  const p = s.player;
  const guard = (p.mrGuard ?? 0) > 0;
  const dash = p.dashTicks > 0;
  if (!guard && !dash) return;
  const max = dropMax(p);
  if ((p.mrDrops ?? 0) >= max) return;
  const parry = hasPerk(p, "mrParry");
  const reach = (reachOf(p) + M.guardPad) * (parry ? K.mrParry.reach : 1);
  const body = M.dashCatch * (hasPerk(p, "mrCourse") ? K.mrCourse.catch : 1) * (parry ? K.mrParry.reach : 1);
  const per = hasPerk(p, "mrReturn") ? K.mrReturn.per : 1;
  s.projectiles = s.projectiles.filter((pr) => {
    if (pr.fromPlayer || (p.mrDrops ?? 0) >= max) return true;
    const ox = pr.x - p.x;
    const oy = pr.y - p.y;
    const d = Math.hypot(ox, oy);
    const inBlade = guard && d <= reach && (d < 10 || (ox * p.faceX + oy * p.faceY) / d >= -0.2);
    if (!inBlade && !(dash && d <= body)) return true;
    p.mrDrops = Math.min(max, (p.mrDrops ?? 0) + per);
    gain(s, M.gainCatch);
    if (parry) healPlayer(s, p.stats.maxHp * K.mrParry.heal);
    addEffect(s, { kind: "mrCatch", x: pr.x, y: pr.y, toX: p.x, toY: p.y - 4, dirX: p.faceX, dirY: p.faceY, size: 6, maxTicks: 18 });
    return false;
  });
}

/** 되돌린 물칼날: 꿰뚫고 날아감 (명경·회류는 가까운 적 쪽으로 꺾임) */
function bladesTick(s: RunState): void {
  const p = s.player;
  if (!p.mrBlades) return;
  const g = roomGrid(s);
  p.mrBlades = p.mrBlades.filter((b) => {
    if (b.seek) {
      let near: { x: number; y: number } | undefined;
      for (const e of alive(s)) if (!b.hit.includes(e.id) && dist2(e, b) < 160 ** 2 && (!near || dist2(e, b) < dist2(near, b))) near = e;
      const to = near && normalize(near.x - b.x, near.y - b.y);
      const nd = to && normalize(b.dx + to[0] * M.bladeTurn * 2, b.dy + to[1] * M.bladeTurn * 2);
      if (nd) [b.dx, b.dy] = nd;
    }
    b.x += b.dx * M.bladeSpeed;
    b.y += b.dy * M.bladeSpeed;
    b.left -= M.bladeSpeed;
    for (const e of alive(s)) {
      if (b.hit.includes(e.id) || dist2(e, b) > (M.bladeR + e.r) ** 2) continue;
      b.hit.push(e.id);
      mrHit(s, e, p.stats.damage * b.mul, b.x - b.dx * 4, b.y - b.dy * 4, 4, true);
      addEffect(s, { kind: "mrSlice", x: e.x, y: e.y, dirX: b.dx, dirY: b.dy, size: 12, maxTicks: 14 });
    }
    const wall = b.x < ROOM_MIN_X || b.x > ROOM_MAX_X || b.y < ROOM_MIN_Y || b.y > ROOM_MAX_Y || (g !== null && blocksShot(g, b.x, b.y));
    return b.left > 0 && !wall;
  });
  if (p.mrBlades.length === 0) delete p.mrBlades;
}

/** 천류 해방: 칼끝에서 해룡이 나와 새 물길부터 모든 물길을 따라 흐르고, 내 둘레를 한 바퀴 돌아 앞으로 내리꽂힘 */
export function startRelease(s: RunState): void {
  const p = s.player;
  const path: [number, number][] = [[p.x + p.faceX * 20, p.y + p.faceY * 20]];
  let len = 0;
  const push = (q: [number, number]) => {
    const last = path[path.length - 1]!;
    len += Math.hypot(q[0] - last[0], q[1] - last[1]);
    if (path.length < M.pathMax && len < M.pathLen) path.push(q);
  };
  for (const w of [...(p.mrStreams ?? [])].reverse()) {
    const last = path[path.length - 1]!;
    const pts = dist2({ x: last[0], y: last[1] }, { x: w.pts[w.pts.length - 1]![0], y: w.pts[w.pts.length - 1]![1] }) < dist2({ x: last[0], y: last[1] }, { x: w.pts[0]![0], y: w.pts[0]![1] }) ? [...w.pts].reverse() : w.pts;
    for (const q of pts) push([q[0], q[1]]);
  }
  for (let i = 1; i <= M.loopPts; i++) {
    const [dx, dy] = turn(p.faceX, p.faceY, Math.PI + (Math.PI * 2 * i) / M.loopPts);
    path.push([p.x + dx * M.loopR, p.y + dy * M.loopR]);
  }
  path.push([p.x + p.faceX * M.dive, p.y + p.faceY * M.dive]);
  const size = hasPerk(p, "mrSky") ? K.mrSky.size : 1;
  const [x, y] = path[0]!;
  p.mrDragon = { path, x, y, i: 1, dx: p.faceX, dy: p.faceY, size, hit: [], body: [] };
  p.mrFlow = 0;
  addEffect(s, { kind: "mrRelease", x: p.x, y: p.y - 4, dirX: p.faceX, dirY: p.faceY, size: 40 * size, maxTicks: 40 });
}

/** 폭포: 해룡이 내리꽂힌 자리 큰 피해·기절 · 모든 물길이 한꺼번에 솟구쳐 터짐 */
function waterfall(s: RunState, x: number, y: number): void {
  const p = s.player;
  const sky = hasPerk(p, "mrSky");
  const r = M.fallR * (sky ? K.mrSky.fall : 1);
  for (const e of alive(s)) {
    if (dist2(e, { x, y }) > (r + e.r) ** 2) continue;
    mrHit(s, e, p.stats.damage * M.fallMul * (sky ? K.mrSky.mul : 1), x, y, 14, true);
    stun(e, M.fallStun);
  }
  const hit: number[] = [];
  for (const w of p.mrStreams ?? []) {
    w.pts.forEach(([px, py], i) => {
      for (const e of alive(s)) {
        if (hit.includes(e.id) || dist2(e, { x: px, y: py }) > (w.w * 1.8 + e.r) ** 2) continue;
        hit.push(e.id);
        mrHit(s, e, p.stats.damage * M.burstMul, px, py, 0, true);
      }
      if (i % 2 === 0) addEffect(s, { kind: "mrBurst", x: px, y: py, dirX: 0, dirY: -1, size: w.w * 1.8, maxTicks: 24 });
    });
  }
  delete p.mrStreams;
  addEffect(s, { kind: "mrFall", x, y, dirX: 0, dirY: 1, size: r, maxTicks: 40 });
}

/** 해룡 한 틱: 길을 따라 흐르며 닿은 적을 옆으로 가르며 벰 · 길 끝이면 폭포 */
function dragonTick(s: RunState): void {
  const p = s.player;
  const d = p.mrDragon;
  if (!d) return;
  let step = M.dragonSpeed;
  while (step > 0 && d.i < d.path.length) {
    const [tx, ty] = d.path[d.i]!;
    const dd = Math.hypot(tx - d.x, ty - d.y);
    if (dd <= step) {
      d.x = tx;
      d.y = ty;
      step -= dd;
      d.i++;
      continue;
    }
    const n = normalize(tx - d.x, ty - d.y);
    if (n) [d.dx, d.dy] = n;
    d.x += d.dx * step;
    d.y += d.dy * step;
    step = 0;
  }
  d.body.unshift([d.x, d.y]);
  if (d.body.length > 16) d.body.pop();
  d.hit = d.hit.filter(([, t]) => t > s.tick);
  const mul = M.dragonMul * (hasPerk(p, "mrSky") ? K.mrSky.mul : 1);
  for (const e of alive(s)) {
    if (d.hit.some(([id]) => id === e.id) || dist2(e, d) > (M.dragonR * d.size + e.r) ** 2) continue;
    d.hit.push([e.id, s.tick + M.dragonRehit]);
    mrHit(s, e, p.stats.damage * mul, d.x, d.y, 0, true);
    if (!anchored(e) && e.hp > 0) {
      const side = (e.x - d.x) * -d.dy + (e.y - d.y) * d.dx >= 0 ? 1 : -1;
      e.x += -d.dy * side * M.dragonPush;
      e.y += d.dx * side * M.dragonPush;
      keepInRoom(e, roomGrid(s));
    }
  }
  if (d.i < d.path.length) return;
  waterfall(s, d.x, d.y);
  delete p.mrDragon;
}

/** 틱마다: 물길 · 흘리기 · 물칼날 · 해룡 */
export function flowTick(s: RunState): void {
  const p = s.player;
  if (p.mrGuard) p.mrGuard--;
  streamsTick(s);
  catchShots(s);
  bladesTick(s);
  dragonTick(s);
}
