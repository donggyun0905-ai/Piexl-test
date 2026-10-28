// 학살자 대낫 기술 하나하나 (콤보 차례·체력·흡혈은 sim/slayer)
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";
import { SLAYER_PERKS as K } from "../itemsSlayer";
import { PW } from "../paewangDefs";
import { SLAYER as S, type ScytheMove } from "../weaponsSlayer";
import { nearest } from "./brawlMoves";
import { inCircle, inCone, inLine, isBoss, onSegment, shoot, startRush } from "./s2Kit";
import type { EffectKind } from "./fxTypes";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, hasPerk, keepInRoom, normalize, roomGrid } from "./util";

/** 맞힘 (흡혈·게이지는 부르는 쪽에서) */
export type Hit = (e: EnemyState, dmg: number, push?: number) => void;

const hound = (p: PlayerState) => (hasPerk(p, "slHound") ? K.slHound.mul : 1);

/** 검기·대낫 날리기: 바라보는 쪽(a만큼 돌림)으로, 옆으로 off만큼 비켜서 */
function blade(s: RunState, a: number, off: number, dmg: number, spirit: "slBlade" | "slThrow", pierce: number): void {
  const p = s.player;
  const mul = hasPerk(p, "slCrimson") ? K.slCrimson.mul : 1;
  shoot(s, a, { damage: dmg * mul, spirit, r: spirit === "slThrow" ? 7 : 6, pierce, range: S.bladeRange, speed: spirit === "slThrow" ? 3.6 : 3.8 });
  const pr = s.projectiles[s.projectiles.length - 1]!;
  const len = Math.hypot(pr.vx, pr.vy) || 1;
  pr.x += (-pr.vy / len) * off;
  pr.y += (pr.vx / len) * off;
  pr.prevX = pr.x;
  pr.prevY = pr.y;
}

const fx = (s: RunState, kind: EffectKind, x: number, y: number, size: number, extra: { toX?: number; toY?: number; width?: number } = {}) =>
  addEffect(s, { kind, x, y, dirX: s.player.faceX, dirY: s.player.faceY, size, maxTicks: kind === "slLine" || kind === "slSky" ? 18 : 14, ...extra });

/** 바라보는 쪽 베기 (reach · 부채꼴 · 자국 방향) */
function swing(s: RunState, hit: Hit, d: number, reach: number, arc: number, side: number, push = 4, delay = 0): void {
  const p = s.player;
  for (const e of inCone(s, reach, arc)) hit(e, d, push);
  fx(s, "slSlash", p.x, p.y, reach, { toX: side, width: delay });
}

/** 가장 가까운 적 쪽을 바라봄 (없으면 그대로) */
function faceTo(p: PlayerState, e: EnemyState | null): void {
  const d = e ? normalize(e.x - p.x, e.y - p.y) : null;
  if (!d) return;
  p.faceX = d[0];
  p.faceY = d[1];
}

/** 순간 이동 (자국 남김) */
function blink(s: RunState, x: number, y: number): void {
  const p = s.player;
  const ox = p.x;
  const oy = p.y;
  p.x = x;
  p.y = y;
  keepInRoom(p, roomGrid(s));
  fx(s, "slRaid", ox, oy, 6, { toX: p.x, toY: p.y });
}

