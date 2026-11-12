// 빙설 날아가는 것: 얼음 칼날(던지기 무기) · 얼음 창(머리 위에서 기다렸다 날아감) · 화살 · 유도 얼음(가까운 적을 쫓아 터짐) · 급속 얼음(관통) · 눈덩이(터짐)
import { srcCb } from "./dmgSrc";
import { BINGSEOL_PERKS as K } from "../itemsBingseol";
import type { BsShot } from "./bsTypes";
import { iceHit } from "./bsHit";
import { alive, nearestFoe } from "./shadowingSpirits";
import type { RunState } from "./types";
import { addEffect, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

type P = RunState["player"];

/** 한 번에 있는 가장 많은 수 */
const MAX = 80;

export function pushShot(p: P, sh: BsShot): void {
  const list = (p.bsShots ??= []);
  if (list.length >= MAX) list.shift();
  list.push(sh);
}

/** 둘레 적 모두 (눈덩이·유도 얼음 터짐) */
export function burst(s: RunState, x: number, y: number, r: number, dmg: number): void {
  for (const e of s.enemies) {
    if (!alive(e) || (e.x - x) ** 2 + (e.y - y) ** 2 > (r + e.r) ** 2) continue;
    const d = normalize(e.x - x, e.y - y) ?? [0, 0];
    iceHit(s, e, dmg, d[0], d[1]);
  }
  addEffect(s, { kind: "bsBurst", x, y, dirX: 0, dirY: 0, size: r, maxTicks: 18 });
}

/** 틱마다: 모두 나아가며 닿은 적을 때림 */
export function shotsTick(s: RunState): void {
  const p = s.player;
  if (p.bsShots?.length) p.bsShots = p.bsShots.filter(srcCb((sh) => step(s, sh)));
}

/** 끝날 때 터지는 것 (유도 얼음·눈덩이) */
const bursts = (sh: BsShot) => sh.kind === 3 || sh.kind === 5;

function step(s: RunState, sh: BsShot): boolean {
  const p = s.player;
  sh.age++;
  if (sh.age <= 0) {
    // 얼음 창: 나가기 전에는 머리 위에서 몸을 따라감 · 나가는 순간 바라보는 쪽으로
    if (sh.kind === 1) {
      sh.x = p.x + (sh.ox ?? 0);
      sh.y = p.y + (sh.oy ?? 0);
      if (sh.age === 0) {
        sh.dx = p.faceX;
        sh.dy = p.faceY;
      }
    }
    return true;
  }
  if (sh.kind === 3) {
    // 유도 얼음: 가까운 적 쪽으로 방향을 틂
    const t = nearestFoe(s, sh.x, sh.y);
    if (t && (t.x - sh.x) ** 2 + (t.y - sh.y) ** 2 <= K.bsHoming.dist ** 2) {
      const d = normalize(t.x - sh.x, t.y - sh.y) ?? [sh.dx, sh.dy];
      const n = normalize(sh.dx * 0.7 + d[0] * 0.3, sh.dy * 0.7 + d[1] * 0.3) ?? d;
      sh.dx = n[0];
      sh.dy = n[1];
    }
  }
  sh.x += sh.dx * sh.speed;
  sh.y += sh.dy * sh.speed;
  // 눈덩이는 날아가는 동안 작게, 터질 때 r
  const hitR = sh.kind === 5 ? 5 : sh.r;
  for (const e of s.enemies) {
    if (!alive(e) || sh.hit.includes(e.id) || (e.x - sh.x) ** 2 + (e.y - sh.y) ** 2 > (hitR + e.r) ** 2) continue;
    if (bursts(sh)) {
      burst(s, sh.x, sh.y, sh.kind === 3 ? K.bsHoming.r : sh.r, sh.dmg);
      return false;
    }
    sh.hit.push(e.id);
    iceHit(s, e, sh.dmg, sh.dx, sh.dy);
    if (sh.pierce <= 0) return false;
    sh.pierce--;
  }
  const out = sh.x < ROOM_MIN_X - 20 || sh.x > ROOM_MAX_X + 20 || sh.y < ROOM_MIN_Y - 20 || sh.y > ROOM_MAX_Y + 20;
  if (sh.age >= sh.life || out) {
    if (bursts(sh) && !out) burst(s, sh.x, sh.y, sh.kind === 3 ? K.bsHoming.r : sh.r, sh.dmg);
    return false;
  }
  return true;
}
