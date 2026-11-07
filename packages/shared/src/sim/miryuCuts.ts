// 미류 베기 하나하나 (sim/miryu가 부름): 1타 물결 가르기 · 2타 역류 베기 (반대쪽에서 휩쓺) · 3타 해룡 일섬 (앞으로 미끄러지며 길게) · 와류 회오리 베기
// 벨 때마다: 벤 자리에 흐르는 물길 · 닿지 않은 먼 적은 휘는 칼날이 벰 · 잠깐 적 탄을 흘려 받음 · 일섬은 모은 물방울을 물칼날로 되돌림
import { MIRYU_PERKS as K } from "../itemsMiryu";
import { MIRYU as M } from "../weaponsMiryu";
import { addStream, anchored, gain, mrHit, mrOf, rangeMul, reachOf, turn } from "./miryuKit";
import { alive, onSegment } from "./s2Kit";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, dist2, hasPerk, keepInRoom, normalize, roomGrid } from "./util";

/** 흐르는 쪽으로 실어 보냄 (보스·허수아비는 안 움직임) */
function carry(s: RunState, e: EnemyState, dx: number, dy: number, n: number): void {
  if (anchored(e) || e.hp <= 0) return;
  e.x += dx * n;
  e.y += dy * n;
  keepInRoom(e, roomGrid(s));
}

/** 휘는 칼날: 베기에 닿지 않은 먼 적을 칼날 물기운이 휘어 따라가 벰 (유엽은 이어서 셋) */
function bend(s: RunState, tipX: number, tipY: number, hit: number[], mul: number): void {
  const p = s.player;
  const st = mrOf(p);
  const horn = hasPerk(p, "mrHorn");
  let n = (st.bends ?? M.bends) + (horn ? K.mrHorn.more : 0);
  const reach = M.bendR * (st.bend ?? 1);
  const dmg = p.stats.damage * M.bendMul * mul * (horn ? K.mrHorn.mul : 1);
  let from = { x: tipX, y: tipY };
  while (n-- > 0) {
    let best: EnemyState | undefined;
    for (const e of alive(s)) {
      if (hit.includes(e.id) || dist2(e, from) > reach ** 2) continue;
      // 처음 한 번은 바라보는 쪽 반원 안에서만
      if (from.x === tipX && from.y === tipY && (e.x - p.x) * p.faceX + (e.y - p.y) * p.faceY < 0) continue;
      if (!best || dist2(e, from) < dist2(best, from)) best = e;
    }
    if (!best) return;
    hit.push(best.id);
    mrHit(s, best, dmg, from.x, from.y, 3, true);
    gain(s, M.gainBend);
    addEffect(s, { kind: "mrBend", x: from.x, y: from.y, toX: best.x, toY: best.y, dirX: p.faceX, dirY: p.faceY, size: 10, maxTicks: 16 });
    from = { x: best.x, y: best.y };
  }
}

/** 벤 뒤 공통: 흘리기 시간 · 무형이면 걸어온 길도 물길 · 휘는 칼날 */
function after(s: RunState, tipX: number, tipY: number, hit: number[], mul: number): void {
  const p = s.player;
  p.mrGuard = Math.round(M.guardTicks * (mrOf(p).guard ?? 1));
  if (mrOf(p).miryu === "formless" && (p.mrTrail?.length ?? 0) >= 2) {
    addStream(s, [...p.mrTrail!, [p.x, p.y]]);
    p.mrTrail = [];
  }
  bend(s, tipX, tipY, hit, mul);
}

/** 1·2타 휩쓸기: k = 0 오른쪽→왼쪽, 1 왼쪽→오른쪽 (물길도 휩쓴 쪽으로 흐름) */
export function sweep(s: RunState, k: number, mul: number): void {
  const p = s.player;
  const side = k === 0 ? 1 : -1;
  const reach = reachOf(p);
  const cos = turn(1, 0, M.sweepArc)[0];
  const dmg = p.stats.damage * (M.sweepMul[k] ?? 1) * mul;
  const hit: number[] = [];
  for (const e of alive(s)) {
    const ox = e.x - p.x;
    const oy = e.y - p.y;
    const d = Math.hypot(ox, oy);
    if (d > reach + e.r || (d > e.r + p.r && (ox * p.faceX + oy * p.faceY) / d < cos)) continue;
    hit.push(e.id);
    mrHit(s, e, dmg, p.x, p.y, 0);
    // 칼끝이 지나가는 쪽(접선)으로 실어 보냄
    const tg = normalize(oy * side, -ox * side) ?? [p.faceX, p.faceY];
    carry(s, e, tg[0], tg[1], M.sweepPush);
    gain(s, M.gainHit);
  }
  const pts: [number, number][] = [];
  for (let i = 0; i <= 6; i++) {
    const [dx, dy] = turn(p.faceX, p.faceY, side * M.sweepArc * (1 - (2 * i) / 6));
    pts.push([p.x + dx * reach * 0.78, p.y + dy * reach * 0.78]);
  }
  addStream(s, pts);
  addEffect(s, { kind: "mrCut", x: p.x, y: p.y - 3, dirX: p.faceX, dirY: p.faceY, size: reach, arc: M.sweepArc, style: side, maxTicks: 18 });
  after(s, p.x + p.faceX * reach, p.y + p.faceY * reach, hit, mul);
}

