// 레이븐 공격마다 확률로 나가는 기물 공격 8종: 폰 진군 · 나이트 도약 · 비숍 대각선 · 룩 철벽 · 퀸 칙령 · 킹 심판 · 폰의 승격 · 왕실의 합동 공세
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";
import { RV_PERKS as K } from "../itemsRaven";
import { srcRun } from "./dmgSrc";
import { hasRv, rvNearest, rvReach, rvRoll, rvStrongest } from "./rvKit";
import { rvSchedule } from "./rvStrike";
import { rvUnit } from "./rvUnits";
import type { RunState } from "./types";
import { addEffect, normalize } from "./util";

const clampX = (x: number) => Math.min(ROOM_MAX_X - 8, Math.max(ROOM_MIN_X + 8, x));
const clampY = (y: number) => Math.min(ROOM_MAX_Y - 8, Math.max(ROOM_MIN_Y + 8, y));

/** 나이트: 지금 자리에서 L자로 뛰어 (tx, ty)에 내려앉음 (그림 + 예약 내려찍기) */
function knightLeap(s: RunState, tx: number, ty: number, at: number, r: number, dmg: number, id?: number): void {
  const p = s.player;
  addEffect(s, { kind: "rvKnight", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: r, toX: tx, toY: ty, maxTicks: at });
  rvSchedule(s, { at: s.tick + at, kind: "area", x: tx, y: ty, dx: 0, dy: 0, r, dmg, id, fx: "rvKnightLand" });
}

/** 공격 하나가 끝날 때마다 */
export function rvProcs(s: RunState): void {
  const p = s.player;
  const k = rvReach(p);
  const [dx, dy] = [p.faceX, p.faceY];
  const dmg = p.stats.damage;
  const more = hasRv(p, "rvGuard") ? K.rvGuard.add : 0;
  const roll = (id: keyof typeof K & string, c: number) => hasRv(p, id) && rvRoll(s, id) < c + more;
  if (roll("rvPawn", K.rvPawn.chance))
    srcRun(s, "rvPawn", () => {
      const R = K.rvPawn;
      const n = R.min + Math.floor(rvRoll(s, "rvPawnN") * (R.max - R.min + 1)) + (hasRv(p, "rvEnPassant") ? K.rvEnPassant.more : 0);
      // 바라보는 쪽에 가로로 한 줄 늘어서 함께 돌진
      for (let i = 0; i < n; i++) {
        const o = (i - (n - 1) / 2) * R.gap * k;
        rvUnit(s, "pawn", p.x + dx * 14 - dy * o, p.y + dy * 14 + dx * o, dx, dy, R.speed, R.ticks, R.r * k, dmg * R.mul);
      }
    });
  if (roll("rvKnight", K.rvKnight.chance))
    srcRun(s, "rvKnight", () => {
      const R = K.rvKnight;
      const e = rvNearest(s, p.x, p.y, R.dist * k, dx, dy);
      knightLeap(s, e ? e.x : clampX(p.x + dx * 100 * k), e ? e.y : clampY(p.y + dy * 100 * k), R.fly, R.r * k, dmg * R.mul, e?.id);
    });
  if (roll("rvBishop", K.rvBishop.chance))
    srcRun(s, "rvBishop", () => {
      const R = K.rvBishop;
      addEffect(s, { kind: "rvBeam", x: p.x, y: p.y, dirX: dx, dirY: dy, size: R.len * k, width: R.w * k, maxTicks: R.delay + 18 });
      rvSchedule(s, { at: s.tick + R.delay, kind: "beam", x: p.x, y: p.y, dx, dy, r: R.w * k, dmg: dmg * R.mul });
    });
  if (roll("rvRook", K.rvRook.chance))
    srcRun(s, "rvRook", () => {
      const R = K.rvRook;
      rvUnit(s, "rook", p.x + dx * 16, p.y + dy * 16, dx, dy, R.speed, R.ticks, R.r * k, dmg * R.mul);
    });
  if (roll("rvQueen", K.rvQueen.chance))
    srcRun(s, "rvQueen", () => {
      const R = K.rvQueen;
      addEffect(s, { kind: "rvDecree", x: p.x, y: p.y - 10, dirX: 0, dirY: 0, size: 30, maxTicks: R.delay + 14 });
      rvSchedule(s, { at: s.tick + R.delay, kind: "decree", x: p.x, y: p.y - 10, dx: 0, dy: 0, r: R.r * k, dmg: dmg * R.mul });
    });
  if (roll("rvKing", K.rvKing.chance))
    srcRun(s, "rvKing", () => {
      const R = K.rvKing;
      const e = rvStrongest(s, p.x, p.y, R.dist * k) ?? rvNearest(s, p.x, p.y, R.dist * k);
      const [x, y] = e ? [e.x, e.y] : [clampX(p.x + dx * 80 * k), clampY(p.y + dy * 80 * k)];
      addEffect(s, { kind: "rvJudge", x, y, dirX: 0, dirY: 0, size: R.r * k, maxTicks: R.fall + 18 });
      rvSchedule(s, { at: s.tick + R.fall, kind: "area", x, y, dx: 0, dy: 0, r: R.r * k, dmg: dmg * R.mul, stun: R.stun });
    });
  if (roll("rvPromote", K.rvPromote.chance))
    srcRun(s, "rvPromote", () => {
      const R = K.rvPromote;
      rvUnit(s, "promo", p.x + dx * 12, p.y + dy * 12, dx, dy, R.speed, R.ticks, 9 * k, dmg * R.mul);
    });
  if (roll("rvAssault", K.rvAssault.chance))
    srcRun(s, "rvAssault", () => {
      const R = K.rvAssault;
      const e = rvNearest(s, p.x, p.y, R.dist * k, dx, dy);
      const [tx, ty] = e ? [e.x, e.y] : [clampX(p.x + dx * 100 * k), clampY(p.y + dy * 100 * k)];
      const d = normalize(tx - p.x, ty - p.y) ?? [dx, dy];
      knightLeap(s, tx, ty, R.knightAt, R.knightR * k, dmg * R.knightMul, e?.id);
      addEffect(s, { kind: "rvBeam", x: tx, y: ty, dirX: d[0], dirY: d[1], size: K.rvBishop.len * k, width: K.rvBishop.w * k, maxTicks: R.bishopAt + 18 });
      rvSchedule(s, { at: s.tick + R.bishopAt, kind: "beam", x: tx, y: ty, dx: d[0], dy: d[1], r: K.rvBishop.w * k, dmg: dmg * R.bishopMul, id: e?.id });
      rvSchedule(s, { at: s.tick + R.rookAt, kind: "rook", x: p.x + d[0] * 16, y: p.y + d[1] * 16, dx: d[0], dy: d[1], r: 0, dmg: dmg * R.rookMul });
    });
}
