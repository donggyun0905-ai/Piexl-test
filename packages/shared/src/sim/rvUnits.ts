// 레이븐 움직이는 기물(폰·룩·검격·승격 폰·금빛 폰)과 예약 공격(범위·빛기둥·대각선·룩 돌진·칙령·십자) 틱마다
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";
import { RV_PERKS as K } from "../itemsRaven";
import { srcEach, srcRun } from "./dmgSrc";
import { rot } from "./orbit";
import { hasRv, rvAlive, rvNearest, rvReach } from "./rvKit";
import { rvArea, rvBoss, rvHit, rvLine } from "./rvStrike";
import type { RvEvent, RvUnit, RvUnitKind } from "./rvTypes";
import type { RunState } from "./types";
import { addEffect, keepInRoom, normalize, roomGrid } from "./util";

/** 기물 하나 내보내기 */
export function rvUnit(s: RunState, kind: RvUnitKind, x: number, y: number, dx: number, dy: number, spd: number, t: number, r: number, dmg: number): void {
  (s.player.rvUnits ??= []).push({ kind, x, y, prevX: x, prevY: y, dx, dy, spd, t, age: 0, r, dmg, hit: [] });
}

/** 폰 피해 배율 (앙파상) */
const pawnMul = (s: RunState) => (hasRv(s.player, "rvEnPassant") ? K.rvEnPassant.mul : 1);
const isPawn = (k: RvUnitKind) => k === "pawn" || k === "promo" || k === "gold";

/** 승격 폰이 퀸으로 바뀌며 폭발 */
function promote(s: RunState, u: RvUnit): void {
  const r = K.rvPromote.r * rvReach(s.player);
  rvArea(s, u.x, u.y, r, u.dmg, { knock: true });
  addEffect(s, { kind: "rvPromo", x: u.x, y: u.y, dirX: 0, dirY: 0, size: r, maxTicks: 26 });
}

/** 기물 움직임: 곧게(승격·금빛 폰은 가까운 적을 쫓음) · 닿은 적 한 번씩 · 룩은 적을 밀고 감 */
function unitsTick(s: RunState): void {
  const p = s.player;
  const g = roomGrid(s);
  const keep: RvUnit[] = [];
  for (const u of srcEach(p.rvUnits ?? [])) {
    u.prevX = u.x;
    u.prevY = u.y;
    u.age++;
    if (u.kind === "promo" || u.kind === "gold") {
      const e = rvNearest(s, u.x, u.y, 260, 0, 0);
      const d = e ? normalize(e.x - u.x, e.y - u.y) : null;
      if (d) [u.dx, u.dy] = normalize(u.dx + d[0] * 0.2, u.dy + d[1] * 0.2) ?? [u.dx, u.dy];
    }
    u.x += u.dx * u.spd;
    u.y += u.dy * u.spd;
    const out = u.x < ROOM_MIN_X || u.x > ROOM_MAX_X || u.y < ROOM_MIN_Y || u.y > ROOM_MAX_Y;
    let done = --u.t <= 0 || out;
    for (const e of s.enemies) {
      if (!rvAlive(e) || (e.x - u.x) ** 2 + (e.y - u.y) ** 2 > (u.r + e.r) ** 2) continue;
      if (u.kind === "rook" && !rvBoss(e)) {
        // 성벽이 밀고 감 (보스는 안 밀림)
        e.x += u.dx * u.spd;
        e.y += u.dy * u.spd;
        keepInRoom(e, g);
      }
      if (u.hit.includes(e.id)) continue;
      if (u.kind === "promo") {
        done = true;
        break;
      }
      u.hit.push(e.id);
      const stun = isPawn(u.kind) && hasRv(p, "rvEnPassant") ? K.rvEnPassant.stun : 0;
      rvHit(s, e, u.dmg * (isPawn(u.kind) ? pawnMul(s) : 1), { knock: u.kind === "rook", stun });
      if (u.kind !== "rook") addEffect(s, { kind: "rvPawnHit", x: e.x, y: e.y, dirX: u.dx, dirY: u.dy, size: u.r, style: u.kind === "blade" ? 1 : 0, maxTicks: 10 });
      if (u.kind === "gold") done = true;
    }
    if (done) {
      if (u.kind === "promo") promote(s, u);
      continue;
    }
    keep.push(u);
  }
  p.rvUnits = keep;
}

/** 예약 공격 하나 */
function fire(s: RunState, v: RvEvent): void {
  const p = s.player;
  const k = rvReach(p);
  const e = v.id !== undefined ? s.enemies.find((x) => x.id === v.id && rvAlive(x)) : undefined;
  const [x, y] = e ? [e.x, e.y] : [v.x, v.y];
  if (v.fx) addEffect(s, { kind: v.fx as never, x, y, dirX: v.dx, dirY: v.dy, size: v.r, style: v.style, maxTicks: v.kind === "pillar" ? 20 : v.kind === "cross" ? 44 : 22 });
  if (v.kind === "area") rvArea(s, x, y, v.r, v.dmg, { stun: v.stun, knock: true });
  else if (v.kind === "pillar") rvArea(s, x, y, v.r, v.dmg, { pop: true });
  else if (v.kind === "beam") {
    // 비숍: 바라보는 쪽에서 ±45° 두 대각선이 몸(x,y)을 꿰뚫어 양쪽으로 뻗음
    const len = K.rvBishop.len * k;
    for (const sgn of [1, -1]) {
      const [dx, dy] = normalize(v.dx - sgn * v.dy, v.dy + sgn * v.dx) ?? [1, 0];
      rvLine(s, x - dx * len, y - dy * len, dx, dy, len * 2, v.r, v.dmg);
    }
  } else if (v.kind === "rook") {
    const R = K.rvRook;
    rvUnit(s, "rook", x, y, v.dx, v.dy, R.speed, R.ticks, R.r * k, v.dmg);
  } else if (v.kind === "decree") {
    // 퀸 칙령: 8방향 검격
    const Q = K.rvQueen;
    for (let i = 0; i < 8; i++) {
      const d = rot((i * Math.PI) / 4);
      rvUnit(s, "blade", x, y, d[0], d[1], Q.speed, Q.ticks, Q.r * k, v.dmg);
    }
  } else if (v.kind === "cross") {
    // 그랜드 십자: 가로·세로로 방 끝까지 (가운데 적도 한 번만)
    for (const o of s.enemies) if (rvAlive(o) && (Math.abs(o.y - y) <= v.r + o.r || Math.abs(o.x - x) <= v.r + o.r)) rvHit(s, o, v.dmg, { knock: true });
  }
}

/** 틱마다: 기물 · 예약 공격 */
export function rvUnitsTick(s: RunState): void {
  const p = s.player;
  if (p.rvEvents?.length) {
    const now = p.rvEvents.filter((v) => v.at <= s.tick);
    p.rvEvents = p.rvEvents.filter((v) => v.at > s.tick);
    // 만든 패시브를 출처로 (새로 생기는 룩·검격에도 그 출처가 달림)
    for (const v of now) {
      const id = (v as { dsrc?: string }).dsrc;
      if (id) srcRun(s, id, () => fire(s, v));
      else fire(s, v);
    }
  }
  if (p.rvUnits?.length) unitsTick(s);
}