/** 3타 해룡 일섬: 앞으로 미끄러지며 길게 그음 (물마루는 더 길게) */
export function flash(s: RunState, mul: number): void {
  const p = s.player;
  const ext = mrOf(p).flash ?? 1;
  const sx = p.x;
  const sy = p.y;
  const lunge = M.lunge * Math.min(ext, M.lungeMax);
  p.x += p.faceX * lunge;
  p.y += p.faceY * lunge;
  keepInRoom(p, roomGrid(s));
  const len = M.flashLen * ext * (mrOf(p).reach ?? 1) * rangeMul(p);
  const ex = sx + p.faceX * len;
  const ey = sy + p.faceY * len;
  const hit: number[] = [];
  for (const e of onSegment(s, sx, sy, ex, ey, M.flashW)) {
    hit.push(e.id);
    mrHit(s, e, p.stats.damage * M.flashMul * mul, sx, sy, 6);
    gain(s, M.gainHit);
  }
  const pts: [number, number][] = [];
  for (let i = 0; i <= 4; i++) pts.push([sx + (ex - sx) * (i / 4), sy + (ey - sy) * (i / 4)]);
  addStream(s, pts);
  addEffect(s, { kind: "mrFlash", x: sx, y: sy - 3, toX: ex, toY: ey - 3, dirX: p.faceX, dirY: p.faceY, size: M.flashW, maxTicks: 22 });
  after(s, ex, ey, hit, mul);
  loose(s);
}

/** 와류 3타 회오리 베기: 한 바퀴 돌며 베고 둥근 물길 (안으로 빨아들임) */
export function whirlCut(s: RunState, mul: number): void {
  const p = s.player;
  const r = reachOf(p) * M.whirlR;
  const hit: number[] = [];
  for (const e of alive(s)) {
    if (dist2(e, p) > (r + e.r) ** 2) continue;
    hit.push(e.id);
    mrHit(s, e, p.stats.damage * M.whirlMul * mul, p.x, p.y, 0);
    gain(s, M.gainHit);
  }
  const pts: [number, number][] = [];
  for (let i = 0; i <= 10; i++) {
    const [dx, dy] = turn(p.faceX, p.faceY, (Math.PI * 2 * i) / 10);
    pts.push([p.x + dx * r * 0.8, p.y + dy * r * 0.8]);
  }
  addStream(s, pts, [p.x, p.y]);
  addEffect(s, { kind: "mrWhirl", x: p.x, y: p.y - 3, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: 22 });
  after(s, p.x + p.faceX * r, p.y + p.faceY * r, hit, mul);
  loose(s);
}

/** 모은 물방울을 물칼날로 되돌려 보냄 (바라보는 쪽 부채꼴) */
export function loose(s: RunState): void {
  const p = s.player;
  const n = p.mrDrops ?? 0;
  if (n <= 0) return;
  const st = mrOf(p);
  const seek = st.miryu === "mirror" || hasPerk(p, "mrReturn");
  const list = (p.mrBlades ??= []);
  for (let i = 0; i < n; i++) {
    const a = n === 1 ? 0 : (i / (n - 1) - 0.5) * M.bladeSpread;
    const [dx, dy] = turn(p.faceX, p.faceY, a);
    list.push({ x: p.x + dx * 10, y: p.y + dy * 10 - 3, dx, dy, left: M.bladeRange, mul: M.bladeMul * (st.back ?? 1), hit: [], seek });
  }
  p.mrDrops = 0;
  addEffect(s, { kind: "mrLoose", x: p.x, y: p.y - 3, dirX: p.faceX, dirY: p.faceY, size: n, maxTicks: 16 });
}

/** 물방울 최대 */
export const dropMax = (p: PlayerState) => mrOf(p).drops ?? M.dropMax;