/** 기술 하나 (n: 콤보 몇 번째) */
export function scytheMove(s: RunState, move: ScytheMove, dmg: number, hit: Hit, n: number): void {
  const p = s.player;
  // 패왕전: 평타가 화면을 덮지 않게 크기를 줄임
  const r = p.stats.range * (s.pvp ? PW.bigBasic : 1);
  const d = dmg * S.mul[move];
  switch (move) {
    case "slash3":
      // 낫 베기 3연속 (자국은 번갈아, 조금씩 늦게)
      for (let i = 0; i < 3; i++) swing(s, hit, d, r, S.arc, (n + i) % 2, 3, i * S.flurryGap);
      return;
    case "raid": {
      // 급습: 적 앞까지 순식간에 날아들어 전면 베기
      const e = nearest(s, r * S.raidMul * hound(p));
      faceTo(p, e);
      const gap = e ? e.r + p.r + 4 : 0;
      if (e) blink(s, e.x - p.faceX * gap, e.y - p.faceY * gap);
      else blink(s, p.x + p.faceX * r * hound(p), p.y + p.faceY * r * hound(p));
      swing(s, hit, d, r * 1.1, -0.1, n % 2, 6);
      return;
    }
    case "wave3":
      // 강하게 베고 부채꼴로 긴 검기 셋
      swing(s, hit, d, r * 1.1, S.arc, n % 2, 6);
      for (const a of [-0.28, 0, 0.28]) blade(s, a, 0, d * 0.8, "slBlade", 6);
      return;
    case "grand":
      // 더욱 강하게: 범위 +30%로 크게
      for (const e of inCone(s, r * 1.3, -0.3)) hit(e, d, 10);
      fx(s, "slGrand", p.x, p.y, r * 1.3, { toX: n % 2 });
      return;
    case "spin":
      for (const e of inCircle(s, p.x, p.y, r)) hit(e, d, 6);
      fx(s, "slSpin", p.x, p.y, r);
      return;
    case "diamond":
      for (const [a, off] of [[0, 0], [0.18, 8], [-0.18, -8], [0, 0]] as const) blade(s, a, off, d, "slBlade", 3);
      swing(s, hit, d * 0.5, r * 0.8, S.arc, n % 2);
      return;
    case "chop": {
      const x = p.x + p.faceX * r * 0.55;
      const y = p.y + p.faceY * r * 0.55;
      for (const e of inCircle(s, x, y, r * 0.55)) hit(e, d, 8);
      fx(s, "slChop", x, y, r * 0.55);
      return;
    }
    case "throw":
      blade(s, 0, 0, d, "slThrow", 99);
      return;
    case "rush":
      startRush(p, { t: 7, dx: p.faceX, dy: p.faceY, step: (r * 1.2 * hound(p)) / 7, dmg: d, push: 6, invuln: true, tint: "#c81e2a" });
      return;
    case "burst": {
      const len = r * S.burstLen;
      for (const e of inLine(s, len, S.burstW)) hit(e, d, 10);
      fx(s, "slBurst", p.x, p.y, S.burstW, { toX: p.x + p.faceX * len, toY: p.y + p.faceY * len });
      return;
    }
    case "backstep":
      blink(s, p.x - p.faceX * S.dash * hound(p), p.y - p.faceY * S.dash * hound(p));
      for (const a of [-0.12, 0.12]) blade(s, a, 0, d * 0.8, "slBlade", 4);
      swing(s, hit, d, r, S.arc, n % 2);
      return;
    case "crossX": {
      const e = nearest(s, r * 1.6);
      const x = e ? e.x : p.x + p.faceX * r * 0.7;
      const y = e ? e.y : p.y + p.faceY * r * 0.7;
      const k = r * 0.6;
      const got = new Set<EnemyState>();
      for (const [ax, ay, bx, by] of [[x - k, y - k, x + k, y + k], [x + k, y - k, x - k, y + k]] as const) for (const o of onSegment(s, ax, ay, bx, by, 8)) got.add(o);
      for (const o of got) hit(o, d, 4);
      fx(s, "slX", x, y, k);
      return;
    }
    case "bloodNova":
      // 사방으로 피의 검기 여덟 + 둘레 베기
      for (let i = 0; i < 8; i++) blade(s, (i / 8) * Math.PI * 2, 0, d * 0.7, "slBlade", 3);
      for (const e of inCircle(s, p.x, p.y, r * 0.8)) hit(e, d, 8);
      fx(s, "slNova", p.x, p.y, r);
      return;
    case "reap":
      // 둘레 적을 끌어당겨 한 번에 벰 (보스는 안 끌림)
      for (const e of inCircle(s, p.x, p.y, r * 1.8)) {
        if (isBoss(e)) continue;
        e.x += (p.x - e.x) * 0.7;
        e.y += (p.y - e.y) * 0.7;
      }
      for (const e of inCircle(s, p.x, p.y, r)) hit(e, d, 2);
      fx(s, "slReap", p.x, p.y, r * 1.8);
      return;
    case "skyfall": {
      // 뛰어올라 적 자리로 내려찍기
      const e = nearest(s, r * 2 * hound(p));
      const x = e ? e.x - p.faceX * 4 : p.x + p.faceX * r;
      const y = e ? e.y - p.faceY * 4 : p.y + p.faceY * r;
      blink(s, x, y);
      for (const o of inCircle(s, p.x, p.y, r * 0.9)) hit(o, d, 12);
      fx(s, "slSky", p.x, p.y, r * 0.9);
      return;
    }
    case "line": {
      // 방 끝에서 끝까지 한 줄
      const span = Math.hypot(ROOM_MAX_X - ROOM_MIN_X, ROOM_MAX_Y - ROOM_MIN_Y);
      const ax = p.x - p.faceX * span;
      const ay = p.y - p.faceY * span;
      const bx = p.x + p.faceX * span;
      const by = p.y + p.faceY * span;
      for (const e of onSegment(s, ax, ay, bx, by, S.lineW)) hit(e, d);
      fx(s, "slLine", ax, ay, S.lineW, { toX: bx, toY: by });
      return;
    }
  }
}
